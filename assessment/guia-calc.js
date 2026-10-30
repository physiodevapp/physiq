// Calculadoras de la guía de consulta (guia.html) para lo que la hoja impresa no puede
// calcular: la fase 1 (banderas rojas y riesgo psicosocial, página #fase1) y, en el cribado,
// la escala de Beighton con el cuestionario, la regla de sospecha del subtipo vascular, la
// prueba de bipedestación y la regla de la tensión en el embarazo. Las reglas son las de la
// app (lib/hipermovilidad.js, lib/disautonomia.js, lib/embarazo.js), no una copia. Todo en
// memoria: nada se guarda y se borra al recargar o con «Borrar».
import { SIS_HIPERMOVILIDAD } from './data/comun.js';
import { BANDERAS_FASE1, TEXTOS_FASE1, NIVELES_PSICO, PREGUNTAS_PSICO, RESPUESTAS_PSICO } from './data/fase1.js';
import { HM, resultadoHAG, reglaVascular, siCuestionario, respondidasCuestionario } from './lib/hipermovilidad.js';
import { DS, FILAS_PRUEBA, resultadoPrueba } from './lib/disautonomia.js';
import { EM, reglaTA } from './lib/embarazo.js';
import { citasEnTexto } from './lib/citas.js';

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = v => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v));
const caja = (tono, icono, html) => `<div class="guia-calc-res ${tono}"><span aria-hidden="true">${icono}</span><div>${html}</div></div>`;
const nota = html => `<p class="guia-nota">${html}</p>`;

// Lo marcado en las calculadoras (solo en memoria)
const C = { edad: null, banderas: {}, psico: '', psicoQ: {}, beighton: {}, cuestionario: {}, vascular: {}, prueba: {}, ta: {} };
const vaciar = () => Object.assign(C, { edad: null, banderas: {}, psico: '', psicoQ: {}, beighton: {}, cuestionario: {}, vascular: {}, prueba: {}, ta: {} });

// Botón que se marca y desmarca (un segundo toque quita la respuesta, como en la app)
const opcion = (grupo, clave, valor, texto, marcado) =>
  `<button type="button" class="option-btn${marcado ? ' selected' : ''}" data-gc="${grupo}" data-gc-k="${esc(clave)}" data-gc-v="${esc(valor)}" aria-pressed="${!!marcado}">${texto}</button>`;
const siNo = (grupo, clave, actual) => `<div class="option-group guia-gc-sino">${opcion(grupo, clave, 'SI', 'Sí', actual === 'SI')}${opcion(grupo, clave, 'NO', 'No', actual === 'NO')}</div>`;
const entrada = (grupo, clave, etiqueta, valor, { min = 0, max = 300 } = {}) =>
  `<label class="guia-gc-num"><span>${etiqueta}</span><input type="number" inputmode="numeric" min="${min}" max="${max}" data-gc-num="${grupo}" data-gc-k="${esc(clave)}" value="${valor ?? ''}"></label>`;
const edadHTML = () => `<div class="guia-gc-fila">${entrada('edad', 'edad', 'Edad del paciente (años)', C.edad, { max: 120 })}</div>`;
const borrar = `<div class="guia-irr-pie"><button type="button" class="guia-borrar" data-gc-borrar>Borrar lo marcado</button></div>`;

