# 📊 EMAIL MARKETING - DATABASE MIGRATION STRATEGY

**Laatste update:** 24 Februari 2026
**Versie:** 1.0
**Status:** Preparation & Structure (Fase 0)

---

## 📋 OVERZICHT

Dit document beschrijft de complete database migratie strategie voor de Email Marketing Engine. De strategie bestaat uit twee fases: Payload auto-generated migraties en custom performance indexes.

**Belangrijk:** Database migraties zijn **KRITIEK** voor productie deployments. Zonder correcte migraties faalt de feature in PostgreSQL (terwijl het lokaal werkt met SQLite auto-migrate).

---

## 🎯 MIGRATIE DOELSTELLINGEN

### Wat moet werken:
- ✅ Alle 8 email marketing collections in database
- ✅ Foreign key relationships correct
- ✅ Indexes voor optimale performance
- ✅ Tenant isolation (multi-tenancy safe)
- ✅ Backwards compatible (bestaande data blijft werken)

### Performance Targets:
- Subscriber queries: <50ms (100K+ subscribers)
- Campaign queries: <100ms (10K+ campaigns)
- Analytics aggregaties: <200ms (1M+ events)
- Flow execution lookups: <30ms (real-time)

---

## 🔄 TWEE-STAPS MIGRATIE PROCES

### Stap 1: Payload Auto-Generated Migratie

Payload genereert automatisch SQL voor alle collections en fields.

**Command:**
```bash
# ⚠️ BELANGRIJK: Zet feature flags EERST op true!
export ENABLE_EMAIL_MARKETING=true
export ENABLE_EMAIL_CAMPAIGNS=true
export ENABLE_EMAIL_AUTOMATION=true
export ENABLE_EMAIL_FLOWS=true
export ENABLE_EMAIL_GRAPES_EDITOR=true
export ENABLE_EMAIL_DELIVERABILITY=true
export ENABLE_EMAIL_ANALYTICS=true

# Genereer migratie
npx payload migrate:create email-marketing-collections
```

**Output:** `src/migrations/YYYYMMDDHHMMSS_email-marketing-collections.ts`

**Wat deze migratie bevat:**
- CREATE TABLE statements voor alle 8 collections
- Kolommen voor alle velden
- Foreign key constraints
- Basic indexes (primary keys, foreign keys)

### Stap 2: Custom Performance Indexes

Handmatig gegenereerde migratie voor optimale performance.

**Command:**
```bash
# Genereer tweede migratie
npx payload migrate:create email-marketing-indexes
```

**Edit de gegenereerde file** en voeg 13+ custom indexes toe (zie hieronder).

---

## 📊 DATABASE SCHEMA OVERVIEW

### Email Marketing Collections (8 totaal):

```
email_subscribers           # Subscriber management
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── email (UNIQUE per tenant)
├── listmonk_id (INT)
├── status (enabled/disabled/blocklisted)
└── attribs (JSONB)

email_lists                 # Mailing lists
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── listmonk_id (INT)
├── name
├── type (public/private)
└── subscriber_count (INT)

email_campaigns             # Campaigns & newsletters
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── listmonk_campaign_id (INT)
├── status (draft/scheduled/running/finished)
├── lists (JSON array of list IDs)
└── stats (JSONB)

email_templates             # Email templates (GrapesJS)
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── type (campaign/transactional)
├── grapes_project_data (JSONB)
└── html_content (TEXT)

email_automation_rules      # Automation triggers
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── trigger_type (subscriber.created, order.placed, etc.)
├── conditions (JSONB)
└── actions (JSONB)

email_flows                 # Email sequences
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── steps (JSONB array)
└── active_subscribers (INT)

email_flow_states           # Subscriber flow progress
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── flow_id (FK → email_flows)
├── subscriber_id (FK → email_subscribers)
├── current_step_index (INT)
├── status (active/paused/completed)
└── context (JSONB)

email_analytics             # Campaign analytics cache
├── id (UUID, PK)
├── tenant_id (FK → tenants)
├── campaign_id (FK → email_campaigns)
├── opens (INT)
├── clicks (INT)
├── bounces (INT)
└── last_synced_at (TIMESTAMP)
```

---

## 🚀 KRITIEKE INDEXES (13+ totaal)

### Waarom indexes?
- **Foreign Keys:** Zonder index = slow joins (100ms → 5ms)
- **Tenant Queries:** Multi-tenancy vereist tenant_id index
- **Status Filters:** Campaign/flow queries filteren altijd op status
- **Email Lookups:** Unsubscribe/preference center zoekt op email
- **Date Ranges:** Analytics queries filteren op timestamps

