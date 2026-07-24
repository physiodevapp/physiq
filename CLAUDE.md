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
├── questionnaire/      — physiq-questionnaire files, copied by CD pipeline
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

**⚠️ Never edit files inside any satellite subdirectory directly in this repo.** Every subdirectory that maps to a satellite (currently `motion/`, `assessment/`, `questionnaire/`, `report/`, `force/`, `balance/`, `wiki/` — and any future ones) is fully overwritten on every push from the corresponding satellite repo. Any direct edits will be lost. All satellite app changes must be made in the respective satellite repo and will arrive here via the CD pipeline. This rule applies to all current and future satellites.

## Satellite repos

| Repo | Deployed at | Role |
|------|-------------|------|
| physiq-motion | /physiq/motion/ | Joint ROM measurement |
| physiq-assessment | /physiq/assessment/ | Clinical assessment |
| physiq-report | /physiq/report/ | AI-assisted clinical reports |
| physiq-force | /physiq/force/ | Dynamometer force measurement |
| physiq-balance | /physiq/balance/ | Balance / posturography |
| physiq-questionnaire | /physiq/questionnaire/ | Validated clinical questionnaires |
| physiq-wiki | /physiq/wiki/ | Clinical reference wiki |

Satellite iframes declared in `index.html` with their required permissions:

```html
<iframe id="sat-motion"         allow="microphone">
<iframe id="sat-assessment"     allow="microphone">
<iframe id="sat-questionnaire">
<iframe id="sat-report"         allow="microphone">
<iframe id="sat-force"          allow="bluetooth">
<iframe id="sat-balance"        allow="accelerometer; gyroscope">
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
  assessmentState:   object | null,   // physiq-assessment state snapshot
  assessment:        object | null,   // physiq-assessment completed result
  force:             array  | null,   // physiq-force measurement series
  questionnaires:    array  | null,   // physiq-questionnaire completed results
  balance:           object | null,   // physiq-balance results, keyed by testId
  height:            number | null,   // patient height (cm), used by physiq-balance COP math
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
| `SESSION_QUESTIONNAIRE` | `questionnaires` | `session.questionnaires` |
| `SESSION_BALANCE` | `balance` | `session.balance` |
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

## Clinical knowledge base (RAG)

The copilot Worker (`worker/src/suggest.js`) uses RAG backed by Supabase pgvector. On each `/suggest` call, the transcript excerpt is embedded with OpenAI `text-embedding-3-small` and the top matching chunks are retrieved from Supabase to ground Claude's clinical suggestions.

**Evidence grounding & citation.** Each retrieved chunk is passed to Claude with its `Tema:` (title) and `Fuente:` (source) header, not just raw `content`. The `/chat` system prompt instructs Claude to ground answers in physiotherapy evidence and validated sources (clinical guidelines, systematic reviews, bodies such as APTA/IASP, journals such as BJSM), to cite the chunk's `Fuente:` **only** when the recommendation comes from the retrieved knowledge base (never inventing references), and to flag explicitly when a claim is not backed by the knowledge base ("no encontrado en la base de conocimiento"). `/suggest` is grounded the same way but does not force a citation into its short two-phrase JSON.

### Supabase schema (`supabase/schema.sql`)

Run once in the Supabase SQL editor:
- Extension: `vector` (pgvector)
- Table: `chunks` — `content`, `embedding vector(1536)`, `title`, `category`, `region`, `source`, `tags`, `file`
- Index: HNSW on `embedding` (cosine)
- Function: `match_chunks(query_embedding, match_count, filter_category, filter_region, min_similarity)` — returns top-N rows above cosine threshold, including each chunk's `source` so the Worker can ground answers and cite it. Changing the returned columns requires dropping the existing function first (the schema drops both the legacy 5-arg and current 6-arg signatures) — `create or replace` cannot alter a function's return table.
- RLS: public SELECT, writes only via service role key
- Grants: explicit `GRANT ALL ON chunks TO service_role` + sequence grant required — service_role bypasses RLS but still needs object-level privileges

### Knowledge directory (`knowledge/`)

```
knowledge/
├── differential/   — differential diagnosis by region
├── redflags/       — red flag indicators
├── assessment/     — special tests and assessment protocols
└── protocols/      — treatment and examination protocols
```

Each `.md` file uses this format:

```markdown
---
title: "Diagnóstico diferencial del dolor lumbar"
category: differential     # differential | redflags | assessment | protocol
region: lumbar             # lumbar | cervical | shoulder | knee | hip | ankle | elbow | wrist | global
source: "Goodman & Snyder"
language: es
tags: [lumbar, dolor, visceral]
---

