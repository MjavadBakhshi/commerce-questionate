# Questionate v2 — Multilingual Survey Plan (Persian First)

This plan extends Questionate to collect responses from **Persian online shop owners** while keeping the current **English survey unchanged**. Arabic is out of scope for v2, but the architecture should make adding it straightforward later.

**Related docs:** [plan.md](./plan.md) (v1), [build-prompt.md](./build-prompt.md)

---

## Goals

| Goal | Approach |
|------|----------|
| Separate Persian questions from English | Locale-specific content modules, not inline translations |
| Different option sets per locale | Same question IDs (`q1`–`q20`, `qFinal`), locale-specific `options[]` |
| Persian typography (B Yekan / BYekan) | Self-hosted font via `next/font/local`, RTL layout for `/fa` |
| Admin filter by language | `locale` column on `survey_responses` + dashboard filter |
| Future Arabic support | Shared locale registry pattern; add `ar` later without refactor |

---

## Non-Goals (v2)

- Full i18n framework (next-intl, react-i18n, etc.) — not needed yet
- Automatic translation of English content
- Arabic survey content or RTL tuning for Arabic
- Separate Supabase tables per locale

---

## Architecture Overview

### Core principle: **stable question IDs, locale-specific content**

Keep `q1`, `q2`, … `q20`, `qFinal`, `*_other`, `respondentName` as field keys in JSONB for all locales. This lets you:

- Compare answers across languages in admin/CSV
- Reuse form components, progress logic, and autosave structure
- Store Persian-specific option labels as the saved answer values

### Locale registry

Introduce a small registry instead of one global `survey-questions.ts`:

```text
lib/survey/
  locales/
    en/
      copy.ts          # hero, success, validation messages
      questions.ts     # sections + questions + options (current English)
      schema.ts        # Zod schema factory or static schema
    fa/
      copy.ts          # Persian UI copy
      questions.ts     # Persian sections, labels, options
      schema.ts        # Persian validation messages + rules
  index.ts             # getSurveyLocaleConfig(locale), SUPPORTED_LOCALES
  types.ts             # SurveyLocale, SurveyLocaleConfig
```

```typescript
type SurveyLocale = "en" | "fa"; // extend with "ar" later

interface SurveyLocaleConfig {
  locale: SurveyLocale;
  dir: "ltr" | "rtl";
  fontClass: string;           // CSS variable / className from layout
  copy: LocaleCopy;
  sections: SurveySection[];
  finalSection: { id; title; description };
  questions: SurveyQuestion[];
  otherOption: string;         // "Other" vs "سایر"
  schema: ZodSchema;           // or buildSurveySchema(config)
}
```

### Routing

| URL | Language | Direction | Font |
|-----|----------|-----------|------|
| `/` or `/en` | English | LTR | Inter (current) |
| `/fa` | Persian | RTL | B Yekan / BYekan |

Recommended structure:

```text
app/
  [locale]/
    page.tsx           # Hero + SurveyForm(locale)
    success/page.tsx   # Localized thank-you page
  page.tsx             # redirect to /en OR keep as alias
```

Admin stays locale-agnostic at `/admin`.

### Database

Add an explicit locale column (do **not** rely only on guessing from answer text):

```sql
-- supabase/migrations/002_add_locale_to_survey_responses.sql
alter table public.survey_responses
  add column if not exists locale text not null default 'en';

alter table public.survey_responses
  add constraint survey_responses_locale_check
  check (locale in ('en', 'fa'));

create index if not exists survey_responses_locale_idx
  on public.survey_responses (locale);

create index if not exists survey_responses_locale_created_at_idx
  on public.survey_responses (locale, created_at desc);
```

**Backfill:** existing rows default to `'en'`.

**Insert:** server action passes `locale` from the page route, not from client-only input.

---

## Phase 0 — Decisions (before coding) ✅ Complete

Locked in code — see [v2-phase0-decisions.md](./v2-phase0-decisions.md).

