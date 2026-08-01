# ADR-002: Model Separation — Five Models

## Status

Accepted

## Context

Services that reuse a single class for HTTP payloads, business logic, and database rows create tight coupling across layers. Entity fields leak into API responses, API changes force schema migrations, and business rules attach to types that also serialize over HTTP. Teams hesitate to evolve any layer because everything moves together.

EPB requires explicit boundaries at every service interior. Each concern — inbound API shape, outbound API shape, write orchestration, business rules, and persistence — needs its own model with mappers between them.

## Decision

Every EPB service maintains five distinct model types:

1. **Request DTO** — inbound API payload; only fields clients may submit
2. **Response DTO** — outbound API payload; curated view with computed and nested fields
3. **Transaction Model** — write orchestration; coordinates multi-step mutations within a unit of work
4. **Domain Model** — business rules, invariants, and domain logic
5. **Entity** — persistence model mirroring database columns, audit fields, and vendor types

Mappers convert between types at each boundary. No type crosses a layer without explicit mapping. Complex response DTOs may assemble data from multiple entities without exposing full entity graphs.

## Consequences

**Positive:**
- API contracts evolve independently of database schema
- Business rules stay isolated from serialization concerns
- Persistence changes do not break clients
- Each layer has a single, clear responsibility

**Negative:**
- More classes and mapper code to maintain
- Mapping bugs can cause subtle data loss or field mismatches
- Onboarding requires understanding five model roles and conversion flow

## References

- [Model Separation](../Volume-1-Foundation/11-model-separation.md)
- [DTO Standards](../Volume-1-Foundation/15-dto-standards.md)
- [Entity Standards](../Volume-1-Foundation/16-entity-standards.md)
- [Mapping Strategy](../Volume-1-Foundation/17-mapping-strategy.md)
