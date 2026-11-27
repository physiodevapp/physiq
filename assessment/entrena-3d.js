// Entrena · «Anatomía 3D» (docs/entrena-3d.md): visor del modelo de una región
// con three.js (lib/vendor/three, MIT). Entrena lo carga con import() solo al
// entrar en el modo. Paso 2 del documento: «Explorar» (girar, vistas, quitar
// capas, tejidos, tocar para elegir, aislar, Kenhub), sin puntos. Nunca pide
// ni guarda datos del paciente.
//
// Interfaz al estilo de los atlas 3D (decisión del usuario, 2026-11): el modelo
// ocupa casi toda la pantalla, una barra de botones dentro del visor abre menús
// (Estructuras con buscador, Vista, Capas, Tejidos) y la ficha de la estructura
// elegida va encima del modelo, abajo: todo sin salir del visor ni hacer scroll.
import * as THREE from './lib/vendor/three/three.module.js';
import { OrbitControls } from './lib/vendor/three/addons/controls/OrbitControls.js';
import { GLTFLoader } from './lib/vendor/three/addons/loaders/GLTFLoader.js';
import { MODELOS_3D, CAPAS_3D, SISTEMAS_3D, OPACIDAD_3D as OPACIDAD } from './data/modelo3d.js';
import { estadoInicial3d, piezaVisible, piezaFondo, piezasVisibles, quitarCapa, ponerCapa, capaConPiezas, pieza, gruposLista, RADIO_ZONA } from './lib/modelo3d.js';
import { enlacesAnatomia } from './lib/tests-4b.js';

// Colores fijos por tipo de tejido (iguales en los dos temas: el fondo es el de la página).
const COLOR = {
  hueso: 0xe6d9bd, ligamento: 0xc8d3dc, menisco: 0xb9d2e6, capsula: 0xb3c1cc, sinovial: 0xe9b3a0, grasa: 0xeecb6a,
  bursa: 0x7fb0e6, fascia: 0xd6cdc2, musculo: 0xb4544b, tendon: 0xebe6da, nervio: 0xf0c53f,
  arteria: 0xd44444, vena: 0x4b6fd4,
};
const OPACIDAD_FONDO = 0.14;
// Color de la superficie de corte (cara interior): el del tejido, un 22 % más oscuro.
const colorCorte = c => new THREE.Color(c).multiplyScalar(0.78); // huesos de fondo con «Solo esta capa»
// Color de la pieza elegida: magenta, que no es el de ningún tejido (azul se confundía con las venas
// y los meniscos; decisión del usuario, 2026-11). Igual en los dos temas.
const COLOR_ELEGIDA = 0xff2bd6;
// Modos con puntos: el lugar que se pregunta va en magenta (el color de lo elegido), el lugar
// correcto al corregir en verde (ningún tejido lo usa) y la marca del dedo, magenta hasta
// corregir; luego verde o roja.
const COLOR_LUGAR = { pregunta: COLOR_ELEGIDA, correcto: 0x22c55e };
const COLOR_MARCA = { puesta: COLOR_ELEGIDA, bien: 0x22c55e, mal: 0xff3b30 };
const DOBLE_TOQUE_MS = 350;          // dos toques en este tiempo = centrar ahí
const TOQUE_PX = 8;                  // un toque que se mueve más es un giro, no una elección

const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONO = {
  vista: svg('<path d="M21 16V8l-9-5-9 5v8l9 5z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>'),
  capas: svg('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>'),
  tejidos: svg('<path d="M3 5h18l-7 8v6l-4 2v-8z"/>'),
  lista: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>'),
  encuadrar: svg('<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><circle cx="12" cy="12" r="2.5"/>'),
  restablecer: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
  cerrar: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  marca: svg('<path d="m5 12 5 5 9-10"/>'),
  info: svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.5h.01"/>'),
};
// Con ratón, sus gestos; con dedo, los táctiles (dos dedos ya mueven: no hace falta botón «Mover»,
// decisión del usuario, 2026-11; con ratón mueve el botón derecho).
const AYUDA_TACTIL = 'Un dedo: girar · Dos dedos: acercar y mover · Toca una estructura';
const AYUDA_RATON = 'Arrastra: girar · Botón derecho: mover · Rueda: acercar · Clic: elegir';

export function soporta3d() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

