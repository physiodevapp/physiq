'use strict';

// ── Scroll lock (dialogs / bottom sheets) ────────────────────────────────────
// Reference-counted: several overlays can be stacked or opened in sequence.
// Each one must release its own lock without unlocking scroll while another
// overlay is still open.
let _scrollLockCount = 0;
function lockBodyScroll() {
  _scrollLockCount++;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}
function unlockBodyScroll() {
  _scrollLockCount = Math.max(0, _scrollLockCount - 1);
  if (_scrollLockCount === 0) {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }
}

// ── Test definitions ─────────────────────────────────────────────────────────
const TESTS = {
  'ft-eo': {
    label:       'Pies Juntos',
    sublabel:    'Ojos Abiertos',
    stance:      'bilateral',
    eyes:        'open',
    threshold:   200,
    duration:    30,
    color:       '#38d9a9',
    difficulty:  1,
    instruction: 'Mantén el teléfono vertical apoyado contra el ombligo con ambas manos.',
    tip:         'Mantén los pies juntos y la vista al frente.'
  },
  'ft-ec': {
    label:       'Pies Juntos',
    sublabel:    'Ojos Cerrados',
    stance:      'bilateral',
    eyes:        'closed',
    threshold:   380,
    duration:    30,
    color:       '#4f9cf9',
    difficulty:  2,
    instruction: 'Mantén el teléfono vertical apoyado contra el ombligo con ambas manos.',
    tip:         'Mantén los pies juntos y cierra los ojos cuando empiece la cuenta atrás.'
  },
  'tn-eo': {
    label:       'Tándem',
    sublabel:    'Ojos Abiertos',
    stance:      'tandem',
    eyes:        'open',
    threshold:   320,
    duration:    30,
    color:       '#fb923c',
    difficulty:  3,
    instruction: 'Coloca un pie justo delante del otro (talón-punta) y apoya el teléfono contra el ombligo.',
    tip:         'Mantén la mirada fija en un punto al frente.'
  },
  'tn-ec': {
    label:       'Tándem',
    sublabel:    'Ojos Cerrados',
    stance:      'tandem',
    eyes:        'closed',
    threshold:   560,
    duration:    30,
    color:       '#ef4444',
    difficulty:  4,
    instruction: 'Coloca un pie justo delante del otro (talón-punta) y apoya el teléfono contra el ombligo.',
    tip:         'Cierra los ojos cuando empiece la cuenta atrás. Ten a alguien cerca por seguridad.'
  }
};

const COUNTDOWN_SECS  = 3;
const SAMPLE_RATE_MS  = 20; // 50 Hz
const G_TO_MG         = 1000 / 9.80665;
const BUTTERWORTH_CUTOFF = 10;   // Hz — low-pass cutoff for postural sway isolation
const UMBILICAL_RATIO    = 0.60; // navel height as fraction of total stature
const DEFAULT_SENSOR_H   = 102;  // cm — 60% × 170 cm average adult

// ── State ────────────────────────────────────────────────────────────────────
let _phase      = 'home'; // 'home' | 'setup' | 'countdown' | 'testing' | 'results'
let _testId     = null;
let _samples    = [];
let _lastAccel  = null;
let _sampleInt  = null;
let _testTimer  = null;
let _cdTimer    = null;
let _secsLeft   = 30;
let _cdSecsLeft = COUNTDOWN_SECS;
let _patient      = '';
let _sessionDate  = '';
let _sessionLabel = '';
let _balanceResults = {}; // { testId: savedResult }
let _sessionGen     = 0;
let _sessionCleared = false;
let _patientHeight  = 0;               // cm (0 = not entered)
let _sensorHeight   = DEFAULT_SENSOR_H; // cm, umbilical — used for COP calculation
let _resultsReadonly = false; // true when viewing an already-saved result

const _sessionCh = new BroadcastChannel('physiq-session');

// ── Hub history helpers ───────────────────────────────────────────────────────
function _rebuildHubHistory() {
  history.replaceState({ view: 'hub-exit' }, '');
  history.pushState({ view: 'home' }, '');
  if (_phase !== 'home') history.pushState({ view: _phase }, '');
}

let _firstVisible = true;
window.addEventListener('message', e => {
  if (e.data?.type === 'PHYSIQ_SAT_VISIBLE' && document.body.classList.contains('in-hub')) {
    if (_firstVisible) { _firstVisible = false; return; }
    _rebuildHubHistory();
  }
  if (e.data?.type === 'PHYSIQ_SAT_HIDDEN') {
    _closeAllOverlays();
  }
});

// ── DOM refs (set after DOMContentLoaded) ────────────────────────────────────
let $viewHome, $viewSetup, $measurementSheet, $msCountdown, $msTesting, $viewResults;
let _$headerLogo, _$headerRight, _$setupSubHeader;
let _translateTimer = null;

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  $viewHome         = document.getElementById('view-home');
  $viewSetup        = document.getElementById('view-setup');
  $measurementSheet = document.getElementById('measurement-sheet');
  $msCountdown      = document.getElementById('msCountdown');
  $msTesting        = document.getElementById('msTesting');
  $viewResults      = document.getElementById('view-results');

  // Hub integration
  try {
    if (window.self !== window.top) {
      document.body.classList.add('in-hub');
      document.querySelector('.logo-main').addEventListener('click', () => {
        window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
      });
    }
  } catch (_) {
    document.body.classList.add('in-hub');
  }

  // Header DOM refs
  _$headerLogo     = document.getElementById('headerLogo');
  _$headerRight    = document.getElementById('headerRight');
  _$setupSubHeader = document.getElementById('setupSubHeader');

  // Sensor check
  if (typeof DeviceMotionEvent === 'undefined') {
    document.getElementById('sensor-warning').hidden = false;
  }

  // Load session
  const session = await readSession();
  if (session) {
    _patient = session.patient || '';
    _sessionDate = session.date || _todayStr();
    _balanceResults = session.balance || {};
    _applySessionToUI(session);
  }

  // Render home
  _renderTestCards();
  _updateSessionChip();
  _showView('home');
  if (document.body.classList.contains('in-hub')) {
    history.replaceState({ view: 'hub-exit' }, '');
    history.pushState({ view: 'home' }, '');
  } else {
    history.replaceState({ view: 'home' }, '');
  }

  // BroadcastChannel
  _sessionCh.onmessage = _handleBC;

  // SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
  }

  // Patient name input
  const patientInput = document.getElementById('patientInput');
  if (patientInput) {
    patientInput.value = _patient;
    patientInput.addEventListener('input', _onPatientInput);
  }

  _initSwipeDismiss('measurement-sheet', '.measurement-card', 72, () => {
    _abortMeasurement();
    _openSetup(_testId);
  });
  _setupSessionPanelDrag();
});

// ── Session helpers ───────────────────────────────────────────────────────────
function _applySessionToUI(session) {
  if (session.patient) {
    const inp = document.getElementById('patientInput');
    if (inp) inp.value = session.patient;
  }
  if (session.height) {
    _patientHeight = session.height;
    _sensorHeight  = Math.round(_patientHeight * UMBILICAL_RATIO);
  }
}

function _updateSessionChip() {
  const btn = document.getElementById('sessionBtn');
  if (!btn) return;
  btn.classList.toggle('active', !!_patient);
  _sessionLabel = _patient ? `${_patient} · ${_sessionDate || _todayStr()}` : '';
  const panelTitle = document.getElementById('sessionPanelTitle');
  if (panelTitle) panelTitle.textContent = _sessionLabel || 'Sin sesión activa';
  document.getElementById('sessionPanel')?.classList.toggle('has-session', !!_patient);
}

let _patientDebounce = null;
function _onPatientInput(e) {
  _patient = e.target.value.trim();
  _sessionCleared = false;
  clearTimeout(_patientDebounce);
  _patientDebounce = setTimeout(() => _persistPatient(), 800);
  _updateSessionChip();
}

async function _persistPatient() {
  _sessionDate = _todayStr();
  if (_patient) _sessionCh.postMessage({ type: 'SESSION_PATIENT', patient: _patient });
  if (!_patient) return;
  const gen = _sessionGen;
  await writeSession({ patient: _patient, date: _sessionDate, height: _patientHeight || null });
  if (_sessionGen !== gen) { await clearSession(); }
}

