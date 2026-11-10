// ============================================================
// PhysiQ-Assessment · PHASE4B.JS
// Confirmación de hipótesis — scoring bayesiano con LR
// ============================================================
import { HYPOTHESES, DOSIS_DERIVAR, HIP_POSQUIRURGICA } from './data.js';
import { state } from './state.js';
import { saveSession, showConfirmBanner, abrirPanelRazon, razonCitaHTML, cerrarRazonamiento, enlacesCalcular } from './app.js';
import {
  ETIQUETA_TRATADA, ETIQUETA_HIP_POSQ, ID_HIP_POSQ, esPosquirurgico, hipotesisConPosq,
  nombreHipPosq, cirugiaPayload, pautaHipPosq,
} from './lib/posquirurgico.js';
import { iaParrafoHTML, ctxTest, attrIA, atributosIA } from './ampliar-ia.js';
import {
  LR_POS_MIN, LR_NEG_MAX, parseProporcion, parseLR, lrEfectiva, testPuntua, PESO_TEST, pesoTest,
  enlacesAnatomia, anatomiaLineaHTML, anatomiaPanelHTML, citasTest, calcLRScore, etiquetaHipHTML,
  progresoTests, textoProgreso,
} from './lib/tests-4b.js';
export {
  LR_POS_MIN, LR_NEG_MAX, parseProporcion, parseLR, lrEfectiva, testPuntua, PESO_TEST, pesoTest,
  enlacesAnatomia, anatomiaLineaHTML, anatomiaPanelHTML, citasTest, calcLRScore, etiquetaHipHTML,
};
import { citasHTML, citasEnTexto, registroReferencias, enlaceCita } from './lib/citas.js';
import { dolorInespecifico } from './lib/region.js';
import { HM, hmActiva } from './lib/hipermovilidad.js';
import { DS, dsActiva } from './lib/disautonomia.js';
import { LES, lesDiagnosticado } from './lib/lupus.js';
import { MA, maActivo } from './lib/mastocitos.js';
import { AC, acActivo } from './lib/anticoagulado.js';
import { PK, pkDiagnosticado, estimuladorAviso } from './lib/parkinson.js';
import { ON, conMetastasis, conSecuela } from './lib/oncologico.js';
import { OP, opActivo } from './lib/osteoporosis.js';
import { emPosparto, lineaSupino, lineaGaenslen } from './lib/embarazo.js';
import { fraseAncla } from './lib/modo-guia.js';
import { TEXTOS_GUIA } from './data/guia.js';

// Hipótesis por id, incluida la posquirúrgica genérica (`pq1`), que no está en
// HYPOTHESES: su nombre lleva la intervención y su PROM es el de la región.
export function hipotesis(id) {
  if (id !== ID_HIP_POSQ) return HYPOTHESES[id];
  return {
    ...HIP_POSQUIRURGICA,
    region: state.region,
    name: nombreHipPosq(state.cirugia),
    prom: HIP_POSQUIRURGICA.promPorRegion[state.region] || '',
    dosis: '',
  };
}

// Hipótesis activas: con mecanismo Post-quirúrgico, `pq1` la primera y
// después las del árbol (state.activeHypotheses solo guarda las del árbol).
export function hipotesisActivas() {
  return hipotesisConPosq(state.mecanismo, state.activeHypotheses || []);
}

// «Ya diagnosticada y tratada» (docs/posquirurgico.md, decisión 5): una
// hipótesis «Derivar» (fractura, rotura, luxación, gota, mielopatía) que el
// médico ya ha diagnosticado y tratado. No se deriva en ningún resumen y sus
// tests no aplican: no puntúan, aunque lo contestado se conserva. Con
// mecanismo Post-quirúrgico la casilla está en todas las hipótesis del árbol
// («Tratada con la cirugía»: la artrosis tras la prótesis); si el mecanismo
// cambia, la marca de una que no es «Derivar» se conserva pero no cuenta.
function admiteTratada(hId) {
  const h = HYPOTHESES[hId];
  return !!h && (h.dosis === DOSIS_DERIVAR || esPosquirurgico(state.mecanismo));
}

export function esTratada(hId) {
  return admiteTratada(hId) && !!state.derivacionResuelta?.[hId];
}

