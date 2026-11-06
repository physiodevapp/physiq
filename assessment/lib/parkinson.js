// ============================================================
// PhysiQ-Assessment · lib/parkinson.js
// Condición especial «Parkinson» (Fase P, docs/parkinson.md). Funciones puras:
// estado vacío, qué se ve según la tarjeta, la medida de la tensión tumbado y
// de pie (minutos 1 y 3, regla de la hipotensión ortostática, sin la del POTS),
// las caídas (las de la osteoporosis), pendientes del modo breve, payload `pk`
// y los textos de 📋 Notas, 📄 Informe e informe con IA. El contenido clínico
// (preguntas, filas y textos con sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_PARKINSON } from '../data/comun.js';
import { caidasVacio, normalizarCaidas, resultadoCaidasDe } from './osteoporosis.js';

export const PK = SIS_PARKINSON.parkinson;

export const ESTADOS_PK = { diagnosticado: 'Diagnosticado', sospecha: 'Sospecha' };
// Filas de botones de la tarjeta con «Diagnosticado» (segundo toque borra).
export const FILAS_PK = { estadio: PK.estadios, fluctuaciones: PK.fluctuaciones, fase: PK.fases, congelacion: PK.congelacion, estimulador: PK.estimulador };

// Medida de la tensión: tumbado y los minutos de pie (1 y 3, LeWitt 2020).
export const FILAS_TENSION = ['tumbado', ...PK.tension.minutos.map(m => `m${m}`)];
export const tensionVacia = () => Object.fromEntries(FILAS_TENSION.map(f => [f, {}]));

// `caidas`: las mismas respuestas que la osteoporosis (NICE NG249).
// `tension`: null = sin hacer; si no, { tumbado: { fc, tas, tad }, m1, m3, reloj? }.
export const parkinsonVacio = () => ({
  estado: '', estadio: '', fluctuaciones: '', fase: '', congelacion: '', estimulador: '',
  caidas: caidasVacio(), tension: null,
});

export const pkActivo = pk => !!pk?.estado;
export const pkDiagnosticado = pk => pk?.estado === 'diagnosticado';
// «Ahora está en» solo se pinta con fluctuaciones = Sí.
export const faseVisible = pk => pkDiagnosticado(pk) && pk.fluctuaciones === 'SI';
// Estimulador en «Sí» o «No lo sabe»: la línea de las técnicas (la opción prudente).
export const conEstimulador = pk => pkDiagnosticado(pk) && pk.estimulador === 'SI';
export const estimuladorAviso = pk => pkDiagnosticado(pk) && (pk.estimulador === 'SI' || pk.estimulador === 'NS');

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarParkinson(pk) {
  const v = { ...parkinsonVacio(), ...(pk || {}) };
  if (!ESTADOS_PK[v.estado]) v.estado = '';
  for (const [k, opciones] of Object.entries(FILAS_PK)) if (!opciones[v[k]]) v[k] = '';
  v.caidas = normalizarCaidas(v.caidas);
  if (v.tension !== null) {
    if (!v.tension || typeof v.tension !== 'object') v.tension = null;
    else v.tension = { ...tensionVacia(), ...v.tension };
  }
  return v;
}

// ── Qué se ve ────────────────────────────────────────────────
// Pregunta o bandera del sistema (`pk` en data/comun.js). Sin `pk`, con los dos estados.
export function elementoPKVisible(x, pk) {
  if (!x || typeof x === 'string' || !x.pk) return true;
  if (x.pk === 'diagnosticado') return pkDiagnosticado(pk);
  if (x.pk === 'estimulador') return conEstimulador(pk);
  if (x.pk === 'sospecha') return pk?.estado === 'sospecha';
  return true;
}

// ── Tensión tumbado y de pie (decisión 10; LeWitt 2020) ──────
const num = v => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));

