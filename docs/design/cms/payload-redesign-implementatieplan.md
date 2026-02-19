# Payload CMS — Redesign Implementatieplan

**Doel:** Volledige visuele redesign van het Payload CMS admin panel in de CompassDigital/Contyzr-stijl
**Huidige staat:** Standaard Payload dark theme (zie screenshot)
**Gewenste staat:** Premium branded admin panel — Deep Navy + Electric Blue, glasmorphism nav, Inter/Plus Jakarta Sans, afgeronde hoeken, gradient accenten

---

## 1. Design Systeem — Doelstijl

### 1.1 Kleurenpalet

```
LIGHT MODE (primair):
┌─────────────────────────────────────────────────────────┐
│  Background        #FFFFFF (wit, clean)                  │
│  Surface           #F8FAFC (lichtgrijs, cards/sections)  │
│  Surface Elevated  #F1F5F9 (iets donkerder, hover)       │
│  Border            #E2E8F0 (subtiele lijnen)             │
│  Text Primary      #1A1F36 (deep navy)                   │
│  Text Secondary    #64748B (grijs)                        │
│  Text Muted        #94A3B8 (lichtgrijs)                  │
│                                                          │
│  Accent Primary    #3B82F6 (electric blue)               │
│  Accent Hover      #2563EB (donkerder blauw)             │
│  Accent Light      #EFF6FF (blauwe tint achtergrond)     │
│  Accent Gradient   #3B82F6 → #7C3AED (blauw→paars)      │
│                                                          │
│  Success           #10B981 (groen)                       │
│  Warning           #F59E0B (amber)                       │
│  Error             #EF4444 (rood)                        │
│  Info              #3B82F6 (blauw)                       │
│                                                          │
│  Nav Background    #1A1F36 (deep navy sidebar)           │
│  Nav Text          #CBD5E1 (lichtgrijs op navy)          │
│  Nav Text Active   #FFFFFF (wit, actief item)            │
│  Nav Accent        #3B82F6 (blauwe indicator)            │
│  Nav Hover         rgba(59,130,246,0.1) (blauwe tint)    │
└─────────────────────────────────────────────────────────┘

DARK MODE:
┌─────────────────────────────────────────────────────────┐
│  Background        #0F1117 (bijna zwart)                 │
│  Surface           #1A1F36 (deep navy)                   │
│  Surface Elevated  #232942 (lichter navy)                │
│  Border            #2D3555 (subtiele lijnen)             │
│  Text Primary      #F1F5F9 (bijna wit)                   │
│  Text Secondary    #94A3B8 (grijs)                        │
│  Text Muted        #64748B (donkerder grijs)             │
│                                                          │
│  Accent Primary    #60A5FA (lichter blauw)               │
│  Accent Hover      #3B82F6 (electric blue)               │
│  Accent Light      rgba(59,130,246,0.15)                 │
│                                                          │
│  Nav Background    #0B0E18 (donkerder dan content)       │
│  Nav Text          #94A3B8                                │
│  Nav Text Active   #FFFFFF                                │
│  Nav Accent        #60A5FA                                │
│  Nav Hover         rgba(96,165,250,0.1)                  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Typografie

```
Font Family:    'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
Font Weights:   400 (regular), 500 (medium), 600 (semibold), 700 (bold)

Heading 1:      28px / 700 / -0.02em tracking (paginatitels)
Heading 2:      22px / 600 / -0.01em (sectietitels)
Heading 3:      18px / 600 (groepstitels sidebar)
Body:           14px / 400 / 1.6 line-height
Body Small:     13px / 400 (labels, meta)
Caption:        12px / 500 (badges, hints)
Mono:           'JetBrains Mono', 'Fira Code', monospace (code/IDs)
```

### 1.3 Spacing & Corners

```
Border Radius:
  - Buttons:        8px (afgerond maar niet pill-shaped)
  - Cards:          12px
  - Inputs:         8px
  - Badges/Pills:   20px (volledig afgerond)
  - Modals/Drawers: 16px (top corners)
  - Nav items:      8px
  - Avatars:        50% (cirkel)

Spacing Scale:
  - xs: 4px    sm: 8px    md: 16px    lg: 24px    xl: 32px    2xl: 48px

Shadows:
  - Card:         0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)
  - Card Hover:   0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)
  - Nav:          4px 0 24px rgba(0,0,0,0.08)
  - Modal:        0 25px 50px -12px rgba(0,0,0,0.25)
  - Input Focus:  0 0 0 3px rgba(59,130,246,0.15)
```

---

## 2. Bestandsstructuur

```
src/
├── app/
│   └── (payload)/
│       └── admin/
│           └── custom.scss              ← Hoofd stylesheet (globale overrides)
├── components/
│   └── admin/
│       ├── graphics/
│       │   ├── Logo.tsx                 ← Groot logo (login scherm)
│       │   └── Icon.tsx                 ← Klein icoon (sidebar)
│       ├── nav/
│       │   └── Nav.tsx                  ← Custom navigatie (optioneel, voor sidebar redesign)
│       ├── dashboard/
│       │   ├── WelcomeBanner.tsx         ← BeforeDashboard component
│       │   └── QuickActions.tsx          ← AfterDashboard component
│       ├── views/
│       │   └── Login.tsx                ← Custom login view (optioneel)
│       └── ui/
│           └── ClientSelector.tsx        ← "ACTIEVE KLANT" selector redesign
├── styles/
│   └── admin/
│       ├── _variables.scss              ← CSS variabelen (kleuren, spacing)
│       ├── _typography.scss             ← Font imports en overrides
│       ├── _navigation.scss             ← Sidebar styling
│       ├── _buttons.scss                ← Button overrides
│       ├── _inputs.scss                 ← Form fields
│       ├── _tables.scss                 ← Collection list views
│       ├── _cards.scss                  ← Cards en elevations
│       ├── _modals.scss                 ← Drawers en modals
│       ├── _login.scss                  ← Login pagina
│       └── _utilities.scss              ← Glasmorphism, gradients, helpers
└── public/
    └── fonts/
        ├── PlusJakartaSans-Regular.woff2
        ├── PlusJakartaSans-Medium.woff2
        ├── PlusJakartaSans-SemiBold.woff2
        ├── PlusJakartaSans-Bold.woff2
        └── JetBrainsMono-Regular.woff2