## Fractura vertebral osteoporótica

Content of this H2 section becomes one chunk in Supabase.

## Estenosis de canal lumbar

Each H2 = one chunk. Split by condition or topic, not by book chapter.
```

### Supabase column mapping

Each H2 section in a `.md` file becomes one row in the `chunks` table:

| Column | Source | Required |
|--------|--------|----------|
| `content` | full H2 section text | auto |
| `embedding` | generated by OpenAI | auto |
| `title` | text of the `## Heading` | auto |
| `file` | repo-relative path of the `.md` | auto |
| `category` | frontmatter | recommended — enables RAG filtering by type |
| `region` | frontmatter | recommended — enables RAG filtering by anatomy |
| `source` | frontmatter | optional |
| `tags` | frontmatter | optional |

The script only requires at least one H2 section to produce a chunk. All frontmatter fields fall back to `null` if absent. `category` and `region` are the most useful because they allow the Worker to pre-filter results before semantic search.

**When generating `.md` files with Claude:** always include `category`, `region`, and `source` in the frontmatter. Use one H2 per condition or topic — never per book chapter. Keep each section self-contained (the RAG retrieves individual chunks with no surrounding context).

### Adding content

1. Create or edit a `.md` file in `knowledge/<category>/`
2. Commit and push to `main`
3. The `ingest-knowledge` GitHub Action embeds the changed files and upserts chunks into Supabase automatically

To re-ingest all files manually: `node scripts/ingest.js`

### Secrets required

| Secret | Used by | Purpose |
|--------|---------|---------|
| `SUPABASE_URL` | Worker + GitHub Action | Supabase project URL (`https://<ref>.supabase.co`) |
| `SUPABASE_ANON_KEY` | Worker (read) | Public read for `match_chunks` RPC |
| `SUPABASE_SERVICE_KEY` | GitHub Action (write) | Insert/delete chunks during ingestion |
| `OPENAI_API_KEY` | Worker + GitHub Action | `text-embedding-3-small` embeddings |

Worker secrets set with `wrangler secret put <NAME>`.
GitHub Action secrets set in repo Settings → Secrets → Actions.

### RAG tuning parameters

Current values in `worker/physiq-copilot.js` (`handleSuggest`):

| Parameter | Value | Notes |
|-----------|-------|-------|
| `match_count` | 3 | Chunks passed to Claude as context |
| `min_similarity` | 0.6 | Cosine threshold; raise if noise increases |
| `filter_region` | `session.manualRegion` | Optional; `global` is always included by `match_chunks` |
| `filter_category` | `session.category` | Optional; satellite must pass it explicitly |

### Region adjacency map

A session's active region also pulls in its immediate proximal/distal neighbour so referred-pain overlap stays retrievable. This is **implemented**: `REGION_ADJACENCY` + `regionsFor()` in `worker/physiq-copilot.js` build a `filter_regions text[]`, and `match_chunks` matches `c.region = ANY(filter_regions)`. Unknown regions fall back to `[region, global]`.

