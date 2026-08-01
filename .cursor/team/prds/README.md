# BOSS PRD Workspace

Full-level PRD automation — produce **PRD** + **dev-docs** that BOSS `deliver` consumes.

**Quality bar:** score ≥ 85/100 (`node scripts/validate-prd.js --feature <slug> --score`)

Skill: [prd-developer](../../skills/prd-developer/SKILL.md) · Reference: [reference.md](../../skills/prd-developer/reference.md)

## Flow

```text
User brief → BOSS prd <slug> → PRD.md + dev-docs.md → BOSS deliver <slug>
```

## Structure

```text
.cursor/team/prds/
├── PRD-TEMPLATE.md
├── DEV-DOCS-TEMPLATE.md
├── README.md
└── <feature-slug>/
    ├── PRD.md           # Full product requirements
    ├── dev-docs.md      # Development handoff for BOSS
    └── prd-meta.json    # Status, version, approval
```

## Commands

```text
Use BOSS to prd "notification-retry"
Use BOSS to prd approve notification-retry
Use BOSS to deliver notification-retry    # reads dev-docs if present
```

## Validation

```bash
node scripts/validate-prd.js --feature notification-retry
```

## Approval gate

`BOSS deliver` should read dev-docs only when `prd-meta.json` → `status: approved` (or warn if draft).

## Example

[_example/notification-retry/](_example/notification-retry/)

## Skill

[prd-developer skill](../../skills/prd-developer/SKILL.md)
