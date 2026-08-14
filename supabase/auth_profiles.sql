-- Identity data for buyer and seller registrations.
-- Apply this after supabase/schema.sql in the Supabase SQL editor.

alter table public.profiles
  add column if not exists email text,
  add column if not exists cpf text,
  add column if not exists cnpj text,
  add column if not exists business_name text,
  add column if not exists pix_key text,
  add column if not exists business_categories text[] not null default '{}',
  add column if not exists store_postal_code text,
  add column if not exists store_address text,
  add column if not exists store_number text,
  add column if not exists store_complement text,
  add column if not exists store_neighborhood text,
  add column if not exists store_city text,
  add column if not exists store_state text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_cpf_unique') then
    alter table public.profiles add constraint profiles_cpf_unique unique (cpf);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_cnpj_unique') then
    alter table public.profiles add constraint profiles_cnpj_unique unique (cnpj);
  end if;
end $$;

create or replace function public.is_valid_cpf(value_input text)
returns boolean
language plpgsql
immutable
strict
set search_path = pg_catalog
as $
declare
  value_digits text := regexp_replace(value_input, '[^0-9]', '', 'g');
  sum_value integer;
  rest integer;
begin
  if value_digits !~ '^[0-9]{11}
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'buyer');
begin
  if requested_role not in ('buyer', 'seller') then requested_role := 'buyer'; end if;
  if requested_role = 'seller' and not public.is_valid_cnpj(new.raw_user_meta_data ->> 'cnpj') then raise exception 'CNPJ inválido.'; end if;
  if requested_role = 'seller' and not public.is_valid_pix_key(new.raw_user_meta_data ->> 'pix_key') then raise exception 'Chave PIX inválida.'; end if;
  insert into public.profiles (id, full_name, role, phone, email, cpf, cnpj, business_name, pix_key, store_postal_code, store_address, store_number, store_complement, store_neighborhood, store_city, store_state, business_categories)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role,
    new.raw_user_meta_data ->> 'phone', new.email,
    nullif(new.raw_user_meta_data ->> 'cpf', ''), nullif(new.raw_user_meta_data ->> 'cnpj', ''),
    nullif(new.raw_user_meta_data ->> 'business_name', ''), nullif(new.raw_user_meta_data ->> 'pix_key', ''),
    nullif(new.raw_user_meta_data ->> 'store_postal_code', ''), nullif(new.raw_user_meta_data ->> 'store_address', ''),
    nullif(new.raw_user_meta_data ->> 'store_number', ''), nullif(new.raw_user_meta_data ->> 'store_complement', ''), nullif(new.raw_user_meta_data ->> 'store_neighborhood', ''), nullif(new.raw_user_meta_data ->> 'store_city', ''), nullif(new.raw_user_meta_data ->> 'store_state', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'business_categories', '[]'::jsonb))), '{}')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_achei_user() from public;
drop trigger if exists on_auth_user_created_achei on auth.users;
create trigger on_auth_user_created_achei after insert on auth.users for each row execute procedure public.handle_new_achei_user();
 or value_digits = repeat(left(value_digits, 1), 11) then return false; end if;
  sum_value := 0;
  for index_value in 1..9 loop sum_value := sum_value + substring(value_digits, index_value, 1)::integer * (11 - index_value); end loop;
  rest := (sum_value * 10) % 11;
  if rest = 10 then rest := 0; end if;
  if rest <> substring(value_digits, 10, 1)::integer then return false; end if;
  sum_value := 0;
  for index_value in 1..10 loop sum_value := sum_value + substring(value_digits, index_value, 1)::integer * (12 - index_value); end loop;
  rest := (sum_value * 10) % 11;
  if rest = 10 then rest := 0; end if;
  return rest = substring(value_digits, 11, 1)::integer;
end;
$;

