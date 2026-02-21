# Migration Rollback Plan
**Vertical Slice Architecture Migration**

This document outlines the rollback strategy for the vertical slice architecture migration. The migration is designed to be **fully reversible** without data loss.

---

## ⚠️ When to Rollback

Consider rolling back if you encounter:

1. **Build Failures** - TypeScript compilation errors after migration
2. **Import Errors** - Collections cannot be imported from new locations
3. **Runtime Errors** - Application crashes due to missing modules
4. **Test Failures** - E2E or integration tests fail unexpectedly
5. **Deployment Issues** - Production deployment fails after migration

---

## 🛡️ Rollback Safety Features

The migration script includes several safety features:

### 1. **Migration Log**
Every migration creates `.migration-log.json` which tracks:
- Timestamp of migration
- All actions performed (move, symlink, mkdir)
- Source and target paths
- Descriptions of changes

### 2. **Symlinks for Backward Compatibility**
When a collection is moved from `src/collections/` to `src/branches/{branch}/collections/`, a symlink is created at the original location. This ensures:
- Existing imports continue to work
- No immediate code changes required
- Gradual transition possible

### 3. **Dry-Run Mode**
Test any migration before executing:
```bash
npm run migrate:branches:dry
```

---

## 🔄 Rollback Methods

### Method 1: Automated Rollback (Recommended)

**Use the built-in rollback command:**

```bash
npm run migrate:branches:rollback
```

**What it does:**
1. Reads `.migration-log.json`
2. Reverses all actions in reverse order:
   - Removes symlinks
   - Moves files back to original locations
   - Leaves directories intact (manual cleanup)
3. Deletes migration log

**Example output:**
```
🔙 Rolling back migration
ℹ Rollback log from: 2026-02-21T16:33:58.231Z
ℹ Total actions to reverse: 3
✓ Removed symlink: src/collections/Products.ts
✓ Moved back: Products.ts
ℹ Skipping directory removal: src/branches/ecommerce/collections
✓ Migration log removed
✨ Rollback complete!
```

**Verification:**
```bash
# Check file is back
ls -la src/collections/Products.ts

# Verify no symlink
file src/collections/Products.ts
# Should show: "Products.ts: ASCII text" (not "symbolic link")

# Test build
npm run build
```

---

### Method 2: Manual Rollback

If the automated rollback fails or migration log is corrupted, use manual rollback:

#### Step 1: Identify migrated files

```bash
# Find all symlinks in src/collections
find src/collections -type l -ls
```

#### Step 2: Remove symlinks and restore files

**For each symlinked collection:**

```bash
# Example: Products collection
# 1. Remove symlink
rm src/collections/Products.ts

# 2. Move file back
mv src/branches/ecommerce/collections/Products.ts src/collections/

# 3. Verify
ls -la src/collections/Products.ts
```

#### Step 3: Clean up empty directories

```bash
# Remove empty branch directories
rm -rf src/branches/ecommerce/collections
rm -rf src/branches/ecommerce/components
rm -rf src/branches/ecommerce/lib
rmdir src/branches/ecommerce  # Only if empty
rmdir src/branches             # Only if empty
```

#### Step 4: Remove migration artifacts

```bash
rm .migration-log.json
```

#### Step 5: Verify

```bash
npm run build
npm run dev
```

---

### Method 3: Git Rollback

If migration was committed to git:

#### Option A: Revert last commit

```bash
# See commit history
git log --oneline -5

# Revert the migration commit
git revert <commit-hash>

# Push if already pushed
git push
```

#### Option B: Reset to before migration

```bash
# Find commit before migration
git log --oneline -10

# Soft reset (keeps changes)
git reset --soft <commit-hash>

# Or hard reset (discards changes)
git reset --hard <commit-hash>

# Force push if needed (DANGEROUS - coordinate with team!)
git push --force-with-lease
```

---

## 📋 Post-Rollback Checklist

After any rollback method, verify:

- [ ] **Files restored** - All collections back in `src/collections/`
- [ ] **No symlinks** - Run: `find src/collections -type l`
- [ ] **TypeScript compiles** - Run: `npm run build`
- [ ] **Dev server works** - Run: `npm run dev`
- [ ] **Tests pass** - Run: `npm run test`
- [ ] **Git clean** - Run: `git status`
- [ ] **Migration log removed** - Delete `.migration-log.json`

---

## 🔍 Troubleshooting

### Issue: "Migration log not found"

**Cause:** `.migration-log.json` was deleted or migration was manual.

