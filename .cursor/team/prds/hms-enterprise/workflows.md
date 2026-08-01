# Workflows: Hospital Management System (Enterprise)

> Pipeline stage 3 · Slug: `hms-enterprise`

## Meta

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **PRD version** | 1.0 |
| **Author** | business-analyst (BOSS) |

---

## 1. Workflow Summary

Phase 1 covers four core clinical-admin flows: patient registration with UHID issuance, OP appointment booking with conflict prevention, EMR consultation read/write, and multi-hospital administration with RBAC. All flows route through the NestJS BFF; audit events fire on every mutation.

---

## 2. Actors

| Actor | Role | System access |
|-------|------|---------------|
| Registration clerk | Front desk | patients:write, appointments:write, emr:read |
| Doctor | Clinician | emr:read/write, patients:read |
| Nurse | Clinical staff | emr:read/write, vitals |
| Hospital admin | Administrator | hospitals, branches, users, roles |
| System | BFF / services | audit, notifications |

---

## 3. Process Flows

### WF-001: Patient registration with UHID

**Trigger:** Clerk submits new patient form  
**Preconditions:** Valid branch selected; clerk authenticated  
**Postconditions:** UHID issued; patient record created; audit logged

```text
Clerk → Fill form → Duplicate check → [warn] → Override? → Create → UHID → Print/Display
```

| Step | Actor | Action | System | Output |
|------|-------|--------|--------|--------|
| 1 | Clerk | Enter demographics | FE Registration | Form data |
| 2 | System | Duplicate detect (phone+name+DOB) | BFF POST /patients | 409 or continue |
| 3 | System | Generate UHID, persist | Registration svc | HMS-BRN-000001 |
| 4 | System | Emit audit | Audit svc | patient.create event |

**Alternate paths:**

- **WF-001-A:** Duplicate found → modal warning → override flag → create
- **WF-001-B:** Validation error → inline field errors

---

### WF-002: OP appointment booking

**Trigger:** Clerk books appointment for registered patient  
**Preconditions:** Patient UHID exists; doctor has available slot  
**Postconditions:** Appointment confirmed; notification event queued

```text
Clerk → Search patient → Select doctor → Pick slot → Confirm → [409 if conflict]
```

| Step | Actor | Action | System | Output |
|------|-------|--------|--------|--------|
| 1 | Clerk | Search/select patient | FE | UHID |
| 2 | Clerk | Select doctor + slot | FE Appointment | slotStart/End |
| 3 | System | Conflict check | BFF POST /appointments | 201 or 409 |
| 4 | System | Link visit to EMR | EMR svc | visit record |
| 5 | System | Notification stub | Notification | appointment.confirm |

---

### WF-003: EMR consultation

**Trigger:** Doctor opens patient during/after appointment  
**Preconditions:** Patient registered; role doctor/nurse  
**Postconditions:** Clinical notes appended; allergies flagged if unconfirmed

```text
Doctor → Open EMR → Review history/allergies → Add note → Save → Audit
```

| Step | Actor | Action | System | Output |
|------|-------|--------|--------|--------|
| 1 | Doctor | Open patient EMR | GET /patients/{uhid}/emr | Aggregate view |
| 2 | System | Show allergy warning | FE | Badge if unconfirmed |
| 3 | Doctor | Add clinical note | POST .../emr/notes | Note with author/time |

---

### WF-004: Hospital administration

**Trigger:** Admin configures org structure  
**Preconditions:** Admin role  
**Postconditions:** Hospital/branch/user/role updated; audit logged

```text
Admin → Hospitals → Branches → Users → Roles → Save → Audit
```

---

## 4. State Machines

### Appointment

| State | Description | Transitions |
|-------|-------------|-------------|
| confirmed | Booked slot | → completed, cancelled |
| cancelled | Released slot | terminal |
| completed | Visit done | terminal |

---

## 5. Business Rules

| ID | Rule | Applies to |
|----|------|------------|
| BR-001 | UHID format HMS-{branchCode}-{6-digit seq} | WF-001 |
| BR-002 | One appointment per doctor+slotStart | WF-002 |
| BR-003 | Unconfirmed allergies show warning badge | WF-003 |
| BR-004 | All mutations emit audit event | All |

---

## 6. Traceability to PRD

| Workflow | User story | Functional req |
|----------|------------|----------------|
| WF-001 | US-001 | FR-004, FR-005, FR-012 |
| WF-002 | US-002 | FR-006, FR-007, FR-013 |
| WF-003 | US-003 | FR-009, FR-010 |
| WF-004 | US-004 | FR-001, FR-002, FR-003 |
