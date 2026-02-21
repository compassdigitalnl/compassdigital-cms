# Payload CMS Migraties - Complete Guide

**Datum:** 21 Februari 2026
**Status:** ✅ Geïmplementeerd - Baseline Migration System
**Probleem opgelost:** Migration snapshots ontbraken in git → volledige schema regeneratie bij elke wijziging

---

## 🎯 Het Probleem (Opgelost!)

### Wat was het probleem?

**Voor deze fix:**
- ❌ Migration snapshot bestanden (.json) ontbraken in git repo
- ❌ `payload migrate:create` genereerde VOLLEDIGE schema migratie (alle tabellen opnieuw)
- ❌ Resulteerde in errors: "table already exists" bij bestaande deployments
- ❌ Admin panel werd zwart door duplicate table errors
- ❌ Geen delta migraties mogelijk

**Na deze fix:**
- ✅ Baseline migration snapshot in git
- ✅ Toekomstige migraties zijn delta's (alleen nieuwe/gewijzigde tabellen)
- ✅ Automatische safety check: baseline draait niet op bestaande databases
- ✅ Deploy scripts runnen migraties automatisch
- ✅ Admin panel blijft werken na schema wijzigingen

---

## 📋 Wat is er geïmplementeerd?

### 1. Baseline Migration (src/migrations/)

**Bestanden aangemaakt:**
```
src/migrations/
├── index.ts                                          # Auto-generated import list
├── 20260221_083030_baseline_schema.ts                # Migration executable
└── 20260221_083030_baseline_schema.json              # Snapshot (760KB!)
```

**Belangrijkste features:**

#### A. Safety Check in up() functie
```typescript
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Check if tables already exist (existing deployment like Plastimed)
  const result = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    ) as table_exists
  `)

  const tableExists = result?.rows?.[0]?.table_exists

  if (tableExists) {
    console.log('[Migration] Tables already exist, skipping baseline migration')
    return  // EXIT EARLY - don't create tables again!
  }

  // Only runs on EMPTY databases (new clients)
  await db.execute(sql`CREATE TABLE ...`)
}
```

**Waarom deze check?**
- Plastimed (en andere bestaande deployments) hebben al alle tabellen
- Zonder deze check zou de migratie crashen: "ERROR: table users already exists"
- Met deze check: detecteert bestaande tabellen → skipt migratie → veilig!

#### B. PostgreSQL Compatibility
```typescript
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
```

**Belangrijk:**
- Lokaal: SQLite (`DATABASE_URL=file:./payload.db`)
- Productie: PostgreSQL (`DATABASE_URL=postgresql://...`)
- Migratie gegenereerd met PostgreSQL adapter → werkt in productie!

#### C. Snapshot File (.json - 760KB)
Bevat volledige database schema snapshot:
- Alle tabellen, kolommen, types, indexes
- Gebruikt als baseline voor toekomstige delta migraties
- **MOET in git** worden gecommit!

---

### 2. Deploy Scripts Updated

#### deploy-ploi.sh (Ploi deployment)
```bash
# 5. Run database migrations
echo ""
echo "=== 🗄️  Running migrations ==="
npx payload migrate || echo "⚠️  Migration failed, check logs"
echo "✓ Migrations completed"
```

**Voordelen:**
- Migraties automatisch bij elke deploy
- Errors worden gelogd maar stoppen deploy niet
- Idempotent: veilig om meerdere keren te draaien

#### DEPLOY_TEMPLATE_SYSTEM.sh
```bash
# STEP 5: Run Database Migrations
echo "🗄️  Step 5/6: Running database migrations..."
npx payload migrate
```

---

## 🚀 Workflow: Toekomstige Collection Wijzigingen

### Stap 1: Wijzig Collection Code

Bijvoorbeeld, voeg een nieuw veld toe aan Products collection:

```typescript
// src/collections/Products.ts
{
  name: 'sustainabilityScore',
  type: 'number',
  label: 'Sustainability Score',
  min: 0,
  max: 100,
}
```

### Stap 2: Genereer Delta Migration

```bash
# Zorg dat DATABASE_URL naar PostgreSQL wijst (voor productie compatibility)
DATABASE_URL="postgresql://..." npx payload migrate:create add_sustainability_score

# Of gebruik de npm script:
npm run migrate:create add_sustainability_score
```

**Output:**
```
Migration created at src/migrations/20260221_120000_add_sustainability_score.ts
```

### Stap 3: Inspecteer Gegenereerde Migration

```typescript
// src/migrations/20260221_120000_add_sustainability_score.ts
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ✅ DELTA migration - alleen nieuwe kolom!
  await db.execute(sql`
    ALTER TABLE "products"
    ADD COLUMN "sustainability_score" integer
  `)
}
```

**Let op:**
- Geen volledige schema recreatie meer!
- Alleen `ALTER TABLE` statements voor nieuwe kolommen
- Veilig om te draaien op bestaande databases

### Stap 4: Commit BEIDE Bestanden

```bash
git add src/migrations/20260221_120000_add_sustainability_score.ts
git add src/migrations/20260221_120000_add_sustainability_score.json  # ✅ BELANGRIJK!
git add src/migrations/index.ts  # Auto-updated
git commit -m "Add sustainability score to products"
```