function puntuar(hId) {
  if (esTratada(hId)) state.hypothesisScores[hId] = { totalLR: 1, label: ETIQUETA_TRATADA, colorClass: 'hyp-neutral' };
  else if (state.testResults[hId]) state.hypothesisScores[hId] = (({ totalLR, label, colorClass }) => ({ totalLR, label, colorClass }))(calcLRScore(HYPOTHESES[hId], state.testResults[hId]));
  else delete state.hypothesisScores[hId];
}

// Marca o desmarca y deja la puntuación coherente (sin tocar el DOM).
export function marcarTratada(hId, valor) {
  if (!admiteTratada(hId)) return;
  if (!state.derivacionResuelta) state.derivacionResuelta = {};
  if (valor) state.derivacionResuelta[hId] = true;
  else delete state.derivacionResuelta[hId];
  puntuar(hId);
}

// Tras cambiar el mecanismo: las marcas que dejan de contar (o vuelven a
// contar) recalculan su puntuación.
export function sincronizarTratadas() {
  Object.keys(state.derivacionResuelta || {}).forEach(hId => { if (HYPOTHESES[hId]) puntuar(hId); });
}

function casillaTratadaHTML(hId) {
  if (!admiteTratada(hId)) return '';
  const derivar = HYPOTHESES[hId].dosis === DOSIS_DERIVAR;
  return `<label class="dx-tratada">
      <input type="checkbox" ${esTratada(hId) ? 'checked' : ''} onchange="toggleDiagnosticoTratado('${hId}', this.checked)">
      <span>${derivar
        ? 'Ya diagnosticada y tratada<span class="dx-tratada-ayuda">El médico ya la ha diagnosticado y tratado (p. ej., operada): no se pide derivación y sus tests no aplican.</span>'
        : 'Tratada con la cirugía<span class="dx-tratada-ayuda">La operación ya la ha tratado (p. ej., artrosis tras una prótesis): sus tests no aplican y no se da su pauta.</span>'}</span>
    </label>`;
}
export { casillaTratadaHTML };

// Tarjeta de `pq1` en la 4b: sin tests (la cirugía es un hecho). El nombre y
// la pauta llevan texto libre de la tarjeta «Cirugía»: se escapan.
const esc = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function tarjetaPosqHTML(hyp) {
  return `
      <div class="hypothesis-header" onclick="toggleHypCard('${hyp.id}')">
        <span class="hyp-color-dot"></span>
        <span class="hyp-titulo"><span class="hyp-name" title="${esc(hyp.name)}">${esc(hyp.name)}</span>${metaHTML(hyp.id, null, ETIQUETA_HIP_POSQ)}</span>
        <span class="hyp-score" id="score_${hyp.id}">${etiquetaHipHTML(ETIQUETA_HIP_POSQ)}</span>
        <span class="hyp-chevron">▾</span>
      </div>
      <div class="hypothesis-body">
        <p style="font-size:0.8rem; color:var(--text2); margin-bottom:0.6rem;">La cirugía es un hecho: no hay tests que confirmar. Las demás hipótesis son lo que aporta la exploración.</p>
        <div class="exercise-box">${esc(pautaHipPosq(cirugiaPayload(state.mecanismo, state.cirugia)))}</div>
        <div style="margin-top:1.2rem; padding-top:1rem; border-top:1px solid var(--border);">
          <div style="font-size:0.72rem; color:var(--accent); font-family:'DM Mono',monospace; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>${enlacesCalcular(hyp.prom)}
        </div>
        ${REPLEGAR_HTML}
      </div>`;
}

// «Replegar ▴» al final de cada tarjeta abierta (usuario, 2026-11; como el de
// razon-plegable.js): pliega la tarjeta y vuelve a su cabecera
const REPLEGAR_HTML = `<button type="button" class="razon-replegar hyp-replegar" onclick="replegarHipotesis(this)">Replegar ▴</button>`;

