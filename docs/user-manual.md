# DevFlow User Manual

Welcome to **DevFlow**, your AI-native development companion.

DevFlow isn't just a CLI tool; it's a workflow engine designed to bridge the gap between your ideas and your AI coding assistants. Whether you're using ChatGPT, Claude, or GitHub Copilot, DevFlow helps you craft the perfect prompts, define clear requirements, and manage the implementation process with precision.

## The DevFlow Philosophy

Modern AI development requires a shift in how we approach coding. It's no longer just about writing syntax; it's about **Context**, **Objective**, and **Style**. DevFlow is built around the **COSTAR framework**, an academically-validated method for prompt engineering that ensures your AI agents understand exactly what you need.

- **Context (C)**: What is the background?
- **Objective (O)**: What are we trying to achieve?
- **Style (S)**: How should the output look?
- **Tone (T)**: What is the voice?
- **Audience (A)**: Who is this for?
- **Response (R)**: What is the specific format?

DevFlow integrates this framework directly into your terminal, acting as a quality gate for your thoughts before they reach the AI.

---

## Getting Started

### Installation

Ensure you have Node.js (v18+) installed, then run:

```bash
npm install -g devflow
```

### Initialization

Navigate to your project root and initialize DevFlow. This sets up your configuration and prepares the environment.

```bash
devflow init
```

You'll be prompted to select your preferred AI tools. DevFlow creates a `.devflow` directory to store your project configuration, prompts, and task data.

---

## Workflow 1: The Prompt Engineering Cycle

Before you write a single line of code, you need a clear prompt. DevFlow provides powerful tools to optimize your instructions using the COSTAR framework.

### Quick Optimization (`fast`)

For everyday tasks, use the **Fast Mode**. It focuses on the core triad: **Context, Objective, and Style**.

```bash
devflow fast "create a login page"
```

DevFlow will analyze your raw input, score it against the framework, and generate a significantly improved version. It will tell you if you're missing context or if your objective is vague.

### Deep Analysis (`deep`)

For complex features or architectural decisions, use **Deep Mode**. This activates the full 6-point COSTAR framework, adding **Tone**, **Audience**, and **Response** analysis.

```bash
devflow deep "design a microservices architecture for a video platform"
```

This mode ensures your prompt is robust enough to generate production-grade results from advanced models like GPT-4 or Claude 3.5 Sonnet.

### Summarizing Conversations (`summarize`)

Often, requirements are buried in long chat logs. The `summarize` command ingests a session log and extracts structured requirements, converting them into a clean, COSTAR-optimized prompt.

```bash
devflow summarize --active
```

---

## Workflow 2: From Requirements to Plan

Once your prompt is ready, it's time to formalize it into a project plan.

### Generating a PRD (`prd`)

The Product Requirements Document (PRD) is the blueprint for your feature. DevFlow's `prd` command uses a Socratic questioning engine to interview you about your feature.

```bash
devflow prd
```

It will ask about edge cases, tech stack constraints, and success metrics. The output is a comprehensive Markdown file. Crucially, DevFlow **validates your PRD** against the COSTAR framework to ensure it's "AI-ready."

*Tip: Use `devflow prd --quick` to skip the interview if you already have a clear vision.*

### Creating a Task Plan (`plan`)

With a PRD in hand, generate a step-by-step implementation plan.

```bash
devflow plan
```

DevFlow parses your PRD and breaks it down into atomic, actionable tasks. If you have GitHub integration enabled, it will automatically create **GitHub Issues** for each task and link them to a Project Board.

---

## Workflow 3: Implementation & Audit

Now, you build. DevFlow keeps you focused and ensures quality.

### Implementation Mode (`implement`)

Enter the flow state. This command displays your current task list and tracks your progress.

```bash
devflow implement
```

### Completing Tasks (`task-complete`)

When you finish a task, tell DevFlow.

```bash
devflow task-complete phase-1-task-1
```

This updates your local task list and, if connected, moves the corresponding GitHub Issue to "Done." It can even trigger a git commit automatically.

### Code Auditing (`audit-check`)

Never merge bad code. The audit command uses an LLM to review your changes for security flaws, anti-patterns, and missing documentation.

```bash
# Audit your current changes (staged + unstaged)
devflow audit-check --diff
```

We recommend running this before every commit. You can also set up a GitHub Action to run this automatically on every pull request.

---

## GitHub Integration

DevFlow is designed to work seamlessly with GitHub Projects. By configuring your `GITHUB_TOKEN` and project URL, you turn DevFlow into a headless project manager.

- **Auto-Issue Creation**: `devflow plan` populates your board.
- **Status Sync**: `devflow task-complete` moves cards across columns.
- **Traceability**: Every local task is linked to a remote issue.

To set this up, edit your `.devflow/config.json` and provide your project board details.

---

## Summary of Commands

| Command | Purpose |
|---------|---------|
| `init` | Initialize project configuration |
| `fast` | Quick prompt optimization (C, O, S) |
| `deep` | Deep prompt analysis (Full COSTAR) |
| `summarize` | Convert chat logs to prompts |
| `prd` | Generate requirements document |
| `plan` | Break PRD into tasks & issues |
| `implement` | Track implementation progress |
| `task-complete` | Mark tasks done & sync GitHub |
| `audit-check` | AI code review & security scan |
| `config` | Manage settings |

For a detailed reference of all flags and options, see the [Command Reference](commands.md).
