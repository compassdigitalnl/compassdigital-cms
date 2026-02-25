# TypeScript Error Prevention Strategy

**Last updated:** 25 February 2026
**Current baseline:** 1,483 TypeScript errors
**Target:** Prevent NEW errors, gradually reduce baseline

---

## 🎯 Goal

Prevent the introduction of NEW TypeScript errors while gradually reducing the existing baseline through incremental fixes.

---

## 📊 Current Status

```bash
Total TypeScript errors: 1,483
├── Type errors (non-blocking): ~1,400
├── Missing modules (FIXED): 0
├── Missing exports (FIXED): 0
└── Syntax errors (FIXED): 0
```

**All critical (build-blocking) errors have been resolved!** ✅

---

## 🛡️ Prevention Tools

### 1. **NPM Scripts** (Quick checks)

```bash
# Run TypeScript type-checking (no build)
npm run typecheck

# Watch mode (real-time error detection)
npm run typecheck:watch

# Check if NEW errors were introduced (compares to baseline)
npm run typecheck:errors
```

### 2. **Pre-Commit Validation** (Manual setup)

The error budget script prevents commits with NEW errors:

```bash
# Run before committing
npm run typecheck:errors

# If you FIXED errors, update the baseline:
# The script will tell you the new count and how to update
```

**How it works:**
- Baseline: 1,483 errors (current count)
- If current > baseline: **BLOCKS** commit ❌
- If current < baseline: **ALLOWS** commit + reminds you to update baseline ✅
- If current = baseline: **ALLOWS** commit ✅

### 3. **VS Code Integration** (Recommended)

Enable real-time error checking in VS Code:

**`.vscode/settings.json`:**
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

**Workflow:**
1. Open Problems panel: `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
2. Filter by TypeScript errors
3. Fix errors in real-time as you code

### 4. **CI/CD Integration** (GitHub Actions)

Add TypeScript check to your CI pipeline:

**`.github/workflows/ci.yml`:**
```yaml
- name: TypeScript Check
  run: npm run typecheck:errors
```

This will:
- ✅ Pass if errors ≤ baseline
- ❌ Fail if errors > baseline (prevents merging)

---

## 📉 Reducing the Baseline

### Strategy: Incremental Fixes

**Phase 1: Low-Hanging Fruit** (Quick wins)
- Fix `any` type annotations → Add proper types
- Fix missing return types → Add explicit return types
- Fix obvious type mismatches → Use correct types

**Phase 2: Component-Level Fixes** (Medium effort)
- Pick one component/file at a time
- Fix all errors in that file
- Run tests to verify functionality
- Update baseline after each session

**Phase 3: Architecture Improvements** (Long-term)
- Improve shared type definitions
- Add utility types for common patterns
- Refactor problematic code structures

### Example Workflow

```bash
# 1. Start with current baseline
npm run typecheck:errors
# Output: 1,483 errors

# 2. Fix errors in one file (e.g., src/components/Header.tsx)
code src/components/Header.tsx

# 3. Check progress
npm run typecheck:errors
# Output: 1,470 errors (fixed 13!)

# 4. Update baseline (as instructed by the script)
sed -i '' 's/BASELINE_ERRORS=.*/BASELINE_ERRORS=1470/' scripts/check-typescript-errors.sh

# 5. Commit your work
git add .
git commit -m "fix: resolve 13 TypeScript errors in Header component"
```

---

## 🎓 Common Error Fixes

### 1. **Property does not exist (TS2339)**

```typescript
// ❌ Error
const name = user.name // Property 'name' does not exist

// ✅ Fix 1: Add type assertion
const name = (user as User).name

// ✅ Fix 2: Add optional chaining
const name = user?.name

// ✅ Fix 3: Add proper type
interface UserData {
  name: string
}
const user: UserData = { name: 'John' }
```

### 2. **Type not assignable (TS2322)**

```typescript
// ❌ Error
const id: string = 123 // Type 'number' is not assignable to type 'string'

