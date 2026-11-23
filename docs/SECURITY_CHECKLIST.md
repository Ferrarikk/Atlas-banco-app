# Security implementation checklist

## Prototype stage
- [x] Ignore local environment files and signing credentials in Git.
- [x] Document secret-handling rules.
- [x] Draft initial Supabase schema with owner-scoped RLS and read-only demo account/transaction records (not yet applied or tested).
- [x] Add optional Supabase client configuration using public environment variables only.
- [x] Disable native session persistence until a reviewed secure-storage adapter is available; native sessions remain memory-only.
- [x] Add signup/login/logout/recovery flows calling Supabase Auth (project configuration and runtime tests still pending).
- [ ] Apply migration in a Supabase development project and test RLS with two separate users.
- [ ] Implement and review a persistent native session-storage adapter using authenticated platform-backed storage.
- [ ] Verify native session persistence on physical iOS and Android devices.
- [ ] Replace browser localStorage auth storage before any production web use; prefer a backend/BFF with secure HttpOnly cookies.
- [ ] Add automated dependency and secret scanning.
- [ ] Add tests for authentication and authorization boundaries.

## Before any real financial functionality
- [x] Demo-only server-side balance update through an atomic, idempotent Supabase RPC; not a real-money ledger.
- [ ] Production server-side ledger; no client-side balance writes.
- [x] Atomic, idempotent processing for demo-only debits; production transaction processing remains pending.
- [ ] Production transaction processing with reconciliation and operational controls.
- [ ] Strong authorization and step-up authentication.
- [ ] Rate limiting, fraud controls, audit logs, monitoring and alerting.
- [ ] Reconciliation and dispute/error handling.
- [ ] Independent penetration test and security review.
- [ ] LGPD/privacy review and applicable financial regulatory assessment.
- [ ] Approved financial/payment partner and operational procedures.

A checked item means only that the initial code or documentation exists in the repository. It is not proof of a production control, completed integration, or certification.
