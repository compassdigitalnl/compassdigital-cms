# MIGRATIES OPNIEUW GENEREREN — Instructies voor Claude lokaal

**Datum:** 2 maart 2026
**Prioriteit:** URGENT — alle 8 productie-sites hebben schema-problemen

---

## Probleem

De huidige migraties (`src/migrations/`) hebben meerdere bugs waardoor ze niet correct draaien op productie-databases:

### Bug 1: sprint10_schema referenceert niet-bestaande kolommen
**Bestand:** `20260224_200947_sprint10_schema.ts` (535KB!)
- Creëert `pages_blocks_video` tabel via `CREATE TABLE IF NOT EXISTS` (regel ~943)
- Maar de baseline migration creëerde die tabel al ZONDER `video_file_id`
- Vervolgens probeert de FK constraint `video_file_id` te refereren → **FAIL**
- Zelfde probleem voor `_pages_v_blocks_video`

### Bug 2: Products `_status` kolom mist
- Products collection heeft `versions.drafts: true` (Products.ts regel 27-32)
- Payload verwacht een `_status` kolom met enum type `enum_products__status` ('draft', 'published')
- Geen enkele migratie maakt deze kolom aan!
- Resultaat: Products API retourneert altijd 0 documenten
- De `_products_v` (versie-tabel) ontbreekt ook

### Bug 3: Footer schema incompleet
- Baseline maakt `footer` tabel met alleen 5 kolommen (id, bottom_text, show_social_links, updated_at, created_at)
- Latere migraties voegen GEEN kolommen toe (ze proberen een nieuwe CREATE TABLE die wordt overgeslagen door IF NOT EXISTS)
- Missende kolommen: `logo_type`, `logo_text`, `logo_accent`, `logo_image_id`, `tagline`, `show_contact_column`, `contact_heading`, `phone`, `email`, `address`, `opening_hours`, `copyright_text`
- Missende tabellen: `footer_social_links`, `footer_trust_badges`, `footer_legal_links`

### Bug 4: Placeholder-migraties doen niets
- `20260224_211305_email_marketing_collections.ts` → alleen een log-statement, geen SQL
- `20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory.ts` → idem
- `20260224_233259_email_api_keys_collection.ts` → idem
- Deze migraties gaan ervan uit dat "Payload auto-creates tables", maar dat gebeurt NIET in productie met migraties

### Bug 5: Dev-push vs migratie-conflicten
- CMS database had `push: true` (dev mode) actief → schema direct gepusht
- Daarna migraties proberen dezelfde changes opnieuw → `column already exists` errors
- `migrate:fresh` wist alles en runt alleen migraties 1-8, 9-13 falen

---

## Wat er op productie handmatig is gefixt

Om de sites draaiend te houden zijn deze handmatige fixes toegepast op alle 8 databases:

1. **`settings_shop_filter_order` tabel** — aangemaakt in alle databases
2. **Theme design tokens** — 47+ varchar kolommen toegevoegd (navy, teal, container_width, radius_sm, shadow_sm, z_dropdown, etc.)
3. **Footer tabellen** — `footer_social_links`, `footer_trust_badges`, `footer_legal_links` + icon kolom op `footer_columns_links`
4. **Products `_status`** — enum `enum_products__status` ('draft', 'published') + kolom
5. **CMS database** — `migrate:fresh` + handmatige schema-fix via gegenereerde migratie

---

## Opdracht: Alle migraties opnieuw genereren

### Stap 1: Verwijder alle bestaande migraties

```bash
rm src/migrations/20260221_083030_baseline_schema.ts
rm src/migrations/20260221_215821_sprint1_with_variable_products.ts
rm src/migrations/20260222_215225_add_ab_testing_collections.ts
rm src/migrations/20260222_215445_update_settings_ecommerce_fields.ts
rm src/migrations/20260222_233500_fix_blogposts_duplicate_meta.ts
rm src/migrations/20260223_115055_add_theme_status_colors_and_gradients.ts
rm src/migrations/20260224_110327_add_compass_design_tokens.ts
rm src/migrations/20260224_120000_add_themes_collection.ts
rm src/migrations/20260224_200947_sprint10_schema.ts
rm src/migrations/20260224_211305_email_marketing_collections.ts
rm src/migrations/20260224_211435_email_marketing_indexes.ts
rm src/migrations/20260224_232306_navigation_components_footer_breadcrumbs_account_subcategory.ts
rm src/migrations/20260224_233259_email_api_keys_collection.ts
rm src/migrations/20260302_142624.ts
rm src/migrations/20260302_142624.json
```

### Stap 2: Maak een schone SQLite database

```bash
# Verwijder bestaande dev database
rm -f payload.db

# Start dev server om schema te pushen (dit maakt ALLE tabellen)
DATABASE_URL=file:./payload-test.db npx next dev
# Wacht tot "Ready" verschijnt, stop dan met Ctrl+C

# Genereer migratie van de complete schema
npx payload migrate:create --name complete_schema
```

### Stap 3: Controleer de gegenereerde migratie

De gegenereerde migratie moet het COMPLETE schema bevatten. Controleer:

#### Moet aanwezig zijn:
- [ ] `CREATE TYPE "enum_products__status" AS ENUM ('draft', 'published')` — voor versioning
- [ ] `CREATE TABLE "products"` met `"_status" "enum_products__status" DEFAULT 'published'`
- [ ] `CREATE TABLE "_products_v"` — versie-tabel voor products
- [ ] `CREATE TABLE "_products_v_rels"` — relaties voor product versies
- [ ] `CREATE TABLE "footer"` met ALLE kolommen (logo_type, tagline, phone, email, etc.)
- [ ] `CREATE TABLE "footer_social_links"`
- [ ] `CREATE TABLE "footer_trust_badges"`
- [ ] `CREATE TABLE "footer_legal_links"`
- [ ] `CREATE TABLE "footer_columns_links"` met `icon` kolom
- [ ] `CREATE TABLE "pages_blocks_banner"`
- [ ] `CREATE TABLE "pages_blocks_hero_buttons"`
- [ ] `CREATE TABLE "pages_blocks_video"` met `video_file_id` kolom
- [ ] `CREATE TABLE "settings_shop_filter_order"`
- [ ] `CREATE TABLE "theme"` met alle design tokens (navy, teal, container_width, radius_sm, etc.)
- [ ] Email marketing tabellen (email_subscribers, email_lists, email_templates, etc.)
- [ ] Alle `enum_*__status` types voor collections met `versions.drafts`

#### FK constraints moeten ALTIJD verwijzen naar kolommen die in dezelfde statement worden aangemaakt:
- `pages_blocks_video.video_file_id` → kolom moet in CREATE TABLE staan, NIET via ALTER TABLE later
- Alle `_parent_id` FK's moeten geldig zijn

### Stap 4: Maak de migratie idempotent (BELANGRIJK!)

Bewerk de gegenereerde migratie zodat alle statements idempotent zijn:

```typescript
// ❌ FOUT — faalt als type al bestaat
CREATE TYPE "enum_foo" AS ENUM ('a', 'b');

// ✅ GOED — skip als type al bestaat
DO $$ BEGIN CREATE TYPE "enum_foo" AS ENUM ('a', 'b'); EXCEPTION WHEN duplicate_object THEN null; END $$;

// ❌ FOUT — faalt als tabel al bestaat
CREATE TABLE "foo" (...);

// ✅ GOED
CREATE TABLE IF NOT EXISTS "foo" (...);

// ❌ FOUT — faalt als kolom al bestaat
ALTER TABLE "foo" ADD COLUMN "bar" varchar;

// ✅ GOED
ALTER TABLE "foo" ADD COLUMN IF NOT EXISTS "bar" varchar;

// ❌ FOUT — faalt als constraint al bestaat
ALTER TABLE "foo" ADD CONSTRAINT "foo_bar_fk" FOREIGN KEY ...;

// ✅ GOED
DO $$ BEGIN ALTER TABLE "foo" ADD CONSTRAINT "foo_bar_fk" FOREIGN KEY ...; EXCEPTION WHEN duplicate_object THEN null; END $$;
```

### Stap 5: Test op een verse database

```bash
# Maak een nieuwe test database
DATABASE_URL=postgresql://... npx payload migrate:fresh
# Moet ALLE migraties succesvol draaien
npx payload migrate:status
# Alle migraties moeten "Yes" zijn
```

### Stap 6: Test op een bestaande database

```bash
# Kopieer de productie-database naar een test-database
# Run de migratie tegen de test-database
# Controleer dat er GEEN errors zijn
```

### Stap 7: Update index.ts

```typescript
// src/migrations/index.ts
import * as migration_complete_schema from './YYYYMMDD_HHMMSS_complete_schema';

export const migrations = [
  {
    up: migration_complete_schema.up,
    down: migration_complete_schema.down,
    name: 'YYYYMMDD_HHMMSS_complete_schema',
  },
];
```

---

## Databases op productie

Na het deployen van de nieuwe migratie moet op de server:

1. **Backup maken** (automatisch via deploy-ploi.sh)
2. **payload_migrations tabel legen** in ALLE 8 databases:
   ```sql
   DELETE FROM payload_migrations;
   ```
3. **Deploy** via `deploy-ploi.sh` (per site) of `deploy-all.sh`
4. De nieuwe migratie zal als "batch 1" draaien op een bestaande database

### Database verbindingen (Railway PostgreSQL)

| Database | Site(s) |
|----------|---------|
| `railway` | cms.compassdigital.nl |
| `client_plastimed01` | plastimed01 |
| `client_aboland01` | aboland01 |
| `client_beauty01` | beauty01 |
| `client_construction01` | construction01 |
| `client_content01` | content01 |
| `client_horeca01` | horeca01 |
| `client_hospitality01` | hospitality01 |

---

## Collections met versions.drafts (hebben `_status` kolom nodig)

Controleer in de collection configs welke `versions.drafts: true` hebben:

| Collection | Slug | versions.drafts | Heeft `_status` nodig |
|-----------|------|-----------------|----------------------|
| Products | products | ✅ true | ✅ Ja |
| Pages | pages | ✅ true | ✅ Ja |
| Blog Posts | blog-posts | ✅ true | ✅ Ja |

Check ook: Cases, FAQs, Testimonials, Partners, Services — als die ook drafts hebben.

### Globals met versions.drafts

| Global | Slug | versions.drafts |
|--------|------|-----------------|
| Theme | theme | Check! |
| Settings | settings | Check! |
| Header | header | Check! |
| Footer | footer | Check! |

---

## Samenvatting

**Waarom dit nodig is:**
- 14 losse migraties met bugs → 1 schone migratie die het complete schema correct aanmaakt
- Alle tabellen, kolommen, enum types, FK constraints in de juiste volgorde
- Idempotent zodat het veilig is om opnieuw te draaien

**Wat er misgaat als dit niet wordt opgelost:**
- Products API retourneert 0 documenten (shop is leeg)
- Footer crash bij eerste bezoek
- CMS database kan niet migreren (constraint errors)
- Elke nieuwe deploy kan schema-problemen veroorzaken

**Prioriteit:** URGENT — plastimed01 shop werkt niet correct
