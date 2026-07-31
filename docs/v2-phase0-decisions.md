# Questionate v2 — Phase 0 Decisions (Locked)

Phase 0 establishes the multilingual architecture without changing the live English survey at `/`.

See the full roadmap in [v2-plan.md](./v2-plan.md).

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| Default locale | `en` at `/` (existing links keep working) |
| Persian route | `/fa` (RTL, not public until `ready: true`) |
| Future Arabic | Planned as `ar` — not registered yet |
| Question IDs | Same across locales (`q1`…`qFinal`, `respondentName`, `*_other`) |
| Option labels | Locale-specific (Persian can differ from English) |
| Other option | Per locale (`Other` / `سایر`) |
| Instagram username | Latin validation for all locales |
| Draft storage | `questionate_survey_draft_{locale}` (+ legacy English key) |
| Response filtering | `SurveyResponseRecord.locale` + admin filter (DB in Phase 2) |
| Persian font | B Yekan via `public/fonts/byekan/` (Phase 5) |
| CSV export | Will include `locale` column (Phase 7) |

---

## Code structure added in Phase 0

```text
lib/survey/
  config.ts                 # SUPPORTED_SURVEY_LOCALES, paths, draft keys
  types.ts                  # SurveyLocaleDefinition
  registry.ts               # locale registry + ID parity checks
  build-schema.ts           # Zod schema factory per locale
  helpers.ts                # getQuestionsBySection(locale), etc.
  locale-utils.ts           # shared helpers for new locales
  locales/en/               # live English content (ready)
  locales/fa/               # Persian UI copy + question stub (not ready)
```

Public API: `import { getSurveyLocaleConfig, SUPPORTED_SURVEY_LOCALES } from "@/lib/survey"`.

---

## Locale readiness

| Locale | UI copy | Questions | Public route |
|--------|---------|-----------|--------------|
| `en` | Ready | Ready | `/` (live) |
| `fa` | Ready (Persian shell) | Stub (`[FA]` placeholders) | Blocked until Phase 3 |

Set `ready: true` in `lib/survey/locales/fa/index.ts` only after final Persian question text is approved.

---

## Adding a new locale later (e.g. Arabic)

1. Add `"ar"` to `SUPPORTED_SURVEY_LOCALES` in `lib/survey/config.ts`
2. Create `lib/survey/locales/ar/{copy,questions,index}.ts`
3. Register in `lib/survey/registry.ts`
4. Extend DB constraint + admin filter labels
5. Add font + `/ar` route layout

Question IDs must match the English baseline — enforced by `assertMatchingQuestionIds()` at startup.

---

## Verification

```bash
npm run test:locales
npm run test:phase3
npm run build
```

---

## Next step

**Phase 1** — Wire the English UI to read from `getSurveyLocaleConfig("en")` everywhere (hero, form, success, admin labels).

**Phase 3** — Replace `[FA]` placeholders in `lib/survey/locales/fa/questions.ts` with final Persian translations and market-specific options.
