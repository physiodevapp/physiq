#!/usr/bin/env node
// Cruza el tráfico real (de pago) de los Workers con el gasto de los
// proveedores, para responder a una sola pregunta: "¿el consumo que veo en
// OpenAI / Anthropic / Deepgram se corresponde con peticiones que yo he hecho?"
//
// Uso:
//   node scripts/usage-report.js              # informe de contadores
//   node scripts/usage-report.js --graphql    # + peticiones totales (Cloudflare)
//   node scripts/usage-report.js --json       # salida cruda, para pipes
//
// Env:
//   CF_API_TOKEN    obligatorio — token con permiso de lectura de KV
//                   (y de Account Analytics si se usa --graphql)
//   CF_ACCOUNT_ID   obligatorio
//   RATE_KV_ID      opcional — id del namespace physiq-rate (hay default)
//
// ─────────────────────────────────────────────────────────────────────────────
// QUÉ MIDE Y QUÉ NO
//
// La señal fuerte es el contador diario del KV `physiq-rate`. Se escribe en
// `rateLimited()` (physiq-copilot.js / physiq-orchestrator.js) y SOLO en modo
// real: una petición demo nunca llega a esa línea. Por tanto:
//
//     peticiones de pago = suma de los contadores `rl:<fecha>:<actor>`
//
// Si en un proveedor aparece gasto y aquí el total del día es 0, ese gasto no
// vino de los Workers de PhysiQ (o alguien tiene una licencia válida).
//
// Tres límites que conviene tener presentes al leer la salida:
//
//   1. VENTANA DE 25 HORAS. Las claves se escriben con `expirationTtl: 90000`,
//      así que solo existen las de hoy y parte de ayer. Esto NO sirve para
//      cuadrar una factura mensual a posteriori: hay que ejecutarlo a diario
//      (ver "Historial" al final de la salida).
//   2. NAMESPACE COMPARTIDO. Los dos Workers usan el mismo `physiq-rate` y el
//      mismo formato de clave, así que los contadores están sumados: no se
//      puede saber cuántas fueron del copiloto y cuántas del informe.
//   3. UNA PETICIÓN ≠ UN COSTE FIJO. `/transcribe` factura por minuto conectado
//      y `/chat` por tokens. El contador dice "hubo trabajo de pago", no cuánto.
//
// El desglose por proveedor no se consulta por API a propósito: OpenAI,
// Anthropic y Deepgram no exponen un endpoint de gasto estable y público que
// se pueda dejar escrito aquí sin riesgo de que quede obsoleto en silencio.
// El script imprime los enlaces de cada panel y la cifra con la que compararlos.

'use strict';

const CF_API = 'https://api.cloudflare.com/client/v4';
const DEFAULT_RATE_KV = '462ecd5f583149038885748a134200a5'; // physiq-rate
const SCRIPTS = ['physiq-copilot', 'physiq-orchestrator'];

const args    = process.argv.slice(2);
const asJson  = args.includes('--json');
const doGraph = args.includes('--graphql');

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

// ── Cloudflare GraphQL: peticiones totales (demo + real) ─────────────────────
//
// Opcional y detrás de --graphql a propósito. El dataset de Workers es
// `workersInvocationsAdaptive`; si Cloudflare cambia el esquema, esta consulta
// fallará y el script imprime el error tal cual en vez de inventarse un número.
// Los totales del panel de cada Worker son la fuente equivalente y siempre fiable.

const GQL = `
query PhysiqWorkerRequests($accountTag: string!, $start: Time!, $end: Time!) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      workersInvocationsAdaptive(
        limit: 1000
        filter: { datetime_geq: $start, datetime_leq: $end }
      ) {
        sum { requests errors }
        dimensions { scriptName }
      }
    }
  }
}`;

