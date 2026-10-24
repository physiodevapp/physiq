// ============================================================
// PhysiQ-Assessment · lib/embarazo.js
// Condición especial «Embarazo o posparto» (Fase P,
// docs/embarazo-posparto.md). Funciones puras: estado vacío, semanas, qué
// preguntas se ven por estado y semanas, la regla de la tensión arterial
// (NICE NG201), los bloques de ánimo y suelo pélvico, las líneas de la 4b
// (supino, Gaenslen), payload `em` y los textos de 📋 Notas, 📄 Informe e
// informe con IA. El contenido clínico (preguntas y textos con sus fuentes)
// vive en data/comun.js.
// ============================================================

import { SIS_EMBARAZO } from '../data/comun.js';
import { semanasCirugia } from './posquirurgico.js';

export const EM = SIS_EMBARAZO.embarazo;

export const ESTADOS_EM = EM.estados;
export const CASILLAS_EM = EM.casillas.map(c => c.id);
// Mes y medio de margen sobre los 12 meses: más allá, la tarjeta ya no aplica.
export const SEMANAS_POSPARTO_MAX = 52;

// `animo`: { w1, w2: 'SI'|'NO' } · `suelo`: { sp1…sp3: 'SI'|'NO' } (los dos estados).
export const embarazoVacio = () => ({
  estado: '', semanas: null, familiar: '', fecha: '', semanasAprox: null, parto: '',
  esfinter: false, occipitoposterior: false, lactancia: '', animo: {}, suelo: {},
});

export const emActivo = em => !!em?.estado;
export const emEmbarazada = em => em?.estado === 'embarazada';
export const emPosparto = em => em?.estado === 'posparto';

const _num = v => (v === null || v === undefined || v === '' || !Number.isFinite(+v) || +v < 0 ? null : Math.floor(+v));
const _respuestas = (obj, lista) => {
  const r = obj && typeof obj === 'object' ? obj : {};
  return Object.fromEntries(lista.filter(q => r[q.id] === 'SI' || r[q.id] === 'NO').map(q => [q.id, r[q.id]]));
};

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarEmbarazo(em) {
  const v = { ...embarazoVacio(), ...(em || {}) };
  if (!ESTADOS_EM[v.estado]) v.estado = '';
  v.semanas = _num(v.semanas);
  v.semanasAprox = _num(v.semanasAprox);
  if (!EM.familiar[v.familiar]) v.familiar = '';
  if (!EM.partos[v.parto]) v.parto = '';
  if (!EM.lactancia[v.lactancia]) v.lactancia = '';
  if (typeof v.fecha !== 'string') v.fecha = '';
  for (const k of CASILLAS_EM) v[k] = v[k] === true;
  v.animo = _respuestas(v.animo, EM.animo);
  v.suelo = _respuestas(v.suelo, EM.suelo);
  return v;
}

// ── Semanas ──────────────────────────────────────────────────
// Con «Embarazada», las de gestación; con «Posparto», las que han pasado
// desde el parto (de la fecha, o las aproximadas), como en la tarjeta «Cirugía».
export const semanasPosparto = (em, hoy = new Date()) => semanasCirugia({ fecha: em?.fecha, semanasAprox: em?.semanasAprox }, hoy);
export function semanasEM(em, hoy = new Date()) {
  if (emEmbarazada(em)) return em.semanas;
  if (emPosparto(em)) return semanasPosparto(em, hoy);
  return null;
}

const _clave = em => (emEmbarazada(em) ? 'embarazo' : emPosparto(em) ? 'posparto' : '');
// Con la tarjeta de la osteoporosis marcada con la causa del embarazo o la
// lactancia, la sospecha de la PLO ya está confirmada (H1).
const _ploConfirmada = op => op?.estado === 'diagnosticada' && op?.causa === 'plo';

// Pregunta o bandera del sistema (`em` en data/comun.js). Sin `em`, siempre.
// Sin las semanas anotadas, salen todas las del estado: un umbral sin dato
// nunca esconde una urgencia.
export function elementoEMVisible(x, em, op, hoy = new Date()) {
  if (!x || typeof x === 'string' || !x.em) return true;
  const cond = x.em[_clave(em)];
  if (!cond) return false;
  if (x.em.sinPLO && _ploConfirmada(op)) return false;
  const w = semanasEM(em, hoy);
  if (w == null) return true;
  if (cond.desde != null && w < cond.desde) return false;
  if (cond.hasta != null && w > cond.hasta) return false;
  return true;
}

