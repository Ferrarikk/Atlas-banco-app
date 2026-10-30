# Security implementation checklist

## Prototype stage
- [x] Ignore local environment files and signing credentials in Git.
- [x] Document secret-handling rules.
- [ ] Add Supabase client with platform secure session storage.
- [ ] Enable and test RLS policies before using any user data.
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

A checked item only means the repository contains the corresponding initial documentation/configuration. It is not proof of a production control or certification.
