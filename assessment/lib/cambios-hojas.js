// Qué cambió en una hoja impresa entre dos versiones (docs/esquemas/historial/<clave>.json,
// lo escribe docs/esquemas/historial.mjs al generar). Puro: lo usan la guía (aviso de papel
// viejo, «Hojas para imprimir») y los tests.
//
// Cada versión: { huella, fecha, el: { clave: [pos, ancla, texto] }, resto }. `pos` es dónde está
// el elemento en el papel («Cardiovascular 3», «Paso 2b», el número de la hipótesis); `resto`,
// el texto que no es de ningún elemento (cabecera, notas, pie; en las hojas sin elementos, todo).
// Una versión antigua puede no tener `el` ni `resto` (solo se sabe su huella): sin detalle.

// Qué es cada elemento, por el prefijo de su clave
const TIPOS = [['q-', 'pregunta'], ['paso-', 'paso'], ['hip-', 'hipotesis'], ['test-', 'test']];
const tipoDe = clave => (TIPOS.find(([p]) => clave.startsWith(p)) || [, 'elemento'])[1];

// El texto fuera de los elementos, en frases: lo que cambió ahí se lista como frases quitadas y
// nuevas (una frase reescrita sale en las dos)
const frases = t => (t || '').split(/(?<=[.;:!?])\s+|\s+·\s+/).map(f => f.trim()).filter(f => f.length > 1);
function diferenciaFrases(a, b) {
  const A = frases(a), B = frases(b), enA = new Set(A), enB = new Set(B);
  return { quitadas: [...new Set(A.filter(f => !enB.has(f)))], nuevas: [...new Set(B.filter(f => !enA.has(f)))] };
}

// { nuevos, quitados, movidos, cambiados, otros, textos, soloFormato, numeracion }. Cada elemento:
// { clave, tipo, pos, ancla, texto } y, si cambió, `antesPos` / `antesTexto`. En el orden del
// papel (el de la versión nueva; los quitados, el de la vieja).
export function compararVersiones(vieja, nueva) {
  const A = vieja?.el || {}, B = nueva?.el || {};
  const item = (clave, [pos, ancla, texto]) => ({ clave, tipo: tipoDe(clave), pos, ancla, texto });
  const nuevos = [], quitados = [], movidos = [], cambiados = [];
  for (const [k, b] of Object.entries(B)) {
    const a = A[k];
    if (!a) { nuevos.push(item(k, b)); continue; }
    const it = item(k, b);
    if (a[0] !== b[0]) it.antesPos = a[0];
    if (a[2] !== b[2]) { it.antesTexto = a[2]; cambiados.push(it); } else if (it.antesPos != null) movidos.push(it);
  }
  for (const [k, a] of Object.entries(A)) if (!B[k]) quitados.push({ ...item(k, a), ancla: '' });
  // Otros textos: las frases que cambiaron; si solo cambió el orden o el espaciado, nada
  const textos = diferenciaFrases(vieja?.resto, nueva?.resto);
  const otros = !!(textos.quitadas.length || textos.nuevas.length);
  const total = nuevos.length + quitados.length + movidos.length + cambiados.length;
  return {
    nuevos, quitados, movidos, cambiados, otros, textos,
    soloFormato: !total && !otros,
    // Lo que tiene el papel ya no casa con la guía: hay que reimprimirla
    numeracion: !!(nuevos.length || quitados.length || movidos.length || cambiados.some(c => c.antesPos != null)),
  };
}

// La versión del papel en el historial; null si es anterior al registro de cambios
export const versionDe = (historial, huella) => (historial || []).find(v => v.huella === huella) || null;
// ¿Se puede detallar qué cambió desde esta versión? (las más antiguas solo tienen la huella)
export const conDetalle = v => !!v && v.el != null && v.resto != null;

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
// Una línea corta: «2 cambiados · 1 nuevo · 3 cambian de número»
export function resumenCambios(d) {
  const partes = [
    d.cambiados.length && plural(d.cambiados.length, 'cambiado', 'cambiados'),
    d.nuevos.length && plural(d.nuevos.length, 'nuevo', 'nuevos'),
    d.quitados.length && plural(d.quitados.length, 'quitado', 'quitados'),
    d.movidos.length && `${d.movidos.length} ${d.movidos.length === 1 ? 'cambia' : 'cambian'} de número`,
    d.otros && 'otros textos de la hoja',
  ].filter(Boolean);
  return partes.length ? partes.join(' · ') : 'solo formato';
}
export const totalCambios = d => d.nuevos.length + d.quitados.length + d.movidos.length + d.cambiados.length + (d.otros ? 1 : 0);

// Cómo se nombra un elemento en la lista: «Cardiovascular 3», «Paso 2b», «Hipótesis 4»,
// «Test (hipótesis 4)»; y su texto, recortado
export function etiquetaElemento(it, pos = it.pos) {
  if (it.tipo === 'hipotesis') return `Hipótesis ${pos}`;
  if (it.tipo === 'test') return `Test (hipótesis ${pos})`;
  return pos;
}
export const recortar = (t, n = 90) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
// Texto del elemento sin el número que ya va en la etiqueta
// (la hipótesis y el paso lo llevan delante)
export const textoElemento = it => (it.tipo === 'hipotesis' || it.tipo === 'paso' ? it.texto.replace(/^\S+\s+/, '') : it.texto);

