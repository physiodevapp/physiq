// ============================================================
// PhysiQ-Assessment · lib/oncologico.js
// Condición especial «Antecedente de cáncer» (Fase P,
// docs/antecedente-oncologico.md, «Texto cerrado para revisión» con los
// cambios de NICE NG234 y de las tablas de Campbell 2019 y 2022). Funciones
// puras: estado vacío, chips (con «No lo sabe» excluyente), qué se ve según
// la tarjeta, sus líneas rojas, pendientes del modo breve, payload `on` y los
// textos de 📋 Notas, 📄 Informe e informe con IA. El contenido clínico
// (preguntas, chips y textos con sus fuentes) vive en data/comun.js.
// ============================================================

import { SIS_ONCOLOGICO } from '../data/comun.js';

export const ON = SIS_ONCOLOGICO.oncologico;

export const ESTADOS_ON = ON.estados;   // terminado, tratamiento
// Listas de chips (selección múltiple) y sus ids, en el orden de la tarjeta.
export const LISTAS_ON = { canceres: ON.canceres, tratamientos: ON.tratamientos, zonas: ON.zonas, secuelas: ON.secuelas, linfedema: ON.linfedema };
const IDS = Object.fromEntries(Object.entries(LISTAS_ON).map(([k, l]) => [k, l.map(x => x.id)]));
// «No lo sabe» excluye a los demás chips de su lista (cánceres y tratamientos).
const EXCLUYENTE = { canceres: 'ns', tratamientos: 'ns' };

export const oncologicoVacio = () => ({
  estado: '', canceres: [], tratamientos: [], metastasis: '', zonas: [], revision: '', secuelas: [], linfedema: [],
});

export const onActivo = on => !!ESTADOS_ON[on?.estado];

// Antraciclinas o trastuzumab, o radioterapia con el corazón en el campo.
export const cardiotoxico = on => onActivo(on) && (on.tratamientos.includes('cardiotoxico') || on.tratamientos.includes('rtCorazon'));
// La fila de la revisión cardiaca: con tratamiento cardiotóxico o «No lo sabe».
export const revisionVisible = on => cardiotoxico(on) || (onActivo(on) && on.tratamientos.includes('ns'));
// Cardiotóxico con revisión «No», «No lo sabe» o sin responder.
export const sinRevisionCardiaca = on => cardiotoxico(on) && ['', 'no', 'ns'].includes(on.revision);
export const conMetastasis = on => onActivo(on) && (on.metastasis === 'si' || on.metastasis === 'ns');
export const conSecuela = (on, k) => onActivo(on) && on.secuelas.includes(k);
// La pregunta del linfedema: con «Linfedema» o «Cirugía con ganglios extirpados».
export const conLinfedemaRiesgo = on => conSecuela(on, 'linfedema') || (onActivo(on) && on.tratamientos.includes('cirugiaGanglios'));
export const conHormonal = on => onActivo(on) && on.tratamientos.includes('hormonal');
export const conRadioCuello = on => onActivo(on) && on.tratamientos.includes('rtCuello');

// Sesiones anteriores o datos incompletos → la forma completa, con los chips
// en el orden de la tarjeta; lo que depende de otra fila se limpia.
export function normalizarOncologico(on) {
  const v = { ...oncologicoVacio(), ...(on || {}) };
  if (!ESTADOS_ON[v.estado]) v.estado = '';
  for (const [k, ids] of Object.entries(IDS)) {
    let l = Array.isArray(v[k]) ? ids.filter(id => v[k].includes(id)) : [];
    if (EXCLUYENTE[k] && l.includes(EXCLUYENTE[k])) l = [EXCLUYENTE[k]];
    v[k] = l;
  }
  if (!ON.metastasis[v.metastasis]) v.metastasis = '';
  if (v.metastasis !== 'si') v.zonas = [];
  if (!ON.revision[v.revision]) v.revision = '';
  if (!v.secuelas.includes('linfedema')) v.linfedema = [];
  if (!v.estado) return oncologicoVacio();
  if (!revisionVisible(v)) v.revision = '';
  return {
    estado: v.estado, canceres: v.canceres, tratamientos: v.tratamientos, metastasis: v.metastasis,
    zonas: v.zonas, revision: v.revision, secuelas: v.secuelas, linfedema: v.linfedema,
  };
}

