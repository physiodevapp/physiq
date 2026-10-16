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
//   independientes: síntomas independientes, «P3 · Zona lumbar» o { nombre, lado }
//   primera: primera sesión de tratamiento (regla neural-primera)
//   fuente: texto de los datos y de la consulta (regla diagnostico-estructural)
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
// «una vez al día», «dos series»: los números escritos también son dosis
// (plan de Andrés, 2026-10: «Una vez al día» en cada ejercicio de casa)
const NUMEROS = { una: 1, un: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10 };
const RE_PALABRA = /\b(una|un|uno|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\s+(series?|repeticiones?|veces|vez)\b/gi;
function cifras(t) {
  // «Descansa 1 minuto. Repite 3 veces» = 3 series (plan 2 de Andrés)
  t = String(t).replace(/\b(repit\w*\s+)(\d+)\s+veces\b/gi, '$1$2 series');
  const out = [];
  for (const m of String(t).matchAll(RE_PALABRA)) {
    out.push(`${NUMEROS[m[1].toLowerCase()]} ${UNIDADES.find(([re]) => re.test(m[2].toLowerCase()))[1]}`);
  }
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

// Primera técnica del bloque de intervención: su subtítulo (si lo hay) y su
// primera línea de lista; la devuelve si es neural (slump, movilización neural…)
const RE_NEURAL = /\b(slump|neural\w*|neurodin\w*|deslizamiento del nervio|tensi[oó]n neural)\b/i;
// Tensor o posición mantenida: lo que Butler deja para cuando el nervio tolera
// carga; unos segundos sin oscilación también cuentan como mantenidos
const RE_MANTENER = /\b(mant[eé]n\w*|mantenid[oa]s?|sost[eé]n\w*|sostenid[oa]s?)\b/i;
const RE_TENSOR = /\b(tensor(?:es)?|en tensi[oó]n)\b/i;
const RE_SEGUNDOS = /\b(\d+(?:\s*[–-]\s*\d+)?)\s*(?:s|seg|segundos)\b/i;
const RE_OSCILA = /\b(oscila\w*|r[ií]tmic\w*|vaiv[eé]n|de un lado a otro|desliz\w*|balance\w*)\b/i;
// «mantener» de sostener la postura, no de «seguir haciendo»: con segundos o una
// postura en su misma frase («mantener el deslizador» no cuenta; plan 2 de Andrés)
function mantenidoEnFrase(l) {
  for (const m of l.matchAll(new RegExp(RE_MANTENER.source, 'gi'))) {
    const ini = Math.max(...[';', '.', ':'].map(c => l.lastIndexOf(c, m.index))) + 1;
    const finRel = l.slice(m.index).search(/[;.:]/);
    const frase = l.slice(ini, finRel < 0 ? l.length : m.index + finRel);
    if (negadoEnFrase(l, m.index)) continue;
    if (RE_SEGUNDOS.test(frase) || /\b(posici[oó]n|postura|en tensi[oó]n)\b/i.test(frase)) return { m, frase };
  }
  return null;
}
// Líneas con su contexto neural: un subpunto sangrado hereda el de su
// ejercicio («1. Movilización del nervio…» → «   - Mantén 3 segundos»)
function lineasNeurales(texto) {
  const out = [];
  let ctx = false;
  for (const raw of String(texto || '').split('\n')) {
    if (!raw.trim()) continue;
    const propio = RE_NEURAL.test(raw) || /\bnervios?\b/i.test(raw);
    // Solo un título de ejercicio (encabezado, negrita o «1.») abre contexto; una
    // viñeta o un párrafo lo heredan (plan 2 de Andrés: el bird-dog colgaba de
    // la viñeta «mantener el deslizador neural…»)
    if (/^(#|\*\*|\d+\.\s)/.test(raw)) ctx = propio;
    if (/^#/.test(raw)) continue;
    out.push({ l: raw.trim(), neural: propio || ctx });
  }
  return out;
}
// Negación solo dentro de la misma frase o inciso («…sin que llegue a doler;
// mantener 3 segundos» no está negado)
const negadoEnFrase = (l, i) => { const ini = Math.max(...[';', '.', ',', ':'].map(c => l.lastIndexOf(c, i))) + 1; return negado(l.slice(ini), i - ini); };
function primeraTecnica(sesion) {
  const ls = String(sesion).split('\n');
  const i = ls.findIndex(l => /^###\s+.*INTERVENCI/i.test(l));
  if (i < 0) return null;
  const tramo = [];
  for (const l of ls.slice(i + 1)) {
    if (/^###/.test(l)) break;
    if (!l.trim()) continue;
    tramo.push(l.trim());
    if (/^[-*•]\s/.test(l.trim())) break;
  }
  const t = tramo.join(' ');
  const tecnica = tramo[tramo.length - 1];
  // Un deslizador u oscilación suave no cuenta (decisión 120): es como Butler
  // manda empezar en lo irritable, lejos de la fuente (Butler 1991, pp. 188–189);
  // el aviso de Maitland es del slump (plan 2 de Andrés)
  return RE_NEURAL.test(t) && !RE_OSCILA.test(tecnica) ? tecnica : null;
}

const RE_ESTRUCTURA = /\b(protrusi[oó]n\w*|hernia\w*|extrusi[oó]n\w*|comprimi\w*|compresi[oó]n de la ra[ií]z|pinzamiento\w*|discopat\w*)\b/i;

// ── 2. Fuentes ────────────────────────────────────────────────────────────────
// «Autor 2021», «Autor y Autor 2005», «Autor et al. 2019», «(Autor, 2019)», NICE…
const RE_FUENTE = /\b([A-ZÁÉÍÓÚÑ][a-záéíóúñü'-]+)(?:\s+(?:y|e|&)\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñü'-]+|\s+et al\.?)?,?\s+\(?((?:19|20)\d{2})\b/g;
const RE_GUIA = /\b(NICE|APTA|JOSPT|KNGF|Cochrane)\b/g;
const NO_AUTOR = new Set(['Sesión', 'Sesiones', 'Semana', 'Semanas', 'Plan', 'Nivel', 'Día', 'Días', 'En', 'Desde', 'Hasta', 'Octubre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Noviembre', 'Diciembre']);

export function revisarPlan(texto, { esqueleto = '', escalon = 1, alarmas = [], noElegidas = [], derivar = [], independientes = [], primera = false, fuente = '' } = {}) {
  const puntos = [];
  const sec = seccionesPlan(texto);
  const sesionMes = [sec['SESIÓN'] || '', sec['PLAN DEL MES'] || ''].join('\n');
  const casa = sec['PROGRAMA PARA CASA'];

  // Secciones: sin el programa para casa no hay red de seguridad que comprobar
  const faltan = ['SESIÓN', 'PLAN DEL MES', 'PROGRAMA PARA CASA'].filter(s => sec[s] == null);
  if (faltan.length) puntos.push({ id: 'secciones', nivel: 'alto', mensaje: `${faltan.length > 1 ? 'Faltan las secciones' : 'Falta la sección'} ${faltan.join(', ')}: el plan parece incompleto.` });

  // 1. Volumen sin marcar. Vale también una cifra que la IA ya propuso con la
  // marca en otra línea (plan de Andrés, 2026-10: el programa para casa repetía
  // sin marca las series de la sesión, y daba un punto por cada una)
  const enEsqueleto = new Set([...cifras(esqueleto), ...lineas(texto).filter(tieneMarca).flatMap(cifras)]);
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

  // 3b. Técnica neural como primera técnica de la primera sesión (decisión 117):
  // «el slump rara vez es la primera técnica» (Maitland 2005, cap. 6, p. 149).
  // El primer plan de Andrés (L5, ronda 1) abrió la intervención con el slump.
  if (primera) {
    const neural = primeraTecnica(sec['SESIÓN'] || '');
    if (neural) puntos.push({ id: 'neural-primera', nivel: 'medio', mensaje: 'La primera sesión empieza la intervención con una técnica neural: rara vez es la primera técnica; si se usa con vigor, 2–3 días entre sesiones y reevaluar a las 24 h (Maitland 2005, cap. 6, p. 149).', cita: recorte(neural) });
  }

  // 3c. Técnica neural en tensión o mantenida (decisiones 118 y 119). Con
  // escalón 1–2: deslizadores u oscilaciones de unos 20–30 s, nada mantenido ni
  // en tensor (Butler 2000, pp. 379–381 y 387; Butler 1991, pp. 188–189); unos
  // segundos sin oscilación cuentan como mantenidos. Con escalón 3–4: mantener
  // la posición como mucho 10 s (Butler 1991, p. 192). El primer plan de Andrés
  // (L5, ronda 1) mantenía el slump 30 s en escalón 1. En las tres secciones: el
  // programa para casa también lleva ejercicios neurales.
  for (const { l, neural } of lineasNeurales(texto)) {
    if (!neural) continue;
    const mant = mantenidoEnFrase(l);
    if (escalon <= 2) {
      let m = l.match(RE_TENSOR);
      if (m && negadoEnFrase(l, m.index)) m = null;
      if (!m && mant) m = mant.m;
      if (!m && !RE_OSCILA.test(l)) m = l.match(RE_SEGUNDOS);
      if (m) puntos.push({ id: 'neural-tensor', nivel: 'medio', mensaje: `Técnica neural en tensión o mantenida («${m[0].trim()}») con el escalón ${escalon}: en fase aguda o irritable, deslizadores u oscilaciones lentas en series de unos 20–30 s, con el resto del cuerpo descargado y antes del síntoma, nada mantenido (Butler 2000, pp. 379–381 y 387; Butler 1991, pp. 188–189).`, cita: recorte(l) });
    } else {
      const largo = mant && [...mant.frase.matchAll(new RegExp(RE_SEGUNDOS.source, 'gi'))].find(x => Math.max(...x[1].split(/[–-]/).map(Number)) > 10);
      if (largo) puntos.push({ id: 'neural-tensor', nivel: 'medio', mensaje: `Técnica neural mantenida más de 10 s («${largo[0].trim()}»): como mucho 10 s, y lo provocado debe ceder a los pocos segundos de soltar (Butler 1991, pp. 192–193).`, cita: recorte(l) });
    }
  }

  // 3d. Diagnóstico estructural que no consta (decisión 120): el plan 2 de
  // Andrés explicaba el dolor «por una protrusión discal que está comprimiendo
  // la raíz», sin imagen ni dato que lo dijera.
  const base = normalizar(`${esqueleto} ${fuente}`);
  for (const l of lineas(texto)) {
    const m = l.match(RE_ESTRUCTURA);
    if (m && !base.includes(normalizar(m[1]).slice(0, 6)) && !negado(l, m.index)) {
      puntos.push({ id: 'diagnostico-estructural', nivel: 'medio', mensaje: `Atribuye el dolor a una estructura o lesión que no consta en los datos («${m[1]}»): explica la hipótesis sin dar por hecha la lesión.`, cita: recorte(l) });
      break;
    }
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
    // Con su lado, solo si la línea también lo nombra: «zona lumbar» sola es la
    // región del plan, no la molestia lumbar derecha de Andrés (cuatro falsos
    // avisos en su primer plan, 2026-10)
    for (const x of independientes) {
      const { nombre, lado = '' } = typeof x === 'string' ? { nombre: x } : x;
      const zona = normalizar(nombre.replace(/^P\d+\s*·\s*/, ''));
      const raizLado = normalizar(lado).slice(0, 6);   // «derech», «izquie»
      if (zona && nl.includes(zona) && (!raizLado || nl.includes(raizLado)) && !negacion.test(l)) {
        puntos.push({ id: 'independiente', nivel: 'medio', mensaje: `Nombra el síntoma independiente (${nombre}) sin decir que este plan no lo trata: comprueba que no le pone ejercicios.`, cita: recorte(l) });
      }
    }
  }
  // La misma línea repetida («Una vez al día» en cada ejercicio) da un solo punto
  return puntos.filter((p, i) => puntos.findIndex(q => clavePuntoPlan(q) === clavePuntoPlan(p)) === i);
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
