# 🎨 SPRINT 3: Shared Blocks - Complete Refactor to Compass Design System

**Sprint:** 3 van X
**Datum:** 24 Februari 2026
**Status:** ⏳ READY TO START
**Impact:** 🟢 High - Field additions + renames + tab structure, but safe migrations
**Database Impact:** ✅ Safe - Only ADD COLUMN + RENAME statements, no data loss

---

## 📋 EXECUTIVE SUMMARY

### Doel Sprint 3
Complete refactor van 6 core shared blocks naar Compass Design System Sprint 3 specificaties met enhanced fields, tab structure, en nieuwe varianten:

**Blocks to Update:**
1. **Hero** (B01) - 3 variants, conditional backgrounds, enhanced CTAs
2. **Features** (B02) - Icon styles, alignment options, grid variants (rename from Services.ts!)
3. **CTA** (B03) - Background styles, layout variants, button constraints
4. **FAQ** (B04) - Two-column layout, animation specs
5. **Content** (B05) - Width constraints, enhanced rich text
6. **Testimonials** (B06) - 3 variants (grid/carousel/featured), star ratings

### Status Existing Blocks
**ALLE 6 BLOCKS BESTAAN AL** - Dit zijn COMPLETE REFACTORS naar nieuwe spec!

### Waarom deze aanpak?
- **Design System Alignment:** Alle blocks volgen Compass Design System specs exact
- **Tab Structure:** Content + Design tabs voor betere admin UX (zoals Sprint 2)
- **Type-safe:** TypeScript interfaces worden uitgebreid/vervangen
- **Database-safe:** Alleen nieuwe kolommen + safe renames, geen data verlies
- **Variant Support:** Multiple layout/style variants per block
- **CMS-controlled:** Admin kan alle opties beheren zonder code changes
- **Backward Compatible:** Bestaande block instances blijven werken met default values

### Wat er NIET gebeurt (veiligheid)
- ❌ **GEEN bestaande data verwijderd** (alleen safe column adds/renames)
- ❌ **GEEN breaking changes in database schema**
- ❌ **GEEN frontend components touched** (Sprint 4 - later)
- ✅ **ALLEEN CMS config updates** + database migrations

---

## 🎯 SCOPE & DELIVERABLES

### In Scope (Sprint 3)

**Block Updates (6 blocks)**
- [ ] Hero (B01) - 3 variants, conditional fields, buttons array
- [ ] Features (B02) - Icon styles, alignment, min/max constraints
- [ ] CTA (B03) - Background styles, layout variants, max 2 buttons
- [ ] FAQ (B04) - Two-column variant, animation docs
- [ ] Content (B05) - Width constraints (640px/900px/100%)
- [ ] Testimonials (B06) - 3 variants, star ratings, avatar fallbacks

**Infrastructure**
- [ ] TypeScript type updates (6 files)
- [ ] Database migrations (6 migrations)
- [ ] File rename: Services.ts → Features.ts (consistency!)
- [ ] Admin panel tab organization (all 6 blocks)

**Testing & Documentation**
- [ ] Testing checklist (42 tests total - 7 per block)
- [ ] Rollback procedure
- [ ] Complete documentation

### Out of Scope (Later Sprints)
- ⏭️ Frontend React components refactoring (Sprint 4)
- ⏭️ Component carousel/animation implementation (Sprint 4)
- ⏭️ Icon picker UI enhancements (Sprint 5)

---

## 📊 DETAILED BLOCK COMPARISON

### Block 1: Hero (B01)

**Current Implementation:** `src/branches/shared/blocks/Hero.ts` (172 lines)

**Existing Fields:**
```typescript
{
  style: select ['default', 'image', 'gradient', 'minimal'] ✅ UPDATE to variants
  layout: select ['centered', 'two-column'] ✅ MERGE into variant
  sectionLabelField ❌ REMOVE (not in spec)
  badge: text ✅ RENAME to 'subtitle'
  title: text ✅ KEEP
  titleAccent: text ❌ REMOVE (handled in frontend)
  subtitle: textarea ✅ RENAME to 'description'
  primaryCTA: group { text, link } ✅ REPLACE with buttons array
  secondaryCTA: group { text, link } ✅ REPLACE with buttons array
  stats: array (conditional on layout='two-column') ❌ REMOVE (not in spec)
  backgroundImage: upload ✅ KEEP (but make conditional)
  backgroundImageUrl: text ❌ REMOVE (not needed)
}
```

