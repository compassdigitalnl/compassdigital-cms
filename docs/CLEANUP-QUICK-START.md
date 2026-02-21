# 🚀 SRC Cleanup - Quick Start Guide

**Last Updated**: 21 February 2026
**Estimated Time**: 12-16 hours total (can be done in phases)
**Priority**: 🔴 CRITICAL - Do this before major new features

---

## 📖 What This Is About

Your `src/` directory has grown organically and now needs cleanup:

- **38 blocks** in `src/blocks/` (many obsolete, 8 should be in ecommerce branch)
- **60+ components** in `src/components/` (many should be in branches)
- **Legacy folders** (`heros/`, `platform/`, `contexts/`) that need migration
- **Duplicate collections** (some in `src/collections/`, some in `src/branches/`)

This cleanup will:
✅ Remove obsolete code
✅ Consolidate duplicates
✅ Complete the vertical slice architecture migration
✅ Make the codebase easier to maintain and scale

---

## 📚 Documentation

**Read these in order**:

1. **This file** - Quick start (you are here!)
2. `ARCHITECTURE-MASTER-PLAN.md` - Overall architecture vision
3. `SRC-CLEANUP-MASTER-PLAN.md` - Detailed migration plan (100+ pages)
4. `BLOCKS-INVENTORY.md` - Complete block analysis

---

## 🎯 TL;DR - What Needs to Happen

### Phase 1: Remove Old Stuff (2 hours)
```bash
# 1. Remove deprecated heros/ directory (replaced by Hero block)
rm -rf src/heros/

# 2. Remove deprecated blocks (5 blocks)
rm -rf src/blocks/ArchiveBlock/
rm -rf src/blocks/Banner/
rm -rf src/blocks/Carousel/
rm -rf src/blocks/ThreeItemGrid/
# TODO: Merge CallToAction into CTA (manual)
```

### Phase 2: Move Collections (3 hours)
```bash
# Move remaining collections to branches/
mv src/collections/shop/ src/branches/ecommerce/collections/
mv src/collections/Pages/ src/branches/shared/collections/
mv src/collections/Users/ src/branches/shared/collections/

# Remove empty collections/ directory
rmdir src/collections/
```

### Phase 3: Move Ecommerce Blocks (2-3 hours)
```bash
# Move 8 ecommerce blocks to their branch
mv src/blocks/ProductGrid/ src/branches/ecommerce/blocks/
mv src/blocks/ProductFilters/ src/branches/ecommerce/blocks/
mv src/blocks/SearchBar/ src/branches/ecommerce/blocks/
# ... (6 more blocks - see detailed plan)
```

### Phase 4: Move Components (3-4 hours)
```bash
# Move ecommerce components
mv src/components/AddToCartButton.tsx src/branches/ecommerce/components/
mv src/components/checkout/ src/branches/ecommerce/components/
# ... (more components - see detailed plan)

# Move platform code
mv src/platform/ src/branches/platform/

# Move contexts
mv src/contexts/CartContext.tsx src/branches/ecommerce/contexts/
```

### Phase 5: Update Imports (2 hours)
```bash
# Run automated import updater
chmod +x scripts/update-imports.mjs
node scripts/update-imports.mjs --dry-run  # Check first
node scripts/update-imports.mjs            # Apply changes
```

### Phase 6: Test Everything (1-2 hours)
```bash
npm run typecheck  # Should pass
npm run build      # Should succeed
npm run dev        # Test manually
```

**Total**: 12-16 hours

---

## 🔍 Step 1: Analyze Current State (15 min)

Before you start, understand what you have:

```bash
# Run block usage analysis
chmod +x scripts/analyze-block-usage.mjs
node scripts/analyze-block-usage.mjs

# This will show you:
# - Which blocks are unused (can remove)
# - Which blocks are ecommerce-specific (should move)
# - Which blocks are shared (keep in src/blocks/)
```

**Expected Output**:
```
Block Name              | Usage | Lines | Status          | Recommendation
------------------------|-------|-------|-----------------|------------------
Hero                    |    45 |   219 | 🔥 Heavily used | Keep (critical)
ProductGrid             |    12 |   273 | 🔥 Heavily used | Keep (critical)
...
ArchiveBlock            |     0 |   120 | ❌ Unused       | REMOVE
Banner                  |     0 |    95 | ❌ Unused       | REMOVE
...

📊 Summary:
  🔥 Heavily used:  8 blocks (>= 10 usages)
  ✅ Active:        10 blocks (3-9 usages)
  ⚠️  Rarely used:  5 blocks (1-2 usages)
  ❌ Unused:        5 blocks (0 usages)
```