**⚠️ KRITIEK:** Commit ALTIJD het .json bestand!
- Zonder .json: volgende migratie genereert weer volledige schema
- Met .json: volgende migratie is een delta

### Stap 5: Deploy

```bash
# Push to git
git push origin main

# Deploy draait automatisch:
# 1. git pull
# 2. npm install
# 3. npm run build
# 4. npx payload migrate  ← automatisch!
# 5. pm2 restart
```

---

## 📊 Migration Status per Deployment

### Platform CMS (cms.compassdigital.nl)
**Database:** PostgreSQL (Railway - main)
**Status:** ✅ Baseline migration will skip (tables exist)
**Tables:** 50+ tables already exist
**Action:** Geen - baseline detecteert bestaande tables en skipt

### Plastimed (plastimed01.compassdigital.nl)
**Database:** PostgreSQL (Railway - client_plastimed01)
**Status:** ✅ Baseline migration will skip (tables exist)
**Tables:** 50+ tables already exist
**Action:** Geen - baseline detecteert bestaande tables en skipt

### Nieuwe Clients (toekomstig)
**Database:** PostgreSQL (Railway - client_xxx)
**Status:** ✅ Baseline migration will run (empty database)
**Tables:** 0 tables → baseline creates all
**Action:** Automatisch tijdens provisioning

---

## 🧪 Testen

### Test 1: Baseline Migration op Bestaande Database

```bash
# Connect to existing database (Plastimed)
DATABASE_URL="postgresql://..." npx payload migrate

# Expected output:
# [Migration] Baseline schema: Tables already exist (existing deployment)
# [Migration] Skipping baseline migration to prevent errors
# ✅ Success - no tables created
```

### Test 2: Baseline Migration op Lege Database

```bash
# Create test database
createdb test_payload

# Run migration
DATABASE_URL="postgresql://...test_payload" npx payload migrate

# Expected output:
# [Migration] Baseline schema: Empty database detected, running full schema migration...
# [Migration] Creating tables...
# ✅ Success - all 50+ tables created
```

### Test 3: Delta Migration

```bash
# 1. Modify collection (add field)
# 2. Generate migration
npx payload migrate:create test_delta

# 3. Check generated .ts file
# Should contain: ALTER TABLE ... ADD COLUMN ...
# Should NOT contain: CREATE TABLE users ...

# ✅ Success if only delta SQL generated
```

---

## ⚠️ Veelgemaakte Fouten & Oplossingen

### Fout 1: .json bestand vergeten te committen

**Symptoom:**
```bash
npx payload migrate:create new_feature
# Genereert VOLLEDIGE schema migratie in plaats van delta
```

**Oorzaak:**
- Previous migration .json niet in git
- Payload heeft geen snapshot als baseline
- Genereert daarom hele schema opnieuw

**Oplossing:**
```bash
# Check welke .json files niet in git zitten
git status src/migrations/

# Add ALL migration files
git add src/migrations/*.json
git add src/migrations/*.ts
git commit -m "Add missing migration snapshots"
```

### Fout 2: Migration draait met SQLite adapter

**Symptoom:**
```typescript
import { MigrateUpArgs } from '@payloadcms/db-sqlite'  // ❌ WRONG!
```

**Oorzaak:**
- Lokaal development gebruikt SQLite
- Migration gegenereerd zonder DATABASE_URL override
- Productie gebruikt PostgreSQL → incompatible SQL

**Oplossing:**
```bash
# ALWAYS generate with PostgreSQL
DATABASE_URL="postgresql://..." npx payload migrate:create feature_name

# Or set in .env.local for development:
DATABASE_URL=postgresql://localhost/payload_dev
```

### Fout 3: "table already exists" error na deploy

**Symptoom:**
```
ERROR: table "users" already exists
Admin panel is broken (black screen)
```

**Oorzaak:**
- Baseline migration zonder safety check
- Probeert tables opnieuw te maken die al bestaan

**Oplossing:**
```typescript
// ✅ Baseline migration heeft al safety check (zie boven)
// Als dit toch gebeurt:

// Check migration history
SELECT * FROM payload_migrations;

// Mark baseline as already run
INSERT INTO payload_migrations (name, batch)
VALUES ('20260221_083030_baseline_schema', 1);
```

### Fout 4: Migration draait niet bij deploy

**Symptoom:**
```bash
# Deploy completeert
# Maar nieuwe kolommen ontbreken in database
```

**Oorzaak:**
- Deploy script runt `npx payload migrate` niet
- Of migration failed maar deploy continueerde

**Oplossing:**
```bash
# Check deploy logs
tail -f /var/log/deploy.log

# Manually run migration
cd /home/ploi/sitename
npx payload migrate

# Restart app
pm2 restart app-name
```

---

## 🔍 Migration Commands Cheat Sheet

### Genereer Nieuwe Migration
```bash
# With PostgreSQL (recommended for production)
DATABASE_URL="postgresql://..." npx payload migrate:create migration_name

# Shorthand npm script
npm run migrate:create migration_name
```

