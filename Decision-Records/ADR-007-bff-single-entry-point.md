# ADR-007: BFF as Single Entry Point

## Status

Accepted

## Context

When frontends call platform services directly, clients become coupled to service topology, auth mechanisms vary per service, and screen-level data requires N+1 network round trips. Every backend reorganization forces frontend changes. Security policies fragment across service endpoints.

A single, well-defined entry point centralizes cross-cutting concerns and shields clients from backend complexity.

## Decision

The BFF (Backend For Frontend) is the only entry point for frontend clients:

- Web, mobile, and admin frontends communicate exclusively with their BFF — never directly with platform or application services
- The BFF handles authentication validation, request aggregation, input validation, and response mapping on every request
- Each frontend application may have its own BFF tailored to its screen needs, but all BFFs follow the same EPB standards
- Platform and application services are internal; their endpoints are not exposed to client networks

## Consequences

**Positive:**
- Single auth and validation point for all client traffic
- Frontend decoupled from service topology and internal API changes
- Aggregation reduces round trips — one BFF call replaces many service calls
- Consistent API surface tailored to each client application's needs

**Negative:**
- BFF can become a bottleneck if overloaded with business logic
- Additional network hop adds latency (mitigated by aggregation)
- BFF team must stay current with downstream service contracts

## References

- [Backend For Frontend (BFF)](../Volume-1-Foundation/08-bff-layer.md)
- [Frontend Layer](../Volume-1-Foundation/07-frontend-layer.md)
- [Layered Architecture](../Volume-1-Foundation/06-layered-architecture.md)
