# Theme Refactoring Plan — Alle hardcoded kleuren/fonts elimineren

**Datum:** 14 maart 2026
**Status:** Plan — nog niet geïmplementeerd
**Impact:** 323 bestanden in `src/branches/` en `src/globals/`

---

## Het Probleem

Het Theme global (`/admin/globals/theme/`) biedt 54 design tokens die via ThemeProvider als 210+ CSS variabelen worden geïnjecteerd. **Maar de blocks en components gebruiken deze variabelen niet.** Ze gebruiken hardcoded Tailwind classes (`bg-teal`, `text-navy`, `bg-blue-600`) die statisch zijn gedefinieerd in de Tailwind config.

**Resultaat:** Elke site ziet er identiek uit, ongeacht de Theme-instellingen.

### De Disconnect

```
Theme Global (Payload Admin)
    ↓
ThemeProvider → CSS Variables (--color-primary: #00897B)
    ↓
❌ NIET GEKOPPELD
    ↓
Tailwind Config → Statische kleuren (teal: '#00897B')
    ↓
Components → bg-teal (altijd #00897B, ignoreert theme)
```

### Wat het zou moeten zijn

```
Theme Global (Payload Admin)
    ↓
ThemeProvider → CSS Variables (--color-primary: #ec4899)  ← per site anders!
    ↓
✅ GEKOPPELD
    ↓
Tailwind Config → primary: 'var(--color-primary)'
    ↓
Components → bg-primary (volgt theme automatisch)
```

---

## Fase 1: Tailwind Config — Semantische kleurnamen (KRITISCH)

### Wat

De Tailwind config moet kleurnamen mappen naar CSS variabelen in plaats van statische hex waarden.

### Bestand: `tailwind.config.ts`

**Huidige situatie (FOUT):**
```ts
colors: {
  teal: '#00897B',
  'teal-light': '#26A69A',
  'teal-dark': '#00695C',
  navy: '#0A1628',
  'navy-light': '#121F33',
  // ... statische waarden
}
```

**Nieuw (GOED):**
```ts
colors: {
  // Semantische namen die CSS variables volgen
  primary: {
    DEFAULT: 'var(--color-primary)',
    light: 'var(--color-primary-light)',
    glow: 'var(--color-primary-glow)',
    dark: 'var(--color-primary-dark, color-mix(in srgb, var(--color-primary) 80%, black))',
  },
  secondary: {
    DEFAULT: 'var(--color-secondary)',
    light: 'var(--color-secondary-light)',
  },
  accent: {
    DEFAULT: 'var(--color-accent)',
  },
  surface: {
    DEFAULT: 'var(--color-surface)',
    bg: 'var(--color-bg)',
    border: 'var(--color-border)',
  },
  grey: {
    light: 'var(--color-grey-light)',
    mid: 'var(--color-grey-mid)',
    dark: 'var(--color-grey-dark)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
  },
  status: {
    success: 'var(--color-success)',
    'success-light': 'var(--color-success-light)',
    warning: 'var(--color-warning)',
    'warning-light': 'var(--color-warning-light)',
    error: 'var(--color-error)',
    'error-light': 'var(--color-error-light)',
    info: 'var(--color-info)',
    'info-light': 'var(--color-info-light)',
  },

  // Legacy aliassen (tijdelijk, voor backward compat tijdens migratie)
  teal: 'var(--color-primary)',
  'teal-light': 'var(--color-primary-light)',
  'teal-dark': 'var(--color-primary-dark, color-mix(in srgb, var(--color-primary) 80%, black))',
  navy: 'var(--color-secondary)',
  'navy-light': 'var(--color-secondary-light)',
}
```

**Gradients:**
```ts
backgroundImage: {
  'gradient-primary': 'var(--gradient-primary)',
  'gradient-secondary': 'var(--gradient-secondary)',
  'gradient-hero': 'var(--gradient-hero)',
  'gradient-accent': 'var(--gradient-accent)',
}
```

**Border radius:**
```ts
borderRadius: {
  sm: 'var(--r-sm)',
  md: 'var(--r-md)',
  lg: 'var(--r-lg)',
  xl: 'var(--r-xl)',
  full: 'var(--r-full)',
}
```

