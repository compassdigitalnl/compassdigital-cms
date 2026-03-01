# Product Types - Database Migration Template
**Date:** 1 Maart 2026
**Database:** PostgreSQL (NOT SQLite!)

---

## ⚠️ CRITICAL WARNINGS

**BEFORE GENERATING MIGRATION:**

1. ✅ Set feature flags to `true` in `.env` for ALL features you want to include:
   ```bash
   ENABLE_VARIABLE_PRODUCTS=true
   ENABLE_PERSONALIZATION=true
   ENABLE_CONFIGURATOR=true
   ENABLE_SUBSCRIPTIONS=true
   ENABLE_BUNDLES=true
   ENABLE_MIX_MATCH=true
   ```

2. ✅ **Payload AUTO-CREATES tables** based on collection schemas
   - You DON'T need to manually create tables in migrations
   - Migrations are ONLY needed for custom SQL operations
   - When you add fields to Products.ts, Payload creates the columns automatically

3. ✅ **PostgreSQL syntax (NOT SQLite):**
   - ❌ NEVER use `@payloadcms/db-sqlite`
   - ✅ ALWAYS use `@payloadcms/db-postgres`
   - ❌ NEVER use `db.run()`
   - ✅ ALWAYS use `db.execute()`
   - ❌ NEVER use backticks ` for identifiers
   - ✅ ALWAYS use double quotes " for identifiers

---

## 📋 MIGRATION GENERATION STEPS

### Step 1: Update Products Collection Schema

**File:** `packages/modules/catalog/collections/Products.ts`

Add the new fields to the Products collection schema. Payload will automatically create the database columns when you restart the server.

**Example additions:**

```typescript
// Add to the fields array in Products.ts:
{
  type: 'tabs',
  tabs: [
    // ... existing tabs ...

    // VARIABLE PRODUCTS TAB (conditionally included)
    ...(process.env.ENABLE_VARIABLE_PRODUCTS === 'true'
      ? [
          {
            label: 'Varianten',
            description: 'Product varianten zoals maat, kleur',
            fields: [
              {
                name: 'variantOptions',
                type: 'array',
                label: 'Variant Opties',
                fields: [
                  {
                    name: 'optionName',
                    type: 'text',
                    required: true,
                    label: 'Optie Naam (bijv. "Kleur", "Maat")',
                  },
                  {
                    name: 'displayType',
                    type: 'select',
                    required: true,
                    label: 'Display Type',
                    options: [
                      { label: 'Kleur Swatches', value: 'colorSwatch' },
                      { label: 'Maat Radio Buttons', value: 'sizeRadio' },
                      { label: 'Dropdown', value: 'dropdown' },
                      { label: 'Afbeelding Radio', value: 'imageRadio' },
                      { label: 'Checkbox (Add-ons)', value: 'checkbox' },
                    ],
                  },
                  {
                    name: 'required',
                    type: 'checkbox',
                    label: 'Verplicht',
                    defaultValue: false,
                  },
                  {
                    name: 'values',
                    type: 'array',
                    label: 'Waarden',
                    fields: [
                      {
                        name: 'label',
                        type: 'text',
                        required: true,
                        label: 'Label (bijv. "Rood", "Large")',
                      },
                      {
                        name: 'value',
                        type: 'text',
                        required: true,
                        label: 'Waarde (slug)',
                      },
                      {
                        name: 'priceModifier',
                        type: 'number',
                        label: 'Prijs Aanpassing (€)',
                        admin: {
                          description: 'Extra kosten voor deze variant (bijv. +5 voor XL)',
                        },
                      },
                      {
                        name: 'stock',
                        type: 'number',
                        label: 'Voorraad',
                        admin: {
                          description: 'Voorraad voor deze specifieke variant',
                        },
                      },
                      {
                        name: 'colorHex',
                        type: 'text',
                        label: 'Kleur Hex Code',
                        admin: {
                          description: 'Voor colorSwatch type (bijv. #FF0000)',
                          condition: (data, siblingData, { user }) => {
                            // Show only if parent displayType is colorSwatch
                            return true // You'd need to access parent data here
                          },
                        },
                      },
                      {
                        name: 'image',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Afbeelding',
                        admin: {
                          description: 'Voor imageRadio type',
                        },
                      },
                      {
                        name: 'disabled',
                        type: 'checkbox',
                        label: 'Uitgeschakeld',
                        defaultValue: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]
      : []),

    // PERSONALIZATION TAB (conditionally included)
    ...(process.env.ENABLE_PERSONALIZATION === 'true'
      ? [
          {
            label: 'Personalisatie',
            description: 'Personalisatie opties (graveren, monogrammen, etc.)',
            fields: [
              {
                name: 'personalizationOptions',
                type: 'array',
                label: 'Personalisatie Opties',
                fields: [
                  {
                    name: 'fieldName',
                    type: 'text',
                    required: true,
                    label: 'Veld Naam (bijv. "Graveer Tekst")',
                  },
                  {
                    name: 'fieldType',
                    type: 'select',
                    required: true,
                    label: 'Veld Type',
                    options: [
                      { label: 'Tekst Invoer', value: 'text' },
                      { label: 'Lettertype Kiezer', value: 'font' },
                      { label: 'Kleur Kiezer', value: 'color' },
                      { label: 'Afbeelding Upload', value: 'image' },
                    ],
                  },
                  {
                    name: 'required',
                    type: 'checkbox',
                    label: 'Verplicht',
                    defaultValue: false,
                  },
                  {
                    name: 'maxLength',
                    type: 'number',
                    label: 'Max Lengte (karakters)',
                    admin: {
                      description: 'Voor tekst invoer velden',
                    },
                  },
                  {
                    name: 'priceModifier',
                    type: 'number',
                    label: 'Prijs Aanpassing (€)',
                    admin: {
                      description: 'Extra kosten voor personalisatie',
                    },
                  },
                  {
                    name: 'productionTimeAdded',
                    type: 'number',
                    label: 'Extra Productie Tijd (dagen)',
                    admin: {
                      description: 'Hoe veel langer duurt productie met personalisatie',
                    },
                  },
                ],
              },
            ],
          },
        ]
      : []),

    // CONFIGURATOR TAB (conditionally included)
    ...(process.env.ENABLE_CONFIGURATOR === 'true'
      ? [
          {
            label: 'Configurator',
            description: 'Multi-step product configuratie',
            fields: [
              {
                name: 'configuratorSteps',
                type: 'array',
                label: 'Configuratie Stappen',
                fields: [
                  {
                    name: 'stepNumber',
                    type: 'number',
                    required: true,
                    label: 'Stap Nummer',
                    admin: {
                      description: 'Volgorde van deze stap (1, 2, 3, ...)',
                    },
                  },
                  {
                    name: 'title',
                    type: 'text',
                    required: true,
                    label: 'Stap Titel',
                  },
                  {
                    name: 'description',
                    type: 'textarea',
                    label: 'Stap Beschrijving',
                  },
                  {
                    name: 'required',
                    type: 'checkbox',
                    label: 'Verplicht',
                    defaultValue: true,
                  },
                  {
                    name: 'options',
                    type: 'array',
                    label: 'Opties',
                    fields: [
                      {
                        name: 'name',
                        type: 'text',
                        required: true,
                        label: 'Optie Naam',
                      },
                      {
                        name: 'description',
                        type: 'textarea',
                        label: 'Beschrijving',
                      },
                      {
                        name: 'price',
                        type: 'number',
                        required: true,
                        label: 'Prijs (€)',
                      },
                      {
                        name: 'image',
                        type: 'upload',
                        relationTo: 'media',
                        label: 'Afbeelding',
                      },
                      {
                        name: 'recommended',
                        type: 'checkbox',
                        label: 'Aanbevolen',
                        defaultValue: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ]
      : []),

    // SUBSCRIPTION TAB (conditionally included)
    ...(process.env.ENABLE_SUBSCRIPTIONS === 'true'
      ? [
          {
            label: 'Abonnement',
            description: 'Abonnement opties en prijzen',
            fields: [
              {
                name: 'subscriptionOptions',
                type: 'group',
                label: 'Abonnement Instellingen',
                fields: [
                  {
                    name: 'frequencies',
                    type: 'array',
                    label: 'Frequenties',
                    fields: [
                      {
                        name: 'interval',
                        type: 'select',
                        required: true,
                        label: 'Interval',
                        options: [
                          { label: 'Dag', value: 'day' },
                          { label: 'Week', value: 'week' },
                          { label: 'Maand', value: 'month' },
                          { label: 'Jaar', value: 'year' },
                        ],
                      },
                      {
                        name: 'intervalCount',
                        type: 'number',
                        required: true,
                        label: 'Interval Aantal',
                        admin: {
                          description: 'Bijv. elke 2 weken = intervalCount: 2, interval: week',
                        },
                      },
                      {
                        name: 'discount',
                        type: 'number',
                        label: 'Korting (%)',
                        admin: {
                          description: 'Percentage korting voor deze frequentie',
                        },
                      },
                    ],
                  },
                  {
                    name: 'minSubscriptionLength',
                    type: 'number',
                    label: 'Minimale Looptijd (maanden)',
                  },
                  {
                    name: 'maxSubscriptionLength',
                    type: 'number',
                    label: 'Maximale Looptijd (maanden)',
                  },
                  {
                    name: 'cancellationPolicy',
                    type: 'textarea',
                    label: 'Annuleringsbeleid',
                  },
                ],
              },
            ],
          },
        ]
      : []),
  ],
},
```

### Step 2: Restart Payload (Auto-Migration)

**IMPORTANT:** Payload will automatically create all necessary database tables and columns when you restart the server!

```bash
# Development (auto-migrates)
npm run dev

# OR Production (runs migrations first)
npm run build
npm start
```

**What Payload does automatically:**
1. Reads your collection schema from Products.ts
2. Detects new fields (variantOptions, personalizationOptions, etc.)
3. Creates database columns with correct types
4. Creates necessary indexes
5. Sets up foreign key constraints

**You DON'T need to write SQL migrations for standard Payload fields!**

---

## 🔧 MANUAL MIGRATION (Only if needed)

**99% of the time you DON'T need this!** Payload handles schema changes automatically.

**Only create a manual migration if:**
- You need custom SQL operations
- You're adding custom indexes
- You're doing data transformations
- You're adding constraints beyond what Payload creates

### Generate Migration (if needed)

```bash
# 1. Ensure feature flags are ON in .env
echo "ENABLE_VARIABLE_PRODUCTS=true" >> .env
echo "ENABLE_PERSONALIZATION=true" >> .env
echo "ENABLE_CONFIGURATOR=true" >> .env
echo "ENABLE_SUBSCRIPTIONS=true" >> .env

# 2. Generate migration
npx payload migrate:create product_types_enhancement

# 3. Check generated file
# It will be in: src/migrations/YYYYMMDD_HHMMSS_product_types_enhancement.ts
```

### Manual Migration Template (PostgreSQL)

**File:** `src/migrations/YYYYMMDD_HHMMSS_product_types_enhancement.ts`

```typescript
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Product Types Enhancement Migration
 *
 * NOTE: Payload auto-creates tables and columns!
 * This migration is ONLY for custom SQL operations.
 *
 * ⚠️ PostgreSQL ONLY:
 * - Uses @payloadcms/db-postgres (NOT db-sqlite)
 * - Uses db.execute() (NOT db.run())
 * - Uses double quotes " for identifiers (NOT backticks `)
 */

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { db } = payload

  // ==================================================
  // PAYLOAD AUTO-CREATES THESE TABLES/COLUMNS!
  // ==================================================
  // You DON'T need to create:
  // - products_variant_options (Payload creates this)
  // - products_variant_options_values (Payload creates this)
  // - products_personalization_options (Payload creates this)
  // - products_configurator_steps (Payload creates this)
  // - products_configurator_steps_options (Payload creates this)
  // - products_subscription_options (Payload creates this)

  // ==================================================
  // CUSTOM SQL (only if you need it)
  // ==================================================

  // Example: Add custom index for faster variant lookups
  await db.execute(
    sql`
      CREATE INDEX IF NOT EXISTS "idx_products_variant_options_display_type"
      ON "products_variant_options" ("display_type")
    `
  )

  // Example: Add custom index for personalization fields
  await db.execute(
    sql`
      CREATE INDEX IF NOT EXISTS "idx_products_personalization_field_type"
      ON "products_personalization_options" ("field_type")
    `
  )

  // Example: Add custom index for configurator steps ordering
  await db.execute(
    sql`
      CREATE INDEX IF NOT EXISTS "idx_products_configurator_steps_number"
      ON "products_configurator_steps" ("step_number")
    `
  )

  console.log('✅ Product types enhancement migration completed')
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const { db } = payload

  // ==================================================
  // ROLLBACK (only custom changes)
  // ==================================================

  // Drop custom indexes
  await db.execute(
    sql`DROP INDEX IF EXISTS "idx_products_variant_options_display_type"`
  )

  await db.execute(
    sql`DROP INDEX IF EXISTS "idx_products_personalization_field_type"`
  )

  await db.execute(
    sql`DROP INDEX IF EXISTS "idx_products_configurator_steps_number"`
  )

  // ⚠️ DON'T drop Payload-managed tables!
  // Payload handles table/column removal automatically

  console.log('✅ Product types enhancement migration rolled back')
}
```

---

## 🧪 TESTING MIGRATION

### Test on Fresh Database

```bash
# 1. Backup current database
pg_dump -U your_user -d your_database > backup.sql

# 2. Create test database
createdb test_payload_db

# 3. Update .env to use test database
DATABASE_URL=postgresql://user:pass@localhost:5432/test_payload_db

# 4. Run migrations
npx payload migrate

# 5. Verify tables exist
psql -d test_payload_db -c "\dt products*"

# Expected output:
# - products
# - products_variant_options
# - products_variant_options_values
# - products_personalization_options
# - products_configurator_steps
# - products_configurator_steps_options
# - products_subscription_options (if enabled)

# 6. Check columns
psql -d test_payload_db -c "\d products_variant_options"

# 7. Restore original database
DATABASE_URL=postgresql://user:pass@localhost:5432/your_database
```

### Verify Migration Success

```bash
# Check migration status
npx payload migrate:status

# Expected output:
# ✅ YYYYMMDD_HHMMSS_product_types_enhancement.ts - COMPLETED

# Rollback if needed (testing only!)
npx payload migrate:down

# Re-run if needed
npx payload migrate
```

---

## 📊 EXPECTED DATABASE SCHEMA

### Tables Created by Payload

**1. products_variant_options**
```sql
CREATE TABLE "products_variant_options" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY,
  "option_name" varchar,
  "display_type" varchar,
  "required" boolean DEFAULT false,
  FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE CASCADE
);
```

**2. products_variant_options_values**
```sql
CREATE TABLE "products_variant_options_values" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY,
  "label" varchar,
  "value" varchar,
  "price_modifier" numeric,
  "stock" integer,
  "color_hex" varchar,
  "image_id" integer,
  "disabled" boolean DEFAULT false,
  FOREIGN KEY ("_parent_id") REFERENCES "products_variant_options"("id") ON DELETE CASCADE,
  FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL
);
```

**3. products_personalization_options**
```sql
CREATE TABLE "products_personalization_options" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY,
  "field_name" varchar,
  "field_type" varchar,
  "required" boolean DEFAULT false,
  "max_length" integer,
  "price_modifier" numeric,
  "production_time_added" integer,
  FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE CASCADE
);
```

**4. products_configurator_steps**
```sql
CREATE TABLE "products_configurator_steps" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY,
  "step_number" integer,
  "title" varchar,
  "description" text,
  "required" boolean DEFAULT true,
  FOREIGN KEY ("_parent_id") REFERENCES "products"("id") ON DELETE CASCADE
);
```

**5. products_configurator_steps_options**
```sql
CREATE TABLE "products_configurator_steps_options" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" integer PRIMARY KEY,
  "name" varchar,
  "description" text,
  "price" numeric,
  "image_id" integer,
  "recommended" boolean DEFAULT false,
  FOREIGN KEY ("_parent_id") REFERENCES "products_configurator_steps"("id") ON DELETE CASCADE,
  FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL
);
```

**6. products_subscription_options (group field - stored in products table)**
```sql
-- Stored as JSONB in products table:
ALTER TABLE "products" ADD COLUMN "subscription_options" jsonb;
```

---

## 🚀 DEPLOYMENT WORKFLOW

### Development → Production

```bash
# ==================================================
# LOCAL DEVELOPMENT
# ==================================================

# 1. Update Products.ts with new fields
# 2. Set feature flags in .env
ENABLE_VARIABLE_PRODUCTS=true
ENABLE_PERSONALIZATION=true
ENABLE_CONFIGURATOR=true

# 3. Restart dev server (auto-migrates)
npm run dev

# 4. Verify in /admin panel
# - Create test product
# - Fill in variant options
# - Save and check database

# 5. Test migration generation (optional)
npx payload migrate:create product_types_test

# 6. Check generated migration file
cat src/migrations/*_product_types_test.ts

# 7. Commit to git
git add packages/modules/catalog/collections/Products.ts
git add src/migrations/  # If you generated a migration
git commit -m "feat: Add product types (variable, personalization, configurator)"
git push

# ==================================================
# PRODUCTION SERVER
# ==================================================

# 1. Pull latest code
git pull

# 2. Set feature flags in production .env
echo "ENABLE_VARIABLE_PRODUCTS=true" >> .env
echo "ENABLE_PERSONALIZATION=true" >> .env
echo "ENABLE_CONFIGURATOR=true" >> .env

# 3. Run migrations (if you created any)
npx payload migrate

# 4. Build and restart
npm run build
pm2 restart payload-app

# 5. Verify
curl https://yourdomain.com/admin
# Check that new tabs appear in Products collection

# 6. Monitor logs
pm2 logs payload-app
```

---

## ⚠️ COMMON PITFALLS

### ❌ Wrong Database Import
```typescript
// WRONG - SQLite:
import { MigrateUpArgs } from '@payloadcms/db-sqlite'
await db.run(sql`...`)
```

### ✅ Correct Database Import
```typescript
// CORRECT - PostgreSQL:
import { MigrateUpArgs } from '@payloadcms/db-postgres'
await db.execute(sql`...`)
```

### ❌ Wrong SQL Syntax
```sql
-- WRONG - SQLite backticks:
CREATE TABLE `products_variant_options` (
  `id` integer PRIMARY KEY,
  `option_name` varchar
)
```

### ✅ Correct SQL Syntax
```sql
-- CORRECT - PostgreSQL double quotes:
CREATE TABLE "products_variant_options" (
  "id" serial PRIMARY KEY,
  "option_name" varchar
)
```

### ❌ Feature Flags OFF During Migration
```bash
# WRONG - flags disabled:
ENABLE_VARIABLE_PRODUCTS=false
npx payload migrate:create product_types
# Result: Migration doesn't include variant fields!
```

### ✅ Feature Flags ON During Migration
```bash
# CORRECT - flags enabled:
ENABLE_VARIABLE_PRODUCTS=true
npx payload migrate:create product_types
# Result: Migration includes all variant fields ✅
```

---

## 📋 FINAL CHECKLIST

### Before Generating Migration:
- [ ] Feature flags set to `true` in `.env`
- [ ] Products.ts updated with new fields
- [ ] Payload server restarted (auto-migration test)
- [ ] Admin panel shows new tabs/fields
- [ ] Test product created and saved successfully

### After Generating Migration:
- [ ] Migration file uses `@payloadcms/db-postgres`
- [ ] Migration file uses `db.execute()` (not `db.run()`)
- [ ] SQL uses double quotes " (not backticks `)
- [ ] Migration tested on fresh database
- [ ] All expected tables exist
- [ ] All expected columns exist
- [ ] Foreign keys working correctly
- [ ] Rollback tested (`migrate:down`)

### Production Deployment:
- [ ] Feature flags set in production `.env`
- [ ] Code pushed to git
- [ ] Server pulled latest code
- [ ] Migrations run successfully
- [ ] App built and restarted
- [ ] Admin panel accessible
- [ ] New fields visible and working
- [ ] Test product created in production

---

## 🎯 SUMMARY

**Key Takeaway:** **Payload auto-creates database tables and columns!**

**You DON'T need manual migrations for:**
- Adding new fields to collections
- Adding new arrays/groups
- Adding new relationships
- Changing field types (in most cases)

**You ONLY need manual migrations for:**
- Custom indexes
- Custom constraints
- Data transformations
- Complex SQL operations

**Migration Workflow:**
1. Update Products.ts with new fields
2. Set feature flags to `true`
3. Restart Payload (auto-migrates)
4. Test in admin panel
5. (Optional) Generate migration for custom SQL
6. Deploy to production

**DONE! 🎉**
