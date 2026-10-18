// ─── AMPLIAR CON IA (fases 2, 4 y 4b) ───────────────────────────
// Desde el texto de un «¿Por qué?» (fase 2: preguntas de cribado; 4: pasos del árbol CIF; 4b: tests)
// o del panel «Ampliar →», el clínico abre una conversación en una IA de
// búsqueda (Perplexity o Google en modo IA, gratis y sin cuenta; o Claude, con
// cuenta gratuita) para que le explique ese fragmento con más detalle. Dos entradas:
//   · seleccionar texto → botón flotante «✨ Ampliar en … ↗» bajo la selección
//     (debajo, para no tapar el menú del sistema, que sale encima; en táctil,
//     32 px más abajo, para dejar libres los marcadores de selección);
//   · sin seleccionar → «✨ IA ↗» al final de cada párrafo (el párrafo entero).
// La ▾ de los dos abre el menú para elegir destino, con la ventaja de cada
// uno; la elección se recuerda en localStorage (preferencia de pantalla por
// dispositivo, como el tema; no es un dato clínico).
//
// Solo sale el texto del razonamiento (contenido genérico de data/) y el
// contexto de dónde está (pregunta o test, región): nunca datos del paciente.
// Solo se activa dentro de un contenedor con `data-ia-ctx`, que solo llevan
// los bloques de razonamiento. Consulta externa: PhysiQ no revisa la
// respuesta. No se usa dentro del hub (initAmpliarIA() no hace nada en un
// iframe y CSS oculta los enlaces).
//
// Los enlaces son <a target="_blank">, nunca window.open: el href se calcula
// en el propio click, antes de la navegación, así no lo bloquea el navegador.

export const DESTINOS_IA = {
  perplexity: {
    nombre: 'Perplexity',
    url: q => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}`,
    ventaja: 'Cita cada afirmación con su fuente enlazada: la mejor para llegar al artículo original y comprobarlo.',
  },
  google: {
    nombre: 'Google (modo IA)',
    url: q => `https://www.google.com/search?udm=50&q=${encodeURIComponent(q)}`,
    ventaja: 'Respuesta rápida y conversación ágil para encadenar dudas; mezcla más webs divulgativas y las fuentes se ven menos.',
  },
  // Pide sesión iniciada (cuenta gratuita): no es la opción por defecto. El
  // parámetro ?q= de claude.ai no está documentado oficialmente (2026-10):
  // si deja de funcionar, se abre Claude con la caja vacía.
  claude: {
    nombre: 'Claude',
    url: q => `https://claude.ai/new?q=${encodeURIComponent(q)}`,
    ventaja: 'Razona y explica mejor el porqué y sostiene bien una conversación larga. Pide iniciar sesión con una cuenta de Claude (gratuita) y, para citar fuentes, tener activada la búsqueda web.',
    cuenta: true,
  },
};
export const DESTINO_IA_DEFECTO = 'perplexity';
const CLAVE_DESTINO = 'physiq-assessment-ia-destino';

// Frase del usuario (2026-10), literal.
export const INSTRUCCION_FUENTES = 'Busca información solo en fuentes científicas o académicas como PubMed, revistas científicas, libros de medicina o fisiología o fuentes institucionales universitarias.';
// Tope del fragmento: la URL completa (codificada) debe caber de sobra en los
// límites de los buscadores.
export const MAX_TEXTO_IA = 800;

export function destinoIA() {
  try { const d = localStorage.getItem(CLAVE_DESTINO); if (DESTINOS_IA[d]) return d; } catch (e) {}
  return DESTINO_IA_DEFECTO;
}
export function guardarDestinoIA(d) {
  if (!DESTINOS_IA[d]) return;
  try { localStorage.setItem(CLAVE_DESTINO, d); } catch (e) {}
}

