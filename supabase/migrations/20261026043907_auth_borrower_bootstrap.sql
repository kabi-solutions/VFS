-- Allow authenticated borrowers to create their own profile row.
-- On Auth signup, link/create public.users (role always starts as borrower;
-- staff roles are assigned only via vault/service_role — never user_metadata).

create policy users_insert_self on public.users
  for insert to authenticated
  with check (
    auth_user_id = auth.uid()
    and role = 'borrower'
  );

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (auth_user_id, email, full_name, role)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'borrower'
  )
  on conflict (email) do update
    set auth_user_id = excluded.auth_user_id,
        full_name = coalesce(nullif(public.users.full_name, ''), excluded.full_name),
        updated_at = now()
  where public.users.auth_user_id is null
     or public.users.auth_user_id = excluded.auth_user_id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_auth_user();
