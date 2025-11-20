---
name: "DevFlow: Execute"
description: Execute saved prompts from fast/deep optimization
---

# DevFlow: Execute Saved Prompts

Implement optimized prompts from `/devflow:fast` or `/devflow:deep`.

Prompts are automatically saved to `.devflow/outputs/prompts/fast/` or `.devflow/outputs/prompts/deep/`.

## Prerequisites

Save a prompt first:
```bash
/devflow:fast "your prompt"
# or
/devflow:deep "your prompt"
```

## Usage

**Execute latest prompt (recommended):**
```bash
devflow execute --latest
```

**Execute latest fast/deep:**
```bash
devflow execute --latest --fast
devflow execute --latest --deep
```

**Interactive selection:**
```bash
devflow execute
```

**Execute specific prompt:**
```bash
devflow execute --id <prompt-id>
```

## Agent Workflow

1. Run `devflow execute --latest`
2. Read displayed prompt content
3. Implement requirements
4. Cleanup: `/devflow:prompts clear`

## Prompt Management

**List all saved prompts:**
```bash
devflow prompts list
```

**Clear executed prompts:**
```bash
devflow prompts clear --executed
```

**Clear all fast/deep prompts:**
```bash
devflow prompts clear --fast
devflow prompts clear --deep
```

## Error Recovery

**No prompts found:**
```bash
/devflow:fast "your requirement"
```
Then retry `/devflow:execute`.

**Too many old prompts:**
```bash
devflow prompts clear --executed
```
