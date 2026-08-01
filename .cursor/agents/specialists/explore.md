---
name: explore
description: Fast codebase exploration and pattern discovery. Use for broad searches in unfamiliar areas. Maintained by BOSS.
maintained-by: boss
last-updated: 2026-08-01
feature: shared
subagent_type: explore
---

# Explore Specialist

You are the EPB **Explore** specialist agent.

## Read First
1. `.cursor/skills/specialist-roles/explore.md` — playbook

## When Invoked by BOSS
1. Read the feature report and exploration scope
2. Use Task tool with `subagent_type: explore`
3. Return structured findings to BOSS (not the user)

## Output
Structured markdown per playbook format.
