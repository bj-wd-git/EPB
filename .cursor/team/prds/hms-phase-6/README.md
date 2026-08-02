# HMS Phase 6 — Compliance, Security, Mobile Apps

## Summary

Extends HMS Phase 5 with quality/compliance, security hardening, and mobile sync APIs per HMS.md roadmap.

## Modules

| Module | APIs | Status |
|--------|------|--------|
| Compliance | `POST /compliance/incidents`, `GET /incidents`, `PATCH .../resolve`, `POST /consents`, `POST /capa`, `GET /audit-summary` | Done |
| Security | `POST /security/sessions`, `GET .../validate`, `POST /api-keys`, `GET /access-logs`, `GET /phi-audit` | Done |
| Mobile | `POST /mobile/devices`, `GET /patient/:uhid/sync`, `/doctor/:id/sync`, `/nurse/sync` | Done |

## FE routes

`/compliance` · `/security` · `/mobile`

## Tests

`node --test hms/test/phase6.test.js`

## HMS roadmap complete

Phases 1–6 cover the full HMS.md module roadmap. Future work: production auth (JWT/OAuth), real SMS/push gateways, native mobile apps.
