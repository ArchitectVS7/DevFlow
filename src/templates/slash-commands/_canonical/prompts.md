---
name: "DevFlow: Prompts"
description: Manage saved prompts (list, clear, inspect)
---

# DevFlow: Prompts Management

Manage your saved fast/deep prompts with lifecycle awareness.

## List All Prompts

```bash
devflow prompts list
```

Shows:
- All saved prompts with age
- Execution status (executed ✓ / pending ○)
- Age warnings (OLD >7d, STALE >30d)
- Storage statistics

## Cleanup Workflows

**After executing prompts (recommended):**
```bash
devflow prompts clear --executed
```

**Remove stale prompts (>30 days):**
```bash
devflow prompts clear --stale
```

**Remove specific type:**
```bash
devflow prompts clear --fast
devflow prompts clear --deep
```

**Interactive cleanup:**
```bash
devflow prompts clear
```

**Remove all (with safety checks):**
```bash
devflow prompts clear --all
```

## Best Practices

**Regular cleanup schedule:**
1. After executing prompts: Clear executed
2. Weekly: Review and clear stale
3. Before archiving PRD: Clear related prompts

**Storage hygiene:**
- Keep <20 active prompts for performance
- Clear executed prompts regularly
- Review prompts >7 days old

**Safety:**
- System warns before deleting unexecuted prompts
- Interactive mode shows what will be deleted
- Prompts are in `.devflow/outputs/prompts/` for manual recovery

## Prompt Lifecycle

```
CREATE   → /devflow:fast or /devflow:deep
REVIEW   → /devflow:prompts (you are here)
EXECUTE  → /devflow:execute
CLEANUP  → /devflow:prompts clear
```

## Common Workflows

**Quick execute (no review):**
```bash
/devflow:fast "task"
/devflow:execute --latest
```

**Review before executing:**
```bash
/devflow:fast "task"
/devflow:prompts              # Review
/devflow:execute              # Select interactively
/devflow:prompts clear --executed
```

**Batch cleanup:**
```bash
/devflow:prompts              # See stats
devflow prompts clear --executed
devflow prompts clear --stale
```
