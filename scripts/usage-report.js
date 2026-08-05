#!/usr/bin/env node
// Cruza el tráfico real (de pago) de los Workers con el gasto de los
// proveedores, para responder a una sola pregunta: "¿el consumo que veo en
// OpenAI / Anthropic / Deepgram se corresponde con peticiones que yo he hecho?"
//
// Uso:
//   node scripts/usage-report.js              # últimas 24 h
//   node scripts/usage-report.js --days 30    # ventana de Analytics Engine
//   node scripts/usage-report.js --json       # salida cruda, para pipes
//
// Env:
//   CF_API_TOKEN    obligatorio — token con permiso de lectura de KV
//                   y de Account Analytics
//   CF_ACCOUNT_ID   obligatorio
//   RATE_KV_ID      opcional — id del namespace physiq-rate (hay default)
//
// ─────────────────────────────────────────────────────────────────────────────
// QUÉ MIDE Y QUÉ NO
//
// Hay dos fuentes, y dicen cosas distintas:
//
//   · ANALYTICS ENGINE (dataset `physiq_usage`) — una fila por petición, con el
//     Worker, la ruta, el modo con el que se resolvió y el desenlace. Es el
//     reparto demo/real EXACTO, y con historial de semanas. Requiere que los dos
//     Workers estén desplegados con el binding `AE`.
//   · CONTADOR KV (`physiq-rate`) — se escribe en `rateLimited()` y SOLO en modo
//     real: una petición demo nunca llega a esa línea. Es la cifra que hace de
//     tope de presupuesto, y sirve para contrastar la anterior.
//
// Si en un proveedor aparece gasto y aquí las peticiones de pago son 0, ese
// gasto no vino de los Workers de PhysiQ.
//
// Tres límites que conviene tener presentes al leer la salida:
//
//   1. EL CONTADOR KV VIVE 25 HORAS. Se escribe con `expirationTtl: 90000`, así
//      que solo existen las claves de hoy y parte de ayer. El historial largo
//      sale de Analytics Engine, no de aquí.
//   2. NAMESPACE KV COMPARTIDO. Los dos Workers usan el mismo `physiq-rate` y el
//      mismo formato de clave, así que esos contadores están sumados: no se
//      puede saber cuántas fueron del copiloto y cuántas del informe. Analytics
//      Engine sí los separa (blob1).
//   3. UNA PETICIÓN ≠ UN COSTE FIJO. `/transcribe` factura por minuto conectado
//      y `/chat` por tokens. El desglose por ruta ayuda, pero ninguna de las dos
//      fuentes dice cuánto costó: dicen qué trabajo de pago hubo.
//
// El desglose por proveedor no se consulta por API a propósito: OpenAI,
// Anthropic y Deepgram no exponen un endpoint de gasto estable y público que
// se pueda dejar escrito aquí sin riesgo de que quede obsoleto en silencio.
// El script imprime los enlaces de cada panel y la cifra con la que compararlos.

'use strict';

const CF_API = 'https://api.cloudflare.com/client/v4';
const DEFAULT_RATE_KV = '462ecd5f583149038885748a134200a5'; // physiq-rate
const AE_DATASET = 'physiq_usage';

const args   = process.argv.slice(2);
const asJson = args.includes('--json');
const days   = args.includes('--days')
  ? Math.max(1, parseInt(args[args.indexOf('--days') + 1], 10) || 1)
  : 1;

const TOKEN   = process.env.CF_API_TOKEN;
const ACCOUNT = process.env.CF_ACCOUNT_ID;
const KV_ID   = process.env.RATE_KV_ID || DEFAULT_RATE_KV;

if (!TOKEN || !ACCOUNT) {
  console.error('Faltan CF_API_TOKEN y/o CF_ACCOUNT_ID.\n');
  console.error('Crea el token en https://dash.cloudflare.com/profile/api-tokens');
  console.error('con permisos:  Account → Workers KV Storage → Read');
  console.error('               Account → Account Analytics → Read   (solo si usas --graphql)');
  process.exit(1);
}

const auth = { Authorization: `Bearer ${TOKEN}` };

async function cf(path, init = {}) {
  const res  = await fetch(`${CF_API}${path}`, { ...init, headers: { ...auth, ...init.headers } });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { return { raw: text, status: res.status }; }
  if (!res.ok || body.success === false) {
    const msg = (body.errors || []).map(e => `${e.code} ${e.message}`).join('; ') || res.status;
    throw new Error(`Cloudflare ${path} → ${msg}`);
  }
  return body;
}

// ── KV: contadores de modo real ──────────────────────────────────────────────

