// Guía de consulta (guia.html): el porqué de cada elemento de los esquemas
// impresos (docs/esquemas), con la misma numeración, para abrirla desde el QR
// de cada hoja. Se pinta desde data/ con módulos puros (sin app.js ni state):
// nunca pide ni guarda datos del paciente. #<región>/<hoja>[/<elemento>]
import { SYSTEMIC_SCREENING, CIF_TREES, HYPOTHESES, DOSIS_DERIVAR } from './data.js';
import { TEXTO_PAUTA_COMPATIBLE } from './lib/posquirurgico.js';
import { citasHTML, citasEnTexto, registroReferencias, enlaceCita } from './lib/citas.js';
import { iaParrafoHTML, ctxCribado, ctxArbol, ctxTest, ctxIrritabilidad, ctxPauta, ctxPronostico, DESTINOS_IA, destinoIA, promptPregunta, urlIA, MAX_TEXTO_IA, NOTA_CUENTAS, attrIA, atributosIA, initAmpliarIA } from './ampliar-ia.js';
import { ITEMS_IRRITABILIDAD, CORTES_OTROS, TEXTOS_IRRITABILIDAD } from './data/irritabilidad.js';
import { nivelMatriz, NOMBRE_NIVEL, reglaIrritabilidad } from './lib/irritabilidad.js';
import { lrEfectiva, pesoTest, anatomiaPanelHTML, citasTest, calcLRScore, etiquetaHipHTML } from './lib/tests-4b.js';
import { resolveOptionTargets } from './lib/arbol.js';
import { CONDICION_SISTEMA, condicionPregunta, soloDeSistema, preguntasDeRegion, sistemasCribado, etiquetaPaso, HOJAS_GUIA, HOJAS_TEJIDO, datosHojaTejido, definicionCuadernos } from './lib/esquemas.js';
import { TIEMPOS_TEJIDO } from './data/tejidos.js';
import { condicionesHTML } from './lib/condiciones.js';
import { farmacosHTML, textoCima } from './lib/farmacos.js';
import { TEXTOS_FARMACOS } from './data/farmacos.js';
import { CUESTIONARIOS } from './data/cuestionarios.js';
import { tiemposTejidoHTML, infoBarraHTML } from './lib/tejidos.js';
import { alternarFicha, cerrarFicha } from './ficha.js';
import { nombreRegion, dolorInespecifico } from './lib/region.js';
import { textoVersion } from './lib/version.js';

const REGIONES = Object.keys(CIF_TREES);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtLR = n => n >= 10 ? n.toFixed(0) : n.toFixed(n < 1 ? 2 : 1);   // como phase4b.js
let REF = null;
// Calculadora de la confirmación: { [hipótesis]: { [test]: 'pos'|'neg' } }. Solo en
// memoria: no se guarda en ningún sitio y se borra al recargar o con «Borrar».
const RESULTADOS = {};
// Calculadora de irritabilidad: { [clave de la matriz]: valor }. Igual: solo en memoria.
const IRRITABILIDAD = {};

// ── Piezas comunes del «Por qué» ────────────────────────────────────────────
const seccion = (etq, html) => html ? `<div class="razon-seccion"><div class="razon-etq">${etq}</div>${html}</div>` : '';
const parrafos = texto => (texto || '').split('\n\n').filter(Boolean).map(p => `<p>${citasEnTexto(p)}${iaParrafoHTML()}</p>`).join('');
function fisiologiaHTML(f) {
  if (!f) return '';
  return `<div class="razon-seccion razon-fisio"><div class="razon-etq">Fisiología, paso a paso</div>
    <ol class="razon-pasos">${f.pasos.map(p => `<li>${citasEnTexto(p)}</li>`).join('')}</ol>
    ${f.nota ? `<p class="razon-fisio-nota">${citasEnTexto(f.nota)}</p>` : ''}
    <div class="razon-ia-pie">${iaParrafoHTML()}</div>
    ${f.metafora ? `<p class="razon-metafora"><span aria-hidden="true">💡</span> ${f.metafora}</p>` : ''}</div>`;
}
function fuentesHTML(citas) {
  if (!citas?.length) return '';
  const li = citas.map(c => enlaceCita(c, REF)).map(c => typeof c === 'string' ? `<li>${c}</li>`
    : `<li>${c.texto} <a class="razon-enlace" href="${c.url}" target="_blank" rel="noopener noreferrer">Abrir ↗</a></li>`).join('');
  return `<div class="razon-seccion razon-fuentes"><div class="razon-etq">Fuentes</div><ul>${li}</ul></div>`;
}
const porQue = (ctx, cuerpo) => cuerpo.trim()
  ? `<details class="razon"><summary>ⓘ Por qué y más</summary><div class="razon-cuerpo" data-ia-ctx="${attrIA(ctx)}">${cuerpo}</div></details>` : '';