// ✅ Fix 1: Use correct type
const id: number = 123

// ✅ Fix 2: Convert type
const id: string = String(123)

// ✅ Fix 3: Use union type
const id: string | number = 123
```

### 3. **Implicit any (TS7006)**

```typescript
// ❌ Error
function greet(name) { // Parameter 'name' implicitly has 'any' type
  return `Hello ${name}`
}

// ✅ Fix
function greet(name: string): string {
  return `Hello ${name}`
}
```

### 4. **Missing module (TS2307)**

```typescript
// ❌ Error
import { Button } from './ui/button' // Cannot find module

// ✅ Fix 1: Correct the path
import { Button } from '@/components/ui/button'

// ✅ Fix 2: Create missing index file
// Create: src/components/ui/button/index.ts
export { Button } from './Button'
```

---

## 📈 Tracking Progress

### Weekly Goals

Set a realistic weekly goal for error reduction:

- **Week 1:** Fix 50 errors (reach 1,433)
- **Week 2:** Fix 50 errors (reach 1,383)
- **Week 3:** Fix 100 errors (reach 1,283)
- **Week 4:** Fix 100 errors (reach 1,183)

### Monthly Milestones

- **Month 1:** Reduce to < 1,200 errors
- **Month 2:** Reduce to < 800 errors
- **Month 3:** Reduce to < 400 errors
- **Month 6:** Reach 0 errors! 🎉

### Celebration Checkpoints

- 🥉 **1,000 errors:** Bronze Medal! (33% reduction)
- 🥈 **500 errors:** Silver Medal! (66% reduction)
- 🥇 **0 errors:** Gold Medal! (100% - Type-safe codebase!)

---

## 🚀 Best Practices

### Do's ✅

- ✅ Fix errors incrementally (file by file)
- ✅ Update baseline after each fix session
- ✅ Run `typecheck:errors` before committing
- ✅ Use proper TypeScript types (avoid `any`)
- ✅ Add types for new code from the start
- ✅ Use VS Code Problems panel for real-time feedback

### Don'ts ❌

- ❌ Don't use `@ts-ignore` or `@ts-nocheck` (masks problems)
- ❌ Don't commit NEW errors (use the error budget script)
- ❌ Don't fix too many errors at once (hard to debug)
- ❌ Don't skip updating the baseline after fixes
- ❌ Don't disable strict type-checking
- ❌ Don't use `any` type unless absolutely necessary

---

## 🔧 Maintenance

### Updating the Baseline

After fixing errors, update the baseline:

```bash
# Method 1: Automatic (follow script instructions)
npm run typecheck:errors
# Script will tell you the command to run

# Method 2: Manual
vim scripts/check-typescript-errors.sh
# Change: BASELINE_ERRORS=1483
# To: BASELINE_ERRORS=<new_count>
```

### Monthly Audit

Run a full TypeScript audit once per month:

```bash
# 1. Get detailed error report
npm run typecheck 2>&1 | tee typescript-errors-$(date +%Y-%m-%d).log

# 2. Analyze error distribution
npm run typecheck 2>&1 | grep "error TS" | \
  sed 's/.*error //' | cut -d: -f1 | sort | uniq -c | sort -rn

# 3. Identify high-impact files
npm run typecheck 2>&1 | grep "error TS" | \
  sed 's/(.*//' | sort | uniq -c | sort -rn | head -20
```

---

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Error Messages](https://typescript.tv/errors/)
- [VS Code TypeScript Features](https://code.visualstudio.com/docs/languages/typescript)

---

## 🎯 Success Metrics

Track these metrics over time:

- **Error count trend:** Should decrease weekly
- **New errors rate:** Should be 0 (prevented by error budget)
- **Fix velocity:** Errors fixed per week
- **Code coverage:** % of code with proper types

---

**Remember:** The goal isn't perfection overnight, but consistent progress! 🚀

Fix a few errors each week, and you'll have a fully type-safe codebase in no time.