const _sinEtiquetas = t => String(t ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
const _region = r => r ? `región ${String(r).replace(/_/g, ' y ')}` : '';

// Contexto de dónde está el fragmento, como complemento de «sobre …».
export function ctxCribado(region, pregunta) {
  const reg = _region(region);
  return `la pregunta de cribado de banderas rojas «${_sinEtiquetas(pregunta)}»${reg ? ` (${reg})` : ''}`;
}
export function ctxTest(region, test, hipotesis) {
  const reg = _region(region);
  const hip = hipotesis ? ` para la hipótesis «${_sinEtiquetas(hipotesis)}»` : '';
  return `el test clínico «${_sinEtiquetas(test)}»${hip}${reg ? ` (${reg})` : ''}`;
}

export function ctxArbol(region, pregunta) {
  const reg = _region(region);
  return `el paso del árbol de decisión clínica (modelo CIF) «${_sinEtiquetas(pregunta)}»${reg ? ` (${reg})` : ''}`;
}

export const attrIA = t => String(t ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function recortarTextoIA(texto) {
  const t = String(texto ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= MAX_TEXTO_IA) return t;
  const corte = t.slice(0, MAX_TEXTO_IA);
  const esp = corte.lastIndexOf(' ');
  return `${(esp > MAX_TEXTO_IA * 0.6 ? corte.slice(0, esp) : corte).replace(/[\s,;:.]+$/, '')}…`;
}

export function promptIA({ contexto, texto }) {
  const sobre = contexto ? ` sobre ${contexto}` : '';
  return `Soy fisioterapeuta. Explícame con más detalle, desde la fisiología y la fisiopatología, este fragmento${sobre}: «${recortarTextoIA(texto)}». ${INSTRUCCION_FUENTES} Cita las fuentes con enlace.`;
}

// «✨ Preguntar a la IA» (botón de la cabecera, app.js): una pregunta libre del
// clínico, no un fragmento. Mismos añadidos que el razonamiento (quién pregunta
// y la frase de fuentes), sin forzar el enfoque fisiológico, porque la duda
// puede ser de dosis, de técnica o de diagnóstico diferencial. `contexto` es
// solo la región ya en minúscula («hombro», «tobillo y pie»): nada del paciente.
//
// `tipo: 'farmacos'` (modalidad «Fármacos» del diálogo, docs/farmacologia.md,
// paso 1): el texto son los fármacos o la duda, y se añade un guion fijo para
// que la respuesta cubra siempre lo que el fisioterapeuta necesita vigilar,
// sin entrar a ajustar la medicación.
export const TIPOS_PREGUNTA = {
  libre: { nombre: 'Pregunta libre', placeholder: 'Ej.: ¿Qué diferencia hay entre el test de Hawkins y el de Neer?' },
  farmacos: {
    nombre: 'Fármacos',
    placeholder: 'Ej.: ibuprofeno 600 mg cada 8 h y omeprazol, desde hace 3 semanas',
    guion: 'La respuesta cubrirá: dolor e inflamación · síntomas viscerales que imitan dolor musculoesquelético · ejercicio · sueño · cuándo consultar con el médico o el farmacéutico. No propone cambiar la medicación.',
  },
};
export const TIPO_PREGUNTA_DEFECTO = 'libre';

export const GUION_FARMACOS = 'Para cada fármaco o familia, explícame qué debo vigilar como fisioterapeuta: '
  + '1) su efecto sobre el dolor y la inflamación, y si puede enmascarar signos o síntomas en la exploración; '
  + '2) síntomas viscerales o secundarios que puede producir y que pueden confundirse con dolor musculoesquelético, y a qué zona se refieren; '
  + '3) precauciones con el ejercicio terapéutico (respuesta de la frecuencia cardíaca y la presión arterial, hipoglucemia, sangrado o hematomas, hidratación, tendón o hueso); '
  + '4) sus efectos sobre el sueño; '
  + '5) qué signos justifican consultar con el médico o el farmacéutico. '
  + 'No propongas cambiar, suspender ni ajustar la medicación.';

export function promptPregunta({ contexto, pregunta, tipo = TIPO_PREGUNTA_DEFECTO }) {
  const ctx = contexto ? ` Contexto: valoración de ${_sinEtiquetas(contexto)}.` : '';
  if (tipo === 'farmacos') {
    return `Soy fisioterapeuta.${ctx} Fármacos o duda: «${recortarTextoIA(pregunta)}». ${GUION_FARMACOS} ${INSTRUCCION_FUENTES} Incluye la ficha técnica (CIMA, AEMPS) cuando sea pertinente. Cita las fuentes con enlace.`;
  }
  return `Soy fisioterapeuta.${ctx} Mi pregunta: «${recortarTextoIA(pregunta)}». ${INSTRUCCION_FUENTES} Cita las fuentes con enlace.`;
}

export function urlIA(destino, prompt) {
  return (DESTINOS_IA[destino] || DESTINOS_IA[DESTINO_IA_DEFECTO]).url(prompt);
}

// Enlace al final de un párrafo de razonamiento (el párrafo entero). Su texto
// sale del <p> que lo contiene, o del bloque .razon-fisio (pasos numerados).
export function iaParrafoHTML() {
  return ` <span class="ia-parrafo"><a class="ia-parrafo-ir" href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer">✨ IA ↗</a><button type="button" class="ia-elegir" aria-haspopup="menu" aria-label="Elegir la IA">▾</button></span>`;
}

// Texto legible de un nodo o fragmento: sin las etiquetas («Por qué»), los
// enlaces ni la metáfora divulgativa; un espacio entre párrafos y pasos.
const EXCLUIR = '.razon-etq, .ia-parrafo, .razon-ampliar, .razon-enlace, .razon-metafora';
export function textoDe(nodo) {
  const c = nodo.cloneNode(true);
  c.querySelectorAll?.(EXCLUIR).forEach(e => e.remove());
  c.querySelectorAll?.('li, p').forEach(e => e.append(' '));
  return String(c.textContent || '').replace(/\s+/g, ' ').trim();
}

// ── DOM ──────────────────────────────────────────────────────
let _barra = null, _menu = null;
let _objetivo = null;          // { contexto, texto } de la barra
let _menuObjetivo = null;      // { contexto, texto } del menú abierto
let _tocandoBarra = false, _tSel = null, _tOcultar = null;
let _fueraDeVista = false;      // hay selección, pero el scroll la ha sacado de la franja visible

const _el = n => (n?.nodeType === 1 ? n : n?.parentElement) || null;
const _contenedor = n => _el(n)?.closest('[data-ia-ctx]') || null;

function _objetivoParrafo(enlace) {
  const fuente = enlace.closest('p, .razon-fisio');
  const cont = _contenedor(enlace);
  if (!fuente || !cont) return null;
  return { contexto: cont.dataset.iaCtx, texto: textoDe(fuente) };
}

function _pintarBarra() {
  const d = destinoIA();
  const ir = _barra.querySelector('.ia-barra-ir');
  ir.textContent = `✨ Ampliar en ${DESTINOS_IA[d].nombre.replace(/ \(.*\)$/, '')} ↗`;
  ir.title = `Abre ${DESTINOS_IA[d].nombre} en otra pestaña con el texto seleccionado. Consulta externa: PhysiQ no revisa la respuesta.`;
  if (_objetivo) ir.href = urlIA(d, promptIA(_objetivo));
}

// Separación de la barra respecto a la selección: en pantalla táctil, hueco
// para los marcadores nativos de selección (las «gotas» que se arrastran para
// alargarla), que la barra tapaba; con ratón no hay marcadores.
export const SEPARACION_BARRA = { tactil: 32, raton: 8 };
const _tactil = () => !!window.matchMedia?.('(pointer: coarse)').matches;

// Franja visible de la página: entre lo fijo de arriba (cabecera, barra de
// fases, barras de contexto de las fases 2 y 4b) y los botones fijos de abajo
// (móvil). La barra y el menú no se pintan encima de eso.
const _FIJOS_ARRIBA = '.app-header, .phase-nav, .mobile-phase-bar, .sis-context-banner, .hyp-context-banner';
function _franjaVisible() {
  let arriba = 0, abajo = innerHeight;
  const fijo = el => getComputedStyle(el).position === 'fixed';
  document.querySelectorAll(_FIJOS_ARRIBA).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height > 0 && fijo(el) && r.top < innerHeight / 2) arriba = Math.max(arriba, r.bottom);
  });
  const nav = document.querySelector('.phase.active .nav-buttons');
  if (nav && fijo(nav)) { const r = nav.getBoundingClientRect(); if (r.height > 0) abajo = Math.min(abajo, r.top); }
  return { arriba, abajo };
}