// ── Cribado (fase 2) ────────────────────────────────────────────────────────
function htmlCribado(region) {
  const sc = SYSTEMIC_SCREENING[region];
  const { siempre, especiales } = sistemasCribado(SYSTEMIC_SCREENING, region);
  const sistema = s => {
    const preguntas = preguntasDeRegion(s, region);
    const conds = preguntas.map(condicionPregunta);
    const comun = conds.length && conds.every(c => c && c === conds[0]) ? conds[0] : '';
    const solo = soloDeSistema(s);
    const idx = Object.fromEntries(preguntas.map((q, i) => [q.id, i + 1]));
    const c = s.criterioCompuesto;
    const crit = c ? `<div class="guia-crit"><b>${esc(c.etiqueta)}</b> — ${c.minPositivas} o más de las preguntas ${c.ids.map(id => idx[id]).join(', ')}${c.filtro?.edadMax ? ` · edad ≤ ${c.filtro.edadMax}` : ''}${c.filtro?.evolucion ? ` · evolución: ${esc(c.filtro.evolucion)}` : ''}${c.nota ? `<br>${esc(c.nota)}` : ''}</div>` : '';
    return `<section class="guia-bloque${solo ? ' especial' : ''}"><h3>${esc(s.icon || '')} ${esc(s.nombre)}</h3>
      ${solo ? `<div class="guia-cond">Solo con ${esc(CONDICION_SISTEMA[solo])}${comun ? ` · ${esc(comun)}` : ''}</div>` : ''}
      ${preguntas.map((q, k) => {
        const r = q.razonamiento;
        const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`)
          + seccion('Cuánto pesa', `<p>${citasEnTexto(r.peso)}</p>`)
          + fisiologiaHTML(r.fisiologia) + seccion('En detalle', parrafos(r.detalle))
          + anatomiaPanelHTML(q) + fuentesHTML(r.citas || r.fuentes) : '';
        return `<div class="guia-item" id="q-${q.id}"><div class="guia-texto"><span class="guia-num">${k + 1}</span>${esc(q.text)}${q.urgencia ? '<span class="guia-chip urg">URGENCIA</span>' : q.derivacion ? '<span class="guia-chip der">DERIVACIÓN</span>' : ''}${conds[k] && !comun ? `<span class="guia-chip cuando">${esc(conds[k])}</span>` : ''}</div>
          ${q.urgencia ? `<div class="guia-nota guia-der">🚑 ${esc(q.urgencia)}</div>` : q.derivacion ? `<div class="guia-nota">🩺 ${esc(q.derivacion)}</div>` : ''}
          ${porQue(ctxCribado(region, q.text), cuerpo)}</div>`;
      }).join('')}${crit}</section>`;
  };
  const urg = sc.urgencia ? `<div class="guia-urg"><b>${esc(sc.urgencia.titulo)}</b>${sc.urgencia.lineas.map(l => `<div>· ${esc(l)}</div>`).join('')}</div>` : '';
  return `<h2>Cribado sistémico · ${nombreRegion(region)}</h2>${urg}
    ${siempre.map(sistema).join('')}
    ${especiales.length ? `<h2>Condiciones especiales</h2><p class="guia-nota">Solo aparecen en la fase 2 si en la fase 1 está marcada su tarjeta (o el mecanismo «Post-quirúrgico»).</p>${especiales.map(sistema).join('')}` : ''}`;
}

// ── Árbol CIF (fase 4) ──────────────────────────────────────────────────────
function htmlArbol(region) {
  const tree = CIF_TREES[region], steps = tree.steps;
  const lab = id => { const i = steps.findIndex(s => s.id === id); return etiquetaPaso(steps[i], i); };
  return `<h2>${esc(tree.title || `Árbol CIF · ${nombreRegion(region)}`)}</h2>
    <p class="guia-nota">Cada respuesta puede sumar una hipótesis; se acumulan y se confirman con tests en la fase 4b.</p>
    ${steps.map((st, i) => {
      const r = st.razonamiento;
      const cuerpo = r ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`)
        + seccion('En detalle', parrafos(r.detalle)) + fuentesHTML(r.citas || r.fuentes) : '';
      const ops = st.options.map(o => {
        const [corto, ...resto] = o.label.split('—');
        const hips = o.hypothesis.map(h => HYPOTHESES[h]).filter(Boolean).map(h => `<span class="guia-hip">${esc(h.num || '')} ${esc(h.name)}</span>`).join(', ');
        const t = resolveOptionTargets(tree, i, o)[0];
        const ruta = !t ? 'fin del árbol' : t.id !== steps[i + 1]?.id ? `sigue en el paso ${lab(t.id)}` : '';
        const res = [hips, o.derivacion ? `<span class="guia-der">Derivación médica: ${esc(o.derivacion)}</span>` : '', ruta].filter(Boolean).join(' · ');
        return `<li><b>${esc(corto.trim())}</b>${resto.length ? ` — ${esc(resto.join('—').trim())}` : ''}${res ? ` → ${res}` : ''}</li>`;
      }).join('');
      return `<section class="guia-bloque guia-item" id="paso-${st.id}"><h3><span class="guia-num">${esc(lab(st.id))}</span>${esc(st.question)}</h3>
        <ul class="guia-ops">${ops}</ul>${porQue(ctxArbol(region, st.iaPregunta || st.question), cuerpo)}</section>`;
    }).join('')}
    <div class="guia-sinhip" id="sin-hipotesis"><b>Si el árbol termina sin ninguna hipótesis</b>
      <p>No hay un patrón dominante claro: puede ser una presentación atípica o un dolor musculoesquelético inespecífico. La app propone:</p>
      <ul><li>Trabajar con la hipótesis de trabajo «${esc(dolorInespecifico(region))}».</li>
        <li>Revisar los factores psicosociales (fase 1 y SINSS).</li>
        <li>Volver al árbol y reconsiderar las respuestas.</li>
        <li>Si el cuadro es crónico (más de 3 meses) y el riesgo psicosocial es alto, considerar también sensibilización central como hipótesis complementaria.</li></ul>
      <p>Es una regla de la app, sin fuente citada. La fase 4b no tiene tests que hacer en ese caso.</p></div>`;
}

// ── Pauta y pronóstico de una hipótesis (los de la fase 5, sin paciente) ─────
// Contenido fijo de data/: la pauta (todas sus situaciones, si se reparte en ramas), su fuente
// y el pronóstico. No es un plan de sesión: eso es la fase 6, que tiene en cuenta urgencias,
// condiciones especiales y red de seguridad que la guía no conoce. La derivación, siempre a la vista.
function pautaHipHTML(h, region) {
  if (h.dosis === DOSIS_DERIVAR) return `<div class="guia-urg"><b>🚑 Derivación</b>${esc(DOSIS_DERIVAR)}</div>`;
  const p = h.pronostico;
  const linea = (et, t) => t ? `<p data-ia-parrafo>${et ? `<b>${et}</b> ` : ''}${citasEnTexto(t)}${iaParrafoHTML()}</p>` : '';
  const pauta = h.dosisRamas?.length
    ? h.dosisRamas.map(r => linea('', r.texto)).join('') + linea('', h.dosisComun)   // cada rama empieza por su situación
    : h.dosis ? linea('', h.dosis) : '<p><em>Sin dosis de referencia: a criterio del clínico.</em></p>';
  return `<details class="razon guia-pauta"><summary>💊 Pauta y pronóstico</summary><div class="razon-cuerpo">
    <div class="razon-seccion" ${atributosIA(ctxPauta(region, h.name))}><div class="razon-etq">${h.dosisFuente ? 'Pauta de tratamiento' : 'Dosis día 1 (baja fricción)'}</div>${pauta}
      ${h.dosisFuente ? `<div class="razon-pie">${citasHTML(h.dosisFuente)}</div>` : ''}
      ${h.dosis ? `<p class="guia-nota">🏥 Tras una cirugía: ${esc(TEXTO_PAUTA_COMPATIBLE.charAt(0).toLowerCase() + TEXTO_PAUTA_COMPATIBLE.slice(1))}</p>` : ''}</div>
    ${p ? `<div class="razon-seccion" ${atributosIA(ctxPronostico(region, h.name))}><div class="razon-etq">Pronóstico y derivación</div>${linea('', p.horizonte)}${linea('Seguimiento:', p.seguimiento)}${linea('A tener en cuenta:', p.notas)}${linea('Reconsiderar o derivar si:', p.derivacion)}
      ${p.fuente ? `<div class="razon-pie">${citasHTML(p.fuente)}</div>` : ''}</div>` : ''}
  </div></details>`;
}

// ── Confirmación (fase 4b) ──────────────────────────────────────────────────
function htmlConfirmacion(region) {
  const hyps = Object.values(HYPOTHESES).filter(h => h.region === region);
  const lrTxt = t => {
    const lr = lrEfectiva(t);
    const f = (v, o, util) => v == null ? '—' : `<span class="${util && t.tipo !== 'pronostico' ? 'util' : ''}">${o === 'calculada' ? '≈' : ''}${fmtLR(v)}</span>`;
    return `LR+ ${f(lr.pos, lr.origenPos, lr.posUtil)} · LR− ${f(lr.neg, lr.origenNeg, lr.negUtil)}`;
  };
  return `<h2>Confirmación de hipótesis · ${nombreRegion(region)}</h2>
    <p class="guia-nota">LR en verde: multiplica la puntuación (LR+ ≥ 2 o LR− ≤ 0,5). «≈» = calculada de S y E.</p>
    <div id="guiaResumenCalc">${resumenCalcHTML(region)}</div>
    ${hyps.map(h => {
      const clusters = Object.entries(h.clusters || {}).map(([cid, c]) => {
        const n = h.tests.filter(t => t.cluster === cid).length, lr = lrEfectiva(c);
        const reglas = [lr.posUtil ? `≥${c.umbralPos} de ${n} positivos → LR+ ${fmtLR(lr.pos)}` : '', lr.negUtil && c.umbralNeg != null ? `${c.umbralNeg === 0 ? 'ninguno' : `≤${c.umbralNeg}`} de ${n} positivos (todos hechos) → LR− ${fmtLR(lr.neg)}` : ''].filter(Boolean).join(' · ');
        return `<div class="guia-crit">🧩 <b>${esc(c.nombre)}</b>: ${reglas || 'sin LR aplicable'}. Sus tests no puntúan por separado.${c.fuente ? ` ${citasHTML(c.fuente)}` : ''}</div>`;
      }).join('');
      const tests = h.tests.map((t, k) => {
        const r = t.razonamiento;
        const cuerpo = (r?.porque ? seccion('Por qué', `<p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>`) : '')
          + seccion('En detalle', parrafos(r?.detalle)) + anatomiaPanelHTML(t) + fuentesHTML(citasTest(t));
        return `<div class="guia-item" id="test-${h.id}-${k}"><div class="guia-texto">${esc(t.name)}</div>
          <div class="guia-lr">${t.cluster ? `en el clúster ${esc(h.clusters?.[t.cluster]?.nombre || '')}` : lrTxt(t)}</div>
          <div class="guia-peso">${pesoTest(h, t, k)}</div>
          ${t.criterio ? `<div class="guia-criterio" ${atributosIA(ctxTest(region, t.name, h.name))} data-ia-parrafo>${citasEnTexto(t.criterio)}${iaParrafoHTML()}</div>` : ''}
          ${botonesTest(h.id, k)}
          ${porQue(ctxTest(region, t.name, h.name), cuerpo)}</div>`;
      }).join('');
      return `<section class="guia-bloque" id="hip-${h.id}"><h3><span class="guia-num">${esc(h.num || '')}</span>${esc(h.name)}</h3>
        <div class="guia-puntua" data-puntua="${h.id}">${puntuaHTML(h)}</div>${clusters}${tests}${pautaHipHTML(h, region)}</section>`;
    }).join('')}`;
}

// ── Calculadora (mismas reglas que la fase 4b: calcLRScore, lib/tests-4b.js) ──
const RES_BTN = [['pos', '✓ Positivo'], ['neg', '✗ Negativo'], ['nd', 'Sin datos']];
function botonesTest(hId, k) {
  const r = RESULTADOS[hId]?.[k] || 'nd';
  return `<div class="test-result-btns guia-calc" role="group" aria-label="Resultado">${RES_BTN.map(([v, t]) =>
    `<button type="button" class="test-result-btn ${v}${r === v ? ' selected' : ''}" data-hip="${hId}" data-test="${k}" data-res="${v}" aria-pressed="${r === v}">${t}</button>`).join('')}</div>`;
}
function puntuaHTML(h) {
  const res = RESULTADOS[h.id] || {};
  return Object.keys(res).length ? etiquetaHipHTML(calcLRScore(h, res).label) : '<span class="guia-sin">Sin evaluar: marca los tests hechos</span>';
}
function resumenCalcHTML(region) {
  const hechas = Object.values(HYPOTHESES).filter(h => h.region === region && Object.keys(RESULTADOS[h.id] || {}).length)
    .map(h => ({ h, p: calcLRScore(h, RESULTADOS[h.id]) })).sort((a, b) => b.p.totalLR - a.p.totalLR);
  if (!hechas.length) return '<p class="guia-nota">Marca el resultado de los tests que hagas y cada hipótesis se puntúa como en la fase 4b de la app. No se guarda nada: se borra al recargar.</p>';
  return `<div class="guia-resumen"><div class="guia-resumen-cab"><b>Puntuación</b><button type="button" class="guia-borrar" data-borrar>Borrar resultados</button></div>
    ${hechas.map(({ h, p }) => `<a href="#${region}/confirmacion/hip-${h.id}" class="guia-resumen-fila"><span>${esc(h.num || '')} ${esc(h.name)}</span>${etiquetaHipHTML(p.label)}</a>`).join('')}
    <p class="guia-nota">No se guarda nada: se borra al recargar. Para la valoración completa, usa la app.</p></div>`;
}
function pintarCalc(region) {
  const r = document.getElementById('guiaResumenCalc');
  if (r) r.innerHTML = resumenCalcHTML(region);
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const b = t?.closest('.guia-calc .test-result-btn');
  if (b) {
    const { hip, test, res } = b.dataset;
    const actual = RESULTADOS[hip] || (RESULTADOS[hip] = {});
    if (res === 'nd' || actual[test] === res) delete actual[test]; else actual[test] = res;
    if (!Object.keys(actual).length) delete RESULTADOS[hip];
    b.parentElement.outerHTML = botonesTest(hip, Number(test));
    const p = document.querySelector(`[data-puntua="${hip}"]`);
    if (p) p.innerHTML = puntuaHTML(HYPOTHESES[hip]);
    pintarCalc(HYPOTHESES[hip].region);
    return;
  }
  if (t?.closest('[data-borrar]')) {
    Object.keys(RESULTADOS).forEach(k => delete RESULTADOS[k]);
    pintar();
  }
});

// ── Irritabilidad (fase 3): la matriz y la regla de la app (nivelMatriz, lib/irritabilidad.js) ──
function resultadoIrritabHTML(region) {
  const T = TEXTOS_IRRITABILIDAD, m = nivelMatriz(IRRITABILIDAD);
  if (!m.nivel) return `<div class="guia-irr-res"><span class="guia-irr-icono">⚪</span><span>${citasEnTexto(T.noRegistrada)}</span></div>`;
  const nivel = NOMBRE_NIVEL[m.nivel];
  const emoji = { baja: '🟢', moderada: '🟠', alta: '🔴' }[m.nivel];
  const textos = [m.nivel === 'baja' ? T.hastaLimite : T.hastaDolor, ...(m.nivel === 'alta' ? [T.alta] : [])];
  const falta = m.incompleta ? (m.sinCalma ? T.sinCalma : T.incompleta) : '';
  return `<div class="guia-irr-res guia-irr-${m.nivel}"><span class="guia-irr-icono">${emoji}</span>
    <span ${atributosIA(ctxIrritabilidad(region, nivel))}><strong>Irritabilidad ${nivel}</strong> — <span data-ia-parrafo>${citasEnTexto(textos.join(' '))}${iaParrafoHTML()}</span>
    ${falta ? `<br><em>${citasEnTexto(falta)}</em>` : ''}<br><span class="guia-irr-margen">${citasEnTexto(T.margen)}</span></span></div>`;
}
function filaIrritabHTML(it) {
  const v = IRRITABILIDAD[it.clave] || '';
  return `<div class="guia-item guia-irr-fila"><div class="guia-texto">${esc(it.nombre)}</div>
    ${it.ayuda ? `<div class="guia-criterio">${citasEnTexto(esc(it.ayuda))}</div>` : ''}
    <div class="option-group guia-irr-ops" role="group" aria-label="${esc(it.nombre)}">${it.opciones.map((o, i) =>
      `<button type="button" class="option-btn${v === o.valor ? ' selected' : ''}" data-irr="${it.clave}" data-valor="${esc(o.valor)}" aria-pressed="${v === o.valor}"><span class="guia-irr-n">${i}</span> ${esc(o.valor)}</button>`).join('')}</div></div>`;
}
function htmlIrritabilidad(region, { conTitulo = true } = {}) {
  return `${conTitulo ? '<h2>Irritabilidad (fase 3)</h2>' : ''}
    <p class="guia-nota">La misma matriz y la misma regla que la fase 3 de la app (y la fase 6). Marca lo que refiere el paciente; un segundo toque desmarca. No se guarda nada: se borra al recargar.</p>
    <div id="guiaIrrRes">${resultadoIrritabHTML(region)}</div>
    <section class="guia-bloque">${ITEMS_IRRITABILIDAD.map(filaIrritabHTML).join('')}
      <div class="guia-irr-pie"><button type="button" class="guia-borrar" data-irr-borrar>Borrar respuestas</button></div></section>
    <details class="razon guia-irr-regla"><summary>ⓘ Cómo se calcula</summary><div class="razon-cuerpo">
      ${reglaIrritabilidad().map(p => `<p>${p}</p>`).join('')}
    </div></details>`;
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const b = t?.closest('[data-irr]');
  if (b) {
    const { irr, valor } = b.dataset;
    if (IRRITABILIDAD[irr] === valor) delete IRRITABILIDAD[irr]; else IRRITABILIDAD[irr] = valor;
    b.closest('.guia-irr-ops').querySelectorAll('[data-irr]').forEach(x => {
      const on = IRRITABILIDAD[irr] === x.dataset.valor;
      x.classList.toggle('selected', on); x.setAttribute('aria-pressed', on);
    });
    document.getElementById('guiaIrrRes').innerHTML = resultadoIrritabHTML(leerRuta().region);
    return;
  }
  if (t?.closest('[data-irr-borrar]')) {
    Object.keys(IRRITABILIDAD).forEach(k => delete IRRITABILIDAD[k]);
    pintar();
  }
});