### Custom Indexes SQL:

```sql
-- ═══════════════════════════════════════════════════════════
-- EMAIL SUBSCRIBERS
-- ═══════════════════════════════════════════════════════════

-- Tenant isolation (MUST HAVE!)
CREATE INDEX idx_email_subscribers_tenant_id
  ON email_subscribers (tenant_id);

-- Email lookups (unsubscribe, preference center)
CREATE UNIQUE INDEX idx_email_subscribers_tenant_email
  ON email_subscribers (tenant_id, email);

-- Listmonk sync (find by Listmonk ID)
CREATE INDEX idx_email_subscribers_listmonk_id
  ON email_subscribers (listmonk_id);

-- Status filters (active subscribers only)
CREATE INDEX idx_email_subscribers_status
  ON email_subscribers (tenant_id, status);

-- ═══════════════════════════════════════════════════════════
-- EMAIL LISTS
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_lists_tenant_id
  ON email_lists (tenant_id);

CREATE INDEX idx_email_lists_listmonk_id
  ON email_lists (listmonk_id);

-- ═══════════════════════════════════════════════════════════
-- EMAIL CAMPAIGNS
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_campaigns_tenant_id
  ON email_campaigns (tenant_id);

CREATE INDEX idx_email_campaigns_status
  ON email_campaigns (tenant_id, status);

CREATE INDEX idx_email_campaigns_scheduled_at
  ON email_campaigns (tenant_id, send_at)
  WHERE status = 'scheduled';

CREATE INDEX idx_email_campaigns_listmonk_id
  ON email_campaigns (listmonk_campaign_id);

-- ═══════════════════════════════════════════════════════════
-- EMAIL TEMPLATES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_templates_tenant_id
  ON email_templates (tenant_id);

CREATE INDEX idx_email_templates_type
  ON email_templates (tenant_id, type);

-- ═══════════════════════════════════════════════════════════
-- EMAIL AUTOMATION RULES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_automation_rules_tenant_id
  ON email_automation_rules (tenant_id);

CREATE INDEX idx_email_automation_rules_trigger
  ON email_automation_rules (tenant_id, trigger_type, is_active);

-- ═══════════════════════════════════════════════════════════
-- EMAIL FLOWS
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_flows_tenant_id
  ON email_flows (tenant_id);

CREATE INDEX idx_email_flows_status
  ON email_flows (tenant_id, is_active);

-- ═══════════════════════════════════════════════════════════
-- EMAIL FLOW STATES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_flow_states_tenant_id
  ON email_flow_states (tenant_id);

CREATE INDEX idx_email_flow_states_flow_id
  ON email_flow_states (flow_id);

CREATE INDEX idx_email_flow_states_subscriber_id
  ON email_flow_states (subscriber_id);

-- Active flows (scheduled jobs)
CREATE INDEX idx_email_flow_states_active
  ON email_flow_states (tenant_id, status, next_step_scheduled_at)
  WHERE status = 'active';

-- ═══════════════════════════════════════════════════════════
-- EMAIL ANALYTICS
-- ═══════════════════════════════════════════════════════════

CREATE INDEX idx_email_analytics_tenant_id
  ON email_analytics (tenant_id);

CREATE INDEX idx_email_analytics_campaign_id
  ON email_analytics (campaign_id);

-- Stale data cleanup (sync jobs)
CREATE INDEX idx_email_analytics_last_synced
  ON email_analytics (last_synced_at);
```

### Migratie Template:

```typescript
// src/migrations/YYYYMMDDHHMMSS_email-marketing-indexes.ts
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    -- Email Subscribers
    CREATE INDEX IF NOT EXISTS idx_email_subscribers_tenant_id
      ON email_subscribers (tenant_id);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_email_subscribers_tenant_email
      ON email_subscribers (tenant_id, email);

    CREATE INDEX IF NOT EXISTS idx_email_subscribers_listmonk_id
      ON email_subscribers (listmonk_id);

    -- Email Campaigns
    CREATE INDEX IF NOT EXISTS idx_email_campaigns_tenant_id
      ON email_campaigns (tenant_id);

    CREATE INDEX IF NOT EXISTS idx_email_campaigns_status
      ON email_campaigns (tenant_id, status);

    -- ... (voeg alle indexes toe)
  `)
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.db.drizzle.execute(`
    DROP INDEX IF EXISTS idx_email_subscribers_tenant_id;
    DROP INDEX IF EXISTS idx_email_subscribers_tenant_email;
    -- ... (drop alle indexes)
  `)
}
```

---

## ✅ MIGRATIE TESTING CHECKLIST

### Pre-Migration Checks:

```bash
# 1. Verify feature flags zijn enabled
grep ENABLE_EMAIL .env
# Moet allemaal 'true' zijn!

