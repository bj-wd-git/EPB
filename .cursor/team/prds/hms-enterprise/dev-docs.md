# Development Docs: Hospital Management System (Enterprise)

> **For BOSS delivery.** Generated from PRD.  
> PRD: [PRD.md](./PRD.md)  
> Slug: `hms-enterprise`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Ready for BOSS |
| **BOSS mode** | full |
| **PRD version** | 1.0 |
| **EPB Vision** | applied |
| **Source** | [HMS.md](../../../../HMS.md) |

---

## 1. Implementation Summary

Scaffold enterprise HMS Phase 1 on EPB: NestJS monorepo with React FE, BFF (auth, validation, aggregation), and domain services (patient/registration, appointment, emr, doctor, configuration, audit). Deliver UHID registration, OP appointment booking with conflict detection, core EMR read/write, multi-hospital RBAC, and audit/notification integration. Phase 2+ module folders created as empty scaffolds per HMS.md.

---

## 2. BOSS Delivery Config

| Setting | Value |
|---------|-------|
| **Command** | `BOSS deliver hms-enterprise` |
| **Mode** | full |
| **Roles** | product-manager, business-analyst, solution-architect, backend-developer, frontend-developer, qa-engineer, documentation-versioning, security-review, ui-ux-designer |
| **Specialists** | bugbot, security-review |
| **MCPs** | gbrain, github |
| **Skills** | epb-vision, mcp-routing, prd-developer |

---

## 3. Task Breakdown (ordered)

| # | Task | Role | Depends | Done when |
|---|------|------|---------|-----------|
| T-001 | ADR-007/008/009 drafts; service boundary + folder scaffold | solution-architect | — | ADRs in Decision-Records; monorepo tree matches HMS.md |
| T-002 | Shared libs: auth, common DTOs, validation, logger, audit | backend-developer | T-001 | libs compile; unit tests pass |
| T-003 | BFF: JWT auth, RBAC guard, request validation, logging | backend-developer | T-002 | Auth + health endpoints live |
| T-004 | Configuration service: hospital, branch, department, doctor masters | backend-developer | T-003 | CRUD APIs + migrations |
| T-005 | Registration service: patient CRUD, UHID generator, duplicate check | backend-developer | T-004 | FR-004, FR-005 satisfied |
| T-006 | Appointment service: slots, booking, conflict detection, queue stub | backend-developer | T-005 | FR-006, FR-007, FR-008 |
| T-007 | EMR service: history, allergies, vitals, notes, visit linkage | backend-developer | T-005 | FR-009, FR-010 |
| T-008 | BFF aggregation: patient search, EMR view, appointment flows | backend-developer | T-006, T-007 | All Phase 1 API outline endpoints |
| T-009 | Notification + audit event publishers | backend-developer | T-008 | FR-012, FR-013 events emitted |
| T-010 | React FE: Login, Dashboard, Registration, Appointment, EMR, Admin | frontend-developer | T-008 | Core screens wired to BFF |
| T-011 | UI/UX review: registration + appointment accessibility | ui-ux-designer | T-010 | WCAG checklist in report |
| T-012 | Integration + E2E tests per test plan | qa-engineer | T-010 | TP-001–TP-005 pass |
| T-013 | Security review: PHI, RBAC, audit coverage | security-review | T-012 | security-review.json PASS |
| T-014 | API docs, CHANGELOG, Phase 2 module README | documentation-versioning | T-013 | Docs merged |

---

## 4. API Contracts

### Register patient

**Method:** `POST`  
**Path:** `/api/v1/patients`  
**Auth:** required (clerk, admin)

