# GitHub Integration Guide

DevFlow integrates seamlessly with GitHub to automate issue tracking, project board management, and code quality workflows. This guide walks you through setting up and using GitHub integration features.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setting Up GitHub Integration](#setting-up-github-integration)
4. [Features](#features)
5. [Workflow Examples](#workflow-examples)
6. [Troubleshooting](#troubleshooting)

---

## Overview

GitHub integration enables DevFlow to:

- **Automatically create GitHub Issues** from your task breakdowns
- **Sync task status** between local files and GitHub Issues
- **Link tasks to Project Boards** for team visibility
- **Trigger automated code audits** via GitHub Actions

This creates a seamless bridge between your local development workflow and your team's project management system.

---

## Prerequisites

Before configuring GitHub integration, ensure you have:

1. **GitHub Account** with access to the target repository
2. **Repository Access** with permissions to create issues and manage projects
3. **Personal Access Token** (PAT) with appropriate scopes
4. **DevFlow Initialized** in your project (`devflow init`)

---

## Setting Up GitHub Integration

### Step 1: Create a Personal Access Token

1. Navigate to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it a descriptive name (e.g., "DevFlow CLI")
4. Select the following scopes:
   - `repo` - Full control of private repositories
   - `project` - Full control of projects
5. Click **"Generate token"**
6. **Copy the token immediately** (you won't see it again!)

### Step 2: Set Environment Variable

Add your token to your shell environment:

**For Bash** (`~/.bashrc` or `~/.bash_profile`):
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

**For Zsh** (`~/.zshrc`):
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

**For current session only:**
```bash
export GITHUB_TOKEN=ghp_your_token_here
```

After adding to your shell config, reload it:
```bash
source ~/.bashrc  # or source ~/.zshrc
```

### Step 3: Configure DevFlow

Edit `.devflow/config.json` in your project:

```json
{
  "version": "1.4.0",
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

**Configuration Fields:**

- `type` - Integration type (currently only `"github"` is supported)
- `githubTokenEnvVar` - Name of the environment variable containing your token
- `projectBoardUrl` - Full URL to your GitHub Project Board
- `columnsMap` - Maps DevFlow task states to your board's column names

**Finding your Project Board URL:**

1. Navigate to your GitHub repository
2. Click the **"Projects"** tab
3. Open your project board
4. Copy the URL from your browser (e.g., `https://github.com/orgs/your-org/projects/1`)

### Step 4: Verify Configuration

Test your setup:

```bash
devflow plan --project test-feature
```

If configured correctly, DevFlow will:
1. Generate tasks from your PRD
2. Create GitHub Issues for each task
3. Display issue URLs in the output

---

## Features

### Automatic Issue Creation

When you run `devflow plan`, DevFlow:

1. **Parses your PRD** into atomic tasks
2. **Creates a GitHub Issue** for each task with:
   - Descriptive title
   - Full task description
   - Labels (optional)
   - Assignment to the project board
3. **Links tasks locally** by storing issue numbers in `tasks.md`

**Example output:**
```bash
$ devflow plan --project user-auth

✓ Generated 12 tasks across 3 phases
✓ Created GitHub Issue #45: "Setup authentication database schema"
✓ Created GitHub Issue #46: "Implement JWT token generation"
✓ Created GitHub Issue #47: "Add login API endpoint"
...
```

### Task Status Synchronization

When you complete a task locally, DevFlow updates GitHub:

```bash
$ devflow task-complete phase-1-task-1

✓ Marked task as complete in tasks.md
✓ Moved GitHub Issue #45 to "Done" column
✓ Created git commit: "Complete: Setup authentication database schema"
```

**What happens:**
1. Local `tasks.md` is updated with `[x]` checkbox
2. GitHub Issue is moved to the "COMPLETE" column on your project board
3. (Optional) Git commit is created with standardized message

### Project Board Management

DevFlow respects your board's column structure through the `columnsMap` configuration:

- `NEW` - Where newly created issues appear (e.g., "Todo", "Backlog")
- `IMPLEMENTING` - For in-progress work (future feature)
- `COMPLETE` - Where finished tasks go (e.g., "Done", "Completed")

**Note:** Column names must match exactly as they appear on your board.

### GitHub Actions Integration

DevFlow includes a workflow template for automated code auditing on pull requests.

**Setup:**

1. Ensure `audit` is configured in `.devflow/config.json`
2. The GitHub Actions workflow (`.github/workflows/devflow-audit.yml`) will run automatically on PRs
3. Audit results appear as PR comments

See the [Code Auditing Guide](code-auditing.md) for details.

---

## Workflow Examples

### Example 1: Full Feature Development with GitHub Sync

```bash
# 1. Generate a PRD
devflow prd --project user-notifications
# Answer the Socratic questions...

# 2. Create task breakdown and GitHub issues
devflow plan --project user-notifications
# ✓ Created 8 GitHub Issues
# ✓ Added to "Todo" column on project board

# 3. Start implementation
devflow implement --project user-notifications
# View your task list and current progress

# 4. Complete first task
# ... do your work ...
devflow task-complete phase-1-task-1
# ✓ Local task marked complete
# ✓ GitHub Issue #78 moved to "Done"
# ✓ Git commit created

# 5. Repeat for remaining tasks
devflow task-complete phase-1-task-2
devflow task-complete phase-1-task-3
```

### Example 2: Using GitHub Issues for Team Coordination

Your team can now:

1. **View all tasks** on the GitHub Project Board
2. **Assign issues** to team members directly in GitHub
3. **Add comments** and discussions to issues
4. **Track progress** visually with board columns

DevFlow keeps local state in sync with GitHub, so your `tasks.md` always reflects the current state.

### Example 3: Manual Issue Management

You can also manage issues directly in GitHub:

- **Move cards** between columns manually
- **Close issues** through the GitHub UI
- **Add labels** for categorization

**Note:** DevFlow currently pushes updates to GitHub but doesn't pull changes. If you modify issues in GitHub, those changes won't sync back to your local `tasks.md` automatically.

---

## Troubleshooting

### Issue: "Failed to create GitHub Issue"

**Possible causes:**
- Invalid or expired token
- Missing `repo` or `project` scopes
- Repository doesn't exist or you lack permissions

**Solution:**
1. Verify token is set: `echo $GITHUB_TOKEN`
2. Check token scopes at [GitHub Settings](https://github.com/settings/tokens)
3. Regenerate token with correct scopes if needed
4. Ensure `GITHUB_TOKEN` environment variable is exported

### Issue: "Project board not found"

**Possible causes:**
- Incorrect `projectBoardUrl` in config
- Token lacks `project` scope
- Project board is in a different organization

**Solution:**
1. Copy the exact URL from your browser when viewing the project board
2. Ensure URL format: `https://github.com/orgs/your-org/projects/1`
3. Verify your token has `project` scope
4. Check that you have access to the project board

### Issue: "Column 'Todo' not found in project board"

**Possible causes:**
- Column name in `columnsMap` doesn't match actual column name
- Typo or case sensitivity issue

**Solution:**
1. Navigate to your project board
2. Note the exact column names (case-sensitive!)
3. Update `columnsMap` in `.devflow/config.json` to match:
   ```json
   "columnsMap": {
     "NEW": "Todo",           // Must match exactly
     "IMPLEMENTING": "In Progress",
     "COMPLETE": "Done"
   }
   ```

### Issue: "GitHub API rate limit exceeded"

**Possible causes:**
- Too many API requests in a short time
- Using a token shared across multiple services

**Solution:**
1. Wait for rate limit to reset (usually 1 hour)
2. Check rate limit status: `curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit`
3. Consider using a dedicated token for DevFlow
4. Reduce frequency of `devflow plan` calls

### Issue: Environment variable not found

**Symptoms:**
```bash
Error: GITHUB_TOKEN environment variable not set
```

**Solution:**
1. Set the variable: `export GITHUB_TOKEN=your_token`
2. Add to shell profile for persistence
3. Restart terminal or run `source ~/.bashrc`
4. Verify with: `echo $GITHUB_TOKEN`

### Issue: Issues created but not appearing on project board

**Possible causes:**
- Project board automation not configured
- Wrong project board URL

**Solution:**
1. Verify the project board URL is correct
2. Check that the project board has automation enabled
3. Manually add the repository to the project board settings
4. Try moving one issue manually to verify column names

---

## Security Best Practices

### Token Storage

- **Never commit tokens** to version control
- **Use environment variables** exclusively
- **Add `.env` to `.gitignore`** if using dotenv
- **Rotate tokens regularly** (every 90 days recommended)

### Token Scopes

Only grant minimum necessary scopes:
- `repo` - For creating issues in private repositories
- `public_repo` - If you only work with public repos
- `project` - For project board management

### Token Revocation

If your token is compromised:
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click **"Delete"** next to the compromised token
3. Generate a new token
4. Update your `GITHUB_TOKEN` environment variable

---

## Advanced Configuration

### Using Different Tokens per Project

You can use different environment variable names for different projects:

**Project A config:**
```json
{
  "projectManagement": {
    "githubTokenEnvVar": "GITHUB_TOKEN_PROJECT_A"
  }
}
```

**Project B config:**
```json
{
  "projectManagement": {
    "githubTokenEnvVar": "GITHUB_TOKEN_PROJECT_B"
  }
}
```

### Custom Issue Templates

Currently, DevFlow uses a standard issue format. Custom templates are planned for future releases.

### Multiple Project Boards

To work with multiple boards, manually edit the `projectBoardUrl` in `.devflow/config.json` before running `devflow plan`.

---

## Next Steps

- [Configuration Guide](configuration.md) - Full configuration reference
- [Code Auditing](code-auditing.md) - Set up automated code review
- [Workflow Examples](workflow-examples.md) - See DevFlow in action
- [Troubleshooting](troubleshooting.md) - Common issues and solutions

---

[← Back to Documentation Index](README.md)
