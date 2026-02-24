# 🎨 SPRINT 4: Content & Media Blocks - Compass Design System Implementation

**Sprint:** 4 van X
**Datum:** 24 Februari 2026
**Status:** ⏳ READY TO START
**Impact:** 🟢 Medium-High - 6 nieuwe blocks + 1 update, straightforward implementaties
**Database Impact:** ✅ Safe - Alleen nieuwe tabellen + kolommen, geen breaking changes

---

## 📋 EXECUTIVE SUMMARY

### Doel Sprint 4
Implementeer 7 content & media blocks volgens Compass Design System Sprint 4 specificaties:

**Blocks to Implement:**
1. **Content** (B05) - UPDATE: Enhanced RichText features (was basic in Sprint 3)
2. **Media** (B08) - NEW: Image/Video met text, split layouts, buttons
3. **Two Column** (B09) - NEW: Flexible column layouts met RichText
4. **Accordion** (B10) - NEW: Collapsible content sections
5. **Code** (B27) - NEW: Syntax highlighting, 23 languages
6. **Gallery** (B28) - NEW: Image gallery met lightbox, masonry/grid
7. **Video** (B29) - NEW: YouTube/Vimeo/Upload support

### Status Overview
- ✅ **Content Block** - Bestaat al (Sprint 3), enhanced features nodig
- ❌ **6 Nieuwe Blocks** - Volledig nieuwe implementaties

### Waarom deze aanpak?
- **Design System Alignment:** Alle blocks volgen Compass Design System exact
- **Content-First:** Focus op rijke content & media presentatie
- **Type-safe:** Complete TypeScript interfaces
- **Database-safe:** Alleen nieuwe tabellen/kolommen, geen destructieve changes
- **CMS-controlled:** Admin beheert alle opties zonder code changes
- **Production-Ready:** Geteste specs met troubleshooting guides

### Wat er NIET gebeurt (veiligheid)
- ❌ **GEEN bestaande blocks verwijderd**
- ❌ **GEEN breaking changes** in database schema
- ❌ **GEEN frontend components touched** (apart sprint - later)
- ✅ **ALLEEN CMS config** + database migrations

---

## 🎯 SCOPE & DELIVERABLES

### In Scope (Sprint 4)

**Block Implementations (7 blocks)**
- [ ] Content (B05) - Enhanced RichText features (update bestaand block)
- [ ] Media (B08) - Image/Video block met split layouts
- [ ] Two Column (B09) - 50-50 / 60-40 / 40-60 splits
- [ ] Accordion (B10) - Collapsible sections, multi-open support
- [ ] Code (B27) - Syntax highlighter, 23 languages, line numbers
- [ ] Gallery (B28) - Grid/masonry layouts, lightbox support
- [ ] Video (B29) - YouTube/Vimeo/Upload, aspect ratios

**Infrastructure**
- [ ] TypeScript type updates (7 files)
- [ ] Database migrations (1 migration voor alle 7 blocks)
- [ ] Dependencies toevoegen (`react-syntax-highlighter`)
- [ ] Admin panel configuraties

**Testing & Documentation**
- [ ] Testing checklist (49 tests total - 7 per block)
- [ ] Rollback procedure
- [ ] Complete documentation

### Out of Scope (Later Sprints)
- ⏭️ Frontend React components (Sprint 5)
- ⏭️ Lightbox component implementatie (Sprint 5)
- ⏭️ Video player UI enhancements (Sprint 5)

---

## 📊 DETAILED BLOCK SPECIFICATIONS

### Block 1: Content (B05) - UPDATE BESTAAND BLOCK

**Current Implementation:** `src/branches/shared/blocks/Content/config.ts`

**Sprint 3 Status:**
```typescript
{
  content: richText (basic features)
  maxWidth: select ['narrow', 'wide', 'full']
}
```

**Sprint 4 Enhancement:**
```typescript
{
  content: richText {
    // NIEUWE FEATURES:
    + HeadingFeature (H2-H6) // Was alleen H2-H4
    + StrikethroughFeature() // NIEUW
    + LinkFeature with rel options // ENHANCED (noopener, noreferrer, nofollow)
    + CodeBlockFeature() // NIEUW

    // BESTAANDE FEATURES (behouden):
    ✓ ParagraphFeature
    ✓ BoldFeature, ItalicFeature, UnderlineFeature
    ✓ UnorderedListFeature, OrderedListFeature
    ✓ BlockquoteFeature
    ✓ InlineCodeFeature
  }

  maxWidth: select ['narrow', 'wide', 'full'] // ONGEWIJZIGD
}
```

