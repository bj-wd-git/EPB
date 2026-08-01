# EPB_Vision — Full Repo Reference

Consolidated inputs from the Enterprise Platform Blueprint repository. Read when detailed context is needed beyond SKILL.md.

---

## 1. Vision and Mission

Building enterprise software is expensive because every team reinvents the same capabilities: authentication, authorization, notifications, scheduling, file storage, reporting, audit trails, and workflow orchestration.

EPB reverses this pattern. Applications consume platform services. Platform services follow EPB standards. Applications add only domain-specific business logic.

**Success measures:**

- New applications identify platform services consumed before writing code
- No reimplementation of Volume 2 capabilities
- Deviations documented in ADRs
- Reduction in duplicate code across applications

---

## 2. Platform Objective — Four Outcomes

1. **Reduced development time** — platform capabilities on day one
2. **Enforced engineering standards** — same API, error, logging, security, testing conventions
3. **Eliminated duplicate implementations** — one notification, one scheduler, one identity stack
4. **Consistency across applications** — predictable behavior for users, operators, developers

**Success criteria:**

- New app authenticates users, sends notifications, schedules jobs without writing those subsystems
- All apps share identical API response formats, error handling, logging structure
- Platform upgrades benefit every application simultaneously
- Developers onboard faster via identical folder structure, naming, patterns

---

## 3. Core Philosophy — Full Principle Definitions

### Build Once. Reuse Everywhere.
Implement every cross-cutting capability once in the platform. Applications consume through APIs and events.

### Reuse Everywhere.
A capability built for one application must be available to all without modification.

### Platform First.
Before application code, check if platform provides the capability. Extend platform when generic; build application code only for domain logic.

### API First.
Define contracts (OpenAPI, event schemas, DTOs) before implementation. Breaking changes require new major version.

### Configuration Over Customization.
Runtime configuration and feature flags over per-customer forks.

### Convention Over Configuration.
Sensible defaults: same folder structure, naming, response envelope without per-project setup.

### Single Source of Truth.
One canonical definition per concept. DTOs live in shared libraries.

### Loose Coupling.
Well-defined interfaces. No direct database access across service boundaries.

### High Cohesion.
Focused responsibility per module. BFF aggregates; business rules stay in services.

### Developer Experience First.
Predictable structure, clear docs, consistent tooling. Volume 3 templates enable compliant services in hours.

### Cloud Native.
Containers, horizontal scaling, health checks, IaC. Runs on-premises or any cloud.

### Security by Design.
Auth, authorization, encryption, audit, secrets management are platform concerns. BFF enforces auth on every request.

### Scalability by Design.
Separate transactional/reporting paths. Async processing for heavy work.

---

## 4. Scope — In Scope vs Out of Scope

### In Scope (Platform)

Identity, authentication, authorization, users, roles, permissions, configuration, feature flags, localization, logging, audit, monitoring, health checks, notifications, template engine, scheduler, roster, workflow engine, rule engine, search, dashboard engine, report engine, document engine, file management, import, export, queue, cache, event bus, integration framework, master data, validation, exception handling, response formatting, pagination, sorting, filtering, bulk operations, global search, AI services overview, metadata engine, form builder, screen builder, plugin architecture, low-code components.

### Out of Scope (Application)

- Domain business rules (pricing, clinical protocols, grading algorithms)
- Industry-specific workflows that do not generalize
- Regulatory interpretations tied to one jurisdiction or industry
- UI screens specific to one product's user journeys

---

## 5. Architecture — Communication and Data Flow

### Communication Patterns

| Pattern | Use When |
|---------|----------|
| Synchronous REST | Request/response, immediate consistency |
| Asynchronous events | Side effects, notifications, audit, reporting sync |
| BFF aggregation | Client needs data from multiple services in one response |

### Resource Update Data Flow

```text
1. Frontend sends PATCH to BFF
2. BFF validates auth, maps to request DTO
3. BFF calls Application Service API
4. Service validates, maps to domain model, persists entity
5. Service publishes ResourceUpdated event
6. Notification service consumes event, sends message
7. Reporting pipeline consumes event, updates reporting store
8. Service returns response DTO to BFF
9. BFF maps to client response envelope
```

### Read/Write Separation

