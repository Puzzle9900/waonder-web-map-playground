# Engineering Specification Generator Prompt

## Purpose

This prompt generates **pragmatic, startup-optimized** engineering specifications for product milestones. Designed for Senior Software Engineer-level output while maintaining **startup velocity**, it produces **actionable** documentation that bridges product requirements with implementation details—without the enterprise overhead.

**Startup Philosophy**: Progress > Perfection. Ship fast, iterate faster. Specs should accelerate development, not slow it down.

## How to Use This Prompt

### Initial Generation (15-60 minutes)
1. Fill in the **Milestone Name** and **Milestone Details** sections below
2. Provide any additional context about the milestone
3. Use this complete prompt with an AI assistant to generate a focused engineering specification
4. The generated spec follows pragmatic RFC patterns (Stack Overflow, The Pragmatic Engineer, startup-optimized)

### Quick Refinement (Optional: 15-30 minutes)
5. For complex or high-risk features, use the **Specification Self-Refinement Instructions** section
6. Feed the generated spec back through this prompt for a quick critique
7. Iterate once more if needed (max 2 iterations—ship it!)

### Target Output
The final specification should be:
- **Implementable immediately** by any senior engineer
- **Clear about trade-offs** and what we're NOT building
- **Right-sized for complexity**: 1-page for small features, 5-pages for major work
- **Fast to read**: Scannable with diagrams, examples, and clear sections

---

## Input Template

### Milestone Name
**[FILL IN: Name of the milestone/feature]**

### Milestone Details
**[FILL IN: Product requirements, user stories, business context, and any constraints]**

### Additional Context
**[FILL IN: Any relevant technical context, dependencies, existing architecture, team capacity, or timeline considerations]**

### Existing Specification (For Self-Refinement Only)
**[FILL IN: If this is a refinement pass, paste the previously generated specification here. Leave blank for initial generation.]**

---

## Pre-Generation Research Phase (Startup-Optimized)

**Philosophy**: Do just enough research to avoid major mistakes. Don't over-analyze—start building and iterate.

### Quick Checklist (15-30 minutes total)

**Before writing your spec, answer these questions:**

1. **What problem are we solving?** (2 minutes)
   - One sentence from the user's perspective
   - Why now? What's the urgency?

2. **What's the current state?** (5 minutes)
   - Quickly scan existing codebase for similar patterns
   - Check current architecture style (our stack: NestJS, PostgreSQL, PostGIS)
   - Identify which module this belongs to

3. **What are 2-3 ways to solve this?** (10 minutes)
   - Quick brainstorm: Simple vs. Complex approach
   - Which approach ships fastest?
   - What's the trade-off we're making?

4. **What could go wrong?** (5 minutes)
   - Top 3 risks that could kill this feature
   - Any dependencies or blockers?
   - Security or performance concerns?

5. **How will we know it works?** (5 minutes)
   - What's the success metric?
   - How do we test this?
   - What's the rollback plan if it breaks?

### When to Do MORE Research

**Skip extended research for:**
- Small features (<3 days)
- Clear, well-understood problems
- Low-risk changes

**Invest more time (1-2 hours) for:**
- Database schema changes
- New external integrations
- Performance-critical paths
- Security-sensitive features
- Cross-team dependencies

### Startup Anti-Patterns to Avoid

- **Analysis Paralysis**: Researching for days before writing code
- **Premature Optimization**: Solving problems we don't have yet
- **Perfect Documentation**: Spending more time on docs than implementation
- **Enterprise Theater**: Creating stakeholder matrices and RACI charts for a 3-person team

**Remember**: At a startup, the best research is often shipping v1 and learning from real usage.

---

## Specification Generation Instructions (Startup Edition)

Generate a **pragmatic, action-oriented** engineering specification. Write at a Senior Software Engineer level, but optimize for **speed and clarity** over comprehensiveness.

### Startup Complexity Guidelines

**Tiny Features (<2 days): No Spec Needed**
- Write a GitHub issue or Notion card
- Include: What, Why, Acceptance Criteria
- Just start coding

**Small Features (2-5 days, single module):**
- **1-page spec**: Problem, Solution, API/Schema, Tests
- Focus: What's changing and how to test it
- Time: 15-30 minutes to write

