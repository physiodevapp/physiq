// ============================================================
// PhysiQ-Assessment · lib/lupus.js
// Condición especial «Lupus (LES)» (Fase P, docs/lupus.md). Funciones puras:
// estado vacío, qué se ve según el estado, los rasgos de la sospecha, payload
// `le` y los textos de 📋 Notas, 📄 Informe e informe con IA. El contenido
// clínico (preguntas, rasgos, textos con sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_LUPUS } from '../data/comun.js';

export const LES = SIS_LUPUS.lupus;

export const ESTADOS_LES = { diagnosticado: 'Diagnosticado', sospecha: 'Sospecha' };
// Corticoides ahora, prednisona o equivalente (decisión 2 y cambio C1 de
// docs/lupus.md): 5 mg/día es el objetivo de mantenimiento (Fanouriakis 2024,
// rec. 2; Sammaritano 2025) y más de 20, dosis moderada-alta (Sammaritano 2025,
// tabla 4).
export const CORTICOIDES_LES = { no: 'No', b: 'Hasta 5 mg/día', m: 'Más de 5 hasta 20', a: 'Más de 20', ns: 'No lo sabe' };
export const SINO_LES = { SI: 'Sí', NO: 'No', NS: 'No lo sabe' };
export const ANTIFOSFOLIPIDOS_LES = { no: 'No', apl: 'Positivos, sin trombosis', saf: 'SAF con trombosis previa', ns: 'No lo sabe' };
// El brote lo juzga el clínico (Ruperto 2011): «peor» es lo que nota el
// paciente sin que nadie lo haya valorado aún (cambio C10).
export const ACTIVIDAD_LES = { estable: 'Estable', brote: 'En brote, según su médico', peor: 'Peor, sin valorar aún', ns: 'No lo sabe' };

// Filas de la tarjeta con «Diagnosticado» que son botones (las casillas van aparte).
export const FILAS_LES = {
  corticoides: CORTICOIDES_LES, dosisAltas: SINO_LES, inmunosupresores: SINO_LES,
  antifosfolipidos: ANTIFOSFOLIPIDOS_LES, actividad: ACTIVIDAD_LES,
};
// El anticoagulante o antiagregante ya no es una casilla del lupus: se marca en la
// tarjeta «Paciente anticoagulado o antiagregado» (docs/anticoagulado.md, decisión 3).
export const CASILLAS_LES = ['osteonecrosis', 'raynaud'];

// `rasgos`: { lr1…lr6: 'SI'|'NO' } (solo con «Sospecha»).
export const lupusVacio = () => ({
  estado: '', corticoides: '', dosisAltas: '', inmunosupresores: '', antifosfolipidos: '',
  osteonecrosis: false, raynaud: false, actividad: '', rasgos: {},
});

export const lesActivo = les => !!les?.estado;
export const lesDiagnosticado = les => les?.estado === 'diagnosticado';
export const rasgosVisibles = les => les?.estado === 'sospecha';

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarLupus(les) {
  const v = { ...lupusVacio(), ...(les || {}) };
  if (!ESTADOS_LES[v.estado]) v.estado = '';
  for (const [k, opciones] of Object.entries(FILAS_LES)) if (!opciones[v[k]]) v[k] = '';
  for (const k of CASILLAS_LES) v[k] = v[k] === true;
  if (!v.rasgos || typeof v.rasgos !== 'object') v.rasgos = {};
  delete v.antitrombotico;   // casilla antigua: la migra migrarCasillaLupus() (lib/anticoagulado.js) antes de normalizar
  return v;
}

// ── Qué se ve ────────────────────────────────────────────────
// Pregunta o bandera del sistema (`les` en data/comun.js): las urgencias y las
// derivaciones, solo con «Diagnosticado» (decisión 5). Sin `les`, siempre.
export function elementoLESVisible(x, les) {
  if (!x || typeof x === 'string' || !x.les) return true;
  return x.les === 'diagnosticado' && lesDiagnosticado(les);
}

