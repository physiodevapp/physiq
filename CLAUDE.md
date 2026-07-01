# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**PhysiQ** is the hub PWA that groups all PhysiQ satellite apps under a single installable entry point. It is a static site served via GitHub Pages at `physiodevapp.github.io/physiq/`.

The hub itself has no application logic. Its job is to:
1. Be the single installable PWA for the PhysiQ ecosystem (scope `/physiq/`)
2. Provide a navigation shell linking to each satellite
3. Host the satellite files once the CD pipeline copies them here

## Architecture

```
physiq/
├── index.html          — hub shell (navigation to satellites)
├── manifest.json       — PWA manifest (scope: /physiq/, start_url: /physiq/)
├── sw.js               — hub Service Worker (cache-on-visit, hub shell only)
├── icons/              — PWA icons (icon-192.png, icon-512.png)
├── lib/
│   ├── peer.js         — WebRTC peer bridge (tablet ↔ mobile)
│   └── recorder.js     — RecorderEngine (audio recording)
├── motion/             — physiq-motion files, copied by CD pipeline
├── assessment/         — physiq-assessment files, copied by CD pipeline
├── report/             — physiq-report files, copied by CD pipeline
├── force/              — physiq-force files, copied by CD pipeline
├── balance/            — physiq-balance files, copied by CD pipeline
└── wiki/               — physiq-wiki files, copied by CD pipeline
```

No build step. No framework. No npm. The hub files are plain HTML/CSS/JS.

## Service Worker strategy

The hub SW (`sw.js`) uses cache-on-visit:
- Pre-caches only hub shell files on install (`/physiq/`, `index.html`, `manifest.json`, icons)
- Does not intercept satellite routes — satellite SWs handle their own scope
- Two SWs coexist without conflict: hub SW (scope `/physiq/`) and each satellite SW (scope `/physiq/<name>/`). The satellite scope is more specific and takes precedence for its own routes.

To update the hub cache, bump `CACHE_NAME` in `sw.js` (e.g. `physiq-hub-v1` → `physiq-hub-v2`). The activate handler cleans up the old cache automatically.

## CD pipeline

Each satellite repo has a GitHub Actions workflow that clones this repo, copies its files into the corresponding subdirectory, and pushes. This repo is passive — it only needs GitHub Pages enabled on `main`.

The pipeline requires a PAT with `repo` scope stored as `PHYSIQ_DEPLOY_TOKEN` in each satellite repo's secrets.

**⚠️ Never edit files inside any satellite subdirectory directly in this repo.** Every subdirectory that maps to a satellite (currently `motion/`, `assessment/`, `report/`, `force/`, `balance/`, `wiki/` — and any future ones) is fully overwritten on every push from the corresponding satellite repo. Any direct edits will be lost. All satellite app changes must be made in the respective satellite repo and will arrive here via the CD pipeline. This rule applies to all current and future satellites.

## Satellite repos

| Repo | Deployed at | Role |
|------|-------------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-assessment | /physiq/assessment/ | Clinical assessment |
| physiq-report | /physiq/report/ | AI-assisted clinical reports |
| physiq-force | /physiq/force/ | Dynamometer force measurement |
| physiq-balance | /physiq/balance/ | Balance / posturography |
| physiq-wiki | /physiq/wiki/ | Clinical reference wiki |

Satellite iframes declared in `index.html` with their required permissions:

```html
<iframe id="sat-motion"     allow="microphone">
<iframe id="sat-assessment" allow="microphone">
<iframe id="sat-report"     allow="microphone">
<iframe id="sat-force"      allow="bluetooth">
<iframe id="sat-balance"    allow="accelerometer; gyroscope">
<iframe id="sat-wiki">
```

All non-wiki satellites are pre-loaded into their iframes at startup (via `requestIdleCallback` / `setTimeout`) so that `BroadcastChannel` listeners are active from the moment the hub opens. Wiki is loaded on demand.

## Recorder engine (`lib/recorder.js`)

The hub contains a `RecorderEngine` — the only audio recording component in the ecosystem. Satellites have no microphone access of their own.

**BroadcastChannel `physiq-recorder`** — the hub both listens (for commands from satellites) and emits (state updates):

| Direction | Message | Meaning |
|-----------|---------|---------|
| satellite → hub | `{ cmd: 'start' \| 'pause' \| 'resume' \| 'stop' \| 'discard' }` | Control the recorder |
| hub → all | `{ type: 'RECORDER_STATE', state, duration, hasAudio }` | State broadcast (every second while recording, and on every state change) |