// Cabecera plegada en móvil (usuario, 2026-11): bajo el nombre, la etiqueta de
// puntuación con el progreso como una parte más («🟢 Peso alto (LR× 5.9) · 2 de 5
// tests hechos»), que se parte tras cada «·» como .hyp-etq. En escritorio la etiqueta
// va a la derecha (.hyp-score) y bajo el nombre solo el progreso. «Sin evaluar» no se
// repite: el progreso («0 de 5 tests hechos») ya lo dice.
const MARCA_PROGRESO = '\u0001';
function metaHTML(hId, hyp, label) {
  const progreso = hyp ? progresoHTML(hId, hyp) : '';
  const txt = progreso ? progreso.replace(/<[^>]+>/g, '') : '';
  const completo = progreso.includes('hyp-progreso-completo');
  let movil = '';
  if (label && label !== 'Sin evaluar') {
    movil = etiquetaHipHTML(txt ? `${label} · ${MARCA_PROGRESO}` : label)
      .replace(`<span class="hyp-etq-parte">${MARCA_PROGRESO}</span>`,
        `<span class="hyp-etq-parte hyp-progreso${completo ? ' hyp-progreso-completo' : ''}">${txt}</span>`);
  } else if (progreso) movil = progreso.replace(/ id="[^"]*"/, '');
  return `<span class="hyp-meta" id="meta_${hId}"><span class="hyp-meta-movil">${movil}</span><span class="hyp-meta-esc">${progreso}</span></span>`;
}
// La misma etiqueta en la cabecera (derecha, escritorio) y en la línea de móvil
function pintarPuntuacion(hId, label) {
  const d = document.getElementById(`score_${hId}`);
  if (d) d.innerHTML = etiquetaHipHTML(label);
  const m = document.getElementById(`meta_${hId}`);
  if (m) m.outerHTML = metaHTML(hId, HYPOTHESES[hId], label);
}

// Cabecera plegada: «2 de 5 tests hechos» (pos o neg). Ni en `pq1` (sin tests)
// ni en una hipótesis «ya diagnosticada y tratada» (sus tests no aplican)
function progresoHTML(hId, hyp) {
  if (esTratada(hId)) return '';
  const p = progresoTests(hyp, state.testResults[hId]);
  const txt = textoProgreso(p);
  return txt ? `<span class="hyp-progreso${p.hechos === p.total ? ' hyp-progreso-completo' : ''}" id="prog_${hId}">${txt}</span>` : '';
}