```

---

## 3. Payload Config — Component Registratie

```typescript
// payload.config.ts

import { buildConfig } from 'payload'

export default buildConfig({
  // ... bestaande config

  admin: {
    // ─── Custom Components ────────────────────
    components: {
      // Branding
      graphics: {
        Logo: '/components/admin/graphics/Logo',   // Login scherm
        Icon: '/components/admin/graphics/Icon',    // Sidebar/nav
      },

      // Dashboard aanpassingen
      beforeDashboard: ['/components/admin/dashboard/WelcomeBanner'],
      afterDashboard: ['/components/admin/dashboard/QuickActions'],

      // Navigatie (optioneel: volledig custom sidebar)
      // Nav: '/components/admin/nav/Nav',

      // Extra nav links
      beforeNavLinks: ['/components/admin/ui/ClientSelector'],

      // Header banner (optioneel)
      // header: ['/components/admin/ui/AnnouncementBar'],

      // Login pagina
      // beforeLogin: ['/components/admin/views/LoginBranding'],
    },

    // ─── Meta ─────────────────────────────────
    meta: {
      titleSuffix: ' — CompassDigital',
      icons: [
        {
          url: '/favicon-32x32.png',
          type: 'image/png',
          sizes: '32x32',
        },
      ],
    },

    // ─── Theme (forceer light of laat keuze) ───
    // theme: 'light', // Of laat gebruiker kiezen
  },
})
```

---

## 4. CSS Variabelen Override — Het Hart van de Redesign

Dit is het meest impactvolle bestand. Door Payload's CSS variabelen te overschrijven verander je het hele admin panel in één keer.

### 4.1 Hoofd Stylesheet

```scss
// src/app/(payload)/admin/custom.scss
// ═══════════════════════════════════════════════════════
// CompassDigital Admin Theme — Payload CMS
// ═══════════════════════════════════════════════════════

// Importeer partials
@import '../../../styles/admin/variables';
@import '../../../styles/admin/typography';
@import '../../../styles/admin/navigation';
@import '../../../styles/admin/buttons';
@import '../../../styles/admin/inputs';
@import '../../../styles/admin/tables';
@import '../../../styles/admin/cards';
@import '../../../styles/admin/modals';
@import '../../../styles/admin/login';
@import '../../../styles/admin/utilities';
```

### 4.2 CSS Variabelen

```scss
// src/styles/admin/_variables.scss
// ═══════════════════════════════════════════════════════
// CSS Variable Overrides — Light Mode
// ═══════════════════════════════════════════════════════

:root {
  // ─── Payload Core Theme Variables ───────────

  // Basis kleuren
  --theme-bg: #FFFFFF;
  --theme-text: #1A1F36;
  --theme-input-bg: #FFFFFF;

  // Elevation kleuren (bepalen "diepte" van surfaces)
  // Payload gebruikt elevation-0 (donkerst) t/m elevation-1000 (lichtst)
  --theme-elevation-0: #F1F5F9;
  --theme-elevation-50: #F4F6FA;
  --theme-elevation-100: #F8FAFC;
  --theme-elevation-150: #FAFBFD;
  --theme-elevation-200: #FCFDFE;
  --theme-elevation-250: #FDFEFE;
  --theme-elevation-300: #FEFEFE;
  --theme-elevation-350: #FEFEFF;
  --theme-elevation-400: #FFFFFF;
  --theme-elevation-450: #FFFFFF;
  --theme-elevation-500: #FFFFFF;
  --theme-elevation-550: #FFFFFF;
  --theme-elevation-600: #FFFFFF;
  --theme-elevation-650: #FFFFFF;
  --theme-elevation-700: #FFFFFF;
  --theme-elevation-750: #FFFFFF;
  --theme-elevation-800: #FFFFFF;
  --theme-elevation-850: #FFFFFF;
  --theme-elevation-900: #FFFFFF;
  --theme-elevation-950: #FFFFFF;
  --theme-elevation-1000: #FFFFFF;

  // Borders
  --theme-border-color: #E2E8F0;

  // Accent / Primary kleur (Electric Blue)
  --theme-success-50:  #ECFDF5;
  --theme-success-100: #D1FAE5;
  --theme-success-200: #A7F3D0;
  --theme-success-300: #6EE7B7;
  --theme-success-400: #34D399;
  --theme-success-500: #10B981;
  --theme-success-600: #059669;
  --theme-success-700: #047857;
  --theme-success-800: #065F46;
  --theme-success-900: #064E3B;
  --theme-success-950: #022C22;

  --theme-error-50:  #FEF2F2;
  --theme-error-100: #FEE2E2;
  --theme-error-200: #FECACA;
  --theme-error-300: #FCA5A5;
  --theme-error-400: #F87171;
  --theme-error-500: #EF4444;
  --theme-error-600: #DC2626;
  --theme-error-700: #B91C1C;
  --theme-error-800: #991B1B;
  --theme-error-900: #7F1D1D;
  --theme-error-950: #450A0A;

  --theme-warning-50:  #FFFBEB;
  --theme-warning-100: #FEF3C7;
  --theme-warning-200: #FDE68A;
  --theme-warning-300: #FCD34D;
  --theme-warning-400: #FBBF24;
  --theme-warning-500: #F59E0B;
  --theme-warning-600: #D97706;
  --theme-warning-700: #B45309;
  --theme-warning-800: #92400E;
  --theme-warning-900: #78350F;
  --theme-warning-950: #451A03;

  // ─── Custom CompassDigital Variables ────────

  // Branding
  --cd-navy: #1A1F36;
  --cd-navy-light: #232942;
  --cd-navy-dark: #0F1117;
  --cd-blue: #3B82F6;
  --cd-blue-hover: #2563EB;
  --cd-blue-light: #60A5FA;
  --cd-blue-bg: #EFF6FF;
  --cd-purple: #7C3AED;
  --cd-gradient: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
  --cd-gradient-subtle: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(124,58,237,0.08) 100%);

  // Spacing
  --cd-radius-sm: 6px;
  --cd-radius-md: 8px;
  --cd-radius-lg: 12px;
  --cd-radius-xl: 16px;
  --cd-radius-pill: 20px;
  --cd-radius-full: 9999px;

  // Shadows
  --cd-shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --cd-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06);
  --cd-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05);
  --cd-shadow-focus: 0 0 0 3px rgba(59,130,246,0.15);

  // Glasmorphism
  --cd-glass-bg: rgba(255,255,255,0.85);
  --cd-glass-blur: blur(12px);
  --cd-glass-border: 1px solid rgba(226,232,240,0.8);

  // Transitions
  --cd-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --cd-transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --cd-transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
}

