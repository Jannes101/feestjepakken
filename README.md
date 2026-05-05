# feestjepakken.nl

> Vind je uitjesmaatje — voor techno, theater, festival, concert en meer.

Geen datingsite. Gewoon iemand vinden om mee op stap te gaan.

## Tech stack

| Laag | Keuze |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Hosting | Vercel |
| Betalingen | Mollie (iDEAL) — sprint 3 |

## Lokaal opstarten

```bash
git clone https://github.com/jouw-username/feestjepakken.git
cd feestjepakken
npm install
cp .env.local.example .env.local
# Vul .env.local in met je Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database setup

1. Maak een gratis project aan op [supabase.com](https://supabase.com)
2. Ga naar **SQL Editor**
3. Voer `supabase/migrations/001_initial_schema.sql` uit
4. Kopieer de project URL en anon key naar `.env.local`

## Jira tickets

Project: **FEES** op [vanderveenjannes.atlassian.net](https://vanderveenjannes.atlassian.net)

| Key | Onderwerp |
|---|---|
| FEES-1 | 🏗️ Basis infrastructuur & project setup |
| FEES-2 | 👤 Gebruikersregistratie & authenticatie |
| FEES-3 | 🎉 Uitjes & reacties systeem |
| FEES-4 | 💳 Betalingen & credits systeem |
| FEES-5 | GitHub repo + Next.js boilerplate ← **jij bent hier** |
| FEES-6 | Database schema Supabase |
| FEES-7 | Homepage bouwen in Next.js |
| FEES-8 | Registratie & login via Supabase Auth |
| FEES-9 | CI/CD + hosting via Vercel |

## Branch strategie

```
main          → productie (auto-deploy via Vercel)
develop       → integratie branch
feature/FEES-* → feature branches per ticket
```

## Businessmodel

- Gratis aanmelden & profielen bekijken
- 1 gratis reactie op een uitje per gebruiker
- Daarna: credits kopen (€2,- per uitje dat daadwerkelijk plaatsvindt)
- Sterren-rating systeem (1–5) na een uitje
