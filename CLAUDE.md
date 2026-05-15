# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**PhysiQ Report** (CIF-AFTA v4.0) is a single-file clinical documentation tool for physiotherapists. It takes audio recordings of sessions, transcribes them via a Cloudflare Worker backed by Whisper, and generates structured clinical reports (in Spanish) via another Cloudflare Worker backed by Claude.

## Running the app

No build step. Open `index.html` directly in a browser. There is no package.json, no dev server, no compilation.

## Architecture

The entire application lives in [index.html](index.html) — a single HTML file with embedded CSS and JavaScript (~1140 lines). There is no framework, no bundler, no modules.

**External dependencies loaded at runtime:**
- `docx` v8.5.0 from CDN (jsdelivr → unpkg → cloudflare fallbacks) — used for `.docx` export
- Cloudflare Worker endpoints (hardcoded URLs):
  - `https://physiq-whisper.edu-gamboa-rodriguez.workers.dev` — audio transcription (Whisper)
  - `https://physiq-claude.edu-gamboa-rodriguez.workers.dev` — report generation (claude-sonnet-4-5)

**Client-side persistence:**
- `localStorage` key `physiq_config` (JSON) — all UI/clinic settings
- `localStorage` key `physiq_logo` (base64) + `physiq_logo_mime` — uploaded logo

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

The two workers are external to this repo. They proxy requests to the Whisper API and Anthropic API respectively. If either endpoint changes, update the hardcoded URLs near the top of the `<script>` block in `index.html`.
