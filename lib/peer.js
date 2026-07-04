'use strict';

// ── WebRTC peer bridge ────────────────────────────────────────────────────────
// Offerer = tablet: creates the offer, receives ROM data
// Answerer = mobile: processes the offer, sends ROM data
//
// No STUN needed: both devices are on the same LAN (home WiFi or phone hotspot).
// If used on different subnets, add a STUN server to _PEER_ICE.

const _PEER_ICE     = { iceServers: [] };
const _peerSessCh   = new BroadcastChannel('physiq-session');

const peer = {
  conn:   null,    // RTCPeerConnection
  dc:     null,    // RTCDataChannel
  role:   null,    // 'offerer' | 'answerer'
  status: 'idle',  // 'idle'|'offering'|'answering'|'connected'|'closed'
};

// ── Audio streaming state ─────────────────────────────────────────────────────
let _peerRemoteStream        = null;  // remote audio stream received by primary
let _peerRemoteStreamResolve = null;  // pending promise resolver for ontrack
let _peerAudioSender         = null;  // RTCRtpSender for secondary's outgoing audio
let _peerAudioMicStream      = null;  // local mic MediaStream on secondary

// ── IDB session write (v3, compatible with satellites) ────────────────────────
function _peerOpenDB() {
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

async function _peerWriteSession(patch) {
  const db = await _peerOpenDB();
  return new Promise((res, rej) => {
    const tx    = db.transaction('session', 'readwrite');
    const store = tx.objectStore('session');
    const get   = store.get('active');
    get.onsuccess = () => {
      const now  = Date.now();
      const cur  = get.result;
      const base = (cur && (now - (cur.updatedAt || 0) < 86400000))
        ? cur
        : { sessionId: now, date: new Date().toLocaleDateString('es-ES'), createdAt: now };
      store.put({ ...base, ...patch, updatedAt: now }, 'active');
    };
    tx.oncomplete = () => { db.close(); res(); };
    tx.onerror    = e  => { db.close(); rej(e.target.error); };
  });
}

async function _peerClearSession() {
  const db = await _peerOpenDB();
  return new Promise((res, rej) => {
    const tx = db.transaction('session', 'readwrite');
    tx.objectStore('session').delete('active');
    tx.oncomplete = () => { db.close(); res(); };
    tx.onerror    = e  => { db.close(); rej(e.target.error); };
  });
}

// ── Conflict state ────────────────────────────────────────────────────────────
let _peerConflictLocal  = null;
let _peerConflictRemote = null;

// ── Initial sync on connect ───────────────────────────────────────────────────
async function _peerSyncOnConnect() {
  let session = null;
  try {
    const db = await _peerOpenDB();
    session = await new Promise((res, rej) => {
      const tx  = db.transaction('session', 'readonly');
      const req = tx.objectStore('session').get('active');
      req.onsuccess = () => { db.close(); res(req.result ?? null); };
      req.onerror   = e  => { db.close(); rej(e.target.error); };
    });
  } catch { return; }
  if (!session) return;
  if (!peer.dc || peer.dc.readyState !== 'open') return;
  try {
    peer.dc.send(JSON.stringify({
      type:            'SESSION_SYNC',
      patient:         session.patient         ?? '',
      date:            session.date            ?? '',
      diagnosis:       session.diagnosis       ?? null,
      manualRegion:    session.manualRegion    ?? null,
      rom:             session.rom             ?? null,
      assessmentState: session.assessmentState ?? null,
      force:           session.force           ?? null,
      updatedAt:       session.updatedAt       ?? 0,
    }));
  } catch (_) {}
}

async function _peerApplySync(msg) {
  let cur = null;
  try {
    const db = await _peerOpenDB();
    cur = await new Promise((res, rej) => {
      const tx  = db.transaction('session', 'readonly');
      const req = tx.objectStore('session').get('active');
      req.onsuccess = () => { db.close(); res(req.result ?? null); };
      req.onerror   = e  => { db.close(); rej(e.target.error); };
    });
  } catch { return; }

  const remoteHasData = !!(msg.patient || msg.rom || msg.assessmentState || (Array.isArray(msg.force) && msg.force.length));
  if (!remoteHasData) return;

  const localHasData = !!(cur && (cur.patient || cur.rom || cur.assessmentState || (Array.isArray(cur.force) && cur.force.length)));
  if (!localHasData) {
    await _peerApplySyncForce(msg);
    return;
  }

  // Both sides have data → show conflict UI instead of silently overwriting
  _peerConflictLocal  = cur;
  _peerConflictRemote = msg;
  if (typeof peerShowConflict === 'function') peerShowConflict(cur, msg);
}

async function _peerApplySyncForce(session) {
  await _peerWriteSession({
    patient:         session.patient         ?? '',
    date:            session.date            ?? '',
    diagnosis:       session.diagnosis       ?? null,
    manualRegion:    session.manualRegion    ?? null,
    rom:             session.rom             ?? null,
    assessmentState: session.assessmentState ?? null,
    force:           session.force           ?? null,
    kinematics:      session.kinematics      ?? null,
  });
  _peerSessCh.postMessage({ type: 'SESSION_PATIENT', patient: session.patient ?? '', _relay: true });
  _peerSessCh.postMessage({ type: 'SESSION_ROM',     rom:     session.rom     ?? null, _relay: true });
  if (Array.isArray(session.force)) {
    _peerSessCh.postMessage({ type: 'SESSION_FORCE', force: session.force, _relay: true });
  }
  if (session.assessmentState) {
    _peerSessCh.postMessage({ type: 'SESSION_ASSESSMENT_STATE', assessmentState: session.assessmentState, _relay: true });
  }
  if (session.kinematics) {
    _peerSessCh.postMessage({ type: 'SESSION_KINEMATICS', kinematics: session.kinematics, _relay: true });
  }
  _peerSessCh.postMessage({
    type: 'SESSION_REPORT_FIELDS',
    patient:      session.patient      ?? '',
    date:         session.date         ?? '',
    diagnosis:    session.diagnosis    ?? null,
    manualRegion: session.manualRegion ?? null,
    _relay: true,
  });
}

// Keep local data, tell remote to adopt it
async function peerResolveConflictLocal() {
  const local = _peerConflictLocal;
  _peerConflictLocal = _peerConflictRemote = null;
  if (typeof peerDismissConflict === 'function') peerDismissConflict();
  if (!local || !peer.dc || peer.dc.readyState !== 'open') return;
  try {
    peer.dc.send(JSON.stringify({
      type:            'SESSION_SYNC_RESOLVE',
      patient:         local.patient         ?? '',
      rom:             local.rom             ?? null,
      assessmentState: local.assessmentState ?? null,
    }));
  } catch (_) {}
}

// Adopt remote data, tell remote to keep it too
async function peerResolveConflictRemote() {
  const remote = _peerConflictRemote;
  _peerConflictLocal = _peerConflictRemote = null;
  if (typeof peerDismissConflict === 'function') peerDismissConflict();
  if (!remote) return;
  await _peerApplySyncForce(remote);
  if (peer.dc && peer.dc.readyState === 'open') {
    try {
      peer.dc.send(JSON.stringify({
        type:            'SESSION_SYNC_RESOLVE',
        patient:         remote.patient         ?? '',
        rom:             remote.rom             ?? null,
        assessmentState: remote.assessmentState ?? null,
      }));
    } catch (_) {}
  }
}

// ── DataChannel → local (both sides) ─────────────────────────────────────────
// Re-broadcasts with _relay:true so _onLocalSess doesn't echo it back.

// Dispatch map for messages that write to IDB and broadcast to _peerSessCh.
const _peerIDBHandlers = {
  SESSION_ROM:              msg => _peerWriteSession({ rom:             msg.rom             ?? null }),
  SESSION_PATIENT:          msg => _peerWriteSession({ patient:         msg.patient         ?? ''   }),
  SESSION_ASSESSMENT_STATE: msg => _peerWriteSession({ assessmentState: msg.assessmentState ?? null }),
  SESSION_ASSESSMENT:       msg => _peerWriteSession({ assessment:      msg.assessment      ?? null }),
  SESSION_FORCE:            msg => _peerWriteSession({ force:           msg.force           ?? null }),
  SESSION_KINEMATICS:       msg => _peerWriteSession({ kinematics:      msg.kinematics      ?? null }),
  SESSION_CLEAR:            ()  => _peerClearSession(),
  SESSION_REPORT_FIELDS:    msg => _peerWriteSession({
    patient:      msg.patient      ?? '',
    date:         msg.date         ?? '',
    diagnosis:    msg.diagnosis    ?? null,
    manualRegion: msg.manualRegion ?? null,
  }),
};

function _onPeerData(raw) {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }

  if (msg.type === 'SESSION_SYNC') {
    _peerApplySync(msg).catch(console.warn);
    return;
  }
  if (msg.type === 'SESSION_SYNC_RESOLVE') {
    _peerConflictLocal = _peerConflictRemote = null;
    if (typeof peerDismissConflict === 'function') peerDismissConflict();
    _peerApplySyncForce(msg).catch(console.warn);
    return;
  }

  _peerSessCh.postMessage({ ...msg, _relay: true });

  const idbHandler = _peerIDBHandlers[msg.type];
  if (idbHandler) { idbHandler(msg).catch(console.warn); return; }

  if (msg.type === 'PEER_DISCONNECT') {
    peerClose();
    if (typeof peerUpdateUI === 'function') peerUpdateUI('closed');
  } else if (msg.type === 'REC_CMD') {
    if (typeof recHandlePeerCmd === 'function') recHandlePeerCmd(msg.cmd);
  } else if (msg.type === 'RECORDER_STATE') {
    if (typeof recApplyRemoteState === 'function') recApplyRemoteState(msg.state, msg.duration);
  } else if (msg.type === 'REC_START_STREAM') {
    _peerStartAudioStream().catch(console.warn);
  } else if (msg.type === 'REC_STOP_STREAM') {
    _peerStopAudioStream();
  } else if (msg.type === 'RENEGO_OFFER') {
    _peerHandleRenegoOffer(msg.sdp).catch(console.warn);
  } else if (msg.type === 'RENEGO_ANSWER') {
    peer.conn?.setRemoteDescription({ type: 'answer', sdp: msg.sdp }).catch(console.warn);
  }
}

