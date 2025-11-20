# Command Reference

Complete reference for all DevFlow CLI commands.

## Table of Contents

- [Prompt Engineering](#prompt-engineering)
- [Project Management](#project-management)
- [Development & Quality](#development--quality)
- [Configuration & Utility](#configuration--utility)

---

## Prompt Engineering

### `devflow fast`

Quickly improve a prompt using the core COSTAR framework (Context, Objective, Style).

**Usage:**
```bash
devflow fast "<your prompt>" [flags]
```

**Flags:**
- `--costar-only`: Show COSTAR analysis scores without generating an improved prompt.
- `--framework-info`: Display information about the COSTAR framework.

**Example:**
```bash
devflow fast "create a login page"
```

### `devflow deep`

Perform comprehensive deep analysis using the full COSTAR framework (Context, Objective, Style, Tone, Audience, Response).

**Usage:**
```bash
devflow deep "<your prompt>" [flags]
```

**Flags:**
- `--costar-only`: Show detailed analysis metrics without generating an improved prompt.
- `--framework-info`: Display information about the COSTAR framework.

**Example:**
```bash
devflow deep "architect a scalable microservice system"
```

### `devflow summarize`

Analyze a conversation session and extract structured requirements into an optimized prompt.

**Usage:**
```bash
devflow summarize [session-id] [flags]
```

**Flags:**
- `-a, --active`: Summarize the most recent active session.
- `-o, --output <path>`: Specify output directory.
- `--skip-costar`: Skip the COSTAR optimization step (extract raw requirements only).

**Example:**
```bash
devflow summarize --active
```

### `devflow prompts`

Manage saved prompts.

**Usage:**
```bash
devflow prompts list     # List all saved prompts
devflow prompts clear    # Clear saved prompts history
```

---

## Project Management

### `devflow prd`

Generate a Product Requirements Document (PRD).

**Usage:**
```bash
devflow prd [flags]
```

**Flags:**
- `-q, --quick`: Skip Socratic questioning and use quick mode.
- `-p, --project <name>`: Specify project name for organization.
- `-t, --template <path>`: Path to a custom question template file.
- `--skip-validation`: Skip the automatic COSTAR framework validation of the generated PRD.

**Example:**
```bash
devflow prd --quick --project user-auth
```

### `devflow plan`

Generate a task breakdown from a PRD and create GitHub Issues (if configured).

**Usage:**
```bash
devflow plan [flags]
```

**Flags:**
- `--project <name>`: Specify the PRD project name to plan.
- `--session <id>`: Use a specific session ID.
- `--active-session`: Use the currently active session.

**Example:**
```bash
devflow plan --project user-auth
```

---

## Development & Quality

### `devflow implement`

Start the implementation workflow and track progress.

**Usage:**
```bash
devflow implement [flags]
```

**Flags:**
- `--project <name>`: Specify the project to implement.
- `--commit-strategy <strategy>`: Set git commit strategy (`per-task`, `per-phase`, `per-5-tasks`, `none`).

### `devflow task-complete`

Mark a task as complete, update GitHub status, and optionally commit code.

**Usage:**
```bash
devflow task-complete <task-id>
```

**Aliases:** `tc`

**Example:**
```bash
devflow task-complete phase-1-task-1
```

### `devflow audit-check`

Run an AI-powered code audit to check for security, quality, and architectural issues.

**Usage:**
```bash
devflow audit-check [flags]
```
### `devflow init`

Initialize DevFlow in a new project.

**Usage:**
```bash
devflow init
```

### `devflow config`

Manage configuration settings.

**Usage:**
```bash
devflow config [flags]
```

**Flags:**
- `--reset`: Reset configuration to defaults.
- `--agent <name>`: Switch the active AI agent.

### `devflow list`

List all managed PRD projects and their status.

**Usage:**
```bash
devflow list
```

### `devflow show`

Show detailed information about a specific project.

**Usage:**
```bash
devflow show <project-name>
```
