# /devflow:fast - Fast COSTAR Optimization

Quick prompt optimization using core COSTAR components (Context, Objective, Style).

## Purpose
Analyze and improve prompts using the COSTAR framework's core components for rapid optimization.

## COSTAR Framework (Fast Mode: C, O, S)

**C = Context**: Background, situation, and constraints
**O = Objective**: Clear goal and what to achieve
**S = Style**: Format, structure, and presentation

## When to Use Fast vs Deep Mode

**Use Fast Mode when:**
- You need quick prompt improvements
- Prompt is relatively straightforward
- Time is limited
- Core structure (Context, Objective, Style) needs work

**Use Deep Mode when:**
- Prompt is complex or critical
- You need comprehensive analysis including Tone, Audience, Response
- Fast mode recommends deep analysis
- Prompt will be reused frequently

## Instructions
When user runs `/devflow:fast "<prompt>"`:
1. **Analyze the prompt** using COSTAR fast mode (C, O, S components)
2. **Score each component** (0-100%)
3. **Generate COSTAR-optimized version**
4. **Show labeled changes** with [C], [O], [S] tags
5. **Perform smart triage** - recommend deep mode if needed

## Output Structure

### COSTAR Framework Assessment (Fast Mode)

**Scores:**
- Context: [score]% - [brief assessment]
- Objective: [score]% - [brief assessment]
- Style: [score]% - [brief assessment]
- **Overall: [score]% ([rating])**

**Component Analysis:**

**Context (C):**
- Has background: [yes/no]
- Has constraints: [yes/no]
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

---

### COSTAR-Optimized Prompt

[Improved version with COSTAR structure applied]

---

### Recommendations

**If Context < 60% OR Objective < 60% OR Style < 50%:**
💡 **Deep mode recommended** for comprehensive analysis including:
- **Tone** (T): Voice and formalism level
- **Audience** (A): Target users and skill level
- **Response** (R): Expected output and deliverables

Run: `/devflow:deep "<prompt>"`