| Path | HTTP Methods | Characteristics |
|------|--------------|-----------------|
| Write | POST, PUT, PATCH, DELETE | Validation, business rules, transactions |
| Read | GET | Optimized queries, caching, pagination |

### Transactional vs Reporting

| Concern | Transactional | Reporting |
|---------|---------------|-----------|
| Purpose | CRUD, business processing, workflow | Dashboards, analytics, aggregation |
| Store | Primary transactional database | Reporting store or pipeline |
| Performance | Low latency, ACID where required | Batch-friendly, eventually consistent |
| Impact | Must never be slowed by reports | Must never block transactions |

### Independent Service Rules

- Owns its business logic
- Owns its data (database, cache keys, file prefixes)
- Deploys independently
- Follows identical project standards
- Communicates through standard APIs or events
- **Never** accesses another service's database

---

## 6. Glossary (Canonical Terms)

| Term | Definition |
|------|------------|
| **EPB** | Enterprise Platform Blueprint — reusable engineering platform for any enterprise application |
| **Platform Service** | Independently deployable shared capability consumed by applications |
| **Application** | Domain-specific product built on the platform (ERP, CRM, HMS, etc.) |
| **BFF** | Backend For Frontend — single entry point for frontends; auth, aggregation, mapping |
| **Frontend** | User-facing UI; communicates only with BFF |
| **Shared Library** | Common package: DTOs, entities, interfaces, validators — single source of truth |
| **DTO** | Data Transfer Object — request/response models for API communication |
| **Request DTO** | Incoming API request payload |
| **Response DTO** | Outgoing API response |
| **Transaction Model** | Business processing within a service |
| **Domain Model** | Rich business logic within service boundary |
| **Persistence Entity** | Database-mapped model; never exposed via API |
| **Mapper** | Converts between model types |
| **Read/Write Separation** | Split between read (GET) and write (POST/PUT/PATCH/DELETE) paths |
| **Transactional Store** | Database for CRUD and business processing |
| **Reporting Store** | Database/pipeline for analytics; isolated from transactional load |
| **Tenant** | Isolated customer/organizational partition in multi-tenant deployments |
| **Organization** | Hierarchical structure within a tenant |
| **Feature Flag** | Runtime toggle without redeployment |
| **Event Bus** | Asynchronous publish/subscribe between services |
| **Notification Event** | Domain event triggering notification delivery |
| **Template Engine** | Renders messages from templates with variable substitution |
| **Scheduler** | Cron jobs, retries, scheduled processing |
| **Roster** | Scheduling engine for appointments, shifts, availability, bookings |
| **Workflow Engine** | State machine for multi-step business processes |
| **Rule Engine** | Declarative business rule evaluation |
| **Master Data** | Canonical reference data (countries, currencies, units) |
| **Audit Trail** | Immutable record of who did what, when, on which resource |
| **Standard Response** | Uniform API envelope (success, error, pagination metadata) |
| **Pagination** | Standard listing pattern with page/size cursors |
| **ADR** | Architecture Decision Record |
| **Extension Point** | Hook for application customization without forking |
| **Plugin Architecture** | Optional modules loaded at runtime |

---

## 7. Style Guide Summary

### Voice and Tone

- Audience: experienced architects and senior engineers
- Direct, precise, practical
- Explain **why**, not only **what**
- Never assume a business domain
- Generic examples: resource, entity, tenant, organization

### Chapter Structure by Volume

**Volume 1:** Purpose, Overview, Architecture, Responsibilities, Design Principles, Implementation Guidelines, Best Practices, Anti-Patterns, Related Chapters

**Volume 2:** Purpose, Architecture, Responsibilities (In/Out of Scope), API Design, Database Design, Folder Structure, Sequence Diagrams, Extension Points, Integration, Best Practices, Anti-Patterns, Related Chapters

**Volume 3:** What You Will Accomplish, Prerequisites, Steps (numbered), Verification, Troubleshooting, Reference, Related Chapters

### Diagrams

- Mermaid in Markdown
- `flowchart TB` or `flowchart LR` for architecture
- `sequenceDiagram` for service interactions

### Chapter Header

```markdown
> **Volume:** N | **Chapter ID:** vN-XX | **Status:** draft
```

### Length Guidance

- Foundation: 800–1500 words
- Platform services: 1000–2000 words
- Developer guide: 600–1200 words

