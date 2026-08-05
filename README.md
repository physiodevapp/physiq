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

## Demo mode

PhysiQ is a public portfolio project whose AI features run on a personal API
budget. To keep the app openly explorable without that budget funding anonymous
traffic, the worker serves a **demo mode**: the copilot and the report generator
walk end to end on preloaded, clinically plausible fixtures, with **zero calls to
Deepgram, OpenAI or Anthropic**.

Nothing is disabled in demo mode. Every route answers — with fixtures instead of
a model. The rest of the suite (ROM, force, balance, jump, questionnaires,
kinematics) is unaffected: it computes on-device and never used an external
service to begin with.

### How the mode is decided

**In the worker, never in the client.** `resolveMode` runs in the router before
any handler and is fail-closed — `real` requires *all* of:

| Condition | Otherwise |
|---|---|
| `DEMO_ONLY` variable is not set | demo (budget kill switch) |
| An `X-License-Key` is present (or `?key=` for the WebSocket) | demo |
| That key exists in the `LICENSES` KV namespace with `active !== false` | demo |
| The secrets that route needs are configured | demo |

Secrets are checked per route, so partial configuration degrades per feature: with
only `ANTHROPIC_API_KEY` set, chat is real while transcription stays demo. A fork
deployed with no secrets at all comes up as a fully working demo.

There is one dev bypass: when the worker itself runs under `wrangler dev` it
assumes a developer with `.dev.vars` and skips the licence check. It keys off the
worker's *own* hostname, never off the request's `Origin` header — a header the
caller controls, and which `curl -H 'Origin: http://localhost'` forges in a
second. (That header *was* the bypass condition until this change, which meant one
spoofed header bought real mode with no licence.)

The client cannot influence this. It never sends a mode; it *reads* one, from
`GET /validate` and the `X-PhysiQ-Mode` header on every response, and uses it only
to render the DEMO badge. Forcing `window.PHYSIQ_MODE` in devtools produces a UI
that lies while the worker keeps serving fixtures. Note that the CORS `Origin`
check is *not* part of the decision — CORS is a browser policy and `curl` walks
through it; the KV license is the only thing that separates spend from no-spend.

### Zero-cost guarantee

Demo handlers (`worker/demo/handlers.js`) **never receive `env`**. The API keys
live there, so a demo path cannot call a paid provider even by mistake — it has
nothing to authenticate with. The guarantee is a property of the function
signatures rather than of remembering to write an early return.

```
grep -rn "api\.\(openai\|anthropic\|deepgram\)\|env\." worker/demo/   # → empty
```

### Rate limiting

Second layer, protecting the budget if a license key ever leaks. Real routes are
limited by license (hashed) and by IP; demo traffic gets a loose anti-abuse limit.
Bindings are configured in `worker/wrangler.toml` and every one of them is optional
in code — unbound means "no limiting", never a runtime error.

Two caveats worth knowing: the binding's `period` only accepts 10 or 60 seconds and
its counters are **local to each Cloudflare location**, so it stops bursts rather
than a slow global drain. The all-day ceiling is the `DAILY_CAP` counter, which
needs the optional `RATE` KV namespace bound to take effect.

### Enabling real mode

1. Set the worker secrets: `wrangler secret put DEEPGRAM_API_KEY` (and
   `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`)
2. Make sure `DEMO_ONLY` is `"0"` in `worker/wrangler.toml` (or unset in the dashboard)
3. Add a license key to the `physiq-licenses` KV namespace:
   `<key-string>` → `{"clinic":"Nombre","active":true}`
4. In the app, open the front screen → *¿Tienes una clave de activación?* → enter it

Flipping `active` to `false` in KV drops every visitor back to demo instantly and
with no deploy — KV holds data, not config, so deploys never touch it. `DEMO_ONLY=1`
does the same globally, but it *is* config: `wrangler deploy` resets `[vars]` to the
values in `wrangler.toml`, so set it there and push rather than in the dashboard.
Sessions already open degrade gracefully:
the user is told the license is no longer active and keeps working in demo, rather
than being thrown back to a login wall.

Fixtures live in `worker/demo/fixtures.js` (single fictional patient, shared across
transcript, suggestions, chat and SOAP note).

### Watching the spend

`scripts/usage-report.js` answers one question: *does the consumption showing up at
OpenAI / Anthropic / Deepgram correspond to requests I actually made?*

```
CF_API_TOKEN=… CF_ACCOUNT_ID=… node scripts/usage-report.js [--days N] [--json]
```

The token needs **Workers KV Storage → Read** and **Account Analytics → Read**.
Two sources are cross-referenced:

**Analytics Engine** (`physiq_usage` dataset) — one row per request, written by
`track()` in both Workers *after* `modeFor` has resolved:

| field | value |
|-------|-------|
| `blob1` | worker — `copilot` / `report` |
| `blob2` | path |
| `blob3` | mode — `real` / `demo` |
| `blob4` | outcome — `served` / `ratelimited` / `turnstile` |
| `blob5` | identity — `lic` / `anon` |

This gives the **exact** demo/real split with weeks of history, and separates the
two Workers. Counts use `SUM(_sample_interval)`, not `COUNT(*)`, so they stay
correct once Analytics Engine starts sampling. The binding is optional in code
(`if (!env.AE) return`) and the write is wrapped in try/catch — telemetry can
never fail a request. There is no backfill: data starts at the deploy that added
the binding.

**The `physiq-rate` KV counter** (`rl:<date>:<actor>`) — written in
`rateLimited()` **only in real mode**, and the thing `DAILY_CAP` trips on. It
serves as a cross-check on the figure above.

Three limits, all printed by the script itself:

- The KV keys carry `expirationTtl: 90000`, so **only today and part of yesterday
  exist** there. Long history comes from Analytics Engine.
- Both Workers share the `physiq-rate` namespace *and* the key format, so those
  counters are summed and cannot be attributed per Worker (Analytics Engine can).
- One request is not one fixed cost: `/transcribe` bills per connected minute and
  `/chat` per token. Neither source says how much was spent — they say what paid
  work happened.

The per-provider spend is deliberately not fetched over API — none of the three
exposes a stable public endpoint worth hard-coding — so the script prints the
dashboard links and the figure to compare them against.

## Copilot Worker (`worker/`)

A Cloudflare Worker (`physiq-copilot`) powers the AI features used by physiq-report:

- `/validate` — reports the run mode (`real` / `demo` / `mixed`), per route
- `/transcribe` — WebSocket proxy to Deepgram for real-time transcription. In demo
  mode the worker accepts the socket and replays a fixture in Deepgram's own
  message format, discarding incoming audio frames unbuffered — so the client needs
  no demo-specific code, and the visitor's audio never leaves their browser
- `/suggest` — RAG-backed clinical suggestions: embeds the transcript excerpt with OpenAI `text-embedding-3-small`, retrieves matching chunks from Supabase pgvector, and asks Claude for a typed suggestion (`redflag | followup | differential | test`)
- `/chat` — conversational reply, SSE-streamed. The demo path reproduces the same
  incremental stream, paced to the rate the real model streams at
- `/notes` — structured clinical note generation

> Deployment note: the worker is no longer a single file (`worker/demo/` is bundled
> at deploy time), so pasting `physiq-copilot.js` into the dashboard editor is no
> longer a valid fallback. Deploy with `wrangler deploy`; the GitHub Action does
> this automatically on every push to `main` that touches `worker/**`.

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