// ── Regla de la tensión arterial (decisión 5; NICE NG201) ────
// ≥ 160/110 en el embarazo → el mismo día (1.2.27, sin límite de semanas);
// primera ≥ 140/90 desde la semana 20 → en 24 h (1.2.26). Lee las constantes
// de la fase 1. Antes de la semana 20, ≥ 140/90 es hipertensión crónica (1.2.25,
// solo una línea en la tarjeta). 'grave' | 'alta' | 'cronica' | 'sinSemanas'
// (≥ 140/90 sin semanas) | null.
export function reglaTA(em, sv) {
  if (!emEmbarazada(em)) return null;
  const tas = Number(sv?.tas), tad = Number(sv?.tad);
  const ok = v => Number.isFinite(v) && v > 0;
  if (!ok(tas) && !ok(tad)) return null;
  if ((ok(tas) && tas >= 160) || (ok(tad) && tad >= 110)) return 'grave';
  if ((ok(tas) && tas >= 140) || (ok(tad) && tad >= 90)) {
    if (em.semanas == null) return 'sinSemanas';
    return em.semanas >= 20 ? 'alta' : 'cronica';
  }
  return null;
}
export const urgenciasEM = (em, sv) => (reglaTA(em, sv) === 'grave' ? [EM.textos.taGrave] : []);
export const derivacionesEM = (em, sv) => (reglaTA(em, sv) === 'alta' ? [EM.textos.taAlta] : []);

// ── Bloques de la fase 2 ─────────────────────────────────────
export const animoPositivo = em => EM.animo.some(q => em?.animo?.[q.id] === 'SI');
export const animoRespondido = em => EM.animo.some(q => em?.animo?.[q.id]);
export const sueloRespondido = em => EM.suelo.some(q => em?.suelo?.[q.id]);
export const sueloSintomas = em => EM.suelo.filter(q => em?.suelo?.[q.id] === 'SI').map(q => q.id);
// Factores de riesgo de NICE NG210 (1.3.12): un familiar de primer grado con
// disfunción desde la semana 20, o en el parto instrumental, occipitoposterior
// o lesión del esfínter anal.
export function riesgoSuelo(em) {
  if (emEmbarazada(em)) return em.familiar === 'SI' && (em.semanas ?? 0) >= 20;
  if (emPosparto(em)) return em.parto === 'instrumental' || !!em.occipitoposterior || !!em.esfinter;
  return false;
}

// ── Fase 4b ──────────────────────────────────────────────────
// T1: desde la semana 20 (ACOG 2020), solo con síntomas (Mottola 2018). Sin
// las semanas, la línea sale: no hacerla de más es más seguro que de menos.
export function lineaSupino(em) {
  if (!emEmbarazada(em)) return '';
  return em.semanas == null || em.semanas >= 20 ? EM.textos.supino : '';
}
// T10 (Simonds 2022): sin Gaenslen las 4 primeras semanas, ni después con dolor de la sínfisis.
export function lineaGaenslen(em, hoy = new Date()) {
  if (!emPosparto(em)) return '';
  const w = semanasPosparto(em, hoy);
  return w == null || w < 4 ? EM.textos.gaensMenos4 : EM.textos.gaensMas4;
}

// ── Pendientes del modo breve ────────────────────────────────
// Las semanas deciden qué preguntas salen; sin ellas, salen todas.
export function pendientesEM(em) {
  if (emEmbarazada(em) && em.semanas == null) return [{ fase: 1, ancla: 'cardEmbarazo', texto: 'Semanas de gestación sin registrar (tarjeta «Embarazo o posparto»)' }];
  if (emPosparto(em) && semanasPosparto(em) == null) return [{ fase: 1, ancla: 'cardEmbarazo', texto: 'Fecha del parto sin registrar (tarjeta «Embarazo o posparto»)' }];
  return [];
}

// ── Payload `em` ─────────────────────────────────────────────
// Solo con la tarjeta marcada. es: estado; sp: síntomas de suelo pélvico
// ({ o, h, b } orina, heces o gases, bulto; null = sin preguntar); rs: riesgo
// de disfunción del suelo pélvico (NG210 1.3.12). Con «Embarazada»: sg semanas
// de gestación, fp familiar con disfunción. Con «Posparto»: ss semanas desde
// el parto, tp tipo de parto, oa esfínter anal, op occipitoposterior, la
// lactancia ('SI'|'NO'|null). Las respuestas de ánimo nunca van (decisión 11).
export function emPayload(em, hoy = new Date()) {
  if (!emActivo(em)) return null;
  const sp = sueloRespondido(em) ? { o: em.suelo.sp1 === 'SI', h: em.suelo.sp2 === 'SI', b: em.suelo.sp3 === 'SI' } : null;
  const comun = { sp, rs: riesgoSuelo(em) };
  if (emEmbarazada(em)) return { es: 'embarazada', sg: em.semanas, fp: em.familiar || null, ...comun };
  return {
    es: 'posparto', ss: semanasPosparto(em, hoy), tp: em.parto || null, oa: !!em.esfinter, op: !!em.occipitoposterior,
    la: em.lactancia || null, ...comun,
  };
}