// Dónde cambió el texto de un elemento: lo común al principio y al final (por palabras) fuera, y
// unas palabras de contexto a cada lado. { antes, ahora, ctxAntes, ctxDespues, inicio, fin }
// (inicio / fin: si hay más texto antes o después del contexto, «…»).
export function diferenciaTexto(antes, ahora, contexto = 3) {
  const A = String(antes).split(' '), B = String(ahora).split(' ');
  let p = 0;
  while (p < A.length && p < B.length && A[p] === B[p]) p++;
  let s = 0;
  while (s < A.length - p && s < B.length - p && A[A.length - 1 - s] === B[B.length - 1 - s]) s++;
  return {
    antes: A.slice(p, A.length - s).join(' '),
    ahora: B.slice(p, B.length - s).join(' '),
    ctxAntes: B.slice(Math.max(0, p - contexto), p).join(' '),
    ctxDespues: B.slice(B.length - s, B.length - s + contexto).join(' '),
    inicio: p > contexto,
    fin: s > contexto,
  };
}

// Páginas del PDF actual de un cuaderno que hay que imprimir para sustituir unas hojas: las de cada
// hoja (desde su `inicio` hasta antes de la siguiente, con la página en blanco de relleno, así que
// cada rango empieza en impar y acaba en par y ocupa sus propios papeles a doble cara) y la portada.
// `cuaderno` = una entrada de docs/esquemas/cuadernos.json. Sin `inicio`, o sin ninguna de esas
// hojas en el cuaderno, null. `texto` va listo para la casilla «Páginas» del diálogo de imprimir.
export function paginasReimprimir(cuaderno, claves) {
  const ini = cuaderno?.inicio;
  if (!ini || !cuaderno.paginas) return null;
  const orden = Object.entries(ini).sort((a, b) => a[1] - b[1]);
  if (!orden.length) return null;
  const fin = i => (i < orden.length - 1 ? orden[i + 1][1] - 1 : cuaderno.paginas);
  const porHoja = {};
  for (const k of claves) {
    const i = orden.findIndex(([c]) => c === k);
    if (i >= 0) porHoja[k] = [orden[i][1], fin(i)];
  }
  if (!Object.keys(porHoja).length) return null;
  const portada = [1, orden[0][1] - 1];
  const rangos = [];
  for (const r of [portada, ...Object.values(porHoja)].sort((a, b) => a[0] - b[0])) {
    const ult = rangos.at(-1);
    if (ult && r[0] <= ult[1] + 1) ult[1] = Math.max(ult[1], r[1]); else rangos.push([...r]);
  }
  const rango = ([a, b]) => (a === b ? `${a}` : `${a}-${b}`);
  return { portada, porHoja, rangos, texto: rangos.map(rango).join(', '), rango };
}

// Qué hojas de un cuaderno hay que sustituir en una copia impresa el día `fecha` ('AAAA-MM-DD'):
// las que cambiaron ese día o después (ese mismo día cuenta, por si cambió después de imprimir).
// Si la copia es de antes del último cambio de lista u orden de hojas (`ordenFecha`), entera.
// `huellas`: { clave: { huella, fecha } } (docs/esquemas/huellas.json).
export function hojasCambiadasDesde(cuaderno, huellas, fecha) {
  if (!cuaderno || !fecha) return null;
  if (cuaderno.ordenFecha && fecha < cuaderno.ordenFecha) return { entero: true, claves: [] };
  const claves = Object.keys(cuaderno.hojas || {}).filter(k => huellas?.[k] && huellas[k].fecha >= fecha)
    .sort((a, b) => huellas[b].fecha.localeCompare(huellas[a].fecha));
  return { entero: false, claves };
}

// Qué hacer con una copia impresa de un cuaderno de la que se sabe su versión (la «v.» de la
// portada, o el ?c= de su QR), comparándola hoja por hoja con el cuaderno actual. Exacto: no
// depende de fechas. Como cada hoja va en su propio papel y numera sus páginas por sí misma
// (decisión del usuario, 2026-11), nunca hace falta reimprimirlo entero:
//   claves    → hojas que siguen pero con otra versión: se imprimen y se sustituyen
//   nuevas    → [{ clave, tras }]: se imprimen y se meten detrás de `tras` (null = tras la portada)
//   quitadas  → claves que ya no están: se retiran
//   movidas   → [{ clave, tras }]: se pasan detrás de `tras` (las mínimas: las que no están en la
//               subsecuencia más larga que conserva el orden)
// `copia` = { hojas: { clave: huella } } de docs/esquemas/cuadernos-historial.json.
export function hojasCambiadasEnCopia(cuaderno, copia) {
  if (!cuaderno?.hojas || !copia?.hojas) return null;
  const actual = Object.keys(cuaderno.hojas), antes = Object.keys(copia.hojas);
  const enCopia = new Set(antes), enActual = new Set(actual);
  const comunes = actual.filter(k => enCopia.has(k));
  // Subsecuencia creciente más larga de las posiciones en la copia: esas hojas no se mueven
  const pos = comunes.map(k => antes.indexOf(k));
  const largo = pos.map(() => 1), previo = pos.map(() => -1);
  for (let i = 0; i < pos.length; i++) for (let j = 0; j < i; j++) if (pos[j] < pos[i] && largo[j] + 1 > largo[i]) { largo[i] = largo[j] + 1; previo[i] = j; }
  const quietas = new Set();
  let i = largo.indexOf(Math.max(0, ...largo));
  while (i >= 0) { quietas.add(comunes[i]); i = previo[i]; }
  const tras = k => { const n = actual.indexOf(k); return n > 0 ? actual[n - 1] : null; };
  return {
    claves: comunes.filter(k => copia.hojas[k] !== cuaderno.hojas[k]),
    nuevas: actual.filter(k => !enCopia.has(k)).map(k => ({ clave: k, tras: tras(k) })),
    quitadas: antes.filter(k => !enActual.has(k)),
    movidas: comunes.filter(k => !quietas.has(k)).map(k => ({ clave: k, tras: tras(k) })),
  };
}
