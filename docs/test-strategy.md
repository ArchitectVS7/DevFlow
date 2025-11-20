# Test Strategy for DevFlow

Recommended testing approach for pre-commit, pre-push, and CI workflows.

## Current State

- **Test Directory**: Does not exist (needs creation)
- **Test Framework**: Jest (configured in package.json)
- **Coverage Target**: 70% (configured in jest.config.mjs)
- **Existing CI**: GitHub Actions audit workflow only

---

## Recommended Test Strategy

### Pre-Commit (Fast, Local)

**Goal**: Catch obvious errors before they enter version control  
**Time Budget**: < 10 seconds

**Checks:**
1. **Linting** ✓ (already configured)
   ```bash
   npm run lint
   ```

2. **Type Checking** ✓ (already configured)
   ```bash
   npx tsc --noEmit
   ```

3. **Format Checking**
   ```bash
   npm run format:check
   ```

4. **Unit Tests - Critical Paths Only**
   ```bash
   npm run test:fast
   ```
   - Config validation
   - File path utilities
   - Type guards

**Implementation:**
```bash
# .husky/pre-commit
npm run lint && npx tsc --noEmit && npm run format:check
```

---

### Pre-Push (Moderate, Local)

**Goal**: Ensure code quality before sharing with team  
**Time Budget**: < 2 minutes

**Checks:**
1. **All Pre-Commit Checks**

2. **Unit Tests - Full Suite**
   ```bash
   npm test
   ```
   - All core managers
   - Utilities
   - Type validation

3. **Build Verification**
   ```bash
   npm run build
   ```

**Recommended Test Coverage:**

#### Core Managers (Priority: HIGH)
- `config-manager.ts` - Config read/write/validation
- `task-manager.ts` - Task generation and parsing
- `github-manager.ts` - GitHub API integration
- `git-manager.ts` - Git operations
- `llm-client.ts` - LLM API calls
- `prd-generator.ts` - PRD generation logic

#### Utilities (Priority: MEDIUM)
- `file-system.ts` - File operations
- `template-loader.ts` - Template loading
- `agent-error-messages.ts` - Error formatting

#### Commands (Priority: LOW for pre-push)
- Test in CI instead (slower, integration-heavy)

**Implementation:**
```bash
# .husky/pre-push
npm run lint && npx tsc --noEmit && npm test && npm run build
```

---

### CI (Comprehensive, Remote)

**Goal**: Full validation before merge  
**Time Budget**: < 5 minutes

**Checks:**
1. **All Pre-Push Checks**

2. **Integration Tests**
   - Full command workflows
   - File system operations
   - Multi-command interactions

3. **E2E Tests**
   - Complete user workflows
   - PRD → Plan → Implement → Complete

4. **Coverage Report**
   ```bash
   npm run test:coverage
   ```
   - Enforce 70% threshold
   - Generate coverage report

5. **Build Verification**
   ```bash
   npm run build:prod
   ```

6. **Code Audit** ✓ (already configured)
   ```bash
   devflow audit-check
   ```

**Recommended GitHub Actions Workflow:**

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npx tsc --noEmit
    
    - name: Format check
      run: npm run format:check
    
    - name: Unit tests
      run: npm test
    
    - name: Coverage
      run: npm run test:coverage
    
    - name: Build
      run: npm run build:prod
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/coverage-final.json

  audit:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Run audit
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      run: node bin/devflow.js audit-check --diff
```

---

## Recommended Test Structure

```
tests/
├── unit/                      # Fast, isolated tests
│   ├── core/
│   │   ├── config-manager.test.ts
│   │   ├── task-manager.test.ts
│   │   ├── github-manager.test.ts
│   │   ├── git-manager.test.ts
│   │   ├── llm-client.test.ts
│   │   └── prd-generator.test.ts
│   ├── utils/
│   │   ├── file-system.test.ts
│   │   └── template-loader.test.ts
│   └── types/
│       └── config.test.ts
│
├── integration/               # Multi-component tests
│   ├── prd-workflow.test.ts
│   ├── task-workflow.test.ts
│   └── github-integration.test.ts
│
└── e2e/                       # Full workflow tests
    ├── init-to-plan.test.ts
    └── plan-to-complete.test.ts
