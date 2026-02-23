# Master Redesign Plan — Branch Components & Blocks

**Datum:** 2026-02-23
**Basis:** BLOCK-ANALYSE.md + DESIGN-REBUILD-SPRINT2.md
**Scope:** Volledige redesign van alle 5 branches volgens HTML mockups

---

## Executive Summary

Dit master plan combineert:
1. **Blokken inventarisatie** — 36 bestaande blokken (25 shared + 11 branch-specific)
2. **Design rebuild instructies** — ~90 componenten te herschrijven voor 5 branches
3. **Gefaseerde implementatie** — Strategische volgorde om maximale impact te behalen

### Totale Scope

| Branch | HTML Mockups | Componenten | Design Tokens | Fonts |
|--------|--------------|-------------|---------------|-------|
| **Construction** | 5 files (sprint-2) | 11 components | Navy + Teal | Plus Jakarta Sans + DM Sans |
| **Zorg/Hospitality** | 5 files (sprint-4) | 15 components | Navy + Teal | Plus Jakarta Sans + DM Sans |
| **Beauty** | 5 files (sprint-5) | 18 components | Navy + Teal + Pink/Purple | Plus Jakarta Sans + DM Sans |
| **Horeca** | 5 files (sprint-6) | 20 components | Warm Brown + Gold | Playfair Display (serif) + DM Sans |
| **Ecommerce** | 8 files (sprint-1,3,7,9) | 30 components | Navy + Teal | Plus Jakarta Sans + DM Serif |

**Totaal:** 27 HTML mockups → ~94 componenten te (her)schrijven

---

## Architectuur Overzicht

### Huidige Blokken (36 stuks)

```
src/branches/
├── shared/blocks/          → 25 blokken (ALTIJD beschikbaar)
│   ├── Layout/Structuur    → Hero, Content, TwoColumn, Spacer
│   ├── CTA                 → CTA, CallToAction
│   ├── Content/Media       → BlogPreview, MediaBlock, ImageGallery, Video, Code
│   ├── Data/Features       → Features, Services, FAQ, TestimonialsBlock, Stats, Team, Pricing, LogoBar
│   ├── Formulieren         → ContactForm, Form
│   ├── Status/Notificaties → Banner, InfoBox, Accordion
│   └── Overig              → Map
│
├── ecommerce/blocks/       → 5 blokken (alleen als shop enabled)
│   ├── ProductGrid         → Product kaarten met bdges, voorraad, prijzen
│   ├── CategoryGrid        → Productcategorie kaarten met Quick Order
│   ├── ProductEmbed        → Inline product kaart
│   ├── ComparisonTable     → Interactieve vergelijkingstabel
│   └── QuickOrder          → Bulk bestellen per SKU/EAN, CSV upload
│
└── construction/blocks/    → 6 blokken (alleen als construction enabled)
    ├── ConstructionHero    → Hero met {highlight} syntax, floating badges, avatar trust
    ├── CTABanner           → 4 achtergrondstijlen, trust elements, badge, size
    ├── ProjectsGrid        → Fetcht construction-projects, filter buttons
    ├── ReviewsGrid         → Gemiddelde rating, construction-reviews
    ├── ServicesGrid        → Fetcht construction-services
    └── StatsBar            → Horizontal layout, 4 achtergrondstijlen, 9 iconen
```

### Aanbevolen Promoties naar Shared

Gebaseerd op BLOCK-ANALYSE.md:

| Branch Blok | Shared Promotie | Reden |
|------------|----------------|-------|
| **ComparisonTable** (ecommerce) | **Nieuw shared blok** | Generiek bruikbaar voor ALLE branches (features vergelijken, pakketten, diensten) |
| **StatsBar horizontal** (construction) | **Merge in Stats blok** | Horizontal layout + achtergrondstijlen als variant |
| **ReviewsGrid gemiddelde rating** (construction) | **Merge in TestimonialsBlock** | Gemiddelde rating berekening als optie |

---

## Gefaseerde Implementatie

