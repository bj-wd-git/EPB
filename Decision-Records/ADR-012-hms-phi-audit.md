# ADR-012: HMS PHI Handling and Clinical Audit

## Status

Accepted

## Context

HMS stores protected health information (PHI). Phase 1 clinical modules (registration, EMR, appointments) require HIPAA-aligned controls: access logging, encryption, and role-based restrictions.

## Decision

1. **Encryption:** PHI fields encrypted at rest (application-level or DB TDE); TLS required in transit
2. **RBAC:** Every API endpoint guarded by role + branch scope (admin, clerk, doctor, nurse)
3. **Audit:** All patient, EMR, appointment, and admin mutations emit immutable audit events via `audit` schema
4. **Logging:** No PHI in application logs — use resource IDs only
5. **Allergy safety:** Unconfirmed allergies flagged with `confirmed: false`; FE shows warning badge (AC-009)

Audit event schema:

```json
{
  "actorId": "uuid",
  "action": "patient.create | emr.note.add | appointment.book",
  "resource": "patient | emr | appointment",
  "resourceId": "uuid",
  "branchId": "uuid",
  "timestamp": "ISO-8601"
}
```

## Consequences

**Positive:**
- Compliance foundation before Phase 2 clinical expansion
- Security-review gate has concrete checklist
- Reuses EPB audit patterns

**Negative:**
- Encryption key management required in deployment
- Performance overhead on high-volume audit writes (mitigated by async publish)

## References

- [HMS PRD § Security & Compliance](../.cursor/team/prds/hms-enterprise/PRD.md)
- [ADR-006: Notification Event-Driven](./ADR-006-notification-event-driven.md)
