// ============================================================
// PhysiQ-Assessment · APP.js
// Lógica principal de la aplicación
// ============================================================
import { state } from './state.js';
import { SYSTEMIC_SCREENING, HYPOTHESES, DOSIS_DERIVAR, TIEMPOS_TEJIDO, ZONAS_SINTOMA, CUESTIONARIOS, GRUPOS_CUESTIONARIO, PHASE_DEFS, PHASE_NAV_IDS, NRS_LABELS, NRS_CLASSES, QUICK_PHRASES } from './data.js';
import { initCIFTree, getDerivacionesArbol } from './phase4.js';
import { buildHypothesisCards, teardownHypObserver, restoreHypObserver, esTratada, marcarTratada, casillaTratadaHTML, hipotesis, hipotesisActivas, sincronizarTratadas, etiquetaHipHTML, anatomiaLineaHTML, anatomiaPanelHTML } from './phase4b.js';
import { registroReferencias, citasHTML, citasEnTexto } from './lib/citas.js';
import { alternarFicha, actualizarFicha, cerrarFicha, fichaAbierta } from './ficha.js';
import { writeSession, readSession, clearSession, updateSession } from './lib/session.js';
import {
  COMPLICACIONES, cirugiaVacia, esPosquirurgico, semanasCirugia, semanasTexto, conProtocolo, cirugiaPayload,
  cqConProtocolo, fechaSemanasTexto, TEXTO_SIN_PROTOCOLO, TEXTO_PAUTA_COMPATIBLE, TEXTO_NOTA_TRAUMA, ETIQUETA_TRATADA,
  ETIQUETA_HIP_POSQ, pautaHipPosq,
} from './lib/posquirurgico.js';
import { VERSION_SHA, textoVersion, esVersionNueva } from './lib/version.js';
import { nombreRegion, regionConLado } from './lib/region.js';
import { SILUETAS } from './data/siluetas.js';
import { figuraSilueta, estadoZona, ladoAlTocar, textoElegida, notaSexo, siluetaHTML } from './lib/silueta.js';
import { TEXTO_VALORACION_BREVE, textoNotas, textoInformePaciente } from './lib/resumenes.js';
import { ramaPauta } from './lib/pauta.js';
import { HM, ESTADOS_HM, SUBTIPOS_HM, hipermovilidadVacia, normalizarHipermovilidad, hmActiva, elementoHMVisible,
  cuestionarioVisible, beightonVisible, casillasBeighton, resultadoHAG, siCuestionario, respondidasCuestionario,
  reglaVascular, hmPayload, lineasRecomendacionHM } from './lib/hipermovilidad.js';
import { DS, TIPOS_DS, FILAS_PRUEBA, disautonomiaVacia, normalizarDisautonomia, pruebaVacia, dsActiva, sospechaVisible,
  siSospecha, respondidasSospecha, otraCausa, resultadoPrueba, dsPayload, textoPrueba, lineasRecomendacionDs,
  estadoReloj, textoTiempo, tomaFueraDeTiempo } from './lib/disautonomia.js';
import { LES, ESTADOS_LES, FILAS_LES, CASILLAS_LES, lupusVacio, normalizarLupus, lesActivo, lesDiagnosticado,
  rasgosVisibles, elementoLESVisible, siRasgos, respondidosRasgos, farmacoNuevo, pendientesLES, lePayload,
  datosLES, lineasRecomendacionLES } from './lib/lupus.js';
import { nivelMatriz, matrizVacia, NOMBRE_NIVEL } from './lib/irritabilidad.js';
import { ITEMS_IRRITABILIDAD, ITEM_IMPACTO, TEXTOS_IRRITABILIDAD } from './data/irritabilidad.js';
import { sintomaVacio, normalizarSintomas, payloadSintomas, lineaP1, lineaSecundario } from './lib/sintomas.js';
import { pintarSintomas } from './sintomas.js';
import { tiemposTejidoHTML, infoBarraHTML, fuentesTejidoHTML, filasPaciente, FILTRO_PACIENTE } from './lib/tejidos.js';
import { listaCuestionariosHTML, formularioCuestionarioHTML, resultadoCuestionarioHTML, itemCuestionarioHTML, resumenCuestionarios, cuestionariosEnTexto, enlacesCalcularHTML } from './lib/cuestionarios.js';
import { initAmpliarIA, iaParrafoHTML, ctxCribado, attrIA, DESTINOS_IA, NOTA_CUENTAS, destinoIA, guardarDestinoIA, promptPregunta, urlIA } from './ampliar-ia.js';

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

// Orden de las fases, de PHASE_DEFS (una sola fuente): 1 2 3 4 4b 5 6. La 6
// («Plan de tratamiento») es opcional: la valoración termina en la 5.
const _FASES = PHASE_DEFS.map(d => d.n);
const _NAV_IDS = _FASES.map(n => PHASE_NAV_IDS[n]);
const _idxFase = n => _FASES.findIndex(f => String(f) === String(n));
// Lo que se anuncia a physiq-report como fase alcanzada: como mucho la 5, que
// es donde termina la valoración (la 6 es un plan, no parte de ella).
const _faseAnunciada = () => _FASES[Math.min(state.maxVisitedIdx, _idxFase(5))];

window.addEventListener('popstate', e => {
  // Sheets del razonamiento (fase 2) y de compartir (fase 5), en móvil: el
  // atrás los cierra sin cambiar de fase, y nuestro propio history.back() al
  // cerrarlos de otra forma no navega.
  if (_popIgnorar) { _popIgnorar = false; return; }
  if (_razonHistorial) { cerrarRazonamiento({ desdeHistorial: true }); return; }
  if (_compartirHistorial) { cerrarMenuCompartir({ desdeHistorial: true }); return; }
  if (_herrHistorial) { cerrarHerramientas({ desdeHistorial: true }); return; }
  if (_preguntaHistorial) { cerrarPreguntaIA({ desdeHistorial: true }); return; }
  if (_tejidosHistorial) { cerrarTiemposTejido({ desdeHistorial: true }); return; }
  if (_cuestHistorial) { cerrarCuestionarios({ desdeHistorial: true }); return; }
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
  const naturalIdx = _idxFase(e.state.phase);
  if (naturalIdx >= 0) _historyDepth = naturalIdx;
  _handlingPopState = true;
  goToPhase(e.state.phase);
  _handlingPopState = false;
});


