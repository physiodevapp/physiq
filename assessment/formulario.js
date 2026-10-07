// ============================================================
// PhysiQ-Assessment · FORMULARIO.JS
// Formulario previo a la primera visita (lo rellena el fisioterapeuta).
// Se pinta en línea: la cara común en un desplegable de la fase 1 y la de la
// región en otro de la fase 2 (#fpDet_comun / #fpDet_region en index.html).
// Motor genérico: el contenido vive en formularios/comun.js (cara 1) y
// formularios/<region>.js (cara 2), un archivo por región. app.js carga este
// módulo con import() dinámico, así que un fallo aquí nunca rompe el resto
// de la app.
// ============================================================
import { state } from './state.js';
import { saveSession, injectQuickInputBar } from './app.js';
import COMUN from './formularios/comun.js';

// Regiones con archivo formularios/<region>.js. Al añadir uno, añadirlo aquí
// (tests/unit.js comprueba que cada entrada carga): así no se pide por red
// un archivo que no existe (404 en consola) para las demás regiones.
export const REGIONES_CON_FORMULARIO = ['lumbar', 'cadera', 'cervical', 'rodilla', 'hombro', 'tobillo_pie'];
const NS_TEXTO = 'No sabría decir';
const _regiones = {};          // region → esquema | null (sin formulario)

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
  _guardarYRepintar(scope);
}

function fpMulti(scope, id, idx) {
  const it = _item(scope, id); if (!it) return;
  const r = respuestas(scope);
  const val = it.opciones[idx];
  const set = new Set(r[id] || []);
  set.has(val) ? set.delete(val) : set.add(val);
  if (set.size) r[id] = it.opciones.filter(o => set.has(o)); else delete r[id];
  _guardarYRepintar(scope);
}

function fpEscala(scope, id, val) {
  const r = respuestas(scope);
  if (r[id] === val) delete r[id]; else r[id] = val;
  _guardarYRepintar(scope);
}

function fpMatriz(scope, id, filaIdx, optIdx) {
  const it = _item(scope, id); if (!it) return;
  const r = respuestas(scope);
  const fila = it.filas[filaIdx].id, val = it.opciones[optIdx];
  const m = { ...(r[id] || {}) };
  if (m[fila] === val) delete m[fila]; else m[fila] = val;
  if (Object.keys(m).length) r[id] = m; else delete r[id];
  _guardarYRepintar(scope);
}

// Texto: no repinta (perdería el foco y el dictado en curso), solo guarda.
function fpTexto(scope, key, value) {
  const r = respuestas(scope);
  if (value.trim()) r[key] = value; else delete r[key];
  _actualizarContador();
  saveSession();
}

function _guardarYRepintar(scope) {
  saveSession();
  _pintarScope(scope);
  _actualizarContador();
}

// ─── Render ──────────────────────────────────────────────────
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function btn(sel, label, onclick) {
  return `<button type="button" class="option-btn fp-opt${sel ? ' selected' : ''}" onclick="${onclick}">${esc(label)}</button>`;
}

