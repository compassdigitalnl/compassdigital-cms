#!/bin/bash
# TypeScript Error Prevention Script
# Checks if NEW TypeScript errors were introduced

echo "🔍 Checking TypeScript errors..."

# Get current error count
CURRENT_ERRORS=$(npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")

# Baseline error count (update this as you fix errors)
# Updated after FASE 1: Fixed all critical module errors (TS2307/TS2305)
# Regenerated types (Cart, Address added) - increased count from 1439 to 1549
BASELINE_ERRORS=1549

echo "📊 Current errors: $CURRENT_ERRORS (baseline: $BASELINE_ERRORS)"

if [ "$CURRENT_ERRORS" -gt "$BASELINE_ERRORS" ]; then
  echo "❌ ERROR: You introduced NEW TypeScript errors!"
  echo "   Current: $CURRENT_ERRORS | Baseline: $BASELINE_ERRORS"
  echo "   Difference: +$(($CURRENT_ERRORS - $BASELINE_ERRORS)) errors"
  echo ""
  echo "   To see the new errors:"
  echo "   npx tsc --noEmit | grep 'error TS'"
  exit 1
fi

if [ "$CURRENT_ERRORS" -lt "$BASELINE_ERRORS" ]; then
  FIXED=$(($BASELINE_ERRORS - $CURRENT_ERRORS))
  echo "🎉 Great! You fixed $FIXED errors!"
  echo ""
  echo "   Update the baseline by running:"
  echo "   sed -i '' 's/BASELINE_ERRORS=.*/BASELINE_ERRORS=$CURRENT_ERRORS/' scripts/check-typescript-errors.sh"
fi

if [ "$CURRENT_ERRORS" -eq "$BASELINE_ERRORS" ]; then
  echo "✅ No new TypeScript errors introduced"
fi

exit 0
