'use strict';

// ── Recorder engine ───────────────────────────────────────────────────────────
const _ch = new BroadcastChannel('physiq-recorder');
let _mr = null, _stream = null, _chunks = [], _blob = null;
let _mimeType = '', _duration = 0, _timer = null;
let _discarding = false, _recState = 'idle';

_ch.onmessage = e => { if (e.data?.cmd) _handleCmd(e.data.cmd); };

function recCmd(cmd) { _handleCmd(cmd); }

async function _handleCmd(cmd) {
  switch (cmd) {
    case 'start':   await _start(); break;
    case 'pause':   _pause();       break;
    case 'resume':  _resume();      break;
    case 'stop':    _stop();        break;
    case 'discard': _discard();     break;
  }
}

async function _start() {
  if (_recState !== 'idle') return;
  try {
    _stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    _mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus' : 'audio/mp4';
    _mr = new MediaRecorder(_stream, { mimeType: _mimeType, audioBitsPerSecond: 32000 });
    _chunks = []; _duration = 0; _discarding = false;
    _mr.ondataavailable = e => { if (e.data.size) _chunks.push(e.data); };
    _mr.onstop = _onStop;
    _mr.start(1000);
    _startTimer();
    _setState('recording');
  } catch (err) {
    console.warn('Micrófono no disponible:', err);
    const w = document.getElementById('rec-widget');
    w.dataset.error = '1';
    setTimeout(() => delete w.dataset.error, 2500);
  }
}

function _startTimer() {
  clearInterval(_timer);
  _timer = setInterval(() => {
    _duration++;
    _setTimer(_duration);
    _broadcast();
  }, 1000);
}

function _pause() {
  if (_recState !== 'recording') return;
  _mr.pause();
  clearInterval(_timer);
  _setState('paused');
}

function _resume() {
  if (_recState !== 'paused') return;
  _mr.resume();
  _startTimer();
  _setState('recording');
}

function _stop() {
  if (_recState !== 'recording' && _recState !== 'paused') return;
  clearInterval(_timer);
  if (_mr && _mr.state !== 'inactive') _mr.stop();
}

function _onStop() {
  if (_discarding) { _discarding = false; return; }
  _blob = new Blob(_chunks, { type: _mimeType });
  if (_stream) { _stream.getTracks().forEach(t => t.stop()); _stream = null; }
  _mr = null;
  _saveToIDB();
  _setState('stopped');
}

function _discard() {
  clearInterval(_timer);
  if (_mr) {
    _discarding = true;
    if (_mr.state !== 'inactive') _mr.stop();
    _mr = null;
  }
  if (_stream) { _stream.getTracks().forEach(t => t.stop()); _stream = null; }
  _chunks = []; _blob = null; _duration = 0;
  _openIDB().then(db => {
    try {
      db.transaction('audio', 'readwrite').objectStore('audio').delete('pending');
    } catch (_) {}
    db.close();
  }).catch(() => {});
  hideDiscardConfirm();
  _setState('idle');
}

function _setState(s) {
  _recState = s;
  _broadcast();
  _updateWidget();
}

function _broadcast() {
  _ch.postMessage({ type: 'RECORDER_STATE', state: _recState, duration: _duration, hasAudio: !!_blob });
}

// ── IDB ──────────────────────────────────────────────────────────────────────
function _openIDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open('physiq', 3);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('audio'))   db.createObjectStore('audio');
      if (!db.objectStoreNames.contains('session')) db.createObjectStore('session');
    };
    req.onsuccess = e => res(e.target.result);
    req.onerror   = e => rej(e.target.error);
  });
}

async function _saveToIDB() {
  const ext = _mimeType.includes('mp4') ? 'mp4' : 'webm';
  const db  = await _openIDB();
  const tx  = db.transaction('audio', 'readwrite');
  tx.objectStore('audio').put(
    { blob: _blob, name: 'physiq-recording.' + ext, type: _mimeType, duration: _duration },
    'pending'
  );
  db.close();
}

// ── Widget UI ────────────────────────────────────────────────────────────────
function _setTimer(s) {
  document.querySelector('.rw-timer-mm').textContent = String(Math.floor(s / 60)).padStart(2, '0');
  document.querySelector('.rw-timer-ss').textContent = String(s % 60).padStart(2, '0');
}

function _updateWidget() {
  const w = document.getElementById('rec-widget');
  w.dataset.state = _recState;
  delete w.dataset.confirm;
  _setTimer(_duration);
}

function showDiscardConfirm() {
  document.getElementById('rec-widget').dataset.confirm = '1';
}

function hideDiscardConfirm() {
  delete document.getElementById('rec-widget').dataset.confirm;
}
