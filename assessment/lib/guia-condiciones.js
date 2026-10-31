// Condiciones especiales en la guía de consulta (guia.html), para usar el papel + QR sin la app:
// lo que la app añade al marcar una condición y que sirve en la consulta.
//  · Fase 2: los bloques de preguntas que no son del cribado (rasgos del lupus, factores y caídas
//    de la osteoporosis, ánimo y suelo pélvico del embarazo, patrón de sospecha del POTS).
//  · Fase 4b: las líneas de técnica que salen encima de los tests o bajo un test concreto.
//  · Fase 5: el recuadro de recomendaciones de cada condición, generado con las mismas funciones
//    que la app (lineasRecomendacion*), sin escribir ningún texto clínico aquí. Cada recuadro sale
//    de un caso base por estado y de variantes con una sola casilla cambiada: las líneas nuevas de
//    una variante se pintan «Si …» y las que desaparecen, «(no con …)». Las etiquetas «Si …» son
//    lo único escrito aquí; un test comprueba que cada variante cambia alguna línea.
// Puro: no lee `state` ni el DOM.
import { HM, lineasRecomendacionHM } from './hipermovilidad.js';
import { DS, lineasRecomendacionDs } from './disautonomia.js';
import { LES, lineasRecomendacionLES } from './lupus.js';
import { MA, lineasRecomendacionMA } from './mastocitos.js';
import { OP, lineasRecomendacionOP } from './osteoporosis.js';
import { EM, lineasRecomendacionEM } from './embarazo.js';
import { AC, lineasRecomendacionAC } from './anticoagulado.js';

