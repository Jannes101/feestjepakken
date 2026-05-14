-- ============================================================
-- feestjepakken — database migratie v6
-- Geslacht, gender op users; deelname_voorkeur op uitjes
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- ── Kolommen op users ────────────────────────────────────────

alter table public.users
  add column if not exists geslacht text not null default 'anders'
    check (geslacht in ('man', 'vrouw', 'anders')),
  add column if not exists gender text not null default 'zeg_liever_niet'
    check (gender in ('man', 'vrouw', 'non_binair', 'anders', 'zeg_liever_niet'));

-- ── Kolom op uitjes ──────────────────────────────────────────

alter table public.uitjes
  add column if not exists deelname_voorkeur text not null default 'iedereen'
    check (deelname_voorkeur in ('iedereen', 'alleen_mannen', 'alleen_vrouwen', 'alleen_non_binair'));

-- ── Trigger bijwerken zodat geslacht/gender ook worden opgeslagen ──

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, naam, leeftijd, woonplaats, geslacht, gender)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'naam', 'Nieuw lid'),
    coalesce((new.raw_user_meta_data->>'leeftijd')::integer, 25),
    coalesce(new.raw_user_meta_data->>'woonplaats', ''),
    coalesce(new.raw_user_meta_data->>'geslacht', 'anders'),
    coalesce(new.raw_user_meta_data->>'gender', 'zeg_liever_niet')
  );
  return new;
end;
$$ language plpgsql security definer;