// ── local → DataChannel (both sides) ─────────────────────────────────────────
// Skip messages that arrived from the remote (_relay:true) to prevent loops.
function _onLocalSess(e) {
  if (e.data._relay) return;
  if (peer.status !== 'connected' || !peer.dc || peer.dc.readyState !== 'open') return;
  try { peer.dc.send(JSON.stringify(e.data)); } catch (_) {}
}

// ── ICE connection watchdog ───────────────────────────────────────────────────
// Calls peerOnICEFailed() (defined in index.html) when ICE fails or times out.
// Timeout covers the common case where devices are on different networks and
// ICE stays in 'checking' forever instead of reaching 'failed'.
let _iceWatchTimer       = null;
let _iceWatchAbort       = null;
let _peerDisconnectTimer = null;

function _watchICEConnection(conn) {
  clearTimeout(_iceWatchTimer);
  if (_iceWatchAbort) { _iceWatchAbort.abort(); }
  const ac = new AbortController();
  _iceWatchAbort = ac;

  _iceWatchTimer = setTimeout(() => {
    const s = conn.iceConnectionState;
    if (s !== 'connected' && s !== 'completed' && s !== 'closed') {
      if (typeof peerOnICEFailed === 'function') peerOnICEFailed();
    }
  }, 30000);

  conn.addEventListener('iceconnectionstatechange', () => {
    const s = conn.iceConnectionState;
    if (s === 'connected' || s === 'completed' || s === 'closed') {
      clearTimeout(_iceWatchTimer);
    } else if (s === 'failed') {
      clearTimeout(_iceWatchTimer);
      if (typeof peerOnICEFailed === 'function') peerOnICEFailed();
    }
  }, { signal: ac.signal });
}