create or replace function public.is_valid_cnpj(value_input text)
returns boolean
language plpgsql
immutable
strict
set search_path = pg_catalog
as $
declare
  value_digits text := regexp_replace(value_input, '[^0-9]', '', 'g');
  sum_value integer;
  rest integer;
  weights_one integer[] := array[5,4,3,2,9,8,7,6,5,4,3,2];
  weights_two integer[] := array[6,5,4,3,2,9,8,7,6,5,4,3,2];
begin
  if value_digits !~ '^[0-9]{14}
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'buyer');
begin
  if requested_role not in ('buyer', 'seller') then requested_role := 'buyer'; end if;
  insert into public.profiles (id, full_name, role, phone, email, cpf, cnpj, business_name, pix_key, store_postal_code, store_address, store_number, store_complement, store_neighborhood, store_city, store_state, business_categories)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role,
    new.raw_user_meta_data ->> 'phone', new.email,
    nullif(new.raw_user_meta_data ->> 'cpf', ''), nullif(new.raw_user_meta_data ->> 'cnpj', ''),
    nullif(new.raw_user_meta_data ->> 'business_name', ''), nullif(new.raw_user_meta_data ->> 'pix_key', ''),
    nullif(new.raw_user_meta_data ->> 'store_postal_code', ''), nullif(new.raw_user_meta_data ->> 'store_address', ''),
    nullif(new.raw_user_meta_data ->> 'store_number', ''), nullif(new.raw_user_meta_data ->> 'store_complement', ''), nullif(new.raw_user_meta_data ->> 'store_neighborhood', ''), nullif(new.raw_user_meta_data ->> 'store_city', ''), nullif(new.raw_user_meta_data ->> 'store_state', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'business_categories', '[]'::jsonb))), '{}')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_achei_user() from public;
drop trigger if exists on_auth_user_created_achei on auth.users;
create trigger on_auth_user_created_achei after insert on auth.users for each row execute procedure public.handle_new_achei_user();
 or value_digits = repeat(left(value_digits, 1), 14) then return false; end if;
  sum_value := 0;
  for index_value in 1..12 loop sum_value := sum_value + substring(value_digits, index_value, 1)::integer * weights_one[index_value]; end loop;
  rest := sum_value % 11;
  if rest < 2 then rest := 0; else rest := 11 - rest; end if;
  if rest <> substring(value_digits, 13, 1)::integer then return false; end if;
  sum_value := 0;
  for index_value in 1..13 loop sum_value := sum_value + substring(value_digits, index_value, 1)::integer * weights_two[index_value]; end loop;
  rest := sum_value % 11;
  if rest < 2 then rest := 0; else rest := 11 - rest; end if;
  return rest = substring(value_digits, 14, 1)::integer;
end;
$;

create or replace function public.is_valid_pix_key(value_input text)
returns boolean
language plpgsql
immutable
strict
set search_path = pg_catalog
as $
declare
  value_key text := btrim(value_input);
  value_digits text := regexp_replace(value_input, '[^0-9]', '', 'g');
begin
  if public.is_valid_cpf(value_digits) or public.is_valid_cnpj(value_digits) then return true; end if;
  if value_key ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'buyer');
begin
  if requested_role not in ('buyer', 'seller') then requested_role := 'buyer'; end if;
  insert into public.profiles (id, full_name, role, phone, email, cpf, cnpj, business_name, pix_key, store_postal_code, store_address, store_number, store_complement, store_neighborhood, store_city, store_state, business_categories)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role,
    new.raw_user_meta_data ->> 'phone', new.email,
    nullif(new.raw_user_meta_data ->> 'cpf', ''), nullif(new.raw_user_meta_data ->> 'cnpj', ''),
    nullif(new.raw_user_meta_data ->> 'business_name', ''), nullif(new.raw_user_meta_data ->> 'pix_key', ''),
    nullif(new.raw_user_meta_data ->> 'store_postal_code', ''), nullif(new.raw_user_meta_data ->> 'store_address', ''),
    nullif(new.raw_user_meta_data ->> 'store_number', ''), nullif(new.raw_user_meta_data ->> 'store_complement', ''), nullif(new.raw_user_meta_data ->> 'store_neighborhood', ''), nullif(new.raw_user_meta_data ->> 'store_city', ''), nullif(new.raw_user_meta_data ->> 'store_state', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'business_categories', '[]'::jsonb))), '{}')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_achei_user() from public;
