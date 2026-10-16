// «✨ Detallar con IA» de la fase 6 (Fase L, L4; decisiones 106–115 de
// docs/plan-tratamiento.md): piezas puras — prompt, huella, vista HTML y
// textos para compartir. La tarjeta está en plan-ia.js (solo standalone); la
// revisión automática, en lib/revision-plan.js.
//
// La IA rellena el esquema que la app ya construye (textoPlanSesion,
// textoPlanMes, textoDomiciliario) para el nivel y la frecuencia elegidos;
// nunca lo cambia. Lee los datos de la valoración y, si la hay, la
// transcripción del informe con IA; nunca el texto del informe (decisión 4).
//
// Cada cambio del prompt, con la revisión del plan real que lo motivó (como en
// docs/informe-ia.md). Ronda 1 (Andrés, 2026-10): la dosis del mismo ejercicio
// cambiaba entre la sesión (3 × 30 s) y casa (10 × 3 s), las cifras de casa
// iban sin marca (regla 4). Ronda 2 (decisión 118): el slump se mantenía
// 30 s en escalón 1 (regla 13, Butler 2000; decisión 119: oscilaciones de
// 20–30 s y como mucho 10 s mantenido, Butler 1991). Ronda 3 (decisión 120):
// la educación atribuía el dolor a «una protrusión discal» (regla 5).
import { contextoValoracion, huellaPayload, markdownATexto } from './informe-narrativo.js';

export const PALABRAS_PLAN = 1500;
export const MAX_TOKENS_PLAN = 6000;
export const MARCA_SUGERENCIA = '(sugerencia de la IA)';
export const ETIQUETA_SUGERENCIA = 'Sugerencia de la IA, sin fuente en PhysiQ';
export const SECCIONES_PLAN = ['SESIÓN', 'PLAN DEL MES', 'PROGRAMA PARA CASA'];
const RE_MARCA = /\s*\(sugerencia de la IA\)/gi;

// Hasta dónde llega cada escalón de terapia manual (data/plan-tratamiento.js,
// ESCALONES): el grado más alto que admite y lo que queda fuera. Lo usan el
// prompt (regla 2) y la revisión (lib/revision-plan.js).
export const LIMITE_ESCALON = {
  1: { grado: 2, limitePasivo: false, texto: 'solo grados I y II, sin provocar dolor y explorando solo hasta el límite activo: nada de grado III ni IV, ni sobrepresión, ni ir hasta el límite pasivo' },
  2: { grado: 3, limitePasivo: false, texto: 'hasta donde empieza el dolor, sin sobrepasarlo (grado II; grado III solo cuando el dolor baje): nada de grado IV, ni sobrepresión, ni ir hasta el límite pasivo' },
  3: { grado: 3, limitePasivo: true, texto: 'hasta una molestia controlada que no aumente mientras se aplica (grado III): nada de grado IV' },
  4: { grado: 4, limitePasivo: true, texto: 'grado IV solo si domina la rigidez, como dice el escalón' },
};

const lista = xs => xs.map(x => `  · ${x}`).join('\n');

