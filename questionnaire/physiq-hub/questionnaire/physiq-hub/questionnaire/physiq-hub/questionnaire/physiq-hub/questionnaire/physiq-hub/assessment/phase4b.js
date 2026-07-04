// ============================================================
// PhysiQ-Assessment · PHASE4B.JS
// Confirmación de hipótesis — scoring bayesiano con LR
// ============================================================

function buildHypothesisCards() {
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
        ${hyp.tests.map((t, i) => buildTestItem(hId, t, i)).join('')}
        <div style="margin-top:1.2rem; padding-top:1rem; border-top:1px solid var(--border);">
          <div style="font-size:0.72rem; color:var(--accent); font-family:'DM Mono',monospace; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

function buildTestItem(hId, test, idx) {
  const hasStats = test.sn || test.sp || test.lr_pos || test.lr_neg;
  const statsHtml = hasStats
    ? `<div class="test-stats">
        ${test.sn ? `<span class="stat-badge highlight">Sn: ${test.sn}</span>` : ''}
        ${test.sp ? `<span class="stat-badge highlight">Sp: ${test.sp}</span>` : ''}
        ${test.lr_pos ? `<span class="stat-badge highlight">LR+: ${test.lr_pos}</span>` : ''}
        ${test.lr_neg ? `<span class="stat-badge highlight">LR-: ${test.lr_neg}</span>` : ''}
      </div>`
    : `<div class="test-stats"><span class="stat-badge no-data">⚠ Datos de fiabilidad limitados/ausentes en literatura actual</span></div>`;

  const savedResult = (state.testResults[hId] && state.testResults[hId][idx]) || 'nd';
  return `<div class="test-item">
    <div class="test-name">${test.name}</div>
    ${statsHtml}
    <div class="test-criterion">${test.criterio}</div>
    <div class="test-result-btns">
      <button class="test-result-btn pos ${savedResult==='pos'?'selected':''}" onclick="setTestResult('${hId}',${idx},'pos',this)">✓ Positivo</button>
      <button class="test-result-btn neg ${savedResult==='neg'?'selected':''}" onclick="setTestResult('${hId}',${idx},'neg',this)">✗ Negativo</button>
      <button class="test-result-btn nd ${savedResult==='nd'?'selected':''}" onclick="setTestResult('${hId}',${idx},'nd',this)">Sin datos</button>
    </div>
  </div>`;
}

let _hypObserver = null;
let _activeHypId = null;

function toggleHypCard(hId) {
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

function setupHypObserver(hId) {
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

function refreshHypBanner(hId) {
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

function teardownHypObserver() {
  if (_hypObserver) { _hypObserver.disconnect(); _hypObserver = null; }
  _activeHypId = null;
  const banner = document.getElementById('hypContextBanner');
  if (banner) banner.classList.remove('visible');
}

function restoreHypObserver() {
  // Find any open hypothesis card and restore its observer
  const openCard = document.querySelector('.hypothesis-card.open');
  if (!openCard) return;
  const hId = openCard.id.replace('hypcard_', '');
  setupHypObserver(hId);
}

function scrollToActiveHypHeader() {
  if (!_activeHypId) return;
  const card = document.getElementById(`hypcard_${_activeHypId}`);
  const header = card.querySelector('.hypothesis-header');
  const navbarH = window.innerWidth <= 768 ? 94 : 60;
  const patientBar = document.querySelector('.patient-sticky');
  const patientBarH = patientBar ? patientBar.offsetHeight : 0;
  const top = header.getBoundingClientRect().top + window.scrollY - navbarH - patientBarH - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

function clearAllTests() {
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

function setTestResult(hId, idx, result, btn) {
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

function calcLRScore(hyp, results) {
  let totalLR = 1.0, evaluatedCount = 0, positiveCount = 0, hasHighLR = false;
  hyp.tests.forEach((test, i) => {
    const res = results[i];
    if (res === 'nd') return;
    evaluatedCount++;
    if (res === 'pos') {
      positiveCount++;
      const lr = parseFloat(test.lr_pos) || 1.5;
      totalLR *= lr;
      if (lr >= 5) hasHighLR = true;
    } else if (res === 'neg') {
      const lr = parseFloat(test.lr_neg) || 0.5;
      totalLR *= lr;
    }
  });
  let label, colorClass;
  if (evaluatedCount === 0) {
    label = 'Sin evaluar'; colorClass = 'hyp-orange';
  } else if (totalLR >= 5 || (hasHighLR && positiveCount > 0)) {
    label = `🟢 Peso alto (LR× ${totalLR.toFixed(1)})`; colorClass = 'hyp-green';
  } else if (totalLR >= 2 || positiveCount > 0) {
    label = `🟠 Peso moderado (LR× ${totalLR.toFixed(1)})`; colorClass = 'hyp-orange';
  } else {
    label = `🔴 Peso bajo (LR× ${totalLR.toFixed(1)})`; colorClass = 'hyp-red';
  }
  return { totalLR, label, colorClass, evaluatedCount };
}

function recalcHypScore(hId) {
  const hyp = HYPOTHESES[hId];
  const results = state.testResults[hId];
  if (!hyp || !results) return;
  const { totalLR, label, colorClass } = calcLRScore(hyp, results);
  state.hypothesisScores[hId] = { totalLR, label, colorClass };
  const card = document.getElementById(`hypcard_${hId}`);
  card.className = `hypothesis-card ${colorClass}`;
  document.getElementById(`score_${hId}`).textContent = label;
}