```
lumbar    → [lumbar, hip, global]           // L5-S1, SI joint, piriformis
hip       → [hip, lumbar, global]           // referred pain ↔ lumbar (bidirectional)
knee      → [knee, hip, lumbar, global]     // mechanical hip + L3-L4 radicular referral
ankle     → [ankle, knee, lumbar, global]   // mechanical knee + L5-S1 radicular referral (sciatica)
shoulder  → [shoulder, cervical, global]    // C5-C6, subacromial ↔ cervical root
cervical  → [cervical, shoulder, global]    // same overlap, reverse direction
elbow     → [elbow, wrist, cervical, global] // forearm chain + C6-C7 referral (lateral epicondylalgia mimic)
wrist     → [wrist, elbow, cervical, global] // forearm chain + double crush w/ CTS, C6-C8/T1 referral
```

Rules:
- `global` is always in the array — systemic screening content is transversal
- Adjacency is proximal/distal immediate only — no segment skipping. Exception: distal limb segments reach their proximal **spinal neurological source** one-directionally — upper limb `wrist → cervical` / `elbow → cervical` (double crush / C6-C8 referral), lower limb `knee → lumbar` / `ankle → lumbar` (L3-L4, L5-S1 radicular referral / sciatica). These are *neurological* neighbours, not mechanical, mirroring `shoulder → cervical`.
- Bidirectional pairs: the two spine pairs `shoulder` ↔ `cervical` and `lumbar` ↔ `hip`, plus the mechanical forearm pair `wrist` ↔ `elbow`. The distal→spine reach is one-directional (a cervical or lumbar session does not need distal limb-specific tests). Note the lower-limb mechanical chain (`knee → hip`, `ankle → knee`) is one-directional proximal-ward, unlike the bidirectional `wrist ↔ elbow` — a pre-existing asymmetry, revisit if a hip/knee session should reach distally.
- Sacral/pelvic content stays `global` (screening content, not articular-specific); add `region: sacro` only if articular technique chunks are added for that region
- Sacral/pelvic content stays `global` (screening content, not articular-specific); add `region: sacro` only if articular technique chunks are added for that region

### Future evolution: two-tier adjacency by category (not implemented)

The current adjacency is *all-or-nothing per region*: a neighbour contributes **all** its categories. The reach to the spine (`cervical`/`lumbar`) is one-directional precisely to avoid dragging every distal-limb procedure into the (common) spine session. If that reverse reach is ever needed — a cervical session that should surface the *neuropathy differential* of elbow/wrist ("is this C6 or carpal tunnel?"), or a lumbar session that should surface the distal *radicular differential* of knee/ankle ("is this the knee or an L4 radiculopathy?") without pulling their `assessment`/`protocol` procedures (hook test, exam protocol) — the clean way is a **two-tier adjacency**, not making the current map bidirectional. This is symmetric across both limbs, not an upper-limb-only concern.

Each region would carry two neighbour lists:
- **Full neighbours** — all categories eligible (own region + true mechanical neighbour).
- **Referral neighbours** — only `redflags` + `differential` eligible (the diagnostic reasoning and flags, not the procedures).

```
cervical → full: [cervical, shoulder]   referral: [elbow, wrist]
shoulder → full: [shoulder, cervical]    referral: [elbow, wrist]
elbow    → full: [elbow, wrist]          referral: [cervical]
wrist    → full: [wrist, elbow]          referral: [cervical]
lumbar   → full: [lumbar, hip]           referral: [knee, ankle]
hip      → full: [hip, lumbar]           referral: [knee, ankle]
knee     → full: [knee, hip]             referral: [lumbar]
ankle    → full: [ankle, knee]           referral: [lumbar]
+ global always
```

`match_chunks` would gain one clause:
```sql
region = any(filter_regions)
  or (region = any(filter_regions_referral) and category in ('redflags','differential'))
  or region = 'global'
```
and `regionsFor()` in the worker would return both arrays. Self-contained change (one SQL function drop+recreate — the signature changes, so `create or replace` is not enough — plus `regionsFor`); **no re-ingestion**, since `region` and `category` already exist on every chunk.

