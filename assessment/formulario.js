// ============================================================
// PhysiQ-Assessment · FORMULARIO.JS
// Formulario previo a la primera visita (lo rellena el fisioterapeuta).
// Motor genérico: el contenido vive en formularios/comun.js (cara 1) y
// formularios/<region>.js (cara 2), un archivo por región. app.js carga este
// módulo con import() dinámico, así que un fallo aquí nunca rompe el resto
// de la app.
// ============================================================
import { state } from './state.js';
import { saveSession, injectQuickInputBar, lockBodyScroll, unlockBodyScroll } from './app.js';
import COMUN from './formularios/comun.js';

// Regiones con archivo formularios/<region>.js. Al añadir uno, añadirlo aquí
// (tests/unit.js comprueba que cada entrada carga): así no se pide por red
// un archivo que no existe (404 en consola) para las demás regiones.
export const REGIONES_CON_FORMULARIO = ['lumbar', 'cadera'];
const _regiones = {};          // region → esquema | null (sin formulario)
let _tab = 'comun';

// ─── Carga de esquemas ───────────────────────────────────────
export async function cargarEsquemaRegion(region) {
  if (!region || !REGIONES_CON_FORMULARIO.includes(region)) return null;
  if (!(region in _regiones)) {
    try { _regiones[region] = (await import(`./formularios/${region}.js`)).default; }
    catch { _regiones[region] = null; }
  }
  return _regiones[region];
}

function esquemaDe(scope) {
  return scope === 'comun' ? COMUN : _regiones[scope] || null;
}

// ─── Estado ──────────────────────────────────────────────────
// state.formularioPrevio = { comun: {id: valor}, regiones: { lumbar: {...} } }
// Las respuestas de cada región se guardan aparte, así que cambiar de región
// no borra lo que ya se rellenó de otra.
function fp() {
  if (!state.formularioPrevio || typeof state.formularioPrevio !== 'object') {
    state.formularioPrevio = { comun: {}, regiones: {} };
  }
  state.formularioPrevio.comun ??= {};
  state.formularioPrevio.regiones ??= {};
  return state.formularioPrevio;
}

function respuestas(scope) {
  const d = fp();
  if (scope === 'comun') return d.comun;
  return (d.regiones[scope] ??= {});
}

function buscarItem(esquema, id) {
  for (const s of esquema.secciones) for (const it of s.items) if (it.id === id) return it;
  return null;
}

function visible(item, resp) {
  if (!item.mostrarSi) return true;
  const v = resp[item.mostrarSi.id];
  const vals = Array.isArray(v) ? v : [v];
  return vals.some(x => item.mostrarSi.valores.includes(x));
}