**Migration Required:** NONE (alleen config update)

**Impact:**
- ⚠️ **Minor Enhancement** - Meer RichText features
- ✅ **No breaking changes** - Bestaande content blijft werken
- ✅ **Backward compatible** - Alleen nieuwe features toegevoegd

---

### Block 2: Media (B08) - NIEUW BLOCK

**File:** `src/branches/shared/blocks/Media.ts` (NIEUW)

**Fields:**
```typescript
{
  // Content Tab
  mediaType: select ['image', 'video'] // DEFAULT: 'image'
  mediaPosition: select ['left', 'right'] // DEFAULT: 'left'
  media: upload (relationTo: 'media') // REQUIRED
  videoUrl: text (conditional on mediaType === 'video')
  split: select ['50-50', '60-40', '40-60'] // DEFAULT: '50-50'
  subtitle: text (optional)
  title: text // REQUIRED
  content: richText (optional)
  buttons: array {
    minRows: 0
    maxRows: 2
    fields: [
      label: text // REQUIRED
      variant: select ['primary', 'secondary', 'outline'] // DEFAULT: 'primary'
      url: text // REQUIRED
      newTab: checkbox // DEFAULT: false
    ]
  }

  // Design Tab
  backgroundColor: select ['white', 'grey', 'teal'] // DEFAULT: 'white'
}
```

**Database Tables:**
```sql
CREATE TABLE pages_blocks_media (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  media_type VARCHAR(10) DEFAULT 'image',
  media_position VARCHAR(10) DEFAULT 'left',
  media_id INTEGER REFERENCES media(id),
  video_url VARCHAR(500),
  split VARCHAR(10) DEFAULT '50-50',
  subtitle VARCHAR(200),
  title VARCHAR(200) NOT NULL,
  content JSONB,
  background_color VARCHAR(10) DEFAULT 'white',
  _order INTEGER
);

CREATE TABLE pages_blocks_media_buttons (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks_media(id) ON DELETE CASCADE,
  label VARCHAR(100) NOT NULL,
  variant VARCHAR(20) DEFAULT 'primary',
  url VARCHAR(500) NOT NULL,
  new_tab BOOLEAN DEFAULT false,
  _order INTEGER
);
```

**Complexity:** Medium (conditional fields + buttons array)

---

### Block 3: Two Column (B09) - NIEUW BLOCK

**File:** `src/branches/shared/blocks/TwoColumn.ts` (NIEUW)

**Fields:**
```typescript
{
  split: select ['50-50', '60-40', '40-60'] // DEFAULT: '50-50'
  columnOne: richText { // REQUIRED
    label: 'Column One (Left)'
    features: [Paragraph, Heading (H2-H6), Bold, Italic, Underline, Strikethrough, Link with rel, Lists, Blockquote]
  }
  columnTwo: richText { // REQUIRED
    label: 'Column Two (Right)'
    features: [Same as columnOne]
  }
}
```

**Database Tables:**
```sql
CREATE TABLE pages_blocks_twocolumn (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  split VARCHAR(10) DEFAULT '50-50',
  column_one JSONB NOT NULL,
  column_two JSONB NOT NULL,
  _order INTEGER
);
```

**Complexity:** Low (straightforward, 3 fields)

---

### Block 4: Accordion (B10) - NIEUW BLOCK

**File:** `src/branches/shared/blocks/Accordion.ts` (NIEUW)

**Fields:**
```typescript
{
  title: text (optional) // Section heading
  items: array {
    minRows: 1
    maxRows: 12
    fields: [
      title: text // REQUIRED (header)
      content: richText // REQUIRED (expandable content)
      defaultOpen: checkbox // DEFAULT: false
    ]
  }
  allowMultipleOpen: checkbox // DEFAULT: false
}
```

**Database Tables:**
```sql
CREATE TABLE pages_blocks_accordion (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  title VARCHAR(200),
  allow_multiple_open BOOLEAN DEFAULT false,
  _order INTEGER
);

CREATE TABLE pages_blocks_accordion_items (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks_accordion(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content JSONB NOT NULL,
  default_open BOOLEAN DEFAULT false,
  _order INTEGER
);
```

**Complexity:** Medium (array with nested richText)

---

### Block 5: Code (B27) - NIEUW BLOCK

**File:** `src/branches/shared/blocks/Code.ts` (NIEUW)