**When to apply it — all of:**
1. You observe concrete retrieval misses: cervical (or shoulder) sessions asking differential/double-crush questions that *should* surface distal entrapment content and don't, and this recurs in real use (not hypothetically).
2. The distal limb actually has `differential`/`redflags` chunks worth reaching (e.g. the elbow/wrist neuropathy differentials — already true) and their absence measurably degrades answers.
3. Making those regions plainly bidirectional would over-broaden the common session (cervical) with distal *procedures*, i.e. the coarser fix is unacceptable.

Until all three hold, keep the single-list region adjacency: the embedding + top-N + 0.6 threshold already do most relevance filtering, and the region pre-filter is meant to stay coarse. Note the coarseness that remains even with this scheme: `category` groups all four wrist differentials (radial/ulnar/neuropathy/deformity), not neuropathy alone — isolating a single topic across regions would need a cross-cutting tag, a further step not worth taking pre-emptively.

### When to expand the region enum

When knowledge files are added, check the chunk distribution in Supabase:

```sql
SELECT region, COUNT(*) as chunks FROM chunks GROUP BY region ORDER BY chunks DESC;
```

Add a new region to the enum (e.g. `sacro`, `elbow`, `wrist`) when **all three conditions** are met:
1. There are ≥20 chunks of `category: assessment` or `category: protocol` that are specific to that articular region (i.e. not systemic screening content that belongs in `global`)
2. The content would be diluted or hard to retrieve if kept in `global` alongside unrelated chunks
3. The new region has a clear adjacency entry to add to the map above

Red flags and differential diagnosis content for that region almost always belongs in `global`, not in the new region — only articular-specific tests, techniques, and protocols justify a dedicated region value.

### Worker deployment

The Worker deploys automatically via GitHub Actions (`.github/workflows/deploy-worker.yml`): any push to `main` that touches `worker/**` runs `wrangler deploy`. The workflow can also be run manually from the Actions tab (`workflow_dispatch`).

Requires two repo secrets (Settings → Secrets and variables → Actions):
- `CLOUDFLARE_API_TOKEN` — token with the "Edit Cloudflare Workers" permission
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account id

The Worker's own runtime secrets (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `DEEPGRAM_API_KEY`, `SUPABASE_*`) are set in the Cloudflare dashboard and are preserved by `wrangler deploy` — they are not managed by CI.

Manual fallback (if CI is unavailable):
- Dashboard: Workers & Pages → physiq-copilot → Edit code → paste file contents → Deploy
- CLI: `wrangler deploy` from the `worker/` directory

## Conversational copilot (`/chat`)

Beyond the passive suggestion engine (`/suggest`), the copilot exposes a conversational mode: the physiotherapist can ask the copilot directly (red flags, differential, tests, next steps) from the **"Consultar"** tab in the copilot panel (`index.html`, `lib/copilot.js`).

- **Endpoint:** `POST /chat` in `worker/physiq-copilot.js`. Reuses the `/suggest` RAG pipeline (embed last user message → `match_chunks` → Claude) with `match_count: 5`.
- **Streaming:** the reply is streamed to the client as SSE — the worker transforms Anthropic's stream into minimal `data: {text}` / `data: [DONE]` events, and `copilotSendChat` in `lib/copilot.js` appends the deltas to the assistant bubble. `max_tokens` is 2048; if Anthropic stops with `stop_reason: max_tokens` the worker also emits `data: {truncated:true}` and the client appends a "Respuesta recortada" notice (`.cop-chat-trunc`) to the bubble — UI-only, the persisted message text stays clean. Asking "continúa" resends the thread so Claude picks up where it left off.
- **Context:** session data, the live consultation transcript (last 20 exchanges), and retrieved knowledge chunks. RAG is best-effort — the chat still replies if embedding or Supabase is unavailable.
- **Session data fed as context (both `/suggest` and `/chat`):** `lib/copilot.js` keeps `_sessionData` in sync from the shared IDB `session` store (hydrated on startup, then updated live via `BroadcastChannel('physiq-session')`) and forwards it to the worker. The worker renders it as short clinical lines — never raw JSON dumps — via `fmtForce` / `fmtQuestionnaires` / `fmtAssessment` / `fmtBalance` in `worker/physiq-copilot.js`. Fields used: `patient`, `diagnosis`, `manualRegion` (also drives the RAG region filter), `rom`, `force`, `questionnaires`, `assessment`, and `balance` (posturography — only per-test `score` + COP mean velocity / ellipse area; the raw `metrics.cop` series/hull/ellipse chart arrays are dropped). `assessmentState` is intentionally excluded (internal navigation state, not clinical content).
- **Coexistence:** the passive suggestion engine and the chat run independently; the mic footer is hidden while the chat tab is active.
- **State:** the live thread is `_chatMessages` (client-side). It is persisted to a standalone history DB after every assistant reply (see below) — but the passive suggestion engine, transcript, and patient session never read it.

