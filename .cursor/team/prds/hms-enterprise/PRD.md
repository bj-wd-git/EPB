# Product Requirements Document: Hospital Management System (Enterprise)

## Meta

| Field | Value |
|-------|-------|
| **Slug** | hms-enterprise |
| **Status** | Draft |
| **Version** | 1.0 |
| **Author** | prd-developer (BOSS) |
| **Created** | 2026-08-01 |
| **Source** | [HMS.md](../../../../HMS.md) |
| **EPB Vision** | applied |
| **Dev docs** | `.cursor/team/prds/hms-enterprise/dev-docs.md` |

---

## 1. Executive Summary

Build an enterprise **Hospital Management System (HMS)** on the EPB platform using a **React frontend → NestJS BFF → domain backend services** architecture. Phase 1 delivers the foundation (auth, multi-hospital setup, RBAC), patient registration with UHID, appointment scheduling with queue management, and core EMR capabilities. The system is designed to scale across 37 bounded domains documented in HMS.md, delivered incrementally via BOSS.

---

## 2. Problem Statement

### Current state

HMS.md defines a comprehensive module map (16 legacy modules expanding to 37 enterprise domains) and a recommended BFF + domain-services architecture, but no implemented codebase, APIs, or delivery plan exists.

### Pain points

- No unified patient identity (UHID) across modules
- Fragmented module list without phased delivery or service boundaries
- Missing EPB platform alignment (BFF pattern, shared libraries, notification/audit reuse)
- No traceable requirements for BOSS delivery

### Opportunity

Apply ADR-001 layered architecture and EPB platform services to deliver a modular HMS that scales from foundation to full clinical, financial, and operational domains without rework.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Foundation ready | Auth + RBAC + hospital setup operational | Phase 1 complete |
| Patient identity | UHID issued per registration | 100% new patients |
| Appointment throughput | OP appointment booked end-to-end | < 2 min registration-to-slot |
| Clinical record access | EMR view for registered patient | < 3 sec BFF response (p95) |
| Architecture compliance | Services follow BFF-only FE access | 0 direct FE→backend calls |
| Delivery quality | BOSS gate pass rate | ≥ 95% on Phase 1 gates |

---

## 4. Scope

### In scope (Phase 1)

- **Foundation:** JWT auth, user/role/permission management, multi-hospital/branch setup, department & doctor masters, audit logs
- **Patient Registration:** Demographics, UHID generation, emergency contacts, insurance stub, identity document refs
- **Appointment:** OP scheduling, doctor availability/slots, walk-in queue, waiting list
- **EMR (core):** Medical history, allergies, diagnosis, vitals, clinical notes, visit history
- **BFF:** Auth, validation, aggregation, caching, logging per HMS.md
- **React FE:** Dashboard, Registration, Appointment, EMR, Administration shells
- **Domain services:** patient, registration, appointment, emr, doctor, notification (Phase 1 subset)
- **Shared libs:** auth, common DTOs, validation, logger, audit, notification interfaces

### Out of scope (Phase 1 — later phases)

- Laboratory, Radiology, Pharmacy, Billing, IPD/Ward, OT, Blood Bank, ICU, HR, Finance
- HL7/FHIR, PACS/DICOM, payment gateway, Aadhaar/eKYC integrations
- Patient/Doctor portals, mobile apps, telemedicine, AI/CDS
- NABH/JCI compliance workflows (Phase 4)

### Assumptions

- NestJS monorepo (`apps/bff`, `apps/backend`, `libs/*`, `services/*`) per HMS.md folder structure
- PostgreSQL with domain-scoped schemas (patient, registration, emr, appointment, audit, config)
- Redis for BFF caching; RabbitMQ for async events (appointment reminders)
- EPB Notification Platform for SMS/email appointment reminders (Phase 1 stub)

---

## 5. Stakeholders & Personas

| Persona | Role | Needs |
|---------|------|-------|
| Hospital admin | System administrator | Multi-hospital setup, roles, masters |
| Registration clerk | Front desk | Fast patient registration, UHID |
| Doctor | Clinician | Schedule, EMR, prescriptions stub |
| Nurse | Clinical staff | Vitals entry, patient lookup |
| Patient | End user | Appointment booking (staff-assisted v1) |
| Platform engineer | EPB/HMS builder | BFF pattern, service boundaries, BOSS deliverability |

---

## 6. User Stories & Acceptance Criteria

### US-001: Patient registration with UHID

**As a** registration clerk  
**I want** to register a new patient and receive a unique UHID  
**So that** the patient is identifiable across all HMS modules

**Acceptance criteria:**

