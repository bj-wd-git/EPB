# BOSS — How to Use (Practical Guide)

Step-by-step guide for daily use. Overview: [BOSS.md](BOSS.md)

---

## 1. First-time setup

### In this EPB repo (already has BOSS)

1. Open the repo in **Cursor**
2. Start a new chat
3. Type:

```text
Use BOSS to init
```

4. (Optional) Enable MCPs:

```text
Use BOSS to mcp list
```

For handbook search, install gbrain (see [.cursor/mcps/README.md](.cursor/mcps/README.md)). GitHub MCP uses Cursor/GitHub auth.

### In another project (bootstrap)

```powershell
git clone https://github.com/bj-wd-git/EPB.git
cd EPB
.\.cursor\team\bootstrap.ps1 -TargetPath C:\path\to\your-project
```

Then in your project:

1. Edit `.cursor/skills/project-vision/SKILL.md` (your mission, stack, standards)
2. Open project in Cursor
3. `Use BOSS to init`

### Reference-only (no bootstrap)

In any Cursor chat:

```text
Read https://github.com/bj-wd-git/EPB/blob/main/BOSS-USAGE.md
Use BOSS to deliver "my-feature"
```

---

## 2. Pick the right mode

| You want to… | Say this | Mode |
|--------------|----------|------|
| **Write PRD + dev docs first** | `Use BOSS to prd "user-auth"` | **prd** |
| Fix a typo, link, small bug | `Use BOSS to fix "broken link in README"` | **fix** |
| Build a feature / API | `Use BOSS to deliver "user-auth"` | **standard** |
| Platform feature, security-critical | `Use BOSS to deliver "payment-webhook" --full` | **full** |
| Approve PRD for development | `Use BOSS to prd approve user-auth` | prd approve |
| Resume yesterday's work | `Use BOSS to continue "user-auth"` | continue |

**Recommended for new features:** `prd` → `prd approve` → `deliver`

**Rule of thumb:** New feature? Start with **prd**. Small fix? **fix**. Ready to code? **deliver** (reads dev-docs if present).

---

## 3. PRD → Dev-docs → Deliver (new features)

### Step 1 — Author PRD + dev-docs

```text
Use BOSS to prd "notification-retry"

Context:
- Add retry with exponential backoff to notification platform
- Follow epb-vision
- Full PRD all 17 sections + dev-docs with task breakdown
```

**Creates:**

```text
.cursor/team/prds/notification-retry/
├── PRD.md          # Full product requirements (stakeholders)
├── dev-docs.md     # Development handoff for BOSS deliver
└── prd-meta.json   # Status: draft
```

### Step 2 — Validate

```bash
node scripts/validate-prd.js --feature notification-retry
```

### Step 3 — Approve

```text
Use BOSS to prd approve notification-retry
```

Sets `prd-meta.json` → `status: approved`

### Step 4 — Deliver

```text
Use BOSS to deliver "notification-retry"

Read dev-docs at .cursor/team/prds/notification-retry/dev-docs.md
Execute tasks T-001… in order.
```

BOSS uses dev-docs for: mode, roles, API contracts, test plan, acceptance criteria.

**Example:** [notification-retry PRD](.cursor/team/prds/_example/notification-retry/PRD.md) · [dev-docs](.cursor/team/prds/_example/notification-retry/dev-docs.md)

---

## 4. Daily workflows (copy-paste)

### A. Quick fix (fastest)

```text
Use BOSS to fix "update ADR-001 link in README"
```

BOSS will:
- Work inline (no subagent swarm)
- Create a short report under `.cursor/team/reports/`
- Write `.cursor/team/gates/<slug>/validation.json`
- Run validation

**You verify:**

```bash
node scripts/validate-boss-gates.js --feature <slug> --mode fix
node scripts/check-links.js
```

---

### B. Standard feature delivery

```text
Use BOSS to deliver "notification-retry"

Context:
- Add retry with exponential backoff to notification platform
- Follow EPB standards (epb-vision)
- Write gate artifacts for every PASS
```

BOSS will:
1. Triage → **standard** mode
2. Create checkpoint + report + team agents
3. Run SDLC phases (PM → BA → Architect → …)
4. Write gate JSON files under `.cursor/team/gates/<slug>/`
5. Update checkpoint after each phase

**You verify before PR:**

```bash
node scripts/validate-boss-gates.js --feature notification-retry
node scripts/check-links.js
```

**Artifacts to expect:**

```text
.cursor/team/reports/notification-retry.md
.cursor/team/checkpoints/notification-retry.json
.cursor/team/gates/notification-retry/
  ├── code-review.json
  ├── qa.json
  └── uat.json
```

---

### C. Full platform delivery

```text
Use BOSS to deliver "tenant-isolation" --full

Use epb-vision. Enable gbrain + github MCPs.
Security gate required. Unattended: false.
```

