# Block Theme Integration Guide

## Overview

This guide shows how to make your blocks **100% theme-driven** using CSS variables from the Theme global.

All theme variables are defined in `src/styles/theme-utilities.css` and automatically applied via `ThemeProvider`.

---

## Available CSS Variables

### Colors
```css
--color-primary          /* Main brand color */
--color-secondary        /* Secondary brand color */
--color-accent           /* Accent/highlight color */
--color-background       /* Default page background */
--color-surface          /* Cards, sections background */
--color-border           /* Default border color */
--color-text-primary     /* Main text color */
--color-text-secondary   /* Secondary text color */
--color-text-muted       /* Muted/disabled text */
```

### Typography
```css
--font-heading           /* Font for headings */
--font-body              /* Font for body text */
--font-scale             /* Overall font size scale (0.875 | 1 | 1.125) */
```

### Layout
```css
--border-radius          /* Default border radius (0px - 9999px) */
--container-width        /* Max width for containers (1024px - 1792px) */
--shadow                 /* Box shadow size */
--transition-duration    /* Animation duration (0ms or 200ms) */
```

---

## Utility Classes

Use these pre-built classes instead of writing custom CSS:

### Background Colors
```tsx
<div className="bg-primary">Primary background</div>
<div className="bg-secondary">Secondary background</div>
<div className="bg-surface">Surface background</div>
```

### Text Colors
```tsx
<h1 className="text-primary-color">Primary text</h1>
<p className="text-secondary-color">Secondary text</p>
```

### Buttons
```tsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-outline">Outline Button</button>
```

### Sections
```tsx
<section className="section-default">Default background</section>
<section className="section-surface">Surface background</section>
<section className="section-primary">Primary background</section>
<section className="section-gradient">Gradient background</section>
```

### Cards
```tsx
<div className="card">
  Card with theme border, shadow, and radius
</div>
```

---

## Migration Examples

### ❌ Before (Hardcoded)

```tsx
export const MyBlock = ({ title, content }) => {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: '#00796B' }}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: '#0A1628' }}
        >
          {title}
        </h2>
        <p style={{ color: '#64748b' }}>{content}</p>

        <button
          className="px-6 py-3 rounded-lg"
          style={{
            backgroundColor: '#00796B',
            color: 'white'
          }}
        >
          Learn More
        </button>
      </div>
    </section>
  )
}
```

### ✅ After (Theme-Driven)

```tsx
export const MyBlock = ({ title, content }) => {
  return (
    <section className="section-primary py-16">
      <div className="container-theme">
        <h2 className="text-3xl font-bold mb-4 font-heading">
          {title}
        </h2>
        <p className="text-secondary-color font-body">{content}</p>

        <button className="btn btn-primary px-6 py-3">
          Learn More
        </button>
      </div>
    </section>
  )
}
```

**Benefits:**
- ✅ Colors automatically adapt when client changes theme
- ✅ Fonts respect Theme global settings
- ✅ Border radius, shadows consistent across site
- ✅ No hardcoded values = multi-client ready

---

## Advanced: Dynamic Styles

For cases where utility classes aren't enough, use CSS variables directly:

```tsx
export const AdvancedBlock = ({ variant }) => {
  // Use inline styles with CSS variables
  const sectionStyle = {
    background: variant === 'gradient'
      ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
      : 'var(--color-background)',
    color: variant === 'gradient' ? 'white' : 'var(--color-text-primary)',
  }

  return (
    <section style={sectionStyle} className="py-16">
      <div className="container-theme">
        <h2 className="font-heading text-3xl">Dynamic Section</h2>
      </div>
    </section>
  )
}
```

---

## Block Style Field Pattern

For blocks that support multiple visual styles, use this pattern:

### In Block Config (`config.ts`):

```ts
{
  name: 'style',
  type: 'select',
  label: 'Block Style',
  defaultValue: 'default',
  options: [
    { label: 'Default', value: 'default' },
    { label: 'Primary', value: 'primary' },
    { label: 'Gradient', value: 'gradient' },
    { label: 'Surface', value: 'surface' },
  ],
}
```

### In Block Component:

```tsx
export const StyledBlock = ({ title, style }) => {
  // Map style prop to section class
  const styleClasses = {
    default: 'section-default',
    primary: 'section-primary',
    gradient: 'section-gradient',
    surface: 'section-surface',
  }

  return (
    <section className={`${styleClasses[style] || styleClasses.default} py-16`}>
      <div className="container-theme">
        <h2 className="font-heading text-3xl">{title}</h2>
      </div>
    </section>
  )
}
```

---

## Checklist: Making a Block Theme-Aware

- [ ] Replace hardcoded colors with CSS variables or utility classes
- [ ] Use `container-theme` instead of hardcoded max-width
- [ ] Use `font-heading` and `font-body` classes for typography
- [ ] Use `btn` utility classes for buttons
- [ ] Use `rounded-theme` instead of fixed border-radius
- [ ] Use `shadow-theme` instead of hardcoded shadows
- [ ] Add `style` field to block config if block supports variants
- [ ] Test block with different theme configurations in admin

---

## Testing Your Theme Integration

1. **Configure Theme in Admin:**
   - Go to `/admin/globals/theme`
   - Change primary color, fonts, border radius
   - Save

2. **Verify Block Updates:**
   - View page with your block
   - Confirm colors/fonts changed automatically
   - No hardcoded values visible

3. **Multi-Client Test:**
   - Create different theme configurations
   - Blocks should adapt completely

---

## Framework Principle

> **"Use design tokens"** - payload-website-framework-b2b-b2c.md

All styling should come from the Theme global. This makes your framework:
- ✅ **Multi-client ready** - Each client gets their own branded theme
- ✅ **Maintainable** - Change theme once, affects entire site
- ✅ **Consistent** - All blocks use same design system
- ✅ **Professional** - No hardcoded random colors

---

## Resources

- **Theme Global Config:** `src/globals/Theme.ts`
- **Theme Provider Component:** `src/components/ThemeProvider.tsx`
- **Utility Classes:** `src/styles/theme-utilities.css`
- **Example Blocks:** Check `src/blocks/Hero/Component.tsx` for reference