// estado: 'sin-hacer' | 'incompleta' (falta la TA tumbado o de pie) |
// 'ho' (caída de 20 mmHg o más de la TAS o de 10 o más de la TAD en el minuto 1
// o el 3) | 'no-ho'. caida: { tas, tad } máximas.
export function resultadoTension(t) {
  if (!t) return { estado: 'sin-hacer' };
  const tas0 = num(t.tumbado?.tas), tad0 = num(t.tumbado?.tad);
  const filas = PK.tension.minutos.map(m => {
    const f = t[`m${m}`] || {};
    return { min: m, tas: num(f.tas), tad: num(f.tad), fc: num(f.fc) };
  });
  const dTas = filas.filter(f => f.tas != null && tas0 != null).map(f => tas0 - f.tas);
  const dTad = filas.filter(f => f.tad != null && tad0 != null).map(f => tad0 - f.tad);
  const caida = { tas: dTas.length ? Math.max(...dTas) : null, tad: dTad.length ? Math.max(...dTad) : null };
  if ((caida.tas != null && caida.tas >= 20) || (caida.tad != null && caida.tad >= 10)) return { estado: 'ho', caida, filas };
  if (!dTas.length && !dTad.length) return { estado: 'incompleta', caida, filas };
  return { estado: 'no-ho', caida, filas };
}

// ── Caídas (decisión 8): las de la osteoporosis ──────────────
export const resultadoCaidasPK = pk => (pkActivo(pk) ? resultadoCaidasDe(pk.caidas) : null);

// ── Pendientes del modo breve ────────────────────────────────
// El estimulador sin registrar (es lo que cambia las técnicas) y, con
// fluctuaciones, la fase on/off sin registrar.
export function pendientesPK(pk) {
  if (!pkDiagnosticado(pk)) return [];
  const p = [];
  if (!pk.estimulador) p.push({ fase: 1, ancla: 'cardParkinson', texto: 'Estimulador cerebral profundo sin registrar (tarjeta «Parkinson»)' });
  if (pk.fluctuaciones === 'SI' && !pk.fase) p.push({ fase: 1, ancla: 'cardParkinson', texto: 'Fase on/off sin registrar (tarjeta «Parkinson»)' });
  return p;
}

// ── Payload `pk` ─────────────────────────────────────────────
// Solo con la tarjeta marcada (sin ella, el payload y la huella de los informes
// con IA anteriores no cambian). Con «Diagnosticado»: es estado, hy Hoehn y
// Yahr ('12'|'3'|'45'|'ns'|null), fl fluctuaciones ('SI'|'NO'|'NS'|null), fa
// fase de la valoración ('on'|'off'|'ns'|null, solo con fluctuaciones), cg
// congelación ('SI'|'NO'|null), ec estimulador ('SI'|'NO'|'NS'|null). Con
// «Sospecha»: { es }. Nunca la pregunta `pk_d_mental` (es `privada`).
export function pkPayload(pk) {
  if (!pkActivo(pk)) return null;
  if (!pkDiagnosticado(pk)) return { es: 'sospecha' };
  return {
    es: 'diagnosticado', hy: pk.estadio || null, fl: pk.fluctuaciones || null,
    fa: pk.fluctuaciones === 'SI' ? (pk.fase || null) : null,
    cg: pk.congelacion || null, ec: pk.estimulador || null,
  };
}

// ── Textos compartidos (a partir del payload) ────────────────
const HY_TEXTO = { 12: 'H&Y 1–2', 3: 'H&Y 3', 45: 'H&Y 4–5', ns: 'H&Y: no lo sabe' };
const FA_TEXTO = { on: 'valorado en on', off: 'valorado en off', ns: 'fase sin precisar' };

// Datos de la tarjeta en una lista de frases cortas (sin fuentes).
export function datosPK(d) {
  if (d?.es !== 'diagnosticado') return [];
  return [
    d.hy ? HY_TEXTO[d.hy] : '',
    d.fl === 'SI' ? `fluctuaciones${d.fa ? ` (${FA_TEXTO[d.fa]})` : ''}` : d.fl === 'NO' ? 'sin fluctuaciones' : d.fl === 'NS' ? 'fluctuaciones: no lo sabe' : '',
    d.cg === 'SI' ? 'congelación' : '',
    d.ec === 'SI' ? 'estimulador cerebral profundo' : d.ec === 'NS' ? 'estimulador cerebral profundo: no lo sabe' : '',
  ].filter(Boolean);
}