// ─── NAVIGATION ──────────────────────────────────────────────
function navStepClick(n) {
  const idx = _idxFase(n);
  const navEl = document.getElementById(_NAV_IDS[idx]);
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
  const phases = _FASES.map(f => `phase${f}`);

  // El panel del razonamiento es de la fase en la que se abrió (2 o 4b)
  if (String(n) !== String(state.currentPhase)) cerrarRazonamiento({ sinHistorial: true });
  // Y la ficha de una cita (ficha.js), siempre
  cerrarFicha({ sinFoco: true });

  // Save current state before leaving
  if (state.currentPhase === 1) collectPhase1();
  if (state.currentPhase === 3) collectPhase3();

  const idx = _idxFase(n);
  const prevIdx = Math.max(0, _idxFase(state.currentPhase));

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
  if (document.getElementById('versionAviso')) _colocarAvisoVersion();
  state.currentPhase = n;
  if (n === 3) { _pintarEstadioCronologia(); pintarSintomas(); }
  updateMobilePhaseBar(n);
  // Clean up observers when leaving phases
  if (typeof teardownHypObserver === 'function') teardownHypObserver();
  if (typeof teardownSisObserver === 'function') teardownSisObserver();
  // Restore observers when entering phases with open accordions
  if (n === 2 && typeof restoreSisObserver === 'function') setTimeout(restoreSisObserver, 50);
  if (n === '4b' && typeof restoreHypObserver === 'function') setTimeout(restoreHypObserver, 50);
  _programarBandas();

  // Update progress
  const pct = [0, 20, 40, 60, 80, 100, 100];
  document.getElementById('progressBar').style.width = pct[idx] + '%';
  document.getElementById('phaseIndicator').textContent = n === 6 ? 'FASE 6 · OPCIONAL' : `FASE ${n === '4b' ? '4b' : n} / 5`;

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
  if (n === 6) _montarPlan();

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!_handlingPopState) {
    if (idx > prevIdx) {
      // Push one entry per skipped phase so swipe-back steps through each one
      for (let i = prevIdx + 1; i <= idx; i++) {
        history.pushState({ phase: _FASES[i] }, '');
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
  _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_PARTIAL', phase: _faseAnunciada(), region: state.region || null });
  saveSession();
}

// Pinta el estado de cada paso del nav según maxVisitedIdx y flags de invalidación
function paintNav(activeIdx) {
  // Índices que quedan invalidados según los flags activos
  // regionChanged → invalida 4(idx3), 4b(idx4), 5(idx5) y 6(idx6)
  // treeModified  → invalida 4b(idx4), 5(idx5) y 6(idx6)
  const invalidated = new Set();
  if (state.regionChanged) { invalidated.add(3); invalidated.add(4); invalidated.add(5); invalidated.add(6); }
  if (state.treeModified)  { invalidated.add(4); invalidated.add(5); invalidated.add(6); }

  _NAV_IDS.forEach((navId, i) => {
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
  state.sexo = '';
  state.signosVitales = { fc: null, fr: null, spo2: null, tas: null, tad: null };
  state.antropometria = { talla: null, peso: null };
  state.mecanismo = '';
  state.cirugia = cirugiaVacia();
  state.hipermovilidad = hipermovilidadVacia();
  state.disautonomia = disautonomiaVacia();
  _dsRelojParar();
  state.lupus = lupusVacio();
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
  state.planTratamiento = null;
  state.formularioPrevio = { comun: {}, regiones: {} };
  state.cuestionarios = {};
  _cuestActivo = null;
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
  document.querySelectorAll('#sexo .option-btn').forEach(b => b.classList.remove('selected'));
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
  _pintarHMUI();
  _pintarDsUI();
  _pintarLESUI();
}

// «Reiniciar valoración» vive en el panel de sesión (antes, en la cabecera):
// como «Borrar sesión», cierra el panel mientras pregunta y lo reabre si se cancela.
function resetApp() {
  const panelAbierto = document.getElementById('sessionPanelOverlay')?.classList.contains('open');
  closeSessionPanel();
  showConfirmBanner(
    '↺ Reiniciar valoración completa',
    'Se perderán los datos clínicos de la valoración. El nombre del paciente se conservará.' + _avisoAudioSesion(),
    'Reiniciar',
    () => {
      _descartarAudioSesion();
      _softResetApp(); goToPhase(1);
      _sessionCh.postMessage({ type: 'SESSION_RESET', patient: state.patient || '' });
    },
    { onCancel: () => { if (panelAbierto) toggleSessionPanel(); } }
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
// Lo mismo agrupado y sin «No sé», para el informe con IA (informe-ia.js)
function resumenFormularioIA() {
  return _fpMod ? _fpMod.resumenFormularioIA() : [];
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
// Fase 6 «Plan de tratamiento» (plan.js): se carga al entrar en la fase. Si no
// carga, la valoración (fases 1–5) sigue funcionando.
let _planMod = null;
function _cargarPlan() {
  return import('./plan.js').then(m => { _planMod = m; return m; });
}
function _montarPlan() {
  _cargarPlan()
    .then(m => m.montarPlan(document.getElementById('planContenido')))
    .catch(() => {
      const c = document.getElementById('planContenido');
      if (c) c.innerHTML = '<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>No se ha podido cargar el plan de tratamiento. Recarga la página.</div></div>';
    });
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
  const fila = field.nextElementSibling?.classList.contains('quick-input-bar')
    ? field.nextElementSibling.querySelector('.chip-row') : null;
  if (fila) _vigilarBordesScroll(fila);
}

// Degradado en el lado por el que quedan chips fuera de la vista. El
// ResizeObserver lo recalcula también cuando la fila pasa de oculta (fase no
// activa, <details> cerrado: ancho 0) a visible, y al girar la pantalla.
function _vigilarBordesScroll(fila) {
  _bordesScroll(fila);
  fila.addEventListener('scroll', () => _bordesScroll(fila), { passive: true });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => _bordesScroll(fila)).observe(fila);
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
  if (!field || btn.disabled) return;
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
    const valor = baseValue + baseSep + combined;
    // `maxlength` solo frena lo que se teclea, no lo que se escribe por código
    field.value = field.maxLength > 0 ? valor.slice(0, field.maxLength) : valor;
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
  // La silueta marca el lado y el sexo (el mismo dato que en la fase 1), y su
  // figura sigue al sexo
  if (groupId === 'lado' || groupId === 'sexo') _pintarSilueta();
  if (groupId === 'mecanismo') {
    _pintarCirugiaUI();
    // `pq1` y la casilla «Tratada con la cirugía» dependen del mecanismo
    sincronizarTratadas();
    _invalidar4b();
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
  suggest.innerHTML = _herramientaPsicoHTML();

  altoQ.style.display = value === 'Alto' ? 'block' : 'none';
  saveSession();
}

// Riesgo psicosocial (fase 1): solo herramientas validadas en castellano de
// España (decisión del usuario, 2026-10). STarT Back salió de la
// recomendación lumbar: su versión de España (Gusi 2011) es solo una
// traducción. El Örebro de 21 ítems sí (Cuesta-Vargas 2014); su forma corta
// de 10 ítems no tiene versión española. Ver docs/cuestionarios.md.
const TEXTO_HERRAMIENTA_PSICO = 'Herramienta recomendada: <strong>Örebro (OMPSQ, 21 ítems)</strong> — validada en castellano de España para dolor musculoesquelético de cualquier región (Cuesta-Vargas 2014).';
const _herramientaPsicoHTML = () => TEXTO_HERRAMIENTA_PSICO + enlacesCalcular(TEXTO_HERRAMIENTA_PSICO);

function updatePsicoRecomendacion() {
  const rec = document.getElementById('psicoRecomendacion');
  const { psico_miedo, psico_autoef, psico_emocional } = state;
  const tools = [];
  if (psico_miedo === 'Sí' || psico_miedo === 'Dudoso') tools.push('FABQ (Cuestionario de Creencias de Miedo-Evitación), TSK-11 (Escala de Kinesiofobia de Tampa), PCS (Escala de Catastrofización del Dolor)');
  if (psico_autoef === 'Sí' || psico_autoef === 'Dudoso') tools.push('CADC (Cuestionario de Autoeficacia en Dolor Crónico)');
  if (psico_emocional === 'Sí' || psico_emocional === 'Dudoso') tools.push('PHQ-2 → PHQ-9 (Cuestionario de Salud del Paciente)');

  if (tools.length > 0) {
    rec.style.display = 'block';
    rec.innerHTML = `<strong>Cuestionarios unidimensionales sugeridos:</strong>${tools.map(t => `<div class="psico-herr">${t}${enlacesCalcular(t)}</div>`).join('')}`;
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

// La tarjeta de `pq1` en la 4b lleva la intervención, el protocolo y las
// restricciones: se vacía para que se reconstruya al volver a la 4b.
function _invalidar4b() {
  const cards = document.getElementById('hypothesisCards');
  if (cards) cards.innerHTML = '';
}

function updateCirugia(campo, valor) {
  if (campo === 'semanasAprox') valor = valor === '' ? null : Number(valor);
  state.cirugia[campo] = valor;
  if (campo === 'intervencion' || campo === 'restricciones') _invalidar4b();
  if (campo === 'fecha' || campo === 'semanasAprox') _pintarCirugiaDerivados();
  saveSession();
}

function selectCirProtocolo(btn, valor) {
  state.cirugia.protocolo = state.cirugia.protocolo === valor ? '' : valor;
  _invalidar4b();
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

// ─── HIPERMOVILIDAD / EHLERS-DANLOS (Fase P, docs/hipermovilidad.md) ─────
// Tarjeta de la fase 1: No consta (nada marcado) · Diagnosticada · Sospecha,
// con subtipo si está diagnosticada. Activa el sistema de la fase 2, el aviso
// de los tests de laxitud de la 4b y el recuadro de la fase 5.
function _pintarHMUI() {
  const hm = state.hipermovilidad;
  document.body.classList.toggle('hipermovilidad', hmActiva(hm));
  document.querySelectorAll('#hmEstado .option-btn').forEach(b => b.classList.toggle('selected', b.dataset.valor === hm.estado));
  document.querySelectorAll('#hmSubtipo .option-btn').forEach(b => b.classList.toggle('selected', b.dataset.valor === hm.subtipo));
  const sub = document.getElementById('hmSubtipoWrap');
  if (sub) sub.style.display = hm.estado === 'diagnosticada' ? '' : 'none';
}

// Cambiar el estado o el subtipo cambia qué se pregunta en la fase 2 (se
// repinta conservando las respuestas) y los avisos de la 4b.
function _hmCambio() {
  _pintarHMUI();
  _invalidar4b();
  if (state.region && document.getElementById('sistemaPanels')?.children.length) _repintarCribado();
  saveSession();
}

function selectHMEstado(valor) {
  state.hipermovilidad.estado = state.hipermovilidad.estado === valor ? '' : valor;
  _hmCambio();
}

function selectHMSubtipo(valor) {
  state.hipermovilidad.subtipo = state.hipermovilidad.subtipo === valor ? '' : valor;
  _hmCambio();
}

// Cuestionario de 5 preguntas: un segundo toque sobre la respuesta marcada la quita.
function selectHMCuest(id, valor) {
  const c = state.hipermovilidad.cuestionario;
  if (c[id] === valor) delete c[id]; else c[id] = valor;
  _pintarHMBloques();
  saveSession();
}

function hmBeightonHacer() {
  state.hipermovilidad.beighton = {};
  _pintarHMBloques();
  saveSession();
}

function hmBeightonQuitar() {
  state.hipermovilidad.beighton = null;
  _pintarHMBloques();
  saveSession();
}

function toggleHMBeighton(k) {
  const b = state.hipermovilidad.beighton;
  if (!b) return;
  if (b[k]) delete b[k]; else b[k] = true;
  _pintarHMBloques();
  saveSession();
}

// Payload `hm` (null sin la condición activa).
function getHMPayload() {
  return hmPayload(state.hipermovilidad, state.edadPaciente, state.sistemicoAnswers);
}

// Bloque del sistema de la fase 2 (va dos veces: panel de escritorio y acordeón).
function _hmBloqueHTML() {
  const hm = state.hipermovilidad;
  const partes = [];
  if (cuestionarioVisible(hm)) {
    const n = respondidasCuestionario(hm), si = siCuestionario(hm);
    partes.push(`<div class="screening-section-title">📝 Cuestionario de 5 preguntas</div>
      ${HM.cuestionario.map((q, i) => `<div class="sq2 hm-cq">
        <div class="sq2-badge">${i + 1}</div>
        <div class="sq2-text">${q.texto}</div>
        <div class="sq-btns">
          <button type="button" class="sq-btn si${hm.cuestionario[q.id] === 'SI' ? ' selected' : ''}" onclick="selectHMCuest('${q.id}','SI')">SÍ</button>
          <button type="button" class="sq-btn no${hm.cuestionario[q.id] === 'NO' ? ' selected' : ''}" onclick="selectHMCuest('${q.id}','NO')">NO</button>
        </div>
      </div>`).join('')}
      <div class="hm-resultado">${n ? `${si} de ${n} con «sí»${si >= 2 ? ': cuestionario positivo' : ''}` : 'Sin contestar'}</div>
      <div class="hm-fuente">${citasEnTexto(HM.cuestionarioFuente)}</div>`);
  }
  if (beightonVisible(hm)) {
    const b = hm.beighton;
    let cuerpo;
    if (!b) {
      cuerpo = `<button type="button" class="btn-secondary hm-btn" onclick="hmBeightonHacer()">Hacer la escala de Beighton</button>`;
    } else {
      const r = resultadoHAG(hm, state.edadPaciente);
      const fila = (k, txt) => `<label class="hm-casilla"><input type="checkbox"${b[k] ? ' checked' : ''} onchange="toggleHMBeighton('${k}')"> ${txt}</label>`;
      cuerpo = `${HM.beighton.map(m => `<div class="hm-maniobra">
          <div class="hm-maniobra-txt">${m.texto}</div>
          <div class="hm-lados">${m.lados ? fila(`${m.id}_d`, 'Derecho') + fila(`${m.id}_i`, 'Izquierdo') : fila(m.id, 'Positivo')}</div>
        </div>`).join('')}
        <div class="hm-resultado">Beighton ${r.puntos}/9${r.corte != null ? ` · corte ${r.corte} (${r.grupo})` : ''}</div>
        ${r.estado === 'sin-edad' ? `<div class="criterio-compuesto-hint">Indique la edad del paciente en la Fase 1 para aplicar el corte por edad.</div>` : ''}
        ${r.estado === 'hag' ? `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>${citasEnTexto(HM.textos.derivarHAG)}${r.porCuestionario ? '<div class="hm-nota">Un punto por debajo del corte, con el cuestionario positivo.</div>' : ''}</div></div>` : ''}
        ${r.estado === 'no-hag' ? `<div class="hm-nota">${HM.textos.sinHAG}</div>` : ''}
        <div class="hm-fuente">${citasEnTexto(HM.beightonFuente)} ${citasEnTexto(HM.cortesFuente)}</div>
        <div class="hm-fuente">${citasEnTexto(HM.notaLimitacion)}</div>
        ${lesActivo(state.lupus) ? `<div class="hm-fuente">🦋 ${citasEnTexto(LES.textos.hipermovilidad)}</div>` : ''}
        <button type="button" class="hm-quitar" onclick="hmBeightonQuitar()">Quitar la escala</button>`;
    }
    partes.push(`<div class="screening-section-title">🤸 Escala de Beighton${hm.estado === 'diagnosticada' ? ' (opcional)' : ''}</div>${cuerpo}`);
  }
  return partes.join('');
}

function _pintarHMVascular() {
  const r = reglaVascular(state.hipermovilidad, state.sistemicoAnswers);
  const html = !r || !r.total ? ''
    : r.derivar
      ? `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>${citasEnTexto(HM.textos.derivarVascular)}</div></div>`
      : `<div class="criterio-compuesto-hint">${citasEnTexto(HM.textos.hallazgoVascular)}</div>`;
  document.querySelectorAll('[data-hm-vascular]').forEach(el => { el.innerHTML = html; });
}

function _pintarHMBloques() {
  const html = _hmBloqueHTML();
  document.querySelectorAll('[data-hm-bloque]').forEach(el => { el.innerHTML = html; });
  _pintarHMVascular();
}

// Recuadro de la fase 5 (docs/hipermovilidad.md): nunca se pliega.
function _hipermovilidadResultadosHTML(d) {
  const estado = d.es === 'diagnosticada'
    ? `Diagnosticada${d.st && d.st !== 'ns' ? ` · subtipo ${SUBTIPOS_HM[d.st].toLowerCase()}` : ''}`
    : 'Sospecha';
  const datos = [d.bt != null ? `Beighton ${d.bt}/9${d.co != null ? ` (corte ${d.co})` : ''}` : '',
    d.cu != null ? `cuestionario ${d.cu}/5` : ''].filter(Boolean).join(' · ');
  return `
    <div class="alert alert-info hm-fase5" style="margin-bottom:1rem;">
      <span class="alert-icon">🧬</span>
      <div><strong>Hipermovilidad.</strong> ${estado}${datos ? ` · ${datos}` : ''}
        ${lineasRecomendacionHM(d).map(t => `<div>${citasEnTexto(t)}</div>`).join('')}
      </div>
    </div>`;
}

// ─── DISAUTONOMÍA / POTS (Fase P, docs/pots.md) ───────────────────────────
// Tarjeta de la fase 1: No consta (nada marcado) · Diagnosticada · Sospecha,
// con «cuál» si está diagnosticada. Activa el sistema de la fase 2 (síncope de
// alto riesgo, patrón de sospecha y prueba de bipedestación activa), las notas
// de las fases 3, 4 y 4b, el recuadro de la fase 5 y el aviso de la fase 6.
function _pintarDsUI() {
  const ds = state.disautonomia;
  document.body.classList.toggle('disautonomia', dsActiva(ds));
  document.querySelectorAll('#dsEstado .option-btn').forEach(b => b.classList.toggle('selected', b.dataset.valor === ds.estado));
  document.querySelectorAll('#dsTipo .option-btn').forEach(b => b.classList.toggle('selected', b.dataset.valor === ds.tipo));
  const tipo = document.getElementById('dsTipoWrap');
  if (tipo) tipo.style.display = ds.estado === 'diagnosticada' ? '' : 'none';
  const nota = document.getElementById('dsNotaTolerancia');
  if (nota && !nota.innerHTML) nota.innerHTML = `🫀 ${citasEnTexto(DS.textos.tolerancia)}`;
}

function _dsCambio() {
  _pintarDsUI();
  _invalidar4b();
  if (state.region && document.getElementById('sistemaPanels')?.children.length) _repintarCribado();
  saveSession();
}

function selectDsEstado(valor) {
  state.disautonomia.estado = state.disautonomia.estado === valor ? '' : valor;
  _dsCambio();
}

function selectDsTipo(valor) {
  state.disautonomia.tipo = state.disautonomia.tipo === valor ? '' : valor;
  _dsCambio();
}

// Patrón de sospecha: un segundo toque sobre la respuesta marcada la quita.
function selectDsSospecha(id, valor) {
  const s = state.disautonomia.sospecha;
  if (s[id] === valor) delete s[id]; else s[id] = valor;
  _pintarDsBloques();
  saveSession();
}

function dsPruebaHacer() {
  state.disautonomia.bipedestacion = pruebaVacia();
  _pintarDsBloques();
  saveSession();
}

function dsPruebaQuitar() {
  state.disautonomia.bipedestacion = null;
  _dsRelojParar();
  _pintarDsBloques();
  saveSession();
}

function toggleDsPrep(k) {
  const b = state.disautonomia.bipedestacion;
  if (!b) return;
  b.prep = b.prep || {};
  if (b.prep[k]) delete b.prep[k]; else b.prep[k] = true;
  _pintarDsBloques();
  saveSession();
}

// Una cifra de la prueba. No repinta el bloque (se perdería el foco): copia
// el valor a la otra copia del sistema (panel o acordeón) y repinta solo el
// resultado.
function updateDsPrueba(fila, campo, el) {
  const b = state.disautonomia.bipedestacion;
  if (!b) return;
  b[fila] = b[fila] || {};
  if (campo === 'sintomas') {
    if (el.checked) b[fila].sintomas = true; else delete b[fila].sintomas;
  } else {
    const n = el.value === '' ? null : Number(el.value);
    if (n === null || isNaN(n)) delete b[fila][campo]; else b[fila][campo] = n;
    // Reloj en marcha: a qué segundo de pie se escribió la primera FC de la fila
    const e = estadoReloj(b.reloj, Date.now());
    if (campo === 'fc' && n != null && e?.fase === 'pie' && !e.caducado && fila !== 'tumbado' && b.reloj.tomas?.[fila] == null) {
      b.reloj.tomas = { ...(b.reloj.tomas || {}), [fila]: Math.round(e.s) };
      _pintarDsTomas();
    }
  }
  document.querySelectorAll(`[data-ds-fila="${fila}"][data-ds-campo="${campo}"]`).forEach(x => {
    if (x === el) return;
    if (campo === 'sintomas') x.checked = !!b[fila].sintomas; else x.value = b[fila][campo] ?? '';
  });
  _pintarDsResultado();
  saveSession();
}

// Payload `ds` (null sin la condición activa).
function getDsPayload() {
  return dsPayload(state.disautonomia, state.edadPaciente);
}

const _ETIQ_FILA_DS = f => (f === 'tumbado' ? 'Tumbado' : `${f.slice(1)} min`);

function _dsResultadoHTML() {
  const r = resultadoPrueba(state.disautonomia.bipedestacion, state.edadPaciente);
  const t = DS.textos;
  const caja = (tono, icono, texto) => `<div class="alert alert-${tono}"><span class="alert-icon">${icono}</span><div>${citasEnTexto(texto)}</div></div>`;
  const notas = [];
  if (r.reposoAlta) notas.push(caja('warning', '⚠️', t.reposoAlta));
  if (r.tasBaja) notas.push(caja('warning', '⚠️', t.tasBaja));
  const ref = r.referencia != null ? `Referencia ${r.referencia} lpm${r.corte != null ? ` · corte +${r.corte} (${r.grupo})` : ''}` : '';
  const aumentos = (r.filas || []).filter(f => f.aumento != null).map(f => `${f.min}′ ${f.aumento >= 0 ? '+' : ''}${f.aumento}`).join(' · ');
  let principal = '';
  if (r.estado === 'menor12') principal = `<div class="hm-nota">${citasEnTexto(t.menor12)}</div>`;
  else if (r.estado === 'sin-edad') principal = `<div class="criterio-compuesto-hint">Indique la edad del paciente en la Fase 1 para aplicar el corte (30 lpm en adultos, 40 de 12 a 19 años).</div>`;
  else if (r.estado === 'ho') principal = caja('warning', '⚠️', t.ho);
  else if (r.estado === 'compatible') principal = caja('warning', '⚠️', `Aumento de la FC de ${r.dfc} lpm mantenido, sin hipotensión ortostática. ${t.compatible}`) + (r.sintomas ? '' : `<div class="hm-nota">${citasEnTexto(t.sinSintomas)}</div>`);
  else if (r.estado === 'repetir') principal = `<div class="criterio-compuesto-hint">${citasEnTexto(t.ultima)}</div>`;
  else if (r.estado === 'no-corte') principal = `<div class="hm-nota">${citasEnTexto(t.noCorte)}</div>`;
  else if (r.estado === 'incompleta') principal = `<div class="hm-nota">Faltan la FC tumbado o al menos 2 medidas de pie después del primer minuto.</div>`;
  return `${ref ? `<div class="hm-resultado">${ref}${aumentos ? `<br>${aumentos}` : ''}</div>` : ''}${principal}${notas.join('')}`;
}

function _pintarDsResultado() {
  const html = _dsResultadoHTML();
  document.querySelectorAll('[data-ds-resultado]').forEach(el => { el.innerHTML = html; });
}

// Bloque del sistema de la fase 2 (va dos veces: panel de escritorio y acordeón).
function _dsBloqueHTML() {
  const ds = state.disautonomia;
  const partes = [];
  if (sospechaVisible(ds)) {
    const n = respondidasSospecha(ds), si = siSospecha(ds);
    partes.push(`<div class="screening-section-title">📝 Patrón de intolerancia ortostática</div>
      ${DS.sospecha.map((q, i) => `<div class="sq2 ds-io">
        <div class="sq2-badge">${i + 1}</div>
        <div class="sq2-text">${q.texto}</div>
        <div class="sq-btns">
          <button type="button" class="sq-btn si${ds.sospecha[q.id] === 'SI' ? ' selected' : ''}" onclick="selectDsSospecha('${q.id}','SI')">SÍ</button>
          <button type="button" class="sq-btn no${ds.sospecha[q.id] === 'NO' ? ' selected' : ''}" onclick="selectDsSospecha('${q.id}','NO')">NO</button>
        </div>
      </div>`).join('')}
      <div class="hm-resultado">${n ? `${si} de 2 con «sí»${otraCausa(ds) ? ' · posible otra causa de taquicardia' : ''}` : 'Sin contestar'}</div>
      <div class="hm-fuente">${citasEnTexto(DS.sospechaFuente)}</div>
      <div class="hm-fuente">${citasEnTexto(DS.diferencialFuente)}</div>
      <div class="hm-fuente">${citasEnTexto(DS.hipermovilidad)}</div>`);
  }
  const b = ds.bipedestacion;
  let cuerpo;
  if (!b) {
    cuerpo = `<button type="button" class="btn-secondary hm-btn" onclick="dsPruebaHacer()">Hacer la prueba de bipedestación</button>`;
  } else {
    const num = (f, c) => `<input type="number" inputmode="numeric" class="form-input" min="20" max="260" aria-label="${_ETIQ_FILA_DS(f)}: ${c.toUpperCase()}" data-ds-fila="${f}" data-ds-campo="${c}" value="${b[f]?.[c] ?? ''}" oninput="updateDsPrueba('${f}','${c}',this)">`;
    cuerpo = `<div class="ds-prep">${DS.prueba.preparacion.map(p => `<label class="hm-casilla"><input type="checkbox"${b.prep?.[p.id] ? ' checked' : ''} onchange="toggleDsPrep('${p.id}')"> ${p.texto}</label>`).join('')}</div>
      <div class="ds-nota">${DS.prueba.seguridad}</div>
      <div class="ds-reloj" data-ds-reloj>${_dsRelojHTML()}</div>
      <div class="ds-tabla">
        <div class="ds-tabla-cab"></div><div class="ds-tabla-cab">FC</div><div class="ds-tabla-cab">TAS</div><div class="ds-tabla-cab">TAD</div><div class="ds-tabla-cab">Sínt.</div>
        ${FILAS_PRUEBA.map(f => `<div class="ds-fila-et" data-ds-et="${f}">${_ETIQ_FILA_DS(f)}${_dsTomaHTML(f)}</div>${num(f, 'fc')}${num(f, 'tas')}${num(f, 'tad')}
          <div class="ds-sint">${f === 'tumbado' ? '' : `<input type="checkbox" aria-label="${_ETIQ_FILA_DS(f)}: síntomas" data-ds-fila="${f}" data-ds-campo="sintomas"${b[f]?.sintomas ? ' checked' : ''} onchange="updateDsPrueba('${f}','sintomas',this)">`}</div>`).join('')}
      </div>
      <div data-ds-resultado>${_dsResultadoHTML()}</div>
      <div class="hm-fuente">${citasEnTexto(DS.prueba.fuente)}</div>
      <div class="hm-fuente">${citasEnTexto(DS.prueba.pesa)}</div>
      <button type="button" class="hm-quitar" onclick="dsPruebaQuitar()">Quitar la prueba</button>`;
  }
  partes.push(`<div class="screening-section-title">🧍 Prueba de bipedestación activa${ds.estado === 'diagnosticada' ? ' (opcional)' : ''}</div>${cuerpo}`);
  return partes.join('');
}

function _pintarDsBloques() {
  const html = _dsBloqueHTML();
  document.querySelectorAll('[data-ds-bloque]').forEach(el => { el.innerHTML = html; });
  _dsMarcarFila();
  _dsRelojArrancar();
}

// ── Reloj de la prueba de bipedestación (docs/pots.md, «Reloj») ──
// Un solo reloj para las dos copias del bloque. El tiempo sale de
// `reloj.inicio` (lib/disautonomia.js, estadoReloj), así que el intervalo solo
// repinta; avisa una vez por marca (fin del reposo, cada minuto de medida)
// con un pitido, vibración donde la haya y la fila resaltada.
let _dsTick = null, _dsMarcasAvisadas = 0, _dsAudio = null, _dsWakeLock = null;

const _dsReloj = () => state.disautonomia?.bipedestacion?.reloj || null;

// Qué muestra el reloj: la parte fija (botones) solo cambia con el `modo`;
// cada segundo se cambian solo los textos, para no sustituir un botón bajo el
// dedo (un toque en «Parar» no se pierde).
function _dsRelojVista(e) {
  if (!e || e.caducado) return { modo: 'sin' };
  if (e.fase === 'reposo') {
    return e.cumplido
      ? { modo: 'reposo-ok', fase: 'Reposo', tiempo: textoTiempo(e.s), toca: 'Reposo cumplido: toma la medida tumbado.', sig: '' }
      : { modo: 'reposo', fase: 'Reposo', tiempo: textoTiempo(e.s), toca: '', sig: `Tumbado: quedan ${textoTiempo(Math.ceil(e.restante))}` };
  }
  if (e.terminado) return { modo: 'fin', fase: 'De pie', tiempo: textoTiempo(e.s), toca: '', sig: `Prueba terminada: ${DS.prueba.minutos[DS.prueba.minutos.length - 1]} min de pie.` };
  return { modo: 'pie', fase: 'De pie', tiempo: textoTiempo(e.s),
    toca: e.fila ? `Ahora: medida de ${_ETIQ_FILA_DS(e.fila)}` : '',
    sig: e.proxima ? `Siguiente: ${_ETIQ_FILA_DS(e.proxima.fila)} en ${textoTiempo(Math.ceil(e.proxima.en))}` : '' };
}

function _dsRelojHTML(v = _dsRelojVista(estadoReloj(_dsReloj(), Date.now()))) {
  const btn = (fn, texto, clase = 'btn-secondary') => `<button type="button" class="${clase} ds-reloj-btn" onclick="${fn}">${texto}</button>`;
  if (v.modo === 'sin') {
    return `<div class="ds-reloj-botones" data-modo="sin">${btn("dsRelojEmpezar('reposo')", 'Empezar reposo tumbado (5 min)')}${btn("dsRelojEmpezar('pie')", 'Se pone de pie')}</div>`;
  }
  const botones = v.modo === 'fin' ? btn('dsRelojParar()', 'Cerrar el reloj')
    : v.modo === 'pie' ? btn('dsRelojParar()', 'Parar')
      : btn("dsRelojEmpezar('pie')", 'Se pone de pie', 'btn-primary') + btn('dsRelojParar()', 'Parar');
  return `<div class="ds-reloj-cab" data-modo="${v.modo}"><span class="ds-reloj-fase">${v.fase}</span><span class="ds-reloj-tiempo" role="timer" data-r="tiempo">${v.tiempo}</span></div>
    <div class="ds-reloj-toca" data-r="toca">${v.toca}</div><div class="ds-reloj-sig" data-r="sig">${v.sig}</div>
    <div class="ds-reloj-botones">${botones}</div>`;
}

function _pintarDsReloj() {
  const v = _dsRelojVista(estadoReloj(_dsReloj(), Date.now()));
  document.querySelectorAll('[data-ds-reloj]').forEach(el => {
    if (el.querySelector('[data-modo]')?.dataset.modo !== v.modo) { el.innerHTML = _dsRelojHTML(v); return; }
    el.querySelectorAll('[data-r]').forEach(x => { const t = v[x.dataset.r]; if (x.textContent !== t) x.textContent = t; });
  });
}

// «toma a las 3:40» junto a la fila cuando la FC se escribió lejos de su minuto
function _dsTomaHTML(f) {
  const t = tomaFueraDeTiempo(f, _dsReloj()?.tomas?.[f]);
  return t == null ? '' : `<span class="ds-toma">toma a las ${textoTiempo(t)}</span>`;
}

function _pintarDsTomas() {
  FILAS_PRUEBA.forEach(f => document.querySelectorAll(`[data-ds-et="${f}"]`).forEach(el => {
    el.innerHTML = `${_ETIQ_FILA_DS(f)}${_dsTomaHTML(f)}`;
  }));
}

// Resalta la fila que toca (etiqueta y casillas) en las dos copias
function _dsMarcarFila() {
  const e = estadoReloj(_dsReloj(), Date.now());
  const fila = e && !e.caducado ? e.fila : null;
  document.querySelectorAll('[data-ds-et], .ds-tabla [data-ds-fila]').forEach(el => {
    const f = el.dataset.dsEt || el.dataset.dsFila;
    el.classList.toggle('ds-fila-toca', f === fila);
  });
  return fila;
}

function _dsPitido() {
  try {
    navigator.vibrate?.(200);
    if (!_dsAudio) return;
    if (_dsAudio.state === 'suspended') _dsAudio.resume();
    const o = _dsAudio.createOscillator(), g = _dsAudio.createGain();
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, _dsAudio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, _dsAudio.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, _dsAudio.currentTime + 0.35);
    o.connect(g).connect(_dsAudio.destination);
    o.start(); o.stop(_dsAudio.currentTime + 0.4);
  } catch { /* sin sonido: queda el aviso en pantalla */ }
}

function _dsPantallaEncendida(si) {
  if (si) {
    if (_dsWakeLock || document.visibilityState !== 'visible') return;
    navigator.wakeLock?.request('screen').then(l => {
      if (_dsTick) _dsWakeLock = l; else l.release().catch(() => {});
    }).catch(() => {});
  } else {
    _dsWakeLock?.release?.().catch(() => {});
    _dsWakeLock = null;
  }
}

function _dsRelojTick() {
  const reloj = _dsReloj();
  const e = dsActiva(state.disautonomia) ? estadoReloj(reloj, Date.now()) : null;
  if (!e || e.caducado || e.terminado || (e.fase === 'reposo' && e.cumplido && e.marcas <= _dsMarcasAvisadas)) {
    // Nada que contar: último repintado y fuera el intervalo
    clearInterval(_dsTick); _dsTick = null;
    _dsPantallaEncendida(false);
  }
  _pintarDsReloj();
  const fila = _dsMarcarFila();
  if (e && !e.caducado && e.marcas > _dsMarcasAvisadas) {
    _dsMarcasAvisadas = e.marcas;
    _dsPitido();
    // La fila que toca, a la vista (la copia visible: panel o acordeón)
    const et = [...document.querySelectorAll(`[data-ds-et="${fila}"]`)].find(x => x.offsetParent !== null);
    if (et) {
      const r = et.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 80) et.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
}

// Arranca el intervalo si hay un reloj en marcha (al pintar el bloque o al
// restaurar la sesión). Las marcas ya pasadas no vuelven a pitar.
function _dsRelojArrancar() {
  if (_dsTick) return;
  const e = estadoReloj(_dsReloj(), Date.now());
  if (!e || e.caducado || e.terminado || (e.fase === 'reposo' && e.cumplido)) return;
  _dsMarcasAvisadas = e.marcas;
  _dsTick = setInterval(_dsRelojTick, 250);
  _dsPantallaEncendida(true);
}

function _dsRelojParar() {
  clearInterval(_dsTick); _dsTick = null;
  _dsPantallaEncendida(false);
}

function dsRelojEmpezar(fase) {
  const b = state.disautonomia.bipedestacion;
  if (!b) return;
  // El toque en el botón permite el sonido después (los navegadores lo exigen)
  try { _dsAudio = _dsAudio || new (window.AudioContext || window.webkitAudioContext)(); _dsAudio.resume?.(); } catch { _dsAudio = null; }
  b.reloj = { fase, inicio: Date.now(), tomas: {} };
  _dsRelojParar();
  _pintarDsBloques();
  saveSession();
}

function dsRelojParar() {
  const b = state.disautonomia.bipedestacion;
  if (b) b.reloj = null;
  _dsRelojParar();
  _pintarDsBloques();
  saveSession();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && _dsTick) { _dsPantallaEncendida(true); _dsRelojTick(); }
});

// Recuadro de la fase 5 (docs/pots.md): nunca se pliega.
function _disautonomiaResultadosHTML(d) {
  const estado = d.es === 'diagnosticada' ? `Diagnosticada${d.ti && d.ti !== 'otra' ? ` · ${TIPOS_DS[d.ti]}` : ''}` : 'Sospecha';
  const prueba = textoPrueba(d);
  return `
    <div class="alert alert-info ds-fase5" style="margin-bottom:1rem;">
      <span class="alert-icon">🫀</span>
      <div><strong>Disautonomía.</strong> ${estado}${prueba ? ` · ${prueba.replace(/^\S/, c => c.toUpperCase())}` : ''}
        ${lineasRecomendacionDs(d).map(t => `<div>${citasEnTexto(t)}</div>`).join('')}
      </div>
    </div>`;
}

// ─── LUPUS (Fase P, docs/lupus.md) ─────────────────────────────────────────
// Tarjeta de la fase 1: No consta (nada marcado) · Diagnosticado · Sospecha.
// Con «Diagnosticado», cinco filas de botones (corticoides, dosis altas,
// inmunosupresores, antifosfolípidos, actividad) y tres casillas; activa las
// urgencias y derivaciones del sistema de la fase 2, las notas de las fases 3
// y 4b, el recuadro de la fase 5 y los avisos y la red de la fase 6. Con
// «Sospecha», el sistema solo muestra los rasgos (data-les-bloque).
function _pintarLESUI() {
  const les = state.lupus;
  document.body.classList.toggle('lupus', lesActivo(les));
  document.querySelectorAll('#lesEstado .option-btn').forEach(b => b.classList.toggle('selected', b.dataset.valor === les.estado));
  const wrap = document.getElementById('lesDiagWrap');
  if (wrap) wrap.style.display = lesDiagnosticado(les) ? '' : 'none';
  Object.keys(FILAS_LES).forEach(k => document.querySelectorAll(`[data-les-fila="${k}"] .option-btn`)
    .forEach(b => b.classList.toggle('selected', b.dataset.valor === les[k])));
  CASILLAS_LES.forEach(k => { const c = document.getElementById(`les_${k}`); if (c) c.checked = !!les[k]; });
  const nat = document.getElementById('lesNotaNaturaleza');
  if (nat && !nat.innerHTML) nat.innerHTML = `🦋 ${citasEnTexto(LES.textos.naturaleza)}`;
  const brote = document.getElementById('lesNotaBrote');
  if (brote) {
    if (!brote.innerHTML) brote.innerHTML = `🦋 ${citasEnTexto(LES.textos.brote3)}`;
    brote.style.display = lesDiagnosticado(les) && ['brote', 'peor'].includes(les.actividad) ? '' : 'none';
  }
}

function _lesCambio() {
  _pintarLESUI();
  _invalidar4b();
  if (state.region && document.getElementById('sistemaPanels')?.children.length) _repintarCribado();
  saveSession();
}

function selectLESEstado(valor) {
  state.lupus.estado = state.lupus.estado === valor ? '' : valor;
  _lesCambio();
}

// Filas de la tarjeta: un segundo toque sobre la opción marcada la quita.
function selectLESFila(fila, valor) {
  if (!FILAS_LES[fila]) return;
  state.lupus[fila] = state.lupus[fila] === valor ? '' : valor;
  _lesCambio();
}

function toggleLESCasilla(k) {
  if (!CASILLAS_LES.includes(k)) return;
  state.lupus[k] = !state.lupus[k];
  _lesCambio();
}

// Rasgos de la sospecha: un segundo toque sobre la respuesta marcada la quita.
function selectLESRasgo(id, valor) {
  const r = state.lupus.rasgos;
  if (r[id] === valor) delete r[id]; else r[id] = valor;
  _pintarLESBloques();
  saveSession();
}

function getLePayload() {
  return lePayload(state.lupus);
}

// Bloque del sistema de la fase 2 (va dos veces: panel de escritorio y acordeón).
function _lesBloqueHTML() {
  const les = state.lupus;
  if (!rasgosVisibles(les)) return '';
  const n = respondidosRasgos(les), si = siRasgos(les);
  const resultado = !n ? '<div class="hm-resultado">Sin contestar</div>'
    : `<div class="hm-resultado">${si} de 5 con «sí»</div>${si
      ? `<div class="alert alert-warning"><span class="alert-icon">⚠️</span><div>${citasEnTexto(LES.textos.derivar)}</div></div>`
      : `<div class="hm-nota">${LES.textos.sinRasgos}</div>`}${farmacoNuevo(les) ? `<div class="hm-nota">${citasEnTexto(LES.textos.farmaco)}</div>` : ''}`;
  return `<div class="screening-section-title">📝 Rasgos que justifican una valoración médica</div>
    ${LES.rasgos.map((q, i) => `<div class="sq2 les-rasgo">
      <div class="sq2-badge">${i + 1}</div>
      <div class="sq2-text">${q.texto}</div>
      <div class="sq-btns">
        <button type="button" class="sq-btn si${les.rasgos[q.id] === 'SI' ? ' selected' : ''}" onclick="selectLESRasgo('${q.id}','SI')">SÍ</button>
        <button type="button" class="sq-btn no${les.rasgos[q.id] === 'NO' ? ' selected' : ''}" onclick="selectLESRasgo('${q.id}','NO')">NO</button>
      </div>
    </div>`).join('')}
    ${resultado}
    <div class="hm-fuente">${citasEnTexto(LES.rasgosFuente)}</div>
    <div class="hm-fuente">${citasEnTexto(LES.diferencialFuente)}</div>`;
}

function _pintarLESBloques() {
  const html = _lesBloqueHTML();
  document.querySelectorAll('[data-les-bloque]').forEach(el => { el.innerHTML = html; });
}

// Recuadro de la fase 5 (docs/lupus.md): nunca se pliega.
function _lupusResultadosHTML(d) {
  const datos = datosLES(d);
  return `
    <div class="alert alert-info les-fase5" style="margin-bottom:1rem;">
      <span class="alert-icon">🦋</span>
      <div><strong>Lupus.</strong> ${ESTADOS_LES[d.es]}${datos.length ? ` · ${datos.join(' · ')}` : ''}
        ${lineasRecomendacionLES(d).map(t => `<div>${citasEnTexto(t)}</div>`).join('')}
      </div>
    </div>`;
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
      () => _aplicarModo('completo'),
      { borra: false }
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
    const conEmbudo = sistemasActivos().filter(s => !s.soloHipermovilidad && !s.soloDisautonomia && !s.soloLupus);   // los de las condiciones especiales no tienen embudo
    const porEmbudo = conEmbudo.filter(s => state.sistemicoBreve[s.id] === 'NO').map(s => s.nombre);
    const sinCribar = conEmbudo.filter(s => !state.sistemicoBreve[s.id]).map(s => s.nombre);
    if (porEmbudo.length) pendientes.push({ fase: 2, texto: `Cribado sistémico solo por embudo (sin preguntas una a una): ${porEmbudo.join(', ')}` });
    if (sinCribar.length) pendientes.push({ fase: 2, texto: `Sistemas sin cribar: ${sinCribar.join(', ')}` });
  } else if (state.maxVisitedIdx >= 1) {
    pendientes.push({ fase: 2, texto: 'Cribado sistémico sin hacer (falta la región)' });
  }
  if (state.irritabilidadDirecta && state.irritabilidadNivel) pendientes.push({ fase: 3, texto: 'Irritabilidad estimada sin la matriz' });
  else if (!state.irritabilidadNivel) pendientes.push({ fase: 3, texto: 'Irritabilidad sin registrar' });
  const sinTests = state.activeHypotheses
    .filter(h => HYPOTHESES[h] && !esTratada(h) && !Object.values(state.testResults[h] || {}).some(r => r === 'pos' || r === 'neg'))
    .map(h => HYPOTHESES[h].name);
  if (sinTests.length) pendientes.push({ fase: '4b', texto: `Tests de confirmación sin hacer: ${sinTests.join(', ')}` });
  if (!resumenFormularioPrevio().length) pendientes.push({ fase: 1, texto: 'Formulario previo sin rellenar' });
  if (esPosquirurgico(state.mecanismo) && !conProtocolo(state.cirugia)) {
    pendientes.push({ fase: 1, ancla: 'cardCirugia', texto: `${TEXTO_SIN_PROTOCOLO} (sin protocolo)` });
  }
  if (state.hipermovilidad?.estado === 'sospecha' && state.hipermovilidad.beighton === null) {
    pendientes.push({ fase: 2, texto: 'Escala de Beighton sin hacer (sospecha de hipermovilidad)' });
  }
  if (state.disautonomia?.estado === 'sospecha' && state.disautonomia.bipedestacion === null) {
    pendientes.push({ fase: 2, texto: 'Prueba de bipedestación sin hacer (sospecha de disautonomía)' });
  }
  pendientes.push(...pendientesLES(state.lupus));   // docs/lupus.md: corticoides o rasgos sin registrar
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

// Enlace del recordatorio de una zona de la tarjeta «Síntomas» (fase 3; hoy el
// periné → l6): vuelve a la fase 2, abre el sistema de esa pregunta (pestaña en
// escritorio, acordeón en móvil) y la destaca. Solo lleva; no contesta nada.
function irAPreguntaCribado(qId) {
  goToPhase(2);
  setTimeout(() => {
    const copias = [...document.querySelectorAll(`[id="sq2_${qId}"]`)];
    const panel = copias.map(c => c.closest('.sistema-panel')).find(Boolean);
    if (!panel) return;
    const sisId = panel.id.replace('panel_', '');
    const ids = [...document.querySelectorAll('#sistemaPanels .sistema-panel')].map(p => p.id.replace('panel_', ''));
    activeSistemaTab(sisId, ids.map(id => ({ id })));
    const row = document.getElementById(`acc_${sisId}`);
    if (row && !row.classList.contains('open') && row.offsetParent !== null) toggleAccordionRow(sisId, ids.join(','));
    setTimeout(() => {
      const visible = copias.find(c => c.offsetParent !== null);
      if (!visible) return;
      visible.scrollIntoView({ behavior: 'smooth', block: 'center' });
      visible.classList.remove('flash-destacar');
      void visible.offsetWidth;
      visible.classList.add('flash-destacar');
    }, 60);
  }, 150);
}

// ─── PHASE 2 HELPERS ─────────────────────────────────────────
// `despues`: lo que hay que hacer una vez cambiada la región (la silueta fija
// el lado); no se hace si se cancela el cambio.
function selectRegion(regionId, card, despues) {
  const aplicar = () => { applyRegionChange(regionId, card); despues?.(); };
  // If changing region after having visited phase 3+, ask for confirmation
  if (state.region && state.region !== regionId && state.maxVisitedIdx >= 2) {
    showConfirmBanner(
      'Cambiar región de valoración',
      'Al cambiar de región se perderá todo el progreso de las fases SINSS, Algoritmo CIF y Confirmación de Hipótesis. ¿Desea continuar?',
      'Cambiar región',
      aplicar
    );
    return;
  }
  aplicar();
}

// ─── Silueta de la fase 2 (lib/silueta.js, data/siluetas.js) ─────
let _figuraPintada = '';

function _pintarSilueta() {
  const cont = document.getElementById('siluetaRegion');
  if (!cont) return;
  const figura = figuraSilueta(state.sexo);
  if (_figuraPintada !== figura || !cont.firstElementChild) {
    cont.innerHTML = siluetaHTML(SILUETAS[figura], figura);
    _figuraPintada = figura;
  }
  cont.classList.toggle('con-region', !!state.region);
  cont.querySelectorAll('.sil-zona').forEach(b => {
    const e = estadoZona({ region: b.dataset.region, lado: b.dataset.lado }, state.region, state.lado);
    b.classList.toggle('sil-zona-on', e === 'on');
    b.classList.toggle('sil-zona-region', e === 'region');
    b.setAttribute('aria-pressed', String(e === 'on'));
  });
  const { principal, sub } = textoElegida(state.region, state.lado);
  cont.querySelector('.sil-elegida-texto').textContent = principal;
  cont.querySelector('.sil-elegida-sub').textContent = sub;
  cont.querySelectorAll('.sil-sexo .option-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.sexo === state.sexo);
    b.setAttribute('aria-pressed', String(b.dataset.sexo === state.sexo));
  });
  cont.querySelector('.sil-nota').textContent = notaSexo(state.sexo);
}

// Toque en una zona: región y lado a la vez. Cambiar de región pasa por
// selectRegion (con su confirmación); el lado se fija después.
function tocarZonaSilueta(region, lado) {
  const nuevoLado = ladoAlTocar({ region, lado }, state.region, state.lado);
  const fijarLado = () => { state.lado = nuevoLado; _pintarLado(); saveSession(); };
  if (state.region === region) { fijarLado(); return; }
  selectRegion(region, document.querySelector(`.region-card[data-region="${region}"]`), fijarLado);
}

// Sexo desde la silueta: es el botón de la fase 1 (mismo dato, mismas reglas:
// un segundo toque lo quita); la figura se repinta, así que el foco vuelve al
// botón tocado.
function elegirSexoSilueta(valor) {
  const btn = [...document.querySelectorAll('#sexo .option-btn')].find(b => b.textContent.trim() === valor);
  if (!btn) return;
  selectOption('sexo', btn, valor);
  document.querySelector(`#siluetaRegion .sil-sexo [data-sexo="${valor}"]`)?.focus();
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
  state.irritabilidad = matrizVacia();
  state.irritabilidadNivel = null;
  state.irritabilidadDirecta = false;
  state.sintomaPrincipal = sintomaVacio();
  state.sintomasSecundarios = [];

  // Reset option-btn selections in phase 3
  document.querySelectorAll('#phase3 .option-btn').forEach(b => b.classList.remove('selected'));

  // Reset NRS buttons
  document.querySelectorAll('.nrs-btn').forEach(b => b.classList.remove('selected'));
  const nrsLabel = document.getElementById('nrsLabel');
  if (nrsLabel) nrsLabel.textContent = '— Sin seleccionar —';

  // Reset signo comparable input
  const sc = document.getElementById('signoComparable');
  if (sc) sc.value = '';

  // Matriz sin preselección (decisión 101)
  _pintarSeleccionIrritab();
  calcIrritabilidad();
  pintarSintomas();
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
  // Fase P: el sistema de hipermovilidad solo con la tarjeta activa, y de él
  // solo las preguntas y banderas de su estado (`hm`, lib/hipermovilidad.js)
  const enRegion = x => (typeof x === 'string' || !x.regiones || x.regiones.includes(regionId))
    && elementoHMVisible(x, state.hipermovilidad) && elementoLESVisible(x, state.lupus);
  return data.sistemas
    .filter(sis => !sis.soloPosquirurgico || esPosquirurgico(state.mecanismo))
    .filter(sis => !sis.soloHipermovilidad || hmActiva(state.hipermovilidad))
    .filter(sis => !sis.soloDisautonomia || dsActiva(state.disautonomia))
    .filter(sis => !sis.soloLupus || lesActivo(state.lupus))
    .map(sis => [sis.preguntas, sis.banderasRojas || [], sis.banderasAmarillas || []].some(l => !l.every(enRegion))
      ? { ...sis, preguntas: sis.preguntas.filter(enRegion),
          banderasRojas: (sis.banderasRojas || []).filter(enRegion), banderasAmarillas: (sis.banderasAmarillas || []).filter(enRegion) }
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
  Object.entries(state.sistemicoAnswers).forEach(([qId, answer]) => _marcarRespuestaSist(qId, answer));
  sistemasActivos().forEach(sis => {
    const alerta = sis.preguntas.some(q => state.sistemicoAnswers[q.id] === 'SI');
    document.getElementById(`tab_${sis.id}`)?.classList.toggle('has-alert', alerta);
    document.getElementById(`acc_${sis.id}`)?.classList.toggle('has-alert', alerta);
  });
  evaluarCriteriosCompuestos(state.region);
  sistemasActivos().forEach(sis => _pintarEmbudo(sis.id));
  _pintarHMBloques();
  _pintarDsBloques();
  _pintarLESBloques();
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

  // La herramienta recomendada ya no depende de la región (sin STarT Back)
  if (state.riesgoPsico) {
    const suggest = document.getElementById('psicoToolSuggest');
    if (suggest) {
      suggest.innerHTML = _herramientaPsicoHTML();
    }
  }

  wrap.style.display = 'block';
  evaluarCriteriosCompuestos(regionId);
  _pintarHMBloques();
  _pintarDsBloques();
  _pintarLESBloques();
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
        ${sis.banderasRojas.map((f, i) => banderaHTML(sis, f, 'rojas', i)).join('')}
      </div>`;
    }
    if (hasYellow) {
      html += `<div class="flags-box yellow-box">
        <div class="flags-col-title yellow">🟡 Banderas Amarillas</div>
        ${sis.banderasAmarillas.map((f, i) => banderaHTML(sis, f, 'amarillas', i)).join('')}
      </div>`;
    }
    html += `</div>`;
  }

  // Modo breve: un SÍ/NO por sistema leyendo sus banderas rojas (embudo).
  // Con NO se pliegan las preguntas del sistema salvo las de `urgencia`, que
  // se ven siempre. Oculto por CSS en modo completo.
  const tieneUrg = sis.preguntas.some(q => q.urgencia);
  // El sistema de hipermovilidad (Fase P) no tiene embudo: lo activó el fisio
  // a propósito y sus pocas preguntas se hacen siempre (`sinEmbudo`).
  if (sis.soloHipermovilidad) {
    html += `<div class="sis-body embudo-si" data-sis-body="${sis.id}">
      <div class="hm-bloque" data-hm-bloque></div>`;
  } else if (sis.soloDisautonomia || sis.soloLupus) {
    // El de disautonomía (docs/pots.md) tampoco: primero las preguntas del
    // síncope y, después de ellas, la sospecha y la prueba (data-ds-bloque)
    html += `<div class="sis-body embudo-si" data-sis-body="${sis.id}">`;
  } else html += `<div class="embudo" data-embudo="${sis.id}">
      <span class="embudo-q">¿Presenta alguna de estas banderas rojas?
        <span class="embudo-nota">SÍ abre las preguntas de este sistema una a una.${tieneUrg ? ' Las preguntas de urgencia se hacen siempre.' : ''}</span></span>
      <div class="sq-btns">
        <button class="sq-btn si" onclick="selectEmbudo('${sis.id}','SI')">SÍ</button>
        <button class="sq-btn no" onclick="selectEmbudo('${sis.id}','NO')">NO</button>
      </div>
    </div>
    <div class="sis-body${tieneUrg ? ' tiene-urg' : ''}" data-sis-body="${sis.id}">`;

  // Screening questions
  if (sis.preguntas.length) html += `<div class="screening-section-title">❓ Preguntas de Cribado</div>`;
  sis.preguntas.forEach((q, qi) => {
    const urgBadge = q.urgencia ? `<span class="sq2-urg-badge">Urgencia</span>` : '';
    html += `
      <div class="sq2${q.alerta ? ' alerta-high' : ''}${q.urgencia ? ' sq2-urg' : ''}" id="sq2_${q.id}">
        <div class="sq2-badge${q.alerta ? ' alerta' : ''}">${qi + 1}</div>
        <div class="sq2-text">${q.text}${urgBadge}${q.urgencia ? `<span class="sq2-urg-msg">🚨 ${q.urgencia}</span>` : ''}${q.derivacion ? `<span class="sq2-deriv-msg">🩺 ${q.derivacion}</span>` : ''}${q.notaPosquirurgica ? `<div class="nota-posq solo-posq">🏥 ${TEXTO_NOTA_TRAUMA}</div>` : ''}${razonamientoInlineHTML(sis, q)}</div>
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
  // Regla de sospecha del subtipo vascular (lib/hipermovilidad.js)
  if (sis.soloHipermovilidad) html += `<div class="criterio-compuesto-alert" data-hm-vascular></div>`;
  // Patrón de sospecha y prueba de bipedestación activa (lib/disautonomia.js)
  if (sis.soloDisautonomia) html += `<div class="ds-bloque" data-ds-bloque></div>`;
  // Rasgos de la sospecha de lupus (lib/lupus.js)
  if (sis.soloLupus) html += `<div class="ds-bloque" data-les-bloque></div>`;

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
let _popIgnorar = false;      // el próximo popstate es nuestro history.back() (razonamiento o compartir), no el usuario

function razonamientoInlineHTML(sis, q) {
  const r = q.razonamiento;
  if (!r) return '';
  const ampliar = r.detalle
    ? ` <button type="button" class="razon-ampliar" onclick="abrirRazonamiento(this,'${sis.id}','${q.id}')">Ampliar →</button>`
    : '';
  return `<details class="razon">
      <summary>ⓘ ¿Por qué?</summary>
      <div class="razon-cuerpo" data-ia-ctx="${attrIA(ctxCribado(state.region, q.text))}">
        <p><span class="razon-etq">Por qué</span> ${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>
        <p><span class="razon-etq">Cuánto pesa</span> ${citasEnTexto(r.peso)}</p>
        ${anatomiaLineaHTML(q)}
        <div class="razon-pie">— ${citasHTML(r.fuentes)}${ampliar}</div>
      </div>
    </details>`;
}

// «Fisiología, paso a paso»: la cadena causal del mecanismo al síntoma, cada
// paso con su fuente leída; la metáfora es un extra divulgativo que va después
// y nunca sustituye a la cadena; `nota` dice lo que la fuente no explica.
function razonFisiologiaHTML(f) {
  if (!f) return '';
  return `<div class="razon-seccion razon-fisio"><div class="razon-etq">Fisiología, paso a paso</div>
      <ol class="razon-pasos">${f.pasos.map(p => `<li>${citasEnTexto(p)}</li>`).join('')}</ol>
      ${f.nota ? `<p class="razon-fisio-nota">${citasEnTexto(f.nota)}</p>` : ''}
      <div class="razon-ia-pie">${iaParrafoHTML()}</div>
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

// Secciones del panel para un `razonamiento` del cribado (de una pregunta o de
// una bandera); `x` lleva el `anatomia` (pregunta) o nada (bandera).
function razonCribadoPanelHTML(r, x = {}) {
  const parrafos = r.detalle ? r.detalle.split('\n\n').map(p => `<p>${citasEnTexto(p)}${iaParrafoHTML()}</p>`).join('') : '';
  return `
    <div class="razon-seccion"><div class="razon-etq">Por qué</div><p>${citasEnTexto(r.porque)}${iaParrafoHTML()}</p></div>
    <div class="razon-seccion"><div class="razon-etq">Cuánto pesa</div><p>${citasEnTexto(r.peso)}</p></div>
    ${razonFisiologiaHTML(r.fisiologia)}
    ${parrafos ? `<div class="razon-seccion"><div class="razon-etq">En detalle</div>${parrafos}</div>` : ''}
    ${anatomiaPanelHTML(x)}
    <div class="razon-seccion razon-fuentes"><div class="razon-etq">Fuentes</div>
      <ul>${(r.citas || r.fuentes).map(razonCitaHTML).join('')}</ul></div>`;
}

function abrirRazonamiento(btn, sisId, qId) {
  const hit = _buscarPregunta(sisId, qId);
  const r = hit?.q.razonamiento;
  if (!r || !r.detalle) return;
  abrirPanelRazon({
    btn, kicker: '¿Por qué esta pregunta?', titulo: hit.q.text,
    ia: ctxCribado(state.region, hit.q.text),
    html: razonCribadoPanelHTML(r, hit.q),
  });
}

// ─── RAZONAMIENTO DE LAS BANDERAS (fase 2) ───────────────────
// Una bandera es un texto o { texto, regiones?, pregunta?, fase1?, razonamiento? }
// (docs/razonamiento-banderas.md). Con `pregunta` (id o lista de ids del mismo
// sistema), su «¿Por qué?» es el de esa pregunta: no se escribe dos veces. Con
// `razonamiento` propio (misma forma que el de una pregunta), el suyo. `fase1`
// (br1–br4) solo pinta una etiqueta: se pregunta en las banderas de la fase 1.
// Solo se enlaza una pregunta visible en la región (`sis` ya filtrado).
function textoBandera(f) { return typeof f === 'string' ? f : f.texto; }

function preguntasDeBandera(sis, f) {
  if (typeof f === 'string' || !f.pregunta) return [];
  const ids = [].concat(f.pregunta);
  return sis.preguntas.filter(q => ids.includes(q.id) && q.razonamiento);
}

// Dos niveles, como las preguntas: el ⓘ despliega bajo la bandera «Por qué» y
// «Cuánto pesa» (los de la pregunta enlazada, o los suyos); «Ampliar →» abre
// el panel con todo. Un botón y no un <details>, para que el ⓘ siga al final
// del texto y la lista no crezca una línea por bandera.
function banderaHTML(sis, f, tipo, i) {
  const dot = tipo === 'rojas' ? 'flag-dot-red' : 'flag-dot-yellow';
  const fase1 = typeof f !== 'string' && f.fase1
    ? ` <span class="flag-fase1" title="También se pregunta en las banderas rojas de la fase 1">· fase 1</span>` : '';
  const cuerpo = razonBanderaInlineHTML(sis, f, tipo, i);
  const porque = cuerpo
    ? ` <button type="button" class="flag-porque" aria-expanded="false" aria-label="¿Por qué esta bandera?" onclick="toggleRazonBandera(this)">ⓘ</button>` : '';
  return `<div class="flag-item"><span class="${dot}">●</span><div class="flag-cuerpo"><span class="flag-texto">${textoBandera(f)}${fase1}${porque}</span>${cuerpo}</div></div>`;
}

// Nivel 1 del «¿Por qué?» de una bandera, o '' si no tiene. Con varias
// preguntas enlazadas, cada «Por qué» lleva delante su pregunta.
function razonBanderaInlineHTML(sis, f, tipo, i) {
  if (typeof f === 'string') return '';
  const fuentes = f.razonamiento ? [{ r: f.razonamiento, x: f }] : preguntasDeBandera(sis, f).map(q => ({ r: q.razonamiento, x: q }));
  if (!fuentes.length) return '';
  const varias = fuentes.length > 1;
  const ampliar = fuentes.some(({ r }) => r.detalle || r.fisiologia)
    ? ` <button type="button" class="razon-ampliar" onclick="abrirRazonBandera(this,'${sis.id}','${tipo}',${i})">Ampliar →</button>` : '';
  const partes = fuentes.map(({ r, x }) => `${varias ? `<p class="razon-bandera-q"><span class="razon-etq">Se pregunta así</span> ${x.text}</p>` : ''}
        <p><span class="razon-etq">Por qué</span> ${citasEnTexto(r.porque)}${iaParrafoHTML()}</p>
        <p><span class="razon-etq">Cuánto pesa</span> ${citasEnTexto(r.peso)}</p>
        ${anatomiaLineaHTML(x)}`).join('');
  const citas = [...new Set(fuentes.flatMap(({ r }) => r.fuentes))];
  return `<div class="razon razon-cuerpo razon-bandera" hidden data-ia-ctx="${attrIA(ctxCribado(state.region, textoBandera(f)))}">
        ${partes}
        <div class="razon-pie">— ${citasHTML(citas)}${ampliar}</div>
      </div>`;
}

function toggleRazonBandera(btn) {
  const cuerpo = btn.closest('.flag-item').querySelector('.razon-bandera');
  const abrir = cuerpo.hidden;
  cuerpo.hidden = !abrir;
  btn.setAttribute('aria-expanded', String(abrir));
}

// Contenido del panel de una bandera, o null si no tiene «¿Por qué?».
function razonBanderaHTML(sis, f) {
  if (typeof f === 'string') return null;
  if (f.razonamiento) return razonCribadoPanelHTML(f.razonamiento, f);
  const qs = preguntasDeBandera(sis, f);
  if (!qs.length) return null;
  return qs.map(q => `<div class="razon-seccion razon-bandera-pregunta"><div class="razon-etq">Se pregunta así</div><p>${q.text}</p></div>
    ${razonCribadoPanelHTML(q.razonamiento, q)}`).join('');
}

function abrirRazonBandera(btn, sisId, tipo, i) {
  const sis = sistemasActivos().find(s => s.id === sisId);
  const f = sis?.[tipo === 'rojas' ? 'banderasRojas' : 'banderasAmarillas'][i];
  const html = f && razonBanderaHTML(sis, f);
  if (!html) return;
  abrirPanelRazon({
    btn, kicker: tipo === 'rojas' ? '¿Por qué esta bandera roja?' : '¿Por qué esta bandera amarilla?',
    titulo: textoBandera(f), ia: ctxCribado(state.region, textoBandera(f)), html,
  });
}

// Panel del razonamiento, común a la fase 2 (preguntas de cribado) y a la
// 4b (tests, phase4b.js): lateral sin velo en escritorio, bottom sheet con
// velo en móvil. Si ya está abierto, solo cambia el contenido.
// `ia`: contexto para «Ampliar con IA» (ampliar-ia.js); sin él, no se ofrece.
function abrirPanelRazon({ btn, kicker, titulo, html, ia }) {
  const panel = document.getElementById('razonPanel');
  const yaAbierto = panel.classList.contains('open');
  panel.querySelector('.razon-kicker').textContent = kicker;
  document.getElementById('razonPregunta').textContent = titulo;
  const contenido = document.getElementById('razonContenido');
  contenido.innerHTML = html;
  if (ia) contenido.dataset.iaCtx = ia; else delete contenido.dataset.iaCtx;
  document.getElementById('razonContenido').scrollTop = 0;
  _razonOrigen = btn || null;
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
  // En móvil la ✕ está oculta (no admite foco): el foco va al propio panel.
  (_esMovil() ? panel : document.getElementById('razonCerrar')).focus({ preventScroll: true });
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
    if (!desdeHistorial && !sinHistorial) { _popIgnorar = true; history.back(); }
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
  _pintarHMBloques();   // el corte de Beighton depende de la edad
  _pintarDsResultado();  // y el de la prueba de bipedestación también
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
  _actualizarBandas();
}

function teardownSisObserver() {
  _activeSisId = null;
  const banner = document.getElementById('sisContextBanner');
  if (banner) banner.classList.remove('visible');
}

// ─── Bandas de contexto (sistema abierto en la fase 2, formulario previo en 1 y 2) ──
// Una banda se ve mientras la cabecera de su bloque ha pasado por debajo de ella
// y el bloque aún ocupa la pantalla bajo la banda: así desaparece al dejar atrás
// el bloque, y el formulario regional y un sistema abierto nunca muestran dos a la vez.
function _bandaDebeVerse(banda, cabecera, bloque) {
  const top = parseFloat(getComputedStyle(banda).top) || 0;
  const alto = banda.offsetHeight || 40;
  return cabecera.getBoundingClientRect().bottom < top && bloque.getBoundingClientRect().bottom > top + alto;
}

function _formularioAbierto() {
  return document.querySelector('.phase-container.active .fp-details[open]');
}

export function _actualizarBandas() {
  const sis = document.getElementById('sisContextBanner');
  const fp = document.getElementById('fpContextBanner');
  let verSis = false;
  if (sis && _activeSisId && state.currentPhase === 2) {
    const row = document.getElementById(`acc_${_activeSisId}`);
    const header = row?.querySelector('.sistema-accordion-header');
    verSis = !!(header && row.classList.contains('open') && _bandaDebeVerse(sis, header, row));
  }
  sis?.classList.toggle('visible', verSis);
  if (!fp) return;
  const det = verSis ? null : _formularioAbierto();
  const verFp = !!(det && _bandaDebeVerse(fp, det.querySelector('summary'), det));
  if (verFp) {
    const nombre = det.querySelector('.fp-summary-titulo')?.textContent.replace(/^Formulario previo\s*·\s*/, '') || '';
    const cont = det.querySelector('.fp-contador')?.textContent || '';
    const elN = document.getElementById('fpBannerName');
    const elC = document.getElementById('fpBannerCont');
    if (elN.textContent !== `Formulario previo · ${nombre}`) elN.textContent = `Formulario previo · ${nombre}`;
    if (elC.textContent !== cont) elC.textContent = cont;
  }
  fp.classList.toggle('visible', verFp);
}

// Flag como propiedad de la función (no `let`): goToPhase la llama y podría
// ejecutarse antes de que el módulo llegue a esta línea.
function _programarBandas() {
  if (_programarBandas.pendiente) return;
  _programarBandas.pendiente = true;
  requestAnimationFrame(() => { _programarBandas.pendiente = false; _actualizarBandas(); });
}
window.addEventListener('scroll', _programarBandas, { passive: true });
window.addEventListener('resize', _programarBandas);
// `toggle` no burbujea: se escucha en captura para abrir o cerrar el formulario
document.addEventListener('toggle', e => { if (e.target.classList?.contains('fp-details')) _programarBandas(); }, true);

function scrollToFormularioPrevio() {
  const det = _formularioAbierto();
  const banda = document.getElementById('fpContextBanner');
  if (!det || !banda) return;
  const navbarH = parseFloat(getComputedStyle(banda).top) || 0;
  const top = det.getBoundingClientRect().top + window.scrollY - navbarH - 8;
  window.scrollTo({ top, behavior: 'smooth' });
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

// Cada pregunta se pinta dos veces con el mismo id (acordeón móvil y panel de
// escritorio): botón marcado y clase answered-si/no en las dos copias, o el
// mensaje de urgencia o derivación solo aparecía en la copia oculta.
function _marcarRespuestaSist(id, value) {
  document.querySelectorAll(`[id="sq2_${id}"]`).forEach(row => {
    row.querySelectorAll('.sq-btn').forEach(b => {
      const m = (b.getAttribute('onclick') || '').match(/'(SI|NO)'/);
      if (m) b.classList.toggle('selected', m[1] === value);
    });
    row.classList.toggle('answered-si', value === 'SI');
    row.classList.toggle('answered-no', value === 'NO');
  });
}

function selectSistQ(btn, id, value, isAlerta, sisId) {
  state.sistemicoAnswers[id] = value;
  _marcarRespuestaSist(id, value);
  // Un SÍ contradice un embudo en NO: el sistema pasa a tener hallazgos
  if (value === 'SI' && state.sistemicoBreve[sisId] === 'NO') state.sistemicoBreve[sisId] = 'SI';


  // Update tab and accordion alert indicators for this system
  const tab = document.getElementById(`tab_${sisId}`);
  const accRow = document.getElementById(`acc_${sisId}`);
  const sis = sistemasActivos().find(s => s.id === sisId);
  if (sis) {
    const hasAlert = sis.preguntas.some(q => state.sistemicoAnswers[q.id] === 'SI');
    if (tab) tab.classList.toggle('has-alert', hasAlert);
    if (accRow) accRow.classList.toggle('has-alert', hasAlert);
    if (sis.criterioCompuesto) evaluarCriterioCompuesto(sis);
    if (sis.soloHipermovilidad) _pintarHMVascular();
    _pintarEmbudo(sisId);
  }

  updateSistemicoAlert();
  const q = SYSTEMIC_SCREENING[state.region]?.sistemas.flatMap(x => x.preguntas).find(x => x.id === id);
  if (q?.urgencia && value === 'SI') showToast(`🚨 ${q.urgencia}`, 'warning');
  else if (q?.derivacion && value === 'SI') showToast(`🩺 ${q.derivacion}`, 'warning');
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
  const abierto = sis.soloHipermovilidad || sis.soloDisautonomia || sis.soloLupus || v === 'SI' || sis.preguntas.some(q => !q.urgencia && state.sistemicoAnswers[q.id] === 'SI');
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

// Preguntas del cribado con `derivacion` (derivación médica no urgente, p. ej.
// el quiste de Tarlov, l_u5) respondidas SÍ. Van con las del árbol CIF en
// getDerivacionesMedicas(): payload `dv`, fase 5, 📋 Notas y 📄 Informe.
function getDerivacionesCribado() {
  return sistemasActivos().flatMap(sis => sis.preguntas)
    .filter(q => q.derivacion && state.sistemicoAnswers[q.id] === 'SI')
    .map(q => q.derivacion);
}

// Todas las derivaciones médicas no urgentes: primero las del cribado.
function getDerivacionesMedicas() {
  return [...getDerivacionesCribado(), ...getDerivacionesArbol()];
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
  const derivaciones = getDerivacionesCribado();
  const derivHtml = derivaciones.length ? `<div class="alert alert-danger">
      <span class="alert-icon">🩺</span>
      <div><strong>Derivación médica.</strong> No es urgente: puede continuar con la valoración.
        ${derivaciones.map(m => `<div>· ${m}</div>`).join('')}</div>
    </div>` : '';
  // Si todos los SÍ son urgencias o derivaciones, sobra el aviso genérico
  // («no exige derivación automática»), que los contradiría.
  const soloUrgencias = (urgencias.length || derivaciones.length) && !_respuestasActivas()
    .some(([id, v]) => v === 'SI' && !sistemasActivos().some(s => s.preguntas.some(q => q.id === id && (q.urgencia || q.derivacion))));
  if (hasPositive && soloUrgencias) {
    alertDiv.style.display = 'block';
    alertDiv.innerHTML = urgHtml + derivHtml;
  } else if (hasPositive) {
    alertDiv.style.display = 'block';
    alertDiv.innerHTML = urgHtml + derivHtml + `<div class="alert alert-warning">
      <span class="alert-icon">⚠️</span>
      <div><strong>Respuesta afirmativa detectada.</strong> Evalúe en el contexto clínico completo. La presencia de una sola bandera sistémica no exige derivación automática (excepto emergencias claras). Considere un enfoque de "watchful waiting" y monitorice la evolución. Puede continuar con la evaluación mecánica.</div>
    </div>`;
  } else {
    alertDiv.style.display = 'none';
  }
}

// ─── PHASE 3 HELPERS ─────────────────────────────────────────


// Un segundo toque sobre el número marcado lo deja «no registrado» (null):
// el NRS es opcional y un 0 por defecto llegaba a los resúmenes como dato.
function selectNRS(btn, val) {
  const quitar = state.severidad === val;
  document.querySelectorAll('.nrs-btn').forEach(b => b.classList.remove('selected'));
  if (!quitar) btn.classList.add('selected');
  state.severidad = quitar ? null : val;
  const label = document.getElementById('nrsLabel');
  if (label) label.textContent = quitar ? '— Sin seleccionar —' : `${val}/10 — ${NRS_LABELS[val]}`;
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

// Matriz de irritabilidad (decisiones 99–101 de docs/plan-tratamiento.md). Se
// pinta desde data/irritabilidad.js dos veces, tabla (escritorio) y tarjetas
// (móvil), con los mismos botones `data-key`/`data-valor`: elegir en una vista
// repinta las dos desde el estado. Sin preselección; un segundo toque en la
// opción marcada la vacía. El impacto en las actividades (gravedad) va en la
// tarjeta de severidad con los mismos botones.
const _btnIrritab = (clave, o) =>
  `<button type="button" class="irritab-btn" data-key="${clave}" data-valor="${o.valor}" onclick="selectIrritab(this)">${o.corto}</button>`;
function pintarMatrizIrritabilidad() {
  const tabla = document.getElementById('irritabTabla');
  if (tabla) tabla.innerHTML = `<table class="irritab-table"><thead><tr><th>Criterio</th><th>Seleccione nivel</th></tr></thead><tbody>${
    ITEMS_IRRITABILIDAD.map(it => `<tr><td>${it.nombre}${it.ayuda ? `<div class="irritab-ayuda">${it.ayuda}</div>` : ''}</td><td><div class="irritab-select">${it.opciones.map(o => _btnIrritab(it.clave, o)).join('')}</div></td></tr>`).join('')
  }</tbody></table>`;
  const tarjetas = document.getElementById('irritabTarjetas');
  if (tarjetas) tarjetas.innerHTML = ITEMS_IRRITABILIDAD.map(it => `<div class="irritab-card"><div class="irritab-card-label">${it.nombre}</div>${it.ayuda ? `<div class="irritab-ayuda">${it.ayuda}</div>` : ''}<div class="irritab-card-btns">${it.opciones.map(o => _btnIrritab(it.clave, o)).join('')}</div></div>`).join('');
  const impacto = document.getElementById('impactoActividades');
  if (impacto) impacto.innerHTML = `<div class="irritab-card-label">${ITEM_IMPACTO.nombre}</div><div class="irritab-card-btns">${ITEM_IMPACTO.opciones.map(o => _btnIrritab(ITEM_IMPACTO.clave, o)).join('')}</div>`;
  const pista = document.getElementById('irritabPistaBreve');
  if (pista) pista.textContent = TEXTOS_IRRITABILIDAD.pistaBreve;
  _pintarSeleccionIrritab();
}

function _pintarSeleccionIrritab() {
  document.querySelectorAll('.irritab-btn[data-key]').forEach(b => {
    b.classList.toggle('selected', (state.irritabilidad || {})[b.dataset.key] === b.dataset.valor);
  });
}

function selectIrritab(btn) {
  const { key, valor } = btn.dataset;
  if (!state.irritabilidad) state.irritabilidad = matrizVacia();
  state.irritabilidad[key] = state.irritabilidad[key] === valor ? '' : valor;
  // El impacto en las actividades es gravedad: no toca el nivel ni lo estimado
  if (key !== ITEM_IMPACTO.clave) _usarMatrizIrritabilidad();
  _pintarSeleccionIrritab();
  calcIrritabilidad();
  saveSession();
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

// Nivel de la matriz con la misma regla que la fase 6 (lib/irritabilidad.js):
// el tiempo en calmarse marca el suelo y reposo + movimiento + tolerancia solo
// lo suben. Sin ninguna fila contestada, «no registrada» (null).
function calcIrritabilidad() {
  if (state.irritabilidadDirecta) { renderIrritabResumen(state.irritabilidadNivel); return; }
  const r = nivelMatriz(state.irritabilidad);
  state.irritabilidadNivel = r.nivel ? NOMBRE_NIVEL[r.nivel] : null;
  renderIrritabResumen(state.irritabilidadNivel, r);
}

// Textos con fuente (decisión 102): los dos modos de Maitland. Baja → «hasta
// el límite»; moderada y alta → «hasta el dolor»; alta añade la adaptación.
function renderIrritabResumen(nivel, matriz = null) {
  const div = document.getElementById('irritabilidadResumen');
  if (!div) return;
  const T = TEXTOS_IRRITABILIDAD;
  if (!nivel) {
    div.innerHTML = `<div class="alert alert-info"><span class="alert-icon">⚪</span><span>${citasEnTexto(T.noRegistrada)}</span></div>`;
    return;
  }
  const { color, emoji } = { Baja: { color: 'var(--green)', emoji: '🟢' }, Moderada: { color: 'var(--orange)', emoji: '🟠' }, Alta: { color: 'var(--red)', emoji: '🔴' } }[nivel] || { color: 'var(--green)', emoji: '🟢' };
  const textos = [nivel === 'Baja' ? T.hastaLimite : T.hastaDolor];
  if (nivel === 'Alta') textos.push(T.alta);
  const falta = !state.irritabilidadDirecta && matriz?.incompleta ? (matriz.sinCalma ? T.sinCalma : T.incompleta) : '';
  div.innerHTML = `<div class="alert alert-info" style="border-color:${color}33; background:${color}11;">
    <span class="alert-icon">${emoji}</span>
    <span><strong>Irritabilidad ${nivel}${state.irritabilidadDirecta ? ' (estimada, sin matriz)' : ''}</strong> — ${citasEnTexto(textos.join(' '))}${falta ? `<br><em>${citasEnTexto(falta)}</em>` : ''}<br><span class="irritab-ayuda">${citasEnTexto(T.margen)}</span></span>
  </div>`;
}

function collectPhase3() {
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
  const texts = [];
  sistemasActivos().forEach(sis => {
    (sis.preguntas || []).forEach(q => {
      if (affirmativeIds.includes(q.id)) texts.push(q.text);
    });
  });
  return texts;
}


const _escHTML = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Fase 5, tarjeta de hipótesis: la pauta y el pronóstico se pliegan para
// reducir el scroll. La pauta deja a la vista su primera frase; lo que es
// seguridad (🚑 Derivación, «ya diagnosticada y tratada», la nota
// posquirúrgica) nunca se pliega. Al imprimir se despliega todo (ver
// _desplegarParaImprimir).
// Primera frase: hasta el primer punto seguido de espacio y mayúscula (o «, ¿,
// paréntesis), así «rec. 1.3.1» o «p. ej.» no la cortan.
// Una frase de menos de 40 caracteres («Estadios I–II.») no dice nada sola: se
// le suma la siguiente. Una muy larga se recorta a 3 líneas por CSS.
// → { primera, resto } (resto '' si la pauta es una sola frase)
function partirPrimeraFrase(texto) {
  const t = String(texto || '').trim();
  const re = /[.!?](?=\s+[A-ZÁÉÍÓÚÑ¿«(])/g;
  let m;
  while ((m = re.exec(t))) {
    const fin = m.index + 1;
    if (fin >= 40) return { primera: t.slice(0, fin), resto: t.slice(fin).trim() };
  }
  return { primera: t, resto: '' };
}

function _pautaPlegableHTML(dosis, fuente) {
  const { primera, resto } = partirPrimeraFrase(dosis);
  const fuenteHTML = fuente ? `<div class="test-source" style="margin:4px 0 0;">${citasHTML(fuente)}</div>` : '';
  if (!resto) return `<div class="exercise-box">${citasEnTexto(dosis)}</div>${fuenteHTML}`;
  return `<details class="pauta-det">
    <summary class="exercise-box"><span class="pauta-det-primera">${citasEnTexto(primera)}</span><span class="pauta-det-mas">Ver pauta completa</span></summary>
    <div class="pauta-det-resto">${citasEnTexto(resto)}</div>
    ${fuenteHTML}
    <button type="button" class="pauta-det-menos" onclick="const d=this.closest('details'); d.open=false; d.scrollIntoView({block:'nearest'})">Ocultar pauta ▴</button>
  </details>`;
}

// Pauta partida por situación (lib/pauta.js): la rama que encaja con este caso
// delante, con su título, y las demás plegadas en «Otras situaciones». Sin rama
// que encaje (o sin ramas), la pauta entera como siempre.
function _pautaConRamasHTML(hyp) {
  const r = ramaPauta(hyp, state);
  if (!r) return _pautaPlegableHTML(hyp.dosis, hyp.dosisFuente);
  const otras = r.otras.length
    ? `<details class="pauta-otras"><summary>Otras situaciones (${r.otras.length})</summary>
        ${r.otras.map(o => `<div class="pauta-otra"><div class="pauta-rama-tit">${o.titulo}</div>${citasEnTexto(o.texto)}</div>`).join('')}
      </details>`
    : '';
  return `<div class="pauta-rama-tit">Para este caso: ${r.rama.titulo}</div>${_pautaPlegableHTML(r.texto, hyp.dosisFuente)}${otras}`;
}

// Cabecera de una tarjeta de hipótesis de la fase 5, en dos filas: punto +
// nombre (el punto alineado con la primera línea, el nombre con todo el ancho)
// y, debajo, la etiqueta de peso alineada con el nombre. En una sola fila, con
// nombres largos el nombre y la etiqueta se partían en columnas estrechas y el
// punto quedaba a media altura.
function _cabeceraHipHTML(color, sombra, nombreHTML, etiqueta, colorNombre) {
  return `<div class="hyp5-cab">
          <span class="hyp5-punto" style="background:${color};${sombra}"></span>
          <div class="hyp5-titulos">
            <div class="hyp5-nombre" style="color:${colorNombre};">${nombreHTML}</div>
            <div class="hyp5-etiqueta">${etiquetaHipHTML(etiqueta)}</div>
          </div>
        </div>`;
}

// Texto de la pauta de una hipótesis «Derivar» marcada como tratada.
function _textoTratada(cq) {
  if (!cq) return 'Diagnóstico médico ya confirmado y tratado: sin derivación por esta hipótesis.';
  return `Ya intervenida: seguir el protocolo del cirujano${cq.re ? ` (${_escHTML(cq.re)})` : ''}.`;
}

// Tarjeta de `pq1` en la fase 5: sin tests ni puntuación; la pauta es el
// protocolo del cirujano. Va la primera, sin medalla de puesto.
function _hipPosqResultadosHTML(hyp, cq) {
  const color = '#8b95a7';
  return `
      <div class="hyp5-card" style="border-color:${color}33;">
        ${_cabeceraHipHTML(color, '', `🏥 ${_escHTML(hyp.name)}`, ETIQUETA_HIP_POSQ.replace(/^🏥\s*/, ''), 'var(--text)')}
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>${enlacesCalcular(hyp.prom)}
        </div>
        <div>
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent2); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">🏥 Protocolo del cirujano</div>
          <div class="exercise-box">${_escHTML(pautaHipPosq(cq))}</div>
        </div>
      </div>`;
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
  _pintarSilueta();
}

// Fase 5: P1–P4 de la tarjeta «Síntomas» (solo lo que tiene datos)
function _sintomasResultadosHTML() {
  const { z1, ss } = payloadSintomas(state, ZONAS_SINTOMA[state.region] || []);
  const fila = (et, v) => `<div class="summary-row"><span class="summary-label">${et}</span><span class="summary-value">${_escapeAttr(v)}</span></div>`;
  return (z1 ? fila(ss.length ? 'Síntoma principal (P1)' : 'Zona del dolor', lineaP1(z1)) : '')
    + ss.map(s => fila(`P${s.n}`, lineaSecundario(s))).join('');
}
function _hayVariosSintomas() {
  return payloadSintomas(state, ZONAS_SINTOMA[state.region] || []).ss.length > 0;
}

function buildResults() {
  const container = document.getElementById('resultsContent');
  container.innerHTML = '';

  // Sort hypotheses by score (`pq1`, la posquirúrgica, siempre la primera)
  const sorted = hipotesisActivas()
    .map(h => ({ id: h, score: state.hypothesisScores[h]?.totalLR || 1, hyp: hipotesis(h) }))
    .filter(x => x.hyp)
    .sort((a, b) => (b.hyp.posquirurgica ? 1 : 0) - (a.hyp.posquirurgica ? 1 : 0) || b.score - a.score);

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

  // ── Derivación médica no urgente: cribado (`derivacion`, p. ej. quiste de
  //    Tarlov) y árbol CIF (p. ej., claudicación vascular)
  const derivacionesArbol = getDerivacionesMedicas();
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
  // ── Hipermovilidad (Fase P): consideraciones para el plan, nunca plegadas
  const hm = getHMPayload();
  if (hm) container.innerHTML += _hipermovilidadResultadosHTML(hm);
  // ── Disautonomía (Fase P): consideraciones para el plan, nunca plegadas
  const ds = getDsPayload();
  if (ds) container.innerHTML += _disautonomiaResultadosHTML(ds);
  // ── Lupus (Fase P, docs/lupus.md): consideraciones para el plan, nunca plegadas
  const le = getLePayload();
  if (le) container.innerHTML += _lupusResultadosHTML(le);

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
    ${_sintomasResultadosHTML()}
    <div class="summary-row"><span class="summary-label">Severidad (EVN)${_hayVariosSintomas() ? ' de P1' : ''}</span><span class="summary-value">${state.severidad != null ? `${state.severidad}/10` : 'No registrada'}</span></div>
    <div class="summary-row"><span class="summary-label">Irritabilidad${_hayVariosSintomas() ? ' de P1' : ''}</span><span class="summary-value">${state.irritabilidadNivel || 'No registrada'}${state.irritabilidadDirecta && state.irritabilidadNivel ? ' (estimada, sin matriz)' : ''}</span></div>
    ${!state.irritabilidadDirecta && state.irritabilidad?.calma ? `<div class="summary-row"><span class="summary-label">Tiempo en calmarse</span><span class="summary-value">${state.irritabilidad.calma}</span></div>` : ''}
    ${state.irritabilidad?.discapacidad ? `<div class="summary-row"><span class="summary-label">Impacto en las actividades</span><span class="summary-value">${state.irritabilidad.discapacidad}</span></div>` : ''}
    <div class="summary-row"><span class="summary-label">Naturaleza</span><span class="summary-value">${state.naturaleza || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Estabilidad</span><span class="summary-value">${state.estabilidad || '—'}</span></div>
    <div class="summary-row"><span class="summary-label">Signo comparable</span><span class="summary-value">${state.signoComparable || '—'}</span></div>
  </div>`;

  // ── Cuestionarios puntuados en la calculadora (lo pinta _pintarCuestionariosFase5)
  container.innerHTML += `<div class="summary-section" id="cuestFase5" hidden></div>`;

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
      if (hyp.posquirurgica) { hypHtml += _hipPosqResultadosHTML(hyp, cq); return; }
      const scoreInfo = state.hypothesisScores[id];
      const tratada = esTratada(id);
      const colorClass = scoreInfo?.colorClass || 'hyp-orange';
      const colorMap = { 'hyp-green': '#38d9a9', 'hyp-orange': '#ff9f43', 'hyp-red': '#ff6b6b', 'hyp-neutral': '#8b95a7' };
      const puesto = rank - (sorted[0]?.hyp.posquirurgica ? 1 : 0);
      const rankEmoji = ['🥇','🥈','🥉'][puesto] || `${puesto+1}º`;
      const dotColor = colorMap[colorClass] || '#ff9f43';

      // Tests summary
      const results = state.testResults[id] || {};
      const filaTest = (t, i) => {
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
      };
      // Los tests hechos (pos/neg), a la vista; los «Sin datos», juntos y plegados
      const hechos = hyp.tests.map((t, i) => [t, i]).filter(([, i]) => results[i] === 'pos' || results[i] === 'neg');
      const sinHacer = hyp.tests.map((t, i) => [t, i]).filter(([, i]) => results[i] !== 'pos' && results[i] !== 'neg');
      const testsHtml = hechos.map(([t, i]) => filaTest(t, i)).join('')
        + (sinHacer.length ? `<details class="tests-sin-datos"><summary>${sinHacer.length === hyp.tests.length ? 'Ningún test realizado' : sinHacer.length === 1 ? '1 test sin hacer' : `${sinHacer.length} tests sin hacer`}</summary>
            ${sinHacer.map(([t, i]) => filaTest(t, i)).join('')}
          </details>` : '');

      hypHtml += `
      <div class="hyp5-card" style="border-color:${dotColor}33;">
        ${_cabeceraHipHTML(dotColor, `box-shadow:0 0 8px ${dotColor}66;`, `${rankEmoji} ${hyp.name}`, scoreInfo?.label || 'Sin evaluar', dotColor)}
        ${casillaTratadaHTML(id)}
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">Tests Realizados</div>
          ${tratada ? '<div style="font-size:0.8rem; color:var(--text3);">No aplicables: diagnóstico ya confirmado.</div>' : testsHtml}
        </div>
        <div style="margin-bottom:1rem;">
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">PROM Recomendado</div>
          <span class="prom-badge">${hyp.prom}</span>${enlacesCalcular(hyp.prom)}
        </div>
        <div>
          <div style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent2); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px;">${tratada ? ETIQUETA_TRATADA : hyp.dosis === DOSIS_DERIVAR ? '🚑 Derivación' : hyp.dosisFuente ? '💊 Pauta de Tratamiento' : '💊 Dosis Día 1 (Baja Fricción)'}</div>
          ${!tratada && hyp.dosis && hyp.dosis !== DOSIS_DERIVAR
            ? _pautaConRamasHTML(hyp)
            : `<div class="exercise-box">${tratada ? _textoTratada(cq) : citasEnTexto(hyp.dosis) || '<em style="color:var(--text3)">Sin dosis de referencia: a criterio del clínico.</em>'}</div>
          ${!tratada && hyp.dosis && hyp.dosisFuente ? `<div class="test-source" style="margin:4px 0 0;">${citasHTML(hyp.dosisFuente)}</div>` : ''}`}
          ${cq && !tratada && hyp.dosis && hyp.dosis !== DOSIS_DERIVAR ? `<div class="nota-posq" style="margin-top:6px;">🏥 ${TEXTO_PAUTA_COMPATIBLE}</div>` : ''}
        </div>
        ${hyp.pronostico ? `<details class="pronostico-det" style="margin-top:1rem;">
          <summary style="font-size:0.65rem; font-family:'DM Mono',monospace; color:var(--accent); letter-spacing:2px; text-transform:uppercase;">🧭 Pronóstico y derivación</summary>
          ${hyp.pronostico.horizonte ? `<div style="font-size:0.8rem; color:var(--text2); line-height:1.6;">${citasEnTexto(hyp.pronostico.horizonte)}</div>` : ''}
          ${hyp.pronostico.derivacion ? `<div style="font-size:0.8rem; color:var(--text2); line-height:1.6; margin-top:4px;"><strong>Derivar si:</strong> ${citasEnTexto(hyp.pronostico.derivacion)}</div>` : ''}
          ${hyp.pronostico.fuente ? `<div class="test-source" style="margin:4px 0 0;">${citasHTML(hyp.pronostico.fuente)}</div>` : ''}
        </details>` : ''}
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
  _pintarCuestionariosFase5();

  _montarInformeIA();
}

// Guarda la valoración completa en IDB y la anuncia por BroadcastChannel:
// physiq-report la lee de IDB al abrirse aunque nadie escuche ahora. Lo hace
// cada opción de «📤 Compartir» (y, en el hub, «Enviar al informe»).
export function registrarValoracionCompleta() {
  const _assessmentPayload = buildPhysiQPayload();
  writeSession({ assessment: _assessmentPayload, patient: state.patient || '', date: new Date().toLocaleDateString('es-ES') })
    .then(session => {
      if (session) updateSessionChip(session);
      _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT', assessment: _assessmentPayload });
    });
}

// Hub: «Enviar al informe» del menú de «📤 Compartir». physiq-report lo lee
// de IDB; la navegación hasta él es cosa del hub.
function finalizarValoracion() {
  cerrarMenuCompartir();
  registrarValoracionCompleta();
  showToast('✓ Valoración enviada al informe', 'success');
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
  document.getElementById('mobilePhaseBar')?.setAttribute('aria-expanded', String(!isOpen));
  if (isOpen) unlockBodyScroll(); else lockBodyScroll();
}

function closePhaseSheet() {
  const sheet = document.getElementById('phaseSheet');
  const overlay = document.getElementById('phaseSheetOverlay');
  if (!sheet.classList.contains('open')) return;
  sheet.classList.remove('open');
  overlay.classList.remove('open');
  document.getElementById('mobilePhaseBar')?.setAttribute('aria-expanded', 'false');
  unlockBodyScroll();
}


// Flecha y ✓ del círculo de la hoja de fases dibujados en SVG: los glifos de
// DM Mono se quedan por debajo del centro (la flecha va en el eje matemático)
const _ICONO_FASE_ACTUAL = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';
const _ICONO_FASE_HECHA = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

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
    let iconContent = String(def.n);   // el número de la fase («4b»), no la posición en la lista

    if (isActive) {
      stateClass = 'psi-active';
      statusText = '→ Fase actual';
      iconContent = _ICONO_FASE_ACTUAL;
    } else if (isCompleted && !isInvalidated) {
      stateClass = 'psi-completed';
      statusText = '✓ Completada';
      iconContent = _ICONO_FASE_HECHA;
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
// opts.cancelLabel cambia el texto del botón de cerrar («Cancelar» por
// defecto); opts.borra: false quita la papelera del botón de acción, para las
// acciones que no borran ni descartan nada (actualizar, cambiar de modo); opts.onCancel se llama al cancelar (botón, velo o Escape). Devuelve una función que cierra el diálogo sin confirmar, para
// quien necesite cerrarlo desde fuera (p. ej. si lo que se iba a confirmar ya
// no tiene sentido); no hace nada si ya está cerrado.
// Relevo de velos: cuando un velo se cierra y otro se abre en el mismo turno
// (panel de sesión → diálogo de confirmación, y al cancelar, de vuelta), el
// nuevo no se funde desde transparente: aparece ya opaco y solo se anima su
// recuadro. Si no, durante el fundido se veía la página sin velo (parpadeo).
let _veloRelevo = false;
function _marcarRelevoVelo() {
  _veloRelevo = true;
  queueMicrotask(() => { _veloRelevo = false; });
}

function showConfirmBanner(title, text, actionLabel, onConfirm, opts = {}) {
  // Un diálogo nuevo sustituye al que hubiera: su bloqueo de scroll se libera
  // aquí, porque ya no se cerrará por su dismiss()
  const existing = document.getElementById('confirmBanner');
  if (existing) { existing.remove(); unlockBodyScroll(); }
  const overlay = document.createElement('div');
  overlay.className = 'confirm-banner' + (_veloRelevo || existing ? ' relevo' : '');
  overlay.id = 'confirmBanner';
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-box-title">${title}</div>
      <div class="confirm-box-text">${text}</div>
      <div class="confirm-box-btns">
        <button class="confirm-btn-cancel" id="confirmCancel"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ${opts.cancelLabel || 'Cancelar'}</button>
        <button class="confirm-btn-ok" id="confirmAction">${opts.borra === false ? '' : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg> '}${actionLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  // Tocar el velo o pulsar Escape = el botón de cerrar: nunca la acción. Solo
  // cuenta un toque que empieza y acaba en el velo (no seleccionar texto del
  // recuadro y soltar fuera). Se quita el listener de teclado al cerrar, también
  // si otro código retira el diálogo (_closeAllOverlays, otro diálogo encima).
  const alTeclado = e => {
    if (!overlay.isConnected) { document.removeEventListener('keydown', alTeclado); return; }
    if (e.key === 'Escape') { e.preventDefault(); cancelar(); }
  };
  const dismiss = () => {
    document.removeEventListener('keydown', alTeclado);
    if (!overlay.isConnected) return;
    overlay.remove(); unlockBodyScroll(); window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*');
    _marcarRelevoVelo();
  };
  // Cancelar a mano (botón, velo o Escape) llama a opts.onCancel; el dismiss()
  // devuelto, para cerrarlo desde el código, no.
  const cancelar = () => { if (!overlay.isConnected) return; dismiss(); opts.onCancel?.(); };
  let empiezaEnVelo = false;
  overlay.addEventListener('pointerdown', e => { empiezaEnVelo = e.target === overlay; });
  overlay.addEventListener('click', e => { if (e.target === overlay && empiezaEnVelo) cancelar(); });
  document.addEventListener('keydown', alTeclado);
  document.getElementById('confirmCancel').onclick = cancelar;
  document.getElementById('confirmAction').onclick = () => { dismiss(); onConfirm(); };
  return dismiss;
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
  if (wasOpen) { unlockBodyScroll(); window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*'); _marcarRelevoVelo(); }
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
      <button type="button" class="session-reset-btn" id="sessionReset"${_hasAssessmentData() ? '' : ' disabled'}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>Reiniciar valoración</button>
      <div class="session-io-nota">Borra los datos clínicos y conserva el nombre del paciente.</div>
      <div class="session-io">
        <button type="button" class="session-io-btn" id="sessionExport"${state.maxVisitedIdx > 0 ? '' : ' disabled'}>⬇ Exportar</button>
        <button type="button" class="session-io-btn" id="sessionImport">⬆ Importar</button>
        <input type="file" id="sessionImportFile" accept=".json,application/json" hidden>
      </div>
      <div class="session-io-nota">Valoración completa en un archivo .json, con los datos clínicos y el nombre del paciente.${state.maxVisitedIdx > 0 ? '' : ' Se puede exportar a partir de la fase 2.'}</div>
      <div class="session-version" id="sessionVersion">${_versionPanelHTML()}</div>`;
    panel.querySelector('#sessionReset').onclick = resetApp;
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
    panel.querySelector('#sessionPanelClear').onclick = promptClearSession;
    _engancharVersionPanel(panel);

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

// ─── Versión desplegada ────────────────────────────────────────
// La versión cargada (lib/version.js, la escribe deploy-to-hub.yml) se ve al
// pie del panel de sesión. Al arrancar, al volver a la app y con «Comprobar»
// del panel se pide version.json: si es otra, un aviso ofrece recargar. Sirve
// para saber, tras un merge, si ya ha llegado el despliegue a este dispositivo.
//
// version.json se pide por su URL normal (sin ?t=…), igual que el código: así
// los dos salen del mismo estado del servidor y de la CDN de GitHub Pages
// (~10 min). Con un ?t= único, version.json llegaba nuevo mientras
// lib/version.js seguía en caché, y el aviso volvía a salir tras recargar.
let _versionNueva = null;          // { sha, fecha } publicada, si es distinta de la cargada
let _versionComprobada = 0;        // ms de la última comprobación (máx. una por minuto)
let _versionAvisoCerrado = '';     // sha cuyo aviso se cerró: no se vuelve a mostrar
const _CLAVE_RECARGA = 'physiq-assessment-recarga';   // sessionStorage: sha por el que ya se recargó

function _shaRecargado() { try { return sessionStorage.getItem(_CLAVE_RECARGA) || ''; } catch { return ''; } }
function _anotarRecarga(sha) { try { sha ? sessionStorage.setItem(_CLAVE_RECARGA, sha) : sessionStorage.removeItem(_CLAVE_RECARGA); } catch { /* sin almacenamiento: solo se pierde el aviso de «aún publicándose» */ } }
// Ya se recargó por esta versión y sigue sin llegar: aún se está publicando.
const _versionPendiente = () => !!_versionNueva && _shaRecargado() === _versionNueva.sha;

function _versionPanelHTML() {
  // Una línea: versión a la izquierda y un solo botón a la derecha, que es
  // «Comprobar» (contorno) o, con una versión más nueva publicada, «Actualizar»
  // en azul relleno, como el del aviso flotante (que ya lo explica, así que no
  // se repite en texto).
  // Versión y fecha no se parten por dentro: si no caben, la fecha baja entera.
  const [sha, fecha] = textoVersion().split(' · ');
  const actual = `<span class="nw">Versión ${sha}</span>${fecha ? ` · <span class="nw">${fecha}</span>` : ''}`;
  const boton = _versionNueva
    ? `<button type="button" class="session-version-btn session-version-btn-nueva" id="sessionVersionRecargar" title="${_versionPendiente() ? 'La versión nueva aún se está publicando: prueba en unos minutos' : 'Hay una versión nueva'}">Actualizar</button>`
    : '<button type="button" class="session-version-btn" id="sessionVersionComprobar">Comprobar</button>';
  return `<span class="session-version-txt">${actual}</span>${boton}`;
}

function _engancharVersionPanel(v) {
  v.querySelector('#sessionVersionRecargar')?.addEventListener('click', recargarVersionNueva);
  v.querySelector('#sessionVersionComprobar')?.addEventListener('click', () => comprobarVersion({ manual: true }));
}

// manual: desde «Comprobar» del panel — sin el límite de una por minuto y
// diciendo siempre el resultado.
async function comprobarVersion({ manual = false } = {}) {
  if (VERSION_SHA === 'dev') { if (manual) showToast('Versión de desarrollo: no hay despliegue con el que comparar.', 'warning'); return; }
  if (!manual && Date.now() - _versionComprobada < 60000) return;
  _versionComprobada = Date.now();
  let publicada;
  try {
    const r = await fetch('./version.json', { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    publicada = await r.json();
  } catch {   // sin conexión: nada que decir, salvo si se pidió a mano
    if (manual) showToast('No se ha podido comprobar la versión (¿sin conexión?).', 'warning');
    return;
  }
  if (!esVersionNueva(publicada)) {
    _versionNueva = null;
    _anotarRecarga('');
    document.getElementById('versionAviso')?.remove();
    _puntoVersionSesion(false);
    if (manual) showToast(`✓ Estás en la última versión (${textoVersion()})`, 'success');
    return;
  }
  _versionNueva = publicada;
  const v = document.getElementById('sessionVersion');
  if (v) { v.innerHTML = _versionPanelHTML(); _engancharVersionPanel(v); }
  if (manual) _versionAvisoCerrado = '';
  _mostrarAvisoVersion();
}

// En móvil (≤768 px) el aviso es un snackbar abajo, justo encima de los
// botones de navegación fijos: al alcance del pulgar y sin tapar el título de
// la fase. Su altura cambia con el ancho y la fase, así que se mide.
function _colocarAvisoVersion() {
  const nav = document.querySelector('.phase-container.active .nav-buttons');
  const fija = nav && getComputedStyle(nav).position === 'fixed' && nav.offsetHeight > 0;
  document.documentElement.style.setProperty('--nav-alto', fija ? `${nav.offsetHeight}px` : '0px');
}

// Punto azul en el icono de sesión mientras haya una versión nueva y el aviso
// esté cerrado: el panel tiene su botón «Actualizar», así que no se pierde.
function _puntoVersionSesion(on) {
  const b = document.getElementById('sessionBtn');
  if (!b) return;
  b.classList.toggle('version-nueva', on);
  b.title = b.ariaLabel = on ? 'Sesión · hay una versión nueva' : 'Sesión';
}

function _mostrarAvisoVersion() {
  if (!_versionNueva || _versionAvisoCerrado === _versionNueva.sha) return;
  if (document.getElementById('versionAviso')) return;
  _puntoVersionSesion(false);
  _colocarAvisoVersion();
  const aviso = document.createElement('div');
  aviso.id = 'versionAviso';
  aviso.className = 'version-aviso';
  aviso.setAttribute('role', 'status');
  aviso.innerHTML = `<span class="version-aviso-texto">${_versionPendiente() ? 'La versión nueva aún se está publicando: prueba en unos minutos' : '<span class="version-aviso-largo">Hay una versión nueva</span><span class="version-aviso-corto">Versión nueva</span>'}</span>
    <button type="button" class="version-aviso-btn" id="versionAvisoRecargar">Actualizar</button>
    <button type="button" class="version-aviso-cerrar" id="versionAvisoCerrar" aria-label="Cerrar aviso" title="Ahora no"><svg class="icono-x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg></button>`;
  document.body.appendChild(aviso);
  aviso.querySelector('#versionAvisoRecargar').onclick = recargarVersionNueva;
  aviso.querySelector('#versionAvisoCerrar').onclick = () => {
    _versionAvisoCerrado = _versionNueva?.sha || '';
    aviso.remove();
    _puntoVersionSesion(true);
  };
}
window.addEventListener('resize', () => { if (document.getElementById('versionAviso')) _colocarAvisoVersion(); });

// Mientras se recarga, el aviso es solo un estado («⟳ Actualizando…», una
// línea en cualquier ancho): el botón y la «×» ya no sirven, porque la app se
// va a recargar igualmente.
function _avisoActualizando() {
  const aviso = document.getElementById('versionAviso');
  if (aviso) {
    aviso.classList.add('version-aviso-actualizando');
    aviso.setAttribute('aria-busy', 'true');
    aviso.innerHTML = '<span class="version-aviso-giro" aria-hidden="true"></span><span class="version-aviso-texto">Actualizando…</span>';
  }
  const b = document.getElementById('sessionVersionRecargar');
  if (b) { b.disabled = true; b.textContent = 'Actualizando…'; }
}

// Antes de recargar se vuelven a pedir al servidor (cache: 'reload') los
// archivos propios que ha cargado esta página, para que la caché HTTP del
// navegador no sirva el código anterior aunque la página no esté bajo el
// service worker. Como mucho 4 s: si tarda, se recarga igual.
async function _refrescarArchivosApp() {
  const urls = [...new Set(performance.getEntriesByType('resource').map(e => e.name))].filter(u => {
    try {
      const x = new URL(u);
      return x.origin === location.origin && /\.(js|css)$/.test(x.pathname);
    } catch { return false; }
  });
  try { await navigator.serviceWorker?.getRegistration().then(r => r?.update()); } catch { /* sin SW */ }
  await Promise.race([
    Promise.allSettled(urls.map(u => fetch(u, { cache: 'reload' }))),
    new Promise(r => setTimeout(r, 4000)),
  ]);
}

// Recargar guarda la sesión, pero solo se guarda con nombre de paciente: sin
// él, una valoración empezada se perdería, así que se pide confirmación. Se
// anota por qué versión se recarga: si tras recargar sigue sin llegar, el
// aviso dice que aún se está publicando en vez de repetir «Hay una versión
// nueva» una y otra vez.
function recargarVersionNueva() {
  const recargar = async () => {
    saveSession();
    _anotarRecarga(_versionNueva?.sha || '');
    _avisoActualizando();
    await _refrescarArchivosApp();
    location.reload();
  };
  if (!(state.patient || '').trim() && _hasAssessmentData()) {
    closeSessionPanel();
    showConfirmBanner('Actualizar la app',
      'La valoración en curso no tiene nombre de paciente, así que no está guardada y se perderá al actualizar. Para conservarla, escribe un nombre en el panel de sesión antes de actualizar, o actualiza igualmente si no la necesitas.',
      'Actualizar', recargar, { borra: false });
    return;
  }
  recargar();
}

function toggleSessionPanel() {
  const overlay = document.getElementById('sessionPanelOverlay');
  if (!overlay) return;
  if (overlay.classList.contains('open')) { closeSessionPanel(); return; }
  _showSessionState('edit');
  overlay.classList.toggle('relevo', _veloRelevo);
  overlay.classList.add('open');
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
}

// Closes every open sheet/dialog. Called when the hub hides this satellite
// (e.g. navigating back to hub home) so a stale open dialog isn't still
// showing when the user returns.
function _closeAllOverlays() {
  cerrarFicha({ sinFoco: true });
  cerrarRazonamiento({ sinHistorial: true });
  cerrarMenuCompartir({ sinHistorial: true });
  cerrarHerramientas({ sinHistorial: true });
  cerrarPreguntaIA({ sinHistorial: true });
  cerrarTiemposTejido({ sinHistorial: true });
  cerrarCuestionarios({ sinHistorial: true });
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

// «Borrar sesión»: el mismo diálogo centrado que el resto de confirmaciones
// (iconos, velo, Escape). Se cierra el panel de sesión mientras tanto; si se
// cancela, se vuelve a abrir, que es donde estaba quien pulsó la papelera.
function promptClearSession() {
  const panelAbierto = document.getElementById('sessionPanelOverlay')?.classList.contains('open');
  closeSessionPanel();
  const nombre = (state.patient || '').trim();
  showConfirmBanner('Borrar sesión',
    `Se borrarán todos los datos${nombre ? ` de «${_escHTML(nombre)}»` : ' de la valoración'} y la app volverá al inicio.${_avisoAudioSesion()}`,
    'Borrar sesión', _borrarSesion,
    { onCancel: () => { if (panelAbierto) toggleSessionPanel(); } });
}

function _borrarSesion() {
  _descartarAudioSesion();
  _sessionGen++; _sessionCleared = true;
  state.patient = '';
  // El panel sigue en el DOM con el nombre escrito, y saveSession() vuelca ese
  // campo al estado: hay que vaciarlo o el nombre volvería.
  const campo = document.getElementById('patientName');
  if (campo) campo.value = '';
  updateSessionChip(null);
  _softResetApp(); goToPhase(1);
  clearSession().then(() => { _sessionCh.postMessage({ type: 'SESSION_CLEAR' }); });
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
    ...(getHMPayload() ? { hm: getHMPayload() } : {}),
    ...(getDsPayload() ? { ds: getDsPayload() } : {}),
    ...(getLePayload() ? { le: getLePayload() } : {}),
    cr: state.cronologia,
    rp: state.riesgoPsico,
    nr: state.severidad ?? null,   // null = no registrado (nunca un 0 por defecto)
    ir: state.irritabilidadNivel && state.irritabilidadDirecta ? `${state.irritabilidadNivel} (estimada)` : (state.irritabilidadNivel || null),
    ...payloadSintomas(state, ZONAS_SINTOMA[state.region] || []),   // z1 (zona de P1), ss (P2–P4)
    na: state.naturaleza,
    si: state.sistemicoAlerta,
    br: Object.entries(state.banderasRojas).filter(([, v]) => v === 'SI').map(([k]) => BR_LABELS[k]),
    sq: getSistemicoAffirmativeTexts(),
    ur: getUrgenciasActivas(),
    dv: getDerivacionesMedicas(),
    h:  hipotesisActivas().map(id => hipotesis(id)?.posquirurgica
        ? { id, name: hipotesis(id).name, sc: ETIQUETA_HIP_POSQ, lr: null, tr: {}, pq: true }
        : {
          id,
          name: HYPOTHESES[id]?.name ?? id,
          sc:   state.hypothesisScores[id]?.label ?? 'Sin evaluar',
          lr:   state.hypothesisScores[id]?.totalLR ?? null,
          tr:   state.testResults[id] ?? {},
          ...(esTratada(id) ? { dt: true } : {})
        }),
    pn: state.planNotes,
    fp: resumenFormularioPrevio(),
    ...(getCuestionariosPayload().length ? { cu: getCuestionariosPayload() } : {}),
    md: state.modo === 'breve' ? 'breve' : 'completo',
    ...(state.modo === 'breve' ? { pe: getPendientesBreve().map(p => p.texto) } : {}),
    ...(state.rom ? { rom: state.rom } : {})
  };
}


// 📋 Notas: resumen abreviado para el propio fisio (texto en lib/resumenes.js)
function buildContextSummaryText() {
  return textoNotas(buildPhysiQPayload());
}

// Compartir y copiar son una sola acción: en táctil (fuera del hub) la hoja de
// compartir del sistema, que ya incluye «Copiar»; con ratón, o en el hub (el
// iframe suele bloquear navigator.share), se copia y se avisa. Mismo criterio
// que «⬇ Exportar».
export async function compartirTexto(text, { titulo, copiado }) {
  if (!_enHub() && window.matchMedia?.('(pointer: coarse)').matches && navigator.share) {
    try { await navigator.share({ title: titulo, text }); return; }
    catch (e) { if (e?.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(text); showToast(copiado, 'success'); }
  catch { showToast('No se ha podido copiar el texto.', 'warning'); }
}

// «Notas clínicas» del menú de «📤 Compartir»: el resumen clínico abreviado
function compartirNotas() {
  cerrarMenuCompartir();
  registrarValoracionCompleta();
  compartirTexto(buildContextSummaryText(), { titulo: 'Notas clínicas — PhysiQ-Assessment', copiado: '✓ Notas clínicas copiadas al portapapeles' });
}

// 📄 Informe para el paciente / su médico (texto en lib/resumenes.js)
function buildInformeFisioterapiaText() {
  return textoInformePaciente(buildPhysiQPayload(), informeFormularioPrevio());
}

// «📤 Compartir» (barra inferior de la fase 5): un solo botón y un menú con
// cada documento — son para lectores distintos, así que siempre se elige.
// Cada opción registra la valoración completa (registrarValoracionCompleta).
function compartirInformePaciente() {
  cerrarMenuCompartir();
  registrarValoracionCompleta();
  compartirTexto(buildInformeFisioterapiaText(), { titulo: 'Informe de fisioterapia — PhysiQ-Assessment', copiado: '✓ Informe copiado — listo para pegar en tu plantilla' });
}

const _opcionCompartir = (accion, nombre, sub) => `
    <button type="button" class="compartir-op" onclick="${accion}()">
      <span class="compartir-op-nombre">${nombre}</span>
      <span class="compartir-op-sub">${sub}</span>
    </button>`;

// Hoja inferior en móvil / diálogo centrado en ancho (mismo patrón y CSS que
// el panel de sesión). En móvil empuja una entrada al historial, como el
// panel del razonamiento: el atrás de Android la cierra sin cambiar de fase.
let _compartirHistorial = false;
async function abrirMenuCompartir() {
  const overlay = document.getElementById('compartirOverlay');
  if (!overlay || overlay.classList.contains('open')) return;
  // Fase 6: el menú ofrece los documentos del plan (plan.js)
  if (state.currentPhase === 6) {
    if (!_planMod) return;
    document.getElementById('compartirOpciones').innerHTML = _planMod.opcionesCompartir().map(o => _opcionCompartir(o.accion, o.nombre, o.sub)).join('');
    return _abrirOverlayCompartir('btnCompartirPlan');
  }
  const conIA = !_enHub() && !!state.informeIA?.texto;
  // Puntos automáticos + «Antes de compartir», y cuántos siguen sin marcar
  let rev = { total: 0, pendientes: 0, altosPendientes: 0 };
  if (conIA) { try { rev = (await _cargarInformeIA()).estadoRevisionIA(); } catch { /* sin recuento */ } }
  const detalleIA = rev.pendientes
    ? `<span class="compartir-op-aviso${rev.altosPendientes ? ' alto' : ''}">⚠ ${rev.pendientes === rev.total ? rev.total : `${rev.pendientes} de ${rev.total}`} ${rev.total === 1 ? 'punto' : 'puntos'} sin revisar</span>`
    : rev.total ? `✓ ${rev.total === 1 ? 'Punto revisado' : `${rev.total} puntos revisados`}` : 'Documentación clínica';
  document.getElementById('compartirOpciones').innerHTML =
    _opcionCompartir('compartirInformePaciente', 'Para el paciente / médico', 'Informe de fisioterapia en lenguaje llano')
    + (conIA ? _opcionCompartir('compartirInformeIA', 'Informe clínico (IA)', detalleIA) : '')
    + _opcionCompartir('compartirNotas', 'Notas clínicas', 'Resumen abreviado para ti, con puntuaciones')
    + (_enHub() ? _opcionCompartir('finalizarValoracion', 'Enviar al informe', 'Deja la valoración lista en physiq-report') : '');
  _abrirOverlayCompartir('btnCompartir');
}

let _btnCompartirActivo = 'btnCompartir';
function _abrirOverlayCompartir(btnId) {
  const overlay = document.getElementById('compartirOverlay');
  _btnCompartirActivo = btnId;
  overlay.classList.add('open');
  document.getElementById(btnId)?.setAttribute('aria-expanded', 'true');
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  if (_esMovil()) {
    history.pushState({ phase: state.currentPhase, compartir: true }, '');
    _compartirHistorial = true;
  }
  document.getElementById('compartirPanel').focus({ preventScroll: true });
}

// `desdeHistorial`: lo llama el popstate del atrás. `sinHistorial`: cierre
// forzado (el hub nos oculta) sin tocar el historial.
function cerrarMenuCompartir({ desdeHistorial = false, sinHistorial = false } = {}) {
  const overlay = document.getElementById('compartirOverlay');
  if (!overlay?.classList.contains('open')) return;
  overlay.classList.remove('open');
  const panel = document.getElementById('compartirPanel');
  panel.style.transform = ''; panel.style.transition = '';
  unlockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*');
  if (_compartirHistorial) {
    _compartirHistorial = false;
    if (!desdeHistorial && !sinHistorial) { _popIgnorar = true; history.back(); }
  }
  const btn = document.getElementById(_btnCompartirActivo);
  btn?.setAttribute('aria-expanded', 'false');
  if (!sinHistorial) btn?.focus({ preventScroll: true });
}

function compartirInformeIA() {
  cerrarMenuCompartir();
  _cargarInformeIA().then(m => m.compartirInformeIA()).catch(() => {});
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('compartirOverlay')?.classList.contains('open')) cerrarMenuCompartir();
});

// ─── HERRAMIENTAS (cabecera, solo ≤768 px) ──────────────────────
// En móvil no caben como iconos sueltos los tiempos de tejido, los
// cuestionarios y «Preguntar a la IA» (decisión del usuario, 2026-10): un solo
// botón abre esta hoja y cada opción abre la suya. La hoja de la herramienta
// reutiliza la entrada del historial de esta (replaceState), así que un atrás
// cierra la herramienta y vuelve a la fase, sin pasar otra vez por el menú.
let _herrHistorial = false;
let _reusarEntrada = false;
function _entradaOverlay(st) {
  if (_reusarEntrada) { _reusarEntrada = false; history.replaceState(st, ''); }
  else history.pushState(st, '');
}
// Botón de cabecera al que vuelve el foco: el de la herramienta si se ve
// (escritorio), si no el de «Herramientas»
const _botonCabecera = btn => (btn?.offsetParent ? btn : document.getElementById('herramientasBtn'));

function abrirHerramientas() {
  const overlay = document.getElementById('herramientasOverlay');
  if (!overlay || overlay.classList.contains('open')) return;
  overlay.classList.add('open');
  document.getElementById('herramientasBtn')?.setAttribute('aria-expanded', 'true');
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  if (_esMovil()) {
    history.pushState({ phase: state.currentPhase, herramientas: true }, '');
    _herrHistorial = true;
  }
  document.getElementById('herramientasPanel').focus({ preventScroll: true });
}

// `traspaso`: se cierra para abrir una herramienta, que se queda con la
// entrada del historial y con el foco
function cerrarHerramientas({ desdeHistorial = false, sinHistorial = false, traspaso = false } = {}) {
  const overlay = document.getElementById('herramientasOverlay');
  if (!overlay?.classList.contains('open')) return;
  overlay.classList.remove('open');
  const panel = document.getElementById('herramientasPanel');
  panel.style.transform = ''; panel.style.transition = '';
  unlockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*');
  if (_herrHistorial) {
    _herrHistorial = false;
    if (traspaso) _reusarEntrada = true;
    else if (!desdeHistorial && !sinHistorial) { _popIgnorar = true; history.back(); }
  }
  const btn = document.getElementById('herramientasBtn');
  btn?.setAttribute('aria-expanded', 'false');
  if (!sinHistorial && !traspaso) btn?.focus({ preventScroll: true });
}

function herramientaElegir(k) {
  cerrarHerramientas({ traspaso: true });
  ({ tejidos: abrirTiemposTejido, cuestionarios: abrirCuestionarios, pregunta: abrirPreguntaIA })[k]?.();
  // Si la herramienta no llegó a abrirse, la entrada del menú sobra
  if (_reusarEntrada) { _reusarEntrada = false; _popIgnorar = true; history.back(); }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('herramientasOverlay')?.classList.contains('open')) cerrarHerramientas();
});

// ─── PREGUNTAR A LA IA (cabecera, solo standalone) ──────────────
// Pregunta libre del clínico, en cualquier fase: abre Perplexity, Google (modo
// IA) o Claude en otra pestaña con la pregunta. Lo único que se añade del caso
// es la región («Contexto: valoración de hombro»), nunca datos del paciente;
// el aviso del diálogo pide no escribirlos. Mismo patrón que «📤 Compartir»:
// hoja inferior con atrás en móvil, diálogo centrado en ancho. El destino
// elegido es el mismo que el de «Ampliar con IA» (localStorage).
let _preguntaHistorial = false;
let _preguntaDestino = null;
const _ctxPregunta = () => (state.region ? nombreRegion(state.region).toLowerCase() : '');

function _pintarPreguntaIA() {
  const d = _preguntaDestino;
  document.getElementById('preguntaDestinos').innerHTML = Object.entries(DESTINOS_IA).map(([k, x]) =>
    `<button type="button" class="option-btn${k === d ? ' selected' : ''}" role="radio" aria-checked="${k === d}" data-destino="${k}">${x.nombre.replace(/ \(.*\)$/, '')}</button>`).join('');
  document.getElementById('preguntaVentaja').textContent = DESTINOS_IA[d].ventaja;
  const ir = document.getElementById('preguntaIr');
  ir.textContent = `Preguntar en ${DESTINOS_IA[d].nombre.replace(/ \(.*\)$/, '')} ↗`;
  const ctx = _ctxPregunta();
  document.getElementById('preguntaNota').textContent =
    `Se envía tu pregunta${ctx ? ` y la región («valoración de ${ctx}»)` : ''}, y se pide que use fuentes científicas y las enlace. ${NOTA_CUENTAS}`;
  _actualizarPreguntaIr();
}

function _actualizarPreguntaIr() {
  const ir = document.getElementById('preguntaIr');
  const q = document.getElementById('preguntaTexto').value.trim();
  ir.setAttribute('aria-disabled', q.length < 3 ? 'true' : 'false');
  ir.href = q.length < 3 ? '#' : urlIA(_preguntaDestino, promptPregunta({ contexto: _ctxPregunta(), pregunta: q }));
}

function abrirPreguntaIA() {
  const overlay = document.getElementById('preguntaOverlay');
  if (!overlay || overlay.classList.contains('open') || _enHub()) return;
  _preguntaDestino = destinoIA();
  _pintarPreguntaIA();
  _pintarMicPregunta();
  overlay.classList.add('open');
  document.getElementById('preguntaIABtn')?.setAttribute('aria-expanded', 'true');
  lockBodyScroll();
  if (_esMovil()) {
    _entradaOverlay({ phase: state.currentPhase, pregunta: true });
    _preguntaHistorial = true;
  }
  _ajustarPreguntaTeclado();
  // En táctil (móvil, tablet) el foco va al diálogo, no al texto: si no, se
  // despliega el teclado nada más abrir y tapa los destinos y el 🎤.
  const tactil = window.matchMedia?.('(pointer: coarse)').matches;
  document.getElementById(tactil ? 'preguntaPanel' : 'preguntaTexto').focus({ preventScroll: true });
}

// 🎤 junto al título (el mismo dictado que los demás campos, toggleDictation).
// Desactivado mientras se graba la sesión (grabadora.js): el dictado y la
// grabación se disputarían el micrófono y en Android falla uno de los dos.
function _pintarMicPregunta() {
  const cab = document.getElementById('preguntaCabecera');
  if (!cab) return;
  let btn = cab.querySelector('.mic-btn');
  if (!btn) {
    const html = _renderMicButton('preguntaTexto');
    if (!html) return;
    cab.insertAdjacentHTML('beforeend', html);
    btn = cab.querySelector('.mic-btn');
  }
  const grabando = document.body.classList.contains('grab-activa');
  btn.disabled = grabando;
  btn.title = grabando ? 'Dictado no disponible mientras se graba la sesión' : 'Dictar por voz';
}

// Al cerrar o enviar: abort() (no stop()) y sin onresult, para que un último
// resultado no escriba en la caja ya oculta o recién vaciada.
function _pararDictadoPregunta() {
  const btn = document.querySelector('#preguntaCabecera .mic-btn');
  const rec = btn?._recognition;
  if (!rec) return;
  rec.onresult = null;
  try { rec.abort(); } catch { /* ya parado */ }
  btn._recognition = null;
  btn.classList.remove('listening');
}

function cerrarPreguntaIA({ desdeHistorial = false, sinHistorial = false } = {}) {
  const overlay = document.getElementById('preguntaOverlay');
  if (!overlay?.classList.contains('open')) return;
  _pararDictadoPregunta();
  overlay.classList.remove('open');
  overlay.style.paddingBottom = '';
  const panel = document.getElementById('preguntaPanel');
  panel.style.transform = ''; panel.style.transition = '';
  unlockBodyScroll();
  if (_preguntaHistorial) {
    _preguntaHistorial = false;
    if (!desdeHistorial && !sinHistorial) { _popIgnorar = true; history.back(); }
  }
  const btn = document.getElementById('preguntaIABtn');
  btn?.setAttribute('aria-expanded', 'false');
  if (!sinHistorial) _botonCabecera(btn)?.focus({ preventScroll: true });
}

// Con el teclado abierto en móvil, la hoja se apoya encima de él en vez de
// quedar tapada (iOS no encoge el viewport de diseño, solo el visual).
function _ajustarPreguntaTeclado() {
  const overlay = document.getElementById('preguntaOverlay');
  const vv = window.visualViewport;
  if (!overlay?.classList.contains('open') || !vv) return;
  const teclado = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
  overlay.style.paddingBottom = _esMovil() && teclado > 0 ? `${teclado}px` : '';
}
window.visualViewport?.addEventListener('resize', _ajustarPreguntaTeclado);

document.getElementById('preguntaTexto')?.addEventListener('input', _actualizarPreguntaIr);
document.getElementById('preguntaTexto')?.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
  e.preventDefault();
  document.getElementById('preguntaIr').click();
});
document.getElementById('preguntaDestinos')?.addEventListener('click', e => {
  const b = e.target instanceof Element ? e.target.closest('[data-destino]') : null;
  if (!b) return;
  _preguntaDestino = b.dataset.destino;
  guardarDestinoIA(_preguntaDestino);
  _pintarPreguntaIA();
});
// <a target="_blank"> con el href ya calculado: el navegador no lo bloquea
// como haría con un window.open. Vacía, no navega y devuelve el foco al texto.
document.getElementById('preguntaIr')?.addEventListener('click', e => {
  const texto = document.getElementById('preguntaTexto');
  _actualizarPreguntaIr();
  if (texto.value.trim().length < 3) { e.preventDefault(); texto.focus(); return; }
  _pararDictadoPregunta();
  guardarDestinoIA(_preguntaDestino);
  setTimeout(() => { texto.value = ''; cerrarPreguntaIA(); }, 0);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('preguntaOverlay')?.classList.contains('open')) cerrarPreguntaIA();
});

// ─── TIEMPOS DE RECUPERACIÓN DE TEJIDOS (cabecera, ⏱) ───────────
// Consulta en cualquier fase, también en el hub: el diagrama de
// data/tejidos.js (lib/tejidos.js). Con mecanismo Post-quirúrgico y semanas
// desde la cirugía, una línea «Hoy». Solo lee el estado para pintar; nada va
// al payload ni a los resúmenes. Mismo patrón que «✨ Preguntar a la IA»:
// hoja inferior con atrás en móvil, diálogo centrado en ancho.
let _tejidosHistorial = false;

// Filtro por tejido («Todos», «Ligamento»…): preferencia de este dispositivo,
// como el tema o el destino de la IA (localStorage, con try/catch).
const _CLAVE_FILTRO_TEJIDOS = 'physiq-assessment-tejidos-filtro';
// «Este paciente» (Fase J) no se guarda: depende de las hipótesis de esta valoración.
// Con alguna hipótesis activa que tenga filas (porHipotesis, data/tejidos.js), el panel
// se abre con ese filtro; tocar otra pastilla lo cambia hasta que se cierre.
let _filtroTejidosSesion = null;
function _filtroTejidos() {
  if (_filtroTejidosSesion) return _filtroTejidosSesion;
  try { return localStorage.getItem(_CLAVE_FILTRO_TEJIDOS) || 'todos'; } catch { return 'todos'; }
}
function _pacienteTejidos() {
  const { ids, hipotesis, sinFilas, soloFila } = filasPaciente(TIEMPOS_TEJIDO, state.activeHypotheses || [], {
    posquirurgico: esPosquirurgico(state.mecanismo), mecanismo: state.mecanismo, cronologia: state.cronologia,
  });
  const nombre = h => HYPOTHESES[h]?.name || h;
  return ids.length || sinFilas.length ? { ids, soloFila, nombres: hipotesis.map(nombre), sinPlazo: sinFilas.map(nombre) } : null;
}
function _pintarTiemposTejido() {
  _cerrarInfoBarra({ sinFoco: true });
  const posquirurgico = esPosquirurgico(state.mecanismo);
  document.getElementById('tejidosCuerpo').innerHTML = tiemposTejidoHTML(TIEMPOS_TEJIDO, {
    posquirurgico, semanas: posquirurgico ? semanasCirugia(state.cirugia) : null, filtro: _filtroTejidos(), REF: _refTejidos,
    paciente: _pacienteTejidos(),
  });
  const fila = document.querySelector('#tejidosCuerpo .tej-filtro');
  if (!fila) return;
  // La pastilla activa, a la vista aunque esté al final de la fila
  const activa = fila.querySelector('.tej-filtro-btn.activo');
  if (activa) fila.scrollLeft = Math.max(0, activa.offsetLeft - fila.offsetLeft - 16);
  _bordesScroll(fila);
  fila.addEventListener('scroll', () => _bordesScroll(fila), { passive: true });
}
// Degradado en el lado por el que quedan pastillas o chips fuera de la vista
// (filtro de tejidos y filas de chips de los campos de texto)
function _bordesScroll(fila) {
  const max = fila.scrollWidth - fila.clientWidth;
  fila.classList.toggle('mas-izda', fila.scrollLeft > 2);
  fila.classList.toggle('mas-dcha', fila.scrollLeft < max - 2);
}
document.getElementById('tejidosCuerpo')?.addEventListener('click', e => {
  const barra = e.target instanceof Element ? e.target.closest('.tej-barra[data-barra]') : null;
  if (barra) { _alternarInfoBarra(barra); return; }
  const b = e.target instanceof Element ? e.target.closest('[data-filtro-tejido]') : null;
  if (!b) return;
  if (b.dataset.filtroTejido === FILTRO_PACIENTE) _filtroTejidosSesion = FILTRO_PACIENTE;
  else {
    _filtroTejidosSesion = null;
    try { localStorage.setItem(_CLAVE_FILTRO_TEJIDOS, b.dataset.filtroTejido); } catch { /* sin preferencia guardada */ }
  }
  _pintarTiemposTejido();
  const cuerpo = document.getElementById('tejidosCuerpo');
  cuerpo.scrollTop = 0;
  // El foco vuelve a la pastilla de ese tejido (también si se tocó su título de grupo)
  cuerpo.querySelector(`.tej-filtro-btn[data-grupo="${b.dataset.grupo}"]`)?.focus({ preventScroll: true });
});

// Tarjeta de una barra (infoBarraHTML, lib/tejidos.js): su gravedad, qué mide,
// su plazo y sus fuentes con enlace, junto a la barra tocada, para no bajar hasta
// la leyenda. Es la ficha flotante común (ficha.js, la misma de las citas): se
// cierra al tocar fuera o la misma barra, con Escape (antes que el panel), al
// desplazar, al cambiar el filtro y al cerrar el panel.
// Registro de referencias para enlazar las fuentes (de la tarjeta y de las notas de
// grupo): se carga con import() al abrir el panel, como el «Ampliar» de la fase 4b.
// Si llega con algo ya pintado, pone los enlaces; si falla, las fuentes quedan sin enlace.
let _refTejidos = null;
function _cargarRefTejidos() {
  if (_refTejidos) return;
  registroReferencias().then(REF => {
    _refTejidos = REF;
    document.querySelectorAll('#tejidosCuerpo .tej-grupo-fuentes ul[data-claves]')
      .forEach(ul => { ul.innerHTML = fuentesTejidoHTML(ul.dataset.claves.split('|'), REF); });
    const barra = fichaAbierta();
    if (barra?.matches('.tej-barra[data-barra]')) actualizarFicha(_infoBarraHTML(barra));
  });
}
const _infoBarraHTML = barra => infoBarraHTML(TIEMPOS_TEJIDO, barra.dataset.barra, _refTejidos);
function _alternarInfoBarra(barra) {
  alternarFicha(barra, _infoBarraHTML(barra), { id: 'tejInfo', clase: 'tej-info' });
}
function _cerrarInfoBarra({ sinFoco = false } = {}) {
  if (fichaAbierta()?.matches('.tej-barra[data-barra]')) cerrarFicha({ sinFoco });
}

function abrirTiemposTejido() {
  const overlay = document.getElementById('tejidosOverlay');
  if (!overlay || overlay.classList.contains('open')) return;
  _cargarRefTejidos();
  _filtroTejidosSesion = _pacienteTejidos()?.ids.length ? FILTRO_PACIENTE : null;
  _pintarTiemposTejido();
  overlay.classList.add('open');
  document.getElementById('tejidosBtn')?.setAttribute('aria-expanded', 'true');
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  if (_esMovil()) {
    _entradaOverlay({ phase: state.currentPhase, tejidos: true });
    _tejidosHistorial = true;
  }
  const panel = document.getElementById('tejidosPanel');
  panel.scrollTop = 0;
  panel.focus({ preventScroll: true });
}

function cerrarTiemposTejido({ desdeHistorial = false, sinHistorial = false } = {}) {
  const overlay = document.getElementById('tejidosOverlay');
  if (!overlay?.classList.contains('open')) return;
  overlay.classList.remove('open');
  _cerrarInfoBarra({ sinFoco: true });
  const panel = document.getElementById('tejidosPanel');
  panel.style.transform = ''; panel.style.transition = '';
  unlockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*');
  if (_tejidosHistorial) {
    _tejidosHistorial = false;
    if (!desdeHistorial && !sinHistorial) { _popIgnorar = true; history.back(); }
  }
  const btn = document.getElementById('tejidosBtn');
  btn?.setAttribute('aria-expanded', 'false');
  if (!sinHistorial) _botonCabecera(btn)?.focus({ preventScroll: true });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('tejidosOverlay')?.classList.contains('open')) cerrarTiemposTejido();
});

// ─── Calculadora de cuestionarios (cabecera, cualquier fase, también en el hub) ───
// El paciente rellena la hoja en papel; aquí se toca el valor de cada ítem y
// se ve la puntuación y su interpretación al momento (lib/cuestionarios.js,
// data/cuestionarios.js). Las respuestas van en state.cuestionarios y el
// resultado al payload (`cu`), a 📋 Notas y al informe con IA. Mismo patrón
// que «Tiempos de recuperación»: hoja inferior con atrás en móvil, diálogo
// centrado en ancho. Dentro, lista de cuestionarios o el de `_cuestActivo`.
let _cuestHistorial = false;
let _cuestActivo = null;

function getCuestionariosPayload() {
  return resumenCuestionarios(CUESTIONARIOS, state.cuestionarios || {});
}

function _defCuest(id) { return CUESTIONARIOS.find(d => d.id === id); }
function _respuestasCuest(id) { return state.cuestionarios?.[id]?.r || {}; }

function _pintarCuestionarios({ foco } = {}) {
  const cuerpo = document.getElementById('cuestCuerpo');
  const titulo = document.getElementById('cuestTitulo');
  const def = _cuestActivo && _defCuest(_cuestActivo);
  titulo.textContent = 'Cuestionarios';
  if (def) {
    cuerpo.innerHTML = formularioCuestionarioHTML(def, _respuestasCuest(def.id));
  } else {
    _cuestActivo = null;
    cuerpo.innerHTML = listaCuestionariosHTML(CUESTIONARIOS, GRUPOS_CUESTIONARIO, state.cuestionarios || {}, { region: state.region });
  }
  cuerpo.scrollTop = 0;
  if (foco) cuerpo.querySelector(foco)?.focus({ preventScroll: true });
}

// Un toque: guarda la respuesta y repinta solo ese ítem y el resultado, para
// no perder la posición. Un segundo toque sobre la opción marcada la borra
// (regla de la app para grupos sin valor por defecto); en `marcas`, alterna.
function _tocarCuest(item, valorTxt) {
  const def = _defCuest(_cuestActivo);
  const it = def?.items.find(x => String(x.n) === item);
  if (!it) return;
  const tipo = it.tipo || 'escala';
  const valor = tipo === 'sino' || valorTxt === 'na' ? valorTxt : Number(valorTxt);
  const reg = state.cuestionarios[def.id] ||= { r: {} };
  const actual = reg.r[it.n];
  if (tipo === 'marcas') {
    const lista = Array.isArray(actual) ? [...actual] : [];
    const i = lista.indexOf(valor);
    if (i >= 0) lista.splice(i, 1); else lista.push(valor);
    lista.sort((a, b) => a - b);
    if (lista.length) reg.r[it.n] = lista; else delete reg.r[it.n];
  } else if (actual === valor) delete reg.r[it.n];
  else reg.r[it.n] = valor;
  if (!Object.keys(reg.r).length) delete state.cuestionarios[def.id];
  const r = _respuestasCuest(def.id);
  const nodo = document.querySelector(`#cuestCuerpo .cuest-item[data-item="${it.n}"]`);
  if (nodo) {
    nodo.outerHTML = itemCuestionarioHTML(def, it, r[it.n]);
    document.querySelector(`#cuestCuerpo .cuest-item[data-item="${it.n}"] .cuest-op[data-valor="${valorTxt}"]`)?.focus({ preventScroll: true });
  }
  document.getElementById('cuestResultado').innerHTML = resultadoCuestionarioHTML(def, r);
  const borrar = document.querySelector('#cuestCuerpo [data-cuest-borrar]');
  if (borrar) borrar.disabled = !Object.keys(r).length;
  saveSession();
}

// Ítems `numero` (mm de una escala visual): se guarda al teclear; vacío o
// fuera de rango no cuenta. Solo se repinta el resultado, no el ítem, para no
// perder el foco del campo.
document.getElementById('cuestCuerpo')?.addEventListener('input', e => {
  const campo = e.target instanceof HTMLInputElement && e.target.classList.contains('cuest-num') ? e.target : null;
  const def = campo && _defCuest(_cuestActivo);
  const n = campo?.closest('.cuest-item')?.dataset.item;
  if (!def || !n) return;
  const reg = state.cuestionarios[def.id] ||= { r: {} };
  const v = campo.value === '' ? NaN : Number(campo.value);
  if (Number.isFinite(v)) reg.r[n] = v; else delete reg.r[n];
  if (!Object.keys(reg.r).length) delete state.cuestionarios[def.id];
  const r = _respuestasCuest(def.id);
  document.getElementById('cuestResultado').innerHTML = resultadoCuestionarioHTML(def, r);
  const borrar = document.querySelector('#cuestCuerpo [data-cuest-borrar]');
  if (borrar) borrar.disabled = !Object.keys(r).length;
  saveSession();
});
document.getElementById('cuestCuerpo')?.addEventListener('click', e => {
  const t = e.target instanceof Element ? e.target : null;
  if (!t) return;
  const tarjeta = t.closest('[data-cuest]');
  if (tarjeta) { _cuestActivo = tarjeta.dataset.cuest; _pintarCuestionarios({ foco: '.cuest-volver' }); return; }
  if (t.closest('[data-cuest-volver]')) {
    const antes = _cuestActivo;
    _cuestActivo = null;
    _pintarCuestionarios({ foco: `[data-cuest="${antes}"]` });
    return;
  }
  if (t.closest('[data-cuest-borrar]')) {
    const def = _defCuest(_cuestActivo);
    if (!def) return;
    cerrarCuestionarios({ sinFoco: true });
    showConfirmBanner('Borrar respuestas', `Se borrarán las respuestas del ${def.nombre}.`, 'Borrar', () => {
      delete state.cuestionarios[def.id];
      saveSession();
      abrirCuestionarios(def.id);
    }, { onCancel: () => abrirCuestionarios(def.id) });
    return;
  }
  const op = t.closest('.cuest-op');
  const item = op?.closest('.cuest-item');
  if (op && item) _tocarCuest(item.dataset.item, op.dataset.valor);
});

function abrirCuestionarios(id) {
  const overlay = document.getElementById('cuestOverlay');
  if (!overlay || overlay.classList.contains('open')) return;
  if (typeof id === 'string' && _defCuest(id)) _cuestActivo = id;
  _pintarCuestionarios();
  overlay.classList.add('open');
  document.getElementById('cuestBtn')?.setAttribute('aria-expanded', 'true');
  lockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_HIDE' }, '*');
  if (_esMovil()) {
    _entradaOverlay({ phase: state.currentPhase, cuestionarios: true });
    _cuestHistorial = true;
  }
  document.getElementById('cuestPanel').focus({ preventScroll: true });
}

function cerrarCuestionarios({ desdeHistorial = false, sinHistorial = false, sinFoco = false } = {}) {
  const overlay = document.getElementById('cuestOverlay');
  if (!overlay?.classList.contains('open')) return;
  overlay.classList.remove('open');
  cerrarFicha({ sinFoco: true });
  const panel = document.getElementById('cuestPanel');
  panel.style.transform = ''; panel.style.transition = '';
  unlockBodyScroll();
  window.parent.postMessage({ type: 'PHYSIQ_WIDGET_SHOW' }, '*');
  if (_cuestHistorial) {
    _cuestHistorial = false;
    if (!desdeHistorial && !sinHistorial) { _popIgnorar = true; history.back(); }
  }
  const btn = document.getElementById('cuestBtn');
  btn?.setAttribute('aria-expanded', 'false');
  // Si se abrió desde un enlace «Calcular», el foco vuelve a ese enlace
  const origen = _cuestOrigen;
  _cuestOrigen = null;
  // Si la fase 5 ya está pintada, su bloque de cuestionarios se pone al día,
  // y los enlaces «Calcular» muestran lo que lleva hecho cada cuestionario
  _pintarCuestionariosFase5();
  _refrescarEnlacesCalcular();
  if (!sinHistorial && !sinFoco) {
    const vuelta = origen && [...document.querySelectorAll(`[data-cuest-abrir="${origen}"]`)].find(b => b.offsetParent);
    (vuelta || _botonCabecera(btn))?.focus({ preventScroll: true });
  }
}
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !document.getElementById('cuestOverlay')?.classList.contains('open')) return;
  if (document.getElementById('confirmBanner')) return;
  cerrarCuestionarios();
});

// Fase 5: los cuestionarios puntuados, con un enlace para abrir la calculadora
// Enlaces «Calcular <cuestionario>» junto a los textos que los recomiendan
// (fase 1, badge del PROM en 4b y 5): abren la calculadora en ese
// cuestionario y, al cerrarla, se repintan con lo que lleva hecho.
export function enlacesCalcular(texto) {
  return enlacesCalcularHTML(cuestionariosEnTexto(texto, CUESTIONARIOS), CUESTIONARIOS, state.cuestionarios);
}
let _cuestOrigen = null;
function _refrescarEnlacesCalcular() {
  document.querySelectorAll('.cuest-calc[data-cuest-ids]').forEach(el => {
    el.outerHTML = enlacesCalcularHTML(el.dataset.cuestIds.split(' '), CUESTIONARIOS, state.cuestionarios);
  });
}
document.addEventListener('click', e => {
  const btn = e.target.closest?.('[data-cuest-abrir]');
  if (!btn) return;
  _cuestOrigen = btn.dataset.cuestAbrir;
  abrirCuestionarios(btn.dataset.cuestAbrir);
});

function _pintarCuestionariosFase5() {
  const caja = document.getElementById('cuestFase5');
  if (!caja) return;
  const lista = getCuestionariosPayload();
  caja.hidden = !lista.length;
  caja.innerHTML = lista.length
    ? `<div class="summary-section-title">📑 Cuestionarios</div><ul class="cuest-f5">${lista.map(c =>
      `<li><strong>${_escapeAttr(c.n)}</strong>: ${_escapeAttr(c.v)}${c.i ? ` — ${_escapeAttr(c.i)}` : ''}${c.a?.length ? `<div class="cuest-alerta">⚠️ ${c.a.map(_escapeAttr).join(' · ')}</div>` : ''}</li>`).join('')}</ul>`
      + '<button type="button" class="cuest-f5-abrir" onclick="abrirCuestionarios()">Abrir la calculadora</button>'
    : '';
}

// Aviso inferior. Estilos en styles.css (.app-toast): en móvil, banda a todo
// el ancho justo encima de los botones de navegación fijos (--nav-alto) y, si
// está el aviso de versión nueva, encima de este (--toast-sobre).
function showToast(message, tone) {
  const existing = document.getElementById('appToast');
  if (existing) existing.remove();
  _colocarAvisoVersion();
  const aviso = document.getElementById('versionAviso');
  const altoAviso = aviso && aviso.offsetHeight > 0 && getComputedStyle(aviso).position === 'fixed'
    && aviso.getBoundingClientRect().top > window.innerHeight / 2 ? aviso.offsetHeight + 8 : 0;
  document.documentElement.style.setProperty('--toast-sobre', `${altoAviso}px`);
  const toast = document.createElement('div');
  toast.id = 'appToast';
  toast.className = tone === 'warning' ? 'app-toast app-toast-warning' : 'app-toast';
  toast.setAttribute('role', 'status');
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
    || !!state.sexo
    || _hasVitalsData()
    || !!state.mecanismo
    || !!state.cirugia?.intervencion
    || !!state.hipermovilidad?.estado
    || !!state.disautonomia?.estado
    || !!state.lupus?.estado
    || !!state.cronologia
    || !!state.riesgoPsico
    || !!state.psico_miedo
    || !!state.psico_autoef
    || !!state.psico_emocional
    || Object.values(state.banderasRojas).includes('SI')
    || resumenFormularioPrevio().length > 0;
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
    if (!state.patient) return;
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
        // En la 5 y en la 6 la valoración ya está completa: no se anuncia como parcial
        if (state.currentPhase !== 5 && state.currentPhase !== 6) {
          const _hasPhase1Data = state.motivoConsulta || state.edadPaciente !== null || _hasVitalsData() || state.mecanismo || state.cronologia || state.riesgoPsico;
          if (state.maxVisitedIdx > 0 || _hasPhase1Data) {
            _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_PARTIAL', phase: _faseAnunciada(), region: state.region || null });
          }
        }
        _sessionCh.postMessage({ type: 'SESSION_ASSESSMENT_STATE', assessmentState: { ...state } });
      });
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