# 2. Verify geen syntax errors in collections
npm run generate:types

# 3. Verify bestaande migraties slagen
npx payload migrate:status
```

### Test op Verse Database:

**KRITIEK:** Test altijd op een lege database voordat je naar productie gaat!

```bash
# 1. Start test PostgreSQL
docker run --name test-postgres \
  -e POSTGRES_PASSWORD=testpass \
  -p 5433:5432 \
  -d postgres:16

# 2. Update DATABASE_URL tijdelijk
export DATABASE_URL="postgresql://postgres:testpass@localhost:5433/test"

# 3. Run migraties
npx payload migrate

# 4. Verify alle tabellen bestaan
psql $DATABASE_URL -c "\dt"

# 5. Verify alle indexes bestaan
psql $DATABASE_URL -c "\di" | grep email_

# 6. Cleanup
docker stop test-postgres && docker rm test-postgres
```

### Post-Migration Validation:

```bash
# 1. Check aantal tabellen (moet 8+ zijn)
psql $DATABASE_URL -c "
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_name LIKE 'email_%'
"
# Expected: 8

# 2. Check aantal indexes (moet 13+ zijn)
psql $DATABASE_URL -c "
  SELECT COUNT(*)
  FROM pg_indexes
  WHERE indexname LIKE 'idx_email_%'
"
# Expected: 13+

# 3. Check foreign keys
psql $DATABASE_URL -c "
  SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name
  FROM information_schema.table_constraints AS tc
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name LIKE 'email_%'
"
# Verify tenant_id, flow_id, subscriber_id FKs
```

---

## ⚠️ VEELGEMAAKTE FOUTEN & OPLOSSINGEN

### ❌ Fout 1: Migratie draaien met feature flags disabled

**Symptoom:**
```bash
npx payload migrate:create email-marketing-collections
# Migratie heeft GEEN email_ tabellen!
```

**Oorzaak:**
Feature flags staan uit → Payload slaat collections over

**Oplossing:**
```bash
# Zet ALLE email flags op true VOORDAT je migrate:create draait!
export ENABLE_EMAIL_MARKETING=true
export ENABLE_EMAIL_CAMPAIGNS=true
# ... etc
```

---

### ❌ Fout 2: Indexes vergeten

**Symptoom:**
```sql
-- Query duurt 500ms+ in productie (maar <50ms lokaal)
SELECT * FROM email_subscribers WHERE tenant_id = 'abc'
```

**Oorzaak:**
Geen index op tenant_id → Full table scan (100K+ rows)

**Oplossing:**
```sql
CREATE INDEX idx_email_subscribers_tenant_id ON email_subscribers (tenant_id);
```

**Verificatie:**
```sql
EXPLAIN ANALYZE
SELECT * FROM email_subscribers WHERE tenant_id = 'abc';
-- Moet "Index Scan" zeggen, NIET "Seq Scan"
```

---

### ❌ Fout 3: UNIQUE constraint zonder tenant_id

**Symptoom:**
```
ERROR: duplicate key value violates unique constraint "email_subscribers_email_key"
```

**Oorzaak:**
Email is UNIQUE globally, maar moet UNIQUE per tenant zijn!

**Fout:**
```sql
CREATE UNIQUE INDEX idx_email_unique ON email_subscribers (email);
```

**Correct:**
```sql
CREATE UNIQUE INDEX idx_email_unique ON email_subscribers (tenant_id, email);
```

---

### ❌ Fout 4: Migratie in verkeerde volgorde

**Symptoom:**
```
ERROR: relation "email_subscribers" does not exist
```

**Oorzaak:**
Indexes migratie draait VOOR collections migratie

**Oplossing:**
Check timestamp in filename:
```bash
# Correct volgorde (timestamps):
20260224120000_email-marketing-collections.ts  # EERST
20260224120100_email-marketing-indexes.ts      # DAARNA
```

---

### ❌ Fout 5: Foreign key zonder index

**Symptoom:**
```sql
-- JOIN query duurt 200ms+
SELECT f.*, s.email
FROM email_flow_states f
JOIN email_subscribers s ON s.id = f.subscriber_id
WHERE f.tenant_id = 'abc'
```

**Oorzaak:**
Geen index op FK kolom (subscriber_id)

**Oplossing:**
```sql
CREATE INDEX idx_email_flow_states_subscriber_id
  ON email_flow_states (subscriber_id);