- [ ] AC-001: `POST /api/v1/patients` creates patient and returns UHID in `HMS-{branchCode}-{seq}` format
- [ ] AC-002: Duplicate detection warns on matching phone + name + DOB before create
- [ ] AC-003: Registration audit event emitted with actor and timestamp

### US-002: OP appointment booking

**As a** registration clerk  
**I want** to book an OP appointment against a doctor's available slot  
**So that** patients are scheduled without double-booking

**Acceptance criteria:**

- [ ] AC-004: `POST /api/v1/appointments` books slot only if doctor availability allows
- [ ] AC-005: Conflicting slot returns 409 with existing appointment reference
- [ ] AC-006: Appointment confirmation triggers notification event (SMS/email stub)

### US-003: Clinical EMR view and update

**As a** doctor  
**I want** to view and update a patient's EMR during consultation  
**So that** clinical decisions are based on complete history

**Acceptance criteria:**

- [ ] AC-007: `GET /api/v1/patients/{uhid}/emr` returns history, allergies, vitals, notes
- [ ] AC-008: `POST /api/v1/patients/{uhid}/emr/notes` appends clinical note with author and timestamp
- [ ] AC-009: Allergy updates require confirmation flag; unconfirmed allergies show warning badge in FE

### US-004: Multi-hospital administration

**As a** hospital admin  
**I want** to configure hospitals, branches, departments, and role permissions  
**So that** staff access is scoped correctly per facility

**Acceptance criteria:**

- [ ] AC-010: Admin can create hospital + branch; users assigned to branch scope
- [ ] AC-011: RBAC denies API access when role lacks permission (403)
- [ ] AC-012: All admin mutations logged in audit trail

---

## 7. Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-001 | JWT authentication with refresh tokens via BFF | Must | ADR-001 |
| FR-002 | RBAC with hospital/branch-scoped permissions | Must | Roles: admin, clerk, doctor, nurse |
| FR-003 | Multi-hospital and branch master data CRUD | Must | Foundation module |
| FR-004 | Patient registration with auto UHID generation | Must | Registration service |
| FR-005 | Patient search by UHID, name, phone | Must | BFF aggregation |
| FR-006 | Doctor schedule and slot management | Must | Appointment service |
| FR-007 | OP appointment booking with conflict detection | Must | |
| FR-008 | Walk-in queue registration and position | Should | Queue per department |
| FR-009 | EMR: medical history, allergies, diagnosis, vitals, notes | Must | EMR service |
| FR-010 | Visit history linked to appointments | Must | |
| FR-011 | BFF request validation and response mapping | Must | No business logic in BFF |
| FR-012 | Audit log for patient, appointment, EMR, admin actions | Must | Reuse EPB audit patterns |
| FR-013 | Appointment reminder notification event | Should | Notification Platform |
| FR-014 | React FE modules: Dashboard, Registration, Appointment, EMR, Admin | Must | Phase 1 shells |
| FR-015 | Domain service scaffold for Phase 2+ modules | Should | Empty NestJS modules per HMS.md |

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | BFF p95 < 300ms for read; registration < 500ms write |
| Scalability | Horizontal scale BFF and stateless services; DB per domain schema |
| Availability | 99.5% uptime target Phase 1; health checks on all services |
| Security | HTTPS only; JWT; PHI encrypted at rest; RBAC on every endpoint |
| Observability | Structured logging (Pino); correlation IDs; metrics per service |
| Accessibility | WCAG 2.1 AA for registration and appointment flows |
| Compliance | HIPAA-aligned audit trail; consent capture stub for Phase 1 |

---

## 9. Data Requirements

### Entities

| Entity | Description | Owner service |
|--------|-------------|---------------|
| Hospital | Top-level org | Configuration |
| Branch | Facility under hospital | Configuration |
| User | Staff account | Auth |
| Role / Permission | RBAC | Auth |
| Patient | Demographics + UHID | Registration |
| Appointment | OP slot booking | Appointment |
| EMRRecord | Clinical data per patient | EMR |
| ClinicalNote | Consultation notes | EMR |
| AuditEvent | Immutable action log | Audit |

### Data flows

- Registration → UHID → Appointment links patientId
- Appointment completed → EMR visit record created
- EMR updates → audit events → optional notification

---

## 10. Integrations & Dependencies

| System | Type | Direction | Purpose |
|--------|------|-----------|---------|
| EPB Notification Platform | Event | Out | Appointment reminders |
| EPB Audit Platform | Event | Out | Compliance audit trail |
| Redis | Cache | BFF | Session, slot cache |
| RabbitMQ | Event | Internal | Async notifications |
| PostgreSQL | DB | Internal | Domain schemas |

