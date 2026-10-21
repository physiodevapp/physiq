// Funciones puras del modo guía con grabadora externa (docs/modo-guia.md).
// Sin DOM ni estado: las usa app.js y las prueba tests/unit/modo-guia.mjs.

// Nombre que se pone a una sesión sin nombre en modo guía (decisión 1): sin
// teclear, la sesión se guardaría igual que cualquier otra. Editable después.
export function nombreAuto(fecha = new Date()) {
  const hh = String(fecha.getHours()).padStart(2, '0');
  const mm = String(fecha.getMinutes()).padStart(2, '0');
  return `Paciente ${hh}:${mm}`;
}

// Teclado numérico propio (decisión 2). `valor` = texto actual del campo;
// `tecla` = '0'–'9', '.', 'borrar' (una cifra) o 'limpiar'. `max` evita pasarse
// del máximo del campo; `decimal` admite una coma/punto (talla, peso).
export function aplicarTecla(valor, tecla, { decimal = false, max = null } = {}) {
  const base = String(valor ?? '');
  if (tecla === 'limpiar') return '';
  if (tecla === 'borrar') return base.slice(0, -1);
  if (tecla === '.' || tecla === ',') {
    if (!decimal || base.includes('.')) return base;
    return (base === '' ? '0' : base) + '.';
  }
  if (!/^[0-9]$/.test(tecla)) return base;
  const nuevo = (base === '0' ? '' : base) + tecla;   // sin ceros a la izquierda
  if (max !== null && !isNaN(max) && Number(nuevo) > max) return base;
  return nuevo;
}

// «a la derecha» / «a la izquierda» / «bilateral»; '' si no se sabe (Central, vacío)
export function ladoFrase(lado) {
  return { Derecho: 'a la derecha', Izquierdo: 'a la izquierda', Bilateral: 'bilateral' }[lado] || '';
}

// Frase ancla de un test de la 4b (decisión 5): lo que conviene decir en voz
// alta al marcar el resultado, para que la transcripción lo recoja.
export function fraseAncla(nombreTest, lado) {
  const l = ladoFrase(lado);
  return `«${nombreTest}, positivo${l ? ` ${l}` : ''}»`;
}
