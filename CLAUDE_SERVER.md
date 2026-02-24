# 🤖 Sprint Planning Documentation Update

**Voor:** Claude AI agent op Ploi/Hetzner server
**Datum:** February 24, 2026
**Context:** Sprint 1 & 2 Implementation Plans + Critical Learnings

---

## 🎯 WAT ZIT ER IN DEZE COMMIT?

Dit is een **documentatie-only commit** - geen code changes, alleen planning en learnings.

### Nieuwe/Gewijzigde Documentatie:

1. **`docs/refactoring/SPRINT_1_IMPLEMENTATION_PLAN.md`** (UPDATED - v2.0)
   - ✅ Toegevoegd: "🎓 LEARNINGS FROM SPRINT 1 IMPLEMENTATION" sectie
   - ✅ 10 kritieke learnings van Sprint 1 implementatie
   - ✅ Enhanced checklists en verification steps
   - ✅ Provisioning script updates gedocumenteerd

2. **`docs/refactoring/SPRINT_2_IMPLEMENTATION_PLAN.md`** (NEW - 700+ lines)
   - ✅ Complete implementatie plan voor Sprint 2
   - ✅ 5 blocks: ProductEmbed, CategoryGrid, ProductGrid, QuickOrder, Pricing
   - ✅ Database migrations strategy (15 renames + 45 new columns)
   - ✅ Feature flag pattern (ENABLE_B2B voor QuickOrder)
   - ✅ Testing plan (35 tests)

3. **`docs/refactoring/sprint-2/`** (NEW - HTML specification files)
   - b13-product-embed.html
   - b14-category-grid.html
   - b20-product-grid.html
   - b21-quick-order.html
   - b22-pricing.html

---

## 📚 BELANGRIJKSTE LEARNINGS (Sprint 1)

### ⚠️ CRITICAL - Lees Deze Eerst!

**Learning #1: Dual Migration Pattern**
- Bij Global + Collection changes → 2 migrations nodig!
- Sprint 1: 4 Theme global migrations + 1 Themes collection migration = 5 total
- Verify: `npx payload migrate:status` moet 5 migrations tonen

**Learning #2: React Server Component Serialization**
- ❌ Geen runtime callbacks: `hidden: ({ user }) => ...`
- ✅ Wel build-time evaluation: `hidden: !isClientDeployment()`

**Learning #3: Provisioning Script Updates**
- Bij nieuwe collections/globals met default data:
  - Update `src/lib/ploi/PloiAdapter.ts`
  - Update `docs/setup/provision-site.sh`
  - Test provisioning op fresh site

**Learning #4: Feature Flag Pattern**
```typescript
const isB2BEnabled = () => process.env.ENABLE_B2B === 'true'

export const QuickOrder: Block = {
  access: {
    read: () => isB2BEnabled(),
    create: () => isB2BEnabled(),
    update: () => isB2BEnabled(),
  },
  // ...
}
```

**Meer learnings:** Zie `docs/refactoring/SPRINT_1_IMPLEMENTATION_PLAN.md` → "🎓 LEARNINGS" sectie

---

## 🚀 SPRINT 2 PREVIEW

**Status:** Planning compleet, implementatie nog niet gestart

**Scope:**
- Update 5 bestaande blocks (geen nieuwe!)
- Database-safe migrations (alleen ADD COLUMN en safe RENAME)
- Feature flag voor QuickOrder (ENABLE_B2B)
- Tab-based admin UI (Content/Layout/Settings)
- Geschatte tijd: 10-13 uur

**Blocks:**
1. **ProductEmbed (B13)** - Layout options, specs config, badge customization
2. **CategoryGrid (B14)** - Tab structure, responsive columns, card styles
3. **ProductGrid (B20)** - Sorting options, tag filter, CTA field renames
4. **QuickOrder (B21)** - ENABLE_B2B feature flag + field updates
5. **Pricing (B22)** - Major tab restructure, badge, button variants

**Migrations:** 15 renames + 45 new columns + 1 drop = ~60 database changes

---

## 🔍 ACTIES VOOR SERVER (GEEN!)

**⚠️ BELANGRIJKE MELDING:**

Dit is een **documentatie-only commit**. Er zijn GEEN acties nodig op de server.

**Geen database migrations**
**Geen provisioning updates**
**Geen script cleanup**
**Geen deployment vereist**

Deze commit bevat alleen:
- ✅ Planning documentatie
- ✅ Implementation guides
- ✅ Learnings van Sprint 1
- ✅ Specification files

---

## 📖 LEES DEZE DOCUMENTATIE

### Sprint 1 (Enhanced v2.0):
```bash
cd /home/ploi/ai-sitebuilder.compassdigital.nl
cat docs/refactoring/SPRINT_1_IMPLEMENTATION_PLAN.md
```

**Focus op:**
- "🎓 LEARNINGS FROM SPRINT 1 IMPLEMENTATION" (10 learnings)
- "Phase 5: Database Migrations" (5 migrations pattern)
- "Phase 8: Seed Default Themes & Provisioning"

### Sprint 2 (NEW):
```bash
cat docs/refactoring/SPRINT_2_IMPLEMENTATION_PLAN.md
```

**Focus op:**
- "Executive Summary" (all blocks exist, updates only)
- "Detailed Block Comparisons" (field-by-field analysis)
- "Critical Warnings" (ENABLE_B2B requirement)
- "Migration Strategy" (database-safe approach)

---

## 🎓 GEBRUIK VOOR TOEKOMSTIGE SPRINTS

Deze documentatie bevat patterns die herbruikbaar zijn:

**Pattern 1: Safe Database Migrations**
- Alleen ADD COLUMN met DEFAULT values
- Safe RENAME COLUMN (preserves data)
- Minimal DROP (only confirmed unused fields)

**Pattern 2: Feature Flags**
- Access control pattern voor blocks/collections
- Build-time evaluation (geen runtime callbacks)
- Admin descriptions voor disabled features

**Pattern 3: Tab Organization**
- Content/Layout/Settings structuur
- Complex forms (20+ fields) → tabs
- Logical grouping van related fields

**Pattern 4: Provisioning Updates**
- Beide paths updaten (PloiAdapter + manual script)
- Test op fresh database
- Verify default data created

**Pattern 5: TypeScript Type Extension**
- Extend existing interfaces (never replace)
- Use optional properties for new fields
- Maintain backward compatibility

---

## 📞 VRAGEN?

**Over Sprint 1 learnings:**
→ Zie `docs/refactoring/SPRINT_1_IMPLEMENTATION_PLAN.md` (sectie "🎓 LEARNINGS")

**Over Sprint 2 planning:**
→ Zie `docs/refactoring/SPRINT_2_IMPLEMENTATION_PLAN.md` (sectie "Detailed Block Comparisons")

**Over provisioning:**
→ Learning #3 in Sprint 1 plan (Provisioning Script Pattern)

**Over feature flags:**
→ Learning #4 in Sprint 1 plan + Sprint 2 QuickOrder implementation

---

## ✅ CHECKLIST VOOR SERVER

- [ ] Git pull uitgevoerd
- [ ] Documentatie gelezen (Sprint 1 v2.0)
- [ ] Documentatie gelezen (Sprint 2 NEW)
- [ ] Learnings begrepen (10 critical patterns)
- [ ] Klaar voor Sprint 2 implementatie (wanneer dat komt)

**⚠️ REMINDER:** Dit is alleen documentatie - geen server acties nodig!

---

**Generated:** February 24, 2026
**Type:** Documentation Update
**Impact:** None (planning only, no code changes)
**Action Required:** Read documentation, no server actions needed