---

## 11. API Outline (high level)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/auth/login` | Staff login |
| POST | `/api/v1/auth/refresh` | Token refresh |
| GET | `/api/v1/hospitals` | List hospitals (admin) |
| POST | `/api/v1/hospitals` | Create hospital |
| POST | `/api/v1/patients` | Register patient + UHID |
| GET | `/api/v1/patients/search` | Search patients |
| GET | `/api/v1/patients/{uhid}` | Patient detail |
| GET | `/api/v1/doctors/{id}/slots` | Available slots |
| POST | `/api/v1/appointments` | Book appointment |
| GET | `/api/v1/appointments/{id}` | Appointment detail |
| GET | `/api/v1/patients/{uhid}/emr` | EMR aggregate view |
| POST | `/api/v1/patients/{uhid}/emr/notes` | Add clinical note |
| PATCH | `/api/v1/patients/{uhid}/emr/allergies` | Update allergies |

---

## 12. UX Requirements

### Screens / flows

- **Login** → branch selection (if multi-branch user)
- **Dashboard** → today's appointments, queue count, quick search
- **Registration** → new patient form, UHID display, print stub
- **Appointment** → doctor picker, calendar slots, confirm
- **EMR** → patient banner, tabs: History, Allergies, Vitals, Notes
- **Admin** → hospitals, branches, departments, users, roles

### Accessibility

- Keyboard navigation for registration form
- Screen reader labels on patient search and appointment calendar
- High-contrast mode support in React theme

---

## 13. Security & Compliance

| Concern | Requirement |
|---------|-------------|
| Authentication | JWT access + refresh; BFF-only token issuance |
| Authorization | RBAC per endpoint; branch-scoped data access |
| Data protection | PHI encrypted at rest; TLS in transit; no PHI in logs |
| Audit | All CRUD on patient/EMR/appointment logged immutably |
| Session | Idle timeout 30 min; secure cookie flags |

---

## 14. EPB Platform Mapping

| Capability | Platform service | Build vs reuse |
|------------|------------------|----------------|
| BFF layer | ADR-001 pattern | Reuse — NestJS BFF scaffold |
| Authentication | Identity patterns from EPB | Extend — HMS RBAC roles |
| Notifications | Notification Platform | Reuse — appointment reminders |
| Audit | Audit Platform patterns | Reuse — clinical audit events |
| Scheduler | Scheduler Platform | Reuse — reminder jobs (Phase 1 stub) |
| Shared libs | EPB common libs | Extend — HMS DTOs, enums |
| HMS domain services | New application | New app — patient, emr, appointment |

**ADR candidates:**

- ADR-007: HMS domain service boundaries and database-per-schema strategy
- ADR-008: UHID generation and uniqueness rules
- ADR-009: PHI handling and audit requirements for clinical modules

---

## 15. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Scope creep (37 modules) | High | High | Strict Phase 1 gate; phased roadmap in dev-docs |
| BFF becomes god-service | High | Medium | ADR-001 enforcement; no business logic in BFF |
| PHI compliance gaps | High | Medium | Security-review gate; audit from day 1 |
| UHID collision | Medium | Low | Branch-scoped sequences + DB unique constraint |
| Performance under load | Medium | Medium | Redis cache; load test in QA gate |

---

## 16. Open Questions

| ID | Question | Owner | Status |
|----|----------|-------|--------|
| OQ-001 | UHID format: national standard vs hospital-specific? | Product | Open |
| OQ-002 | Single DB instance vs DB-per-service for Phase 1? | Architect | Open |
| OQ-003 | Insurance validation API in Phase 1 or Phase 2? | Product | Open |
| OQ-004 | Which notification channels first: SMS, email, or both? | Product | Open |

---

## 17. Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product | | | Pending |
| Engineering | | | Pending |
| Clinical SME | | | Pending |

**Approved PRD unlocks:** `BOSS deliver hms-enterprise`

---

## 18. Requirements Summary

| Type | Count | IDs |
|------|-------|-----|
| User stories | 4 | US-001–US-004 |
| Functional reqs | 15 | FR-001–FR-015 |
| Acceptance criteria | 12 | AC-001–AC-012 |
| Open questions | 4 | OQ-001–OQ-004 |

_Quality target: validate-prd.js score ≥ 85_

**Phase roadmap (from HMS.md):** Phase 2 — Lab, Radiology, Pharmacy, Billing; Phase 3 — IPD, Ward, OT, Emergency; Phase 4 — Finance, HR, Compliance, Integrations (HL7/FHIR).