// Por sistema: estados con su caso base y sus variantes [etiqueta, cambio en el payload]
export const RECOMENDACIONES = {
  transversal_hipermovilidad: { fn: lineasRecomendacionHM, estados: [
    { titulo: 'Diagnosticada', base: { es: 'diagnosticada', st: 'hipermovil' }, variantes: [
      ['es el subtipo vascular', { st: 'vascular' }],
      ['cumple la regla de sospecha del subtipo vascular', { vs: true }],
    ] },
    { titulo: 'Sospecha', base: { es: 'sospecha' }, variantes: [
      ['cumple la hipermovilidad generalizada (Beighton)', { hag: true }],
      ['cumple la regla de sospecha del subtipo vascular', { vs: true }],
    ] },
  ] },
  transversal_disautonomia: { fn: lineasRecomendacionDs, estados: [
    { titulo: 'Diagnosticada', base: { es: 'diagnosticada', ti: 'pots' }, variantes: [
      ['es una hipotensión ortostática', { ti: 'ho' }],
      ['la prueba de bipedestación da hipotensión ortostática', { ho: true }],
    ] },
    { titulo: 'Sospecha', base: { es: 'sospecha' }, variantes: [
      ['la prueba de bipedestación es compatible con taquicardia ortostática', { ot: true }],
      ['la prueba de bipedestación da hipotensión ortostática', { ho: true }],
    ] },
  ] },
  transversal_lupus: { fn: lineasRecomendacionLES, estados: [
    { titulo: 'Diagnosticado', base: { es: 'diagnosticado' }, variantes: [
      ['tiene osteonecrosis o artropatía de Jaccoud', { on: true }],
      ['está en brote o peor sin valorar', { av: 'brote' }],
      ['tiene Raynaud', { ry: true }],
      ['tiene anticuerpos antifosfolípidos o síndrome antifosfolípido', { af: 'apl' }],
      ['toma más de 20 mg/día de corticoides o los tomó a dosis altas', { gc: 'a' }],
    ] },
    { titulo: 'Sospecha', base: { es: 'sospecha' }, variantes: [
      ['contesta «sí» a algún rasgo (salvo el del fármaco)', { rs: 1 }],
      ['empezó tras un fármaco nuevo', { fd: true }],
    ] },
  ] },
  transversal_mastocitos: { fn: lineasRecomendacionMA, estados: [
    { titulo: 'Diagnosticado', base: { es: 'diagnosticado', ti: 'otro' }, variantes: [
      ['tiene una mastocitosis, un SAMA o ha tenido una anafilaxia', { an: 'si' }],
      ['tiene una mastocitosis', { ti: 'mastocitosis' }],
      ['no lleva autoinyector o no se lo han recetado', { ai: 'no' }],
      ['sabe qué le desencadena los episodios', { de: ['calor'] }],
    ] },
  ] },
  transversal_osteoporosis: { fn: lineasRecomendacionOP, estados: [
    { titulo: 'Diagnosticada', base: { es: 'diagnosticada' }, variantes: [
      ['tiene una fractura vertebral u otras fracturas por fragilidad', { fv: '1' }],
      ['tiene una fractura vertebral reciente o dolorosa', { fv: '1', fr: true }],
      ['toma un bifosfonato o denosumab', { tr: 'antirresortivo' }],
      ['toma 7,5 mg/día o más de corticoides sin tratamiento del hueso', { dc: true }],
      ['es una osteoporosis del embarazo o la lactancia', { ca: 'plo' }],
      ['tiene riesgo alto de caídas (preguntas de caídas)', { cd: 'alto' }],
      ['se cayó una vez, sin lesión, sin quedarse en el suelo, sin perder el conocimiento y sin fragilidad', { cd: 'una' }],
      ['no se ha caído', { cd: 'no' }],
    ] },
    { titulo: 'Sospecha', base: { es: 'sospecha' }, variantes: [
      ['tiene 50 años o más y algún factor', { sr: 'derivar' }],
      ['se rompió un hueso por fragilidad antes de los 50', { sr: 'joven' }],
      ['no tiene ningún factor de la lista', { sr: 'sinFactores' }],
      ['tiene riesgo alto de caídas (preguntas de caídas)', { cd: 'alto' }],
      ['se cayó una vez, sin lesión, sin quedarse en el suelo, sin perder el conocimiento y sin fragilidad', { cd: 'una' }],
      ['no se ha caído', { cd: 'no' }],
    ] },
  ] },
  transversal_embarazo: { fn: lineasRecomendacionEM, estados: [
    { titulo: 'Embarazada', base: { es: 'embarazada' }, variantes: [
      ['tiene síntomas de suelo pélvico', { sp: { o: true } }],
      ['tiene escapes de gases o heces', { sp: { h: true } }],
      ['no tiene síntomas pero sí riesgo de suelo pélvico', { rs: true }],
    ] },
    { titulo: 'Posparto', base: { es: 'posparto' }, variantes: [
      ['da el pecho', { la: 'SI' }],
      ['tiene síntomas de suelo pélvico', { sp: { o: true } }],
      ['tiene escapes de gases o heces', { sp: { h: true } }],
      ['no tiene síntomas pero sí riesgo de suelo pélvico', { rs: true }],
    ] },
  ] },
  transversal_anticoagulado: { fn: lineasRecomendacionAC, estados: [
    { titulo: 'Anticoagulante', base: { es: 'toma', ti: ['do'] }, variantes: [
      ['solo toma aspirina', { ti: ['as'] }],
      ['solo toma antiagregantes', { ti: ['oa'] }],
      ['toma heparina', { ti: ['hp'] }],
    ] },
  ] },
};

