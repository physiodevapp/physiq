// ============================================================
// PhysiQ-Assessment · lib/disautonomia.js
// Condición especial «Disautonomía / POTS» (Fase P, docs/pots.md). Funciones
// puras: estado vacío, qué se ve según el estado, la prueba de bipedestación
// activa (FC de referencia, corte por edad, 2 medidas seguidas después del
// primer minuto, hipotensión ortostática), payload `ds` y los textos de
// 📋 Notas, 📄 Informe e informe con IA. El contenido clínico (preguntas,
// protocolo, textos con sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_DISAUTONOMIA } from '../data/comun.js';

export const DS = SIS_DISAUTONOMIA.disautonomia;

export const ESTADOS_DS = { diagnosticada: 'Diagnosticada', sospecha: 'Sospecha' };
export const TIPOS_DS = { pots: 'POTS', ho: 'Hipotensión ortostática', otra: 'Otra o no lo sabe' };

// Filas de la prueba: tumbado y los minutos de pie (Raj 2022).
export const FILAS_PRUEBA = ['tumbado', ...DS.prueba.minutos.map(m => `m${m}`)];

// `bipedestacion`: null = sin hacer; si no, { prep: { reposo, sala, vejiga },
// tumbado: { fc, tas, tad }, m1…m10: { fc, tas, tad, sintomas } }.
export const disautonomiaVacia = () => ({ estado: '', tipo: '', sospecha: {}, bipedestacion: null });
export const pruebaVacia = () => ({ prep: {}, ...Object.fromEntries(FILAS_PRUEBA.map(f => [f, {}])) });

export const dsActiva = ds => !!ds?.estado;
export const sospechaVisible = ds => ds?.estado === 'sospecha';

// Sesiones anteriores o datos incompletos → la forma completa.
export function normalizarDisautonomia(ds) {
  const v = { ...disautonomiaVacia(), ...(ds || {}) };
  if (!ESTADOS_DS[v.estado]) v.estado = '';
  if (!TIPOS_DS[v.tipo]) v.tipo = '';
  if (!v.sospecha || typeof v.sospecha !== 'object') v.sospecha = {};
  if (v.bipedestacion !== null) {
    if (typeof v.bipedestacion !== 'object') v.bipedestacion = null;
    else v.bipedestacion = { ...pruebaVacia(), ...v.bipedestacion };
  }
  return v;
}

// ── Patrón de sospecha ───────────────────────────────────────
// Solo las dos primeras suman a favor; la tercera (fármacos, reposo, pérdida
// de volumen) es del diferencial (`diferencial`, Raj 2020, tabla 5).
export const siSospecha = ds => DS.sospecha.filter(q => !q.diferencial && ds?.sospecha?.[q.id] === 'SI').length;
export const respondidasSospecha = ds => DS.sospecha.filter(q => ds?.sospecha?.[q.id]).length;
export const otraCausa = ds => DS.sospecha.some(q => q.diferencial && ds?.sospecha?.[q.id] === 'SI');

// ── Prueba de bipedestación activa ───────────────────────────
const num = v => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));

// Corte por edad (Raj 2020, rec. 26; Vernino 2021): 40 lpm de 12 a 19 años,
// 30 desde los 20; por debajo de 12 no está definido. null sin edad.
export function cortePrueba(edad) {
  if (edad === null || edad === undefined || isNaN(edad)) return null;
  if (edad < 12) return { menor12: true };
  return edad <= 19 ? { corte: 40, grupo: '12–19 años' } : { corte: 30, grupo: 'adultos' };
}

