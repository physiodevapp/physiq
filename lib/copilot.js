// lib/copilot.js — Copilot UI: panel, suggestion cards, transcript, Deepgram stream

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────
  let _open            = false;
  let _listening         = false;
  let _unseenSuggestions = 0;
  let _suggestions       = [];   // [{ id, type, text }]
  let _nextId          = 1;
  let _sessionData     = {};
  let _transcript      = [];   // [{ speaker, text }] — for SOAP
  let _wordBuf         = [];   // words since last /suggest flush
  let _lang            = localStorage.getItem('physiq-cop-lang') || 'es';
  let _region          = localStorage.getItem('physiq-cop-region') || null;
  let _micRms          = 0;

  // ── Audio / Deepgram state ─────────────────────────────────────────
  let _ws          = null;
  let _wsOpened    = false;
  let _audioCtx    = null;
  let _audioStream = null;
  let _workletNode = null;
  let _processor   = null;
  // Stream intent: 'passive' feeds the transcript + /suggest engine;
  // 'dictation' pipes finals into the chat input box. Only one stream is ever
  // live at a time — starting dictation pauses the passive engine first.
  let _streamMode  = 'passive';
  let _dictating   = false;
  let _resumePassiveAfterDictation = false;

  // ── DOM helpers ───────────────────────────────────────────────────
  const $  = id => document.getElementById(id);
  const PANEL   = () => $('copilot-panel');
  const OVERLAY = () => $('copilot-overlay');
  const COPBTN  = () => document.querySelector('.rw-cop-btn');

  // Set window.PHYSIQ_COPILOT_WORKER in index.html to point at the deployed worker
  const WORKER_URL = (window.PHYSIQ_COPILOT_WORKER || '').replace(/\/$/, '');
  // WebSocket URL: https → wss, http → ws
  const WORKER_WS  = WORKER_URL.replace(/^https?/, s => s === 'https' ? 'wss' : 'ws');
  const _lk = () => localStorage.getItem('physiq-license-key') || '';

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
    if (_dictating) _stopDictation();
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
    // Route setup failures to the right teardown depending on the active intent.
    const _abort = () => { if (_streamMode === 'dictation') _finishDictation(); else _stopListen(); };

    if (!WORKER_URL) {
      _setStatus('stopped', 'Worker no configurado');
      _abort();
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
      _abort();
      return;
    }

    if (_audioCtx.state === 'suspended') await _audioCtx.resume();
    const params = new URLSearchParams({ encoding: 'linear16', sample_rate: _audioCtx.sampleRate, channels: 1, language: _lang });
    // Dictation is a single speaker talking to the assistant — no diarization needed.
    if (_streamMode === 'dictation') params.set('diarize', 'false');
    const _k = _lk(); if (_k) params.set('key', _k);

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
    const sock = new WebSocket(`${WORKER_WS}/transcribe?${params}`);
    sock.binaryType = 'arraybuffer';
    _ws = sock;
    // Intent captured at creation: a close event from a superseded socket
    // (e.g. passive torn down to hand the mic to dictation) must not act on
    // the stream that replaced it. Handlers below bail unless `sock` is current.
    const mode = _streamMode;

    sock.addEventListener('open', () => {
      if (_ws !== sock) return;
      _wsOpened = true;
      if (mode === 'dictation') _setDictateBtn('recording');
      else _setStatus('listening', 'Escuchando…');
    });

    sock.addEventListener('message', e => {
      if (_ws !== sock) return;
      let msg;
      try { msg = JSON.parse(e.data); } catch { return; }
      _onDgMessage(msg);
    });

    sock.addEventListener('close', e => {
      if (_ws !== sock) return;   // superseded socket — ignore its late close
      if (mode === 'dictation') {
        // Dictation close is always benign from the chat's point of view — the
        // input already holds whatever was transcribed. Just tear down and
        // restore the passive engine if it was running before.
        _finishDictation();
      } else if (!_wsOpened) {
        _handleStreamError(e.code === 1006
          ? 'Sin respuesta del worker (403/502 o red)'
          : `Cerrado antes de abrir (${e.code})`);
      } else if (_listening) {
        _handleStreamError('Conexión interrumpida');
      } else {
        _cleanupAudio();
      }
    });
    sock.addEventListener('error', () => {});
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
    // Dictation mode: append finals straight into the chat input, ignore
    // interims, and never touch the transcript / suggestion engine.
    if (_streamMode === 'dictation') {
      if (msg.type !== 'Results') return;
      const text = (msg.channel?.alternatives?.[0]?.transcript || '').trim();
      if (!text || !msg.is_final) return;
      _appendDictationText(text);
      return;
    }

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
      // Only flush on utterance end once enough words have accumulated. Very short
      // utterances ("sí", "¿aquí?") almost never yield an actionable suggestion and
      // the call would just cost an embedding + Claude round-trip to return skip.
      // Sub-threshold words stay buffered until they reach 25 or the session stops.
      if (_wordBuf.length >= 8) _flushSuggest();
    }
  }

  async function _flushSuggest() {
    if (!_wordBuf.length || !WORKER_URL) return;
    const query = _wordBuf.join(' ');
    _wordBuf = [];
    try {
      const _sk = _lk();
      const resp = await fetch(`${WORKER_URL}/suggest`, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, _sk ? { 'X-License-Key': _sk } : {}),
        body: JSON.stringify({
          query,
          session: _sessionData,
          suggestions: _suggestions.map(s => ({ type: s.type, text: s.text })),
        }),
      });
      if (resp.status === 401) { window._actRevoke?.(); return; }
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

  // ── Region filter ────────────────────────────────────────────────────
  function _copOpenDB() {
    return new Promise((res, rej) => {
      const req = indexedDB.open('physiq', 3);
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej();
    });
  }

  const REGION_LABELS = {
    lumbar: 'Lumbar', cervical: 'Cervical', shoulder: 'Hombro',
    knee: 'Rodilla', hip: 'Cadera', ankle: 'Tobillo',
  };

  // Region filter pill — shown on Sugerencias + Consultar when a region is active.
  // Transcripción has no pill (the region does not affect the transcript).
  function _syncRegionPill() {
    const label = _region ? (REGION_LABELS[_region] || _region) : '';
    document.querySelectorAll('.cop-region-pill').forEach(pill => {
      const val = pill.querySelector('.cop-region-pill-val');
      if (val) val.textContent = label;
      pill.hidden = !_region;
    });
  }

  function _renderRegionChips() {
    document.querySelectorAll('.cop-rgn-chip').forEach(chip => {
      const active = chip.dataset.region === _region;
      chip.classList.toggle('cop-rgn-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    _syncRegionTrigger();
    _syncRegionPill();
  }

  // Header trigger reflects the active region (name + accent) and doubles as the
  // open/close control for the collapsible chips popover.
  function _syncRegionTrigger() {
    const lbl = $('cop-rgn-trigger-lbl');
    const trg = $('cop-rgn-trigger');
    if (lbl) lbl.textContent = _region ? (REGION_LABELS[_region] || _region) : 'Región';
    if (trg) trg.classList.toggle('cop-rgn-trigger-on', !!_region);
  }

  function _setRegionMenuOpen(open) {
    const row = $('cop-region-row');
    const trg = $('cop-rgn-trigger');
    if (row) { row.classList.toggle('cop-rgn-open', open); row.inert = !open; }
    if (trg) {
      trg.setAttribute('aria-expanded', open ? 'true' : 'false');
      trg.classList.toggle('cop-rgn-trigger-open', open);
    }
  }

  function copilotToggleRegionMenu() {
    const row = $('cop-region-row');
    _setRegionMenuOpen(row ? !row.classList.contains('cop-rgn-open') : true);
  }

  async function copilotSetRegion(region) {
    _region = _region === region ? null : region;
    if (_region) localStorage.setItem('physiq-cop-region', _region);
    else         localStorage.removeItem('physiq-cop-region');
    _sessionData.manualRegion = _region;
    _renderRegionChips();
    _setRegionMenuOpen(false);   // collapse the popover after choosing

    try {
      const db = await _copOpenDB();
      const session = await new Promise((res) => {
        const tx    = db.transaction('session', 'readwrite');
        const store = tx.objectStore('session');
        const get   = store.get('active');
        get.onsuccess = () => {
          const cur = get.result;
          if (cur) store.put({ ...cur, manualRegion: _region ?? null, updatedAt: Date.now() });
          tx.oncomplete = () => { db.close(); res(cur ?? null); };
          tx.onerror    = () => { db.close(); res(null); };
        };
      });
      if (session) {
        const ch = new BroadcastChannel('physiq-session');
        ch.postMessage({
          type:         'SESSION_REPORT_FIELDS',
          patient:      session.patient   ?? '',
          date:         session.date      ?? '',
          diagnosis:    session.diagnosis ?? null,
          manualRegion: _region,
        });
        ch.close();
      }
    } catch (_) {}
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
    const btn      = COPBTN();
    if (!btn) return;
    btn.classList.toggle('cop-active', _open || _listening);
    const dot      = btn.querySelector('.rw-cop-dot');
    const badge    = btn.querySelector('.rw-cop-badge');
    const tabBadge = $('cop-tab-badge');
    if (dot) dot.hidden = !_listening;
    const n = _unseenSuggestions;
    if (badge)    { badge.textContent    = n > 9 ? '9+' : n; badge.hidden    = n === 0 || _open; }
    if (tabBadge) { tabBadge.textContent = n > 9 ? '9+' : n; tabBadge.hidden = n === 0; }
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
      `<div class="cop-card-trash-bg" aria-hidden="true">` +
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` +
          `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>` +
        `</svg>` +
      `</div>` +
      `<div class="cop-card-front">` +
        `<div class="cop-card-top">` +
          `<span class="cop-card-type">${meta.label}</span>` +
          `<button class="cop-card-x" onclick="copilotDismiss(${id})" aria-label="Descartar">` +
            `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>` +
          `</button>` +
        `</div>` +
        `<p class="cop-card-text"></p>` +
      `</div>`;
    card.querySelector('.cop-card-text').textContent = text;

    container.insertBefore(card, container.firstChild);

    card.style.opacity   = '0';
    card.style.transform = 'translateY(-6px)';
    requestAnimationFrame(() => {
      card.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
      card.style.opacity    = '1';
      card.style.transform  = 'translateY(0)';
    });

    _observeCard(card);
    _initCardSwipe(card);
  }

  function copilotDismiss(id, fromSwipe = false) {
    const card = document.querySelector(`.cop-card[data-id="${id}"]`);
    if (card) {
      if (card._io) { card._io.disconnect(); card._io = null; _unseenSuggestions = Math.max(0, _unseenSuggestions - 1); }
      const front = card.querySelector('.cop-card-front');
      const h = card.offsetHeight;
      card.style.overflow  = 'hidden';
      card.style.maxHeight = h + 'px';
      if (!fromSwipe && front) {
        front.style.transition = 'opacity 0.18s, transform 0.18s';
        front.style.opacity    = '0';
        front.style.transform  = 'translateX(6px)';
      }
      setTimeout(() => {
        card.style.transition   = 'max-height 0.22s, margin-bottom 0.22s';
        card.style.maxHeight    = '0';
        card.style.marginBottom = '0';
      }, fromSwipe ? 0 : 40);
      setTimeout(() => {
        card.remove();
        _suggestions = _suggestions.filter(s => s.id !== id);
        const container = $('copilot-suggestions');
        const empty     = $('copilot-empty');
        if (empty && container && !container.querySelector('.cop-card')) empty.hidden = false;
        _syncTab();
      }, fromSwipe ? 220 : 260);
    } else {
      _suggestions = _suggestions.filter(s => s.id !== id);
      _syncTab();
    }
  }

  // ── Card visibility tracking ──────────────────────────────────────
  function _observeCard(card) {
    _unseenSuggestions++;
    _syncTab();
    const root = $('copilot-suggestions');
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        card._io = null;
        _unseenSuggestions = Math.max(0, _unseenSuggestions - 1);
        _syncTab();
      }
    }, { threshold: 0.5, root });
    io.observe(card);
    card._io = io;
  }

  // ── Card swipe-to-dismiss (mobile) ───────────────────────────────
  function _initCardSwipe(card) {
    const front = card.querySelector('.cop-card-front');
    if (!front) return;
    let startX = 0, startY = 0, dx = 0, axis = null, active = false;

    card.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dx = 0; axis = null; active = true;
      front.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      if (!active) return;
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      if (!axis) axis = Math.abs(cx - startX) > Math.abs(cy - startY) ? 'x' : 'y';
      if (axis !== 'x') return;
      dx = Math.min(0, cx - startX);
      front.style.transform = `translateX(${dx}px)`;
    }, { passive: true });

    const onRelease = () => {
      if (!active || axis !== 'x') { active = false; return; }
      active = false;
      if (dx < -(card.offsetWidth * 0.45)) {
        front.style.transition = 'transform 0.2s ease';
        front.style.transform  = 'translateX(-110%)';
        setTimeout(() => copilotDismiss(+card.dataset.id, true), 200);
      } else {
        front.style.transition = 'transform 0.25s ease';
        front.style.transform  = '';
      }
    };

    card.addEventListener('touchend',    onRelease, { passive: true });
    card.addEventListener('touchcancel', onRelease, { passive: true });
  }

  // ── Transcript ────────────────────────────────────────────────────
  // Diarization is a heuristic (Deepgram "speaker 0 = fisio") and can be wrong —
  // whole session inverted if the patient speaks first, or flipped after a
  // dictation pause reopens the stream. Since the fisio/paciente labels feed the
  // SOAP verbatim, both a per-line tap and a global invert let the user fix them.
  function _txLineNode(idx) {
    const { speaker } = _transcript[idx];
    const line = document.createElement('div');
    line.className = 'cop-tx-line';
    line.dataset.idx = idx;
    line.title = 'Tocar para cambiar el hablante';
    line.onclick = () => copilotToggleLineSpeaker(idx);
    line.innerHTML =
      `<span class="cop-tx-spk cop-tx-spk-${speaker === 'fisio' ? 'f' : 'p'}">` +
        (speaker === 'fisio' ? 'Fisio' : 'Pac.') +
      `</span>` +
      `<span class="cop-tx-text"></span>`;
    line.querySelector('.cop-tx-text').textContent = _transcript[idx].text;
    return line;
  }

  function copilotAddTranscriptLine(speaker, text) {
    _transcript.push({ speaker, text });
    const container = $('copilot-transcript');
    if (!container) return;
    container.appendChild(_txLineNode(_transcript.length - 1));
    container.scrollTop = container.scrollHeight;
    _syncTxTools();
  }

  function _renderTranscript() {
    const container = $('copilot-transcript');
    if (!container) return;
    container.textContent = '';
    _transcript.forEach((_, i) => container.appendChild(_txLineNode(i)));
    _syncTxTools();
  }

  function _applySpeaker(idx) {
    const l = _transcript[idx];
    const spk = $('copilot-transcript')?.querySelector(`.cop-tx-line[data-idx="${idx}"] .cop-tx-spk`);
    if (!l || !spk) return;
    spk.className   = `cop-tx-spk cop-tx-spk-${l.speaker === 'fisio' ? 'f' : 'p'}`;
    spk.textContent = l.speaker === 'fisio' ? 'Fisio' : 'Pac.';
  }

  // Tap a line to flip just that line — fixes a mid-session diarization flip.
  function copilotToggleLineSpeaker(idx) {
    const l = _transcript[idx];
    if (!l) return;
    l.speaker = l.speaker === 'fisio' ? 'paciente' : 'fisio';
    _applySpeaker(idx);
  }

  // Invert every line — fixes a whole session captured with roles reversed.
  function copilotSwapAllSpeakers() {
    if (!_transcript.length) return;
    for (const l of _transcript) l.speaker = l.speaker === 'fisio' ? 'paciente' : 'fisio';
    _renderTranscript();
  }

  function _syncTxTools() {
    const tools = $('cop-tx-tools');
    if (tools) tools.hidden = _transcript.length === 0;
  }

  function copilotSwitchTab(tab) {
    if (tab !== 'chat' && _dictating) _stopDictation();
    if (tab !== 'chat') copilotHistoryClose();   // don't leave the history view open behind another tab
    const sugg  = $('copilot-suggestions');
    const chat  = $('cop-panel-chat');
    const txp   = $('cop-panel-transcript');
    const tSugg = $('cop-tab-suggestions');
    const tChat = $('cop-tab-chat');
    const tTx   = $('cop-tab-transcript');
    if (sugg)  sugg.hidden  = tab !== 'suggestions';
    if (chat)  chat.hidden  = tab !== 'chat';
    if (txp)   txp.hidden   = tab !== 'transcript';
    if (tSugg) tSugg.classList.toggle('cop-tab-active', tab === 'suggestions');
    if (tChat) tChat.classList.toggle('cop-tab-active', tab === 'chat');
    if (tTx)   tTx.classList.toggle('cop-tab-active',   tab === 'transcript');
    // The footer drives the passive suggestion engine — irrelevant while chatting.
    const footer = document.querySelector('.cop-footer');
    if (footer) footer.hidden = tab === 'chat';
    // Auto-focus only with a fine pointer (mouse/trackpad). On touch devices this
    // would pop the on-screen keyboard every time the tab opens — let the user tap
    // the input when they actually want to type.
    if (tab === 'chat' && _finePointer())
      setTimeout(() => $('copilot-chat-input')?.focus(), 60);
  }

  // True on mouse/trackpad devices; false on touch (coarse pointer). Used to
  // avoid popping the mobile keyboard on tab switch.
  function _finePointer() {
    try { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; }
    catch { return false; }
  }

  // ── SOAP generation ───────────────────────────────────────────────
  function copilotGenerateSOAP() {
    if (!WORKER_URL) {
      copilotAddSuggestion('test', 'Configura window.PHYSIQ_COPILOT_WORKER en index.html');
      return;
    }
    const btn = $('copilot-soap-btn');
    if (btn) btn.setAttribute('disabled', '');

    const _nk = _lk();
    fetch(`${WORKER_URL}/notes`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, _nk ? { 'X-License-Key': _nk } : {}),
      body: JSON.stringify({ transcript: _transcript, session: _sessionData }),
    })
      .then(r => { if (r.status === 401) { window._actRevoke?.(); return null; } return r.ok ? r.json() : Promise.reject(); })
      .then(d => { if (d?.soap) copilotAddSuggestion('test', d.soap); })
      .catch(() => copilotAddSuggestion('test', 'Error generando nota SOAP'))
      .finally(() => { if (btn) btn.removeAttribute('disabled'); });
  }

  // ── Chat (conversational companion) ───────────────────────────────
  let _chatMessages = [];   // [{ role: 'user'|'assistant', text }]
  let _chatBusy     = false;
  let _chatConvId   = null;  // id of the conversation currently in the thread (null until first message)

  // Minimal, safe Markdown → HTML for assistant bubbles.
  // Everything is HTML-escaped first, so only the tags we emit can appear —
  // no user/model content can inject markup.
  function _mdEscape(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function _mdInline(s) {
    return s
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
      .replace(/(^|\s)_([^_\n]+)_(?=\s|$)/g, '$1<em>$2</em>');
  }

  function _mdToHtml(text) {
    const lines = _mdEscape(text).split('\n');
    let html = '', list = null, para = [];
    const flushPara = () => { if (para.length) { html += '<p>' + _mdInline(para.join(' ')) + '</p>'; para = []; } };
    const closeList = () => { if (list) { html += '</' + list + '>'; list = null; } };
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) { flushPara(); closeList(); continue; }
      const h = line.match(/^#{1,6}\s+(.*)$/);
      if (h) { flushPara(); closeList(); html += '<div class="cop-md-h">' + _mdInline(h[1]) + '</div>'; continue; }
      const ul = line.match(/^[-*]\s+(.*)$/);
      if (ul) { flushPara(); if (list !== 'ul') { closeList(); html += '<ul>'; list = 'ul'; } html += '<li>' + _mdInline(ul[1]) + '</li>'; continue; }
      const ol = line.match(/^\d+\.\s+(.*)$/);
      if (ol) { flushPara(); if (list !== 'ol') { closeList(); html += '<ol>'; list = 'ol'; } html += '<li>' + _mdInline(ol[1]) + '</li>'; continue; }
      closeList();
      para.push(line);
    }
    flushPara(); closeList();
    return html;
  }

  function copilotChatAutosize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 96) + 'px';
  }

  function copilotChatKey(e) {
    // Enter sends; Shift+Enter inserts a newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      copilotSendChat();
    }
  }

  function _appendChatBubble(role, text) {
    const empty = $('copilot-chat-empty');
    if (empty) empty.hidden = true;
    const msgs = $('copilot-chat-msgs');
    if (!msgs) return null;
    const bubble = document.createElement('div');
    bubble.className = `cop-chat-msg cop-chat-${role === 'user' ? 'user' : 'asst'}`;
    bubble.textContent = text;
    msgs.appendChild(bubble);
    msgs.scrollTop = msgs.scrollHeight;
    return bubble;
  }

  async function copilotSendChat() {
    if (_chatBusy) return;
    if (_dictating) _stopDictation();            // flush dictation into the input
    const input = $('copilot-chat-input');
    const text  = (input?.value || '').trim();
    if (!text) return;
    if (!WORKER_URL) { _appendChatBubble('assistant', 'Worker no configurado (window.PHYSIQ_COPILOT_WORKER).'); return; }

    if (!_chatConvId) _chatConvId = Date.now();  // first message opens a new conversation
    _chatMessages.push({ role: 'user', text });
    _appendChatBubble('user', text);
    if (input) { input.value = ''; input.style.height = 'auto'; }

    _chatBusy = true;
    const sendBtn = $('copilot-chat-send');
    const micBtn  = $('copilot-chat-mic');
    if (sendBtn) sendBtn.disabled = true;
    if (micBtn)  micBtn.disabled  = true;

    const bubble = _appendChatBubble('assistant', '');
    bubble?.classList.add('cop-chat-pending');
    let answer = '';

    try {
      const _ck = _lk();
      const resp = await fetch(`${WORKER_URL}/chat`, {
        method: 'POST',
        headers: Object.assign({ 'Content-Type': 'application/json' }, _ck ? { 'X-License-Key': _ck } : {}),
        body: JSON.stringify({
          messages:   _chatMessages,
          session:    _sessionData,
          transcript: _transcript,
          region:     _region,
        }),
      });

      if (resp.status === 401) {
        window._actRevoke?.();
        bubble?.classList.remove('cop-chat-pending');
        if (bubble) bubble.textContent = 'Licencia no válida.';
        return;
      }
      if (!resp.ok || !resp.body) {
        bubble?.classList.remove('cop-chat-pending');
        if (bubble) bubble.textContent = 'Error al obtener respuesta.';
        return;
      }

      const reader  = resp.body.getReader();
      const decoder = new TextDecoder();
      const msgs    = $('copilot-chat-msgs');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          let evt;
          try { evt = JSON.parse(payload); } catch { continue; }
          if (evt.text) {
            answer += evt.text;
            if (bubble) bubble.innerHTML = _mdToHtml(answer);
            if (msgs) msgs.scrollTop = msgs.scrollHeight;
          }
        }
      }

      bubble?.classList.remove('cop-chat-pending');
      if (!answer) { if (bubble) bubble.textContent = 'Sin respuesta.'; return; }
      _chatMessages.push({ role: 'assistant', text: answer });
      _histSave();   // persist the conversation (best-effort, independent of the patient session)
    } catch {
      bubble?.classList.remove('cop-chat-pending');
      if (bubble && !answer) bubble.textContent = 'Fallo de red.';
    } finally {
      _chatBusy = false;
      if (sendBtn) sendBtn.disabled = false;
      if (micBtn)  micBtn.disabled  = false;
    }
  }

  // ── Chat history ─────────────────────────────────────────────────
  // A standalone log of the physio's conversations with the Copilot, kept in its
  // OWN IndexedDB database (not the shared 'physiq' DB) so it survives across
  // patient sessions and never collides with the satellites' DB version.
  const HIST_DB    = 'physiq-copilot-history';
  const HIST_STORE = 'conversations';

  function _histOpenDB() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(HIST_DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(HIST_STORE)) {
          const st = db.createObjectStore(HIST_STORE, { keyPath: 'id' });
          st.createIndex('updatedAt', 'updatedAt');
        }
      };
      req.onsuccess = () => res(req.result);
      req.onerror   = () => rej(req.error);
    });
  }

  // Upsert the current thread. Title = first user message (trimmed). Best-effort:
  // a failed write must never break the chat.
  async function _histSave() {
    if (!_chatConvId || !_chatMessages.length) return;
    try {
      const db = await _histOpenDB();
      const firstUser = _chatMessages.find(m => m.role === 'user');
      const rec = {
        id:        _chatConvId,
        createdAt: _chatConvId,
        updatedAt: Date.now(),
        title:     (firstUser?.text || 'Consulta').trim().slice(0, 120),
        messages:  _chatMessages.map(m => ({ role: m.role, text: m.text })),
      };
      const tx = db.transaction(HIST_STORE, 'readwrite');
      tx.objectStore(HIST_STORE).put(rec);
      tx.oncomplete = () => db.close();
    } catch { /* history is best-effort */ }
  }

  async function _histGetAll() {
    try {
      const db = await _histOpenDB();
      return await new Promise(res => {
        const tx  = db.transaction(HIST_STORE, 'readonly');
        const req = tx.objectStore(HIST_STORE).getAll();
        req.onsuccess = () => { res(req.result || []); db.close(); };
        req.onerror   = () => { res([]);              db.close(); };
      });
    } catch { return []; }
  }

  async function _histGet(id) {
    try {
      const db = await _histOpenDB();
      return await new Promise(res => {
        const tx  = db.transaction(HIST_STORE, 'readonly');
        const req = tx.objectStore(HIST_STORE).get(id);
        req.onsuccess = () => { res(req.result || null); db.close(); };
        req.onerror   = () => { res(null);               db.close(); };
      });
    } catch { return null; }
  }

  async function _histDelete(id) {
    try {
      const db = await _histOpenDB();
      const tx = db.transaction(HIST_STORE, 'readwrite');
      tx.objectStore(HIST_STORE).delete(id);
      tx.oncomplete = () => db.close();
    } catch { /* ignore */ }
  }

  // Re-render the whole thread from _chatMessages (used when loading from history
  // or starting a new conversation). Assistant bubbles render Markdown.
  function _renderChatThread() {
    const msgs  = $('copilot-chat-msgs');
    const empty = $('copilot-chat-empty');
    if (!msgs) return;
    msgs.querySelectorAll('.cop-chat-msg').forEach(el => el.remove());
    if (!_chatMessages.length) { if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;
    for (const m of _chatMessages) {
      const bubble = document.createElement('div');
      bubble.className = `cop-chat-msg cop-chat-${m.role === 'user' ? 'user' : 'asst'}`;
      if (m.role === 'user') bubble.textContent = m.text;
      else                   bubble.innerHTML   = _mdToHtml(m.text);
      msgs.appendChild(bubble);
    }
    msgs.scrollTop = msgs.scrollHeight;
  }

  // Start a fresh conversation (does not delete the current one — it's already saved).
  function copilotChatNew() {
    if (_dictating) _stopDictation();
    _chatMessages = [];
    _chatConvId   = null;
    _renderChatThread();
    copilotHistoryClose();
    if (_finePointer()) setTimeout(() => $('copilot-chat-input')?.focus(), 60);
  }

  function copilotHistoryOpen() {
    if (_dictating) _stopDictation();
    _histRenderList();
    $('cop-panel-chat')?.classList.add('cop-hist-open');
  }

  function copilotHistoryClose() {
    $('cop-panel-chat')?.classList.remove('cop-hist-open');
  }

  async function _histRenderList() {
    const list  = $('cop-hist-list');
    const empty = $('cop-hist-empty');
    if (!list) return;
    const items = (await _histGetAll()).sort((a, b) => b.updatedAt - a.updatedAt);
    list.innerHTML = '';
    if (empty) empty.hidden = items.length > 0;
    for (const it of items) {
      const row = document.createElement('div');
      row.className = 'cop-hist-item';
      row.onclick   = () => copilotHistoryLoad(it.id);

      const meta = document.createElement('div');
      meta.className = 'cop-hist-item-meta';
      const title = document.createElement('div');
      title.className = 'cop-hist-item-title';
      title.textContent = it.title;
      const sub = document.createElement('div');
      sub.className = 'cop-hist-item-sub';
      const when  = new Date(it.updatedAt).toLocaleString('es-ES',
        { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      const nQ = (it.messages || []).filter(m => m.role === 'user').length;
      sub.textContent = `${when} · ${nQ} pregunta${nQ === 1 ? '' : 's'}`;
      meta.appendChild(title);
      meta.appendChild(sub);

      const del = document.createElement('button');
      del.className = 'cop-hist-del';
      del.setAttribute('aria-label', 'Eliminar conversación');
      del.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>';
      del.onclick = e => { e.stopPropagation(); copilotHistoryDelete(it.id); };

      row.appendChild(meta);
      row.appendChild(del);
      list.appendChild(row);
    }
  }

  async function copilotHistoryLoad(id) {
    const conv = await _histGet(id);
    if (!conv) return;
    _chatMessages = (conv.messages || []).map(m => ({ role: m.role, text: m.text }));
    _chatConvId   = conv.id;
    _renderChatThread();
    copilotHistoryClose();
  }

  async function copilotHistoryDelete(id) {
    await _histDelete(id);
    // If the open thread was the deleted one, reset to a fresh conversation.
    if (_chatConvId === id) { _chatMessages = []; _chatConvId = null; _renderChatThread(); }
    _histRenderList();
  }

  // ── Chat dictation (push-to-talk → chat input) ───────────────────
  // Reuses the Deepgram /transcribe pipeline. Mic access is exclusive: starting
  // dictation pauses the passive engine (if running) and resumes it on stop, so
  // only one Deepgram stream is ever live and the consultation transcript stays
  // clean of what the physio says *to* the assistant.
  function copilotChatDictate() {
    if (_dictating) { _stopDictation(); return; }
    if (_chatBusy) return;                       // don't fight a streaming reply
    if (!WORKER_URL) {
      _appendChatBubble('assistant', 'Worker no configurado (window.PHYSIQ_COPILOT_WORKER).');
      return;
    }

    // Pause the passive engine first — exclusive mic, resume afterwards.
    _resumePassiveAfterDictation = _listening;
    if (_listening) _stopListen();

    _dictating  = true;
    _streamMode = 'dictation';
    _setDictateBtn('connecting');
    _startStream();
  }

  function _stopDictation() {
    // Close synchronously and finish now — don't depend on the async close
    // event, which the superseded-socket guard would swallow once _ws is null.
    if (_ws) {
      if (_ws.readyState === WebSocket.OPEN) {
        try { _ws.send(JSON.stringify({ type: 'CloseStream' })); } catch {}
      }
      try { _ws.close(); } catch {}
    }
    _finishDictation();
  }

  // Cleanup + optional passive resume. Idempotent: sole owner of nulling _ws
  // once dictation ends, and a no-op if dictation is already finished.
  function _finishDictation() {
    if (!_dictating) { _cleanupAudio(); return; }
    _dictating  = false;
    _streamMode = 'passive';
    _ws         = null;
    _setDictateBtn('idle');
    _cleanupAudio();
    const input = $('copilot-chat-input');
    if (input) {
      copilotChatAutosize(input);
      // Don't refocus on touch — the whole point of dictation is to skip the
      // keyboard; popping it back up after dictating defeats that.
      if (_finePointer()) input.focus();
    }
    if (_resumePassiveAfterDictation) {
      _resumePassiveAfterDictation = false;
      _startListen();
    }
  }

  function _appendDictationText(text) {
    const input = $('copilot-chat-input');
    if (!input) return;
    const cur = input.value.trim();
    input.value = cur ? `${cur} ${text}` : text;
    copilotChatAutosize(input);
  }

  function _setDictateBtn(state) {
    const btn = $('copilot-chat-mic');
    if (!btn) return;
    btn.classList.toggle('cop-mic-on', state === 'recording' || state === 'connecting');
    btn.setAttribute('aria-pressed', state === 'idle' ? 'false' : 'true');
    btn.setAttribute('aria-label', state === 'idle' ? 'Dictar consulta' : 'Detener dictado');
  }

  // ── Session data from BroadcastChannel ───────────────────────────
  try {
    const ch = new BroadcastChannel('physiq-session');
    ch.onmessage = e => {
      const d = e.data;
      if (!d) return;

      if (d.type === 'SESSION_CLEAR') {
        _sessionData = {};
        return;
      }

      if (d.patient   !== undefined) _sessionData.patient   = d.patient;
      if (d.diagnosis !== undefined) _sessionData.diagnosis = d.diagnosis;
      if (d.rom       !== undefined) _sessionData.rom       = d.rom;

      if (d.manualRegion !== undefined) {
        _sessionData.manualRegion = d.manualRegion;
        const incoming = d.manualRegion || null;
        if (incoming !== _region) {
          _region = incoming;
          if (_region) localStorage.setItem('physiq-cop-region', _region);
          else         localStorage.removeItem('physiq-cop-region');
          _renderRegionChips();
        }
      }

      // Seed copilot region into a newly created patient session
      if (d.type === 'SESSION_PATIENT' && d.patient && _region && !_sessionData.manualRegion) {
        _sessionData.manualRegion = _region;
        setTimeout(async () => {
          try {
            const db = await _copOpenDB();
            const session = await new Promise((res) => {
              const tx    = db.transaction('session', 'readwrite');
              const store = tx.objectStore('session');
              const get   = store.get('active');
              get.onsuccess = () => {
                const cur = get.result;
                if (cur) store.put({ ...cur, manualRegion: _region, updatedAt: Date.now() });
                tx.oncomplete = () => { db.close(); res(cur ?? null); };
                tx.onerror    = () => { db.close(); res(null); };
              };
            });
            if (session) {
              const bch = new BroadcastChannel('physiq-session');
              bch.postMessage({
                type:         'SESSION_REPORT_FIELDS',
                patient:      session.patient   ?? '',
                date:         session.date      ?? '',
                diagnosis:    session.diagnosis ?? null,
                manualRegion: _region,
              });
              bch.close();
            }
          } catch (_) {}
        }, 100);
      }
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

    // Close the region popover on any click outside it (or its trigger).
    document.addEventListener('click', e => {
      const row = $('cop-region-row');
      if (!row || !row.classList.contains('cop-rgn-open')) return;
      if (row.contains(e.target) || $('cop-rgn-trigger')?.contains(e.target)) return;
      _setRegionMenuOpen(false);
    });

    // Restore session state from IDB (IDB wins over localStorage if session is active)
    try {
      const req = indexedDB.open('physiq', 3);
      req.onsuccess = () => {
        const db  = req.result;
        const tx  = db.transaction('session', 'readonly');
        const get = tx.objectStore('session').get('active');
        get.onsuccess = () => {
          db.close();
          const s = get.result;
          if (s) {
            if (s.patient)    _sessionData.patient    = s.patient;
            if (s.diagnosis)  _sessionData.diagnosis  = s.diagnosis;
            if (s.rom)        _sessionData.rom        = s.rom;
            if (s.manualRegion) {
              _region = s.manualRegion;
              _sessionData.manualRegion = _region;
              localStorage.setItem('physiq-cop-region', _region);
            }
          }
          _renderRegionChips();
        };
        get.onerror = () => { db.close(); _renderRegionChips(); };
      };
      req.onerror = () => _renderRegionChips();
    } catch (_) {
      _renderRegionChips();
    }
  });

  // ── Public API ────────────────────────────────────────────────────
  window.copilotToggle            = copilotToggle;
  window.copilotHide              = _hide;
  window.copilotToggleListen      = copilotToggleListen;
  window.copilotToggleLang        = copilotToggleLang;
  window.copilotSetRegion         = copilotSetRegion;
  window.copilotToggleRegionMenu  = copilotToggleRegionMenu;
  window.copilotSwitchTab         = copilotSwitchTab;
  window.copilotSendChat          = copilotSendChat;
  window.copilotChatNew           = copilotChatNew;
  window.copilotHistoryOpen       = copilotHistoryOpen;
  window.copilotHistoryClose      = copilotHistoryClose;
  window.copilotHistoryLoad       = copilotHistoryLoad;
  window.copilotHistoryDelete     = copilotHistoryDelete;
  window.copilotChatDictate       = copilotChatDictate;
  window.copilotChatKey           = copilotChatKey;
  window.copilotChatAutosize      = copilotChatAutosize;
  window.copilotGenerateSOAP      = copilotGenerateSOAP;
  window.copilotAddSuggestion     = copilotAddSuggestion;
  window.copilotDismiss           = copilotDismiss;
  window.copilotAddTranscriptLine = copilotAddTranscriptLine;
  window.copilotSwapAllSpeakers    = copilotSwapAllSpeakers;
  window.copilotToggleLineSpeaker  = copilotToggleLineSpeaker;
}());
