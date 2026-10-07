// ============================================================
// PhysiQ-Assessment · APP.js
// Lógica principal de la aplicación
// ============================================================
import { state } from './state.js';
import { SYSTEMIC_SCREENING, HYPOTHESES, DOSIS_DERIVAR, PHASE_DEFS, PHASE_NAV_IDS, NRS_LABELS, NRS_CLASSES, QUICK_PHRASES } from './data.js';
import { initCIFTree, getDerivacionesArbol } from './phase4.js';
import { buildHypothesisCards, teardownHypObserver, restoreHypObserver, esTratada, marcarTratada, casillaTratadaHTML } from './phase4b.js';
import { writeSession, readSession, clearSession, updateSession } from './lib/session.js';
import {
  COMPLICACIONES, cirugiaVacia, esPosquirurgico, semanasCirugia, semanasTexto, conProtocolo, cirugiaPayload,
  cqConProtocolo, fechaSemanasTexto, TEXTO_SIN_PROTOCOLO, TEXTO_PAUTA_COMPATIBLE, TEXTO_NOTA_TRAUMA, ETIQUETA_TRATADA,
} from './lib/posquirurgico.js';

// ─── SCROLL LOCK (dialogs / bottom sheets) ───────────────────
// Reference-counted: several overlays (confirm-banner, session panel,
// phase sheet) can be stacked or opened in sequence. Each must release
// its own lock without unlocking scroll while another overlay is still open.
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
  // Sheet del razonamiento (fase 2, móvil): el atrás lo cierra sin cambiar de
  // fase, y nuestro propio history.back() al cerrarlo con × no navega.
  if (_razonPopIgnorar) { _razonPopIgnorar = false; return; }
  if (_razonHistorial) { cerrarRazonamiento({ desdeHistorial: true }); return; }
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

  // El panel del razonamiento solo tiene sentido en la fase 2
  if (n !== 2) cerrarRazonamiento({ sinHistorial: true });

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
  if (n === 3) _pintarEstadioCronologia();
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
  if (n === 1) renderBrevePendientes();
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
  state.edadPaciente = null;
  state.signosVitales = { fc: null, fr: null, spo2: null, tas: null, tad: null };
  state.antropometria = { talla: null, peso: null };
  state.mecanismo = '';
  state.cirugia = cirugiaVacia();
  state.cronologia = '';
  state.banderasRojas = { br1: 'NO', br2: 'NO', br3: 'NO', br4: 'NO' };
  state.riesgoPsico = '';
  state.psico_miedo = '';
  state.psico_autoef = '';
  state.psico_emocional = '';
  state.region = '';
  state.lado = '';
  state.sistemicoAnswers = {};
  state.sistemicoBreve = {};
  state.sistemicoAlerta = false;
  state.activeHypotheses = [];
  state.treeAnswers = {};
  state.currentStep = null;
  state.stepsCompleted = [];
  state.testResults = {};
  state.hypothesisScores = {};
  state.derivacionResuelta = {};
  state.resultsBuilt = false;
  state.planNotes = { variableControl: '', ventanaRecuperacion: '', anclajeHabito: '' };
  state.formularioPrevio = { comun: {}, regiones: {} };
  precargarFormularioPrevio();   // refresca contadores y desplegables abiertos
  // Informe narrativo: cancela una generación en curso. El audio de la sesión
  // NO se toca aquí — _softResetApp() también corre por un reinicio llegado de
  // otra pestaña, y eso no puede cortar una grabación de este dispositivo; lo
  // descarta _descartarAudioSesion() en los dos reinicios confirmados aquí.
  state.informeIA = null;
  if (_iaMod) _iaMod.resetInformeIA();

  // Phase 1 DOM
  const mConsulta = document.getElementById('motivoConsulta');
  if (mConsulta) mConsulta.value = '';
  const edadEl = document.getElementById('edadPaciente');
  if (edadEl) edadEl.value = '';
  ['vitalFc', 'vitalFr', 'vitalSpo2', 'vitalTas', 'vitalTad', 'vitalTalla', 'vitalPeso'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('vital-green', 'vital-orange', 'vital-red'); }
  });
  ['flagFc', 'flagFr', 'flagSpo2', 'flagTas', 'flagTad'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('vital-orange', 'vital-red'); }
  });
  updateImcDisplay();
  updateImcColor(); // updateImcDisplay only sets the value now (color/flag deferred to blur — see updateVitalColor), so reset needs both
  document.querySelectorAll('#phase1 .option-btn').forEach(b => b.classList.remove('selected'));
  ['banderaAlert', 'psicoToolSuggest', 'psicoAltoQuestions', 'psicoRecomendacion'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Phase 2 DOM
  document.querySelectorAll('.region-card').forEach(c => c.classList.remove('selected'));
  _pintarLado();
  ['sistemaTabs', 'sistemaPanels', 'urgenciaRegion'].forEach(id => {
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
  _pintarModoUI();   // el modo se conserva, pero el bucle de .option-btn de arriba quitó su selección
  _pintarCirugiaUI();
  updateResetBtnVisibility();
}

function resetApp() {
  showConfirmBanner(
    '↺ Reiniciar valoración completa',
    'Se perderán los datos clínicos de la valoración. El nombre del paciente se conservará.' + _avisoAudioSesion(),
    'Reiniciar',
    () => {
      _descartarAudioSesion();
      _softResetApp(); goToPhase(1);
      _sessionCh.postMessage({ type: 'SESSION_RESET', patient: state.patient || '' });
    }
  );
}

// ─── FORMULARIO PREVIO (formulario.js, carga dinámica) ───────
// import() dinámico: si formulario.js o un formularios/<region>.js no llegan
// a cargar, el resto de la app sigue funcionando. `_fpMod` queda disponible
// para las lecturas síncronas (payload, notas, pistas del árbol).
let _fpMod = null;
function _cargarFormularioMod() {
  return import('./formulario.js').then(m => { _fpMod = m; return m; });
}
function precargarFormularioPrevio() {
  return _cargarFormularioMod().then(m => m.precargarFormulario())
    .then(() => renderBrevePendientes())   // «formulario sin rellenar» depende del módulo cargado
    .catch(() => {});
}
function abrirFormularioPrevio(slot) {
  _cargarFormularioMod()
    .then(m => m.abrirFormularioPrevio(slot))
    .catch(() => showToast('No se pudo cargar el formulario previo.', 'warning'));
}
function resumenFormularioPrevio() {
  return _fpMod ? _fpMod.resumenFormularioPrevio() : [];
}

// ─── INFORME NARRATIVO CON IA (informe-ia.js, solo standalone) ───
// Fuera del hub no hay physiq-report al lado, así que la fase 5 ofrece generar
// el informe narrativo aquí mismo. Dentro del hub el módulo ni se descarga:
// el informe narrativo es cosa de physiq-report. import() dinámico, como el
// formulario previo: si no carga, el resto de la fase 5 sigue funcionando.
let _iaMod = null;
const _enHub = () => document.body.classList.contains('in-hub');
function _cargarInformeIA() {
  return import('./informe-ia.js').then(m => { _iaMod = m; return m; });
}
// Grabación de la sesión desde la cabecera (grabadora.js, solo standalone):
// se carga al arrancar porque la consulta ocurre en las fases 1–4b.
let _grabMod = null;
function _iniciarGrabadora() {
  if (_enHub()) return;
  import('./grabadora.js')
    .then(m => { _grabMod = m; m.iniciarGrabadora(); })
    .catch(() => {});
}
// Para los textos de confirmación de reiniciar/borrar sesión.
function _avisoAudioSesion() {
  if (!_grabMod?.hayAudio()) return '';
  return _grabMod.grabando()
    ? ' También se detendrá y descartará la grabación en curso.'
    : ' También se descartará el audio grabado de la sesión.';
}
function _descartarAudioSesion() {
  _grabMod?.descartarTodo();
}
function _montarInformeIA() {
  if (_enHub()) return;
  _cargarInformeIA()
    .then(m => m.montarInformeIA(document.getElementById('informeIA')))
    .catch(() => {});
}
function informeFormularioPrevio() {
  return _fpMod ? _fpMod.informeFormularioPrevio() : { historia: [], antecedentes: [] };
}

// ─── QUICK INPUT (chips de frases + dictado por voz) ──────────
function isSpeechSupported() {
  return typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function _escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function _renderChipRow(fieldId, phrases) {
  const chips = phrases.map(p => {
    const esc = _escapeAttr(p);
    return `<button type="button" class="chip-btn" data-field="${fieldId}" data-phrase="${esc}" onclick="appendQuickPhrase(this)">${esc}</button>`;
  }).join('');
  return chips ? `<div class="chip-row">${chips}</div>` : '';
}

function _renderMicButton(fieldId) {
  return isSpeechSupported()
    ? `<button type="button" class="mic-btn" data-field="${fieldId}" onclick="toggleDictation(this)" title="Dictar por voz" aria-label="Dictar por voz">🎤</button>`
    : '';
}

// `phrases` overrides QUICK_PHRASES[fieldId] — used by dynamically rendered
// fields (formulario previo) that carry their own chips in their schema.
// Kept as a single bar (chips + mic together, after the field) for fields
// built as an HTML string (phase 5 plan notes) where there's no `<label
// for>` to hang the mic button off of.
function renderQuickInputBar(fieldId, phrases = (typeof QUICK_PHRASES !== 'undefined' && QUICK_PHRASES[fieldId]) || []) {
  const chips = _renderChipRow(fieldId, phrases);
  const mic = _renderMicButton(fieldId);
  if (!chips && !mic) return '';
  return `<div class="quick-input-bar">${chips}${mic}</div>`;
}

// Mic goes next to the field's question (inside its `<label for="fieldId">`,
// right-aligned) rather than in the bar below — that bar only exists for
// chips, so a field with a mic but no chips (most `texto` items in the
// formulario previo) never renders an orphan circular button on its own row.
// Falls back to the old combined bar when no matching `<label for>` is found.
function injectQuickInputBar(fieldId, phrases) {
  const field = document.getElementById(fieldId);
  if (!field || field.dataset.quickBarInjected) return;
  const finalPhrases = phrases || (typeof QUICK_PHRASES !== 'undefined' && QUICK_PHRASES[fieldId]) || [];
  const chipsHtml = _renderChipRow(fieldId, finalPhrases);
  const micHtml = _renderMicButton(fieldId);
  if (!chipsHtml && !micHtml) return;

  const label = document.querySelector(`label[for="${fieldId}"]`);
  if (micHtml && label) {
    label.classList.add('label-with-mic');
    label.insertAdjacentHTML('beforeend', micHtml);
    if (chipsHtml) field.insertAdjacentHTML('afterend', `<div class="quick-input-bar">${chipsHtml}</div>`);
  } else {
    // No label to attach the mic to — keep the old combined bar so the
    // button doesn't get lost.
    field.insertAdjacentHTML('afterend', `<div class="quick-input-bar">${chipsHtml}${micHtml}</div>`);
  }
  field.dataset.quickBarInjected = '1';
  wireQuickInputBar(fieldId);
}

function initQuickInputBars() {
  ['motivoConsulta', 'signoComparable', 'cirIntervencion', 'cirRestricciones'].forEach(id => injectQuickInputBar(id));
}

// A chip's phrase already sitting in the field is spent: dim it and block
// re-adding it, until the phrase is edited/deleted out of the field again.
function syncQuickPhraseChips(fieldId) {
  const field = document.getElementById(fieldId);
  const bar = field && field.nextElementSibling;
  if (!bar || !bar.classList.contains('quick-input-bar')) return;
  const value = field.value.toLowerCase();
  bar.querySelectorAll('.chip-btn').forEach(chip => {
    const used = value.includes(chip.dataset.phrase.toLowerCase());
    chip.classList.toggle('used', used);
    chip.disabled = used;
  });
}

function wireQuickInputBar(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  syncQuickPhraseChips(fieldId);
  field.addEventListener('input', () => syncQuickPhraseChips(fieldId));
}

function appendQuickPhrase(btn) {
  if (btn.disabled) return;
  const field = document.getElementById(btn.dataset.field);
  if (!field) return;
  const sep = field.value && !/\s$/.test(field.value) ? ' ' : '';
  const phrase = btn.dataset.phrase;
  const suffix = /[.!?]$/.test(phrase) ? '' : '.';
  field.value = field.value + sep + phrase + suffix;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.focus();
}

function toggleDictation(btn) {
  const field = document.getElementById(btn.dataset.field);
  if (!field) return;
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) return;

  if (btn._recognition) {
    btn._recognition.stop();
    return;
  }

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = 'es-ES';
  recognition.interimResults = true;
  recognition.continuous = true;

  const baseValue = field.value;
  const baseSep = baseValue && !/\s$/.test(baseValue) ? ' ' : '';
  let committed = '';
  let current = '';

  function wordsOf(s) { return s.trim().split(/\s+/).filter(Boolean); }

  // Does `words` begin with every word in `prefixWords` (word-for-word)?
  // Word-level, not character-level: a raw substring check would wrongly treat
  // an unrelated short word like "es" as "already contained" in "esto".
  function extendsPrefix(words, prefixWords) {
    if (prefixWords.length > words.length) return false;
    for (let i = 0; i < prefixWords.length; i++) {
      if (words[i].toLowerCase() !== prefixWords[i].toLowerCase()) return false;
    }
    return true;
  }

  recognition.onresult = (e) => {
    if (!e.results.length) return;
    // Only the newest entry (last index) is used as the live utterance text.
    // Some engines (seen on Android Chrome) treat every array entry as an
    // independent segment even when it's really a growing restatement of the
    // same phrase ("esto", "esto es", "esto es una", ...) — summing entries,
    // whether by resultIndex or by re-walking the whole list, duplicates that
    // growth. Comparing only the newest entry against what's already shown,
    // and "committing" it as done only once a genuinely different (non
    // -extending) segment shows up, handles both that quirk and normal
    // multi-sentence continuous dictation.
    const text = e.results[e.results.length - 1][0].transcript.trim();
    if (current && !extendsPrefix(wordsOf(text), wordsOf(current))) {
      committed = committed ? committed + ' ' + current : current;
    }
    current = text;

    const combined = committed ? (current ? committed + ' ' + current : committed) : current;
    field.value = baseValue + baseSep + combined;
    field.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const DICTATION_ERROR_MESSAGES = {
    'not-allowed': 'Permiso de micrófono denegado. Actívalo en los ajustes del navegador.',
    'service-not-allowed': 'Permiso de micrófono denegado. Actívalo en los ajustes del navegador.',
    'audio-capture': 'No se ha detectado ningún micrófono.',
    'network': 'Error de red durante el dictado. Inténtalo de nuevo.'
  };

  recognition.onerror = (e) => {
    btn.classList.remove('listening');
    btn._recognition = null;
    const msg = DICTATION_ERROR_MESSAGES[e.error];
    if (msg) showToast(msg, 'warning');
  };

  recognition.onend = () => {
    btn.classList.remove('listening');
    btn._recognition = null;
  };

  btn._recognition = recognition;
  try {
    recognition.start();
    btn.classList.add('listening');
  } catch (err) {
    btn._recognition = null;
    showToast('No se pudo iniciar el dictado por voz.', 'warning');
  }
}

// ─── PHASE 1 HELPERS ─────────────────────────────────────────
function selectOption(groupId, btn, value) {
  const group = document.getElementById(groupId);
  const alreadySelected = btn.classList.contains('selected');
  if (group) {
    group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  }
  if (alreadySelected) {
    // Clicking the selected option again un-answers this field instead of
    // re-selecting it — the only way to undo it otherwise is a full reset.
    state[groupId] = '';
  } else {
    btn.classList.add('selected');
    state[groupId] = value;
  }
  if (groupId === 'psico_miedo' || groupId === 'psico_autoef' || groupId === 'psico_emocional') {
    updatePsicoRecomendacion();
  }
  if (groupId === 'mecanismo') {
    _pintarCirugiaUI();
    // El sistema posquirúrgico aparece o desaparece del cribado ya pintado
    if (state.region && document.getElementById('sistemaPanels')?.children.length) _repintarCribado();
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
  const alreadySelected = btn.classList.contains('selected');
  document.querySelectorAll('#riesgoPsico .option-btn').forEach(b => b.classList.remove('selected'));

  const suggest = document.getElementById('psicoToolSuggest');
  const altoQ = document.getElementById('psicoAltoQuestions');

  if (alreadySelected) {
    state.riesgoPsico = '';
    suggest.style.display = 'none';
    altoQ.style.display = 'none';
    saveSession();
    return;
  }

  btn.classList.add('selected');
  state.riesgoPsico = value;

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

// ─── PACIENTE POSQUIRÚRGICO (docs/posquirurgico.md) ──────────
// Con mecanismo Post-quirúrgico aparece la tarjeta «Cirugía» y el resto de
// la app supedita el plan al protocolo del cirujano. Lo visual cuelga de
// body.posquirurgico (CSS .solo-posq); los datos de la tarjeta se conservan
// si se cambia el mecanismo, pero ningún resumen los usa mientras no sea
// Post-quirúrgico.
function _pintarCirugiaUI() {
  document.body.classList.toggle('posquirurgico', esPosquirurgico(state.mecanismo));
  const cir = state.cirugia;
  const set = (id, v) => { const el = document.getElementById(id); if (el && el.value !== String(v ?? '')) el.value = v ?? ''; };
  set('cirIntervencion', cir.intervencion);
  set('cirFecha', cir.fecha);
  set('cirSemanas', cir.semanasAprox);
  set('cirRestricciones', cir.restricciones);
  set('cirCompOtra', cir.complicacionOtra);
  document.querySelectorAll('#cirProtocolo .option-btn').forEach(b => {
    b.classList.toggle('selected', b.textContent.trim() === cir.protocolo);
  });
  const comp = document.getElementById('cirComplicaciones');
  if (comp) {
    comp.innerHTML = COMPLICACIONES.map(c =>
      `<button type="button" class="option-btn${cir.complicaciones.includes(c.id) ? ' selected' : ''}" onclick="toggleCirComplicacion('${c.id}')">${c.label}</button>`
    ).join('');
  }
  _pintarCirugiaDerivados();
}

// Lo que depende de varios campos: semanas calculadas y aviso sin protocolo.
function _pintarCirugiaDerivados() {
  const sem = document.getElementById('cirSemanasTxt');
  if (sem) {
    const n = semanasCirugia(state.cirugia);
    sem.textContent = n == null ? '' : `${semanasTexto(n)} desde la cirugía${state.cirugia.fecha ? '' : ' (aprox.)'}`;
  }
  const aviso = document.getElementById('cirSinProtocolo');
  if (aviso) {
    aviso.innerHTML = state.cirugia.protocolo === 'No hay'
      ? `<div class="alert alert-warning" style="margin-top:10px;"><span class="alert-icon">⚠️</span><div>${TEXTO_SIN_PROTOCOLO} antes de progresar carga o rango.</div></div>`
      : '';
  }
}

function updateCirugia(campo, valor) {
  if (campo === 'semanasAprox') valor = valor === '' ? null : Number(valor);
  state.cirugia[campo] = valor;
  if (campo === 'fecha' || campo === 'semanasAprox') _pintarCirugiaDerivados();
  saveSession();
}

function selectCirProtocolo(btn, valor) {
  state.cirugia.protocolo = state.cirugia.protocolo === valor ? '' : valor;
  document.querySelectorAll('#cirProtocolo .option-btn').forEach(b => {
    b.classList.toggle('selected', b.textContent.trim() === state.cirugia.protocolo);
  });
  _pintarCirugiaDerivados();
  saveSession();
}

// «Ninguna» excluye a las demás, y marcar cualquier otra quita «Ninguna».
function toggleCirComplicacion(id) {
  const actual = state.cirugia.complicaciones;
  let nuevas;
  if (actual.includes(id)) nuevas = actual.filter(x => x !== id);
  else if (id === 'ninguna') nuevas = ['ninguna'];
  else nuevas = [...actual.filter(x => x !== 'ninguna'), id];
  state.cirugia.complicaciones = nuevas;
  _pintarCirugiaUI();
  saveSession();
}

// Payload `cq` (null fuera del posquirúrgico).
function getCirugiaPayload() {
  return cirugiaPayload(state.mecanismo, state.cirugia);
}

// «Ya diagnosticada y tratada» (casilla en la 4b y en la fase 5; decisión 5).
// No depende del mecanismo: también vale para una fractura con yeso o una
// gota ya en tratamiento.
function toggleDiagnosticoTratado(hId, valor) {
  marcarTratada(hId, valor);
  const cards = document.getElementById('hypothesisCards');
  if (cards && cards.children.length) {
    const abierta = document.getElementById(`hypcard_${hId}`)?.classList.contains('open');
    teardownHypObserver();
    buildHypothesisCards();
    if (abierta) window.toggleHypCard?.(hId);
  }
  const results = document.getElementById('resultsContent');
  if (results && results.children.length) buildResults();
  saveSession();
}

// ─── MODO BREVE (consulta de aseguradora, 10 min) ────────────
// docs/modo-breve.md. El modo solo cambia qué se muestra y cómo se resume:
// banderas rojas, urgencias y árbol CIF funcionan igual en los dos modos.
// Lo que el modo breve deja sin hacer sale como pendiente (getPendientesBreve)
// en la fase 1, la fase 5, 📋 Notas, 📄 Informe y el payload (`pe`).
function selectModo(modo) {
  if (modo !== 'breve' && modo !== 'completo') return;
  if (modo === state.modo) return;
  const pendientes = getPendientesBreve();
  // Pasar de breve a completo con pendientes: el resumen dejará de decir que
  // la valoración fue breve, así que se pide confirmación explícita.
  if (state.modo === 'breve' && modo === 'completo' && pendientes.length && state.maxVisitedIdx >= 1) {
    showConfirmBanner(
      'Pasar a consulta completa',
      `Las notas y el informe dejarán de indicar que la valoración fue breve. Complete antes estos pendientes: ${pendientes.map(p => p.texto).join(' · ')}.`,
      'Pasar a completa',
      () => _aplicarModo('completo')
    );
    return;
  }
  _aplicarModo(modo);
}

function _aplicarModo(modo) {
  state.modo = modo;
  _pintarModoUI();
  // La 4b ordena los tests según el modo: se reconstruye al volver a entrar
  const hypCards = document.getElementById('hypothesisCards');
  if (hypCards) hypCards.innerHTML = '';
  const results = document.getElementById('resultsContent');
  if (results && results.children.length) buildResults();
  saveSession();
}

// Refleja state.modo en el DOM: clase del body, selector de la fase 1 y
// aviso de pendientes. Llamado al cambiar de modo y al restaurar sesión.
function _pintarModoUI() {
  const breve = state.modo === 'breve';
  document.body.classList.toggle('modo-breve', breve);
  if (!breve) document.body.classList.remove('breve-ver-todo');
  document.querySelectorAll('#modoConsulta .option-btn').forEach(b => {
    const m = (b.getAttribute('onclick') || '').match(/selectModo\('(\w+)'\)/);
    b.classList.toggle('selected', !!(m && m[1] === state.modo));
  });
  renderBrevePendientes();
}

// «+ Mostrar campos opcionales»: no se guarda en la sesión (es solo vista).
function toggleBreveVerTodo() {
  document.body.classList.toggle('breve-ver-todo');
}

// Lo que el modo breve ha dejado sin hacer. [] en modo completo.
// Cada pendiente: { texto, fase } — fase = adónde lleva «Completar».
function getPendientesBreve() {
  if (state.modo !== 'breve') return [];
  const pendientes = [];
  const data = SYSTEMIC_SCREENING[state.region];
  if (data) {
    const porEmbudo = sistemasActivos().filter(s => state.sistemicoBreve[s.id] === 'NO').map(s => s.nombre);
    const sinCribar = sistemasActivos().filter(s => !state.sistemicoBreve[s.id]).map(s => s.nombre);
    if (porEmbudo.length) pendientes.push({ fase: 2, texto: `Cribado sistémico solo por embudo (sin preguntas una a una): ${porEmbudo.join(', ')}` });
    if (sinCribar.length) pendientes.push({ fase: 2, texto: `Sistemas sin cribar: ${sinCribar.join(', ')}` });
  } else if (state.maxVisitedIdx >= 1) {
    pendientes.push({ fase: 2, texto: 'Cribado sistémico sin hacer (falta la región)' });
  }
  if (state.irritabilidadDirecta) pendientes.push({ fase: 3, texto: 'Irritabilidad estimada sin la matriz' });
  const sinTests = state.activeHypotheses
    .filter(h => HYPOTHESES[h] && !esTratada(h) && !Object.values(state.testResults[h] || {}).some(r => r === 'pos' || r === 'neg'))
    .map(h => HYPOTHESES[h].name);
  if (sinTests.length) pendientes.push({ fase: '4b', texto: `Tests de confirmación sin hacer: ${sinTests.join(', ')}` });
  if (!resumenFormularioPrevio().length) pendientes.push({ fase: 1, texto: 'Formulario previo sin rellenar' });
  if (esPosquirurgico(state.mecanismo) && !conProtocolo(state.cirugia)) {
    pendientes.push({ fase: 1, ancla: 'cardCirugia', texto: `${TEXTO_SIN_PROTOCOLO} (sin protocolo)` });
  }
  return pendientes;
}

function _pendientesHTML(pendientes) {
  return `<ul>${pendientes.map(p => `<li>${p.texto}</li>`).join('')}</ul>`;
}

// Aviso de la fase 1: valoración breve ya avanzada con pendientes.
function renderBrevePendientes() {
  const el = document.getElementById('brevePendientes');
  if (!el) return;
  const pendientes = state.maxVisitedIdx >= 2 ? getPendientesBreve() : [];
  el.innerHTML = pendientes.length ? `<div class="breve-pendientes">
      <div class="breve-pendientes-title">⏱ Valoración breve con ${pendientes.length} pendiente${pendientes.length > 1 ? 's' : ''}</div>
      ${_pendientesHTML(pendientes)}
      <button class="btn btn-secondary" onclick="completarPendientesBreve()">Completar pendientes →</button>
    </div>` : '';
}

// Lleva al primer pendiente sin cambiar de modo: el clínico pasa a
// «Completa» cuando lo haya revisado todo (selectModo pide confirmación).
function completarPendientesBreve() {
  document.body.classList.add('breve-ver-todo');
  const [primero] = getPendientesBreve();
  if (!primero) return;
  if (primero.fase === 1) {
    if (state.currentPhase !== 1) goToPhase(1);
    if (primero.ancla) document.getElementById(primero.ancla)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else abrirFormularioPrevio('comun');
    return;
  }
  const idx = { 2: 1, 3: 2, '4b': 4 }[primero.fase];
  if (idx !== undefined && idx <= state.maxVisitedIdx) goToPhase(primero.fase);
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

// Estadio del SINSS = la cronología de la fase 1 (mismas categorías). Se
// muestra de solo lectura para no preguntar dos veces lo mismo.
function _pintarEstadioCronologia() {
  const el = document.getElementById('estadioCronologia');
  if (!el) return;
  const icono = { 'Agudo (<6 semanas)': '🔴', 'Subagudo': '🟡', 'Crónico (>3 meses)': '🔵' }[state.cronologia];
  el.innerHTML = state.cronologia
    ? `<span class="estadio-valor">${icono || ''} ${_escapeAttr(state.cronologia)}</span><span class="estadio-fuente">Según la cronología de la fase 1</span>`
    : `<span class="estadio-fuente">Sin cronología: indíquela en la fase 1.</span>`;
  el.innerHTML += `<button type="button" class="estadio-editar" onclick="irACronologia()">${state.cronologia ? 'Cambiar' : 'Indicar'} en la fase 1 →</button>`;
}

// Enlace de la tarjeta Estadio (fase 3): vuelve a la fase 1 y lleva al campo.
function irACronologia() {
  goToPhase(1);
  setTimeout(() => {
    const card = document.getElementById('cardCronologia');
    if (!card) return;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('flash-destacar');
    void card.offsetWidth;
    card.classList.add('flash-destacar');
  }, 150);
}

function resetPhase3UI() {
  // Reset state
  state.naturaleza = '';
  state.estabilidad = '';
  state.signoComparable = '';
  state.severidad = null;
  state.irritabilidad = { dolor: 'Baja (≤3/10)', reposo: 'Ausente', movimiento: 'Al final del rango con SP', discapacidad: 'Mínima', tolerancia: 'Alta' };
  state.irritabilidadNivel = null;
  state.irritabilidadDirecta = false;

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
  _pintarLado();
  buildSistemicoQuestions(regionId);
  precargarFormularioPrevio();
  saveSession();
}

// Sistemas que se ven en la región: el posquirúrgico (`soloPosquirurgico`)
// solo con mecanismo Post-quirúrgico, y de cada sistema solo las preguntas de
// esa región (`regiones`; sin él, todas). Todo lo que lee el cribado (alerta,
// urgencias, payload, pendientes) pasa por aquí, así que una respuesta de un
// sistema que ya no se ve no cuenta.
function sistemasActivos(regionId = state.region) {
  const data = SYSTEMIC_SCREENING[regionId];
  if (!data) return [];
  return data.sistemas
    .filter(sis => !sis.soloPosquirurgico || esPosquirurgico(state.mecanismo))
    .map(sis => sis.preguntas.some(q => q.regiones)
      ? { ...sis, preguntas: sis.preguntas.filter(q => !q.regiones || q.regiones.includes(regionId)) }
      : sis);
}

// Respuestas del cribado de las preguntas que se ven ahora.
function _respuestasActivas() {
  const ids = new Set(sistemasActivos().flatMap(sis => sis.preguntas.map(q => q.id)));
  return Object.entries(state.sistemicoAnswers).filter(([id]) => ids.has(id));
}

// Repinta el cribado conservando las respuestas (restaurar sesión, cambiar el
// mecanismo con la región ya elegida); las preguntas nuevas empiezan en NO.
function _repintarCribado() {
  if (!state.region) return;
  const savedAnswers = { ...state.sistemicoAnswers };
  const savedBreve = { ...(state.sistemicoBreve || {}) };
  buildSistemicoQuestions(state.region);
  Object.assign(state.sistemicoAnswers, savedAnswers);
  state.sistemicoBreve = savedBreve;
  Object.entries(state.sistemicoAnswers).forEach(([qId, answer]) => {
    const sq2 = document.getElementById(`sq2_${qId}`);
    if (!sq2) return;
    sq2.querySelectorAll('.sq-btn').forEach(btn => {
      const m = (btn.getAttribute('onclick') || '').match(/'(SI|NO)'/);
      if (m) btn.classList.toggle('selected', m[1] === answer);
    });
  });
  sistemasActivos().forEach(sis => {
    const alerta = sis.preguntas.some(q => state.sistemicoAnswers[q.id] === 'SI');
    document.getElementById(`tab_${sis.id}`)?.classList.toggle('has-alert', alerta);
    document.getElementById(`acc_${sis.id}`)?.classList.toggle('has-alert', alerta);
  });
  evaluarCriteriosCompuestos(state.region);
  sistemasActivos().forEach(sis => _pintarEmbudo(sis.id));
  updateSistemicoAlert();
}

function buildSistemicoQuestions(regionId) {
  const data = SYSTEMIC_SCREENING[regionId];
  if (!data) return;
  const sistemas = sistemasActivos(regionId);

  const wrap = document.getElementById('sistemicoQuestions');
  const tabsContainer = document.getElementById('sistemaTabs');
  const panelsContainer = document.getElementById('sistemaPanels');
  const title = document.getElementById('sistemicoTitle');

  cerrarRazonamiento({ sinHistorial: true });
  title.textContent = `Cribado Sistémico — ${data.label}`;
  renderUrgenciaRegion(data);
  tabsContainer.innerHTML = '';
  panelsContainer.innerHTML = '';
  state.sistemicoAnswers = {};
  state.sistemicoBreve = {};

  // Initialize all answers to NO
  sistemas.forEach(sis => {
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
  sistemas.forEach((sis, idx) => {
    // ── DESKTOP: Tab
    const tab = document.createElement('button');
    tab.className = 'sistema-tab' + (idx === 0 ? ' active' : '');
    tab.id = `tab_${sis.id}`;
    tab.innerHTML = `<span class="tab-dot"></span>${sis.icon} ${sis.nombre}<span class="embudo-estado" title="Cribado por embudo: sin hallazgos">✓</span>`;
    tab.onclick = () => activeSistemaTab(sis.id, sistemas);
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
      <div class="sistema-accordion-header" onclick="toggleAccordionRow('${sis.id}', '${sistemas.map(s=>s.id).join(',')}')">
        <span class="sistema-accordion-icon">${sis.icon}</span>
        <span class="sistema-accordion-name">${sis.nombre}<span class="embudo-estado" title="Cribado por embudo: sin hallazgos">✓</span></span>
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
  evaluarCriteriosCompuestos(regionId);
  sistemas.forEach(sis => _pintarEmbudo(sis.id));
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

  // Modo breve: un SÍ/NO por sistema leyendo sus banderas rojas (embudo).
  // Con NO se pliegan las preguntas del sistema salvo las de `urgencia`, que
  // se ven siempre. Oculto por CSS en modo completo.
  const tieneUrg = sis.preguntas.some(q => q.urgencia);
  html += `<div class="embudo" data-embudo="${sis.id}">
      <span class="embudo-q">¿Presenta alguna de estas banderas rojas?
        <span class="embudo-nota">SÍ abre las preguntas de este sistema una a una.${tieneUrg ? ' Las preguntas de urgencia se hacen siempre.' : ''}</span></span>
      <div class="sq-btns">
        <button class="sq-btn si" onclick="selectEmbudo('${sis.id}','SI')">SÍ</button>
        <button class="sq-btn no" onclick="selectEmbudo('${sis.id}','NO')">NO</button>
      </div>
    </div>
    <div class="sis-body${tieneUrg ? ' tiene-urg' : ''}" data-sis-body="${sis.id}">`;

  // Screening questions
  html += `<div class="screening-section-title">❓ Preguntas de Cribado</div>`;
  sis.preguntas.forEach((q, qi) => {
    const urgBadge = q.urgencia ? `<span class="sq2-urg-badge">Urgencia</span>` : '';
    html += `
      <div class="sq2${q.alerta ? ' alerta-high' : ''}${q.urgencia ? ' sq2-urg' : ''}" id="sq2_${q.id}">
        <div class="sq2-badge${q.alerta ? ' alerta' : ''}">${qi + 1}</div>
        <div class="sq2-text">${q.text}${urgBadge}${q.urgencia ? `<span class="sq2-urg-msg">🚨 ${q.urgencia}</span>` : ''}${q.notaPosquirurgica ? `<div class="nota-posq solo-posq">🏥 ${TEXTO_NOTA_TRAUMA}</div>` : ''}${razonamientoInlineHTML(sis, q)}</div>
        <div class="sq-btns">
          <button class="sq-btn si" onclick="selectSistQ(this,'${q.id}','SI',${q.alerta},'${sis.id}')">SÍ</button>
          <button class="sq-btn no selected" onclick="selectSistQ(this,'${q.id}','NO',${q.alerta},'${sis.id}')">NO</button>
        </div>
      </div>`;
  });

  // Composite screening criterion (e.g. Goodman's inflammatory-back-pain
  // 2-of-4 rule) — gated on demographics the individual SI/NO questions
  // above can't express by themselves. Rendered once per system that
  // declares one; evaluated by evaluarCriterioCompuesto() after every
  // relevant answer or edad change, never at build time (answers aren't
  // known yet here). Edad itself is collected in Fase 1 (#edadPaciente),
  // not here — this only renders the resulting banner (or a hint when
  // edad is still missing).
  if (sis.criterioCompuesto) {
    html += `<div id="criterioCompuesto_${sis.id}" class="criterio-compuesto-alert"></div>`;
  }

  html += `<div class="sis-extra">`;
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
  html += `</div></div>`;   // .sis-extra, .sis-body
  return html;
}

// ─── RAZONAMIENTO DEL CRIBADO (fase 2) ───────────────────────
// Por qué se hace cada pregunta y cuánto pesa un SÍ (docs/razonamiento-cribado.md).
// Material de apoyo al clínico: nunca entra en el payload ni en los resúmenes.
// Nivel 1: <details> cerrado bajo la pregunta. Nivel 2 (`detalle`): panel
// lateral sin velo en escritorio (se sigue contestando con él abierto) y
// bottom sheet con velo en móvil. Una pregunta sin `razonamiento` no pinta nada.
const _esMovil = () => window.matchMedia ? window.matchMedia('(max-width: 768px)').matches : false;
let _razonOrigen = null;       // botón «Ampliar» que abrió el panel (para devolverle el foco)
let _razonHistorial = false;   // el sheet móvil empujó una entrada al historial
let _razonPopIgnorar = false;  // el próximo popstate es nuestro history.back(), no el usuario

function razonamientoInlineHTML(sis, q) {
  const r = q.razonamiento;
  if (!r) return '';
  const ampliar = r.detalle
    ? ` <button type="button" class="razon-ampliar" onclick="abrirRazonamiento(this,'${sis.id}','${q.id}')">Ampliar →</button>`
    : '';
  return `<details class="razon">
      <summary>ⓘ ¿Por qué?</summary>
      <div class="razon-cuerpo">
        <p><span class="razon-etq">Por qué</span> ${r.porque}</p>
        <p><span class="razon-etq">Cuánto pesa</span> ${r.peso}</p>
        <div class="razon-pie">— ${r.fuentes.join(' · ')}${ampliar}</div>
      </div>
    </details>`;
}

// «Fisiología, paso a paso»: la cadena causal del mecanismo al síntoma, cada
// paso con su fuente leída; la metáfora es un extra divulgativo que va después
// y nunca sustituye a la cadena; `nota` dice lo que la fuente no explica.
function razonFisiologiaHTML(f) {
  if (!f) return '';
  return `<div class="razon-seccion razon-fisio"><div class="razon-etq">Fisiología, paso a paso</div>
      <ol class="razon-pasos">${f.pasos.map(p => `<li>${p}</li>`).join('')}</ol>
      ${f.nota ? `<p class="razon-fisio-nota">${f.nota}</p>` : ''}
      ${f.metafora ? `<p class="razon-metafora"><span aria-hidden="true">💡</span> ${f.metafora}</p>` : ''}
    </div>`;
}

// Una cita es un texto o { texto, url }: el enlace abre el artículo (PMC, DOI,
// NCBI Bookshelf) en otra pestaña; tests/unit.js comprueba que coincide con el
// `url` del registro data/referencias.js.
function razonCitaHTML(c) {
  if (typeof c === 'string') return `<li>${c}</li>`;
  return `<li>${c.texto} <a class="razon-enlace" href="${c.url}" target="_blank" rel="noopener noreferrer">Abrir ↗</a></li>`;
}

function _buscarPregunta(sisId, qId) {
  const sis = (SYSTEMIC_SCREENING[state.region]?.sistemas || []).find(s => s.id === sisId);
  const q = sis?.preguntas.find(p => p.id === qId);
  return q ? { sis, q } : null;
}

function abrirRazonamiento(btn, sisId, qId) {
  const hit = _buscarPregunta(sisId, qId);
  const r = hit?.q.razonamiento;
  if (!r || !r.detalle) return;
  const panel = document.getElementById('razonPanel');
  const yaAbierto = panel.classList.contains('open');
  document.getElementById('razonPregunta').textContent = hit.q.text;
  const parrafos = r.detalle.split('\n\n').map(p => `<p>${p}</p>`).join('');
  document.getElementById('razonContenido').innerHTML = `
    <div class="razon-seccion"><div class="razon-etq">Por qué</div><p>${r.porque}</p></div>
    <div class="razon-seccion"><div class="razon-etq">Cuánto pesa</div><p>${r.peso}</p></div>
    ${razonFisiologiaHTML(r.fisiologia)}
    <div class="razon-seccion"><div class="razon-etq">En detalle</div>${parrafos}</div>
    <div class="razon-seccion razon-fuentes"><div class="razon-etq">Fuentes</div>
      <ul>${(r.citas || r.fuentes).map(razonCitaHTML).join('')}</ul></div>`;
  document.getElementById('razonContenido').scrollTop = 0;
  _razonOrigen = btn || null;
  // Otra pregunta con el panel ya abierto: solo cambia el contenido.
  if (!yaAbierto) {
    const movil = _esMovil();
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    panel.setAttribute('aria-modal', movil ? 'true' : 'false');
    document.body.classList.add('razon-abierto');
    if (movil) {
      document.getElementById('razonScrim').classList.add('open');
      lockBodyScroll();
      window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
      // El botón atrás del móvil cierra el sheet en vez de cambiar de fase.
      history.pushState({ phase: state.currentPhase, razon: true }, '');
      _razonHistorial = true;
    }
  }
  document.getElementById('razonCerrar').focus({ preventScroll: true });
}

// `desdeHistorial`: lo llama el popstate del botón atrás (la entrada ya salió
// del historial). `sinHistorial`: cierre forzado (el hub nos oculta, cambio de
// fase o de región) sin tocar el historial.
function cerrarRazonamiento({ desdeHistorial = false, sinHistorial = false } = {}) {
  const panel = document.getElementById('razonPanel');
  if (!panel || !panel.classList.contains('open')) return;
  const scrim = document.getElementById('razonScrim');
  const eraModal = scrim.classList.contains('open');
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  panel.style.transform = ''; panel.style.transition = '';
  scrim.classList.remove('open');
  document.body.classList.remove('razon-abierto');
  if (eraModal) { unlockBodyScroll(); window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*'); }
  if (_razonHistorial) {
    _razonHistorial = false;
    if (!desdeHistorial && !sinHistorial) { _razonPopIgnorar = true; history.back(); }
  }
  if (_razonOrigen && document.contains(_razonOrigen) && !sinHistorial) _razonOrigen.focus({ preventScroll: true });
  _razonOrigen = null;
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('razonPanel')?.classList.contains('open')) cerrarRazonamiento();
});

// Evaluates one system's criterioCompuesto (if it has one) and (re)renders
// its banner. Uses querySelectorAll rather than getElementById for the
// banner container: buildSistemaHTML's output is inserted twice (desktop
// tab panel + mobile accordion, see buildSistemicoQuestions), so both
// markup copies carry the same id and only querySelectorAll reaches both —
// getElementById would silently only ever touch whichever copy comes first
// in the DOM.
function evaluarCriterioCompuesto(sis) {
  const criterio = sis.criterioCompuesto;
  if (!criterio) return;
  const contenedores = document.querySelectorAll(`#criterioCompuesto_${sis.id}`);
  if (!contenedores.length) return;

  const edad = state.edadPaciente;
  const edadConocida = edad !== null && edad !== undefined && !isNaN(edad);
  const cumpleFiltro = edadConocida && edad < criterio.filtro.edadMax && state.cronologia === criterio.filtro.evolucion;
  const positivas = criterio.ids.filter(id => state.sistemicoAnswers[id] === 'SI').length;
  const cumpleCriterio = cumpleFiltro && positivas >= criterio.minPositivas;

  let html = '';
  if (cumpleCriterio) {
    html = `<div class="alert alert-warning">
        <span class="alert-icon">⚠️</span>
        <div><strong>${criterio.etiqueta}</strong> (${positivas}/${criterio.ids.length})
          <div style="font-size:0.82rem; color:var(--text2); margin-top:4px;">${criterio.nota}</div>
        </div>
      </div>`;
  } else if (!edadConocida) {
    html = `<div class="criterio-compuesto-hint">Indique la edad del paciente en la Fase 1 para poder aplicar este criterio.</div>`;
  }
  contenedores.forEach(c => { c.innerHTML = html; });
}

// Re-evaluates every criterioCompuesto in the current region — called after
// building the panels (buildSistemicoQuestions) and after restoring a saved
// session (_restoreSessionDOM), where sistemicoAnswers/edadPaciente only
// reach their real values after the panels already exist.
function evaluarCriteriosCompuestos(regionId) {
  const data = SYSTEMIC_SCREENING[regionId];
  if (!data) return;
  data.sistemas.forEach(sis => { if (sis.criterioCompuesto) evaluarCriterioCompuesto(sis); });
}

function updateEdadPaciente(value) {
  const edad = value === '' ? null : parseInt(value, 10);
  state.edadPaciente = (edad === null || isNaN(edad)) ? null : edad;
  evaluarCriteriosCompuestos(state.region);
  saveSession();
}

// IMC is derived from talla/peso, never persisted in state — storing it
// separately would risk it going stale whenever either input is edited.
function calcImc(peso, talla) {
  if (!peso || !talla) return null;
  const m = talla / 100;
  return peso / (m * m);
}

// Rough resting-adult reference ranges, for visual flagging only (none of
// this feeds an algorithm) — below redLo or above redHi is red (alert),
// within greenLo..greenHi is green (normal), the two bands in between are
// orange (caution). loLabel/hiLabel name the out-of-range direction shown
// under the field (same label for the orange and red case — severity is
// already carried by color, not by wording).
const VITAL_BANDS = {
  fc:   { redLo: 50, greenLo: 60, greenHi: 100, redHi: 120, loLabel: 'Bradicardia',  hiLabel: 'Taquicardia' },
  fr:   { redLo: 8,  greenLo: 12, greenHi: 20,  redHi: 24,  loLabel: 'Bradipnea',    hiLabel: 'Taquipnea' },
  spo2: { redLo: 90, greenLo: 95, greenHi: 100, redHi: 100, loLabel: 'Hipoxemia' },
  tas:  { redLo: 70, greenLo: 90, greenHi: 139, redHi: 180, loLabel: 'Hipotensión',  hiLabel: 'Hipertensión' },
  tad:  { redLo: 40, greenLo: 60, greenHi: 89,  redHi: 110, loLabel: 'Hipotensión',  hiLabel: 'Hipertensión' },
};
const VITAL_INPUT_IDS = { fc: 'vitalFc', fr: 'vitalFr', spo2: 'vitalSpo2', tas: 'vitalTas', tad: 'vitalTad' };
const VITAL_FLAG_IDS = { fc: 'flagFc', fr: 'flagFr', spo2: 'flagSpo2', tas: 'flagTas', tad: 'flagTad', imc: 'flagImc' };

function bandCategory(value, bands) {
  if (value < bands.redLo) return { cls: 'vital-red', label: bands.loLabel };
  if (value > bands.redHi) return { cls: 'vital-red', label: bands.hiLabel };
  if (value < bands.greenLo) return { cls: 'vital-orange', label: bands.loLabel };
  if (value > bands.greenHi) return { cls: 'vital-orange', label: bands.hiLabel };
  return { cls: 'vital-green', label: null };
}

// IMC gets its own categorizer rather than VITAL_BANDS: sobrepeso and
// obesidad are different WHO categories, not "mild vs severe" of the same
// one, so a single hiLabel (as the other fields use) can't name both.
function imcCategory(imc) {
  if (imc < 18.5) return { cls: 'vital-orange', label: 'Bajo peso' };
  if (imc <= 24.9) return { cls: 'vital-green', label: null };
  if (imc <= 29.9) return { cls: 'vital-orange', label: 'Sobrepeso' };
  return { cls: 'vital-red', label: 'Obesidad' };
}

function applyVitalColor(el, flagEl, category) {
  if (el) el.classList.remove('vital-green', 'vital-orange', 'vital-red');
  if (flagEl) { flagEl.textContent = ''; flagEl.classList.remove('vital-orange', 'vital-red'); }
  if (!category) return;
  if (el) el.classList.add(category.cls);
  if (flagEl && category.label) { flagEl.textContent = category.label; flagEl.classList.add(category.cls === 'vital-red' ? 'vital-red' : 'vital-orange'); }
}

// Live numeric value only — no color/flag here (see updateImcColor), so
// typing talla/peso digit by digit doesn't flash the IMC field through
// unrelated categories before landing on the real value.
function updateImcDisplay() {
  const el = document.getElementById('imcCalculado');
  if (!el) return;
  const imc = calcImc(state.antropometria.peso, state.antropometria.talla);
  el.value = imc !== null ? imc.toFixed(1) : '';
}

function updateImcColor() {
  const el = document.getElementById('imcCalculado');
  if (!el) return;
  const imc = calcImc(state.antropometria.peso, state.antropometria.talla);
  applyVitalColor(el, document.getElementById('flagImc'), imc !== null ? imcCategory(imc) : null);
}

// Shared handler for the optional Fase 1 vitals/anthropometry fields
// (signosVitales: fc/fr/spo2/tas/tad, antropometria: talla/peso) — none of
// them drive any current algorithm, so a single generic setter avoids
// repeating updateEdadPaciente's body seven times over. Fires on every
// keystroke (oninput), so it only writes state/IMC's live number — see
// updateVitalColor for the color/flag, deferred to blur.
function updateVital(group, field, value) {
  const num = value === '' ? null : parseFloat(value);
  const val = (num === null || isNaN(num)) ? null : num;
  state[group][field] = val;
  if (group === 'antropometria') updateImcDisplay();
  saveSession();
}

// Color/flag for a vitals field, wired to onblur rather than oninput: a
// value like "140" typed digit by digit would otherwise flash through
// "1" and "14" (each landing in some band) before the real value lands,
// flickering the color and — worse — the flag's height, which shifts every
// card below it. Waiting for blur shows the category once, when the
// clinician has actually finished entering the value.
function updateVitalColor(group, field) {
  if (group === 'antropometria') { updateImcColor(); return; }
  const bands = VITAL_BANDS[field];
  if (!bands) return;
  const val = state[group][field];
  const el = document.getElementById(VITAL_INPUT_IDS[field]);
  const flagEl = document.getElementById(VITAL_FLAG_IDS[field]);
  applyVitalColor(el, flagEl, val !== null ? bandCategory(val, bands) : null);
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
    const headerTop = header.getBoundingClientRect().top;
    if (headerTop < navbarH) {
      const top = headerTop + window.scrollY - navbarH - 8;
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

  const sisNavH = window.innerWidth <= 768 ? 94 : 64;
  _sisObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    const banner = document.getElementById('sisContextBanner');
    if (!entry.isIntersecting && entry.boundingClientRect.top < sisNavH) {
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
  // Un SÍ contradice un embudo en NO: el sistema pasa a tener hallazgos
  if (value === 'SI' && state.sistemicoBreve[sisId] === 'NO') state.sistemicoBreve[sisId] = 'SI';

  // Visual feedback on the question row
  const row = document.getElementById(`sq2_${id}`);
  if (row) {
    row.classList.toggle('answered-si', value === 'SI');
    row.classList.toggle('answered-no', value === 'NO');
  }

  // Update tab and accordion alert indicators for this system
  const tab = document.getElementById(`tab_${sisId}`);
  const accRow = document.getElementById(`acc_${sisId}`);
  const sis = sistemasActivos().find(s => s.id === sisId);
  if (sis) {
    const hasAlert = sis.preguntas.some(q => state.sistemicoAnswers[q.id] === 'SI');
    if (tab) tab.classList.toggle('has-alert', hasAlert);
    if (accRow) accRow.classList.toggle('has-alert', hasAlert);
    if (sis.criterioCompuesto) evaluarCriterioCompuesto(sis);
    _pintarEmbudo(sisId);
  }

  updateSistemicoAlert();
  const q = SYSTEMIC_SCREENING[state.region]?.sistemas.flatMap(x => x.preguntas).find(x => x.id === id);
  if (q?.urgencia && value === 'SI') showToast(`🚨 ${q.urgencia}`, 'warning');
  saveSession();
}

// Embudo del modo breve (ver buildSistemaHTML). NO solo se admite si el
// sistema no tiene ninguna respuesta SÍ: «sin hallazgos» no puede convivir
// con un hallazgo marcado.
function selectEmbudo(sisId, value) {
  const sis = sistemasActivos().find(s => s.id === sisId);
  if (!sis) return;
  if (value === 'NO' && sis.preguntas.some(q => state.sistemicoAnswers[q.id] === 'SI')) {
    showToast('Este sistema tiene respuestas SÍ: cámbielas a NO antes de marcarlo sin hallazgos', 'warning');
    return;
  }
  state.sistemicoBreve[sisId] = value;
  _pintarEmbudo(sisId);
  saveSession();
}

// Refleja el embudo de un sistema en sus dos copias (panel de escritorio y
// acordeón móvil) y en su pestaña. Las preguntas quedan a la vista si el
// embudo es SÍ o si alguna no urgente ya se respondió SÍ (nunca se esconde
// un hallazgo).
function _pintarEmbudo(sisId) {
  const sis = sistemasActivos().find(s => s.id === sisId);
  if (!sis) return;
  const v = state.sistemicoBreve[sisId];
  const abierto = v === 'SI' || sis.preguntas.some(q => !q.urgencia && state.sistemicoAnswers[q.id] === 'SI');
  document.querySelectorAll(`[data-embudo="${sisId}"] .sq-btn`).forEach(b => {
    b.classList.toggle('selected', !!v && b.classList.contains(v === 'SI' ? 'si' : 'no'));
  });
  document.querySelectorAll(`[data-sis-body="${sisId}"]`).forEach(el => el.classList.toggle('embudo-si', abierto));
  document.getElementById(`tab_${sisId}`)?.classList.toggle('embudo-no', v === 'NO');
  document.getElementById(`acc_${sisId}`)?.classList.toggle('embudo-no', v === 'NO');
}

// Recuadro «URGENCIAS HOY» de la región (SYSTEMIC_SCREENING[region].urgencia,
// literal de la tarjeta de guía de consulta), arriba del cribado. Abierto por
// defecto: lo primero que se ve al elegir la región.
function renderUrgenciaRegion(data) {
  const el = document.getElementById('urgenciaRegion');
  if (!el) return;
  const u = data?.urgencia;
  el.innerHTML = u ? `<details class="urgencia-box" open>
      <summary>🚨 ${u.titulo}</summary>
      ${u.lineas.map(l => `<p>${l}</p>`).join('')}
    </details>` : '';
}

// Preguntas del cribado con `urgencia` respondidas SÍ en la región actual.
function getUrgenciasActivas() {
  return sistemasActivos().flatMap(sis => sis.preguntas)
    .filter(q => q.urgencia && state.sistemicoAnswers[q.id] === 'SI')
    .map(q => q.urgencia);
}

function updateSistemicoAlert() {
  const alertDiv = document.getElementById('sistemicoAlert');
  const hasPositive = _respuestasActivas().some(([, v]) => v === 'SI');
  state.sistemicoAlerta = hasPositive;
  const urgencias = getUrgenciasActivas();
  // Una urgencia nunca lleva el mensaje de «watchful waiting»: aviso propio, arriba.
  const urgHtml = urgencias.length ? `<div class="alert alert-danger urgencia-alert">
      <span class="alert-icon">🚨</span>
      <div><strong>Derivación urgente hoy.</strong> No continuar con la valoración mecánica.
        ${urgencias.map(u => `<div>· ${u}</div>`).join('')}</div>
    </div>` : '';
  const soloUrgencias = urgencias.length && !_respuestasActivas()
    .some(([id, v]) => v === 'SI' && !sistemasActivos().some(s => s.preguntas.some(q => q.id === id && q.urgencia)));
  if (hasPositive && soloUrgencias) {
    alertDiv.style.display = 'block';
    alertDiv.innerHTML = urgHtml;
  } else if (hasPositive) {
    alertDiv.style.display = 'block';
    alertDiv.innerHTML = urgHtml + `<div class="alert alert-warning">
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
  _usarMatrizIrritabilidad();
  syncIrritabMobile(key, value);
  calcIrritabilidad();
  saveSession();
}

function selectIrritabSync(key, btn, value) {
  const card = btn.closest('.irritab-card');
  card.querySelectorAll('.irritab-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  state.irritabilidad[key] = value;
  _usarMatrizIrritabilidad();
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

// Modo breve: nivel de irritabilidad elegido directamente, sin la matriz.
// Queda marcado (irritabilidadDirecta) para que el resumen diga «estimada»
// y la matriz salga como pendiente. Tocar la matriz lo deshace.
function selectIrritabDirecta(btn, nivel) {
  document.querySelectorAll('#irritabDirecta .option-btn').forEach(b => b.classList.toggle('selected', b === btn));
  state.irritabilidadNivel = nivel;
  state.irritabilidadDirecta = true;
  renderIrritabResumen(nivel);
  saveSession();
}

function _usarMatrizIrritabilidad() {
  state.irritabilidadDirecta = false;
  document.querySelectorAll('#irritabDirecta .option-btn').forEach(b => b.classList.remove('selected'));
}

function calcIrritabilidad() {
  if (state.irritabilidadDirecta) { renderIrritabResumen(state.irritabilidadNivel); return; }
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
  let nivel = 'Baja';
  if (score >= 5 && score <= 9) nivel = 'Moderada';
  if (score >= 10) nivel = 'Alta';
  state.irritabilidadNivel = nivel;
  renderIrritabResumen(nivel);
}

function renderIrritabResumen(nivel) {
  const { color, emoji } = { Baja: { color: 'var(--green)', emoji: '🟢' }, Moderada: { color: 'var(--orange)', emoji: '🟠' }, Alta: { color: 'var(--red)', emoji: '🔴' } }[nivel] || { color: 'var(--green)', emoji: '🟢' };
  const div = document.getElementById('irritabilidadResumen');
  div.innerHTML = `<div class="alert alert-info" style="border-color:${color}33; background:${color}11;">
    <span class="alert-icon">${emoji}</span>
    <span><strong>Irritabilidad ${nivel}${state.irritabilidadDirecta ? ' (estimada, sin matriz)' : ''}</strong> — ${nivel === 'Baja' ? 'Exploración completa posible. Puede aplicar técnicas más agresivas con seguridad.' : nivel === 'Moderada' ? 'Proceder con precaución. Evitar técnicas de alta intensidad. Valorar la respuesta post-sesión.' : 'Evaluación muy cuidadosa. Priorizar técnicas pasivas de baja intensidad. Sesión breve.'}</span>
  </div>`;
}

function collectPhase3() {
  state.severidad = state.severidad ?? 0;
  state.signoComparable = document.getElementById('signoComparable').value;
}

// ─── PHASE 5 — RESULTS ───────────────────────────────────────
// Línea fija de transparencia del modo breve: fase 5, 📋 Notas y 📄 Informe.
// Nunca se omite en breve (docs/modo-breve.md, decisión 3).
const TEXTO_VALORACION_BREVE = 'Valoración inicial breve: cribado sistémico por sistemas y confirmación diagnóstica no exhaustivos; se completa en próximas sesiones.';

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
  const texts = [];
  sistemasActivos().forEach(sis => {
    (sis.preguntas || []).forEach(q => {
      if (affirmativeIds.includes(q.id)) texts.push(q.text);
    });
  });
  return texts;
}

// Region key → display name: 'tobillo_pie' → 'Tobillo y pie', 'lumbar' → 'Lumbar'.
function nombreRegion(r) {
  const n = r.replace(/_/g, ' y ');
  return n.charAt(0).toUpperCase() + n.slice(1);
}

const _escHTML = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Texto de la pauta de una hipótesis «Derivar» marcada como tratada.
function _textoTratada(cq) {
  if (!cq) return 'Diagnóstico médico ya confirmado y tratado: sin derivación por esta hipótesis.';
  return `Ya intervenida: seguir el protocolo del cirujano${cq.re ? ` (${_escHTML(cq.re)})` : ''}.`;
}

// Recuadro de la fase 5 con la cirugía (docs/posquirurgico.md, punto 4).
function _cirugiaResultadosHTML(cq) {
  const cabecera = [cq.iv && _escHTML(cq.iv), fechaSemanasTexto(cq), cq.pr && `Protocolo: ${cq.pr.toLowerCase()}`].filter(Boolean).join(' · ');
  const conProt = cqConProtocolo(cq);
  return `
    <div class="alert ${conProt ? 'alert-info' : 'alert-warning'}" style="margin-bottom:1rem;">
      <span class="alert-icon">🏥</span>
      <div><strong>Paciente posquirúrgico.</strong>${cabecera ? ` ${cabecera}` : ''}
        ${cq.re ? `<div>Restricciones: ${_escHTML(cq.re)}</div>` : ''}
        ${cq.co.length ? `<div>Complicaciones: ${_escHTML(cq.co.join(', '))}</div>` : ''}
        <div>${conProt
          ? 'El plan se supedita al protocolo del cirujano: donde una pauta de abajo difiera, prevalece el protocolo.'
          : `${TEXTO_SIN_PROTOCOLO} antes de progresar carga o rango.`}</div>
      </div>
    </div>`;
}

// Región con el lado afectado, si se indicó: 'Hombro (derecho)'.
function regionConLado(r, lado) {
  if (!r) return '—';
  return lado ? `${nombreRegion(r)} (${lado.toLowerCase()})` : nombreRegion(r);
}

// «Central» solo tiene sentido en la columna.
const REGIONES_COLUMNA = ['cervical', 'lumbar'];

// Selector de lado (fase 2): visible con una región elegida; «Central» solo en
// columna (si se cambia a otra región con «Central» marcado, se borra).
function _pintarLado() {
  const wrap = document.getElementById('ladoWrap');
  if (!wrap) return;
  wrap.hidden = !state.region;
  const columna = REGIONES_COLUMNA.includes(state.region);
  wrap.querySelector('.lado-central')?.toggleAttribute('hidden', !columna);
  if (state.lado === 'Central' && !columna) state.lado = '';
  wrap.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  _restoreOptionBtnGroup('lado', state.lado);
}

function buildResults() {
  const container = document.getElementById('resultsContent');
  container.innerHTML = '';

  // Outside the hub there's no report app to relay the assessment to — offer
  // sharing it directly instead of the hub-only "enviado al informe" flow.
  const btnFinalizar = document.getElementById('btnFinalizar');
  if (btnFinalizar) {
    const inHub = document.body.classList.contains('in-hub');
    btnFinalizar.textContent = inHub ? 'Finalizar valoración →' : '📤 Compartir informe';
    btnFinalizar.title = inHub ? '' : 'Comparte el resumen clínico por email, WhatsApp, etc.';
  }

  // Sort hypotheses by score
  const sorted = [...state.activeHypotheses]
    .map(h => ({ id: h, score: state.hypothesisScores[h]?.totalLR || 1, hyp: HYPOTHESES[h] }))
    .filter(x => x.hyp)
    .sort((a, b) => b.score - a.score);

  const brAffirmative = Object.entries(state.banderasRojas)
    .filter(([, v]) => v === 'SI')
    .map(([k]) => BR_LABELS[k]);
  const sqAffirmative = getSistemicoAffirmativeTexts();
  const pendientesBreve = getPendientesBreve();
  const sinConfirmar = state.modo === 'breve' && pendientesBreve.some(p => p.fase === '4b');

  // ── Modo breve: transparencia y pendientes, antes que nada
  if (state.modo === 'breve') {
    container.innerHTML += `
    <div class="breve-pendientes">
      <div class="breve-pendientes-title">⏱ ${TEXTO_VALORACION_BREVE}</div>
      ${pendientesBreve.length ? `<div>Pendiente para las próximas sesiones:</div>${_pendientesHTML(pendientesBreve)}` : '<div>Sin pendientes.</div>'}
    </div>`;
  }

  // ── Derivación médica pedida por el árbol CIF (p. ej., claudicación vascular)
  const derivacionesArbol = getDerivacionesArbol();
  if (derivacionesArbol.length) {
    container.innerHTML += `
    <div class="alert alert-danger" style="margin-bottom:1rem;">
      <span class="alert-icon">🩺</span>
      <div><strong>Derivación médica pendiente.</strong>${derivacionesArbol.map(m => `<div>· ${m}</div>`).join('')}</div>
    </div>`;
  }

  // ── Paciente posquirúrgico: el plan se supedita al protocolo del cirujano
  const cq = getCirugiaPayload();
  if (cq) container.innerHTML += _cirugiaResultadosHTML(cq);

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
    <div class="summary-row"><span class="summary-label">Región valorada</span><span class="summary-value">${regionConLado(state.region, state.lado)}</span></div>
    <div class="summary-row"><span class="summary-label">Severidad (EVN)</span><span class="summary-value">${state.severidad}/10</span></div>
    <div class="summary-row"><span class="summary-label">Irritabilidad</span><span class="summary-value">${state.irritabilidadNivel || '—'}${state.irritabilidadDirecta && state.irritabilidadNivel ? ' (estimada, sin matriz)' : ''}</span></div>
    <div class="summary-row"><span class="summary-label">Naturaleza</span><span class="summary-value">${state.naturaleza || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Estabilidad</span><span class="summary-value">${state.estabilidad || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Signo comparable</span><span class="summary-value">${state.signoComparable || '—'}</span></div>
  </div>`;

  // ── Hypotheses with tests
  let hypHtml = `<div class="summary-section"><div class="summary-section-title">${sinConfirmar ? '🎯 Hipótesis de Trabajo — Confirmación pendiente' : '🎯 Hipótesis Diagnósticas — Ordenadas por Peso Diagnóstico'}</div>`;

  if (sorted.length === 0) {
    const regionLabel = state.region ? nombreRegion(state.region) : 'la región';
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
      const tratada = esTratada(id);
      const colorClass = scoreInfo?.colorClass || 'hyp-orange';
      const colorMap = { 'hyp-green': '#38d9a9', 'hyp-orange': '#ff9f43', 'hyp-red': '#ff6b6b', 'hyp-neutral': '#8b95a7' };
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
        ${casillaTratadaHTML(id)}
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">Tests Realizados</div>
          ${tratada ? '<div style="font-size:0.8rem; color:var(--text3);">No aplicables: diagnóstico ya confirmado.</div>' : testsHtml}
        </div>
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>
        </div>
        <div>
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent2); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">${tratada ? ETIQUETA_TRATADA : hyp.dosis === DOSIS_DERIVAR ? '🚑 Derivación' : hyp.dosisFuente ? '💊 Pauta de Tratamiento' : '💊 Dosis Día 1 (Baja Fricción)'}</div>
          <div class="exercise-box">${tratada ? _textoTratada(cq) : hyp.dosis || '<em style="color:var(--text3)">Sin dosis de referencia: a criterio del clínico.</em>'}</div>
          ${!tratada && hyp.dosis && hyp.dosisFuente ? `<div class="test-source" style="margin:4px 0 0;">${hyp.dosisFuente}</div>` : ''}
          ${cq && !tratada && hyp.dosis && hyp.dosis !== DOSIS_DERIVAR ? `<div class="nota-posq" style="margin-top:6px;">🏥 ${TEXTO_PAUTA_COMPATIBLE}</div>` : ''}
        </div>
        ${hyp.pronostico ? `<div style="margin-top:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">🧭 Pronóstico y derivación</div>
          <div style="font-size:0.8rem; color:var(--text2); line-height:1.6;">${hyp.pronostico.horizonte}</div>
          ${hyp.pronostico.derivacion ? `<div style="font-size:0.8rem; color:var(--text2); line-height:1.6; margin-top:4px;"><strong>Derivar si:</strong> ${hyp.pronostico.derivacion}</div>` : ''}
          ${hyp.pronostico.fuente ? `<div class="test-source" style="margin:4px 0 0;">${hyp.pronostico.fuente}</div>` : ''}
        </div>` : ''}
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
      ${renderQuickInputBar('planVariableControl')}
    </div>
    <div class="plan-note-row">
      <div class="plan-note-label">Ventana de recuperación</div>
      <div class="plan-note-hint">¿Cómo está el dolor a las 24 horas? Dato clave para análisis de carga</div>
      <textarea class="plan-note-input" id="planVentana" rows="2"
        placeholder="Ej: Dolor basal de 3/10 debe volver a 3/10 o menos a las 24h. Si aumenta, reducir dosis."
        oninput="state.planNotes.ventanaRecuperacion=this.value; saveSession()"
      >${state.planNotes.ventanaRecuperacion}</textarea>
      ${renderQuickInputBar('planVentana')}
    </div>
    <div class="plan-note-row">
      <div class="plan-note-label">Anclaje de hábito</div>
      <div class="plan-note-hint">Vincular el ejercicio a una actividad existente del paciente para reducir la fricción</div>
      <textarea class="plan-note-input" id="planAnclaje" rows="2"
        placeholder="Ej: Hacer las rotaciones mientras espera que se haga el café por la mañana"
        oninput="state.planNotes.anclajeHabito=this.value; saveSession()"
      >${state.planNotes.anclajeHabito}</textarea>
      ${renderQuickInputBar('planAnclaje')}
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

  // Wire chip sync last: every `container.innerHTML +=` above reparses and
  // recreates the whole subtree, which would drop listeners attached earlier.
  ['planVariableControl', 'planVentana', 'planAnclaje'].forEach(wireQuickInputBar);

  _montarInformeIA();
}

function finalizarValoracion() {
  const btn = document.getElementById('btnFinalizar');
  const _assessmentPayload = buildPhysiQPayload();
  const now = new Date();
  // Always persist — physiq-report reads this from IDB on its own load too,
  // independent of the broadcast below, so this is never wasted even when
  // nothing is listening for the broadcast right now (standalone use).
  writeSession({ assessment: _assessmentPayload, patient: state.patient || '', date: now.toLocaleDateString('es-ES') })
    .then(session => {
      if (session) updateSessionChip(session);
      _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT', assessment: _assessmentPayload });
    });

  // Outside the hub there's no report app around to relay to — share the
  // patient/GP-facing report directly (not the clinician shorthand) instead
  // of the "enviado al informe" confirmation.
  if (!document.body.classList.contains('in-hub')) {
    const text = buildInformeFisioterapiaText();
    if (navigator.share) {
      navigator.share({ title: 'Informe de valoración — PhysiQ-Assessment', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('✓ Informe copiado al portapapeles', 'success'));
    }
    return;
  }

  if (btn) {
    btn.textContent = '✓ Enviado al informe';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = 'Finalizar valoración →'; btn.disabled = false; }, 3000);
  }
}

// Modo breve: de la fase 4 a los resultados sin pasar por la 4b. Las
// hipótesis quedan como hipótesis de trabajo y sus tests, como pendientes.
function verResultadosSinConfirmar() {
  if (document.getElementById('btnGoConfirm')?.disabled) {
    showToast('Complete el árbol antes de ver los resultados', 'warning');
    return;
  }
  buildResults();
  goToPhase(5);
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
  if (isOpen) unlockBodyScroll(); else lockBodyScroll();
}

function closePhaseSheet() {
  const sheet = document.getElementById('phaseSheet');
  const overlay = document.getElementById('phaseSheetOverlay');
  if (!sheet.classList.contains('open')) return;
  sheet.classList.remove('open');
  overlay.classList.remove('open');
  unlockBodyScroll();
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
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  const dismiss = () => { overlay.remove(); unlockBodyScroll(); window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*'); };
  document.getElementById('confirmCancel').onclick = dismiss;
  document.getElementById('confirmAction').onclick = () => { dismiss(); onConfirm(); };
}


// ─── SESSION PANEL ────────────────────────────────────────────
let _sessionLabel = '';

function _updateSessionPanelTitle() {
  const panelTitle = document.getElementById('sessionPanelTitle');
  const panel = document.getElementById('sessionPanel');
  const btn = document.getElementById('sessionBtn');
  if (!panelTitle) return;
  const name = (state.patient || '').trim();
  if (name) {
    panelTitle.textContent = `${name} · ${new Date().toLocaleDateString('es-ES')}`;
    panel?.classList.add('has-session');
    btn?.classList.add('active');
  } else {
    panelTitle.textContent = 'Sin sesión activa';
    panel?.classList.remove('has-session');
    btn?.classList.remove('active');
  }
}

function closeSessionPanel() {
  const panel = document.getElementById('sessionPanel');
  const overlay = document.getElementById('sessionPanelOverlay');
  const wasOpen = overlay?.classList.contains('open');
  overlay?.classList.remove('open');
  if (wasOpen) { unlockBodyScroll(); window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*'); }
  if (panel) { panel.style.transition = ''; panel.style.transform = ''; }
}

function _showSessionState(st) {
  const panel = document.getElementById('sessionPanel');
  if (!panel) return;
  const hasSession = !!(state.patient || '').trim();
  const label = _sessionLabel || (hasSession
    ? `${state.patient} · ${new Date().toLocaleDateString('es-ES')}` : '');
  panel.classList.toggle('has-session', hasSession);

  if (st === 'edit') {
    panel.innerHTML = `
      <div class="session-panel-handle"></div>
      <div class="session-panel-title" id="sessionPanelTitle">${label || 'Sin sesión activa'}</div>
      <div class="field">
        <label class="field-label">Paciente</label>
        <div style="display:flex;align-items:center;gap:8px;">
          <input class="field-input" type="text" id="patientName" style="flex:1;"
                 placeholder="Nombre (opcional)" autocomplete="off">
          <button class="session-panel-clear" id="sessionPanelClear" title="Borrar sesión">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h9M5 4V2h3v2M3.5 4l.5 7h5l.5-7"/></svg>
          </button>
        </div>
      </div>
      <div class="session-io">
        <button type="button" class="session-io-btn" id="sessionExport"${state.maxVisitedIdx > 0 ? '' : ' disabled'}>⬇ Exportar</button>
        <button type="button" class="session-io-btn" id="sessionImport">⬆ Importar</button>
        <input type="file" id="sessionImportFile" accept=".json,application/json" hidden>
      </div>
      <div class="session-io-nota">Valoración completa en un archivo .json, con los datos clínicos y el nombre del paciente.${state.maxVisitedIdx > 0 ? '' : ' Se puede exportar a partir de la fase 2.'}</div>`;
    panel.querySelector('#sessionExport').onclick = exportarValoracionArchivo;
    panel.querySelector('#sessionImport').onclick = () => panel.querySelector('#sessionImportFile').click();
    panel.querySelector('#sessionImportFile').onchange = e => {
      const f = e.target.files?.[0];
      e.target.value = '';
      if (f) importarValoracionArchivo(f);
    };
    const input = panel.querySelector('#patientName');
    input.value = state.patient || '';
    input.addEventListener('keydown', e => { if (e.key === 'Enter') closeSessionPanel(); });
    input.addEventListener('input', () => {
      state.patient = input.value;
      const titleEl = panel.querySelector('#sessionPanelTitle');
      const name = input.value.trim();
      if (titleEl) titleEl.textContent = name
        ? `${name} · ${new Date().toLocaleDateString('es-ES')}`
        : 'Sin sesión activa';
      panel.classList.toggle('has-session', !!name);
      saveSession();
    });
    panel.querySelector('#sessionPanelClear').onclick = () => _showSessionState('delete');
    setTimeout(() => input.focus(), 60);

  } else if (st === 'delete') {
    panel.innerHTML = `
      <div class="session-panel-handle"></div>
      <div class="session-panel-title">${label || 'Sin sesión activa'}</div>
      <div class="confirm-box-text" style="margin:12px 0 0;">¿Borrar y empezar de nuevo?${_avisoAudioSesion()}</div>
      <div class="confirm-box-btns" style="margin-top:1rem;">
        <button class="confirm-btn-cancel" id="confirmCancel">Cancelar</button>
        <button class="confirm-btn-ok" id="confirmAction">Borrar sesión</button>
      </div>`;
    panel.querySelector('#confirmCancel').onclick = () => _showSessionState('edit');
    panel.querySelector('#confirmAction').onclick = () => {
      closeSessionPanel();
      _descartarAudioSesion();
      _sessionGen++; _sessionCleared = true;
      state.patient = '';
      updateSessionChip(null);
      _softResetApp(); goToPhase(1);
      clearSession().then(() => { _sessionCh.postMessage({ type: 'SESSION_CLEAR' }); });
    };
  }
}

// ─── Exportar / importar la valoración (.json) ─────────────────
// Para repetir pruebas con los mismos datos (p. ej. regenerar el informe
// narrativo tras cambiar el prompt). Lógica pura en lib/valoracion-json.js,
// cargado solo al usarlo. Importar guarda el estado como sesión y recarga: lo
// restaura el mismo código que al abrir la app.
let _importando = false;   // bloquea saveSession(): el DOM aún tiene la valoración anterior

async function exportarValoracionArchivo() {
  saveSession();   // vuelca al estado lo último escrito (motivo, signo comparable…)
  try {
    const VJ = await import('./lib/valoracion-json.js');
    const ahora = new Date();
    const nombre = VJ.nombreArchivo(state.patient, ahora);
    const archivo = new File([JSON.stringify(VJ.exportarValoracion(state, ahora), null, 2)], nombre, { type: 'application/json' });
    // En el móvil, la hoja de compartir permite guardarlo en Archivos/Drive
    if (window.matchMedia?.('(pointer: coarse)').matches && navigator.canShare?.({ files: [archivo] })) {
      try { await navigator.share({ files: [archivo], title: nombre }); return; }
      catch (e) { if (e?.name === 'AbortError') return; }
    }
    const url = URL.createObjectURL(archivo);
    const a = Object.assign(document.createElement('a'), { href: url, download: nombre });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`✓ Valoración exportada: ${nombre}`, 'success');
  } catch {
    showToast('No se ha podido exportar la valoración.', 'warning');
  }
}

async function importarValoracionArchivo(file) {
  let r;
  try {
    const VJ = await import('./lib/valoracion-json.js');
    r = VJ.leerImportacion(await file.text(), Object.keys(SYSTEMIC_SCREENING));
  } catch {
    showToast('No se ha podido leer el archivo.', 'warning');
    return;
  }
  if (!r.ok) { showToast(r.error, 'warning'); return; }
  closeSessionPanel();
  const quien = r.paciente ? `de «${r.paciente}»` : 'sin nombre de paciente';
  const cuando = r.exportado ? `, exportada el ${new Date(r.exportado).toLocaleDateString('es-ES')}` : '';
  showConfirmBanner('Importar valoración',
    `Se sustituirá la valoración en curso por la del archivo (${quien}${cuando}).${_avisoAudioSesion()}`,
    'Importar', () => _aplicarImportacion(r));
}

async function _aplicarImportacion(r) {
  _importando = true;
  try { await _grabMod?.descartarTodo(); } catch { /* el audio no impide importar */ }
  await clearSession();   // sin restos de la sesión anterior (payload final, ROM…)
  await writeSession({ patient: r.paciente, date: new Date().toLocaleDateString('es-ES'), assessmentState: r.assessmentState });
  location.reload();
}

function toggleSessionPanel() {
  const overlay = document.getElementById('sessionPanelOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('open')) { closeSessionPanel(); return; }
  _showSessionState('edit');
  overlay.classList.add('open');
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
}

// Closes every open sheet/dialog. Called when the hub hides this satellite
// (e.g. navigating back to hub home) so a stale open dialog isn't still
// showing when the user returns.
function _closeAllOverlays() {
  cerrarRazonamiento({ sinHistorial: true });
  closePhaseSheet();
  closeSessionPanel();
  const banner = document.getElementById('confirmBanner');
  if (banner) {
    banner.remove();
    unlockBodyScroll();
    window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*');
  }
}

function _setupSessionPanelDrag() {
  const panel = document.getElementById('sessionPanel');
  if (!panel) return;
  const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';
  let startY = 0, startTime = 0, dragging = false, delta = 0, snapTimer = null;
  let vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  // Closing the keyboard mid-drag resizes the visual viewport, which shifts
  // the panel's on-screen position by the same amount. Without compensating
  // startY, that shift cancels out the manual translateY delta and the sheet
  // feels stuck/resistant instead of following the finger.
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

function updateSessionChip(session) {
  const btn = document.getElementById('sessionBtn');
  if (!btn) return;
  if (!session || !session.patient) {
    _sessionLabel = '';
    btn.classList.remove('active');
  } else {
    _sessionLabel = `${session.patient} · ${session.date || '—'}`;
    btn.classList.add('active');
  }
  _updateSessionPanelTitle();
}

function promptClearSession() {
  _showSessionState('delete');
  const overlay = document.getElementById('sessionPanelOverlay');
  if (overlay && !overlay.classList.contains('open')) {
    overlay.classList.add('open');
    lockBodyScroll();
    window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  }
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
    la: state.lado || '',
    d:  new Date().toLocaleDateString('es-ES'),
    mo: state.motivoConsulta,
    sv: state.signosVitales,
    an: { ...state.antropometria, imc: calcImc(state.antropometria.peso, state.antropometria.talla) },
    me: state.mecanismo,
    ...(getCirugiaPayload() ? { cq: getCirugiaPayload() } : {}),
    cr: state.cronologia,
    rp: state.riesgoPsico,
    nr: state.severidad ?? 0,
    ir: state.irritabilidadNivel && state.irritabilidadDirecta ? `${state.irritabilidadNivel} (estimada)` : state.irritabilidadNivel,
    na: state.naturaleza,
    si: state.sistemicoAlerta,
    br: Object.entries(state.banderasRojas).filter(([, v]) => v === 'SI').map(([k]) => BR_LABELS[k]),
    sq: getSistemicoAffirmativeTexts(),
    ur: getUrgenciasActivas(),
    dv: getDerivacionesArbol(),
    h:  state.activeHypotheses.map(id => ({
          id,
          name: HYPOTHESES[id]?.name ?? id,
          sc:   state.hypothesisScores[id]?.label ?? 'Sin evaluar',
          lr:   state.hypothesisScores[id]?.totalLR ?? null,
          tr:   state.testResults[id] ?? {},
          ...(esTratada(id) ? { dt: true } : {})
        })),
    pn: state.planNotes,
    fp: resumenFormularioPrevio(),
    md: state.modo === 'breve' ? 'breve' : 'completo',
    ...(state.modo === 'breve' ? { pe: getPendientesBreve().map(p => p.texto) } : {}),
    ...(state.rom ? { rom: state.rom } : {})
  };
}


// 📋 Notas: una línea con todo lo de la tarjeta «Cirugía».
function _lineaCirugiaNotas(cq) {
  const partes = [cq.iv || 'intervención sin detallar', fechaSemanasTexto(cq),
    cq.pr ? `Protocolo: ${cq.pr.toLowerCase()}` : '', cq.re ? `Restricciones: ${cq.re}` : '',
    cq.co.length ? `Complicaciones: ${cq.co.join(', ')}` : ''].filter(Boolean);
  if (!cqConProtocolo(cq)) partes.push(TEXTO_SIN_PROTOCOLO);
  return `🏥 CIRUGÍA: ${partes.join(' · ')}`;
}

function buildContextSummaryText() {
  const d = buildPhysiQPayload();
  const hyps = (d.h || []).map(h => `  · ${h.name} — ${h.sc}`).join('\n');
  const breve = d.md === 'breve'
    ? `\n⏱ ${TEXTO_VALORACION_BREVE}${d.pe?.length ? `\nPendiente:\n${d.pe.map(x => `  · ${x}`).join('\n')}` : ''}`
    : '';
  return `VALORACIÓN PhysiQ-Assessment${d.p ? `\nPaciente: ${d.p}` : ''}${breve}
Región: ${regionConLado(d.r, d.la)} · NRS: ${d.nr}/10 · Irritabilidad: ${d.ir}${d.cq ? `\n${_lineaCirugiaNotas(d.cq)}` : ''}
Cribado sistémico: ${d.si ? 'POSITIVO ⚠️' : 'Negativo'}${d.ur?.length ? `\n🚨 DERIVACIÓN URGENTE: ${d.ur.join(' · ')}` : ''}${d.dv?.length ? `\n🩺 DERIVACIÓN MÉDICA (árbol CIF): ${d.dv.join(' · ')}` : ''}
Hipótesis:
${hyps}${d.fp?.length ? `\nFormulario previo:\n${d.fp.map(x => `  · ${x.q} → ${x.a}`).join('\n')}` : ''}
Variable control: ${d.pn?.variableControl || '—'}
Ventana recuperación: ${d.pn?.ventanaRecuperacion || '—'}
Anclaje hábito: ${d.pn?.anclajeHabito || '—'}`;
}

function copyContextToClipboard() {
  navigator.clipboard.writeText(buildContextSummaryText()).then(() => {
    showCopyFeedback();
  });
}

// Same underlying data as buildContextSummaryText(), but reworded for a
// different audience: the patient and their GP, not the clinician's own
// shorthand (no NRS/LR jargon, no scoring labels or emoji) — meant to be
// pasted straight into a letterhead template and handed over as-is.
function buildInformeFisioterapiaText() {
  const d = buildPhysiQPayload();
  const region = regionConLado(d.r, d.la);

  const hyps = [...d.h].sort((a, b) => (b.lr ?? 1) - (a.lr ?? 1));
  const breve = d.md === 'breve';
  const sinConfirmar = breve && hyps.some(h => !Object.values(h.tr || {}).some(r => r === 'pos' || r === 'neg'));
  const impresion = hyps.length
    ? hyps.map(h => `  · ${h.name}${h.dt ? (d.cq ? ' (intervenida quirúrgicamente)' : ' (diagnosticada y tratada)') : ''}`).join('\n')
    : '  · Pendiente de completar la valoración diagnóstica.';

  const seguridad = d.br.length
    ? `Se han detectado los siguientes signos que recomendamos comentar con su médico de cabecera:\n${d.br.map(b => `  · ${b}`).join('\n')}`
    : 'No se han detectado signos de alarma (banderas rojas) en el cribado realizado.';
  const sistemico = d.sq.length
    ? `\n\nAdemás, durante el cribado el paciente refirió:\n${d.sq.map(s => `  · ${s}`).join('\n')}`
    : '';
  const derivacion = d.dv?.length
    ? `\n\nSe recomienda valoración médica:\n${d.dv.map(m => `  · ${m}`).join('\n')}`
    : '';

  // Paciente posquirúrgico: antecedente y plan supeditado al protocolo
  const cq = d.cq;
  const antecedenteQx = cq
    ? `\n\nANTECEDENTE QUIRÚRGICO\n  · Intervención: ${cq.iv || '—'}${fechaSemanasTexto(cq) ? `\n  · Fecha: ${fechaSemanasTexto(cq)}` : ''}${cq.co.length ? `\n  · Complicaciones: ${cq.co.join(', ')}` : ''}`
    : '';
  const planQx = !cq ? ''
    : cqConProtocolo(cq)
      ? `\n  · El tratamiento sigue el protocolo y las restricciones indicadas por el cirujano${cq.re ? `: ${cq.re}` : '.'}`
      : `\n  · ${TEXTO_SIN_PROTOCOLO}.${cq.re ? ` Restricciones referidas: ${cq.re}` : ''}`;

  // Solo lo marcado con `informe` en formularios/*.js — nunca el formulario entero
  const fpInf = informeFormularioPrevio();
  const bloqueFp = (titulo, lista) => lista.length
    ? `\n\n${titulo}\n${lista.map(x => `  · ${x.q}: ${x.a}`).join('\n')}`
    : '';

  return `INFORME DE FISIOTERAPIA${d.p ? `\nPaciente: ${d.p}` : ''}
Fecha: ${d.d}
Región valorada: ${region}${breve ? `\n\n${TEXTO_VALORACION_BREVE}` : ''}

MOTIVO DE CONSULTA
${d.mo || '—'}
Mecanismo de inicio: ${d.me || '—'} · Evolución: ${d.cr || '—'}${antecedenteQx}${bloqueFp('SEGÚN REFIERE EL PACIENTE', fpInf.historia)}${bloqueFp('ANTECEDENTES REFERIDOS POR EL PACIENTE', fpInf.antecedentes)}

VALORACIÓN
Intensidad del dolor referida: ${d.nr}/10
Irritabilidad del cuadro: ${d.ir || '—'}
Naturaleza del dolor: ${d.na || '—'}
Riesgo psicosocial: ${d.rp || '—'}

CRIBADO DE SEGURIDAD
${seguridad}${sistemico}${derivacion}

IMPRESIÓN CLÍNICA${sinConfirmar ? ' (hipótesis de trabajo, pendiente de confirmar)' : ''}
${impresion}

PLAN DE TRATAMIENTO Y RECOMENDACIONES${planQx}
  · Señal para detener el ejercicio: ${d.pn?.variableControl || '—'}
  · Evolución esperada a las 24h: ${d.pn?.ventanaRecuperacion || '—'}
  · Cómo incorporarlo a la rutina: ${d.pn?.anclajeHabito || '—'}

—
Informe generado con PhysiQ-Assessment el ${d.d}.`;
}

function copyInformeFisioterapia() {
  navigator.clipboard.writeText(buildInformeFisioterapiaText()).then(() => {
    showToast('✓ Informe copiado — listo para pegar en tu plantilla', 'success');
  });
}

function showCopyFeedback() {
  showToast('✓ Contexto clínico copiado al portapapeles', 'success');
}

function showToast(message, tone) {
  const existing = document.getElementById('appToast');
  if (existing) existing.remove();
  const color = tone === 'warning' ? 'var(--orange)' : 'var(--accent2)';
  const toast = document.createElement('div');
  toast.id = 'appToast';
  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
    background:var(--surface3); border:1px solid ${color};
    color:${color}; font-size:0.8rem; font-family:'Outfit',sans-serif;
    padding:10px 20px; border-radius:8px; z-index:9999;
    max-width:calc(100vw - 32px); text-align:center;
    box-shadow:0 4px 16px rgba(0,0,0,0.4);
    animation:toastUp 0.25s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), tone === 'warning' ? 3500 : 2500);
}

// ─── SESSION PERSISTENCE ─────────────────────────────────────

function _hasVitalsData() {
  return Object.values(state.signosVitales).some(v => v !== null)
    || Object.values(state.antropometria).some(v => v !== null);
}

function _hasAssessmentData() {
  return state.maxVisitedIdx > 0
    || !!state.motivoConsulta
    || state.edadPaciente !== null
    || _hasVitalsData()
    || !!state.mecanismo
    || !!state.cirugia?.intervencion
    || !!state.cronologia
    || !!state.riesgoPsico
    || !!state.psico_miedo
    || !!state.psico_autoef
    || !!state.psico_emocional
    || Object.values(state.banderasRojas).includes('SI')
    || resumenFormularioPrevio().length > 0;
}

function updateResetBtnVisibility() {
  document.querySelector('.btn-reset')?.classList.toggle('visible', _hasAssessmentData());
}

function saveSession() {
  if (_importando) return;
  const patientEl = document.getElementById('patientName');
  if (patientEl) state.patient = patientEl.value;
  const motivoEl = document.getElementById('motivoConsulta');
  if (motivoEl) state.motivoConsulta = motivoEl.value;
  const signoEl = document.getElementById('signoComparable');
  if (signoEl) state.signoComparable = signoEl.value;
  _updateSessionPanelTitle();
  // Aviso de pendientes del modo breve: el formulario previo se rellena en la fase 1
  if (state.currentPhase === 1 && state.modo === 'breve') renderBrevePendientes();
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
          const _hasPhase1Data = state.motivoConsulta || state.edadPaciente !== null || _hasVitalsData() || state.mecanismo || state.cronologia || state.riesgoPsico;
          if (state.maxVisitedIdx > 0 || _hasPhase1Data) {
            const _phaseLabels = [1, 2, 3, 4, '4b', 5];
            _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_PARTIAL', phase: _phaseLabels[state.maxVisitedIdx], region: state.region || null });
          }
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
  _pintarModoUI();
  const patientEl = document.getElementById('patientName');
  if (patientEl) patientEl.value = state.patient || '';
  const motivoEl = document.getElementById('motivoConsulta');
  if (motivoEl) motivoEl.value = state.motivoConsulta || '';
  syncQuickPhraseChips('motivoConsulta');
  const edadEl = document.getElementById('edadPaciente');
  if (edadEl) edadEl.value = state.edadPaciente ?? '';
  Object.entries(VITAL_INPUT_IDS).forEach(([field, id]) => {
    const el = document.getElementById(id);
    const val = state.signosVitales[field] ?? null;
    if (el) el.value = val ?? '';
    const bands = VITAL_BANDS[field];
    applyVitalColor(el, document.getElementById(VITAL_FLAG_IDS[field]), val !== null && bands ? bandCategory(val, bands) : null);
  });
  const tallaEl = document.getElementById('vitalTalla');
  if (tallaEl) tallaEl.value = state.antropometria.talla ?? '';
  const pesoEl = document.getElementById('vitalPeso');
  if (pesoEl) pesoEl.value = state.antropometria.peso ?? '';
  updateImcDisplay();
  updateImcColor();

  ['mecanismo', 'cronologia', 'riesgoPsico'].forEach(g => _restoreOptionBtnGroup(g, state[g]));
  // Sesiones anteriores al posquirúrgico: sin cirugia / derivacionResuelta
  state.cirugia = { ...cirugiaVacia(), ...(state.cirugia || {}) };
  if (!state.derivacionResuelta) state.derivacionResuelta = {};
  _pintarCirugiaUI();
  _pintarLado();

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
    _repintarCribado();
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
  document.querySelectorAll('#irritabDirecta .option-btn').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/'(\w+)'\)/);
    btn.classList.toggle('selected', !!(state.irritabilidadDirecta && m && m[1] === state.irritabilidadNivel));
  });
  calcIrritabilidad();
  ['naturaleza', 'estabilidad'].forEach(g => _restoreOptionBtnGroup(g, state[g]));
  const signoEl = document.getElementById('signoComparable');
  if (signoEl) signoEl.value = state.signoComparable || '';
  syncQuickPhraseChips('signoComparable');
  precargarFormularioPrevio();   // contador de la fase 1 + esquema de la región
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
  // Init session panel drag-to-dismiss
  _setupSessionPanelDrag();
  // Init quick-input chips + dictation for static text fields
  initQuickInputBars();
  // Tarjeta «Cirugía»: chips de complicaciones (se repinta al restaurar sesión)
  _pintarCirugiaUI();
  // Formulario previo: contador de la fase 1 (se vuelve a llamar tras restaurar sesión)
  precargarFormularioPrevio();

  // Seed history so the first back press steps through phases
  history.replaceState({ phase: 1 }, '');

  // Autosave when app is backgrounded (covers swipe-away on Android PWA)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      saveSession();
      _closeAllOverlays();
    }
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
      // Modo elegido en la fase 1 antes de salir de ella (maxVisitedIdx 0)
      if (session.assessmentState?.modo === 'breve') { state.modo = 'breve'; _pintarModoUI(); }
    }
    if (session.rom && !state.rom) state.rom = session.rom;
    _updateSessionPanelTitle();
    updateResetBtnVisibility();
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ─── HUB INTEGRATION ─────────────────────────────────────────
// physiq-assessment runs inside an iframe in the PhysiQ hub. Moved here (was
// a trailing inline <script> in index.html) so it can reference module-scoped
// state (_historyDepth, _pendingBackNav, _closeAllOverlays) directly instead
// of needing them exposed on window.
// ─── THEME ───────────────────────────────────────────────────
// Choice ('system'|'light'|'dark') lives in localStorage — a per-device UI
// preference, not clinical data, and it must be readable synchronously by the
// head script in index.html before first paint (IDB is async, and its session
// record expires after 24h). In the hub the app is always dark and the
// theme button is hidden (.in-hub .theme-btn), so the shared origin's stored
// choice never leaks into the embedded copy.
const THEME_KEY = 'physiq-assessment-theme';
const _themeMQ = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

function getThemePref() {
  try { const p = localStorage.getItem(THEME_KEY); if (p === 'light' || p === 'dark') return p; } catch (e) {}
  return 'system';
}

function applyTheme() {
  const pref = getThemePref();
  const inHub = window.self !== window.top;
  const resolved = inHub ? 'dark' : pref === 'system' ? (_themeMQ?.matches ? 'light' : 'dark') : pref;
  document.documentElement?.setAttribute('data-theme', resolved);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'light' ? '#ffffff' : '#0a0d12');
  const btn = document.getElementById('themeBtn');
  if (btn) {
    const ui = THEME_UI[pref];
    btn.innerHTML = ui.icon;
    const txt = `Apariencia: ${ui.label}. Pulsa para cambiar a ${THEME_UI[ui.next].label}`;
    btn.title = txt; btn.setAttribute('aria-label', txt);
  }
}

const _SVG = d => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const THEME_UI = {
  system: { next: 'light', label: 'Sistema', icon: _SVG('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>') },
  light:  { next: 'dark',  label: 'Claro',   icon: _SVG('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>') },
  dark:   { next: 'system', label: 'Oscuro', icon: _SVG('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>') },
};

// Header button: one tap cycles Sistema → Claro → Oscuro; its icon shows the current choice.
function cycleThemePref() {
  setThemePref(THEME_UI[getThemePref()].next);
}

function setThemePref(pref) {
  try {
    if (pref === 'system') localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, pref);
  } catch (e) {}
  applyTheme();
}

_themeMQ?.addEventListener?.('change', applyTheme);
applyTheme();

function _initHubIntegration() {
  if (window.self === window.top) return;
  document.body.classList.add('in-hub');
  document.querySelector('.logo-main').addEventListener('click', () => {
    window.parent.postMessage({ type: 'PHYSIQ_GO_HOME' }, '*');
  });
  // When the hub re-shows this iframe, rebuild the phase history stack so
  // swipe-back steps through phases (phase N → … → phase 1 → hub home).
  // Only replaceState+pushState — never history.go() inside an iframe, as
  // iOS Safari merges iframe and top-level history into one stack.
  window.addEventListener('message', e => {
    // The hub only toggles the `hidden` attribute on satellite iframes — it
    // never navigates away — so document.visibilitychange (tab-level) never
    // fires here. The hub tells us explicitly when it's about to hide us so
    // any open dialog (delete session, edit patient name…) doesn't linger.
    if (e.data?.type === 'PHYSIQ_SAT_HIDDEN') {
      saveSession();
      _closeAllOverlays();
      return;
    }
    if (e.data?.type !== 'PHYSIQ_SAT_VISIBLE') return;
    if (_pendingBackNav) return;
    const _phaseOrder = [1, 2, 3, 4, '4b', 5];
    const _phaseIdx = { 1:0, 2:1, 3:2, 4:3, '4b':4, 5:5 };
    const targetIdx = _phaseIdx[state.currentPhase] ?? 0;
    history.replaceState({ phase: 1 }, '');
    for (let i = 1; i <= targetIdx; i++) history.pushState({ phase: _phaseOrder[i] }, '');
    _historyDepth = targetIdx;
  });
}
_initHubIntegration();
_iniciarGrabadora();

// ─── PUBLIC API ──────────────────────────────────────────────
// Named exports for phase4.js / phase4b.js (which import these directly) and
// for tests/unit.js.
export { saveSession, showConfirmBanner, paintNav, buildPhysiQPayload, buildInformeFisioterapiaText, getSistemicoAffirmativeTexts,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML,
  precargarFormularioPrevio, nombreRegion, showToast,
  injectQuickInputBar, lockBodyScroll, unlockBodyScroll };

// Exposed on window for inline onclick/oninput attributes across index.html
// and dynamically-generated HTML — those resolve only against the global
// scope, never a module's private scope.
Object.assign(window, {
  abrirFormularioPrevio, abrirRazonamiento, cerrarRazonamiento, irACronologia, appendQuickPhrase, buildResults, closePhaseSheet, closeSessionPanel, copyContextToClipboard,
  copyInformeFisioterapia, finalizarValoracion, goToPhase, goToPhase2Next, handleTranslateClick, hideTranslateBanner,
  navStepClick, promptClearSession, resetApp, saveSession, scrollToActiveSisHeader, selectIrritab,
  selectIrritabSync, selectNRS, selectOption, selectPsico, selectRegion, selectSQ, selectSistQ,
  toggleAccordionRow, toggleDictation, toggleImpact, togglePhaseSheet, toggleSessionPanel,
  cycleThemePref, selectModo, toggleBreveVerTodo, completarPendientesBreve, selectEmbudo, selectIrritabDirecta, verResultadosSinConfirmar,
  updateEdadPaciente, updateVital, updateVitalColor, updateResetBtnVisibility,
  updateCirugia, selectCirProtocolo, toggleCirComplicacion, toggleDiagnosticoTratado,
});

// ========= SWIPE-TO-DISMISS BOTTOM SHEET =========
(function () {
  // `activo`: opcional; el panel del razonamiento solo es sheet en móvil (en
  // escritorio es un panel lateral y arrastrarlo hacia abajo no tiene sentido).
  function initSwipe(sheet, closeFn, activo = () => true) {
    let startY = 0, startTime = 0, dragging = false, delta = 0, snapTimer = null;
    const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';

    sheet.addEventListener('touchstart', e => {
      if (!activo()) return;
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
  const razon = document.getElementById('razonPanel');
  if (razon) initSwipe(razon, () => cerrarRazonamiento(), _esMovil);
}());

