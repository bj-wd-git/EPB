## [0.2.0] - 2026-08-01

### Changed

- **Stack upgrade:** React + Tailwind CSS (Vite), NestJS BFF, MySQL 8 (TypeORM)
- Docker Compose for local MySQL
- NestJS modules: patients, appointments, emr, health
- Tailwind-styled frontend shell

### Added

- `docker-compose.yml`, `.env.example`
- TypeORM entities and MySQL migrations via synchronize (dev)

## [0.1.0] - 2026-08-01

### Added

- HMS Phase 1 scaffold: BFF, domain store, UHID generator (ADR-011)
- Patient registration, appointment booking, EMR read/write APIs
- RBAC via role headers; audit event publisher (ADR-012)
- React frontend shell pages
- ADR-010, ADR-011, ADR-012
- Unit and integration tests (TP-001–TP-004)

### BOSS

- Delivered via `BOSS deliver hms-enterprise --full`
- PRD approved at quality score 100/100
