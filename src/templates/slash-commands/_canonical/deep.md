# /devflow:deep - Comprehensive COSTAR Analysis

Full prompt optimization using core COSTAR components (Context, Objective, Style) plus Tone, Audience, and Response.

## Purpose
Analyze and improve prompts using the full COSTAR framework for deep, detailed optimization.

## COSTAR Framework (Deep Mode: C, O, S, T, A, R)

**C = Context**: Background, situation, and constraints
**O = Objective**: Clear goal and what to achieve
**S = Style**: Format, structure, and presentation
**T = Tone**: Voice and formality level
**A = Audience**: Target users and skill level
**R = Response**: Expected output and deliverables

## When to Use Deep Mode
- Complex or critical prompts
- Need comprehensive analysis beyond core components
- Fast mode recommends deep analysis
- Prompt will be reused frequently or integrated into production

## Instructions
When user runs `/devflow:deep "<prompt>"`:
1. **Analyze the prompt** using all six COSTAR components
2. **Score each component** (0-100%)
3. **Generate COSTAR-optimized version**
4. **Show labeled changes** with [C], [O], [S], [T], [A], [R] tags
5. **Provide detailed suggestions** for each component

## Output Structure

### COSTAR Framework Assessment (Deep Mode)

**Scores:**
- Context: [score]% - [brief assessment]
- Objective: [score]% - [brief assessment]
- Style: [score]% - [brief assessment]
- Tone: [score]% - [brief assessment]
- Audience: [score]% - [brief assessment]
- Response: [score]% - [brief assessment]
- **Overall: [score]% ([rating])**

### Component Analyses

**Context (C):**
- Background: [yes/no]
- Constraints: [yes/no]
- Issues: [list]
- Suggestions: [list with [C] labels]

**Objective (O):**
- Goal clarity: [yes/no]
- Measurable: [yes/no]
- Achievable: [yes/no]
- Issues: [list]
- Suggestions: [list with [O] labels]

**Style (S):**
- Format specified: [yes/no]
- Structure defined: [yes/no]
- Presentation clear: [yes/no]
- Issues: [list]
- Suggestions: [list with [S] labels]

**Tone (T):**
- Voice defined: [yes/no]
- Formality level: [formal/casual/technical]
- Issues: [list]
- Suggestions: [list with [T] labels]

**Audience (A):**
- Target users defined: [yes/no]
- Skill level: [beginner/intermediate/advanced]
- Issues: [list]
- Suggestions: [list with [A] labels]

**Response (R):**
- Output format: [yes/no]
- Deliverables: [list]
- Issues: [list]
- Suggestions: [list with [R] labels]

---

### COSTAR-Optimized Prompt

[Improved version with full COSTAR structure applied]

---

### Recommendations

If any component score is below its threshold (Context < 60%, Objective < 60%, Style < 50%, Tone < 60%, Audience < 60%, Response < 60%), consider revising the prompt accordingly.
