# Architecture

Technical overview of DevFlow's design and implementation.

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Components](#core-components)
3. [Data Flow](#data-flow)
4. [Directory Structure](#directory-structure)
5. [Key Design Decisions](#key-design-decisions)
6. [Technology Stack](#technology-stack)

---

## System Overview

DevFlow is a CLI tool built with Node.js and TypeScript that bridges the gap between product requirements and implementation through AI-powered automation.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     CLI Interface                        │
│                    (oclif framework)                     │
└──────────────────────┬──────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│   PRD    │    │   Task   │    │  GitHub  │
│Generator │    │ Manager  │    │ Manager  │
└────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │
     │               │               │
     ▼               ▼               ▼
┌─────────────────────────────────────────┐
│         Configuration Manager            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  File System   │
         │  (.devflow/)   │
         └────────────────┘
```

---

## Core Components

### 1. CLI Layer (`src/cli/commands/`)

**Purpose:** User-facing command interface

**Key Files:**
- `init.ts` - Project initialization
- `prd.ts` - PRD generation
- `plan.ts` - Task planning
- `implement.ts` - Implementation workflow
- `task-complete.ts` - Task completion
- `audit-check.ts` - Code auditing

**Framework:** oclif (Open CLI Framework)

### 2. Core Managers (`src/core/`)

#### PRD Generator (`prd-generator.ts`)
**Responsibilities:**
- Socratic questioning for requirements gathering
- PRD document generation
- Template rendering

**Key Methods:**
- `generateFromQuestions()` - Interactive PRD generation
- `generateQuickPrd()` - Rapid PRD creation

#### Task Manager (`task-manager.ts`)
**Responsibilities:**
- PRD analysis
- Task breakdown generation
- Phase organization

**Key Methods:**
- `generateTasksFromPrd()` - Create task breakdown
- `analyzeComplexity()` - Assess task complexity

#### GitHub Manager (`github-manager.ts`)
**Responsibilities:**
- GitHub API integration
- Issue creation and management
- Project board synchronization

**Key Methods:**
- `createIssue()` - Create GitHub Issue
- `updateIssueStatus()` - Update Issue state

#### Config Manager (`config-manager.ts`)
**Responsibilities:**
- Configuration file management
- Implementation state tracking
- Config validation

**Key Methods:**
- `read()` - Load configuration
- `write()` - Save configuration
- `trackCompletion()` - Track task progress

#### Git Manager (`git-manager.ts`)
**Responsibilities:**
- Git operations
- Commit creation
- Diff retrieval

**Key Methods:**
- `createCommit()` - Create git commit
- `getDiff()` - Get git diff

#### LLM Client (`llm-client.ts`)
**Responsibilities:**
- LLM API communication
- Prompt execution
- Response parsing

**Key Methods:**
- `complete()` - Execute LLM prompt

### 3. Type System (`src/types/`)

**Purpose:** TypeScript type definitions

**Key Files:**
- `config.ts` - Configuration interfaces
- `agent.ts` - Agent adapter types
- `errors.ts` - Error types

### 4. Utilities (`src/utils/`)

**Purpose:** Shared utility functions

**Key Files:**
- `file-system.ts` - File operations
- `template-loader.ts` - Template management
- `agent-error-messages.ts` - Error messaging

---

## Data Flow

### PRD Generation Flow

```
User Input
    │
    ▼
PRD Generator
    │
    ├─→ Socratic Questions
    │       │
    │       ▼
    │   User Answers
    │       │
    │       ▼
    └─→ Template Rendering
            │
            ▼
        PRD Document
            │
            ▼
    .devflow/outputs/
```

### Task Planning Flow

```
PRD Document
    │
    ▼
Task Manager
    │
    ├─→ PRD Analysis
    │       │
    │       ▼
    │   Task Extraction
    │       │
    │       ▼
    └─→ Phase Organization
            │
            ▼
        tasks.md
            │
            ├─→ Local Storage
            │
            └─→ GitHub Manager
                    │
                    ▼
                GitHub Issues
```

### Task Completion Flow

```
task-complete <id>
    │
    ▼
Config Manager
    │
    ├─→ Update tasks.md
    │
    ├─→ Track Progress
    │
    ├─→ Git Manager
    │       │
    │       ▼
    │   Git Commit
    │
    └─→ GitHub Manager
            │
            ▼
        Update Issue
```

---

## Directory Structure

### Source Code

```
src/
├── cli/
│   └── commands/          # CLI command implementations
│       ├── init.ts
│       ├── prd.ts
│       ├── plan.ts
│       ├── implement.ts
│       ├── task-complete.ts
│       └── audit-check.ts
├── core/                  # Core business logic
│   ├── prd-generator.ts
│   ├── task-manager.ts
│   ├── github-manager.ts
│   ├── config-manager.ts
│   ├── git-manager.ts
│   ├── llm-client.ts
│   └── adapters/          # AI agent adapters
├── types/                 # TypeScript types
│   ├── config.ts
│   ├── agent.ts
│   └── errors.ts
├── utils/                 # Utility functions
│   ├── file-system.ts
│   └── template-loader.ts
└── templates/             # Handlebars templates
    ├── full-prd-template.hbs
    └── slash-commands/
```

### Runtime Data

```
.devflow/
├── config.json                    # Main configuration
├── outputs/                       # Generated files
│   ├── <project>/
│   │   ├── prd.md
│   │   └── tasks.md
│   └── prompts/                   # Saved prompts
└── sessions/                      # Session data
```

---

## Key Design Decisions

### 1. ESM-First Architecture

**Decision:** Use ES Modules exclusively

**Rationale:**
- Modern JavaScript standard
- Better tree-shaking
- Native TypeScript support
- Future-proof

**Impact:**
- All imports use `.js` extensions
- `type: "module"` in package.json
- Node.js ≥ 18.0.0 required

### 2. oclif Framework

**Decision:** Build on oclif CLI framework

**Rationale:**
- Robust plugin system
- Built-in help generation
- Command organization
- TypeScript support

**Benefits:**
- Consistent CLI UX
- Easy command addition
- Automatic help text

### 3. Handlebars Templates

**Decision:** Use Handlebars for templating

**Rationale:**
- Logic-less templates
- Easy customization
- Wide adoption

**Use Cases:**
- PRD generation
- Slash command generation
- Documentation templates

### 4. Local-First Storage

**Decision:** Store data in `.devflow/` directory

**Rationale:**
- No external dependencies
- Fast access
- Version control friendly
- Privacy-focused

**Trade-offs:**
- No cloud sync
- Manual backup needed

### 5. Optional GitHub Integration

**Decision:** Make GitHub integration opt-in

**Rationale:**
- Not all users need it
- Requires external credentials
- Adds complexity

**Implementation:**
- Check for config before using
- Graceful degradation
- Clear error messages

---

## Technology Stack

### Runtime

- **Node.js** ≥ 18.0.0
- **TypeScript** 5.9.3
- **ES Modules** (ESM)

### Core Dependencies

- **@oclif/core** - CLI framework
- **@octokit/rest** - GitHub API client
- **chalk** - Terminal styling
- **inquirer** - Interactive prompts
- **handlebars** - Template engine
- **fs-extra** - Enhanced file system
- **uuid** - Unique ID generation

### Development

- **Jest** - Testing framework
- **ts-jest** - TypeScript Jest integration
- **ESLint** - Linting
- **Prettier** - Code formatting

### Build

- **TypeScript Compiler** - ES2020 target
- **copyfiles** - Template copying

---

## Extension Points

### 1. Custom Templates

Users can provide custom Handlebars templates:

```json
{
  "templates": {
    "fullPrd": "path/to/custom.hbs"
  }
}
```

### 2. Agent Adapters

New AI coding assistants can be added via adapters:

```typescript
export class CustomAdapter implements AgentAdapter {
  // Implementation
}
```

### 3. LLM Providers

Support for additional LLM providers:

```typescript
interface AuditConfig {
  provider: 'openai' | 'anthropic' | 'gemini';
  // ...
}
```

---

## Performance Considerations

### File I/O

- Async operations throughout
- Minimal file reads
- Efficient JSON parsing

### GitHub API

- Rate limit awareness
- Batch operations where possible
- Error retry logic

### LLM Calls

- Streaming responses (future)
- Context size management
- Cost optimization

---

## Security

### Credentials

- Environment variables for tokens
- No credentials in config files
- Clear documentation on security

### API Keys

- User-managed
- Not stored in code
- Validated before use

### Git Operations

- No automatic force push
- User confirmation for destructive ops
- Safe defaults

---

## Testing Strategy

### Unit Tests

- Core manager logic
- Utility functions
- Type validation

### Integration Tests

- Command workflows
- GitHub integration
- File system operations

### E2E Tests

- Full command execution
- Multi-command workflows

---

## Future Architecture

### Planned Improvements

1. **Plugin System**
   - Third-party extensions
   - Custom commands
   - Community integrations

2. **Cloud Sync**
   - Optional cloud storage
   - Team collaboration
   - Cross-device sync

3. **GraphQL Support**
   - GitHub Projects V2
   - Better project board integration

4. **Streaming LLM**
   - Real-time responses
   - Better UX
   - Cost optimization

---

## Next Steps

- [API Reference](api-reference.md) - Detailed API documentation
- [User Manual](user-manual.md) - Learn how to use DevFlow
- [Configuration Guide](configuration.md) - Configure DevFlow

---

[← Back to Documentation Index](README.md)