// ── ICE gathering ─────────────────────────────────────────────────────────────
function _waitICE(conn) {
  return new Promise(res => {
    if (conn.iceGatheringState === 'complete') { res(); return; }
    const h = () => {
      if (conn.iceGatheringState === 'complete') {
        conn.removeEventListener('icegatheringstatechange', h);
        res();
      }
    };
    conn.addEventListener('icegatheringstatechange', h);
    setTimeout(res, 5000);  // proceed after 5s even if incomplete
  });
}

// ── DataChannel setup ─────────────────────────────────────────────────────────
function _setupDC(dc) {
  peer.dc = dc;
  dc.onopen = () => {
    peer.status = 'connected';
    peerUpdateUI('connected');
    _peerSessCh.addEventListener('message', _onLocalSess);  // both roles relay
    _peerSyncOnConnect();  // send local session to remote on connect
    if (peer.role === 'answerer') {
      peer.conn.onnegotiationneeded = async () => {
        if (peer.dc?.readyState !== 'open') return;
        try {
          const offer = await peer.conn.createOffer();
          await peer.conn.setLocalDescription(offer);
          await _waitICE(peer.conn);
          peer.dc.send(JSON.stringify({ type: 'RENEGO_OFFER', sdp: _peerTrimSdp(peer.conn.localDescription.sdp) }));
        } catch (err) { console.warn('Renegotiation failed:', err); }
      };
    }
  };
  dc.onclose = () => {
    peer.status = 'closed';
    _peerSessCh.removeEventListener('message', _onLocalSess);
    peerUpdateUI('closed');
  };
  dc.onmessage = e => _onPeerData(e.data);
}