let _heightDebounce = null;
function _onHeightInput(e) {
  const val = parseInt(e.target.value, 10);
  _patientHeight = (val >= 100 && val <= 220) ? val : 0;
  _sensorHeight  = _patientHeight ? Math.round(_patientHeight * UMBILICAL_RATIO) : DEFAULT_SENSOR_H;
  const hint = document.getElementById('sensorHeightHint');
  if (hint) hint.textContent = _patientHeight ? `Altura umbilical estimada: ${_sensorHeight} cm` : '';
  clearTimeout(_heightDebounce);
  _heightDebounce = setTimeout(_persistHeight, 800);
}

async function _persistHeight() {
  if (_sessionCleared || !_patient) return;
  const gen = _sessionGen;
  await writeSession({ height: _patientHeight || null });
  if (_sessionGen !== gen) await clearSession();
}

function _todayStr() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

// ── BroadcastChannel ─────────────────────────────────────────────────────────
function _handleBC(e) {
  const msg = e.data;
  if (!msg) return;
  if (msg.type === 'SESSION_PATIENT') {
    _patient = msg.patient || '';
    const inp = document.getElementById('patientInput');
    if (inp) inp.value = _patient;
    _updateSessionChip();
    return;
  }
  if (msg.type === 'SESSION_BALANCE') {
    _balanceResults = (msg.balance && Object.keys(msg.balance).length > 0)
      ? { ...msg.balance }
      : {};
    _renderTestCards();
    _updateSessionChip();
    _updateResetBtn();
    return;
  }
  if (msg.type === 'SESSION_CLEAR') { _softReset(); clearSession(); }
}

// ── Header state ─────────────────────────────────────────────────────────────
function _updateHeader(name) {
  const showSub = (name === 'setup' || name === 'countdown' || name === 'testing' || name === 'results');
  if (_$setupSubHeader) _$setupSubHeader.hidden = !showSub;
  document.body.classList.toggle('has-sub-header', showSub);
  if (name === 'results' && _testId) {
    const t = TESTS[_testId];
    if (t) {
      const nameEl  = document.getElementById('subHeaderName');
      const subEl   = document.getElementById('subHeaderSub');
      const colorEl = document.getElementById('subHeaderColor');
      if (nameEl)  nameEl.textContent         = t.label;
      if (subEl)   subEl.textContent          = t.sublabel;
      if (colorEl) colorEl.style.background   = t.color;
    }
  }
}

window.subHeaderBack = function () {
  if (_phase === 'results') {
    closeResultsView();
  } else {
    goBack();
  }
};

// ── View routing ──────────────────────────────────────────────────────────────
function _showView(name) {
  const prevPhase = _phase;
  _phase = name === 'countdown' ? 'countdown' : name;
  const isMeasuring = (name === 'countdown' || name === 'testing');
  $viewHome.hidden          = (name !== 'home');
  $viewSetup.hidden         = !['setup', 'countdown', 'testing'].includes(name);
  $measurementSheet.hidden  = !isMeasuring;
  $viewResults.hidden       = (name !== 'results');
  document.body.classList.toggle('measuring', isMeasuring);
  if (isMeasuring) {
    if (name === 'testing' && prevPhase === 'countdown') {
      _animateCountdownToTesting();
    } else {
      $msCountdown.hidden = (name !== 'countdown');
      $msTesting.hidden   = (name !== 'testing');
    }
  }
  _updateHeader(name);
  if (name === 'setup') {
    if (history.state?.view === 'setup') history.replaceState({ view: 'setup' }, '');
    else history.pushState({ view: 'setup' }, '');
  }
  if (name === 'results') {
    history.pushState({ view: 'results' }, '');
  }
}

function _animateCountdownToTesting() {
  const card = $measurementSheet.querySelector('.measurement-card');
  const fromH = card.getBoundingClientRect().height;

  card.style.height     = fromH + 'px';
  card.style.overflow   = 'hidden';
  card.style.transition = 'none';

  $msCountdown.hidden = true;
  $msTesting.hidden   = false;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const toH = card.scrollHeight;
      card.style.transition = 'height 0.35s cubic-bezier(0.4,0,0.2,1)';
      card.style.height     = toH + 'px';
      card.addEventListener('transitionend', () => {
        card.style.height     = '';
        card.style.overflow   = '';
        card.style.transition = '';
      }, { once: true });
    });
  });
}

window.addEventListener('popstate', (e) => {
  if (e.state?.view === 'hub-exit' && document.body.classList.contains('in-hub')) {
    window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
    return;
  }
  if (_phase === 'results') {
    closeResultsView();
  } else if (_phase === 'setup') {
    _showView('home');
  } else if (_phase === 'countdown' || _phase === 'testing') {
    _abortMeasurement();
    _showView('home');
  } else if (e.state?.view === 'home' && _phase !== 'home') {
    _showView('home');
  }
});

// ── Home ──────────────────────────────────────────────────────────────────────
function _renderTestCards() {
  const grid = document.getElementById('testGrid');
  if (!grid) return;
  grid.innerHTML = '';
  let _cardIdx = 0;
  for (const [id, t] of Object.entries(TESTS)) {
    const saved = _balanceResults[id];
    const score = saved ? saved.score : null;

    const card = document.createElement('button');
    card.className = 'test-card';
    card.dataset.testId = id;
    card.style.setProperty('--card-accent', t.color);
    card.style.animationDelay = (_cardIdx++ * 0.05) + 's';
    card.addEventListener('click', () => _openSetup(id));

    const diffDots = Array.from({ length: 4 }, (_, i) =>
      `<span class="diff-dot${i < t.difficulty ? ' filled' : ''}"></span>`
    ).join('');

    const scoreHtml = score !== null
      ? `<span class="card-score" style="color:${_gradeColor(score)}">${score}<small>/100</small></span>`
      : `<span class="card-score-empty">—<small>/100</small></span>`;

    const viewBtn = saved
      ? `<span role="button" class="card-view-btn" aria-label="Ver detalle" title="Ver detalle" onclick="event.stopPropagation();viewSavedResult('${id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </span>`
      : '';

    const deleteBtn = saved
      ? `<span role="button" class="card-delete-btn" aria-label="Eliminar medición" title="Eliminar medición" onclick="event.stopPropagation();clearTestResult('${id}')">✕</span>`
      : '';

    card.innerHTML = `
      ${viewBtn}
      ${deleteBtn}
      <div class="card-label">${t.label}</div>
      <div class="card-sub-row">
        <span class="card-sublabel">${t.sublabel}</span>
        <div class="diff-dots">${diffDots}</div>
      </div>
      <div class="card-bottom">
        ${scoreHtml}
      </div>
    `;
    grid.appendChild(card);
  }
  _renderGlobalSummary();
  _renderInterpretation();
}

// ── Global summary (mirrors physiq-motion's summary-card pattern; the per-test
// detail lives in each test card's eye icon, not in a chip list here) ────────
function _renderGlobalSummary() {
  const card = document.getElementById('globalSummaryCard');
  if (!card) return;
  card.hidden = !Object.keys(_balanceResults).length;
}

window.copyBalanceSummary = function () {
  const lines = Object.entries(TESTS)
    .filter(([id]) => _balanceResults[id])
    .map(([id, t]) => {
      const r = _balanceResults[id];
      return `  ${t.label} ${t.sublabel}: ${r.score}/100 (${_getGrade(r.score).label})`;
    });
  if (!lines.length) return;
  const patient = _patient ? `\nPaciente: ${_patient}` : '';
  const text = `MEDICIÓN PhysiQ-Balance${patient}\nFecha: ${_todayStr()}\n\n${lines.join('\n')}`;
  navigator.clipboard.writeText(text).then(() => _showCopyFeedback());
};