// ── Fase 1 (#fase1): banderas rojas y riesgo psicosocial ─────────────────────
function resFase1() {
  const T = TEXTOS_FASE1;
  const rojas = BANDERAS_FASE1.filter(b => C.banderas[b.id] === 'SI');
  const partes = [rojas.length ? caja('alto', '🚨', `<b>${esc(T.banderaAlerta.split('.')[0])}.</b> ${esc(T.banderaAlerta.split('.').slice(1).join('.').trim())}`) : ''];
  if (C.psico) {
    partes.push(caja('info', '🧠', T.herramienta));
    const tools = PREGUNTAS_PSICO.filter(p => C.psico === 'Alto' && (C.psicoQ[p.id] === 'Sí' || C.psicoQ[p.id] === 'Dudoso')).map(p => p.cuestionarios);
    if (tools.length) partes.push(caja('info', '📋', `<b>${esc(T.sugeridos)}</b>${tools.map(t => `<div>${esc(t)}</div>`).join('')}`));
  }
  return partes.join('');
}
export function htmlFase1() {
  const T = TEXTOS_FASE1;
  return `<p class="guia-nota">Lo mismo que la fase 1 de la app: las banderas rojas generales y el riesgo psicosocial. Marca lo que encuentres; un segundo toque desmarca. No se guarda nada: se borra al recargar.</p>
    <section class="guia-bloque"><h3>🚩 Banderas rojas</h3>
      ${nota(esc(T.banderasAviso))}
      ${BANDERAS_FASE1.map((b, i) => `<div class="guia-gc-item"><div class="guia-texto"><span class="guia-num">${i + 1}</span>${esc(b.texto)}</div>${siNo('bandera', b.id, C.banderas[b.id])}</div>`).join('')}
      ${nota('Las banderas rojas y amarillas de cada sistema están en el cribado de la región (fase 2).')}</section>
    <section class="guia-bloque"><h3>🧠 Riesgo psicosocial</h3>
      ${nota(esc(T.psicoIntro))}
      <div class="option-group guia-gc-psico">${NIVELES_PSICO.map(n => opcion('psico', 'nivel', n.valor, `${n.emoji} ${n.valor}`, C.psico === n.valor)).join('')}</div>
      ${C.psico === 'Alto' ? `${nota(esc(T.psicoAlto))}${PREGUNTAS_PSICO.map(p => `<div class="guia-gc-item"><div class="guia-texto">${esc(p.texto)}</div>
        <div class="option-group guia-gc-sino">${RESPUESTAS_PSICO.map(r => opcion('psicoQ', p.id, r, r, C.psicoQ[p.id] === r)).join('')}</div></div>`).join('')}` : ''}
    </section>
    <div id="guiaGcFase1" class="guia-gc-res">${resFase1()}</div>${borrar}`;
}

// ── Hipermovilidad: Beighton + cuestionario, y la regla del subtipo vascular ──
const hmCalc = () => ({ estado: 'sospecha', subtipo: '', beighton: Object.keys(C.beighton).length ? C.beighton : null, cuestionario: C.cuestionario });
function resBeighton() {
  const hm = hmCalc(), r = resultadoHAG(hm, C.edad);
  const n = respondidasCuestionario(hm), si = siCuestionario(hm);
  const cq = n ? `<p class="guia-nota">Cuestionario: ${si} de ${n} con «sí»${si >= 2 ? ' (positivo)' : ''}.</p>` : '';
  if (r.estado === 'sin-beighton') return cq + nota('Marca las maniobras positivas para calcular la escala.');
  const linea = `<p class="guia-gc-total">Beighton ${r.puntos}/9${r.corte != null ? ` · corte ${r.corte} (${esc(r.grupo)})` : ''}</p>`;
  if (r.estado === 'sin-edad') return linea + cq + nota('Escribe la edad: el corte cambia con ella (6 hasta los 17 años, 5 hasta los 50, 4 después).');
  return linea + cq + (r.estado === 'hag'
    ? caja('medio', '⚠️', `${citasEnTexto(HM.textos.derivarHAG)}${r.porCuestionario ? '<br><em>Un punto por debajo del corte, con el cuestionario positivo.</em>' : ''}`)
    : caja('bajo', '✓', esc(HM.textos.sinHAG)));
}
function resVascular() {
  const r = reglaVascular({ estado: 'sospecha' }, C.vascular);
  if (!r?.total) return nota('Marca las preguntas de sospecha del subtipo vascular contestadas con «sí».');
  return r.derivar ? caja('medio', '⚠️', citasEnTexto(HM.textos.derivarVascular)) : nota(citasEnTexto(HM.textos.hallazgoVascular));
}
export function calcHipermovilidadHTML() {
  const fila = (k, txt) => opcion('beighton', k, '1', txt, C.beighton[k]);
  const sospecha = SIS_HIPERMOVILIDAD.preguntas.filter(q => q.hm === 'sospecha');
  return `<details class="guia-calc-cond" id="calc-hipermovilidad"><summary>🧮 Calculadora: escala de Beighton y sospecha del subtipo vascular</summary><div class="guia-calc-cuerpo">
    ${edadHTML()}
    <h4>Cuestionario de 5 preguntas (con «Sospecha»)</h4>
    ${HM.cuestionario.map((q, i) => `<div class="guia-gc-item"><div class="guia-texto"><span class="guia-num">${i + 1}</span>${q.texto}</div>${siNo('cuestionario', q.id, C.cuestionario[q.id])}</div>`).join('')}
    <h4>Escala de Beighton</h4>
    ${HM.beighton.map(m => `<div class="guia-gc-item"><div class="guia-texto">${m.texto}</div><div class="option-group guia-gc-sino">${m.lados ? fila(`${m.id}_d`, 'Derecho') + fila(`${m.id}_i`, 'Izquierdo') : fila(m.id, 'Positivo')}</div></div>`).join('')}
    <div id="guiaGcBeighton" class="guia-gc-res">${resBeighton()}</div>
    <p class="guia-nota">${citasEnTexto(HM.beightonFuente)} ${citasEnTexto(HM.cortesFuente)}</p>
    <h4>Sospecha del subtipo vascular</h4>
    ${sospecha.map(q => `<div class="guia-gc-item"><div class="guia-texto">${esc(q.text)} <span class="guia-chip cuando">${q.hmPeso === 'mayor' ? 'mayor' : 'menor'}</span></div>${siNo('vascular', q.id, C.vascular[q.id])}</div>`).join('')}
    <div id="guiaGcVascular" class="guia-gc-res">${resVascular()}</div>
    ${nota('Regla: un «sí» mayor, o dos o más «sí», derivan.')}${borrar}</div></details>`;
}