// ═══════════════════════════════════════════════════════
// Dark Mode Overrides
// ═══════════════════════════════════════════════════════

[data-theme="dark"] {
  --theme-bg: #0F1117;
  --theme-text: #F1F5F9;
  --theme-input-bg: #1A1F36;

  --theme-elevation-0: #0B0E18;
  --theme-elevation-50: #0F1320;
  --theme-elevation-100: #141828;
  --theme-elevation-150: #181D30;
  --theme-elevation-200: #1A1F36;
  --theme-elevation-250: #1E2440;
  --theme-elevation-300: #232942;
  --theme-elevation-350: #272F4A;
  --theme-elevation-400: #2D3555;
  --theme-elevation-450: #333C60;
  --theme-elevation-500: #3A436B;
  --theme-elevation-550: #424B76;
  --theme-elevation-600: #4A5481;
  --theme-elevation-650: #535D8C;
  --theme-elevation-700: #5C6697;
  --theme-elevation-750: #6670A2;
  --theme-elevation-800: #707AAD;
  --theme-elevation-850: #7A84B8;
  --theme-elevation-900: #858FC3;
  --theme-elevation-950: #909ACE;
  --theme-elevation-1000: #9BA5D9;

  --theme-border-color: #2D3555;

  // Dark mode shadows
  --cd-shadow-sm: 0 1px 2px rgba(0,0,0,0.2);
  --cd-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.2);
  --cd-shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3);
  --cd-shadow-focus: 0 0 0 3px rgba(96,165,250,0.25);

  // Glasmorphism dark
  --cd-glass-bg: rgba(26,31,54,0.85);
  --cd-glass-border: 1px solid rgba(45,53,85,0.8);
}
```

### 4.3 Typografie

```scss
// src/styles/admin/_typography.scss

// ─── Font Face Import ─────────────────────────
@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Plus Jakarta Sans';
  src: url('/fonts/PlusJakartaSans-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

// ─── Global Font Override ─────────────────────
:root {
  --font-body: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
}

body {
  font-family: var(--font-body) !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  letter-spacing: -0.01em;
}

// Alle elementen erven het font
*,
*::before,
*::after {
  font-family: inherit;
}

// ─── Headings ─────────────────────────────────
// Collection titels (H1)
.collection-list__header h1,
.doc-header__title h1,
.document-header__title h1 {
  font-weight: 700 !important;
  letter-spacing: -0.02em !important;
  font-size: 28px !important;
  color: var(--theme-text) !important;
}

// Subtitels / groepstitels
.nav__label,
.field-type .group-field__wrap > .group-field__header {
  font-weight: 600 !important;
  text-transform: uppercase !important;
  font-size: 11px !important;
  letter-spacing: 0.08em !important;
  color: var(--cd-blue) !important;
}

// ─── Monospace (IDs, slugs, code) ─────────────
.id-label,
.field-type.code textarea,
pre,
code {
  font-family: var(--font-mono) !important;
  font-size: 13px !important;
}
```

---

## 5. Navigatie / Sidebar Styling

```scss
// src/styles/admin/_navigation.scss

// ═══════════════════════════════════════════════════════
// SIDEBAR / NAVIGATIE — Deep Navy Stijl
// ═══════════════════════════════════════════════════════

// ─── Sidebar Container ────────────────────────
.nav {
  background: var(--cd-navy) !important;
  border-right: 1px solid rgba(255,255,255,0.06) !important;
  box-shadow: var(--cd-shadow-lg) !important;

  // Smooth scrollbar in sidebar
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }
}

// Dark mode: nog donkerder sidebar
[data-theme="dark"] .nav {
  background: var(--cd-navy-dark) !important;
  border-right: 1px solid rgba(255,255,255,0.04) !important;
}

