# PhysiQ Hub

The PhysiQ hub is the single installable PWA entry point for the PhysiQ ecosystem — a suite of clinical tools for musculoskeletal physiotherapy. Deployed at **[physiodevapp.github.io/physiq/](https://physiodevapp.github.io/physiq/)**.

## What it does

The hub has no clinical logic of its own. Its responsibilities are:

1. Be the installable PWA for the entire ecosystem (scope `/physiq/`)
2. Provide a navigation shell linking to each satellite app
3. Host satellite files delivered by the CD pipeline
4. Own the audio recording engine shared by all satellites
5. Bridge a tablet + mobile split workflow via WebRTC
6. Host the Cloudflare Worker that powers the AI copilot (transcription, clinical suggestions via RAG)

## Satellites

| App | Path | Role |
|-----|------|------|
| physiq-assessment | `/physiq/assessment/` | Guided 5-phase clinical assessment |
| physiq-motion | `/physiq/motion/` | Joint ROM measurement (inclinometer) |
| physiq-report | `/physiq/report/` | AI-assisted clinical report generation |
| physiq-force | `/physiq/force/` | Strength measurement (dynamometer) |
| physiq-balance | `/physiq/balance/` | Balance assessment (accelerometer) |
| physiq-wiki | `/physiq/wiki/` | Clinical reference wiki |

Each satellite runs in an iframe inside the hub shell. The hub pre-loads satellite iframes via `requestIdleCallback` for fast switching.

## Architecture

```
physiq/
├── index.html        — hub shell, navigation, RecorderEngine
├── manifest.json     — PWA manifest (scope: /physiq/)
├── sw.js             — Service Worker (cache-on-visit, hub shell only)
├── icons/            — PWA icons (192px, 512px)
├── lib/
│   ├── peer.js       — WebRTC peer bridge (tablet ↔ mobile)
│   └── qrcode.min.js — QR code generation
├── worker/           — Cloudflare Worker (transcription, copilot suggestions)
├── knowledge/        — clinical knowledge base (.md files → Supabase pgvector)
├── supabase/         — schema.sql for Supabase setup
├── scripts/          — ingest.js (embed knowledge files into Supabase)
├── assessment/       — physiq-assessment files (CD pipeline)
├── motion/           — physiq-motion files (CD pipeline)
├── report/           — physiq-report files (CD pipeline)
├── force/            — physiq-force files (CD pipeline)
├── balance/          — physiq-balance files (CD pipeline)
└── wiki/             — physiq-wiki files (CD pipeline)
```

No build step. No framework. No npm. Plain HTML/CSS/JS.

## Service Worker

The hub SW uses cache-on-visit: it pre-caches only the hub shell files on install and does not intercept satellite routes. Each satellite's own SW handles its scope (`/physiq/<name>/`). The satellite scope is more specific and takes precedence.

To force a cache refresh, bump `CACHE_NAME` in `sw.js`.

## CD pipeline

Each satellite repo has a GitHub Actions workflow that:
1. Clones this repo
2. Copies its built files into the corresponding subdirectory
3. Pushes to `main`

This repo is passive — it only needs GitHub Pages enabled on `main`. Every satellite subdirectory is **fully overwritten** on each push from its satellite repo. Never edit satellite subdirectory files directly here.

The pipeline requires a PAT with `repo` scope stored as `PHYSIQ_DEPLOY_TOKEN` in each satellite repo's secrets.

## Audio recording (`index.html`)

The hub owns the only `MediaRecorder` instance in the ecosystem. Satellites have no microphone access of their own.

Communication is via `BroadcastChannel('physiq-recorder')`:

| Direction | Message | Meaning |
|-----------|---------|---------|
| satellite → hub | `{ cmd: 'start' \| 'pause' \| 'resume' \| 'stop' \| 'discard' }` | Control the recorder |
| hub → all | `{ type: 'RECORDER_STATE', state, duration, hasAudio }` | State broadcast |

State lifecycle: `idle` → `recording` → `paused` → `stopped` → `idle`

When stopped, the audio blob is written to IndexedDB (`physiq` v3, `audio` store, key `'pending'`). physiq-report reads and deletes it from there.

## Peer bridge (`lib/peer.js`)

Enables a split workflow where the physiotherapist uses physiq-motion on a mobile phone (accelerometer access) while viewing other satellites on a tablet.

**Connection flow:**

1. Tablet generates an SDP offer → encodes as URL-safe base64 → displays as QR code
2. Mobile scans QR → hub opens with `#peer=<encoded>` hash → auto-generates answer QR
3. Tablet scans answer QR via `BarcodeDetector` API (paste fallback available) → `RTCDataChannel` connects

No STUN/TURN needed — both devices on the same LAN.

**Data flow once connected:**

- Mobile hub listens on `BroadcastChannel('physiq-session')` for messages from its satellite iframes
- Forwards them over `RTCDataChannel` to the tablet hub
- Tablet hub writes to IDB (`session` store) and re-broadcasts on its local `physiq-session` channel

The phone icon in the hub header turns green when connected.

## IndexedDB

The hub opens DB `physiq` v3 with two stores:

| Store | Key | Written by | Read/deleted by |
|-------|-----|-----------|-----------------|
| `audio` | `'pending'` | Hub (after stop) | physiq-report |
| `session` | `'active'` | `lib/peer.js` | Satellites; peer bridge |

## postMessage protocol (hub ↔ satellites)

Satellites send messages to the hub via `window.parent.postMessage(msg, '*')`:

| Type | Hub action |
|------|------------|
| `PHYSIQ_GO_HOME` | Close iframe, show hub home |
| `PHYSIQ_NAVIGATE` | Navigate to another satellite |
| `PHYSIQ_WIDGET_HIDE` | Hide recorder widget (during modals) |
| `PHYSIQ_WIDGET_SHOW` | Restore recorder widget visibility |

The hub also posts messages back to satellite iframes:

| Type | Meaning |
|------|---------|
| `PHYSIQ_SAT_VISIBLE` | The satellite's iframe just became visible (rebuild swipe-back history) |
| `PHYSIQ_SAT_HIDDEN` | The satellite's iframe is about to be hidden (close any open dialog/sheet) |

## Copilot Worker (`worker/`)

A Cloudflare Worker (`physiq-copilot`) powers the AI features used by physiq-report:

- `/transcribe` — WebSocket proxy to Deepgram for real-time transcription
- `/suggest` — RAG-backed clinical suggestions: embeds the transcript excerpt with OpenAI `text-embedding-3-small`, retrieves matching chunks from Supabase pgvector, and asks Claude for a typed suggestion (`redflag | followup | differential | test`)
- `/notes` — structured clinical note generation

### Knowledge base

Clinical knowledge lives in `knowledge/` as `.md` files (one H2 section = one chunk). Pushing to `main` triggers the `ingest-knowledge` GitHub Action, which embeds changed files and upserts them into Supabase automatically.

```
knowledge/
├── differential/   — differential diagnosis by region
├── redflags/       — red flag indicators
├── assessment/     — special tests and assessment protocols
└── protocols/      — treatment and examination protocols
```

Supabase schema is in `supabase/schema.sql` — run once in the Supabase SQL editor to set up the `chunks` table, HNSW index, and `match_chunks` RPC function.

## Local development

Serve from the repo root with any HTTP server:

```
npx serve .
```

Or use VS Code Live Server. The hub is plain static files — no build step required.