async function listKeys(prefix) {
  const keys = [];
  let cursor = '';
  do {
    const qs   = new URLSearchParams({ prefix, limit: '1000' });
    if (cursor) qs.set('cursor', cursor);
    const body = await cf(`/accounts/${ACCOUNT}/storage/kv/namespaces/${KV_ID}/keys?${qs}`);
    keys.push(...(body.result || []));
    cursor = (body.result_info && body.result_info.cursor) || '';
  } while (cursor);
  return keys;
}

async function readKey(name) {
  const res = await fetch(
    `${CF_API}/accounts/${ACCOUNT}/storage/kv/namespaces/${KV_ID}/values/${encodeURIComponent(name)}`,
    { headers: auth },
  );
  if (!res.ok) return null;
  return (await res.text()).trim();
}

// `rl:<YYYY-MM-DD>:<actor>` — actor es `lic:<hash>` o `ip:<direccion>`.
function parseKey(name) {
  const m = name.match(/^rl:(\d{4}-\d{2}-\d{2}):(.+)$/);
  return m ? { day: m[1], actor: m[2] } : null;
}

async function realCounters() {
  const keys = await listKeys('rl:');
  const rows = [];
  for (const k of keys) {
    const parsed = parseKey(k.name);
    if (!parsed) continue;
    const value = await readKey(k.name);
    rows.push({ ...parsed, count: parseInt(value || '0', 10) });
  }
  rows.sort((a, b) => b.day.localeCompare(a.day) || b.count - a.count);
  return rows;
}

// ── Analytics Engine: el reparto demo/real, exacto ───────────────────────────
//
// Los Workers escriben una fila por petición (`track()` en physiq-copilot.js y
// physiq-orchestrator.js):
//
//   blob1 worker ('copilot' | 'report')   blob2 ruta
//   blob3 modo   ('real' | 'demo')        blob4 desenlace
//   blob5 identidad ('lic' | 'anon')
//
// `_sample_interval` es el factor de muestreo que aplica Analytics Engine
// cuando el volumen crece: sumarlo (en vez de contar filas) devuelve el número
// real de peticiones. Con el tráfico de este proyecto vale 1 casi siempre, pero
// SUM(_sample_interval) es correcto en ambos casos y COUNT(*) no.