**Action**: Review the output and note which blocks can be removed.

---

## 🚀 Step 2: Choose Your Approach

### Option A: All at Once (1-2 days)
**Pros**: Done quickly, clean history
**Cons**: Risky, hard to test incrementally

```bash
git checkout -b cleanup/src-migration
# Do all phases 1-6
git add .
git commit -m "refactor: complete src/ cleanup and migration"
```

### Option B: Phased Approach (1 week) ⭐ RECOMMENDED
**Pros**: Safer, can test each phase, easier to debug
**Cons**: Takes longer

```bash
# Day 1: Phase 1 (cleanup)
git checkout -b cleanup/phase1-remove-deprecated
# ... do phase 1 ...
git commit -m "refactor(cleanup): remove deprecated blocks and heros"

# Day 2: Phase 2 (collections)
git checkout -b cleanup/phase2-collections
# ... do phase 2 ...
git commit -m "refactor(cleanup): migrate collections to branches"

# Day 3: Phase 3 (blocks)
git checkout -b cleanup/phase3-blocks
# ... do phase 3 ...
git commit -m "refactor(cleanup): move ecommerce blocks to branch"

# ... etc
```

---

## 📋 Step 3: Execute the Plan

### ⚡ Quick Commands (Copy-Paste Ready)

**Phase 1: Remove Deprecated Code**
```bash
# Check usage first (should be 0)
grep -r "heros/" src/ --include="*.ts" --include="*.tsx"
grep -r "ArchiveBlock\|Banner\|Carousel\|ThreeItemGrid" src/ --include="*.ts"

# Remove if usage is 0
rm -rf src/heros/
rm -rf src/blocks/ArchiveBlock/
rm -rf src/blocks/Banner/
rm -rf src/blocks/Carousel/
rm -rf src/blocks/ThreeItemGrid/

# Commit
git add .
git commit -m "refactor: remove deprecated heros and blocks"
```

**Phase 2: Migrate Collections**
```bash
# Move to branches
mv src/collections/shop/ProductCategories.ts src/branches/ecommerce/collections/
mv src/collections/shop/CustomerGroups.ts src/branches/ecommerce/collections/
rmdir src/collections/shop/

mv src/collections/Pages/ src/branches/shared/collections/Pages/
mv src/collections/Users/ src/branches/shared/collections/Users/

# Update branch index files
# (See detailed plan for code)

# Commit
git add .
git commit -m "refactor: migrate collections to branches"
```

**Phase 3: Move Ecommerce Blocks**
```bash
# Create blocks directory if needed
mkdir -p src/branches/ecommerce/blocks/

# Move blocks
for block in ProductGrid ProductFilters SearchBar QuickOrder CategoryGrid ProductEmbed TopBar ComparisonTable; do
  mv "src/blocks/$block/" "src/branches/ecommerce/blocks/"
done

# Create index file
# (See detailed plan for code)

# Commit
git add .
git commit -m "refactor: move ecommerce blocks to branch"
```

**Phase 4: Move Components**
```bash
# Move ecommerce components
mkdir -p src/branches/ecommerce/components/
mv src/components/AddToCartButton.tsx src/branches/ecommerce/components/
mv src/components/ProductBadges/ src/branches/ecommerce/components/
mv src/components/checkout/ src/branches/ecommerce/components/
# ... (see detailed plan for full list)

# Move platform code
mv src/platform/api/ src/branches/platform/api/
mv src/platform/integrations/ src/branches/platform/integrations/
mv src/platform/services/ src/branches/platform/services/
rmdir src/platform/

# Move contexts
mkdir -p src/branches/ecommerce/contexts/
mv src/contexts/CartContext.tsx src/branches/ecommerce/contexts/
rmdir src/contexts/

# Commit
git add .
git commit -m "refactor: migrate components and platform code to branches"
```

**Phase 5: Update Imports**
```bash
# Run automated updater
node scripts/update-imports.mjs --dry-run  # Preview changes
node scripts/update-imports.mjs            # Apply changes

# Commit
git add .
git commit -m "refactor: update imports after migration"
```

