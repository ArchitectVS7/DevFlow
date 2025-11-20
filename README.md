# DevFlow 

*v0.7 Alpha*

**Intelligent workflow automation for modern development teams**

DevFlow transforms how you move from concept to code by automating the entire development lifecycle - from requirements gathering to task tracking to code quality assurance.

---

## What Does DevFlow Do?

DevFlow automates three critical development workflows:

### 1. Requirements → Documentation
Turn rough ideas into structured Product Requirements Documents through AI-guided questioning.

### 2. Documentation → Tasks
Automatically break down PRDs into organized, actionable implementation tasks with phase-based planning.

### 3. Tasks → Delivery
Track implementation progress with automatic git commits and GitHub Project Board synchronization.

---

## Installation

```bash
npm install -g devflow
cd your-project
devflow init
```

---

## Quick Example

```bash
# Generate a PRD for a new feature
devflow prd
> What feature are you building?
> "User authentication system"

# Break it into tasks
devflow plan
# Creates: .devflow/outputs/user-auth/tasks.md
# Also creates GitHub Issues (if configured)

# Start implementing
devflow implement

# Mark tasks complete as you work
devflow task-complete phase-1-task-1
# ✓ Updates tasks.md
# ✓ Creates git commit
# ✓ Updates GitHub Issue
```

---

## Key Features

### 🤖 AI-Powered PRD Generation
Interactive Socratic questioning helps you think through requirements systematically. No more blank page syndrome.

### 📋 Automatic Task Breakdown
Analyzes your PRD and generates a structured implementation plan organized by logical phases.

### 🔗 GitHub Integration
Automatically creates and manages GitHub Issues linked to your tasks. Keep your Project Board in sync effortlessly.

### 🛡️ Automated Code Auditing
LLM-powered code review runs on every push via GitHub Actions, catching issues before they reach production.

### ✅ Progress Tracking
Built-in task completion tracking with automatic git commits. Never lose track of what you've accomplished.

---

## Documentation

**Getting Started:**
- [User Manual](docs/user-manual.md) - Complete walkthrough of all features
- [Configuration](docs/configuration.md) - Setup guide for GitHub and auditing

**Reference:**
- [Commands](docs/commands.md) - All CLI commands explained
- [Architecture](docs/architecture.md) - How DevFlow works under the hood

**[📚 Full Documentation](docs/README.md)**

---

## Configuration Example

`.devflow/config.json`:
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
  },
  "audit": {
    "provider": "openai",
    "apiKeyEnvVar": "OPENAI_API_KEY",
    "model": "gpt-4o"
  }
}
```

---

## Requirements

- Node.js ≥ 18.0.0
- Git (for commit features)
- GitHub token (for GitHub integration - optional)
- OpenAI API key (for code auditing - optional)

---

## Why DevFlow?

**For Solo Developers:**
Stop context-switching between planning tools, task trackers, and your IDE. DevFlow keeps everything in your project directory.

**For Teams:**
Maintain a single source of truth from requirements to implementation. GitHub integration keeps everyone aligned.

**For AI-Assisted Development:**
Works seamlessly with Cursor, Windsurf, Claude Code, and 15+ other AI coding assistants.

---

## License

MIT 

---

## Links

- **Documentation**: [docs/](docs/README.md)
- **Issues**: [github.com/ArchitectVS7/DevFlow/issues](https://github.com/ArchitectVS7/DevFlow/issues)
- **Repository**: [github.com/ArchitectVS7/DevFlow](https://github.com/ArchitectVS7/DevFlow)

