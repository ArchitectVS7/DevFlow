# DevFlow User Manual

Complete guide to using DevFlow for AI-powered development workflow automation.

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Core Workflow](#core-workflow)
4. [Commands](#commands)
5. [GitHub Integration](#github-integration)
6. [Code Auditing](#code-auditing)
7. [Best Practices](#best-practices)

---

## Installation

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** or **yarn**
- **Git** (for version control features)

### Install DevFlow

```bash
npm install -g devflow
```

### Verify Installation

```bash
devflow --version
```

---

## Getting Started

### Initialize Your Project

Navigate to your project directory and run:

```bash
devflow init
```

This will:
1. Create a `.devflow` directory for configuration and outputs
2. Prompt you to select your AI coding assistant(s)
3. Generate configuration files
4. Set up slash commands for your selected AI tools

### Project Structure

After initialization, you'll have:

```
your-project/
├── .devflow/
│   ├── config.json           # Main configuration
│   ├── outputs/              # Generated PRDs and prompts
│   └── tasks/                # Task tracking data
└── ... your project files
```

---

## Core Workflow

DevFlow follows a structured workflow from idea to implementation:

### 1. Generate a PRD

Start by creating a Product Requirements Document:

```bash
devflow prd
```

**Interactive Mode:**
- Answer Socratic questions about your feature
- DevFlow analyzes your responses
- Generates a structured PRD in `.devflow/outputs/`

**Quick Mode:**
```bash
devflow prd --quick
```

### 2. Create Task Plan

Break down your PRD into actionable tasks:

```bash
devflow plan
```

This will:
- Analyze your PRD
- Generate a task breakdown organized by phases
- Create a `tasks.md` file
- (Optional) Create GitHub Issues if configured

**Options:**
```bash
devflow plan --project my-feature    # Specify PRD project
devflow plan --session abc123        # Use specific session
```

### 3. Implement Tasks

Start the implementation workflow:

```bash
devflow implement
```

This command:
- Shows you the task breakdown
- Guides you through implementation
- Tracks progress
- Optionally creates git commits

**Commit Strategies:**
- `per-task` - Commit after each task
- `per-phase` - Commit after completing each phase
- `per-5-tasks` - Commit every 5 tasks
- `none` - No automatic commits

### 4. Complete Tasks

Mark individual tasks as done:

```bash
devflow task-complete phase-1-task-1
```

This will:
- Mark the task as complete in `tasks.md`
- Update progress tracking
- Create a git commit (if configured)
- Update GitHub Issue status (if configured)

---

## Commands

### Core Commands

#### `devflow init`
Initialize DevFlow in your project.

**Usage:**
```bash
devflow init
```

#### `devflow prd`
Generate a Product Requirements Document.

**Usage:**
```bash
devflow prd [--quick] [--output <path>]
```

**Flags:**
- `--quick` - Skip Socratic questioning, use quick mode
- `--output <path>` - Custom output path

#### `devflow plan`
Generate task breakdown from PRD.

**Usage:**
```bash
devflow plan [--project <name>] [--session <id>]
```

**Flags:**
- `--project <name>` - Specify PRD project name
- `--session <id>` - Use specific session
- `--active-session` - Use active session

#### `devflow implement`
Start implementation workflow.

**Usage:**
```bash
devflow implement [--project <name>]
```

#### `devflow task-complete`
Mark a task as complete.

**Usage:**
```bash
devflow task-complete <task-id>
```

**Example:**
```bash
devflow task-complete phase-1-task-1
```

### Utility Commands

#### `devflow config`
Manage configuration.

**Usage:**
```bash
devflow config                    # View current config
devflow config --reset            # Reset to defaults
devflow config --agent <name>     # Change AI agent
```

#### `devflow list`
List PRD projects.

**Usage:**
```bash
devflow list
```

#### `devflow show`
Show project details.

**Usage:**
```bash
devflow show <project-name>
```

#### `devflow audit-check`
Run code audit.

**Usage:**
```bash
devflow audit-check [--diff]
```

**Flags:**
- `--diff` - Audit only git diff (staged + unstaged changes)

---

## GitHub Integration

### Setup

1. **Create a GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a new token with `repo` and `project` scopes
   - Save the token securely

2. **Configure DevFlow**

Edit `.devflow/config.json`:

```json
{
  "projectManagement": {
    "type": "github",
    "githubTokenEnvVar": "GITHUB_TOKEN",
    "projectBoardUrl": "https://github.com/orgs/your-org/projects/1",
    "columnsMap": {
      "NEW": "Todo",
      "IMPLEMENTING": "In Progress",
      "COMPLETE": "Done"
    }
  }
}
```

3. **Set Environment Variable**

```bash
export GITHUB_TOKEN=your_personal_access_token
```

### Usage

Once configured, GitHub integration works automatically:

- **`devflow plan`** creates GitHub Issues for each task
- **`devflow task-complete`** updates Issue status and closes completed issues
- Issues are linked to your local tasks via `.devflow-implement-config.json`

### Column Mapping

The `columnsMap` defines how DevFlow task states map to your Project Board columns:

- `NEW` - Where new tasks are created
- `IMPLEMENTING` - Where active tasks move (future feature)
- `COMPLETE` - Where completed tasks move

---

## Code Auditing

### Setup

1. **Configure Audit Settings**

Edit `.devflow/config.json`:

```json
{
  "audit": {
    "provider": "openai",
    "apiKeyEnvVar": "OPENAI_API_KEY",
    "model": "gpt-4o"
  }
}
```

2. **Set API Key**

```bash
export OPENAI_API_KEY=your_openai_api_key
```

### Manual Audit

Run audit manually:

```bash
# Audit git diff
devflow audit-check --diff

# Audit entire project
devflow audit-check
```

### Automated Audit (GitHub Actions)

DevFlow includes a GitHub Actions workflow for automated auditing:

**`.github/workflows/audit.yml`** runs on every push to main:
- Builds your project
- Runs `devflow audit-check`
- Fails the build if issues are found

The audit checks for:
- Security vulnerabilities
- Architectural anti-patterns
- Missing documentation
- Code quality issues

---

## Best Practices

### PRD Generation

1. **Be Specific**: Provide detailed answers during PRD generation
2. **Include Context**: Mention existing systems and constraints
3. **Define Success**: Clearly state what "done" looks like

### Task Planning

1. **Review Generated Tasks**: Always review the task breakdown before implementing
2. **Adjust Granularity**: Break down large tasks if needed
3. **Use Sessions**: Leverage sessions for complex, multi-stage projects

### Implementation

1. **Follow the Plan**: Stick to the generated task order when possible
2. **Commit Regularly**: Use appropriate commit strategy for your workflow
3. **Track Progress**: Mark tasks complete as you finish them

### GitHub Integration

1. **Consistent Naming**: Use clear, descriptive project names
2. **Column Mapping**: Ensure your Project Board columns match your workflow
3. **Token Security**: Never commit your GitHub token to version control

### Code Auditing

1. **Run Before Push**: Use `--diff` flag to audit changes before committing
2. **Address Issues**: Fix audit findings before merging
3. **Automate**: Set up GitHub Actions for continuous auditing

---

## Troubleshooting

### Common Issues

**"No .devflow/config.json found"**
- Run `devflow init` in your project directory

**"GitHub token not found"**
- Ensure your environment variable is set correctly
- Check the `githubTokenEnvVar` value in config.json

**"Could not determine GitHub repository"**
- Ensure you're in a git repository
- Check that `.git/config` contains a GitHub remote

**"Audit failed: API error"**
- Verify your API key is valid
- Check your API quota/limits

For more help, see the [Troubleshooting Guide](troubleshooting.md) or [open an issue](https://github.com/DevFlowDev/DevFlow/issues).

---

## Next Steps

- [Configuration Guide](configuration.md) - Detailed configuration options
- [Command Reference](commands.md) - Complete command documentation
- [GitHub Integration](github-integration.md) - Advanced GitHub features
- [Architecture](architecture.md) - Technical deep dive

---

[← Back to Documentation Index](README.md) | [Main README](../README.md)