`state` values: `'idle'` → `'recording'` → `'paused'` → `'stopped'` → `'idle'` (after discard or new start).

`hasAudio: true` means a blob is ready in IDB (set when `stopped`; cleared on `discard`).

### Recording modes (peer-connected only)

When the peer bridge is connected, the hub supports three recording modes stored in `localStorage['physiq-rec-mode']`:

| Mode | Behaviour |
|------|-----------|
| `'stereo'` (default) | Mixes tablet mic (left) + mobile mic (right) via `AudioContext` |
| `'local'` | Records only the tablet microphone |
| `'remote'` | Records only the mobile microphone (streamed over WebRTC) |

The mode selector is shown in the peer panel (slide 3) when connected. On the secondary (mobile) device the recorder is disabled — commands are forwarded over the peer bridge to the primary.

## IDB usage

The hub opens DB `'physiq'` **v3** (same version as satellites — upgraded from v2 to avoid version conflicts when satellites run first). It creates two stores on `upgradeneeded` but only writes to one directly:

| Store | Key | Written by hub | Read/deleted by |
|-------|-----|---------------|-----------------|
| `audio` | `'pending'` | After `stop` — `{ blob, name, type, duration }` | physiq-report (`_consumeAudioFromIDB`) |
| `session` | `'active'` | By `lib/peer.js` (peer bridge only) | Satellites; peer bridge |

The recorder engine never reads or writes the `session` store directly. Session management is the satellites' responsibility (and the peer bridge when syncing from mobile).

On `discard`, the hub deletes the `'pending'` key from the `audio` store.

### Session object schema (`session` store, key `'active'`)

```js
{
  sessionId:       number,   // Date.now() at creation
  createdAt:       number,   // timestamp
  updatedAt:       number,   // timestamp of last write
  date:            string,   // localeDateString('es-ES')
  patient:         string,
  diagnosis:       string | null,
  manualRegion:    string | null,
  rom:             object | null,   // physiq-motion measurement data
  assessmentState: object | null,   // physiq-assessment state snapshot
  assessment:      object | null,   // physiq-assessment completed result
  force:           array  | null,   // physiq-force measurement series
}
```

Sessions have a TTL of 24 hours; satellites treat a session older than that as expired and start fresh.

## BroadcastChannel `physiq-session`

Satellites and the peer bridge communicate patient-session data over `BroadcastChannel('physiq-session')`. Messages tagged `_relay: true` originate from the remote peer and must not be echoed back to avoid loops.

| Message type | Key fields | Written to IDB by hub |
|---|---|---|
| `SESSION_PATIENT` | `patient` | `session.patient` |
| `SESSION_ROM` | `rom` | `session.rom` |
| `SESSION_ASSESSMENT_STATE` | `assessmentState` | `session.assessmentState` |
| `SESSION_ASSESSMENT` | `assessment` | `session.assessment` |
| `SESSION_FORCE` | `force` | `session.force` |
| `SESSION_REPORT_FIELDS` | `patient, date, diagnosis, manualRegion` | all four fields |
| `SESSION_CLEAR` | — | deletes `'active'` key entirely |
| `SESSION_SYNC` | full session snapshot | peer-to-peer only (on connect) |
| `SESSION_SYNC_RESOLVE` | `patient, rom, assessmentState` | peer-to-peer only (conflict resolution) |

## Peer bridge (`lib/peer.js`)

Enables a tablet + mobile split workflow: the physiotherapist uses physiq-motion on the mobile phone (better grip, accelerometer access) while the tablet hub acts as the session hub displaying other satellites.

**Architecture:** WebRTC P2P (`RTCDataChannel`) with SDP exchange via QR codes. No STUN/TURN needed — both devices on LAN.

- **Tablet (offerer / primary):** generates SDP offer → encodes as compact binary → displays as QR + URL text + share button
- **Mobile (answerer / secondary):** native camera scans QR → opens hub with `#peer=<encoded>` hash → `peer.js` auto-opens panel → generates answer QR
- **Tablet:** scans answer QR via `BarcodeDetector` API (paste fallback available) → `RTCDataChannel` connects

Device role (`'primary'` / `'secondary'`) is stored in `localStorage['physiq-device-role']` and auto-detected from screen width on first open. A reset button is available in step 1 of the peer panel.

### SDP encoding

Instead of transmitting the full SDP text (~1 KB), the peer bridge packs only the five required ICE fields into ~76 bytes of binary, then base64url-encodes them to ~102 chars. This produces a version-9 QR code (53×53 modules). Falls back to deflate-compressed full SDP when no IPv4 host candidates exist.