// Entrada: { datos (payload), ampliado, nombreRegion, nivel, escalon: { n,
// nombre, modo, texto }, frecuencia: { clave, nombre }, sinC, primera, neural
// (alguna hipótesis elegida es radicular o de nervio periférico),
// elegidas: [nombre], noElegidas: [nombre], derivar: [nombre],
// independientes: [nombre], alarmas: [texto], parar, sesion, mes, casa
// (textos del esquema), transcripcion: { texto, dictado, desactualizada } | null }
export function promptPlan(e) {
  const t = e.transcripcion?.texto?.trim() ? e.transcripcion : null;
  const lim = LIMITE_ESCALON[e.escalon.n] || LIMITE_ESCALON[1];
  const ctx = contextoValoracion(e.datos, e.nombreRegion, e.ampliado, { conAudio: !!t });
  const noUsar = [...(e.noElegidas || []), ...(e.derivar || [])];
  return `Eres un fisioterapeuta clínico. PhysiQ ya ha construido el ESQUEMA de un plan de tratamiento para este paciente (abajo). Tu tarea es detallarlo: ejercicios y técnicas concretos dentro de cada bloque de la sesión, la progresión del mes sesión a sesión y un programa para casa en lenguaje del paciente. No redactas un informe y no cambias el esquema: lo rellenas.

${ctx}

${t ? `## ${t.dictado ? 'DICTADO DEL FISIOTERAPEUTA' : 'TRANSCRIPCIÓN DE LA CONSULTA'} (solo para preferencias y contexto)
${t.desactualizada ? 'AVISO: la valoración cambió después de transcribir esta consulta; si algo choca con los datos de arriba, mandan los datos.\n' : ''}${t.texto.trim()}

` : ''}## ESQUEMA DEL PLAN (construido por PhysiQ; manda sobre todo lo demás)
Nivel elegido: ${e.nivel} · escalón «${e.escalon.nombre}» (${e.escalon.modo})
Frecuencia del mes: ${e.frecuencia.nombre}
Hipótesis a tratar: ${e.elegidas.join('; ')}
${noUsar.length ? `Hipótesis de la valoración que este plan NO trata (no las planifiques):\n${lista(noUsar)}\n` : ''}${e.independientes?.length ? `Síntomas independientes que este plan NO trata:\n${lista(e.independientes)}\n` : ''}
### Plan de sesión
${e.sesion}

### Plan del mes
${e.mes}

### Programa para casa (texto base)
${e.casa}

INSTRUCCIONES — CUMPLE TODAS:
1. No cambies el esquema: el mismo nivel (${e.nivel}), los mismos bloques con sus minutos, la misma frecuencia, las mismas reevaluaciones y los mismos avisos. No propongas otros niveles${e.sinC ? ' ni una propuesta C (el esquema no la tiene)' : ''}.
2. Terapia manual solo dentro del escalón elegido: ${lim.texto}. Nada de thrust ni de manipulación de alta velocidad. Para el ejercicio manda la pauta del esquema.
3. Lo que viene del esquema (pauta, escalón, reglas, criterios, cifras) se escribe sin atribuirle nada más. No nombres ninguna fuente (autor, año, guía) que el esquema no cite, y no atribuyas a una fuente del esquema nada que el esquema no diga.
4. Todo lo que pongas tú —ejercicios concretos, series, repeticiones, segundos, minutos, veces al día, días— es una sugerencia: termina esa línea con «${MARCA_SUGERENCIA}». Una cifra que ya está en el esquema no lleva la marca. Si la pauta dice que ninguna fuente fija el volumen, el volumen que propongas lleva la marca. Vale también en el programa para casa (la marca se quita al dárselo al paciente): «Haz 10 repeticiones (sugerencia de la IA).». Un mismo ejercicio lleva la misma dosis en la sesión y en casa.
5. No des por hecho ningún hallazgo que no conste en los datos o en la consulta. Si la pauta se apoya en algo que el paciente no tiene (p. ej. centralización o preferencia direccional que no constan o que la consulta niega), dilo y no lo uses como si existiera. En la educación, explica la hipótesis sin atribuir el dolor a una estructura o lesión concreta (protrusión, hernia, compresión de la raíz…) que no conste en los datos o en la consulta.
6. Una hipótesis con «pauta a criterio del fisioterapeuta» no tiene intervención con fuente: no la inventes; escribe «Pauta a criterio del fisioterapeuta» y limita tus sugerencias a la organización de la sesión.
7. Si hay síntomas independientes, nómbralos solo para decir que este plan no los trata y que se valoran aparte; ningún ejercicio para ellos.
8. Con cirugía, las restricciones del protocolo del cirujano mandan; sin protocolo, nada que lo presuponga.
9. ${e.primera ? 'Es la primera sesión de tratamiento: menos que en las siguientes, como dice el esquema, y avisa de un posible aumento temporal de las molestias.' : 'Es una sesión de las siguientes: empieza por la respuesta a la anterior, como dice el esquema.'}
10. De la consulta usa solo preferencias y contexto (horarios, actividades, objetivos, lo que puede hacer en casa), nunca para cambiar la dosis ni el nivel.
11. El programa para casa es para el paciente: en lenguaje llano, de tú, sin siglas, sin grados, sin fuentes ni puntuaciones. Di qué hacer, cuántas veces, cuándo hacerlo${e.parar ? ', cuándo parar' : ''} y qué hacer si empeora. Termina copiando literalmente, cada una en su línea, estas frases${e.alarmas.length ? ':' : ' (no hay red de seguridad para esta región: no inventes ninguna).'}
${e.alarmas.map(a => `   «${a}»`).join('\n')}
12. No escribas el nombre del paciente ni la fecha. Sin negritas ni tablas. Listas con «- ».${e.neural ? `\n13. Técnicas neurales (deslizamientos, slump, movilización del nervio): ${e.escalon.n <= 2 ? 'empieza lejos de la zona de síntomas; solo deslizadores (el nervio se mueve sin cargarlo por los dos extremos a la vez) u oscilaciones lentas y rítmicas de gran amplitud (grado II), con el resto del cuerpo descargado y antes de que aparezca el síntoma; en series de unos 20–30 s de oscilación, reevaluando entre series, y se progresa aumentando el número de series; nada de tensores ni de posiciones mantenidas' : `hasta la resistencia sin provocar dolor: grado III (mejor tolerado)${e.escalon.n >= 4 ? ' o grado IV' : ''}; tensores solo graduados, empezando por el menos provocador; si se mantiene la posición, como mucho 10 s, y lo provocado debe ceder a los pocos segundos de soltar`}. Si no hay mejoría en 2–3 sesiones, se cambia de técnica. En casa, una o dos maniobras, unos minutos al día, con el mismo criterio.` : ''}

ESTRUCTURA — empieza DIRECTAMENTE con «## SESIÓN», sin texto previo:

## SESIÓN
[Un «### » por bloque del esquema, en su orden y con sus minutos tal cual (p. ej. «### REEVALUACIÓN (0–5 min)»); debajo, qué hacer en ese bloque con este paciente]

## PLAN DEL MES
[${e.frecuencia.nombre}: qué cambia de una sesión a otra y con qué criterio se progresa (los del esquema), con las reevaluaciones donde las pone el esquema. Puedes agrupar sesiones iguales («Sesiones 2–3»)]

## PROGRAMA PARA CASA
[Para el paciente, como dice la instrucción 11]

Extensión máxima: unas ${PALABRAS_PLAN} palabras.`;
}

