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

// ── Message relay (tablet/offerer side) ───────────────────────────────────────
function _onPeerData(raw) {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }

  _peerSessCh.postMessage(msg);  // relay to local satellite iframes

  if (msg.type === 'SESSION_ROM') {
    _peerWriteSession({ rom: msg.rom ?? null }).catch(console.warn);
  } else if (msg.type === 'SESSION_PATIENT') {
    _peerWriteSession({ patient: msg.patient ?? '' }).catch(console.warn);
  } else if (msg.type === 'SESSION_CLEAR') {
    _peerClearSession().catch(console.warn);
  }
}

// ── BroadcastChannel relay (mobile/answerer side) ─────────────────────────────
function _onLocalSess(e) {
  if (peer.status !== 'connected' || !peer.dc || peer.dc.readyState !== 'open') return;
  try { peer.dc.send(JSON.stringify(e.data)); } catch (_) {}
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
    if (peer.role === 'answerer') _peerSessCh.addEventListener('message', _onLocalSess);
  };
  dc.onclose = () => {
    peer.status = 'closed';
    _peerSessCh.removeEventListener('message', _onLocalSess);
    peerUpdateUI('closed');
  };
  dc.onmessage = e => _onPeerData(e.data);
}

// ── Public API ────────────────────────────────────────────────────────────────

async function peerOffer() {
  peerClose();
  peer.role   = 'offerer';
  peer.status = 'offering';
  const conn  = new RTCPeerConnection(_PEER_ICE);
  peer.conn   = conn;
  _setupDC(conn.createDataChannel('physiq', { ordered: true }));
  await conn.setLocalDescription(await conn.createOffer());
  await _waitICE(conn);
  return conn.localDescription.sdp;
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
  return conn.localDescription.sdp;
}

async function peerComplete(answerSdp) {
  if (!peer.conn || peer.role !== 'offerer') throw new Error('not in offering state');
  await peer.conn.setRemoteDescription({ type: 'answer', sdp: answerSdp });
}

function peerClose() {
  _peerSessCh.removeEventListener('message', _onLocalSess);
  try { peer.dc?.close();   } catch (_) {}
  try { peer.conn?.close(); } catch (_) {}
  peer.conn   = null;
  peer.dc     = null;
  peer.role   = null;
  peer.status = 'idle';
}

// ── SDP encoding (URL-safe base64, no padding) ────────────────────────────────
function peerEncode(sdp) {
  return btoa(sdp).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function peerDecode(enc) {
  const b64 = enc.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? '='.repeat(4 - b64.length % 4) : '';
  return atob(b64 + pad);
}