**Fields:**
```typescript
{
  code: code // REQUIRED (Payload's code field type)
  language: select { // REQUIRED, DEFAULT: 'javascript'
    options: [
      'javascript', 'typescript', 'html', 'css', 'python', 'bash',
      'json', 'jsx', 'tsx', 'graphql', 'sql', 'markdown', 'yaml',
      'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'c', 'cpp',
      'csharp', 'java', 'plaintext'
    ] // 23 languages
  }
  showLineNumbers: checkbox // DEFAULT: true
  filename: text (optional) // e.g. "example.js"
  highlightLines: text (optional) // e.g. "1,3-5,10"
}
```

**Database Tables:**
```sql
CREATE TABLE pages_blocks_code (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language VARCHAR(20) DEFAULT 'javascript',
  show_line_numbers BOOLEAN DEFAULT true,
  filename VARCHAR(200),
  highlight_lines VARCHAR(100),
  _order INTEGER
);
```

**Dependencies:**
```json
{
  "dependencies": {
    "react-syntax-highlighter": "^15.5.0"
  },
  "devDependencies": {
    "@types/react-syntax-highlighter": "^15.5.11"
  }
}
```

**Complexity:** Medium (nieuwe dependency + 23 language options)

---

### Block 6: Gallery (B28) - NIEUW BLOCK

**File:** `src/branches/shared/blocks/Gallery.ts` (NIEUW)

**Fields:**
```typescript
{
  title: text (optional) // Gallery heading
  layout: select ['grid', 'masonry'] // DEFAULT: 'grid'
  columns: select ['2', '3', '4'] // DEFAULT: '3'
  images: array {
    minRows: 1
    fields: [
      image: upload (relationTo: 'media') // REQUIRED
      caption: text (optional)
      alt: text (optional) // Accessibility
    ]
    admin: {
      rowLabel: data => data?.caption || data?.alt || 'Image {index+1}'
    }
  }
  enableLightbox: checkbox // DEFAULT: true
  spacing: select ['tight', 'normal', 'loose'] // DEFAULT: 'normal'
}
```

**Database Tables:**
```sql
CREATE TABLE pages_blocks_gallery (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  title VARCHAR(200),
  layout VARCHAR(10) DEFAULT 'grid',
  columns VARCHAR(2) DEFAULT '3',
  enable_lightbox BOOLEAN DEFAULT true,
  spacing VARCHAR(10) DEFAULT 'normal',
  _order INTEGER
);

CREATE TABLE pages_blocks_gallery_images (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks_gallery(id) ON DELETE CASCADE,
  image_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
  caption VARCHAR(300),
  alt VARCHAR(200),
  _order INTEGER
);
```

**Complexity:** Medium (images array + rowLabel function)

---

### Block 7: Video (B29) - NIEUW BLOCK

**File:** `src/branches/shared/blocks/Video.ts` (NIEUW)

**Fields:**
```typescript
{
  title: text (optional)
  source: select ['youtube', 'vimeo', 'upload'] // REQUIRED, DEFAULT: 'youtube'
  videoUrl: text {
    conditional: source === 'youtube' || source === 'vimeo'
    required: true (when visible)
  }
  videoFile: upload {
    relationTo: 'media'
    conditional: source === 'upload'
    required: true (when visible)
  }
  thumbnail: upload (optional, relationTo: 'media')
  caption: richText (optional, basic features)
  aspectRatio: select ['16:9', '4:3', '1:1'] // DEFAULT: '16:9'
}
```

**Database Tables:**
```sql
CREATE TABLE pages_blocks_video (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES pages_blocks(id) ON DELETE CASCADE,
  title VARCHAR(200),
  source VARCHAR(10) DEFAULT 'youtube',
  video_url VARCHAR(500),
  video_file_id INTEGER REFERENCES media(id),
  thumbnail_id INTEGER REFERENCES media(id),
  caption JSONB,
  aspect_ratio VARCHAR(10) DEFAULT '16:9',
  _order INTEGER
);
```

**Complexity:** Medium (multiple conditional fields)

---

## 🗄️ DATABASE MIGRATION STRATEGY

### Cruciale Regel: ADDITIVE ONLY!

**Alle Sprint 4 migraties zijn ADDITIVE:**
```sql
-- ✅ CORRECT: CREATE TABLE (additive, safe)
CREATE TABLE pages_blocks_media (...);

-- ✅ CORRECT: ADD COLUMN to existing table (additive, safe)
ALTER TABLE pages_blocks_content ADD COLUMN IF NOT EXISTS ...;

-- ❌ WRONG: DROP COLUMN (destructive, NOT ALLOWED)
ALTER TABLE ... DROP COLUMN ...; -- NEVER IN SPRINT 4!
```

### Migration File