function _colocar(el, rect, { sep = 8, franja = _franjaVisible() } = {}) {
  el.style.left = '0px'; el.style.top = '0px';
  const w = el.offsetWidth, h = el.offsetHeight, m = 8;
  const min = franja.arriba + m, max = franja.abajo - h - m;
  let top = rect.bottom + sep;
  if (top > max) top = rect.top - h - sep;
  if (top < min) top = Math.min(rect.bottom + sep, max);
  const left = Math.max(m, Math.min(rect.left + rect.width / 2 - w / 2, innerWidth - w - m));
  el.style.left = `${Math.round(left)}px`; el.style.top = `${Math.round(Math.max(min, top))}px`;
}

function _ocultarBarra() {
  clearTimeout(_tOcultar);
  if (_barra) _barra.hidden = true;
  _objetivo = null;
  _fueraDeVista = false;
}

const _sinSeleccion = () => {
  const sel = window.getSelection?.();
  return !sel || sel.isCollapsed || !sel.rangeCount;
};

// Sin selección, la barra se oculta un poco después: al tocarla en un móvil la
// selección se pierde antes del click. Mientras se toca o con el menú abierto
// no se oculta, pero se vuelve a mirar después (antes se quedaba flotando si el
// menú se cerraba sin elegir).
function _ocultarSiSinSeleccion() {
  clearTimeout(_tOcultar);
  _tOcultar = setTimeout(() => {
    if (!_barra || _barra.hidden || !_sinSeleccion()) return;
    if (_tocandoBarra || (_menu && !_menu.hidden)) { _ocultarSiSinSeleccion(); return; }
    _ocultarBarra();
  }, 400);
}