// NRS e irritabilidad de P1 desde el estado (restaurar la sesión, o cuando
// «Hacer principal» de la tarjeta Síntomas cambia P1)
function repintarP1Fase3() {
  document.querySelectorAll('.nrs-btn').forEach(btn => {
    btn.classList.toggle('selected', state.severidad !== null && parseInt(btn.textContent.trim()) === state.severidad);
  });
  const nrsLabel = document.getElementById('nrsLabel');
  if (nrsLabel) nrsLabel.textContent = state.severidad !== null ? `${state.severidad}/10 — ${NRS_LABELS[state.severidad]}` : '— Sin seleccionar —';
  _pintarSeleccionIrritab();
  document.querySelectorAll('#irritabDirecta .option-btn').forEach(btn => {
    const m = (btn.getAttribute('onclick') || '').match(/'(\w+)'\)/);
    btn.classList.toggle('selected', !!(state.irritabilidadDirecta && m && m[1] === state.irritabilidadNivel));
  });
  calcIrritabilidad();
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

  ['mecanismo', 'cronologia', 'riesgoPsico', 'sexo'].forEach(g => _restoreOptionBtnGroup(g, state[g]));
  // Sesiones anteriores al posquirúrgico: sin cirugia / derivacionResuelta
  state.cirugia = { ...cirugiaVacia(), ...(state.cirugia || {}) };
  state.hipermovilidad = normalizarHipermovilidad(state.hipermovilidad);   // sesiones anteriores a la Fase P
  state.disautonomia = normalizarDisautonomia(state.disautonomia);         // sesiones anteriores al POTS
  state.lupus = normalizarLupus(state.lupus);                               // sesiones anteriores al lupus
  if (!state.derivacionResuelta) state.derivacionResuelta = {};
  normalizarSintomas(state);   // sesiones anteriores a la tarjeta Síntomas
  _pintarCirugiaUI();
  _pintarHMUI();
  _pintarDsUI();
  _pintarLESUI();
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

  repintarP1Fase3();
  pintarSintomas();
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
  const localIdx = Math.max(0, _idxFase(localPhase));

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
  if (localPhase === 5 || localPhase === 6) buildResults();
  if (localPhase === 6) _montarPlan();

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
  // Init irritability: la matriz sale de data/irritabilidad.js
  pintarMatrizIrritabilidad();
  calcIrritabilidad();
  // Init mobile phase bar
  updateMobilePhaseBar(1);
  // Init session panel drag-to-dismiss
  _setupSessionPanelDrag();
  // Init quick-input chips + dictation for static text fields
  initQuickInputBars();
  // Tarjeta «Cirugía»: chips de complicaciones (se repinta al restaurar sesión)
  _pintarCirugiaUI();
  _pintarHMUI();
  _pintarDsUI();
  _pintarLESUI();
  // Silueta de la fase 2 (se repinta al restaurar sesión, desde _pintarLado)
  _pintarSilueta();
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
    else comprobarVersion();
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
      if (targetPhase === 5 || targetPhase === 6) buildResults();
      _handlingPopState = true;
      goToPhase(targetPhase);
      _handlingPopState = false;
      // Rebuild history stack so swipe-back steps through each phase
      const targetIdx = Math.max(0, _idxFase(targetPhase));
      history.replaceState({ phase: 1 }, '');
      for (let i = 1; i <= targetIdx; i++) history.pushState({ phase: _FASES[i] }, '');
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
  });
});