export function buildHypothesisCards() {
  const container = document.getElementById('hypothesisCards');
  container.innerHTML = '';
  cerrarRazonamiento({ sinHistorial: true });

  const activas = hipotesisActivas();
  if (activas.length === 0) {
    const dolor = dolorInespecifico(state.region);
    const showCS = state.cronologia === 'Crónico (>3 meses)' && state.riesgoPsico === 'Alto';
    container.innerHTML = `
      <div class="alert alert-warning" style="flex-direction:column; align-items:flex-start; gap:10px;">
        <div style="display:flex; align-items:flex-start; gap:8px;">
          <span style="font-size:1.2rem; flex-shrink:0; line-height:1;">⚠️</span>
          <strong>El algoritmo no ha identificado un patrón dominante claro.</strong>
        </div>
        <p style="font-size:0.85rem; line-height:1.6; color:var(--text2);">
          Esto puede indicar una presentación atípica o un cuadro de dolor musculoesquelético inespecífico.
        </p>
        <div style="font-size:0.82rem; color:var(--text2); line-height:1.8;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--orange); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">Consideraciones</div>
          <div>· Revise si hay factores psicosociales relevantes (evaluados en Fase 1 y SINSS)</div>
          <div>· Valore iniciar con hipótesis de trabajo: <em>${dolor.charAt(0).toUpperCase() + dolor.slice(1)}</em></div>
          <div>· Regrese al Árbol de decisión y reconsidere las respuestas seleccionadas</div>
          ${showCS ? `<div style="margin-top:6px; padding-top:6px; border-top:1px solid var(--border2);">· Dado el perfil crónico y el riesgo psicosocial elevado, considere también <em>sensibilización central</em> como hipótesis complementaria</div>` : ''}
        </div>
      </div>`;
    return;
  }

  // Disautonomía (Fase P, docs/pots.md): una regla de técnica para todas las
  // hipótesis; no cambia ninguna LR
  if (dsActiva(state.disautonomia)) container.insertAdjacentHTML('beforeend', `<div class="ds-nota ds-nota-4b">🫀 ${citasEnTexto(DS.textos.tecnica4b)}</div>`);
  // Lupus (Fase P, docs/lupus.md): hueso, piel y osteonecrosis. Tampoco cambia
  // las LR. El riesgo de golpe del anticoagulado va en su propia línea
  if (lesDiagnosticado(state.lupus)) container.insertAdjacentHTML('beforeend', `<div class="ds-nota les-nota-4b">🦋 ${citasEnTexto(LES.textos.tecnica4b)}</div>`);
  // Trastorno mastocitario o anafilaxia (Fase P, docs/mastocitaria.md): roce,
  // presión, calor, frío y vibración. Una regla de técnica; no cambia las LR
  if (maActivo(state.mastocitos)) container.insertAdjacentHTML('beforeend', `<div class="ds-nota ma-nota-4b">💉 ${citasEnTexto(MA.textos.tecnica4b)}</div>`);
  // Anticoagulado o antiagregado (docs/anticoagulado.md, decisión 11): una línea
  // general, sin campo por test (ninguna fuente dice qué tests sangran). No cambia las LR
  if (acActivo(state.anticoagulado)) container.insertAdjacentHTML('beforeend', `<div class="ds-nota ac-nota-4b">🩸 ${citasEnTexto(AC.textos.tecnica4b)}</div>`);
  // Parkinson (docs/parkinson.md): rigidez, temblor y fase on/off; con el
  // estimulador en «Sí» o «No lo sabe», sin presión cerca de los cables
  // (decisión 21). Una regla de técnica; no cambia las LR
  if (pkDiagnosticado(state.parkinson)) {
    container.insertAdjacentHTML('beforeend', `<div class="ds-nota pk-nota-4b">🧠 ${citasEnTexto(PK.textos.tecnica4b)}${estimuladorAviso(state.parkinson) ? `<br>⚡ <strong>${citasEnTexto(PK.textos.cables4b)}</strong>` : ''}</div>`);
  }
  // Antecedente de cáncer (docs/antecedente-oncologico.md): con metástasis
  // óseas «Sí» o «No lo sabe», qué evitar en la zona (y sin thrust, decisión 10);
  // con neuropatía, comparar con la línea base. Reglas de técnica; no cambian las LR
  {
    const on = state.oncologico;
    const lineas = [conMetastasis(on) ? ON.textos.metastasis4b : '', conSecuela(on, 'neuropatia') ? ON.textos.neuropatia4b : ''].filter(Boolean);
    if (lineas.length) container.insertAdjacentHTML('beforeend', `<div class="ds-nota on-nota-4b">${lineas.map(l => `🎗 ${citasEnTexto(l)}`).join('<br>')}</div>`);
  }
  // Embarazo de 20 semanas o más (docs/embarazo-posparto.md, T1): una línea
  // para todos los tests boca arriba, encima de las hipótesis. No cambia las LR
  const supino = lineaSupino(state.embarazo);
  if (supino) container.insertAdjacentHTML('beforeend', `<div class="ds-nota em-nota-4b">🤰 ${citasEnTexto(supino)}</div>`);

  activas.forEach(hId => {
    const hyp = hipotesis(hId);
    if (!hyp) return;
    if (hyp.posquirurgica) {
      const card = document.createElement('div');
      card.className = 'hypothesis-card hyp-neutral';
      card.id = `hypcard_${hId}`;
      card.innerHTML = tarjetaPosqHTML(hyp);
      container.appendChild(card);
      return;
    }
    // Preservar resultados existentes al retroceder — solo inicializar si no existen
    if (!state.testResults[hId]) {
      state.testResults[hId] = {};
      hyp.tests.forEach((t, i) => { state.testResults[hId][i] = 'nd'; });
    }

    const tratada = esTratada(hId);
    const testsHtml = `${Object.keys(hyp.clusters || {}).map(cid => buildClusterBox(hyp, cid)).join('')}
        ${buildTestList(hId, hyp)}`;
    const card = document.createElement('div');
    // Al reconstruir (vuelta atrás, casilla «tratada») se conserva la puntuación
    const previa = tratada ? { label: ETIQUETA_TRATADA, colorClass: 'hyp-neutral' } : state.hypothesisScores[hId];
    card.className = `hypothesis-card ${previa?.colorClass || 'hyp-orange'}`;
    card.id = `hypcard_${hId}`;
    card.innerHTML = `
      <div class="hypothesis-header" onclick="toggleHypCard('${hId}')">
        <span class="hyp-color-dot"></span>
        <span class="hyp-titulo"><span class="hyp-name" title="${hyp.name}">${hyp.name}</span>${metaHTML(hId, hyp, previa?.label || 'Sin evaluar')}</span>
        <span class="hyp-score" id="score_${hId}">${etiquetaHipHTML(previa?.label || 'Sin evaluar')}</span>
        <span class="hyp-chevron">▾</span>
      </div>
      <div class="hypothesis-body">
        ${casillaTratadaHTML(hId)}
        ${tratada
          ? `<details class="dx-tratada-tests"><summary>Tests no aplicables: diagnóstico ya confirmado</summary>${testsHtml}</details>`
          : `<p style="font-size:0.8rem; color:var(--text3); margin-bottom:1rem;">Realice los tests e indique el resultado para calcular el peso diagnóstico.</p>
        ${testsHtml}`}
        <div style="margin-top:1.2rem; padding-top:1rem; border-top:1px solid var(--border);">
          <div style="font-size:0.72rem; color:var(--accent); font-family:'DM Mono',monospace; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>${enlacesCalcular(hyp.prom)}
        </div>
        ${REPLEGAR_HTML}
      </div>`;
    container.appendChild(card);
  });
}

