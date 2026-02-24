# 🤖 CLAUDE SERVER - SPRINT 3 IMPLEMENTATION INSTRUCTIONS

**Datum:** 24 Februari 2026
**Sprint:** Sprint 3 - Shared Blocks Refactor naar Compass Design System
**Huidige Status:** ⚠️ BESTAANDE BLOKKEN VERWIJDERD - Nieuwe implementatie nodig

---

## 🚨 KRITIEKE INFORMATIE - LEES DIT EERST!

### Wat is al gebeurd (BELANGRIJK!)

**De bestaande 6 blocks zijn VERWIJDERD:**
- ❌ Hero.ts - Oude implementatie verwijderd
- ❌ Services.ts - Bestand verwijderd (wordt Features.ts)
- ❌ CTA.ts - Oude implementatie verwijderd
- ❌ FAQ.ts - Oude implementatie verwijderd
- ❌ Content/config.ts - Oude implementatie verwijderd
- ❌ TestimonialsBlock.ts - Oude implementatie verwijderd

**Oude migraties zijn VERWIJDERD:**
- ❌ 20260221_083030_baseline_schema.json
- ❌ 20260221_215821_sprint1_with_variable_products.json
- ❌ 20260222_215225_add_ab_testing_collections.json
- ❌ 20260222_215445_update_settings_ecommerce_fields.json
- ❌ 20260223_115055_add_theme_status_colors_and_gradients.json

**Nieuwe migratie gegenereerd:**
- ✅ 20260224_120431_sprint3_clean_slate_blocks_refactor.json
- ✅ 20260224_120431_sprint3_clean_slate_blocks_refactor.ts

**⚠️ DIT BETEKENT:**
- We beginnen met een "clean slate" (schone lei)
- ALLE 6 blocks moeten volledig opnieuw geïmplementeerd worden
- Migratie zal NIEUWE tabellen aanmaken, niet oude aanpassen
- Dit is een DESTRUCTIEVE change - alle bestaande block data wordt gereset!

---

## 📋 JOUW TAAK

Implementeer de 6 shared blocks VOLLEDIG OPNIEUW volgens de Sprint 3 specificaties.

**Vereiste bestanden te lezen VOOR je begint:**
1. `docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` - Master plan (2095 lines)
2. `docs/refactoring/sprint-3/B01_Hero.html` - Hero spec
3. `docs/refactoring/sprint-3/B02_Features.html` - Features spec
4. `docs/refactoring/sprint-3/B03_CTA.html` - CTA spec
5. `docs/refactoring/sprint-3/B04_FAQ.html` - FAQ spec
6. `docs/refactoring/sprint-3/B05_Content.html` - Content spec
7. `docs/refactoring/sprint-3/B06_Testimonials.html` - Testimonials spec

---

## 🎯 IMPLEMENTATIE STAPPEN

### Stap 1: Implementeer de 6 Blocks

**Complete code staat in SPRINT_3_IMPLEMENTATION_PLAN.md:**

1. **FAQ Block** - Lines 1456-1526 (START HIER - simpelste!)
2. **Testimonials Block** - Lines 1646-1734
3. **Features Block** - Lines 1205-1309 (LET OP: File heet Features.ts, NIET Services.ts!)
4. **CTA Block** - Lines 1338-1429
5. **Content Block** - Lines 1555-1615
6. **Hero Block** - Lines 1036-1162 (LAATST - meest complex!)

**Voor elk block:**
- Maak nieuw bestand: `src/branches/shared/blocks/BlockName.ts`
- Kopieer EXACTE code uit implementation plan
- Zorg voor correcte imports
- Test in admin panel

### Stap 2: Update Pages Collection

**File:** `src/branches/shared/collections/Pages/index.ts`

Zorg dat alle 6 blocks geïmporteerd zijn:
```typescript
import { Hero } from '@/branches/shared/blocks/Hero'
import { Features } from '@/branches/shared/blocks/Features' // WAS Services!
import { CTA } from '@/branches/shared/blocks/CTA'
import { FAQ } from '@/branches/shared/blocks/FAQ'
import { Content } from '@/branches/shared/blocks/Content/config'
import { Testimonials } from '@/branches/shared/blocks/TestimonialsBlock'

// In blocks array:
blocks: [Hero, Features, CTA, FAQ, Content, Testimonials]
```

### Stap 3: Run Migratie & Test

```bash
# 1. TypeScript check
npm run typecheck

# 2. Backup database
cp src/database/payload.db src/database/payload.db.backup-before-sprint3

# 3. Run migration
npx payload migrate

# 4. Start server
npm run dev

# 5. Test all 6 blocks in admin (/admin)
```

---

## ⚠️ KRITIEKE WARNINGS

### 1. File Rename: Services → Features
- ❌ GEEN Services.ts maken!
- ✅ Maak Features.ts
- ✅ Pages collection moet Features importeren

### 2. Tab Structure (ALLE 6 blocks)
```typescript
{
  type: 'tabs',
  tabs: [
    { label: 'Content', fields: [...] },
    { label: 'Design', fields: [...] }
  ]
}
```

### 3. Buttons Arrays (Hero & CTA)
- Hero: min 1, max 3 buttons
- CTA: min 1, max 2 buttons
- Elk button heeft: label, link, style (primary/secondary/ghost)

### 4. Conditional Fields (Hero)
```typescript
{
  name: 'backgroundColor',
  admin: {
    condition: (data, siblingData) => siblingData?.backgroundStyle === 'solid'
  }
}
```

### 5. Content Block SIMPLIFICATION
- WAS: columns[] array
- NU: Single content richText + maxWidth select
- Major change maar eenvoudiger!

---

## ✅ SUCCESS CRITERIA

**Je bent klaar als:**
- [ ] 6 block bestanden bestaan (Hero, Features, CTA, FAQ, Content, Testimonials)
- [ ] TypeScript 0 errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] Migratie gerun (`npx payload migrate:status` = "ran")
- [ ] Alle 6 blocks zichtbaar in /admin Pages
- [ ] Tab structure werkt voor alle blocks
- [ ] Test page kan opgeslagen worden met alle 6 blocks

---

## 📚 WAAR STAAT DE CODE?

**KOPIEER DEZE CODE (NIET HANDMATIG TYPEN!):**

### FAQ Block (SIMPELSTE - BEGIN HIER!)
`docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` lines **1456-1526**

### Testimonials Block
`docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` lines **1646-1734**

### Features Block (LET OP: Services → Features rename!)
`docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` lines **1205-1309**

### CTA Block
`docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` lines **1338-1429**

### Content Block
`docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` lines **1555-1615**

### Hero Block (MEEST COMPLEX - DOE LAATST!)
`docs/refactoring/SPRINT_3_IMPLEMENTATION_PLAN.md` lines **1036-1162**

---

**GESCHATTE TIJD: 5-6 uur** (lezen + implementeren + testen)

**SUCCES! 🚀**
