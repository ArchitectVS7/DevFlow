# DevFlow Workflows (Universal)

Use these instructions when your agent can only read documentation (no slash-command support).

## Quick start
- Install globally: `npm install -g devflow`
- Or run ad hoc: `npx devflow@latest init`
- Verify installation: `devflow version`

## Command reference

| Command | Purpose |
| --- | --- |
| `devflow init` | Interactive setup. Select providers and generate documentation/command files. |
| `devflow fast "<prompt>"` | CLEAR (C/L/E) analysis with improved prompt output. CLI auto-saves to `.devflow/outputs/prompts/fast/`. When using slash commands, agent must save manually per template instructions. |
| `devflow deep "<prompt>"` | Full CLEAR (C/L/E/A/R) analysis, alternative variations, validation checklists. CLI auto-saves to `.devflow/outputs/prompts/deep/`. When using slash commands, agent must save manually per template instructions. |
| `devflow execute [--latest]` | Execute saved prompts from fast/deep optimization. Interactive selection or `--latest` for most recent. |
| `devflow prompts list` | View all saved prompts with status (NEW, EXECUTED, OLD, STALE) and storage statistics. |
| `devflow prompts clear` | Manage prompt cleanup. Supports `--executed`, `--stale`, `--fast`, `--deep`, `--all` flags. |
| `devflow prd` | Guided Socratic questions that generate `full-prd.md` and `quick-prd.md`. |
| `devflow plan` | Transform PRDs or sessions into phase-based `tasks.md`. |
| `devflow implement [--commit-strategy=<type>]` | Start task execution. Git strategies: per-task, per-5-tasks, per-phase, none (default: none). |
| `devflow task-complete <taskId>` | Mark task as completed with validation and optional git commit. Auto-displays next task. |
| `devflow start` | Begin conversational capture session for requirements gathering. |
| `devflow summarize [session-id]` | Extract mini PRD and optimized prompts from saved sessions. |
| `devflow list` | List sessions and/or output projects (`--sessions`, `--outputs`, filters). |
| `devflow show [session-id]` | Inspect session details or use `--output <project>` to view outputs. |
| `devflow archive [project]` | Archive completed projects or restore them (`--restore`). |
| `devflow config [get|set|edit|reset]` | Manage `.devflow/config.json` preferences. |
| `devflow update` | Refresh managed docs and slash commands (supports `--docs-only`, `--commands-only`). |
| `devflow version` | Print installed version. |

## Typical workflows
- **Improve prompts quickly:** run `devflow fast` or `devflow deep` depending on complexity.
- **Create strategy:** run `devflow prd` then `devflow plan` for an implementation checklist.
- **Execute tasks:** use `devflow implement [--commit-strategy=<type>]`, commit work, repeat until tasks complete.
- **Capture conversations:** record with `devflow start`, extract with `devflow summarize`.
- **Stay organized:** inspect with `devflow list/show`, archive with `devflow archive`, refresh docs via `devflow update`.

## Implementation with Git Strategy (Agent Workflow)

When implementing tasks with `devflow implement`:

1. **Check task count**: Read `tasks.md` and count phases
2. **Ask user for git preferences** (optional, only if >3 phases):
   ```
   "I notice this implementation has [X] phases with [Y] tasks.

   Git auto-commit preferences?
   - per-task: Commit after each task (detailed history)
   - per-5-tasks: Commit every 5 tasks (balanced)
   - per-phase: Commit when phase completes (milestones)
   - none: Manual git workflow (default)

   I'll use 'none' if you don't specify."
   ```

3. **Run implement with strategy**:
   ```bash
   # With git strategy (if user specified):
   devflow implement --commit-strategy=per-phase

   # Or without (defaults to 'none' - manual commits):
   devflow implement
   ```

4. **Default behavior**: If no `--commit-strategy` flag provided, defaults to `none` (manual commits)

Artifacts are stored under `.devflow/`:
- `.devflow/outputs/<project>/` for PRDs, tasks, prompts
- `.devflow/sessions/` for captured conversations
- `.devflow/templates/` for custom overrides