// Modo breve: primero los tests que pueden mover la puntuación (testPuntua);
// los hallazgos sin LR aplicable y los pronósticos, plegados debajo. Solo
// cambia el orden visual: cada test conserva su índice en state.testResults.
function buildTestList(hId, hyp) {
  const items = hyp.tests.map((t, i) => ({ i, html: buildTestItem(hId, t, i), puntua: testPuntua(hyp, t) }));
  if (state.modo !== 'breve') return items.map(x => x.html).join('');
  const puntuan = items.filter(x => x.puntua), resto = items.filter(x => !x.puntua);
  return (puntuan.length ? puntuan.map(x => x.html).join('')
      : `<p style="font-size:0.8rem; color:var(--text3);">Ningún test de esta hipótesis tiene LR aplicable: todos son hallazgos clínicos.</p>`)
    + (resto.length ? `<details class="breve-hallazgos"${puntuan.length ? '' : ' open'}>
        <summary>+ ${resto.length} test${resto.length > 1 ? 's' : ''} sin LR aplicable (hallazgos, no puntúan)</summary>
        ${resto.map(x => x.html).join('')}
      </details>` : '');
}

function fmtLR(n) { return n >= 10 ? n.toFixed(0) : n.toFixed(n < 1 ? 2 : 1); }

function lrBadge(signo, valor, origen, util) {
  if (valor == null) return '';
  const txt = origen === 'calculada' ? `LR${signo} ≈${fmtLR(valor)} (calc.)` : `LR${signo}: ${fmtLR(valor)}`;
  const title = util ? 'Informativa: multiplica la puntuación' : 'No informativa: cuenta como hallazgo clínico';
  return `<span class="stat-badge ${util ? 'highlight' : 'lr-weak'}" title="${title}">${txt}</span>`;
}

export function buildClusterBox(hyp, cid) {
  const r = hyp.clusters[cid];
  const n = hyp.tests.filter(t => t.cluster === cid).length;
  const lr = lrEfectiva(r);
  const pos = lr.posUtil ? `≥${r.umbralPos} de ${n} positivos → LR+ ${fmtLR(lr.pos)}` : '';
  const neg = lr.negUtil && r.umbralNeg != null
    ? `${r.umbralNeg === 0 ? 'ninguno' : `≤${r.umbralNeg}`} de ${n} positivos (todos hechos) → LR− ${fmtLR(lr.neg)}` : '';
  return `<div class="cluster-box">
    <div class="cluster-title">🧩 ${r.nombre}</div>
    <div class="cluster-rule">${[pos, neg].filter(Boolean).join(' · ')}</div>
    <div class="cluster-rule">Los tests del cluster no puntúan por separado.</div>
    ${r.fuente ? `<div class="test-source">${citasHTML(r.fuente)}</div>` : ''}
  </div>`;
}