function _showCopyFeedback() {
  const existing = document.getElementById('copyFeedback');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'copyFeedback';
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid #22d3ee;color:#22d3ee;font-size:0.8rem;font-family:\'Outfit\',sans-serif;padding:10px 20px;border-radius:8px;z-index:9999;box-shadow:0 4px 16px rgba(0,0,0,0.4);';
  toast.textContent = '✓ Mediciones copiadas al portapapeles';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ── Interpretation ───────────────────────────────────────────────────────────
function _computeInterpretation() {
  const ids = Object.keys(_balanceResults);
  if (!ids.length) return [];

  const items = [];
  const get = id => _balanceResults[id];
  const ftEO = get('ft-eo'), ftEC = get('ft-ec'), tnEO = get('tn-eo');

  // Global profile
  const scores = ids.map(id => _balanceResults[id].score);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const grade = _getGrade(avg);
  items.push({
    color: grade.color,
    title: `Perfil general: ${grade.label}`,
    text: avg >= 80
      ? 'Oscilación postural mínima. Control neuromuscular sobresaliente en las condiciones evaluadas.'
      : avg >= 60
      ? 'Equilibrio funcional. La oscilación está dentro del rango normal.'
      : avg >= 40
      ? 'Oscilación moderada. El entrenamiento de equilibrio puede mejorar la estabilidad.'
      : 'Oscilación elevada. Se recomienda trabajo específico de estabilización y valoración más detallada.'
  });

  // Visual dependency (Romberg-like): EC vs EO, misma posición
  if (ftEO && ftEC && ftEO.metrics.hRMS > 0.1) {
    const ratio = ftEC.metrics.hRMS / ftEO.metrics.hRMS;
    const high = ratio >= 2.5;
    items.push({
      color: high ? '#fb923c' : '#38d9a9',
      title: high ? 'Dependencia visual elevada' : 'Control propioceptivo normal',
      text: high
        ? `Al cerrar los ojos la oscilación aumentó ${ratio.toFixed(1)}× (umbral: 2.5×). Posible menor aportación del sistema propioceptivo o vestibular.`
        : `Al cerrar los ojos la oscilación aumentó ${ratio.toFixed(1)}× (< 2.5×). Los sistemas propioceptivo y vestibular contribuyen bien al equilibrio.`
    });
  }

  // Base de sustentación: pies juntos vs tándem
  if (ftEO && tnEO) {
    const drop = ftEO.score - tnEO.score;
    items.push({
      color: drop > 35 ? '#fb923c' : drop > 15 ? '#4f9cf9' : '#38d9a9',
      title: drop > 35 ? 'Dificultad con base de sustentación reducida'
           : drop > 15 ? 'Adaptación normal a base reducida'
           : 'Buena adaptación a base reducida',
      text: drop > 35
        ? `El equilibrio bajó ${drop} puntos al pasar a tándem. Trabajar la propiocepción de tobillo y el control de cadera puede mejorar este aspecto.`
        : drop > 15
        ? `Descenso de ${drop} puntos al estrechar la base (pies juntos → tándem), dentro de lo esperado.`
        : `Mínima pérdida de equilibrio al reducir la base (−${drop} pts). Excelente control postural con base estrecha.`
    });
  }

  return items;
}

// Dominant sway direction — a property of a single test (AP vs ML stance
// mechanics differ, e.g. tandem narrows the base laterally), so this is
// shown per-test (results page 3) rather than folded into the cross-test
// interpretation panel above.
function _getDominantDirection(metrics) {
  const { ap, ml } = metrics;
  if (!(ap.rms > 0 && ml.rms > 0)) return null;
  const r = ap.rms / ml.rms;
  if (r > 1.6) {
    return {
      color: '#4f9cf9',
      title: 'Oscilación predominantemente anteroposterior',
      text: 'Mayor movimiento hacia adelante y atrás que lateral. Puede relacionarse con la estrategia de tobillo o debilidad en esa dirección.'
    };
  }
  if (r < 0.625) {
    return {
      color: '#4f9cf9',
      title: 'Oscilación predominantemente lateral',
      text: 'Mayor movimiento de lado a lado que anteroposterior. Puede indicar debilidad de abductores de cadera o asimetría en la carga.'
    };
  }
  return null;
}

function _renderInterpretation() {
  const card = document.getElementById('interpretationCard');
  if (!card) return;
  const items = _computeInterpretation();
  card.hidden = !items.length;
  if (!items.length) return;
  const container = document.getElementById('interpretationItems');
  container.innerHTML = '';
  for (const item of items) {
    const el = document.createElement('div');
    el.className = 'interp-item';
    el.innerHTML = `<span class="interp-dot" style="background:${item.color}"></span><div class="interp-content"><div class="interp-title">${item.title}</div><div class="interp-text">${item.text}</div></div>`;
    container.appendChild(el);
  }
}

// ── Setup ─────────────────────────────────────────────────────────────────────
function _openSetup(testId) {
  _testId = testId;
  const t = TESTS[testId];

  // Sub-header badge
  const nameEl  = document.getElementById('subHeaderName');
  const subEl   = document.getElementById('subHeaderSub');
  const colorEl = document.getElementById('subHeaderColor');
  if (nameEl)  nameEl.textContent  = t.label;
  if (subEl)   subEl.textContent   = t.sublabel;
  if (colorEl) colorEl.style.background = t.color;

  document.getElementById('setupInstruction').textContent = t.instruction;
  document.getElementById('setupTip').textContent      = t.tip;
  document.getElementById('setupDuration').textContent = `Duración: ${t.duration} segundos`;

  const startBtn = document.getElementById('startBtn');
  startBtn.disabled = false;

  _seedSensorHeightUI();

  _showView('setup');
}

function _seedSensorHeightUI() {
  const slider = document.getElementById('sensorHeightSlider');
  const panel  = document.getElementById('sensorHeightPanel');
  const toggle = document.getElementById('sensorHeightToggle');
  if (!slider) return;
  slider.value = _sensorHeight;
  _updateSensorHeightLabels(_sensorHeight);
  panel.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
}

function _updateSensorHeightLabels(val) {
  document.getElementById('sensorHeightToggleValue').textContent = val;
  document.getElementById('sensorHeightValue').textContent = `${val} cm`;
}

window.toggleSensorHeightPanel = function () {
  const panel  = document.getElementById('sensorHeightPanel');
  const toggle = document.getElementById('sensorHeightToggle');
  const open = panel.hidden;
  panel.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
};

window._onSensorHeightSlider = function (e) {
  _sensorHeight = parseInt(e.target.value, 10);
  _updateSensorHeightLabels(_sensorHeight);
};

function _abortMeasurement() {
  if (_cdTimer)   { clearInterval(_cdTimer);   _cdTimer   = null; }
  if (_testTimer) { clearInterval(_testTimer); _testTimer = null; }
  if (_sampleInt) { _stopSensor(); }
  _samples = [];
}

window.goBack = function () {
  _abortMeasurement();
  _showView('home');
  // Consume the setup history entry so a subsequent swipe back exits cleanly
  history.back();
};

// ── Start test (permission + countdown) ──────────────────────────────────────
window.startTest = async function () {
  // iOS 13+ sensor permission
  if (typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const perm = await DeviceMotionEvent.requestPermission();
      if (perm !== 'granted') {
        _showSensorError('Permiso de movimiento denegado. Habilítalo en Ajustes › Privacidad.');
        return;
      }
    } catch (err) {
      _showSensorError('No se pudo solicitar permiso del sensor.');
      return;
    }
  }

  document.getElementById('startBtn').disabled = true;
  _cdSecsLeft = COUNTDOWN_SECS;
  document.getElementById('countdownNum').textContent = _cdSecsLeft;
  _showView('countdown');

  _cdTimer = setInterval(() => {
    _cdSecsLeft--;
    if (_cdSecsLeft <= 0) {
      clearInterval(_cdTimer);
      _cdTimer = null;
      _beginTest();
    } else {
      document.getElementById('countdownNum').textContent = _cdSecsLeft;
    }
  }, 1000);
};

function _showSensorError(msg) {
  document.getElementById('startBtn').disabled = false;
  const el = document.getElementById('sensor-warning');
  el.textContent = msg;
  el.hidden = false;
}