### Cabeceras del panel (filtro de región)

El panel del copiloto tiene un header, un filtro de región y una barra de pestañas (**Sugerencias / Consultar / Transcripción**). Para no apilar tres bandas full-width, el filtro de región no es una banda permanente: vive colapsado en un **trigger compacto del header** (`#cop-rgn-trigger` → `copilotToggleRegionMenu`).

- **Trigger:** muestra `Región` si no hay ninguna, o el nombre de la región activa con acento morado (clase `cop-rgn-trigger-on`). El chevron rota al abrir.
- **Popover:** los chips (`#cop-region-row`) se despliegan como popover transitorio bajo el header y se cierran al elegir una región (`copilotSetRegion`) o al hacer clic fuera. `copilotSetRegion` sigue siendo el mismo punto de entrada — solo cambia cómo se accede a él; no toca el filtrado RAG.
- **Animación:** el despliegue anima la altura vía `grid-template-rows: 0fr → 1fr` (misma curva que los paneles de la app) para que las pestañas se deslicen en vez de saltar. Estructura de **3 capas** — `.cop-region-row` (grid) › `.cop-region-clip` (`overflow:hidden`, colapsa a 0) › `.cop-region-inner` (padding + `overflow-x:auto` para el scroll de chips). La capa de recorte intermedia es necesaria: sin ella, el `overflow-x:auto` impide que el `grid 0fr` recoja el padding y deja una banda residual. Estado colapsado usa `inert` (accesibilidad) y respeta `prefers-reduced-motion`.

### Corrección de diarización en Transcripción

La diarización de Deepgram (`speaker 0 = fisio`) alimenta el SOAP verbatim (`handleNotes` la formatea como `Fisioterapeuta:` / `Paciente:`), pero la heurística puede fallar (sesión invertida si el paciente habla primero, o flip parcial tras una pausa de dictado). La pestaña **Transcripción** permite corregirla a mano sobre el array `_transcript` que consume `/notes`:

- **Tap por línea** (`copilotToggleLineSpeaker`) — alterna el hablante de una sola línea.
- **Invertir todo** (`copilotSwapAllSpeakers`) — botón de la toolbar sticky (`#cop-tx-tools`) que invierte todas las líneas de golpe.

### Dictado por voz en Consultar

El input del chat tiene un botón de micro (`#copilot-chat-mic` → `copilotChatDictate`) que dicta voz → texto reutilizando el mismo pipeline Deepgram del motor pasivo (`/transcribe`). No hay endpoint nuevo ni TTS: la respuesta sigue siendo texto.