export function buildTestItem(hId, test, idx) {
  const hyp = HYPOTHESES[hId];
  const lr = lrEfectiva(test);
  const badges = [
    test.sn ? `<span class="stat-badge">Sn: ${test.sn}</span>` : '',
    test.sp ? `<span class="stat-badge">Sp: ${test.sp}</span>` : '',
    test.cluster ? '' : lrBadge('+', lr.pos, lr.origenPos, lr.posUtil),
    test.cluster ? '' : lrBadge('−', lr.neg, lr.origenNeg, lr.negUtil),
    test.tipo === 'pronostico' ? `<span class="stat-badge lr-weak">Pronóstico · no puntúa</span>` : '',
    test.cluster && hyp?.clusters?.[test.cluster] ? `<span class="stat-badge">🧩 ${hyp.clusters[test.cluster].nombre}</span>` : '',
  ].filter(Boolean);
  const statsHtml = badges.length ? `<div class="test-stats">${badges.join('')}</div>` : '';
  const r = test.razonamiento;
  const ampliar = r && (r.porque || r.detalle)
    ? `<button type="button" class="razon-ampliar" onclick="abrirRazonamientoTest(this,'${hId}',${idx})">Ampliar →</button>` : '';
  const porque = r?.porque ? `<details class="razon">
      <summary>ⓘ ¿Por qué?</summary>
      <div class="razon-cuerpo" data-ia-ctx="${attrIA(ctxTest(hyp?.region, test.name, hyp?.name))}"><p><span class="razon-etq">Por qué</span> ${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>
        ${r.fuentes?.length || ampliar ? `<div class="razon-pie">${r.fuentes?.length ? `— ${citasHTML(r.fuentes)}` : ''}${ampliar ? ` ${ampliar}` : ''}</div>` : ''}</div>
    </details>` : '';
  // Autor y año de cada cita; al tocarla, la cita entera y su enlace (lib/citas.js)
  // «Ampliar →» va en la línea de la fuente; con el «¿Por qué?» abierto, en su pie (CSS
  // esconde la otra copia), para que no parezca otra cosa que sigue a «Replegar ▴»
  const fuente = test.fuente || ampliar
    ? `<div class="test-source">${test.fuente ? citasHTML(test.fuente) : ''}${ampliar ? `<span class="ampliar-fuente">${ampliar}</span>` : ''}</div>` : '';

  const savedResult = (state.testResults[hId] && state.testResults[hId][idx]) || 'nd';
  return `<div class="test-item">
    <div class="test-name">${test.name}</div>
    ${statsHtml}
    <div class="test-peso">${hyp ? pesoTest(hyp, test, idx) : ''}</div>
    ${test.laxitud && hmActiva(state.hipermovilidad) ? `<div class="hm-aviso-test">🧬 ${HM.textos.laxitud}</div>` : ''}
    ${test.cargaOsea && opActivo(state.osteoporosis) ? avisoCargaOseaHTML(test) : ''}
    ${test.gaenslen && emPosparto(state.embarazo) ? `<div class="hm-aviso-test em-aviso-test">🤱 ${citasEnTexto(lineaGaenslen(state.embarazo))}</div>` : ''}
    ${test.criterio ? `<div class="test-criterion" ${atributosIA(ctxTest(hyp?.region, test.name, hyp?.name))} data-ia-parrafo>${citasEnTexto(test.criterio)}${iaParrafoHTML()}</div>` : ''}
    ${porque}
    ${fuente}
    ${anatomiaLineaHTML(test)}
    ${state.registro === 'guia' ? `<div class="test-ancla">🎙 ${TEXTOS_GUIA.anclaTest}: ${fraseAncla(test.name, state.lado)}</div>` : ''}
    <div class="test-result-btns">
      <button class="test-result-btn pos ${savedResult==='pos'?'selected':''}" onclick="setTestResult('${hId}',${idx},'pos',this)">✓ Positivo</button>
      <button class="test-result-btn neg ${savedResult==='neg'?'selected':''}" onclick="setTestResult('${hId}',${idx},'neg',this)">✗ Negativo</button>
      <button class="test-result-btn nd ${savedResult==='nd'?'selected':''}" onclick="setTestResult('${hId}',${idx},'nd',this)">Sin datos</button>
    </div>
  </div>`;
}

export async function abrirRazonamientoTest(btn, hId, idx) {
  const hyp = HYPOTHESES[hId];
  const test = hyp?.tests[idx];
  const r = test?.razonamiento;
  if (!r) return;
  const REF = await registroReferencias();
  const parrafos = (r.detalle || '').split('\n\n').filter(Boolean).map(p => `<p>${citasEnTexto(p)}${iaParrafoHTML()}</p>`).join('');
  const citas = citasTest(test).map(c => enlaceCita(c, REF));
  abrirPanelRazon({
    btn, kicker: 'Test · por qué y evidencia', titulo: test.name,
    ia: ctxTest(hyp.region, test.name, hyp.name),
    html: `
    ${r.porque ? `<div class="razon-seccion"><div class="razon-etq">Por qué</div><p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p></div>` : ''}
    <div class="razon-seccion"><div class="razon-etq">Cuánto pesa</div><p>${pesoTest(hyp, test, idx)}</p></div>
    ${parrafos ? `<div class="razon-seccion"><div class="razon-etq">En detalle</div>${parrafos}</div>` : ''}
    ${anatomiaPanelHTML(test)}
    ${citas.length ? `<div class="razon-seccion razon-fuentes"><div class="razon-etq">Fuentes</div>
      <ul>${citas.map(razonCitaHTML).join('')}</ul></div>` : ''}`,
  });
}

