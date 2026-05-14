-- Enable RLS
alter table public.uitjes enable row level security;

-- SELECT: iedereen mag uitjes lezen (ook niet-ingelogd)
create policy "uitjes_select_all"
  on public.uitjes for select
  using (true);

-- INSERT: alleen ingelogde gebruikers, eigen user_id
create policy "uitjes_insert_own"
  on public.uitjes for insert
  with check (auth.uid() is not null and user_id = auth.uid());

-- UPDATE: alleen eigenaar
create policy "uitjes_update_own"
  on public.uitjes for update
  using (user_id = auth.uid());

-- DELETE: alleen eigenaar
create policy "uitjes_delete_own"
  on public.uitjes for delete
  using (user_id = auth.uid());
