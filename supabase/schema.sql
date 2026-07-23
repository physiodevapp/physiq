-- PhysiQ clinical knowledge base — Supabase setup
-- Run once in the Supabase SQL editor for your project.

-- 1. Enable pgvector
create extension if not exists vector;

-- 2. Chunks table
--    Each row is one H2 section from a knowledge/*.md file.
--    text-embedding-3-small produces 1536-dimensional vectors.
create table if not exists chunks (
  id         bigserial    primary key,
  content    text         not null,
  embedding  vector(1536) not null,
  title      text,
  category   text,   -- differential | redflags | assessment | protocol
  region     text,   -- lumbar | cervical | shoulder | knee | hip | ankle | global
  source     text,
  tags       text[],
  file       text,   -- repo-relative path of the source .md file
  created_at timestamptz default now()
);

-- 3. HNSW index for fast cosine similarity search
create index if not exists chunks_embedding_idx
  on chunks using hnsw (embedding vector_cosine_ops);

-- 4. match_chunks — called by the Cloudflare Worker via REST RPC
--    Returns top-N chunks above min_similarity (cosine).
--    filter_category and the region filters are optional pre-filters.
--    Region filtering supports two forms (both optional):
--      * filter_regions text[] — the Worker's adjacency array (preferred),
--        e.g. a lumbar session sends ['lumbar','hip','global'].
--      * filter_region  text   — legacy single region, kept for backward
--        compatibility with older Worker builds.
--    'global' chunks are always eligible (transversal screening content).
--    Returns the chunk's `source` so the Worker can ground answers and cite it.
drop function if exists match_chunks(vector, int, text, text, float);
drop function if exists match_chunks(vector, int, text, text, text[], float);

create or replace function match_chunks(
  query_embedding  vector(1536),
  match_count      int    default 5,
  filter_category  text   default null,
  filter_region    text   default null,
  filter_regions   text[] default null,
  min_similarity   float  default 0.5
)
returns table (
  id          bigint,
  content     text,
  title       text,
  category    text,
  region      text,
  source      text,
  similarity  float
)
language plpgsql
as $$
begin
  return query
  select
    c.id,
    c.content,
    c.title,
    c.category,
    c.region,
    c.source,
    (1 - (c.embedding <=> query_embedding))::float as similarity
  from chunks c
  where
    (filter_category is null or c.category = filter_category)
    and (
      (filter_region is null and filter_regions is null)
      or c.region = filter_region
      or c.region = any(filter_regions)
      or c.region = 'global'
    )
    and (1 - (c.embedding <=> query_embedding)) >= min_similarity
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 5. RLS — public read, writes go through service role key only
alter table chunks enable row level security;

create policy "chunks are publicly readable"
  on chunks for select
  using (true);

-- 6. Grants — service_role needs explicit object privileges (bypasses RLS but still needs GRANT)
grant all on public.chunks to service_role;
grant usage, select on sequence public.chunks_id_seq to service_role;