// ── Disautonomía: prueba de bipedestación activa ─────────────────────────────
function resPrueba() {
  const hechas = Object.values(C.prueba).some(f => Object.keys(f || {}).length);
  if (!hechas) return nota('Escribe la FC (y la tensión) tumbado y en cada minuto de pie.');
  const r = resultadoPrueba({ prep: {}, ...Object.fromEntries(FILAS_PRUEBA.map(f => [f, C.prueba[f] || {}])) }, C.edad);
  const t = DS.textos, partes = [];
  const ref = r.referencia != null ? `<p class="guia-gc-total">Referencia ${r.referencia} lpm${r.corte != null ? ` · corte +${r.corte} (${esc(r.grupo)})` : ''}${(r.filas || []).some(f => f.aumento != null) ? `<br>${r.filas.filter(f => f.aumento != null).map(f => `${f.min}′ ${f.aumento >= 0 ? '+' : ''}${f.aumento}`).join(' · ')}` : ''}</p>` : '';
  if (r.estado === 'menor12') partes.push(nota(citasEnTexto(t.menor12)));
  else if (r.estado === 'sin-edad') partes.push(nota('Escribe la edad para aplicar el corte (30 lpm en adultos, 40 de 12 a 19 años).'));
  else if (r.estado === 'ho') partes.push(caja('medio', '⚠️', citasEnTexto(t.ho)));
  else if (r.estado === 'compatible') partes.push(caja('medio', '⚠️', `Aumento de la FC de ${r.dfc} lpm mantenido, sin hipotensión ortostática. ${citasEnTexto(t.compatible)}`) + (r.sintomas ? '' : nota(citasEnTexto(t.sinSintomas))));
  else if (r.estado === 'repetir') partes.push(nota(citasEnTexto(t.ultima)));
  else if (r.estado === 'no-corte') partes.push(caja('bajo', '✓', citasEnTexto(t.noCorte)));
  else if (r.estado === 'incompleta') partes.push(nota('Faltan la FC tumbado o al menos 2 medidas de pie después del primer minuto.'));
  if (r.reposoAlta) partes.push(caja('medio', '⚠️', citasEnTexto(t.reposoAlta)));
  if (r.tasBaja) partes.push(caja('medio', '⚠️', citasEnTexto(t.tasBaja)));
  return ref + partes.join('');
}
export function calcDisautonomiaHTML() {
  const fila = f => {
    const v = C.prueba[f] || {};
    return `<tr><th>${f === 'tumbado' ? 'Tumbado' : `De pie, ${f.slice(1)}′`}</th>
      ${['fc', 'tas', 'tad'].map(c => `<td><input type="number" inputmode="numeric" min="0" max="300" aria-label="${c.toUpperCase()} ${f}" data-gc-num="prueba" data-gc-k="${f}.${c}" value="${v[c] ?? ''}"></td>`).join('')}
      <td>${f === 'tumbado' ? '' : `<input type="checkbox" aria-label="Síntomas ${f}" data-gc-chk="prueba" data-gc-k="${f}.sintomas"${v.sintomas ? ' checked' : ''}>`}</td></tr>`;
  };
  return `<details class="guia-calc-cond" id="calc-disautonomia"><summary>🧮 Calculadora: prueba de bipedestación activa</summary><div class="guia-calc-cuerpo">
    ${edadHTML()}
    <ul class="guia-gc-prep">${DS.prueba.preparacion.map(p => `<li>${esc(p.texto)}</li>`).join('')}</ul>
    <div class="guia-gc-tabla"><table><thead><tr><th></th><th>FC</th><th>TAS</th><th>TAD</th><th>Síntomas</th></tr></thead><tbody>${FILAS_PRUEBA.map(fila).join('')}</tbody></table></div>
    <div id="guiaGcPrueba" class="guia-gc-res">${resPrueba()}</div>
    <p class="guia-nota">${citasEnTexto(DS.prueba.fuente)}</p>${borrar}</div></details>`;
}

