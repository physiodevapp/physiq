// ============================================================
// PhysiQ-Assessment · lib/osteoporosis.js
// Condición especial «Osteoporosis o fragilidad ósea» (Fase P,
// docs/osteoporosis.md). Funciones puras: estado vacío, qué se ve según la
// tarjeta, la sospecha (regla del NOGG: 50 años o más y un factor), las caídas
// (NICE NG249), la derivación por corticoides sin protección ósea, el tope «sin
// thrust» de la fase 6, payload `op` y los textos de 📋 Notas, 📄 Informe e
// informe con IA. El contenido clínico (preguntas, filas, factores y textos con
// sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_OSTEOPOROSIS } from '../data/comun.js';
import { esAnticoagulante } from './anticoagulado.js';

export const OP = SIS_OSTEOPOROSIS.osteoporosis;

export const ESTADOS_OP = { diagnosticada: 'Diagnosticada', sospecha: 'Sospecha' };
// Filas de botones de la tarjeta con «Diagnosticada» (las casillas van aparte).
export const FILAS_OP = { causa: OP.causas, vertebrales: OP.vertebrales, tratamiento: OP.tratamientos, corticoides: OP.corticoides };
export const CASILLAS_OP = ['reciente', 'otras'];
export const CASILLAS_CAIDAS = OP.caidas.casillas.map(c => c.id);

// `factores`: { of1…of6: 'SI'|'NO' } (solo con «Sospecha»).
// `caidas`: { n: '0'|'1'|'2'|'', lesion, suelo, conciencia, fragilidad } (los dos estados).
export const caidasVacio = () => ({ n: '', lesion: false, suelo: false, conciencia: false, fragilidad: false });
export const osteoporosisVacio = () => ({
  estado: '', causa: '', vertebrales: '', reciente: false, otras: false, tratamiento: '', corticoides: '',
  factores: {}, caidas: caidasVacio(),
});

export const opActivo = op => !!op?.estado;
export const opDiagnosticada = op => op?.estado === 'diagnosticada';
export const factoresVisibles = op => op?.estado === 'sospecha';

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarOsteoporosis(op) {
  const v = { ...osteoporosisVacio(), ...(op || {}) };
  if (!ESTADOS_OP[v.estado]) v.estado = '';
  for (const [k, opciones] of Object.entries(FILAS_OP)) if (!opciones[v[k]]) v[k] = '';
  for (const k of CASILLAS_OP) v[k] = v[k] === true;
  const f = v.factores && typeof v.factores === 'object' ? v.factores : {};
  v.factores = Object.fromEntries(OP.factores.filter(q => f[q.id] === 'SI' || f[q.id] === 'NO').map(q => [q.id, f[q.id]]));
  const c = { ...caidasVacio(), ...(v.caidas && typeof v.caidas === 'object' ? v.caidas : {}) };
  if (!OP.caidas.n[c.n]) c.n = '';
  for (const k of CASILLAS_CAIDAS) c[k] = c[k] === true;
  v.caidas = c;
  return v;
}

// ── Qué se ve ────────────────────────────────────────────────
// Fracturas vertebrales conocidas (1 o 2 o más), con la tarjeta en «Diagnosticada».
export const fracturaVertebral = op => opDiagnosticada(op) && (op.vertebrales === '1' || op.vertebrales === '2');
export const conAntirresortivo = op => opDiagnosticada(op) && op.tratamiento === 'antirresortivo';

// Pregunta o bandera del sistema (`op` en data/comun.js). Sin `op`, siempre.
// 'sinFractura': la pérdida de talla busca fracturas sin diagnosticar, así que
// no sale si ya consta una; 'antirresortivo': la fractura atípica de fémur.
export function elementoOPVisible(x, op) {
  if (!x || typeof x === 'string' || !x.op) return true;
  if (x.op === 'sinFractura') return !fracturaVertebral(op);
  if (x.op === 'antirresortivo') return conAntirresortivo(op);
  return true;
}