// ── Test in progress ──────────────────────────────────────────────────────────
function _beginTest() {
  const t = TESTS[_testId];
  _samples  = [];
  _lastAccel = null;
  _secsLeft  = t.duration;

  document.getElementById('timerDisplay').textContent = _secsLeft;
  document.getElementById('stopBtn').style.background = '#ef4444';

  _showView('testing');
  _startSensor();
  _startTestTimer(t.duration);
}

function _startSensor() {
  window.addEventListener('devicemotion', _onMotion);
  _sampleInt = setInterval(() => {
    if (_lastAccel) _samples.push({ ..._lastAccel });
  }, SAMPLE_RATE_MS);
}

function _stopSensor() {
  clearInterval(_sampleInt);
  _sampleInt = null;
  window.removeEventListener('devicemotion', _onMotion);
}

function _onMotion(e) {
  const ag = e.accelerationIncludingGravity;
  if (!ag) return;
  _lastAccel = {
    ml: (ag.x || 0) * G_TO_MG, // mediolateral (side-side)
    ud: (ag.y || 0) * G_TO_MG, // vertical (up-down)
    ap: (ag.z || 0) * G_TO_MG  // anterior-posterior (front-back)
  };
}

function _startTestTimer(duration) {
  _testTimer = setInterval(() => {
    _secsLeft--;
    document.getElementById('timerDisplay').textContent = _secsLeft;
    if (_secsLeft <= 0) {
      clearInterval(_testTimer);
      _testTimer = null;
      _endTest();
    }
  }, 1000);
}

window.stopTest = function () {
  _abortMeasurement();
  _openSetup(_testId);
};

async function _endTest() {
  _stopSensor();
  const metrics = _computeMetrics(_samples);

  const testId = _testId;
  _balanceResults[testId] = {
    testId,
    label:    TESTS[testId].label,
    sublabel: TESTS[testId].sublabel,
    eyes:     TESTS[testId].eyes,
    stance:   TESTS[testId].stance,
    duration: TESTS[testId].duration,
    score:    metrics.score,
    metrics
  };

  _sessionDate = _todayStr();
  const patch = { balance: _balanceResults };
  if (_patient) {
    patch.patient = _patient;
    patch.date    = _sessionDate;
    if (_patientHeight) patch.height = _patientHeight;
  }

  _sessionCh.postMessage({ type: 'SESSION_BALANCE', balance: _balanceResults });
  if (_patient) {
    _sessionCleared = false;
    const gen = _sessionGen;
    const session = await writeSession(patch);
    if (_sessionGen !== gen) { await clearSession(); }
    else if (session) {
      _sessionCh.postMessage({ type: 'SESSION_PATIENT', patient: _patient });
    }
  }

  _renderTestCards();
  _updateSessionChip();
  _updateResetBtn();
  _showResults(metrics);
}

// ── Butterworth low-pass filter (order 4, block mode) ────────────────────────
function _butterworthLP4(data, cutoff, fs) {
  const Q     = 1 / Math.sqrt(2);
  const omega = 2 * Math.PI * cutoff / fs;
  const cosw  = Math.cos(omega);
  const sinw  = Math.sin(omega);
  const alpha = sinw / (2 * Q);
  const a0    = 1 + alpha;
  const b0n   = ((1 - cosw) / 2) / a0;
  const b1n   = (1 - cosw)       / a0;
  const b2n   = b0n;
  const a1n   = (-2 * cosw)      / a0;
  const a2n   = (1 - alpha)      / a0;

  function stage(arr) {
    const out = new Array(arr.length);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < arr.length; i++) {
      const x0 = arr[i];
      const y0 = b0n * x0 + b1n * x1 + b2n * x2 - a1n * y1 - a2n * y2;
      out[i] = y0;
      x2 = x1; x1 = x0;
      y2 = y1; y1 = y0;
    }
    return out;
  }

  return stage(stage(data)); // two cascaded 2nd-order stages = order 4
}

// ── COP-in-cm helpers (inverted-pendulum approximation) ──────────────────────
// For slow, quasi-static postural sway, tilt angle θ ≈ a/g (small-angle,
// a already in mg ⇒ a/1000 = a/g), and linear displacement at a pivot-to-
// sensor distance h is ≈ h·θ (arc ≈ chord for small angles). This turns the
// centered, filtered mg signal into an estimated COP trajectory in cm.
function _copSeries(centeredMg, sensorHeightCm) {
  return centeredMg.map(v => sensorHeightCm * (v / 1000));
}

function _diffSeries(arr, dt) {
  const out = new Array(arr.length - 1);
  for (let i = 0; i < arr.length - 1; i++) out[i] = (arr[i + 1] - arr[i]) / dt;
  return out;
}

// 95% confidence ellipse (Prieto et al. 1996). F(0.95; 2, n-2) ≈ 3.00 for the
// sample sizes produced by a 30 s / 50 Hz test. Returns area plus the semi-axes
// and rotation (of the major axis, relative to the x-axis) needed to draw it:
// a principal-axis decomposition of the 2×2 covariance matrix, scaled so that
// π·a·b reproduces the same 2π·F·√(det) area.
function _confidenceEllipse(x, y) {
  const n = x.length;
  if (n < 3) return { area: 0, a: 0, b: 0, angleRad: 0 };
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let varX = 0, varY = 0, covXY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx, dy = y[i] - my;
    varX += dx * dx; varY += dy * dy; covXY += dx * dy;
  }
  varX /= (n - 1); varY /= (n - 1); covXY /= (n - 1);

  const F     = 3.00;
  const trace = varX + varY;
  const det   = Math.max(varX * varY - covXY * covXY, 0);
  const temp  = Math.sqrt(Math.max(trace * trace / 4 - det, 0));
  const lambda1 = trace / 2 + temp; // larger eigenvalue
  const lambda2 = trace / 2 - temp; // smaller eigenvalue
  const angleRad = 0.5 * Math.atan2(2 * covXY, varX - varY);

  return {
    area: 2 * Math.PI * F * Math.sqrt(det),
    a: Math.sqrt(2 * F * Math.max(lambda1, 0)),
    b: Math.sqrt(2 * F * Math.max(lambda2, 0)),
    angleRad
  };
}