// Huella de lo que entra en el prompt: valoración + elecciones de la fase 6 +
// lo que escribe el fisio para casa. Si cambia, el plan detallado se marca
// como desactualizado (como la del informe con IA).
export function huellaPlan({ datos, ampliado, elecciones, transcripcion = '' }) {
  return huellaPayload({ ...datos, _ampliado: ampliado, _plan: elecciones, _t: transcripcion ? huellaPayload({ t: transcripcion }) : '' });
}

// ¿Están las tres secciones y acaba en una frase completa?
export function planTruncado(texto) {
  const t = String(texto || '').trimEnd();
  if (!t) return true;
  const up = t.toUpperCase();
  return !SECCIONES_PLAN.every(s => up.includes(`## ${s}`)) || !'.!?)»"\''.includes(t[t.length - 1]);
}

// Partes del texto por sección «## »: { 'SESIÓN': '…', … }
export function seccionesPlan(texto) {
  const out = {};
  let actual = null;
  for (const l of String(texto || '').replace(/\r\n/g, '\n').split('\n')) {
    const m = l.match(/^##\s+(?!#)(.+)$/);
    if (m) { actual = m[1].trim().toUpperCase(); out[actual] = ''; continue; }
    if (actual) out[actual] += `${l}\n`;
  }
  for (const k of Object.keys(out)) out[k] = out[k].trim();
  return out;
}

export const tieneMarca = l => /\(sugerencia de la IA\)/i.test(l);

// Vista en la tarjeta: «## » → h3, «### » → h4, «- » → lista; las líneas con
// la marca se pintan aparte, con la etiqueta en lugar de la marca (decisión 8).
const escHTML = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function planIAHtml(md) {
  const html = [];
  let ul = null;
  const cerrar = () => { if (ul) { html.push(`<ul>${ul.join('')}</ul>`); ul = null; } };
  const contenido = l => {
    const sug = tieneMarca(l);
    const t = escHTML(l.replace(RE_MARCA, '').replace(/\*\*(.+?)\*\*/g, '$1').trim());
    return { sug, t: sug ? `${t} <span class="pia-sug-et">${ETIQUETA_SUGERENCIA}</span>` : t };
  };
  for (const raw of String(md || '').replace(/\r\n/g, '\n').split('\n')) {
    const l = raw.trim();
    let m;
    if (!l) { cerrar(); continue; }
    if ((m = l.match(/^(#{2,6})\s+(.*)$/))) {
      cerrar();
      const n = Math.min(m[1].length + 1, 6);
      html.push(`<h${n}>${escHTML(m[2].replace(/\*\*/g, '').trim())}</h${n}>`);
    } else if ((m = l.match(/^[-*•]\s+(.*)$/))) {
      const c = contenido(m[1]);
      (ul ||= []).push(`<li${c.sug ? ' class="pia-sug"' : ''}>${c.t}</li>`);
    } else {
      cerrar();
      const c = contenido(l);
      html.push(`<p${c.sug ? ' class="pia-sug"' : ''}>${c.t}</p>`);
    }
  }
  cerrar();
  return html.join('');
}

export const PIE_PLAN_IA = 'Redacción asistida por IA a partir del plan de PhysiQ-Assessment. Lo marcado «(sugerencia de la IA)» no tiene fuente en PhysiQ. Propuesta revisada por el fisioterapeuta.';

// Para el fisio: el plan entero, con las marcas (decisión 111).
export function textoPlanIA(texto, { paciente = '', regionTexto = '', fecha = '', nivel = '', escalon = '', frecuencia = '' } = {}) {
  return [
    'PLAN DE TRATAMIENTO DETALLADO — propuesta',
    [paciente, regionTexto, fecha].filter(Boolean).join(' · '),
    [nivel && `Nivel ${nivel}${escalon ? ` · ${escalon}` : ''}`, frecuencia].filter(Boolean).join(' · '),
    '',
    markdownATexto(texto),
    '',
    '—',
    PIE_PLAN_IA,
  ].join('\n').replace(/\n{3,}/g, '\n\n');
}

// Para el paciente: solo el programa para casa, sin las marcas (ya revisado
// por el fisio: decisión 112) y con la red de seguridad garantizada — si la
// IA no la copió, se añade tal cual.
export function textoCasaIA(texto, { paciente = '', fecha = '', alarmas = [] } = {}) {
  const casa = (seccionesPlan(texto)['PROGRAMA PARA CASA'] || '').replace(RE_MARCA, '');
  const cuerpo = markdownATexto(casa).replace(/^(\s*)- /gm, '$1· ');
  const falta = alarmas.filter(a => !normalizar(cuerpo).includes(normalizar(a)));
  return ['PROGRAMA PARA CASA', [paciente, fecha].filter(Boolean).join(' · '), '', cuerpo, ...falta.flatMap(a => ['', a])].join('\n');
}

// Minúsculas, sin tildes ni puntuación: para comparar frases copiadas.
export function normalizar(t) {
  return String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ').trim();
}