// ── Public API ────────────────────────────────────────────────────────────────

// Strip SDP down to what's needed for LAN: keep only real-IP UDP host candidates.
// Removes TCP, mDNS (.local) and reflexive/relay candidates — none are needed
// when both devices are on the same WiFi/hotspot network.
function _peerTrimSdp(sdp) {
  return sdp.split('\r\n').filter(line => {
    if (!line.startsWith('a=candidate:')) return true;
    return line.includes(' udp ') && line.includes(' host ') && !line.includes('.local ');
  }).join('\r\n');
}

async function peerOffer() {
  peerClose();
  peer.role   = 'offerer';
  peer.status = 'offering';
  const conn  = new RTCPeerConnection(_PEER_ICE);
  peer.conn   = conn;
  conn.ontrack = e => {
    _peerRemoteStream = e.streams[0] || new MediaStream([e.track]);
    e.track.onended = () => { _peerRemoteStream = null; };
    if (_peerRemoteStreamResolve) {
      _peerRemoteStreamResolve(_peerRemoteStream);
      _peerRemoteStreamResolve = null;
    }
  };
  _setupDC(conn.createDataChannel('physiq', { ordered: true }));
  await conn.setLocalDescription(await conn.createOffer());
  await _waitICE(conn);
  return _peerTrimSdp(conn.localDescription.sdp);
}

async function peerAnswer(offerSdp) {
  peerClose();
  peer.role   = 'answerer';
  peer.status = 'answering';
  const conn  = new RTCPeerConnection(_PEER_ICE);
  peer.conn   = conn;
  conn.ondatachannel = e => _setupDC(e.channel);
  await conn.setRemoteDescription({ type: 'offer', sdp: offerSdp });
  await conn.setLocalDescription(await conn.createAnswer());
  await _waitICE(conn);
  // ICE checking starts now (both descriptions set) — begin watchdog
  _watchICEConnection(conn);
  return _peerTrimSdp(conn.localDescription.sdp);
}

async function peerComplete(answerSdp) {
  if (!peer.conn || peer.role !== 'offerer') throw new Error('not in offering state');
  await peer.conn.setRemoteDescription({ type: 'answer', sdp: answerSdp });
  // ICE checking starts now — begin watchdog
  _watchICEConnection(peer.conn);
}

// ── Audio streaming ───────────────────────────────────────────────────────────

async function _peerStartAudioStream() {
  if (_peerAudioSender) return;
  if (!peer.conn) return;
  _peerAudioMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const track = _peerAudioMicStream.getAudioTracks()[0];
  _peerAudioSender = peer.conn.addTrack(track, _peerAudioMicStream);
}

function _peerStopAudioStream() {
  if (_peerAudioSender) {
    try { peer.conn?.removeTrack(_peerAudioSender); } catch (_) {}
    _peerAudioSender = null;
  }
  if (_peerAudioMicStream) {
    _peerAudioMicStream.getTracks().forEach(t => t.stop());
    _peerAudioMicStream = null;
  }
}

async function _peerHandleRenegoOffer(sdp) {
  if (!peer.conn || !peer.dc) return;
  await peer.conn.setRemoteDescription({ type: 'offer', sdp });
  const answer = await peer.conn.createAnswer();
  await peer.conn.setLocalDescription(answer);
  await _waitICE(peer.conn);
  peer.dc.send(JSON.stringify({ type: 'RENEGO_ANSWER', sdp: _peerTrimSdp(peer.conn.localDescription.sdp) }));
}

function peerRequestAudioStream() {
  if (_peerRemoteStream) return Promise.resolve(_peerRemoteStream);
  if (!peer.dc || peer.dc.readyState !== 'open') return Promise.reject(new Error('No DataChannel'));
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      _peerRemoteStreamResolve = null;
      reject(new Error('Remote audio stream timeout'));
    }, 15000);
    _peerRemoteStreamResolve = stream => { clearTimeout(timeout); resolve(stream); };
    try {
      peer.dc.send(JSON.stringify({ type: 'REC_START_STREAM' }));
    } catch (e) {
      clearTimeout(timeout);
      _peerRemoteStreamResolve = null;
      reject(e);
    }
  });
}