---

## 8. Volume 1 Chapter Index (40)

01 Vision and Mission · 02 Platform Objective · 03 Core Philosophy · 04 Scope and Domain Neutrality · 05 Architecture Principles · 06 Layered Architecture · 07 Frontend Layer · 08 BFF Layer · 09 Platform Services Layer · 10 Shared Libraries · 11 Model Separation · 12 Read Write Separation · 13 Transactional vs Reporting · 14 Independent Services · 15 DTO Standards · 16 Entity Standards · 17 Mapping Strategy · 18 API Standards · 19 Error Handling · 20 Logging Standards · 21 Security Foundation · 22 Configuration Management · 23 Folder Structure · 24 Naming Conventions · 25 Coding Standards · 26 Development Workflow · 27 Testing Standards · 28 Documentation Standards · 29 DevOps Standards · 30 Infrastructure Overview · 31 Docker and Containers · 32 CI/CD Pipeline · 33 Monitoring Observability · 34 Architecture Decision Records · 35 Engineering Principles · 36 Platform First Design · 37 API First Design · 38 Cloud Native Principles · 39 Common Functionalities · 40 Volume 1 Index

---

## 9. Volume 2 Platform Services (72)

01 Identity and Access · 02 Authentication · 03 Authorization · 04 User Management · 05 Role Management · 06 Permission Management · 07 Tenant Management · 08 Organization Management · 09 Configuration Service · 10 Feature Flags · 11 Logging Platform · 12 Audit Platform · 13 Monitoring Platform · 14 Health Checks · 15 Notification Platform · 16 Template Engine · 17 Scheduler Platform · 18 Roster Platform · 19 Workflow Engine · 20 Rule Engine · 21 Search Platform · 22 Dashboard Engine · 23 Report Engine · 24 Document Engine · 25 File Management · 26 Import Platform · 27 Export Platform · 28 Queue Platform · 29 Cache Platform · 30 Event Bus · 31 Integration Framework · 32 Master Data Platform · 33 Localization Platform · 34 Validation Platform · 35 Exception Handling · 36 Response Formatting · 37 Pagination Sorting Filtering · 38 Global Search · 39 Bulk Operations · 40 Document Generation · 41 Developer Utilities · 42–46 Notification Channels (email, SMS, push, in-app, WhatsApp) · 47–48 Scheduler (cron, retry) · 49–51 Roster (appointments, availability, conflict) · 52 Workflow State Machine · 53 Rule Engine Evaluation · 54 Search Indexing · 55 Dashboard Widget Model · 56 Report Template Model · 57 Document Template Pipeline · 58 File Upload Download · 59 Import Validation Pipeline · 60 Export Format Handlers · 61 Queue Dead Letter · 62 Cache Invalidation · 63 Event Bus Schema Registry · 64 Integration Adapter Pattern · 65 Master Data Versioning · 66 Localization Resource Bundles · 67 AI Services Overview · 68 Metadata Engine · 69 Form Builder · 70 Screen Builder · 71 Plugin Architecture · 72 Low Code Components

---

## 10. Volume 3 Developer Guide (80)

01 Project Setup · 02 Development Environment · 03 Repository Structure · 04 Create New Service · 05 Create New API · 06–10 Create Request DTO, Response DTO, Entity, Mapper, Domain Model · 11–15 Create Workflow, Scheduler Job, Notification Event, Dashboard, Report · 16–18 Unit, Integration, E2E Testing · 19 Deployment · 20 Performance Tuning · 21–22 Security and Code Review Checklists · 23 Naming Standards Reference · 24 Git Workflow · 25 CI/CD Integration · 26 Production Readiness · 27–28 Environment Config, Secrets · 29 Database Migrations · 30 API Versioning · 31–32 Event Publishing/Consumption · 33 Caching Patterns · 34 Queue Processing · 35–37 File Upload, Import, Export · 38 Search Integration · 39 Audit · 40 Logging · 41 Feature Flags · 42 Localization · 43 Master Data · 44 BFF Aggregation · 45 Frontend Integration · 46–47 Auth Integration · 48 Multi-Tenant · 49 Organization Hierarchy · 50–53 Workflow, Rule Engine, Roster, Template Engine · 54–56 Document, Dashboard, Report Builder · 57–62 Health, Monitoring, Error Handling, Pagination, Filtering, Sorting · 63–65 Bulk Ops, Global Search, Integration Adapter · 66–68 Plugin, Metadata Screens, Dynamic Forms · 69–70 Developer CLI, Code Generator · 71–72 Reference Implementation, Sample Walkthrough · 73 Anti-Patterns Catalog · 74–76 Troubleshooting, Debugging, Local Dev Tips · 77–79 Onboarding, Release, Incident Response · 80 Volume 3 Index

