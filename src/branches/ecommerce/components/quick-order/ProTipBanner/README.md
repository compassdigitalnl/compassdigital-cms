# ProTipBanner (qo05)

Light teal informational banner for tips and guidance on Quick Order and other B2B pages.

## Features

- ✅ **Teal styling:** Light teal background with teal border
- ✅ **Icon:** Lightbulb icon (20×20px) by default, customizable
- ✅ **Label:** Bold "Pro tip:" prefix in teal color
- ✅ **HTML support:** Tip text can include strong tags and links
- ✅ **Dismissible:** Optional close button
- ✅ **Compact variant:** Smaller padding and text (13px vs 14px)
- ✅ **Responsive:** Stacks on mobile, close button repositioned
- ✅ **Theme variables only:** NO hardcoded colors!

## Usage

### Basic Usage

```tsx
import { ProTipBanner } from '@/branches/ecommerce/components/quick-order/ProTipBanner'

<ProTipBanner tip="Sla je veelgebruikte bestellingen op als bestellijst om ze later met één klik opnieuw te bestellen." />
```

### With HTML (Links, Strong)

```tsx
<ProTipBanner tip="Gebruik <strong>Ctrl+Enter</strong> om direct toe te voegen aan je winkelwagen. <a href='/help/quick-order'>Meer tips</a>" />
```

### Dismissible

```tsx
<ProTipBanner
  tip="Deze tip kan je sluiten."
  dismissible
  onDismiss={() => console.log('Banner dismissed')}
/>
```

### Compact Variant

```tsx
<ProTipBanner
  tip="Korte tip in compacte modus."
  variant="compact"
/>
```

### Custom Icon

```tsx
<ProTipBanner
  tip="Keyboard shortcuts beschikbaar!"
  icon="keyboard"
/>
```

### Custom Label

```tsx
<ProTipBanner
  tip="Did you know you can save lists?"
  label="💡 Quick tip:"
/>
```

## Props

| Prop          | Type                          | Required | Default       | Description                          |
| ------------- | ----------------------------- | -------- | ------------- | ------------------------------------ |
| `tip`         | `string`                      | ✅       | -             | Tip text (supports HTML)             |
| `label`       | `string`                      |          | `'Pro tip:'`  | Label prefix before tip              |
| `icon`        | `string`                      |          | `'lightbulb'` | Lucide icon name                     |
| `variant`     | `'default' \| 'compact'`      |          | `'default'`   | Size variant                         |
| `dismissible` | `boolean`                     |          | `false`       | Show close button                    |
| `onDismiss`   | `() => void`                  |          | -             | Callback when dismissed              |
| `className`   | `string`                      |          | `''`          | Additional CSS classes               |

## Theme Variables

| Element     | Color/Style                    | Usage                    |
| ----------- | ------------------------------ | ------------------------ |
| Background  | `rgba(0, 137, 123, 0.08)`      | Light teal background    |
| Border      | `rgba(0, 137, 123, 0.2)`       | Teal border (1px)        |
| Icon        | `var(--teal)`                  | Lightbulb color          |
| Label       | `var(--teal)`                  | "Pro tip:" text          |
| Text        | `var(--navy)`                  | Main tip text            |
| Link        | `var(--teal)`                  | Link color               |
| Close btn   | `var(--grey-dark)`             | X icon color             |

## Component Location

```
src/branches/ecommerce/components/quick-order/ProTipBanner/
├── Component.tsx
├── types.ts
├── index.ts
└── README.md
```

---

**Category:** E-commerce / B2B / Quick Order
**Complexity:** Low
**Priority:** 🟡 MEDIUM
**Last Updated:** February 25, 2026