| Decision | Status |
|----------|--------|
| Default locale URL `/`, Persian `/fa` | ✅ `lib/survey/config.ts` |
| Locale registry (`en`, `fa`) | ✅ `lib/survey/registry.ts` |
| English content module (`ready: true`) | ✅ `lib/survey/locales/en/` |
| Persian stub (`ready: false`) | ✅ `lib/survey/locales/fa/` |
| Schema factory per locale | ✅ `lib/survey/build-schema.ts` |
| Per-locale draft keys | ✅ `getSurveyDraftKey()` |
| Types for `SurveyLocale` + filters | ✅ `types/survey.ts` |
| BYekan font folder placeholder | ✅ `public/fonts/byekan/` |
| Registry smoke test | ✅ `npm run test:locales` |

**Still needed before Phase 3:** final Persian question text + option lists (replace `[FA]` placeholders).

---

## Phase 1 — Refactor English into locale architecture (no user-visible change) ✅ Complete

English UI now reads from `getSurveyLocaleConfig("en")` via locale props and shared helpers.

| Area | Status |
|------|--------|
| `SurveyForm` + `HeroSection` accept `locale` prop | ✅ |
| `QuestionField` uses locale `otherOptionLabel` | ✅ |
| Autosave/progress hooks are locale-aware | ✅ |
| `survey-display` + CSV export accept locale | ✅ |
| Success page uses locale copy | ✅ |
| Deprecated re-exports kept in `lib/survey-questions.ts` | ✅ |

---

## Phase 2 — Database migration: `locale` column ✅ Complete

### Steps

1. Add `supabase/migrations/002_add_locale_to_survey_responses.sql` (see SQL above).

2. Update types in `types/survey.ts`:

   ```typescript
   export type SurveyLocale = "en" | "fa";

   export interface SurveyResponseRecord {
     id: string;
     created_at: string;
     locale: SurveyLocale;
     answers: SurveyAnswers;
   }

   export interface SurveyResponseFilters {
     from?: string;
     to?: string;
     locale?: SurveyLocale | "all";
   }
   ```

3. Update `services/surveyService.ts`:
   - `createSurveyResponse(answers, locale)`
   - `querySurveyResponses({ locale, search, filters })`
   - `filterSurveyResponses` / count queries respect `locale`

4. Update `app/actions/survey.ts` to accept and validate `locale`.

5. Extend `scripts/test-supabase.mjs` to insert/read/delete with `locale`.

### Verification

```bash
npm run test:supabase
```

Confirm in Supabase Table Editor: new submissions include `locale`.

| Area | Status |
|------|--------|
| Migration `002_add_locale_to_survey_responses.sql` | ✅ |
| `createSurveyResponse(answers, locale)` | ✅ |
| Query/filter/count by locale | ✅ |
| `submitSurvey` passes locale | ✅ |
| CSV export includes `locale` column | ✅ |
| `npm run test:supabase` updated | ✅ |

**Before deploy:** run migration `002` in Supabase SQL Editor.

---

## Phase 3 — Persian content module

**Purpose:** Add full Persian survey content as a separate module (not mixed with English).

### Steps

1. Create `lib/survey/locales/fa/copy.ts`:
   - Hero title/subtitle/CTA
   - Success page copy
   - Restore draft dialog copy
   - Instagram username field label + helper text

2. Create `lib/survey/locales/fa/questions.ts`:
   - Mirror section structure (5 sections + final question)
   - Translate all labels/descriptions
   - Define **Persian-specific options** where market differs (e.g. local platforms, payment methods, shipping couriers)
   - Set `otherOption: "سایر"` (or chosen label)

3. Create `lib/survey/locales/fa/schema.ts`:
   - Same field keys as English
   - Persian validation error messages
   - Same structural rules (max 2 / max 3 selections, final question min/max length)
   - Instagram username validation unchanged (Latin characters)

4. Register `fa` in `lib/survey/index.ts`.

### Content checklist (Persian)

- [ ] 5 section titles + descriptions
- [ ] 20 numbered questions + final open question
- [ ] All option lists reviewed for Iran-specific relevance
- [ ] Conditional questions (`q6`, `q11`, `q17`) still wired to correct parent values
- [ ] `OTHER_OPTION` follow-up placeholders in Persian

### Verification

Unit-style check (add to `scripts/test-phase3.ts`):

- FA config loads 21 questions
- Every `SurveyQuestion.id` matches EN ids
- Schema accepts valid FA payload; rejects invalid FA payload