function _evaluarSeleccion() {
  const sel = window.getSelection?.();
  if (_sinSeleccion()) {
    _fueraDeVista = false;
    if (_barra && !_barra.hidden) _ocultarSiSinSeleccion();
    return;
  }
  const rango = sel.getRangeAt(0);
  const cont = _contenedor(rango.commonAncestorContainer);
  const texto = cont ? textoDe(rango.cloneContents()) : '';
  if (!cont || texto.length < 3) { _ocultarBarra(); return; }
  clearTimeout(_tOcultar);
  _objetivo = { contexto: cont.dataset.iaCtx, texto };
  // Selección fuera de la franja visible (scroll): la barra se esconde sin
  // perder la selección y vuelve al volver a verla. Antes se quedaba clavada
  // arriba, encima de la cabecera, lejos del texto.
  const rect = rango.getBoundingClientRect(), franja = _franjaVisible();
  if (rect.bottom <= franja.arriba || rect.top >= franja.abajo) {
    _barra.hidden = true; _fueraDeVista = true;
    return;
  }
  _fueraDeVista = false;
  _pintarBarra();
  _barra.hidden = false;
  _colocar(_barra, rect, { sep: _tactil() ? SEPARACION_BARRA.tactil : SEPARACION_BARRA.raton, franja });
}

function _abrirMenu(boton, objetivo) {
  if (!objetivo) return;
  _menuObjetivo = objetivo;
  const d = destinoIA();
  _menu.querySelectorAll('.ia-menu-op').forEach(a => {
    const k = a.dataset.destino;
    a.href = urlIA(k, promptIA(objetivo));
    a.classList.toggle('actual', k === d);
    a.setAttribute('aria-checked', k === d ? 'true' : 'false');
  });
  _menu.hidden = false;
  _colocar(_menu, boton.getBoundingClientRect());
  _menu.querySelector('.ia-menu-op.actual')?.focus({ preventScroll: true });
}
function _cerrarMenu() {
  if (_menu && !_menu.hidden) { _menu.hidden = true; _menuObjetivo = null; _ocultarSiSinSeleccion(); }
}

// Qué IA pide cuenta, para el menú y el diálogo de pregunta libre
export const NOTA_CUENTAS = (() => {
  const libres = Object.values(DESTINOS_IA).filter(d => !d.cuenta).map(d => d.nombre.replace(/ \(.*\)$/, ''));
  const conCuenta = Object.values(DESTINOS_IA).filter(d => d.cuenta).map(d => d.nombre);
  return `${libres.join(' y ')} son gratis y sin cuenta; ${conCuenta.join(' y ')} pide cuenta (gratuita). Todas permiten seguir preguntando.`;
})();

