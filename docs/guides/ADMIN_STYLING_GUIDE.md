# 🎨 Admin Styling Guide - Contyzr Branding

Complete gids voor het aanpassen van de Payload CMS admin omgeving met Contyzr branding.

## 📋 Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Kleurenpalet](#kleurenpalet)
3. [Typografie](#typografie)
4. [Componenten](#componenten)
5. [Aanpassingen maken](#aanpassingen-maken)
6. [Dark Mode](#dark-mode)
7. [Logo aanpassen](#logo-aanpassen)

---

## 🎯 Overzicht

De admin omgeving is volledig gestyled in de **Contyzr huisstijl**:

### ✅ Wat is aangepast:

- **Kleurenschema**: Deep blue primary colors (#2563eb)
- **Typografie**: Inter font family (professioneel, modern)
- **Buttons**: Rounded corners (8px), gradient hovers
- **Cards**: Subtle shadows, smooth animations
- **Navigation**: Clean, spacious design
- **Forms**: Focus states met blue ring
- **Tables**: Hover effects, modern styling
- **Dashboard**: Gradient header met branding

### 📁 Belangrijke bestanden:

```
payload-app/
├── src/
│   ├── styles/
│   │   └── admin.css              # Hoofdstijlen (700+ regels)
│   ├── components/
│   │   └── AdminLogo/
│   │       └── index.tsx          # Custom logo component
│   └── payload.config.ts          # CSS & logo configuratie
```

---

## 🎨 Kleurenpalet

### Primary Colors (Contyzr Blue)

```css
--theme-primary-500: #3b82f6  /* Standaard blue */
--theme-primary-600: #2563eb  /* Buttons, CTA's */
--theme-primary-700: #1d4ed8  /* Hover states */
```

**Gebruik:**
- Primary buttons
- Active navigation items
- Focus rings
- Links & highlights

### Neutral Colors

```css
--theme-elevation-0: #ffffff     /* Cards, backgrounds */
--theme-elevation-50: #f8f9fa    /* Hover states */
--theme-elevation-100: #f1f3f5   /* Table headers */
--theme-border-color: #dee2e6    /* Borders, dividers */
```

### Status Colors

```css
/* Success - Green */
--theme-success-500: #10b981

/* Error - Red */
--theme-error-500: #ef4444

/* Warning - Orange */
--theme-warning-500: #f59e0b
```

### Dark Mode Colors

```css
[data-theme='dark'] {
  --theme-elevation-0: #0d0f12     /* Dark background */
  --theme-elevation-50: #1a1d21    /* Dark cards */
  --theme-text: #f8f9fa            /* Light text */
  --theme-border-color: #343a40    /* Dark borders */
}
```

---

## ✍️ Typografie

### Font Family

```css
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

**Inter** wordt gebruikt voor alle tekst:
- Modern, professioneel uiterlijk
- Goede leesbaarheid
- Variable font met meerdere weights

### Font Weights

```css
400 - Regular (body text)
500 - Medium (links, labels)
600 - Semibold (headings, buttons)
700 - Bold (titles, emphasis)
```

### Voorbeelden

```tsx
// Headings
<h1 style={{ fontWeight: 700, fontSize: '2rem' }}>Dashboard</h1>

// Labels
<label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Titel</label>

// Body text
<p style={{ fontWeight: 400, fontSize: '1rem' }}>Content...</p>
```

---

## 🧩 Componenten

### Buttons

**Primary Button:**
```css
.btn--style-primary {
  background: var(--theme-primary-600);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.625rem 1.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
```

**Hover effect:**
```css
.btn--style-primary:hover {
  background: var(--theme-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Input Fields

**Focus state met blue ring:**
```css
input:focus {
  border-color: var(--theme-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Cards

**Moderne card styling:**
```css
.card {
  background: var(--theme-elevation-0);
  border: 1px solid var(--theme-border-color);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
```

### Navigation

**Active state:**
```css
.nav__link--active {
  background: var(--theme-primary-50);
  color: var(--theme-primary-700);
  font-weight: 600;
}
```

### Tables

**Header styling:**
```css
.table th {
  background: var(--theme-elevation-50);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-size: 0.8125rem;
}
```

---

## 🛠️ Aanpassingen maken

### 1. Kleuren wijzigen

**Primary color aanpassen:**

Open `src/styles/admin.css` en wijzig:

```css
:root {
  /* Van blue naar bijv. purple */
  --theme-primary-500: #8b5cf6;
  --theme-primary-600: #7c3aed;
  --theme-primary-700: #6d28d9;
}
```

### 2. Border radius aanpassen

**Voor meer/minder afgeronde hoeken:**

```css
:root {
  /* Huidige waarden (8-12px) */
  --theme-radius: 8px;
  --theme-radius-lg: 12px;

  /* Voorbeeld: meer afgerond */
  --theme-radius: 12px;
  --theme-radius-lg: 16px;

  /* Voorbeeld: vierkant */
  --theme-radius: 4px;
  --theme-radius-lg: 6px;
}
```

### 3. Shadows aanpassen

**Voor subtielere/sterkere schaduwen:**

```css
:root {
  /* Subtiel */
  --theme-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  /* Medium (huidige) */
  --theme-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  /* Sterk */
  --theme-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

### 4. Typography aanpassen

**Ander font gebruiken:**

In `payload.config.ts`:

```typescript
// 1. Installeer font
// npm install @next/font

// 2. Importeer font
import { Outfit } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'] })

// 3. Gebruik in admin CSS
:root {
  --font-body: 'Outfit', sans-serif;
}
```

---

## 🌙 Dark Mode

Dark mode wordt **automatisch** ondersteund!

### Hoe werkt het?

```css
/* Light mode (default) */
:root {
  --theme-bg: #ffffff;
  --theme-text: #1a1d21;
}

/* Dark mode (automatisch) */
[data-theme='dark'] {
  --theme-bg: #0d0f12;
  --theme-text: #f8f9fa;
}
```

### Dark mode testen:

1. Open admin panel
2. Klik op je profiel (rechts boven)
3. Toggle "Dark Mode"

### Custom dark mode colors:

```css
[data-theme='dark'] {
  /* Voorbeeld: warmer dark mode */
  --theme-elevation-0: #1a1614;
  --theme-elevation-50: #2a2420;

  /* Voorbeeld: accent color aanpassen */
  --theme-primary-500: #60a5fa; /* Lighter blue voor dark mode */
}
```

---

## 🎨 Logo aanpassen

### Methode 1: SVG aanpassen (aanbevolen)

**Locatie:** `src/components/AdminLogo/index.tsx`

**Huidige logo:**
```tsx
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="white" />
</svg>
```

**Vervang met eigen SVG:**

```tsx
export const AdminLogo: React.FC = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* JOUW SVG HIER */}
        <svg width="24" height="24" viewBox="0 0 24 24">
          {/* Pas SVG path aan */}
        </svg>
      </div>

      {/* Text */}
      <div>
        <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>
          Jouw Naam
        </span>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
          CMS
        </span>
      </div>
    </div>
  )
}
```

### Methode 2: Afbeelding gebruiken

**Vervang SVG met IMG:**

```tsx
export const AdminLogo: React.FC = () => {
  return (
    <div style={{ padding: '0.5rem 0' }}>
      <img
        src="/admin-logo.svg"
        alt="Admin Logo"
        style={{
          maxWidth: '160px',
          height: 'auto'
        }}
      />
    </div>
  )
}
```

**Plaats logo in:**
```
payload-app/public/admin-logo.svg
```

### Methode 3: Alleen tekst

**Minimalistisch, geen icon:**

```tsx
export const AdminLogo: React.FC = () => {
  return (
    <span
      style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.02em',
      }}
    >
      Contyzr
    </span>
  )
}
```

---

## 🎯 Veelvoorkomende aanpassingen

### 1. Sidebar breedte aanpassen

```css
.nav {
  width: 280px !important; /* Default: 240px */
}
```

### 2. Dashboard header gradient aanpassen

```css
.dashboard__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}
```

### 3. Hover animatie uitschakelen

```css
.card:hover {
  transform: none !important; /* Disable lift effect */
}
```

### 4. Compact design (minder padding)

```css
.nav__link {
  padding: 0.5rem 0.75rem !important; /* Was: 0.75rem 1rem */
}

.table td {
  padding: 0.75rem !important; /* Was: 1rem */
}
```

---

## 📊 Testing Checklist

Na aanpassingen, test deze elementen:

- [ ] **Login page** - Logo, colors, form styling
- [ ] **Dashboard** - Header gradient, cards, stats
- [ ] **Navigation** - Active states, hover effects
- [ ] **Collections** - Table styling, badges
- [ ] **Forms** - Input focus states, buttons
- [ ] **Dark mode** - All colors, contrast, readability
- [ ] **Responsive** - Mobile nav, tablet layout

---

## 🚀 Deployment

### 1. Build check

```bash
cd payload-app
npm run build
```

### 2. Verify CSS loading

Admin CSS wordt automatisch geladen via:

```typescript
// payload.config.ts
css: path.resolve(dirname, 'styles/admin.css')
```

### 3. Production optimizations

CSS wordt automatisch:
- ✅ Minified
- ✅ Cached
- ✅ Versioned

Geen extra stappen nodig!

---

## 💡 Tips & Best Practices

### ✅ DO's:

- **Gebruik CSS variables** - Gemakkelijk aan te passen
- **Test dark mode** - Altijd beide thema's checken
- **Behoud contrast** - WCAG AA standaard (4.5:1 ratio)
- **Mobile-first** - Test op verschillende schermen
- **Browser compatibility** - Test Chrome, Firefox, Safari

### ❌ DON'Ts:

- **Geen !important spam** - Alleen waar echt nodig
- **Geen fixed widths** - Gebruik responsive units
- **Geen inline styles** - Gebruik CSS classes
- **Geen te kleine fonts** - Minimaal 14px voor body text
- **Geen te felle kleuren** - Behoud professioneel uiterlijk

---

## 🔧 Troubleshooting

### CSS wordt niet geladen

**Probleem:** Wijzigingen verschijnen niet

**Oplossing:**
```bash
# 1. Clear build cache
rm -rf .next

# 2. Rebuild
npm run build

# 3. Restart dev server
npm run dev
```

### Logo verschijnt niet

**Probleem:** Logo component toont errors

**Check:**
1. Bestand bestaat: `src/components/AdminLogo/index.tsx`
2. Export correct: `export const AdminLogo: React.FC`
3. Config correct: `graphics: { Logo: '@/components/AdminLogo#AdminLogo' }`

### Dark mode kleuren kloppen niet

**Probleem:** Contrast te laag in dark mode

**Oplossing:**
```css
[data-theme='dark'] {
  /* Gebruik lightere primary colors */
  --theme-primary-500: #60a5fa; /* Was: #3b82f6 */
  --theme-text: #f8f9fa;        /* Voldoende contrast */
}
```

---

## 📚 Resources

### Design Tools:

- **Colors**: [Coolors.co](https://coolors.co) - Kleurenpalet generator
- **Contrast**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Gradients**: [CSS Gradient](https://cssgradient.io)
- **Shadows**: [Box Shadows](https://box-shadow.dev)

### Payload CMS Docs:

- [Admin UI Customization](https://payloadcms.com/docs/admin/customization)
- [Custom Components](https://payloadcms.com/docs/admin/components)
- [Theming Guide](https://payloadcms.com/docs/admin/theming)

---

## ✅ Samenvatting

Je hebt nu een **volledig gebrandede admin omgeving** in Contyzr stijl!

**Wat is geïmplementeerd:**

✅ Custom CSS (700+ regels)
✅ Contyzr kleurenpalet (blue primary)
✅ Inter font typography
✅ Custom logo component
✅ Dark mode support
✅ Moderne animaties & hover effects
✅ Responsive design
✅ Professional shadows & borders

**Volgende stappen:**

1. Test de admin op http://localhost:3000/admin
2. Pas kleuren/logo aan naar wens
3. Deploy naar productie!

---

**Laatst bijgewerkt:** 11 Februari 2026
**Versie:** 1.0.0
**Auteur:** Claude Code
