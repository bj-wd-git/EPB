---
name: epb-vision
description: >-
  Enterprise Platform Blueprint (EPB) vision, philosophy, architecture constraints,
  and handbook conventions. Use when writing or reviewing EPB chapters, designing
  platform services, making architecture decisions, onboarding to EPB, or when the user
  mentions EPB, EPB_Vision, platform blueprint, domain neutrality, or enterprise
  platform standards.
---

# EPB_Vision

Enterprise Platform Blueprint — a framework-agnostic, domain-neutral handbook for building **any** enterprise application.

**Tagline:** Build the platform once. Build unlimited applications on top of it.

## When to Apply

Use this skill when:

- Writing, editing, or reviewing EPB handbook content (Volumes 1–3)
- Designing platform services, BFF endpoints, or application boundaries
- Evaluating whether logic belongs in platform vs application
- Creating ADRs or architecture diagrams for EPB
- Answering questions about EPB vision, scope, or standards

## Core Vision

EPB reverses the pattern where every team reinvents authentication, authorization, notifications, scheduling, file storage, reporting, audit, and workflow orchestration.

| Goal | Outcome |
|------|---------|
| Reduce time-to-market | New apps start with working platform capabilities |
| Enforce engineering standards | Consistent APIs, errors, security, logging across apps |
| Eliminate duplicate implementations | One notification service, one scheduler, one identity stack |

EPB is a **blueprint** — patterns, service boundaries, standards, and workflows — not a single product or business application.

## Mission (Threefold)

1. **Reduce time-to-market** — ready-made platform capabilities for new enterprise applications
2. **Enforce engineering standards** — consistent APIs, errors, security, logging
3. **Eliminate duplicate implementations** — shared platform services and libraries

## Thirteen Core Principles

Non-negotiable. Cite in ADRs and architecture reviews.

1. **Build Once. Reuse Everywhere.** — Cross-cutting capabilities implemented once in platform
2. **Reuse Everywhere.** — Capabilities built for one app available to all without modification
3. **Platform First.** — Check platform catalog before writing application code
4. **API First.** — Contracts (OpenAPI, events, DTOs) before implementation
5. **Configuration Over Customization.** — Runtime config and feature flags, not forks
6. **Convention Over Configuration.** — Sensible defaults reduce boilerplate decisions
7. **Single Source of Truth.** — One canonical definition per concept (DTOs, errors, enums)
8. **Loose Coupling.** — Interact via APIs/events; no cross-service database access
9. **High Cohesion.** — Each module/service has a focused responsibility
10. **Developer Experience First.** — Standards reduce cognitive load, not ceremony
11. **Cloud Native.** — Containers, health checks, horizontal scaling, IaC
12. **Security by Design.** — Auth, encryption, audit embedded in architecture
13. **Scalability by Design.** — Separate transactional/reporting paths; async for heavy work

**Conflict resolution:** Platform First and Single Source of Truth take precedence for generic capabilities.

## Layer Stack (Fixed)

```text
Frontend → BFF → Platform Services → Shared Libraries → Infrastructure
```

| Layer | Role | Must Never |
|-------|------|------------|
| Frontend | UI, client state | Call platform services directly |
| BFF | Auth, aggregation, mapping, routing | Contain domain business logic |
| Platform Services | Reusable shared capabilities | Embed domain-specific rules |
| Application Services | Domain business logic | Reimplement platform capabilities |
| Shared Libraries | DTOs, entities, contracts (single source) | Depend on services |
| Infrastructure | Runtime, deployment, ops | Leak into API contracts |

**ADR-001, ADR-007:** BFF is the sole frontend entry point.

## Six Architecture Rules

1. **Layered architecture** — strict dependency direction; no layer skipping
2. **Model separation** — five models, never one model for all layers (ADR-002)
3. **Read/write separation** — distinct GET vs POST/PUT/PATCH/DELETE paths (ADR-004)
4. **Transactional vs reporting** — analytics must not slow operations (ADR-005)
5. **Independent services** — each service owns its data; deploys independently (ADR-003)
6. **API and event integration only** — never access another service's database

### Five Models (ADR-002)

```text
Request DTO → Transaction/Domain Model → Persistence Entity
Persistence Entity → Mapper → Response DTO
```

| Model | Purpose |
|-------|---------|
| Request DTO | Incoming API payload validation |
| Response DTO | Outgoing API representation |
| Transaction Model | Business processing within a service |
| Domain Model | Rich business logic within service boundary |
| Persistence Entity | Database mapping — never exposed via API |

## Platform vs Application Boundary

