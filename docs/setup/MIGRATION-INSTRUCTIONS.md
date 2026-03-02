# Database Migraties — Instructies voor Claude Lokaal

**Datum:** 2 maart 2026
**Status:** KRITIEK — lees dit volledig door

---

## TL;DR

> **De productie databases draaien op PostgreSQL. NOOIT SQLite-syntax gebruiken in migraties.**

---

## Wat er fout ging (2 maart 2026)

Claude lokaal genereerde `20260302_170000_complete_schema.ts` met **SQLite syntax**:

```sql
-- ❌ FOUT (SQLite)
"id" integer PRIMARY KEY NOT NULL
"is_default" integer DEFAULT false
"newsletter" integer DEFAULT false
"updated_at" text DEFAULT NOW() NOT NULL
"status" text DEFAULT 'active' NOT NULL
```

De productie draait op **PostgreSQL** en verwacht:

```sql
-- ✅ CORRECT (PostgreSQL)
"id" serial PRIMARY KEY NOT NULL
"is_default" boolean DEFAULT false
"newsletter" boolean DEFAULT false
"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
"status" "enum_carts_status" DEFAULT 'active' NOT NULL
```

### Verschiltabel

| Concept | SQLite | PostgreSQL |
|---------|--------|------------|
| Auto-increment ID | `integer PRIMARY KEY` | `serial PRIMARY KEY NOT NULL` |
| Boolean | `integer DEFAULT true/false` | `boolean DEFAULT true/false` |
| Datum/tijd | `text` | `timestamp(3) with time zone` |
| Select velden | `text DEFAULT 'value'` | `"enum_table_field" DEFAULT 'value'` |
| Timestamps | `text DEFAULT NOW()` | `timestamp(3) with time zone DEFAULT now()` |
| Sub-tabel ID | `text PRIMARY KEY NOT NULL` | `text PRIMARY KEY NOT NULL` (zelfde!) |

---

## Hoe migraties correct aan te maken

### Optie 1: Op de server genereren (AANBEVOLEN)

```bash
# SSH naar server
ssh ploi@server

# In de plastimed01 directory (heeft PostgreSQL)
cd /home/ploi/plastimed01.compassdigital.nl

# Genereer migratie (interactief - kies "create" voor nieuwe enums)
npx payload migrate:create

# De gegenereerde migratie staat in src/migrations/
# Kopieer naar source repo en commit
```

**Let op:** `migrate:create` is interactief en vraagt per enum of het nieuw is of hernoemd. Kies altijd de eerste optie (+ create) tenzij je zeker weet dat het een rename is.

### Optie 2: Handmatig schrijven

Als je een migratie handmatig schrijft, gebruik deze patronen (referentie: `src/migrations/old/20260221_083030_baseline_schema.ts`):

```typescript
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // ENUMs eerst (met IF NOT EXISTS via DO block)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_my_collection_status" AS ENUM('active', 'inactive');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `)

  // Tabel
  await db.execute(sql`CREATE TABLE IF NOT EXISTS "my_collection" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "is_active" boolean DEFAULT true,
    "status" "enum_my_collection_status" DEFAULT 'active' NOT NULL,
    "quantity" numeric DEFAULT 0,
    "parent_id" integer,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    FOREIGN KEY ("parent_id") REFERENCES "other_table"("id") ON UPDATE no action ON DELETE set null
  );
  `)

  // Indexes
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "my_collection_parent_idx" ON "my_collection" ("parent_id");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "my_collection_updated_at_idx" ON "my_collection" ("updated_at");`)
  await db.execute(sql`CREATE INDEX IF NOT EXISTS "my_collection_created_at_idx" ON "my_collection" ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "my_collection" CASCADE;`)
  await db.execute(sql`DROP TYPE IF EXISTS "public"."enum_my_collection_status";`)
}
```

### Optie 3: NOOIT doen

- `npx payload migrate:create` lokaal met SQLite adapter → genereert SQLite SQL
- Handmatig SQL schrijven zonder de PostgreSQL patronen te checken
- Een "complete schema" migratie die ALLE tabellen opnieuw aanmaakt

---

## Migratie structuur

```
src/migrations/
├── old/                          # Oude migraties (archief, niet verwijderen!)
│   ├── 20260221_083030_baseline_schema.ts
│   ├── 20260221_215821_sprint1_with_variable_products.ts
│   └── ... (13 totaal)
├── 20260302_170000_add_module_tables.ts  # Nieuwste: accounts, cart, checkout tabellen
└── index.ts                      # Importeert old/* + nieuwe migraties
```

### index.ts structuur

De `index.ts` importeert uit `./old/` voor bestaande migraties en `./` voor nieuwe:

```typescript
import * as migration_baseline from './old/20260221_083030_baseline_schema';
// ... andere old imports ...
import * as migration_new from './20260302_170000_add_module_tables';

export const migrations = [
  { up: migration_baseline.up, down: migration_baseline.down, name: '20260221_083030_baseline_schema' },
  // ... andere old entries ...
  { up: migration_new.up, down: migration_new.down, name: '20260302_170000_add_module_tables' },
];
```

---

## Checklist voor nieuwe migraties

- [ ] Import is `from '@payloadcms/db-postgres'` (NIET sqlite)
- [ ] Hoofd-tabel IDs: `"id" serial PRIMARY KEY NOT NULL`
- [ ] Sub-tabel IDs: `"id" text PRIMARY KEY NOT NULL`
- [ ] Booleans: `boolean DEFAULT true/false` (NOOIT `integer`)
- [ ] Datums: `timestamp(3) with time zone` (NOOIT `text`)
- [ ] Select velden: PostgreSQL ENUMs met `DO $$ BEGIN ... EXCEPTION` block
- [ ] Timestamps: `DEFAULT now()` (lowercase)
- [ ] Foreign keys met juiste ON DELETE (set null of cascade)
- [ ] Indexes voor FK kolommen, updated_at, created_at
- [ ] `down()` functie met DROP TABLE CASCADE + DROP TYPE
- [ ] Toegevoegd aan `index.ts`
- [ ] Naam volgt patroon: `YYYYMMDD_HHMMSS_beschrijving.ts`

---

## Huidige database staat (per 2 maart 2026)

- **Totaal tabellen:** 411 (402 bestaand + 9 nieuw)
- **Migraties:** 16 (15 oud + 1 nieuw)
- **Payload versie:** 3.x met `@payloadcms/db-postgres` (Drizzle ORM)