// ── Sospecha (decisión 3) ────────────────────────────────────
// Regla del NOGG: a partir de los 50 años, un factor de riesgo pide valorar el
// riesgo de fractura (Gregson 2025). Antes de los 50, una fractura por
// fragilidad pide buscar la causa. La app nunca calcula el FRAX.
export const siFactores = op => OP.factores.filter(q => op?.factores?.[q.id] === 'SI').length;
export const respondidosFactores = op => OP.factores.filter(q => op?.factores?.[q.id]).length;

// 'derivar' | 'joven' | 'sinFactores' | 'sinEdad' | null (sin contestar).
export function resultadoSospecha(op, edad) {
  if (!factoresVisibles(op) || !respondidosFactores(op)) return null;
  const n = siFactores(op);
  if (!n) return 'sinFactores';
  if (edad == null || edad === '' || Number.isNaN(Number(edad))) return 'sinEdad';
  if (Number(edad) >= 50) return 'derivar';
  return op.factores.of1 === 'SI' ? 'joven' : 'sinFactores';
}

// ── Caídas (decisión 8; NICE NG249, 1.1.2–1.1.6) ─────────────
// 'alto' (2 o más, o una con lesión, sin poder levantarse, pérdida de
// conocimiento o fragilidad) | 'una' | 'no' | null (sin contestar). Sin puntuar.
export function resultadoCaidas(op) {
  const c = op?.caidas;
  if (!opActivo(op) || !c?.n) return null;
  if (c.n === '0') return 'no';
  if (c.n === '2' || CASILLAS_CAIDAS.some(k => c[k])) return 'alto';
  return 'una';
}

// ── Derivación por corticoides sin protección ósea (decisión 5) ──
// Gregson 2025 (recomendación fuerte): con 7,5 mg/día o más durante 3 meses,
// la protección ósea empieza a la vez que los corticoides.
export const derivacionCorticoides = op => opDiagnosticada(op) && op.corticoides === 'a' && op.tratamiento === 'no';
export function derivacionesOP(op) {
  return derivacionCorticoides(op) ? [OP.textos.corticoides] : [];
}

// ── Tope «sin thrust» de la fase 6 (decisiones 6 y 15; docs/anticoagulado.md, decisión 4) ──
// Con la tarjeta marcada (Maitland 2005, cap. 9, p. 223; Puentedura 2015) y,
// sin marcarla, con la tarjeta del lupus con corticoides o dosis altas previas
// (Puentedura 2015, tabla 1: corticoides a largo plazo), o con un anticoagulante
// en la tarjeta «Paciente anticoagulado o antiagregado» (tabla 1: tratamiento
// anticoagulante; el antiagregante solo no está en la tabla). Devuelve los motivos (vacío = sin tope).
export function motivosSinThrust(op, lupus, ac = null) {
  const m = [];
  if (opActivo(op)) m.push('osteoporosis');
  if (lupus?.estado === 'diagnosticado' && (['b', 'm', 'a'].includes(lupus.corticoides) || lupus.dosisAltas === 'SI')) m.push('corticoides');
  if (esAnticoagulante(ac)) m.push('anticoagulante');
  return m;
}

// ── Pendientes del modo breve ────────────────────────────────
// Con «Diagnosticada», las fracturas vertebrales sin contestar (cambian el
// ejercicio); con «Sospecha», los factores sin preguntar. La urgencia siempre se ve.
export function pendientesOP(op) {
  if (opDiagnosticada(op) && !op.vertebrales) return [{ fase: 1, ancla: 'cardOsteoporosis', texto: 'Fracturas vertebrales sin registrar (tarjeta «Osteoporosis o fragilidad ósea»)' }];
  if (factoresVisibles(op) && !respondidosFactores(op)) return [{ fase: 2, texto: 'Factores de la sospecha de osteoporosis sin preguntar' }];
  return [];
}

