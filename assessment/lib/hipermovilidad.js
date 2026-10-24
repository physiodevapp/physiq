// ============================================================
// PhysiQ-Assessment · lib/hipermovilidad.js
// Condición especial «Hipermovilidad / Ehlers-Danlos» (Fase P,
// docs/hipermovilidad.md). Funciones puras: estado vacío, qué preguntas del
// sistema se ven, escala de Beighton con su corte por edad, cuestionario de
// 5 preguntas, regla de sospecha del subtipo vascular, payload `hm` y los
// textos de 📋 Notas, 📄 Informe e informe con IA. El contenido clínico
// (preguntas, maniobras, textos con sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_HIPERMOVILIDAD } from '../data/comun.js';

export const HM = SIS_HIPERMOVILIDAD.hipermovilidad;

export const ESTADOS_HM = { diagnosticada: 'Diagnosticada', sospecha: 'Sospecha' };
export const SUBTIPOS_HM = {
  hipermovil: 'Hipermóvil (SEDh) o TEH',
  vascular: 'Vascular',
  otro: 'Otro',
  ns: 'No lo sabe',
};

// `beighton`: null = sin hacer; { [maniobra_lado]: true } = hecho (lo no
// marcado puntúa 0). `cuestionario`: { cq1…cq5: 'SI'|'NO' }.
export const hipermovilidadVacia = () => ({ estado: '', subtipo: '', beighton: null, cuestionario: {} });

export const hmActiva = hm => !!hm?.estado;

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarHipermovilidad(hm) {
  const v = { ...hipermovilidadVacia(), ...(hm || {}) };
  if (!ESTADOS_HM[v.estado]) v.estado = '';
  if (!SUBTIPOS_HM[v.subtipo]) v.subtipo = '';
  if (v.beighton !== null && typeof v.beighton !== 'object') v.beighton = null;
  if (!v.cuestionario || typeof v.cuestionario !== 'object') v.cuestionario = {};
  return v;
}

// ── Qué se ve ────────────────────────────────────────────────
// Urgencias del subtipo vascular: con el subtipo vascular diagnosticado, con
// sospecha, o con la regla de sospecha vascular cumplida (diagnosticada con
// subtipo otro, no lo sabe o sin marcar: si ya se deriva a genética por
// sospecha, se pregunta también por el cuadro agudo). Sospecha del subtipo
// vascular: con sospecha, o diagnosticada sin saber el subtipo. Diagnosticada
// vascular no pregunta la sospecha (ya está diagnosticada); hipermóvil, ninguna
// de las dos. `respuestas` = state.sistemicoAnswers.
export function urgenciasVisibles(hm, respuestas = {}) {
  return hm?.estado === 'sospecha' || (hm?.estado === 'diagnosticada' && hm.subtipo === 'vascular')
    || !!reglaVascular(hm, respuestas)?.derivar;
}
export function sospechaVascularVisible(hm) {
  return hm?.estado === 'sospecha' || (hm?.estado === 'diagnosticada' && ['otro', 'ns', ''].includes(hm.subtipo));
}
// Pregunta o bandera del sistema (`hm` en data/comun.js); sin `hm`, siempre.
// Una urgencia ya marcada SÍ no se oculta al cambiar el subtipo, el estado o
// las respuestas de sospecha (dejaría de contar en `ur`); la bandera sigue a su
// pregunta (`pregunta`). Solo desaparece si se pasa a NO o se desmarca la
// tarjeta entera (el sistema deja de verse, como en las demás tarjetas).
export function elementoHMVisible(x, hm, respuestas = {}) {
  if (!x || typeof x === 'string' || !x.hm) return true;
  if (x.hm !== 'urgencia') return sospechaVascularVisible(hm);
  return urgenciasVisibles(hm, respuestas) || respuestas[x.id || x.pregunta] === 'SI';
}
export const cuestionarioVisible = hm => hm?.estado === 'sospecha';
export const beightonVisible = hm => hmActiva(hm);

// ── Escala de Beighton ───────────────────────────────────────
export const casillasBeighton = () => HM.beighton.flatMap(m => m.lados ? [`${m.id}_d`, `${m.id}_i`] : [m.id]);

export function puntosBeighton(hm) {
  if (!hm?.beighton) return null;
  return casillasBeighton().filter(k => hm.beighton[k]).length;
}

// Corte de Malfait 2017 (p. 17) para la edad; null sin edad.
export function corteBeighton(edad) {
  if (edad === null || edad === undefined || isNaN(edad)) return null;
  return HM.cortes.find(c => c.edadMax === null || edad <= c.edadMax);
}

// ── Cuestionario ─────────────────────────────────────────────
export function siCuestionario(hm) {
  return HM.cuestionario.filter(q => hm?.cuestionario?.[q.id] === 'SI').length;
}
export function respondidasCuestionario(hm) {
  return HM.cuestionario.filter(q => hm?.cuestionario?.[q.id]).length;
}
export const cuestionarioPositivo = hm => siCuestionario(hm) >= 2;

// Hipermovilidad articular generalizada (HAG): Beighton ≥ corte, o un punto
// por debajo con el cuestionario positivo (Malfait 2017, p. 17).
// estado: 'sin-beighton' | 'sin-edad' | 'hag' | 'no-hag'.
export function resultadoHAG(hm, edad) {
  const puntos = puntosBeighton(hm);
  if (puntos === null) return { estado: 'sin-beighton', puntos: null };
  const c = corteBeighton(edad);
  if (!c) return { estado: 'sin-edad', puntos };
  const porCuestionario = puntos === c.corte - 1 && cuestionarioPositivo(hm);
  return { estado: puntos >= c.corte || porCuestionario ? 'hag' : 'no-hag', puntos, corte: c.corte, grupo: c.grupo, porCuestionario };
}

