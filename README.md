# Enterprise Platform Blueprint (EPB)

A reusable engineering platform handbook for building **any** enterprise application.

**Build the platform once. Build unlimited applications on top of it.**

**[BOSS — SDLC Orchestration for any project →](BOSS.md)** · **[How to use →](BOSS-USAGE.md)**

## Start Here

| If you are... | Start with |
|---------------|------------|
| Using BOSS in any project | **[BOSS.md](BOSS.md)** — adopt, bootstrap, deliver features |
| New to EPB | [Vision and Mission](Volume-1-Foundation/01-vision-and-mission.md) |
| Architecting a platform | [Layered Architecture](Volume-1-Foundation/06-layered-architecture.md) + [ADRs](Decision-Records/) |
| Building a service | [Create New Service](Volume-3-Developer-Guide/04-create-new-service.md) |
| Implementing notifications | [Notification Platform](Volume-2-Platform-Services/15-notification-platform.md) |

## Volumes

### Volume 1 — Foundation (40 chapters)

[Open volume folder](Volume-1-Foundation/) · [Index](Volume-1-Foundation/40-volume1-index.md)

- [Vision and Mission](Volume-1-Foundation/01-vision-and-mission.md)
- [Platform Objective](Volume-1-Foundation/02-platform-objective.md)
- [Core Philosophy](Volume-1-Foundation/03-core-philosophy.md)
- [Scope and Domain Neutrality](Volume-1-Foundation/04-scope-and-domain-neutrality.md)
- [Architecture Principles](Volume-1-Foundation/05-architecture-principles.md)
- [Layered Architecture](Volume-1-Foundation/06-layered-architecture.md)
- [Frontend Layer](Volume-1-Foundation/07-frontend-layer.md)
- [Backend For Frontend BFF](Volume-1-Foundation/08-bff-layer.md)
- ... and 32 more (see [full index](Volume-1-Foundation/40-volume1-index.md))

### Volume 2 — Platform Services (72 chapters)

[Open volume folder](Volume-2-Platform-Services/) · [Index](Volume-2-Platform-Services/72-low-code-components.md)

- [Identity and Access](Volume-2-Platform-Services/01-identity-and-access.md)
- [Authentication](Volume-2-Platform-Services/02-authentication.md)
- [Authorization](Volume-2-Platform-Services/03-authorization.md)
- [User Management](Volume-2-Platform-Services/04-user-management.md)
- [Role Management](Volume-2-Platform-Services/05-role-management.md)
- [Permission Management](Volume-2-Platform-Services/06-permission-management.md)
- [Tenant Management](Volume-2-Platform-Services/07-tenant-management.md)
- [Organization Management](Volume-2-Platform-Services/08-organization-management.md)
- ... and 64 more (see [full index](Volume-2-Platform-Services/72-low-code-components.md))

### Volume 3 — Developer Guide (80 chapters)

[Open volume folder](Volume-3-Developer-Guide/) · [Index](Volume-3-Developer-Guide/80-volume3-index.md)

- [Project Setup](Volume-3-Developer-Guide/01-project-setup.md)
- [Development Environment](Volume-3-Developer-Guide/02-development-environment.md)
- [Repository Structure](Volume-3-Developer-Guide/03-repository-structure.md)
- [Create New Service](Volume-3-Developer-Guide/04-create-new-service.md)
- [Create New API](Volume-3-Developer-Guide/05-create-new-api.md)
- [Create Request DTO](Volume-3-Developer-Guide/06-create-request-dto.md)
- [Create Response DTO](Volume-3-Developer-Guide/07-create-response-dto.md)
- [Create Entity](Volume-3-Developer-Guide/08-create-entity.md)
- ... and 72 more (see [full index](Volume-3-Developer-Guide/80-volume3-index.md))

## Reference

- [Style Guide](docs/STYLE-GUIDE.md) · [Glossary](docs/GLOSSARY.md) · [Chapter Manifest](docs/CHAPTER-MANIFEST.json)
- [Architecture Diagrams](Architecture-Diagrams/) · [Sequence Diagrams](Sequence-Diagrams/) · [Decision Records](Decision-Records/)
- [Templates](Templates/) · [Checklists](Checklists/)

## SDLC Team (BOSS)

This repo includes **BOSS** — see **[BOSS.md](BOSS.md)** for the public reference, bootstrap guide, and quick start.

```text
Use BOSS to deliver "my-feature"
Use BOSS to init
Use BOSS to mcp list
```

| Resource | Description |
|----------|-------------|
| **[BOSS.md](BOSS.md)** | Public entry point — adopt in any project |
| **[BOSS-USAGE.md](BOSS-USAGE.md)** | Step-by-step practical guide |
| [Team README](.cursor/team/README.md) | Quick start, structure, bootstrap |
| [Agents index](.cursor/agents/README.md) | BOSS + 9 SDLC roles + 6 specialists |
| [MCP catalog](.cursor/mcps/README.md) | gbrain, GitHub, Linear, Slack, Sentry |
| [Skills catalog](.cursor/skills/skills-catalog/SKILL.md) | Invocable project skills |
| [EPB Vision skill](.cursor/skills/epb-vision/SKILL.md) | Platform vision for architecture work |

Copy the kit to other projects: `.\.cursor\team\bootstrap.ps1 -TargetPath <path>`

---

*192 chapters · Framework-agnostic · Domain-neutral*
