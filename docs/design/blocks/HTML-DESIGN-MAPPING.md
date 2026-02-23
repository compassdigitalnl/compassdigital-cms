# HTML Design System → Shared Blocks Mapping

**Datum:** 2026-02-23
**Source:** `plastimed-master-design-system.html` (503 lines)
**Commit:** dd4bdff

---

## Executive Summary

Het HTML design system definieert **31 CMS blocks** in Chapter 3. Van deze 31 blocks zijn:

- ✅ **23 blocks** bestaan al in `src/branches/shared/blocks/` → **REDESIGN NEEDED**
- ❌ **1 block** (ComparisonTable) bestaat in `ecommerce/blocks/` → **PROMOTE TO SHARED**
- ⚠️ **2 current blocks** (CallToAction, Map) komen NIET voor in HTML design → **DECISION NEEDED**
- 🔧 **7 blocks** (ProductGrid, QuickOrder, ProductEmbed, CategoryGrid) zijn ecommerce-specific → **BLIJVEN IN BRANCH**

**Total Shared Blocks Impact: 24 blocks need redesign + 1 migration**

---

## 🎨 Design System Structure

### CSS Custom Properties (Chapter 1)
```css
:root {
  /* Colors */
  --navy: #0A1628;
  --navy-light: #121F33;
  --teal: #00897B;
  --teal-light: #26A69A;
  --coral: #FF6B6B;
  --amber: #F59E0B;
  --green: #00C853;
  --blue: #2196F3;

  /* Spacing (4px grid) */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-4: 16px;
  --sp-6: 24px;

  /* Border Radius */
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 20px;

  /* Shadows */
  --sh-sm: 0 1px 3px rgba(10,22,40,0.06);
  --sh-md: 0 4px 20px rgba(10,22,40,0.08);

  /* Typography */
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-display: 'DM Serif Display', serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Design Principles from Chapter 7
1. **Always use CSS custom properties** (var(--token)) - NEVER hardcode colors
2. **Mobile-first responsive** - 4-col → 2-col @ 900px → 1-col @ 640px
3. **Spacing follows 4px grid** - 4, 8, 12, 16, 24, 32, 48, 64, 80px only
4. **All interactive elements** need hover, focus, disabled states
5. **Transitions** - `transition: all var(--dur) var(--ease)`
6. **Cards** - 1px border var(--grey), hover = shadow-md + translateY(-2px)
7. **Dark sections** - `gradient(135deg, --navy, --navy-light)` + teal radial glow
8. **Theme switching** - via `data-theme` attribute on html element

---

## 📊 Complete Block Mapping

### ✅ Priority 1: Core Content Blocks (7 blocks)

| HTML Block | Current Block | HTML Pattern | Fields Check | Priority |
|------------|--------------|-------------|--------------|----------|
| **Hero** | Hero | `.hero-d` with badge, `<span class="ac">` accent, gradient bg | ✅ Has badge, titleAccent | 🔥 HIGH |
| **CTA** | CTA | `.cta-d` card with gradient, dual buttons | ✅ Has variant, buttons | 🔥 HIGH |
| **FAQ** | FAQ | `.fq` accordion with chevron icon | ✅ Has collection/manual | 🔥 HIGH |
| **Testimonials** | TestimonialsBlock | `.tc` with quote mark, stars, avatar | ⚠️ Missing: quote mark styling | 🔥 HIGH |
| **Features** | Features | `.f-card` grid with icons | ✅ Has grid layouts, icons | 🔥 HIGH |
| **Content** | Content | Rich text with widths | ✅ Has width variants | 🟡 MEDIUM |
| **BlogPreview** | BlogPreview | `.bp-card` with image, date, excerpt | ✅ Has layout variants | 🟡 MEDIUM |

### ✅ Priority 2: Data Display Blocks (7 blocks)

| HTML Block | Current Block | HTML Pattern | Fields Check | Priority |
|------------|--------------|-------------|--------------|----------|
| **Services** | Services | `.s-card` grid with icon, text | ✅ Has collection/manual | 🟡 MEDIUM |
| **Stats** | Stats | `.st-item` with number, label | ⚠️ Missing: horizontal layout | 🟡 MEDIUM |
| **Team** | Team | `.tm-card` with avatar, role, bio | ✅ Has grid layouts | 🟡 MEDIUM |
| **Pricing** | Pricing | `.pr-card` with features list | ✅ Has plan structure | 🟡 MEDIUM |
| **LogoBar** | LogoBar | `.lb` carousel/grid | ✅ Has carousel variant | 🟢 LOW |
| **MediaBlock** | MediaBlock | Image with caption | ✅ Has breakout options | 🟢 LOW |
| **ImageGallery** | ImageGallery | `.ig` grid layout | ✅ Has column options | 🟢 LOW |

### ✅ Priority 3: Forms & Status (6 blocks)

| HTML Block | Current Block | HTML Pattern | Fields Check | Priority |
|------------|--------------|-------------|--------------|----------|
| **Contact / ContactFormBlock** | ContactForm | `.cf` form with fields | ✅ Has reCAPTCHA | 🟡 MEDIUM |
| **Form** | Form | Dynamic form builder | ✅ Has field types | 🟡 MEDIUM |
| **Banner** | Banner | `.bn` status bar | ✅ Has variant types | 🟢 LOW |
| **InfoBox** | InfoBox | `.ib` alert box | ✅ Has type variants | 🟢 LOW |
| **Accordion** | Accordion | `.acc` collapsible items | ✅ Has items array | 🟢 LOW |
| **Spacer** | Spacer | Heights: 24/48/80/120px | ⚠️ Current: 40/80/120/160px | 🟢 LOW |

### ✅ Priority 4: Layout & Utility (3 blocks)

| HTML Block | Current Block | HTML Pattern | Fields Check | Priority |
|------------|--------------|-------------|--------------|----------|
| **TwoColumn** | TwoColumn | Two column container | ✅ Has ratio prop | 🟢 LOW |
| **Video** | Video | Video embed | ✅ Has aspect ratio | 🟢 LOW |
| **Code** | Code | `.code` syntax highlight | ✅ Has language select | 🟢 LOW |

### ❌ Missing in Shared - Needs Migration

| HTML Block | Current Location | Action Needed | Priority |
|------------|------------------|---------------|----------|
| **ComparisonTable** | `ecommerce/blocks/` | **PROMOTE TO SHARED** - Generic comparison, useful for ALL branches | 🔥 HIGH |

### ⚠️ Not in HTML Design - Decision Needed

| Current Block | In HTML? | Recommendation |
|---------------|---------|----------------|
| **CallToAction** | ❌ NO | Consider **MERGING** into CTA block as additional variant |
| **Map** | ❌ NO | Keep as optional utility block (not in design system but useful) |

### 🔧 Ecommerce-Specific - Stay in Branch

| HTML Block | Current Location | Reason |
|------------|------------------|--------|
| ProductGrid | `ecommerce/blocks/` | Product prices, stock, add-to-cart |
| QuickOrder | `ecommerce/blocks/` | SKU lookup, bulk ordering |
| ProductEmbed | `ecommerce/blocks/` | Inline product card with price |
| CategoryGrid | `ecommerce/blocks/` | Product category navigation |

---

## 🎯 HTML Pattern Examples

### Hero Block Pattern
```html
<div class="hero-d">
  <div class="badge">🏥 Plastimed</div>
  <h3>Uw partner in <span class="ac">medische supplies</span></h3>
  <p>4.000+ producten, persoonlijk advies, snelle levering.</p>
  <div style="margin-top:12px">
    <button class="b tl">Bekijk assortiment</button>
    <button class="b" style="background:none;border:1.5px solid rgba(255,255,255,0.2)">📞 Bel ons</button>
  </div>