**Box shadow:**
```ts
boxShadow: {
  sm: 'var(--sh-sm)',
  md: 'var(--sh-md)',
  lg: 'var(--sh-lg)',
  xl: 'var(--sh-xl)',
}
```

**Fonts:**
```ts
fontFamily: {
  sans: 'var(--font-body)',
  display: 'var(--font-heading)',
  mono: 'var(--font-mono)',
}
```

### Impact

Na deze wijziging werken ALLE bestaande `bg-teal`, `text-navy` classes automatisch met de theme — ze verwijzen nu naar CSS variabelen in plaats van statische kleuren. Dit is de grootste win met de minste code-changes.

---

## Fase 2: Rename Classes — Semantisch (BELANGRIJK)

### Wat

Alle component-specifieke kleurklassen vervangen door semantische namen. Dit maakt de code duidelijker en theme-onafhankelijk.

### Mapping

| Oud (hardcoded) | Nieuw (semantisch) | Waarom |
|---|---|---|
| `bg-teal` | `bg-primary` | Primaire actie/kleur |
| `bg-teal-light` | `bg-primary-light` | Lichtere variant |
| `bg-teal-dark` | `bg-primary-dark` | Donkerdere variant |
| `text-teal` | `text-primary` | Primaire tekstkleur |
| `bg-navy` | `bg-secondary` | Donkere achtergrond |
| `bg-navy-light` | `bg-secondary-light` | Lichtere donkere achtergrond |
| `text-navy` | `text-secondary` | Donkere tekst |
| `bg-blue-600` | `bg-primary` | Was vaak als primary bedoeld |
| `text-blue-600` | `text-primary` | Was vaak als primary bedoeld |
| `bg-purple-700` | `bg-accent` | Accentkleur |
| `text-amber-400` | `text-status-warning` | Status/feedback kleur |
| `bg-green-50` | `bg-status-success-light` | Status achtergrond |
| `bg-red-50` | `bg-status-error-light` | Status achtergrond |
| `from-navy to-navy-light` | `bg-gradient-secondary` | Gradient via theme |
| `from-teal to-teal-dark` | `bg-gradient-primary` | Gradient via theme |

### Bestanden per categorie

#### A. Shared Blocks (hoogste prioriteit — 30+ bestanden)

