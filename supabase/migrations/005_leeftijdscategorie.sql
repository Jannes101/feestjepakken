-- ============================================================
-- feestjepakken — database migratie v5
-- Leeftijdscategorie + omvang op uitjes, verruim leeftijdcheck
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- ── Leeftijdconstraint verruimen (was 24–50, nu 21–99) ────────

alter table public.users
  drop constraint if exists users_leeftijd_check;

alter table public.users
  add constraint users_leeftijd_check
    check (leeftijd between 21 and 99);

-- ── max_personen verruimen (was 1–10, nu 1–100) ───────────────

alter table public.uitjes
  drop constraint if exists uitjes_max_personen_check;

alter table public.uitjes
  add constraint uitjes_max_personen_check
    check (max_personen between 1 and 100);

-- ── Kolommen op uitjes ────────────────────────────────────────

alter table public.uitjes
  add column if not exists leeftijdscategorie text not null default '21_29'
    check (leeftijdscategorie in ('21_29', '30_39', '40_49', '50_59', '60_plus')),
  add column if not exists omvang text not null default 'solo'
    check (omvang in ('solo', 'klein', 'groep', 'groot')),
  add column if not exists provincie text;

-- ── Indexes ───────────────────────────────────────────────────

create index if not exists uitjes_leeftijdscategorie_idx on public.uitjes(leeftijdscategorie);
create index if not exists uitjes_omvang_idx on public.uitjes(omvang);
create index if not exists uitjes_provincie_idx on public.uitjes(provincie);