</div>
```

**CSS Classes:**
- `.hero-d` - Dark hero with gradient background
- `.badge` - Badge/label element
- `.ac` - Accent text (gradient color)
- `.b` - Button base
- `.tl` - Teal primary button

### CTA Block Pattern
```html
<div class="cta-d">
  <div>
    <h4>Klaar om te starten?</h4>
    <p>Plastimed Pro 14 dagen gratis.</p>
  </div>
  <div>
    <button class="b tl">⭐ Start gratis</button>
  </div>
</div>
```

**CSS Classes:**
- `.cta-d` - Dark CTA card with gradient

### Testimonial Card Pattern
```html
<div class="tc">
  <span class="tc-mark">"</span>
  <div class="tc-stars">★★★★★</div>
  <div class="tc-q">"Uitstekende service, razendsnel geleverd."</div>
  <div class="tc-au">
    <div class="tc-av">JV</div>
    <div>
      <div class="tc-nm">Dr. J. van Dijk</div>
      <div class="tc-ro">Huisartsenpraktijk</div>
    </div>
  </div>
</div>
```

**CSS Classes:**
- `.tc` - Testimonial card
- `.tc-mark` - Large quote mark
- `.tc-stars` - Star rating
- `.tc-q` - Quote text
- `.tc-au` - Author container
- `.tc-av` - Avatar with initials
- `.tc-nm` - Author name
- `.tc-ro` - Author role

### FAQ Accordion Pattern
```html
<div class="fq">
  <div class="fq-q">Hoe werkt de levering?</div>
  <div class="fq-a">We leveren binnen 24 uur...</div>
