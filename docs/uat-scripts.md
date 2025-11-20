# User Acceptance Test (UAT) Scripts

This document provides step-by-step scripts for validating the core functionality of DevFlow. These tests are designed to be run manually by a user to ensure the system meets its requirements and provides a good user experience.

---

## Test Scenario 1: The Quick Fix (Beginner)

**Objective:** Verify that the `fast` command can take a vague prompt and significantly improve it using the COSTAR framework (Context, Objective, Style).

**Pre-requisites:**
- DevFlow installed and initialized (`devflow init`).

**Steps:**

1.  **Open Terminal**: Navigate to your project directory.
2.  **Run Command**: Execute the following command with a deliberately vague prompt:
    ```bash
    devflow fast "fix the login bug"
    ```
3.  **Observe Output**:
    - [ ] Check that the system displays a "COSTAR Score" (likely low for this prompt).
    - [ ] Verify that it identifies missing **Context** (e.g., "What login bug?").
    - [ ] Verify that it identifies missing **Style** (e.g., "How should the fix be presented?").
4.  **Review Improved Prompt**:
    - [ ] Check the "Optimized Prompt" section.
    - [ ] Confirm it added placeholders or generic context (e.g., "Context: The user is experiencing an issue with the login flow...").
5.  **Verify Success**:
    - The new prompt should be significantly more detailed and structured than the original 4 words.

---

## Test Scenario 2: The Architect's Blueprint (Intermediate)

**Objective:** Verify that `deep` analysis and `prd` generation work together to create a comprehensive requirement document.

**Pre-requisites:**
- Completed Scenario 1.

**Steps:**

1.  **Deep Analysis**: Run a deep analysis on a feature idea:
    ```bash
    devflow deep "Build a secure user authentication system with 2FA"
    ```
2.  **Observe Deep Output**:
    - [ ] Verify scores for all 6 COSTAR components (Context, Objective, Style, Tone, Audience, Response).
    - [ ] Note the "Audience" analysis (e.g., "Targeting security-conscious users").
3.  **Generate PRD**: Use the refined idea to generate a PRD:
    ```bash
    devflow prd --project user-auth
    ```
4.  **Interactive Interview**:
    - [ ] Answer the Socratic questions presented by the CLI.
    - *Example Q: "Who is the target audience?" -> Answer: "All registered users."*
    - *Example Q: "What are the success metrics?" -> Answer: "99.9% uptime, <100ms response."*
5.  **Verify Output**:
    - [ ] Check `.devflow/outputs/user-auth/prd.md`.
    - [ ] Confirm the PRD contains: Executive Summary, User Stories, and Technical Constraints.
    - [ ] Confirm the PRD was validated against COSTAR (look for the validation score at the end).

---

## Test Scenario 3: The Full Lifecycle (Advanced)

**Objective:** Validate the end-to-end workflow from planning to implementation and task completion.

**Pre-requisites:**
- Completed Scenario 2 (PRD exists for `user-auth`).

**Steps:**

1.  **Generate Plan**: Create a task breakdown from the PRD:
    ```bash
    devflow plan --project user-auth
    ```
2.  **Verify Tasks**:
    - [ ] Check `.devflow/outputs/user-auth/tasks.md`.
    - [ ] Confirm tasks are organized by phases (e.g., "Phase 1: Setup", "Phase 2: Implementation").
3.  **Start Implementation**:
    ```bash
    devflow implement --project user-auth
    ```
4.  **Simulate Work**:
    - [ ] Select the first task (e.g., `phase-1-task-1`) from the list.
    - [ ] The CLI should show the task details.
    - *Action: Create a dummy file or make a small change in your project to simulate work.*
5.  **Complete Task**:
    ```bash
    devflow task-complete phase-1-task-1
    ```
6.  **Verify Completion**:
    - [ ] Check that the task is marked as `[x]` in `tasks.md`.
    - [ ] If git is configured, check `git log` to see if a commit was created automatically.

---

## Pass/Fail Log

| Scenario | Date | Tester | Result (Pass/Fail) | Notes |
|----------|------|--------|-------------------|-------|
| 1. Quick Fix | | | | |
| 2. Architect | | | | |
| 3. Lifecycle | | | | |