// Al imprimir, lo plegado de la fase 5 (pauta, pronóstico, tests sin hacer)
// sale desplegado; después se deja como estaba.
let _plegadosImpresion = [];
window.addEventListener('beforeprint', () => {
  _plegadosImpresion = [...document.querySelectorAll('#phase5 details:not([open])')];
  _plegadosImpresion.forEach(d => { d.open = true; });
});
window.addEventListener('afterprint', () => {
  _plegadosImpresion.forEach(d => { d.open = false; });
  _plegadosImpresion = [];
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
comprobarVersion();

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
    const targetIdx = Math.max(0, _idxFase(state.currentPhase));
    history.replaceState({ phase: 1 }, '');
    for (let i = 1; i <= targetIdx; i++) history.pushState({ phase: _FASES[i] }, '');
    _historyDepth = targetIdx;
  });
}
_initHubIntegration();
_iniciarGrabadora();
initAmpliarIA();

// ─── PUBLIC API ──────────────────────────────────────────────
// Named exports for phase4.js / phase4b.js (which import these directly) and
// for tests/unit.js.
export { saveSession, showConfirmBanner, paintNav, buildPhysiQPayload, getUrgenciasActivas, getCirugiaPayload, cerrarMenuCompartir, resumenFormularioIA, buildInformeFisioterapiaText, getSistemicoAffirmativeTexts,
  buildContextSummaryText, getPendientesBreve, buildSistemaHTML, sistemasActivos, textoBandera, razonBanderaHTML,
  precargarFormularioPrevio, nombreRegion, showToast,
  injectQuickInputBar, repintarP1Fase3, lockBodyScroll, unlockBodyScroll, partirPrimeraFrase, abrirPanelRazon, razonCitaHTML, cerrarRazonamiento };

