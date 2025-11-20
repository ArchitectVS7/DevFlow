# DevFlow Workflows for GitHub Copilot

These instructions enhance GitHub Copilot's understanding of the DevFlow prompt engineering framework and workflow commands available in this project.

## About DevFlow

DevFlow is a CLEAR Framework-validated prompt engineering toolkit that helps improve prompts, generate PRDs, and manage implementation workflows. The CLEAR Framework (Concise, Logical, Explicit, Adaptive, Reflective) is an academically-validated approach developed by Dr. Leo Lo at the University of New Mexico.

## Available Commands

When working with this project, you can use the following DevFlow commands:

### Prompt Improvement
- `devflow fast "<prompt>"` - Quick CLEAR analysis (C/L/E components) with improved prompt output. CLI auto-saves; slash commands require manual saving per template instructions.
- `devflow deep "<prompt>"` - Comprehensive CLEAR analysis (all 5 components: C/L/E/A/R) with alternatives and validation. CLI auto-saves; slash commands require manual saving per template instructions.

### Strategic Planning
- `devflow prd` - Interactive PRD generation through Socratic questioning
- `devflow plan` - Transform PRDs into phase-based implementation tasks
- `devflow implement [--commit-strategy=<type>]` - Execute tasks with progress tracking (git: per-task, per-5-tasks, per-phase, none [default])
- `devflow task-complete <taskId>` - Mark task as completed with validation and optional git commit

### Conversational Workflows
- `devflow start` - Begin conversational session for requirements gathering
- `devflow summarize [session-id]` - Extract mini-PRD and optimized prompts from sessions

### Project Management
- `devflow list` - List sessions and output projects
- `devflow show [session-id]` - Inspect session or project details
- `devflow archive [project]` - Archive or restore completed projects
- `devflow update` - Refresh DevFlow documentation and commands

### Prompt Lifecycle Management (v2.7+)
DevFlow now automatically saves optimized prompts from fast/deep commands for later execution:

- `devflow execute [--latest]` - Execute saved prompts from fast/deep optimization
  - Interactive selection from saved prompts
  - `--latest` flag for most recent prompt
  - `--fast` / `--deep` filters with `--latest`
  - `--id <prompt-id>` for specific prompt execution

- `devflow prompts list` - View all saved prompts with lifecycle status
  - Status indicators: NEW, EXECUTED, OLD (>7 days), STALE (>30 days)
  - Storage statistics dashboard
  - Age warnings and hygiene recommendations

- `devflow prompts clear` - Manage prompt cleanup with safety checks
  - `--executed` - Clear executed prompts only (safe cleanup)
  - `--stale` - Clear prompts >30 days old
  - `--fast` - Clear fast mode prompts
  - `--deep` - Clear deep mode prompts
  - `--all` - Clear all prompts (with confirmation)
  - `--force` - Skip confirmation prompts

**Prompt Lifecycle Workflow:**
1. Optimize: `devflow fast/deep "<prompt>"` → CLI auto-saves; slash commands require manual saving
2. Review: `devflow prompts list` → View all saved prompts with status
3. Execute: `devflow execute --latest` → Implement when ready
4. Cleanup: `devflow prompts clear --executed` → Remove completed prompts

## Workflow Patterns

### Quick Prompt Improvement
1. User provides a rough prompt
2. Run `devflow fast "<prompt>"` for quick CLEAR-validated improvements
3. Use the optimized prompt for better results

### Comprehensive Prompt Analysis
1. User has a complex requirement
2. Run `devflow deep "<prompt>"` for full CLEAR analysis
3. Review alternative variations and validation checklists
4. Select the best approach

### Strategic Project Planning
1. Run `devflow prd` to generate a comprehensive PRD through guided questions
2. Run `devflow plan` to break down the PRD into implementation tasks
3. Run `devflow implement` to execute tasks systematically
4. Archive completed work with `devflow archive`

### Conversational Requirements Gathering
1. Run `devflow start` to begin capturing a conversation
2. Discuss requirements naturally with the user
3. Run `devflow summarize` to extract structured requirements and prompts

## CLEAR Framework Components

When analyzing or improving prompts, apply these CLEAR Framework principles:

- **[C] Concise**: Remove verbosity, pleasantries, unnecessary qualifiers
- **[L] Logical**: Ensure coherent sequencing (context → requirements → constraints → output)
- **[E] Explicit**: Add clear specifications for persona, format, tone, success criteria
- **[A] Adaptive**: Provide alternative phrasings and flexible structures
- **[R] Reflective**: Include validation checklists and quality criteria

## Output Locations

DevFlow stores artifacts in the `.devflow/` directory:
- `.devflow/outputs/<project>/` - PRDs, tasks, and optimized prompts
- `.devflow/sessions/` - Captured conversational sessions
- `.devflow/templates/` - Custom template overrides
- `.devflow/config.json` - Project configuration

## Best Practices

1. **Start with the right mode**: Use fast mode for simple prompts, deep mode for complex requirements, and PRD mode for strategic planning
2. **Leverage CLEAR Framework**: Always consider the 5 CLEAR components when crafting prompts
3. **Document requirements**: Use PRD workflow for significant features to ensure clear requirements
4. **Track progress**: Use implement command to maintain structured task execution
5. **Archive completed work**: Keep project organized by archiving finished projects

## Integration with GitHub Copilot

When users ask for help with prompts or requirements:
1. Suggest running the appropriate DevFlow command
2. Explain the expected output and benefits
3. Help interpret DevFlow-generated outputs
4. Apply CLEAR Framework principles in your responses

This integration makes GitHub Copilot aware of DevFlow workflows and can suggest using DevFlow commands when appropriate.