// ─── Nav Groep Headers (Systeem, E-commerce, etc.) ──
.nav-group__toggle {
  color: rgba(255,255,255,0.5) !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  padding: 12px 20px 6px !important;

  // Chevron icoon
  .nav-group__indicator {
    color: rgba(255,255,255,0.3) !important;
  }

  &:hover {
    color: rgba(255,255,255,0.7) !important;
  }
}

// ─── Nav Links (individuele items) ────────────
.nav-group__content .nav__link {
  color: #CBD5E1 !important;
  padding: 8px 20px 8px 24px !important;
  margin: 1px 8px !important;
  border-radius: var(--cd-radius-md) !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  transition: all var(--cd-transition-fast) !important;
  position: relative;

  // Hover state
  &:hover {
    background: rgba(59, 130, 246, 0.1) !important;
    color: #FFFFFF !important;
  }

  // Active state — blauwe indicator links
  &.active {
    background: rgba(59, 130, 246, 0.15) !important;
    color: #FFFFFF !important;
    font-weight: 500 !important;

    // Blauwe lijn links
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: var(--cd-blue) !important;
      border-radius: 0 3px 3px 0;
    }
  }
}

// ─── Nav Controls (onderin: account, logout) ──
.nav__controls {
  border-top: 1px solid rgba(255,255,255,0.06) !important;
  padding: 12px 16px !important;
}

.nav__log-out {
  color: rgba(255,255,255,0.5) !important;
  transition: color var(--cd-transition-fast) !important;

  &:hover {
    color: #FFFFFF !important;
  }
}

// ─── Account Avatar in Nav ────────────────────
.nav .account__avatar {
  border: 2px solid rgba(59,130,246,0.4) !important;
  border-radius: var(--cd-radius-full) !important;
}

// ─── Mobile Nav Overlay ───────────────────────
@media (max-width: 1024px) {
  .nav {
    backdrop-filter: var(--cd-glass-blur) !important;
  }
}

// ─── Hamburger / Toggle Button ────────────────
.hamburger {
  &::before,
  &::after,
  span {
    background: var(--cd-navy) !important;
  }

  [data-theme="dark"] & {
    &::before,
    &::after,
    span {
      background: #F1F5F9 !important;
    }
  }
}
```

---

## 6. Buttons

```scss
// src/styles/admin/_buttons.scss

// ═══════════════════════════════════════════════════════
// BUTTONS — Gradient CTA, afgeronde hoeken
// ═══════════════════════════════════════════════════════

// ─── Alle Buttons: afgeronde hoeken ───────────
.btn {
  border-radius: var(--cd-radius-md) !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  transition: all var(--cd-transition-fast) !important;
  letter-spacing: 0 !important;
}

// ─── Primary Button (blauw) ───────────────────
.btn--style-primary {
  background: var(--cd-blue) !important;
  border: none !important;
  color: #FFFFFF !important;
  box-shadow: 0 1px 2px rgba(59,130,246,0.3) !important;

  &:hover {
    background: var(--cd-blue-hover) !important;
    box-shadow: 0 4px 12px rgba(59,130,246,0.35) !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(59,130,246,0.3) !important;
  }

  &:focus-visible {
    box-shadow: var(--cd-shadow-focus) !important;
  }
}

// ─── Secondary Button (outline) ───────────────
.btn--style-secondary {
  background: transparent !important;
  border: 1px solid var(--theme-border-color) !important;
  color: var(--theme-text) !important;
  border-radius: var(--cd-radius-md) !important;

  &:hover {
    background: var(--cd-blue-bg) !important;
    border-color: var(--cd-blue) !important;
    color: var(--cd-blue) !important;
  }
}

// ─── Pill Buttons (tags, filters) ─────────────
.btn--style-pill,
.pill {
  border-radius: var(--cd-radius-pill) !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 4px 12px !important;
}

// ─── Gradient CTA (speciale actie buttons) ────
// Te gebruiken via custom component class
.btn--gradient {
  background: var(--cd-gradient) !important;
  border: none !important;
  color: #FFFFFF !important;
  box-shadow: 0 2px 8px rgba(59,130,246,0.3) !important;

  &:hover {
    box-shadow: 0 6px 20px rgba(59,130,246,0.4) !important;
    transform: translateY(-1px);
  }
}

// ─── "Create New" Button (collection list) ────
.collection-list__header .btn--style-pill,
.list-controls .btn {
  border-radius: var(--cd-radius-md) !important;
}

// ─── Icon Buttons ─────────────────────────────
.btn--icon {
  border-radius: var(--cd-radius-md) !important;
  
  &:hover {
    background: var(--cd-blue-bg) !important;
  }
}

// ─── Save / Publish Button (document header) ──
.doc-controls__save {
  .btn--style-primary {
    background: var(--cd-gradient) !important;
    
    &:hover {
      box-shadow: 0 6px 20px rgba(59,130,246,0.35) !important;
    }
  }
}
```

---

## 7. Input Fields & Forms

```scss
// src/styles/admin/_inputs.scss

// ═══════════════════════════════════════════════════════
// INPUTS — Cleaner fields, blauwe focus ring
// ═══════════════════════════════════════════════════════

// ─── Alle Text Inputs ─────────────────────────
.field-type input[type="text"],
.field-type input[type="email"],
.field-type input[type="password"],
.field-type input[type="number"],
.field-type input[type="url"],
.field-type input[type="search"],
.field-type textarea,
.field-type .rs__control {
  border-radius: var(--cd-radius-md) !important;
  border: 1px solid var(--theme-border-color) !important;
  background: var(--theme-input-bg) !important;
  padding: 10px 14px !important;
  font-size: 14px !important;
  transition: all var(--cd-transition-fast) !important;

  &:hover {
    border-color: #CBD5E1 !important;
  }

  &:focus,
  &:focus-within {
    border-color: var(--cd-blue) !important;
    box-shadow: var(--cd-shadow-focus) !important;
    outline: none !important;
  }
}

