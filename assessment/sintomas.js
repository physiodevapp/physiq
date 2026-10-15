// ============================================================
// PhysiQ-Assessment · sintomas.js
// Tarjeta «Síntomas» de la fase 3 (P1–P4): zonas del mapa corporal de cada
// síntoma. P1 es el principal y su NRS e irritabilidad son las tarjetas de
// siempre; P2–P4 llevan una ficha corta. Solo en las regiones con zonas
// (`ZONAS_SINTOMA`, piloto: lumbar). Lo puro está en lib/sintomas.js; diseño
// en docs/sintomas-multiples.md.
// ============================================================
import { state } from './state.js';
import { ZONAS_SINTOMA } from './data.js';
import { saveSession, showConfirmBanner, injectQuickInputBar, repintarP1Fase3 } from './app.js';
import { matrizVacia } from './lib/irritabilidad.js';
import {
  MAX_SECUNDARIOS, sintomaVacio, normalizarSintomas, tieneDatos, PATRONES, PROFUNDIDADES,
  NIVELES_IRRITABILIDAD, RELACIONES, CHIPS_DESCRIPCION,
} from './lib/sintomas.js';

const COLUMNA = ['cervical', 'lumbar'];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// i = 0 → P1; 1..3 → P2..P4
function sintoma(i) { return i === 0 ? state.sintomaPrincipal : state.sintomasSecundarios[i - 1]; }

function grupoHTML(i, campo, opciones, valor, clase = '') {
  return `<div class="option-group sint-grupo ${clase}">${opciones.map(([v, t, c]) =>
    `<button type="button" class="option-btn${c ? ` ${c}` : ''}${valor === v ? ' selected' : ''}" aria-pressed="${valor === v}" onclick="sintCampo(${i}, '${campo}', '${v}')">${esc(t)}</button>`).join('')}</div>`;
}

function campoHTML(etiqueta, cuerpo) {
  return `<div class="sint-campo"><div class="field-label">${etiqueta}</div>${cuerpo}</div>`;
}

