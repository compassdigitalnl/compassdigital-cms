# Branch Block Components — Implementatie Plan

> **Status:** Alle branch block configs (Payload admin-side) bestaan, maar de React rendering components ontbreken.
> **Impact:** Blocks worden niet gerenderd op de frontend — alleen de `faq` block werkt op construction01.
> **Prioriteit:** Hoog — construction01 homepage is vrijwel leeg.

---

## 1. Probleem Overzicht

### Hoe blocks werken

```
[Payload Admin]                    [Frontend]
Block Config (.ts)  ──>  Pages collection  ──>  RenderBlocks.tsx  ──>  React Component
   ✅ Bestaat              ✅ Data opgeslagen       ❌ Niet geregistreerd    ❌ Bestaat niet
```

### Huidige situatie per branch

| Branch | Block configs | React components | Geregistreerd in RenderBlocks |
|--------|-------------|-----------------|-------------------------------|
| **Construction** | 6 blocks | 0 components | 0 geregistreerd |
| **Ecommerce** | 5 blocks | 5 components | 3 geregistreerd (2 missen) |
| **Shared** | 24+ blocks | 20+ components | 21 geregistreerd |
| Beauty | 0 blocks | — | — |
| Horeca | 0 blocks | — | — |
| Hospitality | 0 blocks | — | — |

### Wat er moet gebeuren

1. **6 React components** maken voor construction blocks
2. **Feature-guarded registratie** in `RenderBlocks.tsx`
3. **2 bestaande ecommerce blocks** registreren (ComparisonTable, ProductEmbed)
4. **5 bestaande shared blocks** registreren (Banner, Code, FormBlock, InfoBox, MediaBlock)

---

## 2. Construction Block Components

### 2.1 Bestanden aanmaken

Maak deze directory aan: `src/branches/construction/blocks/components/`

### 2.2 ConstructionHeroComponent

**Bestand:** `src/branches/construction/blocks/components/ConstructionHero.tsx`
**Block slug:** `construction-hero`
**Config:** `src/branches/construction/blocks/ConstructionHero.ts`

**Props (uit block config):**
```typescript
interface ConstructionHeroProps {
  badge?: string              // "Al 35+ jaar uw partner"
  badgeIcon?: string          // Lucide icon naam, bijv. "award"
  title: string               // "Bouwen met {highlight}Vakmanschap{/highlight}"
  description: string         // Hero beschrijving
  primaryCTA: {
    text: string              // "Vraag Offerte Aan"
    icon?: string             // "arrowRight"
    link: string              // "/offerte-aanvragen"
  }
  secondaryCTA?: {
    text?: string
    icon?: string
    link?: string
  }
  trustText?: string          // "Vertrouwd door 500+ opdrachtgevers"
  trustSubtext?: string       // "Gemiddeld 4.9/5 beoordeeld"
  avatars?: Array<{
    initials: string          // "DV"
    color: 'teal' | 'blue' | 'purple' | 'amber'
  }>
  heroImage?: Media | number  // Upload relatie
  heroEmoji?: string          // "🏗️" (fallback als geen image)
  floatingBadges?: Array<{
    title: string
    subtitle?: string
    icon?: string
    color: 'green' | 'amber' | 'blue' | 'teal'
    position: 'bottom-left' | 'top-right'
  }>
}
```

**Rendering:**
- Full-width hero sectie met gradient achtergrond (`bg-theme-secondary` naar `bg-theme-secondary-light`)
- Titel: parse `{highlight}...{/highlight}` en wrap in `<span className="text-theme-accent">`
- Badge bovenaan met optioneel Lucide icoon
- Twee knoppen: primary (filled) en secondary (outline)
- Trust element: avatar cirkel stack + tekst
- Rechterhelft: hero image of emoji in cirkel
- Responsive: op mobiel stacked, op desktop side-by-side

**Voorbeeld layout:**
```
┌─────────────────────────────────────────────────────┐
│ [badge icon] Al 35+ jaar uw partner                 │
│                                                     │
│ Bouwen met                          ┌─────────┐    │
│ Vakmanschap                         │  🏗️     │    │
│                                     │         │    │
│ Van den Berg Bouw is al meer...     └─────────┘    │
│                                                     │
│ [Vraag Offerte Aan] [Onze Diensten]                │
│                                                     │
│ (👤👤👤) Vertrouwd door 500+ opdrachtgevers       │
│          Gemiddeld 4.9/5 beoordeeld                │
└─────────────────────────────────────────────────────┘
```

### 2.3 ServicesGridComponent

**Bestand:** `src/branches/construction/blocks/components/ServicesGrid.tsx`
**Block slug:** `services-grid`
**Config:** `src/branches/construction/blocks/ServicesGrid.ts`

