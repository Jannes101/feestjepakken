-- ============================================================
-- feestjepakken — database migratie v1
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ── ENUM types ────────────────────────────────────────────────

create type uitje_type as enum (
  'techno','concert','theater','film','festival',
  'sport','museum','bar','opera','comedy','expo','overig'
);

create type situatie_type as enum (
  'single','relatie','getrouwd','liever_niet_zeggen'
);

create type reis_afstand_type as enum (
  'eigen_stad','25km','50km','heel_nl'
);

create type reactie_status as enum (
  'pending','geaccepteerd','afgewezen'
);

create type transactie_type as enum (
  'aankoop_credits','gebruik_credit'
);

-- ── TABELLEN ─────────────────────────────────────────────────

-- Gebruikersprofielen (uitbreiding op auth.users)
create table public.users (
  id                      uuid references auth.users(id) on delete cascade primary key,
  email                   text not null,
  naam                    text not null,
  leeftijd                integer not null check (leeftijd between 24 and 50),
  woonplaats              text not null,
  bio                     text,
  situatie                situatie_type not null default 'liever_niet_zeggen',
  reis_afstand            reis_afstand_type not null default '50km',
  uitje_types             uitje_type[] not null default '{}',
  credits                 integer not null default 0 check (credits >= 0),
  gratis_reactie_gebruikt boolean not null default false,
  avatar_url              text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Uitjes
create table public.uitjes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete cascade not null,
  titel         text not null,
  beschrijving  text not null,
  type          uitje_type not null,
  datum         date,
  locatie       text not null,
  max_personen  integer not null default 1 check (max_personen between 1 and 10),
  actief        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Reacties op uitjes
create table public.reacties (
  id           uuid primary key default uuid_generate_v4(),
  uitje_id     uuid references public.uitjes(id) on delete cascade not null,
  van_user_id  uuid references public.users(id) on delete cascade not null,
  bericht      text not null,
  status       reactie_status not null default 'pending',
  created_at   timestamptz not null default now(),
  unique(uitje_id, van_user_id)
);

-- Ratings (1-5 sterren) na een uitje
create table public.ratings (
  id              uuid primary key default uuid_generate_v4(),
  beoordelaar_id  uuid references public.users(id) on delete cascade not null,
  beoordeelde_id  uuid references public.users(id) on delete cascade not null,
  uitje_id        uuid references public.uitjes(id) on delete cascade not null,
  sterren         integer not null check (sterren between 1 and 5),
  opmerking       text,
  created_at      timestamptz not null default now(),
  unique(beoordelaar_id, beoordeelde_id, uitje_id)
);

-- Transacties (credits kopen / gebruiken)
create table public.transacties (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete cascade not null,
  bedrag        numeric(6,2) not null,
  type          transactie_type not null,
  credits_delta integer not null,
  mollie_id     text,
  created_at    timestamptz not null default now()
);

-- ── INDEXES ──────────────────────────────────────────────────

create index on public.uitjes(user_id);
create index on public.uitjes(type);
create index on public.uitjes(actief);
create index on public.reacties(uitje_id);
create index on public.reacties(van_user_id);
create index on public.ratings(beoordeelde_id);
create index on public.transacties(user_id);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────

alter table public.users       enable row level security;
alter table public.uitjes      enable row level security;
alter table public.reacties    enable row level security;
alter table public.ratings     enable row level security;
alter table public.transacties enable row level security;

-- Users: iedereen kan profielen lezen, alleen eigen profiel bewerken
create policy "Profielen zijn publiek leesbaar"
  on public.users for select using (true);

create policy "Eigen profiel aanmaken"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Eigen profiel bijwerken"
  on public.users for update
  using (auth.uid() = id);

-- Uitjes: iedereen kan uitjes lezen, eigen uitjes bewerken
create policy "Uitjes zijn publiek leesbaar"
  on public.uitjes for select using (true);

create policy "Eigen uitje aanmaken"
  on public.uitjes for insert
  with check (auth.uid() = user_id);

create policy "Eigen uitje bijwerken"
  on public.uitjes for update
  using (auth.uid() = user_id);

create policy "Eigen uitje verwijderen"
  on public.uitjes for delete
  using (auth.uid() = user_id);

-- Reacties: betrokken partijen kunnen reacties zien
create policy "Reacties zichtbaar voor betrokkenen"
  on public.reacties for select
  using (
    auth.uid() = van_user_id or
    auth.uid() = (select user_id from public.uitjes where id = uitje_id)
  );

create policy "Ingelogde gebruiker kan reageren"
  on public.reacties for insert
  with check (auth.uid() = van_user_id);

create policy "Uitje-eigenaar kan reactie bijwerken"
  on public.reacties for update
  using (
    auth.uid() = (select user_id from public.uitjes where id = uitje_id)
  );

-- Ratings: eigen ratings beheren, alle ratings lezen
create policy "Ratings zijn publiek leesbaar"
  on public.ratings for select using (true);

create policy "Eigen rating aanmaken"
  on public.ratings for insert
  with check (auth.uid() = beoordelaar_id);

-- Transacties: alleen eigen transacties
create policy "Eigen transacties zien"
  on public.transacties for select
  using (auth.uid() = user_id);

-- ── FUNCTIES & TRIGGERS ──────────────────────────────────────

-- updated_at automatisch bijwerken
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

-- Nieuw auth.user → profiel aanmaken
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, naam, leeftijd, woonplaats)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'naam', 'Nieuw lid'),
    coalesce((new.raw_user_meta_data->>'leeftijd')::integer, 25),
    coalesce(new.raw_user_meta_data->>'woonplaats', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
