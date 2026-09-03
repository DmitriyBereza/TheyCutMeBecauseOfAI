# TheyCutMeBecauseOfAI

Quick MVP: tracker of big companies (10k+ employees at start of 2025) with layoff waves 2024-2026 + per-company story wall.

## Stack (per your picks)
- Next.js 14 (App Router) + static `data/companies.json`
- Supabase for comments (`supabase/schema.sql`), with localStorage fallback if env not set
- Deploy anywhere (Vercel recommended)

## Run
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Configure comments (Supabase)
1. Create free project at supabase.com
2. Run `supabase/schema.sql` in SQL editor
3. Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Restart dev. Without env, comments save to localStorage only (good for demo).

## Data
- `data/companies.json`: 24 companies, each with `employees_start_2025_approx` + `layoffs[]` with `source_label/source_url`, `ai_related` flag.
- Sources: Layoffs.fyi, Crunchbase Tech Layoffs tally, WorkforceSignal tracker, LayoffHedge, company filings. Numbers differ by tracker — shown as directional.
- Scope: >=10k headcount, >=500 cut per wave, date 2024-01-01..2026-09-01.

To add a company: append JSON entry, slug must match `/company/[slug]`.

## Next steps
- [ ] Add `report` button + `is_hidden` moderation
- [ ] CSV import script from Layoffs.fyi Kaggle dump
- [ ] Charts (total vs AI-flagged over time)
- [ ] Auth + rate-limit to reduce spam
- [ ] SEO / OG pages per company
