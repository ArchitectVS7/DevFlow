# Workflow Examples

Real-world examples of how to use DevFlow in different development scenarios. These workflows demonstrate best practices and common patterns for getting the most out of DevFlow.

---

## Table of Contents

1. [Solo Developer Workflow](#solo-developer-workflow)
2. [Team Collaboration Workflow](#team-collaboration-workflow)
3. [AI-Assisted Development](#ai-assisted-development)
4. [Code Review & Quality Assurance](#code-review--quality-assurance)
5. [Emergency Bug Fix](#emergency-bug-fix)
6. [Large Feature Implementation](#large-feature-implementation)
7. [Refactoring Project](#refactoring-project)

---

## Solo Developer Workflow

**Scenario:** You're building a new feature alone and want to stay organized without heavy project management overhead.

### Step 1: Define Your Idea

Start with a rough idea and let DevFlow help you refine it:

```bash
# Quickly improve your initial prompt
devflow fast "add password reset functionality"
```

**Output:**
```
COSTAR Score: 45%
- Missing Context: What authentication system?
- Missing Style: How should this be implemented?

Optimized Prompt:
"Implement password reset functionality for the existing JWT-based
authentication system. Include email verification, token expiration,
and secure password update endpoint."
```

### Step 2: Generate a PRD

Use the improved prompt to create a structured PRD:

```bash
devflow prd --project password-reset
```

**Interactive Questions:**
```
What feature are you building?
> Password reset with email verification

Who is the target audience?
> Existing authenticated users who forgot their password

What are the technical constraints?
> Must integrate with existing JWT auth, use SendGrid for emails

What are your success metrics?
> Users can reset password in <2 minutes, 99% email delivery rate
```

**Result:** `.devflow/outputs/password-reset/prd.md`

### Step 3: Break It Down

Convert the PRD into actionable tasks:

```bash
devflow plan --project password-reset
```

**Output:**
```
✓ Generated 8 tasks across 3 phases
✓ Saved to .devflow/outputs/password-reset/tasks.md

Phase 1: Setup & Database (3 tasks)
Phase 2: API Implementation (4 tasks)
Phase 3: Testing & Documentation (1 task)
```

### Step 4: Implement

Start the implementation workflow:

```bash
devflow implement --project password-reset
```

Your terminal shows:
```
Current Task: phase-1-task-1
Description: Create password_reset_tokens table

Progress: 0/8 tasks (0%)
```

### Step 5: Complete Tasks

As you finish each task:

```bash
# Complete task 1
devflow task-complete phase-1-task-1

# Complete task 2
devflow task-complete phase-1-task-2

# Continue...
```

Each completion:
- Updates `tasks.md` with `[x]` checkbox
- Creates a git commit (if configured)
- Tracks your progress

### Step 6: Audit Before Push

Before pushing to GitHub:

```bash
devflow audit-check
```

Fix any issues the audit identifies, then push your code.

---

## Team Collaboration Workflow

**Scenario:** You're working with a team and need to coordinate work across multiple developers using GitHub.

### Step 1: Project Initialization (Team Lead)

The team lead sets up DevFlow with GitHub integration:

```bash
cd my-team-project
devflow init

# Configure GitHub integration
cat > .devflow/config.json << 'EOF'
{
  "version": "1.4.0",
  "providers": ["cursor", "windsurf"],
  "projectManagement": {
    "type": "github",
    "githubTokenEnvVar": "GITHUB_TOKEN",
    "projectBoardUrl": "https://github.com/orgs/our-team/projects/1",
    "columnsMap": {
      "NEW": "Todo",
      "IMPLEMENTING": "In Progress",
      "COMPLETE": "Done"
    }
  }
}
EOF
```

### Step 2: Create PRD (Team Lead or PM)

Generate a comprehensive PRD for the team:

```bash
devflow prd --project user-notifications
```

The PRD becomes the source of truth for the feature.

### Step 3: Generate Tasks and Issues (Team Lead)

Create tasks and automatically populate the GitHub board:

```bash
devflow plan --project user-notifications
```

**Output:**
```
✓ Generated 15 tasks across 4 phases
✓ Created GitHub Issue #101: "Design notification schema"
✓ Created GitHub Issue #102: "Implement notification service"
✓ Created GitHub Issue #103: "Add email notification handler"
...
✓ All issues added to project board in "Todo" column
```

### Step 4: Team Members Pick Tasks

Team members assign themselves issues on GitHub and work locally:

**Developer A:**
```bash
# Pull latest
git pull origin main

# Check tasks
devflow show user-notifications

# Start implementing task 1
devflow implement --project user-notifications
```

**Developer B:**
```bash
# Pull latest
git pull origin main

# Start implementing task 5 (different phase)
devflow implement --project user-notifications --start-at phase-2-task-1
```

### Step 5: Complete and Sync

Each developer completes their tasks:

```bash
# Developer A completes task
devflow task-complete phase-1-task-1

# ✓ Local tasks.md updated
# ✓ GitHub Issue #101 moved to "Done"
# ✓ Git commit created

# Push changes
git push origin feature/notification-schema
```

### Step 6: Pull Request with Audit

Create PR with automated audit:

```bash
# Create feature branch
git checkout -b feature/notifications
git push -u origin feature/notifications

# Create PR (GitHub Actions runs audit automatically)
gh pr create --title "Add notification system" --body "Implements #101, #102, #103"
```

GitHub Actions workflow runs `devflow audit-check` and comments on the PR if issues are found.

---

## AI-Assisted Development

**Scenario:** You're using Cursor, Windsurf, or Claude Code and want to give your AI assistant perfect context.

### Step 1: Optimize Your Prompts

Before giving instructions to your AI assistant:

```bash
devflow deep "refactor the authentication module to use dependency injection"
```

**Output:**
```
COSTAR Analysis
===============
Context: 75% - Good background provided
Objective: 85% - Clear goal
Style: 60% - Needs formatting guidance
Tone: 40% - Consider specifying tone
Audience: 30% - Define skill level
Response: 50% - Specify deliverables

Optimized Prompt:
---
CONTEXT: You are working on a Node.js TypeScript project using Express.
The current authentication module has tight coupling and is difficult to test.

OBJECTIVE: Refactor the authentication module to use dependency injection,
making it more testable and maintainable while preserving all existing
functionality.

STYLE: Provide:
1. Refactored code with clear separation of concerns
2. Updated tests using mocked dependencies
3. Migration guide for existing code

TONE: Professional and educational, explaining design decisions

AUDIENCE: Senior TypeScript developers familiar with DI patterns

RESPONSE:
- Complete refactored code for auth module
- Updated test suite
- Documentation of changes
- Step-by-step migration guide
---
```

### Step 2: Use in Your AI Assistant

Copy the optimized prompt into Cursor/Windsurf/Claude Code:

**Cursor:**
```
Cmd+K (or Ctrl+K)
[Paste optimized prompt]
```

**Windsurf:**
```
@workspace [Paste optimized prompt]
```

**Claude Code:**
```
/deep [Paste optimized prompt]
```

### Step 3: Generate Slash Commands

If using Cursor or Windsurf, generate custom slash commands:

```bash
devflow init
# Select "cursor" and "windsurf" when prompted

# DevFlow automatically generates:
# .cursorrules with /devflow-prd, /devflow-plan, etc.
# .windsurfrules with equivalent commands
```

Now you can use `/devflow-prd` directly in your AI assistant!

### Step 4: Track Progress

As your AI assistant generates code:

```bash
# Review generated code
devflow audit-check

# If good, mark task complete
devflow task-complete phase-1-task-1
```

---

## Code Review & Quality Assurance

**Scenario:** You want to ensure high code quality and catch issues before they reach production.

### Pre-Commit Auditing

Set up automatic auditing before every commit:

```bash
# Install Husky
npm install -D husky
npx husky install

# Create pre-commit hook
npx husky add .husky/pre-commit "devflow audit-check"
```

**Workflow:**
```bash
# Make changes
vim src/api/auth.ts

# Stage changes
git add src/api/auth.ts

# Attempt commit (audit runs automatically)
git commit -m "Add auth endpoint"

# If audit fails:
# ❌ Code audit found 2 issues:
# 🔴 CRITICAL: SQL injection vulnerability at line 45
# 🟠 HIGH: Missing input validation at line 23
#
# Fix issues before committing.

# Fix issues, try again
vim src/api/auth.ts
git add src/api/auth.ts
git commit -m "Add auth endpoint"

# ✓ Audit passed
# ✓ Commit created
```

### Pull Request Review

Automate code review on every PR:

**`.github/workflows/devflow-audit.yml`:**
```yaml
name: Code Quality

on: pull_request

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g devflow
      - run: devflow init --skip-prompts
      - name: Audit code
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: devflow audit-check --diff
```

### Manual Review

Review specific files or commits:

```bash
# Audit specific files
devflow audit-check --files src/auth/login.ts src/auth/register.ts

# Audit a specific commit
devflow audit-check --commit a1b2c3d

# Audit an entire branch
devflow audit-check --branch feature/auth-system
```

---

## Emergency Bug Fix

**Scenario:** Production is down, you need to fix it fast without losing track of your work.

### Step 1: Archive Current Work

Save your current state:

```bash
# Archive current work-in-progress
devflow archive
```

This saves your current session so you can resume later.

### Step 2: Quick Fix Workflow

```bash
# Create hotfix branch
git checkout -b hotfix/login-issue

# Use fast mode for quick prompt
devflow fast "fix login endpoint returning 500 on valid credentials"

# Apply the optimized prompt with your AI assistant or manually fix

# Audit the fix
devflow audit-check --diff

# Commit and push
git add .
git commit -m "Fix: login endpoint 500 error"
git push origin hotfix/login-issue

# Create PR
gh pr create --title "Hotfix: Login 500 error" --body "Urgent fix for production issue"
```

### Step 3: Resume Previous Work

After the hotfix is merged:

```bash
# Switch back
git checkout main
git pull

# Resume previous work
devflow resume
```

DevFlow restores your previous session state.

---

## Large Feature Implementation

**Scenario:** You're implementing a complex feature that will take days or weeks.

### Step 1: Comprehensive Planning

Use deep mode for thorough analysis:

```bash
devflow deep "implement real-time notification system with websockets, email, and push notifications"
```

Generate detailed PRD:

```bash
devflow prd --project notification-system
```

**Answer detailed questions:**
- Architecture decisions
- Technology stack
- Scalability requirements
- Integration points
- Testing strategy

### Step 2: Break into Phases

```bash
devflow plan --project notification-system
```

**Generated phases:**
```
Phase 1: Infrastructure Setup (5 tasks)
Phase 2: WebSocket Implementation (8 tasks)
Phase 3: Email Service (6 tasks)
Phase 4: Push Notifications (7 tasks)
Phase 5: Testing & Documentation (4 tasks)

Total: 30 tasks
```

### Step 3: Track Progress Over Time

```bash
devflow implement --project notification-system --commit-strategy per-phase
```

**Track progress daily:**
```bash
# View progress
devflow show notification-system

# Output:
# Progress: 12/30 tasks (40%)
# Current Phase: Phase 2 (WebSocket Implementation)
# Current Task: phase-2-task-4 - Implement connection pooling
```

### Step 4: Regular Audits

Audit at the end of each phase:

```bash
# Complete phase
devflow task-complete phase-2-task-8

# Audit phase work
devflow audit-check --branch feature/websocket-impl

# Create PR for phase
gh pr create --title "Phase 2: WebSocket Implementation" --body "Completes tasks #15-22"
```

---

## Refactoring Project

**Scenario:** You need to refactor legacy code without breaking functionality.

### Step 1: Document Current State

Create a "refactoring PRD":

```bash
devflow prd --project legacy-refactor
```

**Key questions to answer:**
- What code needs refactoring?
- What are the pain points?
- What's the desired architecture?
- What tests exist?
- What's the migration strategy?

### Step 2: Plan Safe Refactoring

```bash
devflow plan --project legacy-refactor
```

**Example task breakdown:**
```
Phase 1: Add Tests (ensure no regressions)
- Task 1: Add unit tests for auth module
- Task 2: Add integration tests for API
- Task 3: Establish baseline coverage

Phase 2: Refactor Auth Module
- Task 4: Extract business logic from controllers
- Task 5: Implement dependency injection
- Task 6: Update tests with mocks

Phase 3: Refactor API Layer
- Task 7: Separate routes from handlers
- Task 8: Implement validation middleware
- Task 9: Update error handling

Phase 4: Verify & Document
- Task 10: Run full test suite
- Task 11: Update documentation
- Task 12: Create migration guide
```

### Step 3: Refactor Safely

For each task:

```bash
# Before refactoring, run tests
npm test

# Make changes
[refactor code]

# Run tests again
npm test

# Audit changes
devflow audit-check --diff

# If all passes, complete task
devflow task-complete phase-2-task-5

# Commit with clear message
# (DevFlow creates commit automatically)
```

### Step 4: Continuous Validation

After each phase:

```bash
# Full regression test
npm test

# Performance benchmarks
npm run benchmark

# Audit all changes
devflow audit-check --branch refactor/auth-module

# Create PR with detailed documentation
gh pr create --title "Refactor: Auth Module" --body "$(cat .devflow/outputs/legacy-refactor/phase-2-summary.md)"
```

---

## Tips for All Workflows

### Optimize Costs

Use appropriate COSTAR modes:

```bash
# Quick iterations - use fast mode
devflow fast "add validation"

# Critical features - use deep mode
devflow deep "implement payment processing"
```

### Save Prompts

Reuse optimized prompts:

```bash
# List saved prompts
devflow prompts list

# Use saved prompt
devflow prompts use payment-processing
```

### Batch Operations

Complete multiple tasks:

```bash
# Complete multiple tasks at once
devflow task-complete phase-1-task-1 phase-1-task-2 phase-1-task-3
```

### Integrate with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Audit Code Quality
  run: devflow audit-check --diff
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

---

## Next Steps

- [User Manual](user-manual.md) - Complete feature guide
- [Command Reference](commands.md) - All commands explained
- [GitHub Integration](github-integration.md) - Set up team workflows
- [Code Auditing](code-auditing.md) - Quality assurance setup

---

[← Back to Documentation Index](README.md)