function itemHTML(i, zonas) {
  const s = sintoma(i), p1 = i === 0;
  const lados = [['Derecho', 'Derecho'], ['Izquierdo', 'Izquierdo'], ['Bilateral', 'Bilateral'], ...(COLUMNA.includes(state.region) ? [['Central', 'Central', 'lado-central']] : [])];
  const chips = zonas.map(z => {
    const on = !s.otraRegion && s.zonas.includes(z.id);
    return `<button type="button" class="option-btn sint-zona${on ? ' selected' : ''}" aria-pressed="${on}" onclick="sintZona(${i}, '${z.id}')">${esc(z.nombre)}</button>`;
  }).join('') + (p1 ? '' : `<button type="button" class="option-btn sint-zona sint-otra${s.otraRegion ? ' selected' : ''}" aria-pressed="${s.otraRegion}" onclick="sintOtraRegion(${i})">Otra región (no valorada hoy)</button>`);
  const libre = `<input class="field-input sint-libre" id="sintZonaLibre_${i}" maxlength="80" value="${esc(s.zonaLibre)}"
    placeholder="${s.otraRegion ? '¿Qué región? (p. ej., rodilla)' : 'Otra zona (texto libre)'}"
    oninput="sintTexto(${i}, 'zonaLibre', this.value)" onchange="saveSession()">`;

  const cab = p1
    ? `<div class="sint-cab"><span class="sint-num">P1</span><span class="sint-tipo">Principal</span></div>`
    : `<div class="sint-cab"><span class="sint-num">P${i + 1}</span><span class="sint-tipo">Secundario</span>
        ${s.otraRegion ? '' : `<button type="button" class="sint-accion" onclick="sintHacerPrincipal(${i})">Hacer principal</button>`}
        <button type="button" class="sint-accion sint-quitar" onclick="sintQuitar(${i})" aria-label="Quitar P${i + 1}" title="Quitar P${i + 1}">✕</button></div>`;

  const ladoHint = p1 && !s.lado && state.lado ? `<div class="sint-hint">Sin marcar: el de la región (${esc(state.lado.toLowerCase())}).</div>` : '';
  const partes = [
    cab,
    campoHTML('Zona', `<div class="option-group sint-zonas">${chips}</div>${libre}`),
    campoHTML('Lado', grupoHTML(i, 'lado', lados, s.lado, 'lado-group') + ladoHint),
  ];
  if (p1) {
    partes.push(campoHTML('Profundidad', grupoHTML(i, 'profundidad', PROFUNDIDADES.map(v => [v, v]), s.profundidad)));
    partes.push(campoHTML('Comportamiento', grupoHTML(i, 'patron', PATRONES.map(v => [v, v]), s.patron)));
    partes.push(`<div class="sint-campo"><label class="field-label" for="sintDesc_0">Descripción</label>
      <input class="field-input" id="sintDesc_0" maxlength="200" value="${esc(s.descripcion)}" placeholder="Cómo lo describe el paciente"
        oninput="sintTexto(0, 'descripcion', this.value)" onchange="saveSession()"></div>`);
    partes.push(`<div class="sint-hint">La intensidad y la irritabilidad de P1 son las de las tarjetas de abajo.</div>`);
  } else {
    const nrs = Array.from({ length: 11 }, (_, v) =>
      `<button type="button" class="sint-nrs-btn${s.nrs === v ? ' selected' : ''}" aria-pressed="${s.nrs === v}" onclick="sintNRS(${i}, ${v})">${v}</button>`).join('');
    partes.push(campoHTML('Intensidad (NRS 0–10)', `<div class="sint-nrs">${nrs}</div>`));
    // Otra región: se registra, no se valora (decisión 5) — solo dónde, lado, NRS y nota
    if (!s.otraRegion) {
      partes.push(campoHTML('Irritabilidad', grupoHTML(i, 'irritabilidad', NIVELES_IRRITABILIDAD.map(v => [v, v]), s.irritabilidad, 'sint-tercios')));
      partes.push(campoHTML('Comportamiento', grupoHTML(i, 'patron', PATRONES.map(v => [v, v]), s.patron)));
      partes.push(campoHTML('Relación con P1', grupoHTML(i, 'relacion', Object.entries(RELACIONES).map(([k, r]) => [k, r.boton]), s.relacion, 'sint-relacion')));
    }
    partes.push(`<div class="sint-campo"><label class="field-label" for="sintDesc_${i}">Nota</label>
      <input class="field-input" id="sintDesc_${i}" maxlength="200" value="${esc(s.descripcion)}" placeholder="Opcional"
        oninput="sintTexto(${i}, 'descripcion', this.value)" onchange="saveSession()"></div>`);
  }
  return `<div class="sint-item${p1 ? ' sint-p1' : ''}" id="sintItem_${i}">${partes.join('')}</div>`;
}

// Pinta la tarjeta entera (al entrar en la fase 3, al restaurar, al reiniciar
// y tras cada cambio de estructura). Sin zonas en la región, se oculta.
export function pintarSintomas() {
  const card = document.getElementById('cardSintomas');
  if (!card) return;
  const zonas = ZONAS_SINTOMA[state.region];
  card.hidden = !zonas;
  if (!zonas) { card.innerHTML = ''; return; }
  normalizarSintomas(state);
  const n = state.sintomasSecundarios.length;
  card.innerHTML = `<div class="card-title">Síntomas <span class="sint-contador">P1${n ? `–P${n + 1}` : ''}</span></div>
    <div class="plan-note-hint">Las zonas que marca el paciente en el mapa corporal. P1 es el principal; añada hasta ${MAX_SECUNDARIOS} secundarios.</div>
    ${[0, ...state.sintomasSecundarios.map((_, k) => k + 1)].map(i => itemHTML(i, zonas)).join('')}
    ${n < MAX_SECUNDARIOS ? `<button type="button" class="btn btn-secondary sint-anadir" onclick="sintAnadir()">+ Añadir síntoma (P${n + 2})</button>` : ''}`;
  injectQuickInputBar('sintDesc_0', CHIPS_DESCRIPCION);
  for (let i = 1; i <= n; i++) injectQuickInputBar(`sintDesc_${i}`, []);
}