function vacio(v) {
  if (v == null || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
}

// ─── Mutaciones (desde los onclick del formulario) ───────────
function _item(scope, id) {
  const e = esquemaDe(scope);
  return e ? buscarItem(e, id) : null;
}

function fpUnica(scope, id, idx) {
  const it = _item(scope, id); if (!it) return;
  const r = respuestas(scope);
  const val = it.opciones[idx];
  // Segundo clic en la opción ya marcada la desmarca (misma convención que .option-btn)
  if (r[id] === val) delete r[id]; else r[id] = val;
  _guardarYRepintar();
}

function fpMulti(scope, id, idx) {
  const it = _item(scope, id); if (!it) return;
  const r = respuestas(scope);
  const val = it.opciones[idx];
  const set = new Set(r[id] || []);
  set.has(val) ? set.delete(val) : set.add(val);
  if (set.size) r[id] = it.opciones.filter(o => set.has(o)); else delete r[id];
  _guardarYRepintar();
}

function fpEscala(scope, id, val) {
  const r = respuestas(scope);
  if (r[id] === val) delete r[id]; else r[id] = val;
  _guardarYRepintar();
}

function fpMatriz(scope, id, filaIdx, optIdx) {
  const it = _item(scope, id); if (!it) return;
  const r = respuestas(scope);
  const fila = it.filas[filaIdx].id, val = it.opciones[optIdx];
  const m = { ...(r[id] || {}) };
  if (m[fila] === val) delete m[fila]; else m[fila] = val;
  if (Object.keys(m).length) r[id] = m; else delete r[id];
  _guardarYRepintar();
}

// Texto: no repinta (perdería el foco y el dictado en curso), solo guarda.
function fpTexto(scope, key, value) {
  const r = respuestas(scope);
  if (value.trim()) r[key] = value; else delete r[key];
  _actualizarContador();
  saveSession();
}

function _guardarYRepintar() {
  saveSession();
  const body = document.getElementById('fpBody');
  const top = body ? body.scrollTop : 0;
  _pintarCuerpo();
  if (body) body.scrollTop = top;
  _actualizarContador();
}

// ─── Render ──────────────────────────────────────────────────
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function btn(sel, label, onclick) {
  return `<button type="button" class="option-btn fp-opt${sel ? ' selected' : ''}" onclick="${onclick}">${esc(label)}</button>`;
}

function renderItem(scope, it, resp) {
  if (!visible(it, resp)) return '';
  const v = resp[it.id];
  const cab = `${it.texto ? `<div class="fp-q">${esc(it.texto)}</div>` : ''}${it.ayuda ? `<div class="fp-hint">${esc(it.ayuda)}</div>` : ''}`;
  let cuerpo = '';

  if (it.tipo === 'unica' || it.tipo === 'multi') {
    const fn = it.tipo === 'unica' ? 'fpUnica' : 'fpMulti';
    const sel = o => it.tipo === 'unica' ? v === o : (v || []).includes(o);
    cuerpo = `<div class="fp-opts">${it.opciones.map((o, i) => btn(sel(o), o, `${fn}('${scope}','${it.id}',${i})`)).join('')}</div>`;
    if (it.detalle && sel(it.detalle.opcion)) cuerpo += textarea(scope, `${it.id}__detalle`, it.detalle.etiqueta, 1, resp);
  } else if (it.tipo === 'escala') {
    const nums = [];
    for (let n = it.min; n <= it.max; n++) nums.push(btn(v === n, String(n), `fpEscala('${scope}','${it.id}',${n})`));
    cuerpo = `<div class="fp-escala">${nums.join('')}</div>
      <div class="fp-escala-ext"><span>${esc(it.extremos[0])}</span><span>${esc(it.extremos[1])}</span></div>
      <div class="fp-opts">${btn(v === 'ns', 'No sabría decir', `fpEscala('${scope}','${it.id}','ns')`)}</div>`;
  } else if (it.tipo === 'matriz') {
    const m = v || {};
    cuerpo = `<div class="fp-matriz">${it.filas.map((f, fi) => `
      <div class="fp-fila"><span class="fp-fila-txt">${esc(f.texto)}</span>
        <span class="fp-fila-opts">${it.opciones.map((o, oi) => btn(m[f.id] === o, o, `fpMatriz('${scope}','${it.id}',${fi},${oi})`)).join('')}</span>
      </div>`).join('')}</div>`;
  } else if (it.tipo === 'texto') {
    return `<div class="fp-item">${textarea(scope, it.id, it.texto, it.lineas || 1, resp, it.ayuda)}</div>`;
  }
  return `<div class="fp-item">${cab}${cuerpo}</div>`;
}

function textarea(scope, key, etiqueta, lineas, resp, ayuda) {
  const fid = `fp_${scope}_${key}`;
  return `${etiqueta ? `<label class="fp-q" for="${fid}">${esc(etiqueta)}</label>` : ''}
    ${ayuda ? `<div class="fp-hint">${esc(ayuda)}</div>` : ''}
    <textarea class="form-input fp-text" id="${fid}" rows="${lineas}" data-scope="${scope}" data-key="${key}"
      oninput="fpTexto('${scope}','${key}',this.value)">${esc(resp[key] || '')}</textarea>`;
}

function _pintarCuerpo() {
  const body = document.getElementById('fpBody');
  if (!body) return;
  document.querySelectorAll('#fpTabs .fp-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === _tab));

  const scope = _tab === 'comun' ? 'comun' : state.region;
  const esquema = _tab === 'comun' ? COMUN : _regiones[state.region];
  if (!esquema) {
    body.innerHTML = `<div class="alert alert-info"><span class="alert-icon">ℹ️</span><span>${
      !state.region ? 'Elija la región en la fase 2 para ver las preguntas de la región.'
                    : 'Esta región todavía no tiene formulario propio.'}</span></div>`;
    return;
  }
  const resp = respuestas(scope);
  body.innerHTML = `
    <div class="fp-titulo">${esc(esquema.titulo)}</div>
    ${esquema.intro ? `<div class="fp-hint">${esc(esquema.intro)}</div>` : ''}
    ${esquema.secciones.map(s => `
      <div class="fp-seccion">
        <div class="fp-seccion-titulo">${esc(s.titulo)}</div>
        ${s.intro ? `<div class="fp-hint">${esc(s.intro)}</div>` : ''}
        ${s.items.map(it => renderItem(scope, it, resp)).join('')}
      </div>`).join('')}`;

  // Micro + chips en cada texto (mismo componente que motivo de consulta)
  body.querySelectorAll('textarea.fp-text').forEach(ta => {
    const it = buscarItem(esquema, ta.dataset.key);
    injectQuickInputBar(ta.id, (it && it.chips) || []);
  });
}

function _asegurarDOM() {
  if (document.getElementById('fpOverlay')) return;
  const el = document.createElement('div');
  el.id = 'fpOverlay';
  el.className = 'fp-overlay';
  el.innerHTML = `
    <div class="fp-sheet" role="dialog" aria-modal="true" aria-label="Formulario previo">
      <div class="fp-head">
        <div class="fp-head-title">📝 Formulario previo</div>
        <button type="button" class="fp-close" onclick="cerrarFormularioPrevio()" aria-label="Cerrar">✕</button>
      </div>
      <div class="fp-tabs" id="fpTabs">
        <button type="button" class="fp-tab" data-tab="comun" onclick="fpTab('comun')">General</button>
        <button type="button" class="fp-tab" data-tab="region" id="fpTabRegion" onclick="fpTab('region')">Región</button>
      </div>
      <div class="fp-body" id="fpBody"></div>
      <div class="fp-foot"><button type="button" class="btn btn-primary" onclick="cerrarFormularioPrevio()">Hecho</button></div>
    </div>`;
  document.body.appendChild(el);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && el.classList.contains('open')) cerrarFormularioPrevio();
  });
}

