/**
 * Validate PRD + dev-docs completeness and quality score for BOSS handoff.
 * Usage:
 *   node scripts/validate-prd.js --feature notification-retry
 *   node scripts/validate-prd.js --feature notification-retry --score
 *   node scripts/validate-prd.js --all
 *   node scripts/validate-prd.js --feature notification-retry --pipeline
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRDS = path.join(ROOT, '.cursor', 'team', 'prds');
const REGISTRY = path.join(ROOT, '.cursor', 'team', 'registry.json');
const MIN_SCORE = 85;

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
  'Risks & Mitigations',
  'Open Questions',
  'Approval',
  'Requirements Summary',
];

const REQUIRED_DEV_SECTIONS = [
  'Implementation Summary',
  'BOSS Delivery Config',
  'Task Breakdown',
  'API Contracts',
  'Test Plan',
  'Acceptance Criteria',
  'Requirements Traceability Matrix',
  'Handoff',
];

const REQUIRED_WORKFLOWS_SECTIONS = ['Workflow Summary', 'Process Flows', 'WF-001', 'Traceability'];
const REQUIRED_UX_SECTIONS = ['UX Summary', 'Screen Specifications', 'SCR-001', 'HTML Design Handoff'];

const PIPELINE_STAGES = ['prd', 'doc', 'workflows', 'ux', 'designs'];

function readJson(fp) {
  const raw = fs.readFileSync(fp, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { feature: null, all: false, score: false, strict: false, pipeline: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--feature' && args[i + 1]) opts.feature = args[++i];
    else if (args[i] === '--all') opts.all = true;
    else if (args[i] === '--score') opts.score = true;
    else if (args[i] === '--strict') opts.strict = true;
    else if (args[i] === '--pipeline') opts.pipeline = true;
  }
  return opts;
}

function resolvePrdDir(slug) {
  for (const c of [path.join(PRDS, slug), path.join(PRDS, '_example', slug)]) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function countMatches(content, regex) {
  const m = content.match(regex);
  return m ? m.length : 0;
}

function checkSections(content, sections, label) {
  return sections
    .filter((s) => !content.includes(s))
    .map((s) => `${label}: missing section "${s}"`);
}

function computeScore(prd, dev) {
  const breakdown = {};
  let score = 0;

  const prdSections = REQUIRED_PRD_SECTIONS.filter((s) => prd.includes(s)).length;
  breakdown.prdSections = { points: Math.round((prdSections / REQUIRED_PRD_SECTIONS.length) * 20), max: 20 };
  score += breakdown.prdSections.points;

  const usCount = countMatches(prd, /US-\d{3}/g);
  breakdown.userStories = { count: usCount, points: usCount >= 2 ? 15 : usCount >= 1 ? 8 : 0, max: 15 };
  score += breakdown.userStories.points;

  const frCount = countMatches(prd, /FR-\d{3}/g);
  breakdown.functionalReqs = { count: frCount, points: frCount >= 3 ? 15 : frCount >= 1 ? 8 : 0, max: 15 };
  score += breakdown.functionalReqs.points;

  const hasSecurity = /security/i.test(prd) && /Non-Functional Requirements/i.test(prd);
  const hasOtherNfr = /Performance|Scalability|Availability|Observability/i.test(prd);
  breakdown.nfrs = { points: hasSecurity && hasOtherNfr ? 10 : hasSecurity ? 6 : 0, max: 10 };
  score += breakdown.nfrs.points;

  const hasEpb = /EPB Platform Mapping/i.test(prd);
  breakdown.epbMapping = { points: hasEpb ? 10 : 0, max: 10 };
  score += breakdown.epbMapping.points;

  const devSections = REQUIRED_DEV_SECTIONS.filter((s) => dev.includes(s)).length;
  breakdown.devSections = { points: Math.round((devSections / REQUIRED_DEV_SECTIONS.length) * 15), max: 15 };
  score += breakdown.devSections.points;

  const taskCount = countMatches(dev, /T-\d{3}/g);
  breakdown.tasks = { count: taskCount, points: taskCount >= 3 ? 10 : taskCount >= 1 ? 5 : 0, max: 10 };
  score += breakdown.tasks.points;

  const tpCount = countMatches(dev, /TP-\d{3}/g);
  breakdown.testPlan = { count: tpCount, points: tpCount >= 2 ? 10 : tpCount >= 1 ? 5 : 0, max: 10 };
  score += breakdown.testPlan.points;

  const acCount = countMatches(prd + dev, /AC-\d{3}/g);
  const acCheckboxes = countMatches(prd + dev, /- \[ \] AC-/g);
  breakdown.traceability = {
    acCount,
    acCheckboxes,
    points: dev.includes('Traceability Matrix') && acCount >= 3 ? 5 : dev.includes('Traceability Matrix') ? 3 : 0,
    max: 5,
  };
  score += breakdown.traceability.points;

  return { score: Math.min(100, score), breakdown };
}

function validatePipeline(dir, slug) {
  const errors = [];
  const stages = {};

  stages.prd = fs.existsSync(path.join(dir, 'PRD.md')) ? 'complete' : 'missing';
  stages.doc = fs.existsSync(path.join(dir, 'dev-docs.md')) ? 'complete' : 'missing';
  if (stages.prd === 'missing') errors.push(`[${slug}] Missing PRD.md (stage 1)`);
  if (stages.doc === 'missing') errors.push(`[${slug}] Missing dev-docs.md (stage 2)`);

  const workflowsPath = path.join(dir, 'workflows.md');
  if (!fs.existsSync(workflowsPath)) {
    errors.push(`[${slug}] Missing workflows.md (stage 3)`);
    stages.workflows = 'missing';
  } else {
    const wfErrors = checkSections(fs.readFileSync(workflowsPath, 'utf8'), REQUIRED_WORKFLOWS_SECTIONS, `[${slug}] workflows`);
    errors.push(...wfErrors);
    stages.workflows = wfErrors.length ? 'incomplete' : 'complete';
  }

  const uxPath = path.join(dir, 'ux-spec.md');
  if (!fs.existsSync(uxPath)) {
    errors.push(`[${slug}] Missing ux-spec.md (stage 4)`);
    stages.ux = 'missing';
  } else {
    const uxErrors = checkSections(fs.readFileSync(uxPath, 'utf8'), REQUIRED_UX_SECTIONS, `[${slug}] ux-spec`);
    errors.push(...uxErrors);
    stages.ux = uxErrors.length ? 'incomplete' : 'complete';
  }

  const designsDir = path.join(dir, 'designs');
  const htmlCount = fs.existsSync(designsDir)
    ? fs.readdirSync(designsDir).filter((f) => f.endsWith('.html')).length
    : 0;
  if (htmlCount < 1) {
    errors.push(`[${slug}] designs/: need ≥1 HTML file (stage 5), found ${htmlCount}`);
    stages.designs = 'missing';
  } else {
    stages.designs = 'complete';
  }

  return { stages, pipelineErrors: errors };
}

function validateFeature(slug, opts) {
  const errors = [];
  const warnings = [];
  const dir = resolvePrdDir(slug);
  if (!dir) {
    errors.push(`[${slug}] PRD directory not found`);
    return { slug, errors, warnings, ok: false, score: 0 };
  }

  const prdPath = path.join(dir, 'PRD.md');
  const devPath = path.join(dir, 'dev-docs.md');
  const metaPath = path.join(dir, 'prd-meta.json');

  if (!fs.existsSync(prdPath)) errors.push(`[${slug}] Missing PRD.md`);
  if (!fs.existsSync(devPath)) errors.push(`[${slug}] Missing dev-docs.md`);
  if (!fs.existsSync(metaPath)) warnings.push(`[${slug}] Missing prd-meta.json`);

  let prd = '';
  let dev = '';
  if (fs.existsSync(prdPath)) {
    prd = fs.readFileSync(prdPath, 'utf8');
    errors.push(...checkSections(prd, REQUIRED_PRD_SECTIONS, `[${slug}] PRD`));
    const usCount = countMatches(prd, /US-\d{3}/g);
    if (usCount < 2) errors.push(`[${slug}] PRD: need ≥2 user stories (US-###), found ${usCount}`);
    const frCount = countMatches(prd, /FR-\d{3}/g);
    if (frCount < 3) errors.push(`[${slug}] PRD: need ≥3 functional reqs (FR-###), found ${frCount}`);
    if (!/\*\*As a\*\*/i.test(prd) && !/As a /i.test(prd)) {
      errors.push(`[${slug}] PRD: no user story narrative found`);
    }
  }

  if (fs.existsSync(devPath)) {
    dev = fs.readFileSync(devPath, 'utf8');
    errors.push(...checkSections(dev, REQUIRED_DEV_SECTIONS, `[${slug}] dev-docs`));
    const taskCount = countMatches(dev, /T-\d{3}/g);
    if (taskCount < 3) errors.push(`[${slug}] dev-docs: need ≥3 tasks (T-###), found ${taskCount}`);
    const tpCount = countMatches(dev, /TP-\d{3}/g);
    if (tpCount < 2) errors.push(`[${slug}] dev-docs: need ≥2 test cases (TP-###), found ${tpCount}`);
    if (!/Traceability Matrix/i.test(dev)) {
      errors.push(`[${slug}] dev-docs: missing Requirements Traceability Matrix`);
    }
    if (!/BOSS deliver/i.test(dev)) warnings.push(`[${slug}] dev-docs: missing BOSS deliver handoff`);
  }

  const { score, breakdown } = computeScore(prd, dev);
  if (score < MIN_SCORE) {
    errors.push(`[${slug}] Quality score ${score}/100 below minimum ${MIN_SCORE}`);
  }

  if (fs.existsSync(metaPath)) {
    const meta = readJson(metaPath);
    if (!meta.slug) errors.push(`[${slug}] prd-meta.json: missing slug`);
    if (meta.status === 'draft') {
      warnings.push(`[${slug}] PRD status is draft — approve before BOSS deliver`);
    }
    if (meta.qualityScore != null && meta.qualityScore < MIN_SCORE) {
      warnings.push(`[${slug}] prd-meta qualityScore ${meta.qualityScore} below ${MIN_SCORE}`);
    }
  }

  if (opts.strict) {
    errors.push(...warnings);
    warnings.length = 0;
  }

  let pipeline = null;
  const requirePipeline = opts.pipeline || opts.score;
  if (requirePipeline && dir) {
    pipeline = validatePipeline(dir, slug);
    errors.push(...pipeline.pipelineErrors);
  }

  const pipelineComplete =
    pipeline &&
    PIPELINE_STAGES.every((s) => pipeline.stages[s] === 'complete');

  return {
    slug,
    score,
    breakdown,
    pipeline: pipeline ? pipeline.stages : undefined,
    pipelineComplete,
    errors,
    warnings,
    ok: errors.length === 0,
    approveReady: errors.length === 0 && score >= MIN_SCORE && (!requirePipeline || pipelineComplete),
  };
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
    for (const slug of slugs) results.push(validateFeature(slug, opts));
  } else if (opts.feature) {
    results.push(validateFeature(opts.feature, opts));
  } else {
    console.error('Usage: node scripts/validate-prd.js --feature <slug> [--score] [--pipeline] [--strict] | --all');
    process.exit(2);
  }

  const ok = results.every((r) => r.ok);
  const output = {
    ok,
    minScore: MIN_SCORE,
    validated: results.length,
    results: opts.score
      ? results
      : results.map(({ slug, ok: rOk, errors, warnings, score, approveReady }) => ({
          slug,
          ok: rOk,
          score,
          approveReady,
          errors,
          warnings,
        })),
  };
  console.log(JSON.stringify(output, null, 2));
  process.exit(ok ? 0 : 1);
}

main();
