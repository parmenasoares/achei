-- Acheii production schema (apply in Supabase SQL Editor)
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'buyer' check (role in ('buyer','seller','courier','admin')),
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  description text,
  rating numeric(2,1) not null default 5.0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  seller_id uuid references public.stores(id) on delete set null,
  name text not null,
  category text not null,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  old_price numeric(12,2),
  badge text,
  rating numeric(2,1) default 5.0,
  reviews integer not null default 0,
  image_url text,
  emoji text default '🔧',
  make text,
  model text,
  years text[] not null default '{}',
  engines text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.courier_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text not null,
  email text not null,
  city text not null,
  document text not null,
  vehicle text not null check (vehicle in ('Bicicleta','Moto')),
  status text not null default 'Em análise',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.products enable row level security;
alter table public.courier_applications enable row level security;

grant select on public.stores, public.products to anon, authenticated;
grant insert on public.courier_applications to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.stores to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select on public.courier_applications to authenticated;

create policy "Public can browse active stores" on public.stores for select using (active = true);
create policy "Public can browse active products" on public.products for select using (active = true);
create policy "Users read their profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "Users update their profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "Couriers submit their own application" on public.courier_applications for insert to anon, authenticated with check (true);
create policy "Sellers manage own store" on public.stores for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Sellers manage their products" on public.products for all to authenticated using (seller_id in (select id from public.stores where owner_id = (select auth.uid()))) with check (seller_id in (select id from public.stores where owner_id = (select auth.uid())));
