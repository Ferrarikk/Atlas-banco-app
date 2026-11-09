# Security implementation checklist

## Prototype stage
- [x] Ignore local environment files and signing credentials in Git.
- [x] Document secret-handling rules.
- [x] Draft initial Supabase schema with owner-scoped RLS and read-only demo account/transaction records (not yet applied or tested).
- [x] Add optional Supabase client configuration using public environment variables only.
- [x] Add encrypted native session-storage adapter (code present; runtime and security testing still required).
- [ ] Connect Supabase Auth to signup/login/logout/recovery screens.
- [ ] Apply migration in a Supabase development project and test RLS with two separate users.
- [ ] Verify native session persistence on physical iOS and Android devices.
- [ ] Replace browser localStorage auth storage before any production web use; prefer a backend/BFF with secure HttpOnly cookies.
- [ ] Add automated dependency and secret scanning.
- [ ] Add tests for authentication and authorization boundaries.

## Before any real financial functionality
- [ ] Server-side ledger; no client-side balance writes.
- [ ] Atomic, idempotent transaction processing.
- [ ] Strong authorization and step-up authentication.
- [ ] Rate limiting, fraud controls, audit logs, monitoring and alerting.
- [ ] Reconciliation and dispute/error handling.
- [ ] Independent penetration test and security review.
- [ ] LGPD/privacy review and applicable financial regulatory assessment.
- [ ] Approved financial/payment partner and operational procedures.

A checked item means only that the initial code or documentation exists in the repository. It is not proof of a production control, completed integration, or certification.
