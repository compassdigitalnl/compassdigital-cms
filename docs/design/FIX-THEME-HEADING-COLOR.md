# Fix: Theme Color Mismatches - ThemeProvider Heading Override + FAQ Antwoord Kleur

## Instructies voor Claude Lokaal

Voer de onderstaande 2 wijzigingen door, commit en push.

---

## Context

De homepage toont visuele inconsistenties: donkere tekst op donkere achtergronden (Hero, CTA full-width). De Hero, CTA en FAQ componenten zijn **al correct gerefactord** naar theme variables (`bg-primary`, `bg-gradient-primary`, `text-primary`, etc.). Het probleem zit in de ThemeProvider.

**Root cause:** ThemeProvider forceert `color: var(--color-text-primary)` op ALLE `h1-h6` elementen via een global CSS rule. Dit overschrijft `text-white` die componenten via parent containers instellen op secties met donkere achtergrond (Hero two-column met `bg-gradient-secondary`, CTA full-width met `bg-primary`). CSS specificity: een directe element selector (`h1 { color: ... }`) wint van kleur-inheritance van een parent `<div class="text-white">`.

---

## Stap 1: ThemeProvider - Verwijder heading color override

**File:** `src/branches/shared/components/utilities/ThemeProvider.tsx`

**Regel 195-198 in de `<style dangerouslySetInnerHTML>` tag.** Verwijder ALLEEN `color: var(--color-text-primary);` uit de heading rule. Laat `font-family` staan.

### WAS:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-text-primary);
}
```

### WORDT:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}
```

**Waarom dit werkt:** `.theme-provider` zet al `color: var(--color-text-primary)` op het wrapper element. Headings erven deze kleur via CSS inheritance. Wanneer een component `text-white` op een parent container zet (bijv. Hero's `<div className="text-white">`), erven headings nu correct de witte kleur in plaats van dat de directe element selector ze overschrijft.

---

## Stap 2: FAQ Component - Donkerder antwoord tekst

**File:** `src/branches/shared/blocks/FAQ/Component.tsx`

**Regel 57:** Verander `text-gray-700` naar `text-gray-800` voor donkerder, leesbaarder antwoord tekst.

### WAS:

```tsx
<div className="mt-4 text-gray-700">
```

### WORDT:

```tsx
<div className="mt-4 text-gray-800">
```

---

## Wat NIET gewijzigd hoeft te worden

De volgende componenten zijn al correct en gebruiken theme variables:

- **Hero** (`src/branches/shared/blocks/Hero/Component.tsx`): `bg-gradient-secondary`, `bg-gradient-primary`, `bg-primary`, `text-primary-light`, `bg-primary-glow`
- **CTA card** (`src/branches/shared/blocks/CTA/Component.tsx`): `bg-gradient-primary`, `text-white`, `text-primary`
- **CTA full-width**: `bg-primary text-white` - heading wordt gefixt door Stap 1
- **FAQ border/hover/chevron**: `border-primary`, `hover:border-secondary`, `text-primary`

---

## Verificatie

1. `npm run build` moet slagen
2. Check homepage:
   - Hero two-column: **witte** titel/tekst op navy achtergrond (was donker/onleesbaar)
   - CTA card: **witte** titel/tekst op groene gradient
   - CTA full-width: **witte** titel/tekst op groene achtergrond (was donker/onleesbaar)
   - FAQ: donkerder antwoord tekst (was te licht grijs)
3. Check plastimed01: headings op lichte achtergronden erven nog steeds donkere kleur van `.theme-provider`, geen regressie

## Commit message

```
fix: Remove ThemeProvider heading color override causing white-on-dark text issues
```