// ── Rasgos de la sospecha ────────────────────────────────────
// Sin regla de puntos (decisión 3): cualquier «sí» de lr1–lr5 lleva a la
// derivación preferente; lr6 (fármaco nuevo) es del diferencial y no suma.
export const siRasgos = les => LES.rasgos.filter(q => !q.diferencial && les?.rasgos?.[q.id] === 'SI').length;
export const respondidosRasgos = les => LES.rasgos.filter(q => les?.rasgos?.[q.id]).length;
export const farmacoNuevo = les => LES.rasgos.some(q => q.diferencial && les?.rasgos?.[q.id] === 'SI');

// ── Pendientes del modo breve ────────────────────────────────
// Corticoides sin registrar con «Diagnosticado» (cambian la red de seguridad)
// y rasgos sin preguntar con «Sospecha». Las urgencias siempre se ven.
export function pendientesLES(les) {
  if (lesDiagnosticado(les) && !les.corticoides) return [{ fase: 1, ancla: 'cardLupus', texto: 'Corticoides sin registrar (tarjeta «Lupus (LES)»)' }];
  if (rasgosVisibles(les) && !respondidosRasgos(les)) return [{ fase: 2, texto: 'Rasgos de la sospecha de lupus sin preguntar' }];
  return [];
}

// ── Payload `le` ─────────────────────────────────────────────
// Solo con la condición activa (sin ella, el payload y la huella de los
// informes con IA anteriores no cambian). es: estado; con «Diagnosticado»,
// gc: corticoides ahora ('no'|'b'|'m'|'a'|'ns'|null), ga: dosis altas previas,
// is: inmunosupresores ('si'|'no'|'ns'|null), af: antifosfolípidos
// ('no'|'apl'|'saf'|'ns'|null), at: anticoagulante o antiagregante (de la tarjeta
// «Paciente anticoagulado o antiagregado», `ac`; el campo se conserva para physiq-report),
// on: osteonecrosis o Jaccoud conocidos, ry: Raynaud, av: actividad
// ('estable'|'brote'|'peor'|'ns'|null); con «Sospecha», rs: «sí» de los rasgos
// (null = sin preguntar) y fd: empezó tras un fármaco nuevo.
const _sino = v => (v ? v.toLowerCase() : null);
export function lePayload(les, ac = null) {
  if (!lesActivo(les)) return null;
  if (lesDiagnosticado(les)) {
    return {
      es: 'diagnosticado', gc: les.corticoides || null, ga: _sino(les.dosisAltas), is: _sino(les.inmunosupresores),
      af: les.antifosfolipidos || null, at: ac?.estado === 'toma', on: !!les.osteonecrosis, ry: !!les.raynaud,
      av: les.actividad || null,
    };
  }
  return { es: 'sospecha', rs: respondidosRasgos(les) ? siRasgos(les) : null, fd: farmacoNuevo(les) };
}

// ── Textos compartidos ───────────────────────────────────────
const CORT_TEXTO = { no: 'sin corticoides', b: 'corticoides hasta 5 mg/día', m: 'corticoides de más de 5 hasta 20 mg/día', a: 'corticoides de más de 20 mg/día', ns: 'corticoides: no lo sabe' };
const AF_TEXTO = { no: 'sin anticuerpos antifosfolípido', apl: 'anticuerpos antifosfolípido positivos, sin trombosis', saf: 'síndrome antifosfolípido con trombosis previa', ns: 'antifosfolípidos: no lo sabe' };
const AV_TEXTO = { estable: 'estable', brote: 'en brote, según su médico', peor: 'peor, sin valorar aún', ns: 'actividad: no lo sabe' };

export const enBrote = d => d?.av === 'brote' || d?.av === 'peor';
export const riesgoOsteonecrosis = d => d?.ga === 'si' || d?.gc === 'a';

