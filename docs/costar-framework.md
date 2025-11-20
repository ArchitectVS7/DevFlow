# COSTAR Framework Specification

## Overview

COSTAR is a prompt engineering framework that structures prompts around six key components: **Context**, **Objective**, **Style**, **Tone**, **Audience**, and **Response**. This document defines how DevFlow implements the COSTAR framework for prompt optimization.

---

## COSTAR Components

### C - Context
**Definition:** Background information, situational details, and constraints that frame the request.

**What to check for:**
- Background/situation setting
- Relevant constraints or requirements
- Prerequisites or dependencies
- Environmental factors
- Scope boundaries

**Analysis criteria:**
- `hasBackground`: Boolean - Does prompt provide situational context?
- `hasConstraints`: Boolean - Are limitations or requirements specified?
- `situationClarity`: Number (0-100%) - How clear is the situation being described?

**Example good context:**
```
You are working on a Node.js TypeScript project using ES modules.
The codebase follows strict ESLint rules and uses Jest for testing.
```

### O - Objective
**Definition:** Clear, specific goal or desired outcome of the prompt.

**What to check for:**
- Explicit goal statement
- Measurable success criteria
- Achievability within scope
- Single, focused objective

**Analysis criteria:**
- `goalClarity`: Boolean - Is there a clear goal statement?
- `measurable`: Boolean - Can success be measured?
- `achievable`: Boolean - Is the goal realistic?
- `clarityScore`: Number (0-100%) - How clear is the objective?

**Example good objective:**
```
Create a TypeScript interface that represents a user profile
with validation for email and phone number fields.
```

### S - Style
**Definition:** Format, structure, and presentation requirements for the output.

**What to check for:**
- Output format specification (markdown, JSON, code, etc.)
- Structure requirements (sections, headings, organization)
- Presentation guidelines (bullet points, numbered lists, etc.)
- Code style preferences

**Analysis criteria:**
- `formatSpecified`: Boolean - Is output format defined?
- `structureDefined`: Boolean - Is structure/organization specified?
- `presentationClear`: Boolean - Are presentation preferences clear?
- `styleScore`: Number (0-100%) - How well-defined is the style?

**Example good style:**
```
Provide the solution as:
1. TypeScript interface code block
2. Usage example
3. Bullet-point list of validation rules
```

### T - Tone (Deep Mode Only)
**Definition:** Voice, formality level, and communication style.

**What to check for:**
- Tone specification (professional, casual, technical, friendly)
- Voice consistency requirements
- Formality level (formal, informal, neutral)
- Communication style preferences

**Analysis criteria:**
- `toneSpecified`: Boolean - Is desired tone mentioned?
- `voiceConsistency`: Boolean - Is consistent voice requested?
- `formalityLevel`: Enum - 'formal' | 'casual' | 'technical' | 'unspecified'
- `toneScore`: Number (0-100%) - How clear is the tone requirement?

**Example good tone:**
```
Use a professional, technical tone appropriate for senior developers.
Avoid overly casual language or unnecessary pleasantries.
```

### A - Audience (Deep Mode Only)
**Definition:** Target user(s), their skill level, and specific needs.

**What to check for:**
- Audience identification (who will use this?)
- Skill level specification (beginner, intermediate, expert)
- Domain knowledge assumptions
- Specific audience needs or constraints

**Analysis criteria:**
- `audienceSpecified`: Boolean - Is target audience defined?
- `skillLevelDefined`: Boolean - Is expertise level mentioned?
- `needsAddressed`: Boolean - Are audience-specific needs considered?
- `audienceScore`: Number (0-100%) - How well-defined is the audience?

**Example good audience:**
```
Target audience: Senior TypeScript developers familiar with
functional programming concepts and Node.js best practices.
```

### R - Response (Deep Mode Only)
**Definition:** Expected output format, deliverables, and examples.

**What to check for:**
- Output format clarity
- Deliverables list
- Example outputs
- Validation criteria
- Success indicators

**Analysis criteria:**
- `outputFormatClear`: Boolean - Is response format specified?
- `deliverablesSpecified`: Boolean - Are deliverables listed?
- `examplesProvided`: Boolean - Are examples given?
- `responseScore`: Number (0-100%) - How clear are response expectations?

**Example good response:**
```
Expected deliverables:
- Complete TypeScript interface definition
- JSDoc comments for all properties
- 2-3 usage examples
- Unit test skeleton
```

---

## Mode System

### Fast Mode (C, O, S)
**Use case:** Quick optimization for common prompts

**Components analyzed:**
- Context (C) - 35% weight
- Objective (O) - 35% weight
- Style (S) - 30% weight

**Scoring formula:**
```
overall = (C × 0.35) + (O × 0.35) + (S × 0.30)
```

**Output:** Optimized prompt with C, O, S enhancements + recommendation for deep mode if needed

### Deep Mode (C, O, S, T, A, R)
**Use case:** Comprehensive optimization for complex or critical prompts

**Components analyzed:**
- Context (C) - 20% weight
- Objective (O) - 20% weight
- Style (S) - 15% weight
- Tone (T) - 15% weight
- Audience (A) - 15% weight
- Response (R) - 15% weight