**Props:**
```typescript
interface ServicesGridProps {
  heading: {
    badge?: string          // "Onze diensten"
    badgeIcon?: string      // "wrench"
    title: string           // "Alles onder één dak"
    description?: string
  }
  servicesSource: 'auto' | 'manual'
  services?: ConstructionService[] | number[]  // relationship (manual mode)
  limit?: number            // default 6
  columns?: '2' | '3' | '4'  // default '3'
  linkText?: string         // default "Meer info"
}
```

**Dit is een SERVER COMPONENT** — moet data fetchen:
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export async function ServicesGridComponent(props: any) {
  let services = []
  if (props.servicesSource === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'construction-services',
      where: { status: { equals: 'published' } },
      limit: props.limit || 6,
      sort: 'sortOrder',
    })
    services = result.docs
  } else {
    // Manual: services is relationship array, resolve if needed
    services = props.services || []
  }
  // Render heading + grid met ServiceCard
}
```

**Hergebruik:** `ServiceCard` component uit `src/branches/construction/components/ServiceCard/`

> **Let op:** `ServiceCard` checkt `status !== 'active'` maar de collection gebruikt `'published'`. Fix dit naar `status !== 'published'`.

### 2.4 StatsBarComponent

**Bestand:** `src/branches/construction/blocks/components/StatsBar.tsx`
**Block slug:** `stats-bar`
**Config:** `src/branches/construction/blocks/StatsBar.ts`

**Props:**
```typescript
interface StatsBarProps {
  style: 'default' | 'accent' | 'dark' | 'transparent'
  stats: Array<{
    value: string     // "35+"
    label: string     // "Jaar ervaring"
    icon: 'none' | 'construction' | 'star' | 'users' | 'trophy' | 'chart' | 'check' | 'target' | 'briefcase'
  }>
  layout: 'horizontal' | 'grid'
  animate: boolean
  dividers: boolean
}
```

**Rendering:**
- Horizontale balk met statistieken
- `accent` stijl: achtergrond `bg-theme-primary`, tekst wit
- `dark` stijl: achtergrond `bg-gray-900`, tekst wit
- `default` stijl: achtergrond `bg-white`, tekst donker
- Dividers: verticale lijnen tussen stats
- Animatie: optioneel count-up effect (kan later, voor nu gewoon statisch)

**Voorbeeld:**
```
┌────────────────────────────────────────────────────┐
│  35+          │  500+           │  98%      │  45  │
│  Jaar ervaring│  Projecten      │  Tevreden │  Vak │
└────────────────────────────────────────────────────┘
```

### 2.5 ProjectsGridComponent

**Bestand:** `src/branches/construction/blocks/components/ProjectsGrid.tsx`
**Block slug:** `projects-grid`
**Config:** `src/branches/construction/blocks/ProjectsGrid.ts`

**Props:**
```typescript
interface ProjectsGridProps {
  heading: {
    badge?: string
    title: string
    description?: string
  }
  projectsSource: 'auto' | 'featured' | 'manual' | 'category'
  projects?: ConstructionProject[] | number[]
  category?: ConstructionService | number
  limit?: number            // default 6
  columns?: '2' | '3' | '4'
  showFilter?: boolean
  ctaButton?: {
    enabled: boolean
    text?: string           // "Bekijk alle projecten"
    link?: string           // "/projecten"
  }
}
```

**SERVER COMPONENT** — fetcht data:
```typescript
// Auto: all published
// Featured: where featured equals true
// Manual: resolve relationships
// Category: filter by service/category
```

**Hergebruik:** `ProjectCard` uit `src/branches/construction/components/ProjectCard/`

### 2.6 ReviewsGridComponent

**Bestand:** `src/branches/construction/blocks/components/ReviewsGrid.tsx`
**Block slug:** `reviews-grid`
**Config:** `src/branches/construction/blocks/ReviewsGrid.ts`

**Props:**
```typescript
interface ReviewsGridProps {
  heading: {
    badge?: string
    title: string
    description?: string
  }
  reviewsSource: 'featured' | 'auto' | 'manual'
  reviews?: ConstructionReview[] | number[]
  limit?: number
  columns?: '2' | '3'
  layout: 'cards' | 'quotes' | 'compact'
  showRatings: boolean
  showAvatars: boolean
  averageRating?: {
    enabled: boolean
    position: 'top' | 'left'
  }
}
```

**SERVER COMPONENT** — fetcht reviews.

**Hergebruik:** `ReviewCard` uit `src/branches/construction/components/ReviewCard/`

### 2.7 CTABannerComponent

**Bestand:** `src/branches/construction/blocks/components/CTABanner.tsx`
**Block slug:** `cta-banner`
**Config:** `src/branches/construction/blocks/CTABanner.ts`

**Props:**
```typescript
interface CTABannerProps {
  style: 'gradient' | 'solid' | 'outlined' | 'image'
  backgroundImage?: Media | number
  badge?: string
  title: string
  description?: string
  buttons: Array<{
    text: string
    link: string
    variant: 'primary' | 'secondary' | 'white'
  }>
  trustElements?: {
    enabled: boolean
    items?: Array<{
      icon: 'check' | 'star' | 'trophy' | 'lock' | 'lightning'
      text: string
    }>
  }
  alignment: 'left' | 'center'
  size: 'small' | 'medium' | 'large'
}
```

**Rendering:**
- `gradient`: `bg-gradient-to-r from-theme-primary to-theme-primary-light`
- `solid`: `bg-theme-primary`
- `outlined`: border met witte achtergrond
- `image`: background-image met overlay
- Knoppen: primary = filled, secondary = outline, white = wit
- Trust elements: checkmarks/badges onder de knoppen

---

## 3. RenderBlocks.tsx Aanpassen

**Bestand:** `src/branches/shared/blocks/RenderBlocks.tsx`

### 3.1 Feature-guarded imports

```typescript
// Bestaande imports blijven...