**Solution:** Use [Method 2: Manual Rollback](#method-2-manual-rollback)

---

### Issue: "Cannot remove symlink - Operation not permitted"

**Cause:** File permissions issue.

**Solution:**
```bash
# Check permissions
ls -la src/collections/

# Add write permissions if needed
chmod +w src/collections/Products.ts

# Remove symlink
rm src/collections/Products.ts
```

---

### Issue: "File exists at target location"

**Cause:** Rollback was partially run before.

**Solution:**
```bash
# Check if file exists at original location
ls -la src/collections/Products.ts

# If it's the actual file (not symlink), migration already rolled back
# If it's a symlink, remove it and try again
rm src/collections/Products.ts
npm run migrate:branches:rollback
```

---

### Issue: "Module not found after rollback"

**Cause:** Import paths were updated to use new branch structure.

**Solution:**
```bash
# Search for updated imports
grep -r "from '@/branches/" src/

# Replace with old imports
# Example: '@/branches/ecommerce/collections/Products' → '@/collections/Products'
```

---

## 🚨 Emergency Rollback

If the application is broken in production:

### Step 1: Stop deployment

```bash
# If using CI/CD, disable auto-deploy
# If using manual deploy, don't push
```

### Step 2: Quick rollback

```bash
# Method 1: Git revert (if committed)
git revert HEAD
git push

# Method 2: Automated rollback (if migration log exists)
npm run migrate:branches:rollback
git add .
git commit -m "Rollback: Revert vertical slice migration"
git push

# Method 3: Manual (if automated fails)
# Follow Manual Rollback steps above
```

### Step 3: Verify production

```bash
# Test locally first
npm run build
npm run start

# Check production health
curl https://yourdomain.com/api/health
```

### Step 4: Deploy rollback

```bash
# Deploy the rollback
npm run deploy
```

---

## 📊 Rollback Impact Assessment

### Impact: **LOW** (if using symlinks)

**Why:**
- Symlinks maintain backward compatibility
- No code changes required immediately
- Existing imports continue to work

**Risk:**
- Symlinks may cause confusion for developers
- Some tools don't follow symlinks (rare)

### Impact: **MEDIUM** (if imports were updated)

**Why:**
- Import paths changed from `@/collections/*` to `@/branches/*/collections/*`
- Need to revert import changes across codebase

**Risk:**
- Search/replace errors
- Missed import updates

### Impact: **HIGH** (if payload.config.ts was restructured)

**Why:**
- Collections array structure changed
- Feature-based conditional loading added
- Branch index files created

**Risk:**
- Complex merge conflicts
- Configuration errors

---

## 📝 Migration Log Example

`.migration-log.json` structure:

```json
{
  "timestamp": "2026-02-21T16:33:58.231Z",
  "actions": [
    {
      "type": "mkdir",
      "target": "/path/to/src/branches/ecommerce/collections",
      "description": "Created directory: src/branches/ecommerce/collections"
    },
    {
      "type": "move",
      "source": "/path/to/src/collections/Products.ts",
      "target": "/path/to/src/branches/ecommerce/collections/Products.ts",
      "description": "Moved Products.ts to ecommerce/collections/"
    },
    {
      "type": "symlink",
      "source": "/path/to/src/collections/Products.ts",
      "target": "/path/to/src/branches/ecommerce/collections/Products.ts",
      "description": "Created backward-compatible symlink for Products.ts"
    }
  ]
}
```

---

## ✅ Prevention Tips

To avoid needing rollback:

1. **Always use dry-run first**
   ```bash
   npm run migrate:branches:dry
   ```

2. **Migrate incrementally**
   ```bash
   # Test with single collection first
   npm run migrate:collection -- --collection=Products

   # Then migrate branch
   npm run migrate:branch:ecommerce
   ```

3. **Commit frequently**
   ```bash
   git add .
   git commit -m "WIP: Migrate Products collection"
   ```

4. **Test after each step**
   ```bash
   npm run build
   npm run dev
   ```

5. **Keep migration log**
   - Don't delete `.migration-log.json` until migration is stable
   - Commit it to git for team visibility

---

## 🎯 Success Criteria

Migration can be considered **irreversible** (rollback script can be removed) when:

- [ ] All collections migrated successfully
- [ ] Symlinks removed (direct imports updated)
- [ ] payload.config.ts fully restructured
- [ ] All tests passing (E2E, integration, unit)
- [ ] Production deployed and stable for 1+ week
- [ ] Team fully trained on new structure
- [ ] Documentation updated

**Timeline:** 2-4 weeks after initial migration

---

## 📞 Support

If you encounter issues:

1. Check this rollback guide
2. Check `.migration-log.json`
3. Review migration script: `src/scripts/migrate-to-branches.ts`
4. Check master plan: `docs/ARCHITECTURE-MASTER-PLAN.md`

---

**Last Updated:** 2026-02-21
**Related Docs:**
- [Architecture Master Plan](./ARCHITECTURE-MASTER-PLAN.md)
- [Migration Script](../src/scripts/migrate-to-branches.ts)
