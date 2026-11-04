// «¿Por qué?» / «Por qué y más» desplegados (usuario, 2026-11): mientras un
// <details class="razon"> está abierto, su línea (el <summary>) se queda fija bajo
// las barras de arriba (CSS: position: sticky, que se suelta sola al acabar el
// <details>, antes de la siguiente pregunta), así que replegar está siempre a mano;
// al final del texto, «Replegar ▴»; y al replegar, si la pregunta ha quedado por
// encima de la pantalla, se vuelve a ella para no quedarse perdido más abajo.
// Compartido por la app (fases 2, 4 y 4b) y la guía de consulta. No importa nada
// ni lee datos: solo mira el DOM.

// Barras fijas o pegadas arriba que taparían la línea: cabecera, barra de fase
// (móvil), bandas de contexto visibles, las pestañas de la guía y, en la guía, la línea
// fija del sistema o la hipótesis abierta (bloques plegables, guia.js)
const BARRAS_FIJAS = '.app-header, .mobile-phase-bar, .context-banner.visible, .guia-nav';
const BARRAS = `${BARRAS_FIJAS}, .guia-plegable[open] > summary`;

export function altoBarras(sel = BARRAS) {
  // Apiladas desde arriba, en orden de posición (no de DOM): cada una cuenta si
  // empieza donde acaba la anterior
  // Una barra fija, por su `top` de CSS y su alto, no por su posición en pantalla:
  // las bandas de contexto entran con una animación (fadeUp) que las desplaza, y
  // medidas a mitad no parecían apiladas y no contaban (CI, 2026-11)
  const rects = [...document.querySelectorAll(sel)]
    .map(el => ({ el, cs: getComputedStyle(el) }))
    .filter(({ cs }) => ['fixed', 'sticky'].includes(cs.position))
    .map(({ el, cs }) => {
      if (cs.position === 'fixed' && cs.display !== 'none' && !Number.isNaN(parseFloat(cs.top))) {
        const top = parseFloat(cs.top);
        return { top, bottom: top + el.offsetHeight, height: el.offsetHeight };
      }
      return el.getBoundingClientRect();
    }).filter(r => r.height > 0)
    .sort((a, b) => a.top - b.top);
  let alto = 0;
  for (const r of rects) if (r.top <= alto + 1 && r.bottom > alto) alto = r.bottom;
  return Math.round(alto);
}

// Fondo opaco del primer antecesor que lo tenga: la línea fija lo necesita para
// tapar el texto que pasa por debajo
function fondoDe(el) {
  for (let n = el.parentElement; n; n = n.parentElement) {
    const c = getComputedStyle(n).backgroundColor;
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) continue;
    const partes = m[1].split(',').map(s => parseFloat(s));
    if (partes.length < 4 || partes[3] >= 1) return c;
  }
  return getComputedStyle(document.body).backgroundColor;
}

let _medida = 0, _trasBanda = 0;
function medir() {
  _medida = 0;
  const top = altoBarras();
  document.documentElement.style.setProperty('--razon-top', `${top}px`);
  marcarPegadas(top);
}
// .pegada mientras la línea está pegada bajo las barras (el <details> empieza por
// encima de ellas): solo entonces lleva la tapa de arriba (styles.css)
function marcarPegadas(top) {
  document.querySelectorAll('details.razon').forEach(d => {
    const pegada = d.open && d.getBoundingClientRect().top < top - 1;
    if (pegada !== d.classList.contains('pegada')) d.classList.toggle('pegada', pegada);
  });
}
function alHacerScroll() {
  if (!document.querySelector('details.razon[open]')) return;
  if (!_medida) _medida = requestAnimationFrame(medir);
  // Y otra vez al parar: las bandas de contexto de la app aparecen y desaparecen
  // con su propio observador, a veces después de nuestra medida
  clearTimeout(_trasBanda); _trasBanda = setTimeout(medir, 150);
}

function alAbrir(d) {
  d.style.setProperty('--razon-fondo', fondoDe(d));
  if (!d.querySelector(':scope > .razon-replegar')) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'razon-replegar';
    b.textContent = 'Replegar ▴';
    d.appendChild(b);
  }
  medir();
}

function alCerrar(d) {
  // Dentro de un bloque plegable de la guía, su línea se quedará fija encima de la
  // pregunta aunque ahora (con el texto recién plegado) esté fuera de la pantalla
  const lineaBloque = d.closest('.guia-plegable[open]')?.querySelector(':scope > summary');
  const top = lineaBloque ? altoBarras(BARRAS_FIJAS) + lineaBloque.offsetHeight : altoBarras();
  // El bloque de la pregunta (cribado, paso del árbol, test); si no, el contenedor directo
  const ancla = d.closest('.sq2, .tree-question, .test-item') || d.parentElement || d;
  let y = ancla.getBoundingClientRect().top;
  // Si el bloque de la pregunta no cabe, basta con dejar la propia línea a la vista
  if (y < top && d.getBoundingClientRect().bottom - y > window.innerHeight - top) y = d.getBoundingClientRect().top;
  if (y >= top) return;
  // Posición absoluta, calculada ya: lo que estaba encima no cambia al plegar. Se
  // aplica en el siguiente frame, cuando el navegador ya ha hecho su propio ajuste
  // (scroll anchoring), para no sumar los dos
  const destino = window.scrollY + y - top - 8;
  requestAnimationFrame(() => {
    if (ancla.getBoundingClientRect().top < top) window.scrollTo({ top: destino, behavior: 'instant' });
  });
}

let _iniciado = false;
export function initRazonPlegable() {
  if (_iniciado) return;
  _iniciado = true;
  // `toggle` no burbujea: se escucha en captura
  document.addEventListener('toggle', e => {
    const d = e.target;
    if (!(d instanceof HTMLDetailsElement) || !d.classList.contains('razon')) return;
    if (d.open) alAbrir(d); else { d.classList.remove('pegada'); alCerrar(d); }
  }, true);
  document.addEventListener('click', e => {
    const b = e.target instanceof Element ? e.target.closest('.razon-replegar') : null;
    if (!b) return;
    const d = b.closest('details.razon');
    if (!d) return;
    d.open = false;
    d.querySelector(':scope > summary')?.focus({ preventScroll: true });
  });
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  window.addEventListener('resize', alHacerScroll, { passive: true });
  // Las bandas de contexto aparecen con su propio IntersectionObserver, y en un
  // móvil cargado pueden llegar después de la medida de 150 ms: entonces la línea
  // quedaba tapada bajo la banda. Se mide de nuevo cada vez que una cambia (clase,
  // estilo o alto: la de la 4b crece con la puntuación) y al acabar su animación de
  // entrada (fadeUp la desplaza mientras dura).
  const alCambiarBanda = () => { if (document.querySelector('details.razon[open]')) medir(); };
  const observador = typeof MutationObserver === 'function' ? new MutationObserver(alCambiarBanda) : null;
  const alto = typeof ResizeObserver === 'function' ? new ResizeObserver(alCambiarBanda) : null;
  document.querySelectorAll('.context-banner').forEach(b => {
    observador?.observe(b, { attributes: true, attributeFilter: ['class', 'style'] });
    alto?.observe(b);
    b.addEventListener('animationend', alCambiarBanda);
  });
}