</div>
```

**CSS Classes:**
- `.fq` - FAQ item (toggleable)
- `.fq-q` - Question
- `.fq-a` - Answer
- `.open` - Open state class

### Stats Pattern
```html
<div class="st-item">
  <div class="st-n">4.000+</div>
  <div class="st-l">Producten</div>
</div>
```

**CSS Classes:**
- `.st-item` - Stat card
- `.st-n` - Number (large)
- `.st-l` - Label

### Spacer Pattern
```html
<!-- Sizes: sm (24px), md (48px), lg (80px), xl (120px) -->
<div style="height:24px"></div>
<div style="height:48px"></div>
<div style="height:80px"></div>
<div style="height:120px"></div>
```

**Current Spacer sizes (NEED UPDATE):**
- small: 40px → should be 24px
- default: 80px → should be 48px
- large: 120px → should be 80px
- xlarge: 160px → should be 120px

---

## 🔍 Field Requirements Analysis

### Fields That Need Adding

#### Testimonials Block
- ⚠️ `showQuoteMark?: boolean` - Display large quote mark (HTML has `.tc-mark`)
- ⚠️ `quoteMarkStyle?: 'default' | 'large' | 'none'` - Quote styling options

#### Stats Block
- ⚠️ `layout?: 'grid' | 'horizontal'` - Add horizontal layout (from construction StatsBar)
- ⚠️ `showDividers?: boolean` - Vertical dividers between stats (horizontal layout)

#### Hero Block
- ✅ Already has `badge`, `titleAccent`
- Consider: `badgeIcon?: string` - Emoji/icon in badge

#### Spacer Block
- ⚠️ **Size values need update** to match HTML design (24/48/80/120px)

### Fields That Already Exist

✅ Hero: `badge`, `titleAccent`, `subtitle`, `buttons`, `variant`
✅ CTA: `variant: 'card' | 'full-width'`, dual buttons
✅ FAQ: `source: 'collection' | 'manual'`
✅ Features: `layout: 'grid-2' ... 'grid-6'`, `iconType`
✅ Services: `source: 'collection' | 'manual'`, grid layouts
✅ Pricing: plan features array, highlighted option
✅ ContactForm: reCAPTCHA settings
✅ Banner: `variant: 'info' | 'error' | 'success' | 'warning'`
✅ InfoBox: `type: 'info' | 'warning' | 'success' | 'danger'`

---

## 📦 Backup Strategy

### Before ANY Changes

**1. Create Timestamped Backup Directory**
```bash
mkdir -p docs/design/blocks/backups/backup-2026-02-23-shared-blocks
```

**2. Backup ALL 25 Shared Blocks**
```bash
# Copy entire shared/blocks/ directory
cp -r src/branches/shared/blocks/ docs/design/blocks/backups/backup-2026-02-23-shared-blocks/
```

**3. Document Current State**
```bash
# Create inventory
git log -1 --oneline > docs/design/blocks/backups/backup-2026-02-23-shared-blocks/COMMIT.txt
git diff --stat > docs/design/blocks/backups/backup-2026-02-23-shared-blocks/STATUS.txt
```

**4. Test Build Before Changes**
```bash
npm run build
# Output: Build time, any errors
# Document in BACKUP-LOG.md
```

### Blocks That Need Backup (24 total)

**High Priority (7):**
- Hero, CTA, FAQ, TestimonialsBlock, Features, Content, BlogPreview

**Medium Priority (7):**
- Services, Stats, Team, Pricing, ContactForm, Form, LogoBar

**Low Priority (10):**
- MediaBlock, ImageGallery, Banner, InfoBox, Accordion, Spacer, TwoColumn, Video, Code, CallToAction

**Extra (2 - decisions needed):**
- CallToAction (merge into CTA?)
- Map (not in HTML design, keep?)

---

## 🎯 Implementation Plan - Gefaseerd

### Fase 0: Preparation (2 hours)

**Task 1: Backup Current State** (30 min)
- Create backup directory with timestamp
- Copy all 25 shared blocks (config + components)
- Document current commit, git status
- Run build and document output

**Task 2: Field Schema Audit** (1 hour)
- Check each block's config.ts for required fields
- Identify missing fields (quote mark, horizontal stats, etc.)
- Create migration plan if database changes needed

**Task 3: Migration Setup** (30 min)
- Promote ComparisonTable from ecommerce to shared
- Update Pages collection imports
- Test build after migration

### Fase 1: Core Content Blocks (12-16 hours)

**Priority: 🔥 HIGH** - These blocks appear on most pages

| Block | Time Estimate | Key Changes |
|-------|--------------|-------------|
| Hero | 3h | Badge styling, `.ac` accent span, gradient backgrounds |
| CTA | 2h | Gradient card variant, button styling consistency |
| FAQ | 2h | Chevron icon animation, outline-none (DONE), border styling |
| Testimonials | 3h | Quote mark element, star display, avatar initials fallback |
| Features | 2h | Card hover states, icon sizing consistency |
| Content | 1h | Width variants validation, rich text styling |
| BlogPreview | 2h | Card layout, date formatting, excerpt truncation |

**Sub-tasks per block:**
1. Read current Component.tsx
2. Read current config.ts
3. Compare with HTML pattern
4. Update Component.tsx with theme vars
5. Update config.ts if fields needed
6. Test in dev server
7. Build test
8. Commit with descriptive message

### Fase 2: Data Display Blocks (10-14 hours)

**Priority: 🟡 MEDIUM** - Supporting content blocks

| Block | Time Estimate | Key Changes |
|-------|--------------|-------------|
| Services | 2h | Icon sizing, card borders, hover states |
| Stats | 3h | Add horizontal layout, dividers, gradient bg support |
| Team | 2h | Avatar fallback (initials), contact links styling |
| Pricing | 3h | Feature list styling, highlighted plan borders |
| LogoBar | 2h | Carousel animation speed, grid spacing |
| MediaBlock | 1h | Caption styling, breakout validation |
| ImageGallery | 1h | Grid spacing, caption positioning |

### Fase 3: Forms & Status (6-8 hours)

**Priority: 🟡 MEDIUM** - Functional blocks

| Block | Time Estimate | Key Changes |
|-------|--------------|-------------|
| ContactForm | 2h | Field styling, error states, button placement |
| Form | 2h | Dynamic field rendering, validation styling |
| Banner | 1h | Color variants, icon placement, close button |
| InfoBox | 1h | Type icons, border colors, padding |
| Accordion | 1h | Chevron animation, border styling |
| Spacer | 30min | **UPDATE SIZES** to 24/48/80/120px |

### Fase 4: Layout & Utility (3-4 hours)

**Priority: 🟢 LOW** - Basic utility blocks

| Block | Time Estimate | Key Changes |
|-------|--------------|-------------|
| TwoColumn | 1h | Ratio validation, responsive breakpoints |
| Video | 1h | Aspect ratio handling, placeholder styling |
| Code | 1h | Syntax highlighting theme, language labels |

### Fase 5: Decisions & Cleanup (2-3 hours)

| Task | Time | Action |
|------|------|--------|
| CallToAction analysis | 1h | Compare with CTA, decide merge or keep |
| Map block decision | 30min | Keep as optional utility (not in design) |
| Build & test all pages | 1h | Full regression test |
| Documentation update | 30min | Update BLOCK-ANALYSE.md with changes |

---

## ⚠️ Critical Rules During Implementation

### 1. Database Migrations
- ✅ IF adding/removing block fields → Run `npx payload migrate:create`
- ✅ IF changing field types/names → Run migration
- ✅ Test migration on empty database before production

### 2. TypeScript Safety
- ✅ Update `@/payload-types` imports if field types change
- ✅ Check all Component props match config fields
- ✅ Run `npm run typecheck` after each block update

### 3. Build Testing
- ✅ After EACH block update: `npm run build`
- ✅ Fix any compilation errors immediately
- ✅ Never move to next block with failing build

### 4. Commit Strategy
- ✅ One commit per block redesign
- ✅ Message format: `feat(blocks): Redesign [BlockName] to match HTML design system`
- ✅ Include before/after screenshots in commit message if possible

### 5. Theme Variables
- ✅ NEVER hardcode colors - always use `var(--token)`
- ✅ NEVER hardcode spacing - use Tailwind classes with 4px grid
- ✅ ALL interactive elements need hover/focus/disabled states

### 6. Backwards Compatibility
- ✅ Keep existing field names unless absolutely necessary
- ✅ Add new fields as optional with sensible defaults
- ✅ Test existing pages still render correctly

---

## 📈 Success Metrics

### Code Quality
- [ ] All 24 blocks use CSS custom properties (no hardcoded colors)
- [ ] All blocks follow 4px spacing grid
- [ ] All interactive elements have hover/focus/disabled states
- [ ] TypeScript compilation passes
- [ ] Build succeeds without warnings

### Design Consistency
- [ ] All blocks match HTML design patterns
- [ ] Dark sections use gradient(135deg, --navy, --navy-light)
- [ ] Cards use 1px border var(--grey) + hover shadow
- [ ] Buttons follow .b styling (36px min-height, border-radius var(--r-sm))

### Functionality
- [ ] All CMS fields feed dynamic content
- [ ] No static text in components (except placeholders)
- [ ] Responsive breakpoints work correctly
- [ ] Theme switching works via data-theme attribute

### Testing
- [ ] Dev server renders all blocks correctly
- [ ] Build succeeds without errors
- [ ] Existing pages still work
- [ ] No console errors/warnings

---

## 📚 Reference Files

### Key Documents
- `plastimed-master-design-system.html` - Complete design system reference (503 lines)
- `BLOCK-ANALYSE.md` - Current 36 blocks analysis
- `MASTER-REDESIGN-PLAN.md` - Overall redesign strategy
- This document - Shared blocks mapping

### Key Directories
```
src/branches/shared/blocks/          # 25 current shared blocks
src/branches/ecommerce/blocks/       # 5 ecommerce blocks (1 to migrate)
docs/design/blocks/backups/          # Backup location
docs/design/                         # Design documentation
```

### Build Instructions Reference (Chapter 7)
1. Always use CSS custom properties
2. Mobile-first responsive
3. Spacing follows 4px grid
4. All interactive elements need states
5. Transitions: `all var(--dur) var(--ease)`
6. Cards: 1px border + hover shadow
7. Dark sections: navy gradient + teal glow
8. Theme switching via data-theme
9. Each block = one Payload block type
10. Accessibility: keyboard focus, contrast, alt text

---

## 🚀 Next Steps

### Immediate Actions

1. **Create Backup** (NOW!)
   ```bash
   mkdir -p docs/design/blocks/backups/backup-2026-02-23-shared-blocks
   cp -r src/branches/shared/blocks/ docs/design/blocks/backups/backup-2026-02-23-shared-blocks/
   ```

2. **Test Current Build**
   ```bash
   npm run build
   # Document output in backup directory
   ```

3. **Start with Spacer** (simplest, 30 min)
   - Update size values: 24/48/80/120px
   - Quick win to test workflow

4. **Then Hero Block** (highest impact, 3h)
   - Most visible block
   - Sets pattern for others

5. **Continue with Priority 1 blocks** (12-16h total)
   - Core content blocks
   - Highest ROI

---

**Total Estimated Time: 35-45 hours**
- Fase 0 (Prep): 2h
- Fase 1 (Core): 12-16h
- Fase 2 (Data): 10-14h
- Fase 3 (Forms): 6-8h
- Fase 4 (Utility): 3-4h
- Fase 5 (Cleanup): 2-3h

**Status:** 📋 READY TO START - Backup first!

---

**Laatst bijgewerkt:** 2026-02-23
**Auteur:** Claude Code Analysis