// Escalas con `estiloSeveridad: true` (dolor/severidad) se pintan como la
// escala coloreada de fase 3 (verde→rojo), en dos filas — no como la fila
// plana de `.fp-escala`. La banda de color se calcula a partir de min/max
// del ítem (no de una tabla fija de 11 valores como NRS_CLASSES en fase 3),
// para que funcione con cualquier rango que declare el schema.
function renderEscalaSeveridad(scope, it, v) {
  const count = it.max - it.min + 1;
  const bandSize = count / 5;
  const nums = [];
  for (let n = it.min; n <= it.max; n++) {
    const band = Math.min(4, Math.floor((n - it.min) / bandSize));
    const sel = v === n ? ' selected' : '';
    nums.push(`<button type="button" class="fp-escala-btn sev-b${band}${sel}" onclick="fpEscala('${scope}','${it.id}',${n})">${n}</button>`);
  }
  const primeraFila = Math.floor(count / 2);
  const filas = [nums.slice(0, primeraFila), nums.slice(primeraFila)];
  // Extremos ENCIMA de la escala y con el número (`0 = Nada`): debajo de una
  // escala en dos filas parecían pistas del 5 y del 10.
  return `<div class="fp-escala-ext fp-escala-ext-top"><span>${it.min} = ${esc(it.extremos[0])}</span><span>${it.max} = ${esc(it.extremos[1])}</span></div>
    <div class="fp-escala-grid">${filas.map(f => `<div class="fp-escala-row">${f.join('')}</div>`).join('')}</div>
    <div class="fp-opts">${btn(v === 'ns', 'No sabría decir', `fpEscala('${scope}','${it.id}','ns')`)}</div>`;
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
  } else if (it.tipo === 'escala' && it.estiloSeveridad) {
    cuerpo = renderEscalaSeveridad(scope, it, v);
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

const _slot = scope => (scope === 'comun' ? 'comun' : 'region');

// Pinta el formulario de un ámbito ('comun' o el id de la región) en su
// desplegable. Conserva el scroll de la página: el repintado cambia la altura.
function _pintarScope(scope) {
  const body = document.getElementById(`fpBody_${_slot(scope)}`);
  if (!body) return;
  const esquema = esquemaDe(scope);
  if (!esquema) {
    body.innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><span>${
      !scope ? 'Elija la región para ver las preguntas de la región.'
             : `No hay formulario previo para esta región (${esc(_nombreRegion(scope).toLowerCase())}) todavía.`}</span></div>`;
    return;
  }
  const y = window.scrollY;
  const resp = respuestas(scope);
  body.innerHTML = `
    <div class="fp-titulo">${esc(esquema.titulo)}</div>
    ${esquema.intro ? `<div class="fp-hint">${esc(esquema.intro)}</div>` : ''}
    <div class="fp-literal-nota">✍️ Anote las respuestas de texto con las palabras del paciente: se muestran luego como cita.</div>
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
  window.scrollTo({ top: y, behavior: 'instant' });
}

// Repinta los desplegables que estén abiertos (cambio de región, reset,
// restauración de sesión). Los cerrados se pintan al abrirlos (fpToggle).
function _refrescarInline() {
  if (document.getElementById('fpDet_comun')?.open) _pintarScope('comun');
  if (document.getElementById('fpDet_region')?.open) _pintarScope(state.region);
}

async function fpToggle(slot, el) {
  if (!el.open) return;
  if (slot === 'region') await cargarEsquemaRegion(state.region);
  _pintarScope(slot === 'comun' ? 'comun' : state.region);
}

function _nombreRegion(r) { return r ? (n => n.charAt(0).toUpperCase() + n.slice(1))(r.replace(/_/g, ' y ')) : 'Región'; }

// Abre el desplegable de un ámbito ('comun' | 'region') y lleva hasta él.
export async function abrirFormularioPrevio(slot) {
  const det = document.getElementById(`fpDet_${slot === 'region' ? 'region' : 'comun'}`);
  if (!det) return;
  det.open = true;
  await fpToggle(slot === 'region' ? 'region' : 'comun', det);
  det.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Lo que va al informe con IA: [{ g, q, a }], con `g` = el grupo `ia` del
// esquema (cada grupo va a su sección del informe) y sin las respuestas
// «No sé» / «No sabría decir» — ni las filas de una matriz con «No sé»: el
// modelo las convertía en negaciones aunque el prompt lo prohibía.
export const GRUPOS_IA = ['historia', 'sintomas', 'actividades', 'contexto'];
const esNS = x => x === 'ns' || x === NS_TEXTO || x === 'No sé';

function resumenIADe(scope) {
  const esquema = esquemaDe(scope);
  if (!esquema) return [];
  const resp = scope === 'comun' ? fp().comun : (fp().regiones[scope] || {});
  const out = [];
  esquema.secciones.forEach(s => s.items.forEach(it => {
    if (!visible(it, resp)) return;
    let v = resp[it.id];
    if (it.tipo === 'matriz' && v && typeof v === 'object') v = Object.fromEntries(Object.entries(v).filter(([, x]) => !esNS(x)));
    else if (Array.isArray(v)) v = v.filter(x => !esNS(x));
    else if (esNS(v)) return;
    if (vacio(v)) return;
    out.push({ g: it.ia, q: preguntaCorta(it, s), a: textoRespuesta(it, v, resp) });
  }));
  return out;
}

export function resumenFormularioIA() {
  return [...resumenIADe('comun'), ...(state.region ? resumenIADe(state.region) : [])];
}

// Lo que va al 📄 Informe (paciente/médico): solo los items con `informe` en
// el esquema, con esa etiqueta en vez de la pregunta. «No sabría decir» no
// aporta nada al médico y se omite. Items seguidos con la misma etiqueta
// (actividad_1..3) se unen en una línea.
// → { historia: [{ q, a }], antecedentes: [{ q, a }] }
export function informeFormularioPrevio() {
  const out = { historia: [], antecedentes: [] };
  ['comun', state.region].forEach(scope => {
    const esquema = scope && esquemaDe(scope);
    if (!esquema) return;
    const resp = scope === 'comun' ? fp().comun : (fp().regiones[scope] || {});
    esquema.secciones.forEach(s => s.items.forEach(it => {
      if (!it.informe || !visible(it, resp)) return;
      let v = resp[it.id];
      if (Array.isArray(v)) v = v.filter(x => x !== NS_TEXTO);
      if (vacio(v) || v === 'ns' || v === NS_TEXTO) return;
      const lista = it.antecedente ? out.antecedentes : out.historia;
      const a = textoRespuesta(it, v, resp);
      const ultimo = lista[lista.length - 1];
      if (ultimo?.q === it.informe) ultimo.a += `; ${a}`;
      else lista.push({ q: it.informe, a });
    }));
  });
  return out;
}

export function contarRespuestas() {
  return resumenFormularioPrevio().length;
}

// Pistas para un paso del árbol CIF: respuestas del formulario ligadas a ese
// paso en `esquema.pistas`. Solo recuerdan; nunca responden el paso.
export function pistasPaso(stepId) {
  const esquema = state.region && _regiones[state.region];
  return _pistas(esquema?.pistas?.[stepId]);
}

// Lo mismo para las tarjetas de la fase 1 (mecanismo, cronologia): la cara
// común tiene su propio `pistas`, por campo de la fase 1 en vez de por paso.
export function pistasFase1(campo) {
  return _pistas(COMUN.pistas?.[campo]);
}

function _pistas(refs) {
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
      // `cita`: la parte escrita por el fisio con las palabras del paciente
      // (un ítem texto, o el detalle de una opción); va entre comillas.
      const det = it.detalle && resp[`${id}__detalle`];
      const cita = it.tipo === 'texto' ? v
        : det && (Array.isArray(v) ? v.includes(it.detalle.opcion) : v === it.detalle.opcion) ? det : '';
      out.push({ q: it.texto, a: textoRespuesta(it, v, resp), ...(cita && { cita }) });
    }
  });
  return out;
}