### FASE 0: Fundamenten (Week 1) — SHARED BLOCKS EERST

**Doel:** Verbeter de 25 shared blokken die ALLE branches gebruiken.

**Prioriteit:** CRITICAL — Deze blokken worden gebruikt door alle 5 branches. Verbeteringen hier hebben de grootste impact.

#### 0.1 Promoot ComparisonTable naar Shared (2-3 uur)

**Actie:**
```bash
# Verplaats van ecommerce naar shared
mv src/branches/ecommerce/blocks/ComparisonTable src/branches/shared/blocks/

# Update exports
# Update Pages collection registration
```

**Waarom:** Vergelijkingstabellen zijn generiek bruikbaar voor:
- Construction: Diensten vergelijken (dakwerken basic vs premium)
- Zorg: Behandel opties vergelijken
- Beauty: Pakketten vergelijken
- Horeca: Menu pakketten vergelijken
- Ecommerce: Product specificaties vergelijken

**Impact:** +1 shared blok → beschikbaar voor alle branches

---

#### 0.2 Breid Stats Blok Uit (3-4 uur)

**Actie:**
Merge StatsBar features (construction) in bestaand Stats blok (shared):

**Bestand:** `src/branches/shared/blocks/Stats/Component.tsx`

```tsx
// Nieuwe props
interface StatsBlockProps {
  layout?: 'grid-2' | 'grid-3' | 'grid-4' | 'horizontal'  // ← NEW
  style?: 'default' | 'accent' | 'dark' | 'transparent'   // ← NEW
  showDividers?: boolean                                   // ← NEW (voor horizontal)
  // ... bestaande props
}

// Layout logica
if (layout === 'horizontal') {
  return (
    <div className="flex items-center gap-8 divide-x divide-white/20">
      {stats.map((stat, i) => (
        <div key={i} className={i > 0 ? 'pl-8' : ''}>
          {/* stat content */}
        </div>
      ))}
    </div>
  )
}
```

**Waarom:** Horizontal stats layout is populair in construction en horeca designs.

**Impact:** Stats blok krijgt +2 layouts, +4 achtergrondstijlen

---

#### 0.3 Breid TestimonialsBlock Uit (2-3 uur)

**Actie:**
Merge ReviewsGrid features (construction) in bestaand TestimonialsBlock (shared):

**Bestand:** `src/branches/shared/blocks/TestimonialsBlock/Component.tsx`

```tsx
interface TestimonialsBlockProps {
  showAverageRating?: boolean  // ← NEW
  ratingSource?: 'google' | 'manual'  // ← NEW
  // ... bestaande props
}

// Gemiddelde rating berekening
const averageRating = useMemo(() => {
  if (!testimonials?.length) return 0
  const sum = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0)
  return (sum / testimonials.length).toFixed(1)
}, [testimonials])

// Rating display (boven reviews)
{showAverageRating && (
  <div className="text-center mb-8">
    <div className="text-5xl font-bold">{averageRating}</div>
    <div className="flex justify-center mt-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} filled={i < Math.round(averageRating)} />
      ))}
    </div>
    <p className="text-gray-600 mt-2">
      Gebaseerd op {testimonials.length} beoordelingen
    </p>
  </div>
)}
```

**Waarom:** Gemiddelde rating display is standaard voor zorg, beauty, horeca.

**Impact:** TestimonialsBlock krijgt +1 optie (gemiddelde rating)

---

**FASE 0 Totaal:** ~8-10 uur → 3 shared blokken verbeterd

**Deliverables:**
- ✅ ComparisonTable beschikbaar voor alle branches
- ✅ Stats blok: horizontal layout + achtergrondstijlen
- ✅ TestimonialsBlock: gemiddelde rating display

---

### FASE 1: Construction Branch (Week 2-3)

**Basis:** `docs/design/sprint-2/bouw-*.html` (5 mockups)
**Componenten:** 11 te herschrijven

**Prioriteit:** HIGH — Minste dependencies, meeste unique features

#### 1.1 Design System Setup (2 uur)

