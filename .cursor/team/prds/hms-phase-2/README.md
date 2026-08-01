# HMS Phase 2 — Lab, Radiology, Pharmacy, Billing

## Summary

Extends HMS Phase 1 with diagnostic and revenue modules per HMS.md roadmap.

## Modules

| Module | APIs | Status |
|--------|------|--------|
| Laboratory | `GET /lab/tests`, `POST /lab/orders`, `PATCH .../results` | Done |
| Radiology | `POST /radiology/orders`, `PATCH .../report` | Done |
| Pharmacy | `POST /pharmacy/prescriptions`, `POST .../dispense` | Done |
| Billing | `POST /billing/invoices`, `GET .../patient/:uhid`, `POST .../pay` | Done |

## FE routes

`/lab` · `/radiology` · `/pharmacy` · `/billing`

## Tests

`node --test hms/test/phase2.test.js`

## Next: Phase 3

IPD, Ward, OT, Emergency (per PRD roadmap)
