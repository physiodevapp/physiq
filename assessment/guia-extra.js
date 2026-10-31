// Páginas de la guía de consulta (guia.html) que traen herramientas de la app, para usar el
// papel + QR sin la app. Todo en memoria: la guía no guarda nada del paciente.
//  · #cuestionarios[/<id>]: la calculadora de cuestionarios de la app (lib/cuestionarios.js, las
//    mismas reglas de puntuación y la misma interpretación publicada). El paciente rellena el
//    papel; aquí se toca el valor de cada ítem.
//  · #ejercicio: la guía «Efectos del ejercicio» de la app (lib/ejercicio.js).
//  · #preguntar: «✨ Preguntar a la IA» de la app, con sus tres modos (libre, fármacos, ejercicio).
import { CUESTIONARIOS, GRUPOS_CUESTIONARIO } from './data/cuestionarios.js';
import { listaCuestionariosHTML, formularioCuestionarioHTML, resultadoCuestionarioHTML, itemCuestionarioHTML, NA } from './lib/cuestionarios.js';
import { ejercicioHTML, nivelFichaHTML } from './lib/ejercicio.js';
import { DESTINOS_IA, destinoIA, promptPregunta, urlIA, MAX_TEXTO_IA, NOTA_CUENTAS, TIPOS_PREGUNTA, TIPO_PREGUNTA_DEFECTO } from './ampliar-ia.js';
import { alternarFicha } from './ficha.js';
import { observarFilas } from './filas.js';
import { ZONAS_SINTOMA, CIF_TREES } from './data.js';
import { etiquetaPaso, ORDEN_REGIONES } from './lib/esquemas.js';
import { nombreRegion } from './lib/region.js';
import { RELACIONES, TEXTO_OTRA_REGION } from './lib/sintomas.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const defCuest = id => CUESTIONARIOS.find(d => d.id === id);

// ── Calculadora de cuestionarios ─────────────────────────────────────────────
const CUEST = {};          // { [id]: { [itemN]: valor } }, solo en memoria
let ACTIVO = null;
const respuestas = id => CUEST[id] || {};
const estado = () => Object.fromEntries(Object.entries(CUEST).map(([id, r]) => [id, { r }]));

export function htmlCuestionarios(id) {
  ACTIVO = defCuest(id) ? id : null;
  const def = ACTIVO && defCuest(ACTIVO);
  return `<p class="guia-nota">La calculadora de la app: el paciente rellena el cuestionario en papel y aquí tocas el valor de cada ítem. Mismas reglas de puntuación e interpretación publicada que la app. No se guarda nada: se borra al recargar.</p>
    <div id="cuestCuerpo" class="guia-cuest">${def ? formularioCuestionarioHTML(def, respuestas(ACTIVO)) : listaCuestionariosHTML(CUESTIONARIOS, GRUPOS_CUESTIONARIO, estado())}</div>`;
}
// Después de pintar: las filas de opciones en móvil, como en la app
export function despuesCuestionarios() { const c = document.getElementById('cuestCuerpo'); if (c) observarFilas(c); }