// Resultado. estado:
//   'sin-hacer' | 'menor12' | 'sin-edad' | 'incompleta'
//   'ho'         caída de la TA de pie (hipotensión ortostática: no es POTS)
//   'compatible' ≥ corte en 2 medidas seguidas después del primer minuto, sin HO
//   'repetir'    solo la última medida supera el corte (Raj 2020, p. 361)
//   'no-corte'
// Además: referencia (FC tumbado, o 60 si es menor), aumento por minuto,
// dfc (el aumento mantenido máximo: el menor de cada par de medidas seguidas),
// sintomas (alguna medida de pie con síntomas), reposoAlta (FC tumbado > 100),
// tasBaja (TAS tumbado < 90).
export function resultadoPrueba(b, edad) {
  if (!b) return { estado: 'sin-hacer' };
  const t = b.tumbado || {};
  const fc0 = num(t.fc), tas0 = num(t.tas), tad0 = num(t.tad);
  const extra = { reposoAlta: fc0 != null && fc0 > 100, tasBaja: tas0 != null && tas0 < 90 };
  const c = cortePrueba(edad);
  if (c?.menor12) return { estado: 'menor12', ...extra };
  const referencia = fc0 == null ? null : Math.max(fc0, 60);
  const filas = DS.prueba.minutos.map(m => {
    const f = b[`m${m}`] || {};
    const fc = num(f.fc), tas = num(f.tas), tad = num(f.tad);
    return { min: m, fc, tas, tad, sintomas: !!f.sintomas, aumento: fc != null && referencia != null ? fc - referencia : null };
  });
  const sintomas = filas.some(f => f.sintomas);
  // Hipotensión ortostática: a partir del minuto 3 (la caída del primer
  // minuto, la hipotensión inicial, no excluye el POTS: Raj 2020), TAS −20,
  // TAD −10 o TAS por debajo de 90 (Brignole 2018, p. 1902).
  const ho = filas.filter(f => f.min >= 3).some(f =>
    (f.tas != null && ((tas0 != null && tas0 - f.tas >= 20) || f.tas < 90)) ||
    (f.tad != null && tad0 != null && tad0 - f.tad >= 10));
  const base = { referencia, filas, sintomas, ho, ...extra, corte: c?.corte ?? null, grupo: c?.grupo ?? null };
  if (ho) return { ...base, estado: 'ho', dfc: null };
  if (referencia == null) return { ...base, estado: 'incompleta', dfc: null };
  if (!c) return { ...base, estado: 'sin-edad', dfc: null };
  // Medidas después del primer minuto, en orden; «seguidas» = contiguas en la lista
  const tras1 = filas.filter(f => f.min > 1);
  let dfc = null, mantenido = false;
  for (let i = 0; i + 1 < tras1.length; i++) {
    const a = tras1[i].aumento, d = tras1[i + 1].aumento;
    if (a == null || d == null) continue;
    const m = Math.min(a, d);
    dfc = dfc == null ? m : Math.max(dfc, m);
    if (m >= c.corte) mantenido = true;
  }
  const medidas = tras1.filter(f => f.aumento != null);
  if (mantenido) return { ...base, estado: 'compatible', dfc };
  const ultima = tras1[tras1.length - 1];
  const antes = tras1[tras1.length - 2];
  if (ultima.aumento != null && ultima.aumento >= c.corte && !(antes?.aumento != null && antes.aumento >= c.corte)) {
    return { ...base, estado: 'repetir', dfc };
  }
  if (medidas.length < 2) return { ...base, estado: 'incompleta', dfc };
  return { ...base, estado: 'no-corte', dfc };
}

// Cifras de cada medida en una línea, para los datos ampliados del informe
// con IA (no van al payload). '' sin la prueba o sin cifras.
export function medidasPruebaTexto(b) {
  if (!b) return '';
  const partes = FILAS_PRUEBA.map(f => {
    const x = b[f] || {};
    const fc = num(x.fc), tas = num(x.tas), tad = num(x.tad);
    if (fc == null && tas == null && tad == null) return '';
    const ta = tas != null || tad != null ? `, TA ${tas ?? '—'}/${tad ?? '—'} mmHg` : '';
    return `${f === 'tumbado' ? 'Tumbado' : `De pie ${f.slice(1)} min`}: FC ${fc ?? '—'} lpm${ta}${x.sintomas ? ' (con síntomas)' : ''}`;
  }).filter(Boolean);
  return partes.join(' · ');
}

