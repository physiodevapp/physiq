// lib/copilot.js — Copilot UI: panel, suggestion cards, transcript, Deepgram stream

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────
  let _open            = false;
  let _listening       = false;
  let _suggestions     = [];   // [{ id, type, text }]
  let _nextId          = 1;
  let _sessionData     = {};
  let _transcript      = [];   // [{ speaker, text }] — for SOAP
  let _wordBuf         = [];   // words since last /suggest flush
  let _lang            = localStorage.getItem('physiq-cop-lang') || 'es';
  let _micRms          = 0;

  // ── Audio / Deepgram state ─────────────────────────────────────────
  let _ws          = null;
  let _wsOpened    = false;
  let _audioCtx    = null;
  let _audioStream = null;
  let _workletNode = null;
  let _processor   = null;

  // ── DOM helpers ───────────────────────────────────────────────────
  const $  = id => document.getElementById(id);
  const PANEL   = () => $('copilot-panel');
  const OVERLAY = () => $('copilot-overlay');
  const COPBTN  = () => document.querySelector('.rw-cop-btn');

  // Set window.PHYSIQ_COPILOT_WORKER in index.html to point at the deployed worker
  const WORKER_URL = (window.PHYSIQ_COPILOT_WORKER || '').replace(/\/$/, '');
  // WebSocket URL: https → wss, http → ws
  const WORKER_WS  = WORKER_URL.replace(/^https?/, s => s === 'https' ? 'wss' : 'ws');

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
    _setStatus('listening', 'Conectando…');
    _syncListenBtn();
    _syncTab();
    $('copilot-soap-btn')?.setAttribute('hidden', '');
    $('copilot-mic-chip')?.removeAttribute('hidden');
    const dot = $('copilot-mic-dot');
    if (dot) dot.className = 'cop-mic-dot cop-mic-silence';
    $('copilot-lang-btn')?.setAttribute('disabled', '');
    _startStream();
  }

  function _stopListen() {
    _listening = false;
    _setStatus('stopped', 'Sesión finalizada');
    _syncListenBtn();
    _syncTab();
    $('copilot-soap-btn')?.removeAttribute('hidden');
    $('copilot-mic-chip')?.setAttribute('hidden', '');
    $('copilot-lang-btn')?.removeAttribute('disabled');
    _stopStream();
  }

  // ── Deepgram stream ───────────────────────────────────────────────
  async function _startStream() {
    if (!WORKER_URL) {
      _setStatus('stopped', 'Worker no configurado');
      _stopListen();
      return;
    }

    // Create AudioContext synchronously, before any await, so Chrome considers
    // it user-gesture-triggered and starts it in 'running' state on Android.
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    try {
      _audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    } catch {
      _audioCtx.close();
      _audioCtx = null;
      _setStatus('stopped', 'Sin acceso al micrófono');
      _stopListen();
      return;
    }

    if (_audioCtx.state === 'suspended') await _audioCtx.resume();
    const params = new URLSearchParams({ encoding: 'linear16', sample_rate: _audioCtx.sampleRate, channels: 1, language: _lang });

    // ── Build audio graph BEFORE opening the WebSocket ────────────────
    // Audio is already flowing when the WS handshake completes, so the first
    // PCM packet reaches Deepgram with no extra delay.
    const src = _audioCtx.createMediaStreamSource(_audioStream);

    const sendPCM = f32 => {
      if (_ws?.readyState !== WebSocket.OPEN) return;
      let sum = 0;
      for (let i = 0; i < f32.length; i++) sum += f32[i] * f32[i];
      _updateMicDot(Math.sqrt(sum / f32.length));
      const i16 = new Int16Array(f32.length);
      for (let i = 0; i < f32.length; i++) {
        i16[i] = Math.max(-32768, Math.min(32767, f32[i] * 32767));
      }
      _ws.send(i16.buffer);
    };

    let wired = false;
    if (_audioCtx.audioWorklet) {
      try {
        const code = `class P extends AudioWorkletProcessor{process(i){const c=i[0]?.[0];if(c)this.port.postMessage(c.slice());return true;}}registerProcessor('physiq-pcm',P);`;
        const blob = new Blob([code], { type: 'application/javascript' });
        const url  = URL.createObjectURL(blob);
        await _audioCtx.audioWorklet.addModule(url);
        URL.revokeObjectURL(url);
        _workletNode = new AudioWorkletNode(_audioCtx, 'physiq-pcm');
        _workletNode.port.onmessage = ({ data }) => sendPCM(data);
        src.connect(_workletNode);
        _workletNode.connect(_audioCtx.destination);
        wired = true;
      } catch (e) { console.warn('AudioWorklet failed, using ScriptProcessor:', e); }
    }
    if (!wired) {
      _processor = _audioCtx.createScriptProcessor(4096, 1, 1);
      _processor.onaudioprocess = e => sendPCM(e.inputBuffer.getChannelData(0));
      src.connect(_processor);
      _processor.connect(_audioCtx.destination);
    }

    // ── WebSocket — audio graph already running when this opens ───────
    _wsOpened = false;
    _ws = new WebSocket(`${WORKER_WS}/transcribe?${params}`);
    _ws.binaryType = 'arraybuffer';

    _ws.addEventListener('open', () => {
      _wsOpened = true;
      _setStatus('listening', 'Escuchando…');
    });

    _ws.addEventListener('message', e => {
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      _onDgMessage(msg);
    });

    _ws.addEventListener('close', e => {
      if (!_wsOpened) {
        _handleStreamError(e.code === 1006
          ? 'Sin respuesta del worker (403/502 o red)'
          : `Cerrado antes de abrir (${e.code})`);
      } else if (_listening) {
        _handleStreamError('Conexión interrumpida');
      } else {
        _cleanupAudio();
      }
    });
    _ws.addEventListener('error', () => {});
  }

  function _stopStream() {
    if (_ws) {
      if (_ws.readyState === WebSocket.OPEN) {
        try { _ws.send(JSON.stringify({ type: 'CloseStream' })); } catch {}
      }
      _ws.close();
      _ws = null;
    }
    if (_wordBuf.length) _flushSuggest();
    _cleanupAudio();
  }

  function _handleStreamError(msg) {
    _listening = false;
    _setStatus('stopped', msg);
    _syncListenBtn();
    _syncTab();
    $('copilot-mic-chip')?.setAttribute('hidden', '');
    $('copilot-lang-btn')?.removeAttribute('disabled');
    _cleanupAudio();
  }

  function _updateMicDot(rms) {
    _micRms = _micRms * 0.72 + rms * 0.28;
    const dot = $('copilot-mic-dot');
    if (!dot) return;
    if (_micRms < 0.01)      dot.className = 'cop-mic-dot cop-mic-silence';
    else if (_micRms < 0.05) dot.className = 'cop-mic-dot cop-mic-low';
    else if (_micRms < 0.15) dot.className = 'cop-mic-dot cop-mic-medium';
    else                     dot.className = 'cop-mic-dot cop-mic-high';
  }

  function _cleanupAudio() {
    if (_workletNode) {
      _workletNode.port.onmessage = null;
      _workletNode.disconnect();
      _workletNode = null;
    }
    if (_processor) {
      _processor.onaudioprocess = null;
      _processor.disconnect();
      _processor = null;
    }
    if (_audioStream) {
      _audioStream.getTracks().forEach(t => t.stop());
      _audioStream = null;
    }
    if (_audioCtx && _audioCtx.state !== 'closed') {
      _audioCtx.close();
      _audioCtx = null;
    }
  }

  // ── Deepgram events ───────────────────────────────────────────────
  function _onDgMessage(msg) {
    if (msg.type === 'Results') {
      const alt  = msg.channel?.alternatives?.[0];
      const text = (alt?.transcript || '').trim();
      if (!text) return;
      if (!msg.is_final) {
        _setStatus('listening', `◉ ${text.length > 50 ? text.slice(-50) : text}`);
        return;
      }
      _setStatus('listening', 'Escuchando…');
      _wordBuf.push(...text.split(/\s+/).filter(Boolean));

      // Group consecutive words by Deepgram speaker ID.
      // speaker 0 = first voice detected (assumed fisio); 1+ = paciente.
      const words = alt?.words;
      if (words?.length) {
        const segments = [];
        let cur = null;
        for (const w of words) {
          const spk = w.speaker === 0 ? 'fisio' : 'paciente';
          if (!cur || cur.speaker !== spk) { cur = { speaker: spk, parts: [] }; segments.push(cur); }
          cur.parts.push(w.punctuated_word ?? w.word);
        }
        for (const seg of segments) {
          const t = seg.parts.join(' ').trim();
          if (t) copilotAddTranscriptLine(seg.speaker, t);
        }
      } else {
        copilotAddTranscriptLine('fisio', text);
      }

      if (_wordBuf.length >= 25) _flushSuggest();
    } else if (msg.type === 'UtteranceEnd') {
      if (_wordBuf.length) _flushSuggest();
    }
  }

  async function _flushSuggest() {
    if (!_wordBuf.length || !WORKER_URL) return;
    const query = _wordBuf.join(' ');
    _wordBuf = [];
    try {
      const resp = await fetch(`${WORKER_URL}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          session: _sessionData,
          suggestions: _suggestions.map(s => ({ type: s.type, text: s.text })),
        }),
      });
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.skip) return;
      const { type, text } = data;
      if (type && text) copilotAddSuggestion(type, text);
    } catch { /* network failure — silent */ }
  }

  // ── Language toggle ───────────────────────────────────────────────
  function copilotToggleLang() {
    _lang = _lang === 'es' ? 'multi' : 'es';
    localStorage.setItem('physiq-cop-lang', _lang);
    const btn = $('copilot-lang-btn');
    if (btn) btn.textContent = _lang === 'es' ? 'ES' : 'Multi';
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
      `<p class="cop-card-text"></p>`;
    card.querySelector('.cop-card-text').textContent = text;

    container.insertBefore(card, container.firstChild);

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
    _transcript.push({ speaker, text });
    const container = $('copilot-transcript');
    if (!container) return;
    const line = document.createElement('div');
    line.className = 'cop-tx-line';
    line.innerHTML =
      `<span class="cop-tx-spk cop-tx-spk-${speaker === 'fisio' ? 'f' : 'p'}">` +
        (speaker === 'fisio' ? 'Fisio' : 'Pac.') +
      `</span>` +
      `<span class="cop-tx-text"></span>`;
    line.querySelector('.cop-tx-text').textContent = text;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }

  function copilotSwitchTab(tab) {
    const sugg  = $('copilot-suggestions');
    const txp   = $('cop-panel-transcript');
    const tSugg = $('cop-tab-suggestions');
    const tTx   = $('cop-tab-transcript');
    if (sugg)  sugg.hidden  = tab !== 'suggestions';
    if (txp)   txp.hidden   = tab !== 'transcript';
    if (tSugg) tSugg.classList.toggle('cop-tab-active', tab === 'suggestions');
    if (tTx)   tTx.classList.toggle('cop-tab-active',   tab === 'transcript');
  }

  // ── SOAP generation ───────────────────────────────────────────────
  function copilotGenerateSOAP() {
    if (!WORKER_URL) {
      copilotAddSuggestion('test', 'Configura window.PHYSIQ_COPILOT_WORKER en index.html');
      return;
    }
    const btn = $('copilot-soap-btn');
    if (btn) btn.setAttribute('disabled', '');

    fetch(`${WORKER_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: _transcript, session: _sessionData }),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ soap }) => { if (soap) copilotAddSuggestion('test', soap); })
      .catch(() => copilotAddSuggestion('test', 'Error generando nota SOAP'))
      .finally(() => { if (btn) btn.removeAttribute('disabled'); });
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
    const panel = PANEL();
    if (!panel) return;

    let startY = 0, startTime = 0, dragging = false, delta = 0;
    const EASE = 'transform 0.3s cubic-bezier(0.32,0.72,0,1)';

    panel.addEventListener('touchstart', e => {
      if (e.touches[0].clientY - panel.getBoundingClientRect().top > 72) return;
      startY    = e.touches[0].clientY;
      startTime = Date.now();
      delta = 0; dragging = true;
      panel.style.transition = 'none';
    }, { passive: true });

    panel.addEventListener('touchmove', e => {
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

    panel.addEventListener('touchend',    onRelease, { passive: true });
    panel.addEventListener('touchcancel', () => {
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
    const langBtn = $('copilot-lang-btn');
    if (langBtn) langBtn.textContent = _lang === 'es' ? 'ES' : 'Multi';
  });

  // ── Public API ────────────────────────────────────────────────────
  window.copilotToggle            = copilotToggle;
  window.copilotHide              = _hide;
  window.copilotToggleListen      = copilotToggleListen;
  window.copilotToggleLang        = copilotToggleLang;
  window.copilotSwitchTab         = copilotSwitchTab;
  window.copilotGenerateSOAP      = copilotGenerateSOAP;
  window.copilotAddSuggestion     = copilotAddSuggestion;
  window.copilotDismiss           = copilotDismiss;
  window.copilotAddTranscriptLine = copilotAddTranscriptLine;
}());
