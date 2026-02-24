# 🤖 CLAUDE SERVER - SPRINT 4 IMPLEMENTATION INSTRUCTIONS

**Datum:** 24 Februari 2026
**Sprint:** Sprint 4 - Content & Media Blocks
**Status:** ⏳ READY TO START

---

## 🎯 JOUW TAAK

Implementeer 7 content & media blocks volgens Sprint 4 specificaties:
- **1 block UPDATE** (Content - enhanced features)
- **6 blocks NIEUW** (Media, TwoColumn, Accordion, Code, Gallery, Video)

**Geschatte tijd:** 7-8 uur

---

## 📚 VEREISTE BESTANDEN TE LEZEN

**VERPLICHT - Lees VOOR je begint:**
```
1. docs/refactoring/SPRINT_4_IMPLEMENTATION_PLAN.md (master plan - complete code!)
2. docs/refactoring/sprint-4/b05-content.html (Content spec)
3. docs/refactoring/sprint-4/b08-media.html (Media spec)
4. docs/refactoring/sprint-4/b09-twocolumn.html (Two Column spec)
5. docs/refactoring/sprint-4/b10-accordion.html (Accordion spec)
6. docs/refactoring/sprint-4/b27-code.html (Code spec)
7. docs/refactoring/sprint-4/b28-gallery.html (Gallery spec)
8. docs/refactoring/sprint-4/b29-video.html (Video spec)
```

---

## 🚀 IMPLEMENTATIE STAPPEN

### Stap 1: Install Dependencies (EERST!)

**Code Block vereist extra package:**
```bash
npm install react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

### Stap 2: Implementeer Blocks (Aanbevolen Volgorde)

**MAKKELIJK → MOEILIJK:**

1. **Two Column** (30 min) - Simpelste, 3 fields
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 3
   - File: `src/branches/shared/blocks/TwoColumn.ts`

2. **Content Enhancement** (30 min) - Minor update
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 1
   - File: `src/branches/shared/blocks/Content/config.ts` (UPDATE bestaand!)

3. **Accordion** (45 min) - Items array
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 4
   - File: `src/branches/shared/blocks/Accordion.ts`

4. **Gallery** (1 uur) - Images array + rowLabel
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 6
   - File: `src/branches/shared/blocks/Gallery.ts`

5. **Video** (45 min) - Conditionals
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 7
   - File: `src/branches/shared/blocks/Video.ts`

6. **Code** (1 uur) - 23 languages, dependency
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 5
   - File: `src/branches/shared/blocks/Code.ts`

7. **Media** (1 uur) - Meest complex (buttons + conditionals)
   - Code: SPRINT_4_IMPLEMENTATION_PLAN.md Phase 2
   - File: `src/branches/shared/blocks/Media.ts`

### Stap 3: Update Pages Collection

**File:** `src/branches/shared/collections/Pages/index.ts`

**Add imports:**
```typescript
import { Media } from '@/branches/shared/blocks/Media'
import { TwoColumn } from '@/branches/shared/blocks/TwoColumn'
import { Accordion } from '@/branches/shared/blocks/Accordion'
import { Code } from '@/branches/shared/blocks/Code'
import { Gallery } from '@/branches/shared/blocks/Gallery'
import { Video } from '@/branches/shared/blocks/Video'

// In blocks array:
blocks: [
  // ... existing blocks (Hero, Features, etc.)
  Media,
  TwoColumn,
  Accordion,
  Code,
  Gallery,
  Video,
]
```

### Stap 4: Generate & Run Migration

```bash
# 1. TypeScript check
npm run typecheck

# 2. Backup database
cp src/database/payload.db src/database/payload.db.backup-before-sprint4

# 3. Generate migration
npx payload migrate:create sprint4_content_and_media_blocks

# 4. Run migration
npx payload migrate

# 5. Start server
npm run dev

