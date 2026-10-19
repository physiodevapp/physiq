// ============================================================
// PhysiQ-Assessment · lib/anticoagulado.js
// Condición especial «Paciente anticoagulado o antiagregado» (Fase P,
// docs/anticoagulado.md). Funciones puras: estado vacío, grupos de fármacos,
// qué preguntas del cribado se ven, migración de la casilla del lupus,
// pendiente del modo breve, payload `ac` y los textos de 📋 Notas, 📄 Informe e
// informe con IA. El contenido clínico (preguntas, tipos y textos con sus
// fuentes) vive en data/comun.js.
// ============================================================

import { SIS_ANTICOAGULADO } from '../data/comun.js';

export const AC = SIS_ANTICOAGULADO.anticoagulado;

// Un solo estado, «Toma» (decisión 2): sin «Sospecha» ni «Diagnosticado».
export const ESTADOS_AC = { toma: 'Toma' };
export const TIPOS_AC = AC.tipos.map(t => t.id);   // vk, do, hp, as, oa, ns
const ANTICOAGULANTES = ['vk', 'do', 'hp'];
const ANTIAGREGANTES = ['as', 'oa'];

export const anticoaguladoVacio = () => ({ estado: '', toma: [] });

export const acActivo = ac => ac?.estado === 'toma';

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarAnticoagulado(ac) {
  const v = { ...anticoaguladoVacio(), ...(ac || {}) };
  if (!ESTADOS_AC[v.estado]) v.estado = '';
  v.toma = Array.isArray(v.toma) ? TIPOS_AC.filter(t => v.toma.includes(t)) : [];
  return { estado: v.estado, toma: v.toma };
}

// ── Grupos ───────────────────────────────────────────────────
// «No lo sabe», o nada marcado todavía, se trata como el caso más cauteloso:
// anticoagulante (decisión 2, redacción propia).
const sinDato = ac => !ac.toma.length || ac.toma.includes('ns');
export const esAnticoagulante = ac => acActivo(ac) && (sinDato(ac) || ac.toma.some(t => ANTICOAGULANTES.includes(t)));
export const esAntiagregante = ac => acActivo(ac) && ac.toma.some(t => ANTIAGREGANTES.includes(t));
export const dobleAntiagregacion = ac => acActivo(ac) && ac.toma.includes('as') && ac.toma.includes('oa');
// Solo la aspirina (sin otro fármaco ni «no lo sabe»): NICE NG232 la excluye del
// factor de riesgo del golpe en la cabeza (1.2.4).
export const soloAspirina = ac => acActivo(ac) && ac.toma.length === 1 && ac.toma[0] === 'as';

// ── Qué se ve ────────────────────────────────────────────────
// Pregunta o bandera del sistema (`ac` en data/comun.js). Sin `ac`, siempre.
//   'anticoagulante': con anticoagulante (o «no lo sabe»);
//   'cabeza': con anticoagulante o con un antiagregante que no sea la aspirina sola;
//   'todos': con cualquier fármaco de la tarjeta.
export function elementoACVisible(x, ac) {
  if (!x || typeof x === 'string' || !x.ac) return true;
  if (!acActivo(ac)) return false;
  if (x.ac === 'anticoagulante') return esAnticoagulante(ac);
  if (x.ac === 'cabeza') return !soloAspirina(ac);
  return true;
}

// ── Casilla antigua del lupus (decisión 3) ───────────────────
// Antes de esta tarjeta, el lupus tenía su casilla «anticoagulante o
// antiagregante». Una sesión antigua con la casilla marcada y la tarjeta sin
// marcar pasa a la tarjeta con «No lo sabe» (migración de los datos, no una
// regla clínica). Devuelve la tarjeta que corresponde.
export function migrarCasillaLupus(lupus, ac) {
  const v = normalizarAnticoagulado(ac);
  if (lupus?.antitrombotico === true && !acActivo(v)) return { estado: 'toma', toma: ['ns'] };
  return v;
}

// ── Pendiente del modo breve ─────────────────────────────────
// Qué toma, sin registrar: decide la pregunta del golpe en la cabeza y el tope
// «sin thrust» de la fase 6. Las urgencias siempre se ven.
export function pendientesAC(ac) {
  if (acActivo(ac) && !ac.toma.length) return [{ fase: 1, ancla: 'cardAnticoagulado', texto: 'Qué toma, sin registrar (tarjeta «Paciente anticoagulado o antiagregado»)' }];
  return [];
}

