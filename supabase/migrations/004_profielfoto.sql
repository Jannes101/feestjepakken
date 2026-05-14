-- ============================================================
-- feestjepakken — database migratie v4
-- Profielfoto: foto_url kolom + private Storage bucket + RLS
-- Uitvoeren in Supabase SQL Editor
-- ============================================================

-- ── KOLOM op users ───────────────────────────────────────────

alter table public.users
  add column if not exists foto_url text default null;

-- ── STORAGE BUCKET ───────────────────────────────────────────

insert into storage.buckets (id, name, public)
values ('profielfoto', 'profielfoto', false)
on conflict (id) do nothing;

-- ── RLS POLICIES op storage.objects ──────────────────────────
-- Foto's zijn alleen zichtbaar voor leden met ≥1 transactie (credits).

create policy "Profielfoto zichtbaar voor credits-houders"
  on storage.objects for select
  using (
    bucket_id = 'profielfoto'
    and exists (select 1 from public.transacties where user_id = auth.uid())
  );

-- Upload alleen naar eigen map (userId/avatar)
create policy "Eigen profielfoto uploaden"
  on storage.objects for insert
  with check (
    bucket_id = 'profielfoto'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Eigen profielfoto bijwerken"
  on storage.objects for update
  using (
    bucket_id = 'profielfoto'
    and auth.uid()::text = split_part(name, '/', 1)
  );

create policy "Eigen profielfoto verwijderen"
  on storage.objects for delete
  using (
    bucket_id = 'profielfoto'
    and auth.uid()::text = split_part(name, '/', 1)
  );