function peerStopAudioStream() {
  if (!peer.dc || peer.dc.readyState !== 'open') return;
  try { peer.dc.send(JSON.stringify({ type: 'REC_STOP_STREAM' })); } catch (_) {}
}

function peerSendRecCmd(cmd) {
  if (!peer.dc || peer.dc.readyState !== 'open') return;
  try { peer.dc.send(JSON.stringify({ type: 'REC_CMD', cmd })); } catch (_) {}
}

function peerSendRecState(state, duration, hasAudio) {
  if (!peer.dc || peer.dc.readyState !== 'open') return;
  try { peer.dc.send(JSON.stringify({ type: 'RECORDER_STATE', state, duration, hasAudio })); } catch (_) {}
}

function peerDisconnect() {
  if (peer.dc && peer.dc.readyState === 'open') {
    try { peer.dc.send(JSON.stringify({ type: 'PEER_DISCONNECT' })); } catch (_) {}
    // Delay close so the message is flushed before the DataChannel tears down.
    // Without this, peerClose() drops the connection before the remote receives it.
    clearTimeout(_peerDisconnectTimer);
    _peerDisconnectTimer = setTimeout(peerClose, 300);
  } else {
    peerClose();
  }
}

function peerClose() {
  clearTimeout(_peerDisconnectTimer);
  _peerDisconnectTimer = null;
  clearTimeout(_iceWatchTimer);
  if (_iceWatchAbort) { _iceWatchAbort.abort(); _iceWatchAbort = null; }
  _peerSessCh.removeEventListener('message', _onLocalSess);
  if (_peerAudioMicStream) { _peerAudioMicStream.getTracks().forEach(t => t.stop()); _peerAudioMicStream = null; }
  _peerAudioSender         = null;
  _peerRemoteStream        = null;
  _peerRemoteStreamResolve = null;
  // Null callbacks before closing so dc.onclose doesn't fire peerUpdateUI('closed')
  // and accidentally schedule a second _peerRunOfferer while one is already running.
  if (peer.dc) {
    peer.dc.onopen    = null;
    peer.dc.onclose   = null;
    peer.dc.onmessage = null;
    try { peer.dc.close(); } catch (_) {}
  }
  try { peer.conn?.close(); } catch (_) {}
  peer.conn   = null;
  peer.dc     = null;
  peer.role   = null;
  peer.status = 'idle';
}

// ── SDP compact binary encoding ───────────────────────────────────────────────
// Instead of encoding the full SDP text (~1000 chars), we pack only the five
// fields needed to reconstruct it: ufrag, icePwd, fingerprint, DTLS role, candidates.
// Binary layout: [0x01][ufrag_len][ufrag][icePwd_len][icePwd][32 fp][1 role][1 ncand][6×cand]
// Typical size: ~76 bytes → 102 chars base64url → QR version 9 (53×53 modules).
// Falls back to deflate-compressed full SDP when no IPv4 host candidates exist.

function _sdpToBytes(sdp) {
  const get = k => (sdp.match(new RegExp(`(?:^|\\r\\n)a=${k}:([^\\r\\n]+)`))?.[1] ?? '').trim();
  const ufrag   = get('ice-ufrag');
  const icePwd  = get('ice-pwd');
  const fpLine  = get('fingerprint');
  const role    = get('setup');
  if (!ufrag || !icePwd || !fpLine || !role) return null;

  const fpHex  = fpLine.replace(/^sha-256 /i, '').replace(/:/g, '');
  const fp     = new Uint8Array(fpHex.match(/.{2}/g).map(b => parseInt(b, 16)));
  if (fp.length !== 32) return null;

  const cands = [];
  for (const m of sdp.matchAll(/a=candidate:[^\r\n]+ udp [^\r\n]+ (\d+\.\d+\.\d+\.\d+) (\d+) typ host/gi)) {
    if (!m[1].endsWith('.local')) cands.push({ ip: m[1], port: +m[2] });
  }
  if (!cands.length) return null;

  const ufragB  = new TextEncoder().encode(ufrag);
  const icePwdB = new TextEncoder().encode(icePwd);
  const roleB   = role === 'actpass' ? 0 : role === 'active' ? 1 : 2;

  const buf = new Uint8Array(1 + 1 + ufragB.length + 1 + icePwdB.length + 32 + 1 + 1 + cands.length * 6);
  let i = 0;
  buf[i++] = 0x01;  // format version
  buf[i++] = ufragB.length;  buf.set(ufragB,  i); i += ufragB.length;
  buf[i++] = icePwdB.length; buf.set(icePwdB, i); i += icePwdB.length;
  buf.set(fp, i); i += 32;
  buf[i++] = roleB;
  buf[i++] = cands.length;
  for (const { ip, port } of cands) {
    const p = ip.split('.').map(Number);
    buf[i++] = p[0]; buf[i++] = p[1]; buf[i++] = p[2]; buf[i++] = p[3];
    buf[i++] = (port >> 8) & 0xff; buf[i++] = port & 0xff;
  }
  return buf;
}