| Bestand | Hardcoded | Vervangen door |
|---------|-----------|----------------|
| `Hero/Component.tsx` | `bg-teal text-white`, `bg-navy`, `from-navy to-navy-light` | `bg-primary text-white`, `bg-secondary`, `bg-gradient-secondary` |
| `CTA/Component.tsx` | `from-navy to-navy-light`, `from-teal to-teal-dark` | `bg-gradient-secondary`, `bg-gradient-primary` |
| `CTASection/Component.tsx` | navy/teal gradients | `bg-gradient-secondary`, `bg-gradient-primary` |
| `Features/Component.client.tsx` | `bg-teal/10 text-teal`, `bg-teal text-white` | `bg-primary/10 text-primary`, `bg-primary text-white` |
| `Stats/Component.tsx` | `bg-teal/10 text-teal`, navy/teal gradients | `bg-primary/10 text-primary`, semantic gradients |
| `Testimonials/Component.tsx` | `text-amber-400`, `bg-teal/10 text-teal` | `text-status-warning`, `bg-primary/10 text-primary` |
| `Testimonials/TestimonialsCarousel.tsx` | `text-amber-400`, `bg-teal/10`, `bg-teal` | `text-status-warning`, `bg-primary/10`, `bg-primary` |
| `FAQ/FAQAccordion.tsx` | `bg-teal rotate-45` | `bg-primary rotate-45` |
| `Team/Component.tsx` | `bg-teal hover:text-white` | `bg-primary hover:text-white` |
| `Newsletter/Component.tsx` | `bg-teal text-white` | `bg-primary text-white` |
| `Contact/Component.tsx` | `bg-teal-glow` | `bg-primary-glow` |
| `ProcessSteps/Component.tsx` | `bg-teal text-white`, `from-navy to-navy-light` | `bg-primary text-white`, `bg-gradient-secondary` |
| `HeroEmailCapture/Component.tsx` | `bg-teal/20 text-teal-light`, `from-navy to-navy-light` | `bg-primary/20 text-primary-light`, `bg-gradient-secondary` |
| `Banner/Component.tsx` | `from-amber-500 to-amber-400 text-amber-950` | `bg-gradient-primary` of theme variant |
| `BlogPreview/Component.tsx` | Hardcoded navy/teal | Semantic primary/secondary |
| `Spacer/Component.tsx` | `bg-teal` | `bg-primary` |
| `TwoColumnImagePair/Component.tsx` | `bg-teal text-white` | `bg-primary text-white` |
| `Code/Component.tsx` | `bg-[#0A1628]`, `bg-[#0D1D33]` | `bg-secondary`, `bg-secondary-light` |
| `Pagination/Component.tsx` | `border-teal bg-teal text-white` | `border-primary bg-primary text-white` |
| `CaseStudyGrid/Component.tsx` | `bg-teal/5 text-teal` | `bg-primary/5 text-primary` |
| `ProjectsGrid/Component.tsx` | `bg-teal/10 text-teal`, `bg-teal text-white` | `bg-primary/10 text-primary`, `bg-primary text-white` |
| `ReviewsWidget/Component.tsx` | `text-amber-400`, `border-teal/20 bg-teal/10 text-teal` | `text-status-warning`, `border-primary/20 bg-primary/10 text-primary` |
| `Calculator/CalculatorClient.tsx` | `text-green-600`, `bg-green-50`, `bg-blue-600` | `text-status-success`, `bg-status-success-light`, `bg-primary` |
| `BranchePricing/Component.tsx` | `bg-blue-600 text-white`, `text-blue-600` | `bg-primary text-white`, `text-primary` |
| `ComparisonTable/Component.tsx` | `bg-blue-600`, `bg-blue-50`, `bg-red-100`, `bg-green-100` | `bg-primary`, `bg-primary/10`, `bg-status-error-light`, `bg-status-success-light` |
| `PainPoints/Component.tsx` | `bg-[#F8F9FA]`, `bg-red-100 text-red-600` | `bg-surface-bg`, `bg-status-error-light text-status-error` |
| `InfoBox/Component.tsx` | `bg-blue-50 text-blue-900`, `bg-green-50`, `bg-amber-50`, `bg-red-50` | `bg-status-info-light`, `bg-status-success-light`, `bg-status-warning-light`, `bg-status-error-light` |

#### B. E-commerce Components (236 bestanden)

| Categorie | Bestanden | Patroon |
|-----------|-----------|---------|
| Product types (variable, bundle, bookable) | 20+ | `bg-blue-50`, `text-blue-700`, `from-green-500 to-green-600` |
| Auth components | 10+ | `focus:ring-blue-500`, `border-blue-600` |
| Checkout | 15+ | `bg-blue-600`, `text-blue-600`, `border-blue-500` |
| B2B components (quotes, orders) | 20+ | `bg-blue-600`, `text-blue-700` |
| B2C components (loyalty, gifts) | 15+ | `bg-purple-600`, `text-purple-700` |
| Product cards / grid | 10+ | `bg-teal`, `text-navy`, `bg-gradient-to-r` |
| Pricing tables | 5+ | `from-blue-600 to-purple-600`, `bg-blue-50` |

#### C. Beauty Branch (specifiek probleem)

| Bestand | Hardcoded | Probleem |
|---------|-----------|---------|
| `BookingSidebar/Component.tsx` | `background: 'linear-gradient(135deg, #ec4899, #8b5cf6)'` | Inline hex |
| `TreatmentDetail/index.tsx` | `color: 'var(--color-navy, #1a2b4a)'` | Hardcoded fallbacks |
| `TreatmentsArchive/index.tsx` | `backgroundColor: 'var(--color-primary, #ec4899)'` | Hardcoded pink fallback |
| `BookingWizard/index.tsx` | Multiple hardcoded hex fallbacks | |
| `ContactTemplate/index.tsx` | Same pattern | |

#### D. UI Components