```

---

## 🚀 DEPLOYMENT WORKFLOW

### Development → Staging → Production:

```bash
# ════════════════════════════════════════
# DEVELOPMENT (lokaal)
# ════════════════════════════════════════

# 1. Feature flags enabled in .env
ENABLE_EMAIL_MARKETING=true

# 2. Genereer collections migratie
npx payload migrate:create email-marketing-collections

# 3. Genereer indexes migratie
npx payload migrate:create email-marketing-indexes

# 4. Edit indexes migratie → voeg SQL toe

# 5. Test op verse DB (zie hierboven)

# 6. Commit migraties
git add src/migrations/
git commit -m "feat: email marketing database migrations"
git push

# ════════════════════════════════════════
# STAGING
# ════════════════════════════════════════

# 1. Pull latest code
git pull origin main

# 2. Verify feature flags (staging .env)
grep ENABLE_EMAIL .env

# 3. Backup database (ALTIJD!)
pg_dump $DATABASE_URL > backup_before_email_migration.sql

# 4. Run migraties
npx payload migrate

# 5. Verify (zie Post-Migration Validation)

# 6. Smoke test
# - Create test subscriber
# - Create test list
# - Create test campaign
# - Check analytics

# ════════════════════════════════════════
# PRODUCTION
# ════════════════════════════════════════

# ⚠️ CRITICAL: BACKUP EERST!
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 1. Deploy code (Ploi/Vercel)
git push origin main

# 2. SSH naar server
ssh user@server

# 3. Run migraties
cd /path/to/app
npx payload migrate

# 4. Verify (zie Post-Migration Validation)

# 5. Monitor errors (Sentry)
# Check for migration-related errors

# 6. Rollback procedure (if needed):
npx payload migrate:rollback  # Rollback laatste migratie
# Of restore backup:
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

---

## 📊 PERFORMANCE BENCHMARKS

### Verwachte Query Performance (met indexes):

| Query Type | Without Index | With Index | Target |
|------------|---------------|------------|--------|
| Get subscribers by tenant | 500ms | 15ms | <50ms |
| Get active campaigns | 300ms | 20ms | <100ms |
| Get flow state by subscriber | 200ms | 10ms | <30ms |
| Campaign analytics aggregation | 1000ms | 150ms | <200ms |
| Email lookup (unsubscribe) | 400ms | 5ms | <10ms |

### Benchmark Script:

```bash
# Test query performance
psql $DATABASE_URL <<EOF
\timing on

-- Test 1: Subscriber lookup by tenant (should use index)
EXPLAIN ANALYZE
SELECT * FROM email_subscribers
WHERE tenant_id = 'test-tenant';

-- Test 2: Campaign by status (should use index)
EXPLAIN ANALYZE
SELECT * FROM email_campaigns
WHERE tenant_id = 'test-tenant'
  AND status = 'scheduled';

-- Test 3: Active flows (should use partial index)
EXPLAIN ANALYZE
SELECT * FROM email_flow_states
WHERE tenant_id = 'test-tenant'
  AND status = 'active'
  AND next_step_scheduled_at < NOW();

\timing off
EOF
```

**Verwachte output:**
```
Planning Time: 0.123 ms
Execution Time: 12.456 ms  # <50ms = GOOD!
```

---

## 🔄 ROLLBACK PROCEDURE

### Als migratie faalt:

```bash
# Option 1: Rollback laatste migratie
npx payload migrate:rollback

# Option 2: Rollback naar specifieke versie
npx payload migrate:rollback --to=20260224120000

# Option 3: Restore complete backup
psql $DATABASE_URL < backup_before_email_migration.sql
```

### Na rollback:

```bash
# 1. Fix migratie file
# 2. Test op verse DB
# 3. Re-run migratie
npx payload migrate
```

---

## 📚 REFERENTIES

- **Payload Migraties:** https://payloadcms.com/docs/database/migrations
- **PostgreSQL Indexes:** https://www.postgresql.org/docs/current/indexes.html
- **Multi-Tenancy Best Practices:** https://www.citusdata.com/blog/2017/03/09/multi-tenant-sharding/
- **Master Plan:** `docs/mail-engine/MASTER_IMPLEMENTATIEPLAN_v1.md`
- **Quick Reference:** `docs/mail-engine/QUICK_REFERENCE.md`

---

**Gemaakt:** 24 Februari 2026
**Door:** Claude (AI Assistant)
**Voor:** Email Marketing Engine - Fase 0