**Request:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "dateOfBirth": "1990-01-15",
  "gender": "male|female|other",
  "phone": "+91XXXXXXXXXX",
  "email": "optional@email.com",
  "branchId": "uuid",
  "emergencyContact": { "name": "string", "phone": "string" },
  "insurance": { "provider": "string", "policyNumber": "string" }
}
```

**Response:**

```json
{
  "uhid": "HMS-BRN-000001",
  "patientId": "uuid",
  "createdAt": "2026-08-01T10:00:00Z"
}
```

**Errors:**

| Code | When |
|------|------|
| 400 | Validation failure |
| 401 | Unauthenticated |
| 403 | Insufficient role |
| 409 | Duplicate patient warning (override flag required) |

### Book appointment

**Method:** `POST`  
**Path:** `/api/v1/appointments`  
**Auth:** required (clerk, admin)

**Request:**

```json
{
  "patientUhid": "HMS-BRN-000001",
  "doctorId": "uuid",
  "slotStart": "2026-08-02T09:00:00Z",
  "slotEnd": "2026-08-02T09:15:00Z",
  "type": "scheduled|walk-in"
}
```

**Response:**

```json
{
  "appointmentId": "uuid",
  "status": "confirmed",
  "queuePosition": null
}
```

**Errors:**

| Code | When |
|------|------|
| 409 | Slot conflict |
| 404 | Patient or doctor not found |

### Get EMR aggregate

**Method:** `GET`  
**Path:** `/api/v1/patients/{uhid}/emr`  
**Auth:** required (doctor, nurse, clerk)

**Response:**

```json
{
  "uhid": "HMS-BRN-000001",
  "allergies": [{ "substance": "Penicillin", "severity": "high", "confirmed": true }],
  "vitals": [{ "recordedAt": "2026-08-01T09:30:00Z", "bp": "120/80", "pulse": 72 }],
  "diagnoses": [{ "code": "J06.9", "description": "URI", "recordedAt": "2026-08-01" }],
  "notes": [{ "authorId": "uuid", "text": "Patient stable", "createdAt": "2026-08-01T10:00:00Z" }],
  "visits": [{ "appointmentId": "uuid", "date": "2026-08-01" }]
}
```

---

## 5. Data Model

### Entities

| Entity | Fields | Notes |
|--------|--------|-------|
| Hospital | id, name, code, status | Root org |
| Branch | id, hospitalId, name, code | UHID prefix source |
| Patient | id, uhid, demographics, branchId | Unique uhid |
| Appointment | id, patientId, doctorId, slotStart, slotEnd, status | Unique (doctorId, slotStart) |
| EmrProfile | patientId, allergies[], diagnoses[] | 1:1 patient |
| ClinicalNote | id, patientId, authorId, text, createdAt | Append-only |
| AuditEvent | id, actorId, action, resource, payload, at | Immutable |

### Migrations

- Schema `config`: hospitals, branches, departments, doctors
- Schema `patient`: patients, uhid_sequences
- Schema `appointment`: appointments, slots, queues
- Schema `emr`: profiles, notes, vitals
- Schema `audit`: audit_events

---

## 6. Platform Services (EPB)

| Service | Usage |
|---------|-------|
| Notification Platform | Appointment confirmation + reminder events |
| Scheduler Platform | Delayed reminder jobs |
| Audit Platform | Patient/EMR/appointment/admin audit events |
| Shared EPB libs | Logger, validation, error handling patterns |

**Do not reimplement** platform notification, scheduling, or audit infrastructure.

---

## 7. Architecture Decisions

| ADR | Decision needed |
|-----|-----------------|
| ADR-001 | BFF-only FE access — enforce |
| ADR-007 | HMS domain boundaries + schema-per-domain |
| ADR-008 | UHID format and sequence strategy |
| ADR-009 | PHI encryption and audit requirements |

**New ADR required:** yes (ADR-007, ADR-008, ADR-009)

---

## 8. Frontend / UX (if applicable)

| Screen | Route | Key components |
|--------|-------|----------------|
| Login | `/login` | AuthForm, BranchSelector |
| Dashboard | `/` | AppointmentSummary, QueueWidget, PatientSearch |
| Registration | `/registration` | PatientForm, UHIDDisplay, DuplicateWarning |
| Appointment | `/appointments/new` | DoctorPicker, SlotCalendar, ConfirmDialog |
| EMR | `/patients/:uhid/emr` | PatientBanner, AllergyAlert, VitalsTab, NotesTab |
| Admin | `/admin` | HospitalList, UserRoleManager |

**BFF endpoints:** All `/api/v1/*` via single BFF base URL; no direct service URLs in FE.

---

## 9. Test Plan

| ID | Type | Scenario | Expected |
|----|------|----------|----------|
| TP-001 | Unit | UHID sequence generation | Unique per branch; correct format |
| TP-002 | Integration | Register patient + book appointment | UHID returned; appointment confirmed |
| TP-003 | Integration | Double-book same slot | 409 conflict |
| TP-004 | Integration | EMR note append + retrieve | Note visible with author/timestamp |
| TP-005 | E2E | Clerk flow: register → book → doctor views EMR | Full Phase 1 happy path |
| TP-006 | Security | Clerk cannot access admin APIs | 403 on hospital create |
| TP-007 | Integration | RBAC branch scope | User sees only branch patients |

---

## 10. Acceptance Criteria (from PRD)

- [ ] AC-001: Patient registration returns UHID in correct format
- [ ] AC-002: Duplicate detection warns before create
- [ ] AC-003: Registration audit event emitted
- [ ] AC-004: Appointment books only on available slot
- [ ] AC-005: Slot conflict returns 409
- [ ] AC-006: Appointment triggers notification event
- [ ] AC-007: EMR aggregate returns full clinical view
- [ ] AC-008: Clinical note append with author/timestamp
- [ ] AC-009: Unconfirmed allergies show warning
- [ ] AC-010: Multi-hospital/branch setup works
- [ ] AC-011: RBAC denies unauthorized access (403)
- [ ] AC-012: Admin mutations in audit trail

---

## 11. Dependencies & Sequence

```text
T-001 → T-002 → T-003 → T-004 → T-005 → (T-006 + T-007 parallel) → T-008 → T-009
→ T-010 → T-011 → T-012 → T-013 → T-014
```

---

## 12. Out of Scope (reminder)

- Lab, Radiology, Pharmacy, Billing, IPD, OT, Blood Bank, ICU
- HL7/FHIR, PACS, payment gateway, patient portal, mobile apps
- Telemedicine, AI/CDS, NABH compliance workflows

---

## 13. Gate Checklist for BOSS

| Gate | Artifact | Owner |
|------|----------|-------|
| code-review | `code-review.json` | solution-architect |
| qa | `qa.json` | qa-engineer |
| uat | `uat.json` | business-analyst |
| security-review | `security-review.json` | security-review |

---

## 14. Requirements Traceability Matrix

| US | FR | Task | Test | AC |
|----|----|------|------|-----|
| US-001 | FR-004, FR-005, FR-012 | T-005, T-008, T-009 | TP-001, TP-002 | AC-001, AC-002, AC-003 |
| US-002 | FR-006, FR-007, FR-013 | T-006, T-008, T-009 | TP-002, TP-003 | AC-004, AC-005, AC-006 |
| US-003 | FR-009, FR-010, FR-012 | T-007, T-008 | TP-004, TP-005 | AC-007, AC-008, AC-009 |
| US-004 | FR-001, FR-002, FR-003, FR-012 | T-003, T-004, T-009 | TP-006, TP-007 | AC-010, AC-011, AC-012 |

---

## 15. Open Questions

| ID | Question | Blocks |
|----|----------|--------|
| OQ-001 | UHID national standard vs hospital-specific | UHID generator impl |
| OQ-002 | Single DB vs DB-per-service Phase 1 | Migration strategy |
| OQ-003 | Insurance API in Phase 1 | Insurance field validation |
| OQ-004 | SMS vs email first for reminders | Notification adapter |

---

## 16. Handoff

When this doc is **Ready for BOSS**:

```text
Use BOSS to deliver "hms-enterprise"
Read dev-docs at .cursor/team/prds/hms-enterprise/dev-docs.md
```

**Monorepo target structure (from HMS.md):**

```text
apps/bff/          apps/backend/
libs/auth/         libs/common/       libs/audit/
services/patient/  services/registration/  services/appointment/
services/emr/      services/doctor/   services/notification/
frontend/          (React — Dashboard, Registration, Appointment, EMR, Admin)
```
