// Filas de opciones en pantalla estrecha (decisión del usuario, 2026-10): un grupo
// pone todas sus opciones en una fila solo si cada botón cabe en una línea; si no,
// prueba con menos columnas, en el orden de `data-filas` («3,2,1»: tres en fila,
// luego dos por fila con la última a todo el ancho, luego una por fila). La última
// columna de la lista se queda aunque algún texto parta (en los cuestionarios,
// «N,2»: dos por fila aunque una opción ocupe dos líneas).
//
// Solo actúa donde el CSS lo activa (`--filas: 1` en el grupo, dentro de su media
// query); fuera, quita `data-cols` y el grupo vuelve a su disposición de escritorio.
// Se mide con el texto en negrita (`.filas-midiendo`), así una opción marcada, que
// se pinta en negrita, no parte su texto al tocarla. Vuelve a medir cuando cambia
// el ancho del grupo (ResizeObserver: giro de pantalla, el grupo que aparece al
// cambiar de fase) y cuando terminan de cargar las fuentes.

// Pura: la primera columna de `pasos` con la que `cabe(c)`; si ninguna, la última
export function elegirColumnas(pasos, cabe) {
  for (const c of pasos) if (cabe(c)) return c;
  return pasos[pasos.length - 1];
}

// Líneas que ocupa el texto de un botón (los tops distintos de sus rectángulos de texto)
function lineas(boton) {
  const r = document.createRange();
  r.selectNodeContents(boton);
  const tops = [...r.getClientRects()].filter(q => q.width > 1).map(q => q.top).sort((a, b) => a - b);
  let n = 0, ultimo = -Infinity;
  for (const t of tops) { if (t - ultimo > 4) n++; ultimo = t; }
  return n;
}

function aplicar(g, c) {
  g.dataset.cols = c;
  g.style.setProperty('--filas-cols', c);
}

function quitar(g) {
  delete g.dataset.cols;
  g.style.removeProperty('--filas-cols');
}

export function ajustarGrupo(g) {
  const activo = getComputedStyle(g).getPropertyValue('--filas').trim() === '1';
  if (!activo || !g.offsetWidth) { quitar(g); return; }
  const pasos = g.dataset.filas.split(',').map(Number).filter(n => n > 0);
  const botones = [...g.children].filter(b => b.tagName === 'BUTTON');
  if (!pasos.length || !botones.length) return;
  g.classList.add('filas-midiendo');
  const c = elegirColumnas(pasos, c => { aplicar(g, c); return botones.every(b => lineas(b) <= 1); });
  g.classList.remove('filas-midiendo');
  aplicar(g, c);
}

const _anchos = new WeakMap();
const _observados = new Set();
const _ro = typeof ResizeObserver === 'function' ? new ResizeObserver(entradas => {
  for (const e of entradas) {
    const ancho = Math.round(e.contentRect.width);
    if (_anchos.get(e.target) === ancho) continue; // cambiar las columnas cambia el alto, no el ancho
    _anchos.set(e.target, ancho);
    ajustarGrupo(e.target);
  }
}) : null;

// Empieza a vigilar los grupos `[data-filas]` dentro de `raiz` (llamar tras pintarlos)
export function observarFilas(raiz = document) {
  if (!raiz?.querySelectorAll) return;
  for (const g of [..._observados]) if (!g.isConnected) { _ro?.unobserve(g); _observados.delete(g); }
  const grupos = [...raiz.querySelectorAll('[data-filas]')];
  if (raiz.matches?.('[data-filas]')) grupos.push(raiz);
  for (const g of grupos) {
    if (_observados.has(g)) continue;
    _observados.add(g);
    if (_ro) _ro.observe(g); else ajustarGrupo(g);
  }
}

// Las fuentes web cambian el ancho del texto: al terminar de cargar, medir otra vez
if (typeof document !== 'undefined' && document.fonts?.ready) {
  document.fonts.ready.then(() => { for (const g of _observados) if (g.isConnected) ajustarGrupo(g); });
}
