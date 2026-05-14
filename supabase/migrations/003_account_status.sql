-- ============================================================
-- feestjepakken — database migratie v3
-- Account status systeem: schorsing bij 3x negatief op rij
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- ── KOLOMMEN op users ────────────────────────────────────────

alter table public.users
  add column if not exists account_status   text        not null default 'actief'
    check (account_status in ('actief', 'geschorst', 'geblokkeerd', 'te_verwijderen')),
  add column if not exists geschorst_op     timestamptz default null,
  add column if not exists verwijderen_op   timestamptz default null;

-- ── FUNCTIE: check_schorsing ─────────────────────────────────
-- Haalt de laatste 3 beoordelingen op voor user_uuid.
-- Als alle 3 aanbevolen = false → zet account op 'geschorst'.

create or replace function public.check_schorsing(user_uuid uuid)
returns void as $$
declare
  totaal_recent   integer;
  negatief_recent integer;
begin
  select
    count(*),
    count(*) filter (where aanbevolen = false)
  into totaal_recent, negatief_recent
  from (
    select aanbevolen
    from public.beoordelingen
    where beoordeelde_id = user_uuid
    order by created_at desc
    limit 3
  ) recente;

  -- Schors alleen als er minstens 3 beoordelingen zijn én alle 3 negatief
  if totaal_recent = 3 and negatief_recent = 3 then
    update public.users
    set
      account_status = 'geschorst',
      geschorst_op   = now()
    where id = user_uuid
      and account_status = 'actief';
  end if;
end;
$$ language plpgsql security definer;

-- ── TRIGGER FUNCTIE ──────────────────────────────────────────

create or replace function public.handle_schorsing_check()
returns trigger as $$
begin
  perform public.check_schorsing(new.beoordeelde_id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger vuurt na on_beoordeling_aangemaakt (alfabetisch: o < on_b... wait)
-- PostgreSQL voert AFTER triggers uit op alfabetische volgorde van triggernaam.
-- 'on_beoordeling_aangemaakt' < 'on_schorsing_check' → score update eerst, dan schorsing.
create trigger on_schorsing_check
  after insert on public.beoordelingen
  for each row execute function public.handle_schorsing_check();
