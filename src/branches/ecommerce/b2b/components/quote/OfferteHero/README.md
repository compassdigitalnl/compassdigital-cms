# OfferteHero (qr01)

B2B-focused hero section for quote request pages with dark navy gradient background, decorative teal glow, and clear messaging about the quote process.

## Features

- ✅ **Dark gradient background:** Navy to navy-light (135deg)
- ✅ **Decorative glow:** Semi-transparent teal radial gradient (top-right)
- ✅ **B2B badge:** Teal pill with optional Lucide icon
- ✅ **Large title:** 32px, 800 weight, white
- ✅ **Description text:** 15px, 50% opacity white
- ✅ **Response time option:** Auto-appended to description
- ✅ **Customizable max-width:** Description container (default: 560px)
- ✅ **Responsive:** Smaller padding and fonts on mobile/tablet
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { OfferteHero } from '@/branches/ecommerce/components/quote/OfferteHero'

<OfferteHero
  badge="B2B SERVICE"
  title="Offerte aanvragen"
  description="Vul het formulier in en ontvang een vrijblijvende offerte op maat voor uw bedrijf."
/>
```

### With Icon

```tsx
<OfferteHero
  badge="WHOLESALE"
  badgeIcon="briefcase"
  title="Groothandel offerte"
  description="Speciale prijzen voor grootafnemers en resellers."
/>
```

### With Response Time

```tsx
<OfferteHero
  badge="B2B SERVICE"
  badgeIcon="zap"
  title="Snelle offerte service"
  description="Wij nemen contact met u op voor een persoonlijk gesprek."
  responseTime="24 uur"
/>
// Renders: "Wij nemen contact met u op voor een persoonlijk gesprek. Verwachte responstijd: 24 uur."
```

### Custom Max Width

```tsx
<OfferteHero
  badge="CUSTOM QUOTE"
  title="Maatwerk oplossingen"
  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  maxWidth={700}
/>
```

### With Accessibility Label

```tsx
<OfferteHero
  badge="B2B"
  title="Offerte aanvragen"
  description="..."
  ariaLabel="B2B quote request hero section"
  className="custom-hero"
/>
```

## Props

| Prop           | Type     | Required | Default | Description                                      |
| -------------- | -------- | -------- | ------- | ------------------------------------------------ |
| `badge`        | `string` | ✅       | -       | Badge text (e.g., "B2B SERVICE", "WHOLESALE")    |
| `badgeIcon`    | `string` | ❌       | -       | Optional Lucide icon name (kebab-case)           |
| `title`        | `string` | ✅       | -       | Main heading text                                |
| `description`  | `string` | ✅       | -       | Description text                                 |
| `responseTime` | `string` | ❌       | -       | Auto-appended to description (e.g., "24 uur")    |
| `maxWidth`     | `number` | ❌       | `560`   | Description max-width in pixels                  |
| `ariaLabel`    | `string` | ❌       | `"Offerte aanvragen"` | ARIA label for accessibility   |
| `className`    | `string` | ❌       | `''`    | Additional CSS classes                           |

## Badge Icons

The `badgeIcon` prop accepts any Lucide React icon name in kebab-case format:

- `briefcase` - Business/B2B
- `zap` - Fast/Quick service
- `award` - Premium/Quality
- `package` - Products/Wholesale
- `truck` - Delivery/Logistics
- `users` - Team/Enterprise
- `check-circle` - Verified/Approved

**Example:**
```tsx
<OfferteHero badgeIcon="briefcase" ... />
// Automatically loads and renders the Briefcase icon from lucide-react
```

## Visual Design

### Background Gradient
- **Direction:** 135deg (top-left to bottom-right)
- **Colors:** `var(--navy)` → `var(--navy-light)`
- **Effect:** Subtle depth and dimension

### Decorative Glow
- **Position:** Top-right corner (absolute)
- **Shape:** 400×400px circle (300×300px on mobile)
- **Color:** `rgba(0, 137, 123, 0.15)` (semi-transparent teal)
- **Purpose:** Visual interest without distraction

### Badge
- **Background:** `var(--teal-bg)` (light teal)
- **Border:** 1.5px `var(--teal)`
- **Font:** 11px, 700 weight, uppercase, 8% letter-spacing
- **Border radius:** 999px (pill shape)
- **Icon size:** 14×14px (12×12px on mobile)

### Title
- **Font:** `var(--font-family-heading)`
- **Size:** 32px (28px tablet, 24px mobile)
- **Weight:** 800
- **Color:** `var(--white)`
- **Line height:** 1.25
- **Letter spacing:** -0.02em (tighter for large text)

### Description
- **Font:** `var(--font-family-body)`
- **Size:** 15px (14px mobile)
- **Color:** `rgba(255, 255, 255, 0.5)` (50% opacity)
- **Line height:** 1.6
- **Max width:** Customizable (default: 560px)

## Responsive Breakpoints

### Desktop (Default)
- Padding: 80px vertical, 24px horizontal
- Title: 32px
- Description: 15px
- Badge icon: 14×14px
- Glow: 400×400px

### Tablet (≤1024px)
- Padding: 64px vertical
- Title: 28px

### Mobile (≤768px)
- Padding: 48px vertical, 16px horizontal
- Title: 24px
- Description: 14px
- Badge: Smaller padding (5px 14px)
- Badge font: 10px
- Badge icon: 12×12px
- Glow: 300×300px

## Theme Variables

| Element              | Variable              | Value                           |
| -------------------- | --------------------- | ------------------------------- |
| Background gradient  | `--navy`, `--navy-light` | #0A1628 → #1A2B45            |
| Decorative glow      | Teal (15% opacity)    | rgba(0, 137, 123, 0.15)         |
| Badge background     | `--teal-bg`           | Light teal                      |
| Badge border         | `--teal`              | #00897B                         |
| Badge text           | `--teal`              | #00897B                         |
| Title                | `--white`             | #FFFFFF                         |
| Description          | White (50% opacity)   | rgba(255, 255, 255, 0.5)        |

## Accessibility

### Semantic HTML
- `<header>` element for main container
- `<h1>` for title (proper heading hierarchy)
- `<p>` for description

### ARIA Attributes
- `aria-label` on header (default: "Offerte aanvragen")
- Can be customized via `ariaLabel` prop

### Focus States
- No interactive elements (pure presentational component)
- If used with CTA buttons below, ensure proper focus order

### Color Contrast
- Title: White on dark navy (WCAG AAA)
- Badge: Teal (#00897B) on light teal background (WCAG AA)
- Description: 50% white on navy (WCAG AA for large text)

## Response Time Feature

The `responseTime` prop automatically appends a formatted message to the description:

```tsx
// Without responseTime
description: "Vul het formulier in."
// Renders: "Vul het formulier in."