function cambiar(fn) { fn(); pintarSintomas(); saveSession(); }

// Multiselección de zonas; con «Otra región» marcada, elegir una zona la desmarca
function sintZona(i, id) {
  cambiar(() => {
    const s = sintoma(i);
    s.otraRegion = false;
    s.zonas = s.zonas.includes(id) ? s.zonas.filter(z => z !== id) : [...s.zonas, id];
  });
}

function sintOtraRegion(i) {
  cambiar(() => {
    const s = sintoma(i);
    s.otraRegion = !s.otraRegion;
    if (s.otraRegion) Object.assign(s, { zonas: [], irritabilidad: '', patron: '', relacion: '' });
  });
}

// Grupos de una opción: un segundo toque la quita (regla de la app)
function sintCampo(i, campo, valor) {
  cambiar(() => { const s = sintoma(i); s[campo] = s[campo] === valor ? '' : valor; });
}

function sintNRS(i, v) {
  cambiar(() => { const s = sintoma(i); s.nrs = s.nrs === v ? null : v; });
}

// Texto: sin repintar (perdería el foco); se guarda en `change`
function sintTexto(i, campo, valor) { sintoma(i)[campo] = valor; }

function sintAnadir() {
  if (state.sintomasSecundarios.length >= MAX_SECUNDARIOS) return;
  cambiar(() => state.sintomasSecundarios.push(sintomaVacio()));
  document.getElementById(`sintItem_${state.sintomasSecundarios.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function sintQuitar(i) {
  const quitar = () => cambiar(() => state.sintomasSecundarios.splice(i - 1, 1));
  if (!tieneDatos(sintoma(i))) { quitar(); return; }
  showConfirmBanner(`Quitar P${i + 1}`, `Se borrarán los datos de este síntoma. Los siguientes cambian de número.`, 'Quitar', quitar);
}

// Intercambia el secundario con P1: zonas y textos van con su objeto; el NRS
// y la irritabilidad de P1 viven en las tarjetas de la fase 3, así que se
// intercambian aparte (el nuevo P1 queda con irritabilidad estimada). La
// relación de los demás era con el P1 anterior: se borra.
function sintHacerPrincipal(i) {
  showConfirmBanner(`P${i + 1} pasa a ser el principal`,
    'Su intensidad e irritabilidad pasan a las tarjetas de P1, y el P1 actual queda como secundario. La relación de cada secundario con P1 se borra, porque era con el principal anterior, y la matriz de irritabilidad se vacía por lo mismo.',
    'Cambiar', () => cambiar(() => {
      const sec = sintoma(i), p1 = state.sintomaPrincipal;
      const nrsP1 = state.severidad ?? null, irrP1 = state.irritabilidadNivel || '';
      state.sintomaPrincipal = { ...sec, nrs: null, irritabilidad: '', relacion: '', otraRegion: false };
      state.sintomasSecundarios[i - 1] = { ...p1, nrs: nrsP1, irritabilidad: irrP1, relacion: '' };
      state.sintomasSecundarios.forEach(s => { s.relacion = ''; });
      state.severidad = sec.nrs ?? null;
      state.irritabilidadNivel = sec.irritabilidad || null;
      state.irritabilidadDirecta = true;
      // La matriz era del P1 anterior: se vacía (decisión 104). El impacto en
      // las actividades es del paciente, no de un síntoma: se queda.
      state.irritabilidad = matrizVacia(state.irritabilidad?.discapacidad || '');
      repintarP1Fase3();
    }), { borra: false });
}

// Exposed for inline onclick/oninput attributes in the HTML built above
Object.assign(window, { sintZona, sintOtraRegion, sintCampo, sintNRS, sintTexto, sintAnadir, sintQuitar, sintHacerPrincipal });
