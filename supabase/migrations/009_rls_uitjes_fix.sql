-- Verwijder ALLE bestaande policies op uitjes (ongeacht naam)
do $$
declare
  p record;
begin
  for p in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'uitjes'
  loop
    execute format('drop policy if exists %I on public.uitjes', p.policyname);
  end loop;
end $$;

-- Zeker stellen dat RLS aan staat
alter table public.uitjes enable row level security;

-- SELECT: iedereen mag uitjes lezen (ook niet-ingelogd)
create policy "uitjes_select"
  on public.uitjes for select
  using (true);

-- INSERT: ingelogde gebruiker, user_id moet overeenkomen met auth.uid()
create policy "uitjes_insert"
  on public.uitjes for insert
  with check (auth.uid() = user_id);

-- UPDATE: alleen eigenaar
create policy "uitjes_update"
  on public.uitjes for update
  using (auth.uid() = user_id);

-- DELETE: alleen eigenaar
create policy "uitjes_delete"
  on public.uitjes for delete
  using (auth.uid() = user_id);