// ── Payload `ds` ─────────────────────────────────────────────
// Solo con la condición activa (sin ella, el payload y la huella de los
// informes con IA anteriores no cambian). es: estado, ti: cuál (diagnosticada),
// pb: prueba hecha, dfc: aumento mantenido máximo (lpm), ho: hipotensión
// ortostática, ot: compatible con taquicardia ortostática (true/false/null),
// cs: «sí» del patrón de sospecha (null = sin preguntar).
export function dsPayload(ds, edad) {
  if (!dsActiva(ds)) return null;
  const r = resultadoPrueba(ds.bipedestacion, edad);
  const hecha = !!ds.bipedestacion;
  const concluyente = ['ho', 'compatible', 'no-corte'].includes(r.estado);
  return {
    es: ds.estado,
    ti: ds.estado === 'diagnosticada' ? (ds.tipo || 'otra') : '',
    pb: hecha,
    dfc: r.dfc ?? null,
    ho: hecha && concluyente ? r.estado === 'ho' : null,
    ot: hecha && concluyente ? r.estado === 'compatible' : null,
    cs: sospechaVisible(ds) && respondidasSospecha(ds) ? siSospecha(ds) : null,
  };
}

// ── Textos compartidos ───────────────────────────────────────
const _tipoMinus = ti => (ti === 'pots' ? 'POTS' : TIPOS_DS[ti].replace(/^\S/, c => c.toLowerCase()));
const _estadoTexto = d => (d.es === 'diagnosticada'
  ? `diagnosticada${d.ti && d.ti !== 'otra' ? ` (${_tipoMinus(d.ti)})` : ''}`
  : 'sospecha');
// Resultado de la prueba en una frase (sin fuentes).
export function textoPrueba(d) {
  if (!d.pb) return '';
  if (d.ho) return 'bipedestación activa: caída de la tensión (hipotensión ortostática)';
  if (d.ot) return `bipedestación activa: aumento de la FC de ${d.dfc} lpm mantenido, sin hipotensión ortostática (compatible con taquicardia ortostática)`;
  if (d.ot === false) return `bipedestación activa: no llega al corte${d.dfc != null ? ` (aumento mantenido de ${d.dfc} lpm)` : ''}`;
  return 'bipedestación activa sin completar';
}

