// ============================================================
// PhysiQ-Assessment · lib/mastocitos.js
// Condición especial «Trastorno mastocitario o anafilaxia» (Fase P,
// docs/mastocitaria.md). Funciones puras: estado vacío, nivel de alerta,
// pendiente del modo breve, payload `ma` y los textos de 📋 Notas, 📄 Informe e
// informe con IA. El contenido clínico (pregunta, tipos, desencadenantes y
// textos con sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_MASTOCITOS } from '../data/comun.js';

export const MA = SIS_MASTOCITOS.mastocitos;

// Solo «Diagnosticado» (decisión 2): sin «Sospecha».
export const ESTADOS_MA = { diagnosticado: 'Diagnosticado' };
export const TIPOS_MA = MA.tipos;
export const SINO_MA = { SI: 'Sí', NO: 'No', NS: 'No lo sabe' };
export const AUTOINYECTOR_MA = { SI: 'Sí', NO: 'No', sinReceta: 'No le han recetado' };

// Filas de botones de la tarjeta (las casillas de desencadenantes van aparte).
export const FILAS_MA = { tipo: TIPOS_MA, anafilaxia: SINO_MA, autoinyector: AUTOINYECTOR_MA };
export const DESENCADENANTES_MA = MA.desencadenantes.map(d => d.id);

// `desencadenantes`: { ejercicio, calor, … : true }; `otro`: texto libre.
export const mastocitosVacio = () => ({ estado: '', tipo: '', anafilaxia: '', autoinyector: '', desencadenantes: {}, otro: '' });

export const maActivo = ma => ma?.estado === 'diagnosticado';

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarMastocitos(ma) {
  const v = { ...mastocitosVacio(), ...(ma || {}) };
  if (!ESTADOS_MA[v.estado]) v.estado = '';
  for (const [k, opciones] of Object.entries(FILAS_MA)) if (!opciones[v[k]]) v[k] = '';
  const d = v.desencadenantes && typeof v.desencadenantes === 'object' ? v.desencadenantes : {};
  v.desencadenantes = Object.fromEntries(DESENCADENANTES_MA.filter(k => d[k] === true).map(k => [k, true]));
  v.otro = typeof v.otro === 'string' ? v.otro : '';
  return v;
}

// «Ninguno: solo ha tenido anafilaxia» implica la anafilaxia previa.
export const anafilaxiaPrevia = ma => ma?.tipo === 'soloAnafilaxia' || ma?.anafilaxia === 'SI';

// Nivel de alerta (decisión 11): la línea de riesgo alto sale con mastocitosis,
// SAMA o anafilaxia previa; con «otro trastorno» o «no lo sabe» sin anafilaxia,
// no (el riesgo de esa etiqueta no está descrito; decisión 16).
export const riesgoAltoMA = ma => maActivo(ma) && (ma.tipo === 'mastocitosis' || ma.tipo === 'sama' || anafilaxiaPrevia(ma));

// Desencadenantes marcados, con su texto (y el «otro» libre al final).
export function desencadenantesMA(ma) {
  const marcados = MA.desencadenantes.filter(d => ma?.desencadenantes?.[d.id]).map(d => d.texto.toLowerCase());
  const otro = (ma?.otro || '').trim();
  return otro ? [...marcados, otro] : marcados;
}

// ── Pendiente del modo breve ─────────────────────────────────
// El autoinyector sin responder: decide lo que se le pide que traiga.
export function pendientesMA(ma) {
  if (maActivo(ma) && !ma.autoinyector) return [{ fase: 1, ancla: 'cardMastocitos', texto: 'Autoinyector sin registrar (tarjeta «Trastorno mastocitario o anafilaxia»)' }];
  return [];
}