function _nombreRegion(r) { return r ? r.charAt(0).toUpperCase() + r.slice(1) : 'Región'; }

export async function abrirFormularioPrevio(tab) {
  _asegurarDOM();
  await cargarEsquemaRegion(state.region);
  _tab = tab || (state.region && _regiones[state.region] ? 'region' : 'comun');
  document.getElementById('fpTabRegion').textContent = _nombreRegion(state.region);
  _pintarCuerpo();
  document.getElementById('fpBody').scrollTop = 0;
  document.getElementById('fpOverlay').classList.add('open');
  lockBodyScroll();
}

export function cerrarFormularioPrevio() {
  const el = document.getElementById('fpOverlay');
  if (!el || !el.classList.contains('open')) return;
  // Cualquier dictado en curso se para al cerrar
  el.querySelectorAll('.mic-btn').forEach(b => b._recognition && b._recognition.stop());
  el.classList.remove('open');
  unlockBodyScroll();
  saveSession();
  _actualizarContador();
}

function fpTab(tab) {
  _tab = tab;
  _pintarCuerpo();
  document.getElementById('fpBody').scrollTop = 0;
}

// ─── Lectura (resumen, pistas, contador) ─────────────────────
function textoRespuesta(it, v, resp) {
  if (it.tipo === 'matriz') {
    return it.filas.filter(f => v[f.id]).map(f => `${f.texto}: ${v[f.id]}`).join(' · ');
  }
  let t = Array.isArray(v) ? v.join(', ') : v === 'ns' ? 'No sabría decir' : String(v);
  if (it.tipo === 'escala' && v !== 'ns') t = `${v}/${it.max}`;
  const det = resp[`${it.id}__detalle`];
  if (it.detalle && det && (Array.isArray(v) ? v.includes(it.detalle.opcion) : v === it.detalle.opcion)) t += ` — ${det}`;
  return t;
}