// Líneas de recomendación según el payload (fase 5 y prompt).
export function lineasRecomendacionDs(d) {
  const t = DS.textos;
  return [
    d.es === 'diagnosticada' && d.ti === 'ho' ? '' : t.ejercicio,
    t.adaptaciones,
    d.es === 'sospecha' && d.ot ? t.derivar : '',
    d.ho ? t.ho : '',
    t.seguridad,
    t.medico,
  ].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasDs(d) {
  const partes = [_estadoTexto(d), textoPrueba(d),
    d.cs != null ? `patrón ortostático ${d.cs}/2` : '',
    d.es === 'sospecha' && d.ot ? 'derivar a su médico de atención primaria' : '',
    d.ho ? 'hipotensión ortostática: valoración médica' : ''].filter(Boolean);
  return `🫀 DISAUTONOMÍA: ${partes.join(' · ')}`;
}

// 📄 Informe (paciente o médico): lenguaje llano y, con la sospecha, sin la
// palabra POTS (el fisio no diagnostica). { titulo, lineas }.
export function informeDs(d) {
  if (d.es === 'diagnosticada') {
    const nombre = { pots: 'Síndrome de taquicardia postural ortostática (diagnosticado).', ho: 'Hipotensión ortostática (diagnosticada).', otra: 'Disautonomía (diagnosticada).' }[d.ti || 'otra'];
    return { titulo: 'DISAUTONOMÍA', lineas: [nombre] };
  }
  const lineas = [];
  if (d.ot) lineas.push('Aumento de la frecuencia cardiaca al ponerse de pie: se recomienda valoración médica.');
  if (d.ho) lineas.push('Descenso de la tensión arterial al ponerse de pie: se recomienda valoración médica.');
  return { titulo: 'RESPUESTA AL PONERSE DE PIE', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
const _sinCitas = s => s.replace(/\s*\([^()]*\d{4}[^()]*\)/g, '');
export function bloqueDsIA(d) {
  return [
    'Disautonomía (condición especial marcada por el fisioterapeuta):',
    `  · Estado: ${_estadoTexto(d)}`,
    textoPrueba(d) ? `  · Prueba de ${textoPrueba(d)}` : '',
    d.cs != null ? `  · Patrón de intolerancia ortostática: ${d.cs} de 2 «sí»` : '',
    d.es === 'sospecha' ? '  · Es una sospecha: no escribas que el paciente tiene un POTS; el diagnóstico es médico.' : '',
    `  · Consideraciones para el plan: ${lineasRecomendacionDs(d).map(_sinCitas).join(' ')}`,
  ].filter(Boolean).join('\n');
}

// ── Reloj de la prueba ───────────────────────────────────────
// Ayuda a tomar cada medida en su minuto: no rellena ni cierra filas.
// `bipedestacion.reloj`: null (sin reloj) o { fase: 'reposo' | 'pie',
// inicio: ms (Date.now() al pulsar), tomas: { m3: s, … } } — `tomas`, los
// segundos de pie en que se escribió la primera FC de cada fila. El tiempo se
// calcula siempre desde `inicio`, no contando segundos, así que una pantalla
// apagada o la app en segundo plano no lo desajustan. Solo interfaz: no lo lee
// ni el payload, ni los resúmenes, ni el informe con IA.
export const RELOJ = {
  reposoS: 5 * 60,                              // tumbado al menos 5 min (Raj 2020, rec. 4)
  finS: DS.prueba.minutos[DS.prueba.minutos.length - 1] * 60 + 60,  // un minuto para la última medida
  margenS: 30,                                  // una toma más lejos de su minuto se señala
  caducaS: 30 * 60,                             // un reloj de hace más de 30 min ya no es de esta prueba
};

const mmss = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export const textoTiempo = s => mmss(Math.max(0, s));

// Estado en el instante `ahora` (ms). null sin reloj.
//   reposo: { fase, s, restante, cumplido, fila: 'tumbado' cuando se cumple }
//   pie:    { fase, s, fila (la que toca ahora o null antes del minuto 1),
//             proxima: { fila, min, en } | null, terminado }
// `marcas`: cuántos avisos han llegado ya (fin del reposo, o cada minuto de
// medida), para avisar una sola vez de cada uno.
export function estadoReloj(reloj, ahora) {
  if (!reloj || typeof reloj.inicio !== 'number' || !['reposo', 'pie'].includes(reloj.fase)) return null;
  const s = Math.max(0, (ahora - reloj.inicio) / 1000);
  if (s > RELOJ.caducaS) return { fase: reloj.fase, s, caducado: true, marcas: 0 };
  if (reloj.fase === 'reposo') {
    const cumplido = s >= RELOJ.reposoS;
    return { fase: 'reposo', s, restante: Math.max(0, RELOJ.reposoS - s), cumplido, fila: cumplido ? 'tumbado' : null, marcas: cumplido ? 1 : 0 };
  }
  const minutos = DS.prueba.minutos;
  const pasados = minutos.filter(m => s >= m * 60);
  const ultimo = pasados[pasados.length - 1];
  const siguiente = minutos.find(m => s < m * 60);
  return {
    fase: 'pie', s,
    fila: ultimo != null && s < RELOJ.finS ? `m${ultimo}` : null,
    proxima: siguiente != null ? { fila: `m${siguiente}`, min: siguiente, en: siguiente * 60 - s } : null,
    terminado: s >= RELOJ.finS,
    marcas: pasados.length,
  };
}

// Segundos de pie de una toma alejada más de `margenS` de su minuto; null si
// está a tiempo o no hay toma.
export function tomaFueraDeTiempo(fila, t) {
  if (t == null || !/^m\d+$/.test(fila)) return null;
  return Math.abs(t - Number(fila.slice(1)) * 60) > RELOJ.margenS ? t : null;
}
