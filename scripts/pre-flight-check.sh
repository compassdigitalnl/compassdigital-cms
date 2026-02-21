#!/bin/bash

################################################################################
# Pre-Flight Safety Check
#
# Run this before starting the migration to ensure everything is ready
################################################################################

echo "🔍 Pre-Flight Safety Checklist"
echo "=============================="
echo ""

# Check 1: No uncommitted changes
echo "✓ Checking for uncommitted changes..."
if [[ -n $(git status -s) ]]; then
  echo "❌ FAIL: You have uncommitted changes!"
  echo "   Run: git status"
  echo "   Fix: Commit or stash your changes first"
  exit 1
fi
echo "✅ PASS: Working directory clean"
echo ""

# Check 2: On main/master branch
echo "✓ Checking current branch..."
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
  echo "❌ FAIL: You're on branch '$BRANCH'"
  echo "   Fix: git checkout main"
  exit 1
fi
echo "✅ PASS: On main branch"
echo ""

# Check 3: Build works
echo "✓ Checking if current code builds..."
npm run build > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
  echo "❌ FAIL: Current code doesn't build!"
  echo "   Fix: Fix build errors before migration"
  exit 1
fi
echo "✅ PASS: Build succeeds"
echo ""

# Check 4: Typecheck works
echo "✓ Checking if types are valid..."
npm run typecheck > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
  echo "❌ FAIL: Type errors exist!"
  echo "   Fix: Fix type errors before migration"
  exit 1
fi
echo "✅ PASS: No type errors"
echo ""

# Check 5: Scripts exist
echo "✓ Checking if migration scripts exist..."
if [[ ! -f "scripts/analyze-block-usage.mjs" ]]; then
  echo "❌ FAIL: scripts/analyze-block-usage.mjs not found"
  exit 1
fi
if [[ ! -f "scripts/update-imports.mjs" ]]; then
  echo "❌ FAIL: scripts/update-imports.mjs not found"
  exit 1
fi
echo "✅ PASS: All scripts present"
echo ""

# Check 6: Node modules installed
echo "✓ Checking node_modules..."
if [[ ! -d "node_modules" ]]; then
  echo "❌ FAIL: node_modules not found"
  echo "   Fix: npm install"
  exit 1
fi
echo "✅ PASS: Dependencies installed"
echo ""

# Check 7: Git remote configured
echo "✓ Checking git remote..."
git remote -v > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
  echo "⚠️  WARNING: No git remote configured"
  echo "   Backups won't be pushed to remote"
else
  echo "✅ PASS: Git remote configured"
fi
echo ""

echo "=============================="
echo "🎉 All pre-flight checks passed!"
echo ""
echo "You're ready to start the migration."
echo ""
echo "Next steps:"
echo "  1. Run: ./scripts/migrate-ultra-safe.sh 0    # Backup & analysis"
echo "  2. Review analysis report"
echo "  3. Run: ./scripts/migrate-ultra-safe.sh 1    # Remove deprecated code"
echo "  4. Continue with remaining phases manually"
echo ""
echo "Or read: docs/CLEANUP-QUICK-START.md"
echo ""
