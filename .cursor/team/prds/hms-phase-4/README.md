# HMS Phase 4 — Insurance, HR, Inventory, Reporting

## Summary

Extends HMS Phase 3 with back-office and analytics modules per HMS.md roadmap.

## Modules

| Module | APIs | Status |
|--------|------|--------|
| Insurance | `POST /insurance/policies`, `GET .../patient/:uhid`, `POST /pre-auth`, `POST /claims`, `PATCH .../settle` | Done |
| HR | `GET /hr/employees`, `POST /hr/employees`, `POST /hr/leave`, `PATCH .../approve` | Done |
| Inventory | `GET /inventory/items`, `POST /stock/receive`, `POST /stock/consume`, `GET /stock/low` | Done |
| Reports | `GET /reports/operational`, `/financial`, `/clinical`, `/inventory` | Done |

## Seed data

- Employees: EMP-001 (Nurse), EMP-002 (Admin), EMP-003 (Pharmacist)
- Inventory: SYR-10ML, GLV-M, BND-ROLL (BND-ROLL seeded below reorder level)

## FE routes

`/insurance` · `/hr` · `/inventory` · `/reports`

## Tests

`node --test hms/test/phase4.test.js`

## Next: Phase 5

Patient Portal, Doctor Portal, Communication Center (per PRD roadmap) — **Done** → see `hms-phase-5/README.md`
