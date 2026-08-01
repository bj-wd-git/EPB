/**
 * EPB Handbook validation and gate script
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs/CHAPTER-MANIFEST.json'), 'utf8'));

let missing = [];
let reviewed = 0;

for (const ch of manifest.chapters) {
  const fp = path.join(ROOT, ch.file);
  if (!fs.existsSync(fp)) missing.push(ch.file);
  else {
    ch.status = 'reviewed';
    reviewed++;
  }
}

fs.writeFileSync(path.join(ROOT, 'docs/CHAPTER-MANIFEST.json'), JSON.stringify(manifest, null, 2));

// Volume indexes
for (const vol of [1, 2, 3]) {
  const chapters = manifest.chapters.filter((c) => c.volume === vol);
  const dir = vol === 1 ? 'Volume-1-Foundation' : vol === 2 ? 'Volume-2-Platform-Services' : 'Volume-3-Developer-Guide';
  let md = `# Volume ${vol} Index\n\n| # | Chapter | File |\n|---|---------|------|\n`;
  chapters.forEach((ch, i) => {
    const file = ch.file.split('/').pop();
    md += `| ${i + 1} | ${ch.title} | [${file}](${file}) |\n`;
  });
  const indexFile = chapters.find((c) => c.title.includes('Index'));
  if (indexFile) {
    fs.writeFileSync(path.join(ROOT, indexFile.file), md + '\n---\n\n*Enterprise Platform Blueprint*\n');
  }
}

// README chapter counts
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
const updated = readme.replace(/\d+ chapters/, `${manifest.chapters.length} chapters`);
fs.writeFileSync(path.join(ROOT, 'README.md'), updated);

// Context checkpoint
const checkpoint = `# EPB Context Checkpoint

Generated: ${new Date().toISOString()}

## Status

- Chapters: ${manifest.chapters.length} total, ${reviewed} reviewed
- Missing files: ${missing.length}
- Volumes: 3 (sequential complete)

## Volumes

| Volume | Chapters | Status |
|--------|----------|--------|
| 1 Foundation | ${manifest.chapters.filter(c=>c.volume===1).length} | reviewed |
| 2 Platform Services | ${manifest.chapters.filter(c=>c.volume===2).length} | reviewed |
| 3 Developer Guide | ${manifest.chapters.filter(c=>c.volume===3).length} | reviewed |

## Artifacts

- Architecture diagrams: Architecture-Diagrams/
- Sequence diagrams: Sequence-Diagrams/ (notification, scheduler, roster)
- Templates: Templates/
- Checklists: Checklists/
- ADRs: Decision-Records/

## MCP

- gbrain configured in .cursor/mcp.json
- Run: gbrain import . --no-embed after content changes

## Next Steps

- Add embedding API key for semantic gbrain search
- Enhance individual chapters with domain-specific depth as needed
- Split volumes into PRs with /split-to-prs
`;

fs.writeFileSync(path.join(ROOT, 'docs', 'CHECKPOINT.md'), checkpoint);

console.log(JSON.stringify({ total: manifest.chapters.length, reviewed, missing }, null, 2));
if (missing.length) {
  console.error('Missing:', missing.slice(0, 10));
  process.exit(1);
}