// ── Payload `op` ─────────────────────────────────────────────
// Solo con la tarjeta marcada (sin ella, el payload y la huella de los informes
// con IA anteriores no cambian). es: estado; cd: caídas ('alto'|'una'|'no'|null).
// Con «Diagnosticada»: ca causa, fv fracturas vertebrales ('0'|'1'|'2'|'ns'|null),
// fr alguna reciente o dolorosa, fo otras fracturas por fragilidad, tr
// tratamiento, gc corticoides ('no'|'b'|'a'|'ns'|null), dc derivación por
// corticoides sin protección ósea. Con «Sospecha»: fs «sí» de los factores
// (null = sin preguntar) y sr resultado de la sospecha.
export function opPayload(op, edad) {
  if (!opActivo(op)) return null;
  const cd = resultadoCaidas(op);
  if (opDiagnosticada(op)) {
    return {
      es: 'diagnosticada', ca: op.causa || null, fv: op.vertebrales || null, fr: !!op.reciente, fo: !!op.otras,
      tr: op.tratamiento || null, gc: op.corticoides || null, dc: derivacionCorticoides(op), cd,
    };
  }
  return { es: 'sospecha', fs: respondidosFactores(op) ? siFactores(op) : null, sr: resultadoSospecha(op, edad), cd };
}

// ── Textos compartidos (a partir del payload) ────────────────
const CAUSA_TEXTO = { edad: 'posmenopáusica o por la edad', corticoides: 'por corticoides', plo: 'asociada al embarazo o la lactancia', otra: 'otra causa', ns: 'causa: no lo sabe' };
const FV_TEXTO = { 0: 'sin fracturas vertebrales conocidas', 1: '1 fractura vertebral', 2: '2 o más fracturas vertebrales', ns: 'fracturas vertebrales: no lo sabe' };
const TR_TEXTO = { no: 'sin tratamiento para el hueso', antirresortivo: 'bifosfonato o denosumab', otro: 'otro tratamiento para el hueso', ns: 'tratamiento para el hueso: no lo sabe' };
const GC_TEXTO = { no: 'sin corticoides', b: 'corticoides de menos de 7,5 mg/día', a: 'corticoides de 7,5 mg/día o más', ns: 'corticoides: no lo sabe' };
const CD_TEXTO = { alto: 'caídas: riesgo alto', una: 'una caída en el último año', no: 'sin caídas en el último año' };

export const fracturaVertebralPayload = d => d?.fv === '1' || d?.fv === '2';
// Impacto solo hasta caminar a paso ligero (Brooke-Wavell 2022, recuadro 1):
// con fractura vertebral o fracturas múltiples por traumatismo de baja energía.
export const impactoLimitado = d => fracturaVertebralPayload(d) || !!d?.fo;

const _estadoTexto = d => (d.es === 'diagnosticada' ? 'diagnosticada' : 'sospecha');

// Datos de la tarjeta en una lista de frases cortas (sin fuentes).
export function datosOP(d) {
  if (d.es !== 'diagnosticada') return [d.cd ? CD_TEXTO[d.cd] : ''].filter(Boolean);
  return [
    d.ca ? CAUSA_TEXTO[d.ca] : '',
    d.fv ? FV_TEXTO[d.fv] + (d.fr && fracturaVertebralPayload(d) ? ' (alguna reciente o dolorosa)' : '') : '',
    d.fo ? 'otras fracturas por fragilidad' : '',
    d.tr ? TR_TEXTO[d.tr] : '',
    d.gc ? GC_TEXTO[d.gc] : '',
    d.cd ? CD_TEXTO[d.cd] : '',
  ].filter(Boolean);
}

const LINEA_SOSPECHA = { derivar: 'sospechaDerivar', joven: 'sospechaJoven', sinFactores: 'sospechaSinFactores', sinEdad: 'sospechaSinEdad' };
const LINEA_CAIDAS = { alto: 'caidasAlto', una: 'caidasUna', no: 'caidasNo' };

