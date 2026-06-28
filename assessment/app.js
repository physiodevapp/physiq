// ============================================================
// PhysiQ-Assessment · APP.js
// Lógica principal de la aplicación
// ============================================================

// ─── STATE ───────────────────────────────────────────────────
const state = {
  currentPhase: 1,
  // Navegación
  maxVisitedIdx: 0,       // índice más alto visitado en la sesión
  regionChanged: false,   // región cambiada sin haber rehecho el árbol
  treeModified: false,    // árbol modificado sin haber rehecho 4b
  // Fase 1
  patient: '',
  motivoConsulta: '',
  mecanismo: '',
  cronologia: '',
  banderasRojas: { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' },
  riesgoPsico: '',
  psico_miedo: '', psico_autoef: '', psico_emocional: '',
  // Fase 2
  region: '',
  sistemicoAnswers: {},
  sistemicoAlerta: false,
  // Fase 3
  severidad: null,
  irritabilidad: { dolor: 'Baja (≤3/10)', reposo: 'Ausente', movimiento: 'Al final del rango con SP', discapacidad: 'Mínima', tolerancia: 'Alta' },
  irritabilidadNivel: 'Baja',
  naturaleza: '',
  estadio: '',
  estabilidad: '',
  signoComparable: '',
  // Fase 4
  activeHypotheses: [],
  treeAnswers: {},
  currentStep: null,
  stepsCompleted: [],
  // Fase 4b
  testResults: {},
  hypothesisScores: {},
  // Fase 5
  resultsBuilt: false,
  // Notas del Plan
  planNotes: {
    variableControl: '',
    ventanaRecuperacion: '',
    anclajeHabito: ''
  },
  rom: null   // payload importado desde PhysiQ-Motion vía ?rom=
};

// ─── HISTORY / BACK-BUTTON NAVIGATION ────────────────────────
let _handlingPopState = false;
let _historyDepth = 0;       // número de pushState realizados sobre el replaceState inicial
let _pendingBackNav = null;  // { phase, idx } mientras history.go() asíncrono está en vuelo
let _sessionGen     = 0;    // incremented on clear; stale writeSession .then() calls detect mismatch
let _sessionCleared = false; // true after a clear; blocks new writes until new session data appears

const _sessionCh = new BroadcastChannel('physiq-session');
_sessionCh.onmessage = ({ data }) => {
  if (data.type === 'SESSION_CLEAR') {
    _sessionGen++; _sessionCleared = true;
    state.patient = '';
    const _patEl = document.getElementById('patientName');
    if (_patEl) _patEl.value = '';
    updateSessionChip(null);
    clearSession(); _softResetApp(); goToPhase(1);
    return;
  }
  if (data.type === 'SESSION_RESET') {
    if (data._relay) _softResetApp();
    return;
  }
  if (data.type === 'SESSION_ASSESSMENT_STATE') {
    if (data._relay && data.assessmentState) _applyRemoteAssessmentState(data.assessmentState);
    return;
  }
  if (data.type !== 'SESSION_PATIENT') return;
  const el = document.getElementById('patientName');
  if (!el || document.activeElement === el) return;
  el.value = data.patient || '';
  state.patient = data.patient || '';
  if (!data.patient) return;
  updateSession({ patient: data.patient }).then(session => {
    if (session) updateSessionChip(session);
  });
};

window.addEventListener('popstate', e => {
  if (_pendingBackNav) {
    // history.go() de limpieza de stack aterrizó; reemplazar y actualizar profundidad
    const { phase: p, idx: i } = _pendingBackNav;
    _pendingBackNav = null;
    history.replaceState({ phase: p }, '');
    _historyDepth = i;
    return;
  }
  if (!e.state || e.state.phase === undefined) return;
  // Swipe-back nativo: sincronizar _historyDepth con la posición real del stack
  const _pm = { 1:0, 2:1, 3:2, 4:3, '4b':4, 5:5 };
  const naturalIdx = _pm[e.state.phase];
  if (naturalIdx !== undefined) _historyDepth = naturalIdx;
  _handlingPopState = true;
  goToPhase(e.state.phase);
  _handlingPopState = false;
});


// ─── NAVIGATION ──────────────────────────────────────────────
function navStepClick(n) {
  const phaseMap = { 1:0, 2:1, 3:2, 4:3, '4b':4, 5:5 };
  const navIds = ['nav1','nav2','nav3','nav4','nav4b','nav5'];
  const idx = phaseMap[n];
  const navEl = document.getElementById(navIds[idx]);
  if (!navEl) return;
  // Bloqueado si no fue visitado
  if (!navEl.classList.contains('completed') && !navEl.classList.contains('active')) return;
  // Bloqueado si está invalidado
  if (navEl.classList.contains('invalidated')) {
    // Mostrar tooltip informativo breve
    showNavTooltip(navEl, state.regionChanged && idx >= 3
      ? 'Región modificada — complete el Algoritmo CIF primero'
      : 'Árbol modificado — complete la Confirmación de Hipótesis primero');
    return;
  }
  // No navegar si ya estamos en esa fase
  if (navEl.classList.contains('active')) return;
  goToPhase(n);
}

function showNavTooltip(el, msg) {
  const existing = document.getElementById('navTooltip');
  if (existing) existing.remove();
  const tip = document.createElement('div');
  tip.id = 'navTooltip';
  tip.style.cssText = `
    position:fixed; z-index:500;
    background:var(--surface3); border:1px solid var(--orange);
    color:var(--orange); font-size:0.72rem; font-family:'Outfit',sans-serif;
    padding:6px 12px; border-radius:6px;
    white-space:normal; max-width:min(280px, calc(100vw - 24px));
    word-break:break-word; line-height:1.4;
    box-shadow:0 4px 12px rgba(0,0,0,0.4);
    pointer-events:none;
  `;
  tip.textContent = msg;
  document.body.appendChild(tip);
  const rect = el.getBoundingClientRect();
  const tipW = tip.offsetWidth;
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - tipW - 12));
  tip.style.top = (rect.bottom + 6) + 'px';
  tip.style.left = left + 'px';
  setTimeout(() => tip.remove(), 2800);
}

function goToPhase(n) {
  const phases = ['phase1','phase2','phase3','phase4','phase4b','phase5'];
  const navIds = ['nav1','nav2','nav3','nav4','nav4b','nav5'];
  const phaseMap = { 1:0, 2:1, 3:2, 4:3, '4b':4, 5:5 };

  // Save current state before leaving
  if (state.currentPhase === 1) collectPhase1();
  if (state.currentPhase === 3) collectPhase3();

  const idx = phaseMap[n];
  const prevIdx = phaseMap[state.currentPhase] ?? 0;

  // Actualizar índice máximo visitado
  if (idx > state.maxVisitedIdx) state.maxVisitedIdx = idx;

  // Resetear flags de invalidación al avanzar por botones normales
  // (si llegamos a fase 4 el árbol ya se restaura — regionChanged resuelto)
  if (n === 4 || n === '4b' || n === 5) state.regionChanged = false;
  const _4bNeedsRebuild = (n === '4b') && state.treeModified;
  if (n === '4b' || n === 5) state.treeModified = false;

  phases.forEach(p => document.getElementById(p).classList.remove('active'));
  paintNav(idx);

  document.getElementById(phases[idx]).classList.add('active');
  state.currentPhase = n;
  updateMobilePhaseBar(n);
  // Clean up observers when leaving phases
  if (typeof teardownHypObserver === 'function') teardownHypObserver();
  if (typeof teardownSisObserver === 'function') teardownSisObserver();
  // Restore observers when entering phases with open accordions
  if (n === 2 && typeof restoreSisObserver === 'function') setTimeout(restoreSisObserver, 50);
  if (n === '4b' && typeof restoreHypObserver === 'function') setTimeout(restoreHypObserver, 50);

  // Update progress
  const pct = [0, 20, 40, 60, 80, 100];
  document.getElementById('progressBar').style.width = pct[idx] + '%';
  document.getElementById('phaseIndicator').textContent = `FASE ${n === '4b' ? '4b' : n} / 5`;

  // Phase-specific init
  if (n === 4) initCIFTree();
  if (n === '4b') {
    const hypContainer = document.getElementById('hypothesisCards');
    if (!hypContainer || hypContainer.children.length === 0 || _4bNeedsRebuild) {
      if (hypContainer) hypContainer.innerHTML = '';
      buildHypothesisCards();
    }
    // Observer is restored via restoreHypObserver called above
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!_handlingPopState) {
    const _phaseOrder = [1, 2, 3, 4, '4b', 5];
    if (idx > prevIdx) {
      // Push one entry per skipped phase so swipe-back steps through each one
      for (let i = prevIdx + 1; i <= idx; i++) {
        history.pushState({ phase: _phaseOrder[i] }, '');
      }
      _historyDepth += (idx - prevIdx);
    } else if (idx < prevIdx) {
      // Retroceder el puntero del stack para que swipe-back llegue al hub,
      // no a entradas intermedias que quedaron de la navegación forward anterior
      const stepsBack = _historyDepth - idx;
      if (stepsBack > 0) {
        _pendingBackNav = { phase: n, idx };
        history.go(-stepsBack);
      } else {
        history.replaceState({ phase: n }, '');
        _historyDepth = idx;
      }
    }
  }
  const _phaseLabels = [1, 2, 3, 4, '4b', 5];
  _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_PARTIAL', phase: _phaseLabels[state.maxVisitedIdx], region: state.region || null });
  saveSession();
}