**Single migration voor alle 7 blocks:**
```
src/migrations/YYYYMMDD_HHMMSS_sprint4_content_and_media_blocks.ts
```

**Totale Changes:**
- 0 table drops (safe!)
- 0 column drops (safe!)
- 8 new tables created (Media + TwoColumn + Accordion + Code + Gallery + Video + 2 junction tables)
- 2 enhanced columns (Content block RichText features - config only, no DB change)
- 0 renames (safe!)

### Migration Validation Checklist
- [ ] Check: Alle CREATE TABLE statements hebben IF NOT EXISTS
- [ ] Check: Alle nieuwe tabellen hebben _order kolom voor arrays
- [ ] Check: Foreign keys naar media collection correct
- [ ] Check: Default values voor alle select fields
- [ ] Check: JSONB kolommen voor richText fields
- [ ] Check: Test migration op LOCAL database copy eerst
- [ ] Check: Backup van production database voordat migration wordt gerun

---

## 📁 FILE STRUCTURE

### New Block Files (6 nieuwe)
```
src/branches/shared/blocks/
├── Media.ts (NIEUW - 150-180 lines)
├── TwoColumn.ts (NIEUW - 80-100 lines)
├── Accordion.ts (NIEUW - 100-120 lines)
├── Code.ts (NIEUW - 90-110 lines)
├── Gallery.ts (NIEUW - 130-150 lines)
└── Video.ts (NIEUW - 120-140 lines)
```

### Modified Files (1 update)
```
src/branches/shared/blocks/
└── Content/config.ts (UPDATE - enhanced RichText features)
```

### TypeScript Types (extend)
```
src/types/
└── blocks.ts
    # ADD interfaces voor 6 nieuwe blocks:
    # - MediaBlock, TwoColumnBlock, AccordionBlock
    # - CodeBlock, GalleryBlock, VideoBlock
```

### Migrations (1 file - auto-generated)
```
src/migrations/
└── YYYYMMDD_HHMMSS_sprint4_content_and_media_blocks.ts
```

### Dependencies (update)
```
package.json
# ADD:
+ "react-syntax-highlighter": "^15.5.0"
# ADD (dev):
+ "@types/react-syntax-highlighter": "^15.5.11"
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Content Block Enhancement (30 min)

**Goal:** Enhanced RichText features

**Files to modify:**
1. `src/branches/shared/blocks/Content/config.ts`

**Changes:**
```typescript
import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature, // NIEUW
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
  InlineCodeFeature,
  CodeBlockFeature, // NIEUW
} from '@payloadcms/richtext-lexical'

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
                    // ENHANCED: H2-H6 (was H2-H4)
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
                    BoldFeature(),
                    ItalicFeature(),
                    UnderlineFeature(),
                    StrikethroughFeature(), // NIEUW
                    // ENHANCED: Link with rel options
                    LinkFeature({
                      enabledRelations: ['noopener', 'noreferrer', 'nofollow'],
                    }),
                    UnorderedListFeature(),
                    OrderedListFeature(),
                    BlockquoteFeature(),
                    InlineCodeFeature(),
                    CodeBlockFeature(), // NIEUW
                  ]
                },
              }),
              required: true,
              admin: {
                description: 'Rich text editor with support for headings, lists, links, formatting, and code blocks',
              },
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
              admin: {
                description: 'Controls the maximum width of the content container',
              },
            },
          ],
        },
      ],
    },
  ],
}
```

**Migration:** NONE (config update only)

**Checklist:**
- [ ] StrikethroughFeature toegevoegd
- [ ] HeadingFeature extended naar H2-H6
- [ ] LinkFeature enhanced met rel options
- [ ] CodeBlockFeature toegevoegd
- [ ] Test in admin panel (create test page)
- [ ] Verify nieuwe features werken
- [ ] No errors in console

---

### Phase 2: Media Block (1 hour)

**Goal:** Image/Video block met split layouts en buttons

**Files to create:**
1. `src/branches/shared/blocks/Media.ts` (NIEUW)

**Implementation:** (Complete code - zie DETAILED SPECS hierboven)

**Checklist:**
- [ ] File created: Media.ts
- [ ] Tab structure (Content + Design)
- [ ] Conditional videoUrl (mediaType === 'video')
- [ ] Buttons array (max 2)
- [ ] Row layout voor mediaType + mediaPosition
- [ ] Default values correct
- [ ] Import in Pages collection
- [ ] Test in admin panel

---

### Phase 3: Two Column Block (30 min)

**Goal:** Flexible column layouts

**Files to create:**
1. `src/branches/shared/blocks/TwoColumn.ts` (NIEUW)

**Implementation:**
```typescript
import { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
  BlockquoteFeature,
} from '@payloadcms/richtext-lexical'