**Medium Features (1-3 weeks, multiple modules):**
- **2-4 page spec**: Add architecture diagram, risks, rollout plan
- Focus: Integration points and what could go wrong
- Time: 30-60 minutes to write

**Large Features (>3 weeks, cross-cutting changes):**
- **5-8 page spec**: Full template below, but skip enterprise fluff
- Focus: Phased delivery, major risks, team coordination
- Time: 1-2 hours to write

**Rule of Thumb**: If writing the spec takes longer than building v1, you're over-engineering it.

---

# Engineering Specification Document Structure

**Startup Adaptation**: Use sections that add value. Skip sections that don't. The template below is a MENU, not a checklist.

## 1. TL;DR (Required - 5 minutes to write)

Start every spec with a scannable summary:

**What**: One sentence - what are we building?

**Why**: One sentence - what problem does this solve?

**How**: One sentence - what's our approach?

**Risk**: [Low | Medium | High] - what's the biggest concern?

**Timeline**: X days/weeks - how long to ship?

**Owner**: Who's building this?

**Example:**
```
What: Add distance filter to GET /contexts endpoint
Why: Users need to control search radius for relevant results
How: Add optional maxDistance query param, filter with PostGIS
Risk: Low (simple change, well-tested pattern)
Timeline: 2 days
Owner: @gabriel
```

---

## 2. Context & Scope (Required for Medium/Large - 10 minutes)

**Background** (2-3 sentences):
- What's the current state?
- Why are we doing this now?

**Goals** (Bullet list):
- What MUST this do? (P0)
- What SHOULD this do? (P1)
- What's nice to have? (P2 - probably cut this)

**Non-Goals** (Critical - prevents scope creep):
- What are we explicitly NOT doing?
- What features are we deferring to v2?

**Example:**
```
Background:
Currently, GET /contexts returns all results within 5km. Users in dense cities
get too many results, users in rural areas get too few. We need configurable radius.

Goals:
- P0: Add maxDistance parameter (100m - 50km range)
- P1: Return search metadata (radius used, result count)

Non-Goals:
- Not adding shape-based search (circles, polygons) - that's v2
- Not changing default 5km behavior for backward compatibility
```

**Dependencies & Blockers** (If any):
- What needs to be done first?
- What could block us?

---

## 3. Technical Approach (Required - 15 minutes)

**Skip formal requirement IDs for small features. Focus on WHAT and HOW.**

### What's Changing?

**API Changes** (if applicable):
- New endpoints or parameters
- Request/response format
- Error codes

**Database Changes** (if applicable):
- New tables/columns
- Index changes
- Migration strategy

**Code Changes** (high-level):
- Which modules/files are affected?
- New classes or functions?

### How Will It Work?

**Option 1: Simple Description**
Write 2-3 paragraphs explaining the implementation approach.

**Option 2: Architecture Diagram**
Draw a simple flow diagram (use Mermaid, or just ASCII art).

**Example:**
```
User Request → API Controller → Validation → Service Layer → PostGIS Query → Response

Changes:
1. Add maxDistance validation (100-50000 range)
2. Modify contextsService.findNearby() to accept maxDistance param
3. Update PostGIS ST_DWithin query to use dynamic radius
4. Add metadata to response
```

### Performance & Scale

**Only include if relevant:**
- Expected latency impact: "Adds ~10ms for radius calculation"
- Scale concerns: "Query performance tested up to 50km radius"
- Caching strategy: "Results cached for 5 minutes"

### Security & Validation

**Only include if relevant:**
- Input validation: "maxDistance must be 100-50000"
- Auth requirements: "Requires valid API key"
- Data sensitivity: "No PII in this feature"

---

## 4. API / Interface Contract (Required for API changes - 10 minutes)

**Write the actual API contract or interface. Code speaks louder than prose.**

### API Endpoint Example

```typescript
// GET /contexts?lat=40.7128&lng=-74.0060&maxDistance=2000

interface ContextsQueryParams {
  lat: number;           // Required: Latitude
  lng: number;           // Required: Longitude
  maxDistance?: number;  // Optional: 100-50000 meters, default 5000
}

interface ContextsResponse {
  contexts: Context[];
  metadata: {
    searchRadius: number;      // Actual radius used
    resultsFound: number;       // Total results
    centroid: { lat: number; lng: number; }
  }
}

// Error Responses
400 - Invalid parameter (out of range)
401 - Missing or invalid API key
500 - Internal server error
```

