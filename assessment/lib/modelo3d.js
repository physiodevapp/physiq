// ============================================================
// PhysiQ-Assessment · LIB/MODELO3D.JS
// Lógica pura del modo «Anatomía 3D» de Entrena (docs/entrena-3d.md): qué
// piezas se ven con una capa y unos sistemas, qué se ve al aislar una, y la
// lectura de los nombres de malla de un .glb (para el test unitario). Sin
// DOM ni three.js.
// ============================================================

// Estado de la vista: capa = la más externa que se ve (1 = todas, 7 = solo
// huesos); soloCapa = ver solo esa capa, no de ella hacia dentro; sistemas = los
// encendidos; aislada = id de la pieza aislada o null.
export function estadoInicial3d(modelo) {
  return { capa: 1, soloCapa: false, sistemas: new Set(['hueso', 'articular', 'musculo', 'neurovascular']), aislada: null, elegida: null, modelo };
}

export function piezaVisible(pieza, estado) {
  if (estado.aislada) return pieza.id === estado.aislada;
  return (estado.soloCapa ? pieza.capa === estado.capa : pieza.capa >= estado.capa) && estado.sistemas.has(pieza.sistema);
}

// Con «Solo esta capa», los huesos quedan de fondo en transparente para no perder la orientación
// (no se pueden elegir ni cuentan como visibles); no si la capa es la de los huesos, si están
// apagados en Tejidos o con una pieza aislada.
export function piezaFondo(pieza, estado) {
  return !!estado.soloCapa && !estado.aislada && pieza.tipo === 'hueso' && pieza.capa !== estado.capa && estado.sistemas.has(pieza.sistema);
}

export function piezasVisibles(modelo, estado) {
  return modelo.piezas.filter(p => piezaVisible(p, estado));
}

// «Quitar capa»: pasa a la siguiente capa que deja algo visible con los
// sistemas encendidos (no se queda en una capa vacía). «Poner capa»: al revés.
export function quitarCapa(modelo, estado) {
  for (let c = estado.capa + 1; c <= 7; c++) {
    if (modelo.piezas.some(p => p.capa === c && estado.sistemas.has(p.sistema))) return c;
  }
  return estado.capa;
}
// Una capa tiene algo propio que enseñar con los sistemas encendidos (el menú de capas apaga las que no).
export function capaConPiezas(modelo, estado, n) {
  return modelo.piezas.some(p => p.capa === n && estado.sistemas.has(p.sistema));
}
export function ponerCapa(modelo, estado) {
  for (let c = estado.capa - 1; c >= 1; c--) {
    if (modelo.piezas.some(p => p.capa === c && estado.sistemas.has(p.sistema))) return c;
  }
  return estado.capa;
}