// Recuadro de la fase 5 de un sistema: [{ titulo, lineas: [{ texto, si?, no? }] }] (null si no tiene)
export function recomendacionesCondicion(sisId) {
  const r = RECOMENDACIONES[sisId];
  if (!r) return null;
  return r.estados.map(({ titulo, base, variantes }) => {
    const lineasBase = r.fn(base);
    const lineas = lineasBase.map(texto => ({ texto, no: [] }));
    const vistas = new Set(lineasBase);
    for (const [etiqueta, cambio] of variantes) {
      const con = r.fn({ ...base, ...cambio });
      // «(no con …)» solo en las líneas del caso base: una línea de variante ya dice cuándo sale
      for (const l of lineas) if (!l.si && !con.includes(l.texto)) l.no.push(etiqueta);
      for (const texto of con) {
        if (vistas.has(texto)) {
          const ya = lineas.find(l => l.texto === texto && l.si);
          if (ya && !ya.si.includes(etiqueta)) ya.si.push(etiqueta);
          continue;
        }
        vistas.add(texto);
        lineas.push({ texto, si: [etiqueta], no: [] });
      }
    }
    return { titulo, lineas };
  });
}

// Bloques de preguntas de la fase 2 que no son preguntas del cribado (no van a sistemicoAnswers)
export function bloquesFase2(sis) {
  const b = [];
  if (sis.id === 'transversal_disautonomia') b.push({ titulo: 'Patrón de sospecha (con «Sospecha»)', preguntas: DS.sospecha, fuentes: [DS.sospechaFuente, DS.diferencialFuente] });
  if (sis.id === 'transversal_lupus') b.push({ titulo: 'Rasgos de sospecha (con «Sospecha»)', preguntas: LES.rasgos, fuentes: [LES.textos.derivar, LES.textos.sinRasgos, LES.rasgosFuente, LES.diferencialFuente] });
  if (sis.id === 'transversal_osteoporosis') {
    b.push({ titulo: 'Factores de riesgo de fractura (con «Sospecha»)', preguntas: OP.factores, fuentes: [OP.textos.sospechaDerivar, OP.textos.sospechaJoven, OP.factoresFuente] });
    b.push({ titulo: 'Caídas (los dos estados)', preguntas: [{ id: 'n', texto: `En el último año, ¿se ha caído? (${Object.values(OP.caidas.n).join(' · ')})` }, ...OP.caidas.casillas], fuentes: [OP.caidas.fuente, OP.caidas.sincope] });
  }
  if (sis.id === 'transversal_embarazo') {
    b.push({ titulo: 'Ánimo', preguntas: EM.animo, fuentes: [EM.textos.animoSi, EM.textos.animoAnsiedad, EM.textos.animoFuente] });
    b.push({ titulo: 'Suelo pélvico', preguntas: EM.suelo, fuentes: [EM.textos.sueloEvidencia, EM.textos.sueloFuente] });
  }
  return b;
}

// Fase 4b: líneas de técnica encima de los tests, por condición
export function lineasTecnica4b() {
  return [
    { icono: '🤰', cond: 'Embarazo de 20 semanas o más', texto: EM.textos.supino },
    { icono: '🫀', cond: 'Disautonomía / POTS', texto: DS.textos.tecnica4b },
    { icono: '🦋', cond: 'Lupus diagnosticado', texto: LES.textos.tecnica4b },
    { icono: '💉', cond: 'Trastorno mastocitario o anafilaxia', texto: MA.textos.tecnica4b },
    { icono: '🩸', cond: 'Anticoagulado o antiagregado', texto: AC.textos.tecnica4b },
  ];
}

// Fase 4b: líneas bajo un test concreto, según sus campos (laxitud, cargaOsea, gaenslen)
export function lineasTest(test) {
  const l = [];
  if (test.laxitud) l.push({ icono: '🧬', cond: 'Hipermovilidad', texto: HM.textos.laxitud });
  if (test.cargaOsea) l.push({ icono: '🦴', cond: 'Osteoporosis', texto: OP.textos.tecnica4b + (test.cargaOsea === 'costilla' ? ` ${OP.textos.tecnica4bCostilla}` : ''), porque: OP.textos.tecnica4bPorque });
  if (test.gaenslen) l.push({ icono: '🤱', cond: 'Posparto', texto: `${EM.textos.gaensMenos4} ${EM.textos.gaensMas4}` });
  return l;
}
