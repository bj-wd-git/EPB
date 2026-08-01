# EPB Glossary

Canonical terminology for the Enterprise Platform Blueprint. Use these terms consistently across all volumes.

| Term | Definition |
|------|------------|
| **EPB** | Enterprise Platform Blueprint — a reusable engineering platform for building any enterprise application |
| **Platform Service** | A independently deployable shared capability (auth, notifications, scheduler, etc.) consumed by applications |
| **Application** | A domain-specific product built on top of the platform (ERP, CRM, HMS, etc.) |
| **BFF** | Backend For Frontend — the single entry point for frontend applications; handles auth, aggregation, mapping |
| **Frontend** | User-facing UI layer; communicates only with the BFF |
| **Shared Library** | Common code package containing DTOs, entities, interfaces, validators — single source of truth |
| **DTO** | Data Transfer Object — request/response models for API communication |
| **Request DTO** | Model representing incoming API request payload |
| **Response DTO** | Model representing API response payload |
| **Transaction Model** | Model used for business processing within a service |
| **Domain Model** | Rich business logic model within a service boundary |
| **Persistence Entity** | Database-mapped model; never exposed directly via API |
| **Mapper** | Component converting between model types (Entity ↔ DTO ↔ Domain) |
| **Read/Write Separation** | Architectural split between read (GET) and write (POST/PUT/PATCH/DELETE) paths |
| **Transactional Store** | Database optimized for CRUD and business processing |
| **Reporting Store** | Database or pipeline optimized for analytics; isolated from transactional load |
| **Tenant** | Isolated customer or organizational partition in multi-tenant deployments |
| **Organization** | Hierarchical structure within a tenant (departments, branches, units) |
| **Feature Flag** | Runtime toggle controlling feature availability without redeployment |
| **Event Bus** | Platform capability for asynchronous publish/subscribe between services |
| **Notification Event** | Domain event triggering the notification platform to deliver a message |
| **Template Engine** | Platform service rendering messages from templates with variable substitution |
| **Scheduler** | Central orchestration for cron jobs, retries, and scheduled processing |
| **Roster** | Reusable scheduling engine for appointments, shifts, availability, and bookings |
| **Workflow Engine** | State machine orchestrating multi-step business processes |
| **Rule Engine** | Evaluates business rules declaratively without hard-coded logic |
| **Master Data** | Canonical reference data shared across applications (countries, currencies, units) |
| **Audit Trail** | Immutable record of who did what, when, on which resource |
| **Standard Response** | Uniform API response envelope (success, error, pagination metadata) |
| **Pagination** | Standard pattern for listing large result sets with page/size cursors |
| **ADR** | Architecture Decision Record — documented rationale for significant technical choices |
| **Extension Point** | Defined hook where applications customize platform behavior without forking |
| **Plugin Architecture** | Mechanism for loading optional modules into the platform at runtime |

## Model Layer Definitions

```text
Request DTO  →  (validation)  →  Transaction/Domain Model  →  Persistence Entity
Persistence Entity  →  Mapper  →  Response DTO
```

Never use one model for all layers.

## Layer Stack

```text
Frontend → BFF → Platform Services → Shared Libraries → Infrastructure
```