# 6. Test all 7 blocks in /admin
```

---

## ⚠️ KRITIEKE WARNINGS

### 1. Dependencies VERPLICHT!
```bash
# MUST DO FIRST:
npm install react-syntax-highlighter
npm install -D @types/react-syntax-highlighter
```

### 2. Conditional Fields Testen!

**Media Block:**
- videoUrl only shows when `mediaType === 'video'`
- Test: Switch mediaType, verify field appears/disappears

**Video Block:**
- videoUrl shows when `source === 'youtube' || 'vimeo'`
- videoFile shows when `source === 'upload'`
- Test: Switch source, verify correct field shows

### 3. Content Block = UPDATE (niet nieuw!)
- File exists: `src/branches/shared/blocks/Content/config.ts`
- **UPDATE** this file, don't create new one!
- Add: StrikethroughFeature, H5-H6, Link rel, CodeBlockFeature

### 4. Array RowLabel Syntax

**Gallery Block:**
```typescript
admin: {
  components: {
    RowLabel: ({ data, index }) => {
      return data?.caption || data?.alt || `Image ${index + 1}`
    }
  }
}
```

---

## ✅ SUCCESS CRITERIA

**Je bent klaar als:**
- [ ] Dependencies installed (react-syntax-highlighter)
- [ ] 6 nieuwe block files bestaan
- [ ] Content block enhanced (NOT new file!)
- [ ] All 7 blocks imported in Pages collection
- [ ] TypeScript 0 errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Migration ran (`npx payload migrate:status`)
- [ ] All 7 blocks visible in /admin Pages
- [ ] Conditional fields work (Media videoUrl, Video source)
- [ ] Test page kan opgeslagen worden met alle blocks

---

## 📊 WAAR STAAT DE CODE?

**KOPIEER CODE UIT IMPLEMENTATION PLAN (niet handmatig typen!):**

### Content Enhancement (UPDATE bestaand!)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 1** (lines ~350-450)
- Enhanced RichText features
- StrikethroughFeature, H5-H6, Link rel, CodeBlockFeature

### Media Block (NIEUW - meest complex!)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 2**
- Buttons array, conditionals, split layouts

### Two Column Block (NIEUW - simpelste!)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 3** (lines ~600-700)
- 3 split options, dual RichText

### Accordion Block (NIEUW)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 4**
- Items array, multi-open support

### Code Block (NIEUW - dependency!)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 5**
- 23 languages, syntax highlighting

### Gallery Block (NIEUW)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 6**
- Images array, lightbox, grid/masonry

### Video Block (NIEUW)
`SPRINT_4_IMPLEMENTATION_PLAN.md` **Phase 7**
- YouTube/Vimeo/Upload, conditionals

---

## 🧪 TESTING CHECKLIST (49 tests)

**7 tests per block = 49 total**

**Per block test:**
1. Block zichtbaar in Pages dropdown
2. Alle fields tonen correct labels
3. Default values correct
4. Required fields enforced
5. Conditional fields show/hide (if applicable)
6. Arrays add/remove/reorder (if applicable)
7. Block kan opgeslagen worden zonder errors

**Extra tests:**
- Content: Enhanced features werken (Strikethrough, H5-H6, CodeBlock)
- Media: Buttons array max 2 enforced
- Accordion: Items min 1, max 12 enforced
- Code: 23 languages in dropdown
- Gallery: Images min 1 enforced, rowLabel shows caption/alt
- Video: Source switch changes visible fields

---

## 💡 TIPS

### Tip #1: Test Incrementeel
Na elk block:
1. Save file
2. Update Pages imports
3. `npm run typecheck`
4. Restart server
5. Test in /admin
6. Commit als het werkt

### Tip #2: RichText Features Hergebruiken
Meeste blocks gebruiken DEZELFDE features - kopieer pattern!

### Tip #3: Conditional Pattern
```typescript
admin: {
  condition: (data, siblingData) => siblingData?.field === 'value'
}
```

### Tip #4: Array RowLabel Pattern
```typescript
admin: {
  components: {
    RowLabel: ({ data, index }) => data?.caption || `Item ${index + 1}`
  }
}
```

---

## 📞 HELP

**TypeScript errors?**
```bash
npm run typecheck
```

**Dependencies missing?**
```bash
npm list react-syntax-highlighter
# Should show version ^15.5.0
```

**Migration fails?**
```bash
npx payload migrate:status
npx payload migrate:down  # Rollback
# Fix migration, then re-run
```

**Conditional fields not working?**
- Check: Fields in SAME parent (not nested)?
- Check: Condition uses `siblingData` (not `data`)?
- Check: Field names exact match?

---

**GESCHATTE TIJD:** 7-8 uur (inclusief testen)

**SUCCES! 🚀**

---

**Generated:** 24 Februari 2026
**Status:** ✅ READY FOR IMPLEMENTATION
