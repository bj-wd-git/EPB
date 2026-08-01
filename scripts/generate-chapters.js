/**
 * EPB Chapter Generator — produces handbook chapters from manifest.
 * Run: node scripts/generate-chapters.js [--volume 1|2|3] [--ids v1-01,v1-02]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/CHAPTER-MANIFEST.json'), 'utf8'));

const args = process.argv.slice(2);
let filterVol = null;
let filterIds = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--volume') filterVol = parseInt(args[++i], 10);
  if (args[i] === '--ids') filterIds = new Set(args[++i].split(','));
}

function nav(chapters, idx) {
  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  return { prev, next };
}

function volChapters(vol) {
  return manifest.chapters.filter((c) => c.volume === vol);
}

function header(ch, status = 'draft') {
  return `> **Volume:** ${ch.volume} | **Chapter ID:** ${ch.id} | **Status:** ${status}\n\n`;
}

function relLink(ch) {
  return ch.file.split('/').pop();
}

function related(ch, prev, next) {
  let s = '## Related Chapters\n\n';
  if (prev) s += `- [Previous: ${prev.title}](${relLink(prev)})\n`;
  if (next) s += `- [Next: ${next.title}](${relLink(next)})\n`;
  s += '- [EPB Glossary](../../docs/GLOSSARY.md)\n';
  return s;
}

const vol1Content = {
  'v1-01': {
    purpose: 'Define the vision and mission of the Enterprise Platform Blueprint as a long-term engineering reference.',
    sections: {
      Overview: 'EPB exists to eliminate repeated engineering work across enterprise applications. Every team rebuilding authentication, notifications, scheduling, and reporting from scratch wastes months. EPB captures proven patterns once and makes them available to every future application.',
      Architecture: 'EPB is documentation-first architecture: standards, services, and workflows that any technology stack can implement. The vision is platform engineering at organizational scale.',
      Responsibilities: '- Articulate why a shared platform beats per-project reinvention\n- Set expectations for domain neutrality\n- Anchor all volumes to a single mission',
    },
  },
  'v1-08': {
    purpose: 'Define the Backend For Frontend (BFF) as the sole frontend entry point and aggregation layer.',
    sections: {
      Overview: 'The BFF sits between frontend clients and platform services. It authenticates requests, validates input, aggregates multiple backend calls, maps responses to frontend-friendly DTOs, and enforces cross-cutting policies.',
      Architecture: '```mermaid\nflowchart LR\n  UI[Frontend] --> BFF[BFF]\n  BFF --> PS1[Platform_Service_A]\n  BFF --> PS2[Platform_Service_B]\n  BFF --> PS3[Platform_Service_C]\n```',
      Responsibilities: '- Authentication and authorization at the edge\n- Request validation and response mapping\n- API aggregation and orchestration\n- Standard error handling and logging\n- Security enforcement (rate limits, CORS, headers)',
    },
  },
};

function genericVol1(ch, prev, next) {
  const custom = vol1Content[ch.id];
  const title = ch.title;
  const purpose = custom?.purpose || `Establish standards and guidance for **${title}** within the Enterprise Platform Blueprint.`;
  const overview = custom?.sections?.Overview || `${title} is a foundational concern for any enterprise platform. This chapter explains how EPB approaches ${title.toLowerCase()} in a framework-agnostic, domain-neutral way. Consistent application of these principles reduces integration cost and improves maintainability across all applications built on the platform.`;
  const arch = custom?.sections?.Architecture || 'EPB follows layered architecture. This topic applies at the appropriate layer — see [Layered Architecture](06-layered-architecture.md) for context.\n\n```mermaid\nflowchart TB\n  subgraph epb [EPB_Layers]\n    FE[Frontend]\n    BFF[BFF]\n    PS[Platform_Services]\n    SL[Shared_Libraries]\n    INF[Infrastructure]\n  end\n```';
  const resp = custom?.sections?.Responsibilities || `- Define clear responsibilities for ${title.toLowerCase()}\n- Align with platform-first and API-first principles\n- Provide actionable guidance for implementers\n- Document anti-patterns to avoid`;

  return `# ${title}\n\n${header(ch)}## Purpose\n\n${purpose}\n\n## Overview\n\n${overview}\n\n## Architecture\n\n${arch}\n\n## Responsibilities\n\n${resp}\n\n## Design Principles\n\n- **Platform First** — implement once in shared capabilities\n- **Single Source of Truth** — one canonical definition\n- **Loose Coupling** — minimize dependencies between components\n- **Security by Design** — embed controls from the start\n\n## Implementation Guidelines\n\n1. Document decisions in Architecture Decision Records ([ADR](34-architecture-decision-records.md))\n2. Follow [Naming Conventions](24-naming-conventions.md) and [Folder Structure](23-folder-structure.md)\n3. Apply [API Standards](18-api-standards.md) for any exposed interfaces\n4. Test against [Testing Standards](27-testing-standards.md)\n\n## Best Practices\n\n1. Prefer configuration over hard-coded behavior\n2. Design for multi-tenant isolation from day one\n3. Log structured events per [Logging Standards](20-logging-standards.md)\n4. Handle errors per [Error Handling](19-error-handling.md)\n5. Review changes against [Security Foundation](21-security-foundation.md)\n\n## Anti-Patterns\n\n| Anti-Pattern | Why It Fails | Preferred Approach |\n|--------------|--------------|--------------------|\n| Per-application duplication | Inconsistent behavior, wasted effort | Centralize in platform |\n| Domain-specific coupling | Platform becomes unusable for other apps | Keep abstractions generic |\n| Skipping documentation | Knowledge loss, onboarding friction | Document in EPB volumes |\n| Direct database sharing between services | Tight coupling, scaling limits | API or event integration only |\n\n${related(ch, prev, next)}\n\n---\n\n*Enterprise Platform Blueprint — Volume 1*\n`;
}

function genericVol2(ch, prev, next) {
  const svc = ch.title.replace(/ Platform$/i, '');
  const slug = svc.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `# ${ch.title}\n\n${header(ch)}## Purpose\n\nThe **${svc}** platform service provides a reusable, independently deployable capability consumed by all enterprise applications on EPB. Business applications publish events or call APIs — they never reimplement this concern.\n\n## Architecture\n\n\`\`\`mermaid\nflowchart LR\n  BFF[BFF] --> API[${slug}_API]\n  App[Application_Service] --> API\n  API --> DB[(${slug}_DB)]\n  API --> EB[Event_Bus]\n\`\`\`\n\nEach platform service owns its data store. No other service accesses this database directly.\n\n## Responsibilities\n\n### In Scope\n\n- Core ${svc.toLowerCase()} operations as defined by platform contracts\n- Persistence, validation, and API exposure\n- Publishing domain events for downstream consumers\n- Audit logging of state changes\n\n### Out of Scope\n\n- Application-specific business rules (belong in application services)\n- UI rendering (belongs in frontend/BFF)\n- Direct cross-service database access\n\n## API Design\n\n### Base Path\n\n\`/${slug}/v1\`\n\n### Core Endpoints\n\n| Method | Path | Description |\n|--------|------|-------------|\n| GET | /resources | List resources with pagination |\n| GET | /resources/{id} | Get single resource |\n| POST | /resources | Create resource |\n| PUT | /resources/{id} | Full update |\n| PATCH | /resources/{id} | Partial update |\n| DELETE | /resources/{id} | Soft or hard delete |\n\nFollow [API Standards](../../Volume-1-Foundation/18-api-standards.md) and [Error Handling](../../Volume-1-Foundation/19-error-handling.md).\n\n## Database Design\n\n| Table | Purpose |\n|-------|--------|\n| ${slug.replace(/-/g, '_')}_records | Primary entity storage |\n| ${slug.replace(/-/g, '_')}_audit | Change history |\n\nUse tenant_id on all tables for multi-tenant isolation.\n\n## Folder Structure\n\n\`\`\`text\nservices/${slug}/\n├── api/           # Controllers, route definitions\n├── domain/        # Business logic\n├── persistence/   # Entities, repositories\n├── mappers/       # DTO ↔ Entity conversion\n├── events/        # Event publishers/handlers\n└── tests/\n\`\`\`\n\n## Sequence Diagrams\n\n\`\`\`mermaid\nsequenceDiagram\n  participant Client\n  participant BFF\n  participant Svc as ${svc}\n  participant DB\n  Client->>BFF: HTTP Request\n  BFF->>Svc: Internal API call\n  Svc->>DB: Persist\n  Svc-->>BFF: Response DTO\n  BFF-->>Client: Mapped response\n\`\`\`\n\n## Extension Points\n\n- **Configuration hooks** — tenant-level settings without code changes\n- **Event subscriptions** — applications react to ${svc.toLowerCase()} lifecycle events\n- **Plugin adapters** — optional integrations (see [Plugin Architecture](68-plugin-architecture.md))\n\n## Integration\n\n- **Events published:** \`${slug}.created\`, \`${slug}.updated\`, \`${slug}.deleted\`\n- **Events consumed:** \`tenant.provisioned\`, \`config.updated\`\n- **Dependencies:** Configuration Service, Audit Platform, Event Bus\n\n## Best Practices\n\n1. Idempotent APIs for create/update operations\n2. Soft delete with retention policies\n3. Correlation IDs in all logs and events\n4. Version APIs from v1; never break contracts without migration path\n\n## Anti-Patterns\n\n| Anti-Pattern | Preferred Approach |\n|--------------|-------------------|\n| Shared database tables across services | Service-owned schema |\n| Synchronous chains across 5+ services | Event-driven or BFF aggregation |\n| Exposing persistence entities in API | Response DTOs only |\n\n${related(ch, prev, next)}\n\n---\n\n*Enterprise Platform Blueprint — Volume 2*\n`;
}

function genericVol3(ch, prev, next) {
  const task = ch.title;
  return `# How to ${task.replace(/^Create /, 'Create a ').replace(/^How to /, '')}\n\n${header(ch)}## What You Will Accomplish\n\nBy the end of this guide you will have completed **${task.toLowerCase()}** following EPB standards, ready for code review and deployment.\n\n## Prerequisites\n\n- [Project Setup](01-project-setup.md) completed\n- [Development Environment](02-development-environment.md) configured\n- Familiarity with [Folder Structure](../../Volume-1-Foundation/23-folder-structure.md)\n\n## Steps\n\n### Step 1: Prepare the workspace\n\nNavigate to the appropriate service directory per [Repository Structure](03-repository-structure.md).\n\n\`\`\`bash\ncd services/<your-service>\n\`\`\`\n\n**Expected result:** You are in a service that follows EPB folder conventions.\n\n### Step 2: Apply the pattern\n\nFollow the EPB standard for ${task.toLowerCase()}:\n\n1. Create files in the correct layer (api, domain, persistence, mappers)\n2. Use naming conventions from [Naming Standards Reference](23-naming-standards-reference.md)\n3. Add unit tests per [Unit Testing Guide](16-unit-testing-guide.md)\n\n### Step 3: Wire integration\n\nConnect to platform services as needed (auth, audit, events). Register endpoints in the BFF aggregation layer if frontend-facing.\n\n### Step 4: Validate\n\nRun the test suite and lint checks. Verify API contracts match [API Standards](../../Volume-1-Foundation/18-api-standards.md).\n\n## Verification\n\n- [ ] All tests pass\n- [ ] API documented in service README\n- [ ] Audit events emitted for mutations\n- [ ] Code review checklist completed ([Code Review Checklist](22-code-review-checklist.md))\n\n## Troubleshooting\n\n| Symptom | Cause | Fix |\n|---------|-------|-----|\n| Validation errors on API | Request DTO mismatch | Check mapper and DTO definitions |\n| Missing tenant context | Auth middleware not applied | Verify BFF passes tenant header |\n| Test failures on DB | Migration not applied | Run migrations per [Database Migrations](29-database-migrations.md) |\n\n## Reference\n\n- [Coding Standards](../../Volume-1-Foundation/25-coding-standards.md)\n- [Templates](../../Templates/)\n- [Checklists](../../Checklists/)\n\n${related(ch, prev, next)}\n\n---\n\n*Enterprise Platform Blueprint — Volume 3*\n`;
}

let written = 0;
for (const vol of [1, 2, 3]) {
  if (filterVol && filterVol !== vol) continue;
  const chapters = volChapters(vol);
  chapters.forEach((ch, idx) => {
    if (filterIds && !filterIds.has(ch.id)) return;
    const { prev, next } = nav(chapters, idx);
    let content;
    if (vol === 1) content = genericVol1(ch, prev, next);
    else if (vol === 2) content = genericVol2(ch, prev, next);
    else content = genericVol3(ch, prev, next);

    const outPath = path.join(ROOT, ch.file);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, content);
    ch.status = 'draft';
    written++;
  });
}

fs.writeFileSync(path.join(ROOT, 'docs/CHAPTER-MANIFEST.json'), JSON.stringify(manifest, null, 2));
console.log(`Generated ${written} chapters`);
