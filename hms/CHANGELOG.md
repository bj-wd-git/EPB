## [0.8.2] - 2026-08-02

### Added — Demo data (BOSS)

- Rich MySQL demo seed across Phases 1–6 on BFF startup (`HMS_SEED_DEMO`)
- 5 demo patients (`BRN000001`–`BRN000005`), 2 doctors, East Clinic branch
- Sample appointments, EMR notes, lab/radiology/pharmacy/billing
- IPD admission + OT booking + ER visits; insurance, HR leave, stock movements
- Teleconsult, notifications, compliance CAPA, consents, mobile devices
- Expanded catalogs: lab tests, wards/beds, employees, inventory SKUs

## [0.8.1] - 2026-08-02

### Added — BOSS develop

- Staff login wired to `POST /security/sessions` (Phase 6 security)
- `auth.ts` session storage; all FE API clients use `authHeaders()`
- NavBar shows logged-in role; logout support
- README updated for Phases 1–6; appointment entity TS fix
- Docker MySQL mapped to host port **3307** (avoids conflict with existing :3306)
- Phase 6 FE: `createSession` import fixed (`auth.ts` not `api-phase6`)
- TypeORM entity column types fixed for nullable fields (MySQL runtime)

## [0.8.0] - 2026-08-02

### Added — Phase 6

- **Compliance:** incident reporting, consent forms, CAPA actions, NABH/JCI audit summary
- **Security:** sessions, API key management, access logs, PHI audit trail
- **Mobile:** device registration, patient/doctor/nurse sync bundles
- React pages: `/compliance`, `/security`, `/mobile`
- Tests: `hms/test/phase6.test.js` (6 scenarios)
- RBAC: `compliance`, `security`, `mobile` permissions

### Milestone

HMS Phases 1–6 complete — full module roadmap from HMS.md implemented.

## [0.7.0] - 2026-08-02

### Added — Phase 5

- **Patient Portal:** dashboard, online appointments, bills, prescriptions, lab reports, teleconsult booking
- **Doctor Portal:** schedule view, lab review queue, clinical notes
- **Communications:** SMS/email/WhatsApp/push messaging, appointment reminders
- React pages: `/portal/patient`, `/portal/doctor`, `/communications`
- Tests: `hms/test/phase5.test.js` (5 scenarios)
- RBAC: `portal:patient`, `portal:doctor`, `communications` permissions; new `patient` role

## [0.6.0] - 2026-08-02

### Added — Phase 4

- **Insurance:** policy registration, pre-auth, claims submission and settlement
- **HR:** employee management, leave request and approval workflow
- **Inventory:** item master, stock receive/consume, low-stock alerts
- **Reports:** operational, financial, clinical, and inventory dashboards
- React pages: `/insurance`, `/hr`, `/inventory`, `/reports`
- Seed data: 3 employees, 3 inventory items (with low-stock demo)
- Tests: `hms/test/phase4.test.js` (5 scenarios)
- RBAC: insurance, hr, inventory, reports permissions; new `hr` role

## [0.5.0] - 2026-08-02

### Added — Phase 3

- **Ward:** ward list, bed inventory, occupancy metrics
- **IPD:** admit, discharge, bed transfer workflows
- **OT:** surgery booking and completion
- **Emergency:** ER registration (UHID or walk-in), triage levels 1–5
- React pages: `/ward`, `/ipd`, `/ot`, `/emergency`
- Seed data: General Ward (3 beds), ICU (2 beds)
- Tests: `hms/test/phase3.test.js` (6 scenarios)
- RBAC: ward, ipd, ot, emergency permissions for nurse, doctor, clerk

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
