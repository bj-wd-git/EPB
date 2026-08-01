# HMS — Hospital Management System (Phase 1)

Enterprise HMS scaffold delivered by BOSS `hms-enterprise` on the EPB platform.

## Architecture

```text
React FE (frontend/) → BFF (apps/bff/) → Domain services (services/)
                              ↓
                    libs/common (UHID, audit, store)
```

**ADRs:** ADR-010 (domain boundaries), ADR-011 (UHID), ADR-012 (PHI/audit)

## Phase 1 modules

| Module | Path | Status |
|--------|------|--------|
| BFF | `apps/bff/` | Functional scaffold |
| Registration | `services/registration/` | Via store + BFF |
| Appointment | `services/appointment/` | Via store + BFF |
| EMR | `services/emr/` | Via store + BFF |
| Configuration | `services/configuration/` | Seed data in store |
| Frontend | `frontend/` | React shell pages |

## Phase 2+ stubs

See `services/README.md` for laboratory, pharmacy, billing, IPD, and remaining HMS.md domains.

## Run tests

```bash
node --test hms/test/*.test.js
```

## Start BFF (dev)

```bash
node -e "require('./hms/apps/bff/src/server').createBffServer().listen(3000, () => console.log('HMS BFF :3000'))"
```

## API (Phase 1)

| Method | Path | Auth header |
|--------|------|-------------|
| GET | `/api/v1/health` | — |
| POST | `/api/v1/patients` | `x-role: clerk` |
| POST | `/api/v1/appointments` | `x-role: clerk` |
| GET | `/api/v1/patients/{uhid}/emr` | `x-role: doctor` |
| POST | `/api/v1/patients/{uhid}/emr/notes` | `x-role: doctor` |

## BOSS

- PRD: `.cursor/team/prds/hms-enterprise/PRD.md`
- Dev docs: `.cursor/team/prds/hms-enterprise/dev-docs.md`
- Report: `.cursor/team/reports/hms-enterprise.md`