---

## Phase 4 — Persian route + RTL layout

### Steps

1. Add `app/[locale]/page.tsx` and `app/[locale]/success/page.tsx`.

2. Add `app/[locale]/layout.tsx`:
   - Validate `locale` param (`en` | `fa` only; 404 otherwise)
   - Set `<html lang={locale} dir={dir}>`
   - Apply locale font class on `<body>`

3. Root `app/page.tsx`:
   - Option A: render English survey directly (keep `/`)
   - Option B: redirect `/` → `/en`
   - **Recommend Option A** to avoid breaking existing links

4. Pass `locale="fa"` into `HeroSection`, `SurveyForm`, success page.

5. Update `submitSurvey` server action to receive `locale` from hidden field or action binding.

### RTL UI adjustments

Review and fix for `dir="rtl"`:

- `components/survey/option-grid.tsx` — grid alignment
- Search icon padding in admin (unaffected)
- Progress bar / section cards — logical properties (`ms-`, `me-`, `text-start`)
- Dialog close button position

Use Tailwind logical utilities: `ps-`, `pe-`, `start-`, `end-` instead of `pl-`/`pr-` where needed.

### Verification

- `/fa` renders Persian text
- Page direction is RTL
- Submit creates row with `locale = 'fa'`
- `/` still English LTR

---

## Phase 5 — B Yekan (BYekan) font setup

### Steps

