# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**PhysiQ Report** (CIF-AFTA v4.0) is a single-file clinical documentation tool for physiotherapists. It takes audio recordings of sessions, transcribes them via a Cloudflare Worker backed by Whisper, and generates structured clinical reports (in Spanish) via another Cloudflare Worker backed by Claude.

## Running the app

No build step. Open `index.html` directly in a browser. There is no package.json, no dev server, no compilation.

## Architecture

The application is split into two files:
- `index.html` — markup and embedded CSS
- `app.js` — all JavaScript (~1140 lines before the split)

There is no framework, no bundler, no modules.

**External dependencies loaded at runtime:**
- `docx` v8.5.0 from CDN (jsdelivr → unpkg → cloudflare fallbacks) — used for `.docx` export
- Cloudflare Worker endpoints (hardcoded URLs):
  - `https://physiq-whisper.edu-gamboa-rodriguez.workers.dev` — audio transcription (Whisper)
  - `https://physiq-claude.edu-gamboa-rodriguez.workers.dev` — report generation (claude-sonnet-4-5); acts as a proxy that injects the Anthropic API key and forwards the same body shape as the Anthropic API (`model`, `max_tokens`, `messages`)

**Client-side persistence:**
- `localStorage` key `physiq_config` (JSON) — all UI/clinic settings
- `localStorage` key `physiq_logo` (base64) + `physiq_logo_mime` — uploaded logo

**Key global variables in `app.js`:**
- `selectedFile` — audio file selected by the user
- `transcriptText` — transcript returned by Whisper
- `lastReportText` — generated report text (also used for `.docx`)
- `selectedTemplate` — `'brief'` or `'narrative'`
- `window._physiqVContext` — structured assessment payload from PhysiQ-Assessment (added as part of integration)

## Core pipeline

1. User uploads audio → `transcribeAudio()` POSTs to Whisper worker → raw transcript stored in `transcriptText`
2. `buildPrompt()` constructs a template-specific prompt (brief "ficha" vs. full CIF narrative) + patient info
3. `analyzeWithClaude()` POSTs transcript + prompt to Claude worker → returns markdown report text
4. `renderReport()` parses markdown (sections ##/###/####, tables, hyperlinks) and renders HTML preview
5. `downloadWord()` builds a `.docx` using the `docx` library with clinic branding (logo, colors, fonts)

## Key functions to know

| Function | Purpose |
|---|---|
| `buildPrompt()` | Constructs the Claude prompt; switches between `brief` and `narrative` templates with explicit CIF instructions |
| `renderReport()` | Parses markdown sections into collapsible HTML; calls `parseTablesInText()` and `parseHyperlinks()` |
| `downloadWord()` | Builds `.docx` with custom header (logo + clinic info), footer (page numbers), and section-aware styling |
| `loadDocx()` | Dynamic CDN loader with 3 fallbacks; must resolve before `downloadWord()` is called |
| `saveConfig()` / `loadConfig()` | Serializes the entire UI state to/from `physiq_config` in localStorage |
| `generateReport()` | Orchestrates the full pipeline; updates a 3-step progress indicator |

## Report templates

`selectedTemplate` is either `'brief'` or `'narrative'` (default). This controls which prompt is built in `buildPrompt()`. The narrative template follows the CIF biopsychosocial framework with specific sections the truncation-detection logic checks for.

## Truncation detection

After Claude responds, the app inspects `lastReportText` for expected final sections. If the text ends abruptly or is missing expected closing sections, a warning is shown. Token limit is user-configurable (1000–7000 tokens via a slider).

## Cloudflare Workers

The two workers are external to this repo. They proxy requests to the Whisper API and Anthropic API respectively. If either endpoint changes, update the hardcoded URLs near the top of `app.js`.

## Code conventions

- HTML/CSS/JS split across `index.html` (markup + CSS) and `app.js` (all logic)
- No npm dependencies — libraries loaded via CDN (docx.js, etc.)
- CSS variables in `:root`: `--bg`, `--surface`, `--border`, `--accent` (green), `--accent2` (blue), `--text`, `--text-muted`, `--danger`
- Fonts: DM Serif Display (headings), DM Mono (code/labels), DM Sans (body)
- `localStorage` key: `physiq_config` — clinic configuration and style

---

## Sibling repo: physiq-assessment

`physiq-assessment-standalone.html` (separate repo, also GitHub Pages) is an assessment assistant that guides the physiotherapist through 5 phases:

- **Phase 1** — Triage and header (patient, mechanism, red flags)
- **Phase 2** — Systemic screening by anatomical region
- **Phase 3** — SINSS (severity, irritability, NRS)
- **Phase 4** — CIF decision tree → diagnostic hypotheses
- **Phase 4b** — Orthopaedic tests with likelihood ratios
- **Phase 5** — Summary with scores, recommended PROM, and plan notes

All data accumulates in a global `state` object (declared around line 3815 of the HTML).

---

## Planned integration: PhysiQ-Assessment → PhysiQ

### Mechanism: URL param with Base64

At the end of Phase 5, PhysiQ-Assessment will add a **"Generar informe CIF-AFTA"** button that:

1. Builds a JSON payload with the relevant fields from `state`
2. Encodes it as Base64
3. Opens PhysiQ with `?v=<base64>` in the URL

PhysiQ detects `?v=` on load, decodes it, and:
- Pre-fills form fields (name, date, diagnosis)
- Injects the structured clinical context into the Claude prompt

**Measured payload size:** worst case ~3.2 KB in Base64. nginx GitHub Pages limit: 8 KB. No issue.

### Payload (function `buildPhysiQPayload()` — to add in PhysiQ-Assessment, Phase 5)

```js
function buildPhysiQPayload() {
  return {
    p:  state.patient,
    r:  state.region,
    d:  new Date().toLocaleDateString('es-ES'),
    mo: state.motivoConsulta,
    oc: state.occupation ?? '',
    nr: [state.severidad ?? 0, state.nrsMovimiento ?? 0, state.nrsNocturno ?? 0],
    ir: state.irritabilidadNivel,
    co: state.naturaleza,
    si: state.sistemicoAlerta,   // boolean — flag only, not detail
    h:  state.activeHypotheses.map(id => ({
          id,
          name: HYPOTHESES[id]?.name,
          sc:   state.hypothesisScores[id]?.label,
          lr:   state.hypothesisScores[id]?.totalLR,
          tests: (state.testResults[id] || {})
        })),
    pn: state.planNotes          // { variableControl, ventanaRecuperacion, anclajeHabito }
  };
}

function exportToPhysiQ() {
  const payload = buildPhysiQPayload();
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  window.open(`https://physiodevapp.github.io/physiq-report/?v=${encoded}`);
}
```

### Reception in PhysiQ (to add in `app.js`)

```js
function loadFromPhysiQAssessment() {
  const params = new URLSearchParams(location.search);
  const v = params.get('v');
  if (!v) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(atob(v))));
  } catch(e) {
    console.warn('PhysiQ-Assessment payload inválido', e);
    return null;
  }
}

