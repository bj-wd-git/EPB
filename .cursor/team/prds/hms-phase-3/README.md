# HMS Phase 3 — Ward, IPD, OT, Emergency

## Summary

Extends HMS Phase 2 with inpatient and acute-care modules per HMS.md roadmap.

## Modules

| Module | APIs | Status |
|--------|------|--------|
| Ward | `GET /wards`, `GET /wards/occupancy`, `GET /wards/:id/beds` | Done |
| IPD | `POST /ipd/admissions`, `GET .../:id`, `POST .../discharge`, `PATCH .../transfer` | Done |
| OT | `POST /ot/bookings`, `GET .../:id`, `PATCH .../complete` | Done |
| Emergency | `POST /emergency/visits`, `GET /visits/active`, `PATCH .../triage` | Done |

## Seed data

- General Ward: beds A1, A2, A3
- ICU: beds ICU-1, ICU-2

## FE routes

`/ward` · `/ipd` · `/ot` · `/emergency`

## Tests

`node --test hms/test/phase3.test.js`

## Next: Phase 4

Insurance, HR, Inventory, Reporting (per PRD roadmap) — **Done** → see `hms-phase-4/README.md`