// Convex hull via monotone chain, in the same units as the input points.
function _convexHull(points) {
  const n = points.length;
  if (n < 3) return points.slice();
  const pts = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

// Shoelace polygon area, in cm².
function _polygonArea(pts) {
  if (pts.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const j = (i + 1) % pts.length;
    area += pts[i].x * pts[j].y - pts[j].x * pts[i].y;
  }
  return Math.abs(area) / 2;
}

// Block-averaging downsample — smoother than stride decimation for plotting.
function _downsample(arr, target) {
  if (arr.length <= target) return arr.slice();
  const out = new Array(target);
  const bucket = arr.length / target;
  for (let i = 0; i < target; i++) {
    const start = Math.floor(i * bucket);
    const end   = Math.max(Math.floor((i + 1) * bucket), start + 1);
    let sum = 0, count = 0;
    for (let j = start; j < end && j < arr.length; j++) { sum += arr[j]; count++; }
    out[i] = count ? sum / count : arr[Math.min(start, arr.length - 1)];
  }
  return out;
}

// ── Metrics computation ───────────────────────────────────────────────────────
function _computeMetrics(samples) {
  const n = samples.length;
  if (n < 10) return null;

  const fs = 1000 / SAMPLE_RATE_MS;
  const ap = _butterworthLP4(samples.map(s => s.ap), BUTTERWORTH_CUTOFF, fs);
  const ml = _butterworthLP4(samples.map(s => s.ml), BUTTERWORTH_CUTOFF, fs);
  const ud = _butterworthLP4(samples.map(s => s.ud), BUTTERWORTH_CUTOFF, fs);

  const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

  const mAP = mean(ap), mML = mean(ml), mUD = mean(ud);

  const apC = ap.map(v => v - mAP);
  const mlC = ml.map(v => v - mML);
  const udC = ud.map(v => v - mUD);

  const rms = arr => Math.sqrt(arr.reduce((a, b) => a + b * b, 0) / arr.length);
  const sd  = arr => {
    const m = mean(arr);
    return Math.sqrt(arr.reduce((a, b) => a + (b - m) * (b - m), 0) / arr.length);
  };
  const npl = arr => {
    let sum = 0;
    for (let i = 1; i < arr.length; i++) sum += Math.abs(arr[i] - arr[i - 1]);
    return sum;
  };

  const apRMS = rms(apC), mlRMS = rms(mlC), udRMS = rms(udC);
  const apSD  = sd(apC),  mlSD  = sd(mlC),  udSD  = sd(udC);
  const apNPL = npl(apC), mlNPL = npl(mlC), udNPL = npl(udC);

  const hRMS = Math.sqrt(apRMS * apRMS + mlRMS * mlRMS);

  // H-SD: std of the horizontal magnitude time series
  const hSeries = apC.map((v, i) => Math.sqrt(v * v + mlC[i] * mlC[i]));
  const hSD = sd(hSeries);

  // 2D path length in horizontal plane
  let totalSway = 0;
  for (let i = 1; i < n; i++) {
    const dAP = apC[i] - apC[i - 1];
    const dML = mlC[i] - mlC[i - 1];
    totalSway += Math.sqrt(dAP * dAP + dML * dML);
  }

  const measuredDuration = n * SAMPLE_RATE_MS / 1000;
  const stabilityRate    = measuredDuration > 0 ? totalSway / measuredDuration : 0;

  const threshold = TESTS[_testId].threshold;
  const score     = Math.max(0, Math.min(100, Math.round(100 * (1 - hRMS / threshold))));

  // ── COP-in-cm block ─────────────────────────────────────────────────────
  const dt    = SAMPLE_RATE_MS / 1000;
  const copAP = _copSeries(apC, _sensorHeight);
  const copML = _copSeries(mlC, _sensorHeight);

  let copPathLength = 0;
  for (let i = 1; i < n; i++) {
    const dAP = copAP[i] - copAP[i - 1];
    const dML = copML[i] - copML[i - 1];
    copPathLength += Math.sqrt(dAP * dAP + dML * dML);
  }
  const copHRMS = Math.sqrt(rms(copAP) * rms(copAP) + rms(copML) * rms(copML));
  const copMeanVelocity = measuredDuration > 0 ? copPathLength / measuredDuration : 0;

  // Chart convention: x = ML (left-right), y = AP (back-front)
  const ellipse   = _confidenceEllipse(copML, copAP);
  const hullPts   = _convexHull(copML.map((v, i) => ({ x: v, y: copAP[i] })));
  const hullArea  = _polygonArea(hullPts);

  const velAP = _diffSeries(copAP, dt),  velML = _diffSeries(copML, dt);
  const accAP = _diffSeries(velAP, dt),  accML = _diffSeries(velML, dt);
  const jerkAP = _diffSeries(accAP, dt), jerkML = _diffSeries(accML, dt);
  let jerkSumSq = 0;
  for (let i = 0; i < jerkAP.length; i++) jerkSumSq += jerkAP[i] * jerkAP[i] + jerkML[i] * jerkML[i];
  const jerkRMS = jerkAP.length > 0 ? Math.sqrt(jerkSumSq / jerkAP.length) : 0;

  const round2 = v => Math.round(v * 100) / 100;

  return {
    plannedDuration: TESTS[_testId].duration,
    measuredDuration,
    hRMS,
    hSD,
    totalSway,
    stabilityRate,
    score,
    ap: { rms: apRMS, sd: apSD, npl: apNPL },
    ml: { rms: mlRMS, sd: mlSD, npl: mlNPL },
    ud: { rms: udRMS, sd: udSD, npl: udNPL },
    cop: {
      sensorHeight: _sensorHeight,
      hRMS: copHRMS,
      pathLength: copPathLength,
      meanVelocity: copMeanVelocity,
      ellipseArea: ellipse.area,
      hullArea,
      jerkRMS,
      // Chart data (x = ML, y = AP), downsampled to keep saved sessions small
      ellipse: { a: ellipse.a, b: ellipse.b, angleRad: ellipse.angleRad },
      hull: hullPts.map(p => ({ x: round2(p.x), y: round2(p.y) })),
      series: {
        ml: _downsample(copML, 300).map(round2),
        ap: _downsample(copAP, 300).map(round2)
      }
    }
  };
}

// ── Results display ───────────────────────────────────────────────────────────
function _showResults(metrics, opts = {}) {
  if (!metrics) {
    _showView('home');
    return;
  }
  _resultsReadonly = !!opts.readonly;
  document.getElementById('resultsDeleteBtn').hidden = _resultsReadonly;
  document.getElementById('resultsCloseBtn').hidden  = !_resultsReadonly;

  const t     = TESTS[_testId];
  const grade = _getGrade(metrics.score);

  // Header
  document.getElementById('resultsTestName').textContent = `${t.label} · ${t.sublabel}`;
  const gradeBadge = document.getElementById('gradeBadge');
  gradeBadge.textContent   = grade.label;
  gradeBadge.style.background = grade.color;

  // Page 1 — Summary
  const ringFill = document.getElementById('scoreRingFill');
  ringFill.style.stroke = grade.color;
  ringFill.style.strokeDashoffset = 2 * Math.PI * 72 * (1 - metrics.score / 100);
  document.getElementById('stabilityRateVal').textContent = _fmt1(metrics.stabilityRate);
  document.getElementById('scoreDisplay').textContent     = `${metrics.score}/100`;
  document.getElementById('feedbackText').textContent     = _getFeedback(metrics.score);

  // Page 2 — Test Metrics
  document.getElementById('metDuration').textContent   = `${metrics.plannedDuration}s`;
  document.getElementById('metMeasured').textContent   = `Medido: ${_fmt1(metrics.measuredDuration)}s`;
  document.getElementById('metTotalSway').textContent  = _fmt1(metrics.totalSway);
  document.getElementById('metHRMS').textContent       = _fmt1(metrics.hRMS);
  document.getElementById('metHSD').textContent        = _fmt1(metrics.hSD);

  // Page 3 — Advanced
  document.getElementById('advApNPL').textContent = _fmt1(metrics.ap.npl);
  document.getElementById('advApRMS').textContent = _fmt1(metrics.ap.rms);
  document.getElementById('advApSD').textContent  = _fmt1(metrics.ap.sd);
  document.getElementById('advMlNPL').textContent = _fmt1(metrics.ml.npl);
  document.getElementById('advMlRMS').textContent = _fmt1(metrics.ml.rms);
  document.getElementById('advMlSD').textContent  = _fmt1(metrics.ml.sd);
  document.getElementById('advUdNPL').textContent = _fmt1(metrics.ud.npl);
  document.getElementById('advUdRMS').textContent = _fmt1(metrics.ud.rms);
  document.getElementById('advUdSD').textContent  = _fmt1(metrics.ud.sd);

  const dom = _getDominantDirection(metrics);
  document.getElementById('advDominantDirection').hidden = !dom;
  if (dom) {
    document.getElementById('advDominantDot').style.background = dom.color;
    document.getElementById('advDominantTitle').textContent    = dom.title;
    document.getElementById('advDominantText').textContent     = dom.text;
  }

  // Page 4 — COP (cm)
  document.getElementById('copPathVal').textContent    = _fmt1(metrics.cop.pathLength);
  document.getElementById('copEllipseVal').textContent = _fmt1(metrics.cop.ellipseArea);
  document.getElementById('copHullVal').textContent    = _fmt1(metrics.cop.hullArea);
  document.getElementById('copJerkVal').textContent    = _fmt1(metrics.cop.jerkRMS);
  document.getElementById('copSensorHeightNote').textContent =
    `Estimado a partir del acelerómetro (altura sensor: ${Math.round(metrics.cop.sensorHeight)} cm). Aproximación, no sustituye una plataforma de fuerzas.`;

  _showView('results');
  _hubWidgetHide();
  const scrollBody = $viewResults?.querySelector('.results-scroll-body');
  if (scrollBody) scrollBody.scrollTop = 0;
  // View must be visible (non-zero layout) before measuring the canvas.
  requestAnimationFrame(() => _drawCopChart(metrics.cop));
}

// ── COP chart (stabilogram: scatter + convex hull + 95% ellipse) ─────────────
function _drawCopChart(cop) {
  const canvas = document.getElementById('copChart');
  if (!canvas) return;
  if (!cop || !cop.series || !cop.series.ml.length) { canvas.hidden = true; return; }
  canvas.hidden = false;

  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    setTimeout(() => _drawCopChart(cop), 50);
    return;
  }
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const W = rect.width, H = rect.height;
  ctx.clearRect(0, 0, W, H);

  const { ml, ap } = cop.series;
  const hull    = cop.hull || [];
  const ellipse = cop.ellipse;

  let maxAbs = 0.5; // cm floor so a near-static trace doesn't over-zoom
  for (let i = 0; i < ml.length; i++) maxAbs = Math.max(maxAbs, Math.abs(ml[i]), Math.abs(ap[i]));
  // The hull comes from the full-resolution series and captures the outer-most
  // outliers — those can exceed both the downsampled trace and the ellipse
  // (which by definition only bounds ~95% of points), so it must set the zoom.
  for (const p of hull) maxAbs = Math.max(maxAbs, Math.abs(p.x), Math.abs(p.y));
  if (ellipse) maxAbs = Math.max(maxAbs, ellipse.a);
  maxAbs *= 1.25;

  // Grid — nice-number step: smallest of [0.5,1,2,5,10,20,50] with ≤4 lines per half-axis
  let gridStep = 50;
  for (const s of [0.5, 1, 2, 5, 10, 20, 50]) { if (Math.floor(maxAbs / s) <= 4) { gridStep = s; break; } }
  maxAbs = Math.ceil(maxAbs / gridStep) * gridStep;

  const pad      = 28;
  const plotSize = Math.min(W, H) - pad * 2;
  const scale    = plotSize / (2 * maxAbs); // px per cm
  const halfPlot = plotSize / 2;
  const cx = W / 2, cy = H / 2;
  const toPx = (x, y) => ({ px: cx + x * scale, py: cy - y * scale }); // AP+ (front) = up

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - halfPlot); ctx.lineTo(cx, cy + halfPlot);
  ctx.moveTo(cx - halfPlot, cy); ctx.lineTo(cx + halfPlot, cy);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.22)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let v = gridStep; v < maxAbs; v += gridStep) {
    const yp = cy - v * scale, yn = cy + v * scale;
    const xp = cx + v * scale, xn = cx - v * scale;
    ctx.moveTo(cx - halfPlot, yp); ctx.lineTo(cx + halfPlot, yp);
    ctx.moveTo(cx - halfPlot, yn); ctx.lineTo(cx + halfPlot, yn);
    ctx.moveTo(xp, cy - halfPlot); ctx.lineTo(xp, cy + halfPlot);
    ctx.moveTo(xn, cy - halfPlot); ctx.lineTo(xn, cy + halfPlot);
  }
  ctx.stroke();

  // Convex hull — fill first as a background wash, stroke goes on top of the
  // sway path later so it doesn't get visually buried under the dense trace.
  const hullPx = hull.map(p => toPx(p.x, p.y));
  if (hullPx.length >= 3) {
    ctx.beginPath();
    hullPx.forEach((p, i) => { if (i === 0) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py); });
    ctx.closePath();
    ctx.fillStyle = 'rgba(79,156,249,0.10)';
    ctx.fill();
  }

  // Sway path
  ctx.beginPath();
  for (let i = 0; i < ml.length; i++) {
    const { px, py } = toPx(ml[i], ap[i]);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.strokeStyle = 'rgba(56,217,169,0.85)';
  ctx.lineWidth   = 1.25;
  ctx.stroke();

  // Convex hull outline (on top of the sway path)
  if (hullPx.length >= 3) {
    ctx.beginPath();
    hullPx.forEach((p, i) => { if (i === 0) ctx.moveTo(p.px, p.py); else ctx.lineTo(p.px, p.py); });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(115,182,255,0.95)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
  }

  // 95% confidence ellipse (topmost, dashed)
  if (ellipse && ellipse.a > 0) {
    const steps = 72;
    const cosA = Math.cos(ellipse.angleRad), sinA = Math.sin(ellipse.angleRad);
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t  = (i / steps) * Math.PI * 2;
      const ex = ellipse.a * Math.cos(t), ey = ellipse.b * Math.sin(t);
      const rx = ex * cosA - ey * sinA;
      const ry = ex * sinA + ey * cosA;
      const { px, py } = toPx(rx, ry);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.setLineDash([4, 3]);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Center marker
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#e8edf2';
  ctx.fill();

  // Axis ticks at extremes
  const tickLen = 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(cx - tickLen, cy - halfPlot); ctx.lineTo(cx + tickLen, cy - halfPlot);
  ctx.moveTo(cx - tickLen, cy + halfPlot); ctx.lineTo(cx + tickLen, cy + halfPlot);
  ctx.moveTo(cx - halfPlot, cy - tickLen); ctx.lineTo(cx - halfPlot, cy + tickLen);
  ctx.moveTo(cx + halfPlot, cy - tickLen); ctx.lineTo(cx + halfPlot, cy + tickLen);
  ctx.stroke();

  // Direction labels and scale values
  const tipVal = maxAbs < 10 ? maxAbs.toFixed(1) : Math.round(maxAbs).toString();
  const dirClr = 'rgba(200,220,240,0.95)';
  const valClr = 'rgba(200,220,240,0.8)';
  ctx.font = '10px DM Mono, monospace';

  // ANT (top) / POST (bottom) — centered on AP axis
  ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
  ctx.fillStyle = dirClr;
  ctx.fillText('ANT', cx, cy - halfPlot - 1);
  ctx.textBaseline = 'top';
  ctx.fillStyle = dirClr;
  ctx.fillText('POST', cx, cy + halfPlot + 12);

  // AP axis scale values — right of the vertical axis at tick height
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  ctx.fillStyle = valClr;
  ctx.fillText(`+${tipVal} cm`, cx + tickLen + 4, cy - halfPlot);
  ctx.fillText(`−${tipVal} cm`, cx + tickLen + 4, cy + halfPlot);

  // DER (right) / IZQ (left) — at ML axis extremes
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = dirClr;
  ctx.fillText('DER', cx + halfPlot + 5, cy);
  ctx.textAlign = 'right';
  ctx.fillText('IZQ', cx - halfPlot - 5, cy);

  // ML axis scale values — below the horizontal axis at the extreme tick x-positions
  ctx.textBaseline = 'top'; ctx.fillStyle = valClr;
  ctx.textAlign = 'center';
  ctx.fillText(`+${tipVal} cm`, cx + halfPlot, cy + tickLen + 5);
  ctx.fillText(`−${tipVal} cm`, cx - halfPlot, cy + tickLen + 5);
}

function _getGrade(score) {
  if (score >= 80) return { label: 'EXCELENTE', color: '#38d9a9' };
  if (score >= 60) return { label: 'BUENO',     color: '#4f9cf9' };
  if (score >= 40) return { label: 'REGULAR',   color: '#fb923c' };
  return                  { label: 'DÉFICIT',   color: '#ef4444' };
}

function _gradeColor(score) {
  return _getGrade(score).color;
}

function _getFeedback(score) {
  if (score >= 80) return 'Equilibrio excelente. La oscilación postural mínima indica un control neuromuscular y una estabilidad sobresalientes.';
  if (score >= 60) return 'Buen equilibrio. La oscilación postural está dentro del rango normal para esta condición de test.';
  if (score >= 40) return 'Oscilación moderada detectada. El entrenamiento de equilibrio puede ayudar a mejorar la estabilidad.';
  return 'Oscilación significativa detectada. Se recomienda evaluación por un fisioterapeuta.';
}

function _fmt1(v) {
  return typeof v === 'number' ? v.toFixed(1) : '—';
}

// ── Swipe-down to dismiss ─────────────────────────────────────────────────────
function _initSwipeDismiss(overlayId, cardSel, hitZone, onDismiss) {
  const overlay = document.getElementById(overlayId);
  const card    = overlay && overlay.querySelector(cardSel);
  if (!overlay || !card) return;

  let startY = 0, startTime = 0, dragging = false, delta = 0, snapTimer = null;
  const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';
  let vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const newHeight = window.visualViewport.height;
      if (dragging) startY += newHeight - vvHeight;
      vvHeight = newHeight;
    });
  }

  overlay.addEventListener('touchstart', e => {
    const rect = card.getBoundingClientRect();
    const y    = e.touches[0].clientY;
    if (y < rect.top || y > rect.top + hitZone) return;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    startY = y;
    startTime = Date.now();
    delta = 0;
    dragging = true;
    clearTimeout(snapTimer);
    card.style.transition = 'none';
  }, { passive: true });

  overlay.addEventListener('touchmove', e => {
    if (!dragging) return;
    e.preventDefault();
    delta = Math.max(0, e.touches[0].clientY - startY);
    card.style.transform = `translateY(${delta}px)`;
  }, { passive: false });

  function onRelease() {
    if (!dragging) return;
    dragging = false;
    const velocity = delta / (Date.now() - startTime);
    if (delta > 80 || velocity > 0.3) {
      card.style.transition = EASE;
      card.style.transform = 'translateY(110%)';
      setTimeout(() => {
        card.style.transition = 'none';
        card.style.transform = '';
        onDismiss();
      }, 300);
    } else {
      card.style.transition = EASE;
      card.style.transform = 'translateY(0)';
      snapTimer = setTimeout(() => {
        card.style.transform = '';
        card.style.transition = '';
      }, 310);
    }
  }

  overlay.addEventListener('touchend',    onRelease, { passive: true });
  overlay.addEventListener('touchcancel', () => {
    if (!dragging) return;
    dragging = false;
    card.style.transform = '';
    card.style.transition = '';
  }, { passive: true });
}

