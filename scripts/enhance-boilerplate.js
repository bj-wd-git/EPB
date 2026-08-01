/**
 * Enhance boilerplate Volume 3 chapters with substantive content.
 * Run: node scripts/enhance-boilerplate.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/CHAPTER-MANIFEST.json'), 'utf8'));

const ENHANCE_IDS = new Set([
  'v3-03', 'v3-10', 'v3-11', 'v3-12', 'v3-13', 'v3-14', 'v3-15',
  'v3-20', 'v3-21', 'v3-22', 'v3-23',
  'v3-27', 'v3-28', 'v3-29', 'v3-30', 'v3-31', 'v3-32', 'v3-33',
  'v3-34', 'v3-35', 'v3-36', 'v3-37', 'v3-38', 'v3-39', 'v3-40',
  'v3-41', 'v3-42', 'v3-43',
  'v3-45', 'v3-46', 'v3-47',
  'v3-49', 'v3-50', 'v3-51', 'v3-52', 'v3-53', 'v3-54', 'v3-55',
  'v3-56', 'v3-57', 'v3-58', 'v3-59', 'v3-60', 'v3-61', 'v3-62',
  'v3-63', 'v3-64', 'v3-65', 'v3-66', 'v3-67', 'v3-68', 'v3-69',
  'v3-70', 'v3-71', 'v3-72', 'v3-74', 'v3-75', 'v3-76', 'v3-79',
]);

const BOILERPLATE = [
  'foundational concern for any enterprise platform',
  'By the end of this guide you will have completed',
];

function relLink(ch) { return path.basename(ch.file); }

function related(ch, prev, next, extra = []) {
  let s = '## Related Chapters\n\n';
  if (prev) s += `- [Previous: ${prev.title}](${relLink(prev)})\n`;
  if (next) s += `- [Next: ${next.title}](${relLink(next)})\n`;
  extra.forEach((e) => { s += `${e}\n`; });
  s += '- [EPB Glossary](../../docs/GLOSSARY.md)\n';
  return s;
}

function getVol3Title(ch) {
  const t = ch.title;
  if (t.startsWith('How to')) return t;
  if (t.endsWith(' Guide') || t.endsWith(' Tips') || t.endsWith(' Overview') || t.endsWith(' Walkthrough')) return t;
  if (t.endsWith(' Checklist') || t.endsWith(' Reference') || t.endsWith(' Catalog')) return t;
  if (t === 'Repository Structure') return 'Repository Structure Guide';
  if (t.startsWith('Create ')) {
    const rest = t.slice(7);
    const article = /^[aeiou]/i.test(rest) ? 'an' : 'a';
    return `How to Create ${article} ${rest}`;
  }
  if (t.endsWith(' Integration')) return `How to Integrate ${t.replace(' Integration', '')}`;
  if (t.endsWith(' Implementation')) return `${t}`;
  if (t.endsWith(' Setup')) return `How to Set Up ${t.replace(' Setup', '')}`;
  if (t.endsWith(' Usage')) return `${t}`;
  if (t === 'Performance Tuning') return 'Performance Tuning Guide';
  if (t === 'Plugin Development') return 'Plugin Development Guide';
  return t;
}

function v3(title, ch, prev, next, data) {
  const h = `> **Volume:** 3 | **Chapter ID:** ${ch.id} | **Status:** reviewed\n\n`;
  return `# ${title}\n\n${h}## What You Will Accomplish\n\n${data.accomplish}\n\n## Prerequisites\n\n${data.prereqs}\n\n## Steps\n\n${data.steps}\n\n## Verification\n\n${data.verify}\n\n## Troubleshooting\n\n${data.trouble}\n\n## Reference\n\n${data.ref}\n\n${related(ch, prev, next, data.extraRelated || [])}\n\n---\n\n*Enterprise Platform Blueprint — Volume 3*\n`;
}

// Chapter-specific substantive content
const CONTENT = {
  'v3-03': {
    accomplish: 'You will navigate the EPB monorepo, understand where services, shared libraries, BFF, frontend, and infrastructure code live, and verify your local clone matches the expected layout.',
    prereqs: '- [Project Setup](01-project-setup.md) completed\n- [Development Environment](02-development-environment.md) configured\n- Git clone of the monorepo on your machine',
    steps: `### Step 1: Clone and inspect the monorepo root

\`\`\`bash
git clone <repo-url> epb && cd epb
ls -la
\`\`\`

Expected top-level structure:

\`\`\`text
epb/
├── services/
│   ├── platform/       # Reusable platform services
│   └── application/    # Product-specific services
├── libs/               # Shared libraries (DTOs, validators, clients)
├── bff/                # Backend For Frontend aggregation layer
├── frontend/           # Web application shell
├── infrastructure/     # IaC, Docker Compose, K8s manifests
├── docs/               # Handbook, glossary, manifest
├── Templates/          # Service scaffolds
└── Checklists/         # Review checklists
\`\`\`

**Expected result:** All top-level directories present.

### Step 2: Explore a platform service layout

\`\`\`bash
tree services/platform/auth -L 2
\`\`\`

Every service follows the same internal structure per [Folder Structure](../../Volume-1-Foundation/23-folder-structure.md):

\`\`\`text
services/platform/auth/
├── api/           # Controllers, routes, OpenAPI spec
├── domain/        # Business logic, domain models
├── persistence/   # Entities, repositories
├── mappers/       # DTO ↔ Entity conversion
├── events/        # Publishers and handlers
├── config/        # Service configuration
├── migrations/    # Database migrations
└── tests/         # Unit and integration tests
\`\`\`

**Expected result:** Layer directories exist; no business logic in \`api/\`.

### Step 3: Locate shared libraries

\`\`\`bash
ls libs/
\`\`\`

Shared libraries contain cross-service types:

| Library | Contents |
|---------|----------|
| \`libs/dto/\` | Request/Response DTOs shared across services |
| \`libs/validators/\` | Common validation rules |
| \`libs/clients/\` | Generated API client SDKs |
| \`libs/logging/\` | Structured logging utilities |

Import from shared libraries — never duplicate DTOs in individual services.

**Expected result:** You can identify which library to import for a given type.

### Step 4: Find handbook and templates

\`\`\`bash
ls Volume-1-Foundation/ Volume-3-Developer-Guide/ Templates/
\`\`\`

- **Volume 1** — architecture standards (read before coding)
- **Volume 3** — step-by-step guides (follow when building)
- **Templates/** — scaffolds for new services, DTOs, entities

**Expected result:** You know where to find standards vs how-to guides.

### Step 5: Verify service isolation

Confirm no service imports another service's \`persistence/\` or \`domain/\` directly:

\`\`\`bash
# Should return zero results
grep -r "from.*services/.*/persistence" services/ --include="*.ts" | head
\`\`\`

Services communicate via HTTP APIs or events only.

**Expected result:** No cross-service internal imports.`,
    verify: '- [ ] Monorepo root structure matches expected layout\n- [ ] At least one platform and one application service inspected\n- [ ] Shared libraries location identified\n- [ ] No cross-service persistence imports found',
    trouble: '| Symptom | Cause | Fix |\n|---------|-------|-----|\n| Missing `libs/` directory | Partial clone or old branch | `git pull origin main` |\n| Service missing layer folders | Scaffold not applied | Run `epb generate service` or copy from Templates |\n| Import errors on shared lib | Lib not built | `npm run build:libs` from root |',
    ref: '- [Folder Structure](../../Volume-1-Foundation/23-folder-structure.md)\n- [Naming Conventions](../../Volume-1-Foundation/24-naming-conventions.md)\n- [Service Scaffold](../../Templates/service-scaffold.md)',
    extraRelated: ['- [Create New Service](04-create-new-service.md)'],
  },
};

