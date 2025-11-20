# Configuration Guide

Complete reference for configuring DevFlow.

## Table of Contents

1. [Configuration File](#configuration-file)
2. [Configuration Schema](#configuration-schema)
3. [GitHub Integration](#github-integration)
4. [Code Auditing](#code-auditing)
5. [Templates](#templates)
6. [Preferences](#preferences)
7. [Environment Variables](#environment-variables)

---

## Configuration File

DevFlow stores its configuration in `.devflow/config.json` in your project root.

### Location

```
your-project/
└── .devflow/
    └── config.json
```

### Default Configuration

```json
{
  "version": "1.4.0",
  "providers": [],
  "templates": {
    "prdQuestions": "default",
    "fullPrd": "default",
    "quickPrd": "default"
  },
  "outputs": {
    "path": ".devflow/outputs",
    "format": "markdown"
  },
  "preferences": {
    "autoOpenOutputs": false,
    "verboseLogging": false,
    "preserveSessions": true
  }
}
```

---

## Configuration Schema

### Root Configuration

```typescript
interface DevFlowConfig {
  version: string;                              // Config version
  providers: string[];                          // AI coding assistants
  templates: TemplateConfig;                    // Template settings
  outputs: OutputConfig;                        // Output settings
  preferences: PreferencesConfig;               // User preferences
  projectManagement?: ProjectManagementConfig;  // GitHub integration
  audit?: AuditConfig;                         // Code auditing
  experimental?: Record<string, unknown>;       // Experimental features
}
```

### Template Configuration

```typescript
interface TemplateConfig {
  prdQuestions: string;  // Template for PRD questions
  fullPrd: string;       // Template for full PRD
  quickPrd: string;      // Template for quick PRD
}
```

**Options:**
- `"default"` - Use built-in templates
- Custom path - Use your own templates

### Output Configuration

```typescript
interface OutputConfig {
  path: string;                    // Output directory path
  format: 'markdown' | 'pdf';      // Output format
}
```

**Example:**
```json
{
  "outputs": {
    "path": ".devflow/outputs",
    "format": "markdown"
  }
}
```

### Preferences Configuration

```typescript
interface PreferencesConfig {
  autoOpenOutputs: boolean;      // Auto-open generated files
  verboseLogging: boolean;       // Enable detailed logging
  preserveSessions: boolean;     // Keep session data
}
```

**Example:**
```json
{
  "preferences": {
    "autoOpenOutputs": false,
    "verboseLogging": true,
    "preserveSessions": true
  }
}
```

---

## GitHub Integration

### Configuration

```typescript
interface ProjectManagementConfig {
  type: 'github';
  githubTokenEnvVar: string;
  projectBoardUrl: string;
  columnsMap: {
    NEW: string;
    IMPLEMENTING: string;
    COMPLETE: string;
  };
}
```

### Example

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

### Fields

#### `type`
- **Type:** `'github'`
- **Required:** Yes
- **Description:** Integration type (currently only GitHub is supported)

#### `githubTokenEnvVar`
- **Type:** `string`
- **Required:** Yes
- **Description:** Name of environment variable containing GitHub Personal Access Token
- **Example:** `"GITHUB_TOKEN"`

#### `projectBoardUrl`
- **Type:** `string`
- **Required:** Yes
- **Description:** URL of your GitHub Project Board
- **Example:** `"https://github.com/orgs/your-org/projects/1"`

#### `columnsMap`
- **Type:** `object`
- **Required:** Yes
- **Description:** Maps DevFlow task states to Project Board columns

**Column States:**
- `NEW` - Where new tasks are created
- `IMPLEMENTING` - In-progress tasks (future feature)
- `COMPLETE` - Completed tasks

### Setup Steps

1. **Create GitHub Personal Access Token**
   - Go to: Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `project`
   - Generate and save the token

2. **Add Configuration**
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
   export GITHUB_TOKEN=ghp_your_token_here
   ```

---

## Code Auditing

### Configuration

```typescript
interface AuditConfig {
  provider: 'openai' | 'anthropic' | 'gemini';
  apiKeyEnvVar: string;
  model: string;
}
```

### Example

```json
{
  "audit": {
    "provider": "openai",
    "apiKeyEnvVar": "OPENAI_API_KEY",
    "model": "gpt-4o"
  }
}
```

### Fields

#### `provider`
- **Type:** `'openai' | 'anthropic' | 'gemini'`
- **Required:** Yes
- **Description:** LLM provider for code auditing
- **Options:**
  - `openai` - OpenAI GPT models
  - `anthropic` - Anthropic Claude models (coming soon)
  - `gemini` - Google Gemini models (coming soon)

#### `apiKeyEnvVar`
- **Type:** `string`
- **Required:** Yes
- **Description:** Name of environment variable containing API key
- **Example:** `"OPENAI_API_KEY"`

#### `model`
- **Type:** `string`
- **Required:** Yes
- **Description:** Model identifier
- **Examples:**
  - OpenAI: `"gpt-4o"`, `"gpt-4-turbo"`, `"gpt-3.5-turbo"`

### Setup Steps

1. **Get API Key**
   - OpenAI: https://platform.openai.com/api-keys

2. **Add Configuration**
   ```json
   {
     "audit": {
       "provider": "openai",
       "apiKeyEnvVar": "OPENAI_API_KEY",
       "model": "gpt-4o"
     }
   }
   ```

3. **Set Environment Variable**
   ```bash
   export OPENAI_API_KEY=sk-your-key-here
   ```

---

## Templates

### Template Types

DevFlow uses three template types:

1. **PRD Questions** (`prdQuestions`)
   - Socratic questions for PRD generation
   - Used by `devflow prd` in interactive mode

2. **Full PRD** (`fullPrd`)
   - Complete PRD document template
   - Used for detailed requirements

3. **Quick PRD** (`quickPrd`)
   - Simplified PRD template
   - Used with `devflow prd --quick`

### Using Default Templates

```json
{
  "templates": {
    "prdQuestions": "default",
    "fullPrd": "default",
    "quickPrd": "default"
  }
}
```

### Using Custom Templates

```json
{
  "templates": {
    "prdQuestions": "path/to/custom-questions.hbs",
    "fullPrd": "path/to/custom-prd.hbs",
    "quickPrd": "default"
  }
}
```

**Template Format:** Handlebars (`.hbs`)

---

## Preferences

### Available Preferences

#### `autoOpenOutputs`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Automatically open generated files in default editor

#### `verboseLogging`
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable detailed logging output

#### `preserveSessions`
- **Type:** `boolean`
- **Default:** `true`
- **Description:** Keep session data for multi-stage workflows

### Example

```json
{
  "preferences": {
    "autoOpenOutputs": true,
    "verboseLogging": false,
    "preserveSessions": true
  }
}
```

---

## Environment Variables

### Required for GitHub Integration

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Required for Code Auditing

```bash
export OPENAI_API_KEY=sk-your_key_here
```

### Setting Environment Variables

#### Temporary (Current Session)
```bash
export GITHUB_TOKEN=your_token
```

#### Permanent (Add to Shell Profile)

**Bash** (`~/.bashrc` or `~/.bash_profile`):
```bash
echo 'export GITHUB_TOKEN=your_token' >> ~/.bashrc
source ~/.bashrc
```

**Zsh** (`~/.zshrc`):
```bash
echo 'export GITHUB_TOKEN=your_token' >> ~/.zshrc
source ~/.zshrc
```

#### Using `.env` File (Not Recommended)

While you can use a `.env` file, DevFlow doesn't automatically load it. You'll need to:
1. Install `dotenv-cli`: `npm install -g dotenv-cli`
2. Run commands with: `dotenv devflow plan`

**Security Note:** Never commit `.env` files to version control!

---

## Configuration Management

### View Current Configuration

```bash
devflow config
```

### Reset to Defaults

```bash
devflow config --reset
```

### Change AI Agent

```bash
devflow config --agent cursor
```

---

## Advanced Configuration

### Multiple Providers

```json
{
  "providers": ["cursor", "windsurf", "claude-code"]
}
```

This generates slash commands for all selected providers.

### Experimental Features

```json
{
  "experimental": {
    "featureName": true
  }
}
```

**Note:** Experimental features are subject to change.

---

## Configuration Validation

DevFlow validates your configuration on startup. Common validation errors:

- **Invalid version**: Update to latest config version
- **Missing required fields**: Add required configuration
- **Invalid enum values**: Check allowed values for fields
- **Invalid paths**: Ensure file paths exist

---

## Migration

### From v1.3.0 to v1.4.0

The config format changed from `agent` (single) to `providers` (array):

**Old:**
```json
{
  "agent": "cursor"
}
```

**New:**
```json
{
  "providers": ["cursor"]
}
```

DevFlow automatically migrates old configs on first run.

---

## Next Steps

- [User Manual](user-manual.md) - Learn how to use DevFlow
- [GitHub Integration](github-integration.md) - Detailed GitHub setup
- [Code Auditing](code-auditing.md) - Advanced auditing features

---

[← Back to Documentation Index](README.md)