// ── Payload `ma` ─────────────────────────────────────────────
// Solo con la tarjeta marcada (sin ella, el payload y la huella de los informes
// con IA anteriores no cambian). es: 'diagnosticado'; ti: tipo
// ('mastocitosis'|'sama'|'otro'|'soloAnafilaxia'|'ns'|null); an: anafilaxia
// previa ('si'|'no'|'ns'|null; 'si' con «solo anafilaxia»); ai: autoinyector
// ('si'|'no'|'sinReceta'|null); de: desencadenantes (textos), [] si ninguno.
export function maPayload(ma) {
  if (!maActivo(ma)) return null;
  const an = ma.tipo === 'soloAnafilaxia' ? 'si' : ma.anafilaxia ? ma.anafilaxia.toLowerCase() : null;
  const ai = ma.autoinyector === 'sinReceta' ? 'sinReceta' : ma.autoinyector ? ma.autoinyector.toLowerCase() : null;
  return { es: 'diagnosticado', ti: ma.tipo || null, an, ai, de: desencadenantesMA(ma) };
}

// ── Textos compartidos (a partir del payload) ────────────────
const TIPO_TEXTO = { mastocitosis: 'mastocitosis', sama: 'síndrome de activación mastocitaria', otro: 'otro trastorno mastocitario', soloAnafilaxia: 'anafilaxia previa, sin trastorno mastocitario diagnosticado', ns: 'trastorno mastocitario (no sabe cuál)' };
const AI_TEXTO = { si: 'lleva autoinyector', no: 'no lleva autoinyector', sinReceta: 'sin autoinyector recetado' };

export const riesgoAltoPayload = d => d?.ti === 'mastocitosis' || d?.ti === 'sama' || d?.an === 'si';

// Datos de la tarjeta en una lista de frases cortas (sin fuentes).
export function datosMA(d) {
  return [
    d.ti ? TIPO_TEXTO[d.ti] : 'trastorno mastocitario',
    d.an === 'si' && d.ti !== 'soloAnafilaxia' ? 'anafilaxia previa' : d.an === 'ns' ? 'anafilaxia previa: no lo sabe' : '',
    d.ai ? AI_TEXTO[d.ai] : '',
    d.de?.length ? `desencadenantes: ${d.de.join(', ')}` : '',
  ].filter(Boolean);
}

// Líneas del recuadro de la fase 5 (y del prompt), con sus citas.
export function lineasRecomendacionMA(d) {
  const t = MA.textos;
  return [
    t.queHacer,
    t.desmayo,
    riesgoAltoPayload(d) ? t.riesgoAlto : '',
    d.ti === 'mastocitosis' ? t.mastocitosis : '',
    d.ai === 'no' || d.ai === 'sinReceta' ? t.sinAutoinyector : '',
    d.de?.length ? t.desencadenantes : '',
    t.despues,
    t.protocolo,
  ].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasMA(d) {
  return `💉 MASTOCITOS: ${datosMA(d).join(' · ')}`;
}

// 📄 Informe (paciente o médico): antecedente y, si los hay, los
// desencadenantes que se evitan en la sesión. Nunca convierte «otro
// trastorno» en un SAMA. { titulo, lineas }.
export function informeMA(d) {
  const lineas = [];
  if (d.ti === 'mastocitosis') lineas.push('Mastocitosis (diagnosticada).');
  else if (d.ti === 'sama') lineas.push('Síndrome de activación mastocitaria (diagnosticado).');
  else if (d.ti === 'otro' || d.ti === 'ns' || !d.ti) lineas.push('Trastorno mastocitario (diagnosticado).');
  if (d.an === 'si') lineas.push('Anafilaxia previa.');
  if (d.de?.length) lineas.push(`En las sesiones se evita lo que le ha provocado episodios: ${d.de.join(', ')}.`);
  return { titulo: 'TRASTORNO MASTOCITARIO O ANAFILAXIA', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
// Una cita lleva un año o es una guía NICE («NICE NG258, 1.1.16»), sin año.
const _sinCitas = s => s.replace(/\s*\([^()]*(\d{4}|NICE (NG|CG)\d+)[^()]*\)/g, '');
export function bloqueMAIA(d) {
  return [
    'Trastorno mastocitario o anafilaxia (condición especial marcada por el fisioterapeuta):',
    `  · Datos: ${datosMA(d).join('; ')}`,
    '  · No relaciones sus síntomas crónicos (dolor, cansancio) con el trastorno mastocitario: solo los episodios bruscos en varios sistemas lo son.',
    `  · Consideraciones para la sesión: ${lineasRecomendacionMA(d).filter(t => t !== MA.textos.protocolo).map(_sinCitas).join(' ')}`,
  ].join('\n');
}
