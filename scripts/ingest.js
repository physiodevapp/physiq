#!/usr/bin/env node
// Embeds knowledge/*.md files and upserts chunks into Supabase pgvector.
//
// Usage:
//   node scripts/ingest.js                    # process all knowledge/**/*.md
//   node scripts/ingest.js knowledge/x.md     # process specific files
//
// Env: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
//
// Each H2 section (## Heading) in a .md file becomes one chunk.
// If a file no longer exists on disk, its chunks are deleted from Supabase.

'use strict';

const { readFileSync, readdirSync, statSync, existsSync } = require('fs');
const { join, relative } = require('path');

const ROOT = join(__dirname, '..');
const KNOWLEDGE_DIR = join(ROOT, 'knowledge');

// --- frontmatter parser (handles the limited YAML subset we use) ---

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+?)\s*$/);
    if (!kv) continue;
    const [, k, raw] = kv;
    if (raw.startsWith('[')) {
      meta[k] = raw.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    } else {
      meta[k] = raw.replace(/^["']|["']$/g, '');
    }
  }
  return { meta, body: m[2] };
}

// --- chunk splitter ---

function splitH2(body) {
  return body.split(/(?=^## )/m).map(s => s.trim()).filter(Boolean);
}

function titleOf(section) {
  const m = section.match(/^## (.+)/);
  return m ? m[1].trim() : '';
}

// --- file finder ---

function findMdFiles(dir) {
  if (!existsSync(dir)) return [];
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(full));
    } else if (entry.name.endsWith('.md') && !entry.name.startsWith('.')) {
      results.push(full);
    }
  }
  return results;
}

// --- OpenAI embeddings ---

async function embed(texts) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: texts }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const { data } = await res.json();
  return data.map(d => d.embedding);
}

// --- Supabase REST helpers ---

async function sbFetch(method, path, body) {
  const res = await fetch(`${process.env.SUPABASE_URL}${path}`, {
    method,
    headers: {
      'apikey':        process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
}

function deleteChunksForFile(relpath) {
  return sbFetch('DELETE', `/rest/v1/chunks?file=eq.${encodeURIComponent(relpath)}`);
}

function insertChunks(rows) {
  return sbFetch('POST', '/rest/v1/chunks', rows);
}

// --- per-file ingest ---

async function ingestFile(filepath) {
  const relpath = relative(ROOT, filepath);

  if (!existsSync(filepath)) {
    await deleteChunksForFile(relpath);
    console.log(`  deleted: ${relpath}`);
    return;
  }

  const { meta, body } = parseFrontmatter(readFileSync(filepath, 'utf8'));
  const sections = splitH2(body);

  if (!sections.length) {
    console.log(`  skip (no H2 sections): ${relpath}`);
    return;
  }

  const embeddings = await embed(sections);

  const rows = sections.map((s, i) => ({
    content:   s,
    embedding: embeddings[i],
    title:     titleOf(s),
    category:  meta.category || null,
    region:    meta.region   || null,
    source:    meta.source   || null,
    tags:      Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
    file:      relpath,
  }));

  await deleteChunksForFile(relpath);
  await insertChunks(rows);

  console.log(`  ${relpath}: ${rows.length} chunk(s)`);
}

// --- main ---

async function main() {
  for (const k of ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_KEY']) {
    if (!process.env[k]) { console.error(`Missing env: ${k}`); process.exit(1); }
  }

  const args = process.argv.slice(2).filter(a => a.endsWith('.md'));
  const files = args.length ? args.map(a => join(ROOT, a)) : findMdFiles(KNOWLEDGE_DIR);

  if (!files.length) { console.log('No .md files found.'); return; }

  console.log(`Ingesting ${files.length} file(s)...`);
  for (const f of files) {
    await ingestFile(f).catch(e => console.error(`  ERROR ${relative(ROOT, f)}: ${e.message}`));
  }
  console.log('Done.');
}

main();