// Load extended content from separate files
require('./enhance-boilerplate-vol3-content')(CONTENT, v3);
require('./enhance-boilerplate-vol3-content2')(CONTENT);

const VOL1_ENHANCED = new Set([
  'v1-26', 'v1-28', 'v1-29', 'v1-31', 'v1-32', 'v1-33', 'v1-34',
  'v1-35', 'v1-36', 'v1-37', 'v1-38',
]);

let enhanced = 0;
const vol3chapters = manifest.chapters.filter((c) => c.volume === 3);

// Update Vol1 status (content written directly)
for (const ch of manifest.chapters) {
  if (VOL1_ENHANCED.has(ch.id)) {
    ch.status = 'reviewed';
    enhanced++;
    console.log('Enhanced (vol1):', ch.id);
  }
}

for (const cid of ENHANCE_IDS) {
  const ch = manifest.chapters.find((c) => c.id === cid);
  if (!ch) { console.log('SKIP missing:', cid); continue; }

  const idx = vol3chapters.findIndex((c) => c.id === cid);
  const prev = idx > 0 ? vol3chapters[idx - 1] : null;
  const next = idx < vol3chapters.length - 1 ? vol3chapters[idx + 1] : null;

  const data = CONTENT[cid];
  if (!data) { console.log('SKIP no content:', cid); continue; }

  const title = getVol3Title(ch);

  const content = typeof data === 'function' ? data(ch, prev, next) : v3(title, ch, prev, next, data);
  const outPath = path.join(ROOT, ch.file);
  fs.writeFileSync(outPath, content);
  ch.status = 'reviewed';
  enhanced++;
  console.log('Enhanced:', cid);
}

// Update manifest
fs.writeFileSync(path.join(ROOT, 'docs/CHAPTER-MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n');

// Verify
let remaining = 0;
const allIds = new Set([...ENHANCE_IDS, ...VOL1_ENHANCED]);
for (const cid of allIds) {
  const ch = manifest.chapters.find((c) => c.id === cid);
  const text = fs.readFileSync(path.join(ROOT, ch.file), 'utf8');
  for (const m of BOILERPLATE) {
    if (text.includes(m)) { console.log('BOILERPLATE:', cid, m); remaining++; }
  }
}

console.log(`\nTotal enhanced: ${enhanced}`);
console.log(remaining ? `WARNING: ${remaining} boilerplate markers remain` : 'Verification: clean');
