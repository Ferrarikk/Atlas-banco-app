import "react-native-get-random-values";

import { supabase } from "./supabase";

export type DemoTransaction = {
  id: string;
  title: string;
  detail: string;
  amount: number;
  date: string;
  kind: "in" | "out";
};

export type DemoAccountSnapshot = {
  accountId: string;
  balance: number;
  transactions: DemoTransaction[];
};

export function createIdempotencyKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function loadDemoAccount(userId: string): Promise<DemoAccountSnapshot> {
  if (!supabase) throw new Error("Supabase não está configurado.");

  const { data: account, error: accountError } = await supabase
    .from("demo_accounts")
    .select("id, demo_balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (accountError) throw accountError;
  if (!account) {
    throw new Error("Conta demonstrativa não encontrada. Verifique se as migrações do Supabase foram executadas.");
  }

  const { data: rows, error: transactionsError } = await supabase
    .from("demo_transactions")
    .select("id, kind, description, amount, created_at, status")
    .eq("account_id", account.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (transactionsError) throw transactionsError;

  const transactions: DemoTransaction[] = (rows ?? []).map(row => {
    const createdAt = new Date(row.created_at);
    const incoming = row.kind === "credit";
    return {
      id: row.id,
      title: row.description,
      detail: `${createdAt.toLocaleString("pt-BR")} · Demonstração`,
      amount: incoming ? Number(row.amount) : -Number(row.amount),
      date: createdAt.toLocaleDateString("pt-BR"),
      kind: incoming ? "in" : "out",
    };
  });

  return {
    accountId: account.id,
    balance: Number(account.demo_balance),
    transactions,
  };
}

export async function simulateDemoDebit(
  accountId: string,
  amount: number,
  description: string,
  idempotencyKey: string,
): Promise<void> {
  if (!supabase) throw new Error("Supabase não está configurado.");

  const { error } = await supabase.rpc("atlas_simulate_debit", {
    p_account_id: accountId,
    p_amount: amount,
    p_description: description,
    p_idempotency_key: idempotencyKey,
  });

  if (error) throw error;
}