// Pulsar un chip de una lista: lo marca o lo desmarca; «No lo sabe» excluye a
// los demás y al revés.
export function alternarChip(on, lista, id) {
  const v = normalizarOncologico(on);
  if (!IDS[lista]?.includes(id)) return v;
  const ex = EXCLUYENTE[lista];
  if (v[lista].includes(id)) v[lista] = v[lista].filter(x => x !== id);
  else v[lista] = ex && id === ex ? [ex] : [...v[lista].filter(x => x !== ex), id];
  return normalizarOncologico(v);
}

// ── Qué se ve ────────────────────────────────────────────────
// Pregunta o bandera del sistema (`on` en data/comun.js). Sin `on`, con los dos estados.
export function elementoONVisible(x, on) {
  if (!x || typeof x === 'string' || !x.on) return true;
  if (x.on === 'cardiotoxico') return cardiotoxico(on);
  if (x.on === 'linfedema') return conLinfedemaRiesgo(on);
  return true;
}

// Líneas rojas de la tarjeta (nunca plegadas): [{ clave, texto }].
export function lineasTarjetaON(on) {
  if (!onActivo(on)) return [];
  const t = ON.textos;
  const l = [];
  if (on.metastasis === 'si') l.push({ clave: 'metastasis', texto: t.metastasis });
  if (on.metastasis === 'ns') l.push({ clave: 'metastasis', texto: conDuda(t.metastasis) });
  if (sinRevisionCardiaca(on)) l.push({ clave: 'cardiaco', texto: t.cardiaco });
  if (cardiotoxico(on) && on.revision === 'si_alterado') l.push({ clave: 'cardiacoAlterado', texto: t.cardiacoAlterado });
  if (conRadioCuello(on)) l.push({ clave: 'tensionBrazos', texto: t.tensionBrazos });
  if (conSecuela(on, 'ostomia')) l.push({ clave: 'ostomia', texto: t.ostomiaTarjeta });
  return l;
}
// «Hasta confirmarlo:» delante, con la primera letra en minúscula.
const conDuda = s => `${ON.textos.duda} ${s.replace(/^\S/, c => c.toLowerCase())}`;

// ── Pendientes del modo breve ────────────────────────────────
export function pendientesON(on) {
  if (!onActivo(on)) return [];
  const p = [];
  if (!on.metastasis) p.push({ fase: 1, ancla: 'cardOncologico', texto: 'Metástasis óseas sin registrar (tarjeta «Antecedente de cáncer»)' });
  if (cardiotoxico(on) && !on.revision) p.push({ fase: 1, ancla: 'cardOncologico', texto: 'Revisión del corazón sin registrar (tarjeta «Antecedente de cáncer»)' });
  return p;
}

// ── Payload `on` ─────────────────────────────────────────────
// Solo con la tarjeta marcada (sin ella, el payload y la huella de los informes
// con IA anteriores no cambian): es estado ('terminado'|'tratamiento'), cn
// cánceres como texto, tr tratamientos (ids), mo metástasis óseas
// ('no'|'si'|'ns'|null), mz dónde (ids, solo con «Sí»), rc revisión cardiaca
// ('si_normal'|'si_alterado'|'no'|'ns'|null, solo si la fila se ve), sc
// secuelas (ids), li miembro del linfedema (ids).
export function onPayload(on) {
  if (!onActivo(on)) return null;
  const v = normalizarOncologico(on);
  const corto = (lista, id) => LISTAS_ON[lista].find(x => x.id === id)?.corto || id;
  return {
    es: v.estado, cn: v.canceres.map(id => corto('canceres', id)), tr: [...v.tratamientos],
    mo: v.metastasis || null, mz: [...v.zonas], rc: v.revision || null, sc: [...v.secuelas], li: [...v.linfedema],
  };
}

// ── Textos compartidos (a partir del payload) ────────────────
const cortoDe = (lista, id) => LISTAS_ON[lista].find(x => x.id === id)?.corto || id;
const ESTADO_TEXTO = { terminado: 'terminado', tratamiento: 'en tratamiento' };
const MO_TEXTO = { no: 'no', si: 'sí', ns: 'no lo sabe' };
const RC_TEXTO = { si_normal: 'sí, normal', si_alterado: 'sí, alterado', no: 'no', ns: 'no lo sabe' };
const cardioDe = d => (d.tr || []).includes('cardiotoxico') || (d.tr || []).includes('rtCorazon');