export const TwoColumn: Block = {
  slug: 'twocolumn',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Two Column Block',
    plural: 'Two Column Blocks',
  },
  fields: [
    {
      name: 'split',
      type: 'select',
      label: 'Column Split',
      defaultValue: '50-50',
      options: [
        { label: 'Equal (50-50)', value: '50-50' },
        { label: 'Left Wider (60-40)', value: '60-40' },
        { label: 'Right Wider (40-60)', value: '40-60' },
      ],
      admin: {
        description: 'Controls the width ratio between the two columns',
      },
    },
    {
      name: 'columnOne',
      type: 'richText',
      label: 'Column One (Left)',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          LinkFeature({
            enabledRelations: ['noopener', 'noreferrer', 'nofollow'],
          }),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
        ],
      }),
      required: true,
      admin: {
        description: 'Content for the left column',
      },
    },
    {
      name: 'columnTwo',
      type: 'richText',
      label: 'Column Two (Right)',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
          BoldFeature(),
          ItalicFeature(),
          UnderlineFeature(),
          StrikethroughFeature(),
          LinkFeature({
            enabledRelations: ['noopener', 'noreferrer', 'nofollow'],
          }),
          UnorderedListFeature(),
          OrderedListFeature(),
          BlockquoteFeature(),
        ],
      }),
      required: true,
      admin: {
        description: 'Content for the right column',
      },
    },
  ],
}
```

**Checklist:**
- [ ] File created: TwoColumn.ts
- [ ] 3 split options (50-50, 60-40, 40-60)
- [ ] RichText features match Content block
- [ ] Both columns required
- [ ] Import in Pages collection
- [ ] Test in admin panel

---

### Phase 4: Accordion Block (45 min)

**Goal:** Collapsible content sections

**Files to create:**
1. `src/branches/shared/blocks/Accordion.ts` (NIEUW)

**Implementation:** (zie DETAILED SPECS)

**Checklist:**
- [ ] File created: Accordion.ts
- [ ] Items array (min 1, max 12)
- [ ] defaultOpen per item
- [ ] allowMultipleOpen checkbox
- [ ] Optional section title
- [ ] Import in Pages collection
- [ ] Test in admin panel

---

### Phase 5: Code Block (1 hour) ⚠️ DEPENDENCY

**Goal:** Syntax highlighting voor code snippets

**Step 5a: Install Dependencies**
```bash
npm install react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

**Step 5b: Create Block**
**Files to create:**
1. `src/branches/shared/blocks/Code.ts` (NIEUW)

**Implementation:** (zie DETAILED SPECS - 23 languages!)

**Checklist:**
- [ ] Dependencies installed
- [ ] File created: Code.ts
- [ ] 23 language options
- [ ] showLineNumbers checkbox
- [ ] Optional filename
- [ ] Optional highlightLines
- [ ] Import in Pages collection
- [ ] Test in admin panel

---

### Phase 6: Gallery Block (1 hour)

**Goal:** Image gallery met lightbox

**Files to create:**
1. `src/branches/shared/blocks/Gallery.ts` (NIEUW)

**Implementation:** (zie DETAILED SPECS)

**Checklist:**
- [ ] File created: Gallery.ts
- [ ] Images array (min 1)
- [ ] Layout options (grid/masonry)
- [ ] Columns (2/3/4)
- [ ] enableLightbox checkbox
- [ ] spacing options
- [ ] Custom rowLabel function
- [ ] Import in Pages collection
- [ ] Test in admin panel

---

### Phase 7: Video Block (45 min)

**Goal:** YouTube/Vimeo/Upload video support

**Files to create:**
1. `src/branches/shared/blocks/Video.ts` (NIEUW)

**Implementation:** (zie DETAILED SPECS)

**Checklist:**
- [ ] File created: Video.ts
- [ ] 3 source types (youtube/vimeo/upload)
- [ ] Conditional videoUrl
- [ ] Conditional videoFile
- [ ] Optional thumbnail
- [ ] Optional caption (richText)
- [ ] aspectRatio select
- [ ] Import in Pages collection
- [ ] Test in admin panel

---

### Phase 8: Migration & Testing (2 hours)

**Goal:** Generate migration & test alle 7 blocks

#### Generate Migration
```bash
npx payload migrate:create sprint4_content_and_media_blocks
```

#### Test Suite (49 tests total - 7 per block)

