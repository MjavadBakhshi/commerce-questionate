-- Questionate v2: add locale column for multilingual survey responses
-- Run in Supabase SQL Editor after 001_create_survey_responses.sql

alter table public.survey_responses
  add column if not exists locale text not null default 'en';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'survey_responses_locale_check'
  ) then
    alter table public.survey_responses
      add constraint survey_responses_locale_check
      check (locale in ('en', 'fa'));
  end if;
end $$;

create index if not exists survey_responses_locale_idx
  on public.survey_responses (locale);

create index if not exists survey_responses_locale_created_at_idx
  on public.survey_responses (locale, created_at desc);

comment on column public.survey_responses.locale is 'Survey language code (en, fa, …).';