// Construction blocks (lazy/conditional)
import { isFeatureEnabled } from '@/lib/features'

// Construction block components
import { ConstructionHeroComponent } from '@/branches/construction/blocks/components/ConstructionHero'
import { ServicesGridComponent } from '@/branches/construction/blocks/components/ServicesGrid'
import { StatsBarComponent as ConstructionStatsBar } from '@/branches/construction/blocks/components/StatsBar'
import { ProjectsGridComponent } from '@/branches/construction/blocks/components/ProjectsGrid'
import { ReviewsGridComponent } from '@/branches/construction/blocks/components/ReviewsGrid'
import { CTABannerComponent } from '@/branches/construction/blocks/components/CTABanner'

// Ecommerce blocks (niet geregistreerd maar component bestaat)
import { ComparisonTableComponent } from '@/branches/ecommerce/blocks/ComparisonTable/Component'
import { ProductEmbedComponent } from '@/branches/ecommerce/blocks/ProductEmbed/Component'
```

### 3.2 Conditional block map

```typescript
const blockComponents: Record<string, React.FC<any>> = {
  // ─── SHARED (altijd beschikbaar) ──────────────────
  content: ContentBlock,
  hero: HeroBlockComponent,
  features: FeaturesBlock,
  faq: FAQBlockComponent,
  cta: CTABlockComponent,
  twoColumn: TwoColumnBlockComponent,
  testimonials: TestimonialsBlockComponent,
  logoBar: LogoBarBlockComponent,
  stats: StatsBlockComponent,
  team: TeamBlockComponent,
  contactForm: ContactFormBlockComponent,
  pricing: PricingBlockComponent,
  imageGallery: ImageGalleryBlockComponent,
  video: VideoBlockComponent,
  map: MapBlockComponent,
  accordion: AccordionBlockComponent,
  spacer: SpacerBlockComponent,
  'blog-preview': BlogPreviewBlockComponent,

  // ─── ECOMMERCE (alleen als shop enabled) ──────────
  ...(isFeatureEnabled('shop') ? {
    categoryGrid: CategoryGrid,
    productGrid: ProductGrid,
    quickOrder: QuickOrderComponent,
    comparisontable: ComparisonTableComponent,
    productembed: ProductEmbedComponent,
  } : {}),

  // ─── CONSTRUCTION (alleen als construction enabled) ─
  ...(isFeatureEnabled('construction') ? {
    'construction-hero': ConstructionHeroComponent,
    'services-grid': ServicesGridComponent,
    'stats-bar': ConstructionStatsBar,
    'projects-grid': ProjectsGridComponent,
    'reviews-grid': ReviewsGridComponent,
    'cta-banner': CTABannerComponent,
  } : {}),
}
```

**Waarom feature guards hier?**
- Als een block in de database staat maar de feature is uitgeschakeld, rendert het block niet
- Voorkomt crashes door ontbrekende collections (bijv. `construction-services` bestaat niet op een beauty site)
- Dubbele veiligheid: admin-side (DISABLED_COLLECTIONS) + frontend (isFeatureEnabled)

---

## 4. Styling Richtlijnen

### Tailwind + Theme variabelen

```css
/* Beschikbare CSS variabelen (gezet door ThemeProvider): */
var(--color-primary)          /* #1e3a5f op construction01 */
var(--color-primary-light)    /* #2d5a8e */
var(--color-secondary)        /* #f59e0b */
var(--color-secondary-light)  /* #fbbf24 */
var(--color-accent)           /* #16a34a */
var(--color-background)       /* #f8fafc */
var(--color-surface)          /* #ffffff */
var(--color-border)           /* #e2e8f0 */
var(--color-text-primary)     /* #0f172a */
var(--color-text-secondary)   /* #475569 */
```

### Tailwind theme classes

```html
<!-- Gebruik deze ipv hardcoded kleuren: -->
<div className="bg-theme-primary text-white">            <!-- primary achtergrond -->
<div className="bg-theme-secondary">                      <!-- secondary achtergrond -->
<span className="text-theme-primary">                     <!-- primary tekstkleur -->
<button className="bg-theme-accent hover:bg-theme-accent/90"> <!-- accent knop -->
<div className="border-theme-border">                     <!-- border kleur -->
```

### Responsive (mobile-first)

```html
<!-- Altijd mobile-first: base = mobiel, md: = tablet, lg: = desktop -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
<section className="py-12 md:py-16 lg:py-20 px-4 md:px-6">
```

---

## 5. Bestaande Components

### Card components (hergebruiken in grid blocks)

| Component | Pad | Props | Let op |
|-----------|-----|-------|--------|
| `ServiceCard` | `src/branches/construction/components/ServiceCard/` | `service: ConstructionService, variant, showCTA` | **Bug:** checkt `status !== 'active'` maar collection gebruikt `'published'` |
| `ProjectCard` | `src/branches/construction/components/ProjectCard/` | `project: ConstructionProject, variant, showTestimonial` | Gebruikt `Image` van next/image |
| `ReviewCard` | `src/branches/construction/components/ReviewCard/` | `review: ConstructionReview, variant, showProject` | Heeft SCSS styles |

**Alle card components hebben eigen SCSS files** (`styles.scss`). Check of deze compatible zijn met de Tailwind setup.

---

## 6. Toekomstige Branches

Beauty, Horeca en Hospitality hebben nog GEEN blocks. Ze gebruiken hardcoded route pages:

| Branch | Huidige aanpak | Toekomstige blocks |
|--------|---------------|-------------------|
| Beauty | `/salon/page.tsx` inline JSX | `beauty-hero`, `treatments-grid`, `portfolio-grid`, `booking-widget` |
| Horeca | `/restaurant/page.tsx` inline JSX | `horeca-hero`, `menu-grid`, `reservation-widget`, `events-grid` |
| Hospitality | `/fysio/page.tsx` inline JSX | `hospitality-hero`, `treatments-grid`, `practitioners-grid`, `booking-form` |

Dit is **Phase 2** werk. Eerst construction blocks werkend krijgen als referentie-implementatie.

---

## 7. Checklist

- [ ] `src/branches/construction/blocks/components/ConstructionHero.tsx`
- [ ] `src/branches/construction/blocks/components/ServicesGrid.tsx`
- [ ] `src/branches/construction/blocks/components/StatsBar.tsx`
- [ ] `src/branches/construction/blocks/components/ProjectsGrid.tsx`
- [ ] `src/branches/construction/blocks/components/ReviewsGrid.tsx`
- [ ] `src/branches/construction/blocks/components/CTABanner.tsx`
- [ ] `src/branches/construction/blocks/components/index.ts` (barrel export)
- [ ] `RenderBlocks.tsx` — construction blocks registreren met feature guard
- [ ] `RenderBlocks.tsx` — `ComparisonTable` en `ProductEmbed` registreren met shop guard
- [ ] `ServiceCard` bug fix: `status !== 'active'` → `status !== 'published'`
- [ ] Test op construction01: alle 7 homepage blocks renderen
- [ ] Test op plastimed01: construction blocks worden NIET geladen (feature disabled)

---

## 8. Test Data (al aanwezig in construction01 database)

| Collection | Records | Status |
|-----------|---------|--------|
| `construction-services` | 6 diensten | published |
| `construction-projects` | 0 projecten | — |
| `construction-reviews` | 5 reviews | published |
| `faqs` | 6 FAQs | published |
| `pages` | 3 (Home, Over Ons, Contact) | published |

De homepage (slug: `home`) heeft deze blocks:
1. `construction-hero` — Van den Berg hero
2. `services-grid` — 6 diensten auto-fetch
3. `stats-bar` — 4 statistieken (35+, 500+, 98%, 45)
4. `projects-grid` — featured projects (leeg, 0 projecten)
5. `reviews-grid` — featured reviews (5 reviews)
6. `cta-banner` — "Klaar voor uw bouwproject?"
7. `faq` — Veelgestelde vragen (werkt al)