// Pinta el estado de cada paso del nav según maxVisitedIdx y flags de invalidación
function paintNav(activeIdx) {
  const navIds = ['nav1','nav2','nav3','nav4','nav4b','nav5'];
  // Índices que quedan invalidados según los flags activos
  // regionChanged → invalida 4(idx3), 4b(idx4), 5(idx5)
  // treeModified  → invalida 4b(idx4), 5(idx5)
  const invalidated = new Set();
  if (state.regionChanged) { invalidated.add(3); invalidated.add(4); invalidated.add(5); }
  if (state.treeModified)  { invalidated.add(4); invalidated.add(5); }

  navIds.forEach((navId, i) => {
    const el = document.getElementById(navId);
    el.classList.remove('active', 'completed', 'invalidated');

    if (i === activeIdx) {
      el.classList.add('active');
    } else if (i <= state.maxVisitedIdx) {
      if (invalidated.has(i)) {
        el.classList.add('completed', 'invalidated'); // visitado pero datos desactualizados
      } else {
        el.classList.add('completed');
      }
    }
    // Si i > maxVisitedIdx: no visitado — sin clase extra
  });
}

function _softResetApp() {
  closePhaseSheet();
  state.currentPhase = 1;
  state.maxVisitedIdx = 0;
  state.regionChanged = false;
  state.treeModified = false;
  state.motivoConsulta = '';
  state.mecanismo = '';
  state.cronologia = '';
  state.banderasRojas = { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' };
  state.riesgoPsico = '';
  state.psico_miedo = '';
  state.psico_autoef = '';
  state.psico_emocional = '';
  state.region = '';
  state.sistemicoAnswers = {};
  state.sistemicoAlerta = false;
  state.activeHypotheses = [];
  state.treeAnswers = {};
  state.currentStep = null;
  state.stepsCompleted = [];
  state.testResults = {};
  state.hypothesisScores = {};
  state.resultsBuilt = false;
  state.planNotes = { variableControl: '', ventanaRecuperacion: '', anclajeHabito: '' };

  // Phase 1 DOM
  const mConsulta = document.getElementById('motivoConsulta');
  if (mConsulta) mConsulta.value = '';
  document.querySelectorAll('#phase1 .option-btn').forEach(b => b.classList.remove('selected'));
  ['banderaAlert', 'psicoToolSuggest', 'psicoAltoQuestions', 'psicoRecomendacion'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Phase 2 DOM
  document.querySelectorAll('.region-card').forEach(c => c.classList.remove('selected'));
  ['sistemaTabs', 'sistemaPanels'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  const sistemicoAlert = document.getElementById('sistemicoAlert');
  if (sistemicoAlert) { sistemicoAlert.style.display = 'none'; sistemicoAlert.innerHTML = ''; }
  const btnSinss = document.getElementById('btnContinuarSinss');
  if (btnSinss) btnSinss.disabled = true;

  // Phase 3 DOM (resetPhase3UI handles both state and DOM)
  resetPhase3UI();

  // Phase 4 DOM
  ['treeContainer', 'treeAlert'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  // Phase 4b DOM
  const hypCards = document.getElementById('hypothesisCards');
  if (hypCards) hypCards.innerHTML = '';

  // Phase 5 DOM
  const resultsContent = document.getElementById('resultsContent');
  if (resultsContent) resultsContent.innerHTML = '';

  // Navigate to phase 1
  document.querySelectorAll('.phase-container').forEach(p => p.classList.remove('active'));
  document.getElementById('phase1').classList.add('active');
  paintNav(0);
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('phaseIndicator').textContent = 'FASE 1 / 5';
  updateMobilePhaseBar(1);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Collapse history stack so swipe-back exits the app instead of re-entering a cleared phase
  if (_historyDepth > 0) {
    _pendingBackNav = { phase: 1, idx: 0 };
    history.go(-_historyDepth);
    _historyDepth = 0;
  } else {
    history.replaceState({ phase: 1 }, '');
  }
  updateResetBtnVisibility();
}

function resetApp() {
  showConfirmBanner(
    '↺ Reiniciar valoración completa',
    'Se perderán los datos clínicos de la valoración. El nombre del paciente se conservará.',
    'Reiniciar',
    () => {
      _softResetApp(); goToPhase(1);
      _sessionCh.postMessage({ type: 'SESSION_RESET', patient: state.patient || '' });
    }
  );
}

// ─── PHASE 1 HELPERS ─────────────────────────────────────────
function selectOption(groupId, btn, value) {
  const group = document.getElementById(groupId);
  if (group) {
    group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  }
  btn.classList.add('selected');
  state[groupId] = value;
  if (groupId === 'psico_miedo' || groupId === 'psico_autoef' || groupId === 'psico_emocional') {
    updatePsicoRecomendacion();
  }
  saveSession();
}

function selectSQ(btn, id, value) {
  const parent = btn.closest('.sq-btns');
  parent.querySelectorAll('.sq-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.banderasRojas[id] = value;
  checkBanderasRojas();
  saveSession();
}

function checkBanderasRojas() {
  const hasRed = Object.values(state.banderasRojas).includes('SI');
  document.getElementById('banderaAlert').style.display = hasRed ? 'block' : 'none';
}

function selectPsico(btn, value) {
  document.querySelectorAll('#riesgoPsico .option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.riesgoPsico = value;

  const suggest = document.getElementById('psicoToolSuggest');
  const altoQ = document.getElementById('psicoAltoQuestions');

  // Will update after region is known — show generic for now
  suggest.style.display = 'block';
  suggest.innerHTML = `Herramienta recomendada: <strong>Örebro (OMPSQ)</strong> — validada para cualquier región MSK. Si la región es lumbar, también puede usar <strong>STarT Back</strong> (desarrollada y validada principalmente para columna lumbar).`;

  altoQ.style.display = value === 'Alto' ? 'block' : 'none';
  saveSession();
}

function updatePsicoRecomendacion() {
  const rec = document.getElementById('psicoRecomendacion');
  const { psico_miedo, psico_autoef, psico_emocional } = state;
  const tools = [];
  if (psico_miedo === 'Sí' || psico_miedo === 'Dudoso') tools.push('FABQ (Cuestionario de Creencias de Miedo-Evitación), TSK-11 (Escala de Kinesiofobia de Tampa)');
  if (psico_autoef === 'Sí' || psico_autoef === 'Dudoso') tools.push('PCS (Escala de Catastrofización del Dolor)');
  if (psico_emocional === 'Sí' || psico_emocional === 'Dudoso') tools.push('PHQ-2 → PHQ-9 (Cuestionario de Salud del Paciente)');

  if (tools.length > 0) {
    rec.style.display = 'block';
    rec.innerHTML = `<strong>Cuestionarios unidimensionales sugeridos:</strong><br>${tools.join('<br>')}`;
  } else {
    rec.style.display = 'none';
  }
}

function collectPhase1() {
  state.motivoConsulta = document.getElementById('motivoConsulta').value;
}

// ─── PHASE 2 HELPERS ─────────────────────────────────────────
function selectRegion(regionId, card) {
  // If changing region after having visited phase 3+, ask for confirmation
  if (state.region && state.region !== regionId && state.maxVisitedIdx >= 2) {
    showConfirmBanner(
      'Cambiar región de valoración',
      'Al cambiar de región se perderá todo el progreso de las fases SINSS, Algoritmo CIF y Confirmación de Hipótesis. ¿Desea continuar?',
      'Cambiar región',
      () => applyRegionChange(regionId, card)
    );
    return;
  }
  applyRegionChange(regionId, card);
}

function resetPhase3UI() {
  // Reset state
  state.naturaleza = '';
  state.estadio = '';
  state.estabilidad = '';
  state.signoComparable = '';
  state.severidad = null;
  state.irritabilidad = { dolor: 'Baja (≤3/10)', reposo: 'Ausente', movimiento: 'Al final del rango con SP', discapacidad: 'Mínima', tolerancia: 'Alta' };
  state.irritabilidadNivel = null;

  // Reset option-btn selections in phase 3
  document.querySelectorAll('#phase3 .option-btn').forEach(b => b.classList.remove('selected'));

  // Reset NRS buttons
  document.querySelectorAll('.nrs-btn').forEach(b => b.classList.remove('selected'));
  const nrsLabel = document.getElementById('nrsLabel');
  if (nrsLabel) nrsLabel.textContent = '— Sin seleccionar —';

  // Reset signo comparable input
  const sc = document.getElementById('signoComparable');
  if (sc) sc.value = '';

  // Reset irritab buttons to defaults
  // Desktop
  document.querySelectorAll('.irritab-select').forEach(sel => {
    sel.querySelectorAll('.irritab-btn').forEach((b, i) => {
      b.classList.toggle('selected', i === 0);
    });
  });
  // Mobile cards
  document.querySelectorAll('.irritab-card-btns').forEach(card => {
    card.querySelectorAll('.irritab-btn').forEach((b, i) => {
      b.classList.toggle('selected', i === 0);
    });
  });

  // Recalculate irritability display
  calcIrritabilidad();
}

function applyRegionChange(regionId, card) {
  document.querySelectorAll('.region-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  // Enable continue button
  const btn = document.getElementById('btnContinuarSinss');
  if (btn) btn.disabled = false;
  // Reset all data from phase 3 onwards when region changes
  if (state.region && state.region !== regionId) {
    state.activeHypotheses = [];
    state.treeAnswers = {};
    state.stepsCompleted = [];
    state.testResults = {};
    state.hypothesisScores = {};
    state.maxVisitedIdx = 1;
    state.regionChanged = false;
    state.treeModified = false;
    // Reset Phase 3 UI and state
    resetPhase3UI();
    // Reset Phase 4 tree DOM
    const treeContainer = document.getElementById('treeContainer');
    if (treeContainer) treeContainer.innerHTML = '';
    const treeAlert = document.getElementById('treeAlert');
    if (treeAlert) treeAlert.innerHTML = '';
    // Reset Phase 4b hypothesis cards
    const hypCards = document.getElementById('hypothesisCards');
    if (hypCards) hypCards.innerHTML = '';
    // Disable phase 4b button
    const btnConfirm = document.getElementById('btnGoConfirm');
    if (btnConfirm) btnConfirm.disabled = true;
    paintNav(1);
  }
  state.region = regionId;
  buildSistemicoQuestions(regionId);
  saveSession();
}

function buildSistemicoQuestions(regionId) {
  const data = SYSTEMIC_SCREENING[regionId];
  if (!data) return;

  const wrap = document.getElementById('sistemicoQuestions');
  const tabsContainer = document.getElementById('sistemaTabs');
  const panelsContainer = document.getElementById('sistemaPanels');
  const title = document.getElementById('sistemicoTitle');

  title.textContent = `Cribado Sistémico — ${data.label}`;
  tabsContainer.innerHTML = '';
  panelsContainer.innerHTML = '';
  state.sistemicoAnswers = {};

  // Initialize all answers to NO
  data.sistemas.forEach(sis => {
    sis.preguntas.forEach(q => { state.sistemicoAnswers[q.id] = 'NO'; });
  });

  // Build accordion container (mobile)
  let accordion = document.getElementById('sistemaAccordion');
  if (!accordion) {
    accordion = document.createElement('div');
    accordion.className = 'sistema-accordion';
    accordion.id = 'sistemaAccordion';
    // Insert accordion before the panels container
    panelsContainer.parentNode.insertBefore(accordion, panelsContainer);
  }
  accordion.innerHTML = '';

  // Build tabs + panels + accordion rows
  data.sistemas.forEach((sis, idx) => {
    // ── DESKTOP: Tab
    const tab = document.createElement('button');
    tab.className = 'sistema-tab' + (idx === 0 ? ' active' : '');
    tab.id = `tab_${sis.id}`;
    tab.innerHTML = `<span class="tab-dot"></span>${sis.icon} ${sis.nombre}`;
    tab.onclick = () => activeSistemaTab(sis.id, data.sistemas);
    tabsContainer.appendChild(tab);

    // Build shared panel HTML
    const panelHTML = buildSistemaHTML(sis);

    // ── DESKTOP: Panel
    const panel = document.createElement('div');
    panel.className = 'sistema-panel card' + (idx === 0 ? ' active' : '');
    panel.id = `panel_${sis.id}`;
    panel.style.marginTop = '0';
    panel.innerHTML = panelHTML;
    panelsContainer.appendChild(panel);

    // ── MOBILE: Accordion row
    const row = document.createElement('div');
    row.className = 'sistema-accordion-row';
    row.id = `acc_${sis.id}`;
    row.innerHTML = `
      <div class="sistema-accordion-header" onclick="toggleAccordionRow('${sis.id}', '${data.sistemas.map(s=>s.id).join(',')}')">
        <span class="sistema-accordion-icon">${sis.icon}</span>
        <span class="sistema-accordion-name">${sis.nombre}</span>
        <span class="sistema-accordion-alert"></span>
        <span class="sistema-accordion-chevron">▶</span>
      </div>
      <div class="sistema-accordion-body">
        <div class="card" style="margin:0; border:none; border-radius:0; background:var(--surface);">
          ${panelHTML}
        </div>
      </div>`;
    accordion.appendChild(row);
  });

  // Update psico tool suggestion based on region
  if (state.riesgoPsico) {
    const suggest = document.getElementById('psicoToolSuggest');
    if (suggest) {
      if (regionId === 'lumbar') {
        suggest.innerHTML = `Herramienta recomendada para columna lumbar: <strong>STarT Back Screening Tool (SBT)</strong> — desarrollada y validada específicamente para dolor lumbar. También puede usarse <strong>Örebro (OMPSQ)</strong>.`;
      } else {
        suggest.innerHTML = `Herramienta recomendada para esta región: <strong>Örebro (OMPSQ)</strong> — validada para dolor musculoesquelético en general. El STarT Back fue desarrollado principalmente para columna lumbar.`;
      }
    }
  }

  wrap.style.display = 'block';
  updateSistemicoAlert();
}

function buildSistemaHTML(sis) {
  let html = `
    <div class="sistema-panel-header">
      <span class="sistema-icon">${sis.icon}</span>
      <span class="sistema-label">${sis.nombre}</span>
    </div>`;

  // Flags
  const hasRed = sis.banderasRojas && sis.banderasRojas.length > 0;
  const hasYellow = sis.banderasAmarillas && sis.banderasAmarillas.length > 0;
  if (hasRed || hasYellow) {
    html += `<div class="flags-grid">`;
    if (hasRed) {
      html += `<div class="flags-box red-box">
        <div class="flags-col-title red">🚩 Banderas Rojas</div>
        ${sis.banderasRojas.map(f => `<div class="flag-item"><span class="flag-dot-red">●</span>${f}</div>`).join('')}
      </div>`;
    }
    if (hasYellow) {
      html += `<div class="flags-box yellow-box">
        <div class="flags-col-title yellow">🟡 Banderas Amarillas</div>
        ${sis.banderasAmarillas.map(f => `<div class="flag-item"><span class="flag-dot-yellow">●</span>${f}</div>`).join('')}
      </div>`;
    }
    html += `</div>`;
  }

  // Screening questions
  html += `<div class="screening-section-title">❓ Preguntas de Cribado</div>`;
  sis.preguntas.forEach((q, qi) => {
    const s1Badge = q.s1 ? `<span class="sq2-s1-badge">Screening rápido</span>` : '';
    html += `
      <div class="sq2${q.alerta ? ' alerta-high' : ''}" id="sq2_${q.id}">
        <div class="sq2-badge${q.alerta ? ' alerta' : ''}">${qi + 1}</div>
        <span class="sq2-text">${q.text}${s1Badge}</span>
        <div class="sq-btns">
          <button class="sq-btn si" onclick="selectSistQ(this,'${q.id}','SI',${q.alerta},'${sis.id}')">SÍ</button>
          <button class="sq-btn no selected" onclick="selectSistQ(this,'${q.id}','NO',${q.alerta},'${sis.id}')">NO</button>
        </div>
      </div>`;
  });

  // Referred pain zones
  if (sis.zonasDolor && sis.zonasDolor.length > 0) {
    html += `<div class="screening-section-title" style="margin-top:1rem;">📍 Zonas de Dolor Referido</div>
      <div class="referred-zones">
        ${sis.zonasDolor.map(z => `
          <div class="referred-zone-item">
            <span class="referred-zone-label">${z.zona}</span>
            <span>${z.desc}</span>
          </div>`).join('')}
      </div>`;
  }

  // Impact collapsible
  const hasImpact = (sis.impactoDescanso?.length || 0) + (sis.impactoEjercicio?.length || 0) > 0;
  if (hasImpact) {
    const impId = `imp_${sis.id}`;
    html += `
      <div class="impact-toggle" id="toggle_${impId}" onclick="toggleImpact(this)">
        <span class="impact-chevron">▶</span>
        <span>Impacto en Descanso y Tolerancia al Ejercicio</span>
      </div>
      <div class="impact-body" id="${impId}">`;
    if (sis.impactoDescanso?.length) {
      html += `<div class="impact-col-title">🌙 Descanso y Sueño</div>`;
      html += sis.impactoDescanso.map(i => `<div class="impact-item">${i}</div>`).join('');
    }
    if (sis.impactoEjercicio?.length) {
      html += `<div class="impact-col-title">🏃 Tolerancia al Ejercicio</div>`;
      html += sis.impactoEjercicio.map(i => `<div class="impact-item">${i}</div>`).join('');
    }
    html += `</div>`;
  }
  return html;
}

function activeSistemaTab(sisId, sistemas) {
  sistemas.forEach(s => {
    const tab = document.getElementById(`tab_${s.id}`);
    const panel = document.getElementById(`panel_${s.id}`);
    if (tab) tab.classList.toggle('active', s.id === sisId);
    if (panel) panel.classList.toggle('active', s.id === sisId);
  });
}

let _sisObserver = null;
let _activeSisId = null;

function toggleAccordionRow(sisId, sisIdsStr) {
  const sisIds = sisIdsStr.split(',');
  const clickedRow = document.getElementById(`acc_${sisId}`);
  const isOpen = clickedRow.classList.contains('open');

  if (isOpen) {
    const header = clickedRow.querySelector('.sistema-accordion-header');
    const navbarH = window.innerWidth <= 768 ? 94 : 60;
    const patientBar = document.querySelector('.patient-sticky');
    const patientBarH = patientBar ? patientBar.offsetHeight : 0;
    const headerTop = header.getBoundingClientRect().top;
    if (headerTop < navbarH + patientBarH) {
      const top = headerTop + window.scrollY - navbarH - patientBarH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTimeout(() => {
      clickedRow.classList.remove('open');
      teardownSisObserver();
    }, 200);
  } else {
    // Close all others
    sisIds.forEach(id => {
      const row = document.getElementById(`acc_${id}`);
      if (row && row !== clickedRow) row.classList.remove('open');
    });
    teardownSisObserver();
    clickedRow.classList.add('open');
    setupSisObserver(sisId, clickedRow);
  }
}

function setupSisObserver(sisId, row) {
  _activeSisId = sisId;
  const header = row.querySelector('.sistema-accordion-header');
  const icon = header.querySelector('.sistema-accordion-icon')?.textContent || '📋';
  const name = header.querySelector('.sistema-accordion-name')?.textContent || '';

  document.getElementById('sisBannerIcon').textContent = icon;
  document.getElementById('sisBannerName').textContent = name;

  const patientBarEl = document.querySelector('.patient-sticky');
  const patientBarH = patientBarEl ? patientBarEl.offsetHeight : 0;
  const sisNavH = (window.innerWidth <= 768 ? 94 : 64) + patientBarH;
  _sisObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    const banner = document.getElementById('sisContextBanner');
    if (!entry.isIntersecting && entry.boundingClientRect.top < sisNavH) {
      if (patientBarEl) banner.style.top = patientBarEl.getBoundingClientRect().bottom + 'px';
      banner.classList.add('visible');
    } else {
      banner.style.top = '';
      banner.classList.remove('visible');
    }
  }, { threshold: 0, rootMargin: `-${sisNavH}px 0px 0px 0px` });

  _sisObserver.observe(header);
}

function teardownSisObserver() {
  if (_sisObserver) { _sisObserver.disconnect(); _sisObserver = null; }
  _activeSisId = null;
  const banner = document.getElementById('sisContextBanner');
  if (banner) banner.classList.remove('visible');
}

function restoreSisObserver() {
  // Find any open accordion row and restore its observer
  const openRow = document.querySelector('.sistema-accordion-row.open');
  if (!openRow) return;
  const sisId = openRow.id.replace('acc_', '');
  setupSisObserver(sisId, openRow);
}

function scrollToActiveSisHeader() {
  if (!_activeSisId) return;
  const row = document.getElementById(`acc_${_activeSisId}`);
  if (!row) return;
  const header = row.querySelector('.sistema-accordion-header');
  const navbarH = window.innerWidth <= 768 ? 94 : 60;
  const patientBar = document.querySelector('.patient-sticky');
  const patientBarH = patientBar ? patientBar.offsetHeight : 0;
  const top = header.getBoundingClientRect().top + window.scrollY - navbarH - patientBarH - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

function toggleImpact(toggleEl) {
  const body = toggleEl.nextElementSibling;
  if (!body) return;
  const isOpen = body.classList.contains('open');
  body.classList.toggle('open', !isOpen);
  toggleEl.classList.toggle('open', !isOpen);
}

function selectSistQ(btn, id, value, isAlerta, sisId) {
  const parent = btn.closest('.sq-btns');
  parent.querySelectorAll('.sq-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.sistemicoAnswers[id] = value;

  // Visual feedback on the question row
  const row = document.getElementById(`sq2_${id}`);
  if (row) {
    row.classList.toggle('answered-si', value === 'SI');
    row.classList.toggle('answered-no', value === 'NO');
  }

  // Update tab and accordion alert indicators for this system
  const tab = document.getElementById(`tab_${sisId}`);
  const accRow = document.getElementById(`acc_${sisId}`);
  const data = SYSTEMIC_SCREENING[state.region];
  const sis = data?.sistemas.find(s => s.id === sisId);
  if (sis) {
    const hasAlert = sis.preguntas.some(q => state.sistemicoAnswers[q.id] === 'SI');
    if (tab) tab.classList.toggle('has-alert', hasAlert);
    if (accRow) accRow.classList.toggle('has-alert', hasAlert);
  }

  updateSistemicoAlert();
  saveSession();
}

function updateSistemicoAlert() {
  const alertDiv = document.getElementById('sistemicoAlert');
  const hasPositive = Object.values(state.sistemicoAnswers).includes('SI');
  state.sistemicoAlerta = hasPositive;
  if (hasPositive) {
    alertDiv.style.display = 'block';
    alertDiv.innerHTML = `<div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <div><strong>Respuesta afirmativa detectada.</strong> Evalúe en el contexto clínico completo. La presencia de una sola bandera sistémica no exige derivación automática (excepto emergencias claras). Considere un enfoque de "watchful waiting" y monitorice la evolución. Puede continuar con la evaluación mecánica.</div>
    </div>`;
  } else {
    alertDiv.style.display = 'none';
  }
}

// ─── PHASE 3 HELPERS ─────────────────────────────────────────


function selectNRS(btn, val) {
  document.querySelectorAll('.nrs-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.severidad = val;
  const label = document.getElementById('nrsLabel');
  if (label) label.textContent = `${val}/10 — ${NRS_LABELS[val]}`;
  saveSession();
}

function initNRS() {
  document.querySelectorAll('.nrs-btn').forEach((btn, i) => {
    btn.classList.add(NRS_CLASSES[i < 5 ? i : i + 1] || NRS_CLASSES[10]);
  });
  // Assign correct nrs class based on data value
  document.querySelectorAll('.nrs-btn').forEach(btn => {
    const val = parseInt(btn.textContent.trim());
    if (!isNaN(val)) {
      btn.classList.add(`nrs-${val}`);
    }
  });
}

function selectIrritab(key, btn, value) {
  const row = btn.closest('td');
  row.querySelectorAll('.irritab-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.irritabilidad[key] = value;
  syncIrritabMobile(key, value);
  calcIrritabilidad();
  saveSession();
}

function selectIrritabSync(key, btn, value) {
  const card = btn.closest('.irritab-card');
  card.querySelectorAll('.irritab-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.irritabilidad[key] = value;
  syncIrritabDesktop(key, value);
  calcIrritabilidad();
  saveSession();
}

// Sincronizar selección de desktop → mobile
function syncIrritabMobile(key, value) {
  const cards = document.querySelectorAll('.irritab-card');
  const keyOrder = ['dolor','reposo','movimiento','discapacidad','tolerancia'];
  const idx = keyOrder.indexOf(key);
  if (idx === -1 || !cards[idx]) return;
  cards[idx].querySelectorAll('.irritab-btn').forEach(b => {
    b.classList.toggle('selected', b.onclick && b.onclick.toString().includes(value) ||
      b.getAttribute('onclick') && b.getAttribute('onclick').includes(value));
  });
}

// Sincronizar selección de mobile → desktop
function syncIrritabDesktop(key, value) {
  const rows = document.querySelectorAll('.irritab-table tr');
  rows.forEach(row => {
    const btns = row.querySelectorAll('.irritab-btn');
    btns.forEach(b => {
      if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(key)) {
        b.classList.toggle('selected', b.getAttribute('onclick').includes(value));
      }
    });
  });
}

function calcIrritabilidad() {
  const { dolor, reposo, movimiento, discapacidad, tolerancia } = state.irritabilidad;
  let score = 0;
  const opts = { dolor: ['Baja (≤3/10)','Media (4-6/10)','Alta (≥7/10)'],
                 reposo: ['Ausente','Intermitente','Presente'],
                 movimiento: ['Al final del rango con SP','Al final del rango','Antes del final del rango'],
                 discapacidad: ['Mínima','Moderada','Alta'],
                 tolerancia: ['Alta','Moderada','Baja'] };
  for (const [k, v] of Object.entries(state.irritabilidad)) {
    score += opts[k].indexOf(v);
  }
  let nivel = 'Baja', color = 'var(--green)', emoji = '🟢';
  if (score >= 5 && score <= 9) { nivel = 'Moderada'; color = 'var(--orange)'; emoji = '🟠'; }
  if (score >= 10) { nivel = 'Alta'; color = 'var(--red)'; emoji = '🔴'; }
  state.irritabilidadNivel = nivel;
  const div = document.getElementById('irritabilidadResumen');
  div.innerHTML = `<div class="alert alert-info" style="border-color:${color}33; background:${color}11;">
    <span class="alert-icon">${emoji}</span>
    <span><strong>Irritabilidad ${nivel}</strong> — ${nivel === 'Baja' ? 'Exploración completa posible. Puede aplicar técnicas más agresivas con seguridad.' : nivel === 'Moderada' ? 'Proceder con precaución. Evitar técnicas de alta intensidad. Valorar la respuesta post-sesión.' : 'Evaluación muy cuidadosa. Priorizar técnicas pasivas de baja intensidad. Sesión breve.'}</span>
  </div>`;
}

function collectPhase3() {
  state.severidad = state.severidad ?? 0;
  state.signoComparable = document.getElementById('signoComparable').value;
}

// ─── PHASE 5 — RESULTS ───────────────────────────────────────
const BR_LABELS = {
  br1: 'Sudor nocturno / Pérdida de peso inexplicada',
  br2: 'Trauma mayor reciente',
  br3: 'Déficit neurológico progresivo',
  br4: 'Dolor no mecánico (no cambia con postura ni movimiento)'
};

function getSistemicoAffirmativeTexts() {
  const affirmativeIds = Object.entries(state.sistemicoAnswers)
    .filter(([, v]) => v === 'SI')
    .map(([id]) => id);
  if (!affirmativeIds.length || !state.region) return [];
  const regionData = SYSTEMIC_SCREENING[state.region];
  if (!regionData) return [];
  const texts = [];
  regionData.sistemas.forEach(sis => {
    (sis.preguntas || []).forEach(q => {
      if (affirmativeIds.includes(q.id)) texts.push(q.text);
    });
  });
  return texts;
}

function buildResults() {
  const container = document.getElementById('resultsContent');
  container.innerHTML = '';

  // Sort hypotheses by score
  const sorted = [...state.activeHypotheses]
    .map(h => ({ id: h, score: state.hypothesisScores[h]?.totalLR || 1, hyp: HYPOTHESES[h] }))
    .filter(x => x.hyp)
    .sort((a, b) => b.score - a.score);

  const brAffirmative = Object.entries(state.banderasRojas)
    .filter(([, v]) => v === 'SI')
    .map(([k]) => BR_LABELS[k]);
  const sqAffirmative = getSistemicoAffirmativeTexts();

  // ── Header summary
  container.innerHTML += `
  <div class="summary-section">
    <div class="summary-section-title">📋 Datos de Cabecera</div>
    ${state.patient ? `<div class="summary-row"><span class="summary-label">Paciente</span><span class="summary-value">${state.patient}</span></div>` : ''}
    <div class="summary-row"><span class="summary-label">Motivo de consulta</span><span class="summary-value">${state.motivoConsulta || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Mecanismo</span><span class="summary-value">${state.mecanismo || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Cronología</span><span class="summary-value">${state.cronologia || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Banderas rojas</span><span class="summary-value" style="${brAffirmative.length ? 'color:var(--red)' : ''}">${brAffirmative.length ? '⚠️ Bandera roja presente — watchful waiting' : '✓ Sin banderas rojas'}</span></div>
    ${brAffirmative.length ? `<div style="padding:2px 0 8px 1rem; display:flex; flex-direction:column; gap:3px;">${brAffirmative.map(t => `<span style="color:var(--red); font-size:0.78rem;">· ${t}</span>`).join('')}</div>` : ''}
    <div class="summary-row"><span class="summary-label">Cribado sistémico</span><span class="summary-value" style="${sqAffirmative.length ? 'color:var(--orange)' : ''}">${sqAffirmative.length ? '⚠️ Respuesta afirmativa en cribado sistémico' : '✓ Sin alertas sistémicas'}</span></div>
    ${sqAffirmative.length ? `<div style="padding:2px 0 8px 1rem; display:flex; flex-direction:column; gap:3px;">${sqAffirmative.map(t => `<span style="color:var(--orange); font-size:0.78rem;">· ${t}</span>`).join('')}</div>` : ''}
    <div class="summary-row"><span class="summary-label">Riesgo psicosocial</span><span class="summary-value">${state.riesgoPsico ? `${state.riesgoPsico === 'Bajo' ? '🟢' : state.riesgoPsico === 'Medio' ? '🟠' : '🔴'} ${state.riesgoPsico}` : '—'}</span></div>
    ${state.riesgoPsico === 'Alto' ? `<div class="summary-row"><span class="summary-label">Miedo/catastrofización</span><span class="summary-value">${state.psico_miedo || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Autoeficacia</span><span class="summary-value">${state.psico_autoef || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Componente emocional</span><span class="summary-value">${state.psico_emocional || '—'}</span></div>` : ''}
  </div>`;

  // ── SINSS
  container.innerHTML += `
  <div class="summary-section">
    <div class="summary-section-title">📊 SINSS — Caracterización del Cuadro</div>
    <div class="summary-row"><span class="summary-label">Región valorada</span><span class="summary-value">${state.region ? state.region.charAt(0).toUpperCase() + state.region.slice(1) : '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Severidad (EVN)</span><span class="summary-value">${state.severidad}/10</span></div>
    <div class="summary-row"><span class="summary-label">Irritabilidad</span><span class="summary-value">${state.irritabilidadNivel || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Naturaleza</span><span class="summary-value">${state.naturaleza || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Estadio</span><span class="summary-value">${state.estadio || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Estabilidad</span><span class="summary-value">${state.estabilidad || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Signo comparable</span><span class="summary-value">${state.signoComparable || '—'}</span></div>
  </div>`;

  // ── Hypotheses with tests
  let hypHtml = `<div class="summary-section"><div class="summary-section-title">🎯 Hipótesis Diagnósticas — Ordenadas por Peso Diagnóstico</div>`;

  if (sorted.length === 0) {
    const regionLabel = state.region ? state.region.charAt(0).toUpperCase() + state.region.slice(1) : 'la región';
    const showCS = state.cronologia === 'Crónico (>3 meses)' && state.riesgoPsico === 'Alto';
    hypHtml += `
      <div style="background:var(--surface2); border:1px solid var(--orange); border-radius:var(--radius); padding:1.2rem; color:var(--text2); font-size:0.85rem; line-height:1.7;">
        <div style="display:flex; align-items:center; gap:6px; color:var(--orange); font-weight:600; margin-bottom:8px;"><span style="line-height:1;">⚠️</span><span>Sin hipótesis diagnósticas identificadas</span></div>
        <div>El algoritmo no encontró un patrón dominante claro. Se recomienda trabajar con hipótesis de trabajo de <em>dolor de ${regionLabel} inespecífico</em>.</div>
        ${showCS ? `<div style="margin-top:8px; padding-top:8px; border-top:1px solid var(--border2);">Dado el perfil crónico y el riesgo psicosocial elevado, considere también <em>sensibilización central</em> como hipótesis complementaria.</div>` : ''}
      </div>`;
  } else {
    sorted.forEach((item, rank) => {
      const { id, hyp, score } = item;
      const scoreInfo = state.hypothesisScores[id];
      const colorClass = scoreInfo?.colorClass || 'hyp-orange';
      const colorMap = { 'hyp-green': '#38d9a9', 'hyp-orange': '#ff9f43', 'hyp-red': '#ff6b6b' };
      const rankEmoji = ['🥇','🥈','🥉'][rank] || `${rank+1}º`;
      const dotColor = colorMap[colorClass] || '#ff9f43';

      // Tests summary
      const results = state.testResults[id] || {};
      const testsHtml = hyp.tests.map((t, i) => {
        const res = results[i];
        const resLabel = res === 'pos' ? '<span style="color:var(--green)">✓ Positivo</span>' : res === 'neg' ? '<span style="color:var(--red)">✗ Negativo</span>' : '<span style="color:var(--text3)">Sin datos</span>';
        const statsStr = [t.sn && `Sn:${t.sn}`, t.sp && `Sp:${t.sp}`, t.lr_pos && `LR+:${t.lr_pos}`, t.lr_neg && `LR-:${t.lr_neg}`].filter(Boolean).join(' | ');
        return `<div style="padding:6px 0; border-bottom:1px solid rgba(35,45,69,0.4); font-size:0.8rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
            <span style="color:var(--text2); flex:1;">${t.name}</span>
            <span>${resLabel}</span>
          </div>
          ${statsStr ? `<div style="color:var(--text3); font-size:0.7rem; font-family:'DM Mono',monospace; margin-top:2px;">${statsStr}</div>` : ''}
        </div>`;
      }).join('');

      hypHtml += `
      <div style="background:var(--surface2); border:1px solid ${dotColor}33; border-radius:var(--radius-lg); padding:1.2rem; margin-bottom:1rem;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:1rem;">
          <span style="width:12px;height:12px;border-radius:50%;background:${dotColor};flex-shrink:0;box-shadow:0 0 8px ${dotColor}66;"></span>
          <span style="font-weight:600; color:${dotColor}; font-size:0.95rem;">${rankEmoji} ${hyp.name}</span>
          <span style="margin-left:auto; font-family:'DM Mono',monospace; font-size:0.7rem; color:var(--text3);">${scoreInfo?.label || 'Sin evaluar'}</span>
        </div>
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">Tests Realizados</div>
          ${testsHtml}
        </div>
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>
        </div>
        <div>
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent2); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">💊 Dosis Día 1 (Baja Fricción)</div>
          <div class="exercise-box">${hyp.dosis}</div>
        </div>
      </div>`;
    });
  }
  hypHtml += `</div>`;
  container.innerHTML += hypHtml;

  // ── Plan notes
  container.innerHTML += `
  <div class="summary-section">
    <div class="summary-section-title">📝 Notas del Plan</div>
    <div class="plan-note-row">
      <div class="plan-note-label">Variable de control</div>
      <div class="plan-note-hint">¿Qué sensación indica que debemos parar? Ej: dolor &gt;4/10, hormigueo, fatiga excesiva</div>
      <textarea class="plan-note-input" id="planVariableControl" rows="2"
        placeholder="Ej: Parar si el dolor supera 4/10 durante el ejercicio o si aparece hormigueo en el brazo"
        oninput="state.planNotes.variableControl=this.value; saveSession()"
      >${state.planNotes.variableControl}</textarea>
    </div>
    <div class="plan-note-row">
      <div class="plan-note-label">Ventana de recuperación</div>
      <div class="plan-note-hint">¿Cómo está el dolor a las 24 horas? Dato clave para análisis de carga</div>
      <textarea class="plan-note-input" id="planVentana" rows="2"
        placeholder="Ej: Dolor basal de 3/10 debe volver a 3/10 o menos a las 24h. Si aumenta, reducir dosis."
        oninput="state.planNotes.ventanaRecuperacion=this.value; saveSession()"
      >${state.planNotes.ventanaRecuperacion}</textarea>
    </div>
    <div class="plan-note-row">
      <div class="plan-note-label">Anclaje de hábito</div>
      <div class="plan-note-hint">Vincular el ejercicio a una actividad existente del paciente para reducir la fricción</div>
      <textarea class="plan-note-input" id="planAnclaje" rows="2"
        placeholder="Ej: Hacer las rotaciones mientras espera que se haga el café por la mañana"
        oninput="state.planNotes.anclajeHabito=this.value; saveSession()"
      >${state.planNotes.anclajeHabito}</textarea>
    </div>
    <div style="margin-top:1rem; padding:1rem; background:var(--surface2); border-radius:var(--radius); border:1px solid var(--border2);">
      <p style="font-size:0.75rem; color:var(--text3); line-height:1.6;">
        <strong style="color:var(--text2);">Nota clínica:</strong> Las hipótesis diagnósticas se han generado mediante un árbol de decisión basado en evidencia clínica. Los tests confirmatorios deben interpretarse siempre en el contexto clínico completo del paciente. La presencia o ausencia de banderas rojas sistémicas requiere watchful waiting y posible derivación médica si los síntomas persisten o se agravan.
      </p>
    </div>
  </div>`;

  // ── Timestamp
  const now = new Date();
  container.innerHTML += `
  <div style="text-align:center; padding:1rem 0; color:var(--text3); font-family:'DM Mono',monospace; font-size:0.65rem; letter-spacing:1px;">
    PhysiQ-Assessment · ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})}
  </div>`;
}

function finalizarValoracion() {
  const btn = document.getElementById('btnFinalizar');
  const _assessmentPayload = buildPhysiQPayload();
  const now = new Date();
  writeSession({ assessment: _assessmentPayload, patient: state.patient || '', date: now.toLocaleDateString('es-ES') })
    .then(session => {
      if (session) updateSessionChip(session);
      _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT', assessment: _assessmentPayload });
    });
  if (btn) {
    btn.textContent = '✓ Enviado al informe';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Finalizar valoración →'; btn.disabled = false; }, 3000);
  }
}

// ─── PHASE 2 VALIDATION ──────────────────────────────────────
function goToPhase2Next() {
  if (!state.region) return;
  goToPhase(3);
}

// ─── MOBILE PHASE SHEET ───────────────────────────────────


function updateMobilePhaseBar(phaseN) {
  const def = PHASE_DEFS.find(p => p.n === phaseN || String(p.n) === String(phaseN));
  if (!def) return;
  const label = document.getElementById('mobilePhaseLabel');
  if (label) label.textContent = `${def.short} · ${def.label}`;
}

function togglePhaseSheet() {
  buildPhaseSheetList();
  const sheet = document.getElementById('phaseSheet');
  const overlay = document.getElementById('phaseSheetOverlay');
  const isOpen = sheet.classList.contains('open');
  sheet.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closePhaseSheet() {
  document.getElementById('phaseSheet').classList.remove('open');
  document.getElementById('phaseSheetOverlay').classList.remove('open');
  document.body.style.overflow = '';
}


function buildPhaseSheetList() {
  const list = document.getElementById('phaseSheetList');
  list.innerHTML = '';
  PHASE_DEFS.forEach((def, i) => {
    const navEl = document.getElementById(PHASE_NAV_IDS[def.n]);
    const isActive = navEl?.classList.contains('active');
    const isCompleted = navEl?.classList.contains('completed');
    const isInvalidated = navEl?.classList.contains('invalidated');
    const isVisited = isActive || isCompleted;
    const isBlocked = !isVisited || isInvalidated;

    let stateClass = 'psi-blocked';
    let statusText = '🔒 No disponible';
    let iconContent = String(i + 1);

    if (isActive) {
      stateClass = 'psi-active';
      statusText = '→ Fase actual';
      iconContent = '→';
    } else if (isCompleted && !isInvalidated) {
      stateClass = 'psi-completed';
      statusText = '✓ Completada';
      iconContent = '✓';
    } else if (isInvalidated) {
      stateClass = 'psi-blocked';
      statusText = '⚠ Requiere revisión';
    }

    const item = document.createElement('div');
    item.className = `phase-sheet-item ${stateClass}`;
    item.innerHTML = `
      <div class="phase-sheet-icon">${iconContent}</div>
      <div class="phase-sheet-info">
        <div class="phase-sheet-name">${def.short} · ${def.label}</div>
        <div class="phase-sheet-status">${statusText}</div>
      </div>`;

    if (!isBlocked && !isActive) {
      item.onclick = () => { closePhaseSheet(); navStepClick(def.n); };
    } else if (isInvalidated) {
      item.onclick = () => {
        closePhaseSheet();
        setTimeout(() => {
          const el = document.getElementById(PHASE_NAV_IDS[def.n]);
          if (el) showNavTooltip(el, 'Región modificada — complete las fases anteriores primero');
        }, 200);
      };
    }

    list.appendChild(item);
  });
}

// ─── CONFIRM BANNER (reemplaza confirm() nativo) ─────────────
function showConfirmBanner(title, text, actionLabel, onConfirm) {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-banner';
  overlay.id = 'confirmBanner';
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-box-title">${title}</div>
      <div class="confirm-box-text">${text}</div>
      <div class="confirm-box-btns">
        <button class="btn btn-secondary" id="confirmCancel" style="font-size:0.85rem; padding:9px 18px;">Cancelar</button>
        <button class="btn btn-primary" id="confirmAction" style="font-size:0.85rem; padding:9px 18px;">${actionLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  const dismiss = () => { overlay.remove(); window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*'); };
  document.getElementById('confirmCancel').onclick = dismiss;
  document.getElementById('confirmAction').onclick = () => { dismiss(); onConfirm(); };
}


// ─── SESSION CHIP ─────────────────────────────────────────────
let _sessionLabel = '';

function updateSessionChip(session) {
  const btn = document.getElementById('sessionBtn');
  if (!btn) return;
  if (!session || !session.patient) { _sessionLabel = ''; btn.classList.remove('active'); return; }
  _sessionLabel = `${session.patient} · ${session.date || '—'}`;
  btn.classList.add('active');
}

function promptClearSession() {
  showConfirmBanner(
    'Sesión en curso',
    `${_sessionLabel}<br>¿Borrar y empezar de nuevo?`,
    'Borrar sesión',
    () => {
      _sessionGen++; _sessionCleared = true;
      state.patient = '';
      const _patEl = document.getElementById('patientName');
      if (_patEl) _patEl.value = '';
      updateSessionChip(null);
      _softResetApp(); goToPhase(1);
      clearSession().then(() => { _sessionCh.postMessage({ type: 'SESSION_CLEAR' }); });
    }
  );
}

// ─── PHYSIQ EXPORT ───────────────────────────────────────────
function loadROMFromURL() {
  const raw = new URLSearchParams(location.search).get('rom');
  if (!raw) return;
  try {
    state.rom = JSON.parse(decodeURIComponent(escape(atob(raw))));
  } catch {}
}

function buildPhysiQPayload() {
  return {
    p:  state.patient ?? '',
    r:  state.region,
    d:  new Date().toLocaleDateString('es-ES'),
    mo: state.motivoConsulta,
    me: state.mecanismo,
    cr: state.cronologia,
    rp: state.riesgoPsico,
    nr: state.severidad ?? 0,
    ir: state.irritabilidadNivel,
    na: state.naturaleza,
    si: state.sistemicoAlerta,
    br: Object.entries(state.banderasRojas).filter(([, v]) => v === 'SI').map(([k]) => BR_LABELS[k]),
    sq: getSistemicoAffirmativeTexts(),
    h:  state.activeHypotheses.map(id => ({
          id,
          name: HYPOTHESES[id]?.name ?? id,
          sc:   state.hypothesisScores[id]?.label ?? 'Sin evaluar',
          lr:   state.hypothesisScores[id]?.totalLR ?? null,
          tr:   state.testResults[id] ?? {}
        })),
    pn: state.planNotes,
    ...(state.rom ? { rom: state.rom } : {})
  };
}


function copyContextToClipboard() {
  const d = buildPhysiQPayload();
  const hyps = (d.h || []).map(h => `  · ${h.name} — ${h.sc}`).join('\n');
  const text = `VALORACIÓN PhysiQ-Assessment${d.p ? `\nPaciente: ${d.p}` : ''}
Región: ${d.r} · NRS: ${d.nr}/10 · Irritabilidad: ${d.ir}
Cribado sistémico: ${d.si ? 'POSITIVO ⚠️' : 'Negativo'}
Hipótesis:
${hyps}
Variable control: ${d.pn?.variableControl || '—'}
Ventana recuperación: ${d.pn?.ventanaRecuperacion || '—'}
Anclaje hábito: ${d.pn?.anclajeHabito || '—'}`;
  navigator.clipboard.writeText(text).then(() => {
    showCopyFeedback();
  });
}

function showCopyFeedback() {
  const existing = document.getElementById('copyFeedback');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'copyFeedback';
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:var(--surface3); border:1px solid var(--accent2);
    color:var(--accent2); font-size:0.8rem; font-family:'Outfit',sans-serif;
    padding:10px 20px; border-radius:8px; z-index:9999;
    box-shadow:0 4px 16px rgba(0,0,0,0.4);
    animation:fadeUp 0.25s ease;
  `;
  toast.textContent = '✓ Contexto clínico copiado al portapapeles';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ─── SESSION PERSISTENCE ─────────────────────────────────────

function _hasAssessmentData() {
  return state.maxVisitedIdx > 0
    || !!state.motivoConsulta
    || !!state.mecanismo
    || !!state.cronologia
    || !!state.riesgoPsico
    || !!state.psico_miedo
    || !!state.psico_autoef
    || !!state.psico_emocional
    || Object.values(state.banderasRojas).includes('SI');
}

function updateResetBtnVisibility() {
  document.querySelector('.btn-reset')?.classList.toggle('visible', _hasAssessmentData());
}

function saveSession() {
  const patientEl = document.getElementById('patientName');
  if (patientEl) state.patient = patientEl.value;
  const motivoEl = document.getElementById('motivoConsulta');
  if (motivoEl) state.motivoConsulta = motivoEl.value;
  const signoEl = document.getElementById('signoComparable');
  if (signoEl) state.signoComparable = signoEl.value;
  // After a clear, block writes until a patient name is entered
  if (_sessionCleared) {
    if (!state.patient) { updateResetBtnVisibility(); return; }
    _sessionCleared = false;
  }
  if (state.patient) {
    const date = new Date().toLocaleDateString('es-ES');
    const gen = _sessionGen;
    writeSession({ patient: state.patient, date, assessmentState: { ...state } })
      .then(session => {
        if (_sessionGen !== gen) { clearSession(); return; }
        if (session) updateSessionChip(session);
        _sessionCh.postMessage({ type: 'SESSION_PATIENT', patient: state.patient });
        if (state.currentPhase !== 5) {
          const _phaseLabels = [1, 2, 3, 4, '4b', 5];
          _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_PARTIAL', phase: _phaseLabels[state.maxVisitedIdx], region: state.region || null });
        }
        _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_STATE', assessmentState: { ...state } });
      });
  }
  updateResetBtnVisibility();
}

function _restoreOptionBtnGroup(groupId, val) {
  if (!val) return;
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.option-btn').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/,\s*this\s*,\s*'([^']*)'\s*\)/);
    btn.classList.toggle('selected', !!(m && m[1] === val));
  });
}

function _restoreSessionDOM() {
  const patientEl = document.getElementById('patientName');
  if (patientEl) patientEl.value = state.patient || '';
  const motivoEl = document.getElementById('motivoConsulta');
  if (motivoEl) motivoEl.value = state.motivoConsulta || '';

  ['mecanismo', 'cronologia', 'riesgoPsico'].forEach(g => _restoreOptionBtnGroup(g, state[g]));

  Object.entries(state.banderasRojas).forEach(([brId, val]) => {
    document.querySelectorAll('#banderasRojas .sq-btn').forEach(btn => {
      const onclick = btn.getAttribute('onclick') || '';
      if (!onclick.includes(`'${brId}'`)) return;
      const m = onclick.match(/'(SI|NO)'\s*\)/);
      if (m) btn.classList.toggle('selected', m[1] === val);
    });
  });
  checkBanderasRojas();

  if (state.riesgoPsico) {
    const suggest = document.getElementById('psicoToolSuggest');
    if (suggest) suggest.style.display = 'block';
    const altoQ = document.getElementById('psicoAltoQuestions');
    if (altoQ) altoQ.style.display = state.riesgoPsico === 'Alto' ? 'block' : 'none';
  }
  if (state.riesgoPsico === 'Alto') {
    ['psico_miedo', 'psico_autoef', 'psico_emocional'].forEach(g => _restoreOptionBtnGroup(g, state[g]));
    updatePsicoRecomendacion();
  }

  if (state.maxVisitedIdx < 1) return;

  if (state.region) {
    document.querySelectorAll('.region-card').forEach(card => {
      card.classList.toggle('selected', (card.getAttribute('onclick') || '').includes(`'${state.region}'`));
    });
    const savedAnswers = { ...state.sistemicoAnswers };
    buildSistemicoQuestions(state.region);
    Object.assign(state.sistemicoAnswers, savedAnswers);
    Object.entries(savedAnswers).forEach(([qId, answer]) => {
      const sq2 = document.getElementById(`sq2_${qId}`);
      if (!sq2) return;
      sq2.querySelectorAll('.sq-btn').forEach(btn => {
        const m = (btn.getAttribute('onclick') || '').match(/'(SI|NO)'/);
        if (m) btn.classList.toggle('selected', m[1] === answer);
      });
    });
    updateSistemicoAlert();
    const btnSinss = document.getElementById('btnContinuarSinss');
    if (btnSinss) btnSinss.disabled = false;
  }

  if (state.maxVisitedIdx < 2) return;

  if (state.severidad !== null) {
    document.querySelectorAll('.nrs-btn').forEach(btn => {
      btn.classList.toggle('selected', parseInt(btn.textContent.trim()) === state.severidad);
    });
    const nrsLabel = document.getElementById('nrsLabel');
    if (nrsLabel) nrsLabel.textContent = `${state.severidad}/10 — ${NRS_LABELS[state.severidad]}`;
  }
  document.querySelectorAll('.irritab-table .irritab-btn').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/selectIrritab\('(\w+)',\s*this,\s*'([^']*)'\)/);
    if (m) btn.classList.toggle('selected', state.irritabilidad[m[1]] === m[2]);
  });
  document.querySelectorAll('.irritab-card-btns .irritab-btn').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/selectIrritabSync\('(\w+)',\s*this,\s*'([^']*)'\)/);
    if (m) btn.classList.toggle('selected', state.irritabilidad[m[1]] === m[2]);
  });
  calcIrritabilidad();
  ['naturaleza', 'estadio', 'estabilidad'].forEach(g => _restoreOptionBtnGroup(g, state[g]));
  const signoEl = document.getElementById('signoComparable');
  if (signoEl) signoEl.value = state.signoComparable || '';
  // Phases 4 / 4b / 5 restore automatically via initCIFTree / buildHypothesisCards / buildResults
}

function _applyRemoteAssessmentState(as) {
  const gen = _sessionGen;
  // Preserve local device's navigation — each device navigates independently
  const localPhase = state.currentPhase;
  const localMaxIdx = state.maxVisitedIdx;
  const phaseMap = { 1:0, 2:1, 3:2, 4:3, '4b':4, 5:5 };
  const localIdx = phaseMap[localPhase] ?? 0;

  Object.assign(state, as);
  state.currentPhase = localPhase;
  // Only advance maxVisitedIdx, never regress it
  state.maxVisitedIdx = Math.max(localMaxIdx, as.maxVisitedIdx ?? 0);

  _restoreSessionDOM();

  teardownHypObserver();
  teardownSisObserver();

  // Re-render components for the LOCAL current phase only
  if (localPhase === 2 && typeof restoreSisObserver === 'function') setTimeout(restoreSisObserver, 50);
  if (localPhase === 4) initCIFTree();
  if (localPhase === '4b') {
    const hypContainer = document.getElementById('hypothesisCards');
    // Preserve which card was open before rebuilding
    const openCard = hypContainer?.querySelector('.hypothesis-card.open');
    const openHypId = openCard?.id?.replace('hypcard_', '') || null;
    if (hypContainer) hypContainer.innerHTML = '';
    buildHypothesisCards();
    if (openHypId) {
      const restoredCard = document.getElementById(`hypcard_${openHypId}`);
      if (restoredCard) restoredCard.classList.add('open');
    }
    if (typeof restoreHypObserver === 'function') setTimeout(restoreHypObserver, 50);
  }
  if (localPhase === 5) buildResults();

  // Update nav breadcrumbs to reflect combined maxVisitedIdx
  paintNav(localIdx);

  const date = as.date || new Date().toLocaleDateString('es-ES');
  writeSession({ patient: state.patient || '', date, assessmentState: { ...state } })
    .then(session => {
      if (_sessionGen !== gen) return;
      if (session) updateSessionChip(session);
    });
}


// ─── INIT ─────────────────────────────────────────────────────
// ─── TRANSLATE BANNER ────────────────────────────────────────
let _translateTimer = null;
function handleTranslateClick() {
  if (window.innerWidth > 768) return;
  const banner = document.getElementById('translateBanner');
  if (!banner) return;
  banner.classList.add('visible');
  clearTimeout(_translateTimer);
  _translateTimer = setTimeout(hideTranslateBanner, 4000);
}
function hideTranslateBanner() {
  clearTimeout(_translateTimer);
  const banner = document.getElementById('translateBanner');
  if (banner) banner.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', () => {
  // Init NRS buttons with color classes
  initNRS();
  // Init irritability
  calcIrritabilidad();
  // Init mobile phase bar
  updateMobilePhaseBar(1);

  // Seed history so the first back press steps through phases
  history.replaceState({ phase: 1 }, '');

  // Autosave when app is backgrounded (covers swipe-away on Android PWA)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveSession();
  });

  document.getElementById('patientName')?.addEventListener('blur', saveSession);

  loadROMFromURL();
  readSession().then(session => {
    if (!session) return;
    updateSessionChip(session);
    if (session.assessmentState?.maxVisitedIdx > 0) {
      Object.assign(state, session.assessmentState);
      _restoreSessionDOM();
      const targetPhase = state.currentPhase;
      if (targetPhase === 5) buildResults();
      _handlingPopState = true;
      goToPhase(targetPhase);
      _handlingPopState = false;
      // Rebuild history stack so swipe-back steps through each phase
      const _phaseOrder = [1, 2, 3, 4, '4b', 5];
      const _phaseIdx = { 1:0, 2:1, 3:2, 4:3, '4b':4, 5:5 };
      const targetIdx = _phaseIdx[targetPhase] ?? 0;
      history.replaceState({ phase: 1 }, '');
      for (let i = 1; i <= targetIdx; i++) history.pushState({ phase: _phaseOrder[i] }, '');
      _historyDepth = targetIdx;
    } else {
      const patientEl = document.getElementById('patientName');
      if (session.patient && patientEl && !patientEl.value) {
        patientEl.value = session.patient;
        state.patient = session.patient;
      }
    }
    if (session.rom && !state.rom) state.rom = session.rom;
    updateResetBtnVisibility();
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ========= SWIPE-TO-DISMISS BOTTOM SHEET =========
(function () {
  function initSwipe(sheet, closeFn) {
    let startY = 0, startTime = 0, dragging = false, delta = 0, snapTimer = null;
    const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';

    sheet.addEventListener('touchstart', e => {
      if (e.touches[0].clientY - sheet.getBoundingClientRect().top > 72) return;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      delta = 0;
      dragging = true;
      clearTimeout(snapTimer);
      sheet.style.transition = 'none';
    }, { passive: true });

    sheet.addEventListener('touchmove', e => {
      if (!dragging) return;
      delta = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.transform = delta > 0 ? `translateY(${delta}px)` : 'translateY(0)';
    }, { passive: true });

    function onRelease() {
      if (!dragging) return;
      dragging = false;
      const velocity = delta / (Date.now() - startTime);
      if (delta > 80 || velocity > 0.3) {
        sheet.style.transition = EASE;
        sheet.style.transform = 'translateY(110%)';
        setTimeout(() => {
          sheet.style.transition = 'none';
          closeFn();
          sheet.style.transform = '';
          sheet.style.transition = '';
        }, 300);
      } else {
        sheet.style.transition = EASE;
        sheet.style.transform = 'translateY(0)';
        snapTimer = setTimeout(() => {
          sheet.style.transform = '';
          sheet.style.transition = '';
        }, 310);
      }
    }

    sheet.addEventListener('touchend', onRelease, { passive: true });
    sheet.addEventListener('touchcancel', () => {
      if (!dragging) return;
      dragging = false;
      sheet.style.transform = '';
      sheet.style.transition = '';
    }, { passive: true });
  }

  const sheet = document.getElementById('phaseSheet');
  if (sheet) initSwipe(sheet, closePhaseSheet);
}());

