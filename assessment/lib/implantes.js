// ============================================================
// PhysiQ-Assessment · lib/implantes.js
// Condición especial «Implantes con electrodos» (Fase P,
// docs/implantes-electrodos.md, «Texto cerrado para revisión»). Funciones
// puras: estado vacío, qué líneas rojas salen con cada chip, la sincronía del
// estimulador cerebral profundo con la tarjeta del Parkinson, el pendiente del
// modo breve, el payload `ie` y los textos de 📋 Notas, 📄 Informe e informe
// con IA. El contenido clínico (chips y frases con sus fuentes) vive en
// data/comun.js (IMPLANTES).
// ============================================================

import { IMPLANTES } from '../data/comun.js';

export const IE = IMPLANTES;

// Un solo estado, «Lleva» (decisión 1): sin «Sospecha» ni «Diagnosticado».
export const ESTADOS_IE = { lleva: 'Lleva' };
export const TIPOS_IE = IE.tipos.map(t => t.id);   // mp, dai, em, ecp, ci, on, co, re, ns
const CARDIACOS = ['mp', 'dai'];
// Orden de las líneas rojas (el de la tabla de claves del texto cerrado).
export const ORDEN_LINEAS = Object.keys(IE.lineas);   // diatermia, cardiaco, medular, cerebral, coclear, nervio, laser, retirado, nosabe

export const implantesVacio = () => ({ estado: '', tipos: [] });

export const ieActivo = ie => ie?.estado === 'lleva';

// Sesiones anteriores o datos incompletos → la forma completa, con los chips en
// el orden de la tarjeta. «No sabe cuál» excluye a los demás.
export function normalizarImplantes(ie) {
  const v = { ...implantesVacio(), ...(ie || {}) };
  if (!ESTADOS_IE[v.estado]) v.estado = '';
  let tipos = Array.isArray(v.tipos) ? TIPOS_IE.filter(t => v.tipos.includes(t)) : [];
  if (tipos.includes('ns')) tipos = ['ns'];
  return { estado: v.estado, tipos };
}

// Pulsar un chip: lo marca o lo desmarca. «No sabe cuál» excluye a los demás y al revés.
export function alternarTipo(ie, k) {
  const v = normalizarImplantes(ie);
  if (!TIPOS_IE.includes(k)) return v;
  if (v.tipos.includes(k)) v.tipos = v.tipos.filter(x => x !== k);
  else v.tipos = k === 'ns' ? ['ns'] : [...v.tipos.filter(x => x !== 'ns'), k];
  return normalizarImplantes(v);
}

// ── Qué líneas salen ─────────────────────────────────────────
// Sin chips, como «No sabe cuál» (decisión 5): la opción prudente.
const tiposEfectivos = tipos => (tipos?.length ? tipos : ['ns']);

// Claves de las líneas rojas para una lista de chips: `diatermia` siempre, y
// cada una de las de sus chips una sola vez, en el orden de la tabla de claves.
export function clavesLineas(tipos) {
  const set = new Set(['diatermia', ...tiposEfectivos(tipos).flatMap(t => IE.lineasPorTipo[t] || [])]);
  return ORDEN_LINEAS.filter(k => set.has(k));
}
export const lineasImplantes = tipos => clavesLineas(tipos).map(k => IE.lineas[k]);

export const tieneCardiaco = tipos => tiposEfectivos(tipos).some(t => CARDIACOS.includes(t) || t === 'ns');
export const tieneDAI = tipos => (tipos || []).includes('dai');
export const tieneMedular = tipos => (tipos || []).includes('em');

// ── Estimulador cerebral profundo: un solo dato con el Parkinson (decisión 11) ──
// La fila del Parkinson (`estimulador`: 'SI'|'NO'|'NS'|'') y el chip `ecp` son
// el mismo dato. «No lo sabe» sigue solo en el Parkinson. Devuelve el par
// { ie, pk } coherente tras un cambio; `evento` dice dónde fue:
//   'pkFila'   la fila del estimulador del Parkinson: «Sí» añade el chip; otra
//              respuesta, o borrarla, lo quita;
//   'pkEstado' el estado del Parkinson: al pasar a «Diagnosticado» con el chip
//              ya marcado, la fila pasa a «Sí»;
//   'ie'       la tarjeta de implantes: con el Parkinson diagnosticado, el chip
//              marcado pone la fila en «Sí» y quitarlo la borra si estaba en «Sí»;
//   'restaurar' una sesión anterior con la fila en «Sí»: añade el chip.
// Quitar el chip deja la tarjeta sin marcar si no quedaba otro.
const conEcp = ie => ieActivo(ie) && ie.tipos.includes('ecp');
function anadirEcp(ie) {
  return normalizarImplantes({ estado: 'lleva', tipos: [...ie.tipos.filter(t => t !== 'ns'), 'ecp'] });
}
function quitarEcp(ie) {
  const tipos = ie.tipos.filter(t => t !== 'ecp');
  return { estado: tipos.length || !ie.tipos.includes('ecp') ? ie.estado : '', tipos };
}
export function sincronizarEstimulador({ ie, pk, evento }) {
  let v = normalizarImplantes(ie);
  const p = { ...(pk || {}) };
  const diag = p.estado === 'diagnosticado';
  if (evento === 'pkFila' && diag) v = p.estimulador === 'SI' ? anadirEcp(v) : quitarEcp(v);
  else if (evento === 'restaurar' && diag && p.estimulador === 'SI' && !conEcp(v)) v = anadirEcp(v);
  else if (evento === 'pkEstado' && diag && conEcp(v)) p.estimulador = 'SI';
  else if (evento === 'ie' && diag) {
    if (conEcp(v)) p.estimulador = 'SI';
    else if (p.estimulador === 'SI') p.estimulador = '';
  }
  return { ie: v, pk: p };
}

