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

window.addEventListener('popstate', e => {
  if (!e.state || e.state.phase === undefined) return;
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

  // Actualizar índice máximo visitado
  if (idx > state.maxVisitedIdx) state.maxVisitedIdx = idx;

  // Resetear flags de invalidación al avanzar por botones normales
  // (si llegamos a fase 4 el árbol ya se restaura — regionChanged resuelto)
  if (n === 4 || n === '4b' || n === 5) state.regionChanged = false;
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
    if (!hypContainer || hypContainer.children.length === 0) {
      buildHypothesisCards();
    }
    // Observer is restored via restoreHypObserver called above
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!_handlingPopState) {
    history.replaceState({ phase: n }, '');
  }
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
  state.currentPhase = 1;
  state.maxVisitedIdx = 0;
  state.regionChanged = false;
  state.treeModified = false;
  state.patient = '';
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
  const pName = document.getElementById('patientName');
  if (pName) pName.value = '';
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
  history.replaceState({ phase: 1 }, '');
}

function resetApp() {
  const hasRecording = (_mediaRecorder && (_mediaRecorder.state === 'recording' || _mediaRecorder.state === 'paused')) || _audioBlobRecorded;
  const text = 'Se perderán todos los datos introducidos y la aplicación volverá al inicio.' +
    (hasRecording ? ' La grabación de audio no se verá afectada.' : '');
  showConfirmBanner(
    '↺ Reiniciar valoración completa',
    text,
    'Reiniciar',
    hasRecording ? _softResetApp : () => { location.reload(); }
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
  state.severidad = parseInt(document.getElementById('severidadSlider')?.value || 5);
  state.signoComparable = document.getElementById('signoComparable')?.value || '';
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
    // Scroll header into view before collapsing
    const header = clickedRow.querySelector('.sistema-accordion-header');
    const navbarH = window.innerWidth <= 768 ? 94 : 60;
    const top = header.getBoundingClientRect().top + window.scrollY - navbarH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
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

  const sisNavH = window.innerWidth <= 768 ? 94 : 64;
  _sisObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    const banner = document.getElementById('sisContextBanner');
    if (!entry.isIntersecting && entry.boundingClientRect.top < sisNavH) {
      banner.classList.add('visible');
    } else {
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
  const top = header.getBoundingClientRect().top + window.scrollY - navbarH - 8;
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

// ─── PHASE 4 — CIF TREE ──────────────────────────────────────
function initCIFTree() {
  if (!state.region) {
    document.getElementById('cifTree').innerHTML = `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><span>Por favor, seleccione una región en la Fase 2 antes de continuar.</span></div>`;
    return;
  }
  const tree = CIF_TREES[state.region];
  document.getElementById('phase4Title').textContent = tree.title;

  // Si ya hay respuestas previas (retroceso desde 4b/5), restaurar el árbol
  const hasExistingAnswers = Object.keys(state.treeAnswers).length > 0;
  if (hasExistingAnswers) {
    restoreCIFTree(tree);
    return;
  }

  // Primera vez — inicializar limpio
  state.activeHypotheses = [];
  state.treeAnswers = {};
  state.stepsCompleted = [];
  document.getElementById('btnGoConfirm').disabled = true; document.getElementById('btnGoConfirm').style.opacity = '';
  document.getElementById('cifTree').innerHTML = '';
  renderStep(tree.steps[0]);
}

function restoreCIFTree(tree) {
  // Re-renderiza el árbol con las respuestas guardadas en state.treeAnswers
  document.getElementById('cifTree').innerHTML = '';
  document.getElementById('btnGoConfirm').disabled = true; document.getElementById('btnGoConfirm').style.opacity = '';

  // Reconstruir hipótesis desde cero a partir de las respuestas guardadas
  state.activeHypotheses = [];

  // Renderizar y restaurar cada paso que tenga respuesta guardada
  tree.steps.forEach(step => {
    const savedValue = state.treeAnswers[step.id];
    // Solo renderizar si el paso fue visitado
    if (savedValue === undefined) return;

    renderStep(step);

    // Restaurar selección visualmente
    const optGroup = document.getElementById(`opts_${step.id}`);
    if (!optGroup) return;
    const savedOptIdx = step.options.findIndex(o => o.value === savedValue);
    if (savedOptIdx === -1) return;

    optGroup.querySelectorAll('.option-btn')[savedOptIdx].classList.add('selected');

    // Reconstruir hipótesis acumuladas
    step.options[savedOptIdx].hypothesis.forEach(h => {
      if (!state.activeHypotheses.includes(h)) state.activeHypotheses.push(h);
    });
  });

  checkTreeComplete(tree);
}

function resetCIFTree() {
  showConfirmBanner(
    '↺ Reiniciar árbol de decisión',
    'Se perderán las respuestas del árbol y los tests de hipótesis. Los datos de triage, cribado y SINSS se mantienen.',
    'Reiniciar',
    () => {
      state.activeHypotheses = [];
      state.treeAnswers = {};
      state.stepsCompleted = [];
      state.testResults = {};
      state.hypothesisScores = {};
      document.getElementById('cifTree').innerHTML = '';
      document.getElementById('btnGoConfirm').disabled = true; document.getElementById('btnGoConfirm').style.opacity = '';
      const tree = CIF_TREES[state.region];
      renderStep(tree.steps[0]);
    }
  );
}

function renderStep(step) {
  const container = document.getElementById('cifTree');
  const existing = document.getElementById(step.id);
  if (existing) return; // already rendered

  const div = document.createElement('div');
  div.id = step.id;
  div.className = 'tree-question';
  div.innerHTML = `
    <div class="tree-step-badge">${step.tag}</div>
    <div class="tree-question-text">${step.question}</div>
    <div class="option-group" id="opts_${step.id}">
      ${step.options.map((opt, i) => `
        <button class="option-btn" style="width:100%; text-align:left; justify-content:flex-start;"
          onclick="selectTreeOption('${step.id}', ${i}, '${opt.value}')">
          ${opt.label}
        </button>`).join('')}
    </div>`;
  container.appendChild(div);
  // Scroll to new step with offset for fixed navbar (~95px mobile, ~60px desktop)
  setTimeout(() => {
    const navbarH = window.innerWidth <= 768 ? 95 : 60;
    const top = div.getBoundingClientRect().top + window.scrollY - navbarH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }, 50);
}

function selectTreeOption(stepId, optIdx, value) {
  const tree = CIF_TREES[state.region];
  const stepIdx = tree.steps.findIndex(s => s.id === stepId);
  const step = tree.steps[stepIdx];
  const opt = step.options[optIdx];

  // Si ya había una respuesta distinta en este paso, limpiar pasos posteriores
  const prevValue = state.treeAnswers[stepId];
  if (prevValue !== undefined && prevValue !== value) {
    pruneTreeFrom(stepIdx + 1, tree);
  }

  // Marcar seleccionado — mantener botones activos para permitir cambio
  const optGroup = document.getElementById(`opts_${stepId}`);
  optGroup.querySelectorAll('.option-btn').forEach((b, i) => {
    b.classList.toggle('selected', i === optIdx);
    b.style.opacity = '1'; // Todos visibles y clicables
  });

  state.treeAnswers[stepId] = value;

  // Reconstruir hipótesis desde cero (por si cambió una respuesta anterior)
  rebuildHypotheses(tree);

  // Determinar pasos siguientes a renderizar
  const nextStepsToRender = [];

  if (opt.next) {
    const explicitNext = tree.steps.find(s => s.id === opt.next);
    if (explicitNext) nextStepsToRender.push(explicitNext);
  }

  if (!opt.next && stepIdx + 1 < tree.steps.length) {
    const sequentialNext = tree.steps[stepIdx + 1];
    const alreadyQueued = nextStepsToRender.some(s => s.id === sequentialNext.id);
    const alreadyRendered = document.getElementById(sequentialNext.id);
    if (!alreadyQueued && !alreadyRendered) {
      nextStepsToRender.push(sequentialNext);
    }
  }

  if (nextStepsToRender.length > 0) {
    nextStepsToRender.forEach(s => renderStep(s));
  }

  checkTreeComplete(tree);
  saveSession();
}

// Elimina del DOM y del state todos los pasos a partir de fromIdx
function pruneTreeFrom(fromIdx, tree) {
  for (let i = fromIdx; i < tree.steps.length; i++) {
    const stepEl = document.getElementById(tree.steps[i].id);
    if (stepEl) stepEl.remove();
    delete state.treeAnswers[tree.steps[i].id];
  }
  // Marcar 4b y 5 como invalidados si ya habían sido visitados
  if (state.maxVisitedIdx >= 4) {
    state.treeModified = true;
    paintNav(3); // repintar desde fase 4 activa (idx=3)
  }
  document.getElementById('btnGoConfirm').disabled = true;
  
  const complete = document.getElementById('treeComplete');
  if (complete) complete.remove();
}

// Reconstruye activeHypotheses desde las respuestas actuales en state.treeAnswers
function rebuildHypotheses(tree) {
  state.activeHypotheses = [];
  tree.steps.forEach(step => {
    const savedValue = state.treeAnswers[step.id];
    if (savedValue === undefined) return;
    const opt = step.options.find(o => o.value === savedValue);
    if (!opt) return;
    opt.hypothesis.forEach(h => {
      if (!state.activeHypotheses.includes(h)) state.activeHypotheses.push(h);
    });
  });
}

function checkTreeComplete(tree) {
  const renderedSteps = tree.steps.filter(s => document.getElementById(s.id));
  const allAnswered = renderedSteps.every(s => state.treeAnswers[s.id] !== undefined);
  if (allAnswered && renderedSteps.length > 0) {
    showTreeComplete();
  }
}

function showTreeComplete() {
  const container = document.getElementById('cifTree');
  const existing = document.getElementById('treeComplete');
  if (existing) existing.remove();

  const hyps = state.activeHypotheses.map(h => HYPOTHESES[h]).filter(Boolean);
  const div = document.createElement('div');
  div.id = 'treeComplete';
  div.style.marginTop = '1.5rem';
  if (hyps.length === 0) {
    div.className = 'alert alert-warning';
    div.innerHTML = `<span style="font-size:1.2rem; flex-shrink:0; line-height:1;">⚠️</span><span><strong>Árbol completado.</strong> No se ha identificado un patrón diagnóstico dominante. Proceda a Fase 4b para revisar las consideraciones clínicas o regrese al árbol para reconsiderar las respuestas.</span>`;
  } else {
    div.className = 'alert alert-success';
    div.innerHTML = `<span style="font-size:1.2rem; flex-shrink:0; line-height:1;">✅</span><span><strong>Árbol completado.</strong> Hipótesis identificadas: <strong>${hyps.map(h => h.name).join(', ')}</strong>. Proceda a confirmar con los tests específicos.</span>`;
  }
  container.appendChild(div);
  document.getElementById('btnGoConfirm').disabled = false;
  div.scrollIntoView({ behavior: 'smooth' });
}

// ─── PHASE 4b — HYPOTHESIS CARDS ─────────────────────────────
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
    // Close this card
    const header = card.querySelector('.hypothesis-header');
    const navbarH = window.innerWidth <= 768 ? 94 : 60;
    const top = header.getBoundingClientRect().top + window.scrollY - navbarH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
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

  const hypNavH = window.innerWidth <= 768 ? 94 : 64;
  _hypObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    const banner = document.getElementById('hypContextBanner');
    if (!entry.isIntersecting && entry.boundingClientRect.top < hypNavH) {
      banner.classList.add('visible');
    } else {
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
  const top = header.getBoundingClientRect().top + window.scrollY - navbarH - 8;
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
        oninput="state.planNotes.variableControl=this.value"
      >${state.planNotes.variableControl}</textarea>
    </div>
    <div class="plan-note-row">
      <div class="plan-note-label">Ventana de recuperación</div>
      <div class="plan-note-hint">¿Cómo está el dolor a las 24 horas? Dato clave para análisis de carga</div>
      <textarea class="plan-note-input" id="planVentana" rows="2"
        placeholder="Ej: Dolor basal de 3/10 debe volver a 3/10 o menos a las 24h. Si aumenta, reducir dosis."
        oninput="state.planNotes.ventanaRecuperacion=this.value"
      >${state.planNotes.ventanaRecuperacion}</textarea>
    </div>
    <div class="plan-note-row">
      <div class="plan-note-label">Anclaje de hábito</div>
      <div class="plan-note-hint">Vincular el ejercicio a una actividad existente del paciente para reducir la fricción</div>
      <textarea class="plan-note-input" id="planAnclaje" rows="2"
        placeholder="Ej: Hacer las rotaciones mientras espera que se haga el café por la mañana"
        oninput="state.planNotes.anclajeHabito=this.value"
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
    PhysiQ-Assessment · Valoración generada el ${now.toLocaleDateString('es-ES')} a las ${now.toLocaleTimeString('es-ES', {hour:'2-digit',minute:'2-digit'})}
  </div>`;

  writeSession({ assessment: buildPhysiQPayload(), patient: state.patient || '', date: now.toLocaleDateString('es-ES') })
    .then(session => { if (session) updateSessionChip(session); });
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
        <button class="btn btn-secondary" onclick="document.getElementById('confirmBanner').remove()" style="font-size:0.85rem; padding:9px 18px;">Cancelar</button>
        <button class="btn btn-primary" id="confirmAction" style="font-size:0.85rem; padding:9px 18px;">${actionLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('confirmAction').onclick = () => {
    overlay.remove();
    onConfirm();
  };
}


// ─── SESSION CHIP ─────────────────────────────────────────────
let _sessionLabel = '';

function updateSessionChip(session) {
  const btn = document.getElementById('sessionBtn');
  if (!btn) return;
  if (!session) { _sessionLabel = ''; btn.classList.remove('active'); return; }
  _sessionLabel = session.patient
    ? `${session.patient} · ${session.date || '—'}`
    : `Sesión · ${session.date || '—'}`;
  btn.classList.add('active');
}

function promptClearSession() {
  showConfirmBanner(
    '◉ Sesión en curso',
    `${_sessionLabel}<br>¿Borrar y empezar de nuevo?`,
    'Borrar sesión',
    () => { _softResetApp(); goToPhase(1); clearSession().then(() => updateSessionChip(null)); }
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

function saveSession() {
  // Flush live DOM fields into state before serialising
  const patientEl = document.getElementById('patientName');
  if (patientEl) state.patient = patientEl.value;
  const motivoEl = document.getElementById('motivoConsulta');
  if (motivoEl) state.motivoConsulta = motivoEl.value;
  const signoEl = document.getElementById('signoComparable');
  if (signoEl) state.signoComparable = signoEl.value;
  if (state.patient || state.maxVisitedIdx > 0) {
    const date = new Date().toLocaleDateString('es-ES');
    writeSession({ patient: state.patient, date, assessmentState: { ...state } })
      .then(session => { if (session) updateSessionChip(session); });
  }
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
      history.replaceState({ phase: targetPhase }, '');
    } else {
      const patientEl = document.getElementById('patientName');
      if (session.patient && patientEl && !patientEl.value) {
        patientEl.value = session.patient;
        state.patient = session.patient;
      }
    }
    if (session.rom && !state.rom) state.rom = session.rom;
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

