# Architecture Diagrams

Mermaid source files and companion documentation for core EPB architectural patterns. Each diagram has a `.mmd` source file and a `.md` page with description, rendered diagram, and links to handbook chapters.

## Diagrams

| Diagram | Description | Source | Documentation |
|---------|-------------|--------|---------------|
| Layered Architecture | Five-layer stack from clients to infrastructure | [layered-architecture.mmd](layered-architecture.mmd) | (inline in source file) |
| Model Separation | Five model types and explicit mapper flow | [model-separation.mmd](model-separation.mmd) | [model-separation.md](model-separation.md) |
| Service Communication | HTTP API and event bus between independent services | [service-communication.mmd](service-communication.mmd) | [service-communication.md](service-communication.md) |
| Read/Write Split | Command vs query paths through separate handlers and repositories | [read-write-split.mmd](read-write-split.mmd) | [read-write-split.md](read-write-split.md) |
| Transactional vs Reporting | Dual pipeline isolation with async event propagation | [transactional-reporting.mmd](transactional-reporting.mmd) | [transactional-reporting.md](transactional-reporting.md) |
| Multi-Tenant Isolation | `tenant_id` propagation from BFF through services to persistence | [multi-tenant-isolation.mmd](multi-tenant-isolation.mmd) | [multi-tenant-isolation.md](multi-tenant-isolation.md) |
| Notification Platform | Event to template resolution to channel delivery | [notification-platform.mmd](notification-platform.mmd) | [notification-platform.md](notification-platform.md) |

## Conventions

- **`.mmd` files** — raw Mermaid syntax for tooling and rendering pipelines
- **`.md` files** — human-readable pages with embedded diagrams and chapter cross-references
- Node labels use underscores instead of spaces (e.g., `Event_Bus`) for Mermaid compatibility

## Related

- [Sequence Diagrams](../Sequence-Diagrams/) — interaction flows over time
- [Decision Records](../Decision-Records/) — architectural decision records
- [Volume 1 — Foundation](../Volume-1-Foundation/) — architecture principles and standards
