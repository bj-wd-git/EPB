## [0.4.0] - 2026-08-02

### Added — Phase 2

- **Laboratory:** test catalog, orders, results (NestJS + MySQL)
- **Radiology:** imaging orders, report completion
- **Pharmacy:** prescriptions, dispense workflow
- **Billing:** OP invoices, pay flow
- React pages: `/lab`, `/radiology`, `/pharmacy`, `/billing`
- Tests: `hms/test/phase2.test.js` (4 scenarios)
- RBAC: lab, pharmacist roles; extended doctor/clerk permissions

## [0.3.0] - 2026-08-02

### Added

- Appointment FE: slot picker, book flow, link to EMR
- EMR FE: load notes/visits, save clinical notes, allergy alert badge
- BFF: `GET /branches`, `GET /doctors`, fixed seed branch UUID
- Dashboard quick UHID search → EMR

### BOSS

- `BOSS deliver hms-enterprise --full` complete — all gates PASS

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
