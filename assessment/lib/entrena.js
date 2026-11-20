// Entrena (entrena.html): lo que el juego saca de data/ y sus reglas, sin DOM ni estado,
// para poder probarlo. Lee los mismos árboles (CIF_TREES) e hipótesis (HYPOTHESES) que
// la app, con la numeración de las hojas impresas (lib/esquemas.js), así que si cambia
// un árbol o un test, el juego cambia con él. Nunca toca datos del paciente.
import { etiquetaPaso, numeroHipotesis } from './esquemas.js';
import { resolveOptionTargets } from './arbol.js';
import { pesoTest } from './tests-4b.js';
import { nombreRegion, dolorInespecifico } from './region.js';

// «Cuánto pesa» de un test, en una de seis categorías, a partir de la frase que genera
// pesoTest() (la misma que la app y la hoja de confirmación).
export function categoriaPeso(p) {
  if (/^Sirve para confirmar y para descartar/.test(p)) return 'ambas';
  if (/^Sirve para descartar/.test(p)) return 'descarta';
  if (/^Sirve para confirmar/.test(p)) return 'confirma';
  if (/^Puntúa dentro del cluster/.test(p)) return 'cluster';
  if (/^Regla pronóstica/.test(p)) return 'pronostico';
  return 'hallazgo';
}

// «Positivo si…» pregunta por la técnica y el criterio de positivo de un test. Se quedan
// fuera los que no tienen técnica que recordar o se adivinan leyendo: el alias de otro
// test, las pruebas complementarias y los criterios cortos que solo repiten el nombre.
const norm = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const VACIAS = new Set(['test', 'con', 'del', 'los', 'las', 'una', 'para', 'por', 'dolor', 'que', 'sin']);
const fichas = t => norm(t).split(/[^a-z0-9]+/).filter(w => w.length >= 4 && !VACIAS.has(w) && !/^\d+$/.test(w));
const parecida = (w, lista) => lista.some(v => v.startsWith(w.slice(0, 5)) || w.startsWith(v.slice(0, 5)));
export function motivoFueraPositivo({ n, crit }) {
  if (/^Otro nombre/i.test(crit) || /\(=/.test(n)) return 'alias de otro test';
  if (/^(Ecograf|RM\b|TC\b|Imagen|Electrodiagn|Radiograf)/i.test(n)) return 'prueba complementaria';
  if (crit.length < 70) return 'repite el nombre';
  const f = fichas(n), cn = norm(crit);
  if (f.length && f.filter(w => cn.includes(w)).length / f.length >= 0.5 && crit.length < 100 && !/positiv/i.test(crit)) return 'repite el nombre';
  return '';
}
// El criterio sin el prefijo «Nombre del test: …» (o su desarrollo en inglés), que
// delataría la respuesta entre las opciones.
export function criterioSinNombre({ n, crit }) {
  const m = crit.match(/^([^:]{3,90}):\s+/);
  if (!m) return crit;
  const pre = m[1], f = fichas(n), fp = fichas(pre);
  const esNombre = fp.length && fp.filter(w => parecida(w, f)).length / fp.length >= 0.6;
  const ingles = /^[A-Z]/.test(pre) && /\b(of|the|by|and|pain|test|shift)\b/i.test(pre) && !/[áéíóúñ]/i.test(pre);
  return esNombre || ingles ? crit.slice(m[0].length).replace(/^./, l => l.toUpperCase()) : crit;
}

// Datos de una región para el juego: pasos con su número de la hoja, su título (la etiqueta
// del paso en la fase 4), la pregunta, el porqué y cada respuesta con su destino resuelto
// (lib/arbol.js, el mismo que la fase 4) y lo que abre; y las hipótesis que salen del árbol,
// con sus tests y lo que pesa cada uno.
export function datosRegion(region, CIF_TREES, HYPOTHESES) {
  const tree = CIF_TREES[region], usadas = new Set();
  const steps = tree.steps.map((s, i) => ({
    id: s.id, num: etiquetaPaso(s, i), q: s.question,
    tit: (s.tag || '').replace(/^Paso\s+\S+\s+[—-]\s*/, ''),
    porque: s.razonamiento?.porque || '',
    opts: s.options.map(o => {
      const [t, ...d] = o.label.split(' — ');
      (o.hypothesis || []).forEach(h => usadas.add(h));
      return { t, d: d.join(' — '), next: resolveOptionTargets(tree, i, o)[0]?.id || null, h: (o.hypothesis || []).filter(h => HYPOTHESES[h]), deriv: o.derivacion || null };
    }),
  }));
  const hyp = {};
  for (const id of usadas) {
    const h = HYPOTHESES[id]; if (!h) continue;
    hyp[id] = {
      n: numeroHipotesis(h.num) || id.replace(/\D/g, ''), name: h.name,
      clusters: Object.fromEntries(Object.entries(h.clusters || {}).map(([k, c]) => [k, { n: c.nombre, up: c.umbralPos, lp: c.lr_pos, un: c.umbralNeg, ln: c.lr_neg }])),
      tests: (h.tests || []).map((t, i) => {
        const p = pesoTest(h, t, i);
        const x = { n: t.name, c: categoriaPeso(p), p, lp: t.lr_pos ?? '', ln: t.lr_neg ?? '', cl: t.cluster || '', crit: t.criterio || '' };
        x.pz = !motivoFueraPositivo(x); x.cj = criterioSinNombre(x);
        return x;
      }),
    };
  }
  return { nombre: nombreRegion(region), inesp: dolorInespecifico(region), steps, hyp };
}

// Columnas de la fila de pasos del inicio: filas iguales que llenan el ancho (5 → 5, 8 → 4 + 4, 13 → 7 + 6).
export const columnasPasos = n => Math.ceil(n / Math.ceil(n / 7));

// Segundos de una pregunta según lo que hay que leer: 12 de base y 1 más por cada 40
// caracteres del enunciado y las opciones, hasta 30.
export const segundosLectura = caracteres => Math.min(30, Math.max(12, Math.round(12 + caracteres / 40)));

// Azar con semilla (reto del día y duelo: las mismas preguntas para todos).
export function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function semilla(txt) { let h = 2166136261; for (const c of String(txt)) h = Math.imul(h ^ c.codePointAt(0), 16777619); return h >>> 0; }

// Código de resultado del duelo: región, número de reto, acierto de cada pregunta y puntos
// en 9 caracteres, con una suma de control que detecta erratas al copiarlo (no es una
// protección contra trampas).
export function codigoResultado(regiones, region, codigo, bits, puntos) {
  const reg = regiones.indexOf(region);
  const base = ((reg * 10000 + Number(codigo)) * 1024 + bits) * 512 + Math.min(511, puntos);
  const s = (base * 64 + semilla('v1-' + base) % 64).toString(36).toUpperCase().padStart(9, '0');
  return s.slice(0, 3) + '-' + s.slice(3, 6) + '-' + s.slice(6);
}
export function leerCodigo(regiones, txt) {
  const s = String(txt).toUpperCase().replace(/[^0-9A-Z]/g, '');
  if (s.length < 6 || s.length > 9) return null;
  const n = parseInt(s, 36); if (!Number.isSafeInteger(n)) return null;
  const base = Math.floor(n / 64); if (semilla('v1-' + base) % 64 !== n % 64) return null;
  const r1 = Math.floor(base / 512), r2 = Math.floor(r1 / 1024), reg = regiones[Math.floor(r2 / 10000)];
  return reg ? { reg, codigo: String(r2 % 10000).padStart(4, '0'), bits: r1 % 1024, puntos: base % 512 } : null;
}
