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
├── motion/             — physiq-motion files, copied by CD pipeline
├── assessment/         — physiq-assessment files, copied by CD pipeline
└── report/             — physiq-report files, copied by CD pipeline
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

**⚠️ Never edit files inside any satellite subdirectory directly in this repo.** Every subdirectory that maps to a satellite (currently `motion/`, `assessment/`, `report/` — and any future ones) is fully overwritten on every push from the corresponding satellite repo. Any direct edits will be lost. All satellite app changes must be made in the respective satellite repo and will arrive here via the CD pipeline. This rule applies to all current and future satellites.

## Satellite repos

| Repo | Deployed at | Role |
|------|-------------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-assessment | /physiq/assessment/ | Clinical assessment |
| physiq-report | /physiq/report/ | AI-assisted clinical reports |

## Recorder engine (`index.html`)

The hub contains a `RecorderEngine` — the only audio recording component in the ecosystem. Satellites have no microphone access of their own.

**BroadcastChannel `physiq-recorder`** — the hub both listens (for commands from satellites) and emits (state updates):

| Direction | Message | Meaning |
|-----------|---------|---------|
| satellite → hub | `{ cmd: 'start' \| 'pause' \| 'resume' \| 'stop' \| 'discard' }` | Control the recorder |
| hub → all | `{ type: 'RECORDER_STATE', state, duration, hasAudio }` | State broadcast (every second while recording, and on every state change) |

`state` values: `'idle'` → `'recording'` → `'paused'` → `'stopped'` → `'idle'` (after discard or new start).

`hasAudio: true` means a blob is ready in IDB (set when `stopped`; cleared on `discard`).

## IDB usage

The hub opens DB `'physiq'` **v3** (same version as satellites — upgraded from v2 to avoid version conflicts when satellites run first). It creates two stores on `upgradeneeded` but only writes to one directly:

| Store | Key | Written by hub | Read/deleted by |
|-------|-----|---------------|-----------------|
| `audio` | `'pending'` | After `stop` — `{ blob, name, type, duration }` | physiq-report (`_consumeAudioFromIDB`) |
| `session` | `'active'` | By `lib/peer.js` (peer bridge only) | Satellites; peer bridge |

The recorder engine never reads or writes the `session` store directly. Session management is the satellites' responsibility (and the peer bridge when syncing from mobile).

On `discard`, the hub deletes the `'pending'` key from the `audio` store.

## Peer bridge (`lib/peer.js`)

Enables a tablet + mobile split workflow: the physiotherapist uses physiq-motion on the mobile phone (better grip, accelerometer access) while the tablet hub acts as the session hub displaying other satellites.

**Architecture:** WebRTC P2P (`RTCDataChannel`) with SDP exchange via QR codes. No STUN/TURN needed — both devices on LAN.

- **Tablet (offerer):** generates SDP offer → encodes as URL-safe base64 → displays as QR + URL text + share button
- **Mobile (answerer):** native camera scans QR → opens hub with `#peer=<encoded>` hash → `peer.js` auto-opens panel → generates answer QR
- **Tablet:** scans answer QR via `BarcodeDetector` API (paste fallback available) → `RTCDataChannel` connects

**Once connected:**
- Mobile hub listens on `BroadcastChannel('physiq-session')` for messages from its satellite iframes
- Forwards them over `RTCDataChannel` to the tablet hub
- Tablet hub writes to IDB (`session` store v3) and re-broadcasts on its local `physiq-session` channel so tablet satellites update in real time

**UI:** Phone icon button in header (turns green when connected). Bottom sheet with 3 steps: offer, answer, connected. Scan button uses `BarcodeDetector`; falls back to paste.

## postMessage protocol (hub ↔ satellite iframes)

Satellites send messages to the hub via `window.parent.postMessage(msg, '*')`. The hub listens on `window.addEventListener('message', ...)`.

| Type | Sender | Hub action |
|------|--------|------------|
| `PHYSIQ_GO_HOME` | any satellite | Closes the iframe, shows hub home |
| `PHYSIQ_NAVIGATE` | any satellite | `openSat(e.data.to)` — navigate to another satellite |
| `PHYSIQ_WIDGET_HIDE` | any satellite | Sets `#rec-widget` `visibility: hidden` (during modals) |
| `PHYSIQ_WIDGET_SHOW` | any satellite | Restores `#rec-widget` visibility |

The hub never posts messages back to satellites — communication is one-way (satellite → hub).

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