// Líneas del recuadro de la fase 5 (y del prompt), con sus citas.
export function lineasRecomendacionOP(d) {
  const t = OP.textos;
  const caidas = d.cd ? [t[LINEA_CAIDAS[d.cd]], d.cd === 'alto' || d.cd === 'una' ? t.caidasDosis : ''] : [];
  if (d.es === 'sospecha') {
    return [d.sr ? t[LINEA_SOSPECHA[d.sr]] : '', ...caidas, t.seguridad].filter(Boolean);
  }
  return [
    t.fuerza,
    impactoLimitado(d) ? t.impactoCon : t.impactoSin,
    d.cd === 'no' ? '' : t.equilibrio,
    fracturaVertebralPayload(d) && d.fr ? t.reciente : '',
    t.moverse,
    t.tecnica,
    t.seguridad,
    d.tr === 'antirresortivo' ? t.antirresortivo : '',
    d.dc ? t.corticoides : '',
    d.ca === 'plo' ? t.plo : '',
    d.ca === 'plo' ? t.ploRecurrencia : '',
    ...caidas,
    t.medico,
  ].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasOP(d) {
  const partes = [_estadoTexto(d), ...datosOP(d),
    d.es === 'sospecha' && d.fs != null ? `factores ${d.fs}/${OP.factores.length}` : '',
    d.sr === 'derivar' ? 'que su médico valore el riesgo de fractura' : d.sr === 'joven' ? 'fractura por fragilidad antes de los 50: valoración médica' : '',
    d.dc ? 'corticoides sin protección ósea: a su médico' : '',
    d.cd === 'alto' ? 'valoración integral de caídas' : ''].filter(Boolean);
  return `🦴 OSTEOPOROSIS: ${partes.join(' · ')}`;
}

// 📄 Informe (paciente o médico): lenguaje llano y, con la sospecha, sin la
// palabra osteoporosis (el fisio no diagnostica). { titulo, lineas }.
export function informeOP(d) {
  const lineas = [];
  if (d.es === 'diagnosticada') {
    lineas.push(d.ca === 'plo' ? 'Osteoporosis asociada al embarazo o la lactancia (diagnosticada).' : 'Osteoporosis (diagnosticada).');
    if (fracturaVertebralPayload(d)) lineas.push(d.fv === '2' ? 'Fracturas vertebrales.' : 'Fractura vertebral.');
    if (d.fo) lineas.push('Otras fracturas por fragilidad.');
    if (d.dc) lineas.push('Toma corticoides sin tratamiento para el hueso: se recomienda que su médico valore la protección ósea.');
    if (d.cd === 'alto') lineas.push('Se recomienda una valoración de caídas.');
    return { titulo: 'OSTEOPOROSIS', lineas };
  }
  if (d.sr === 'derivar') lineas.push('Se recomienda que su médico valore el riesgo de fractura.');
  if (d.sr === 'joven') lineas.push('Se recomienda valoración médica de la fractura con un golpe pequeño.');
  if (d.cd === 'alto') lineas.push('Se recomienda una valoración de caídas.');
  return { titulo: 'RECOMENDACIÓN DE VALORACIÓN MÉDICA', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
// Una cita lleva un año o es una guía NICE («NICE NG249, 1.1.3»), sin año.
const _sinCitas = s => s.replace(/\s*\([^()]*(\d{4}|NICE (NG|CG)\d+)[^()]*\)/g, '');
export function bloqueOPIA(d) {
  const datos = datosOP(d);
  return [
    'Osteoporosis o fragilidad ósea (condición especial marcada por el fisioterapeuta):',
    `  · Estado: ${_estadoTexto(d)}`,
    datos.length ? `  · Datos: ${datos.join('; ')}` : '',
    d.es === 'sospecha' && d.fs != null ? `  · Factores de riesgo de fractura: ${d.fs} de ${OP.factores.length} «sí»` : '',
    d.es === 'sospecha' ? '  · Es una sospecha: no escribas que el paciente tiene osteoporosis; el diagnóstico es médico.' : '',
    `  · Consideraciones para el plan: ${lineasRecomendacionOP(d).map(_sinCitas).join(' ')}`,
  ].filter(Boolean).join('\n');
}
