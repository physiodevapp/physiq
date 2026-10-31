// Estructura compartida por los esquemas imprimibles (docs/esquemas/generar.mjs)
// y la guía de consulta (guia.js), para que la numeración de una hoja y la de
// su página en la guía no puedan diferir: qué sistemas y preguntas del cribado
// se ven en una región, cuándo aparece cada pregunta, qué pasos del árbol son
// principales y cómo se llaman. Pura: sin estado ni DOM.
import { resolveOptionTargets } from './arbol.js';

export const CONDICION_SISTEMA = {
  soloPosquirurgico: 'mecanismo «Post-quirúrgico» en la fase 1',
  soloHipermovilidad: 'tarjeta «Hipermovilidad / Ehlers-Danlos» marcada',
  soloDisautonomia: 'tarjeta «Disautonomía / POTS» marcada',
  soloLupus: 'tarjeta «Lupus (LES)» marcada',
  soloMastocitos: 'tarjeta «Trastorno mastocitario o anafilaxia» marcada',
  soloOsteoporosis: 'tarjeta «Osteoporosis o fragilidad ósea» marcada',
  soloEmbarazo: 'tarjeta «Embarazo o posparto» marcada',
  soloAnticoagulado: 'tarjeta «Paciente anticoagulado o antiagregado» marcada',
};
// Cuándo se ve una pregunta dentro de su sistema (mismas reglas que lib/<condición>.js)
export function condicionPregunta(q) {
  const t = [];
  if (q.hm === 'urgencia') t.push('con «Sospecha», subtipo vascular o la regla de sospecha vascular cumplida');
  if (q.hm === 'sospecha') t.push('con «Sospecha», o «Diagnosticada» sin subtipo conocido (otro, no lo sabe o sin marcar)');
  if (q.les === 'diagnosticado') t.push('solo «Diagnosticado»');
  if (q.op === 'sinFractura') t.push('sin fractura vertebral conocida');
  if (q.op === 'antirresortivo') t.push('con bifosfonato o denosumab');
  if (q.ac === 'cabeza') t.push('no con aspirina sola');
  if (q.ac === 'anticoagulante') t.push('solo con anticoagulante');
  if (q.em) {
    const tramo = (nombre, r, uds) => r ? nombre + (r.desde ? ` desde la semana ${r.desde}` : '') + (r.hasta ? ` hasta la semana ${r.hasta}${uds}` : '') : null;
    const partes = [tramo('embarazo', q.em.embarazo, ''), tramo('posparto', q.em.posparto, ' tras el parto')].filter(Boolean);
    if (partes.length === 1) t.push('solo ' + partes[0]);
    else if (partes.some(x => /semana/.test(x))) t.push(partes.join(' o '));
  }
  return t.join(' · ');
}

// Sistemas del cribado de una región, partidos en los que se preguntan siempre
// y los de las condiciones especiales; cada uno con solo las preguntas que se
// ven en esa región (`regiones`), en el orden de la app.
export function soloDeSistema(s) { return Object.keys(CONDICION_SISTEMA).find(k => s[k]); }
export function preguntasDeRegion(s, region) { return s.preguntas.filter(q => !q.regiones || q.regiones.includes(region)); }
export function sistemasCribado(SYSTEMIC_SCREENING, region) {
  const todos = SYSTEMIC_SCREENING[region].sistemas;
  return { siempre: todos.filter(s => !soloDeSistema(s)), especiales: todos.filter(soloDeSistema) };
}

// Pasos «principales»: los que están en todos los recorridos; el resto son desvíos.
export function pasosPrincipales(tree) {
  const steps = tree.steps, ids = steps.map(s => s.id);
  const sig = id => { const i = ids.indexOf(id); return steps[i].options.flatMap(o => resolveOptionTargets(tree, i, o).map(t => t.id)); };
  const llegaAlFinSin = evitar => {
    const vistos = new Set(), pila = [ids[0]];
    if (ids[0] === evitar) return false;
    while (pila.length) {
      const id = pila.pop(); if (vistos.has(id)) continue; vistos.add(id);
      const i = ids.indexOf(id);
      if (steps[i].options.some(o => resolveOptionTargets(tree, i, o).length === 0)) return true;
      sig(id).filter(n => n !== evitar).forEach(n => pila.push(n));
    }
    return false;
  };
  return new Set(ids.filter(id => !llegaAlFinSin(id)));
}

// «1», «1b», «2c»…: el número que la app pone en la etiqueta del paso
export function etiquetaPaso(st, i) { const m = /Paso\s+([0-9]+[a-z]?)/i.exec(st.tag || ''); return m ? m[1] : String(i + 1); }

// Guía de consulta (guia.html): dirección publicada y la de cada hoja, que es
// lo que lleva el QR de su esquema. #<región>/<hoja>[/<elemento>]
export const URL_GUIA = 'https://physiodevapp.github.io/physiq/assessment/guia.html';
export const HOJAS_GUIA = { cribado: 'Cribado', irritabilidad: 'Irritabilidad', arbol: 'Árbol', confirmacion: 'Confirmación' };
// Con `huella` (la de la hoja impresa, docs/esquemas/hojas.mjs), el QR la lleva en ?h= y la
// guía avisa si el papel es de una versión anterior.
const conHuella = huella => (huella ? `?h=${huella}` : '');
export function urlGuia(region, hoja, huella = '') { return `${URL_GUIA}${conHuella(huella)}#${region}/${hoja}`; }