async function usageSplit(days) {
  const sql = `
    SELECT blob1 AS worker, blob3 AS mode, blob2 AS path, blob4 AS outcome,
           SUM(_sample_interval) AS n
    FROM ${AE_DATASET}
    WHERE timestamp > NOW() - INTERVAL '${days}' DAY
    GROUP BY blob1, blob2, blob3, blob4
    ORDER BY n DESC`;

  const res  = await fetch(`${CF_API}/accounts/${ACCOUNT}/analytics_engine/sql`, {
    method: 'POST', headers: auth, body: sql,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} — ${text.slice(0, 300)}`);

  let body;
  try { body = JSON.parse(text); }
  catch { throw new Error(`respuesta no-JSON: ${text.slice(0, 300)}`); }

  return (body.data || []).map(r => ({
    worker:  r.worker,
    mode:    r.mode,
    path:    r.path,
    outcome: r.outcome,
    n:       Number(r.n) || 0,
  }));
}

// ── Salida ───────────────────────────────────────────────────────────────────

const PROVIDERS = [
  ['OpenAI',    'embeddings (RAG) + Whisper', 'https://platform.openai.com/usage'],
  ['Anthropic', '/suggest, /chat, /notes, informes', 'https://console.anthropic.com/settings/usage'],
  ['Deepgram',  '/transcribe (factura por minuto conectado)', 'https://console.deepgram.com/usage'],
  ['Resend',    '/email (envío de informes)', 'https://resend.com/emails'],
];

function pad(s, n) { return String(s).padEnd(n); }

function section(title) { console.log(`\n─── ${title} ───\n`); }

async function main() {
  const counters = await realCounters();
  const split    = await usageSplit(days).catch(e => ({ _error: e.message }));

  if (asJson) {
    console.log(JSON.stringify({ window: `${days}d`, counters, split }, null, 2));
    return;
  }

  console.log(`\n═══ PhysiQ — uso de los Workers (últimos ${days === 1 ? 'día' : `${days} días`}) ═══`);

  // ── 1. El reparto exacto ───────────────────────────────────────────────────
  section('Demo vs. real (Analytics Engine)');

  if (split._error) {
    console.log(`  No se pudo consultar el dataset ${AE_DATASET}: ${split._error}\n`);
    console.log('  Causas habituales: el token no tiene Account Analytics → Read, o los');
    console.log('  Workers aún no se han desplegado con el binding AE (no hay datos');
    console.log('  anteriores al despliegue: Analytics Engine no rellena hacia atrás).\n');
  } else if (!split.length) {
    console.log('  Sin filas en la ventana. O no ha habido tráfico, o los Workers');
    console.log('  todavía no escriben en el dataset.\n');
  } else {
    const byMode   = {};
    const byWorker = {};
    for (const r of split) {
      byMode[r.mode]     = (byMode[r.mode] || 0) + r.n;
      const wk           = `${r.worker}/${r.mode}`;
      byWorker[wk]       = (byWorker[wk] || 0) + r.n;
    }
    const total = Object.values(byMode).reduce((a, b) => a + b, 0);
    const pct   = n => `${((n / total) * 100).toFixed(1)}%`;

    for (const mode of ['demo', 'real']) {
      const n = byMode[mode] || 0;
      console.log(`  ${pad(mode, 10)}${pad(n, 10)}${pct(n)}`);
    }
    console.log(`  ${pad('TOTAL', 10)}${total}\n`);

    console.log(`  ${pad('Worker / modo', 26)}Peticiones`);
    console.log(`  ${'-'.repeat(40)}`);
    for (const [wk, n] of Object.entries(byWorker).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${pad(wk, 26)}${n}`);
    }

    const paid = split.filter(r => r.mode === 'real' && r.outcome === 'served' && r.path !== '/validate');
    if (paid.length) {
      console.log(`\n  Rutas de pago servidas (las que generan gasto):`);
      console.log(`  ${'-'.repeat(40)}`);
      for (const r of paid.sort((a, b) => b.n - a.n)) {
        console.log(`  ${pad(`${r.worker} ${r.path}`, 26)}${r.n}`);
      }
    } else {
      console.log('\n  Ninguna ruta de pago servida en la ventana.');
    }

    const blocked = split.filter(r => r.outcome !== 'served');
    if (blocked.length) {
      console.log(`\n  Bloqueadas (no llegaron a gastar):`);
      for (const r of blocked.sort((a, b) => b.n - a.n)) {
        console.log(`  ${pad(`${r.worker} ${r.path}`, 26)}${pad(r.outcome, 14)}${r.n}`);
      }
    }
    console.log();
  }

  // ── 2. El contador de presupuesto ──────────────────────────────────────────
  const byDay = {};
  for (const r of counters) byDay[r.day] = (byDay[r.day] || 0) + r.count;
  const grand = Object.values(byDay).reduce((a, b) => a + b, 0);

  section('Contador de presupuesto (KV physiq-rate, últimas ~25 h)');
  console.log('  Solo se escribe en modo real. Es el que dispara DAILY_CAP.\n');

  if (!counters.length) {
    console.log('  Sin contadores. En las últimas ~25 h no ha habido NINGUNA');
    console.log('  petición en modo real a ninguno de los dos Workers.');
    console.log('  → Cualquier gasto en los proveedores en esa ventana no viene de aquí.\n');
  } else {
    console.log(`  ${pad('Día', 12)}${pad('Actor', 26)}Peticiones de pago`);
    console.log(`  ${'-'.repeat(58)}`);
    for (const r of counters) console.log(`  ${pad(r.day, 12)}${pad(r.actor, 26)}${r.count}`);
    console.log(`  ${'-'.repeat(58)}`);
    for (const [day, n] of Object.entries(byDay).sort().reverse()) {
      console.log(`  ${pad(day, 38)}${n}`);
    }
    console.log(`\n  TOTAL en la ventana: ${grand} peticiones de pago`);
    console.log('  (suma de los dos Workers — comparten namespace, no se pueden separar)\n');
  }

  // ── 3. Cruce con los proveedores ───────────────────────────────────────────
  section('Contrastar con el gasto de cada proveedor');
  for (const [name, what, url] of PROVIDERS) {
    console.log(`  ${pad(name, 12)}${what}`);
    console.log(`  ${' '.repeat(12)}${url}\n`);
  }

  console.log('  Lectura: si las peticiones de pago de arriba son 0 (o muy pocas) y en');
  console.log('  algún panel aparece consumo en esas mismas horas, el gasto no viene de');
  console.log('  los Workers de PhysiQ. Revisa entonces si alguna clave de API está');
  console.log('  usada fuera de aquí, y rota la que corresponda.\n');

  if (!split._error && split.length) {
    const realN = split.filter(r => r.mode === 'real').reduce((a, r) => a + r.n, 0);
    if (realN === 0) {
      console.log('  En esta ventana TODO el tráfico fue demo: coste de proveedores 0.\n');
    }
  }
}

main().catch(err => { console.error(`\n✗ ${err.message}\n`); process.exit(1); });