function _bytesToSdp(buf) {
  let i = 0;
  i++;  // skip version byte
  const ufragLen  = buf[i++]; const ufrag  = new TextDecoder().decode(buf.slice(i, i + ufragLen));  i += ufragLen;
  const icePwdLen = buf[i++]; const icePwd = new TextDecoder().decode(buf.slice(i, i + icePwdLen)); i += icePwdLen;
  const fp   = Array.from(buf.slice(i, i + 32), b => b.toString(16).padStart(2, '0')).join(':'); i += 32;
  const role = ['actpass', 'active', 'passive'][buf[i++]];
  const nc   = buf[i++];
  const cands = [];
  for (let k = 0; k < nc; k++) {
    const ip = `${buf[i]}.${buf[i+1]}.${buf[i+2]}.${buf[i+3]}`; i += 4;
    const port = (buf[i] << 8) | buf[i + 1]; i += 2;
    cands.push(`a=candidate:${k + 1} 1 udp ${2122260223 - k * 65536} ${ip} ${port} typ host generation 0`);
  }
  return [
    'v=0', 'o=- 0 2 IN IP4 127.0.0.1', 's=-', 't=0 0', 'a=group:BUNDLE 0',
    'm=application 9 UDP/DTLS/SCTP webrtc-datachannel', 'c=IN IP4 0.0.0.0',
    `a=ice-ufrag:${ufrag}`, `a=ice-pwd:${icePwd}`, 'a=ice-options:trickle',
    `a=fingerprint:sha-256 ${fp}`, `a=setup:${role}`, 'a=mid:0',
    'a=sctp-port:5000', 'a=max-message-size:262144',
    ...cands, '',
  ].join('\r\n');
}

function _b64uEncode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 8192)
    s += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function peerEncode(sdp) {
  // Try compact binary (needs at least one IPv4 host UDP candidate)
  const packed = _sdpToBytes(sdp);
  if (packed) return _b64uEncode(packed);

  // Fallback: deflate-compress the full SDP
  if (typeof CompressionStream !== 'undefined') {
    try {
      const cs = new CompressionStream('deflate-raw');
      const w  = cs.writable.getWriter();
      w.write(new TextEncoder().encode(sdp)); w.close();
      return _b64uEncode(new Uint8Array(await new Response(cs.readable).arrayBuffer()));
    } catch (_) {}
  }
  return btoa(sdp).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function peerDecode(enc) {
  const b64  = enc.replace(/-/g, '+').replace(/_/g, '/');
  const pad  = b64.length % 4 ? '='.repeat(4 - b64.length % 4) : '';
  const buf  = Uint8Array.from(atob(b64 + pad), c => c.charCodeAt(0));

  if (buf[0] === 0x01) return _bytesToSdp(buf);  // compact binary

  // Deflate-compressed SDP
  if (typeof DecompressionStream !== 'undefined') {
    try {
      const ds = new DecompressionStream('deflate-raw');
      const w  = ds.writable.getWriter();
      w.write(buf); w.close();
      return new TextDecoder().decode(await new Response(ds.readable).arrayBuffer());
    } catch (_) {}
  }
  return new TextDecoder().decode(buf);  // plain base64 SDP (oldest fallback)
}

// Auto-open peer panel after peer.js is fully loaded (avoids race with inline script)
if ((typeof _peerInitHash !== 'undefined' && _peerInitHash) ||
    (typeof _peerAnsHash  !== 'undefined' && _peerAnsHash))  showPeerPanel();
