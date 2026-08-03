# HMS — Hospital Management System

**Version:** 0.8.3 · **Stack:** React + Tailwind · NestJS BFF · MySQL 8

Enterprise HMS on the EPB platform (ADR-001 BFF pattern). Full HMS.md roadmap — Phases 1–6.

## Architecture

```text
React + Tailwind (frontend/)  →  NestJS BFF (apps/bff/)  →  MySQL 8
                                      TypeORM · 22 domain modules
```

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| BFF | NestJS 10, class-validator, TypeORM |
| Database | MySQL 8 (Docker Compose) |
| Tests | Node test runner — 32 scenarios (`libs/common`, `test/`) |

## Quick start

```bash
cd hms
docker compose up -d mysql    # HMS MySQL on :3307 (if :3306 taken by another instance)
cp .env.example .env          # first time only
npm install

npm run bff:dev               # http://localhost:3000
npm run fe:dev                # http://localhost:5173
```

Open http://localhost:5173 → **Login** (staff session via `/api/v1/security/sessions`).

### Demo data

On first BFF start (dev), MySQL is seeded with demo patients and clinical records across all phases.

| Demo | Value |
|------|--------|
| Patients | `BRN000001` Arjun Mehta … `BRN000005` Rahul Nair |
| Doctors | Dr. Smith, Dr. Ananya Rao |
| Branches | Main Branch (`BRN`), East Clinic (`EST`) |
| IPD | Vikram Singh admitted on bed A1 |
| Disable | `HMS_SEED_DEMO=false` in `.env` |

## Modules (Phases 1–6)

| Phase | Modules | FE routes |
|-------|---------|-----------|
| 1 | Registration, Appointment, EMR, Dashboard | `/registration`, `/appointments`, EMR |
| 2 | Lab, Radiology, Pharmacy, Billing | `/lab`, `/radiology`, `/pharmacy`, `/billing` |
| 3 | Ward, IPD, OT, Emergency | `/ward`, `/ipd`, `/ot`, `/emergency` |
| 4 | Insurance, HR, Inventory, Reports | `/insurance`, `/hr`, `/inventory`, `/reports` |
| 5 | Patient/Doctor portals, Communications | `/portal/*`, `/communications` |
| 6 | Compliance, Security, Mobile | `/compliance`, `/security`, `/mobile` |

See `services/README.md` for the full domain service matrix.

## API

Global prefix: `/api/v1`. Auth via `x-role` + `x-actor-id` headers (or staff login session).

| Method | Path | Role |
|--------|------|------|
| GET | `/health` | — |
| POST | `/patients` | clerk |
| POST | `/appointments` | clerk |
| GET | `/patients/{uhid}/emr` | doctor |
| POST | `/security/sessions` | — (login) |
| … | 100+ endpoints | see `services/README.md` |

## Tests

```bash
npm test    # 32/32 — no DB required
```

## BOSS

| Artifact | Path |
|----------|------|
| PRD | `.cursor/team/prds/hms-enterprise/PRD.md` |
| Dev docs | `.cursor/team/prds/hms-enterprise/dev-docs.md` |
| Report | `.cursor/team/reports/hms-enterprise.md` |
| Checkpoint | `.cursor/team/checkpoints/hms-enterprise.json` |

**Status:** Complete — all gates PASS, PRD score 100/100.

## Branch

Active development on `hms`. Merge to `main` via PR when ready.