// Exposed on window for inline onclick/oninput attributes across index.html
// and dynamically-generated HTML — those resolve only against the global
// scope, never a module's private scope.
Object.assign(window, {
  abrirFormularioPrevio, abrirRazonamiento, abrirRazonBandera, toggleRazonBandera, cerrarRazonamiento, irACronologia, irAPreguntaCribado, appendQuickPhrase, buildResults, closePhaseSheet, closeSessionPanel, compartirNotas,
  abrirMenuCompartir, cerrarMenuCompartir, abrirHerramientas, cerrarHerramientas, herramientaElegir, abrirPreguntaIA, cerrarPreguntaIA, abrirTiemposTejido, cerrarTiemposTejido, abrirCuestionarios, cerrarCuestionarios, compartirInformePaciente, compartirInformeIA, finalizarValoracion, goToPhase, goToPhase2Next, handleTranslateClick, hideTranslateBanner,
  navStepClick, promptClearSession, resetApp, saveSession, scrollToActiveSisHeader, scrollToFormularioPrevio, selectIrritab,
  selectNRS, selectOption, selectPsico, selectRegion, selectSQ, selectSistQ,
  tocarZonaSilueta, elegirSexoSilueta,
  toggleAccordionRow, toggleDictation, toggleImpact, togglePhaseSheet, toggleSessionPanel,
  cycleThemePref, selectModo, toggleBreveVerTodo, completarPendientesBreve, selectEmbudo, selectIrritabDirecta, verResultadosSinConfirmar,
  updateEdadPaciente, updateVital, updateVitalColor,
  updateCirugia, selectCirProtocolo, toggleCirComplicacion, toggleDiagnosticoTratado,
  selectHMEstado, selectHMSubtipo, selectHMCuest, toggleHMBeighton, hmBeightonHacer, hmBeightonQuitar,
  selectDsEstado, selectDsTipo, selectDsSospecha, dsPruebaHacer, dsPruebaQuitar, toggleDsPrep, updateDsPrueba,
  dsRelojEmpezar, dsRelojParar,
  selectLESEstado, selectLESFila, toggleLESCasilla, selectLESRasgo,
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
  const compartir = document.getElementById('compartirPanel');
  if (compartir) initSwipe(compartir, () => cerrarMenuCompartir(), _esMovil);
  const pregunta = document.getElementById('preguntaPanel');
  if (pregunta) initSwipe(pregunta, () => cerrarPreguntaIA(), _esMovil);
  const herr = document.getElementById('herramientasPanel');
  if (herr) initSwipe(herr, () => cerrarHerramientas(), _esMovil);
  const tejidos = document.getElementById('tejidosPanel');
  if (tejidos) initSwipe(tejidos, () => cerrarTiemposTejido(), _esMovil);
  const cuest = document.getElementById('cuestPanel');
  if (cuest) initSwipe(cuest, () => cerrarCuestionarios(), _esMovil);
}());

