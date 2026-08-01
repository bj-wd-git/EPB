# ADR-009: API First — Contracts Before Implementation

## Status

Accepted

## Context

When implementation precedes API design, endpoints emerge organically from internal data models, breaking changes ship silently, and frontend and backend teams cannot work in parallel. Consumers discover incompatible payloads only after deployment. Services that lack stable contracts cannot be truly independent.

The API contract is the primary artifact that binds producers and consumers across team boundaries.

## Decision

EPB adopts API First design for all services:

- OpenAPI specifications are written and reviewed with consumers before implementation code
- Implementation must conform to the spec — not the other way around
- Contract tests run in CI to detect spec/implementation drift
- APIs are versioned explicitly; breaking changes require a new version, never silent modification
- Client SDKs and stubs are generated from specs for BFF and frontend teams
- All endpoints follow [API Standards](../Volume-1-Foundation/18-api-standards.md) for naming, error format, pagination, and versioning

Design the API, review it with consumers, generate stubs, then implement.

## Consequences

**Positive:**
- Stable contracts enable parallel frontend and backend development
- Breaking changes caught in review and CI, not in production
- Generated stubs and SDKs reduce manual integration errors
- Services remain independently deployable with explicit versioned interfaces

**Negative:**
- Upfront design effort before any working code
- Spec maintenance overhead — specs must stay synchronized with implementation
- Over-specification risk if contracts are finalized before requirements are understood

## References

- [API First Design](../Volume-1-Foundation/37-api-first-design.md)
- [API Standards](../Volume-1-Foundation/18-api-standards.md)
- [Documentation Standards](../Volume-1-Foundation/28-documentation-standards.md)