// Pinta el visor en `raiz` (vacía). Devuelve { destruir }.
// opciones.ayuda: mostrar la línea de gestos (Entrena guarda si el usuario la ocultó, en sus
// preferencias: este módulo no escribe nada); opciones.alCambiarAyuda(v): avisa al ocultarla con su ✕
// (false) o al volver a abrirla con el ⓘ que queda en su lugar (true).
// opciones.juego (modos con puntos): sin «Estructuras» (sus nombres darían la respuesta), sin ficha
// ni elegir; un toque pone una marca y llama a juego.alTocar(toque) con lo que hay bajo el dedo
// (ver aciertaToque, lib/modelo3d.js). El visor devuelve además lugar(), sinLugar(), marca(),
// bloquear(), reiniciar() y puntos (las zonas del modelo).
export async function montarVisor(raiz, region, { ayuda = true, alCambiarAyuda = () => {}, juego = null } = {}) {
  let conAyuda = ayuda && !juego;
  const M = MODELOS_3D[region];
  if (!M) throw new Error('sin modelo 3D para ' + region);
  const E = estadoInicial3d(M);
  const tactil = matchMedia('(pointer: coarse)').matches;
  const herr = (k, titulo) => `<button class="v3-herr-btn" data-v3-menu="${k}" aria-haspopup="true" aria-expanded="false" aria-label="${titulo}" title="${titulo}">${ICONO[k]}<span class="v3-insignia" data-v3-insignia="${k}"></span></button>`;
  raiz.innerHTML = `
    <div class="visor-3d" data-listo="0">
      <canvas aria-label="Modelo 3D de la ${esc(region)} ${esc(M.lado)}. Arrastra para girar, pellizca para acercar y toca una estructura para elegirla. El botón Estructuras tiene la misma lista como botones, con buscador."></canvas>
      <p class="visor-cargando" role="status">Cargando el modelo…</p>
      <div class="v3-herr" role="toolbar" aria-label="Herramientas del visor" aria-orientation="vertical">
        ${juego ? '' : herr('lista', 'Estructuras')}${herr('vista', 'Vista')}${herr('capas', 'Capas')}${herr('tejidos', 'Tejidos')}
        <button class="v3-herr-btn" data-v3="encuadrar" aria-label="Encuadrar: vuelve a la vista de entrada sin tocar capas, tejidos ni selección" title="Encuadrar">${ICONO.encuadrar}</button>
        <button class="v3-herr-btn" data-v3="restablecer" aria-label="Restablecer todo: vista, capas, tejidos y selección" title="Restablecer todo">${ICONO.restablecer}</button>
      </div>
      <div class="v3-pop" id="v3Pop" hidden></div>
      <div class="v3-pie" id="v3Elegida" aria-live="polite"></div>
    </div>
    <p class="v3-credito">${esc(M.credito)} <a class="enlace-ext" href="modelos/LICENCIA.txt" target="_blank" rel="noopener noreferrer">Licencia</a></p>`;

  const caja = raiz.querySelector('.visor-3d'), canvas = caja.querySelector('canvas'), pop = raiz.querySelector('#v3Pop');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  const escena = new THREE.Scene();
  const camara = new THREE.PerspectiveCamera(35, 1, 0.005, 5);
  escena.add(new THREE.HemisphereLight(0xffffff, 0x8a7f74, 1.6));
  const luz = new THREE.DirectionalLight(0xffffff, 1.6); luz.position.set(0.3, 0.6, 1); camara.add(luz); escena.add(camara);
  const controles = new OrbitControls(camara, canvas);
  controles.enableDamping = false; controles.rotateSpeed = 0.8; controles.screenSpacePanning = true;

  const [gltf, puntos] = await Promise.all([new GLTFLoader().loadAsync(M.archivo),
    fetch(M.puntos).then(r => { if (!r.ok) throw new Error('puntos ' + r.status); return r.json(); })]);
  const mallas = {};
  gltf.scene.traverse(o => {
    if (!o.isMesh) return;
    const p = pieza(M, o.name); if (!p) return;
    const op = OPACIDAD[p.tipo];
    // Las piezas opacas son volúmenes cerrados (tools/modelo-3d/exportar.py): se pinta su cara de fuera
    // con luz y la de dentro de un color plano, el de su tejido algo más oscuro, como una superficie de
    // corte; así nada parece hueco si se ve por dentro (y servirá para los planos de corte). Las
    // translúcidas (cápsula, fascias, bursas) siguen con las dos caras iguales (decisión del usuario, 2026-11).
    o.material = new THREE.MeshStandardMaterial({ color: COLOR[p.tipo], roughness: 0.75, metalness: 0, side: op ? THREE.DoubleSide : THREE.FrontSide, transparent: !!op, opacity: op || 1, depthWrite: !op });
    o.userData.base = { color: COLOR[p.tipo], opacidad: op || 1 };
    if (!op) {
      const dentro = new THREE.Mesh(o.geometry, new THREE.MeshBasicMaterial({ color: colorCorte(COLOR[p.tipo]), side: THREE.BackSide }));
      dentro.raycast = () => {}; // no se elige por dentro: el toque va a la pieza
      o.add(dentro); o.userData.dentro = dentro;
    }
    mallas[p.id] = o;
  });
  escena.add(gltf.scene);
  const centro = new THREE.Box3().setFromObject(gltf.scene).getCenter(new THREE.Vector3());
  const radio = new THREE.Box3().setFromObject(gltf.scene).getBoundingSphere(new THREE.Sphere()).radius;

  let pedido = false;
  const render = () => { if (pedido) return; pedido = true; requestAnimationFrame(() => { pedido = false; renderer.render(escena, camara); }); };
  controles.addEventListener('change', render);
  const ajustar = () => {
    const w = caja.clientWidth, h = caja.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camara.aspect = w / h; camara.updateProjectionMatrix(); render();
  };
  const ro = new ResizeObserver(ajustar); ro.observe(caja);
  let vistaActual = 'anterior';
  const ponerVista = id => {
    const v = M.vistas.find(x => x.id === id) || M.vistas[0];
    vistaActual = v.id;
    const dist = radio / Math.sin(THREE.MathUtils.degToRad(camara.fov / 2)) * 0.95;
    camara.position.copy(centro).add(new THREE.Vector3(...v.dir).multiplyScalar(dist));
    controles.target.copy(centro); camara.up.set(0, 1, 0); controles.update(); render();
  };
  // Girar con el ratón o el dedo deja de ser una vista fija.
  controles.addEventListener('start', () => { vistaActual = null; });

  // ---- Menús de la barra (Vista, Capas, Tejidos) ----
  // Vista se cierra al elegir; Capas y Tejidos se quedan abiertos mientras se ajustan. Se cierran
  // con el mismo botón, tocando fuera o con Escape (que no cierra nada más de Entrena).
  let menu = null, arrastre = null;
  const menuHTML = {
    vista: () => `<p class="v3-pop-tit">Vista</p>${M.vistas.map(v => `<button class="v3-op" data-v3-vista="${v.id}" aria-pressed="${vistaActual === v.id}">${ICONO.marca}<span>${esc(v.nombre)}</span></button>`).join('')}
      <p class="v3-pop-nota v3-gestos">${tactil ? AYUDA_TACTIL : AYUDA_RATON}. Doble toque: centrar el giro ahí.</p>`,
    capas: () => `<p class="v3-pop-tit">Capas</p>
      <div class="v3-modo-capa" role="group" aria-label="Qué se ve">
        <button class="v3-modo-btn" data-v3="hacia-dentro" aria-pressed="${!E.soloCapa}">Hacia dentro</button>
        <button class="v3-modo-btn" data-v3="solo-capa" aria-pressed="${E.soloCapa}">Solo esta</button></div>
      <div class="v3-capa-fila"><button class="v3-paso" data-v3="poner" aria-label="${E.soloCapa ? 'Capa anterior' : 'Poner capa'}" ${ponerCapa(M, E) === E.capa ? 'disabled' : ''}>＋</button>
        <p class="v3-capa-txt"><b>${E.soloCapa ? `Solo la capa ${E.capa}` : `Capa ${E.capa} de 7`}</b></p>
        <button class="v3-paso" data-v3="quitar" aria-label="${E.soloCapa ? 'Capa siguiente' : 'Quitar capa'}" ${quitarCapa(M, E) === E.capa ? 'disabled' : ''}>−</button></div>
      <div class="v3-capas">${CAPAS_3D.map(c => `<button class="v3-op v3-op-capa" data-v3-capa="${c.n}" data-rel="${c.n === E.capa ? 'actual' : c.n > E.capa && !E.soloCapa ? 'dentro' : 'fuera'}" aria-pressed="${E.capa === c.n}" ${capaConPiezas(M, E, c.n) ? '' : 'disabled'}><span class="v3-parada" aria-hidden="true"><span class="v3-num">${c.n}</span></span><span>${esc(c.nombre)}</span></button>`).join('')}</div>
      <p class="v3-pop-nota">${E.soloCapa ? 'Desliza por los números o toca una capa para verla sola; los huesos quedan de fondo, en transparente.' : 'Desliza por los números o toca una capa para ver desde ella hacia dentro.'}</p>`,
    tejidos: () => `<p class="v3-pop-tit">Tejidos</p>${SISTEMAS_3D.map(s => `<button class="v3-op" data-v3-sis="${s.id}" aria-pressed="${E.sistemas.has(s.id)}">${ICONO.marca}<span>${esc(s.nombre)}</span></button>`).join('')}
      <button class="v3-op v3-op-todos" data-v3="tejidos-todos" ${E.sistemas.size === SISTEMAS_3D.length ? 'disabled' : ''}><span>Mostrar todos</span></button>`,
  };
  // «Estructuras»: buscador y lista por sistemas. Se pinta una vez al abrirlo y luego solo la lista,
  // para no perder lo que se está escribiendo. Elegir una cierra el menú (se ve la pieza y su ficha).
  menuHTML.lista = () => `<p class="v3-pop-tit" id="v3ListaTit"></p>
    <input type="search" class="v3-buscar" id="v3Buscar" placeholder="Buscar estructura" aria-label="Buscar estructura" autocomplete="off">
    <div id="v3Lista"></div>`;
  const pintarMenu = () => {
    if (!menu) return;
    if (menu === 'lista' && pop.querySelector('#v3Lista')) return pintarLista();
    pop.innerHTML = menuHTML[menu]();
    if (menu === 'lista') pintarLista();
  };
  // Abrir y cerrar con una animación corta que sale del propio botón (decisión del usuario, 2026-11);
  // sin ella si el sistema pide menos movimiento. Al cerrar, el menú ya no cuenta (menu = null) y no
  // recibe toques mientras se desvanece.
  const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let saliendo = null;
  const ocultarPop = () => { clearTimeout(saliendo); saliendo = null; pop.classList.remove('v3-pop-sale'); pop.hidden = true; pop.innerHTML = ''; };
  function abrirMenu(k) {
    if (menu === k) return cerrarMenu();
    if (saliendo) ocultarPop();
    menu = k; pop.hidden = false; pop.dataset.menu = k; pintarMenu(); pintarPie();
    const b = raiz.querySelector(`[data-v3-menu="${k}"]`).getBoundingClientRect(), pr = pop.getBoundingClientRect();
    pop.style.transformOrigin = `right ${Math.round(b.top + b.height / 2 - pr.top)}px`;
    pop.style.animation = 'none'; void pop.offsetWidth; pop.style.animation = '';
    raiz.querySelectorAll('[data-v3-menu]').forEach(b => b.setAttribute('aria-expanded', String(b.dataset.v3Menu === k)));
    // El buscador no se enfoca solo en pantalla táctil: abriría el teclado tapando el modelo.
    (k === 'lista' && !tactil ? pop.querySelector('#v3Buscar') : pop.querySelector('button:not([disabled])'))?.focus({ preventScroll: true });
  }
  function cerrarMenu({ foco = false } = {}) {
    if (!menu) return;
    const btn = raiz.querySelector(`[data-v3-menu="${menu}"]`);
    menu = null; arrastre = null;
    if (sinMovimiento()) ocultarPop();
    else { pop.classList.add('v3-pop-sale'); saliendo = setTimeout(ocultarPop, 130); }
    raiz.querySelectorAll('[data-v3-menu]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    pintarPie();
    if (foco) btn?.focus({ preventScroll: true });
  }
  // Un toque sobre el modelo con un menú abierto solo cierra el menú: no elige ni suelta nada.
  let toqueCierra = false;
  const fuera = e => {
    if (!menu || pop.contains(e.target) || e.target.closest?.('.v3-herr')) return;
    cerrarMenu(); toqueCierra = e.target === canvas;
  };
  const tecla = e => { if (e.key === 'Escape' && menu) { e.stopPropagation(); cerrarMenu({ foco: true }); } };
  document.addEventListener('pointerdown', fuera, true);
  document.addEventListener('keydown', tecla, true);

  // Visibilidad, resaltado y paneles: todo sale de E.
  // Lugar resaltado (modos con puntos): sus piezas se ven siempre, en su color, y lo demás queda
  // en transparente (los huesos algo más, para no perder la orientación); sus zonas, esferas del
  // radio que se acepta. Mientras se ve, Capas y Tejidos no aplican.
  let LUGAR = null;
  const grupoLugar = new THREE.Group(); grupoLugar.renderOrder = 10; escena.add(grupoLugar);
  const esfera = (r, color, opacidad) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: opacidad, depthTest: false, depthWrite: false }));
    m.renderOrder = 10; m.raycast = () => {}; return m;
  };
  const vaciar = g => { while (g.children.length) { const c = g.children.pop(); c.geometry.dispose(); c.material.dispose(); } };
  // three.js compila cada material como opaco o transparente: al cambiar de uno a otro hay que
  // recompilarlo (needsUpdate), o la opacidad se ignora y la pieza se sigue viendo entera.
  const opacidad = (m, op) => {
    const t = op < 1; m.material.opacity = op; m.material.depthWrite = !t;
    if (m.material.transparent !== t) { m.material.transparent = t; m.material.needsUpdate = true; }
  };
  function pintar() {
    for (const p of M.piezas) {
      const m = mallas[p.id], b = m.userData.base, enLugar = !!LUGAR && LUGAR.color.has(p.id);
      const fondo = !LUGAR && piezaFondo(p, E), colorLugar = enLugar ? LUGAR.color.get(p.id) : null;
      m.visible = enLugar || piezaVisible(p, E) || fondo; m.userData.fondo = fondo || (!!LUGAR && !enLugar);
      if (LUGAR) {
        const c = enLugar && !E.natural ? colorLugar : b.color, op = enLugar ? 1 : p.tipo === 'hueso' ? 0.3 : Math.min(b.opacidad, 0.07);
        const brilla = enLugar && !E.natural;
        m.material.color.set(c); m.material.emissive.set(brilla ? c : 0x000000); m.material.emissiveIntensity = brilla ? 0.35 : 0;
        opacidad(m, op);
        if (m.userData.dentro) { m.userData.dentro.visible = op >= 1; m.userData.dentro.material.color.set(colorCorte(c)); }
        continue;
      }
      // Aislada, la pieza ya es la única a la vista: se ve con el color de su tejido, sin el magenta de la
      // selección (decisión del usuario, 2026-11); la ficha sigue abajo.
      const elegida = E.elegida === p.id, resaltada = elegida && !E.aislada && !E.natural, apagada = E.elegida && !elegida && !E.aislada;
      m.material.color.set(resaltada ? COLOR_ELEGIDA : b.color);
      m.material.emissive.set(resaltada ? COLOR_ELEGIDA : 0x000000); m.material.emissiveIntensity = resaltada ? 0.35 : 0;
      const op = fondo ? OPACIDAD_FONDO : apagada ? Math.min(b.opacidad, 0.18) : b.opacidad;
      opacidad(m, op);
      // El interior solo con la pieza opaca: translúcida (fondo, apagada) se vería a través de ella.
      if (m.userData.dentro) { m.userData.dentro.visible = op >= 1; m.userData.dentro.material.color.set(colorCorte(resaltada ? COLOR_ELEGIDA : b.color)); }
    }
    // Insignias: la capa desde la que se ve y si hay tejidos ocultos. Con una pieza aislada, capas y
    // tejidos no aplican: sus botones se apagan y su menú se cierra.
    raiz.querySelector('[data-v3-insignia="capas"]').textContent = E.capa > 1 || E.soloCapa ? E.capa : '';
    raiz.querySelector('[data-v3-insignia="tejidos"]').textContent = E.sistemas.size < SISTEMAS_3D.length ? E.sistemas.size : '';
    for (const k of ['capas', 'tejidos']) {
      const b = raiz.querySelector(`[data-v3-menu="${k}"]`);
      b.disabled = !!E.aislada || !!LUGAR; b.title = LUGAR ? 'No se aplica mientras se ve el lugar' : E.aislada ? 'Con una pieza aislada no se aplica: «Mostrar todo» para volver' : (k === 'capas' ? 'Capas' : 'Tejidos');
    }
    if ((E.aislada || LUGAR) && (menu === 'capas' || menu === 'tejidos')) cerrarMenu(); else pintarMenu();
    pintarPie();
    render();
  }
  // Abajo, dentro del visor: la ficha de la pieza elegida o, si no hay ninguna, la línea de gestos.
  // La línea se oculta con su ✕ (Entrena lo recuerda) y deja en su sitio un ⓘ que la vuelve a
  // abrir; no sale mientras hay un menú abierto (lo tapaba); los gestos siguen también al pie del
  // menú Vista (decisiones del usuario, 2026-11).
  function pintarPie() {
    const el = raiz.querySelector('#v3Elegida'), pz = E.elegida && pieza(M, E.elegida);
    if (juego) { el.innerHTML = ''; return; } // en los modos con puntos, abajo va la pregunta de Entrena
    el.classList.toggle('v3-pie-info', !pz && !conAyuda && !menu);
    if (!pz) el.innerHTML = menu ? ''
      : conAyuda ? `<p class="v3-ayuda"><span>${tactil ? AYUDA_TACTIL : AYUDA_RATON}</span><button class="v3-ayuda-x" data-v3="ocultar-ayuda" aria-label="Ocultar la ayuda de gestos" title="Ocultar (queda el botón ⓘ)">${ICONO.cerrar}</button></p>`
      : `<button class="v3-info" data-v3="mostrar-ayuda" aria-label="Ver los gestos del visor" title="Ver los gestos">${ICONO.info}</button>`;
    else {
      const an = pz.anatomia ? enlacesAnatomia({ anatomia: [pz.anatomia] }) : [];
      el.innerHTML = `<div class="v3-ficha">
        <div class="v3-ficha-txt"><p class="v3-nombre">${esc(pz.nombre)}</p>
        ${LUGAR?.etiquetas.get(pz.id) ? `<p class="v3-de">De: ${LUGAR.etiquetas.get(pz.id).map(esc).join(' · ')}</p>` : ''}
        ${E.aislada ? '' : `<p class="v3-pista-ficha">${E.natural ? 'Toca fuera otra vez para soltarla' : 'Toca fuera para verla en su color'}</p>`}
        ${an.map(e => `<p class="anat"><a href="${esc(e.url)}" target="_blank" rel="noopener noreferrer" title="Abrir en Kenhub${e.ingles ? ' (sin versión en español)' : ''}${e.nota ? ' · ' + esc(e.nota) : ''}">Anatomía en Kenhub${e.ingles ? ' <span class="anat-en">EN</span>' : ''} ↗</a></p>`).join('')}</div>
        ${E.aislada ? '<button class="v3-ficha-btn" data-v3="todo">Mostrar todo</button>' : '<button class="v3-ficha-btn" data-v3="aislar">Aislar</button>'}
        <button class="v3-ficha-x" data-v3="soltar" aria-label="Quitar selección" title="Quitar selección">${ICONO.cerrar}</button></div>`;
    }
  }

  // Girar alrededor de lo aislado (o del centro de la rodilla), sin cambiar la distancia.
  const enfocar = punto => { const d = punto.clone().sub(controles.target); camara.position.add(d); controles.target.copy(punto); controles.update(); render(); };
  // Lista accesible: un grupo plegado por sistema, filas compactas, buscador. Abierto: el grupo de la
  // pieza elegida, los que el usuario abrió y, buscando, todos los que tienen resultados.
  const abiertos = new Set();
  function pintarLista() {
    const lista = pop.querySelector('#v3Lista'); if (!lista) return;
    pop.querySelector('#v3ListaTit').textContent = `Estructuras a la vista (${piezasVisibles(M, E).length})`;
    const q = pop.querySelector('#v3Buscar').value;
    const grupos = gruposLista(M, E, SISTEMAS_3D, q);
    const el = pieza(M, E.elegida || '');
    lista.innerHTML = grupos.length ? grupos.map(g => `<details class="v3-grupo" data-v3-grupo="${g.id}" ${q.trim() || abiertos.has(g.id) || (el && el.sistema === g.id) ? 'open' : ''}>
      <summary>${esc(g.nombre)} <span class="v3-n">${g.piezas.length}</span></summary>
      <div class="v3-filas">${g.piezas.map(p => `<button class="v3-fila" data-v3-pieza="${p.id}" aria-pressed="${E.elegida === p.id}">${esc(p.nombre)}</button>`).join('')}</div></details>`).join('')
      : '<p class="v3-pista">Ninguna estructura a la vista con ese nombre.</p>';
  }
  // Solo cuenta lo que abre o cierra el usuario (clic o Intro en el título): los grupos que se
  // abren solos al pintar (pieza elegida, búsqueda) también disparan «toggle» y no deben quedar abiertos.
  raiz.addEventListener('click', e => {
    const s = e.target.closest('.v3-grupo > summary'); if (!s) return;
    const g = s.parentElement, id = g.dataset.v3Grupo;
    if (g.open) abiertos.delete(id); else abiertos.add(id);
  });
  pop.addEventListener('input', e => { if (e.target.id === 'v3Buscar') pintarLista(); });
  // Carril de capas: arrastrar por la columna de números pasa de capa en capa mientras se mueve el
  // dedo, y el modelo cambia en vivo; se salta las capas que no tienen nada con los tejidos encendidos.
  // Los botones de cada capa siguen siendo la vía accesible (teclado, lector de pantalla).
  const capaEnY = y => {
    const filas = [...pop.querySelectorAll('[data-v3-capa]:not([disabled])')];
    let mejor = null, d = Infinity;
    for (const f of filas) { const r = f.getBoundingClientRect(), dd = y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0; if (dd < d) { d = dd; mejor = f; } }
    return mejor ? +mejor.dataset.v3Capa : null;
  };
  const moverCapa = e => {
    const n = capaEnY(e.clientY);
    if (n && n !== E.capa) { E.capa = n; sinElegidaOculta(); pintar(); }
  };
  pop.addEventListener('pointerdown', e => {
    if (menu !== 'capas' || !e.isPrimary || !e.target.closest('.v3-parada')) return;
    e.preventDefault(); arrastre = e.pointerId;
    try { pop.setPointerCapture(e.pointerId); } catch (_) {}
    moverCapa(e);
  });
  pop.addEventListener('pointermove', e => { if (arrastre === e.pointerId) moverCapa(e); });
  const soltarCapa = e => { if (arrastre === e.pointerId) arrastre = null; };
  pop.addEventListener('pointerup', soltarCapa);
  pop.addEventListener('pointercancel', soltarCapa);
  const restablecer = () => {
    Object.assign(E, { capa: 1, soloCapa: false, elegida: null, aislada: null, natural: false });
    SISTEMAS_3D.forEach(s => E.sistemas.add(s.id));
    ponerVista('anterior'); pintar();
  };
  const sinElegidaOculta = () => { if (E.elegida && !piezaVisible(pieza(M, E.elegida), E)) E.elegida = null; };
  const elegir = id => { E.elegida = id; E.natural = false; if (E.aislada && id !== E.aislada) E.aislada = null; pintar(); };
  // Tocar fuera del modelo (usuario, 2026-11): lo resaltado (la pieza elegida en magenta, o los lugares en
  // sus colores) se ve primero en su color real, con lo demás aún en transparente; otro toque fuera suelta
  // la pieza (o, con lugares y sin pieza, vuelve a sus colores).
  const tocarFuera = () => {
    if (E.elegida && !E.aislada && !E.natural) { E.natural = true; return pintar(); }
    if (E.elegida) return elegir(null);
    if (LUGAR) { E.natural = !E.natural; return pintar(); }
  };
  const alClic = e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.v3Menu) return abrirMenu(d.v3Menu);
    if (d.v3Vista) { ponerVista(d.v3Vista); return cerrarMenu({ foco: true }); }
    if (d.v3Sis) { E.sistemas.has(d.v3Sis) ? E.sistemas.delete(d.v3Sis) : E.sistemas.add(d.v3Sis); sinElegidaOculta(); return pintar(); }
    if (d.v3Capa) { E.capa = +d.v3Capa; sinElegidaOculta(); return pintar(); }
    if (d.v3Pieza) { cerrarMenu(); return elegir(E.elegida === d.v3Pieza ? null : d.v3Pieza); }
    const a = d.v3; if (!a) return;
    // Encuadrar = solo la cámara como al entrar (vista anterior, modelo entero, sin zoom): capas,
    // tejidos, pieza elegida y aislada se quedan como están (decisión del usuario, 2026-11).
    if (a === 'encuadrar') { cerrarMenu(); return ponerVista('anterior'); }
    // Restablecer = todo como al entrar: vista anterior, todas las capas («Hacia dentro»), todos los
    // tejidos, sin pieza elegida ni aislada (decisión del usuario, 2026-11). Solo la vista se cambia
    // desde el menú Vista, que ya la recoloca sin tocar lo demás.
    if (a === 'restablecer') { cerrarMenu(); return restablecer(); }
    if (a === 'ocultar-ayuda' || a === 'mostrar-ayuda') {
      conAyuda = a === 'mostrar-ayuda'; alCambiarAyuda(conAyuda); pintarPie();
      return raiz.querySelector(conAyuda ? '[data-v3="ocultar-ayuda"]' : '[data-v3="mostrar-ayuda"]')?.focus();
    }
    if (a === 'quitar') { E.capa = quitarCapa(M, E); sinElegidaOculta(); return pintar(); }
    if (a === 'poner') { E.capa = ponerCapa(M, E); sinElegidaOculta(); return pintar(); }
    if (a === 'solo-capa' || a === 'hacia-dentro') { E.soloCapa = a === 'solo-capa'; sinElegidaOculta(); return pintar(); }
    if (a === 'tejidos-todos') { SISTEMAS_3D.forEach(s => E.sistemas.add(s.id)); return pintar(); }
    if (a === 'aislar') { E.aislada = E.elegida; enfocar(new THREE.Box3().setFromObject(mallas[E.aislada]).getCenter(new THREE.Vector3())); return pintar(); }
    if (a === 'todo') { E.aislada = null; enfocar(centro); return pintar(); }
    if (a === 'soltar') { if (E.aislada) enfocar(centro); E.elegida = null; E.aislada = null; return pintar(); }
  };
  raiz.addEventListener('click', alClic);

  // Tocar sin arrastrar = elegir lo primero que hay bajo el dedo.
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
  let ini = null, ultimo = null;
  const abajo = e => { ini = e.isPrimary && !toqueCierra ? { x: e.clientX, y: e.clientY } : null; };
  const arriba = e => {
    toqueCierra = false;
    if (!ini) return; const mov = Math.hypot(e.clientX - ini.x, e.clientY - ini.y); ini = null;
    if (mov > TOQUE_PX) return;
    const r = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camara);
    if (juego) return tocarJuego(e);
    const vis = Object.values(mallas).filter(m => m.visible && !m.userData.fondo && (!E.elegida || m.name === E.elegida || m.material.opacity > 0.2));
    const hit = ray.intersectObjects(vis, false)[0];
    // Doble toque: girar alrededor de ese punto (y dejarlo elegido, sin alternar).
    const ahora = performance.now();
    const doble = ultimo && ahora - ultimo.t < DOBLE_TOQUE_MS && Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) < 30;
    ultimo = doble ? null : { t: ahora, x: e.clientX, y: e.clientY };
    if (doble) { if (hit) { enfocar(hit.point.clone()); elegir(hit.object.name); } return; }
    if (!hit) return tocarFuera();
    elegir(hit.object.name === E.elegida ? null : hit.object.name);
  };
  // Modos con puntos: el toque pone la marca y avisa a Entrena con lo que hay bajo el dedo: las
  // piezas hasta la primera opaca (incluida) y el primer punto de hueso, aunque lo tapen partes
  // blandas. El doble toque, además, centra el giro ahí. Bloqueado (corrigiendo o en ¿Qué sale
  // aquí?) solo gira.
  let bloqueado = false, ultimoToque = null;
  const marcaMalla = esfera(0.0045, COLOR_MARCA.puesta, 1); marcaMalla.visible = false; escena.add(marcaMalla);
  const huesos = Object.values(mallas).filter(m => pieza(M, m.name)?.tipo === 'hueso');
  function tocarJuego(e) {
    const ahora = performance.now();
    const doble = ultimo && ahora - ultimo.t < DOBLE_TOQUE_MS && Math.hypot(e.clientX - ultimo.x, e.clientY - ultimo.y) < 30;
    ultimo = doble ? null : { t: ahora, x: e.clientX, y: e.clientY };
    if (bloqueado || !juego.alTocar) return;
    const hasta = [];
    for (const h of ray.intersectObjects(Object.values(mallas).filter(m => m.visible && !m.userData.fondo), false)) { hasta.push(h); if (h.object.material.opacity >= 1) break; }
    const hueso = ray.intersectObjects(huesos, false)[0];
    const sitio = (hasta[0] || hueso)?.point;
    if (!sitio) { marcaMalla.visible = false; render(); return juego.alTocar(ultimoToque = null); }
    if (doble) enfocar(sitio.clone());
    marcaMalla.position.copy(sitio); marcaMalla.material.color.set(COLOR_MARCA.puesta); marcaMalla.visible = true; render();
    juego.alTocar(ultimoToque = { ids: [...new Set(hasta.map(h => h.object.name))], puntos: hasta.map(h => h.point.toArray()), hueso: hueso ? hueso.point.toArray() : null, rayo: { o: ray.ray.origin.toArray(), d: ray.ray.direction.toArray() } });
  }
  canvas.addEventListener('pointerdown', abajo);
  canvas.addEventListener('pointerup', arriba);

  // Para las pruebas: dónde cae en pantalla el centro de una pieza visible.
  caja.proyectar = id => {
    const m = mallas[id]; if (!m || !m.visible) return null;
    const c = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3()).project(camara), r = canvas.getBoundingClientRect();
    return { x: r.left + (c.x + 1) / 2 * r.width, y: r.top + (1 - c.y) / 2 * r.height };
  };
  // Para las pruebas: poner capa, «Solo esta» y una vista fija sin pasar por los menús.
  caja.preparar = ({ capa = 1, soloCapa = false, vista = 'anterior' } = {}) => { Object.assign(E, { capa, soloCapa }); ponerVista(vista); pintar(); };
  caja.proyectarPunto = v => {
    const c = new THREE.Vector3(...v).project(camara), r = canvas.getBoundingClientRect();
    return { x: r.left + (c.x + 1) / 2 * r.width, y: r.top + (1 - c.y) / 2 * r.height };
  };
  caja.estado = () => ({ ayuda: !!raiz.querySelector('#v3Elegida .v3-ayuda'), info: !!raiz.querySelector('#v3Elegida .v3-info'), objetivo: controles.target.toArray().map(v => +v.toFixed(4)), distancia: +camara.position.distanceTo(controles.target).toFixed(4), vista: vistaActual, menu, capa: E.capa, soloCapa: E.soloCapa, interiores: Object.values(mallas).filter(m => m.userData.dentro).length, elegida: E.elegida, aislada: E.aislada, natural: !!E.natural, colorElegida: E.elegida ? '#' + mallas[E.elegida].material.color.getHexString() : null, lugar: LUGAR ? [...LUGAR.color.keys()] : null, coloresLugar: LUGAR ? [...new Set([...LUGAR.color.values()].map(c => '#' + new THREE.Color(c).getHexString()).concat(grupoLugar.children.map(m => '#' + m.material.color.getHexString())))] : [], zonasLugar: grupoLugar.children.length / 2, toque: ultimoToque, deFicha: raiz.querySelector('#v3Elegida .v3-de')?.textContent || null, marca: marcaMalla.visible ? '#' + marcaMalla.material.color.getHexString() : null, bloqueado, herramientas: [...raiz.querySelectorAll('.v3-herr-btn')].map(b => b.dataset.v3Menu || b.dataset.v3), sistemas: [...E.sistemas], visibles: Object.values(mallas).filter(m => m.visible && !m.userData.fondo).length, fondo: Object.values(mallas).filter(m => m.visible && m.userData.fondo).length });

  ajustar(); ponerVista('anterior'); pintar();
  caja.querySelector('.visor-cargando').remove();
  caja.dataset.listo = '1';

  return {
    puntos,
    // Resalta un lugar ({ piezas, zonas }) en el color de 'pregunta' o 'correcto' y centra el giro en él.
    // Al preguntar (¿Qué sale aquí?), desde la vista fija que más de frente lo deja (lo posterior, desde
    // detrás); al corregir se queda la vista desde la que se tocó.
    lugar(l, tono = 'pregunta', { vista = tono === 'pregunta', etiqueta = '' } = {}) { this.lugares([{ ...l, color: COLOR_LUGAR[tono], etiqueta }], { vista }); },
    // Varios lugares, cada uno en su color ({ piezas, zonas, color }; Recorre el árbol): una pieza en dos
    // lugares se queda con el color del primero. Sin pieza elegida ni aislada, para no mezclar colores.
    lugares(lista, { vista = false } = {}) {
      LUGAR = { color: new Map(), etiquetas: new Map() };
      vaciar(grupoLugar);
      Object.assign(E, { elegida: null, aislada: null, natural: false });
      const caja3 = new THREE.Box3();
      for (const l of lista) {
        for (const id of l.piezas) {
          if (!LUGAR.color.has(id)) LUGAR.color.set(id, l.color);
          if (l.etiqueta) LUGAR.etiquetas.set(id, [...(LUGAR.etiquetas.get(id) || []), l.etiqueta]);
          caja3.expandByObject(mallas[id]);
        }
        for (const z of l.zonas) {
          const p = new THREE.Vector3(...puntos[z]); caja3.expandByPoint(p);
          const halo = esfera(RADIO_ZONA, l.color, 0.28), punto = esfera(0.004, l.color, 1);
          halo.position.copy(p); punto.position.copy(p); grupoLugar.add(halo, punto);
        }
      }
      const c = caja3.isEmpty() ? centro.clone() : caja3.getCenter(new THREE.Vector3());
      if (vista) {
        const d = c.clone().sub(centro), v = d.length() > 0.01 ? M.vistas.reduce((a, x) => new THREE.Vector3(...x.dir).dot(d) > new THREE.Vector3(...a.dir).dot(d) ? x : a) : M.vistas[0];
        ponerVista(v.id);
      }
      cerrarMenu(); enfocar(c); pintar();
    },
    sinLugar() { LUGAR = null; E.natural = false; vaciar(grupoLugar); pintar(); },
    // La marca del dedo: 'bien' o 'mal' al corregir; null la quita.
    marca(tono) { if (!tono) marcaMalla.visible = false; else marcaMalla.material.color.set(COLOR_MARCA[tono]); render(); },
    bloquear(v) { bloqueado = !!v; },
    // Cada pregunta empieza igual: todo como al entrar (capas, tejidos, vista), sin marca ni lugar.
    reiniciar() { cerrarMenu(); LUGAR = null; vaciar(grupoLugar); marcaMalla.visible = false; bloqueado = false; restablecer(); },
    destruir() {
      clearTimeout(saliendo); ro.disconnect(); controles.dispose(); raiz.removeEventListener('click', alClic);
      document.removeEventListener('pointerdown', fuera, true); document.removeEventListener('keydown', tecla, true);
      canvas.removeEventListener('pointerdown', abajo); canvas.removeEventListener('pointerup', arriba);
      gltf.scene.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
      vaciar(grupoLugar); marcaMalla.geometry.dispose(); marcaMalla.material.dispose();
      renderer.dispose();
    },
  };
}
