# 🚀 Migration Quick Reference Card

**Quick commands and cheat sheet for the src/ cleanup migration**

---

## 📋 Before You Start

```bash
# 1. Check you're ready
./scripts/pre-flight-check.sh

# 2. Analyze current state
node scripts/analyze-block-usage.mjs

# 3. Preview import changes
node scripts/update-imports.mjs --dry-run
```

---

## 🎯 Quick Start (Automated)

```bash
# Make scripts executable
chmod +x scripts/*.sh
chmod +x scripts/*.mjs

# Run automated migration (Phase 0-1)
./scripts/migrate-ultra-safe.sh all

# Or run individual phases
./scripts/migrate-ultra-safe.sh 0  # Backup & analysis only
./scripts/migrate-ultra-safe.sh 1  # Remove deprecated code
```

---

## 🛡️ Emergency Rollback

```bash
# Show current status
./scripts/emergency-rollback.sh status

# Undo last commit (safe - keeps changes)
./scripts/emergency-rollback.sh last-commit

# Undo last commit (nuclear - deletes changes)
./scripts/emergency-rollback.sh last-commit-hard

# Restore from backup branch
./scripts/emergency-rollback.sh backup

# Nuclear option (reset everything)
./scripts/emergency-rollback.sh nuclear
```

---

## ✅ Verification Commands

```bash
# After any phase
npm run typecheck  # Must pass (or expected fails noted)
npm run build      # Must succeed
npm run dev        # Manual test

# Check for old imports
grep -r "@/collections/" src/ --include="*.ts"
grep -r "@/platform/" src/ --include="*.ts"
grep -r "@/contexts/" src/ --include="*.ts"
```

---

## 📦 Manual Migration Commands

### Phase 1: Remove Deprecated Code

```bash
# Remove heros (check usage first!)
grep -r "heros/" src/ --include="*.ts"  # Should be 0
rm -rf src/heros/

# Remove deprecated blocks
grep -r "ArchiveBlock" src/ --include="*.ts"  # Should be 0
rm -rf src/blocks/ArchiveBlock/
rm -rf src/blocks/Banner/
rm -rf src/blocks/Carousel/
rm -rf src/blocks/ThreeItemGrid/

# Test & commit
npm run typecheck && npm run build
git add . && git commit -m "refactor: remove deprecated code"
```

### Phase 2: Migrate Collections

```bash
# Move shop collections
mv src/collections/shop/ProductCategories.ts src/branches/ecommerce/collections/
mv src/collections/shop/CustomerGroups.ts src/branches/ecommerce/collections/
rmdir src/collections/shop/

# Move shared collections
mv src/collections/Pages/ src/branches/shared/collections/
mv src/collections/Users/ src/branches/shared/collections/

# Test & commit
npm run typecheck  # Will fail - expected!
git add . && git commit -m "refactor: migrate collections to branches"
```

### Phase 3: Move Ecommerce Blocks

```bash
# Move blocks
mv src/blocks/ProductGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductFilters/ src/branches/ecommerce/blocks/
mv src/blocks/SearchBar/ src/branches/ecommerce/blocks/
mv src/blocks/QuickOrder/ src/branches/ecommerce/blocks/
mv src/blocks/CategoryGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductEmbed/ src/branches/ecommerce/blocks/
mv src/blocks/TopBar/ src/branches/ecommerce/blocks/
mv src/blocks/ComparisonTable/ src/branches/ecommerce/blocks/

# Test & commit
git add . && git commit -m "refactor: move ecommerce blocks to branch"
```

### Phase 4: Move Components

```bash
# Move ecommerce components
mkdir -p src/branches/ecommerce/components/
mv src/components/AddToCartButton.tsx src/branches/ecommerce/components/
mv src/components/ProductBadges/ src/branches/ecommerce/components/
mv src/components/checkout/ src/branches/ecommerce/components/

# Move platform code
mv src/platform/api/ src/branches/platform/api/
mv src/platform/integrations/ src/branches/platform/integrations/
mv src/platform/services/ src/branches/platform/services/

# Move contexts
mkdir -p src/branches/ecommerce/contexts/
mv src/contexts/CartContext.tsx src/branches/ecommerce/contexts/
rmdir src/contexts/

# Test & commit
git add . && git commit -m "refactor: migrate components to branches"
```

