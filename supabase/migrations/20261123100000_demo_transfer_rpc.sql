-- Atlas Bank: server-side simulated debits for the DEMO environment only.
-- This is not a Pix integration, payment rail, or real-money ledger.

begin;

alter table public.demo_accounts
  add column if not exists demo_balance numeric(14,2) not null default 2450.75
  check (demo_balance >= 0);

-- Reconcile the demo balance with any existing demo-only transactions.
update public.demo_accounts a
set demo_balance = 2450.75 + coalesce((
  select sum(case when t.kind = 'credit' then t.amount else -t.amount end)
  from public.demo_transactions t
  where t.account_id = a.id
    and t.user_id = a.user_id
), 0);

alter table public.demo_transactions
  add column if not exists idempotency_key uuid;

create unique index if not exists demo_transactions_user_idempotency_idx
  on public.demo_transactions(user_id, idempotency_key)
  where idempotency_key is not null;

create or replace function public.atlas_simulate_debit(
  p_account_id uuid,
  p_amount numeric,
  p_description text,
  p_idempotency_key uuid
)
returns table (
  transaction_id uuid,
  current_balance numeric,
  replayed boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_balance numeric(14,2);
  v_existing_id uuid;
  v_existing_account_id uuid;
  v_existing_amount numeric(14,2);
  v_existing_kind text;
  v_transaction_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_account_id is null then
    raise exception 'Demo account is required';
  end if;

  if p_amount is null
     or p_amount <= 0
     or p_amount > 1000000
     or round(p_amount, 2) <> p_amount then
    raise exception 'Invalid demo amount';
  end if;

  if p_description is null
     or char_length(btrim(p_description)) < 1
     or char_length(btrim(p_description)) > 120 then
    raise exception 'Invalid demo description';
  end if;

  if p_idempotency_key is null then
    raise exception 'Idempotency key is required';
  end if;

  -- Lock the owner's demo account so concurrent requests cannot overspend it.
  select a.demo_balance
    into v_balance
  from public.demo_accounts a
  where a.id = p_account_id
    and a.user_id = v_user_id
  for update;

  if not found then
    raise exception 'Demo account not found';
  end if;

  -- A retry with the same key returns the original result without a second debit.
  select t.id, t.account_id, t.amount, t.kind
    into v_existing_id, v_existing_account_id, v_existing_amount, v_existing_kind
  from public.demo_transactions t
  where t.user_id = v_user_id
    and t.idempotency_key = p_idempotency_key;

  if found then
    if v_existing_account_id <> p_account_id
       or v_existing_amount <> p_amount
       or v_existing_kind <> 'debit' then
      raise exception 'Idempotency key already used with different data';
    end if;

    return query select v_existing_id, v_balance, true;
    return;
  end if;

  if p_amount > v_balance then
    raise exception 'Insufficient demo balance';
  end if;

  insert into public.demo_transactions (
    account_id,
    user_id,
    kind,
    description,
    amount,
    currency,
    status,
    idempotency_key
  )
  values (
    p_account_id,
    v_user_id,
    'debit',
    btrim(p_description),
    p_amount,
    'BRL',
    'simulated',
    p_idempotency_key
  )
  returning id into v_transaction_id;

  update public.demo_accounts a
  set demo_balance = a.demo_balance - p_amount
  where a.id = p_account_id
    and a.user_id = v_user_id
  returning a.demo_balance into v_balance;

  return query select v_transaction_id, v_balance, false;
end;
$$;

revoke all on function public.atlas_simulate_debit(uuid, numeric, text, uuid)
  from public, anon;
grant execute on function public.atlas_simulate_debit(uuid, numeric, text, uuid)
  to authenticated;

commit;