**Content Block Tests (7):**
- [ ] Enhanced RichText features visible (H5, H6, Strikethrough, CodeBlock)
- [ ] Link rel options werken (noopener, noreferrer, nofollow)
- [ ] Bestaande content blijft werken (backward compatible)
- [ ] maxWidth options ongewijzigd
- [ ] No errors in console
- [ ] Content kan opgeslagen worden
- [ ] Existing blocks still render

**Media Block Tests (7):**
- [ ] mediaType switch (image/video) werkt
- [ ] Conditional videoUrl shows when video selected
- [ ] mediaPosition (left/right) werkt
- [ ] split options (50-50, 60-40, 40-60) werken
- [ ] Buttons array (max 2) enforced
- [ ] backgroundColor options werken
- [ ] Block kan opgeslagen worden

**Two Column Block Tests (7):**
- [ ] split options werken (50-50, 60-40, 40-60)
- [ ] columnOne RichText werkt
- [ ] columnTwo RichText werkt
- [ ] Both columns required
- [ ] RichText features match Content block
- [ ] Block kan opgeslagen worden
- [ ] No errors in console

**Accordion Block Tests (7):**
- [ ] Items array (min 1, max 12) enforced
- [ ] defaultOpen checkbox per item werkt
- [ ] allowMultipleOpen checkbox werkt
- [ ] Optional title werkt
- [ ] Add/remove items werkt
- [ ] Reorder items werkt
- [ ] Block kan opgeslagen worden