function repintarItem(def, it) {
  const r = respuestas(def.id);
  const nodo = document.querySelector(`#cuestCuerpo .cuest-item[data-item="${it.n}"]`);
  if (nodo) { nodo.outerHTML = itemCuestionarioHTML(def, it, r[it.n]); observarFilas(document.querySelector(`#cuestCuerpo .cuest-item[data-item="${it.n}"]`)); }
  document.getElementById('cuestResultado').innerHTML = resultadoCuestionarioHTML(def, r);
  const borrar = document.querySelector('#cuestCuerpo [data-cuest-borrar]');
  if (borrar) borrar.disabled = !Object.keys(r).length;
}
// Un toque guarda; un segundo toque en la opción marcada la borra (en «marcas», alterna): como la app
function tocar(def, n, valorTxt) {
  const it = def.items.find(x => String(x.n) === n);
  if (!it) return;
  const tipo = it.tipo || 'escala';
  const valor = tipo === 'sino' || valorTxt === NA ? valorTxt : Number(valorTxt);
  const r = CUEST[def.id] ||= {};
  if (tipo === 'marcas') {
    const lista = Array.isArray(r[n]) ? [...r[n]] : [];
    const i = lista.indexOf(valor);
    if (i >= 0) lista.splice(i, 1); else lista.push(valor);
    lista.sort((a, b) => a - b);
    if (lista.length) r[n] = lista; else delete r[n];
  } else if (r[n] === valor) delete r[n];
  else r[n] = valor;
  if (!Object.keys(r).length) delete CUEST[def.id];
  repintarItem(def, it);
  document.querySelector(`#cuestCuerpo .cuest-item[data-item="${n}"] .cuest-op[data-valor="${valorTxt}"]`)?.focus({ preventScroll: true });
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  if (!t?.closest('#cuestCuerpo')) return;
  const tarjeta = t.closest('[data-cuest]');
  if (tarjeta) { location.hash = `cuestionarios/${tarjeta.dataset.cuest}`; return; }
  if (t.closest('[data-cuest-volver]')) { location.hash = 'cuestionarios'; return; }
  const def = ACTIVO && defCuest(ACTIVO);
  if (!def) return;
  if (t.closest('[data-cuest-borrar]')) { delete CUEST[def.id]; document.getElementById('cuestCuerpo').innerHTML = formularioCuestionarioHTML(def, {}); despuesCuestionarios(); return; }
  const op = t.closest('.cuest-op'), item = op?.closest('.cuest-item');
  if (op && item) tocar(def, item.dataset.item, op.dataset.valor);
});
// Ítems con valor tecleado (escala visual en mm): vacío o no numérico no cuenta
document.addEventListener('input', e => {
  const campo = e.target instanceof HTMLInputElement && e.target.classList.contains('cuest-num') && e.target.closest('#cuestCuerpo') ? e.target : null;
  const def = campo && ACTIVO && defCuest(ACTIVO);
  const n = campo?.closest('.cuest-item')?.dataset.item;
  if (!def || !n) return;
  const r = CUEST[def.id] ||= {};
  const v = campo.value === '' ? NaN : Number(campo.value);
  if (Number.isFinite(v)) r[n] = v; else delete r[n];
  if (!Object.keys(r).length) delete CUEST[def.id];
  document.getElementById('cuestResultado').innerHTML = resultadoCuestionarioHTML(def, respuestas(def.id));
});

// ── Efectos del ejercicio ────────────────────────────────────────────────────
export const htmlEjercicio = () => `<div id="ejercicioCuerpo">${ejercicioHTML()}</div>`;
// El chip de nivel de cada afirmación abre su explicación, como en la app
document.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('#ejercicioCuerpo button.ej-nivel') : null;
  if (b) alternarFicha(b, nivelFichaHTML(b.dataset.nivel), { id: 'ejNivelFicha', clase: 'ej-ficha-flotante' });
}, true);