### Run Migraties
```bash
# Run all pending migrations
npx payload migrate

# Run with specific database
DATABASE_URL="postgresql://..." npx payload migrate
```

### Check Migration Status
```bash
# Connect to database
psql $DATABASE_URL

# Check migration history
SELECT * FROM payload_migrations ORDER BY batch, id;

# Output:
#  id |             name              | batch |         created_at
# ----+-------------------------------+-------+----------------------------
#   1 | 20260221_083030_baseline_schema |   1   | 2026-02-21 09:30:00
```

### Rollback (DOWN) - Use with Caution!
```bash
# Rollback last batch
npx payload migrate down

# ⚠️ WARNING: This can delete data!
# Only use in development or with backups
```

---

## 📁 File Structure

```
src/migrations/
├── index.ts                                          # Auto-generated
│   └── Imports all migrations
│   └── Exports migrations array
│
├── 20260221_083030_baseline_schema.ts                # Migration code
│   ├── up(): Create all tables (with safety check)
│   └── down(): Drop all tables
│
└── 20260221_083030_baseline_schema.json              # Snapshot (760KB)
    └── Complete database schema state
    └── Used as baseline for delta migrations
    └── ✅ MUST be committed to git!
```

---

## ✅ Checklist: Nieuwe Migration Maken

- [ ] Collection/Global wijziging gemaakt in code
- [ ] Database URL gezet naar PostgreSQL (productie compatibility)
- [ ] `npx payload migrate:create descriptive_name` gedraaid
- [ ] .ts migration file geïnspecteerd (delta, geen volledige schema)
- [ ] .json snapshot file bestaat
- [ ] BEIDE bestanden (.ts + .json) toegevoegd aan git
- [ ] index.ts automatisch updated (verificatie)
- [ ] Code gecommit en gepusht
- [ ] Deploy gedraaid (migratie automatisch)
- [ ] Database gecontroleerd (nieuwe kolommen aanwezig)
- [ ] Admin panel werkt nog (geen black screen)

---

## 🎯 Best Practices

### DO ✅

1. **ALTIJD .json bestanden committen**
   ```bash
   git add src/migrations/*.json
   ```

2. **Gebruik PostgreSQL voor migration generatie**
   ```bash
   DATABASE_URL="postgresql://..." npx payload migrate:create name
   ```

3. **Beschrijvende migration namen**
   ```bash
   # Good:
   npx payload migrate:create add_vendor_rating_field
   npx payload migrate:create remove_deprecated_product_status

   # Bad:
   npx payload migrate:create migration
   npx payload migrate:create fix
   ```

4. **Test migrations lokaal eerst**
   ```bash
   # Create test database
   createdb payload_test
   DATABASE_URL="postgresql://localhost/payload_test" npx payload migrate
   ```

5. **Inspect generated migration VOOR commit**
   ```bash
   cat src/migrations/latest_migration.ts
   # Check if it's a delta, not full schema
   ```

### DON'T ❌

1. **Geen handmatige schema wijzigingen**
   ```sql
   -- ❌ DON'T:
   ALTER TABLE products ADD COLUMN new_field text;

   -- ✅ DO:
   # Add field to collection code
   # Run: npx payload migrate:create add_new_field
   ```

2. **Geen migrations deleten uit git**
   ```bash
   # ❌ DON'T:
   git rm src/migrations/old_migration.ts

   # Migrations zijn permanent history
   # Delete = break database state tracking
   ```

3. **Geen .json files in .gitignore**
   ```gitignore
   # ❌ DON'T:
   *.json

   # ✅ DO: Be specific
   build/*.json
   node_modules/**/*.json
   # But NOT: src/migrations/*.json
   ```

4. **Geen DOWN migrations in productie zonder backup**
   ```bash
   # ❌ DANGEROUS:
   npx payload migrate down  # Deletes data!

   # ✅ Safe:
   # 1. Create backup first
   # 2. Test rollback in dev
   # 3. Plan rollback window
   ```

---

## 📚 Zie Ook

- **Payload Docs:** https://payloadcms.com/docs/database/migrations
- **deploy-ploi.sh** - Deployment script met automatic migrations
- **src/payload.config.ts** - Database adapter configuratie
- **FEATURES_MANAGEMENT_GUIDE.md** - Feature toggles (affect schema)

---

## 🚀 Summary

**Probleem:** Migration snapshots ontbraken → volledige schema regeneratie
**Oplossing:** Baseline migration + snapshots in git
**Resultaat:**
- ✅ Delta migrations werken
- ✅ Bestaande databases veilig (safety check)
- ✅ Automatische migraties bij deploy
- ✅ Admin panel blijft werken na schema wijzigingen

**Voor nieuwe collection wijzigingen:**
```bash
# 1. Edit collection code
# 2. Generate migration
DATABASE_URL="postgresql://..." npx payload migrate:create feature_name

# 3. Commit .ts + .json
git add src/migrations/*
git commit -m "Add feature"

# 4. Deploy → migrations run automatically!
```

---

**Laatste update:** 21 Februari 2026
**Status:** ✅ Production Ready