// ─── Field Labels ─────────────────────────────
.field-label {
  font-weight: 500 !important;
  font-size: 13px !important;
  color: var(--theme-text) !important;
  margin-bottom: 6px !important;
}

// ─── Field Descriptions (hints) ───────────────
.field-description {
  font-size: 12px !important;
  color: #94A3B8 !important;
  margin-top: 4px !important;
}

// ─── Required Indicator ───────────────────────
.field-label .required {
  color: var(--cd-blue) !important; // Blauw ipv rood = minder agressief
}

// ─── Select / ReactSelect ─────────────────────
.rs__control {
  border-radius: var(--cd-radius-md) !important;
  min-height: 42px !important;
}

.rs__menu {
  border-radius: var(--cd-radius-md) !important;
  box-shadow: var(--cd-shadow-lg) !important;
  border: 1px solid var(--theme-border-color) !important;
  overflow: hidden;
}

.rs__option--is-focused {
  background: var(--cd-blue-bg) !important;
}

.rs__option--is-selected {
  background: var(--cd-blue) !important;
  color: #FFFFFF !important;
}

// ─── Checkbox ─────────────────────────────────
.field-type.checkbox .check {
  border-radius: 5px !important;
  border: 2px solid var(--theme-border-color) !important;
  transition: all var(--cd-transition-fast) !important;

  &.check--checked {
    background: var(--cd-blue) !important;
    border-color: var(--cd-blue) !important;
  }
}

// ─── Toggle / Switch ──────────────────────────
.toggle-input__button {
  border-radius: var(--cd-radius-full) !important;

  &.toggle-input__button--true {
    background: var(--cd-blue) !important;
  }
}

// ─── Search Input (collection list) ───────────
.search-filter__input {
  border-radius: var(--cd-radius-md) !important;
  background: var(--theme-elevation-100) !important;
  border: 1px solid transparent !important;
  
  &:focus {
    border-color: var(--cd-blue) !important;
    background: var(--theme-input-bg) !important;
    box-shadow: var(--cd-shadow-focus) !important;
  }
}
```

---

## 8. Tables & Collection Lists

```scss
// src/styles/admin/_tables.scss

// ═══════════════════════════════════════════════════════
// TABLES — Cleanere lijsten, hover states
// ═══════════════════════════════════════════════════════

// ─── Table Container ──────────────────────────
.table {
  border-radius: var(--cd-radius-lg) !important;
  overflow: hidden !important;
  border: 1px solid var(--theme-border-color) !important;
  box-shadow: var(--cd-shadow-sm) !important;
}

// ─── Table Header ─────────────────────────────
.table .row--header {
  background: var(--theme-elevation-50) !important;
  border-bottom: 1px solid var(--theme-border-color) !important;
  
  .sort-header {
    font-weight: 600 !important;
    font-size: 12px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.06em !important;
    color: #64748B !important;
    padding: 12px 16px !important;
  }
}

// ─── Table Rows ───────────────────────────────
.table .row {
  border-bottom: 1px solid var(--theme-elevation-100) !important;
  transition: background var(--cd-transition-fast) !important;

  &:hover {
    background: var(--cd-blue-bg) !important;
  }

  &:last-child {
    border-bottom: none !important;
  }

  .cell {
    padding: 14px 16px !important;
    font-size: 14px !important;
  }

  // Link cells (klikbare namen)
  .cell-link {
    color: var(--cd-blue) !important;
    font-weight: 500 !important;
    text-decoration: none !important;
    
    &:hover {
      color: var(--cd-blue-hover) !important;
      text-decoration: underline !important;
    }
  }
}

// ─── Pagination ───────────────────────────────
.collection-list__page-info {
  font-size: 13px !important;
  color: #64748B !important;
}

.paginator .paginator__page {
  border-radius: var(--cd-radius-md) !important;
  
  &.paginator__page--is-current {
    background: var(--cd-blue) !important;
    color: #FFFFFF !important;
  }
}

// ─── Per Page Selector ────────────────────────
.per-page {
  font-size: 13px !important;
  color: #64748B !important;
}

// ─── Filters Bar ──────────────────────────────
.list-controls {
  padding: 16px 0 !important;
  gap: 12px !important;
}

.list-controls .where-builder__add-first-filter {
  border-radius: var(--cd-radius-md) !important;
}
```

---

## 9. Cards & Elevations

```scss
// src/styles/admin/_cards.scss

// ═══════════════════════════════════════════════════════
// CARDS — Soft shadows, afgeronde hoeken
// ═══════════════════════════════════════════════════════

// ─── Dashboard Cards ──────────────────────────
.dashboard__card {
  border-radius: var(--cd-radius-lg) !important;
  border: 1px solid var(--theme-border-color) !important;
  box-shadow: var(--cd-shadow-sm) !important;
  transition: all var(--cd-transition-normal) !important;
  overflow: hidden;

  &:hover {
    box-shadow: var(--cd-shadow-md) !important;
    border-color: var(--cd-blue) !important;
    transform: translateY(-2px);
  }
}

// ─── Dashboard Card Headings ──────────────────
.dashboard__card-header {
  font-weight: 600 !important;
  padding: 16px 20px !important;
  border-bottom: 1px solid var(--theme-border-color) !important;
}

