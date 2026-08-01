# UI/UX Specification: Hospital Management System (Enterprise)

> Pipeline stage 4 · Slug: `hms-enterprise`  
> Stack: **React + Tailwind** · BFF: **NestJS** · DB: **MySQL**

## Meta

| Field | Value |
|-------|-------|
| **Status** | Approved |
| **PRD version** | 1.0 |
| **Author** | ui-ux-designer (BOSS) |

---

## 1. UX Summary

- Clean clinical UI with blue primary (trust), green for success, amber for allergy alerts
- Clerk-first flows: registration under 2 minutes, appointment booking in 3 clicks after patient search
- WCAG 2.1 AA: keyboard forms, visible focus, 4.5:1 contrast
- Responsive: desktop-first for front-desk; tablet support for ward/nursing (Phase 1.1)

---

## 2. User Journeys

### Journey J-001: Register patient (WF-001)

| Step | Screen | User action | Feedback |
|------|--------|-------------|----------|
| 1 | Registration | Fill demographics | Inline validation |
| 2 | Registration | Submit | Loading spinner |
| 3 | Registration | Success | UHID card + print option |
| 4 | Registration | Duplicate | Warning modal |

### Journey J-002: Book appointment (WF-002)

| Step | Screen | User action | Feedback |
|------|--------|-------------|----------|
| 1 | Appointment | Search UHID | Patient banner |
| 2 | Appointment | Pick doctor + slot | Calendar highlight |
| 3 | Appointment | Confirm | Toast + appointment ID |

---

## 3. Information Architecture

```text
/login
/                 Dashboard
/registration     Patient Registration
/appointments/new Book Appointment
/patients/:uhid/emr  EMR
/admin            Administration
```

---

## 4. Screen Specifications

### SCR-001: Dashboard

| Field | Value |
|-------|-------|
| **Route** | `/` |
| **Roles** | all staff |
| **Workflow** | — |

**Layout:** Top nav · 3 stat cards · today's appointment list · quick search

---

### SCR-002: Registration

| Field | Value |
|-------|-------|
| **Route** | `/registration` |
| **Roles** | clerk, admin |
| **Workflow** | WF-001 |

**Components:** PatientForm, DuplicateWarningModal, UhidSuccessCard

---

### SCR-003: Appointment

| Field | Value |
|-------|-------|
| **Route** | `/appointments/new` |
| **Roles** | clerk |
| **Workflow** | WF-002 |

**Components:** PatientSearch, DoctorPicker, SlotCalendar, ConfirmDialog

---

### SCR-004: EMR

| Field | Value |
|-------|-------|
| **Route** | `/patients/:uhid/emr` |
| **Roles** | doctor, nurse |
| **Workflow** | WF-003 |

**Components:** PatientBanner, AllergyAlertBadge, Tabs (History, Allergies, Vitals, Notes)

---

### SCR-005: Admin

| Field | Value |
|-------|-------|
| **Route** | `/admin` |
| **Roles** | admin |
| **Workflow** | WF-004 |

**Components:** HospitalList, BranchManager, UserRoleTable

---

## 5. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| Keyboard nav | Tab order: nav → form fields → primary CTA |
| Screen reader | `aria-label` on search, `role="alert"` on allergy badge |
| Color contrast | slate-900 on white; primary-600 buttons |
| Focus | `ring-2 ring-primary-600` on focus-visible |

---

## 6. Design Tokens (Tailwind)

| Token | Class | Usage |
|-------|-------|-------|
| primary | `blue-600/700` | CTAs, nav active |
| clinical | `green-600` | Success, queue OK |
| alert | `amber-100/800` | Allergy warning |
| surface | `slate-50`, `white` | Background, cards |

---

## 7. HTML Design Handoff

| Screen ID | HTML file | Priority |
|-----------|-----------|----------|
| SCR-001 | `designs/dashboard.html` | Must |
| SCR-002 | `designs/registration.html` | Must |
| SCR-003 | `designs/appointment.html` | Must |
| SCR-004 | `designs/emr.html` | Must |
| SCR-005 | `designs/admin.html` | Should |

---

## 8. Traceability

| Screen | User story | Workflow | FR |
|--------|------------|----------|-----|
| SCR-002 | US-001 | WF-001 | FR-004 |
| SCR-003 | US-002 | WF-002 | FR-007 |
| SCR-004 | US-003 | WF-003 | FR-009 |
| SCR-005 | US-004 | WF-004 | FR-003 |
