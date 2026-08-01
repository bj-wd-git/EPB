# HTML Designs

Static HTML mockups for BOSS `deliver` — **pipeline stage 5 of 6**.

## Rules

1. One HTML file per screen in [ux-spec.md](../ux-spec.md) §9
2. Self-contained HTML + CSS (Tailwind CDN or inline styles OK)
3. Match design tokens and layout from ux-spec
4. No backend logic — placeholder data only
5. Filename: `designs/<screen-slug>.html`

## Validation

```bash
node scripts/validate-prd.js --feature <slug> --pipeline
```

Requires ≥1 `.html` file and all Must-priority screens from ux-spec.

## Handoff

**Next stage:** `BOSS prd approve <slug>` → `BOSS deliver <slug>`

Frontend developer implements React/components from these HTML designs.
