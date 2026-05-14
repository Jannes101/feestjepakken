-- ============================================================
-- feestjepakken — database migratie v7
-- leeftijdscategorie op uitjes: text → text[] (multi-select)
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- Stap 1: tijdelijke array-kolom aanmaken
alter table public.uitjes
  add column if not exists leeftijdscategorie_arr text[];

-- Stap 2: bestaande waarden migreren naar array
update public.uitjes
  set leeftijdscategorie_arr = array[leeftijdscategorie]
  where leeftijdscategorie_arr is null;

-- Stap 3: oude kolom verwijderen (verwijdert ook de CHECK constraint)
alter table public.uitjes
  drop column leeftijdscategorie;

-- Stap 4: tijdelijke kolom hernoemen
alter table public.uitjes
  rename column leeftijdscategorie_arr to leeftijdscategorie;

-- Stap 5: NOT NULL en default instellen
alter table public.uitjes
  alter column leeftijdscategorie set not null,
  alter column leeftijdscategorie set default array['21_29'];

-- Stap 6: btree index vervangen door GIN (efficiënt voor array-overlap queries)
drop index if exists uitjes_leeftijdscategorie_idx;
create index uitjes_leeftijdscategorie_gin on public.uitjes using gin (leeftijdscategorie);

-- RLS-policies op uitjes filteren NIET op leeftijdscategorie (select = publiek,
-- insert/update/delete = eigen uitje). Geen aanpassingen nodig.
