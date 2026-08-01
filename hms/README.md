# HMS — Hospital Management System (Phase 1)

**Stack:** React + Tailwind · NestJS BFF · MySQL

Enterprise HMS on the EPB platform (ADR-001 BFF pattern).

## Architecture

```text
React + Tailwind (frontend/)  →  NestJS BFF (apps/bff/)  →  MySQL 8
                                      TypeORM entities
```

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| BFF | NestJS 10, class-validator |
| Database | MySQL 8, TypeORM |
| Legacy tests | In-memory store (`libs/common`, `test/`) |

## Quick start

```bash
# 1. MySQL
cd hms && docker compose up -d mysql
cp .env.example .env

# 2. Install & run BFF
npm install
npm run bff:dev          # http://localhost:3000

# 3. Frontend
npm run fe:dev           # http://localhost:5173
```

## API (NestJS BFF)

| Method | Path | Header |
|--------|------|--------|
| GET | `/api/v1/health` | — |
| POST | `/api/v1/patients` | `x-role: clerk` |
| POST | `/api/v1/appointments` | `x-role: clerk` |
| GET | `/api/v1/patients/{uhid}/emr` | `x-role: doctor` |
| POST | `/api/v1/patients/{uhid}/emr/notes` | `x-role: doctor` |

Default branch `BRN` (Main Branch) seeded on first startup.

## Tests (no DB required)

```bash
npm test
```

## BOSS

- PRD: `.cursor/team/prds/hms-enterprise/PRD.md`
- Report: `.cursor/team/reports/hms-enterprise.md`

## Legacy

`apps/bff/src/server.js` — original Node HTTP scaffold (pre-NestJS). Use NestJS BFF for development.
