# Code Auditing Guide

DevFlow's AI-powered code auditing helps you catch security vulnerabilities, code quality issues, and architectural problems before they reach production. This guide covers setup, usage, and best practices for automated code review.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
4. [Using the Audit Command](#using-the-audit-command)
5. [GitHub Actions Integration](#github-actions-integration)
6. [What Gets Audited](#what-gets-audited)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The `devflow audit-check` command uses Large Language Models (LLMs) to analyze your code changes and provide intelligent feedback on:

- **Security vulnerabilities** (SQL injection, XSS, authentication issues)
- **Code quality** (complexity, readability, maintainability)
- **Architectural concerns** (design patterns, separation of concerns)
- **Best practices** (naming conventions, error handling)
- **Documentation gaps** (missing comments, unclear interfaces)

Unlike traditional linters that check syntax, DevFlow's auditing understands context and can catch logic errors, security flaws, and design issues that static analysis tools miss.

---

## Prerequisites

Before setting up code auditing, you'll need:

1. **DevFlow installed** and initialized in your project
2. **LLM API Key** (currently supports OpenAI; Anthropic and Gemini coming soon)
3. **Git repository** (auditing works by analyzing git diffs)

---

## Configuration

### Step 1: Get an API Key

**For OpenAI:**
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Give it a name (e.g., "DevFlow Audit")
4. Copy the key (starts with `sk-`)

**For Anthropic (Coming Soon):**
- Visit [Anthropic Console](https://console.anthropic.com/)
- Generate an API key

### Step 2: Set Environment Variable

Add your API key to your shell environment:

**For Bash** (`~/.bashrc` or `~/.bash_profile`):
```bash
export OPENAI_API_KEY=sk-your_key_here
```

**For Zsh** (`~/.zshrc`):
```bash
export OPENAI_API_KEY=sk-your_key_here
```

**For current session only:**
```bash
export OPENAI_API_KEY=sk-your_key_here
```

Reload your shell configuration:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Step 3: Configure DevFlow

Add the `audit` section to `.devflow/config.json`:

```json
{
  "version": "1.4.0",
  "audit": {
    "provider": "openai",
    "apiKeyEnvVar": "OPENAI_API_KEY",
    "model": "gpt-4o"
  }
}
```

**Configuration Fields:**

- `provider` - LLM provider (`"openai"`, `"anthropic"`, or `"gemini"`)
- `apiKeyEnvVar` - Name of environment variable containing your API key
- `model` - Model identifier (see [Supported Models](#supported-models))

### Supported Models

**OpenAI:**
- `gpt-4o` - Recommended, best balance of quality and speed
- `gpt-4-turbo` - High quality, slower
- `gpt-3.5-turbo` - Fast and cost-effective, good for simpler checks

**Anthropic (Coming Soon):**
- `claude-3-opus` - Highest quality
- `claude-3-sonnet` - Balanced
- `claude-3-haiku` - Fast and efficient

**Gemini (Coming Soon):**
- `gemini-pro` - Google's flagship model

---

## Using the Audit Command

### Basic Usage

Audit your current uncommitted changes:

```bash
devflow audit-check
```

This analyzes all staged and unstaged changes in your repository.

### Command Options

```bash
devflow audit-check [options]
```

**Common Options:**

- `--diff` - Audit only the current git diff (default behavior)
- `--files <paths>` - Audit specific files
- `--commit <hash>` - Audit a specific commit
- `--branch <name>` - Audit all changes in a branch

### Examples

**Audit staged changes only:**
```bash
git add .
devflow audit-check --diff
```

**Audit specific files:**
```bash
devflow audit-check --files src/auth/login.ts src/utils/validation.ts
```

**Audit a specific commit:**
```bash
devflow audit-check --commit a1b2c3d
```

**Audit all changes in a feature branch:**
```bash
devflow audit-check --branch feature/user-auth
```

### Understanding Audit Output

Audit results are categorized by severity:

**🔴 Critical** - Security vulnerabilities, must fix before merge
- SQL injection vulnerabilities
- Authentication bypasses
- Exposed secrets or credentials

**🟠 High** - Significant issues, should fix soon
- Logic errors with security implications
- Major code quality issues
- Missing error handling

**🟡 Medium** - Important improvements, fix when possible
- Code complexity issues
- Suboptimal patterns
- Documentation gaps

**🟢 Low** - Nice to have improvements
- Style inconsistencies
- Minor refactoring opportunities
- Naming suggestions

**Example Output:**
```
DevFlow Code Audit Results
==========================

🔴 CRITICAL: Potential SQL Injection
File: src/db/queries.ts:45
Issue: User input concatenated directly into SQL query
Suggestion: Use parameterized queries or an ORM

🟠 HIGH: Missing Input Validation
File: src/api/auth.ts:23
Issue: Email field not validated before processing
Suggestion: Add email format validation using a library like validator.js

🟡 MEDIUM: High Cognitive Complexity
File: src/utils/parser.ts:112
Issue: Function has complexity score of 18 (threshold: 10)
Suggestion: Break down into smaller, focused functions

✓ 3 issues found (1 critical, 1 high, 1 medium)
```

---

## GitHub Actions Integration

Automate code auditing on every pull request using GitHub Actions.

### Setup GitHub Actions Workflow

Create `.github/workflows/devflow-audit.yml`:

```yaml
name: DevFlow Code Audit

on:
  pull_request:
    branches: [ main, develop ]

jobs:
  audit:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      with:
        fetch-depth: 0  # Fetch full history for better diffs

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'

    - name: Install DevFlow
      run: npm install -g devflow

    - name: Initialize DevFlow
      run: devflow init --skip-prompts

    - name: Configure Audit
      run: |
        cat > .devflow/config.json << EOF
        {
          "version": "1.4.0",
          "audit": {
            "provider": "openai",
            "apiKeyEnvVar": "OPENAI_API_KEY",
            "model": "gpt-4o"
          }
        }
        EOF

    - name: Run Code Audit
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      run: devflow audit-check --diff

    - name: Comment on PR
      if: failure()
      uses: actions/github-script@v6
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: '⚠️ Code audit found issues. Please review the audit results above.'
          })
```

### Add API Key to GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"**
4. Name: `OPENAI_API_KEY`
5. Value: Your OpenAI API key
6. Click **"Add secret"**

### How It Works

1. Developer creates a pull request
2. GitHub Actions triggers the audit workflow
3. DevFlow analyzes all changes in the PR
4. Results appear in the Actions tab
5. If critical issues are found, the workflow fails and blocks merge (optional)
6. A comment is posted on the PR with audit findings

---

## What Gets Audited

DevFlow's audit analyzes code changes across multiple dimensions:

### Security Analysis

- **Injection Vulnerabilities**: SQL, NoSQL, command injection
- **Cross-Site Scripting (XSS)**: Unsanitized user input in HTML
- **Authentication & Authorization**: Weak or missing auth checks
- **Sensitive Data Exposure**: Credentials, keys, PII in code
- **Insecure Dependencies**: Known vulnerable packages (future)

### Code Quality

- **Cognitive Complexity**: Functions that are too complex
- **Code Duplication**: Repeated logic that should be abstracted
- **Error Handling**: Missing try-catch, unhandled rejections
- **Resource Management**: Unclosed connections, memory leaks
- **Type Safety**: Missing type annotations (TypeScript)

### Architecture & Design

- **Separation of Concerns**: Mixed responsibilities
- **SOLID Principles**: Single Responsibility, Open/Closed, etc.
- **Design Patterns**: Appropriate use of patterns
- **API Design**: RESTful conventions, consistent interfaces
- **Modularity**: Tight coupling, circular dependencies

### Documentation

- **Missing JSDoc/TSDoc**: Undocumented public APIs
- **Unclear Naming**: Vague variable/function names
- **Complex Logic**: Needs explanatory comments
- **README Updates**: Code changes not reflected in docs

---

## Best Practices

### When to Run Audits

**Recommended workflow:**

1. **Before committing** - Catch issues early
   ```bash
   git add .
   devflow audit-check
   git commit -m "Your message"
   ```

2. **Before creating a PR** - Ensure clean code for review
   ```bash
   devflow audit-check --branch feature/my-feature
   ```

3. **During PR review** - Automated via GitHub Actions

4. **After merging** - Periodic audits of main branch

### Pre-Commit Hook Integration

Automate auditing with a pre-commit hook:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
devflow audit-check --diff

if [ $? -ne 0 ]; then
  echo "❌ Code audit failed. Fix issues before committing."
  exit 1
fi
```

Install Husky if not already:
```bash
npm install -D husky
npx husky install
npx husky add .husky/pre-commit "npm run lint && devflow audit-check"
```

### Cost Management

LLM API calls cost money. To optimize costs:

1. **Use efficient models**: `gpt-3.5-turbo` for routine checks, `gpt-4o` for important reviews
2. **Audit diffs, not full files**: Use `--diff` to analyze only changes
3. **Set up CI strategically**: Only run on PRs to main branches, not every commit
4. **Cache results**: DevFlow caches audit results for unchanged files (coming soon)

**Estimated costs (OpenAI):**
- Small PR (100-500 lines): $0.02-0.10
- Medium PR (500-2000 lines): $0.10-0.50
- Large PR (2000+ lines): $0.50-2.00

### Ignoring False Positives

If the auditor flags something incorrectly, you can:

1. **Add explanatory comments** in your code explaining why it's safe
2. **Use inline ignore comments** (coming soon):
   ```typescript
   // devflow-audit-ignore: sql-injection
   const query = buildDynamicQuery(userInput);
   ```
3. **Configure ignore patterns** in `.devflow/config.json` (coming soon)

---

## Troubleshooting

### Issue: "API key not found"

**Symptoms:**
```
Error: OPENAI_API_KEY environment variable not set
```

**Solution:**
1. Set the environment variable: `export OPENAI_API_KEY=sk-your_key`
2. Add to your shell profile for persistence
3. Restart terminal or run `source ~/.bashrc`
4. Verify: `echo $OPENAI_API_KEY`

### Issue: "API rate limit exceeded"

**Symptoms:**
```
Error: Rate limit reached for requests
```

**Solution:**
1. Wait a few minutes for rate limit to reset
2. Check your OpenAI usage dashboard for quota limits
3. Upgrade to a paid plan if on free tier
4. Reduce audit frequency or switch to a smaller model

### Issue: "Audit takes too long"

**Possible causes:**
- Large diff with many files
- Complex code requiring deep analysis
- Slow model (gpt-4)

**Solutions:**
1. Switch to a faster model: `"model": "gpt-3.5-turbo"`
2. Audit specific files instead of entire diff
3. Break large PRs into smaller ones
4. Use `--files` to audit incrementally

### Issue: "No changes detected"

**Symptoms:**
```
No changes to audit. Working directory is clean.
```

**Solution:**
1. Make sure you have uncommitted changes: `git status`
2. Stage your changes if checking staged only: `git add .`
3. Specify files explicitly: `devflow audit-check --files src/file.ts`

### Issue: "API request failed"

**Possible causes:**
- Invalid API key
- Network connectivity issues
- OpenAI service outage

**Solutions:**
1. Verify API key is correct and active
2. Check OpenAI status page: [status.openai.com](https://status.openai.com)
3. Test API key manually:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer $OPENAI_API_KEY"
   ```
4. Check firewall/proxy settings

---

## Security Considerations

### API Key Safety

- **Never commit API keys** to version control
- **Use environment variables** exclusively
- **Rotate keys regularly** (every 90 days recommended)
- **Use separate keys** for different environments (dev, CI, production)

### Data Privacy

When you run `devflow audit-check`, your code is sent to the LLM provider (e.g., OpenAI). Consider:

- **Sensitive code**: Avoid auditing code with secrets, credentials, or proprietary algorithms
- **Compliance requirements**: Ensure LLM usage complies with your organization's policies
- **Private repositories**: OpenAI doesn't train on API data, but review their terms
- **Local LLM option**: Support for local models (Ollama) is planned for privacy-sensitive projects

### Rate Limiting

To prevent abuse and control costs:

- Set up billing alerts in your OpenAI dashboard
- Use environment-specific keys with different rate limits
- Implement budget caps in your LLM provider settings

---

## Advanced Configuration

### Custom Audit Rules (Coming Soon)

Future versions will support custom audit rules:

```json
{
  "audit": {
    "provider": "openai",
    "model": "gpt-4o",
    "rules": {
      "security": ["sql-injection", "xss", "auth"],
      "quality": ["complexity", "duplication"],
      "severity-threshold": "medium"
    }
  }
}
```

### Multiple Models

Use different models for different types of audits:

```json
{
  "audit": {
    "provider": "openai",
    "securityModel": "gpt-4o",
    "qualityModel": "gpt-3.5-turbo"
  }
}
```

---

## Next Steps

- [Configuration Guide](configuration.md) - Full configuration reference
- [GitHub Integration](github-integration.md) - Set up automated workflows
- [Workflow Examples](workflow-examples.md) - See auditing in action
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

---

[← Back to Documentation Index](README.md)
