-- Atlas Bank: initial Supabase schema for a DEMONSTRATION app only.
-- Apply through the Supabase SQL Editor after creating a project.
-- No real balances, Pix, cards, or financial settlement are implemented here.

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Usuário'
    check (char_length(display_name) <= 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.demo_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_label text not null default 'Conta de demonstração',
  currency text not null default 'BRL' check (currency = 'BRL'),
  created_at timestamptz not null default now(),
  unique (id, user_id)
);

create table if not exists public.demo_transactions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('credit', 'debit')),
  description text not null
    check (char_length(description) between 1 and 120),
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  status text not null default 'simulated' check (status = 'simulated'),
  created_at timestamptz not null default now(),
  constraint demo_transactions_account_owner_fk
    foreign key (account_id, user_id)
    references public.demo_accounts(id, user_id)
    on delete cascade
);

create index if not exists demo_accounts_user_id_idx
  on public.demo_accounts(user_id);
create index if not exists demo_transactions_user_created_idx
  on public.demo_transactions(user_id, created_at desc);
create index if not exists demo_transactions_account_created_idx
  on public.demo_transactions(account_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.demo_accounts enable row level security;
alter table public.demo_transactions enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own display name" on public.profiles;
create policy "Users can update their own display name"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can read their own demo accounts" on public.demo_accounts;
create policy "Users can read their own demo accounts"
  on public.demo_accounts for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own demo transactions" on public.demo_transactions;
create policy "Users can read their own demo transactions"
  on public.demo_transactions for select to authenticated
  using ((select auth.uid()) = user_id);

-- Client sessions may read their own records, but cannot create or alter
-- accounts/transactions or write a balance. Only the profile display name
-- is client-editable in this first schema.
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.demo_accounts from anon, authenticated;
revoke all on table public.demo_transactions from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name) on table public.profiles to authenticated;
grant select on table public.demo_accounts to authenticated;
grant select on table public.demo_transactions to authenticated;

create or replace function public.atlas_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists atlas_profiles_set_updated_at on public.profiles;
create trigger atlas_profiles_set_updated_at
before update on public.profiles
for each row execute function public.atlas_set_updated_at();

create or replace function public.atlas_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  safe_display_name text;
begin
  safe_display_name :=
    coalesce(
      nullif(left(btrim(new.raw_user_meta_data ->> 'display_name'), 60), ''),
      'Usuário'
    );

  insert into public.profiles (id, display_name)
  values (new.id, safe_display_name)
  on conflict (id) do nothing;

  insert into public.demo_accounts (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists atlas_on_auth_user_created on auth.users;
create trigger atlas_on_auth_user_created
after insert on auth.users
for each row execute function public.atlas_handle_new_user();

commit;