let _hypObserver = null;
let _activeHypId = null;

export function toggleHypCard(hId) {
  const card = document.getElementById(`hypcard_${hId}`);
  const isOpen = card.classList.contains('open');

  if (isOpen) {
    const header = card.querySelector('.hypothesis-header');
    const navbarH = window.innerWidth <= 768 ? 94 : 60;
    const patientBar = document.querySelector('.patient-sticky');
    const patientBarH = patientBar ? patientBar.offsetHeight : 0;
    const headerTop = header.getBoundingClientRect().top;
    if (headerTop < navbarH + patientBarH) {
      const top = headerTop + window.scrollY - navbarH - patientBarH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => {
      card.classList.remove('open');
      teardownHypObserver();
    }, 200);
  } else {
    // Close all other open cards first
    document.querySelectorAll('.hypothesis-card.open').forEach(c => {
      if (c !== card) c.classList.remove('open');
    });
    teardownHypObserver();
    card.classList.add('open');
    setupHypObserver(hId);
  }
}

export function setupHypObserver(hId) {
  teardownHypObserver();
  _activeHypId = hId;
  const card = document.getElementById(`hypcard_${hId}`);
  if (!card) return;
  const header = card.querySelector('.hypothesis-header');
  pintarBandaHip(card);

  const patientBarEl = document.querySelector('.patient-sticky');
  const patientBarH = patientBarEl ? patientBarEl.offsetHeight : 0;
  const hypNavH = (window.innerWidth <= 768 ? 94 : 64) + patientBarH;
  _hypObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    const banner = document.getElementById('hypContextBanner');
    if (!entry.isIntersecting && entry.boundingClientRect.top < hypNavH) {
      if (patientBarEl) banner.style.top = patientBarEl.getBoundingClientRect().bottom + 'px';
      banner.classList.add('visible');
    } else {
      banner.style.top = '';
      banner.classList.remove('visible');
    }
  }, { threshold: 0, rootMargin: `-${hypNavH}px 0px 0px 0px` });

  _hypObserver.observe(header);
}

export function refreshHypBanner(hId) {
  const card = document.getElementById(`hypcard_${hId}`);
  if (card) pintarBandaHip(card);
}

// Banda fija (móvil): punto, nombre y, debajo, la misma etiqueta de puntuación
// que la cabecera (etiquetaHipHTML), que se actualiza al marcar cada test
function pintarBandaHip(card) {
  const dot = card.querySelector('.hyp-color-dot');
  const bannerDot = document.getElementById('hypBannerDot');
  const bannerName = document.getElementById('hypBannerName');
  const bannerScore = document.getElementById('hypBannerScore');
  if (bannerDot && dot) bannerDot.style.background = window.getComputedStyle(dot).backgroundColor;
  if (bannerName) bannerName.textContent = card.querySelector('.hyp-name')?.textContent || '';
  if (bannerScore) bannerScore.innerHTML = card.querySelector('.hyp-score')?.innerHTML || '';
}

export function replegarHipotesis(btn) {
  const card = btn.closest('.hypothesis-card');
  if (!card) return;
  const header = card.querySelector('.hypothesis-header');
  // Barras fijas de arriba sin la propia banda, que se va al plegar
  const top = [...document.querySelectorAll('.app-header, .mobile-phase-bar')]
    .filter(el => getComputedStyle(el).position === 'fixed')
    .reduce((m, el) => Math.max(m, el.getBoundingClientRect().bottom), 0)
    + (document.querySelector('.patient-sticky')?.offsetHeight || 0);
  // Posición absoluta calculada antes de plegar: lo de encima no cambia
  const destino = window.scrollY + header.getBoundingClientRect().top - top - 8;
  card.classList.remove('open');
  teardownHypObserver();
  requestAnimationFrame(() => {
    if (header.getBoundingClientRect().top < top) window.scrollTo({ top: destino, behavior: 'instant' });
  });
}

export function teardownHypObserver() {
  if (_hypObserver) { _hypObserver.disconnect(); _hypObserver = null; }
  _activeHypId = null;
  const banner = document.getElementById('hypContextBanner');
  if (banner) banner.classList.remove('visible');
}

