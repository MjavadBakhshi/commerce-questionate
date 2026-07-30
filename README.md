# Questionate

A production-ready research survey for online shop owners. Collects workflow insights via a beautiful landing page questionnaire and stores responses in Supabase.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Hook Form** + **Zod**
- **Supabase** (PostgreSQL + JSONB)
- **Vercel** (deployment target)

## Features

- Premium mobile-first survey landing page
- 20 structured questions + final open-ended response
- Auto-save to LocalStorage (resume after refresh)
- Instagram username capture for early access (+ URL prefill via `?instagram=`)
- Password-protected admin dashboard at `/admin`
- Search, date filters, detail view, CSV export

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Follow [docs/supabase-setup.md](docs/supabase-setup.md):

1. Create a Supabase project
2. Run the SQL migration in `supabase/migrations/001_create_survey_responses.sql`
3. Copy your API keys

### 3. Environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-or-service-role-key
ADMIN_PASSWORD=choose-a-strong-password
```

Optional:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Verify setup

```bash
npm run test:supabase   # DB connection + table access
npm run test:phase3     # Survey schema + question definitions
npm run build           # Production build
```

## Admin Dashboard

1. Visit [http://localhost:3000/admin](http://localhost:3000/admin)
2. Sign in with your `ADMIN_PASSWORD`
3. View responses, search, filter by date, export CSV (`survey-responses.csv`)

## Survey URL Parameters

Pre-fill the Instagram username:

```
https://your-domain.com/?instagram=sarasboutique
```

Also supports `?username=`, `?user=`, and `?name=`.

## Deploy to Vercel

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.local.example`
4. Deploy

## Project Structure

```text
app/                  # Routes, layouts, server actions
components/           # UI, survey, admin, landing
hooks/                # Auto-save, progress
lib/                  # Schema, questions, Supabase client
services/             # Database service layer
supabase/migrations/  # SQL migrations
types/                # TypeScript interfaces
utils/                # CSV export, localStorage
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run test:supabase` | Test Supabase connection |
| `npm run test:phase3` | Test survey data layer |

## License

Private — all rights reserved.