| Concern | Platform Owns | Application Owns |
|---------|---------------|------------------|
| Identity and access | Auth, users, roles, permissions | Domain-specific access policies |
| Cross-cutting | Notifications, scheduling, search, files, audit | Business events triggering platform actions |
| Contracts | DTOs, API envelopes, error codes, pagination | Domain models and business validation |
| Operations | Logging, monitoring, health, deployment patterns | Domain-specific metrics and SLAs |
| Data | Platform service databases | Application service databases |

## Domain Neutrality (Mandatory)

EPB must work for ERP, CRM, hospital, school, manufacturing, banking, government, retail, and any future enterprise app.

**Neutrality test** — before adding to platform:

1. Would this make sense for a hospital **and** a bank **and** a school?
2. Does this encode rules only one industry needs?
3. Can this be a generic primitive with domain mapping in the application layer?

If (1) is no or (2) is yes → belongs in an **application service**.

| Rule | Example |
|------|---------|
| Generic nouns | `resource`, `entity`, `party`, `organization` — not `patient`, `student` |
| Parameterize labels | Display names via config/localization |
| No industry enums in platform | Platform: `ACTIVE \| INACTIVE`; apps define domain statuses |
| Extension points over forks | Hooks and plugins, not platform code changes |

## Platform Capability Catalog (Volume 2)

Identity, authentication, authorization, users, roles, permissions, tenant/organization management, configuration, feature flags, logging, audit, monitoring, health checks, notifications (email/SMS/push/in-app/WhatsApp), template engine, scheduler, roster, workflow engine, rule engine, search, dashboard engine, report engine, document engine, file management, import/export, queue, cache, event bus, integration framework, master data, localization, validation, exception handling, response formatting, pagination/sorting/filtering, bulk operations, global search, AI services overview, metadata engine, form/screen builder, plugin architecture, low-code components.

**Never reimplement** capabilities in this catalog. Extend platform when need is generic.

## Accepted ADRs

| ADR | Decision |
|-----|----------|
| ADR-001 | Layered architecture with BFF |
| ADR-002 | Five-model separation |
| ADR-003 | Independent services — data ownership |
| ADR-004 | Read/write separation |
| ADR-005 | Transactional/reporting separation |
| ADR-006 | Notification — event-driven delivery |
| ADR-007 | BFF as single entry point |
| ADR-008 | Shared library as single source of truth |
| ADR-009 | API first — contracts before implementation |

## Handbook Structure

| Volume | Chapters | Focus |
|--------|----------|-------|
| 1 Foundation | 40 | Vision, architecture, standards, DevOps |
| 2 Platform Services | 72 | Service specs, APIs, integration |
| 3 Developer Guide | 80 | How-to guides, checklists, walkthroughs |

**Total:** 192 chapters. Manifest: `docs/CHAPTER-MANIFEST.json`.

## Agent Workflow

When producing EPB content:

1. Read [reference.md](reference.md) for full glossary, style rules, and repo map
2. Read `docs/STYLE-GUIDE.md` and `docs/GLOSSARY.md` in the repo
3. Anchor to Volume 1 foundations; link related chapters with relative paths
4. Use neutral examples only — never assume a business domain
5. Include Anti-Patterns table: `| Anti-Pattern | Why It Fails | Preferred Approach |`
6. Run `node scripts/check-links.js` after link changes
7. Document significant deviations in `Decision-Records/`

## Key Anti-Patterns

| Anti-Pattern | Preferred Approach |
|--------------|-------------------|
| Building auth per application | Use platform identity services |
| Domain logic in BFF | BFF aggregates; logic stays in services |
| Shared database between services | Database per service; integrate via API/events |
| Entity leakage in API responses | Map to response DTOs |
| Reporting on transactional DB | Dedicated reporting store |
| Frontend calling services directly | All traffic through BFF |
| Forking platform per customer | Configuration and extension points |
| Industry terms in platform code | Generic primitives; domain in applications |

## Repo Map

```text
EPB/
├── README.md
├── Volume-1-Foundation/          # 40 chapters — vision, architecture, standards
├── Volume-2-Platform-Services/   # 72 chapters — platform service specs
├── Volume-3-Developer-Guide/     # 80 chapters — how-to guides
├── Architecture-Diagrams/        # Mermaid architecture diagrams
├── Sequence-Diagrams/            # Service interaction flows
├── Decision-Records/             # ADR-001 through ADR-009
├── Templates/                    # Service scaffold, DTO templates
├── Checklists/                   # Production, security, code review
└── docs/
    ├── STYLE-GUIDE.md
    ├── GLOSSARY.md
    └── CHAPTER-MANIFEST.json
```

## Additional Resources

- Full glossary, style rules, communication patterns, data flow: [reference.md](reference.md)
- Start reading: `Volume-1-Foundation/01-vision-and-mission.md`
- Architecture entry: `Volume-1-Foundation/06-layered-architecture.md`
- New service guide: `Volume-3-Developer-Guide/04-create-new-service.md`