// ── Results actions ───────────────────────────────────────────────────────────
window.closeResultsView = function () {
  _resultsReadonly = false;
  _showView('home');
  _hubWidgetShow();
};

window.viewSavedResult = function (testId) {
  const saved = _balanceResults[testId];
  if (!saved) return;
  _testId = testId;
  _showResults(saved.metrics, { readonly: true });
};

window.deleteResultFromView = function () {
  showConfirmBanner(
    'Borrar medición',
    `Se eliminará el resultado de ${TESTS[_testId]?.label || _testId}.`,
    'Borrar',
    async () => {
      delete _balanceResults[_testId];
      await updateSession({ balance: _balanceResults });
      _sessionCh.postMessage({ type: 'SESSION_BALANCE', balance: _balanceResults });
      _renderTestCards();
      _updateSessionChip();
      _updateResetBtn();
      _showView('home');
      _hubWidgetShow();
    }
  );
};

// ── Session panel ─────────────────────────────────────────────────────────────
function toggleSessionPanel() {
  const overlay = document.getElementById('sessionPanelOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('open')) { closeSessionPanel(); return; }
  _showSessionState('edit');
  overlay.classList.add('open');
  _hubWidgetHide();
}
window.toggleSessionPanel = toggleSessionPanel;

function _showSessionState(st) {
  const panel = document.getElementById('sessionPanel');
  if (!panel) return;
  const hasSession = !!_patient;
  const label = _sessionLabel || (hasSession
    ? `${_patient} · ${_sessionDate || _todayStr()}` : '');
  panel.classList.toggle('has-session', hasSession);

  if (st === 'edit') {
    panel.innerHTML = `
      <div class="session-panel-handle"></div>
      <div class="session-panel-title" id="sessionPanelTitle">${label || 'Sin sesión activa'}</div>
      <div class="field">
        <label class="field-label">Paciente</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <input class="field-input" type="text" id="patientInput" style="flex:1;"
                 placeholder="Nombre (opcional)" autocomplete="off" spellcheck="false">
          <button class="session-panel-clear" id="sessionPanelClear" title="Borrar sesión">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h9M5 4V2h3v2M3.5 4l.5 7h5l.5-7"/></svg>
          </button>
        </div>
      </div>
      <div class="field" style="margin-top:8px;">
        <label class="field-label">Talla del paciente (cm)</label>
        <input class="field-input" type="number" id="heightInput" min="100" max="220" step="1"
               placeholder="cm (opcional)">
        <div id="sensorHeightHint" style="font-size:11px;color:var(--text3);margin-top:3px;min-height:14px;"></div>
      </div>`;
    const input = panel.querySelector('#patientInput');
    input.value = _patient || '';
    input.addEventListener('input', _onPatientInput);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') closeSessionPanel(); });
    panel.querySelector('#sessionPanelClear').onclick = () => _showSessionState('delete');

    const heightInput = panel.querySelector('#heightInput');
    if (_patientHeight) {
      heightInput.value = _patientHeight;
      panel.querySelector('#sensorHeightHint').textContent = `Altura umbilical estimada: ${_sensorHeight} cm`;
    }
    heightInput.addEventListener('input', _onHeightInput);
    heightInput.addEventListener('keydown', e => { if (e.key === 'Enter') closeSessionPanel(); });

    setTimeout(() => input.focus(), 60);

  } else if (st === 'delete') {
    panel.innerHTML = `
      <div class="session-panel-handle"></div>
      <div class="session-panel-title">${label || 'Sin sesión activa'}</div>
      <div class="confirm-box-text" style="margin:12px 0 0;">¿Borrar y empezar de nuevo?</div>
      <div class="confirm-box-btns" style="margin-top:1rem;">
        <button class="confirm-btn-cancel" id="spCancelBtn">Cancelar</button>
        <button class="confirm-btn-ok" id="spOkBtn">Borrar sesión</button>
      </div>`;
    panel.querySelector('#spCancelBtn').onclick = () => _showSessionState('edit');
    panel.querySelector('#spOkBtn').onclick = () => {
      closeSessionPanel();
      _softReset(true);
    };
  }
}

window.closeSessionPanel = function closeSessionPanel() {
  const panel = document.getElementById('sessionPanel');
  const overlay = document.getElementById('sessionPanelOverlay');
  const wasOpen = overlay?.classList.contains('open');
  overlay?.classList.remove('open');
  if (wasOpen) _hubWidgetShow();
  if (panel) { panel.style.transition = ''; panel.style.transform = ''; }
};

function _setupSessionPanelDrag() {
  const panel = document.getElementById('sessionPanel');
  if (!panel) return;
  const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';
  let startY = 0, startTime = 0, dragging = false, delta = 0, snapTimer = null;
  let vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      const newHeight = window.visualViewport.height;
      if (dragging) startY += newHeight - vvHeight;
      vvHeight = newHeight;
    });
  }

  panel.addEventListener('touchstart', e => {
    if (window.innerWidth > 768) return;
    if (e.touches[0].clientY - panel.getBoundingClientRect().top > 72) return;
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    startY = e.touches[0].clientY;
    startTime = Date.now();
    delta = 0;
    dragging = true;
    clearTimeout(snapTimer);
    panel.style.transition = 'none';
  }, { passive: true });

  panel.addEventListener('touchmove', e => {
    if (!dragging) return;
    delta = Math.max(0, e.touches[0].clientY - startY);
    panel.style.transform = delta > 0 ? `translateY(${delta}px)` : 'translateY(0)';
  }, { passive: true });

  function onRelease() {
    if (!dragging) return;
    dragging = false;
    const velocity = delta / (Date.now() - startTime);
    if (delta > 80 || velocity > 0.3) {
      panel.style.transition = EASE;
      panel.style.transform = 'translateY(110%)';
      setTimeout(() => {
        panel.style.transition = 'none';
        closeSessionPanel();
        panel.style.transform = '';
        panel.style.transition = '';
      }, 300);
    } else {
      panel.style.transition = EASE;
      panel.style.transform = 'translateY(0)';
      snapTimer = setTimeout(() => {
        panel.style.transform = '';
        panel.style.transition = '';
      }, 310);
    }
  }

  panel.addEventListener('touchend', onRelease, { passive: true });
  panel.addEventListener('touchcancel', () => {
    if (!dragging) return;
    dragging = false;
    panel.style.transform = '';
    panel.style.transition = '';
  }, { passive: true });
}

