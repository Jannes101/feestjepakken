-- ============================================================
-- feestjepakken — database migratie v2
-- Social score systeem: beoordelingen tabel + score berekening
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- ── TABEL: beoordelingen ────────────────────────────────────

create table public.beoordelingen (
  id              uuid primary key default uuid_generate_v4(),
  beoordelaar_id  uuid references public.users(id) on delete cascade not null,
  beoordeelde_id  uuid references public.users(id) on delete cascade not null,
  uitje_id        uuid references public.uitjes(id) on delete cascade not null,
  aanbevolen      boolean not null,
  reden           text,
  created_at      timestamptz not null default now(),

  -- Eén beoordeling per combinatie van beoordelaar + beoordeelde + uitje
  unique(beoordelaar_id, beoordeelde_id, uitje_id),

  -- Niemand kan zichzelf beoordelen
  constraint geen_zelfbeoordeling check (beoordelaar_id != beoordeelde_id),

  -- Reden verplicht bij negatieve beoordeling, minimaal 25 tekens
  constraint reden_verplicht_bij_negatief check (
    aanbevolen = true
    or (reden is not null and length(trim(reden)) >= 25)
  )
);

create index on public.beoordelingen(beoordeelde_id);
create index on public.beoordelingen(beoordelaar_id);
create index on public.beoordelingen(uitje_id);

-- ── KOLOMMEN op users ────────────────────────────────────────

alter table public.users
  add column if not exists social_score        numeric(3,1) default null,
  add column if not exists aantal_beoordelingen integer      not null default 0;

-- ── ROW LEVEL SECURITY ────────────────────────────────────────

alter table public.beoordelingen enable row level security;

-- Iedereen kan beoordelingen lezen
create policy "Beoordelingen zijn publiek leesbaar"
  on public.beoordelingen for select
  using (true);

-- Alleen ingelogde gebruikers kunnen een beoordeling aanmaken als zichzelf
create policy "Ingelogde gebruiker kan beoordeling aanmaken"
  on public.beoordelingen for insert
  with check (auth.uid() = beoordelaar_id);

-- ── FUNCTIE: bereken_social_score ────────────────────────────
-- Formule: 5 + (positief / totaal) * 5  →  bereik 5.0–10.0
-- Geeft null terug bij 0 beoordelingen

create or replace function public.bereken_social_score(user_uuid uuid)
returns numeric(3,1) as $$
declare
  totaal    integer;
  positief  integer;
begin
  select
    count(*)                                    into totaal
  from public.beoordelingen
  where beoordeelde_id = user_uuid;

  if totaal = 0 then
    return null;
  end if;

  select
    count(*) filter (where aanbevolen = true)   into positief
  from public.beoordelingen
  where beoordeelde_id = user_uuid;

  return round(5 + (positief::numeric / totaal::numeric) * 5, 1);
end;
$$ language plpgsql stable security definer;

-- ── TRIGGER FUNCTIE ──────────────────────────────────────────

create or replace function public.handle_nieuwe_beoordeling()
returns trigger as $$
begin
  update public.users
  set
    social_score         = public.bereken_social_score(new.beoordeelde_id),
    aantal_beoordelingen = aantal_beoordelingen + 1
  where id = new.beoordeelde_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_beoordeling_aangemaakt
  after insert on public.beoordelingen
  for each row execute function public.handle_nieuwe_beoordeling();
