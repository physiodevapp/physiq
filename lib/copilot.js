// lib/copilot.js — Copilot UI: panel, suggestion cards, transcript
// API stubs are marked TODO — wired up once the Cloudflare Worker backend exists.

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────
  let _open            = false;
  let _listening       = false;
  let _transcriptOpen  = false;
  let _suggestions     = [];   // [{ id, type, text }]
  let _nextId          = 1;
  let _sessionData     = {};

  // ── DOM helpers ───────────────────────────────────────────────────
  const $  = id => document.getElementById(id);
  const PANEL   = () => $('copilot-panel');
  const OVERLAY = () => $('copilot-overlay');
  const COPBTN  = () => document.querySelector('.rw-cop-btn');

  // ── Panel open / close ────────────────────────────────────────────
  function copilotToggle() { _open ? _hide() : _show(); }

  function _show() {
    _open = true;
    PANEL()?.classList.add('open');
    OVERLAY()?.classList.add('open');
    document.body.classList.add('cop-panel-open');
    _syncTab();
  }

  function _hide() {
    _open = false;
    PANEL()?.classList.remove('open');
    OVERLAY()?.classList.remove('open');
    document.body.classList.remove('cop-panel-open');
    _syncTab();
  }

  // ── Listen toggle ─────────────────────────────────────────────────
  function copilotToggleListen() {
    _listening ? _stopListen() : _startListen();
  }

  function _startListen() {
    _listening = true;
    _setStatus('listening', 'Escuchando…');
    _syncListenBtn();
    _syncTab();
    // TODO: copilotStartStream(_sessionData) — connect Deepgram WebSocket
  }

  function _stopListen() {
    _listening = false;
    _setStatus('stopped', 'Sesión finalizada');
    _syncListenBtn();
    _syncTab();
    $('copilot-soap-btn')?.removeAttribute('hidden');
    // TODO: copilotStopStream()
  }

  // ── Status header ─────────────────────────────────────────────────
  function _setStatus(state, label) {
    const dot = $('copilot-hdr-dot');
    const lbl = $('copilot-status');
    if (dot) {
      dot.className = 'cop-hdr-dot';
      if (state === 'listening') dot.classList.add('cop-dot-on');
      if (state === 'stopped')   dot.classList.add('cop-dot-done');
    }
    if (lbl) lbl.textContent = label;
  }

  // ── Listen button sync ────────────────────────────────────────────
  function _syncListenBtn() {
    const btn   = $('copilot-listen-btn');
    const label = $('copilot-listen-label');
    const icon  = $('copilot-listen-icon');
    if (!btn) return;
    btn.classList.toggle('cop-btn-on', _listening);
    if (label) label.textContent = _listening ? 'Detener' : (_suggestions.length ? 'Reanudar' : 'Empezar a escuchar');
    if (icon)  icon.setAttribute('data-listening', _listening ? '1' : '');
  }

  // ── Widget button sync ────────────────────────────────────────────
  function _syncTab() {
    const btn   = COPBTN();
    if (!btn) return;
    btn.classList.toggle('cop-active', _open || _listening);
    const dot   = btn.querySelector('.rw-cop-dot');
    const badge = btn.querySelector('.rw-cop-badge');
    if (dot)   dot.hidden = !_listening;
    const n = _suggestions.length;
    if (badge) { badge.textContent = n > 9 ? '9+' : n; badge.hidden = n === 0 || _open; }
  }

  // ── Suggestion cards ──────────────────────────────────────────────
  const TYPE_META = {
    redflag:      { label: 'Bandera roja',            cls: 'cop-card-redflag'      },
    followup:     { label: 'Pregunta de seguimiento',  cls: 'cop-card-followup'     },
    differential: { label: 'Diagnóstico diferencial',  cls: 'cop-card-differential' },
    test:         { label: 'Test sugerido',            cls: 'cop-card-test'         },
  };

  function copilotAddSuggestion(type, text) {
    const id   = _nextId++;
    _suggestions.push({ id, type, text });

    const empty = $('copilot-empty');
    if (empty) empty.hidden = true;

    const container = $('copilot-suggestions');
    if (!container) return;

    const meta = TYPE_META[type] || { label: type, cls: '' };
    const card = document.createElement('div');
    card.className = `cop-card ${meta.cls}`;
    card.dataset.id = id;
    card.innerHTML =
      `<div class="cop-card-top">` +
        `<span class="cop-card-type">${meta.label}</span>` +
        `<button class="cop-card-x" onclick="copilotDismiss(${id})" aria-label="Descartar">` +
          `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>` +
        `</button>` +
      `</div>` +
      `<p class="cop-card-text">${text}</p>`;

    container.insertBefore(card, container.firstChild);

    // Animate in
    card.style.opacity   = '0';
    card.style.transform = 'translateY(-6px)';
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    });

    _syncTab();
  }

  function copilotDismiss(id) {
    const card = document.querySelector(`.cop-card[data-id="${id}"]`);
    if (card) {
      const h = card.offsetHeight;
      card.style.transition  = 'opacity 0.18s, transform 0.18s, max-height 0.22s 0.04s, margin-bottom 0.22s 0.04s';
      card.style.opacity     = '0';
      card.style.transform   = 'translateX(6px)';
      card.style.overflow    = 'hidden';
      card.style.maxHeight   = h + 'px';
      requestAnimationFrame(() => { card.style.maxHeight = '0'; card.style.marginBottom = '0'; });
      setTimeout(() => {
        card.remove();
        _suggestions = _suggestions.filter(s => s.id !== id);
        const container = $('copilot-suggestions');
        const empty     = $('copilot-empty');
        if (empty && container && !container.querySelector('.cop-card')) empty.hidden = false;
        _syncTab();
      }, 260);
    } else {
      _suggestions = _suggestions.filter(s => s.id !== id);
      _syncTab();
    }
  }

  // ── Transcript ────────────────────────────────────────────────────
  function copilotAddTranscriptLine(speaker, text) {
    const container = $('copilot-transcript');
    if (!container) return;
    const line = document.createElement('div');
    line.className = 'cop-tx-line';
    line.innerHTML =
      `<span class="cop-tx-spk cop-tx-spk-${speaker === 'fisio' ? 'f' : 'p'}">` +
        (speaker === 'fisio' ? 'Fisio' : 'Pac.') +
      `</span>` +
      `<span class="cop-tx-text">${text}</span>`;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }

  function copilotToggleTranscript() {
    _transcriptOpen = !_transcriptOpen;
    const body    = $('copilot-transcript-body');
    const chevron = document.querySelector('.cop-tx-chevron');
    if (body)    body.hidden = !_transcriptOpen;
    if (chevron) chevron.classList.toggle('cop-tx-chevron-open', _transcriptOpen);
  }

  // ── SOAP generation ───────────────────────────────────────────────
  function copilotGenerateSOAP() {
    // TODO: POST /api/notes { transcript: _transcript, session: _sessionData }
    // then display the returned SOAP text in a dedicated view
    copilotAddSuggestion('test', 'Generando nota SOAP… (backend pendiente)');
  }

  // ── Session data from BroadcastChannel ───────────────────────────
  try {
    const ch = new BroadcastChannel('physiq-session');
    ch.onmessage = e => {
      if (e.data?.patient)       _sessionData.patient       = e.data.patient;
      if (e.data?.diagnosis)     _sessionData.diagnosis     = e.data.diagnosis;
      if (e.data?.manualRegion)  _sessionData.manualRegion  = e.data.manualRegion;
      if (e.data?.rom)           _sessionData.rom           = e.data.rom;
    };
  } catch (_) {}

  // ── Swipe-to-close (mobile bottom sheet) ─────────────────────────
  function _initSwipe() {
    const panel  = PANEL();
    const handle = $('copilot-handle');
    if (!panel || !handle) return;

    let startY = 0, startTime = 0, dragging = false, delta = 0;
    const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';

    handle.addEventListener('touchstart', e => {
      startY    = e.touches[0].clientY;
      startTime = Date.now();
      delta = 0; dragging = true;
      panel.style.transition = 'none';
    }, { passive: true });

    handle.addEventListener('touchmove', e => {
      if (!dragging) return;
      delta = Math.max(0, e.touches[0].clientY - startY);
      panel.style.transform = delta > 0 ? `translateY(${delta}px)` : '';
    }, { passive: true });

    const onRelease = () => {
      if (!dragging) return;
      dragging = false;
      const v = delta / Math.max(1, Date.now() - startTime);
      if (delta > 80 || v > 0.3) {
        panel.style.transition = EASE;
        panel.style.transform  = 'translateY(110%)';
        setTimeout(() => { panel.style.transition = ''; panel.style.transform = ''; _hide(); }, 300);
      } else {
        panel.style.transition = EASE;
        panel.style.transform  = '';
        setTimeout(() => { panel.style.transition = ''; }, 310);
      }
    };

    handle.addEventListener('touchend',    onRelease, { passive: true });
    handle.addEventListener('touchcancel', () => {
      if (!dragging) return;
      dragging = false;
      panel.style.transform = '';
      panel.style.transition = '';
    }, { passive: true });
  }

  // ── Init ──────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    _initSwipe();
    _syncTab();
    _setStatus('idle', 'Inactivo');
  });

  // ── Public API ────────────────────────────────────────────────────
  window.copilotToggle           = copilotToggle;
  window.copilotHide             = _hide;
  window.copilotToggleListen     = copilotToggleListen;
  window.copilotToggleTranscript = copilotToggleTranscript;
  window.copilotGenerateSOAP     = copilotGenerateSOAP;
  window.copilotAddSuggestion    = copilotAddSuggestion;
  window.copilotDismiss          = copilotDismiss;
  window.copilotAddTranscriptLine = copilotAddTranscriptLine;
}());
