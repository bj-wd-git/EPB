# ADR-011: HMS UHID Generation and Uniqueness

## Status

Accepted

## Context

Patient identity must be unique across the hospital network. National health ID standards may vary by region (OQ-001). Phase 1 requires a hospital-controlled identifier that is human-readable and branch-scoped.

## Decision

UHID format: `HMS-{branchCode}-{sequence}` where:

- `branchCode` — 3–6 alphanumeric chars from branch master (uppercase)
- `sequence` — zero-padded 6-digit integer per branch, atomically incremented

Rules:

1. Sequence stored in `patient.uhid_sequences` table with row-level lock on increment
2. Global unique constraint on `patients.uhid` column
3. Duplicate detection before create: match on `(phone, normalizedName, dateOfBirth)` returns 409 with override flag
4. UHID immutable after issuance — no updates, only merge workflow in future phase

Implementation: `hms/libs/common/src/uhid.ts`

## Consequences

**Positive:**
- Human-readable IDs for front-desk staff
- Branch-scoped sequences prevent collision across facilities
- Atomic increment prevents race conditions

**Negative:**
- Format may need migration if national UHID standard mandated later
- Merge/dedup workflow deferred to Phase 2

## References

- [HMS PRD § US-001](../.cursor/team/prds/hms-enterprise/PRD.md)
- [ADR-010: HMS Domain Boundaries](./ADR-010-hms-domain-service-boundaries.md)
