// ============================================================
// PhysiQ-Assessment · ficha.js
// Ficha flotante junto a un botón: una sola para toda la app
// ============================================================
//
// La usan las citas (lib/citas.js: tocar «George 2021» da la cita entera y su
// enlace) y las barras de Tiempos de tejido (app.js). Va en <body> con
// position: fixed (un panel animado con transform la recolocaría), debajo del
// botón si cabe y si no encima, con 16 px de margen. Una sola abierta a la vez.
// Se cierra con el mismo botón, al tocar fuera, con Escape (antes que el panel
// o el diálogo que haya debajo; el foco vuelve al botón), al cambiar de fase,
// al redimensionar y al desplazar más de 24 px lo que la contiene (un
// desplazamiento menor la recoloca: el último evento de una inercia llega tras
// abrirla y la cerraría al instante). Nunca se imprime.

import { registroReferencias, fichaCitaHTML } from './lib/citas.js';

let _abierta = null; // { ancla, el, scrolls: Map(elemento|document → posición) }

const _posScroll = t => (t === document ? window.scrollY : t.scrollTop);

export function fichaAbierta() { return _abierta?.ancla || null; }

// Abre la ficha `id` junto a `ancla` con `html`; si ya estaba abierta en ese
// ancla, la cierra (alternar). `clase` da el estilo propio además del común.
export function alternarFicha(ancla, html, { id, clase = '' } = {}) {
  if (_abierta?.ancla === ancla) { cerrarFicha(); return; }
  cerrarFicha({ sinFoco: true });
  if (!html) return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.className = `ficha-flotante ${clase}`.trim();
    el.setAttribute('role', 'status');
    el.addEventListener('click', e => e.stopPropagation());
    document.body.appendChild(el);
  }
  el.innerHTML = html;
  el.hidden = false;
  // Posición de todo lo que, al desplazarse, movería el ancla
  const scrolls = new Map([[document, window.scrollY]]);
  for (let p = ancla.parentElement; p; p = p.parentElement) scrolls.set(p, p.scrollTop);
  _abierta = { ancla, el, scrolls };
  ancla.setAttribute('aria-expanded', 'true');
  colocarFicha();
}

// Cambia el contenido de la ficha abierta (p. ej., cuando llega el registro)
export function actualizarFicha(html) {
  if (!_abierta) return;
  _abierta.el.innerHTML = html;
  colocarFicha();
}

export function colocarFicha() {
  if (!_abierta) return;
  const { ancla, el } = _abierta;
  if (!ancla.isConnected) { cerrarFicha({ sinFoco: true }); return; }
  const b = ancla.getBoundingClientRect();
  const margen = 16, sep = 8;
  const ancho = el.offsetWidth, alto = el.offsetHeight;
  const left = Math.min(Math.max(margen, b.left + b.width / 2 - ancho / 2), innerWidth - margen - ancho);
  const debajo = b.bottom + sep + alto <= innerHeight - margen;
  el.style.left = `${Math.max(margen, left)}px`;
  el.style.top = `${debajo ? b.bottom + sep : Math.max(margen, b.top - sep - alto)}px`;
}

export function cerrarFicha({ sinFoco = false } = {}) {
  if (!_abierta) return;
  const { ancla, el } = _abierta;
  _abierta = null;
  el.hidden = true;
  ancla.setAttribute('aria-expanded', 'false');
  if (!sinFoco && ancla.isConnected) ancla.focus({ preventScroll: true });
}

// Fuera del ancla y de la ficha (en captura: los paneles cortan la propagación)
document.addEventListener('click', e => {
  if (!_abierta) return;
  const t = e.target instanceof Element ? e.target : null;
  if (!t || !(_abierta.ancla.contains(t) || _abierta.el.contains(t))) cerrarFicha({ sinFoco: true });
}, true);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && _abierta) { e.stopImmediatePropagation(); e.preventDefault(); cerrarFicha(); }
}, true);
document.addEventListener('scroll', e => {
  if (!_abierta) return;
  const t = e.target === document || e.target === document.documentElement ? document : e.target;
  if (!_abierta.scrolls.has(t)) return;
  if (Math.abs(_posScroll(t) - _abierta.scrolls.get(t)) > 24) cerrarFicha({ sinFoco: true });
  else colocarFicha();
}, { capture: true, passive: true });
window.addEventListener('resize', () => cerrarFicha({ sinFoco: true }));

// ── Citas (lib/citas.js) ──
// Tocar una cita abre su ficha. El registro de referencias se carga con
// import() la primera vez; mientras llega, la ficha da solo el texto. Abierta
// con el teclado, el foco pasa a «Abrir ↗» (Escape lo devuelve a la cita).

let _ref = null;
document.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('button.cita[data-cita]') : null;
  if (!b) return;
  e.preventDefault();
  const cita = b.dataset.cita;
  const teclado = e.detail === 0;
  alternarFicha(b, fichaCitaHTML(cita, _ref), { id: 'citaFicha', clase: 'cita-ficha' });
  if (fichaAbierta() !== b) return;
  const enfocar = () => { if (teclado) document.querySelector('#citaFicha .cita-ficha-enlace')?.focus({ preventScroll: true }); };
  if (_ref) { enfocar(); return; }
  registroReferencias().then(REF => {
    _ref = REF;
    if (fichaAbierta() === b) { actualizarFicha(fichaCitaHTML(cita, REF)); enfocar(); }
  });
}, true);
