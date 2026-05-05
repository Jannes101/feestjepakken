# feestjepakken — Claude Code instructies

## Project context
Platform om uitjesmaatjes te vinden. Geen datingsite.
Doelgroep: 24–50 jaar, Nederland.

## Tech stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS (fp-* kleur tokens)
- Supabase (auth + database)
- Vercel (hosting)
- Mollie (betalingen, sprint 3)

## Branch strategie
- `main` → productie
- `develop` → integratie
- `feature/FEES-[nummer]` → per Jira ticket

## Commit format
```
feat(FEES-5): korte beschrijving
fix(FEES-8): bug omschrijving
chore: dependency update
```

## Design tokens (Tailwind)
- bg: `bg-fp-bg` (#0E121A)
- cards: `bg-fp-surface` / `bg-fp-surface2`
- tekst: `text-fp-white` / `text-fp-muted`
- accent: `text-fp-red` / `bg-fp-red` (#E8352A)
- fonts: `font-display` (Bebas Neue) / `font-mono` (IBM Plex Mono) / `font-body` (IBM Plex Sans)

## Supabase setup
1. Kopieer `.env.local.example` naar `.env.local`
2. Vul Supabase URL en anon key in
3. Voer `supabase/migrations/001_initial_schema.sql` uit in Supabase SQL Editor

## Huidige sprint (Sprint 1)
- FEES-5: ✅ GitHub repo + Next.js boilerplate
- FEES-6: 🔲 Database schema Supabase
- FEES-7: 🔲 Homepage bouwen in Next.js
- FEES-8: 🔲 Registratie & login via Supabase Auth
- FEES-9: 🔲 CI/CD + hosting via Vercel

## Volgende stap
`git init && git add . && git commit -m "feat(FEES-5): initial Next.js boilerplate" && git push`