### Phase 5: Update Imports

```bash
# Run automated import updater
node scripts/update-imports.mjs --dry-run  # Preview
node scripts/update-imports.mjs            # Apply

# Verify no old imports remain
grep -r "@/collections/" src/ --include="*.ts"
grep -r "@/platform/" src/ --include="*.ts"

# Test & commit
npm run typecheck  # Must pass now!
npm run build      # Must succeed
git add . && git commit -m "refactor: update import paths"
```

---

## 🔍 Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next/
rm -rf node_modules/.cache/

# Try build again
npm run build
```

### Type Errors

```bash
# Run typecheck to see errors
npm run typecheck

# Check for missed imports
grep -r "@/collections/" src/
grep -r "@/platform/" src/
```

### Can't Find Files

```bash
# Search for file
find src/ -name "ProductGrid.ts"

# Check git history
git log --all --full-history -- src/blocks/ProductGrid/
```

### Want to Undo

```bash
# Last commit (safe)
./scripts/emergency-rollback.sh last-commit

# Or restore from backup
./scripts/emergency-rollback.sh backup
```

---

## 📊 Expected Results After Each Phase

### After Phase 0
- ✅ Backup branch created
- ✅ Analysis report generated
- ✅ Migration branch created
- ✅ No code changes yet

### After Phase 1
- ✅ `src/heros/` removed (~7 files)
- ✅ 4-5 deprecated blocks removed
- ✅ Build succeeds
- ✅ Typecheck passes

### After Phase 2
- ✅ `src/collections/` empty or removed
- ✅ Collections in `branches/*/collections/`
- ⚠️  Typecheck fails (expected - imports not updated)
- ⚠️  Build may fail (expected)

### After Phase 3
- ✅ 8 ecommerce blocks in `branches/ecommerce/blocks/`
- ✅ ~18-23 shared blocks remain in `src/blocks/`
- ⚠️  Typecheck still fails
- ⚠️  Build still fails

### After Phase 4
- ✅ Components organized by branch
- ✅ `src/platform/` removed
- ✅ `src/contexts/` removed
- ⚠️  Typecheck still fails
- ⚠️  Build still fails

### After Phase 5
- ✅ All imports updated
- ✅ Typecheck passes
- ✅ Build succeeds
- ✅ Everything works!

---

## 💾 Git Commands

```bash
# Create backup
git checkout -b backup/before-cleanup-$(date +%Y-%m-%d)
git push origin backup/before-cleanup-$(date +%Y-%m-%d)

# Create migration branch
git checkout main
git checkout -b feature/src-cleanup-migration

# Commit after each phase
git add .
git commit -m "refactor(cleanup): [description]"

# Push to remote
git push origin feature/src-cleanup-migration

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (delete changes)
git reset --hard HEAD~1

# Restore from backup
git checkout backup/before-cleanup-2026-02-21
```

---

## 📞 Help

### Documentation
- **Full Guide**: `docs/SRC-CLEANUP-MASTER-PLAN.md`
- **Ultra-Safe Guide**: `docs/ULTRA-SAFE-MIGRATION-GUIDE.md`
- **Block Inventory**: `docs/BLOCKS-INVENTORY.md`
- **Quick Start**: `docs/CLEANUP-QUICK-START.md`

### Scripts
- **Automated Migration**: `scripts/migrate-ultra-safe.sh`
- **Emergency Rollback**: `scripts/emergency-rollback.sh`
- **Block Analysis**: `scripts/analyze-block-usage.mjs`
- **Import Updater**: `scripts/update-imports.mjs`
- **Pre-flight Check**: `scripts/pre-flight-check.sh`

### Commands
```bash
# View documentation
cat docs/CLEANUP-QUICK-START.md

# Run analysis
node scripts/analyze-block-usage.mjs

# Check status
./scripts/emergency-rollback.sh status

# Test build
npm run typecheck && npm run build
```

---

**Created**: 21 February 2026
**Version**: 1.0
**Status**: ✅ Ready to use
