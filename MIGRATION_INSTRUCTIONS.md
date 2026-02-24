# 🗄️ Database Migration Instructions - Sprint 10

## New Blocks Added

This deployment adds the following new blocks:

1. **B30 - CallToAction** (Inline CTA block)
   - Fields: `title`, `description`, `buttonLabel`, `buttonLink`, `backgroundColor`
   - Table: `pages_blocks_calltoaction`

2. **B07 - Services** (Service catalog with icon colors)
   - Fields: `subtitle`, `title`, `description`, `columns`, `services[]`
   - Table: `pages_blocks_services`
   - Nested table: `pages_blocks_services_services`

3. **B05 - Content** (Enhanced with H5/H6 + Link rel attributes)
   - Modified existing block
   - No new tables, but schema changes in Lexical JSON

---

## ⚠️ IMPORTANT: Migration Required!

**Without running migrations, the new blocks WILL NOT WORK in production!**

Development (SQLite) auto-migrates, but **Production (PostgreSQL) requires explicit migrations**.

---

## 🚀 Quick Start - Generate Migration

### Step 1: Navigate to Project

```bash
cd /home/ploi/cms.compassdigital.nl
```

### Step 2: Pull Latest Code

```bash
git pull origin main
```

### Step 3: Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Step 4: Generate Migration

```bash
npx payload migrate:create add_sprint10_blocks
```

**This command is INTERACTIVE.** You'll be asked about new tables and columns.

---

## 📋 Interactive Prompts & Answers

When running `npx payload migrate:create`, Payload will detect schema changes and ask you questions.

### Expected Prompts

#### Prompt 1: `pages_blocks_calltoaction` table

```
? Is pages_blocks_calltoaction table created or renamed from another table?
  > + pages_blocks_calltoaction     create table
    ~ pages_blocks_two_column       rename table
    ~ pages_blocks_content          rename table
    ...
```

**Answer:** Select `+ pages_blocks_calltoaction` (create table)

---

#### Prompt 2: `pages_blocks_services` table

```
? Is pages_blocks_services table created or renamed from another table?
  > + pages_blocks_services        create table
    ~ pages_blocks_features        rename table
    ~ pages_blocks_testimonials    rename table
    ...
```

**Answer:** Select `+ pages_blocks_services` (create table)

---

#### Prompt 3: `pages_blocks_services_services` table

```
? Is pages_blocks_services_services table created or renamed from another table?
  > + pages_blocks_services_services    create table
    ~ pages_blocks_hero_buttons         rename table
    ...
```

**Answer:** Select `+ pages_blocks_services_services` (create table)

---

#### Prompt 4-6: Version tables

Payload creates `_v` (version) tables for drafts. Same process:

```
? Is _pages_v_blocks_calltoaction table created or renamed from another table?
  > + _pages_v_blocks_calltoaction     create table
```

**Answer:** Select `+ _pages_v_blocks_calltoaction` (create table)

Repeat for:
- `_pages_v_blocks_services`
- `_pages_v_blocks_services_services`

---

#### Prompt 7+: Individual Columns

If Payload asks about specific columns (less common):

```
? Is pages_blocks_content.max_width column created or renamed from another column?
  > + pages_blocks_content.max_width    create column
    ~ pages_blocks_content.width        rename column
```

**Answer:** Select `+ pages_blocks_content.max_width` (create column)

---

## ✅ Migration File Generated

After answering prompts, Payload creates:

```
src/migrations/YYYYMMDD_HHMMSS_add_sprint10_blocks.ts
src/migrations/YYYYMMDD_HHMMSS_add_sprint10_blocks.json
```

### Step 5: Review Migration File

```bash
cat src/migrations/*_add_sprint10_blocks.ts | head -50
```