// ─── Field Groups / Tabs ──────────────────────
.group-field__wrap,
.tabs-field__content-wrap {
  border-radius: var(--cd-radius-lg) !important;
  border: 1px solid var(--theme-border-color) !important;
}

// ─── Collapsibles ─────────────────────────────
.collapsible {
  border-radius: var(--cd-radius-md) !important;
  border: 1px solid var(--theme-border-color) !important;
  overflow: hidden;

  .collapsible__toggle {
    padding: 12px 16px !important;
    font-weight: 500 !important;
    
    &:hover {
      background: var(--theme-elevation-50) !important;
    }
  }
}

// ─── Tabs ─────────────────────────────────────
.tabs-field .tabs-field__tab-button {
  border-radius: var(--cd-radius-md) var(--cd-radius-md) 0 0 !important;
  font-weight: 500 !important;
  transition: all var(--cd-transition-fast) !important;
  
  &.tabs-field__tab-button--active {
    color: var(--cd-blue) !important;
    border-bottom-color: var(--cd-blue) !important;
  }
}

// ─── Status Badge / Pill ──────────────────────
.status-pill {
  border-radius: var(--cd-radius-pill) !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 3px 10px !important;
}

// ─── Version Pill ─────────────────────────────
.versions-count {
  border-radius: var(--cd-radius-pill) !important;
  background: var(--cd-blue-bg) !important;
  color: var(--cd-blue) !important;
}

// ─── Array / Block Items ──────────────────────
.array-field__row,
.blocks-field__row {
  border-radius: var(--cd-radius-md) !important;
  border: 1px solid var(--theme-border-color) !important;
  margin-bottom: 8px !important;
  transition: border-color var(--cd-transition-fast) !important;

  &:hover {
    border-color: var(--cd-blue) !important;
  }
}

// ─── Block Selector Drawer ────────────────────
.blocks-drawer__block-selection {
  border-radius: var(--cd-radius-md) !important;
  border: 1px solid var(--theme-border-color) !important;
  padding: 12px !important;
  transition: all var(--cd-transition-fast) !important;

  &:hover {
    border-color: var(--cd-blue) !important;
    background: var(--cd-blue-bg) !important;
  }
}
```

---

## 10. Modals & Drawers

```scss
// src/styles/admin/_modals.scss

// ═══════════════════════════════════════════════════════
// MODALS & DRAWERS — Glasmorphism, smooth transitions
// ═══════════════════════════════════════════════════════

// ─── Drawer (edit panels die van rechts inschuiven) ──
.drawer {
  border-radius: var(--cd-radius-xl) 0 0 var(--cd-radius-xl) !important;
  box-shadow: -10px 0 40px rgba(0,0,0,0.15) !important;
}

// ─── Drawer Overlay ───────────────────────────
.drawer__overlay {
  background: rgba(15, 17, 23, 0.6) !important;
  backdrop-filter: blur(4px) !important;
}

// ─── Drawer Header ────────────────────────────
.drawer__header {
  border-bottom: 1px solid var(--theme-border-color) !important;
  padding: 20px 24px !important;
}

// ─── Modal ────────────────────────────────────
.modal__content {
  border-radius: var(--cd-radius-xl) !important;
  box-shadow: var(--cd-shadow-lg), 0 25px 50px -12px rgba(0,0,0,0.25) !important;
}

.modal__overlay {
  background: rgba(15, 17, 23, 0.6) !important;
  backdrop-filter: blur(4px) !important;
}

// ─── Popup Menu (dropdowns) ───────────────────
.popup {
  border-radius: var(--cd-radius-md) !important;
  box-shadow: var(--cd-shadow-lg) !important;
  border: 1px solid var(--theme-border-color) !important;
  overflow: hidden;
}

.popup__button-wrap .popup__button {
  padding: 8px 16px !important;
  transition: background var(--cd-transition-fast) !important;

  &:hover {
    background: var(--cd-blue-bg) !important;
  }
}

// ─── Toast / Notifications ────────────────────
.toast-notification {
  border-radius: var(--cd-radius-md) !important;
  box-shadow: var(--cd-shadow-lg) !important;
  border-left: 4px solid var(--cd-blue) !important;
  font-size: 14px !important;

  &.toast-notification--success {
    border-left-color: #10B981 !important;
  }
  &.toast-notification--error {
    border-left-color: #EF4444 !important;
  }
  &.toast-notification--warning {
    border-left-color: #F59E0B !important;
  }
}

// ─── Confirm Modal (verwijder dialoog) ────────
.delete-document__content {
  border-radius: var(--cd-radius-xl) !important;
  
  .btn--style-primary {
    background: #EF4444 !important;
    
    &:hover {
      background: #DC2626 !important;
    }
  }
}
```

---

## 11. Login Pagina

```scss
// src/styles/admin/_login.scss

// ═══════════════════════════════════════════════════════
// LOGIN — Branded login pagina
// ═══════════════════════════════════════════════════════

.login {
  // Achtergrond: navy met subtle gradient
  background: var(--cd-navy) !important;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(124,58,237,0.1) 0%, transparent 50%) !important;
  min-height: 100vh;
}

// ─── Login Card ───────────────────────────────
.login__form-wrap {
  background: var(--cd-glass-bg) !important;
  backdrop-filter: var(--cd-glass-blur) !important;
  border: var(--cd-glass-border) !important;
  border-radius: var(--cd-radius-xl) !important;
  box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
  padding: 40px !important;
  max-width: 420px !important;

  [data-theme="dark"] & {
    background: rgba(26,31,54,0.9) !important;
    border: 1px solid rgba(45,53,85,0.6) !important;
  }
}