Only LAN-compatible candidates are kept (real-IP UDP host candidates). TCP, mDNS (`.local`), and reflexive/relay candidates are stripped — STUN/TURN is not needed on the same WiFi.

### ICE watchdog

A 30-second timer fires `peerOnICEFailed()` if ICE has not reached `'connected'` or `'completed'`. This covers the common case where devices are on different networks and ICE stays in `'checking'` indefinitely.

### Session sync on connect

When the `RTCDataChannel` opens, each side sends its current IDB session to the other as `SESSION_SYNC`. The receiving side applies the following logic:

- Remote has data, local is empty → apply remote session silently (`_peerApplySyncForce`)
- Both sides have data → show conflict UI (`peerShowConflict` / `peerDismissConflict` defined in `index.html`)
- Remote is empty → ignore

Conflict resolution:
- **Keep local** (`peerResolveConflictLocal`): local data wins; remote is told to adopt it via `SESSION_SYNC_RESOLVE`
- **Use remote** (`peerResolveConflictRemote`): remote data is applied locally and echoed back via `SESSION_SYNC_RESOLVE`

### Audio streaming over WebRTC

When recording mode is `'remote'` or `'stereo'`, the primary requests the secondary's microphone via `REC_START_STREAM`. The secondary opens `getUserMedia` and adds the audio track to the `RTCPeerConnection` via renegotiation (`onnegotiationneeded`). The primary receives it as an `ontrack` event.

For stereo mode the primary mixes local + remote tracks into a single `MediaStream` using `AudioContext.createChannelMerger`.

### DataChannel message types (peer bridge internal)

| Type | Direction | Meaning |
|------|-----------|---------|
| `SESSION_*` | bidirectional | Session data (see BroadcastChannel table above) |
| `SESSION_SYNC` | → remote on connect | Full session snapshot for initial sync |
| `SESSION_SYNC_RESOLVE` | → remote after conflict | Winning session snapshot |
| `PEER_DISCONNECT` | → remote | Graceful disconnect (300 ms delay before tearing down DC) |
| `REC_CMD` | secondary → primary | Recorder command (`start/pause/resume/stop/discard`) |
| `RECORDER_STATE` | primary → secondary | Recorder state mirror |
| `REC_START_STREAM` | primary → secondary | Request mic audio track |
| `REC_STOP_STREAM` | primary → secondary | Release mic audio track |
| `RENEGO_OFFER` | secondary → primary | SDP renegotiation offer (after adding audio track) |
| `RENEGO_ANSWER` | primary → secondary | SDP renegotiation answer |

**UI:** Phone icon button in header (turns green when connected). Bottom sheet with 3 steps: offer, answer, connected. Scan button uses `BarcodeDetector`; falls back to paste.

## postMessage protocol (hub ↔ satellite iframes)

Satellites send messages to the hub via `window.parent.postMessage(msg, '*')`. The hub listens on `window.addEventListener('message', ...)`.

| Type | Direction | Hub action |
|------|-----------|------------|
| `PHYSIQ_GO_HOME` | satellite → hub | Closes the iframe, shows hub home |
| `PHYSIQ_NAVIGATE` | satellite → hub | `openSat(e.data.to)` — navigate to another satellite |
| `PHYSIQ_WIDGET_HIDE` | satellite → hub | Sets `#rec-widget` `visibility: hidden` (during modals) |
| `PHYSIQ_WIDGET_SHOW` | satellite → hub | Restores `#rec-widget` visibility |
| `PHYSIQ_SAT_VISIBLE` | hub → satellite | Sent when the satellite's iframe becomes visible (allows satellite to rebuild swipe-back history) |
| `PHYSIQ_SAT_HIDDEN` | hub → satellite | Sent right before the hub hides the satellite's iframe (switching satellite or going home). Toggling the `hidden` attribute never fires `visibilitychange` inside the iframe, so satellites that need to close open dialogs/sheets before being tucked away must listen for this instead. |

## Commit format

```
git commit -m "short imperative title" -m "description when necessary"
```

- The first `-m` is the title (max ~72 characters)
- The second `-m` is only included when there is relevant context to add
- Never use `git commit` without flags or interactive editors
- Never add co-authorship (`Co-Authored-By`) under any circumstances

## Pull request format

- PR body: plain description only — no `🤖 Generated with Claude Code` line, no session URLs, no co-authorship footers