const _HTML_MENU = () => `
  <div class="ia-menu-tit">Ampliar con IA en…</div>
  ${Object.entries(DESTINOS_IA).map(([k, d]) => `
  <a class="ia-menu-op" role="menuitemradio" data-destino="${k}" href="#" target="_blank" rel="noopener noreferrer">
    <span class="ia-menu-nombre">${d.nombre}<span class="ia-menu-check" aria-hidden="true">✓</span></span>
    <span class="ia-menu-desc">${d.ventaja}</span>
  </a>`).join('')}
  <div class="ia-menu-nota">${NOTA_CUENTAS} Solo se envía el texto del «¿Por qué?», nunca datos del paciente. Consulta externa: PhysiQ no revisa la respuesta.</div>`;

export function initAmpliarIA() {
  if (window.self !== window.top || _barra || !document.body) return;
  _barra = document.createElement('div');
  _barra.id = 'iaBarra'; _barra.className = 'ia-barra'; _barra.hidden = true;
  _barra.innerHTML = `<a class="ia-barra-ir" href="https://www.perplexity.ai/" target="_blank" rel="noopener noreferrer"></a><button type="button" class="ia-elegir" aria-haspopup="menu" aria-label="Elegir la IA">▾</button>`;
  _menu = document.createElement('div');
  _menu.id = 'iaMenu'; _menu.className = 'ia-menu'; _menu.hidden = true;
  _menu.setAttribute('role', 'menu');
  _menu.innerHTML = _HTML_MENU();
  document.body.appendChild(_barra);
  document.body.appendChild(_menu);

  // En escritorio, que pulsar la barra no deshaga la selección.
  _barra.addEventListener('mousedown', e => e.preventDefault());
  _barra.addEventListener('pointerdown', () => { _tocandoBarra = true; clearTimeout(_tOcultar); });
  const soltar = () => setTimeout(() => { _tocandoBarra = false; }, 600);
  _barra.addEventListener('pointerup', soltar);
  _barra.addEventListener('pointercancel', soltar);

  document.addEventListener('selectionchange', () => { clearTimeout(_tSel); _tSel = setTimeout(_evaluarSeleccion, 150); });
  const recolocar = () => { if (!_barra.hidden) _evaluarSeleccion(); _cerrarMenu(); };
  window.addEventListener('resize', recolocar);
  // El menú va anclado al botón que lo abrió: con scroll se cierra (como al
  // redimensionar), en vez de quedarse flotando donde estaba.
  document.addEventListener('scroll', () => {
    _cerrarMenu();
    if (!_barra.hidden || _fueraDeVista) _evaluarSeleccion();
  }, { capture: true, passive: true });

  document.addEventListener('click', e => {
    const t = e.target instanceof Element ? e.target : null;
    if (!t) return;
    const parrafo = t.closest('.ia-parrafo-ir');
    if (parrafo) {
      const obj = _objetivoParrafo(parrafo);
      if (obj) parrafo.href = urlIA(destinoIA(), promptIA(obj));
      return;                                   // la navegación sigue sola
    }
    if (t.closest('.ia-barra-ir')) { _pintarBarra(); setTimeout(_ocultarBarra, 0); return; }
    const elegir = t.closest('.ia-elegir');
    if (elegir) {
      e.preventDefault();
      if (!_menu.hidden) { _cerrarMenu(); return; }
      _abrirMenu(elegir, elegir.closest('.ia-barra') ? _objetivo : _objetivoParrafo(elegir));
      return;
    }
    const op = t.closest('.ia-menu-op');
    if (op) {
      guardarDestinoIA(op.dataset.destino);
      if (_menuObjetivo) op.href = urlIA(op.dataset.destino, promptIA(_menuObjetivo));
      setTimeout(() => { _cerrarMenu(); _ocultarBarra(); }, 0);
      return;
    }
    if (!t.closest('#iaMenu')) _cerrarMenu();
  });
  // Escape cierra el menú antes que el panel del razonamiento.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && _menu && !_menu.hidden) { e.stopImmediatePropagation(); _cerrarMenu(); }
  }, true);
}
