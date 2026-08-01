/**
 * Validate BOSS gate artifacts against feature reports.
 * Usage:
 *   node scripts/validate-boss-gates.js --feature notification-retry
 *   node scripts/validate-boss-gates.js --all
 *   node scripts/validate-boss-gates.js --feature notification-retry --mode standard
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEAM = path.join(ROOT, '.cursor', 'team');
const GATES_DIR = path.join(TEAM, 'gates');
const REPORTS_DIR = path.join(TEAM, 'reports');
const REGISTRY = path.join(TEAM, 'registry.json');

const GATES_BY_MODE = {
  fix: ['validation'],
  standard: ['code-review', 'bugbot', 'qa', 'uat'],
  full: ['code-review', 'bugbot', 'qa', 'uat', 'security-review'],
};

const GATE_SECTION_RE = {
  'code-review': /## 6\. Code Review[\s\S]*?\*\*Result:\*\*\s*(PASS|FAIL)/i,
  bugbot: /### bugbot[\s\S]*?\*\*Result:\*\*\s*(PASS|FAIL|N\/A)/i,
  qa: /## 7\. QA[\s\S]*?\*\*Result:\*\*\s*(PASS|FAIL)/i,
  uat: /## 8\. UAT[\s\S]*?\*\*Result:\*\*\s*(PASS|FAIL)/i,
  'security-review': /### security-review[\s\S]*?\*\*Result:\*\*\s*(PASS|FAIL|N\/A)/i,
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { feature: null, all: false, mode: null, strict: true };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--feature' && args[i + 1]) opts.feature = args[++i];
    else if (args[i] === '--all') opts.all = true;
    else if (args[i] === '--mode' && args[i + 1]) opts.mode = args[++i];
    else if (args[i] === '--no-strict') opts.strict = false;
  }
  return opts;
}

function readJson(fp) {
  const raw = fs.readFileSync(fp, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY)) return { teams: [] };
  return readJson(REGISTRY);
}

function resolveReport(slug, team) {
  if (team && team.report && fs.existsSync(path.join(ROOT, team.report))) {
    return path.join(ROOT, team.report);
  }
  const candidates = [
    path.join(REPORTS_DIR, `${slug}.md`),
    path.join(REPORTS_DIR, '_example', `${slug}.md`),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function resolveGatesDir(slug) {
  const candidates = [
    path.join(GATES_DIR, slug),
    path.join(GATES_DIR, '_example', slug),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return path.join(GATES_DIR, slug);
}

function detectMode(reportPath, checkpointPath) {
  if (checkpointPath && fs.existsSync(checkpointPath)) {
    return readJson(checkpointPath).mode || 'standard';
  }
  const content = fs.readFileSync(reportPath, 'utf8');
  if (/## Mode:\s*fix/i.test(content)) return 'fix';
  return 'standard';
}

function readReportGateResult(content, gateKey) {
  const re = GATE_SECTION_RE[gateKey];
  if (!re) return null;
  const m = content.match(re);
  return m ? m[1].toUpperCase() : null;
}

function validateArtifact(fp, gateKey) {
  const errors = [];
  if (!fs.existsSync(fp)) {
    errors.push(`Missing artifact: ${path.relative(ROOT, fp)}`);
    return errors;
  }
  let data;
  try {
    data = readJson(fp);
  } catch (e) {
    errors.push(`Invalid JSON: ${path.relative(ROOT, fp)} — ${e.message}`);
    return errors;
  }
  const required = ['gate', 'result', 'timestamp', 'runner', 'evidence', 'summary'];
  for (const key of required) {
    if (data[key] === undefined || data[key] === null) {
      errors.push(`${path.relative(ROOT, fp)}: missing field "${key}"`);
    }
  }
  if (data.gate && data.gate !== gateKey && gateKey !== 'validation') {
    errors.push(`${path.relative(ROOT, fp)}: gate "${data.gate}" does not match expected "${gateKey}"`);
  }
  if (data.result === 'FAIL') {
    errors.push(`${path.relative(ROOT, fp)}: result is FAIL`);
  }
  if (Array.isArray(data.evidence)) {
    for (const ev of data.evidence) {
      if (typeof ev === 'string' && !ev.includes('*') && !fs.existsSync(path.join(ROOT, ev))) {
        errors.push(`${path.relative(ROOT, fp)}: evidence path not found: ${ev}`);
      }
    }
  }
  return errors;
}

function validateFeature(slug, team, opts) {
  const errors = [];
  const warnings = [];
  const reportPath = resolveReport(slug, team);
  if (!reportPath) {
    errors.push(`[${slug}] No report found`);
    return { slug, errors, warnings, ok: false };
  }

  const checkpointPath = path.join(TEAM, 'checkpoints', `${slug}.json`);
  const checkpointExample = path.join(TEAM, 'checkpoints', '_example', `${slug}.json`);
  const cp = fs.existsSync(checkpointPath)
    ? checkpointPath
    : fs.existsSync(checkpointExample)
      ? checkpointExample
      : null;

  const mode = opts.mode || detectMode(reportPath, cp);
  const requiredGates = GATES_BY_MODE[mode] || GATES_BY_MODE.standard;
  const content = fs.readFileSync(reportPath, 'utf8');
  const gatesDir = resolveGatesDir(slug);

  if (mode === 'fix') {
    const artifact = path.join(gatesDir, 'validation.json');
    const artifactErrors = validateArtifact(artifact, 'validation');
    errors.push(...artifactErrors.map((e) => `[${slug}] ${e}`));
    if (!artifactErrors.length && fs.existsSync(artifact)) {
      const data = readJson(artifact);
      if (data.gate !== 'validation') {
        errors.push(`[${slug}] validation.json: gate must be "validation"`);
      }
    }
    return { slug, mode, errors, warnings, ok: errors.length === 0 };
  }

  for (const gateKey of requiredGates) {
    const artifactFile = gateKey === 'validation' ? 'validation.json' : `${gateKey}.json`;
    const artifactPath = path.join(gatesDir, artifactFile);
    const reportResult = readReportGateResult(content, gateKey);

    if (reportResult === 'PASS') {
      const artifactErrors = validateArtifact(artifactPath, gateKey);
      errors.push(...artifactErrors.map((e) => `[${slug}] ${e}`));
      if (opts.strict && artifactErrors.some((e) => e.includes('Missing artifact'))) {
        errors.push(`[${slug}] Report claims PASS for ${gateKey} but artifact missing`);
      }
    } else if (reportResult === 'FAIL') {
      errors.push(`[${slug}] Report gate ${gateKey} is FAIL`);
    } else if (reportResult === 'N/A') {
      warnings.push(`[${slug}] Gate ${gateKey} marked N/A — skipped`);
    } else if (fs.existsSync(artifactPath)) {
      const artifactErrors = validateArtifact(artifactPath, gateKey);
      errors.push(...artifactErrors.map((e) => `[${slug}] ${e}`));
    }
  }

  return { slug, mode, errors, warnings, ok: errors.length === 0 };
}

function main() {
  const opts = parseArgs();
  const registry = loadRegistry();
  const results = [];

  if (opts.all) {
    const slugs = (registry.teams || []).map((t) => t.slug).filter(Boolean);
    if (!slugs.length) {
      console.log(JSON.stringify({ message: 'No teams in registry', ok: true }, null, 2));
      process.exit(0);
    }
    for (const slug of slugs) {
      const team = registry.teams.find((t) => t.slug === slug);
      results.push(validateFeature(slug, team, opts));
    }
  } else if (opts.feature) {
    const team = (registry.teams || []).find((t) => t.slug === opts.feature);
    results.push(validateFeature(opts.feature, team, opts));
  } else {
    console.error('Usage: node scripts/validate-boss-gates.js --feature <slug> | --all');
    process.exit(2);
  }

  const allOk = results.every((r) => r.ok);
  const output = {
    ok: allOk,
    validated: results.length,
    results,
  };
  console.log(JSON.stringify(output, null, 2));
  process.exit(allOk ? 0 : 1);
}

main();