### Database Schema Example

```sql
-- If adding new table
CREATE TABLE example (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_example_name ON example(name);

-- If modifying existing table
ALTER TABLE contexts ADD COLUMN search_radius INTEGER;
```

### Key Functions/Classes

**Only if complex logic:**

```typescript
// New function signature
async findContextsWithinRadius(
  lat: number,
  lng: number,
  maxDistance: number
): Promise<Context[]>

// Changes to existing function
// Before: findNearby(lat, lng)
// After:  findNearby(lat, lng, maxDistance = 5000)
```

---

## 5. Testing Strategy (Required - 5 minutes)

**Just list the key test cases. Don't over-engineer.**

### What to Test

**Unit Tests** (test logic in isolation):
- [ ] Validation: maxDistance rejects values < 100
- [ ] Validation: maxDistance rejects values > 50000
- [ ] Validation: maxDistance accepts valid range
- [ ] Business logic: [key function tests]

**Integration Tests** (test API end-to-end):
- [ ] Happy path: Returns results within specified radius
- [ ] Edge case: Default radius when param omitted
- [ ] Error case: Returns 400 for invalid maxDistance
- [ ] Error case: Returns 401 for missing auth

**Manual Testing** (if needed):
- [ ] Test in staging with real data
- [ ] Verify response times under load
- [ ] Check error messages are user-friendly

### Test Data

**What data do you need?**
- Seed contexts at known locations
- Create users with API keys
- Set up edge cases (boundary conditions)

### Coverage Target

**Startup approach:**
- Critical path: 100% coverage
- Everything else: 80% coverage
- Don't obsess over 100% - ship it!

---

## 6. Risks & Rollout (Optional for low-risk - 5 minutes)

### What Could Go Wrong?

**Top 3 Risks:**
1. **Risk**: PostGIS query performance degrades with large radius
   - **Mitigation**: Cap at 50km, add query timeout
   - **Contingency**: Roll back, optimize query

2. **Risk**: Breaking change for API consumers
   - **Mitigation**: Make param optional, keep default behavior
   - **Contingency**: Communicate breaking change, version API

3. **Risk**: [Your third risk]
   - **Mitigation**: [Prevention strategy]
   - **Contingency**: [Backup plan]

### Deployment Plan

**How are we shipping this?**
- [ ] Merge to main branch
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Update API docs

**Rollback Plan:**
- Revert PR #123
- Database migration rollback (if needed): `npm run migration:revert`

**Feature Flag?** (Only if needed for gradual rollout)
- [ ] Yes, use flag: `ENABLE_DISTANCE_FILTER`
- [ ] No, ship to everyone

### Monitoring

**What are we watching?**
- API error rate (should stay < 1%)
- Response time p95 (should stay < 200ms)
- Query performance (new radius param)

**Alerts?** (Only if critical)
- Alert if error rate > 5% for 5 minutes
- Alert if latency > 500ms for 5 minutes

---

## 7. Open Questions (Optional)

**Use this to track unknowns:**

- [ ] **Q1**: Do we need to support polygon search in the future?
  - **Owner**: @product
  - **Deadline**: Before v2 planning

- [ ] **Q2**: Should we log search radius for analytics?
  - **Owner**: @data-team
  - **Deadline**: Before deployment

---

## 8. Implementation Tasks (Optional - 5 minutes)

**Quick checklist of what needs to be done:**

- [ ] Add maxDistance validation to DTO
- [ ] Update ContextsService.findNearby() signature
- [ ] Modify PostGIS query to use dynamic radius
- [ ] Add metadata to response
- [ ] Write unit tests (validation)
- [ ] Write integration tests (E2E)
- [ ] Update API documentation
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production
- [ ] Monitor for 24h

**Time Estimate**: 2 days
**Owner**: @gabriel

---

## Specification Writing Tips (Startup Edition)

### Good Spec Checklist