// El recuadro y el aviso de los implantes ya llevan la línea del estimulador:
// el Parkinson la sustituye por «ver Implantes con electrodos».
export const estimuladorEnImplantes = ie => ieActivo(ie) && ie.tipos.includes('ecp');

// ── Pendiente del modo breve ─────────────────────────────────
export function pendientesIE(ie) {
  if (ieActivo(ie) && !ie.tipos.length) return [{ fase: 1, ancla: 'cardImplantes', texto: 'Implante con electrodos: qué lleva sin registrar' }];
  return [];
}

// ── Payload `ie` ─────────────────────────────────────────────
// Solo con la tarjeta marcada (sin ella, el payload y la huella de los informes
// con IA anteriores no cambian). es: 'lleva'; ti: chips en el orden de la
// tarjeta, [] si no se ha marcado ninguno.
export function iePayload(ie) {
  if (!ieActivo(ie)) return null;
  return { es: 'lleva', ti: normalizarImplantes(ie).tipos };
}

// ── Textos compartidos (a partir del payload) ────────────────
const CORTO = Object.fromEntries(IE.tipos.map(t => [t.id, t.corto]));
const ti = d => d?.ti || [];

// Lo que lleva, en una lista de frases cortas (sin fuentes).
export const datosIE = d => ti(d).map(t => CORTO[t]);

// Línea 1 del recuadro de la fase 5: «Lleva: marcapasos · estimulador medular» (redacción propia).
export const lineaLleva = d => (ti(d).length ? `Lleva: ${datosIE(d).join(' · ')}` : 'Lleva: sin registrar qué');

// Líneas por pauta (decisión 12): las hipótesis elegidas o activas con una
// pauta que propone la técnica. `hips`: [{ id, name }].
export function lineasPautaIE(hips) {
  return (hips || []).filter(h => IE.pautas[h.id]).map(h => `La pauta de ${h.name} ${IE.pautas[h.id]}.`);
}

// Líneas del recuadro de la fase 5, con sus citas (sin la línea «Lleva:», que
// va en la cabecera, ni las de pauta, que dependen de las hipótesis).
export function lineasRecomendacionIE(d) {
  return [
    ...lineasImplantes(ti(d)),
    ti(d).includes('em') ? IE.textos.columna : '',
  ].filter(Boolean);
}

// Aviso de la fase 6: las líneas rojas y, con el medular, la de los movimientos de columna.
export const avisoImplantes = tipos => [...lineasImplantes(tipos), tieneMedular(tipos) ? IE.textos.columna : ''].filter(Boolean);

// 📋 Notas: una línea.
export function lineaNotasIE(d) {
  return `⚡ IMPLANTES CON ELECTRODOS: ${ti(d).length ? datosIE(d).join(' · ') : 'sin registrar qué lleva'}`;
}

// 📄 Informe (paciente o médico): solo el antecedente, sin técnicas.
// { titulo, lineas }, como las demás condiciones.
export function informeIE(d) {
  return { titulo: 'IMPLANTES CON ELECTRODOS', lineas: [ti(d).length ? `Portador de: ${datosIE(d).join(', ')}.` : 'Portador de un implante con electrodos.'] };
}

// Informe con IA: bloque de datos, sin citas (el informe no nombra fuentes).
export function bloqueIEIA(d) {
  const t = ti(d), T = IE.textos;
  const lista = t.length ? datosIE(d).join('; ') : 'sin registrar qué lleva';
  const cardiaco = !t.length || t.some(x => CARDIACOS.includes(x) || x === 'ns');
  const otros = t.some(x => ['em', 'ecp', 'ci', 'on', 'co'].includes(x));
  const usNinguna = t.some(x => x === 'em' || x === 'ecp');
  return [
    'Implantes con electrodos (condición especial marcada por el fisioterapeuta):',
    `  · Lleva: ${lista}`,
    `  · ${T.iaSiempre}`,
    cardiaco ? `  · ${T.iaCardiaco}` : '',
    otros ? `  · ${T.iaOtros}` : '',
    usNinguna ? `  · ${T.iaUltrasonido}` : '',
  ].filter(Boolean).join('\n');
}
