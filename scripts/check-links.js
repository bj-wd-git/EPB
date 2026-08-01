/**
 * Scan markdown files for broken relative links to other .md files
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const linkRe = /\[([^\]]*)\]\(([^)]+)\)/g;
const skip = new Set(['http:', 'https:', 'mailto:', '#']);
const skipFiles = /[\\\/]docs[\\\/]templates[\\\/]/;

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith('.md')) files.push(p);
  }
  return files;
}

const broken = [];
for (const file of walk(ROOT)) {
  if (skipFiles.test(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const dir = path.dirname(file);
  let m;
  while ((m = linkRe.exec(content))) {
    const target = m[2].split('#')[0].trim();
    if (!target || target.includes('{') || [...skip].some((s) => target.startsWith(s))) continue;
    const resolved = path.normalize(path.join(dir, target));
    if (!fs.existsSync(resolved)) {
      broken.push({ from: path.relative(ROOT, file), link: target });
    }
  }
}

console.log(JSON.stringify({ scanned: walk(ROOT).length, broken: broken.length, samples: broken.slice(0, 20) }, null, 2));
process.exit(broken.length ? 1 : 0);
