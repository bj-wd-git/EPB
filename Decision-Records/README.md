# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Enterprise Platform Blueprint (EPB). Each ADR documents a significant architectural decision, its context, consequences, and links to the handbook chapters that elaborate on the decision.

ADRs follow the format defined in [Architecture Decision Records](../Volume-1-Foundation/34-architecture-decision-records.md).

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](ADR-001-layered-architecture-bff.md) | Layered Architecture with BFF | Accepted |
| [ADR-002](ADR-002-model-separation-five-models.md) | Model Separation — Five Models | Accepted |
| [ADR-003](ADR-003-independent-services-data-ownership.md) | Independent Services — Data Ownership | Accepted |
| [ADR-004](ADR-004-read-write-separation.md) | Read/Write Separation | Accepted |
| [ADR-005](ADR-005-transactional-reporting-separation.md) | Transactional and Reporting Separation | Accepted |
| [ADR-006](ADR-006-notification-event-driven.md) | Notification — Event-Driven Delivery | Accepted |
| [ADR-007](ADR-007-bff-single-entry-point.md) | BFF as Single Entry Point | Accepted |
| [ADR-008](ADR-008-shared-library-single-source.md) | Shared Library as Single Source of Truth | Accepted |
| [ADR-009](ADR-009-api-first-contracts.md) | API First — Contracts Before Implementation | Accepted |

## Creating a New ADR

1. Copy the structure from an existing ADR (Status, Context, Decision, Consequences, References)
2. Number sequentially (`ADR-010-...`)
3. Set status to `Proposed` until reviewed, then `Accepted`
4. Link to relevant Volume 1 and Volume 2 handbook chapters in References
5. Add the new entry to the index table above
