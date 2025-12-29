-- migration: add rpc to create household and link user
-- created: 2025-12-29 12:00:00 utc
-- purpose: make registration flow work with rls by creating household + user_households mapping in one transaction
-- affected objects: public.create_household_and_link_user function
-- considerations:
-- - function is security definer and owned by postgres (migration runner), so it can bypass rls safely
-- - function requires authenticated user (auth.uid() must be set)

create or replace function public.create_household_and_link_user(household_name text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_household_id integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  if household_name is null or length(trim(household_name)) = 0 then
    raise exception 'household_name_required' using errcode = '22023';
  end if;

  insert into public.households (name)
  values (trim(household_name))
  returning id into new_household_id;

  insert into public.user_households (user_id, household_id)
  values (auth.uid(), new_household_id)
  on conflict (user_id) do update
    set household_id = excluded.household_id;

  return new_household_id;
end;
$$;

revoke all on function public.create_household_and_link_user(text) from public;
grant execute on function public.create_household_and_link_user(text) to authenticated;
