# ADR-001: Layered Architecture with BFF

## Status

Accepted

## Context

Enterprise applications need a consistent structure that separates UI concerns, API aggregation, business services, and infrastructure. Without a BFF, frontends couple directly to many backend services.

## Decision

Adopt five layers: Frontend → BFF → Platform Services → Shared Libraries → Infrastructure. The BFF is the only entry point for frontend clients.

## Consequences

**Positive:**
- Single auth and validation point
- Frontend decoupled from service topology
- Consistent API surface for clients

**Negative:**
- BFF can become a bottleneck if overloaded with business logic
- Additional hop adds latency (mitigated by aggregation reducing round trips)

## References

- [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md)
- [BFF Layer](../Volume-1-Foundation/08-bff-layer.md)
