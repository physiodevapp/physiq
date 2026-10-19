// ============================================================
// PhysiQ-Assessment · lib/farmacos-paciente.js
// Paso 3 de la farmacología (docs/farmacos-paciente.md): las familias que toma
// el paciente. Puro: recibe los datos de las tarjetas y no lee el `state`.
// Las familias salen siempre de data/farmacos.js (las que tienen contenido),
// nunca de una lista escrita aquí, para que las que se escriben en paralelo
// entren solas. Nunca propone cambiar la medicación; sin interacciones: nada
// depende de tener dos familias a la vez.
// ============================================================

import { FAMILIAS_FARMACO } from '../data/farmacos.js';
import { FAMILIAS_PACIENTE, TEXTOS_FARMACOS_PACIENTE } from '../data/farmacos-paciente.js';

// Los antitrombóticos tienen su tarjeta (docs/anticoagulado.md): sin chip aquí.
export const FAMILIA_AC = 'antitromboticos';
const conContenido = () => FAMILIAS_FARMACO.filter(f => f.apartados);

export const nombreCorto = f => FAMILIAS_PACIENTE[f.id]?.corto || f.nombre;

// Chips de la tarjeta: familias con contenido, en el orden de la guía.
export function familiasMarcables() {
  return conContenido().filter(f => f.id !== FAMILIA_AC)
    .map(f => ({ id: f.id, corto: nombreCorto(f), ejemplos: f.ejemplos }));
}

export const familiasPendientesNombres = () => FAMILIAS_FARMACO.filter(f => !f.apartados).map(f => f.nombre);

export const farmacosVacio = () => ({ toma: [] });

// Ids conocidos y marcables, en el orden de la guía (sesiones antiguas o
// importadas, familias que dejen de existir).
export function normalizarFarmacos(fm) {
  const toma = Array.isArray(fm?.toma) ? fm.toma : [];
  return { toma: familiasMarcables().map(f => f.id).filter(id => toma.includes(id)) };
}

// Vistas de un dato que vive en otra tarjeta (decisión 4): no es una regla
// clínica, solo se muestra donde está registrado. Una familia solo cuenta si
// tiene contenido (el hueso, cuando llegue).
const ORIGEN_LUPUS = 'Lupus (LES)';
const ORIGEN_OP = 'Osteoporosis o fragilidad ósea';
const ORIGEN_AC = 'Paciente anticoagulado o antiagregado';
export function derivadasDeTarjetas({ lupus, osteoporosis, anticoagulado } = {}) {
  const ids = new Set(conContenido().map(f => f.id));
  const out = {};
  const add = (id, origen) => { if (ids.has(id)) (out[id] ||= []).push(origen); };
  if (lupus?.estado === 'diagnosticado' && ['b', 'm', 'a'].includes(lupus.corticoides)) add('corticoides', ORIGEN_LUPUS);
  if (osteoporosis?.estado === 'diagnosticada' && ['b', 'a'].includes(osteoporosis.corticoides)) add('corticoides', ORIGEN_OP);
  if (osteoporosis?.estado === 'diagnosticada' && osteoporosis.tratamiento === 'antirresortivo') add('hueso', ORIGEN_OP);
  if (anticoagulado?.estado === 'toma') add(FAMILIA_AC, ORIGEN_AC);
  return out;
}

// Todas las familias del paciente, para «Este paciente», la fase 5 y la 6:
// [{ id, corto, tarjeta: bool (marcada en esta tarjeta), origenes: [tarjetas] }]
export function familiasPaciente({ farmacos, lupus, osteoporosis, anticoagulado } = {}) {
  const toma = normalizarFarmacos(farmacos).toma;
  const der = derivadasDeTarjetas({ lupus, osteoporosis, anticoagulado });
  return conContenido()
    .filter(f => toma.includes(f.id) || der[f.id])
    .map(f => ({ id: f.id, corto: nombreCorto(f), tarjeta: toma.includes(f.id), origenes: der[f.id] || [] }));
}

// «AINE» · «Corticoides (tarjeta «Lupus (LES)»)»
export function textoFamiliaPaciente(x) {
  const de = x.origenes.length && !x.tarjeta ? ` (tarjeta «${x.origenes.join('» y «')}»)` : '';
  return `${x.corto}${de}`;
}

// ── Payload `fm` (decisiones 16 y 20): solo lo marcado en esta tarjeta y solo
// si hay algo (la huella de los informes anteriores no cambia). El nombre va
// dentro para que la copia de physiq-report no necesite una tabla de ids.
export function fmPayload(farmacos) {
  const toma = normalizarFarmacos(farmacos).toma;
  if (!toma.length) return null;
  const porId = Object.fromEntries(familiasMarcables().map(f => [f.id, f.corto]));
  return toma.map(id => ({ id, n: porId[id] }));
}

const _nombres = fm => (fm || []).map(x => x.n).filter(Boolean);

export function lineaNotasFM(fm) {
  return `💊 FÁRMACOS (familias): ${_nombres(fm).join(' · ')}`;
}

// Bloque del informe con IA (decisión 17): sin citas ni frases de la guía.
// physiq-report lleva una copia literal (`_bloqueFM`); FM_CASOS lo fija.
export function bloqueFMIA(fm) {
  return [
    'Fármacos que toma (familias registradas por el fisioterapeuta; sin dosis ni nombres):',
    `  · ${_nombres(fm).join('; ')}`,
    '  · No sugieras cambiar, suspender ni ajustar la medicación, ni comentes interacciones entre fármacos. No atribuyas los síntomas del paciente a un fármaco si el fisioterapeuta no lo ha dicho, y no añadas recomendaciones sobre la medicación que no estén en estos datos.',
  ].join('\n');
}

// ── Avisos de la fase 6 (decisión 12): uno por familia con `plan`, en el
// orden de la guía, y la línea común una sola vez. Los antitrombóticos, nunca
// (salen de su tarjeta). `ids`: los de familiasPaciente().
export function avisosFarmacos(ids = []) {
  const avisos = conContenido()
    .filter(f => f.id !== FAMILIA_AC && ids.includes(f.id) && FAMILIAS_PACIENTE[f.id]?.plan?.length)
    .map(f => `${FAMILIAS_PACIENTE[f.id].rotulo}: ${FAMILIAS_PACIENTE[f.id].plan.join(' ')}`);
  return avisos.length ? [...avisos, TEXTOS_FARMACOS_PACIENTE.lineaComun] : [];
}
