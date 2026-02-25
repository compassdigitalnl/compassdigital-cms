# Theme Variables Reference
# Compass Design System - 54 Design Tokens

**Source:** `aboland01.compassdigital.nl/admin/globals/theme/`
**Usage:** ALL components MUST use these variables (NO hardcoded colors!)

---

## 🎨 Colors (16 tokens)

### Primary Colors
```css
--navy         #0A1628    /* Main dark background */
--navy-light   #121F33    /* Lighter navy for hover states */
--teal         #00897B    /* Primary brand color (buttons, links) */
--teal-light   #26A69A    /* Light teal hover states */
--teal-dark    #00695C    /* Dark teal pressed states */
```

### Status Colors
```css
--green        #00C853    /* Success messages */
--coral        #FF6B6B    /* Error/Danger */
--amber        #F59E0B    /* Warning */
--blue         #2196F3    /* Info */
--purple       #7C3AED    /* Highlight/Special */
```

### Neutral Colors
```css
--white        #FAFBFC    /* Pure white surfaces */
--bg           #F5F7FA    /* Page background */
--grey         #E8ECF1    /* Borders, dividers */
--grey-mid     #94A3B8    /* Muted text, icons */
--grey-dark    #64748B    /* Body text */
--text         #1E293B    /* Headings, primary text */
```

---

## 📝 Typography (11 tokens)

### Font Families
```css
--font         'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif
--font-display 'DM Serif Display', Georgia, serif
--font-mono    'JetBrains Mono', 'Courier New', monospace
```

### Type Scale (8 sizes)
```css
--text-hero          36px    /* Hero headings */
--text-section       24px    /* Section headings (H2) */
--text-card-title    18px    /* Card titles (H3) */
--text-body          14px    /* Body text */
--text-small         12px    /* Small labels */
--text-micro         11px    /* Micro text */
--text-caption       10px    /* Captions */
--text-tiny           8px    /* Badges, tags */
```

---

## 📏 Spacing (9 tokens) - READ-ONLY!

**4px Grid System** (LOCKED - don't change!)

```css
--sp-1    4px     /* Tiny spacing (icon padding) */
--sp-2    8px     /* Extra small (button padding, tag spacing) */
--sp-3    12px    /* Small (input padding) */
--sp-4    16px    /* Default (card padding) */
--sp-5    20px    /* Medium (section gaps) */
--sp-6    24px    /* Large (component margins) */
--sp-8    32px    /* Extra large (section spacing) */
--sp-12   48px    /* Huge (major sections) */
--sp-16   64px    /* Massive (hero spacing) */
```

---

## 🎭 Gradients (4 tokens)

```css
--gradient-hero     linear-gradient(135deg, #0A1628 0%, #00897B 100%)
--gradient-card     linear-gradient(180deg, #FAFBFC 0%, #F5F7FA 100%)
--gradient-overlay  linear-gradient(180deg, rgba(10,22,40,0) 0%, rgba(10,22,40,0.8) 100%)
--gradient-shimmer  linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)
```

---

## 🎪 Visual (14 tokens)

### Border Radius
```css
--radius-sm    4px     /* Small (buttons, inputs) */
--radius-md    8px     /* Medium (cards) */
--radius-lg    12px    /* Large (modals) */
--radius-xl    16px    /* Extra large (hero sections) */
--radius-full  9999px  /* Fully rounded (pills, avatars) */
```

### Shadows
```css
--shadow-sm   0 1px 2px rgba(10,22,40,0.05)
--shadow-md   0 4px 6px rgba(10,22,40,0.1)
--shadow-lg   0 10px 15px rgba(10,22,40,0.15)
--shadow-xl   0 20px 25px rgba(10,22,40,0.2)
```

### Z-Index
```css
--z-dropdown   100
--z-sticky     200
--z-modal      300
--z-toast      400
--z-tooltip    500
```

---

## ✅ Usage Rules

### ❌ BAD - Hardcoded colors
```tsx
<div className="bg-blue-500 text-white border-gray-300">
<button style={{ background: '#00897B' }}>Click</button>
```

### ✅ GOOD - Theme variables
```tsx
<div className="bg-[var(--teal)] text-[var(--white)] border-[var(--grey)]">
<button style={{ background: 'var(--teal)' }}>Click</button>
```

### ✅ BETTER - Tailwind with theme config
```tsx
<div className="bg-theme-teal text-theme-white border-theme-grey">
<button className="bg-theme-teal hover:bg-theme-teal-light">Click</button>
```

---

## 🔗 References

- **Theme Global:** `src/globals/Theme.ts`
- **Color Tokens:** `src/globals/colors/index.ts` (16 colors)
- **Typography:** `src/globals/typography/index.ts` (11 tokens)
- **Spacing:** `src/globals/spacing/index.ts` (9 tokens - LOCKED)
- **Gradients:** `src/globals/gradients/index.ts` (4 gradients)
- **Visual:** `src/globals/visual/index.ts` (14 tokens)
- **Admin Panel:** https://aboland01.compassdigital.nl/admin/globals/theme/

---

**Last Updated:** 25 February 2026
**Total Design Tokens:** 54 (16 colors + 11 typography + 9 spacing + 4 gradients + 14 visual)
