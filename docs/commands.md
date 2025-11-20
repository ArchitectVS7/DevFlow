# Command Reference

Complete reference for all DevFlow CLI commands.

## Table of Contents

- [Core Commands](#core-commands)
- [Utility Commands](#utility-commands)
- [Configuration Commands](#configuration-commands)
- [Global Flags](#global-flags)

---

## Core Commands

### `devflow init`

Initialize DevFlow in your project.

**Usage:**
```bash
devflow init
```

**Description:**
Creates the `.devflow` directory structure, generates configuration files, and sets up slash commands for your selected AI coding assistants.

**Interactive Prompts:**
1. Select AI coding assistant(s)
2. Configure preferences
3. Choose template options

**Output:**
- `.devflow/config.json` - Main configuration
- `.devflow/outputs/` - Output directory
- Slash command files for selected providers

---

### `devflow prd`

Generate a Product Requirements Document.

**Usage:**
```bash
devflow prd [options]
```

**Options:**
- `--quick` - Skip Socratic questioning, use quick mode
- `--output <path>` - Custom output path
- `--project <name>` - Project name for organization

**Description:**
Generates a structured PRD through either:
- **Interactive Mode** (default): Socratic questioning to gather requirements
- **Quick Mode** (`--quick`): Rapid PRD generation with minimal input

**Output:**
- `.devflow/outputs/<project>/prd.md` - Generated PRD
- Session data for multi-stage workflows

**Example:**
```bash
# Interactive mode
devflow prd

# Quick mode
devflow prd --quick --project user-auth
```

---

### `devflow plan`

Generate task breakdown from PRD.

**Usage:**
```bash
devflow plan [options]
```

**Options:**
- `--project <name>` - Specify PRD project name
- `--session <id>` - Use specific session
- `--active-session` - Use active session

**Description:**
Analyzes a PRD and generates a structured task breakdown organized by implementation phases. Creates GitHub Issues if GitHub integration is configured.

**Output:**
- `.devflow/outputs/<project>/tasks.md` - Task breakdown
- `.devflow-implement-config.json` - Implementation tracking
- GitHub Issues (if configured)

**Example:**
```bash
# Auto-detect PRD
devflow plan

# Specify project
devflow plan --project user-auth

# Use session
devflow plan --session abc123
```

---

### `devflow implement`

Start implementation workflow.

**Usage:**
```bash
devflow implement [options]
```

**Options:**
- `--project <name>` - Specify project name
- `--commit-strategy <strategy>` - Git commit strategy

**Commit Strategies:**
- `per-task` - Commit after each task
- `per-phase` - Commit after each phase
- `per-5-tasks` - Commit every 5 tasks
- `none` - No automatic commits

**Description:**
Guides you through implementing tasks from your task plan. Tracks progress and optionally creates git commits.

**Example:**
```bash
# Interactive selection
devflow implement

# Specify project
devflow implement --project user-auth

# With commit strategy
devflow implement --commit-strategy per-task
```

---

### `devflow task-complete`

Mark a task as complete.

**Usage:**
```bash
devflow task-complete <task-id>
```

**Arguments:**
- `<task-id>` - Task identifier (e.g., `phase-1-task-1`)

**Description:**
Marks a task as complete in the task breakdown, updates progress tracking, creates a git commit (if configured), and updates GitHub Issue status (if configured).

**Example:**
```bash
devflow task-complete phase-1-task-1
```

**Output:**
- Updated `tasks.md`
- Git commit (if configured)
- Updated GitHub Issue (if configured)

---

### `devflow audit-check`

Run code audit using LLM.

**Usage:**
```bash
devflow audit-check [options]
```

**Options:**
- `--diff` - Audit only git diff (staged + unstaged changes)

**Description:**
Uses an LLM to review code for:
- Security vulnerabilities
- Architectural anti-patterns
- Missing documentation
- Code quality issues

**Exit Codes:**
- `0` - No issues found
- `1` - Issues detected

**Example:**
```bash
# Audit git diff
devflow audit-check --diff

# Audit entire project
devflow audit-check
```

**Requirements:**
- Audit configuration in `.devflow/config.json`
- API key environment variable set

---

## Utility Commands

### `devflow list`

List all PRD projects.

**Usage:**
```bash
devflow list
```

**Description:**
Displays all PRD projects in `.devflow/outputs/` with their status and task counts.

**Output:**
```
📋 PRD Projects:

  user-auth
    ✓ PRD: .devflow/outputs/user-auth/prd.md
    ✓ Tasks: 12 total, 5 complete (42%)

  payment-flow
    ✓ PRD: .devflow/outputs/payment-flow/prd.md
    ✗ No tasks generated yet
```

---

### `devflow show`

Show project details.

**Usage:**
```bash
devflow show <project-name>
```

**Arguments:**
- `<project-name>` - Name of the project

**Description:**
Displays detailed information about a specific project including PRD content, task breakdown, and progress.

**Example:**
```bash
devflow show user-auth
```

---

### `devflow version`

Display version information.

**Usage:**
```bash
devflow version
```

**Output:**
```
devflow/2.9.0 darwin-arm64 node-v18.17.0
```

---

## Configuration Commands

### `devflow config`

Manage configuration.

**Usage:**
```bash
devflow config [options]
```

**Options:**
- `--reset` - Reset configuration to defaults
- `--agent <name>` - Change AI agent

**Description:**
View or modify DevFlow configuration.

**Examples:**
```bash
# View current config
devflow config

# Reset to defaults
devflow config --reset

# Change agent
devflow config --agent cursor
```

---

## Global Flags

### `--help`

Display help for any command.

**Usage:**
```bash
devflow <command> --help
```

**Example:**
```bash
devflow plan --help
```

---

### `--version`

Display version information.

**Usage:**
```bash
devflow --version
```

---

## Exit Codes

DevFlow uses standard exit codes:

- `0` - Success
- `1` - Error or issues found
- `2` - Invalid usage

---

## Command Aliases

Some commands have shorter aliases:

| Full Command | Alias |
|-------------|-------|
| `devflow task-complete` | `devflow tc` |
| `devflow audit-check` | `devflow audit` |

---

## Environment Variables

Commands may use these environment variables:

- `GITHUB_TOKEN` - GitHub Personal Access Token
- `OPENAI_API_KEY` - OpenAI API key for auditing
- `NODE_ENV` - Node environment (development/production)

---

## Next Steps

- [User Manual](user-manual.md) - Learn how to use these commands
- [Configuration Guide](configuration.md) - Configure DevFlow
- [Workflow Examples](workflow-examples.md) - See commands in action

---

[← Back to Documentation Index](README.md)