// ── Tiempos de recuperación de tejidos (#tejidos/<hoja>, el QR de sus dos hojas) ──
// La misma gráfica que el panel ⏱ de la app (lib/tejidos.js), con los grupos de esa hoja;
// tocar una barra abre su ficha (gravedad, qué mide, plazo y fuentes). Sin «Este paciente»
// ni «Hoy»: la guía no tiene datos del paciente. El filtro, solo en memoria.
let FILTRO_TEJ = 'todos';
const datosTejido = hoja => datosHojaTejido(TIEMPOS_TEJIDO, hoja);
function htmlTejidos(hoja) {
  return `<p class="guia-nota">Referencia general, no un plazo para un paciente: cada barra dice qué mide (vuelta al deporte, protección, programa…). Toca una barra para ver su nota y sus fuentes.</p>
    <div class="guia-tejidos tejidos-cuerpo">${tiemposTejidoHTML(datosTejido(hoja), { filtro: FILTRO_TEJ, REF })}</div>`;
}
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  if (!t?.closest('.guia-tejidos')) return;
  const barra = t.closest('.tej-barra[data-barra]');
  if (barra) { alternarFicha(barra, infoBarraHTML(datosTejido(leerRuta().hoja), barra.dataset.barra, REF), { id: 'tejInfo', clase: 'tej-info' }); return; }
  const b = t.closest('[data-filtro-tejido]');
  if (!b) return;
  FILTRO_TEJ = b.dataset.filtroTejido;
  cerrarFicha({ sinFoco: true });
  pintar({ sinScroll: true });
  document.querySelector(`.guia-tejidos .tej-filtro-btn[data-grupo="${b.dataset.grupo}"]`)?.focus({ preventScroll: true });
});