export function restoreHypObserver() {
  // Find any open hypothesis card and restore its observer
  const openCard = document.querySelector('.hypothesis-card.open');
  if (!openCard) return;
  const hId = openCard.id.replace('hypcard_', '');
  setupHypObserver(hId);
}

export function scrollToActiveHypHeader() {
  if (!_activeHypId) return;
  const card = document.getElementById(`hypcard_${_activeHypId}`);
  const header = card.querySelector('.hypothesis-header');
  const navbarH = window.innerWidth <= 768 ? 94 : 60;
  const patientBar = document.querySelector('.patient-sticky');
  const patientBarH = patientBar ? patientBar.offsetHeight : 0;
  const top = header.getBoundingClientRect().top + window.scrollY - navbarH - patientBarH - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function clearAllTests() {
  showConfirmBanner(
    '⊘ Limpiar resultados de tests',
    'Se resetearán todos los resultados a "Sin datos". Las hipótesis identificadas se mantendrán.',
    'Limpiar',
    () => {
      state.testResults = {};
      state.hypothesisScores = {};
      state.activeHypotheses.forEach(hId => {
        const hyp = HYPOTHESES[hId];
        if (!hyp) return;
        state.testResults[hId] = {};
        hyp.tests.forEach((t, i) => { state.testResults[hId][i] = 'nd'; });
        if (esTratada(hId)) marcarTratada(hId, true);   // sigue «diagnosticada y tratada»
      });
      // Re-renderizar y restaurar color naranja inicial
      buildHypothesisCards();
      // Resetear color de todas las tarjetas a naranja (sin puntuación)
      state.activeHypotheses.filter(hId => !esTratada(hId)).forEach(hId => {
        const card = document.getElementById('hypcard_' + hId);
        if (card) {
          card.className = 'hypothesis-card hyp-orange';
        }
        pintarPuntuacion(hId, 'Sin evaluar');
      });
      saveSession();
    }
  );
}

export function setTestResult(hId, idx, result, btn) {
  const row = btn.closest('.test-result-btns');
  row.querySelectorAll('.test-result-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.testResults[hId][idx] = result;
  // Preserve open state before and after score recalculation
  const card = document.getElementById(`hypcard_${hId}`);
  const wasOpen = card && card.classList.contains('open');
  recalcHypScore(hId);
  if (wasOpen) {
    const cardAfter = document.getElementById(`hypcard_${hId}`);
    if (cardAfter) cardAfter.classList.add('open');
  }
  // Refresh context banner if this hypothesis is being observed
  if (_activeHypId === hId) refreshHypBanner(hId);
  saveSession();
}


export function recalcHypScore(hId) {
  const hyp = HYPOTHESES[hId];
  const results = state.testResults[hId];
  if (!hyp || !results) return;
  const { totalLR, label, colorClass } = esTratada(hId)
    ? { totalLR: 1, label: ETIQUETA_TRATADA, colorClass: 'hyp-neutral' }
    : calcLRScore(hyp, results);
  state.hypothesisScores[hId] = { totalLR, label, colorClass };
  const card = document.getElementById(`hypcard_${hId}`);
  card.className = `hypothesis-card ${colorClass}`;
  pintarPuntuacion(hId, label);   // también el progreso de la cabecera
}

// Osteoporosis (Fase P, docs/osteoporosis.md, decisión 7): línea de técnica en
// los tests que cargan el hueso (`cargaOsea`; 'costilla' en los de la 1.ª
// costilla), con su porqué plegado. No cambia ninguna LR.
function avisoCargaOseaHTML(test) {
  const t = OP.textos;
  return `<div class="hm-aviso-test op-aviso-test">🦴 ${citasEnTexto(t.tecnica4b)}${test.cargaOsea === 'costilla' ? ` ${citasEnTexto(t.tecnica4bCostilla)}` : ''}
      <details class="op-razon"><summary>¿Por qué?</summary>${citasEnTexto(t.tecnica4bPorque)}</details></div>`;
}

// Exposed for inline onclick attributes (index.html static markup + this
// file's own dynamically-generated HTML) — those resolve only against the
// global scope, never a module's private scope.
window.toggleHypCard = toggleHypCard;
window.clearAllTests = clearAllTests;
window.setTestResult = setTestResult;
window.abrirRazonamientoTest = abrirRazonamientoTest;
window.scrollToActiveHypHeader = scrollToActiveHypHeader;
window.replegarHipotesis = replegarHipotesis;
