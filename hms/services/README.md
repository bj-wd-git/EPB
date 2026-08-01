# HMS Domain Services — Phase 2+ Stubs

Per [HMS.md](../../HMS.md) and ADR-010, each domain will become an independent NestJS service.

| Service | Phase | Status |
|---------|-------|--------|
| configuration | 1 | Seed in store |
| registration | 1 | In store |
| appointment | 1 | In store |
| emr | 1 | In store |
| laboratory | 2 | Stub |
| radiology | 2 | Stub |
| pharmacy | 2 | Stub |
| billing | 2 | Stub |
| insurance | 2 | Stub |
| ward / admission | 3 | Stub |
| ot | 3 | Stub |
| emergency | 3 | Stub |
| blood-bank | 3 | Stub |
| inventory / warehouse | 3 | Stub |
| hr / finance | 4 | Stub |
| notification | 1 | Audit events (expand to EPB Notification Platform) |

NestJS monorepo target: `apps/bff`, `services/<domain>/`, `libs/*`
