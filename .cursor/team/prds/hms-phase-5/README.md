# HMS Phase 5 — Patient Portal, Doctor Portal, Communication Center

## Summary

Extends HMS Phase 4 with patient/doctor engagement and messaging per HMS.md roadmap.

## Modules

| Module | APIs | Status |
|--------|------|--------|
| Patient Portal | `GET /portal/patient/:uhid/dashboard`, `/appointments`, `/bills`, `/prescriptions`, `/lab-reports`, `POST .../appointments`, `/teleconsult` | Done |
| Doctor Portal | `GET /portal/doctor/:id/schedule`, `/lab-queue`, `POST .../notes` | Done |
| Communications | `POST /communications/messages`, `GET /messages`, `POST /reminders/appointment` | Done |

## FE routes

`/portal/patient` · `/portal/doctor` · `/communications`

## Tests

`node --test hms/test/phase5.test.js`

## Next: Phase 6

Compliance, Security, Mobile Apps (per PRD roadmap) — **Done** → see `hms-phase-6/README.md`