function preguntaCorta(it, seccion) {
  // Algunas preguntas solo tienen sentido con el título de su sección («2», «3»)
  return it.texto && it.texto.length > 3 ? it.texto : `${seccion.titulo} ${it.texto || ''}`.trim();
}

function resumenDe(scope) {
  const esquema = esquemaDe(scope);
  if (!esquema) return [];
  const resp = scope === 'comun' ? fp().comun : (fp().regiones[scope] || {});
  const out = [];
  esquema.secciones.forEach(s => s.items.forEach(it => {
    const v = resp[it.id];
    if (vacio(v) || !visible(it, resp)) return;
    out.push({ s: scope === 'comun' ? 'General' : _nombreRegion(scope), q: preguntaCorta(it, s), a: textoRespuesta(it, v, resp) });
  }));
  return out;
}

// [{ s: sección, q: pregunta, a: respuesta }] de la cara común y de la región
// actual. Síncrono: si el esquema de la región aún no se ha cargado, solo
// devuelve la cara común (app.js lo precarga al elegir región).
export function resumenFormularioPrevio() {
  return [...resumenDe('comun'), ...(state.region ? resumenDe(state.region) : [])];
}

export function contarRespuestas() {
  return resumenFormularioPrevio().length;
}

// Pistas para un paso del árbol CIF: respuestas del formulario ligadas a ese
// paso en `esquema.pistas`. Solo recuerdan; nunca responden el paso.
export function pistasPaso(stepId) {
  const esquema = state.region && _regiones[state.region];
  const refs = esquema?.pistas?.[stepId];
  if (!refs) return [];
  const out = [];
  refs.forEach(ref => {
    const [pref, rest] = ref.split(':');
    const scope = pref === 'c' ? 'comun' : state.region;
    const esq = esquemaDe(scope);
    const resp = scope === 'comun' ? fp().comun : (fp().regiones[scope] || {});
    const [id, fila] = rest.split('.');
    const it = esq && buscarItem(esq, id);
    if (!it || !visible(it, resp)) return;
    const v = resp[id];
    if (fila) {
      const f = it.filas.find(x => x.id === fila);
      if (f && v && v[fila]) out.push({ q: f.texto, a: v[fila] });
    } else if (!vacio(v)) {
      out.push({ q: it.texto, a: textoRespuesta(it, v, resp) });
    }
  });
  return out;
}

export function pistasPasoHTML(stepId) {
  const p = pistasPaso(stepId);
  if (!p.length) return '';
  return `<div class="fp-pistas"><div class="fp-pistas-title">📝 Del formulario previo</div>${
    p.map(x => `<div class="fp-pista"><span class="fp-pista-q">${esc(x.q)}</span> <span class="fp-pista-a">${esc(x.a)}</span></div>`).join('')}</div>`;
}

function _actualizarContador() {
  const el = document.getElementById('fpContador');
  if (!el) return;
  const n = contarRespuestas();
  el.textContent = n ? `${n} respuesta${n === 1 ? '' : 's'} registrada${n === 1 ? '' : 's'}` : 'Sin rellenar';
}

export async function precargarFormulario() {
  await cargarEsquemaRegion(state.region);
  _actualizarContador();
}

// Exposed for inline onclick/oninput attributes built above — those resolve
// only against the global scope, never a module's private scope.
Object.assign(window, { fpUnica, fpMulti, fpEscala, fpMatriz, fpTexto, fpTab, cerrarFormularioPrevio,
  fpPistasPasoHTML: pistasPasoHTML });