**Expected content:**
```typescript
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_calltoaction\` (
    \`_order\` integer NOT NULL,
    \`_parent_id\` integer NOT NULL,
    \`id\` text PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`description\` text,
    \`button_label\` text NOT NULL,
    \`button_link\` text NOT NULL,
    \`background_color\` text DEFAULT 'grey',
    ...
  )`)

  await db.run(sql`CREATE TABLE \`pages_blocks_services\` (
    ...
  )`)

  // ... more tables
}
```

---

## 🗄️ Run Migration

### Pre-Migration Backup (CRITICAL!)

```bash
node scripts/database/backup-db.mjs client_cms pre-sprint10-migration
```

**Backup location:** `/home/ploi/backups/client_cms-TIMESTAMP-pre-sprint10-migration.sql`

### Safety Check

```bash
node scripts/database/check-migrations.mjs client_cms
```

**Exit codes:**
- `0` = Safe to migrate
- `1` = DANGER - DO NOT MIGRATE (contact developer)
- `2` = Empty database - safe to migrate

### Run Migration

```bash
# Run migrations (auto-confirm prompts)
yes | NODE_OPTIONS="--max-old-space-size=2048 --no-deprecation" npx payload migrate
```

**Expected output:**
```
✓ Database migrations/YYYYMMDD_HHMMSS_add_sprint10_blocks.ts - UP
✓ All migrations complete
```

### Verify Migration

```bash
# Check migration status
npx payload migrate:status

# Verify tables exist
psql $DATABASE_URL -c "\dt pages_blocks_*" | grep -E "calltoaction|services"
```

**Expected:**
```
 public | pages_blocks_calltoaction           | table | postgres
 public | pages_blocks_services                | table | postgres
 public | pages_blocks_services_services       | table | postgres
```

---

## 🔄 Build & Restart

### Step 6: Build Application

```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

**Build time:** ~1-2 minutes

### Step 7: Restart PM2

```bash
pm2 restart cms-compassdigital --update-env
```

### Step 8: Verify

```bash
# Wait for startup
sleep 10

# Health check
curl -s http://localhost:3020/api/health | jq '.status'
# Expected: "healthy"

# Check if new blocks are available in admin
curl -s http://localhost:3020/api/pages | jq '.docs[0].layout[]' | grep -E "calltoaction|services"
```

---

## 🚨 If Migration Fails

### Scenario 1: Migration Error During Run

```bash
# 1. Check error message
npx payload migrate 2>&1 | tail -50

# 2. Common errors:
# - "relation already exists" → table exists, mark migration as complete manually
# - "syntax error" → contact developer
# - "permission denied" → check database user permissions

# 3. Restore backup
node scripts/database/restore-db.mjs \
    /home/ploi/backups/client_cms-TIMESTAMP-pre-sprint10-migration.sql \
    client_cms

# 4. Contact developer with error logs
```

### Scenario 2: Wrong Answer to Prompt

If you selected "rename table" instead of "create table":

```bash
# 1. Delete generated migration file
rm src/migrations/*_add_sprint10_blocks.*

# 2. Re-run migration generation
npx payload migrate:create add_sprint10_blocks_v2

# 3. This time, select "create table" for all new tables
```

---

## 📊 Migration Checklist

- [ ] Code pulled (`git pull origin main`)
- [ ] Dependencies installed (`npm install`)
- [ ] Pre-migration backup created
- [ ] Migration safety check passed (exit code 0 or 2)
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration executed successfully
- [ ] Tables verified in database
- [ ] Application built successfully
- [ ] PM2 restarted
- [ ] Health check passed
- [ ] Admin panel accessible
- [ ] New blocks visible in block selector

---

## 🎯 Summary

**New blocks:**
- B30 CallToAction (Inline CTA)
- B07 Services (Service catalog)
- B05 Content (enhanced)

**Tables created:**
- `pages_blocks_calltoaction`
- `pages_blocks_services`
- `pages_blocks_services_services`
- `_pages_v_blocks_calltoaction` (versions)
- `_pages_v_blocks_services` (versions)
- `_pages_v_blocks_services_services` (versions)

**Migration time:** ~1-2 minutes
**Total deployment time:** ~5-7 minutes (including build)

---

## 📞 Support

If you encounter issues:

1. **Check logs:** `pm2 logs cms-compassdigital`
2. **Review migration file:** `cat src/migrations/*_add_sprint10_blocks.ts`
3. **Verify database:** `psql $DATABASE_URL -c "\dt pages_blocks_*"`
4. **Restore backup:** `node scripts/database/restore-db.mjs <backup_file> client_cms`
5. **Contact developer** with:
   - Error message
   - Migration file content
   - PM2 logs
   - Database schema (`\dt` output)

---

**Generated:** 2026-02-24
**Sprint:** 10 (B30 CallToAction + B07 Services)
**Status:** Ready for production deployment