**Sprint 3 Spec Changes (MAJOR):**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // NEW: Subtitle (was 'badge')
        subtitle: text {
          label: 'Subtitle'
          admin: { description: 'Small overline text (e.g., "Welkom bij...")' }
        }

        // KEEP: Title
        title: text {
          label: 'Title'
          required: true
        }

        // NEW: Description (was 'subtitle')
        description: richText {
          label: 'Description'
          editor: lexicalEditor()
        }

        // NEW: Buttons array (replaces primaryCTA + secondaryCTA)
        buttons: array {
          label: 'Call to Action Buttons'
          minRows: 1
          maxRows: 3
          fields: [
            { name: 'label', type: 'text', required: true }
            { name: 'link', type: 'text', required: true }
            {
              name: 'style'
              type: 'select'
              options: ['primary', 'secondary', 'ghost']
              defaultValue: 'primary'
            }
          ]
        }
      ]
    },
    {
      label: 'Design'
      fields: [
        // NEW: Variant (replaces style + layout)
        variant: select {
          label: 'Layout Variant'
          defaultValue: 'default'
          options: [
            { label: 'Default (Full-width, centered)', value: 'default' }
            { label: 'Split (Text left, image right)', value: 'split' }
            { label: 'Centered Compact', value: 'centered' }
          ]
        }

        // NEW: Background Style
        backgroundStyle: select {
          label: 'Background Style'
          defaultValue: 'gradient'
          options: [
            { label: 'Gradient (Navy to Dark)', value: 'gradient' }
            { label: 'Solid Color', value: 'solid' }
            { label: 'Image', value: 'image' }
          ]
        }

        // NEW: Background Color (conditional)
        backgroundColor: select {
          label: 'Background Color'
          defaultValue: 'navy'
          options: ['navy', 'white', 'bg', 'teal']
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundStyle === 'solid'
          }
        }

        // KEEP: Background Image (now conditional)
        backgroundImage: upload {
          relationTo: 'media'
          admin: {
            condition: (data, siblingData) => siblingData?.backgroundStyle === 'image'
          }
        }
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_hero"
  RENAME COLUMN "badge" TO "subtitle";
ALTER TABLE "pages_blocks_hero"
  RENAME COLUMN "subtitle" TO "description";
ALTER TABLE "pages_blocks_hero"
  RENAME COLUMN "style" TO "variant";

-- Add new columns
ALTER TABLE "pages_blocks_hero"
  ADD COLUMN "background_style" VARCHAR(20) DEFAULT 'gradient',
  ADD COLUMN "background_color" VARCHAR(10) DEFAULT 'navy';

-- Drop obsolete columns
ALTER TABLE "pages_blocks_hero"
  DROP COLUMN IF EXISTS "section_label",
  DROP COLUMN IF EXISTS "title_accent",
  DROP COLUMN IF EXISTS "layout",
  DROP COLUMN IF EXISTS "background_image_url";

-- Drop and recreate buttons table (replacing CTA groups)
DROP TABLE IF EXISTS "pages_blocks_hero_stats";

CREATE TABLE IF NOT EXISTS "pages_blocks_hero_buttons" (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  link VARCHAR(255) NOT NULL,
  style VARCHAR(20) DEFAULT 'primary',
  _order INTEGER
);

-- Migrate existing CTA data to buttons array
INSERT INTO "pages_blocks_hero_buttons" (parent_id, label, link, style, _order)
SELECT
  id as parent_id,
  primary_cta->>'text' as label,
  primary_cta->>'link' as link,
  'primary' as style,
  1 as _order
FROM "pages_blocks_hero"
WHERE primary_cta IS NOT NULL AND primary_cta->>'text' IS NOT NULL;

INSERT INTO "pages_blocks_hero_buttons" (parent_id, label, link, style, _order)
SELECT
  id as parent_id,
  secondary_cta->>'text' as label,
  secondary_cta->>'link' as link,
  'secondary' as style,
  2 as _order
FROM "pages_blocks_hero"
WHERE secondary_cta IS NOT NULL AND secondary_cta->>'text' IS NOT NULL;

-- Drop old CTA columns
ALTER TABLE "pages_blocks_hero"
  DROP COLUMN IF EXISTS "primary_cta",
  DROP COLUMN IF EXISTS "secondary_cta";
```

**Impact:**
- ⚠️ **MAJOR REFACTOR:** Buttons array replaces CTA groups (data migration!)
- ⚠️ Multiple column renames (safe - preserves data)
- ⚠️ Stats array removed (not in spec)
- ⚠️ Layout merge into variant (simplification)
- ✅ Tab structure improves admin UX

---

### Block 2: Features (B02) - **FILE RENAME REQUIRED!**

**Current Implementation:** `src/branches/shared/blocks/Services.ts` (226 lines)
**⚠️ RENAME FILE TO:** `src/branches/shared/blocks/Features.ts` (slug already 'features')

**Existing Fields:**
```typescript
{
  sectionLabelField ❌ REMOVE (not in spec)
  heading: text ✅ RENAME to 'title'
  intro: textarea ✅ RENAME to 'description'
  backgroundStyle: select ['light', 'dark'] ❌ REMOVE (not in spec)
  source: select ['collection', 'manual'] ❌ REMOVE (always manual in spec)
  services: relationship (hasMany) ❌ REMOVE (always manual)
  category: select ❌ REMOVE (no collection mode)
  limit: number ❌ REMOVE (no collection mode)
  showFeaturedOnly: checkbox ❌ REMOVE (no collection mode)
  features: array { iconType, iconName, iconUpload, name, description, link } ✅ SIMPLIFY
  layout: select ['horizontal', 'grid-2'...'grid-6'] ✅ UPDATE to variant
  style: select ['cards', 'clean', 'trust-bar'] ❌ REMOVE (not in spec)
  showHoverEffect: checkbox ❌ REMOVE (always enabled in spec)
}
```

**Sprint 3 Spec Changes:**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // RENAME: heading → title
        title: text {
          label: 'Section Title'
          admin: { description: 'Optional heading for the features section' }
        }

        // RENAME: intro → description
        description: textarea {
          label: 'Description'
          admin: { rows: 2 }
        }

        // SIMPLIFY: features array (remove collection mode, iconType complexity)
        features: array {
          label: 'Features / USPs'
          minRows: 2 // NEW constraint
          maxRows: 12 // NEW constraint
          fields: [
            {
              name: 'icon'
              type: 'text'
              label: 'Icon (Lucide)'
              required: true
              admin: {
                description: 'Lucide icon name (e.g., Shield, Zap, Award)'
                components: {
                  Field: '@/branches/shared/components/admin/IconPickerField#IconPickerField'
                }
              }
            }
            {
              name: 'title'
              type: 'text'
              required: true
            }
            {
              name: 'description'
              type: 'textarea'
              admin: { rows: 2 }
            }
          ]
        }
      ]
    },
    {
      label: 'Design'
      fields: [
        // UPDATE: layout → variant
        variant: select {
          label: 'Layout'
          defaultValue: 'grid-3'
          options: [
            { label: '3 Columns', value: 'grid-3' }
            { label: '4 Columns', value: 'grid-4' }
            { label: 'List View', value: 'list' }
          ]
        }

        // NEW: Icon Style
        iconStyle: select {
          label: 'Icon Style'
          defaultValue: 'glow'
          options: [
            { label: 'Glow (Teal background)', value: 'glow' }
            { label: 'Solid (Filled)', value: 'solid' }
            { label: 'Outlined (Border only)', value: 'outlined' }
          ]
        }

        // NEW: Alignment
        alignment: select {
          label: 'Content Alignment'
          defaultValue: 'center'
          options: [
            { label: 'Center', value: 'center' }
            { label: 'Left', value: 'left' }
          ]
        }
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- STEP 1: Rename file (manual)
-- mv src/branches/shared/blocks/Services.ts src/branches/shared/blocks/Features.ts

-- STEP 2: Database migrations
-- Rename columns
ALTER TABLE "pages_blocks_features"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_features"
  RENAME COLUMN "intro" TO "description";
ALTER TABLE "pages_blocks_features"
  RENAME COLUMN "layout" TO "variant";

-- Add new columns
ALTER TABLE "pages_blocks_features"
  ADD COLUMN "icon_style" VARCHAR(20) DEFAULT 'glow',
  ADD COLUMN "alignment" VARCHAR(10) DEFAULT 'center';

-- Drop obsolete columns
ALTER TABLE "pages_blocks_features"
  DROP COLUMN IF EXISTS "section_label",
  DROP COLUMN IF EXISTS "background_style",
  DROP COLUMN IF EXISTS "source",
  DROP COLUMN IF EXISTS "category",
  DROP COLUMN IF EXISTS "limit",
  DROP COLUMN IF EXISTS "show_featured_only",
  DROP COLUMN IF EXISTS "style",
  DROP COLUMN IF EXISTS "show_hover_effect";

-- Drop services relationship table
DROP TABLE IF EXISTS "pages_blocks_features_services_rels";

-- Simplify features array table
ALTER TABLE "pages_blocks_features_features"
  DROP COLUMN IF EXISTS "icon_type",
  DROP COLUMN IF EXISTS "icon_upload_id",
  DROP COLUMN IF EXISTS "link";

ALTER TABLE "pages_blocks_features_features"
  RENAME COLUMN "icon_name" TO "icon";
ALTER TABLE "pages_blocks_features_features"
  RENAME COLUMN "name" TO "title";
```

**Impact:**
- ⚠️ **FILE RENAME:** Services.ts → Features.ts (consistency!)
- ⚠️ Collection mode completely removed (always manual)
- ⚠️ Icon type complexity removed (always Lucide)
- ⚠️ Link field removed from features
- ✅ Simpler, cleaner structure
- ✅ New icon styles + alignment options

---

### Block 3: CTA (B03)

**Current Implementation:** `src/branches/shared/blocks/CTA.ts` (86 lines)

**Existing Fields:**
```typescript
{
  variant: select ['full-width', 'card'] ✅ UPDATE options
  title: text ✅ KEEP
  text: textarea ✅ RENAME to 'description'
  buttonText: text ✅ REPLACE with buttons array
  buttonLink: text ✅ REPLACE with buttons array
  secondaryButtonText: text ✅ REPLACE with buttons array
  secondaryButtonLink: text ✅ REPLACE with buttons array
  style: select ['primary', 'secondary', 'outline'] ✅ UPDATE to background styles
  backgroundImage: upload ❌ REMOVE (not in spec)
}
```

**Sprint 3 Spec Changes:**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // KEEP: Title
        title: text {
          label: 'Title'
          required: true
        }

        // RENAME: text → description
        description: textarea {
          label: 'Description'
          admin: { rows: 2 }
        }

        // NEW: Buttons array (replaces individual button fields)
        buttons: array {
          label: 'Call to Action Buttons'
          minRows: 1
          maxRows: 2 // NEW constraint
          fields: [
            { name: 'label', type: 'text', required: true }
            { name: 'link', type: 'text', required: true }
            {
              name: 'style'
              type: 'select'
              options: ['primary', 'secondary', 'ghost']
              defaultValue: 'primary'
            }
          ]
        }
      ]
    },
    {
      label: 'Design'
      fields: [
        // UPDATE: variant options
        variant: select {
          label: 'Layout Variant'
          defaultValue: 'centered'
          options: [
            { label: 'Centered', value: 'centered' }
            { label: 'Split (Text left, CTA right)', value: 'split' }
            { label: 'Full Width', value: 'full-width' }
          ]
        }

        // NEW: Background Style (replaces old 'style')
        style: select {
          label: 'Background Style'
          defaultValue: 'dark'
          options: [
            { label: 'Dark (Navy gradient)', value: 'dark' }
            { label: 'Light (White/grey)', value: 'light' }
            { label: 'Gradient (Teal glow)', value: 'gradient' }
          ]
        }
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_cta"
  RENAME COLUMN "text" TO "description";

-- Update variant options (data migration)
UPDATE "pages_blocks_cta"
  SET variant = 'full-width'
  WHERE variant = 'card'; -- Map old 'card' to 'full-width'

-- Create buttons table
CREATE TABLE IF NOT EXISTS "pages_blocks_cta_buttons" (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  link VARCHAR(255) NOT NULL,
  style VARCHAR(20) DEFAULT 'primary',
  _order INTEGER
);

-- Migrate existing button data
INSERT INTO "pages_blocks_cta_buttons" (parent_id, label, link, style, _order)
SELECT
  id as parent_id,
  button_text as label,
  button_link as link,
  'primary' as style,
  1 as _order
FROM "pages_blocks_cta"
WHERE button_text IS NOT NULL;

INSERT INTO "pages_blocks_cta_buttons" (parent_id, label, link, style, _order)
SELECT
  id as parent_id,
  secondary_button_text as label,
  secondary_button_link as link,
  'secondary' as style,
  2 as _order
FROM "pages_blocks_cta"
WHERE secondary_button_text IS NOT NULL;

-- Drop old button columns
ALTER TABLE "pages_blocks_cta"
  DROP COLUMN IF EXISTS "button_text",
  DROP COLUMN IF EXISTS "button_link",
  DROP COLUMN IF EXISTS "secondary_button_text",
  DROP COLUMN IF EXISTS "secondary_button_link",
  DROP COLUMN IF EXISTS "background_image_id";
```

**Impact:**
- ⚠️ Buttons array replaces individual fields (data migration!)
- ⚠️ Style field meaning changed (button style → background style)
- ⚠️ Variant options updated
- ✅ Max 2 buttons constraint enforced
- ✅ Tab structure improves admin UX

---

### Block 4: FAQ (B04)

**Current Implementation:** `src/branches/shared/blocks/FAQ.ts` (136 lines)

**Existing Fields:**
```typescript
{
  heading: text ✅ RENAME to 'title'
  intro: textarea ✅ RENAME to 'description'
  source: select ['collection', 'manual'] ❌ REMOVE (always manual in spec)
  faqs: relationship (hasMany) ❌ REMOVE (always manual)
  category: select ❌ REMOVE (no collection mode)
  limit: number ❌ REMOVE (no collection mode)
  showFeaturedOnly: checkbox ❌ REMOVE (no collection mode)
  items: array { question, answer } ✅ RENAME to 'faqs'
  generateSchema: checkbox ❌ REMOVE (always enabled)
}
```

**Sprint 3 Spec Changes:**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // RENAME: heading → title
        title: text {
          label: 'Section Title'
          admin: { description: 'Optional heading (e.g., "Frequently Asked Questions")' }
        }

        // RENAME: intro → description
        description: textarea {
          label: 'Description'
          admin: { rows: 2 }
        }

        // RENAME: items → faqs (always manual)
        faqs: array {
          label: 'Questions & Answers'
          minRows: 1
          fields: [
            {
              name: 'question'
              type: 'text'
              required: true
            }
            {
              name: 'answer'
              type: 'richText'
              editor: lexicalEditor()
              required: true
            }
          ]
        }
      ]
    },
    {
      label: 'Design'
      fields: [
        // NEW: Variant
        variant: select {
          label: 'Layout'
          defaultValue: 'single-column'
          options: [
            { label: 'Single Column', value: 'single-column' }
            { label: 'Two Columns', value: 'two-column' }
          ]
        }
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_faq"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_faq"
  RENAME COLUMN "intro" TO "description";

-- Add new columns
ALTER TABLE "pages_blocks_faq"
  ADD COLUMN "variant" VARCHAR(20) DEFAULT 'single-column';

-- Drop obsolete columns
ALTER TABLE "pages_blocks_faq"
  DROP COLUMN IF EXISTS "source",
  DROP COLUMN IF EXISTS "category",
  DROP COLUMN IF EXISTS "limit",
  DROP COLUMN IF EXISTS "show_featured_only",
  DROP COLUMN IF EXISTS "generate_schema";

-- Drop relationship table
DROP TABLE IF EXISTS "pages_blocks_faq_faqs_rels";

-- Rename items table to faqs
ALTER TABLE "pages_blocks_faq_items"
  RENAME TO "pages_blocks_faq_faqs";
```

**Impact:**
- ⚠️ Collection mode completely removed (always manual)
- ⚠️ Table rename (items → faqs)
- ✅ Two-column layout option added
- ✅ Simpler structure (no source modes)

---

### Block 5: Content (B05)

**Current Implementation:** `src/branches/shared/blocks/Content/config.ts` (78 lines)

**Existing Fields:**
```typescript
{
  columns: array {
    size: select ['oneThird', 'half', 'twoThirds', 'full'] ❌ REMOVE (complex)
    richText: richText ❌ MOVE to top level
    enableLink: checkbox ❌ REMOVE (not in spec)
    link: link field ❌ REMOVE (not in spec)
  }
}
```

**Sprint 3 Spec Changes (MAJOR SIMPLIFICATION):**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // NEW: Single rich text field (no columns)
        content: richText {
          label: 'Content'
          editor: lexicalEditor({
            features: [
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] })
              BoldFeature()
              ItalicFeature()
              UnderlineFeature()
              StrikethroughFeature()
              LinkFeature()
              UnorderedListFeature()
              OrderedListFeature()
              BlockquoteFeature()
              InlineCodeFeature()
              CodeBlockFeature()
            ]
          })
          required: true
        }
      ]
    },
    {
      label: 'Design'
      fields: [
        // NEW: Max Width
        maxWidth: select {
          label: 'Content Width'
          defaultValue: 'narrow'
          options: [
            { label: 'Narrow (640px - optimal for reading)', value: 'narrow' }
            { label: 'Wide (900px)', value: 'wide' }
            { label: 'Full Width (100%)', value: 'full' }
          ]
        }
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- MAJOR SIMPLIFICATION: Drop columns structure entirely
DROP TABLE IF EXISTS "pages_blocks_content_columns";

-- Create new content table with single richText field
ALTER TABLE "pages_blocks_content"
  ADD COLUMN "content" JSONB,
  ADD COLUMN "max_width" VARCHAR(10) DEFAULT 'narrow';

-- Data migration: Merge all column richText into single content field
-- This is complex - may need manual review for multi-column content
UPDATE "pages_blocks_content" c
SET content = (
  SELECT jsonb_agg(col.rich_text ORDER BY col._order)
  FROM "pages_blocks_content_columns" col
  WHERE col.parent_id = c.id
);
```

**Impact:**
- ⚠️ **MAJOR CHANGE:** Columns structure removed (simpler!)
- ⚠️ Data migration complex (merge columns into single content)
- ⚠️ Manual review recommended for multi-column content blocks
- ✅ Much simpler structure (single richText field)
- ✅ Width constraints well-defined

---

### Block 6: Testimonials (B06)

**Current Implementation:** `src/branches/shared/blocks/TestimonialsBlock.ts` (115 lines)

**Existing Fields:**
```typescript
{
  sectionLabelField ❌ REMOVE (not in spec)
  heading: text ✅ RENAME to 'title'
  intro: textarea ❌ REMOVE (not in spec)
  source: select ['collection', 'manual'] ❌ REMOVE (always manual in spec)
  testimonials: relationship (hasMany) ❌ REMOVE (always manual)
  manualTestimonials: array {
    name, role, company, quote, rating, photo, source
  } ✅ RENAME to 'testimonials', SIMPLIFY
  layout: select ['carousel', 'grid-2', 'grid-3'] ✅ UPDATE to variant
}
```

**Sprint 3 Spec Changes:**
```typescript
{
  // NEW: Tab structure
  type: 'tabs'
  tabs: [
    {
      label: 'Content'
      fields: [
        // RENAME: heading → title
        title: text {
          label: 'Section Title'
          admin: { description: 'Optional heading (e.g., "What Our Clients Say")' }
        }

        // RENAME: manualTestimonials → testimonials (always manual)
        testimonials: array {
          label: 'Testimonials'
          minRows: 1
          fields: [
            {
              name: 'quote'
              type: 'textarea'
              required: true
              label: 'Review Text'
              admin: { rows: 3 }
            }
            {
              name: 'author'
              type: 'text'
              required: true
              label: 'Author Name'
            }
            {
              name: 'role'
              type: 'text'
              label: 'Job Title / Role'
            }
            {
              name: 'avatar'
              type: 'upload'
              relationTo: 'media'
              label: 'Avatar Photo'
              admin: {
                description: 'Falls back to initials if not provided'
              }
            }
            {
              name: 'rating'
              type: 'number'
              min: 1
              max: 5
              defaultValue: 5
              label: 'Star Rating'
            }
          ]
        }
      ]
    },
    {
      label: 'Design'
      fields: [
        // UPDATE: layout → variant with new options
        variant: select {
          label: 'Layout'
          defaultValue: 'grid'
          options: [
            { label: 'Grid (3 columns)', value: 'grid' }
            { label: 'Carousel (slider with arrows)', value: 'carousel' }
            { label: 'Featured (large single testimonial)', value: 'featured' }
          ]
        }
      ]
    }
  ]
}
```

**Migration Required:**
```sql
-- Rename columns
ALTER TABLE "pages_blocks_testimonials"
  RENAME COLUMN "heading" TO "title";
ALTER TABLE "pages_blocks_testimonials"
  RENAME COLUMN "layout" TO "variant";

-- Drop obsolete columns
ALTER TABLE "pages_blocks_testimonials"
  DROP COLUMN IF EXISTS "section_label",
  DROP COLUMN IF EXISTS "intro",
  DROP COLUMN IF EXISTS "source";

-- Drop relationship table
DROP TABLE IF EXISTS "pages_blocks_testimonials_testimonials_rels";

-- Rename and simplify testimonials table
ALTER TABLE "pages_blocks_testimonials_manual_testimonials"
  RENAME TO "pages_blocks_testimonials_testimonials";

ALTER TABLE "pages_blocks_testimonials_testimonials"
  DROP COLUMN IF EXISTS "company",
  DROP COLUMN IF EXISTS "source";

ALTER TABLE "pages_blocks_testimonials_testimonials"
  RENAME COLUMN "name" TO "author";
ALTER TABLE "pages_blocks_testimonials_testimonials"
  RENAME COLUMN "photo_id" TO "avatar_id";
```

**Impact:**
- ⚠️ Collection mode removed (always manual)
- ⚠️ Table rename (manual_testimonials → testimonials)
- ⚠️ Company + source fields removed
- ✅ 3 variants (grid/carousel/featured)
- ✅ Simpler structure

---

## 🗄️ DATABASE MIGRATION STRATEGY

### Cruciale Regel #1: ADDITIVE + SAFE RENAMES + DOCUMENTED DROPS!
**Migraties zijn ADDITIVE met veilige RENAMES en GEDOCUMENTEERDE DROPS van ongebruikte fields!**

```sql
-- ✅ CORRECT: ADD COLUMN (additive, safe)
ALTER TABLE "pages_blocks_hero" ADD COLUMN "background_color" VARCHAR(10);

-- ✅ CORRECT: RENAME COLUMN (safe, preserves data)
ALTER TABLE "pages_blocks_hero" RENAME COLUMN "badge" TO "subtitle";

-- ✅ CORRECT: DROP COLUMN IF FIELD IS CONFIRMED UNUSED
-- Only for fields documented as "not in spec" and no longer needed
ALTER TABLE "pages_blocks_hero" DROP COLUMN IF EXISTS "section_label";

-- ⚠️ CAUTION: DATA MIGRATION (complex but safe)
-- Migrate CTA groups to buttons array
INSERT INTO "pages_blocks_hero_buttons" (parent_id, label, link, style, _order)
SELECT id, primary_cta->>'text', primary_cta->>'link', 'primary', 1
FROM "pages_blocks_hero" WHERE primary_cta IS NOT NULL;

-- ❌ WRONG: DROP COLUMN without documentation (destructive, NOT ALLOWED)
ALTER TABLE "pages_blocks_hero" DROP COLUMN "important_field"; -- NEVER DO THIS!
```

### Migration Files (6 total)

1. `YYYYMMDD_update_hero_block.ts` - Variants + buttons array + conditional backgrounds
2. `YYYYMMDD_update_features_block.ts` - Icon styles + alignment + simplified structure
3. `YYYYMMDD_update_cta_block.ts` - Background styles + buttons array
4. `YYYYMMDD_update_faq_block.ts` - Two-column variant + simplified
5. `YYYYMMDD_update_content_block.ts` - Width constraints + column simplification
6. `YYYYMMDD_update_testimonials_block.ts` - Variants + simplified

**Total Changes:**
- 20 column renames (safe - preserves data)
- 15 new columns added
- 25 columns dropped (documented as "not in spec")
- 4 complex data migrations (buttons arrays, content merge)
- 1 file rename (Services.ts → Features.ts)

### Migration Validation Checklist
Voordat elke migration wordt gerun:
- [ ] Check: Renames preserve data (test with SELECT after rename)
- [ ] Check: Alle ADD COLUMN statements hebben DEFAULT values
- [ ] Check: Data migrations tested (buttons arrays, content merge)
- [ ] Check: Dropped columns documented in spec as "removed"
- [ ] Check: Test migration eerst op LOCAL database copy
- [ ] Check: Backup van production database voordat migration wordt gerun

---

## 📁 FILE STRUCTURE

### Modified Files (7 total - includes 1 rename!)

#### Block Config Files (6 files - 1 rename!)
```
src/branches/shared/blocks/
├── Hero.ts (172 → ~180 lines) - MAJOR refactor
├── Services.ts → Features.ts (226 → ~150 lines) - RENAME + simplify!
├── CTA.ts (86 → ~120 lines) - buttons array + tabs
├── FAQ.ts (136 → ~100 lines) - simplified
├── Content/config.ts (78 → ~80 lines) - MAJOR simplification
└── TestimonialsBlock.ts (115 → ~120 lines) - variants
```

#### TypeScript Types (1 file - extend/replace)
```
src/types/
└── blocks.ts
    # REPLACE interfaces for all 6 blocks:
    # - HeroBlock, FeaturesBlock, CTABlock
    # - FAQBlock, ContentBlock, TestimonialsBlock
```

#### Migrations (6 files - auto-generated)
```
src/migrations/
├── YYYYMMDD_HHMMSS_update_hero_block.ts
├── YYYYMMDD_HHMMSS_update_features_block.ts
├── YYYYMMDD_HHMMSS_update_cta_block.ts
├── YYYYMMDD_HHMMSS_update_faq_block.ts
├── YYYYMMDD_HHMMSS_update_content_block.ts
└── YYYYMMDD_HHMMSS_update_testimonials_block.ts
```

### New Files (1 total)

#### Documentation
```
docs/refactoring/
└── SPRINT_3_IMPLEMENTATION_PLAN.md (this file)
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Hero Block Updates (2-3 hours) ⚠️ COMPLEX

**Goal:** 3 variants, buttons array, conditional backgrounds, tab structure

**Files to modify:**
1. `src/branches/shared/blocks/Hero.ts`

**Changes:**
```typescript
import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
              admin: {
                description: 'Small overline text (e.g., "Welkom bij...")',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Description',
              editor: lexicalEditor(),
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Call to Action Buttons',
              minRows: 1,
              maxRows: 3,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Text',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Button Link',
                  required: true,
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Button Style',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary (Teal)', value: 'primary' },
                    { label: 'Secondary (White outline)', value: 'secondary' },
                    { label: 'Ghost (Text only)', value: 'ghost' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout Variant',
              defaultValue: 'default',
              options: [
                { label: 'Default (Full-width, centered)', value: 'default' },
                { label: 'Split (Text left, image right)', value: 'split' },
                { label: 'Centered Compact', value: 'centered' },
              ],
            },
            {
              name: 'backgroundStyle',
              type: 'select',
              label: 'Background Style',
              defaultValue: 'gradient',
              options: [
                { label: 'Gradient (Navy to Dark)', value: 'gradient' },
                { label: 'Solid Color', value: 'solid' },
                { label: 'Image', value: 'image' },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              label: 'Background Color',
              defaultValue: 'navy',
              options: [
                { label: 'Navy (Dark blue)', value: 'navy' },
                { label: 'White', value: 'white' },
                { label: 'Light Grey', value: 'bg' },
                { label: 'Teal', value: 'teal' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'solid',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              admin: {
                condition: (data, siblingData) => siblingData?.backgroundStyle === 'image',
              },
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_hero_block
```

**Checklist:**
- [ ] Tab structure implemented (Content + Design)
- [ ] Buttons array replaces CTA groups
- [ ] Data migration script voor CTA → buttons
- [ ] Conditional fields (backgroundColor, backgroundImage) werken
- [ ] 3 variants documented
- [ ] Stats array removed
- [ ] Migration gegenereerd en getest
- [ ] TypeScript types updated
- [ ] No errors in admin panel

---

### Phase 2: Features Block Updates + File Rename (1-2 hours)

**Goal:** File rename, icon styles, alignment, simplified structure

**Files to modify:**
1. `src/branches/shared/blocks/Services.ts` → **RENAME TO** `Features.ts`
2. All imports of Services block

**Step 2a: Rename File**
```bash
# Rename the file
mv src/branches/shared/blocks/Services.ts src/branches/shared/blocks/Features.ts

# Update imports (find all references)
grep -r "from '@/branches/shared/blocks/Services'" src/
grep -r "from '../blocks/Services'" src/
# Manually update all imports to point to Features.ts
```

**Step 2b: Update Block Config**
```typescript
import type { Block } from 'payload'

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features / USPs',
    plural: 'Features / USPs',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              admin: {
                description: 'Optional heading for the features section',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: { rows: 2 },
            },
            {
              name: 'features',
              type: 'array',
              label: 'Features / USPs',
              minRows: 2,
              maxRows: 12,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon (Lucide)',
                  required: true,
                  admin: {
                    description: 'Lucide icon name (e.g., Shield, Zap, Award)',
                    components: {
                      Field: '@/branches/shared/components/admin/IconPickerField#IconPickerField',
                    },
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  admin: { rows: 2 },
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout',
              defaultValue: 'grid-3',
              options: [
                { label: '3 Columns', value: 'grid-3' },
                { label: '4 Columns', value: 'grid-4' },
                { label: 'List View', value: 'list' },
              ],
            },
            {
              name: 'iconStyle',
              type: 'select',
              label: 'Icon Style',
              defaultValue: 'glow',
              options: [
                { label: 'Glow (Teal background)', value: 'glow' },
                { label: 'Solid (Filled)', value: 'solid' },
                { label: 'Outlined (Border only)', value: 'outlined' },
              ],
            },
            {
              name: 'alignment',
              type: 'select',
              label: 'Content Alignment',
              defaultValue: 'center',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Left', value: 'left' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_features_block
```

**Checklist:**
- [ ] File renamed (Services.ts → Features.ts)
- [ ] All imports updated
- [ ] Collection mode removed
- [ ] Icon complexity removed (always Lucide)
- [ ] iconStyle + alignment fields added
- [ ] Tab structure implemented
- [ ] min/max constraints (2-12)
- [ ] Migration gegenereerd
- [ ] Test admin panel

---

### Phase 3: CTA Block Updates (1 hour)

**Goal:** Buttons array, background styles, layout variants

**Files to modify:**
1. `src/branches/shared/blocks/CTA.ts`

**Changes:**
```typescript
export const CTA: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: { rows: 2 },
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Call to Action Buttons',
              minRows: 1,
              maxRows: 2,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Text',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Button Link',
                  required: true,
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Button Style',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Ghost', value: 'ghost' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout Variant',
              defaultValue: 'centered',
              options: [
                { label: 'Centered', value: 'centered' },
                { label: 'Split (Text left, CTA right)', value: 'split' },
                { label: 'Full Width', value: 'full-width' },
              ],
            },
            {
              name: 'style',
              type: 'select',
              label: 'Background Style',
              defaultValue: 'dark',
              options: [
                { label: 'Dark (Navy gradient)', value: 'dark' },
                { label: 'Light (White/grey)', value: 'light' },
                { label: 'Gradient (Teal glow)', value: 'gradient' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_cta_block
```

**Checklist:**
- [ ] Tab structure implemented
- [ ] Buttons array (max 2)
- [ ] Data migration voor buttons
- [ ] Background styles added
- [ ] Variant options updated
- [ ] Migration gegenereerd
- [ ] Test admin panel

---

### Phase 4: FAQ Block Updates (1 hour)

**Goal:** Two-column variant, simplified structure

**Files to modify:**
1. `src/branches/shared/blocks/FAQ.ts`

**Changes:**
```typescript
export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              admin: {
                description: 'Optional heading (e.g., "Frequently Asked Questions")',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: { rows: 2 },
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Questions & Answers',
              minRows: 1,
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Question',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'richText',
                  label: 'Answer',
                  editor: lexicalEditor(),
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout',
              defaultValue: 'single-column',
              options: [
                { label: 'Single Column', value: 'single-column' },
                { label: 'Two Columns', value: 'two-column' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_faq_block
```

**Checklist:**
- [ ] Tab structure implemented
- [ ] Collection mode removed
- [ ] items → faqs rename
- [ ] Two-column variant added
- [ ] Migration gegenereerd
- [ ] Test admin panel

---

### Phase 5: Content Block Updates (30 minutes - 1 hour)

**Goal:** Width constraints, column simplification

**Files to modify:**
1. `src/branches/shared/blocks/Content/config.ts`

**Changes:**
```typescript
import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Rich Text Content',
    plural: 'Rich Text Content',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'Content',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    BoldFeature(),
                    ItalicFeature(),
                    UnderlineFeature(),
                    StrikethroughFeature(),
                    LinkFeature(),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    BlockquoteFeature(),
                    InlineCodeFeature(),
                    CodeBlockFeature(),
                  ]
                },
              }),
              required: true,
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'maxWidth',
              type: 'select',
              label: 'Content Width',
              defaultValue: 'narrow',
              options: [
                { label: 'Narrow (640px - optimal for reading)', value: 'narrow' },
                { label: 'Wide (900px)', value: 'wide' },
                { label: 'Full Width (100%)', value: 'full' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_content_block
```

**⚠️ CRITICAL: Data Migration**
Multi-column content needs to be merged into single field. Manual review required!

**Checklist:**
- [ ] Tab structure implemented
- [ ] Columns structure removed
- [ ] Single content richText field
- [ ] maxWidth constraints added
- [ ] Data migration tested (multi-column merge)
- [ ] Manual review for complex content
- [ ] Migration gegenereerd
- [ ] Test admin panel

---

### Phase 6: Testimonials Block Updates (1-2 hours)

**Goal:** 3 variants, simplified structure, star ratings

**Files to modify:**
1. `src/branches/shared/blocks/TestimonialsBlock.ts`

**Changes:**
```typescript
export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Title',
              admin: {
                description: 'Optional heading (e.g., "What Our Clients Say")',
              },
            },
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              minRows: 1,
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Review Text',
                  required: true,
                  admin: { rows: 3 },
                },
                {
                  name: 'author',
                  type: 'text',
                  label: 'Author Name',
                  required: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Job Title / Role',
                },
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Avatar Photo',
                  admin: {
                    description: 'Falls back to initials if not provided',
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Star Rating',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout',
              defaultValue: 'grid',
              options: [
                { label: 'Grid (3 columns)', value: 'grid' },
                { label: 'Carousel (slider with arrows)', value: 'carousel' },
                { label: 'Featured (large single testimonial)', value: 'featured' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:**
```bash
npx payload migrate:create update_testimonials_block
```

**Checklist:**
- [ ] Tab structure implemented
- [ ] Collection mode removed
- [ ] manualTestimonials → testimonials rename
- [ ] Company + source fields removed
- [ ] 3 variants documented
- [ ] Star rating (1-5) enforced
- [ ] Migration gegenereerd
- [ ] Test admin panel

---

### Phase 7: Testing & Verification (2 hours)

**Goal:** Verify all 6 block updates work correctly

#### Test Suite (42 tests total - 7 per block)

**Hero Tests (7):**
- [ ] Tab structure visible in admin (Content/Design)
- [ ] Buttons array works (add/remove/reorder)
- [ ] Conditional fields (backgroundColor, backgroundImage) show/hide correctly
- [ ] 3 variants selectable
- [ ] Data migrated correctly (old CTA → new buttons)
- [ ] Existing blocks still render
- [ ] Migration applied successfully

**Features Tests (7):**
- [ ] File renamed successfully (Services → Features)
- [ ] All imports updated
- [ ] Tab structure works
- [ ] iconStyle options render correctly
- [ ] alignment field works
- [ ] min/max constraints enforced (2-12)
- [ ] Migration applied successfully

**CTA Tests (7):**
- [ ] Tab structure works
- [ ] Buttons array (max 2) enforced
- [ ] Background style options work
- [ ] Variant options updated
- [ ] Data migrated correctly (old buttons → array)
- [ ] Existing blocks still render
- [ ] Migration applied successfully

**FAQ Tests (7):**
- [ ] Tab structure works
- [ ] items → faqs rename successful
- [ ] Two-column variant selectable
- [ ] Collection mode removed
- [ ] Accordion still works in frontend
- [ ] Existing blocks still render
- [ ] Migration applied successfully

**Content Tests (7):**
- [ ] Tab structure works
- [ ] Single content field replaces columns
- [ ] maxWidth options work (narrow/wide/full)
- [ ] Multi-column content migrated correctly
- [ ] Rich text features work
- [ ] Existing blocks reviewed manually
- [ ] Migration applied successfully

**Testimonials Tests (7):**
- [ ] Tab structure works
- [ ] Collection mode removed
- [ ] manualTestimonials → testimonials rename successful
- [ ] 3 variants selectable (grid/carousel/featured)
- [ ] Star rating (1-5) enforced
- [ ] Avatar fallback documented
- [ ] Migration applied successfully

#### Database Verification
```bash
# Check all migrations ran
npx payload migrate:status

# Verify Hero buttons table
psql $DATABASE_URL -c "SELECT * FROM pages_blocks_hero_buttons LIMIT 1;"

# Verify Features renamed
psql $DATABASE_URL -c "SELECT title, description, icon_style FROM pages_blocks_features LIMIT 1;"

# Verify CTA buttons table
psql $DATABASE_URL -c "SELECT * FROM pages_blocks_cta_buttons LIMIT 1;"

# Verify FAQ faqs table
psql $DATABASE_URL -c "SELECT * FROM pages_blocks_faq_faqs LIMIT 1;"

# Verify Content simplified
psql $DATABASE_URL -c "SELECT content, max_width FROM pages_blocks_content LIMIT 1;"

# Verify Testimonials
psql $DATABASE_URL -c "SELECT * FROM pages_blocks_testimonials_testimonials LIMIT 1;"
```

---

## 🔙 ROLLBACK PROCEDURE

### If Something Goes Wrong

#### Scenario 1: Migration Failed Halfway
```bash
# 1. Check migration status
npx payload migrate:status

# 2. Identify failed migration
# Example output:
# ✅ YYYYMMDD_update_hero_block (ran)
# ❌ YYYYMMDD_update_features_block (failed)

# 3. Rollback failed migration
npx payload migrate:down

# 4. Fix migration file
# Edit src/migrations/YYYYMMDD_update_features_block.ts

# 5. Re-run migration
npx payload migrate

# 6. If still failing, restore from backup
psql $DATABASE_URL < backup_before_sprint3.sql
```

#### Scenario 2: File Rename Broke Imports
```bash
# 1. Find all broken imports
npm run typecheck
# Look for errors like: Cannot find module '@/branches/shared/blocks/Services'

# 2. Find all files importing Services
grep -r "from '@/branches/shared/blocks/Services'" src/

# 3. Update all imports to Features
# Use find+replace in your editor

# 4. Verify build
npm run build

# 5. If issues persist, temporarily revert file rename
mv src/branches/shared/blocks/Features.ts src/branches/shared/blocks/Services.ts
```

#### Scenario 3: Content Block Data Migration Broke Multi-Column Content
```bash
# 1. Identify affected Content blocks
psql $DATABASE_URL -c "SELECT id, content FROM pages_blocks_content WHERE content IS NULL OR jsonb_array_length(content) > 1;"

# 2. Manually review each block
# Export content to JSON
psql $DATABASE_URL -c "\copy (SELECT id, content FROM pages_blocks_content WHERE ...) TO '/tmp/content_backup.json'"

# 3. Rollback migration
npx payload migrate:down

# 4. Manually merge multi-column content
# Use admin panel to combine content from multiple columns

# 5. Re-run migration
npx payload migrate
```

#### Scenario 4: Complete Rollback Needed
```bash
# 1. Rollback all 6 migrations (reverse order!)
npx payload migrate:down  # Testimonials
npx payload migrate:down  # Content
npx payload migrate:down  # FAQ
npx payload migrate:down  # CTA
npx payload migrate:down  # Features
npx payload migrate:down  # Hero

# 2. Verify all migrations rolled back
npx payload migrate:status

# 3. Restore block configs to original state
git checkout src/branches/shared/blocks/

# 4. Revert file rename
mv src/branches/shared/blocks/Features.ts src/branches/shared/blocks/Services.ts
# Update all imports back

# 5. Restart server
npm run dev
```

---

## ✅ COMPLETION CHECKLIST

### Block Updates
- [ ] Hero - tabs + buttons array + 3 variants + conditional backgrounds
- [ ] Features - file rename + icon styles + alignment + simplified
- [ ] CTA - tabs + buttons array + background styles + variants
- [ ] FAQ - tabs + two-column variant + simplified
- [ ] Content - tabs + width constraints + column simplification
- [ ] Testimonials - tabs + 3 variants + simplified + star ratings

### File Operations
- [ ] Services.ts renamed to Features.ts
- [ ] All imports updated (Services → Features)
- [ ] No broken imports (npm run typecheck passes)

### Migrations
- [ ] All 6 migrations generated
- [ ] All migrations reviewed (ADD/RENAME/DROP documented)
- [ ] Complex data migrations tested (Hero buttons, CTA buttons, Content merge)
- [ ] Local backup created
- [ ] Migrations tested locally
- [ ] Production backup created (when deploying)
- [ ] Migrations run successfully
- [ ] `migrate:status` shows all migrations ran

### Testing
- [ ] Hero: 7/7 tests passed ✅
- [ ] Features: 7/7 tests passed ✅ (including file rename)
- [ ] CTA: 7/7 tests passed ✅
- [ ] FAQ: 7/7 tests passed ✅
- [ ] Content: 7/7 tests passed ✅ (including data migration)
- [ ] Testimonials: 7/7 tests passed ✅

### Documentation
- [ ] This implementation plan reviewed
- [ ] Reference HTML files read (all 6 Sprint 3 specs)
- [ ] Team notified of changes
- [ ] Deployment scheduled

---

## 📊 SUCCESS METRICS

### Technical Metrics
- ✅ 0 TypeScript errors
- ✅ 0 Build errors
- ✅ 0 Runtime errors
- ✅ 42/42 tests pass (7 per block)
- ✅ 15 new database columns added
- ✅ 20 columns renamed (safe - data preserved)
- ✅ 25 columns dropped (documented as unused)
- ✅ 0 existing data lost

### Admin Experience
- ✅ 6 blocks updated with tab structure
- ✅ All blocks have Content + Design tabs
- ✅ All fields have sensible defaults
- ✅ Conditional fields show/hide correctly
- ✅ Min/max constraints enforced where needed
- ✅ Changes reflect immediately on frontend

### Developer Experience
- ✅ TypeScript autocomplete for new fields
- ✅ Type-safe block configurations
- ✅ Safe migrations (ADDITIVE + RENAME + documented DROPS)
- ✅ Complete documentation with specs
- ✅ Consistent naming (Features instead of Services)

---

## 🚨 CRITICAL WARNINGS

### ⚠️ DO NOT DO THESE THINGS:
1. **DO NOT SKIP FILE RENAME** - Services.ts MUST be renamed to Features.ts for consistency!
2. **DO NOT FORGET TO UPDATE IMPORTS** - All files importing Services must be updated!
3. **DO NOT SKIP DATA MIGRATIONS** - Hero/CTA buttons arrays need data migration!
4. **DO NOT SKIP MANUAL REVIEW** - Content block multi-column content needs review!
5. **DO NOT FORGET BACKUPS** - Always backup before migrations!

### ⚠️ DATA MIGRATION REQUIRED:

**Hero Block:** CTA groups → buttons array
**CTA Block:** Individual button fields → buttons array
**Content Block:** Multi-column richText → single content field (COMPLEX!)

```sql
-- Check for Content blocks with multi-column content
SELECT
  c.id,
  COUNT(col.id) as column_count
FROM "pages_blocks_content" c
LEFT JOIN "pages_blocks_content_columns" col ON col.parent_id = c.id
GROUP BY c.id
HAVING COUNT(col.id) > 1;

-- If results found, manually review and merge content before migration
```

---

## 📅 ESTIMATED TIME

### Development (1 dev)
- Phase 1: Hero - **2-3 hours** (most complex - buttons array + 3 variants)
- Phase 2: Features + Rename - **1-2 hours** (file rename + imports)
- Phase 3: CTA - **1 hour** (buttons array + styles)
- Phase 4: FAQ - **1 hour** (simplified)
- Phase 5: Content - **30 min - 1 hour** (but manual review time!)
- Phase 6: Testimonials - **1-2 hours** (3 variants)
- Phase 7: Testing & Verification - **2 hours**

**Total Development Time: 8-12 hours**

### Deployment
- Backup database - **5 minutes**
- Run migrations (6 total) - **5 minutes**
- Verify deployment - **20 minutes**
- Test all 6 blocks - **30 minutes**
- Monitor for errors - **30 minutes**

**Total Deployment Time: ~1.5 hours**

---

## 🎯 NEXT SPRINT

**Sprint 4 (Future):** Frontend Component Refactoring
- Update React components to use new block fields
- Implement 3 Hero variants (default/split/centered)
- Build carousel component (Testimonials)
- Add icon style variations (Features)
- Implement two-column FAQ layout
- Create width constraint styles (Content)
- Build featured testimonial variant

**Sprint 5 (Future):** New Advanced Blocks
- Interactive components (tabs, accordions)
- Advanced layouts (masonry, bento)
- Animation triggers
- Scroll effects

---

## 📞 SUPPORT & QUESTIONS

**Issues with this sprint?**
1. Check troubleshooting sections in reference HTML files
2. Review error logs: `npx payload migrate:status`
3. Verify database schema: `psql $DATABASE_URL -c "\d pages_blocks_[blockname]"`
4. Check TypeScript errors: `npm run typecheck`
5. Verify file rename: Check all imports of Services/Features

**Critical Production Issue?**
1. Immediately run rollback procedure (see Phase 7)
2. Restore from backup if needed
3. Document what went wrong
4. Fix locally before re-deploying

---

**🎉 READY TO START SPRINT 3!**

Lees deze plan grondig door voordat je begint. Volg de fasen in volgorde. Test elke fase voordat je naar de volgende gaat. Back-up altijd voor migraties. **Vergeet Services.ts → Features.ts rename niet!**

**Generated:** 24 Februari 2026
**Last Updated:** 24 Februari 2026
**Version:** 1.0
**Status:** ✅ Ready for Implementation
