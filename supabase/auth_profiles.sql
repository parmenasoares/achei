-- Identity data for buyer and seller registrations.
-- Apply this after supabase/schema.sql in the Supabase SQL editor.

alter table public.profiles
  add column if not exists email text,
  add column if not exists cpf text,
  add column if not exists cnpj text,
  add column if not exists business_name text,
  add column if not exists pix_key text,
  add column if not exists business_categories text[] not null default '{}';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_cpf_unique') then
    alter table public.profiles add constraint profiles_cpf_unique unique (cpf);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_cnpj_unique') then
    alter table public.profiles add constraint profiles_cnpj_unique unique (cnpj);
  end if;
end $$;

create or replace function public.handle_new_achei_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'buyer');
begin
  if requested_role not in ('buyer', 'seller') then requested_role := 'buyer'; end if;
  insert into public.profiles (id, full_name, role, phone, email, cpf, cnpj, business_name, pix_key, business_categories)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role,
    new.raw_user_meta_data ->> 'phone', new.email,
    nullif(new.raw_user_meta_data ->> 'cpf', ''), nullif(new.raw_user_meta_data ->> 'cnpj', ''),
    nullif(new.raw_user_meta_data ->> 'business_name', ''), nullif(new.raw_user_meta_data ->> 'pix_key', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'business_categories', '[]'::jsonb))), '{}')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_achei_user() from public;
drop trigger if exists on_auth_user_created_achei on auth.users;
create trigger on_auth_user_created_achei after insert on auth.users for each row execute procedure public.handle_new_achei_user();