// Datos de la tarjeta en una lista de frases cortas (sin fuentes).
export function datosLES(d) {
  if (d.es !== 'diagnosticado') return [];
  return [
    d.gc ? CORT_TEXTO[d.gc] : '',
    d.ga === 'si' ? 'ha tomado dosis altas (más de 20 mg/día más de 4 semanas)' : '',
    d.is === 'si' ? 'inmunosupresores o biológicos' : d.is === 'ns' ? 'inmunosupresores: no lo sabe' : '',
    d.af ? AF_TEXTO[d.af] : '',
    d.at ? 'anticoagulante o antiagregante' : '',
    d.on ? 'osteonecrosis o artropatía de Jaccoud conocidas' : '',
    d.ry ? 'fenómeno de Raynaud' : '',
    d.av ? AV_TEXTO[d.av] : '',
  ].filter(Boolean);
}

// Líneas de recomendación según el payload (fase 5 y prompt), con sus citas.
export function lineasRecomendacionLES(d) {
  const t = LES.textos;
  if (d.es === 'sospecha') {
    return [d.rs ? t.derivar : t.sinRasgos, d.fd ? t.farmaco : ''].filter(Boolean);
  }
  return [
    t.ejercicio,
    t.antesEmpezar,
    d.on ? t.especialista : '',
    enBrote(d) ? t.brote : '',
    t.sol,
    d.ry ? t.raynaud : '',
    t.fiebre,
    d.af === 'apl' || d.af === 'saf' ? t.antifosfolipidos : '',
    riesgoOsteonecrosis(d) ? t.osteonecrosis : '',
    t.tabaco,
    t.medico,
  ].filter(Boolean);
}

const _estadoTexto = d => (d.es === 'diagnosticado' ? 'diagnosticado' : 'sospecha');

// 📋 Notas: una línea.
export function lineaNotasLES(d) {
  const partes = [_estadoTexto(d), ...datosLES(d),
    d.es === 'sospecha' && d.rs != null ? `rasgos ${d.rs}/5` : '',
    d.es === 'sospecha' && d.rs ? 'derivar a su médico de atención primaria' : '',
    d.fd ? 'tras un fármaco nuevo' : ''].filter(Boolean);
  return `🦋 LUPUS: ${partes.join(' · ')}`;
}

// 📄 Informe (paciente o médico): lenguaje llano y, con la sospecha, sin la
// palabra lupus (el fisio no diagnostica). { titulo, lineas }.
export function informeLES(d) {
  if (d.es === 'diagnosticado') {
    const tto = [d.gc && d.gc !== 'no' && d.gc !== 'ns' ? 'corticoides' : '', d.is === 'si' ? 'inmunosupresores' : ''].filter(Boolean);
    const lineas = [`Lupus eritematoso sistémico (diagnosticado)${tto.length ? `, en tratamiento con ${tto.join(' e ')}` : ''}.`];
    if (d.af === 'saf') lineas.push('Síndrome antifosfolípido.');
    else if (d.af === 'apl') lineas.push('Anticuerpos antifosfolípido positivos.');
    return { titulo: 'LUPUS ERITEMATOSO SISTÉMICO', lineas };
  }
  const lineas = [];
  if (d.rs) lineas.push('Se recomienda valoración por su médico de atención primaria.');
  if (d.fd) lineas.push('Comentar con quien lo recetó el fármaco que empezó antes de los síntomas.');
  return { titulo: 'RECOMENDACIÓN DE VALORACIÓN MÉDICA', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
// Tampoco «(inferencia, sin fuente propia)», que es una nota para el fisioterapeuta.
const _sinCitas = s => s.replace(/\s*\([^()]*\d{4}[^()]*\)/g, '').replace(/\s*\(inferencia, sin fuente propia\)/g, '');
export function bloqueLESIA(d) {
  const datos = datosLES(d);
  return [
    'Lupus (condición especial marcada por el fisioterapeuta):',
    `  · Estado: ${_estadoTexto(d)}`,
    datos.length ? `  · Datos: ${datos.join('; ')}` : '',
    d.es === 'sospecha' && d.rs != null ? `  · Rasgos que justifican una valoración médica: ${d.rs} de 5 «sí»` : '',
    d.es === 'sospecha' ? '  · Es una sospecha: no escribas que el paciente tiene un lupus; el diagnóstico es médico.' : '',
    `  · Consideraciones para el plan: ${lineasRecomendacionLES(d).map(_sinCitas).join(' ')}`,
  ].filter(Boolean).join('\n');
}