// ─── Login Logo (groot, gecentreerd) ──────────
.login__brand {
  margin-bottom: 32px !important;
  
  img, svg {
    max-height: 48px !important;
  }
}

// ─── Login Title ──────────────────────────────
.login h1 {
  font-weight: 700 !important;
  font-size: 24px !important;
  color: var(--cd-navy) !important;
  margin-bottom: 8px !important;

  [data-theme="dark"] & {
    color: #F1F5F9 !important;
  }
}

// ─── Login Subtitle ───────────────────────────
.login p {
  color: #64748B !important;
  font-size: 14px !important;
}

// ─── Login Button ─────────────────────────────
.login .btn--style-primary {
  width: 100% !important;
  padding: 12px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  background: var(--cd-gradient) !important;
  border-radius: var(--cd-radius-md) !important;
  
  &:hover {
    box-shadow: 0 8px 25px rgba(59,130,246,0.4) !important;
  }
}

// ─── Login Footer ─────────────────────────────
.login__footer {
  color: rgba(255,255,255,0.5) !important;
  font-size: 12px !important;
}
```

---

## 12. Utilities & Animaties

```scss
// src/styles/admin/_utilities.scss

// ═══════════════════════════════════════════════════════
// UTILITIES — Helpers, animaties, glasmorphism
// ═══════════════════════════════════════════════════════

// ─── Smooth Scroll ────────────────────────────
* {
  scroll-behavior: smooth;
}

// ─── Global Transitions ───────────────────────
a,
button,
input,
select,
textarea,
.btn,
.card,
.nav__link,
.popup__button {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important;
}

// ─── Selection Color ──────────────────────────
::selection {
  background: rgba(59, 130, 246, 0.2);
  color: var(--cd-navy);
}

// ─── Scrollbar Styling (content area) ─────────
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--theme-border-color);
  border-radius: 4px;
  
  &:hover {
    background: #94A3B8;
  }
}

[data-theme="dark"] {
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    
    &:hover {
      background: rgba(255,255,255,0.25);
    }
  }
}

// ─── Glasmorphism Helper Classes ──────────────
.glass {
  background: var(--cd-glass-bg) !important;
  backdrop-filter: var(--cd-glass-blur) !important;
  border: var(--cd-glass-border) !important;
}

// ─── Gradient Text ────────────────────────────
.gradient-text {
  background: var(--cd-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

// ─── Loading Spinner Override ─────────────────
.loading-overlay__spinner .loader {
  border-color: var(--cd-blue) !important;
  border-top-color: transparent !important;
}

// ─── Rich Text Editor ─────────────────────────
.rich-text-lexical .ContentEditable__root {
  border-radius: var(--cd-radius-md) !important;
  border: 1px solid var(--theme-border-color) !important;
  
  &:focus-within {
    border-color: var(--cd-blue) !important;
    box-shadow: var(--cd-shadow-focus) !important;
  }
}

// ─── Toolbar (Lexical Rich Text) ──────────────
.rich-text-lexical .toolbar {
  border-radius: var(--cd-radius-md) var(--cd-radius-md) 0 0 !important;
  border-bottom: 1px solid var(--theme-border-color) !important;
}

// ─── Upload / Media Preview ───────────────────
.upload__image-wrap {
  border-radius: var(--cd-radius-lg) !important;
  overflow: hidden;
}

.file-field__upload {
  border-radius: var(--cd-radius-lg) !important;
  border: 2px dashed var(--theme-border-color) !important;
  transition: all var(--cd-transition-fast) !important;
  
  &:hover {
    border-color: var(--cd-blue) !important;
    background: var(--cd-blue-bg) !important;
  }
}

// ─── Breadcrumbs ──────────────────────────────
.step-nav a {
  color: #64748B !important;
  font-size: 13px !important;
  
  &:hover {
    color: var(--cd-blue) !important;
  }
}

.step-nav .step-nav__last {
  color: var(--theme-text) !important;
  font-weight: 500 !important;
}

// ─── Empty State ──────────────────────────────
.no-results {
  color: #94A3B8 !important;
  font-size: 15px !important;
  padding: 48px 0 !important;
}

// ─── Document Header ──────────────────────────
.doc-header {
  border-bottom: 1px solid var(--theme-border-color) !important;
  padding-bottom: 16px !important;
  margin-bottom: 24px !important;
}
```

---

## 13. Custom Components — Code

### 13.1 Logo (Login Scherm)

```tsx
// src/components/admin/graphics/Logo.tsx

import React from 'react'

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {/* SVG Compass Icoon */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
        <path
          d="M20 8L26 16L20 32L14 16L20 8Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M20 14L24 20L20 26L16 20L20 14Z"
          fill="white"
        />
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>

      {/* Woordmerk */}
      <div>
        <div style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#1A1F36',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
        }}>
          <span>Compass</span>
          <span style={{ color: '#3B82F6' }}>Digital</span>
        </div>
        <div style={{
          fontSize: '11px',
          color: '#94A3B8',
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Content Management
        </div>
      </div>
    </div>
  )
}

export default Logo
```

### 13.2 Icon (Sidebar)

```tsx
// src/components/admin/graphics/Icon.tsx

import React from 'react'

export const Icon: React.FC = () => {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="url(#icon-gradient)" />
      <path
        d="M20 10L25 18L20 30L15 18L20 10Z"
        fill="white"
        opacity="0.9"
      />
      <defs>
        <linearGradient id="icon-gradient" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default Icon
```

### 13.3 Welcome Banner (Dashboard)

```tsx
// src/components/admin/dashboard/WelcomeBanner.tsx

'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'

export const WelcomeBanner: React.FC = () => {
  const { user } = useAuth()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond'
  const firstName = user?.firstName || user?.email?.split('@')[0] || 'daar'

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A1F36 0%, #232942 100%)',
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '24px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decoratieve gradient cirkel */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '8px',
          letterSpacing: '-0.02em',
        }}>
          {greeting}, {firstName} 👋
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.7)',
          margin: 0,
        }}>
          Beheer je content, bekijk bestellingen en houd je platform up-to-date.
        </p>
      </div>
    </div>
  )
}

