# Fix: Explicit text-white op headings in donkere secties

## Context

Commit 522d44c verwijderde `color: var(--color-text-primary)` uit de ThemeProvider heading rule.
Dit was correct, maar onvoldoende: CSS inheritance van `text-white` via parent elementen werkt
niet betrouwbaar in deze Next.js/Tailwind setup. De `.theme-provider` wrapper zet
`color: var(--color-text-primary)` en headings erven deze donkere kleur in plaats van de
`text-white` van hun directe parent.

**Oplossing:** Voeg explicit `text-white` toe aan headings en tekst die op donkere achtergronden staan.
Vertrouw NIET op CSS inheritance via parent containers.

---

## Bestand 1: Hero Component

**File:** `src/branches/shared/blocks/Hero/Component.tsx`

### Wijziging 1a — renderTitle() h1 (regel 34)

Dit is de h1 ZONDER titleAccent. Wordt alleen gebruikt in two-column layout (donkere achtergrond).

```tsx
// WAS (regel 34):
      return <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">{title}</h1>

// WORDT:
      return <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">{title}</h1>
```

### Wijziging 1b — renderTitle() h1 MET accent (regel 39)

Dit is de h1 MET titleAccent span. Wordt alleen gebruikt in two-column layout (donkere achtergrond).

```tsx
// WAS (regel 39):
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">

// WORDT:
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-white">
```

### Wijziging 1c — Centered image variant h1 (regel 148)

Dit is de h1 in de centered layout met achtergrondafbeelding (donkere overlay).

```tsx
// WAS (regel 148):
          <h1 className="text-5xl font-bold mb-6">{title}</h1>

// WORDT:
          <h1 className="text-5xl font-bold mb-6 text-white">{title}</h1>
```

### Wijziging 1d — Centered image variant p (regel 149)

```tsx
// WAS (regel 149):
          {subtitle && <p className="text-xl mb-8">{subtitle}</p>}

// WORDT:
          {subtitle && <p className="text-xl mb-8 text-white/90">{subtitle}</p>}
```

### NIET wijzigen

- Regel 181 (`<h1>` in centered no-image variant) — lichte achtergrond, moet donker blijven
- Regel 182 (`<p>` in centered no-image variant) — idem

---

## Bestand 2: CTA Component

**File:** `src/branches/shared/blocks/CTA/Component.tsx`

### Wijziging 2a — Card variant h2 (regel 34)

```tsx
// WAS (regel 34):
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">

// WORDT:
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
```

### Wijziging 2b — Full-width variant h2 (regel 74)

```tsx
// WAS (regel 74):
        <h2 className="text-4xl font-bold mb-4">{title}</h2>

// WORDT:
        <h2 className="text-4xl font-bold mb-4 text-white">{title}</h2>
```

### Wijziging 2c — Full-width variant p (regel 75)

```tsx
// WAS (regel 75):
        {text && <p className="text-xl mb-8">{text}</p>}

// WORDT:
        {text && <p className="text-xl mb-8 text-white/90">{text}</p>}
```

### Wijziging 2d — Full-width secondary button tekst (regel 88)

De secondary button heeft geen `text-white`, waardoor de tekst onzichtbaar is op groene achtergrond.

```tsx
// WAS (regel 88):
              className="btn px-8 py-4 bg-transparent border-2 border-white rounded-lg font-semibold inline-block transition-all duration-300 hover:bg-white/10"

// WORDT:
              className="btn px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold inline-block transition-all duration-300 hover:bg-white/10"
```

---

## Bestand 3: FAQ Component

**File:** `src/branches/shared/blocks/FAQ/Component.tsx`

### Wijziging 3a — Verwijder blauwe focus ring van details element (regel 42)

De `<details>` elementen tonen een blauwe browser-default focus ring.

```tsx
// WAS (regel 42):
              className="faq-item border border-primary hover:border-secondary hover:bg-secondary/5 rounded-lg p-6 hover:shadow-md transition-all duration-300 group"

// WORDT:
              className="faq-item border border-primary hover:border-secondary hover:bg-secondary/5 rounded-lg p-6 hover:shadow-md transition-all duration-300 group outline-none"
```

### Wijziging 3b — Verwijder blauwe focus ring van summary element (regel 45)

```tsx
// WAS (regel 45):
                className="font-semibold text-lg text-primary cursor-pointer flex items-center justify-between"

// WORDT:
                className="font-semibold text-lg text-primary cursor-pointer flex items-center justify-between outline-none"
```

---

## Samenvatting van wijzigingen

| Bestand | Regel | Wijziging |
|---------|-------|-----------|
| Hero/Component.tsx | 34 | `text-white` toevoegen aan h1 |
| Hero/Component.tsx | 39 | `text-white` toevoegen aan h1 |
| Hero/Component.tsx | 148 | `text-white` toevoegen aan h1 |
| Hero/Component.tsx | 149 | `text-white/90` toevoegen aan p |
| CTA/Component.tsx | 34 | `text-white` toevoegen aan h2 |
| CTA/Component.tsx | 74 | `text-white` toevoegen aan h2 |
| CTA/Component.tsx | 75 | `text-white/90` toevoegen aan p |
| CTA/Component.tsx | 88 | `text-white` toevoegen aan secondary button |
| FAQ/Component.tsx | 42 | `outline-none` toevoegen aan details |
| FAQ/Component.tsx | 45 | `outline-none` toevoegen aan summary |

**Totaal: 10 kleine class-toevoegingen in 3 bestanden.**

---

## Verificatie

1. `npm run build` moet slagen
2. Check op aboland01.compassdigital.nl:
   - Hero two-column: **witte** titel op navy achtergrond
   - CTA card: **witte** titel op groene gradient
   - CTA full-width: **witte** titel + tekst op groene achtergrond, secondary button tekst zichtbaar
   - FAQ: **geen** blauwe focus ring bij openen van vraag
3. Check op plastimed01: geen regressie op lichte achtergronden

## Commit message

```
fix: Add explicit text-white to headings in dark sections (CSS inheritance unreliable)
```