function applyPhysiQAssessmentContext(data) {
  if (!data) return;
  const name = document.getElementById('patient-name');
  if (name && data.p) name.value = data.p;

  const date = document.getElementById('session-date');
  if (date && data.d) date.value = data.d;

  const diag = document.getElementById('diagnosis');
  if (diag && data.r) diag.value = data.r;

  window._physiqVContext = data;
  showImportedBadge(data);
}

function showImportedBadge(data) {
  const badge = document.createElement('div');
  badge.style.cssText = `
    background:rgba(79,195,161,0.1); border:1px solid rgba(79,195,161,0.3);
    border-radius:8px; padding:10px 14px; font-size:12px;
    color:var(--accent); font-family:'DM Mono',monospace; margin-bottom:12px;
  `;
  badge.innerHTML = `✓ Valoración importada desde PhysiQ-Assessment · ${data.r || ''} · ${data.p || ''}`;
  const main = document.querySelector('main');
  if (main) main.prepend(badge);
}
```

### Clinical context injected into the prompt

In `buildPrompt()` in `app.js`, add before the transcript block:

```js
function buildClinicalContext(data) {
  if (!data) return '';
  const hyps = (data.h || [])
    .map(h => `  · ${h.name} — ${h.sc || 'sin evaluar'}`)
    .join('\n');
  const flags = data.si ? '⚠️ Banderas sistémicas positivas detectadas' : 'Sin banderas sistémicas';
  return `
## DATOS DE VALORACIÓN ESTRUCTURADA (PhysiQ-Assessment)
Paciente: ${data.p || '—'} · Región: ${data.r || '—'} · Fecha: ${data.d || '—'}
Motivo de consulta: ${data.mo || '—'}
NRS: reposo ${data.nr?.[0] ?? '—'}/10 · movimiento ${data.nr?.[1] ?? '—'}/10
Irritabilidad: ${data.ir || '—'} · Comportamiento: ${data.co || '—'}
Cribado sistémico: ${flags}

Hipótesis diagnósticas (por peso diagnóstico):
${hyps || '  (sin hipótesis registradas)'}

Notas del plan terapéutico:
  · Variable de control: ${data.pn?.variableControl || '—'}
  · Ventana de recuperación: ${data.pn?.ventanaRecuperacion || '—'}
  · Anclaje de hábito: ${data.pn?.anclajeHabito || '—'}

---
`.trim();
}
```

And in `buildPrompt(transcript, info, template)`:

```js
const clinicalCtx = buildClinicalContext(window._physiqVContext);
const prompt = `${systemPrompt}\n\n${clinicalCtx}\n\n## TRANSCRIPCIÓN DE LA SESIÓN\n${transcript}`;
```

If there is no transcript (assessment-only flow), replace the transcript section with:
```
## TRANSCRIPCIÓN DE LA SESIÓN
(No disponible — informe basado exclusivamente en los datos de la valoración estructurada)
```

---

## Pending integration tasks

- [ ] Add `buildPhysiQPayload()` and `exportToPhysiQ()` in PhysiQ-Assessment (Phase 5, button after summary)
- [ ] Add `loadFromPhysiQAssessment()` and `applyPhysiQAssessmentContext()` in PhysiQ `app.js` (called at startup)
- [ ] Add `buildClinicalContext()` in `app.js` and wire it into `buildPrompt()`
- [ ] Handle no-audio flow: if `_physiqVContext` exists and no `selectedFile`, allow report generation without transcript
- [ ] Add "Copiar contexto clínico" button as fallback in PhysiQ-Assessment Phase 5
- [ ] Update the CIF-AFTA prompt to leverage structured context (instruct Claude that assessment data is more reliable than the transcript)