// ── Preguntar a la IA (libre, fármacos, ejercicio) ───────────────────────────
// Lo mismo que la app (promptPregunta, mismos guiones y destinos), sin región ni datos del
// paciente: solo se envía lo que se escribe. Modo y destino, en memoria.
let DESTINO = destinoIA();
let TIPO = TIPO_PREGUNTA_DEFECTO;
export function htmlPreguntar(tipo = TIPO_PREGUNTA_DEFECTO, { titulo = '¿Una duda? Pregunta a la IA', id = 'guiaPregunta' } = {}) {
  TIPO = TIPOS_PREGUNTA[tipo] ? tipo : TIPO_PREGUNTA_DEFECTO;
  const d = DESTINOS_IA[DESTINO], tp = TIPOS_PREGUNTA[TIPO];
  return `<section class="guia-bloque guia-pregunta" id="${id}"><h3>${esc(titulo)}</h3>
    <p class="guia-nota">No escribas datos que identifiquen al paciente. Se envía solo lo que escribas; PhysiQ no revisa la respuesta.</p>
    <div class="option-group guia-tipos" role="group" aria-label="Tipo de pregunta">${Object.entries(TIPOS_PREGUNTA).map(([k, x]) =>
      `<button type="button" class="option-btn${k === TIPO ? ' selected' : ''}" data-tipo-pregunta="${k}" aria-pressed="${k === TIPO}">${esc(x.nombre)}</button>`).join('')}</div>
    <p class="guia-nota guia-guion">${esc(tp.guion || '')}</p>
    <label class="guia-vh" for="guiaPreguntaTexto">Pregunta</label>
    <textarea id="guiaPreguntaTexto" class="field-input" rows="3" maxlength="${MAX_TEXTO_IA}" placeholder="${esc(tp.placeholder)}"></textarea>
    <div class="option-group guia-destinos" role="group" aria-label="Dónde preguntar">${Object.entries(DESTINOS_IA).map(([k, x]) =>
      `<button type="button" class="option-btn${k === DESTINO ? ' selected' : ''}" data-destino-pregunta="${k}" aria-pressed="${k === DESTINO}">${esc(x.nombre)}</button>`).join('')}</div>
    <p class="guia-nota guia-destino-ventaja">${esc(d.ventaja)}</p>
    <a class="btn btn-primary guia-preguntar" id="guiaPreguntaIr" href="#" target="_blank" rel="noopener noreferrer" aria-disabled="true">Preguntar en ${esc(d.nombre)} ↗</a>
    <p class="guia-nota">${esc(NOTA_CUENTAS)}</p></section>`;
}
const textoPregunta = () => document.getElementById('guiaPreguntaTexto')?.value.trim() || '';
document.addEventListener('input', e => {
  if (e.target?.id !== 'guiaPreguntaTexto') return;
  document.getElementById('guiaPreguntaIr')?.setAttribute('aria-disabled', String(textoPregunta().length < 3));
});
const marcar = (sel, b) => document.querySelectorAll(sel).forEach(x => { const on = x === b; x.classList.toggle('selected', on); x.setAttribute('aria-pressed', on); });
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const tb = t?.closest('[data-tipo-pregunta]');
  if (tb) {
    TIPO = tb.dataset.tipoPregunta;
    marcar('[data-tipo-pregunta]', tb);
    const tp = TIPOS_PREGUNTA[TIPO];
    document.querySelector('.guia-guion').textContent = tp.guion || '';
    document.getElementById('guiaPreguntaTexto').placeholder = tp.placeholder;
    return;
  }
  const b = t?.closest('[data-destino-pregunta]');
  if (b) {
    DESTINO = b.dataset.destinoPregunta;
    marcar('[data-destino-pregunta]', b);
    const d = DESTINOS_IA[DESTINO];
    document.getElementById('guiaPreguntaIr').textContent = `Preguntar en ${d.nombre} ↗`;
    document.querySelector('.guia-destino-ventaja').textContent = d.ventaja;
    return;
  }
  const a = t?.closest('#guiaPreguntaIr');
  if (!a) return;
  const q = textoPregunta();
  if (q.length < 3) { e.preventDefault(); return; }
  a.href = urlIA(DESTINO, promptPregunta({ pregunta: q, tipo: TIPO }));   // en el propio clic, sin window.open
});

// ── Síntomas (fase 3): el QR de su hoja ──────────────────────────────────────
// Las zonas de cada región con enlace a los pasos del árbol donde la app recuerda el síntoma
// (`pasos` de data/<región>.js), sus recordatorios y las reglas de la tarjeta «Síntomas».
export function htmlSintomasGuia() {
  const regiones = ORDEN_REGIONES.filter(r => ZONAS_SINTOMA[r]?.length).map(r => {
    const steps = CIF_TREES[r].steps;
    const paso = id => { const i = steps.findIndex(st => st.id === id); return i < 0 ? '' : `<a href="#${r}/arbol/paso-${id}">${esc(etiquetaPaso(steps[i], i))}</a>`; };
    return `<section class="guia-bloque"><h3>${esc(nombreRegion(r))}</h3><ul class="guia-cc-lista">${ZONAS_SINTOMA[r].map(z => `<li><b>${esc(z.nombre)}</b>${z.central ? ' (central)' : ''}: ${(z.pasos || []).map(paso).filter(Boolean).join(', ') || 'ningún paso'}${z.redNeuro ? ' · añade la red de seguridad neurológica del plan (fase 6)' : ''}${z.recordatorio ? `<div class="guia-cc-test">⚠️ ${esc(z.recordatorio.texto)} <a href="#${r}/cribado/q-${z.recordatorio.pregunta}">Ir a la pregunta →</a></div>` : ''}</li>`).join('')}</ul></section>`;
  }).join('');
  return `<p class="guia-nota">La tarjeta «Síntomas» de la app (fase 3): el síntoma principal (P1) y hasta tres más (P2–P4). Cada uno lleva zona, lado, profundidad, constante o intermitente, NRS e irritabilidad (la de P1, de la matriz de irritabilidad), y P2–P4 su relación con P1: ${Object.values(RELACIONES).map(x => esc(x.boton.toLowerCase())).join(', ')}. Un síntoma de «${esc(TEXTO_OTRA_REGION)}» solo lleva lado, NRS y nota.</p>
    <p class="guia-nota">Abajo, las zonas de cada región y los pasos del árbol donde la app recuerda lo que refiere el paciente (nunca contesta el paso). En la app, el plan de la fase 6 se dosifica por el síntoma más irritable (P1 si empatan).</p>${regiones}`;
}