// With responseTime
description: "Vul het formulier in."
responseTime: "24 uur"
// Renders: "Vul het formulier in. Verwachte responstijd: 24 uur."
```

**Common values:**
- `"24 uur"`
- `"1 werkdag"`
- `"2-3 werkdagen"`
- `"binnen 48 uur"`

## Usage Patterns

### Quote Request Page
```tsx
<OfferteHero
  badge="B2B SERVICE"
  badgeIcon="briefcase"
  title="Offerte aanvragen"
  description="Vul het formulier in en ontvang een vrijblijvende offerte op maat voor uw bedrijf."
  responseTime="24 uur"
/>
```

### Wholesale Page
```tsx
<OfferteHero
  badge="WHOLESALE"
  badgeIcon="package"
  title="Groothandel prijzen"
  description="Vraag een offerte aan voor bulk orders en profiteer van aantrekkelijke staffelprijzen."
  responseTime="1 werkdag"
/>
```

### Custom Solutions Page
```tsx
<OfferteHero
  badge="MAATWERK"
  badgeIcon="award"
  title="Op maat gemaakte oplossingen"
  description="Hebben specifieke wensen? Wij denken graag met u mee voor een oplossing die perfect past."
  maxWidth={700}
/>
```

## Performance Optimization

### Icon Loading
Icons are loaded dynamically using React's `useEffect` and dynamic imports:

```typescript
React.useEffect(() => {
  if (badgeIcon) {
    const iconName = badgeIcon
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    import('lucide-react')
      .then((mod) => {
        const Icon = (mod as any)[iconName]
        if (Icon) {
          setIconComponent(() => Icon)
        }
      })
      .catch((err) => console.error('Failed to load icon:', err))
  }
}, [badgeIcon])
```

**Benefits:**
- Only loads icon when needed
- No bundle bloat from unused icons
- Automatic kebab-case to PascalCase conversion

### CSS Optimization
- Uses styled-jsx for component-scoped styles
- No CSS-in-JS runtime overhead
- Styles compiled at build time

## Related Components

- **QR02: ProductSelectionTable** - Table below hero for selecting products
- **QR03: CompanyInfoForm** - Company details form
- **QR04: ProjectInfoForm** - Project information form
- **QR05: FileUploadDropzone** - File upload for specifications/drawings
- **H1: PageHero** - General page hero (lighter background)
- **C6: BadgeGrid** - Related badge component pattern

## Testing Checklist

- ✓ Badge displays correctly with text
- ✓ Badge icon loads when specified
- ✓ Invalid icon name doesn't break component
- ✓ Title renders with proper styling
- ✓ Description renders with proper opacity
- ✓ Response time appends correctly to description
- ✓ Custom maxWidth applies to description
- ✓ Decorative glow renders in top-right corner
- ✓ Responsive layout works on mobile (<768px)
- ✓ Responsive layout works on tablet (<1024px)
- ✓ Custom className applies
- ✓ Custom ariaLabel applies
- ✓ No console errors for missing props
- ✓ Gradient background renders correctly

## Component Location

```
src/branches/ecommerce/components/quote/OfferteHero/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quote Request
**Complexity:** Medium (dynamic icon loading, gradient background, pseudo-elements)
**Priority:** 🟢 HIGH
**Last Updated:** February 25, 2026