document.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('[data-filtro-hojas]') : null;
  if (!b) return;
  FILTRO_HOJAS = FILTRO_HOJAS === b.dataset.filtroHojas ? '' : b.dataset.filtroHojas;
  pintar({ sinScroll: true });
  document.querySelector(`[data-filtro-hojas="${b.dataset.filtroHojas}"]`)?.focus({ preventScroll: true });
});

// ── ¿Está al día la hoja impresa? ───────────────────────────────────────────
// El QR de cada hoja lleva su huella (?h=, docs/esquemas/hojas.mjs). Si no coincide con la
// actual (docs/esquemas/huellas.json, desplegado en la misma ruta con los PDF), la guía avisa y enlaza el PDF
// actual para reimprimirla. Solo en la hoja de la que vino el QR; sin ?h= o sin huellas, nada.
const HUELLA_PAPEL = new URLSearchParams(location.search).get('h') || '';
let HOJA_PAPEL = '', HUELLAS = null;
function claveHoja({ tejidos, suelta, region, hoja }) {
  if (suelta) return suelta;
  if (tejidos) return `tejidos-${hoja}`;
  return hoja === 'arbol' ? `arbol-a4-${region}` : hoja === 'irritabilidad' ? '' : `${hoja}-${region}`;
}
let CUADERNOS = null, RESPUESTAS = null;
async function cargarHuellas() {
  try {
    const r = await fetch('./docs/esquemas/huellas.json', { cache: 'no-store' });
    if (r.ok) HUELLAS = await r.json();
  } catch { /* sin red o sin archivo: sin aviso */ }
  try {
    const r = await fetch('./docs/esquemas/cuadernos.json', { cache: 'no-store' });
    if (r.ok) CUADERNOS = await r.json();
  } catch { /* sin cuadernos: la lista de hojas sigue */ }
  try {
    const r = await fetch('./docs/esquemas/respuestas/huellas.json', { cache: 'no-store' });
    if (r.ok) RESPUESTAS = await r.json();
  } catch { /* sin hojas de respuestas: la lista sigue */ }
}
// Enlace a un PDF con su versión (?v=): una versión nueva es otra dirección, así el navegador
// (o el visor de PDF del móvil) no abre la copia que ya tenía en caché.
const urlPDF = (clave, v) => `./docs/esquemas/${clave}.pdf${v ? `?v=${encodeURIComponent(v)}` : ''}`;
function avisoHojaHTML(clave) {
  if (!HUELLA_PAPEL || !HUELLAS || !clave || clave !== HOJA_PAPEL || !HUELLAS[clave]) return '';
  if (HUELLAS[clave].huella === HUELLA_PAPEL) return `<div class="guia-papel ok" id="guiaPapel">✓ Tu hoja impresa está al día (v. ${esc(HUELLA_PAPEL)}).</div>`;
  return `<div class="guia-papel" id="guiaPapel"><b>Tu hoja impresa es de una versión anterior</b>
    La numeración o el contenido pueden haber cambiado desde que se imprimió (v. ${esc(HUELLA_PAPEL)}; la actual es v. ${esc(HUELLAS[clave].huella)}): manda lo que ves aquí.
    <a href="${urlPDF(clave, HUELLAS[clave].huella)}" target="_blank" rel="noopener">Descargar la hoja actual (PDF) para reimprimirla →</a></div>`;
}

