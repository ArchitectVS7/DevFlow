# Troubleshooting Guide

Common issues, solutions, and debugging tips for DevFlow. If you encounter a problem not listed here, please [open an issue on GitHub](https://github.com/ArchitectVS7/DevFlow/issues).

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Configuration Problems](#configuration-problems)
3. [GitHub Integration Issues](#github-integration-issues)
4. [Code Auditing Issues](#code-auditing-issues)
5. [Command Failures](#command-failures)
6. [Performance Issues](#performance-issues)
7. [File System Errors](#file-system-errors)
8. [Network & API Issues](#network--api-issues)

---

## Installation Issues

### Issue: `npm install -g devflow` fails with permission error

**Symptoms:**
```bash
npm ERR! Error: EACCES: permission denied
```

**Solution 1 - Use Node Version Manager (Recommended):**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 18
nvm use 18

# Install DevFlow (no sudo needed)
npm install -g devflow
```

**Solution 2 - Fix npm permissions:**
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

npm install -g devflow
```

**Solution 3 - Use sudo (Not Recommended):**
```bash
sudo npm install -g devflow
```

### Issue: Command not found after installation

**Symptoms:**
```bash
devflow --version
# bash: devflow: command not found
```

**Solution:**
```bash
# Find where npm installs global packages
npm config get prefix

# Add to PATH (example with /usr/local)
export PATH="/usr/local/bin:$PATH"

# Make permanent
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify
devflow --version
```

### Issue: Node.js version too old

**Symptoms:**
```bash
Error: DevFlow requires Node.js version 18.0.0 or higher
```

**Solution:**
```bash
# Check current version
node --version

# Update using nvm
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version  # Should be 18.x or higher
```

---

## Configuration Problems

### Issue: "Config file not found"

**Symptoms:**
```bash
Error: .devflow/config.json not found
Hint: Run "devflow init" to create it
```

**Solution:**
```bash
# Initialize DevFlow
devflow init

# If init fails, create directory manually
mkdir -p .devflow
devflow init
```

### Issue: Invalid config format

**Symptoms:**
```bash
Error: Invalid configuration format
ValidationError: "version" is required
```

**Solution 1 - Reset to defaults:**
```bash
devflow config --reset
```

**Solution 2 - Manually fix config:**
```bash
# Edit config file
vim .devflow/config.json

# Ensure it has this structure
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

### Issue: Config migration fails

**Symptoms:**
```bash
Error: Failed to migrate config from v1.3.0 to v1.4.0
```

**Solution:**
```bash
# Backup old config
cp .devflow/config.json .devflow/config.json.backup

# Reset config
devflow config --reset

# Manually re-add custom settings from backup
```

### Issue: Template not found

**Symptoms:**
```bash
Error: Template file not found: path/to/custom-template.hbs
```

**Solution:**
```bash
# Check template path
ls path/to/custom-template.hbs

# Use absolute path in config
vim .devflow/config.json
# Change: "fullPrd": "path/to/custom-template.hbs"
# To: "fullPrd": "/absolute/path/to/custom-template.hbs"

# Or use default templates
{
  "templates": {
    "prdQuestions": "default",
    "fullPrd": "default",
    "quickPrd": "default"
  }
}
```

---

## GitHub Integration Issues

### Issue: GitHub token not found

**Symptoms:**
```bash
Error: GITHUB_TOKEN environment variable not set
```

**Solution:**
```bash
# Set for current session
export GITHUB_TOKEN=ghp_your_token_here

# Make permanent (Bash)
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.bashrc
source ~/.bashrc

# Make permanent (Zsh)
echo 'export GITHUB_TOKEN=ghp_your_token_here' >> ~/.zshrc
source ~/.zshrc

# Verify
echo $GITHUB_TOKEN
```

### Issue: "Failed to create GitHub Issue"

**Symptoms:**
```bash
Error: Failed to create issue: 401 Unauthorized
```

**Possible Causes & Solutions:**

**1. Invalid or expired token:**
```bash
# Test token manually
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# If fails, create new token at:
# https://github.com/settings/tokens
```

**2. Missing scopes:**
- Token needs `repo` and `project` scopes
- Regenerate token with correct scopes

**3. Repository access:**
```bash
# Ensure token has access to the repository
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo
```

### Issue: "Project board not found"

**Symptoms:**
```bash
Error: Could not find project board
```

**Solution:**
```bash
# Verify project board URL
# 1. Open your project board in browser
# 2. Copy exact URL
# 3. Update config

vim .devflow/config.json
# Correct formats:
# "projectBoardUrl": "https://github.com/orgs/my-org/projects/1"
# "projectBoardUrl": "https://github.com/users/username/projects/1"
```

### Issue: "Column 'Todo' not found"

**Symptoms:**
```bash
Error: Column 'Todo' does not exist in project board
```

**Solution:**
```bash
# 1. Open project board in browser
# 2. Note EXACT column names (case-sensitive!)
# 3. Update config

vim .devflow/config.json
{
  "columnsMap": {
    "NEW": "To Do",        # Match exactly!
    "IMPLEMENTING": "In Progress",
    "COMPLETE": "Done"
  }
}
```

### Issue: Rate limit exceeded

**Symptoms:**
```bash
Error: API rate limit exceeded
Reset at: 2024-01-20 15:30:00
```

**Solution:**
```bash
# Check rate limit status
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/rate_limit

# Wait for reset or:
# 1. Use a different token
# 2. Reduce API calls (don't run plan repeatedly)
# 3. Upgrade to paid GitHub plan for higher limits
```

---

## Code Auditing Issues

### Issue: "API key not found"

**Symptoms:**
```bash
Error: OPENAI_API_KEY environment variable not set
```

**Solution:**
```bash
# Set API key
export OPENAI_API_KEY=sk-your_key_here

# Make permanent
echo 'export OPENAI_API_KEY=sk-your_key_here' >> ~/.bashrc
source ~/.bashrc

# Verify
echo $OPENAI_API_KEY
```

### Issue: Audit takes too long

**Symptoms:**
- Command hangs for several minutes
- No output or progress indication

**Solutions:**

**1. Use faster model:**
```json
{
  "audit": {
    "provider": "openai",
    "model": "gpt-3.5-turbo"  // Instead of gpt-4o
  }
}
```

**2. Audit smaller diffs:**
```bash
# Instead of auditing entire branch
devflow audit-check --branch feature/big-feature

# Audit specific files
devflow audit-check --files src/changed-file.ts
```

**3. Check network:**
```bash
# Test API connectivity
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Issue: "No changes to audit"

**Symptoms:**
```bash
No changes detected. Working directory is clean.
```

**Solution:**
```bash
# Ensure you have uncommitted changes
git status

# Or specify files explicitly
devflow audit-check --files src/my-file.ts

# Or audit a specific commit
devflow audit-check --commit HEAD~1
```

### Issue: OpenAI API errors

**Symptoms:**
```bash
Error: OpenAI API request failed: 429 Too Many Requests
```

**Solutions:**

**Rate limit:**
```bash
# Wait a few minutes
# Check usage at: https://platform.openai.com/usage

# Upgrade to paid plan for higher limits
```

**Invalid model:**
```bash
# Check available models
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Use correct model name
vim .devflow/config.json
# "model": "gpt-4o"  ✓
# "model": "gpt4"    ✗ (wrong)
```

**Insufficient credits:**
```bash
# Check billing at: https://platform.openai.com/account/billing
# Add payment method or buy credits
```

---

## Command Failures

### Issue: `devflow prd` fails with "No questions found"

**Symptoms:**
```bash
Error: Could not load PRD questions template
```

**Solution:**
```bash
# Ensure templates are installed
npm install -g devflow

# Or reinstall
npm uninstall -g devflow
npm install -g devflow

# Verify templates exist
ls ~/.npm/lib/node_modules/devflow/dist/templates/
```

### Issue: `devflow plan` produces no tasks

**Symptoms:**
```bash
✓ Generated 0 tasks
Warning: PRD may be empty or invalid
```

**Solution:**
```bash
# Check PRD file exists and has content
cat .devflow/outputs/my-project/prd.md

# Ensure PRD is comprehensive
# - Should have multiple sections
# - Should describe requirements clearly
# - Should be at least a few paragraphs

# Regenerate PRD with more detail
devflow prd --project my-project
```

### Issue: `devflow task-complete` fails

**Symptoms:**
```bash
Error: Task 'phase-1-task-999' not found in tasks.md
```

**Solution:**
```bash
# List available tasks
cat .devflow/outputs/my-project/tasks.md

# Use correct task ID (case-sensitive!)
devflow task-complete phase-1-task-1

# If tasks.md is corrupted, regenerate
devflow plan --project my-project
```

### Issue: `devflow implement` shows wrong tasks

**Symptoms:**
- Shows tasks from a different project
- Shows outdated task list

**Solution:**
```bash
# Specify project explicitly
devflow implement --project my-project

# Or delete old implementation config
rm .devflow-implement-config.json
devflow implement --project my-project
```

---

## Performance Issues

### Issue: Commands are slow

**Possible causes and solutions:**

**1. Large PRD files:**
```bash
# Use quick mode for smaller PRDs
devflow prd --quick

# Or break large features into smaller PRDs
devflow prd --project auth-phase1
devflow prd --project auth-phase2
```

**2. Too many tasks:**
```bash
# Generate fewer, larger tasks
# Use maxTasksPerPhase option (future feature)

# Or break into multiple projects
```

**3. Slow LLM API:**
```bash
# Use faster model
{
  "audit": {
    "model": "gpt-3.5-turbo"  // Faster than gpt-4o
  }
}

# Or skip auditing for quick iterations
git commit --no-verify  # Skip pre-commit audit
```

**4. Network latency:**
```bash
# Check network speed
ping api.openai.com
ping api.github.com

# Use local LLM (future feature)
```

---

## File System Errors

### Issue: "Permission denied"

**Symptoms:**
```bash
Error: EACCES: permission denied, mkdir '.devflow'
```

**Solution:**
```bash
# Check directory permissions
ls -la

# Fix permissions
chmod u+w .
mkdir .devflow

# Or run in different directory
cd ~/projects
devflow init
```

### Issue: "Disk full"

**Symptoms:**
```bash
Error: ENOSPC: no space left on device
```

**Solution:**
```bash
# Check disk space
df -h

# Clean up old outputs
rm -rf .devflow/sessions/*
rm -rf .devflow/outputs/old-project

# Clear npm cache
npm cache clean --force
```

### Issue: "File already exists"

**Symptoms:**
```bash
Error: .devflow/outputs/my-project/prd.md already exists
```

**Solution:**
```bash
# Backup and overwrite
mv .devflow/outputs/my-project .devflow/outputs/my-project.backup
devflow prd --project my-project

# Or use --force flag (future feature)
```

---

## Network & API Issues

### Issue: Connection timeout

**Symptoms:**
```bash
Error: Request timeout after 30000ms
```

**Solution:**
```bash
# Check internet connection
ping google.com

# Check firewall/proxy settings
curl https://api.openai.com/v1/models

# Increase timeout (future feature)
```

### Issue: SSL certificate errors

**Symptoms:**
```bash
Error: unable to verify the first certificate
```

**Solution:**
```bash
# Update Node.js
nvm install 18
nvm use 18

# Update npm
npm install -g npm@latest

# Check system certificates
# On Ubuntu/Debian:
sudo apt-get update
sudo apt-get install ca-certificates

# On macOS:
# Update via System Preferences → Software Update
```

### Issue: Proxy configuration

**Symptoms:**
- Commands hang indefinitely
- Connection refused errors

**Solution:**
```bash
# Configure npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Or use environment variables
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080

# Verify
npm config get proxy
```

---

## Debugging Tips

### Enable Verbose Logging

```bash
# Add to config
vim .devflow/config.json
{
  "preferences": {
    "verboseLogging": true
  }
}

# Or use DEBUG environment variable
DEBUG=devflow:* devflow prd
```

### Check DevFlow Version

```bash
devflow --version

# Update to latest
npm update -g devflow

# Check for updates
npm outdated -g devflow
```

### Inspect Configuration

```bash
# View current config
cat .devflow/config.json | jq

# Validate config
devflow config --validate  # (future feature)
```

### Test GitHub Connection

```bash
# Test token
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Test repository access
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/owner/repo
```

### Test OpenAI Connection

```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Test chat completion
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### Clear DevFlow Cache

```bash
# Remove session data
rm -rf .devflow/sessions/*

# Remove old outputs
rm -rf .devflow/outputs/old-project

# Reset config
devflow config --reset

# Reinstall DevFlow
npm uninstall -g devflow
npm install -g devflow
```

---

## Getting More Help

If your issue isn't covered here:

1. **Check existing issues:** [GitHub Issues](https://github.com/ArchitectVS7/DevFlow/issues)
2. **Search documentation:** [Docs Index](README.md)
3. **Open a new issue:** Include:
   - DevFlow version (`devflow --version`)
   - Node.js version (`node --version`)
   - Operating system
   - Full error message
   - Steps to reproduce
4. **Join discussions:** [GitHub Discussions](https://github.com/ArchitectVS7/DevFlow/discussions)

---

## Common Error Codes

| Code | Meaning | Common Solution |
|------|---------|-----------------|
| `CONFIG_NOT_FOUND` | Config file missing | Run `devflow init` |
| `VALIDATION_ERROR` | Invalid configuration | Check config format |
| `INTEGRATION_ERROR` | GitHub/API failure | Check tokens and connectivity |
| `PERMISSION_ERROR` | File system access denied | Check permissions |
| `DATA_ERROR` | File parsing failed | Check file format |
| `EACCES` | Permission denied | Fix file permissions |
| `ENOENT` | File not found | Check file path |
| `ENOSPC` | Disk full | Free up space |

---

## Next Steps

- [User Manual](user-manual.md) - Learn all features
- [Configuration Guide](configuration.md) - Setup reference
- [GitHub Integration](github-integration.md) - GitHub setup
- [Code Auditing](code-auditing.md) - Audit configuration

---

[← Back to Documentation Index](README.md)