// Hojas de tiempos de recuperación de tejidos (data/tejidos.js): dos A4 temáticas, cada grupo
// del panel en una sola (un test lo comprueba, para que un grupo nuevo no se quede fuera).
// El QR de cada una abre su página en la guía, con la nota y las fuentes de cada barra.
export const HOJAS_TEJIDO = {
  blandos: { titulo: 'Partes blandas', corto: 'Partes blandas', grupos: ['tendon', 'musculo', 'ligamento', 'menisco', 'nervio'] },
  hueso: { titulo: 'Hueso, articulación y columna', corto: 'Hueso y articulación', grupos: ['hueso', 'articulacion', 'columna'] },
};
export function urlTejidos(hoja, huella = '') { return `${URL_GUIA}${conHuella(huella)}#tejidos/${hoja}`; }
// Cualquier página de la guía por su ruta ('lumbar/cribado', 'tejidos/hueso', 'condiciones'…)
export function urlRuta(ruta, huella = '') { return `${URL_GUIA}${conHuella(huella)}#${ruta}`; }
// Los datos de una hoja: los mismos, solo con sus grupos y en el orden de la hoja
export function datosHojaTejido(datos, hoja) {
  const ids = HOJAS_TEJIDO[hoja].grupos;
  return { ...datos, grupos: ids.map(id => datos.grupos.find(g => g.id === id)).filter(Boolean) };
}

// Cuadernos de consulta para imprimir a doble cara (docs/esquemas/cuaderno-*.pdf; decisión del usuario, 2026-10):
// uno completo y uno por región. Cada hoja empieza en página impar (generar.mjs añade páginas
// en blanco). La hoja del paciente y los árboles A3 no entran: se imprimen aparte.
// Orden de las regiones en el papel y en la guía (cuadernos, menú de región, «Hojas para
// imprimir»): anatómico, de arriba abajo, columna cervical y miembro superior y luego columna
// lumbar y miembro inferior, así las regiones que se refieren dolor quedan juntas (decisión del
// usuario, 2026-10). La app no lo usa. Un test comprueba que tiene las mismas que CIF_TREES.
export const ORDEN_REGIONES = ['cervical', 'hombro', 'codo', 'lumbar', 'cadera', 'rodilla', 'tobillo_pie'];
export const HOJAS_GENERALES = ['fase1', 'condiciones', 'irritabilidad', 'farmacos', 'tejidos-blandos', 'tejidos-hueso'];
const hojasRegion = r => [`cribado-${r}`, `arbol-a4-${r}`, `confirmacion-${r}`];
export function definicionCuadernos(regiones, nombreRegion) {
  const generales = { titulo: 'Hojas generales', hojas: HOJAS_GENERALES };
  return [
    { clave: 'cuaderno-completo', titulo: 'Cuaderno de consulta completo', portada: { titulo: 'Todas las regiones', subtitulo: `Cribado, árbol de decisión y confirmación de las ${regiones.length} regiones · hojas generales` }, secciones: [generales, ...regiones.map(r => ({ titulo: nombreRegion(r), hojas: hojasRegion(r) }))] },
    ...regiones.map(r => ({ clave: `cuaderno-${r}`, titulo: `Cuaderno de consulta · ${nombreRegion(r)}`, portada: { titulo: nombreRegion(r), subtitulo: 'Cribado, árbol de decisión y confirmación · hojas generales' }, secciones: [{ titulo: nombreRegion(r), hojas: hojasRegion(r) }, generales] })),
  ];
}
// Nombre legible de una hoja impresa por su clave (la del archivo)
const NOMBRES_HOJA = { fase1: 'Fase 1: banderas rojas y riesgo psicosocial', condiciones: 'Condiciones especiales', irritabilidad: 'Irritabilidad (fase 3)', farmacos: 'Fármacos: qué vigilar en el plan', 'ejercicio-paciente': 'El ejercicio: lo que dicen los estudios (para el paciente)' };
export function nombreHojaImpresa(clave, nombreRegion) {
  if (NOMBRES_HOJA[clave]) return NOMBRES_HOJA[clave];
  const fp = clave.match(/^formulario-(.+)$/);
  if (fp) return `Formulario del paciente · ${fp[1] === 'comun' ? 'General' : nombreRegion(fp[1])}`;
  const t = clave.match(/^tejidos-(.+)$/);
  if (t) return `Tiempos de recuperación · ${HOJAS_TEJIDO[t[1]]?.titulo || t[1]}`;
  const m = clave.match(/^(cribado|arbol-a4|confirmacion)-(.+)$/);
  if (m) return `${{ cribado: 'Cribado (fase 2)', 'arbol-a4': 'Árbol de decisión (fase 4)', confirmacion: 'Confirmación (fase 4b)' }[m[1]]} · ${nombreRegion(m[2])}`;
  return clave;
}

// Número de una hipótesis para pintarlo en una hoja o en la guía: en data/ es un carácter
// rodeado (①…㊿); dentro del círculo de la hoja quedaba un círculo dentro de otro, ilegible
// a partir del 10. Se pinta la cifra sola. Lo que no es un número rodeado pasa tal cual.
export function numeroHipotesis(num) {
  const c = String(num ?? '').trim();
  if (c.length !== 1) return c;
  const p = c.codePointAt(0);
  if (p >= 0x2460 && p <= 0x2473) return String(p - 0x2460 + 1);    // ①–⑳
  if (p >= 0x3251 && p <= 0x325F) return String(p - 0x3251 + 21);   // ㉑–㉟
  if (p >= 0x32B1 && p <= 0x32BF) return String(p - 0x32B1 + 36);   // ㊱–㊿
  return c;
}
