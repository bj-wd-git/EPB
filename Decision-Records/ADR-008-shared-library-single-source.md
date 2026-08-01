# ADR-008: Shared Library as Single Source of Truth

## Status

Accepted

## Context

In a multi-service platform, the fastest way to introduce bugs is to let every team define their own request shape for "create resource" or their own numeric codes for status values. Services compile independently but fail at runtime when field names, nullability, or enum mappings disagree.

Duplicate DTO definitions across services create drift that the compiler cannot catch and production traffic eventually exposes.

## Decision

EPB centralizes canonical type definitions in shared library packages:

- One common library is the single source of truth for DTOs, entities, enums, constants, validators, and mapper contracts
- Platform services, application services, and BFFs import the same shared library artifacts — never copy-paste type definitions
- When a contract changes, the library version bumps semantically; consumers update and the compiler catches mismatches
- Shared libraries contain types, interfaces, constants, and validators — not business logic, database access, or workflow orchestration

Packages may be split by concern (API contracts, domain types, persistence models) to keep dependency graphs lean.

## Consequences

**Positive:**
- Eliminates duplicate DTO and enum definitions across services
- Contract changes caught at compile time, not in production
- Consistent validation rules and field naming platform-wide
- Enables parallel development with shared type safety

**Negative:**
- Shared library changes can trigger rebuilds across many dependent services
- Requires disciplined semantic versioning and release coordination
- Risk of shared libraries becoming a dumping ground for logic that belongs in services

## References

- [Shared Libraries](../Volume-1-Foundation/10-shared-libraries.md)
- [DTO Standards](../Volume-1-Foundation/15-dto-standards.md)
- [Coding Standards](../Volume-1-Foundation/25-coding-standards.md)