function secuelasTexto(d) {
  return (d.sc || []).map(k => (k === 'linfedema' && d.li?.length
    ? `linfedema (${d.li.map(x => cortoDe('linfedema', x)).join(', ')})` : cortoDe('secuelas', k)));
}
function metastasisTexto(d) {
  if (!d.mo) return '';
  return `metástasis óseas: ${MO_TEXTO[d.mo]}${d.mo === 'si' && d.mz?.length ? ` (${d.mz.map(x => cortoDe('zonas', x)).join(', ')})` : ''}`;
}

// Datos de la tarjeta en frases cortas (sin fuentes), tras el cáncer y el estado.
export function datosON(d) {
  return [
    d.tr?.length ? d.tr.map(x => cortoDe('tratamientos', x)).join(', ') : '',
    metastasisTexto(d),
    d.rc ? `corazón revisado: ${RC_TEXTO[d.rc]}` : '',
    d.sc?.length ? `secuelas: ${secuelasTexto(d).join(', ')}` : '',
  ].filter(Boolean);
}
const canceresTexto = d => (d.cn?.length ? d.cn.join(', ') : 'cáncer sin precisar');

// Líneas del recuadro de la fase 5, con sus citas, en el orden del texto
// cerrado (más las de las tablas de Campbell 2019). La de la terapia hormonal
// es un botón (app.js) y la del bloque de ejercicio aún no existe.
export function lineasRecomendacionON(d) {
  const t = ON.textos;
  const sc = d?.sc || [];
  return [
    d?.mo === 'si' ? t.metastasis5 : d?.mo === 'ns' ? conDuda(t.metastasis5) : '',
    t.triaje,
    cardioDe(d || {}) ? t.cardiotoxico5 : '',
    t.dosis,
    t.supervisado,
    sc.includes('linfedema') ? t.linfedema5 : '',
    sc.includes('ostomia') ? t.ostomia5 : '',
    sc.includes('neuropatia') ? t.neuropatia5 : '',
    d?.es === 'tratamiento' ? t.enTratamiento : '',
    t.vigilar,
  ].filter(Boolean);
}

// 📋 Notas: una línea.
export function lineaNotasON(d) {
  return `🎗 ANTECEDENTE DE CÁNCER: ${[canceresTexto(d), ESTADO_TEXTO[d.es], ...datosON(d)].join(' · ')}`;
}

// 📄 Informe (paciente o médico): el cáncer, los tratamientos y las secuelas;
// sin metástasis, técnicas ni recomendaciones de ejercicio. { titulo, lineas }.
export function informeON(d) {
  const lineas = [`Antecedente de cáncer: ${canceresTexto(d)} (${d.es === 'tratamiento' ? 'en tratamiento' : 'tratamiento terminado'}).`];
  const tr = (d.tr || []).filter(x => x !== 'ns');
  if (tr.length) lineas.push(`Tratamientos recibidos: ${tr.map(x => cortoDe('tratamientos', x)).join(', ')}.`);
  if (d.sc?.length) lineas.push(`Secuelas: ${secuelasTexto(d).join(', ')}.`);
  return { titulo: 'ANTECEDENTE ONCOLÓGICO', lineas };
}

// Informe con IA: bloque de datos (sin citas: el informe no nombra fuentes).
export function bloqueONIA(d) {
  const t = ON.textos;
  const datos = datosON(d);
  const sinRevision = cardioDe(d) && (!d.rc || d.rc === 'no' || d.rc === 'ns');
  return [
    'Antecedente de cáncer (condición especial marcada por el fisioterapeuta):',
    `  · Cáncer: ${canceresTexto(d)}`,
    `  · Estado: ${d.es === 'tratamiento' ? 'en tratamiento' : 'tratamiento terminado'}`,
    datos.length ? `  · Datos: ${datos.join('; ')}` : '',
    sinRevision ? `  · ${t.iaCorazon}` : '',
    d.mo === 'si' || d.mo === 'ns' ? `  · ${t.iaMetastasis}` : '',
  ].filter(Boolean).join('\n');
}