```

---

## Priority Test Cases

### Critical (Must Have)

#### ConfigManager
- ✅ Read valid config
- ✅ Write config
- ✅ Validate config schema
- ✅ Migrate legacy config
- ✅ Handle missing config

#### TaskManager
- ✅ Parse PRD into tasks
- ✅ Organize tasks by phase
- ✅ Generate task IDs
- ✅ Handle malformed PRD

#### GitHubManager
- ✅ Create issue
- ✅ Update issue status
- ✅ Handle API errors
- ✅ Parse repo info from git config

#### GitManager
- ✅ Check if git repo
- ✅ Create commit
- ✅ Get diff
- ✅ Handle non-git directory

#### LlmClient
- ✅ Call OpenAI API
- ✅ Handle API errors
- ✅ Parse response
- ✅ Handle missing API key

### Important (Should Have)

#### Commands
- ✅ `init` - Creates directory structure
- ✅ `plan` - Generates tasks from PRD
- ✅ `task-complete` - Updates task status
- ✅ Error handling for all commands

#### File Operations
- ✅ Read/write files safely
- ✅ Create directories
- ✅ Handle permissions errors

### Nice to Have

#### E2E Workflows
- ✅ Complete PRD → Plan → Implement flow
- ✅ GitHub integration end-to-end
- ✅ Audit workflow

---

## Test Scripts to Add

Add to `package.json`:

```json
{
  "scripts": {
    "test": "NODE_OPTIONS=\"--experimental-vm-modules --no-warnings\" jest",
    "test:unit": "npm test -- tests/unit",
    "test:integration": "npm test -- tests/integration",
    "test:e2e": "npm test -- tests/e2e",
    "test:fast": "npm test -- tests/unit --maxWorkers=4",
    "test:watch": "npm test -- --watch",
    "test:coverage": "npm test -- --coverage",
    "test:ci": "npm run test:coverage && npm run build"
  }
}
```

---

## Mock Strategy

### External Dependencies to Mock

1. **GitHub API** (`@octokit/rest`)
   - Mock all API calls
   - Test error scenarios
   - Avoid rate limits

2. **OpenAI API** (fetch calls)
   - Mock fetch globally
   - Test various responses
   - Avoid API costs

3. **File System** (for some tests)
   - Use `memfs` for in-memory FS
   - Faster tests
   - No cleanup needed

4. **Git Commands** (for some tests)
   - Mock `execAsync` calls
   - Test without actual git operations

---

## Coverage Goals

| Component | Target | Priority |
|-----------|--------|----------|
| Core Managers | 80% | HIGH |
| Utilities | 75% | MEDIUM |
| Commands | 60% | MEDIUM |
| Types | 90% | HIGH |
| Overall | 70% | - |

---

## Implementation Steps

1. **Create test directory structure**
   ```bash
   mkdir -p tests/{unit,integration,e2e}/{core,utils,commands}
   ```

2. **Add test utilities**
   ```bash
   mkdir tests/helpers
   # Create mock factories, test fixtures
   ```

3. **Write unit tests for core managers** (Priority 1)
   - Start with `config-manager.test.ts`
   - Then `task-manager.test.ts`
   - Then `github-manager.test.ts`

4. **Set up pre-commit hooks**
   ```bash
   npm install -D husky
   npx husky install
   npx husky add .husky/pre-commit "npm run lint && npx tsc --noEmit"
   npx husky add .husky/pre-push "npm test && npm run build"
   ```

5. **Create CI workflow**
   - Add `.github/workflows/ci.yml`
   - Configure coverage reporting

6. **Write integration tests** (Priority 2)

7. **Write E2E tests** (Priority 3)

---

## Example Test Template

```typescript
// tests/unit/core/config-manager.test.ts
import { ConfigManager } from '../../../src/core/config-manager.js';
import { jest } from '@jest/globals';
import fs from 'fs-extra';

// Mock fs-extra
jest.mock('fs-extra');

describe('ConfigManager', () => {
  let manager: ConfigManager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new ConfigManager();
  });

  describe('read', () => {
    it('should read valid config', async () => {
      const mockConfig = { version: '1.4.0', providers: [] };
      (fs.readJson as jest.Mock).mockResolvedValue(mockConfig);

      const result = await manager.read('.devflow/config.json');

      expect(result).toEqual(mockConfig);
      expect(fs.readJson).toHaveBeenCalledWith('.devflow/config.json');
    });

    it('should throw on missing file', async () => {
      (fs.readJson as jest.Mock).mockRejectedValue(new Error('ENOENT'));

      await expect(manager.read('.devflow/config.json'))
        .rejects.toThrow();
    });
  });
});
```

---

## Next Steps

1. Create `tests/` directory structure
2. Write unit tests for critical components
3. Set up pre-commit hooks
4. Create comprehensive CI workflow
5. Add coverage reporting
6. Document testing guidelines

---

**Estimated Effort:**
- Test infrastructure setup: 2-4 hours
- Unit tests (critical): 8-12 hours
- Integration tests: 4-6 hours
- E2E tests: 4-6 hours
- CI configuration: 2-3 hours

**Total: 20-31 hours**