Adds **security-review**, **bugbot**, and all gate artifacts.

---

### D. Resume multi-session work

```text
Use BOSS to continue "notification-retry"
```

BOSS reads `.cursor/team/checkpoints/notification-retry.json` and picks up the next phase.

**Tip:** Commit checkpoint + report after each session so nothing is lost.

---

### E. CI failed on your PR

```text
Use BOSS — ci-investigator for PR #12
```

Or invoke specialist directly:

```text
Use ci-investigator subagent to diagnose failed checks on this branch
```

---

## 4. Best practices (get the most from BOSS)

### Do

| Practice | Why |
|----------|-----|
| One feature = one slug | `notification-retry`, not `fix stuff` |
| Give context in the first message | Goals, constraints, out of scope |
| Say `epb-vision` for EPB work | Keeps architecture aligned |
| Run validator before PR | Catches missing gate files |
| Use **fix** for small changes | Saves time and tokens |
| Commit report + checkpoint | Enables **continue** |
| Check example files | [notification-retry report](.cursor/team/reports/_example/notification-retry.md) |

### Don't

| Avoid | Why |
|-------|-----|
| `BOSS deliver --full` for typos | Overkill |
| Mark PASS without gate JSON | CI will fail |
| Skip `validate-boss-gates.js` | False confidence |
| Invoke 9 roles manually | Let BOSS triage |

---

## 5. MCP setup (optional but powerful)

```text
Use BOSS to mcp list
Use BOSS to mcp enable linear
Use BOSS to mcp sync
```

| MCP | When you need it |
|-----|------------------|
| **gbrain** | Search EPB handbook / repo |
| **github** | PRs, CI, releases |
| **linear** | Sync issues/sprints |
| **slack** | Team context |
| **sentry** | Production errors |

If MCP shows `needsAuth`:

```text
Use BOSS to mcp auth github
```

---

## 6. Before you open a PR (checklist)

```bash
# 1. Links intact (EPB repo)
node scripts/check-links.js

# 2. Gate artifacts match report
node scripts/validate-boss-gates.js --feature YOUR-SLUG

# 3. Report status
#    .cursor/team/reports/YOUR-SLUG.md → Status: Complete
```

GitHub **BOSS Gates** workflow runs automatically when PR touches `.cursor/team/**`.

**Recommended:** Enable branch protection → require **BOSS Gates** check on `main`.

---

## 7. GitHub automation

### Trigger delivery from an issue

1. Create issue: `[boss:my-feature] Add user auth`
2. Add label: `boss:deliver`
3. Workflow posts instructions; in Cursor run:

```text
Use BOSS to continue my-feature
```

### Manual workflow

GitHub → Actions → **BOSS Deliver** → Run workflow → enter feature slug and mode.

---

## 8. Invoke BOSS correctly in Cursor

### Recommended (agent mode)

```text
@boss Use BOSS to deliver "notification-retry"
```

Or:

```text
Use BOSS to deliver "notification-retry"
```

Cursor should load `.cursor/agents/boss.md` from the description match.

### Advanced — single role only

```text
Use backend-developer subagent for retry API on feature notification-retry
```

Skip full BOSS when you only need one role.

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| BOSS skips gates | Remind: "Write gate artifacts before PASS. Run validate-boss-gates." |
| Validator fails | Check `.cursor/team/gates/<slug>/` — missing JSON? |
| Can't resume | Ensure checkpoint exists in `.cursor/team/checkpoints/` |
| MCP not working | `Use BOSS to mcp sync` → auth if needed |
| Too slow | Switch to `BOSS fix` or narrower scope |
| Agent files not found | New chat turn after `BOSS init` |

---

## 10. Example session (EPB repo)

**Goal:** Fix a broken link

```text
Use BOSS to fix "fix broken link in Volume-1 index"
```

**Goal:** Plan a handbook chapter update

```text
Use BOSS to deliver "update-bff-chapter" --full
Apply epb-vision. Use gbrain for cross-references.
```

**Goal:** Resume next day

```text
Use BOSS to continue "update-bff-chapter"
```

**Before PR:**

```bash
node scripts/check-links.js
node scripts/validate-boss-gates.js --feature update-bff-chapter
```

---

## Quick reference card

```text
BOSS prd "<name>"           → PRD + dev-docs
BOSS prd approve "<name>"   → approve for delivery
BOSS init                   → first time setup
BOSS fix "<desc>"           → small/fast
BOSS deliver "<name>"       → standard (reads dev-docs)
BOSS deliver "<name>" --full → platform + security
BOSS continue "<name>"      → resume
BOSS mcp list               → MCP status
validate-prd                → node scripts/validate-prd.js --feature <slug>
validate-boss-gates         → node scripts/validate-boss-gates.js --feature <slug>
```

---

*Share this guide: https://github.com/bj-wd-git/EPB/blob/main/BOSS-USAGE.md*