export default WelcomeBanner
```

### 13.4 Quick Actions (AfterDashboard)

```tsx
// src/components/admin/dashboard/QuickActions.tsx

'use client'

import React from 'react'

const actions = [
  {
    label: 'Nieuwe bestelling',
    href: '/admin/collections/bestellingen/create',
    icon: '📦',
    color: '#3B82F6',
  },
  {
    label: 'Producten beheren',
    href: '/admin/collections/producten',
    icon: '🏷️',
    color: '#10B981',
  },
  {
    label: 'Formulier inzendingen',
    href: '/admin/collections/form-submissions',
    icon: '📬',
    color: '#7C3AED',
  },
  {
    label: 'Instellingen',
    href: '/admin/globals/site-settings',
    icon: '⚙️',
    color: '#F59E0B',
  },
]

export const QuickActions: React.FC = () => {
  return (
    <div style={{ marginTop: '24px' }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '12px',
      }}>
        Snelle acties
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '12px',
      }}>
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid var(--theme-border-color)',
              textDecoration: 'none',
              color: 'var(--theme-text)',
              background: 'var(--theme-elevation-100)',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = action.color
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--theme-border-color)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span style={{ fontSize: '24px' }}>{action.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
```

---

## 14. Font Installatie

```bash
# Download Plus Jakarta Sans en JetBrains Mono
mkdir -p public/fonts

# Plus Jakarta Sans (van Google Fonts — woff2 bestanden)
# Download via: https://fonts.google.com/specimen/Plus+Jakarta+Sans
# Of gebruik:
curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7NSg.woff2" -o public/fonts/PlusJakartaSans-Regular.woff2
curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_907NSg.woff2" -o public/fonts/PlusJakartaSans-Medium.woff2
curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_m07NSg.woff2" -o public/fonts/PlusJakartaSans-SemiBold.woff2
curl -L "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_qU7NSg.woff2" -o public/fonts/PlusJakartaSans-Bold.woff2

# JetBrains Mono
curl -L "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2" -o public/fonts/JetBrainsMono-Regular.woff2
```

---

## 15. Implementatie Volgorde

### Stap 1: Foundation (30 min)
1. Maak de bestandsstructuur aan (sectie 2)
2. Download en installeer fonts (sectie 14)
3. Maak `custom.scss` met alle imports (sectie 4.1)
4. Registreer components in `payload.config.ts` (sectie 3)

### Stap 2: CSS Variabelen (15 min)
5. Implementeer `_variables.scss` — dit verandert direct 80% van het uiterlijk
6. Implementeer `_typography.scss` — fonts laden

### Stap 3: Component Styling (45 min)
7. `_navigation.scss` — Deep navy sidebar
8. `_buttons.scss` — Afgeronde buttons met gradient
9. `_inputs.scss` — Cleane form fields met blauwe focus
10. `_tables.scss` — Moderne collection lists
11. `_cards.scss` — Soft shadows en hover states
12. `_modals.scss` — Glasmorphism overlays
13. `_login.scss` — Branded login pagina
14. `_utilities.scss` — Scrollbars, rich text, breadcrumbs

### Stap 4: Custom Components (30 min)
15. `Logo.tsx` + `Icon.tsx` — CompassDigital branding
16. `WelcomeBanner.tsx` — Dashboard welkomstbericht
17. `QuickActions.tsx` — Snelkoppelingen op dashboard

### Stap 5: Testen & Fine-tuning (30 min)
18. Test light mode
19. Test dark mode
20. Test responsiveness (mobile sidebar)
21. Test alle collection views (list, edit, create)
22. Test rich text editor, media uploads
23. Test login pagina
24. Test drawers en modals
25. Fine-tune eventuele specifieke selectoren via browser inspector

---

## 16. Belangrijke Opmerkingen

### BEM Selectors
Payload gebruikt BEM naming. Als een selector uit dit plan niet werkt, open de browser inspector (F12) en zoek de exacte class name. De structuur is altijd: `.block__element--modifier`.

### Specificiteit
Gebruik `!important` waar nodig om Payload's ingebouwde styles te overschrijven. Dit is normaal bij CMS theming — Payload adviseert het zelf.

### Dark Mode
Payload gebruikt `[data-theme="dark"]` attribuut op de `<html>` tag. Alle dark mode overrides moeten binnen deze selector. De CSS variabelen in `_variables.scss` handelen dit automatisch af.

### Updates
Bij Payload updates kunnen class names veranderen. Check na updates of alle styling nog correct is. De CSS variabelen (sectie 4.2) zijn het meest stabiel en veranderen zelden.

### Custom "ACTIEVE KLANT" Selector
De bestaande klant-selector in je sidebar is een custom component. De styling daarvan wordt automatisch beïnvloed door de nav styling, maar je kunt specifieke overrides toevoegen in `_navigation.scss` door de juiste selector te inspecteren.

---

*Dit implementatieplan transformeert het standaard Payload admin panel naar een volledig gebrand CompassDigital platform. De kern zit in de CSS variabelen — die bepalen 80% van het resultaat. De rest is fine-tuning en custom components.*