**Your spec is DONE when:**
- [ ] Any senior engineer can implement it without asking questions
- [ ] You've clearly stated what we're NOT doing
- [ ] You've included code examples or API contracts
- [ ] You've listed the key test cases
- [ ] You've identified the top 3 risks
- [ ] You can explain it in 2 minutes at a whiteboard
- [ ] It took < 2 hours to write

### Startup Writing Philosophy

**DO:**
- Write in plain English
- Use code examples liberally
- Include actual TypeScript/SQL snippets
- List concrete test cases
- Call out trade-offs explicitly
- Keep it scannable (bullets, short paragraphs)

**DON'T:**
- Use formal requirement IDs (FR-001, NFR-SEC-042)
- Create comprehensive threat models for simple features
- Write 10 pages when 2 pages will do
- Over-specify implementation details
- Solve hypothetical future problems
- Spend days perfecting the spec

### When to Write More vs. Less

**Write LESS for:**
- Internal tools
- Temporary solutions
- Low-risk changes
- Clear requirements

**Write MORE for:**
- External APIs (other teams depend on it)
- Database schema changes (hard to undo)
- Security-sensitive features
- Performance-critical paths
- Complex integrations

### Red Flags (Bad Specs)

**Warning signs your spec needs work:**
- "It's too long to read" → Make it scannable
- "I'm confused about X" → Add examples
- "What about edge case Y?" → Test cases missing
- "Why this approach?" → Explain trade-offs
- "This will take forever" → Scope creep, cut features

### AI-Assisted Development (2025)

**Write specs that work with AI coding tools:**
- Include TypeScript interfaces (AI can generate implementations)
- Show example request/response (AI can generate validators)
- List test cases explicitly (AI can generate test code)
- Use consistent formatting (AI parses markdown well)

**But remember:**
- AI can write code, but YOU make architectural decisions
- AI can suggest approaches, but YOU choose trade-offs
- AI can generate tests, but YOU define what matters
- Specs are for HUMANS first, AI second

---

## Quick Start Guide

**Never written a spec before? Start here:**

### 1. Copy This Template (5 min)

```markdown
# [Feature Name]

## TL;DR
What: [One sentence]
Why: [One sentence]
How: [One sentence]
Risk: [Low/Med/High]
Timeline: [X days]
Owner: [@you]

## Problem & Solution
[2-3 paragraphs explaining current state and proposed solution]

## What's Changing
- API: [New endpoints or params]
- Database: [Schema changes]
- Code: [Which modules affected]

## API Contract (if applicable)
```typescript
// Paste TypeScript interfaces or SQL schema here
```

## Tests
- [ ] Unit: [Key test case 1]
- [ ] Unit: [Key test case 2]
- [ ] Integration: [E2E test]

## Risks
1. [Top risk] → Mitigation: [How to prevent]
2. [Second risk] → Mitigation: [How to prevent]

## Tasks
- [ ] [Implementation task 1]
- [ ] [Implementation task 2]
- [ ] Write tests
- [ ] Deploy to staging
- [ ] Deploy to production
```

### 2. Fill It In (30-60 min)

- Start with TL;DR (forces clarity)
- Explain the problem and solution
- Show code examples (TypeScript/SQL)
- List test cases
- Identify top risks
- Break into tasks

### 3. Get Feedback (15 min)

- Send to one senior engineer
- Ask: "Is anything unclear?"
- Fix ambiguities
- Ship it

### 4. Start Coding

- Use spec as your guide
- Update spec if you learn new things
- Don't let spec drift from reality

**Total time: 1-2 hours**

**Result: A pragmatic spec that accelerates development**

---

## Self-Refinement (Optional - for Complex Features Only)

**Startup Rule**: Don't over-refine. One pass is usually enough.

### When to Refine

**SKIP refinement for:**
- Small features (<1 week)
- Internal tools
- Low-risk changes
- Time-sensitive work

**DO refine for:**
- External APIs
- Database migrations
- Security-critical features
- Complex integrations
- >3 week projects

### Quick Refinement Process (15-30 min)

1. **Paste your spec** into the "Existing Specification" field above
2. **Ask AI**: "Review this spec and tell me what's missing or unclear"
3. **Fix critical issues only**:
   - Ambiguities that will cause confusion
   - Missing test cases
   - Unclear API contracts
   - High risks not addressed