// ── Embarazo: la regla de la tensión (NICE NG201) ────────────────────────────
function resTA() {
  const { semanas, tas, tad } = C.ta;
  if (num(tas) == null && num(tad) == null) return nota('Escribe la tensión arterial (y las semanas de gestación).');
  const r = reglaTA({ estado: 'embarazada', semanas: num(semanas) }, { tas: num(tas), tad: num(tad) });
  const t = EM.textos;
  if (r === 'grave') return caja('alto', '🚨', citasEnTexto(t.taGrave));
  if (r === 'alta') return caja('alto', '🩺', citasEnTexto(t.taAlta));
  if (r === 'cronica') return caja('medio', '⚠️', citasEnTexto(t.taCronica));
  if (r === 'sinSemanas') return caja('medio', '⚠️', `Tensión de 140/90 o más: anota las semanas. ${citasEnTexto(t.taAlta)}`);
  return caja('bajo', '✓', 'Por debajo de 140/90: la regla de la tensión no deriva.');
}
export function calcEmbarazoHTML() {
  return `<details class="guia-calc-cond" id="calc-embarazo"><summary>🧮 Calculadora: regla de la tensión en el embarazo</summary><div class="guia-calc-cuerpo">
    <div class="guia-gc-fila">${entrada('ta', 'semanas', 'Semanas de gestación', C.ta.semanas, { max: 45 })}${entrada('ta', 'tas', 'TAS (mmHg)', C.ta.tas)}${entrada('ta', 'tad', 'TAD (mmHg)', C.ta.tad)}</div>
    <div id="guiaGcTA" class="guia-gc-res">${resTA()}</div>${borrar}</div></details>`;
}

// Calculadora de cada sistema de condición especial del cribado (por su id)
export const CALC_SISTEMA = {
  transversal_hipermovilidad: calcHipermovilidadHTML,
  transversal_disautonomia: calcDisautonomiaHTML,
  transversal_embarazo: calcEmbarazoHTML,
};

// Repinta los resultados (no las entradas: así no se pierde el foco al escribir)
function repintarResultados() {
  const set = (id, fn) => { const el = document.getElementById(id); if (el) el.innerHTML = fn(); };
  set('guiaGcFase1', resFase1); set('guiaGcBeighton', resBeighton); set('guiaGcVascular', resVascular);
  set('guiaGcPrueba', resPrueba); set('guiaGcTA', resTA);
  document.querySelectorAll('[data-gc-num="edad"]').forEach(x => { if (x !== document.activeElement) x.value = C.edad ?? ''; });
}

// `repintar` = el pintar() de la guía (el riesgo «Alto» muestra u oculta sus preguntas)
export function initCalculadoras(repintar) {
  document.addEventListener('click', e => {
    const t = e.target instanceof Element ? e.target : null;
    if (t?.closest('[data-gc-borrar]')) { vaciar(); repintar({ sinScroll: true }); return; }
    const b = t?.closest('[data-gc]');
    if (!b) return;
    const { gc, gcK: k, gcV: v } = b.dataset;
    const mapa = { bandera: C.banderas, psicoQ: C.psicoQ, cuestionario: C.cuestionario, vascular: C.vascular, beighton: C.beighton };
    if (gc === 'psico') {
      C.psico = C.psico === v ? '' : v;
      repintar({ sinScroll: true });
      return;
    }
    const m = mapa[gc];
    if (!m) return;
    if (m[k] === (gc === 'beighton' ? true : v)) delete m[k]; else m[k] = gc === 'beighton' ? true : v;
    b.parentElement.querySelectorAll('[data-gc]').forEach(x => {
      const on = gc === 'beighton' ? !!m[x.dataset.gcK] : m[x.dataset.gcK] === x.dataset.gcV;
      x.classList.toggle('selected', on); x.setAttribute('aria-pressed', on);
    });
    repintarResultados();
  });
  document.addEventListener('input', e => {
    const el = e.target;
    if (el?.dataset?.gcNum) {
      const g = el.dataset.gcNum, k = el.dataset.gcK, v = num(el.value);
      if (g === 'edad') C.edad = v;
      else if (g === 'ta') { if (v == null) delete C.ta[k]; else C.ta[k] = v; }
      else if (g === 'prueba') {
        const [f, c] = k.split('.');
        const fila = C.prueba[f] || (C.prueba[f] = {});
        if (v == null) delete fila[c]; else fila[c] = v;
      }
      repintarResultados();
    } else if (el?.dataset?.gcChk === 'prueba') {
      const [f] = el.dataset.gcK.split('.');
      const fila = C.prueba[f] || (C.prueba[f] = {});
      if (el.checked) fila.sintomas = true; else delete fila.sintomas;
      repintarResultados();
    }
  });
}