// Lista accesible de estructuras: las visibles, agrupadas por sistema (en el orden de SISTEMAS_3D)
// y en orden alfabético dentro de cada grupo; con `busqueda`, solo las que la contienen (sin
// distinguir mayúsculas ni tildes). Los grupos vacíos no salen.
const normalizar = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function gruposLista(modelo, estado, sistemas, busqueda = '') {
  const q = normalizar(busqueda.trim());
  const vis = piezasVisibles(modelo, estado).filter(p => !q || normalizar(p.nombre).includes(q));
  return sistemas.map(s => ({ id: s.id, nombre: s.nombre, piezas: vis.filter(p => p.sistema === s.id).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')) }))
    .filter(g => g.piezas.length);
}

export const pieza = (modelo, id) => modelo.piezas.find(p => p.id === id) || null;

// Nombres de las mallas de un .glb, leyendo su bloque JSON (sin three.js).
export function mallasGLB(buffer) {
  const dv = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  if (dv.getUint32(0, true) !== 0x46546C67) throw new Error('no es un .glb');
  const largo = dv.getUint32(12, true);
  if (dv.getUint32(16, true) !== 0x4E4F534A) throw new Error('el primer bloque no es JSON');
  const json = JSON.parse(new TextDecoder().decode(buffer.subarray(20, 20 + largo)));
  return (json.nodes || []).filter(n => n.mesh !== undefined).map(n => n.name);
}

// ---- Modos con puntos (paso 5): ¿Dónde está?, ¿Qué sale aquí?, Del árbol al cuerpo ----
// Una zona es un punto de rodilla-puntos.json (un sitio del hueso). Cuenta como tocada si queda
// bajo el dedo: a menos de RADIO_ZONA (2,5 cm) de la línea del toque, que es justo el círculo que
// se dibuja al corregir, y no más de PROFUNDIDAD_ZONA (4 cm) por detrás del primer hueso que hay
// bajo el dedo, aunque lo tapen partes blandas (se toca «encima», como al palpar). Así el cóndilo
// femoral medial se acierta de frente (queda 3,3 cm por detrás de la superficie anterior del
// fémur), pero no el cuello del peroné tocando la tibia por medial (5,3 cm detrás) ni la
// tuberosidad tibial desde atrás (4,5 cm). Medido sobre el modelo: docs/entrena-3d.md,
// «Modos con puntos».
export const RADIO_ZONA = 0.025, PROFUNDIDAD_ZONA = 0.04;

// Un toque, tal como lo da el visor: ids = piezas bajo el dedo hasta la primera opaca incluida
// (las translúcidas dejan ver lo de detrás); puntos = dónde cae el dedo en cada una; hueso = el
// primer punto de hueso en esa línea; rayo = { o, d } (origen y dirección unitaria del toque).
// Acierta si toca una pieza del lugar o una de sus zonas.
const resta = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// 'bajo' = la zona está bajo el dedo; 'detras' = en la línea del dedo, pero detrás del hueso
// tocado; null = lejos.
export function zonaEnToque(p, toque, radio = RADIO_ZONA) {
  const { o, d } = toque.rayo, v = resta(p, o), t = punto(v, d);
  if (t < 0 || Math.hypot(...v.map((x, i) => x - t * d[i])) > radio) return null;
  const ref = toque.hueso || (toque.puntos || [])[0];
  if (!ref) return 'bajo';
  const tRef = punto(resta(ref, o), d);
  return t - tRef > PROFUNDIDAD_ZONA ? 'detras' : t < tRef - radio ? null : 'bajo';
}
export function aciertaToque(lugar, toque, puntos, radio = RADIO_ZONA) {
  if (!lugar || !toque) return false;
  if ((toque.ids || []).some(id => lugar.piezas.includes(id))) return true;
  return lugar.zonas.some(z => puntos[z] && zonaEnToque(puntos[z], toque, radio) === 'bajo');
}
// Para explicar un fallo: la zona estaba en la línea del dedo, pero al otro lado del hueso.
export const zonaDetras = (lugar, toque, puntos, radio = RADIO_ZONA) =>
  !!lugar && !!toque && lugar.zonas.some(z => puntos[z] && zonaEnToque(puntos[z], toque, radio) === 'detras');

// Dos lugares iguales (mismas piezas y zonas): no pueden ser opciones de la misma pregunta.
const clave = l => l ? [...l.piezas].sort().join(',') + '|' + [...l.zonas].sort().join(',') : '';
export const mismoLugar = (a, b) => clave(a) === clave(b);

// El lugar en palabras, para la corrección: «Menisco medial y menisco lateral».
export function lugarTexto(modelo, lugar) {
  const n = [...lugar.piezas.map(id => pieza(modelo, id)?.nombre), ...lugar.zonas.map(z => modelo.zonas.find(x => x.id === z)?.nombre)]
    .filter(Boolean).map((t, i) => i ? t.charAt(0).toLowerCase() + t.slice(1) : t);
  return n.length > 1 ? n.slice(0, -1).join(', ') + ' y ' + n[n.length - 1] : n[0] || '';
}
