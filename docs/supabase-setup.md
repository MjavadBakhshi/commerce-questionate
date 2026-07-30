# Supabase Setup

Follow these steps to connect Questionate to Supabase.

## 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the database to finish provisioning

## 2. Run the migration

Open **SQL Editor** in the Supabase dashboard and run:

[`supabase/migrations/001_create_survey_responses.sql`](../supabase/migrations/001_create_survey_responses.sql)

This creates the `survey_responses` table with:

| Column       | Type        | Description                    |
|--------------|-------------|--------------------------------|
| `id`         | UUID        | Primary key                    |
| `created_at` | TIMESTAMPTZ | Submission timestamp           |
| `answers`    | JSONB       | Full survey answers            |

Row Level Security is enabled. There are **no public policies** — all reads and writes use the **service role key** from Next.js Server Actions only.

## 3. Copy API keys

In **Project Settings → API**, copy:

| Supabase dashboard | `.env.local` variable |
|------------------|----------------------|
| **Project URL** | `NEXT_PUBLIC_SUPABASE_URL` |
| **Publishable key** (or **Anonymous API key** legacy) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Secret key** (or **Service API key** legacy) | `SUPABASE_SERVICE_ROLE_KEY` |

> Use the **legacy** keys if the new publishable/secret keys do not work with your SDK version.  
> Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser or commit it to git.

## 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
```

## 5. Verify

Restart the dev server and submit a test survey once the form is implemented (Phase 6+). Responses should appear in **Table Editor → survey_responses**.