// Línea del estimulador (la de la tarjeta, con «Hasta confirmarlo:» si no lo sabe).
export function lineaEstimulador(ec) {
  if (ec === 'SI') return PK.textos.estimulador;
  if (ec === 'NS') return `${PK.textos.estimuladorDuda} ${PK.textos.estimulador.replace(/^\S/, c => c.toLowerCase())}`;
  return '';
}

// Líneas del recuadro de la fase 5, con sus citas. Además del payload, `d`
// puede llevar `cd` (resultado de las caídas: 'alto'|'una'|'no'|null) y `sn`
// (la pregunta de los ataques de sueño contestada SÍ), que no van al payload.
export function lineasRecomendacionPK(d) {
  const t = PK.textos;
  if (d?.es !== 'diagnosticado') return [PK_DERIVACION_SOSPECHA];
  return [
    lineaEstimulador(d.ec),
    t.ejercicio,
    t.intensidad,
    d.cg === 'SI' || d.cd === 'alto' || d.cd === 'una' ? t.congelacion : '',
    t.onOff,
    d.hy === '45' ? `${t.estadios} ${t.cama}` : '',
    t.ortostatica,
    t.hueso,
    t.dolor5,
    t.vibracion,
    d.sn ? t.sueno : '',
    t.parar,
    t.experiencia,
  ].filter(Boolean);
}
const PK_DERIVACION_SOSPECHA = SIS_PARKINSON.preguntas.find(q => q.id === 'pk_d_sospecha').derivacion + ' (NICE NG71, 1.2.1–1.2.2).';

const _estadoTexto = d => (d.es === 'diagnosticado' ? 'diagnosticado' : 'sospecha');

// 📋 Notas: una línea.
export function lineaNotasPK(d) {
  const partes = [_estadoTexto(d), ...datosPK(d),
    d.es === 'sospecha' ? 'derivar pronto y sin tratar a un especialista' : ''].filter(Boolean);
  return `🧠 PARKINSON: ${partes.join(' · ')}`;
}

// 📄 Informe (paciente o médico): estadio, fluctuaciones y estimulador, sin
// técnicas; con la sospecha, sin la palabra Parkinson (el fisio no
// diagnostica). { titulo, lineas }.
export function informePK(d) {
  if (d.es === 'diagnosticado') {
    const lineas = ['Enfermedad de Parkinson (diagnosticada).'];
    if (d.hy && d.hy !== 'ns') lineas.push(`Estadio de Hoehn y Yahr: ${PK.estadios[d.hy]}.`);
    if (d.fl === 'SI') lineas.push(`Fluctuaciones on/off${d.fa === 'on' ? '; valorado en fase on' : d.fa === 'off' ? '; valorado en fase off' : ''}.`);
    if (d.ec === 'SI') lineas.push('Lleva un estimulador cerebral profundo.');
    return { titulo: 'ENFERMEDAD DE PARKINSON', lineas };
  }
  return { titulo: 'RECOMENDACIÓN DE VALORACIÓN MÉDICA', lineas: ['Se recomienda valoración por un especialista en trastornos del movimiento.'] };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
export function bloquePKIA(d) {
  const datos = datosPK(d);
  return [
    'Parkinson (condición especial marcada por el fisioterapeuta):',
    `  · Estado: ${_estadoTexto(d)}`,
    datos.length ? `  · Datos: ${datos.join('; ')}` : '',
    d.es === 'sospecha' ? '  · Es una sospecha: no escribas que el paciente tiene Parkinson; el diagnóstico es médico. Recomienda la valoración por un especialista en trastornos del movimiento.' : '',
    d.ec === 'SI' || d.ec === 'NS' ? `  · ${PK.textos.reglaIA}` : '',
  ].filter(Boolean).join('\n');
}