1. Obtain font files (`.woff2` preferred):
   - `BYekan.woff2` (regular)
   - `BYekan-Bold.woff2` (if available)

   Place in `public/fonts/byekan/`.

   > **License:** confirm you have rights to self-host. If not, use [Vazirmatn](https://github.com/rastikerdar/vazirmatn) as a free alternative and note in README.

2. Add `lib/fonts.ts`:

   ```typescript
   import localFont from "next/font/local";

   export const byekan = localFont({
     src: [
       { path: "../public/fonts/byekan/BYekan.woff2", weight: "400" },
       { path: "../public/fonts/byekan/BYekan-Bold.woff2", weight: "700" },
     ],
     variable: "--font-byekan",
     display: "swap",
   });
   ```

3. In `app/[locale]/layout.tsx`:
   - `en` → Inter (existing)
   - `fa` → apply `byekan.variable` + `font-[family-name:var(--font-byekan)]`

4. Optional: slightly increase `line-height` and `text-base` on Persian form for readability.

### Verification

- Persian page uses BYekan in DevTools → Computed → font-family
- No FOUT/layout shift on load (`display: "swap"`)
- Latin Instagram username input still readable

---

## Phase 6 — Locale-aware autosave & URL prefill

### Steps

1. Update `utils/local-storage.ts`:
   - `getDraftKey(locale)` → `questionate_survey_draft_${locale}`
   - Migrate: if old `questionate_survey_draft` exists on EN page, import once then clear

2. Update `hooks/use-survey-autosave.ts` to accept `locale`.

3. URL prefill for Persian:
   - `/fa?instagram=handle` (same params as English)

4. “Start fresh” hero button clears locale-specific draft only.

### Verification

- Fill half of FA survey → refresh → answers restored
- EN and FA drafts do not overwrite each other
- Start fresh clears only current locale

---

## Phase 7 — Admin locale filter

### Steps

1. Extend `SurveyResponseFilters` with `locale?: "all" | "en" | "fa"`.

2. Update `services/surveyService.ts` query functions to filter by locale server-side (preferred) or client-side initially.

3. Update `components/admin/admin-dashboard.tsx`:
   - Add filter control: **All languages | English | Persian**
   - Include locale in filtered stats (`StatsCards`: total vs filtered)
   - Show locale badge in `response-list.tsx` (optional but helpful)

4. Update `components/admin/response-detail.tsx`:
   - Load question labels via `getSurveyLocaleConfig(response.locale)`

5. Update `utils/csv-export.ts`:
   - Add `locale` as second column (after `id` or after `created_at`)
   - Column headers from the locale of exported rows (when single-locale export)

6. Update `app/admin/actions.ts` `exportResponsesCsv` to pass locale filter.

### Verification

- Submit one EN + one FA response
- Admin filter “Persian” shows only FA rows
- CSV export respects filter and includes `locale` column

---

## Phase 8 — SEO, metadata & language switcher

### Steps

1. Localized metadata in `app/[locale]/layout.tsx`:
   - `title`, `description`, `openGraph` in Persian for `/fa`

2. Add a small language switcher in hero:
   - English ↔ فارسی
   - Links between `/` and `/fa` (preserve `#survey` anchor)

3. Optional: `hreflang` link tags for EN/FA pages.

### Verification

- View source `/fa`: `lang="fa"` `dir="rtl"`
- Switcher navigates without losing draft (locale-specific storage)

---

## Phase 9 — QA & launch checklist

### Automated

```bash
npm run test:phase3
npm run test:supabase
npm run build
```

### Manual (Persian)

- [ ] All sections render RTL correctly on mobile
- [ ] Checkbox max-selection messages appear in Persian
- [ ] Conditional questions show/hide correctly
- [ ] Final question min/max length enforced
- [ ] Instagram username validation messages in Persian
- [ ] Submit → success page Persian copy
- [ ] Admin: FA response detail shows Persian labels
- [ ] Admin: locale filter + CSV export

### Manual (English regression)

- [ ] `/` unchanged for existing users
- [ ] Old admin records show as `locale = en`
- [ ] Sign out / sign in still works

### Production deploy

1. Run migration `002_add_locale_to_survey_responses.sql` in Supabase **before** deploy
2. `git push origin main` → Vercel redeploy
3. Smoke test `/fa` on production URL

---

## Phase 10 — Future Arabic (design only, not implemented)

When adding Arabic later:

| Area | Action |
|------|--------|
| Locale type | Extend `SurveyLocale` with `"ar"` |
| Migration | `alter constraint` to allow `'ar'` |
| Content | Add `lib/survey/locales/ar/` module |
| Route | `/ar` via existing `[locale]` segment |
| Font | Add Arabic-compatible font (e.g. Noto Sans Arabic) |
| Direction | `dir="rtl"` (same as Persian) |
| Admin filter | Add “Arabic” option |

No work in v2 — just keep the registry + DB constraint extensible.

---

## Suggested implementation order (summary)

| Step | Phase | Outcome |
|------|-------|---------|
| 1 | Phase 0 | Content + font decisions locked |
| 2 | Phase 1 | English refactored into locale module |
| 3 | Phase 2 | DB `locale` column + service layer |
| 4 | Phase 3 | Persian questions/copy/schema |
| 5 | Phase 4 | `/fa` route + RTL |
| 6 | Phase 5 | BYekan font |
| 7 | Phase 6 | Locale-specific autosave |
| 8 | Phase 7 | Admin locale filter + CSV |
| 9 | Phase 8 | Metadata + language switcher |
| 10 | Phase 9 | QA + production deploy |

---

## Open questions (resolve in Phase 0)

1. **Final Persian question text** — direct translation of EN final question, or Iran-specific workflow prompt?
2. **Which platforms/tools** should appear in Persian options (Instagram, Telegram, Digikala, etc.)?
3. **BYekan license** — confirmed for web embedding?
4. **Public URL strategy** — share `/fa` only to Persian cohort, or promote both on homepage?

---

## File map (new / major changes)

```text
docs/v2-plan.md                              # this document
supabase/migrations/002_add_locale_*.sql     # locale column
lib/survey/index.ts                          # locale registry
lib/survey/locales/en/{copy,questions,schema}.ts
lib/survey/locales/fa/{copy,questions,schema}.ts
lib/fonts.ts                                 # BYekan + Inter
public/fonts/byekan/*.woff2
app/[locale]/layout.tsx
app/[locale]/page.tsx
app/[locale]/success/page.tsx
types/survey.ts                              # SurveyLocale, filters
services/surveyService.ts                    # locale-aware CRUD
components/admin/admin-dashboard.tsx         # locale filter UI
utils/local-storage.ts                       # per-locale draft keys
utils/csv-export.ts                          # locale column + labels
scripts/test-phase3.ts                       # FA config tests
```

---

*Start with Phase 0 content prep, then Phase 1 refactor. Each phase should merge independently so production stays stable.*