function _closeAllOverlays() {
  closeSessionPanel();
  document.getElementById('confirmBanner')?.setAttribute('hidden', '');
  hideMetricInfo();
  _hubWidgetShow();
}

// ── Session clear ─────────────────────────────────────────────────────────────
window.promptClearSession = function () {
  _showSessionState('delete');
  const overlay = document.getElementById('sessionPanelOverlay');
  if (overlay && !overlay.classList.contains('open')) {
    overlay.classList.add('open');
    _hubWidgetHide();
  }
};

async function _softReset(fullClear = false) {
  _sessionGen++;
  _sessionCleared = true;
  _balanceResults = {};
  _patient        = '';
  _patientHeight  = 0;
  _sensorHeight   = DEFAULT_SENSOR_H;
  _sessionDate    = '';
  _sessionLabel   = '';

  const inp = document.getElementById('patientInput');
  if (inp) inp.value = '';

  _renderTestCards();
  _updateSessionChip();
  _updateResetBtn();

  if (fullClear) {
    await clearSession();
    _sessionCh.postMessage({ type: 'SESSION_CLEAR' });
  } else {
    _sessionCh.postMessage({ type: 'SESSION_BALANCE', balance: {} });
  }
}

// ── Reset button visibility ───────────────────────────────────────────────────
function _updateResetBtn() {
  const btn = document.getElementById('headerResetBtn');
  if (!btn) return;
  btn.style.display = Object.keys(_balanceResults).length > 0 ? '' : 'none';
}