drop trigger if exists on_auth_user_created_achei on auth.users;
create trigger on_auth_user_created_achei after insert on auth.users for each row execute procedure public.handle_new_achei_user();
 then return true; end if;
  if value_key ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'account_type', 'buyer');
begin
  if requested_role not in ('buyer', 'seller') then requested_role := 'buyer'; end if;
  insert into public.profiles (id, full_name, role, phone, email, cpf, cnpj, business_name, pix_key, store_postal_code, store_address, store_number, store_complement, store_neighborhood, store_city, store_state, business_categories)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role,
    new.raw_user_meta_data ->> 'phone', new.email,
    nullif(new.raw_user_meta_data ->> 'cpf', ''), nullif(new.raw_user_meta_data ->> 'cnpj', ''),
    nullif(new.raw_user_meta_data ->> 'business_name', ''), nullif(new.raw_user_meta_data ->> 'pix_key', ''),
    nullif(new.raw_user_meta_data ->> 'store_postal_code', ''), nullif(new.raw_user_meta_data ->> 'store_address', ''),
    nullif(new.raw_user_meta_data ->> 'store_number', ''), nullif(new.raw_user_meta_data ->> 'store_complement', ''), nullif(new.raw_user_meta_data ->> 'store_neighborhood', ''), nullif(new.raw_user_meta_data ->> 'store_city', ''), nullif(new.raw_user_meta_data ->> 'store_state', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'business_categories', '[]'::jsonb))), '{}')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_achei_user() from public;
drop trigger if exists on_auth_user_created_achei on auth.users;
create trigger on_auth_user_created_achei after insert on auth.users for each row execute procedure public.handle_new_achei_user();
 then return true; end if;
  return length(value_digits) in (10, 11) or (left(value_digits, 2) = '55' and length(value_digits) in (12, 13));
end;
$;

revoke all on function public.is_valid_cpf(text) from public;
revoke all on function public.is_valid_cnpj(text) from public;
revoke all on function public.is_valid_pix_key(text) from public;

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
  insert into public.profiles (id, full_name, role, phone, email, cpf, cnpj, business_name, pix_key, store_postal_code, store_address, store_number, store_complement, store_neighborhood, store_city, store_state, business_categories)
  values (
    new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), requested_role,
    new.raw_user_meta_data ->> 'phone', new.email,
    nullif(new.raw_user_meta_data ->> 'cpf', ''), nullif(new.raw_user_meta_data ->> 'cnpj', ''),
    nullif(new.raw_user_meta_data ->> 'business_name', ''), nullif(new.raw_user_meta_data ->> 'pix_key', ''),
    nullif(new.raw_user_meta_data ->> 'store_postal_code', ''), nullif(new.raw_user_meta_data ->> 'store_address', ''),
    nullif(new.raw_user_meta_data ->> 'store_number', ''), nullif(new.raw_user_meta_data ->> 'store_complement', ''), nullif(new.raw_user_meta_data ->> 'store_neighborhood', ''), nullif(new.raw_user_meta_data ->> 'store_city', ''), nullif(new.raw_user_meta_data ->> 'store_state', ''),
    coalesce(array(select jsonb_array_elements_text(coalesce(new.raw_user_meta_data -> 'business_categories', '[]'::jsonb))), '{}')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_achei_user() from public;
drop trigger if exists on_auth_user_created_achei on auth.users;
create trigger on_auth_user_created_achei after insert on auth.users for each row execute procedure public.handle_new_achei_user();