**Code Block Tests (7):**
- [ ] Dependencies geïnstalleerd (react-syntax-highlighter)
- [ ] Code field werkt (Payload's code type)
- [ ] 23 language options beschikbaar
- [ ] showLineNumbers checkbox werkt
- [ ] Optional filename werkt
- [ ] Optional highlightLines werkt
- [ ] Block kan opgeslagen worden

**Gallery Block Tests (7):**
- [ ] Images array (min 1) enforced
- [ ] layout options (grid/masonry) werken
- [ ] columns options (2/3/4) werken
- [ ] enableLightbox checkbox werkt
- [ ] spacing options werken
- [ ] rowLabel function werkt (shows caption/alt/index)
- [ ] Block kan opgeslagen worden

**Video Block Tests (7):**
- [ ] source select (youtube/vimeo/upload) werkt
- [ ] Conditional videoUrl shows when youtube/vimeo
- [ ] Conditional videoFile shows when upload
- [ ] Optional thumbnail upload werkt
- [ ] Optional caption richText werkt
- [ ] aspectRatio options werken
- [ ] Block kan opgeslagen worden

#### Database Verification
```bash
# Check migration status
npx payload migrate:status

# Verify new tables exist
psql $DATABASE_URL -c "\dt pages_blocks_*"

# Should show:
# pages_blocks_media
# pages_blocks_media_buttons
# pages_blocks_twocolumn
# pages_blocks_accordion
# pages_blocks_accordion_items
# pages_blocks_code
# pages_blocks_gallery
# pages_blocks_gallery_images
# pages_blocks_video
```

---

## 🔙 ROLLBACK PROCEDURE

### If Something Goes Wrong

#### Scenario 1: Migration Failed

```bash
# 1. Check migration status
npx payload migrate:status

# 2. Rollback migration
npx payload migrate:down

# 3. Fix migration file
# Edit src/migrations/YYYYMMDD_sprint4_content_and_media_blocks.ts

# 4. Re-run migration
npx payload migrate

# 5. If still failing, restore from backup
psql $DATABASE_URL < backup_before_sprint4.sql
```

#### Scenario 2: Dependencies Issue (Code Block)

```bash
# If react-syntax-highlighter causes issues:

# 1. Check installation
npm list react-syntax-highlighter

# 2. Reinstall if needed
npm uninstall react-syntax-highlighter @types/react-syntax-highlighter
npm install react-syntax-highlighter
npm install -D @types/react-syntax-highlighter

# 3. Clear build cache
rm -rf .next
npm run build
```

#### Scenario 3: Complete Rollback

```bash
# 1. Rollback migration
npx payload migrate:down

# 2. Remove new block files
rm src/branches/shared/blocks/Media.ts
rm src/branches/shared/blocks/TwoColumn.ts
rm src/branches/shared/blocks/Accordion.ts
rm src/branches/shared/blocks/Code.ts
rm src/branches/shared/blocks/Gallery.ts
rm src/branches/shared/blocks/Video.ts

# 3. Restore Content block (if needed)
git checkout src/branches/shared/blocks/Content/config.ts

# 4. Remove dependencies
npm uninstall react-syntax-highlighter @types/react-syntax-highlighter

# 5. Restart server
npm run dev
```

---

## ✅ COMPLETION CHECKLIST

### Block Implementations
- [ ] Content - Enhanced RichText features (H5-H6, Strikethrough, CodeBlock, Link rel)
- [ ] Media - Image/Video, split layouts, buttons, conditional fields
- [ ] Two Column - 3 split options, dual RichText
- [ ] Accordion - Items array, multi-open support
- [ ] Code - 23 languages, syntax highlighting, line numbers
- [ ] Gallery - Grid/masonry, lightbox, spacing options
- [ ] Video - YouTube/Vimeo/Upload, aspect ratios

### File Operations
- [ ] 6 nieuwe block files aangemaakt
- [ ] Content block enhanced
- [ ] All blocks imported in Pages collection
- [ ] No broken imports (npm run typecheck passes)

### Dependencies
- [ ] react-syntax-highlighter installed
- [ ] @types/react-syntax-highlighter installed
- [ ] package.json updated
- [ ] No dependency conflicts

### Migrations
- [ ] Migration generated
- [ ] Migration reviewed (all tables correct)
- [ ] Local backup created
- [ ] Migration tested locally
- [ ] Production backup created (when deploying)
- [ ] Migration run successfully
- [ ] `migrate:status` shows migration ran

### Testing
- [ ] Content: 7/7 tests passed ✅
- [ ] Media: 7/7 tests passed ✅
- [ ] Two Column: 7/7 tests passed ✅
- [ ] Accordion: 7/7 tests passed ✅
- [ ] Code: 7/7 tests passed ✅
- [ ] Gallery: 7/7 tests passed ✅
- [ ] Video: 7/7 tests passed ✅

### Documentation
- [ ] Implementation plan reviewed
- [ ] Reference HTML files read (all 7 Sprint 4 specs)
- [ ] Team notified of new blocks
- [ ] Deployment scheduled

---

## 📊 SUCCESS METRICS

### Technical Metrics
- ✅ 0 TypeScript errors
- ✅ 0 Build errors
- ✅ 0 Runtime errors
- ✅ 49/49 tests pass (7 per block)
- ✅ 8 new database tables created
- ✅ 0 existing data lost
- ✅ 1 new dependency added (react-syntax-highlighter)

### Admin Experience
- ✅ 7 blocks available in Pages
- ✅ All fields have sensible defaults
- ✅ Conditional fields show/hide correctly
- ✅ Array constraints enforced
- ✅ RichText editors work smoothly
- ✅ Changes reflect immediately

### Developer Experience
- ✅ TypeScript autocomplete for all new blocks
- ✅ Type-safe block configurations
- ✅ Safe migrations (ADDITIVE only)
- ✅ Complete documentation
- ✅ Dependencies properly versioned

---

## 🚨 CRITICAL WARNINGS

### ⚠️ DO NOT DO THESE THINGS:
1. **DO NOT SKIP DEPENDENCY INSTALLATION** - Code block needs react-syntax-highlighter!
2. **DO NOT FORGET TO UPDATE PAGES COLLECTION** - Import all 7 blocks!
3. **DO NOT SKIP TESTING** - Test alle conditional fields (Media videoUrl, Video source)
4. **DO NOT FORGET BACKUPS** - Always backup before migrations!
5. **DO NOT MIX UP BLOCK SLUGS** - Use exact slugs from specs!

### ⚠️ DEPENDENCY REQUIRED:

**Code Block (B27):**
```bash
# MUST install before implementing Code block:
npm install react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

### ⚠️ CONDITIONAL FIELDS TESTING:

**Media Block:**
```typescript
// videoUrl only shows when mediaType === 'video'
// TEST: Switch mediaType, verify videoUrl appears/disappears
```

**Video Block:**
```typescript
// videoUrl shows when source === 'youtube' || 'vimeo'
// videoFile shows when source === 'upload'
// TEST: Switch source, verify correct field shows
```

---

## 📅 ESTIMATED TIME

### Development (1 dev)
- Phase 1: Content Enhancement - **30 min**
- Phase 2: Media Block - **1 hour** (buttons array + conditionals)
- Phase 3: Two Column Block - **30 min** (simplest)
- Phase 4: Accordion Block - **45 min** (items array)
- Phase 5: Code Block - **1 hour** (dependency + 23 languages)
- Phase 6: Gallery Block - **1 hour** (images array + rowLabel)
- Phase 7: Video Block - **45 min** (conditionals)
- Phase 8: Migration & Testing - **2 hours**

**Total Development Time: 7-8 hours**

### Deployment
- Backup database - **5 minutes**
- Install dependencies - **2 minutes**
- Run migration - **5 minutes**
- Verify deployment - **20 minutes**
- Test all 7 blocks - **30 minutes**
- Monitor for errors - **30 minutes**

**Total Deployment Time: ~1.5 hours**

---

## 🎯 NEXT SPRINT

**Sprint 5 (Future):** Frontend Component Implementation
- React components voor alle 7 blocks
- Lightbox component (Gallery block)
- Video player UI (Video block)
- Syntax highlighter styling (Code block)
- Accordion animations (Accordion block)
- Responsive layouts (Media, Two Column)

**Sprint 6 (Future):** Advanced Interactive Blocks
- Tabs component
- Slider/Carousel
- Forms builder
- Interactive maps
- Data visualizations

---

## 📞 SUPPORT & QUESTIONS

**Issues with this sprint?**
1. Check troubleshooting sections in reference HTML files
2. Review error logs: `npx payload migrate:status`
3. Verify database schema: `psql $DATABASE_URL -c "\dt pages_blocks_*"`
4. Check TypeScript errors: `npm run typecheck`
5. Verify dependencies: `npm list react-syntax-highlighter`

**Critical Production Issue?**
1. Immediately run rollback procedure (see above)
2. Restore from backup if needed
3. Document what went wrong
4. Fix locally before re-deploying

---

## 📚 REFERENCE FILES

**Read these files IN VOLGORDE:**

1. **EERST:** `docs/refactoring/SPRINT_4_IMPLEMENTATION_PLAN.md` (this file)
   - Complete overview
   - Implementation code for all 7 blocks
   - Migration strategy
   - Testing checklist

2. **PER BLOCK:** HTML specs in `docs/refactoring/sprint-4/`
   - b05-content.html - Enhanced Content block
   - b08-media.html - Media block (image/video)
   - b09-twocolumn.html - Two Column block
   - b10-accordion.html - Accordion block
   - b27-code.html - Code block (syntax highlighting)
   - b28-gallery.html - Image Gallery block
   - b29-video.html - Video block

3. **TIJDENS IMPLEMENTATIE:** Check existing code
   - `src/branches/shared/blocks/Content/config.ts` - Content block to enhance
   - `src/branches/shared/collections/Pages/index.ts` - How to import blocks

---

## 💡 IMPLEMENTATION TIPS

### Tip #1: Volgorde Matters!

**Aanbevolen volgorde (makkelijk → moeilijk):**
1. Two Column (simpelste - 3 fields)
2. Content Enhancement (minor update)
3. Accordion (medium - items array)
4. Gallery (medium - images array)
5. Video (medium - conditionals)
6. Code (dependency install!)
7. Media (meest complex - buttons + conditionals)

### Tip #2: Test Incrementeel

**Na elk block:**
1. Save het bestand
2. Update Pages collection imports
3. Check TypeScript errors (`npm run typecheck`)
4. Restart server (`npm run dev`)
5. Test in /admin
6. Als het werkt, commit!

### Tip #3: RichText Features Pattern

**Meeste blocks gebruiken ZELFDE features:**
```typescript
const standardFeatures = [
  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
  BoldFeature(),
  ItalicFeature(),
  UnderlineFeature(),
  StrikethroughFeature(),
  LinkFeature({ enabledRelations: ['noopener', 'noreferrer', 'nofollow'] }),
  UnorderedListFeature(),
  OrderedListFeature(),
  BlockquoteFeature(),
]
```

### Tip #4: Conditional Fields Pattern

**Video Block voorbeeld:**
```typescript
{
  name: 'videoUrl',
  type: 'text',
  admin: {
    condition: (data, siblingData) => {
      return siblingData?.source === 'youtube' || siblingData?.source === 'vimeo'
    }
  }
}
```

**Let op:** `siblingData` = fields op ZELFDE niveau!

### Tip #5: Array rowLabel Pattern

**Gallery Block voorbeeld:**
```typescript
{
  name: 'images',
  type: 'array',
  admin: {
    components: {
      RowLabel: ({ data, index }) => {
        return data?.caption || data?.alt || `Image ${index + 1}`
      }
    }
  }
}
```

---

**🎉 READY TO START SPRINT 4!**

Lees deze plan grondig door voordat je begint. Volg de fasen in volgorde. Test elke fase voordat je naar de volgende gaat. Back-up altijd voor migraties. **Vergeet dependencies niet voor Code block!**

**Generated:** 24 Februari 2026
**Last Updated:** 24 Februari 2026
**Version:** 1.0
**Status:** ✅ Ready for Implementation
