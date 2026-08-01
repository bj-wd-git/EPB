# ADR-003: Independent Services — Data Ownership

## Status

Accepted

## Context

EPB is a platform of many deployable services — platform capabilities and application domains — not a monolith with boundaries drawn in documentation only. Independence breaks the moment one service queries another service's database. Schema changes become cross-team negotiations, scaling read replicas for analytics exposes write tables, and transaction boundaries blur.

Shared databases create distributed monoliths with the worst properties of both worlds: tight coupling without transactional guarantees across service boundaries.

## Decision

Each EPB service owns its data exclusively:

- Every deployable service has its own database (or schema isolated at the infrastructure level)
- A service is the sole writer to its data store; no other service reads or writes that store directly
- Cross-service integration happens only through HTTP APIs or asynchronous events on the Event Bus
- Shared libraries carry types and contracts, never live data or connection strings
- Platform services follow the same ownership rules as application services

No service embeds another service's connection string. No arrow connects one service's database to another's.

## Consequences

**Positive:**
- Teams deploy, scale, and schema-migrate independently
- Clear ownership boundaries reduce cross-team coordination
- Failure isolation — one service's database issues do not corrupt another's data
- Enforces explicit contracts via APIs and events

**Negative:**
- Cross-entity queries require API calls or denormalized read models instead of SQL joins
- Eventual consistency across service boundaries must be designed explicitly
- Data duplication may be needed for performant reads

## References

- [Independent Services](../Volume-1-Foundation/14-independent-services.md)
- [Platform Services Layer](../Volume-1-Foundation/09-platform-services-layer.md)
- [Event Bus](../Volume-2-Platform-Services/30-event-bus.md)