**Phase 6: Test**
```bash
# Type check
npm run typecheck

# Build
rm -rf .next/
npm run build

# Dev server
npm run dev

# If all passes, merge!
git checkout main
git merge cleanup/src-migration
```

---

## ✅ Verification Checklist

After each phase, verify:

### Phase 1 ✓
- [ ] `src/heros/` directory removed
- [ ] 5 deprecated blocks removed
- [ ] No import errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)

### Phase 2 ✓
- [ ] `src/collections/` is empty (or removed)
- [ ] Collections in `src/branches/*/collections/`
- [ ] Branch index files export all collections
- [ ] `payload.config.ts` imports from branches
- [ ] No import errors

### Phase 3 ✓
- [ ] 8 ecommerce blocks in `src/branches/ecommerce/blocks/`
- [ ] `src/branches/ecommerce/blocks/index.ts` exists
- [ ] Blocks still work in admin panel
- [ ] No import errors

### Phase 4 ✓
- [ ] Ecommerce components in `src/branches/ecommerce/components/`
- [ ] Platform code in `src/branches/platform/`
- [ ] CartContext in `src/branches/ecommerce/contexts/`
- [ ] No import errors

### Phase 5 ✓
- [ ] All imports updated
- [ ] No errors from `grep -r "@/collections/" src/`
- [ ] No errors from `grep -r "@/platform/" src/`
- [ ] Type check passes

### Phase 6 ✓
- [ ] Build succeeds
- [ ] Dev server runs
- [ ] Homepage loads
- [ ] Ecommerce pages work
- [ ] Admin panel works
- [ ] Can create/edit pages with blocks

---

## 🆘 Troubleshooting

### Import Errors After Migration

**Problem**: `Cannot find module '@/blocks/ProductGrid'`

**Solution**:
```bash
# Check if block was moved
ls src/branches/ecommerce/blocks/ProductGrid/

# Update import
# BEFORE: import { ProductGrid } from '@/blocks/ProductGrid'
# AFTER:  import { ProductGrid } from '@/branches/ecommerce/blocks/ProductGrid'

# Or run automated updater
node scripts/update-imports.mjs
```

### Build Fails

**Problem**: `npm run build` fails

**Solution**:
```bash
# Clear cache
rm -rf .next/

# Run type check first
npm run typecheck

# Check for any remaining old imports
grep -r "@/collections/" src/ --include="*.ts"
grep -r "@/platform/" src/ --include="*.ts"
grep -r "@/contexts/" src/ --include="*.ts"
```

### Blocks Don't Appear in Admin

**Problem**: Blocks missing from block selector

**Solution**:
```bash
# Check payload.config.ts
# Ensure branch index files export blocks correctly
cat src/branches/ecommerce/blocks/index.ts

# Check branch is imported in payload.config.ts
grep "ecommerceBlocks" src/payload.config.ts
```

### Can't Find Original Files

**Problem**: Accidentally moved/deleted wrong files

**Solution**:
```bash
# Revert last commit
git reset --hard HEAD~1

# Or restore specific files
git checkout HEAD -- src/blocks/ProductGrid/
```

---

## 📞 Need Help?

**Before You Start**:
1. Read `docs/ARCHITECTURE-MASTER-PLAN.md`
2. Read `docs/SRC-CLEANUP-MASTER-PLAN.md`
3. Read `docs/BLOCKS-INVENTORY.md`

**Stuck?**:
1. Run `node scripts/analyze-block-usage.mjs` for current state
2. Check `git status` to see what changed
3. Run `npm run typecheck` to find import errors
4. Check the detailed plan for your specific issue

**Found a Bug?**:
1. Create GitHub issue with:
   - Which phase you're on
   - Error message
   - Steps to reproduce
   - Your environment (`node --version`, `npm --version`)

---

## 🎯 Success!

After completion, you should have:

✅ Clean `src/` directory structure
✅ No deprecated code
✅ All ecommerce code in `branches/ecommerce/`
✅ All platform code in `branches/platform/`
✅ All shared code in `branches/shared/`
✅ Consistent architecture across all branches
✅ ~15-20% less code (obsolete code removed)
✅ Easier to maintain and scale
✅ Clear separation of concerns

**Next Steps**:
1. Update team documentation
2. Share new structure with team
3. Continue building new features with clean architecture!

---

**Created**: 21 February 2026
**Last Updated**: 21 February 2026
**Status**: ✅ Ready to Start