4. **Stop after 1-2 iterations** - ship it!

### Simple Refinement Checklist

**Ask yourself (or AI) these questions:**

**Can Someone Implement This?**
- [ ] Can a senior engineer start coding without asking questions?
- [ ] Are API contracts clear (request/response format)?
- [ ] Are database changes spelled out (schema, migrations)?
- [ ] Are test cases specific enough?

**Is Anything Confusing?**
- [ ] Is the problem statement clear?
- [ ] Are non-goals explicit?
- [ ] Are code examples correct?
- [ ] Would a new team member understand this?

**What's Missing?**
- [ ] Top 3 risks identified?
- [ ] Rollback plan defined?
- [ ] Performance concerns addressed (if relevant)?
- [ ] Security validated (if sensitive)?

**Reality Check**
- [ ] Timeline realistic?
- [ ] Scope reasonable for available time?
- [ ] Dependencies identified?
- [ ] Trade-offs explained?

**If you answered "yes" to all above: SHIP IT. Stop refining.**


---

## Example: Complete 1-Page Spec

Here's what a good small feature spec looks like:

```markdown
# Add Distance Filter to Contexts API

## TL;DR
What: Add optional maxDistance parameter to GET /contexts
Why: Users need to control search radius (cities too crowded, rural areas too sparse)
How: Add query param validation, modify PostGIS query
Risk: Low (simple change, existing pattern)
Timeline: 2 days
Owner: @gabriel

## Problem & Solution
Currently, GET /contexts always searches within 5km radius. This is too much for
dense cities (NYC returns 200+ results) and too little for rural areas (Montana
returns 2 results).

Solution: Add optional maxDistance query parameter (100m - 50km). Keep 5km as
default for backward compatibility.

## What's Changing
- API: New optional query parameter maxDistance (number, meters)
- Database: No schema changes (using existing PostGIS ST_DWithin)
- Code: Update ContextsController validation and ContextsService query logic

## API Contract
```typescript
// GET /contexts?lat=40.7128&lng=-74.0060&maxDistance=2000

interface ContextsQueryParams {
  lat: number;           // Required
  lng: number;           // Required
  maxDistance?: number;  // Optional: 100-50000, default 5000
}

interface ContextsResponse {
  contexts: Context[];
  metadata: {
    searchRadius: number;
    resultsFound: number;
    centroid: { lat: number; lng: number; }
  }
}

// Errors
400 - maxDistance out of range
401 - Invalid API key
```

## Tests
- [ ] Unit: Validation rejects maxDistance < 100
- [ ] Unit: Validation rejects maxDistance > 50000
- [ ] Unit: Validation accepts valid range
- [ ] Integration: Returns results within specified radius
- [ ] Integration: Uses default 5000 when omitted
- [ ] Integration: Returns 400 for invalid values

## Risks
1. Query performance with large radius (50km)
   → Mitigation: PostGIS indexed, tested to 50km, cap at 50km
2. Breaking change for consumers
   → Mitigation: Parameter is optional, default unchanged

## Tasks
- [ ] Add maxDistance to ContextsQueryDto with validation
- [ ] Update ContextsService.findNearby(lat, lng, maxDistance = 5000)
- [ ] Modify PostGIS query to use dynamic radius
- [ ] Add metadata to response
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Deploy to staging, smoke test
- [ ] Deploy to production
- [ ] Monitor error rate and latency for 24h
```

**That's it. Simple, clear, implementable. Total time to write: 30 minutes.**

---

## Final Notes

### Remember
- **Specs should accelerate development, not slow it down**
- **Progress > Perfection** at a startup
- **Code examples > prose** for clarity
- **Ship it** after 1-2 hours max

### When in Doubt
- Ask: "Would this spec help me if I read it 6 months from now?"
- Ask: "Can someone else implement this without Slack questions?"
- If yes to both: Stop writing, start coding

### Get Better Over Time
- **After each milestone**, ask: Was the spec helpful?
- **Track**: What was missing? What was unnecessary?
- **Iterate**: Improve your template for next time

---

**Made with pragmatism for startups that ship. 🚀**

Version 4.0 - Startup Edition (2025)
