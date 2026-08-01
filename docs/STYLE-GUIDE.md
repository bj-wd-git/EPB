# EPB Style Guide

Enterprise Platform Blueprint handbook writing standards. Every chapter author and subagent must follow this guide.

## Voice and Tone

- Write for experienced software architects and senior engineers
- Be direct, precise, and practical
- Explain **why** decisions exist, not only **what** to do
- Never assume a business domain (no ERP-only, hospital-only, or CRM-only examples)
- Use generic examples: "resource", "entity", "tenant", "organization"

## Core Principles (always reflect)

1. **Build Once. Reuse Everywhere.**
2. **Platform First** — shared capabilities before application code
3. **API First** — contracts before implementation
4. **Configuration Over Customization**
5. **Convention Over Configuration**
6. **Single Source of Truth**
7. **Loose Coupling. High Cohesion.**
8. **Security by Design. Scalability by Design.**

## Chapter Structure

### Volume 1 (Foundation)

Required sections: Purpose, Overview, Architecture, Responsibilities, Design Principles, Implementation Guidelines, Best Practices, Anti-Patterns, Related Chapters.

### Volume 2 (Platform Services)

Required sections: Purpose, Architecture, Responsibilities (In/Out of Scope), API Design, Database Design, Folder Structure, Sequence Diagrams, Extension Points, Integration, Best Practices, Anti-Patterns, Related Chapters.

### Volume 3 (Developer Guide)

Required sections: What You Will Accomplish, Prerequisites, Steps (numbered), Verification, Troubleshooting, Reference, Related Chapters.

## Diagrams

- Use Mermaid in Markdown for architecture and sequence diagrams
- Prefer `flowchart TB` or `flowchart LR` for architecture
- Prefer `sequenceDiagram` for service interactions
- Keep node labels short; put detail in prose

## Terminology

- Use canonical terms from [GLOSSARY.md](GLOSSARY.md)
- First use of a glossary term: brief inline definition
- Never invent synonyms for defined terms (e.g., do not alternate "DTO" and "data transfer object" randomly)

## Cross-References

- Link to related chapters using relative paths
- Every chapter must include Previous / Next navigation
- Reference Volume 1 standards from Volume 2 and 3 chapters

## Anti-Patterns Section

Always include a table:

| Anti-Pattern | Why It Fails | Preferred Approach |

## Status and Metadata

Chapter header format:

```markdown
> **Volume:** N | **Chapter ID:** vN-XX | **Status:** draft
```

## Length Guidance

- Foundation chapters: 800–1500 words
- Platform service chapters: 1000–2000 words
- Developer guide chapters: 600–1200 words

## What to Avoid

- Framework-specific code unless marked as illustrative example
- Business-domain assumptions
- Vague advice ("handle errors properly") without concrete guidance
- Duplicate content across chapters — link instead
