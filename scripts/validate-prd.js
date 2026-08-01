/**
 * Validate PRD + dev-docs completeness for BOSS handoff.
 * Usage:
 *   node scripts/validate-prd.js --feature notification-retry
 *   node scripts/validate-prd.js --all
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRDS = path.join(ROOT, '.cursor', 'team', 'prds');
const REGISTRY = path.join(ROOT, '.cursor', 'team', 'registry.json');

const REQUIRED_PRD_SECTIONS = [
  'Executive Summary',
  'Problem Statement',
  'Goals & Success Metrics',
  'Scope',
  'User Stories',
  'Functional Requirements',
  'Non-Functional Requirements',
  'API Outline',
  'EPB Platform Mapping',
  'Approval',
];

const REQUIRED_DEV_SECTIONS = [
  'Implementation Summary',
  'BOSS Delivery Config',
  'Task Breakdown',
  'API Contracts',
  'Test Plan',
  'Acceptance Criteria',
  'Handoff',
];

function readJson(fp) {
  const raw = fs.readFileSync(fp, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { feature: null, all: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--feature' && args[i + 1]) opts.feature = args[++i];
    else if (args[i] === '--all') opts.all = true;
  }
  return opts;
}

function resolvePrdDir(slug) {
  const candidates = [
    path.join(PRDS, slug),
    path.join(PRDS, '_example', slug),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function checkSections(content, sections, label) {
  const missing = sections.filter((s) => !content.includes(s));
  return missing.map((s) => `${label}: missing section "${s}"`);
}

function validateFeature(slug) {
  const errors = [];
  const warnings = [];
  const dir = resolvePrdDir(slug);
  if (!dir) {
    errors.push(`[${slug}] PRD directory not found`);
    return { slug, errors, warnings, ok: false };
  }

  const prdPath = path.join(dir, 'PRD.md');
  const devPath = path.join(dir, 'dev-docs.md');
  const metaPath = path.join(dir, 'prd-meta.json');

  if (!fs.existsSync(prdPath)) errors.push(`[${slug}] Missing PRD.md`);
  if (!fs.existsSync(devPath)) errors.push(`[${slug}] Missing dev-docs.md`);
  if (!fs.existsSync(metaPath)) warnings.push(`[${slug}] Missing prd-meta.json`);

  if (fs.existsSync(prdPath)) {
    const prd = fs.readFileSync(prdPath, 'utf8');
    errors.push(...checkSections(prd, REQUIRED_PRD_SECTIONS, `[${slug}] PRD`).map((e) => e));
    if (!/\*\*As a\*\*/i.test(prd) && !/As a /i.test(prd)) {
      errors.push(`[${slug}] PRD: no user story found`);
    }
    if (!/FR-001|Functional Requirements/i.test(prd)) {
      warnings.push(`[${slug}] PRD: verify functional requirement IDs`);
    }
  }

  if (fs.existsSync(devPath)) {
    const dev = fs.readFileSync(devPath, 'utf8');
    errors.push(...checkSections(dev, REQUIRED_DEV_SECTIONS, `[${slug}] dev-docs`).map((e) => e));
    if (!/T-001|Task Breakdown/i.test(dev)) {
      errors.push(`[${slug}] dev-docs: no task breakdown`);
    }
    if (!/BOSS deliver/i.test(dev)) {
      warnings.push(`[${slug}] dev-docs: missing BOSS deliver handoff`);
    }
  }

  if (fs.existsSync(metaPath)) {
    const meta = readJson(metaPath);
    if (!meta.slug) errors.push(`[${slug}] prd-meta.json: missing slug`);
    if (meta.status === 'draft') {
      warnings.push(`[${slug}] PRD status is draft — approve before BOSS deliver`);
    }
  }

  return { slug, errors, warnings, ok: errors.length === 0 };
}

function main() {
  const opts = parseArgs();
  const results = [];

  if (opts.all) {
    let slugs = [];
    if (fs.existsSync(REGISTRY)) {
      const reg = readJson(REGISTRY);
      slugs = (reg.prds || []).map((p) => (typeof p === 'string' ? p : p.slug)).filter(Boolean);
    }
    if (!slugs.length && fs.existsSync(path.join(PRDS, '_example'))) {
      slugs = fs.readdirSync(path.join(PRDS, '_example'), { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    }
    for (const slug of slugs) results.push(validateFeature(slug));
  } else if (opts.feature) {
    results.push(validateFeature(opts.feature));
  } else {
    console.error('Usage: node scripts/validate-prd.js --feature <slug> | --all');
    process.exit(2);
  }

  const ok = results.every((r) => r.ok);
  console.log(JSON.stringify({ ok, validated: results.length, results }, null, 2));
  process.exit(ok ? 0 : 1);
}

main();
