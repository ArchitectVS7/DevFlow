# API Reference

Technical reference for DevFlow's TypeScript interfaces, classes, and core APIs. This guide is intended for developers who want to understand DevFlow's internal architecture or extend its functionality.

---

## Table of Contents

1. [Configuration Types](#configuration-types)
2. [Core Managers](#core-managers)
3. [Agent Integration](#agent-integration)
4. [Error Types](#error-types)
5. [Utility Functions](#utility-functions)

---

## Configuration Types

### `DevFlowConfig`

Main configuration interface for `.devflow/config.json`.

```typescript
interface DevFlowConfig {
  version: string;                              // Config schema version
  providers: string[];                          // AI coding assistants
  templates: TemplateConfig;                    // Template settings
  outputs: OutputConfig;                        // Output paths
  preferences: PreferencesConfig;               // User preferences
  projectManagement?: ProjectManagementConfig;  // GitHub integration
  audit?: AuditConfig;                         // Code auditing
  experimental?: Record<string, unknown>;       // Experimental features
}
```

**Example:**
```typescript
const config: DevFlowConfig = {
  version: '1.4.0',
  providers: ['cursor', 'windsurf'],
  templates: {
    prdQuestions: 'default',
    fullPrd: 'default',
    quickPrd: 'default'
  },
  outputs: {
    path: '.devflow/outputs',
    format: 'markdown'
  },
  preferences: {
    autoOpenOutputs: false,
    verboseLogging: false,
    preserveSessions: true
  }
};
```

### `AuditConfig`

Configuration for AI-powered code auditing.

```typescript
interface AuditConfig {
  provider: 'openai' | 'anthropic' | 'gemini';  // LLM provider
  apiKeyEnvVar: string;                          // Environment variable name
  model: string;                                 // Model identifier
}
```

**Example:**
```typescript
const auditConfig: AuditConfig = {
  provider: 'openai',
  apiKeyEnvVar: 'OPENAI_API_KEY',
  model: 'gpt-4o'
};
```

### `ProjectManagementConfig`

Configuration for GitHub integration.

```typescript
interface ProjectManagementConfig {
  type: 'github';              // Integration type
  githubTokenEnvVar: string;   // Token environment variable
  projectBoardUrl: string;     // Project board URL
  columnsMap: {
    NEW: string;               // Column for new tasks
    IMPLEMENTING: string;      // Column for in-progress tasks
    COMPLETE: string;          // Column for completed tasks
  };
}
```

**Example:**
```typescript
const pmConfig: ProjectManagementConfig = {
  type: 'github',
  githubTokenEnvVar: 'GITHUB_TOKEN',
  projectBoardUrl: 'https://github.com/orgs/my-org/projects/1',
  columnsMap: {
    NEW: 'Todo',
    IMPLEMENTING: 'In Progress',
    COMPLETE: 'Done'
  }
};
```

### `TemplateConfig`

Template file paths for PRD generation.

```typescript
interface TemplateConfig {
  prdQuestions: string;  // Socratic question template
  fullPrd: string;       // Full PRD template
  quickPrd: string;      // Quick PRD template
}
```

**Values:**
- `"default"` - Use built-in templates
- `"path/to/custom.hbs"` - Use custom Handlebars template

### `OutputConfig`

Output directory and format settings.

```typescript
interface OutputConfig {
  path: string;                    // Output directory
  format: 'markdown' | 'pdf';      // Output format
}
```

### `PreferencesConfig`

User preferences and behaviors.

```typescript
interface PreferencesConfig {
  autoOpenOutputs: boolean;      // Auto-open generated files
  verboseLogging: boolean;       // Detailed logging
  preserveSessions: boolean;     // Keep session data
}
```

---

## Core Managers

### `ConfigManager`

Manages implementation configuration and task tracking state.

#### Methods

##### `read(configPath: string): Promise<ImplementConfig>`

Read implementation config from file.

**Parameters:**
- `configPath` - Path to `.devflow-implement-config.json`

**Returns:** `ImplementConfig` object

**Throws:** Error if config file doesn't exist or is invalid

**Example:**
```typescript
const configManager = new ConfigManager();
const config = await configManager.read('.devflow-implement-config.json');
console.log(`Completed: ${config.stats.completed}/${config.stats.total}`);
```

##### `write(configPath: string, config: ImplementConfig, options?: ConfigUpdateOptions): Promise<void>`

Write implementation config to file.

**Parameters:**
- `configPath` - Path to config file
- `config` - Configuration object
- `options` - Update options (merge, validate)

**Example:**
```typescript
await configManager.write('.devflow-implement-config.json', {
  commitStrategy: 'per-task',
  tasksPath: './tasks.md',
  currentTask: task,
  stats: { total: 10, completed: 3, remaining: 7, percentage: 30 },
  timestamp: new Date().toISOString()
});
```

##### `trackCompletion(configPath: string, taskId: string): Promise<void>`

Mark a task as completed in the config.

**Parameters:**
- `configPath` - Path to config file
- `taskId` - Task ID to mark complete

**Example:**
```typescript
await configManager.trackCompletion(
  '.devflow-implement-config.json',
  'phase-1-task-1'
);
```

#### Types

##### `ImplementConfig`

Configuration for task implementation.

```typescript
interface ImplementConfig {
  commitStrategy: CommitStrategy;        // Git commit strategy
  tasksPath: string;                     // Path to tasks.md
  currentTask: Task;                     // Current task
  stats: {
    total: number;
    completed: number;
    remaining: number;
    percentage: number;
  };
  timestamp: string;
  lastCompletedTaskId?: string;
  completedTaskIds?: string[];
  completionTimestamps?: Record<string, string>;
  blockedTasks?: Array<{
    taskId: string;
    reason: string;
    timestamp: string;
  }>;
  resumeCheckpoint?: {
    lastTaskId: string;
    phaseProgress: Record<string, number>;
    sessionStartTime: string;
  };
  githubIssueIds?: Record<string, string>;
}
```

---

### `TaskManager`

Generates and manages implementation tasks from PRD documents.

#### Methods

##### `generateTasksFromPrd(prdPath: string, options?: TaskGenerationOptions): Promise<TaskGenerationResult>`

Generate tasks.md from a PRD file.

**Parameters:**
- `prdPath` - Path to PRD directory
- `options` - Generation options

**Returns:** `TaskGenerationResult`

**Example:**
```typescript
const taskManager = new TaskManager();
const result = await taskManager.generateTasksFromPrd(
  '.devflow/outputs/user-auth',
  { clearMode: 'deep', includeReferences: true }
);

console.log(`Generated ${result.totalTasks} tasks across ${result.phases.length} phases`);
```

##### `readTasks(tasksPath: string): Promise<TaskPhase[]>`

Read and parse tasks.md file.

**Parameters:**
- `tasksPath` - Path to tasks.md

**Returns:** Array of `TaskPhase` objects

**Example:**
```typescript
const phases = await taskManager.readTasks('.devflow/outputs/user-auth/tasks.md');
phases.forEach(phase => {
  console.log(`${phase.name}: ${phase.tasks.length} tasks`);
});
```

##### `updateTaskStatus(tasksPath: string, taskId: string, completed: boolean): Promise<void>`

Update completion status of a task in tasks.md.

**Parameters:**
- `tasksPath` - Path to tasks.md
- `taskId` - Task ID to update
- `completed` - Completion status

**Example:**
```typescript
await taskManager.updateTaskStatus(
  '.devflow/outputs/user-auth/tasks.md',
  'phase-1-task-1',
  true
);
```

#### Types

##### `Task`

Represents a single implementation task.

```typescript
interface Task {
  id: string;              // Unique task ID (e.g., "phase-1-task-1")
  description: string;     // Task description
  phase: string;           // Phase name
  completed: boolean;      // Completion status
  prdReference?: string;   // Optional PRD section reference
}
```

##### `TaskPhase`

Represents a phase/section of tasks.

```typescript
interface TaskPhase {
  name: string;    // Phase name
  tasks: Task[];   // Tasks in this phase
}
```

##### `TaskGenerationOptions`

Options for task generation.

```typescript
interface TaskGenerationOptions {
  maxTasksPerPhase?: number;       // Max tasks per phase
  includeReferences?: boolean;     // Include PRD references
  clearMode?: 'fast' | 'deep';     // COSTAR optimization mode
  source?: PrdSourceType;          // PRD source type
}
```

##### `TaskGenerationResult`

Result of task generation.

```typescript
interface TaskGenerationResult {
  phases: TaskPhase[];                          // Generated phases
  totalTasks: number;                           // Total task count
  outputPath: string;                           // Path to tasks.md
  sourcePath: string;                           // Source PRD path
  sourceType: Exclude<PrdSourceType, 'auto'>;  // PRD type used
}
```

---

### `GitHubManager`

Manages GitHub API integration for issues and project boards.

#### Methods

##### `createIssue(title: string, body: string, labels?: string[]): Promise<number>`

Create a GitHub Issue.

**Parameters:**
- `title` - Issue title
- `body` - Issue description (supports Markdown)
- `labels` - Optional array of label names

**Returns:** Issue number

**Example:**
```typescript
const githubManager = new GitHubManager();
const issueNumber = await githubManager.createIssue(
  'Implement user authentication',
  '## Task Description\n\nCreate JWT-based authentication...',
  ['enhancement', 'backend']
);
console.log(`Created issue #${issueNumber}`);
```

##### `updateIssueStatus(issueNumber: number, status: 'NEW' | 'IMPLEMENTING' | 'COMPLETE'): Promise<void>`

Update issue status on project board.

**Parameters:**
- `issueNumber` - GitHub issue number
- `status` - New status

**Example:**
```typescript
await githubManager.updateIssueStatus(45, 'COMPLETE');
```

##### `linkIssueToProject(issueNumber: number): Promise<void>`

Add issue to configured project board.

**Parameters:**
- `issueNumber` - GitHub issue number

**Example:**
```typescript
await githubManager.linkIssueToProject(45);
```

---

### `GitManager`

Handles git operations and commit management.

#### Methods

##### `isGitRepository(directory?: string): Promise<boolean>`

Check if directory is a git repository.

**Parameters:**
- `directory` - Directory to check (default: current directory)

**Returns:** `true` if git repo, `false` otherwise

**Example:**
```typescript
const gitManager = new GitManager();
if (await gitManager.isGitRepository()) {
  console.log('This is a git repository');
}
```

##### `createCommit(message: string, files?: string[]): Promise<void>`

Create a git commit.

**Parameters:**
- `message` - Commit message
- `files` - Optional array of files to stage (default: all changes)

**Example:**
```typescript
await gitManager.createCommit(
  'Complete: Implement user authentication',
  ['src/auth/', 'tests/auth/']
);
```

##### `getDiff(staged?: boolean): Promise<string>`

Get git diff output.

**Parameters:**
- `staged` - Get staged changes only (default: false)

**Returns:** Diff output as string

**Example:**
```typescript
const diff = await gitManager.getDiff(true);
console.log('Staged changes:', diff);
```

##### `getCurrentBranch(): Promise<string>`

Get current git branch name.

**Returns:** Branch name

**Example:**
```typescript
const branch = await gitManager.getCurrentBranch();
console.log(`On branch: ${branch}`);
```

#### Types

##### `CommitStrategy`

Git commit strategy for task completion.

```typescript
type CommitStrategy =
  | 'per-task'      // Commit after each task
  | 'per-phase'     // Commit after each phase
  | 'per-5-tasks'   // Commit every 5 tasks
  | 'none';         // No automatic commits
```

---

### `PromptOptimizer`

Analyzes and improves prompts using the COSTAR framework.

#### Methods

##### `analyze(prompt: string, mode: 'fast' | 'deep'): Promise<COSTARAnalysis>`

Analyze a prompt and calculate COSTAR scores.

**Parameters:**
- `prompt` - Prompt text to analyze
- `mode` - Analysis mode ('fast' = C,O,S; 'deep' = full COSTAR)

**Returns:** `COSTARAnalysis` object with scores and recommendations

**Example:**
```typescript
const optimizer = new PromptOptimizer();
const analysis = await optimizer.analyze('create a login page', 'fast');

console.log(`Overall Score: ${analysis.overallScore}%`);
console.log(`Context: ${analysis.context.score}%`);
console.log(`Objective: ${analysis.objective.score}%`);
console.log(`Style: ${analysis.style.score}%`);
```

##### `improve(prompt: string, mode: 'fast' | 'deep'): Promise<string>`

Generate an improved version of the prompt.

**Parameters:**
- `prompt` - Original prompt
- `mode` - Optimization mode

**Returns:** Optimized prompt text

**Example:**
```typescript
const improved = await optimizer.improve('fix the bug', 'deep');
console.log(improved);
// Output includes structured COSTAR components
```

##### `calculateCOSTARScore(analysis: COSTARAnalysis, mode: 'fast' | 'deep'): number`

Calculate overall COSTAR score from component scores.

**Parameters:**
- `analysis` - COSTAR analysis object
- `mode` - Mode to determine weighting

**Returns:** Overall score (0-100)

**Example:**
```typescript
const score = optimizer.calculateCOSTARScore(analysis, 'fast');
// Fast mode: C=35%, O=35%, S=30%
// Deep mode: C=20%, O=20%, S=15%, T=15%, A=15%, R=15%
```

---

## Agent Integration

### `AgentAdapter`

Interface for AI coding assistant integrations.

```typescript
interface AgentAdapter {
  name: string;                  // Adapter identifier
  displayName: string;           // Human-readable name
  directory: string;             // Target directory
  fileExtension: string;         // File extension for commands
  features?: ProviderFeatures;   // Optional feature flags

  detectProject(): Promise<boolean>;
  generateCommands(templates: CommandTemplate[]): Promise<void>;
  injectDocumentation(blocks: ManagedBlock[]): Promise<void>;
  getCommandPath(): string;
  getTargetFilename(name: string): string;
  validate?(): Promise<ValidationResult>;
}
```

### `ProviderFeatures`

Feature flags for agent capabilities.

```typescript
interface ProviderFeatures {
  supportsFrontmatter?: boolean;          // YAML frontmatter support
  supportsExecutableCommands?: boolean;   // Executable command blocks
  supportsSubdirectories?: boolean;       // Nested command directories
  argumentPlaceholder?: string;           // Placeholder for arguments
  frontmatterFields?: string[];           // Supported frontmatter fields
}
```

### `CommandTemplate`

Template for slash commands.

```typescript
interface CommandTemplate {
  name: string;          // Command name (e.g., "prd", "plan")
  content: string;       // Command content/instructions
  description: string;   // Command description
}
```

### `AgentType`

Supported AI coding assistants.

```typescript
type AgentType =
  | 'agents-md'
  | 'amp'
  | 'augment'
  | 'claude-code'
  | 'cline'
  | 'codex'
  | 'codebuddy'
  | 'copilot-instructions'
  | 'crush'
  | 'cursor'
  | 'custom'
  | 'droid'
  | 'gemini'
  | 'kilocode'
  | 'octo-md'
  | 'opencode'
  | 'qwen'
  | 'roocode'
  | 'windsurf';
```

---

## Error Types

DevFlow uses custom error classes for better error handling.

### `DevFlowError`

Base error class for all DevFlow errors.

```typescript
class DevFlowError extends Error {
  constructor(
    message: string,
    public readonly hint?: string,
    public readonly code?: string
  );
}
```

**Example:**
```typescript
throw new DevFlowError(
  'Configuration file not found',
  'Run "devflow init" to create it',
  'CONFIG_NOT_FOUND'
);
```

### `ValidationError`

Thrown when validation fails.

```typescript
class ValidationError extends DevFlowError {
  constructor(message: string, hint?: string);
}
```

**Example:**
```typescript
throw new ValidationError(
  'Invalid config version',
  'Expected version 1.4.0 or higher'
);
```

### `IntegrationError`

Thrown when external integration fails.

```typescript
class IntegrationError extends DevFlowError {
  constructor(message: string, hint?: string);
}
```

**Example:**
```typescript
throw new IntegrationError(
  'Failed to create GitHub issue',
  'Check your GITHUB_TOKEN environment variable'
);
```

### `PermissionError`

Thrown when file system permissions are insufficient.

```typescript
class PermissionError extends DevFlowError {
  constructor(message: string, hint?: string);
}
```

### `DataError`

Thrown when data parsing or processing fails.

```typescript
class DataError extends DevFlowError {
  constructor(message: string, hint?: string);
}
```

---

## Utility Functions

### `FileSystem`

File system utilities with error handling.

#### Methods

##### `ensureDir(dirPath: string): Promise<void>`

Ensure directory exists, create if it doesn't.

##### `readFile(filePath: string): Promise<string>`

Read file with UTF-8 encoding.

##### `writeFile(filePath: string, content: string): Promise<void>`

Write file with UTF-8 encoding.

##### `pathExists(path: string): Promise<boolean>`

Check if path exists.

##### `copyFile(src: string, dest: string): Promise<void>`

Copy file from source to destination.

**Example:**
```typescript
import { FileSystem } from './utils/file-system.js';

const fs = new FileSystem();
await fs.ensureDir('.devflow/outputs');
await fs.writeFile('.devflow/outputs/test.md', '# Test');
const exists = await fs.pathExists('.devflow/outputs/test.md');
console.log(exists); // true
```

### `TemplateLoader`

Handlebars template loading and rendering.

#### Methods

##### `loadTemplate(name: string): Promise<HandlebarsTemplateDelegate>`

Load a template by name.

##### `renderTemplate(template: HandlebarsTemplateDelegate, data: object): string`

Render template with data.

**Example:**
```typescript
import { TemplateLoader } from './utils/template-loader.js';

const loader = new TemplateLoader();
const template = await loader.loadTemplate('full-prd-template');
const html = loader.renderTemplate(template, {
  title: 'My Feature',
  description: 'Feature description'
});
```

---

## Type Exports

All types are exported from their respective modules:

```typescript
// Config types
import type {
  DevFlowConfig,
  AuditConfig,
  ProjectManagementConfig,
  TemplateConfig,
  OutputConfig,
  PreferencesConfig
} from './types/config.js';

// Agent types
import type {
  AgentAdapter,
  AgentType,
  CommandTemplate,
  ProviderFeatures
} from './types/agent.js';

// Error types
import {
  DevFlowError,
  ValidationError,
  IntegrationError,
  PermissionError,
  DataError
} from './types/errors.js';

// Task types
import type {
  Task,
  TaskPhase,
  TaskGenerationOptions
} from './core/task-manager.js';

// Config manager types
import type {
  ImplementConfig,
  ConfigUpdateOptions
} from './core/config-manager.js';
```

---

## Next Steps

- [Architecture](architecture.md) - Understand the system design
- [Configuration Guide](configuration.md) - Learn about configuration
- [User Manual](user-manual.md) - Learn how to use DevFlow
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

---

[← Back to Documentation Index](README.md)