**Scoring formula:**
```
overall = (C × 0.20) + (O × 0.20) + (S × 0.15) + (T × 0.15) + (A × 0.15) + (R × 0.15)
```

**Output:** Fully optimized prompt with all 6 COSTAR components + detailed analysis

---

## Scoring System

### Component Scores
Each component is scored 0-100% based on:
- Presence of required elements
- Clarity and specificity
- Completeness

### Overall Score Calculation
Weighted average of all component scores (weights depend on mode)

### Rating Categories
- **Excellent**: 80-100% - Prompt is well-structured with all components clearly defined
- **Good**: 60-79% - Prompt is solid but has room for improvement
- **Needs Improvement**: 40-59% - Prompt lacks several key components
- **Poor**: 0-39% - Prompt is unclear or missing critical elements

---

## Triage Logic

### When to Recommend Deep Mode

Fast mode recommends escalation to deep mode if:

1. **Context score < 60%**: Prompt lacks sufficient background information
2. **Objective score < 60%**: Goal is unclear or poorly defined
3. **Style score < 50%**: Output format/structure is not specified

**Recommendation message:**
```
💡 Deep mode recommended for comprehensive analysis including:
   - Tone specification
   - Audience definition
   - Response format details
```

---

## Prompt Generation Strategy

### COSTAR-Optimized Prompt Structure

```markdown
## CONTEXT
[Background, situation, constraints]

## OBJECTIVE
[Clear goal statement]

## STYLE
[Format and structure requirements]

## TONE (Deep mode only)
[Voice and formality guidance]

## AUDIENCE (Deep mode only)
[Target user and skill level]

## RESPONSE (Deep mode only)
[Expected deliverables and format]

---

[Original prompt content with enhancements]
```

### Change Labeling

All improvements are labeled with COSTAR component tags:
- `[C]` - Context enhancement
- `[O]` - Objective clarification
- `[S]` - Style specification
- `[T]` - Tone guidance
- `[A]` - Audience definition
- `[R]` - Response format

---

## Implementation Notes

### Fast Mode Analysis Methods
```typescript
analyzeContext(prompt: string): ContextAnalysis
analyzeObjective(prompt: string): ObjectiveAnalysis
analyzeStyle(prompt: string): StyleAnalysis
```

### Deep Mode Additional Methods
```typescript
analyzeTone(prompt: string): ToneAnalysis
analyzeAudience(prompt: string): AudienceAnalysis
analyzeResponse(prompt: string): ResponseAnalysis
```

### Pattern Detection

**Context indicators:**
- "You are..." / "You're working on..."
- "Given that..." / "Considering..."
- "The project uses..." / "Requirements include..."
- "Constraints:" / "Limitations:"

**Objective indicators:**
- "Create..." / "Generate..." / "Build..."
- "Goal:" / "Objective:" / "Purpose:"
- "I want..." / "I need..."
- Question format (What/How/Why)

**Style indicators:**
- "Format:" / "Structure:" / "Present as:"
- "Use [format]" (markdown, JSON, code)
- "Include:" / "Organize with:"
- Code block specifications

**Tone indicators:**
- "Tone:" / "Voice:" / "Style:"
- "Professional" / "Casual" / "Technical"
- "Formal" / "Informal" / "Friendly"

**Audience indicators:**
- "For [audience]" / "Target:"
- "Beginner" / "Intermediate" / "Expert" / "Senior"
- "Assumes knowledge of..."
- "Explain like..." / "Level:"

**Response indicators:**
- "Deliverables:" / "Output:" / "Expected:"
- "Include:" / "Provide:" / "Return:"
- "Example:" / "Sample:"
- File format specifications

---

## Migration from CLEAR

### CLEAR → COSTAR Mapping

| CLEAR Component | COSTAR Equivalent | Notes |
|----------------|------------------|-------|
| C - Concise | *(No direct equivalent)* | COSTAR focuses on completeness over brevity |
| L - Logical | O - Objective | Both emphasize clear structure, but Objective is more goal-focused |
| E - Explicit | S + T + R | Explicit specifications split across Style, Tone, Response |
| A - Adaptive | *(No direct equivalent)* | COSTAR doesn't emphasize alternative phrasings |
| R - Reflective | *(No direct equivalent)* | COSTAR focuses on upfront clarity vs. post-analysis |
| *(New)* | C - Context | New emphasis on background and constraints |
| *(New)* | A - Audience | New emphasis on user-centric design |

### Key Philosophy Differences

**CLEAR Philosophy:**
- Remove verbosity and pleasantries
- Ensure logical flow
- Make specifications explicit
- Consider alternatives
- Validate comprehensiveness

**COSTAR Philosophy:**
- Provide rich context upfront
- Define clear objectives
- Specify audience and tone
- Set response expectations
- Design for the intended user

---

## References

- Based on Gemini migration guide for COSTAR framework
- Implemented in DevFlow v0.7.0+
- Replaces COSTAR framework (Dr. Leo Lo, University of New Mexico)

---

Last updated: 2025-11-19
