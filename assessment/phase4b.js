// ============================================================
// PhysiQ-Assessment · PHASE4B.JS
// Confirmación de hipótesis — scoring bayesiano con LR
// ============================================================
import { HYPOTHESES } from './data.js';
import { state } from './state.js';
import { saveSession, showConfirmBanner } from './app.js';

export function buildHypothesisCards() {
  const container = document.getElementById('hypothesisCards');
  container.innerHTML = '';

  if (state.activeHypotheses.length === 0) {
    const regionLabel = state.region ? state.region.charAt(0).toUpperCase() + state.region.slice(1) : 'la región';
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
          <div>· Valore iniciar con hipótesis de trabajo: <em>Dolor de ${regionLabel} inespecífico</em></div>
          <div>· Regrese al Algoritmo CIF y reconsidere las respuestas seleccionadas</div>
          ${showCS ? `<div style="margin-top:6px; padding-top:6px; border-top:1px solid var(--border2);">· Dado el perfil crónico y el riesgo psicosocial elevado, considere también <em>sensibilización central</em> como hipótesis complementaria</div>` : ''}
        </div>
      </div>`;
    return;
  }

  state.activeHypotheses.forEach(hId => {
    const hyp = HYPOTHESES[hId];
    if (!hyp) return;
    // Preservar resultados existentes al retroceder — solo inicializar si no existen
    if (!state.testResults[hId]) {
      state.testResults[hId] = {};
      hyp.tests.forEach((t, i) => { state.testResults[hId][i] = 'nd'; });
    }

    const card = document.createElement('div');
    card.className = 'hypothesis-card hyp-orange';
    card.id = `hypcard_${hId}`;
    card.innerHTML = `
      <div class="hypothesis-header" onclick="toggleHypCard('${hId}')">
        <span class="hyp-color-dot"></span>
        <span class="hyp-name" title="${hyp.name}">${hyp.name}</span>
        <span class="hyp-score" id="score_${hId}">Sin evaluar</span>
        <span class="hyp-chevron">▾</span>
      </div>
      <div class="hypothesis-body">
        <p style="font-size:0.8rem; color:var(--text3); margin-bottom:1rem;">Realice los tests e indique el resultado para calcular el peso diagnóstico.</p>
        ${Object.keys(hyp.clusters || {}).map(cid => buildClusterBox(hyp, cid)).join('')}
        ${hyp.tests.map((t, i) => buildTestItem(hId, t, i)).join('')}
        <div style="margin-top:1.2rem; padding-top:1rem; border-top:1px solid var(--border);">
          <div style="font-size:0.72rem; color:var(--accent); font-family:'DM Mono',monospace; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>
        </div>
      </div>`;
    container.appendChild(card);
  });
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
    ${r.fuente ? `<div class="test-source">${r.fuente}</div>` : ''}
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
  if (!test.cluster && test.tipo !== 'pronostico' && lr.pos == null && lr.neg == null) {
    badges.push(`<span class="stat-badge no-data">Sin LR publicada · cuenta como hallazgo clínico</span>`);
  }
  const statsHtml = `<div class="test-stats">${badges.join('')}</div>`;

  const savedResult = (state.testResults[hId] && state.testResults[hId][idx]) || 'nd';
  return `<div class="test-item">
    <div class="test-name">${test.name}</div>
    ${statsHtml}
    <div class="test-criterion">${test.criterio}</div>
    ${test.fuente ? `<div class="test-source">${test.fuente}</div>` : ''}
    <div class="test-result-btns">
      <button class="test-result-btn pos ${savedResult==='pos'?'selected':''}" onclick="setTestResult('${hId}',${idx},'pos',this)">✓ Positivo</button>
      <button class="test-result-btn neg ${savedResult==='neg'?'selected':''}" onclick="setTestResult('${hId}',${idx},'neg',this)">✗ Negativo</button>
      <button class="test-result-btn nd ${savedResult==='nd'?'selected':''}" onclick="setTestResult('${hId}',${idx},'nd',this)">Sin datos</button>
    </div>
  </div>`;
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
  const dot = card.querySelector('.hyp-color-dot');
  const name = card.querySelector('.hyp-name');
  const dotBg = window.getComputedStyle(dot).backgroundColor;

  const bannerDot = document.getElementById('hypBannerDot');
  const bannerName = document.getElementById('hypBannerName');
  if (bannerDot) bannerDot.style.background = dotBg;
  if (bannerName) bannerName.textContent = name.textContent;

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
  if (!card) return;
  const dot = card.querySelector('.hyp-color-dot');
  const name = card.querySelector('.hyp-name');
  const dotBg = window.getComputedStyle(dot).backgroundColor;
  const bannerDot = document.getElementById('hypBannerDot');
  const bannerName = document.getElementById('hypBannerName');
  if (bannerDot) bannerDot.style.background = dotBg;
  if (bannerName) bannerName.textContent = name.textContent;
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
      });
      // Re-renderizar y restaurar color naranja inicial
      buildHypothesisCards();
      // Resetear color de todas las tarjetas a naranja (sin puntuación)
      state.activeHypotheses.forEach(hId => {
        const card = document.getElementById('hypcard_' + hId);
        if (card) {
          card.className = 'hypothesis-card hyp-orange';
        }
        const score = document.getElementById('score_' + hId);
        if (score) score.textContent = 'Sin evaluar';
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

// ─── Puntuación LR ────────────────────────────────────────────
// Reglas (ver CLAUDE.md, "Puntuación de la fase 4b"):
// 1. LR publicada (`lr_pos`/`lr_neg`) si existe; si no, calculada a partir de
//    `sn`/`sp` cuando ambos son un número único (LR+ = S/(1−E), LR− = (1−S)/E).
//    Un rango de S/E («52–70%», «~40%», «>90%») no se calcula. Un rango de LR
//    («2.9–4.9») se toma por su extremo más cercano a 1 (conservador).
// 2. Cada dirección cuenta por separado: la LR+ solo multiplica si es ≥ 2 y la
//    LR− solo si es ≤ 0,5. Si no, el resultado es un «hallazgo clínico»:
//    no multiplica (LR = 1) y se cuenta aparte como compatible / no compatible.
// 3. Los tests con `cluster: id` no multiplican solos: multiplica la regla
//    `hyp.clusters[id]` (umbralPos/lr_pos, umbralNeg/lr_neg).
// 4. `tipo: 'pronostico'` no entra en la puntuación diagnóstica.
// 5. Sin ninguna LR aplicable, la etiqueta no habla de peso diagnóstico.
// 6. `absorbe: [idx]` — si este test aporta LR, los tests listados (que forman
//    parte de él, p. ej. el SLR dentro de RAPIDH) dejan de multiplicar.
export const LR_POS_MIN = 2;
export const LR_NEG_MAX = 0.5;

// '92%' → 0.92 · '0.91' → 0.91 · rango o texto → null
export function parseProporcion(v) {
  if (v == null) return null;
  const m = String(v).trim().match(/^(\d+(?:[.,]\d+)?)\s*%?$/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(',', '.'));
  const p = n > 1 ? n / 100 : n;
  return p >= 0 && p <= 1 ? p : null;
}

// '3.7' → 3.7 · '2.9–4.9' → 2.9 (pos) / 4.9 (neg) · texto que no es LR → null
export function parseLR(v, direccion) {
  if (v == null) return null;
  const m = String(v).trim().match(/^(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?(?:\s*\([^)]*\))?$/);
  if (!m) return null;
  const a = parseFloat(m[1].replace(',', '.'));
  const b = m[2] != null ? parseFloat(m[2].replace(',', '.')) : a;
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const n = direccion === 'pos' ? lo : hi;
  return n > 0 ? n : null;
}

// LR efectiva de un test (o de una regla de cluster) en ambas direcciones.
// origen: 'publicada' | 'calculada' | null
export function lrEfectiva(t) {
  const sn = parseProporcion(t.sn), sp = parseProporcion(t.sp);
  const calcPos = sn != null && sp != null && sp < 1 ? sn / (1 - sp) : null;
  const calcNeg = sn != null && sp != null && sp > 0 ? (1 - sn) / sp : null;
  const pubPos = parseLR(t.lr_pos, 'pos'), pubNeg = parseLR(t.lr_neg, 'neg');
  const pos = pubPos ?? calcPos, neg = pubNeg ?? calcNeg;
  return {
    pos, neg,
    origenPos: pubPos != null ? 'publicada' : calcPos != null ? 'calculada' : null,
    origenNeg: pubNeg != null ? 'publicada' : calcNeg != null ? 'calculada' : null,
    posUtil: pos != null && pos >= LR_POS_MIN,
    negUtil: neg != null && neg <= LR_NEG_MAX,
  };
}

export function calcLRScore(hyp, results) {
  let totalLR = 1.0, evaluatedCount = 0, informativos = 0, posInformativos = 0, hasHighLR = false;
  let hallazgos = 0, hallazgosPos = 0;
  const aportes = {};   // idx → LR que ha multiplicado (para `absorbe`)

  const multiplicar = (lr, esPos) => {
    totalLR *= lr; informativos++;
    if (esPos) { posInformativos++; if (lr >= 5) hasHighLR = true; }
  };

  // Tests sueltos
  hyp.tests.forEach((test, i) => {
    const res = results[i];
    if (!res || res === 'nd') return;
    evaluatedCount++;
    if (test.tipo === 'pronostico' || test.cluster) return;
    const lr = lrEfectiva(test);
    if (res === 'pos' && lr.posUtil) aportes[i] = { lr: lr.pos, esPos: true };
    else if (res === 'neg' && lr.negUtil) aportes[i] = { lr: lr.neg, esPos: false };
    else { hallazgos++; if (res === 'pos') hallazgosPos++; }
  });

  // `absorbe`: un test compuesto que aporta LR anula la de sus componentes
  hyp.tests.forEach((test, i) => {
    if (!aportes[i] || !test.absorbe) return;
    test.absorbe.forEach(j => {
      if (!aportes[j]) return;
      delete aportes[j];
      hallazgos++; if (results[j] === 'pos') hallazgosPos++;
    });
  });
  Object.values(aportes).forEach(a => multiplicar(a.lr, a.esPos));

  // Clusters
  Object.entries(hyp.clusters || {}).forEach(([cid, regla]) => {
    const idxs = hyp.tests.map((t, i) => t.cluster === cid ? i : -1).filter(i => i >= 0);
    const pos = idxs.filter(i => results[i] === 'pos').length;
    const todos = idxs.every(i => results[i] === 'pos' || results[i] === 'neg');
    const lr = lrEfectiva(regla);
    if (pos >= regla.umbralPos && lr.posUtil) multiplicar(lr.pos, true);
    else if (todos && regla.umbralNeg != null && pos <= regla.umbralNeg && lr.negUtil) multiplicar(lr.neg, false);
  });

  const hallazgosTxt = hallazgos > 0 ? ` · ${hallazgosPos}/${hallazgos} hallazgos compatibles` : '';
  let label, colorClass;
  if (evaluatedCount === 0) {
    label = 'Sin evaluar'; colorClass = 'hyp-orange';
  } else if (informativos === 0) {
    label = `⚪ Sin LR aplicable${hallazgosTxt}`; colorClass = 'hyp-neutral';
  } else if (totalLR >= 5 || hasHighLR) {
    label = `🟢 Peso alto (LR× ${totalLR.toFixed(1)})${hallazgosTxt}`; colorClass = 'hyp-green';
  } else if (totalLR >= 2 || posInformativos > 0) {
    label = `🟠 Peso moderado (LR× ${totalLR.toFixed(1)})${hallazgosTxt}`; colorClass = 'hyp-orange';
  } else {
    label = `🔴 Peso bajo (LR× ${totalLR.toFixed(1)})${hallazgosTxt}`; colorClass = 'hyp-red';
  }
  return { totalLR, label, colorClass, evaluatedCount, informativos, hallazgos, hallazgosPos };
}

export function recalcHypScore(hId) {
  const hyp = HYPOTHESES[hId];
  const results = state.testResults[hId];
  if (!hyp || !results) return;
  const { totalLR, label, colorClass } = calcLRScore(hyp, results);
  state.hypothesisScores[hId] = { totalLR, label, colorClass };
  const card = document.getElementById(`hypcard_${hId}`);
  card.className = `hypothesis-card ${colorClass}`;
  document.getElementById(`score_${hId}`).textContent = label;
}

// Exposed for inline onclick attributes (index.html static markup + this
// file's own dynamically-generated HTML) — those resolve only against the
// global scope, never a module's private scope.
window.toggleHypCard = toggleHypCard;
window.clearAllTests = clearAllTests;
window.setTestResult = setTestResult;
window.scrollToActiveHypHeader = scrollToActiveHypHeader;