// ── Sospecha del subtipo vascular ────────────────────────────
// Derivación preferente con un «sí» mayor o con 2 o más «sí» (Malfait 2017,
// p. 16: un antecedente familiar o una rotura bastan; los rasgos menores, en
// combinación). `respuestas` = state.sistemicoAnswers.
export function reglaVascular(hm, respuestas = {}) {
  if (!sospechaVascularVisible(hm)) return null;
  const qs = SIS_HIPERMOVILIDAD.preguntas.filter(q => q.hm === 'sospecha' && respuestas[q.id] === 'SI');
  const mayores = qs.filter(q => q.hmPeso === 'mayor').length;
  return { mayores, total: qs.length, derivar: mayores >= 1 || qs.length >= 2 };
}

// ── Payload `hm` ─────────────────────────────────────────────
// Solo con la condición activa (sin ella, el payload y la huella de los
// informes con IA anteriores no cambian). es: estado, st: subtipo,
// bt: puntos de Beighton (null = sin hacer), co: corte, cu: «sí» del
// cuestionario (null = sin preguntar), hag: hipermovilidad generalizada
// (true/false/null), vs: regla de sospecha del subtipo vascular cumplida.
export function hmPayload(hm, edad, respuestas) {
  if (!hmActiva(hm)) return null;
  const r = resultadoHAG(hm, edad);
  const vasc = reglaVascular(hm, respuestas);
  return {
    es: hm.estado,
    st: hm.estado === 'diagnosticada' ? (hm.subtipo || 'ns') : '',
    bt: r.puntos,
    co: r.corte ?? null,
    cu: cuestionarioVisible(hm) && respondidasCuestionario(hm) ? siCuestionario(hm) : null,
    hag: r.estado === 'hag' ? true : r.estado === 'no-hag' ? false : null,
    vs: !!vasc?.derivar,
  };
}

// ── Textos compartidos ───────────────────────────────────────
// El subtipo en minúscula dentro de una frase, sin tocar las siglas
// (`toLowerCase()` daba «hipermóvil (sedh) o teh»).
const _subtipoMinus = st => SUBTIPOS_HM[st].replace(/^\S/, c => c.toLowerCase());
const _estadoTexto = d => d.es === 'diagnosticada'
  ? `diagnosticada${d.st && d.st !== 'ns' ? ` (subtipo ${_subtipoMinus(d.st)})` : ''}`
  : 'sospecha';
const _beightonTexto = d => d.bt == null ? '' : `Beighton ${d.bt}/9${d.co != null ? ` (corte ${d.co})` : ''}`;

// Líneas de recomendación que se muestran según el payload (fase 5 y prompt).
export function lineasRecomendacionHM(d) {
  const t = HM.textos;
  return [
    t.ejercicio,
    d.es === 'diagnosticada' && d.st === 'vascular' ? t.vascular : '',
    d.es === 'sospecha' && d.hag ? t.derivarHAG : '',
    d.vs ? t.derivarVascular : '',
    t.sistemicos,
  ].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasHM(d) {
  const partes = [_estadoTexto(d), _beightonTexto(d),
    d.cu != null ? `cuestionario ${d.cu}/5` : '',
    d.hag === true ? 'hipermovilidad generalizada' : d.hag === false ? 'sin hipermovilidad generalizada' : '',
    d.vs ? 'sospecha de subtipo vascular: derivar a genética' : ''].filter(Boolean);
  return `🧬 HIPERMOVILIDAD: ${partes.join(' · ')}`;
}

// 📄 Informe (paciente o médico): lenguaje llano, sin la palabra Ehlers-Danlos
// con la sospecha (el fisio no diagnostica).
export function lineasInformeHM(d) {
  if (d.es === 'diagnosticada') {
    return [`Hipermovilidad articular / síndrome de Ehlers-Danlos (diagnosticado${d.st === 'vascular' ? ', subtipo vascular' : ''}).`];
  }
  const l = [];
  if (d.hag) l.push('Hipermovilidad articular generalizada en la exploración: se recomienda valoración por reumatología.');
  if (d.vs) l.push('Se recomienda valoración por genética.');
  return l;
}

// Informe con IA: bloque de datos.
export function bloqueHMIA(d) {
  return [
    'Hipermovilidad (condición especial marcada por el fisioterapeuta):',
    `  · Estado: ${_estadoTexto(d)}`,
    _beightonTexto(d) ? `  · ${_beightonTexto(d)}${d.hag === true ? ': hipermovilidad articular generalizada' : d.hag === false ? ': sin hipermovilidad articular generalizada' : ''}` : '',
    d.cu != null ? `  · Cuestionario de 5 preguntas: ${d.cu} «sí»` : '',
    d.es === 'sospecha' ? '  · Es una sospecha: no escribas que el paciente tiene un síndrome de Ehlers-Danlos.' : '',
    `  · Consideraciones para el plan: ${lineasRecomendacionHM(d).map(s => s.replace(/\s*\([^()]*\d{4}[^()]*\)/g, '')).join(' ')}`,
  ].filter(Boolean).join('\n');
}
