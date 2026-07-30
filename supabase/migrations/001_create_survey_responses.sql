-- Questionate: survey_responses table
-- Run in Supabase SQL Editor or via Supabase CLI

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null
);

create index if not exists survey_responses_created_at_idx
  on public.survey_responses (created_at desc);

-- All access goes through Server Actions using the service role key.
alter table public.survey_responses enable row level security;

comment on table public.survey_responses is 'Stores submitted survey answers as JSONB payloads.';
comment on column public.survey_responses.answers is 'Full survey form values keyed by question id (q1–q20, qFinal, *_other).';