---

## 11. ADR Details

### ADR-001: Layered Architecture with BFF
Five layers: Frontend → BFF → Platform Services → Shared Libraries → Infrastructure. BFF is only frontend entry point.

### ADR-002: Model Separation — Five Models
Request DTO, Response DTO, Transaction Model, Domain Model, Persistence Entity. Mappers convert between types.

### ADR-003: Independent Services — Data Ownership
Each service owns its data. No cross-service database access.

### ADR-004: Read/Write Separation
Distinct paths for queries (GET) and mutations (POST/PUT/PATCH/DELETE).

### ADR-005: Transactional and Reporting Separation
Reporting queries run against dedicated infrastructure; never block transactions.

### ADR-006: Notification — Event-Driven Delivery
Services publish events; notification platform consumes and delivers.

### ADR-007: BFF as Single Entry Point
All browser/mobile traffic enters through BFF. No direct frontend-to-service calls.

### ADR-008: Shared Library as Single Source of Truth
DTOs, entities, enums defined once in shared libraries.

### ADR-009: API First — Contracts Before Implementation
OpenAPI schemas and DTOs defined before service implementation ships.

---

## 12. Reference Artifacts

| Artifact | Path |
|----------|------|
| Architecture diagrams | `Architecture-Diagrams/` |
| Sequence diagrams | `Sequence-Diagrams/` |
| ADRs | `Decision-Records/` |
| Service scaffold template | `Templates/service-scaffold.md` |
| DTO template | `Templates/dto-template.md` |
| Production readiness | `Checklists/production-readiness.md` |
| Security checklist | `Checklists/security-checklist.md` |
| Code review checklist | `Checklists/code-review-checklist.md` |
| Link validator | `scripts/check-links.js` |

---

## 13. Neutrality Naming Examples

```text
# Platform (neutral)
GET /api/v1/resources/{id}
GET /api/v1/parties/{id}
POST /api/v1/roster/availability

# Application (domain-specific)
GET /api/v1/patients/{id}           # healthcare
GET /api/v1/students/{id}           # education
GET /api/v1/production-orders/{id}  # manufacturing
```

---

## 14. Complete Anti-Pattern Catalog

| Anti-Pattern | Why It Fails | Preferred Approach |
|--------------|--------------|-------------------|
| Building auth per application | Inconsistent security, audit gaps | Platform identity services |
| Domain logic in BFF | BFF becomes unmaintainable monolith | BFF aggregates; logic in services |
| Skipping standards for speed | Technical debt compounds | Follow EPB from day one |
| Platform assumes one industry | Cannot reuse | Keep abstractions generic |
| Building EPB as monolith | Cannot reuse across products | Separate platform services with APIs |
| Embedding domain in platform | Unusable for other domains | Domain logic in application services |
| Forking platform per customer | Maintenance nightmare | Configuration and extension points |
| `Patient` table in identity service | Locks to healthcare | Application owns domain entities |
| Industry validation in platform | Other domains inherit irrelevant rules | Application-layer validation |
| Hard-coded business enums in shared libs | Every domain requires lib changes | Generic enums in platform |
| Shared database between services | Hidden coupling | Database per service |
| Fat BFF with business logic | Unmaintainable | BFF aggregates and secures |
| Single model for API and DB | Schema changes break clients | Separate DTOs and entities |
| Reporting on transactional DB | Analytics degrades operations | Dedicated reporting store |
| Frontend calling services directly | Bypasses security | All traffic through BFF |
| Distributed transactions (2PC) | Fragile, slow | Saga or eventual consistency via events |
| Ignoring principles under deadline | Debt blocks future apps | Cite principle; ADR if exception needed |
| Cherry-picking principles | Inconsistent architecture | Apply full set |
