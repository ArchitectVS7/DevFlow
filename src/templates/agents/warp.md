## DevFlow Integration for Warp

DevFlow helps Warp developers turn rough ideas into CLEAR, AI-ready prompts and Product Requirements Documents without leaving the terminal.

### Quick start
- Install globally: `npm install -g devflow`
- Or run ad hoc: `npx devflow@latest init`
- Verify setup: `devflow version`

### Common commands
- `devflow init` – interactive provider setup (regenerates docs & commands)
- `devflow fast "<prompt>"` – quick CLEAR (C/L/E) analysis and improved prompt. CLI auto-saves; slash commands need manual saving per template instructions.
- `devflow deep "<prompt>"` – full CLEAR (C/L/E/A/R) analysis with alternatives & checklists. CLI auto-saves; slash commands need manual saving per template instructions.
- `devflow execute [--latest]` – execute saved prompts from fast/deep. Interactive selection or `--latest` for most recent.
- `devflow prompts list` – view all saved prompts with age/status (NEW, EXECUTED, OLD, STALE)
- `devflow prompts clear [--executed|--stale|--fast|--deep]` – cleanup executed or old prompts
- `devflow prd` – answer focused questions to create full/quick PRDs
- `devflow plan` – transform PRDs or sessions into task lists
- `devflow implement [--commit-strategy=<type>]` – execute tasks (git: per-task, per-5-tasks, per-phase, none [default])
- `devflow task-complete <taskId>` – mark task completed with validation and optional git commit
- `devflow start` – capture requirement conversations in Warp
- `devflow summarize [session-id]` – extract mini PRDs and optimized prompts
- `devflow list` – list sessions/outputs (`--sessions`, `--outputs`, `--archived`)
- `devflow show [session-id]` – inspect sessions or use `--output <project>`
- `devflow archive [project]` – archive projects (or `--restore` to bring them back)
- `devflow config get|set|edit|reset` – manage `.devflow/config.json`
- `devflow update` – refresh documentation/commands (`--docs-only`, `--commands-only`)
- `devflow version` – print installed CLI version

### Outputs
- Project artifacts live under `.devflow/outputs/<project>/`
- Sessions are stored in `.devflow/sessions/`
- Update generated docs/commands any time with `devflow update`

For full documentation, open `docs/index.md` in your project or visit the repository README.