// ── Payload `ac` ─────────────────────────────────────────────
// Solo con la tarjeta marcada (sin ella, el payload y la huella de los informes
// con IA anteriores no cambian). es: 'toma'; ti: lo que toma, en el orden de
// la tarjeta ('vk'|'do'|'hp'|'as'|'oa'|'ns'), [] si no consta.
export function acPayload(ac) {
  if (!acActivo(ac)) return null;
  return { es: 'toma', ti: TIPOS_AC.filter(t => ac.toma.includes(t)) };
}

// ── Textos compartidos (a partir del payload) ────────────────
const TI_TEXTO = { vk: 'antivitamina K', do: 'anticoagulante directo', hp: 'heparina', as: 'aspirina', oa: 'otro antiagregante', ns: 'no sabe qué toma' };

// Lo mismo que los grupos de arriba, leído del payload.
const ti = d => d?.ti || [];
export const payloadAnticoagulante = d => !ti(d).length || ti(d).includes('ns') || ti(d).some(t => ANTICOAGULANTES.includes(t));
export const payloadSoloAspirina = d => ti(d).length === 1 && ti(d)[0] === 'as';
export const payloadDoble = d => ti(d).includes('as') && ti(d).includes('oa');

// Datos de la tarjeta en una lista de frases cortas (sin fuentes).
export function datosAC(d) {
  const lista = ti(d).map(t => TI_TEXTO[t]);
  if (payloadDoble(d)) lista.push('doble antiagregación');
  return lista.length ? lista : ['fármaco sin registrar'];
}

// Líneas del recuadro de la fase 5 (y del prompt), con sus citas.
export function lineasRecomendacionAC(d) {
  const t = AC.textos;
  const anticoagulante = payloadAnticoagulante(d);
  return [
    t.medico,
    payloadSoloAspirina(d) ? t.cabezaAspirina : t.cabeza,
    anticoagulante ? t.thrust : t.antiagregante,
    t.tejidosBlandos,
    t.puncion,
    t.ondas,
    t.ejercicio,
    t.deporte,
    t.caidas,
    t.banderas,
    ti(d).includes('hp') ? t.heparina : '',
    t.otrosFarmacos,
  ].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasAC(d) {
  return `🩸 ANTICOAGULADO/ANTIAGREGADO: ${datosAC(d).join(' · ')}`;
}

// 📄 Informe (paciente o médico): solo el antecedente, sin nombres de fármaco
// ni recomendaciones de técnica (decisión 17). { titulo, lineas }.
export function informeAC(d) {
  const lineas = [];
  const anticoag = ti(d).filter(t => ANTICOAGULANTES.includes(t)).map(t => TI_TEXTO[t]);
  const antiag = ti(d).filter(t => ANTIAGREGANTES.includes(t));
  if (anticoag.length) lineas.push(`Tratamiento anticoagulante (${anticoag.join(', ')}).`);
  if (antiag.length) lineas.push(payloadDoble(d) ? 'Tratamiento antiagregante doble.' : 'Tratamiento antiagregante.');
  if (!anticoag.length && !antiag.length) lineas.push('Tratamiento anticoagulante o antiagregante (no sabe cuál).');
  return { titulo: 'TRATAMIENTO ANTICOAGULANTE O ANTIAGREGANTE', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
// Una cita lleva un año o es una guía NICE («NICE NG232, 1.2.4»), sin año.
const _sinCitas = s => s.replace(/\s*\([^()]*(\d{4}|NICE (NG|CG)\d+)[^()]*\)/g, '');
export function bloqueACIA(d) {
  return [
    'Paciente anticoagulado o antiagregado (condición especial marcada por el fisioterapeuta):',
    `  · Toma: ${datosAC(d).join('; ')}`,
    '  · No sugieras suspender, saltarse ni ajustar el tratamiento. No atribuyas los síntomas del paciente al fármaco si el fisioterapeuta no lo ha dicho.',
    `  · Consideraciones para la sesión: ${[payloadSoloAspirina(d) ? AC.textos.cabezaAspirina : AC.textos.cabeza, payloadAnticoagulante(d) ? AC.textos.thrust : AC.textos.antiagregante, AC.textos.banderas].map(_sinCitas).join(' ')}`,
  ].join('\n');
}
