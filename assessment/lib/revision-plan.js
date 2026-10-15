// Revisión automática del plan detallado con IA (Fase L, L4; decisión 110 de
// docs/plan-tratamiento.md). Como lib/revision-informe.js: puntos a revisar,
// nunca una nota; no cambian el texto. Puro, sin red ni IA.
//
// Excepción a la costumbre de esa revisión (cada regla después de verla fallar
// en un informe real): estas cinco son de seguridad y van desde el primer día,
// porque el programa para casa no se comparte sin marcarlas como revisadas.
//
// revisarPlan(texto, { esqueleto, escalon, alarmas, noElegidas, derivar, independientes })
//   esqueleto: los textos que la app construye (sesión, mes y casa) — lo citado
//   escalon: número del escalón de terapia manual elegido (1–4)
//   alarmas: frases de la red de seguridad del programa para casa
//   noElegidas / derivar: nombres de hipótesis que el plan no trata
//   independientes: nombres de los síntomas independientes («P3 · Zona lumbar»)
// → [{ id, nivel: 'alto'|'medio', mensaje, cita? }]
import { LIMITE_ESCALON, seccionesPlan, tieneMarca, normalizar } from './plan-ia.js';

const recorte = t => { const s = String(t).replace(/^[-*•]\s+/, '').trim(); return s.length > 180 ? `${s.slice(0, 177)}…` : s; };
const lineas = t => String(t || '').split('\n').map(l => l.trim()).filter(l => l && !/^#/.test(l));

// ── 1. Volumen sin marcar ─────────────────────────────────────────────────────
// Una cifra con unidad de dosis que no está en el esquema y cuya línea no
// lleva «(sugerencia de la IA)».
const UNIDADES = [
  [/^series?$/, 'serie'], [/^(?:repeticiones?|reps?)$/, 'rep'], [/^(?:veces|vez)$/, 'vez'],
  [/^(?:s|seg|segundos?)$/, 's'], [/^(?:min|minutos?)$/, 'min'], [/^(?:h|horas?)$/, 'h'], [/^d[ií]as?$/, 'dia'],
];
const RE_CIFRA = /(\d+(?:[.,]\d+)?(?:\s*[–-]\s*\d+(?:[.,]\d+)?)?)\s*(series?|repeticiones?|reps?|veces|vez|segundos?|seg|s|minutos?|min|horas?|h|d[ií]as?)(?![\wáéíóúñ])/gi;
const RE_POR = /\b\d+\s*[x×]\s*\d+\b/gi;
function cifras(t) {
  const out = [];
  for (const m of String(t).matchAll(RE_CIFRA)) {
    const u = m[2].toLowerCase();
    const raiz = UNIDADES.find(([re]) => re.test(u))?.[1];
    if (raiz) out.push(`${m[1].replace(/\s+/g, '').replace('–', '-').replace(',', '.')} ${raiz}`);
  }
  for (const m of String(t).matchAll(RE_POR)) out.push(m[0].replace(/\s+/g, '').replace('×', 'x').toLowerCase());
  return out;
}

// ── 3. Técnica por encima del escalón ────────────────────────────────────────
const ROMANOS = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
const RE_GRADO = /[Gg]rados?\s+((?:IV|V|I{1,3})[+−-]*(?:\s*(?:,|y|a|o|–|-)\s*(?:IV|V|I{1,3})[+−-]*)*)/g;
const negado = (l, i) => /\b(sin|nada de|no|nunca|ni|evit\w*|prohib\w*|descart\w*)\b/i.test(l.slice(Math.max(0, i - 50), i));

function porEncima(l, escalon) {
  const lim = LIMITE_ESCALON[escalon] || LIMITE_ESCALON[1];
  for (const m of l.matchAll(RE_GRADO)) {
    const max = Math.max(...(m[1].match(/IV|V|I{1,3}/g) || []).map(r => ROMANOS[r]));
    if (max > lim.grado && !negado(l, m.index)) return `grado ${m[1].trim()}`;
  }
  let m = l.match(/\b(thrust|HVLA|manipulaci[oó]n de alta velocidad|alta velocidad)\b/i);
  if (m && !negado(l, m.index)) return m[1];
  if (!lim.limitePasivo) {
    m = l.match(/\b(sobrepresi[oó]n|l[ií]mite pasivo)\b/i);
    if (m && !negado(l, m.index)) return m[1];
  }
  return null;
}

// ── 2. Fuentes ────────────────────────────────────────────────────────────────
// «Autor 2021», «Autor y Autor 2005», «Autor et al. 2019», «(Autor, 2019)», NICE…
const RE_FUENTE = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñü'-]+)(?:\s+(?:y|e|&)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñü'-]+|\s+et al\.?)?,?\s+\(?((?:19|20)\d{2})\b/g;
const RE_GUIA = /\b(NICE|APTA|JOSPT|KNGF|Cochrane)\b/g;
const NO_AUTOR = new Set(['Sesión', 'Sesiones', 'Semana', 'Semanas', 'Plan', 'Nivel', 'Día', 'Días', 'En', 'Desde', 'Hasta', 'Octubre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Noviembre', 'Diciembre']);

export function revisarPlan(texto, { esqueleto = '', escalon = 1, alarmas = [], noElegidas = [], derivar = [], independientes = [] } = {}) {
  const puntos = [];
  const sec = seccionesPlan(texto);
  const sesionMes = [sec['SESIÓN'] || '', sec['PLAN DEL MES'] || ''].join('\n');
  const casa = sec['PROGRAMA PARA CASA'];

  // Secciones: sin el programa para casa no hay red de seguridad que comprobar
  const faltan = ['SESIÓN', 'PLAN DEL MES', 'PROGRAMA PARA CASA'].filter(s => sec[s] == null);
  if (faltan.length) puntos.push({ id: 'secciones', nivel: 'alto', mensaje: `Falta ${faltan.length > 1 ? 'las secciones' : 'la sección'} ${faltan.join(', ')}: el plan parece incompleto.` });

  // 1. Volumen sin marcar
  const enEsqueleto = new Set(cifras(esqueleto));
  for (const l of lineas(texto)) {
    if (tieneMarca(l)) continue;
    const nuevas = cifras(l).filter(c => !enEsqueleto.has(c));
    if (nuevas.length) puntos.push({ id: 'volumen', nivel: 'medio', mensaje: `Cifra que no está en el esquema y no va marcada como sugerencia de la IA (${nuevas.join(', ')}): ¿de dónde sale?`, cita: recorte(l) });
  }

  // 2. Fuentes que el esquema no cita
  const esq = normalizar(esqueleto);
  const vistas = new Set();
  for (const l of lineas(texto)) {
    const nombres = [...l.matchAll(RE_FUENTE)].map(m => m[1]).filter(n => !NO_AUTOR.has(n))
      .concat([...l.matchAll(RE_GUIA)].map(m => m[1]));
    for (const n of nombres) {
      if (esq.includes(normalizar(n)) || vistas.has(n)) continue;
      vistas.add(n);
      puntos.push({ id: 'fuente', nivel: 'alto', mensaje: `Cita una fuente que el esquema no cita (${n}): la IA no puede atribuir nada a fuentes que PhysiQ no ha leído.`, cita: recorte(l) });
    }
  }

  // 3. Técnica por encima del escalón elegido (sesión y mes; el programa para
  // casa no lleva terapia manual)
  for (const l of lineas(sesionMes)) {
    const t = porEncima(l, escalon);
    if (t) puntos.push({ id: 'escalon', nivel: 'alto', mensaje: `Técnica por encima del escalón elegido (${t}): el escalón ${escalon} no la admite.`, cita: recorte(l) });
  }

  // 4. Red de seguridad en el programa para casa, copiada tal cual
  if (casa != null) {
    const c = normalizar(casa);
    for (const a of alarmas) {
      if (!c.includes(normalizar(a))) puntos.push({ id: 'red', nivel: 'alto', mensaje: `Falta en el programa para casa la red de seguridad, o no está copiada tal cual: «${a}» (al compartirlo se añade igualmente).` });
    }
  }

  // 5. Hipótesis que no se tratan y síntomas independientes
  const negacion = /\b(no se trata|no trata|no tratamos|no forma parte|no se incluye|no incluye|aparte|independiente|segundo problema|fuera de este plan|no es objeto)\b/i;
  for (const l of lineas(texto)) {
    const nl = normalizar(l);
    for (const n of derivar) {
      if (nl.includes(normalizar(n)) && !negacion.test(l)) puntos.push({ id: 'derivar', nivel: 'alto', mensaje: `Planifica una hipótesis que se deriva (${n}): no tiene tratamiento de fisioterapia hasta el diagnóstico médico.`, cita: recorte(l) });
    }
    for (const n of noElegidas) {
      if (nl.includes(normalizar(n)) && !negacion.test(l)) puntos.push({ id: 'no-elegida', nivel: 'medio', mensaje: `Nombra una hipótesis que no se eligió para este plan (${n}): comprueba que no la trata.`, cita: recorte(l) });
    }
    for (const n of independientes) {
      const zona = normalizar(n.replace(/^P\d+\s*·\s*/, ''));
      if (zona && nl.includes(zona) && !negacion.test(l)) puntos.push({ id: 'independiente', nivel: 'medio', mensaje: `Nombra el síntoma independiente (${n}) sin decir que este plan no lo trata: comprueba que no le pone ejercicios.`, cita: recorte(l) });
    }
  }
  return puntos;
}

// Lo que ninguna regla ve: siempre a la vista, cada una con «Revisado».
export function comprobacionesPlan({ posq = false, transcripcion = false } = {}) {
  return [
    'Cada ejercicio y técnica es razonable para este paciente y cabe en el nivel elegido.',
    'Las cifras marcadas «Sugerencia de la IA» (series, repeticiones, tiempos) son las que quieres prescribir: cámbialas si no.',
    'El programa para casa se entiende sin tus explicaciones y dice qué hacer, cuántas veces y cuándo parar.',
    ...(posq ? ['Nada choca con las restricciones del protocolo del cirujano.'] : []),
    ...(transcripcion ? ['Lo que toma de la consulta (horarios, actividades, objetivos) es correcto.'] : []),
  ];
}

export const clavePuntoPlan = p => `${p.id}|${p.cita || p.mensaje}`;
export const claveComprobacionPlan = t => `c|${t}`;

export function resumenRevisadosPlan(puntos = [], comprobaciones = [], revisados = []) {
  const hechos = new Set(revisados || []);
  const pendPuntos = puntos.filter(p => !hechos.has(clavePuntoPlan(p)));
  const pendComprob = comprobaciones.filter(t => !hechos.has(claveComprobacionPlan(t)));
  return {
    puntos: puntos.length,
    puntosPendientes: pendPuntos.length,
    altosPendientes: pendPuntos.filter(p => p.nivel === 'alto').length,
    comprobaciones: comprobaciones.length,
    comprobacionesPendientes: pendComprob.length,
    total: puntos.length + comprobaciones.length,
    pendientes: pendPuntos.length + pendComprob.length,
  };
}