// ── Textos compartidos (a partir del payload) ────────────────
const TP_TEXTO = { vaginal: 'parto vaginal', instrumental: 'parto vaginal instrumental', cesarea: 'cesárea', ns: 'tipo de parto: no lo sabe' };
const _sem = n => `${n} ${n === 1 ? 'semana' : 'semanas'}`;
const _spAlguno = d => !!d?.sp && (d.sp.o || d.sp.h || d.sp.b);
const _spTexto = d => [d.sp?.o ? 'escapes de orina' : '', d.sp?.h ? 'escapes de gases o heces' : '', d.sp?.b ? 'bulto o peso vaginal' : ''].filter(Boolean).join(', ');

// Datos de la tarjeta en una lista de frases cortas (sin fuentes).
export function datosEM(d) {
  if (d.es === 'embarazada') {
    return [
      d.sg != null ? `${_sem(d.sg)} de gestación` : 'semanas sin registrar',
      d.fp === 'SI' ? 'familiar de primer grado con disfunción del suelo pélvico' : '',
      _spAlguno(d) ? `suelo pélvico: ${_spTexto(d)}` : '',
    ].filter(Boolean);
  }
  return [
    d.ss != null ? `${_sem(d.ss)} desde el parto` : 'fecha del parto sin registrar',
    d.tp ? TP_TEXTO[d.tp] : '',
    d.oa ? 'lesión del esfínter anal' : '',
    d.op ? 'occipitoposterior' : '',
    d.la === 'SI' ? 'da el pecho' : d.la === 'NO' ? 'no da el pecho' : '',
    _spAlguno(d) ? `suelo pélvico: ${_spTexto(d)}` : '',
  ].filter(Boolean);
}

function _lineasSuelo(d) {
  const t = EM.textos;
  if (_spAlguno(d)) return [t.sueloCon, d.sp.h ? t.sueloHeces : ''];
  return [d.rs ? t.sueloRiesgo : ''];
}

// Líneas del recuadro de la fase 5 (y del prompt), con sus citas.
export function lineasRecomendacionEM(d) {
  const t = EM.textos;
  if (d.es === 'embarazada') {
    return [t.dosisEmb, t.precaucionesEmb, t.supinoEmb, t.pararEmb, t.contraindicaciones, t.pelvicaEjercicio, t.terapiaManual,
      ..._lineasSuelo(d), t.sueloDiario, t.diastasisEmb].filter(Boolean);
  }
  return [t.vueltaPp, t.relativasPp, t.noContraPp, d.la === 'SI' ? t.lactanciaPp : '', t.correrPp, t.pelvicaPosparto,
    t.terapiaManual, t.thrustPp, ..._lineasSuelo(d), t.sueloDiario, t.diastasisPp].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasEM(d) {
  const etiqueta = d.es === 'embarazada' ? '🤰 EMBARAZO' : '🤱 POSPARTO';
  const extra = _spAlguno(d) ? 'fisioterapia de suelo pélvico' : d.rs ? 'riesgo de disfunción del suelo pélvico' : '';
  return `${etiqueta}: ${[...datosEM(d), extra].filter(Boolean).join(' · ')}`;
}

// 📄 Informe (paciente o médico): lenguaje llano. { titulo, lineas }.
export function informeEM(d) {
  const lineas = [];
  if (d.es === 'embarazada') {
    lineas.push(d.sg != null ? `Embarazo de ${_sem(d.sg)}.` : 'Embarazo.');
  } else {
    lineas.push(d.ss != null ? `Posparto: ${_sem(d.ss)} desde el parto${d.tp && d.tp !== 'ns' ? ` (${TP_TEXTO[d.tp]})` : ''}.` : 'Posparto.');
  }
  if (_spAlguno(d)) lineas.push('Se recomienda fisioterapia de suelo pélvico.');
  else if (d.rs) lineas.push('Puede beneficiarse de un programa supervisado de suelo pélvico.');
  return { titulo: d.es === 'embarazada' ? 'EMBARAZO' : 'POSPARTO', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
const _sinCitas = s => s.replace(/\s*\([^()]*(\d{4}|NICE (NG|CG)\d+)[^()]*\)/g, '');
export function bloqueEMIA(d) {
  const datos = datosEM(d);
  return [
    `${d.es === 'embarazada' ? 'Embarazo' : 'Posparto'} (condición especial marcada por el fisioterapeuta):`,
    datos.length ? `  · Datos: ${datos.join('; ')}` : '',
    `  · Consideraciones para el plan: ${lineasRecomendacionEM(d).map(_sinCitas).join(' ')}`,
  ].filter(Boolean).join('\n');
}
