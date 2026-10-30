# Atlas Bank — Security Baseline

This repository is an early-stage mobile-app prototype. It is **not a bank**, is not production-ready, and must not process real money or real payment credentials.

## Non-negotiable rules

- Never commit secrets, API secret keys, service-role keys, signing keys, passwords, access tokens, private certificates, or real customer data.
- Keep local credentials in an ignored `.env` file. Commit only placeholders in `.env.example`.
- A Supabase publishable/anon key may be embedded in a client only when Row Level Security (RLS) is enabled and correctly tested on every exposed table. Never ship the Supabase `service_role` key in a mobile app.
- All privileged operations must run on a trusted server/Edge Function after authentication and authorization checks.
- Never let the client set or directly update a financial balance. For a future regulated product, balances must be derived from an auditable, append-only ledger with atomic, idempotent server-side operations and reconciliation.
- Do not store card PAN, CVV, PIN, banking passwords, or authentication secrets in app tables or logs.
- Use TLS for network traffic. Use platform secure storage for refresh/session tokens; do not store tokens in AsyncStorage or plain files.
- Require MFA/step-up verification for sensitive actions when appropriate.
- Apply least privilege, input validation, rate limits, audit trails, monitoring, backups, and tested incident-response procedures.

## Supabase checklist before connecting data

1. Enable RLS on every table exposed through the Data API.
2. Write policies that scope every row to the authenticated user (for example, `auth.uid() = user_id`).
3. Test policies with two separate test users, including attempts to read and modify each other's records.
4. Keep service-role credentials exclusively in server-side secret storage.
5. Restrict Edge Function access and validate authorization inside each function; authentication alone is not authorization.
6. Never trust account IDs, amounts, recipients, or transaction status supplied by the client.

## Release gate

No production release until an independent security review, privacy/LGPD review, threat model, penetration testing, backup/restore test, operational monitoring, and applicable legal/regulatory/financial-partner requirements have been addressed.

This document is an engineering baseline, not a certification or legal opinion.