| Bestand | Hardcoded | Vervangen door |
|---------|-----------|----------------|
| `ui/select.tsx` | `focus:border-blue-500 focus:ring-blue-500/20` | `focus:border-primary focus:ring-primary/20` |
| `ui/input.tsx` | `focus:border-blue-500`, `file:text-blue-600` | `focus:border-primary`, `file:text-primary` |
| `ui/textarea.tsx` | `focus:border-blue-500` | `focus:border-primary` |
| `ui/button.tsx` | Deels theme-aware, deels hardcoded | Volledig via theme tokens |
| `ToastSystem/Toast.tsx` | `#E8F5E9`, `#00C853`, `#FFF0F0`, `#FF6B6B` | CSS variables |

#### E. Admin Components (lagere prioriteit — admin panel)

| Bestand | Hardcoded | Notitie |
|---------|-----------|---------|
| `AITextField.tsx` | `#6366f1`, `#d1d5db` | Admin-only, lagere prio |
| `AITextareaField.tsx` | `#6366f1`, `#f5f3ff` | Admin-only |
| `IconPicker.tsx` | `#0969da`, `#fafbfc` | Admin-only |
| `AdminLogo/Component.tsx` | `linear-gradient(135deg, #3b82f6, #2563eb)` | Admin-only |
| `BeforeLogin/Component.tsx` | Google colors (OK — brand specifiek) | Uitzondering |
| `BeforeDashboard/index.scss` | `#2563eb`, `#059669`, `#d97706` | Admin-only |

---

## Fase 3: Button Variants — Theme-Driven

### Huidige situatie

Buttons in blocks gebruiken hardcoded kleurklassen:
```tsx
// Hero block - hardcoded
<a className="bg-teal text-white px-6 py-3 rounded-lg">Primary</a>
<a className="border border-white text-white px-6 py-3 rounded-lg">Secondary</a>
<a className="text-white underline">Ghost</a>
```

### Gewenste situatie

Buttons gebruiken theme-driven `.btn` classes (die ThemeProvider al genereert):
```tsx
// Hero block - theme-driven
<a className="btn btn-primary">Primary</a>
<a className="btn btn-outline-primary">Secondary</a>
<a className="btn btn-ghost">Ghost</a>
```

De `.btn` classes worden al gegenereerd door ThemeProvider met de juiste kleuren, padding, border-radius en hover states uit de Theme global. Ze worden alleen nog niet consistent gebruikt.

### Hero Block Button Variants

Het Hero block biedt 3 button stijlen: primary, secondary, ghost. Deze moeten mappen naar:

| Block optie | CSS class | Bron |
|-------------|-----------|------|
| `primary` | `btn btn-primary` | Theme → `btnPrimaryBg`, `btnPrimaryText`, `btnPrimaryHoverBg` |
| `secondary` | `btn btn-secondary` of `btn btn-outline-primary` | Theme → `btnSecondaryBg` of outline variant |
| `ghost` | `btn btn-ghost` | Transparant met tekst in `--color-primary` |

---

## Fase 4: CSS Variable Fallbacks Opschonen

### Probleem

Veel components gebruiken CSS variabelen met hardcoded fallbacks die de default van de component bepalen in plaats van de theme:

```tsx
// FOUT — beauty branch overschrijft theme met hardcoded pink
style={{ backgroundColor: 'var(--color-primary, #ec4899)' }}

// GOED — geen fallback, vertrouwt op theme
style={{ backgroundColor: 'var(--color-primary)' }}
```

### Regel

- **Geen hex fallbacks** in CSS variable references
- ThemeProvider garandeert dat alle variabelen bestaan
- Als er toch een fallback nodig is: gebruik een andere CSS variable, niet een hex waarde

---

## Fase 5: Gradient System Centraliseren

### Huidige situatie

Gradients zijn per-block gedefinieerd als hardcoded mappings:

```tsx
// Stats/Component.tsx — FOUT
const gradientMap = {
  navy: 'bg-gradient-to-br from-navy to-navy-light',
  teal: 'bg-gradient-to-br from-teal to-teal-dark',
  purple: 'bg-gradient-to-br from-purple-700 to-purple-900',
}
```

### Gewenste situatie

Gradients verwijzen naar theme variabelen:

```tsx
// Stats/Component.tsx — GOED
const gradientMap = {
  primary: 'bg-gradient-primary',    // var(--gradient-primary)
  secondary: 'bg-gradient-secondary', // var(--gradient-secondary)
  accent: 'bg-gradient-accent',       // var(--gradient-accent)
  hero: 'bg-gradient-hero',           // var(--gradient-hero)
}
```

De Theme global definieert al 4 gradient tokens. Blocks hoeven alleen maar de juiste class te gebruiken.

---

## Uitvoeringsplan

### Sprint 1: Tailwind Config + Automatische Fix (1 dag)

1. **Tailwind config updaten** — Alle kleuren naar CSS variable references
2. **Legacy aliassen toevoegen** — `teal` → `var(--color-primary)` zodat bestaande classes direct werken
3. **Testen** — Alle sites moeten er identiek uitzien (zelfde default waarden)

**Na deze stap werkt de theme al voor 80% van de blocks** omdat `bg-teal` nu `var(--color-primary)` is.

### Sprint 2: Shared Blocks Semantisch Maken (2-3 dagen)

1. **30+ shared blocks** — Rename `bg-teal` → `bg-primary`, `text-navy` → `text-secondary`
2. **Gradient mappings** — Vervang per-block gradient maps door theme gradient classes
3. **Button classes** — Vervang inline button styles door `.btn .btn-primary` etc.

### Sprint 3: E-commerce Components (3-4 dagen)

1. **236 bestanden** — Bulk replace `bg-blue-600` → `bg-primary`, `text-blue-600` → `text-primary`
2. **Focus/ring states** — `focus:ring-blue-500` → `focus:ring-primary`
3. **Status kleuren** — `bg-green-50` → `bg-status-success-light`

### Sprint 4: Branch-specifieke templates (1 dag)

1. **Beauty templates** — Verwijder alle hardcoded hex fallbacks
2. **Construction/Horeca/etc blocks** — Controleer en fix

### Sprint 5: Opschonen (1 dag)

1. **Verwijder legacy aliassen** uit Tailwind config (teal, navy, etc.)
2. **Verwijder hardcoded fallbacks** uit CSS variable references
3. **Test alle sites** met verschillende theme-instellingen

---

## Verificatie

### Test 1: Kleur Wijziging

1. Ga naar `sityzr.compassdigital.nl/admin/globals/theme/`
2. Wijzig `primaryColor` van `#00897B` (teal) naar `#e11d48` (rose)
3. **Verwacht:** ALLE buttons, accenten, gradients en highlights worden rose
4. **Huidig:** Niets verandert (alles is hardcoded teal)

### Test 2: Font Wijziging

1. Wijzig `headingFont` naar `"Playfair Display", Georgia, serif`
2. **Verwacht:** Alle headings gebruiken Playfair Display
3. **Huidig:** Components negeren de font-instelling

### Test 3: Multi-Tenant

1. `plastimed01` → medical blue theme
2. `beauty01` → pink/rose theme
3. `construction01` → orange/amber theme
4. **Verwacht:** Elke site heeft eigen visuele identiteit
5. **Huidig:** Alle sites zien er identiek uit (teal/navy)

---

## Uitzonderingen (NIET refactoren)

| Component | Reden |
|-----------|-------|
| `BeforeLogin/Component.tsx` — Google kleuren | Brand guidelines (blauw, rood, geel, groen) |
| `Code/Component.tsx` — Window controls | UI conventie (rood/geel/groen circles) |
| `DeviceMockup/Component.tsx` — Window controls | Zelfde UI conventie |
| Admin panel components (AITextField, etc.) | Admin UI, niet klant-facing |
| Status kleuren (success/warning/error) | Al via theme tokens, alleen mapping nodig |

---

## Samenvatting

| Metric | Waarde |
|--------|--------|
| **Totaal bestanden met hardcoded waarden** | 323 |
| **Kritisch (shared blocks)** | 30+ |
| **Hoog (e-commerce)** | 236 |
| **Medium (branch templates)** | 15+ |
| **Laag (admin components)** | 20+ |
| **Geschatte doorlooptijd** | 8-10 dagen |
| **Grootste win** | Sprint 1 (Tailwind config) — lost 80% op in 1 dag |
