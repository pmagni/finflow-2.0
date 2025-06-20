create or replace function public.get_user_data()
returns table (
  user_role text,
  preferences json
) as $$
begin
  return query
  select
    (select role from public.user_roles where user_id = auth.uid()) as user_role,
    (select row_to_json(user_preferences) from public.user_preferences where user_id = auth.uid()) as preferences;
end;
$$ language plpgsql security definer; 