async function totalRequests(hours = 24) {
  const end   = new Date();
  const start = new Date(end.getTime() - hours * 3600 * 1000);
  const res   = await fetch(`${CF_API}/graphql`, {
    method:  'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      query: GQL,
      variables: { accountTag: ACCOUNT, start: start.toISOString(), end: end.toISOString() },
    }),
  });
  const body = await res.json();
  if (body.errors) throw new Error(body.errors.map(e => e.message).join('; '));

  const nodes = body.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];
  const byScript = {};
  for (const n of nodes) {
    const name = n.dimensions?.scriptName;
    if (!SCRIPTS.includes(name)) continue;
    byScript[name] = (byScript[name] || 0) + (n.sum?.requests || 0);
  }
  return byScript;
}

// ── Salida ───────────────────────────────────────────────────────────────────

const PROVIDERS = [
  ['OpenAI',    'embeddings (RAG) + Whisper', 'https://platform.openai.com/usage'],
  ['Anthropic', '/suggest, /chat, /notes, informes', 'https://console.anthropic.com/settings/usage'],
  ['Deepgram',  '/transcribe (factura por minuto conectado)', 'https://console.deepgram.com/usage'],
  ['Resend',    '/email (envío de informes)', 'https://resend.com/emails'],
];

function pad(s, n) { return String(s).padEnd(n); }

async function main() {
  const counters = await realCounters();
  const totals   = doGraph ? await totalRequests().catch(e => ({ _error: e.message })) : null;

  if (asJson) {
    console.log(JSON.stringify({ counters, totals }, null, 2));
    return;
  }

  const byDay = {};
  for (const r of counters) byDay[r.day] = (byDay[r.day] || 0) + r.count;
  const grand = Object.values(byDay).reduce((a, b) => a + b, 0);

  console.log('\n═══ PhysiQ — peticiones de pago (modo real) ═══\n');
  console.log('Fuente: contadores KV physiq-rate. Solo se escriben en modo real,');
  console.log('y expiran a las 25 h: aquí solo hay hoy y parte de ayer.\n');

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

  if (totals) {
    console.log('─── Peticiones totales (demo + real), últimas 24 h ───\n');
    if (totals._error) {
      console.log(`  No se pudo consultar la GraphQL Analytics API: ${totals._error}`);
      console.log('  Usa los totales del panel de cada Worker en el dashboard.\n');
    } else if (!Object.keys(totals).length) {
      console.log('  Sin datos para physiq-copilot / physiq-orchestrator.\n');
    } else {
      for (const [name, n] of Object.entries(totals)) console.log(`  ${pad(name, 26)}${n}`);
      const t = Object.values(totals).reduce((a, b) => a + b, 0);
      console.log(`\n  Demo (aprox.) = ${t} totales − ${grand} de pago = ${Math.max(0, t - grand)}`);
      console.log('  Aproximado por dos motivos: los totales incluyen /validate y los');
      console.log('  preflights CORS, y las dos ventanas no coinciden exactamente');
      console.log('  (24 h móviles frente a las ~25 h de vida de los contadores).\n');
    }
  }

  console.log('─── Contrastar con el gasto de cada proveedor ───\n');
  for (const [name, what, url] of PROVIDERS) {
    console.log(`  ${pad(name, 12)}${pad(what, 40)}`);
    console.log(`  ${' '.repeat(12)}${url}\n`);
  }

  console.log('  Lectura: si el total de pago de arriba es 0 (o muy bajo) y en algún');
  console.log('  panel aparece consumo en esas mismas horas, el gasto no viene de los');
  console.log('  Workers de PhysiQ. Revisa entonces si alguna clave de API está usada');
  console.log('  fuera de aquí, y rota la que corresponda.\n');

  console.log('─── Historial ───\n');
  console.log('  Los contadores viven 25 h. Para cuadrar una factura mensual hay que');
  console.log('  ir guardando la salida:\n');
  console.log('    node scripts/usage-report.js --json >> ~/physiq-usage.jsonl\n');
  console.log('  Un cron diario (o una GitHub Action programada) basta.\n');
}

main().catch(err => { console.error(`\n✗ ${err.message}\n`); process.exit(1); });