// ── Soft reset (balance data only) ───────────────────────────────────────────
window.promptSoftResetBalance = function () {
  _hubWidgetHide();
  showConfirmBanner(
    '↺ Borrar mediciones',
    'Se eliminarán las mediciones de balance. Los datos de otros satélites se conservarán.',
    'Borrar',
    async () => {
      _hubWidgetShow();
      _balanceResults = {};
      _renderTestCards();
      _updateSessionChip();
      _updateResetBtn();
      await updateSession({ balance: {} });
      _sessionCh.postMessage({ type: 'SESSION_BALANCE', balance: {} });
    }
  );
};

// ── Clear single test result ──────────────────────────────────────────────────
window.clearTestResult = function (testId) {
  _hubWidgetHide();
  showConfirmBanner(
    'Borrar medición',
    `Se eliminará el resultado de ${TESTS[testId]?.label || testId}.`,
    'Borrar',
    async () => {
      _hubWidgetShow();
      delete _balanceResults[testId];
      _renderTestCards();
      _updateSessionChip();
      _updateResetBtn();
      await updateSession({ balance: _balanceResults });
      _sessionCh.postMessage({ type: 'SESSION_BALANCE', balance: _balanceResults });
    }
  );
};

// ── Translate banner (mobile) ─────────────────────────────────────────────────
function handleTranslateClick() {
  if (window.innerWidth > 768) return;
  const banner = document.getElementById('translateBanner');
  if (!banner) return;
  banner.classList.add('visible');
  document.body.classList.add('translate-visible');
  clearTimeout(_translateTimer);
  _translateTimer = setTimeout(hideTranslateBanner, 4000);
}
function hideTranslateBanner() {
  clearTimeout(_translateTimer);
  const banner = document.getElementById('translateBanner');
  if (banner) banner.classList.remove('visible');
  document.body.classList.remove('translate-visible');
}
window.handleTranslateClick = handleTranslateClick;
window.hideTranslateBanner  = hideTranslateBanner;

// ── Hub widget ────────────────────────────────────────────────────────────────
function _hubWidgetHide() {
  try { window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*'); } catch (_) {}
}
function _hubWidgetShow() {
  try { window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*'); } catch (_) {}
}

// ── Metric info dialog ────────────────────────────────────────────────────────
const METRIC_INFO = {
  duration:  { title: 'Duración', body: 'Tiempo de grabación efectivo del sensor. Puede diferir ligeramente de los 30 s nominales si el sistema tardó en iniciar la captura.' },
  totalSway: { title: 'Sway Total', body: 'Longitud total del trayecto de oscilación en el plano horizontal (AP + ML). Equivale al camino que el centro de presión recorrería en ese plano. Valores menores indican mayor estabilidad.' },
  hrms:      { title: 'H-RMS — Sway Horizontal', body: 'Raíz cuadrática media del balanceo horizontal combinado (AP + ML). Es el indicador principal de estabilidad postural: valores menores corresponden a mejor equilibrio. Se usa para calcular la puntuación y comparar con el umbral de referencia del test.' },
  hsd:       { title: 'H-SD — Desviación Estándar Horizontal', body: 'Variabilidad del balanceo horizontal a lo largo del test. Refleja la consistencia del equilibrio: una SD baja indica oscilaciones regulares, mientras que una SD alta puede sugerir estrategias de corrección frecuentes.' },
  npl:       { title: 'NPL — Longitud de Trayecto Normalizada', body: 'Longitud total del trayecto de oscilación dividida por la duración del test (mG/s). Permite comparar tests de diferente duración y facilita el seguimiento longitudinal del paciente.' },
  rms:       { title: 'RMS — Raíz Cuadrática Media', body: 'Amplitud media de las oscilaciones en este eje. Un valor bajo indica poco desplazamiento en esa dirección y, por tanto, mejor control en ese plano.' },
  sd:        { title: 'SD — Desviación Estándar', body: 'Variabilidad de las oscilaciones en este eje durante el test. Valores elevados reflejan mayor irregularidad del balanceo, lo que puede indicar estrategias de corrección frecuentes o menor control motor.' },
  copPath:   { title: 'Trayecto COP', body: 'Longitud total del trayecto estimado del centro de presión, en centímetros, calculada a partir del ángulo de inclinación del tronco (aproximación de péndulo invertido usando la altura umbilical del paciente). Valores menores indican mayor estabilidad.' },
  copEllipse:{ title: 'Área de Elipse de Confianza 95%', body: 'Área de la elipse que contiene el 95% de los puntos del trayecto del COP (fórmula de Prieto et al., 1996), en cm². Resume la dispersión global del balanceo en un único valor de área: cuanto menor, más compacta y estable la oscilación.' },
  copHull:   { title: 'Área de Convex Hull', body: 'Área del polígono convexo que envuelve todos los puntos del trayecto del COP, en cm². A diferencia de la elipse, incluye también los desplazamientos puntuales más extremos (picos de descompensación).' },
  copJerk:   { title: 'Jerk — Suavidad del Movimiento', body: 'Raíz cuadrática media de la tercera derivada de la posición del COP (cm/s³). Cuantifica la suavidad del control postural: valores altos indican correcciones bruscas y menos eficientes; valores bajos, un control más fluido y continuo.' },
};

function showMetricInfo(key) {
  const info = METRIC_INFO[key];
  if (!info) return;
  document.getElementById('metricInfoTitle').textContent = info.title;
  document.getElementById('metricInfoBody').textContent  = info.body;
  document.getElementById('metricInfoDialog').removeAttribute('hidden');
}

function hideMetricInfo() {
  document.getElementById('metricInfoDialog').setAttribute('hidden', '');
}

window.showMetricInfo = showMetricInfo;
window.hideMetricInfo = hideMetricInfo;

// ── Confirm banner ────────────────────────────────────────────────────────────
function showConfirmBanner(title, text, actionLabel, onConfirm) {
  const existing = document.getElementById('confirmBanner');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'confirm-banner';
  overlay.id = 'confirmBanner';
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-box-title">${title}</div>
      <div class="confirm-box-text">${text}</div>
      <div class="confirm-box-btns">
        <button class="confirm-btn-cancel" id="confirmCancel"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancelar</button>
        <button class="confirm-btn-ok" id="confirmAction"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> ${actionLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  lockBodyScroll();
  _hubWidgetHide();
  const dismiss = () => { overlay.remove(); unlockBodyScroll(); _hubWidgetShow(); };
  document.getElementById('confirmCancel').onclick = dismiss;
  document.getElementById('confirmAction').onclick = () => { dismiss(); onConfirm(); };
}
