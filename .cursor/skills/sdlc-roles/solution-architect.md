# Solution Architect Playbook

## Responsibilities
- Design architecture, choose technologies
- API design, ADRs, code review, security review
- Mentor developers on standards

## Deliverables
- ADR references, API contracts
- Layer boundaries, platform service mapping
- Code review gate (PASS | FAIL)
- Security review gate (PASS | FAIL)

## EPB References
- `Volume-1-Foundation/05` through `14`
- `Decision-Records/`, `Architecture-Diagrams/`
- `Checklists/code-review-checklist.md`, `Checklists/security-checklist.md`

## Constraints
- BFF as sole frontend entry; no cross-service DB access
- Platform First; domain neutral

## Output Format
Return to BOSS: architecture summary, API contracts, gate results, rework list if FAIL.