**Actie:**
1. Fonts laden (Plus Jakarta Sans, DM Sans) in `(construction)/layout.tsx`
2. CSS tokens toevoegen in `globals.css` of `(construction)/construction.css`
3. Tailwind config uitbreiden met construction-specifieke kleuren

**Deliverables:**
- ✅ Navy (#0A1628) + Teal (#00897B) palette
- ✅ Plus Jakarta Sans headings
- ✅ CSS custom properties voor shadows, radius, transitions

---

#### 1.2 Branch-Specific Blocks (16-20 uur)

**Volgorde:**

| Component | Tijd | Prioriteit | Dependencies |
|-----------|------|-----------|--------------|
| **StatsBar** | 2h | MEDIUM | Alleen CSS redesign (logic blijft) |
| **ServiceCard** | 3h | HIGH | Gebruikt door ServicesGrid |
| **ServicesGrid** | 2h | HIGH | Homepage sectie |
| **ProjectCard** | 4h | HIGH | Dark section design, complex hover |
| **ProjectsGrid** | 2h | HIGH | Homepage + overview page |
| **ReviewCard** | 3h | MEDIUM | Cards/quotes/compact variants |
| **ReviewsGrid** | 2h | MEDIUM | Homepage sectie |
| **CTABanner** | 2h | HIGH | Navy gradient design |

**Subtotaal:** 20 uur

---

#### 1.3 Pages (12-16 uur)

| Pagina | Tijd | Componenten |
|--------|------|-------------|
| Service Detail | 4h | Hero, sidebar, content, related projects |
| Project Detail | 3h | Gallery, info grid, content |
| Projects Overview | 2h | Filter buttons, grid layout |
| Offerte Aanvragen | 3h | QuoteForm redesign |

**Subtotaal:** 12 uur

---

**FASE 1 Totaal:** ~34-38 uur (2-3 weken part-time)

**Deliverables:**
- ✅ 6 construction blocks herschreven volgens sprint-2 designs
- ✅ 4 construction pages herschreven
- ✅ Construction branch volledig pixel-perfect

---

### FASE 2: Zorg/Hospitality Branch (Week 4-5)

**Basis:** `docs/design/sprint-4/zorg-*.html` (5 mockups)
**Componenten:** 15 te herschrijven

**Prioriteit:** HIGH — Healthcare heeft specifieke UX vereisten

#### 2.1 Design System (2 uur)

Zelfde palette als construction (Navy + Teal), maar andere accenten:
- Urgentie indicators (rood/oranje)
- Vertrouwen elementen (groene checkmarks)
- Verzekeraar badges

---

#### 2.2 Nieuwe Componenten (20-24 uur)

| Component | Tijd | Type | Beschrijving |
|-----------|------|------|-------------|
| **UrgencyBar** | 2h | Nieuw | Stats bar met urgentie indicators |
| **InsuranceBadges** | 2h | Nieuw | Verzekering logos strip |
| **TreatmentCard** | 3h | Redesign | Service card variant voor behandelingen |
| **PractitionerCard** | 3h | Nieuw | Team card met specialisaties |
| **BookingWidget** | 4h | Nieuw | Afspraak widget (sidebar) |
| **InfoChecklistCard** | 2h | Nieuw | Voor/na behandeling instructies |
| **VerificationChecker** | 3h | Nieuw | Vergoeding checker tool |
| **TariffTable** | 3h | Nieuw | Tarieven tabel met filters |

**Subtotaal:** 22 uur

---

#### 2.3 Pages (12 uur)

| Pagina | Tijd |
|--------|------|
| Homepage (zorg-homepage.html) | 3h |
| Behandeling Detail (zorg-behandeling-detail.html) | 3h |
| Contact & Afspraak (zorg-contact.html) | 2h |
| Patiënteninfo (zorg-patienteninfo.html) | 2h |
| Tarieven (zorg-tarieven.html) | 2h |

**Subtotaal:** 12 uur

---

**FASE 2 Totaal:** ~36 uur (2 weken part-time)

**Deliverables:**
- ✅ 8 nieuwe zorg-specifieke componenten
- ✅ 5 zorg pages herschreven
- ✅ Booking flow werkend

---

### FASE 3: Beauty Branch (Week 6-8)

**Basis:** `docs/design/sprint-5/beauty-*.html` (5 mockups)
**Componenten:** 18 te herschrijven

**Prioriteit:** MEDIUM — Visueel complex, veel interactie

#### 3.1 Design System (3 uur)

Navy + Teal basis + Pink/Purple accenten:
- Instagram integratie
- Before/After sliders
- Booking flow met visuele stappen

---

#### 3.2 Nieuwe Componenten (28-32 uur)

| Component | Tijd | Complexiteit | Beschrijving |
|-----------|------|-------------|-------------|
| **Topbar** | 1h | Low | Openingstijden + social links |
| **BeautyHero** | 3h | Medium | Photo background, stats overlay |
| **TreatmentItem** | 2h | Low | Lijst item met prijs, duur |
| **CategorySection** | 2h | Low | Behandelingen per categorie |
| **OfferCard** | 2h | Low | Sidebar speciale aanbieding |
| **PackageCard** | 2h | Low | Pakket kaarten |
| **BookingProgressBar** | 2h | Medium | 4-stappen indicator |
| **TreatmentSelector** | 3h | Medium | Stap 1: behandeling kiezen |
| **StylistSelector** | 3h | Medium | Stap 2: stylist kiezen met foto's |
| **DateTimePicker** | 4h | HIGH | Stap 3: kalender + tijdsloten |
| **BookingSummary** | 2h | Low | Sidebar samenvatting |
| **BeforeAfterSlider** | 3h | HIGH | Portfolio before/after |
| **InstagramGallery** | 2h | Medium | API integratie |

**Subtotaal:** 31 uur

---

#### 3.3 Pages (10 uur)

| Pagina | Tijd |
|--------|------|
| Homepage (beauty-homepage.html) | 2h |
| Behandelingen Overzicht (beauty-behandelingen.html) | 2h |
| Booking Flow (beauty-boeken.html) | 3h |
| Contact (beauty-contact.html) | 1h |
| Portfolio (beauty-portfolio.html) | 2h |

**Subtotaal:** 10 uur

---

**FASE 3 Totaal:** ~44 uur (3 weken part-time)

**Deliverables:**
- ✅ 13 nieuwe beauty-specifieke componenten
- ✅ 5 beauty pages herschreven
- ✅ Complete booking flow werkend

---

### FASE 4: Horeca Branch (Week 9-11)

**Basis:** `docs/design/sprint-6/horeca-*.html` (5 mockups)
**Componenten:** 20 te herschrijven

**Prioriteit:** MEDIUM — Unieke design (serif fonts, warm palette)

#### 4.1 Design System (3 uur)

**Grote verschillen:**
- Warm Brown (#2C1810) + Gold (#C9A84C) — volledig andere palette!
- Playfair Display (serif) headings — elegante typografie
- Donkere hero's, food photography, textures

**Extra werk:** Custom color system, font loading, dark sections

---

#### 4.2 Nieuwe Componenten (32-36 uur)

| Component | Tijd | Complexiteit | Beschrijving |
|-----------|------|-------------|-------------|
| **HorecaHeader** | 2h | Low | Elegant header met logo |
| **HeroSection** | 3h | Medium | Food photo background, serif heading |
| **MenuHighlights** | 3h | Medium | 3-kolom menu preview met gold accenten |
| **ReservationBanner** | 2h | Low | CTA met datum/tijd picker preview |
| **AtmosphereGallery** | 2h | Low | 6-kolom sfeer foto's |
| **EventPackageCard** | 3h | Medium | Evenement pakketten met prijzen |
| **VenueCard** | 2h | Low | Ruimte kaarten (zalen) |
| **CateringMenu** | 3h | Medium | Menu met categorieën, allergenen |
| **EventRequestForm** | 3h | Medium | Evenement aanvraag formulier |
| **MenuToolbar** | 2h | Low | Sticky categorie filter |
| **MenuItem** | 2h | Low | Gerecht kaart met prijs, allergenen |
| **ChefSpecial** | 2h | Low | Featured gerecht highlight |
| **PhilosophyCards** | 2h | Low | 3 pilaren van de zaak |
| **TeamSection** | 2h | Low | DARK section met chef foto's |
| **Timeline** | 2h | Medium | Geschiedenis tijdlijn |
| **AwardsGrid** | 1h | Low | Prijzen/certificaten |
| **ReservationForm** | 3h | Medium | Volledig reserveringsformulier |

**Subtotaal:** 36 uur

---

#### 4.3 Pages (10 uur)

| Pagina | Tijd |
|--------|------|
| Homepage (horeca-homepage.html) | 2h |
| Evenementen (horeca-evenementen.html) | 2h |
| Menukaart (horeca-menukaart.html) | 2h |
| Over Ons (horeca-over-ons.html) | 2h |
| Reserveren (horeca-reserveren.html) | 2h |

**Subtotaal:** 10 uur

---

**FASE 4 Totaal:** ~49 uur (3-4 weken part-time)

**Deliverables:**
- ✅ 17 nieuwe horeca-specifieke componenten
- ✅ 5 horeca pages herschreven
- ✅ Complete reservering flow werkend
- ✅ Dark sections + serif typography system

---

### FASE 5: Ecommerce Branch (Week 12-16)

**Basis:** `docs/design/sprint-{1,3,7,9}/plastimed-*.html` (8 mockups)
**Componenten:** 30 te herschrijven

**Prioriteit:** HIGH — Meest complex, veel bestaande code, grootste impact

#### 5.1 Design System (4 uur)

Navy + Teal basis + E-commerce specifiek:
- 3-laags flyout menu systeem
- Product badges (new/sale/popular/sold-out)
- Mini cart slide-out
- Search autocomplete
- Login/register modal

---

#### 5.2 Header & Navigatie (16-20 uur)

**Meest complexe component van ALLE branches!**

| Component | Tijd | Complexiteit | Beschrijving |
|-----------|------|-------------|-------------|
| **Topbar** | 2h | Low | USP's + taal/valuta |
| **HeaderBar** | 3h | Medium | Logo, search, account, cart |
| **NavigationBar** | 3h | Medium | Categorie triggers |
| **BranchDropdown** | 2h | Medium | Multi-branch selector |
| **3-Layer Flyout** | 6h | VERY HIGH | 3 kolommen: categorieën > subcategorieën > producten |
| **MobileDrawer** | 4h | HIGH | Mobile navigatie met accordion |

**Subtotaal:** 20 uur

**NOTE:** Dit is de moeilijkste component van het hele project. De 3-laags flyout heeft:
- Hover states op 3 niveaus
- Dynamic content loading
- Product previews met afbeeldingen
- Featured products sectie
- Keyboard navigation
- Mobile responsive variant

---

#### 5.3 Kennisbank & Paywall (12 uur)

| Component | Tijd |
|-----------|------|
| KennisbankHero | 2h |
| ArticleFilterBar | 2h |
| FeaturedArticleCard | 2h |
| ArticleCard | 2h |
| BlurContentZone | 2h |
| PaywallCard (met 3 plan tiers) | 2h |

**Subtotaal:** 12 uur

---

#### 5.4 Winkelwagen Variants (16 uur)

| Component | Tijd | Beschrijving |
|-----------|------|-------------|
| **Cart Variant A (Compact)** | 8h | Tabel layout, compacte weergave |
| CartTable | 3h | Product rijen met quantity stepper |
| CouponRow | 2h | Kortingscode input |
| OrderSummary | 2h | Sidebar totalen |
| UpsellSection | 1h | Related products |
| **Cart Variant B (Visueel)** | 8h | Card layout, grote afbeeldingen |
| StepIndicator | 2h | Checkout voortgang |
| ProductCard | 3h | Card met grote foto |
| SidebarSummary | 2h | Sticky sidebar |
| RecentlyViewed | 1h | Recent bekeken producten |

**Subtotaal:** 16 uur

---

#### 5.5 Login & Registratie (12 uur)

| Component | Tijd |
|-----------|------|
| SplitLayout | 1h |
| BrandingPanel | 2h |
| AuthTabs | 2h |
| OAuthButtons | 2h |
| FormFields | 2h |
| PasswordStrengthIndicator | 2h |
| B2BNotification | 1h |

**Subtotaal:** 12 uur

---

#### 5.6 Bestaande Ecommerce Blocks Update (8 uur)

Update bestaande 5 ecommerce blocks naar nieuwe design:

| Blok | Tijd |
|------|------|
| ProductGrid | 2h |
| CategoryGrid | 2h |
| ProductEmbed | 1h |
| ComparisonTable | 1h (als nog niet naar shared verplaatst) |
| QuickOrder | 2h |

**Subtotaal:** 8 uur

---

**FASE 5 Totaal:** ~72 uur (4-5 weken part-time)

**Deliverables:**
- ✅ Complete header met 3-laags flyout menu
- ✅ Kennisbank + paywall systeem
- ✅ 2 winkelwagen variants
- ✅ Login/registratie flow
- ✅ 5 ecommerce blocks ge-update

---

## Totale Planning Samenvatting

| Fase | Branch | Weken | Uren | Status | Prioriteit |
|------|--------|-------|------|--------|-----------|
| **0** | **Shared Blocks** | 1 | 8-10 | 🟡 TODO | CRITICAL |
| **1** | **Construction** | 2-3 | 34-38 | 🟡 TODO | HIGH |
| **2** | **Zorg/Hospitality** | 2 | 36 | 🟡 TODO | HIGH |
| **3** | **Beauty** | 3 | 44 | 🟡 TODO | MEDIUM |
| **4** | **Horeca** | 3-4 | 49 | 🟡 TODO | MEDIUM |
| **5** | **Ecommerce** | 4-5 | 72 | 🟡 TODO | HIGH |

**Totaal:** 15-18 weken part-time (~240-250 uur)

---

## Quick Wins (Korte Termijn Impact)

Prioriteer deze taken voor snelle zichtbare resultaten:

### Week 1: Quick Wins

| Taak | Tijd | Impact | ROI |
|------|------|--------|-----|
| ComparisonTable → shared | 3h | 🟢🟢🟢 Alle branches | VERY HIGH |
| Stats horizontal layout | 2h | 🟢🟢 Construction + Horeca | HIGH |
| TestimonialsBlock avg rating | 2h | 🟢🟢 Zorg + Beauty + Horeca | HIGH |

**Totaal:** 7 uur → 3 verbeterde shared blocks

---

## Dependencies & Blokkerende Factoren

### Technische Dependencies

1. **Font Loading**
   - Plus Jakarta Sans moet geladen worden in 4 branches
   - Playfair Display alleen voor Horeca
   - DM Serif Display voor Ecommerce

2. **CSS Custom Properties**
   - Elke branch heeft eigen color palette
   - Conflicten voorkomen met scoped CSS of CSS modules

3. **Collection Schema's**
   - Zorg: `treatments`, `practitioners` collections nodig
   - Beauty: `stylists`, `bookings` collections nodig
   - Horeca: `menu-items`, `reservations` collections nodig

### Niet-Blokkerende Afhankelijkheden

Deze kunnen parallel worden ontwikkeld:

- Construction ProjectsGrid ↔ Zorg TreatmentCard (verschillende collections)
- Beauty BookingFlow ↔ Horeca ReservationForm (verschillende UI)
- Ecommerce Header ↔ Construction Footer (geen overlap)

---

## Testing Strategie

### Per Fase

Na elke fase:
1. **Visual Regression Tests** — Screenshot comparison met HTML mockups
2. **Responsive Tests** — Mobile, tablet, desktop
3. **Cross-browser Tests** — Chrome, Firefox, Safari
4. **Accessibility Tests** — WCAG 2.1 AA compliance
5. **Performance Tests** — Lighthouse score > 90

### Acceptance Criteria

Component is "Done" als:
- ✅ Pixel-perfect match met HTML mockup (±5px tolerance)
- ✅ Responsive op 3 breakpoints
- ✅ WCAG 2.1 AA compliant
- ✅ TypeScript types compleet
- ✅ Props gedocumenteerd
- ✅ No console errors/warnings

---

## Risico's & Mitigatie

| Risico | Impact | Probability | Mitigatie |
|--------|--------|------------|-----------|
| **HTML mockups missen details** | HIGH | MEDIUM | Iteratief design reviews met stakeholder |
| **Font licensing issues** | MEDIUM | LOW | Google Fonts zijn gratis, fallback fonts definiëren |
| **CSS conflicts tussen branches** | HIGH | MEDIUM | CSS Modules of scoped styles per branch |
| **3-laags flyout menu te complex** | HIGH | HIGH | Start met eenvoudige 2-laags versie, iteratief uitbreiden |
| **Booking/Reservation flow bugs** | MEDIUM | MEDIUM | Uitgebreide E2E tests met Playwright |
| **Performance issues met image galleries** | MEDIUM | MEDIUM | Lazy loading, responsive images, CDN |

---

## Post-Launch Optimalisaties

### Na alle 5 fasen compleet:

1. **Performance Audit** (1 week)
   - Bundle size analyse
   - Lazy loading optimalisatie
   - Image optimization (WebP, AVIF)
   - Critical CSS extraction

2. **Accessibility Audit** (1 week)
   - Screen reader testing
   - Keyboard navigation fixes
   - Color contrast improvements
   - ARIA labels

3. **Mobile UX Improvements** (1 week)
   - Touch target sizes
   - Swipe gestures
   - Bottom sheet modals
   - Mobile-first forms

4. **SEO Optimization** (1 week)
   - Structured data (JSON-LD)
   - Meta tags per branch
   - OpenGraph images
   - Sitemap generation

**Totaal:** 4 weken (post-launch)

---

## Resources & Tools

### Design Resources

- **HTML Mockups:** `docs/design/sprint-{2,4,5,6,1,3,7,9}/`
- **Block Analysis:** `docs/design/blocks/BLOCK-ANALYSE.md`
- **Rebuild Instructions:** `docs/design/branches/DESIGN-REBUILD-SPRINT2.md`

### Development Tools

- **Component Library:** Shadcn UI + Tailwind CSS
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Date Pickers:** React Day Picker
- **Image Optimization:** Next.js Image component
- **Testing:** Playwright (E2E), Vitest (unit)

### Collaboration

- **Design Reviews:** Figma comments op HTML mockup screenshots
- **Code Reviews:** GitHub PR's per component
- **Progress Tracking:** GitHub Projects kanban board
- **Documentation:** Storybook per component

---

## Next Steps

### Deze Week (Fase 0 Start)

1. **Lees volledige DESIGN-REBUILD-SPRINT2.md** — Begrijp alle details
2. **Kies 1 quick win** — Start met ComparisonTable promotie
3. **Setup development branch** — `git checkout -b feature/shared-blocks-redesign`
4. **Implementeer eerste component** — Voltooi in 1 sessie
5. **Test & review** — Visual comparison met mockup
6. **Commit & push** — Merge naar main

### Volgende Week (Fase 0 Compleet)

1. **Stats horizontal layout** — Implementeer variant
2. **TestimonialsBlock avg rating** — Merge ReviewsGrid feature
3. **Test alle 3 quick wins** — Cross-browser, responsive
4. **Document changes** — Update component README's
5. **Klaar voor Fase 1** — Construction branch start

---

**Laatst bijgewerkt:** 2026-02-23
**Versie:** 1.0
**Auteur:** Claude Code
**Status:** 🟡 Ready for Review

