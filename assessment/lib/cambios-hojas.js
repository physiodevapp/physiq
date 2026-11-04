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