// ── Hojas para imprimir (#hojas) ─────────────────────────────────────────────
// Para quien gestiona las copias en papel: cada hoja con su versión actual (la «v.» que
// lleva bajo el QR), la fecha de su último cambio de contenido y su PDF. Sale de
// huellas.json, así que se mantiene sola. Las que cambiaron hace poco, marcadas.
const DIAS_RECIENTE = 30;
// Hojas sin QR (no tienen página en la guía): solo se listan aquí, con su versión y su PDF
const PARA_PACIENTE = { 'ejercicio-paciente': 'El ejercicio: lo que dicen los estudios' };
const NOMBRE_HOJA = { cribado: 'Cribado (fase 2)', 'arbol-a4': 'Árbol de decisión (fase 4)', confirmacion: 'Confirmación (fase 4b)' };
// Filtro por región (decisión del usuario, 2026-10): deja el cuaderno de esa región, sus tres
// hojas y las hojas generales. Sin botón «Todas»: un segundo toque en la región activa lo quita,
// como el filtro de tejidos. Solo en memoria.
let FILTRO_HOJAS = '';
function filtroHojasHTML() {
  return `<div class="guia-hojas-filtro" role="group" aria-label="Filtrar por región">${REGIONES.map(r =>
    `<button type="button" class="tej-filtro-btn${FILTRO_HOJAS === r ? ' activo' : ''}" data-filtro-hojas="${r}" aria-pressed="${FILTRO_HOJAS === r}">${esc(nombreRegion(r))}</button>`).join('')}</div>`;
}
const fechaLarga = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
function htmlHojas() {
  if (!HUELLAS) return '<p class="guia-vacio">No se ha podido cargar la lista de hojas. Prueba a recargar la página.</p>';
  const hoy = Date.now();
  // Cuadernos cuyas páginas se movieron hace poco (una hoja ocupa otro número de páginas, o se
  // añadió una): sustituir solo la hoja que cambió dejaría mal las de detrás
  const recienteFecha = iso => !!iso && (hoy - new Date(`${iso}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE;
  const movidas = new Set(Object.values(CUADERNOS || {}).filter(d => recienteFecha(d.paginasFecha)).flatMap(d => d.paginasPor || []));
  const fila = (clave, nombre, de = HUELLAS, ruta = '') => {
    const h = de[clave];
    if (!h) return '';
    const reciente = (hoy - new Date(`${h.fecha}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE;
    const mueve = de === HUELLAS && movidas.has(clave);
    return `<li class="guia-hoja${reciente ? ' reciente' : ''}"><div class="guia-hoja-txt"><b>${esc(nombre)}</b>
      <span class="guia-hoja-v">v. ${esc(h.huella)}</span> · <span>cambió el ${esc(fechaLarga(h.fecha))}</span>${reciente ? ' <span class="guia-hoja-nueva">Reciente</span>' : ''}
      ${mueve ? '<span class="guia-hoja-movida">Ahora ocupa otro número de páginas: en los cuadernos ya no basta con sustituirla, reimprímelos enteros.</span>' : ''}</div>
      <a href="${urlPDF(ruta + clave, h.huella)}" target="_blank" rel="noopener" aria-label="Descargar ${esc(nombre)} en PDF">PDF ↗</a></li>`;
  };
  const grupo = (titulo, filas) => `<section class="guia-bloque"><h3>${esc(titulo)}</h3><ul class="guia-hojas-lista">${filas.join('')}</ul></section>`;
  const recientes = Object.values(HUELLAS).filter(h => (hoy - new Date(`${h.fecha}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE).length;
  // Cuadernos de consulta a doble cara (completo y por región), arriba: es lo que se imprime de una vez
  const cuadernos = CUADERNOS ? definicionCuadernos(REGIONES, nombreRegion).filter(l => CUADERNOS[l.clave] && (!FILTRO_HOJAS || l.clave === `cuaderno-${FILTRO_HOJAS}`)).map(l => {
    const d = CUADERNOS[l.clave];
    const reciente = (hoy - new Date(`${d.fecha}T12:00:00`).getTime()) / 864e5 <= DIAS_RECIENTE;
    return `<li class="guia-hoja${reciente ? ' reciente' : ''}"><div class="guia-hoja-txt"><b>${esc(l.titulo)}</b>
      <span>${d.paginas} páginas (${d.paginas / 2} hojas de papel)</span> · <span class="guia-hoja-v">v. ${esc(d.huella)}</span> · <span>cambió el ${esc(fechaLarga(d.fecha))}</span>${d.paginasFecha ? ` · <span>páginas colocadas así desde el ${esc(fechaLarga(d.paginasFecha))}</span>` : ''}${reciente ? ' <span class="guia-hoja-nueva">Reciente</span>' : ''}
      ${recienteFecha(d.paginasFecha) ? `<span class="guia-hoja-movida">Las páginas se movieron el ${esc(fechaLarga(d.paginasFecha))}: si tu copia es anterior, reimprímelo entero; sustituir una hoja ya no basta.</span>` : ''}</div>
      <a href="${urlPDF(l.clave, d.archivo || d.huella)}" target="_blank" rel="noopener" aria-label="Descargar ${esc(l.titulo)} en PDF">PDF ↗</a></li>`;
  }) : [];
  return `<p class="guia-nota">Cada hoja impresa lleva su versión bajo el QR («v. …»). Si no coincide con la de esta lista, la hoja ha cambiado: descarga el PDF y reimprímela. «Reciente» = cambió en los últimos ${DIAS_RECIENTE} días (${recientes} de ${Object.keys(HUELLAS).length}).</p>
    ${filtroHojasHTML()}
    ${FILTRO_HOJAS ? `<p class="guia-nota guia-hojas-filtrado">${esc(nombreRegion(FILTRO_HOJAS))}: su cuaderno, sus tres hojas y las hojas generales. Toca otra vez la región para verlo todo.</p>` : ''}
    ${cuadernos.length ? `<section class="guia-bloque"><h3>Cuadernos de consulta para imprimir a doble cara</h3><p class="guia-nota">Todas las hojas de consulta en un PDF, o las de una región con las generales. Cada hoja empieza en página impar, en su propio papel: si una cambia, imprime solo sus páginas del cuaderno nuevo (el índice dice cuáles) y sustitúyela. Si una hoja pasa a ocupar otro número de páginas, las de detrás se mueven: el cuaderno lo avisa en rojo y entonces se reimprime entero (la portada dice desde cuándo están colocadas así). La portada lleva el índice con la versión de cada hoja. La hoja del paciente va aparte.</p><ul class="guia-hojas-lista">${cuadernos.join('')}</ul></section>` : ''}
    ${REGIONES.filter(r => !FILTRO_HOJAS || r === FILTRO_HOJAS).map(r => grupo(nombreRegion(r), Object.entries(NOMBRE_HOJA).map(([t, n]) => fila(`${t}-${r}`, n)))).join('')}
    ${grupo('Tiempos de recuperación de tejidos', Object.entries(HOJAS_TEJIDO).map(([k, h]) => fila(`tejidos-${k}`, h.titulo)))}
    ${grupo('Otras hojas', Object.entries(SUELTAS).map(([k, h]) => fila(k, h.titulo)))}
    ${grupo('Para dar al paciente', Object.entries(PARA_PACIENTE).map(([k, t]) => fila(k, t)))}
    ${RESPUESTAS ? `<section class="guia-bloque guia-respuestas"><h3>Hojas de respuestas del lector con foto (en prueba)</h3>
      <p class="guia-aviso-prueba"><b>En prueba: no las uses con pacientes.</b> Sirven para medir si el lector de cuestionarios con foto lee bien las marcas, rellenándolas con respuestas inventadas. El paciente no responde aquí al cuestionario: lee el texto oficial y marca en esta hoja.</p>
      <ul class="guia-hojas-lista">${CUESTIONARIOS.filter(d => RESPUESTAS[d.id]).map(d => fila(d.id, `${d.nombre} · ${d.titulo}`, RESPUESTAS, 'respuestas/')).join('')}</ul></section>` : ''}`;
}

// ── Páginas sueltas (#<clave>): el QR de las hojas que no son de una región ──
// La clave es la de la hoja impresa (docs/esquemas/<clave>.pdf), para el aviso de papel viejo.
const SUELTAS = {
  condiciones: { titulo: 'Condiciones especiales', html: () => condicionesHTML({}, { guia: true }) },
  irritabilidad: { titulo: 'Irritabilidad (fase 3)', html: () => htmlIrritabilidad('', { conTitulo: false }) },
  farmacos: { titulo: 'Fármacos: qué vigilar', html: () => `<div id="farmCuerpo">${farmacosHTML()}</div>${preguntaFarmacosHTML()}` },
};

// «¿Otro fármaco o duda?»: el modo «Fármacos» de «✨ Preguntar a la IA» de la app (promptPregunta,
// mismo guion y destinos), al final de la página de fármacos: completa su hoja con lo que no trae.
// Solo se envía lo que se escribe; el destino elegido, en memoria (la guía no guarda nada).
let DESTINO_PREGUNTA = destinoIA();
function preguntaFarmacosHTML() {
  const d = DESTINOS_IA[DESTINO_PREGUNTA];
  return `<section class="guia-bloque guia-pregunta" id="guiaPregunta"><h3>¿Otro fármaco o duda? Pregunta a la IA</h3>
    <p class="guia-nota">No escribas datos que identifiquen al paciente. Se envía solo lo que escribas, con un guion para fisioterapeutas: dolor e inflamación, síntomas viscerales, ejercicio, sueño y cuándo consultar, sin ajustar nunca la medicación; pide también la ficha técnica de CIMA. PhysiQ no revisa la respuesta.</p>
    <label class="guia-vh" for="guiaPreguntaTexto">Fármaco o duda</label>
    <textarea id="guiaPreguntaTexto" class="field-input" rows="3" maxlength="${MAX_TEXTO_IA}" placeholder="Ej.: pregabalina y ejercicio en mayores"></textarea>
    <div class="option-group guia-destinos" role="group" aria-label="Dónde preguntar">${Object.entries(DESTINOS_IA).map(([k, x]) =>
      `<button type="button" class="option-btn${k === DESTINO_PREGUNTA ? ' selected' : ''}" data-destino-pregunta="${k}" aria-pressed="${k === DESTINO_PREGUNTA}">${esc(x.nombre)}</button>`).join('')}</div>
    <p class="guia-nota guia-destino-ventaja">${esc(d.ventaja)}</p>
    <a class="btn btn-primary guia-preguntar" id="guiaPreguntaIr" href="#" target="_blank" rel="noopener noreferrer" aria-disabled="true">Preguntar en ${esc(d.nombre)} ↗</a>
    <p class="guia-nota">${esc(NOTA_CUENTAS)}</p></section>`;
}
const textoPregunta = () => document.getElementById('guiaPreguntaTexto')?.value.trim() || '';
document.addEventListener('input', e => {
  if (e.target?.id !== 'guiaPreguntaTexto') return;
  document.getElementById('guiaPreguntaIr')?.setAttribute('aria-disabled', String(textoPregunta().length < 3));
});
document.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  const b = t?.closest('[data-destino-pregunta]');
  if (b) {
    DESTINO_PREGUNTA = b.dataset.destinoPregunta;
    document.querySelectorAll('[data-destino-pregunta]').forEach(x => { const on = x === b; x.classList.toggle('selected', on); x.setAttribute('aria-pressed', on); });
    const d = DESTINOS_IA[DESTINO_PREGUNTA];
    document.getElementById('guiaPreguntaIr').textContent = `Preguntar en ${d.nombre} ↗`;
    document.querySelector('.guia-destino-ventaja').textContent = d.ventaja;
    return;
  }
  const a = t?.closest('#guiaPreguntaIr');
  if (!a) return;
  const q = textoPregunta();
  if (q.length < 3) { e.preventDefault(); return; }
  a.href = urlIA(DESTINO_PREGUNTA, promptPregunta({ pregunta: q, tipo: 'farmacos' }));   // en el propio clic, sin window.open
});

// «Ficha técnica (CIMA)»: como en la app, el enlace abre el buscador de CIMA y aquí se copia
// el nombre para pegarlo; un aviso breve dice dónde (o qué buscar, si no se pudo copiar).
function avisoGuia(texto) {
  let el = document.getElementById('guiaAviso');
  if (!el) { el = document.createElement('div'); el.id = 'guiaAviso'; el.className = 'guia-aviso'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = texto; el.hidden = false;
  clearTimeout(avisoGuia.t); avisoGuia.t = setTimeout(() => { el.hidden = true; }, 5000);
}
document.addEventListener('click', e => {
  const a = e.target instanceof Element ? e.target.closest('#farmCuerpo a[data-cima]') : null;
  if (!a) return;
  const n = a.dataset.cima;
  const fallo = () => avisoGuia(textoCima(TEXTOS_FARMACOS.cimaSinCopiar, n));
  try { navigator.clipboard.writeText(n).then(() => avisoGuia(textoCima(TEXTOS_FARMACOS.cimaCopiado, n)), fallo); } catch { fallo(); }
}, true);

const PINTAR = { cribado: htmlCribado, arbol: htmlArbol, confirmacion: htmlConfirmacion, irritabilidad: htmlIrritabilidad };

// ── Navegación ──────────────────────────────────────────────────────────────
function leerRuta() {
  const [r, h, el] = decodeURIComponent(location.hash.slice(1)).split('/');
  if (r === 'hojas') return { hojas: true, region: '', hoja: '', elemento: '' };
  if (SUELTAS[r]) return { suelta: r, region: '', hoja: '', elemento: '' };
  if (r === 'tejidos') return { tejidos: true, region: '', hoja: HOJAS_TEJIDO[h] ? h : 'blandos', elemento: '' };
  return { region: REGIONES.includes(r) ? r : 'lumbar', hoja: PINTAR[h] ? h : 'cribado', elemento: el || '' };
}

// El <select> de la región es el título: tan ancho como el nombre elegido, para que el ▾ vaya pegado
// El nombre de la región que se ve (el <select> transparente lo cubre: ver guia.html)
function pintarNombreRegion() {
  const sel = document.getElementById('guiaRegion');
  document.getElementById('guiaRegionNombre').textContent = sel.options[sel.selectedIndex]?.text || '';
}

function pintar({ sinScroll = false } = {}) {
  const { tejidos, hojas, suelta, region, hoja, elemento } = leerRuta();
  document.body.classList.toggle('guia-modo-tejidos', !!tejidos || !!hojas || !!suelta);
  document.body.classList.toggle('guia-modo-hojas', !!hojas || !!suelta);
  if (suelta) {
    const { titulo, html } = SUELTAS[suelta];
    document.getElementById('guiaTitulo').textContent = titulo;
    document.getElementById('guiaHojas').innerHTML = '';
    document.getElementById('guiaContenido').innerHTML = avisoHojaHTML(suelta) + html();
    document.title = `${titulo} · Guía de consulta`;
    if (!sinScroll) window.scrollTo(0, 0);
    return;
  }
  if (hojas) {
    document.getElementById('guiaTitulo').textContent = 'Hojas para imprimir';
    document.getElementById('guiaHojas').innerHTML = '';
    document.getElementById('guiaContenido').innerHTML = htmlHojas();
    document.title = 'Hojas para imprimir · Guía de consulta';
    if (!sinScroll) window.scrollTo(0, 0);
    return;
  }
  if (tejidos) {
    document.getElementById('guiaTitulo').textContent = 'Tiempos de recuperación';
    document.getElementById('guiaHojas').innerHTML = Object.entries(HOJAS_TEJIDO)
      .map(([k, h]) => `<a href="#tejidos/${k}"${k === hoja ? ' aria-current="page"' : ''}>${h.corto}</a>`).join('');
    document.getElementById('guiaContenido').innerHTML = avisoHojaHTML(claveHoja(leerRuta())) + htmlTejidos(hoja);
    // El eje de tiempo, fijo justo debajo de las pestañas
    document.documentElement.style.setProperty('--guia-nav-alto', `${document.querySelector('.guia-nav').offsetHeight}px`);
    document.title = `Tiempos de recuperación · ${HOJAS_TEJIDO[hoja].titulo} · Guía de consulta`;
    if (!sinScroll) window.scrollTo(0, 0);
    return;
  }
  document.getElementById('guiaRegion').value = region;
  pintarNombreRegion();
  document.getElementById('guiaHojas').innerHTML = Object.entries(HOJAS_GUIA)
    .map(([k, n]) => `<a href="#${region}/${k}"${k === hoja ? ' aria-current="page"' : ''}>${n}</a>`).join('');
  document.getElementById('guiaContenido').innerHTML = avisoHojaHTML(claveHoja({ region, hoja })) + PINTAR[hoja](region);
  document.title = `${HOJAS_GUIA[hoja]} · ${nombreRegion(region)} · Guía de consulta`;
  const destino = elemento && document.getElementById(elemento);
  if (destino) {
    destino.classList.add('destacado');
    destino.querySelectorAll('details.razon').forEach(d => { d.open = true; });
    destino.scrollIntoView({ block: 'start' });
  } else window.scrollTo(0, 0);
}

async function iniciar() {
  const sel = document.getElementById('guiaRegion');
  sel.innerHTML = REGIONES.map(r => `<option value="${r}">${nombreRegion(r)}</option>`).join('');
  sel.addEventListener('change', () => { const r = leerRuta(); location.hash = `${sel.value}/${r.tejidos ? 'cribado' : r.hoja}`; });
  // Las fuentes se enlazan con el registro; si no carga, se pintan sin enlace
  try { REF = await registroReferencias(); } catch { REF = null; }
  if (HUELLA_PAPEL) HOJA_PAPEL = claveHoja(leerRuta());
  if (HUELLA_PAPEL || leerRuta().hojas) await cargarHuellas();
  window.addEventListener('hashchange', async () => {
    cerrarFicha({ sinFoco: true });
    if (leerRuta().hojas && !HUELLAS) await cargarHuellas();
    pintar();
  });
  pintar();
  const v = textoVersion();
  document.getElementById('guiaPie').innerHTML = `Contenido generado desde los datos de la app (versión ${esc(v)}). Si tu hoja impresa es más antigua, puede haber diferencias: manda lo que dice esta página. <a href="./">Abrir la app →</a> · <a href="#tejidos/blandos">Tiempos de recuperación de tejidos</a> · <a href="#condiciones">Condiciones especiales</a> · <a href="#farmacos">Fármacos</a> · <a href="#irritabilidad">Irritabilidad</a> · <a href="#hojas">Hojas para imprimir</a><br>«✨ IA» abre una búsqueda externa con el texto de la guía, nunca con datos del paciente; PhysiQ no revisa la respuesta.`;
  initAmpliarIA();
}
iniciar();
