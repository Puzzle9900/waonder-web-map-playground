---
description: Generate a new milestone document with standardized template
---

You are helping the user create a new milestone document for the Waonder backend project.

## Instructions

1. Ask the user for the following information in a conversational way:
   - Milestone number (e.g., 5, 6, 7)
   - Milestone name (e.g., "Contexts API and Database Foundation")
   - Scope description (1-3 sentences describing the north star - what this milestone achieves)
   - Main goals (ask for 3-5 goals, comma-separated or line by line)
   - Target completion (e.g., "Week 2 of MVP", "Q1 2025", "End of Sprint 3")

2. Once you have all the information, generate a markdown file with the following deterministic structure:

```markdown
# Milestone {number}: {name}

**Status:** Not Started
**Target:** {target}

## Scope

{scope description - the north star of this milestone}

## Goals

{each goal as a bullet point}

## Architecture Overview

### C4 Context Diagram

```
[Placeholder for C4 Level 1 (Context) diagram]

Add ASCII art or reference to diagram showing:
- System boundary
- Key components being built/modified
- External dependencies
- Data flows relevant to this milestone
```

## Tasks

### Architecture
- [ ] Task placeholder

### Database
- [ ] Task placeholder

### API
- [ ] Task placeholder

### Testing
- [ ] Task placeholder

### Performance
- [ ] Task placeholder

### Development Setup
- [ ] Task placeholder

## Out of Scope

- Item explicitly excluded from this milestone
- Another item not included
- Deferred to future milestone

## Priority Actions

1. First critical action to start
2. Second critical action
3. Third critical action

## Summary

**Database:** Not Started
**API:** Not Started
**Performance:** Not Started
**Testing:** Not Started
```

3. Create the file at: `docs/architecture/mvp/milestones/m{number}-{slug}.md`
   - The slug should be generated from the milestone name: lowercase, spaces replaced with hyphens, special characters removed

4. After creating the file, confirm to the user:
   - The file location
   - Suggest they can now fill in the C4 diagram
   - Remind them to update sections as work progresses

## Important Notes

- Always use the exact template structure above for consistency
- Do not add emojis to the generated file
- Keep formatting clean and professional
- The template is deterministic - same inputs always produce the same output
- All checkbox items start unchecked `[ ]`
- Status always starts as "Not Started"