function _pistasHTML(p) {
  if (!p.length) return '';
  // «Refiere el paciente», como el «SEGÚN REFIERE EL PACIENTE» del 📄 Informe:
  // la voz del paciente, distinta de la clasificación del fisio de debajo.
  // textoRespuesta() pone el detalle al final, así que `cita` es el sufijo de `a`.
  const resp = x => {
    if (!x.cita) return esc(x.a);
    const pre = x.a.slice(0, x.a.length - x.cita.length);
    return `${esc(pre)}<span class="fp-pista-cita">«${esc(x.cita)}»</span>`;
  };
  return `<div class="fp-pistas"><div class="fp-pistas-title">📝 Refiere el paciente</div>${
    p.map(x => `<div class="fp-pista"><span class="fp-pista-q">${esc(x.q)}</span> <span class="fp-pista-a">${resp(x)}</span></div>`).join('')}</div>`;
}

export function pistasPasoHTML(stepId) {
  return _pistasHTML(pistasPaso(stepId));
}

// Pinta las pistas en #fpPistas_<campo> de la fase 1. Va con el contador:
// ambos se refrescan en cada respuesta, al cerrar, al restaurar y al resetear.
function _actualizarPistasFase1() {
  Object.keys(COMUN.pistas || {}).forEach(campo => {
    const el = document.getElementById(`fpPistas_${campo}`);
    if (el) el.innerHTML = _pistasHTML(pistasFase1(campo));
  });
}

function _actualizarContador() {
  _actualizarPistasFase1();
  const pinta = (id, n) => {
    const el = document.getElementById(id);
    if (el) el.textContent = n ? `${n} respuesta${n === 1 ? '' : 's'}` : 'Sin rellenar';
  };
  pinta('fpCont_comun', resumenDe('comun').length);
  pinta('fpCont_region', state.region ? resumenDe(state.region).length : 0);
  const nom = document.getElementById('fpNombreRegion');
  if (nom) nom.textContent = _nombreRegion(state.region);
}

export async function precargarFormulario() {
  await cargarEsquemaRegion(state.region);
  _actualizarContador();
  _refrescarInline();
}

// Exposed for inline onclick/oninput attributes built above — those resolve
// only against the global scope, never a module's private scope.
Object.assign(window, { fpUnica, fpMulti, fpEscala, fpMatriz, fpTexto, fpToggle,
  fpPistasPasoHTML: pistasPasoHTML });