- **Modo de stream:** `_startStream()` acepta dos intenciones vía `_streamMode` — `'passive'` (transcript diarizado + `/suggest`) y `'dictation'` (finales concatenados en el input, sin diarización, sin `/suggest`). El dictado pide `diarize=false`.
- **Micro exclusivo con auto-pausa:** solo hay un stream Deepgram vivo a la vez. Al empezar a dictar, si el motor pasivo estaba escuchando se pausa (`_resumePassiveAfterDictation`) y se reanuda al terminar. Así el transcript de la consulta no se contamina con lo que el fisio le dice *al* asistente.
- **Auto-pausa del grabador:** por la misma razón, si el `RecorderEngine` está `recording` (widget `#rec-widget`) el dictado lo pausa (`recCmd('pause')`, `_resumeRecAfterDictation`) y lo reanuda al terminar (`recCmd('resume')`), para que lo que el fisio dicta al asistente no entre en el audio de la consulta. Solo se reanuda lo que pausó el propio dictado; si el usuario para/descarta la grabación a mitad, el `resume` es no-op (guardas de estado en `_resume`).
- **Ciclo de vida:** el dictado se corta al pulsar de nuevo el mic, al cambiar de pestaña, al cerrar el panel o al enviar el mensaje. `_finishDictation` es el único que anula `_ws` y reanuda el pasivo si procede.
- **Socket obsoleto:** los handlers del WebSocket capturan `sock`/`mode` en su creación y hacen early-return si `_ws !== sock`, para que el `close` tardío del stream pausado no actúe sobre el que lo reemplazó.

### Historial de consultas al copiloto

Las conversaciones de la pestaña **Consultar** se guardan en un historial propio del fisio, **independiente del paciente y de la sesión activa**. No usa el `session` store: vive en su **propia base de datos IndexedDB** (`physiq-copilot-history`, store `conversations`, keyPath `id`) para no chocar con la versión `v3` de la DB `physiq` que comparten los satélites.

- **Cuándo se guarda:** `_histSave()` hace *upsert* del hilo tras cada respuesta del asistente (best-effort — un fallo de escritura nunca rompe el chat). La primera pregunta de un hilo vacío crea `_chatConvId = Date.now()`; las siguientes actualizan el mismo registro (`updatedAt` sube y sube al principio de la lista).
- **Esquema del registro:** `{ id, createdAt, updatedAt, title, messages: [{ role, text }] }`. `title` = primera pregunta del usuario, recortada a 120 caracteres.
- **UI:** dos iconos compactos en el **header** (`#cop-hdr-chat-actions`) — **Nueva** (`copilotChatNew` — abre un hilo limpio; el anterior ya quedó guardado) e **Historial** (`copilotHistoryOpen`). Viven en el header (no en una banda propia, para no apilar tres bandas full-width — mismo criterio que el filtro de región) y solo se muestran en la pestaña Consultar (`_syncHeaderChatActions` los sincroniza con `#cop-panel-chat`). La vista de historial (`#cop-chat-history`) sustituye al hilo + input mientras está abierta (clase `cop-panel-chat.cop-hist-open`); cada entrada carga la conversación al tocarla (`copilotHistoryLoad`). Cargar un hilo antiguo permite **continuarlo** — las nuevas respuestas actualizan ese mismo registro.
- **Borrado con confirmación:** una entrada se elimina con **swipe lateral** (táctil, `_initHistSwipe` — reutiliza el gesto de las tarjetas de sugerencias) o con el **icono de papelera** (ratón). Ambos abren un **diálogo de confirmación** centrado (`#cop-confirm`, estética de los satélites: título `DM Serif Display`, Cancelar ghost / Borrar rojo) vía `copilotHistoryDelete(id, title)`; solo `_histDoDelete` borra de verdad tras confirmar. El diálogo es genérico (`_copConfirm(title, sub, onOk)` + `copilotConfirmOk/Cancel`).
- **Alcance:** el historial sobrevive a recargas y a cambios de paciente; `SESSION_CLEAR` no lo toca. Se cierra automáticamente al cambiar de pestaña (`copilotSwitchTab`).

### Copilot — próximos pasos (no implementado)

Ideas anotadas para más adelante; ninguna está hecha:
- **Conversación por voz (voz→voz):** TTS de la respuesta para un modo manos libres. Fuera de alcance por ahora (nueva API, latencia).
- **Tuning RAG del chat:** revisar `match_count` (5) y `min_similarity` (0.6) en `handleChat` si las respuestas salen con ruido o poco fundamentadas.

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
