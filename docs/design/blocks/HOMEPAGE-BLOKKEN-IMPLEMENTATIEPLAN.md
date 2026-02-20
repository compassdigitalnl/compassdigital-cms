# Homepage Blokken — Master Implementatieplan

> Analyse van `docs/design/voorbeelden/plastimed-homepage-concept.html` vs. bestaande Payload CMS blokken.
> Doel: de homepage uit het concept 1:1 kunnen opbouwen met CMS-blokken.

---

## Concept Overzicht

Het HTML-concept heeft **8 secties** tussen header en footer:

| # | Sectie | Concept beschrijving |
|---|--------|---------------------|
| 1 | **Hero** | Dark navy gradient, 2-kolom (tekst + stats card), badge, accent tekst, 2 CTAs |
| 2 | **Trust Bar** | 5 USPs horizontaal, icon + titel + subtekst, witte achtergrond |
| 3 | **Categorieën** | Sectielabel + titel + subtekst, 5-kolom grid, icon cards + "Quick Order" |
| 4 | **Producten** | Sectielabel + "bekijk alles" link, 4-kolom productkaarten met badges |
| 5 | **Merken** | Horizontale rij met merknamen als tekst, gedempte stijl |
| 6 | **Waarom wij** | Dark navy achtergrond, 3x2 grid, glaseffect kaarten met icons |
| 7 | **Reviews** | Sectielabel + titel, 3-kolom, sterren + citaat + auteur + bron |
| 8 | **CTA** | Teal gradient kaart, afgeronde hoeken, 2 knoppen |

---

## Blok-voor-blok Analyse

### 1. Hero Block — `hero`

**Config:** `src/blocks/Hero.ts`
**Component:** `src/blocks/Hero/Component.tsx`

#### Huidige staat
- 4 stijlen: `default`, `image`, `gradient`, `minimal`
- Velden: `title`, `subtitle`, `primaryCTA`, `secondaryCTA`, `backgroundImage`
- Component rendert alleen **gecentreerd single-column** — geen 2-kolom layout

#### Wat het concept nodig heeft
- **2-kolom layout**: tekst links, visueel paneel rechts (stats card met 4 metrics)
- **Badge/label** boven de titel ("Sinds 1994 — 30+ jaar ervaring")
- **Accent tekst** in de titel (gradient gekleurde tekst voor specifiek woord/zin)
- **Stats paneel** rechts: 4 stat items met nummer + suffix + label
- **Decoratieve elementen**: radial gradient glow, bottom accent line
- **Dark gradient achtergrond** met navy kleuren

#### Benodigde wijzigingen

**Config (`Hero.ts`) — nieuwe velden toevoegen:**

```typescript
// Toe te voegen velden:
{
  name: 'badge',              // "Sinds 1994 — 30+ jaar ervaring"
  type: 'text',
  label: 'Badge / Label',
  admin: { description: 'Kleine label boven de titel (optioneel)' }
},
{
  name: 'titleAccent',        // Het accent-woord in de titel
  type: 'text',
  label: 'Accent tekst in titel',
  admin: { description: 'Dit deel van de titel krijgt een gradient kleur' }
},
{
  name: 'layout',
  type: 'select',
  defaultValue: 'centered',
  options: [
    { label: 'Gecentreerd', value: 'centered' },
    { label: 'Twee kolommen (tekst + visueel)', value: 'two-column' },
  ]
},
{
  name: 'stats',              // Stats paneel rechts
  type: 'array',
  label: 'Statistieken (rechter paneel)',
  maxRows: 4,
  admin: { condition: (_, siblingData) => siblingData?.layout === 'two-column' },
  fields: [
    { name: 'number', type: 'text', required: true },    // "4000"
    { name: 'suffix', type: 'text' },                     // "+"
    { name: 'label', type: 'text', required: true },      // "Producten"
  ]
}
```

**Component (`Hero/Component.tsx`) — 2-kolom variant toevoegen:**
- Bij `layout === 'two-column'`: render 2-kolom grid met tekst links en stats card rechts
- Badge renderen als pill-shaped label boven de titel
- Titel splitsen op `titleAccent` en accent deel wrappen in gradient span
- Stats card renderen als glasmorfisme kaart met 2x2 grid
- Dark gradient achtergrond met decoratieve pseudo-elementen
- Bij `layout === 'centered'`: bestaand gedrag behouden (backwards compatible)

**Impact:** GROOT — Config + Component moeten beide significant worden uitgebreid
**Prioriteit:** HOOG

---

### 2. Trust Bar — `features` (style: `trust-bar`)

**Config:** `src/blocks/Services.ts`
**Component:** `src/blocks/Features/Component.tsx`

#### Huidige staat
- Trust-bar layout rendert horizontale items met icon, naam, en afgekapte beschrijving (max 40 tekens)
- 3 stijlen: `cards`, `clean`, `trust-bar`
- Lucide icons of custom uploads

#### Wat het concept nodig heeft
- 5 items horizontaal met icon + **titel** + **subtekst** (twee regels)
- Witte achtergrond met dividers tussen items
- Hover effect: lichte teal achtergrond
- Subtekst volledig tonen (niet afkappen op 40 tekens)

#### Benodigde wijzigingen

**Component (`Features/Component.tsx`) — trust-bar verbeteren:**

```diff
// Regel 71 - beschrijving niet afkappen:
- {feature.description.split('\n')[0].substring(0, 40)}
+ {feature.description}
```

- Emoji-icons ondersteunen naast Lucide icons (concept gebruikt emoji: 🏆 📦 ⚡ 🔒 ✅)
- Responsive: bij mobile 2 per rij i.p.v. 5

**Impact:** KLEIN — Alleen component styling aanpassen
**Prioriteit:** LAAG

---

### 3. Category Grid — `categoryGrid`

**Config:** `src/blocks/CategoryGrid.ts`
**Component:** `src/blocks/CategoryGrid/Component.tsx`

#### Huidige staat
- Velden: `heading`, `intro`, `source`, `layout` (grid-2 t/m grid-6), `showIcon`, `showProductCount`
- Rendert categorie-kaarten met icon, naam, productcount
- Fetcht automatisch uit API of handmatig

#### Wat het concept nodig heeft
- **Sectielabel** boven de titel ("Assortiment" — kleine uppercase teal tekst)
- **Subtekst** onder de titel (langere beschrijving)
- **Quick Order kaart** als laatste item (speciale stijl, teal achtergrond)
- Hover effect: kaart omhoog + shadow + teal top-border
- Achtergrondkleur: licht grijs (`#F5F7FA`)

#### Benodigde wijzigingen

**Config (`CategoryGrid.ts`) — nieuwe velden:**

```typescript
{
  name: 'sectionLabel',       // "Assortiment"
  type: 'text',
  label: 'Sectie label',
  admin: { description: 'Kleine uppercase tekst boven de titel (optioneel)' }
},
{
  name: 'showQuickOrderCard',
  type: 'checkbox',
  label: 'Toon "Quick Order" kaart als laatste item',
  defaultValue: false,
},
{
  name: 'quickOrderLink',
  type: 'text',
  label: 'Quick Order link',
  defaultValue: '/quick-order',
  admin: { condition: (_, siblingData) => siblingData?.showQuickOrderCard }
}
```

**Component (`CategoryGrid/Component.tsx`):**
- Sectie header uitbreiden met label + titel + subtekst patroon
- Na de categorie-kaarten een optionele "Quick Order" kaart renderen met teal achtergrond
- Hover styling verbeteren: `hover:-translate-y-1.5` + top-border accent

**Impact:** MIDDEL — Config + Component uitbreiden
**Prioriteit:** MIDDEL

---

### 4. Product Grid — `productGrid`

**Config:** `src/blocks/ProductGrid.ts`
**Component:** `src/blocks/ProductGrid/Component.tsx`

#### Huidige staat
- Uitgebreid blok met 5 bronnen (manual/featured/latest/category/brand)
- Layout: grid-2 t/m grid-5
- Toggle opties: addToCart, stockStatus, brand, comparePrice, viewAllButton
- Badge systeem (new/sale/popular/sold-out)
- Rendert al bijna exact zoals het concept!

#### Wat het concept nodig heeft
- **Sectielabel** ("Populair" — kleine uppercase teal tekst)
- Badge moet werken (parent div mist `relative` class voor `absolute` badge positioning)
- "Bekijk alle producten →" link al aanwezig ✅
- Product kaart: brand, naam, SKU, prijs + oude prijs, add-to-cart, stock — **alles al aanwezig** ✅

#### Benodigde wijzigingen

**Config (`ProductGrid.ts`) — 1 veld toevoegen:**

```typescript
{
  name: 'sectionLabel',
  type: 'text',
  label: 'Sectie label',
  admin: { description: 'Kleine uppercase tekst boven de titel (optioneel)' }
}
```

**Component (`ProductGrid/Component.tsx`) — 2 fixes:**

```diff
// Fix 1: Badge positioning — parent div mist 'relative'
- <div key={product.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden ...">
+ <div key={product.id} className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden ...">

// Fix 2: Sectie label renderen
+  {sectionLabel && (
+    <span className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3 block">
+      {sectionLabel}
+    </span>
+  )}
```

**Impact:** KLEIN — Minimale wijzigingen
**Prioriteit:** LAAG

---

### 5. Logo Bar / Merken — `logoBar`

**Config:** `src/blocks/LogoBar.ts`
**Component:** `src/blocks/LogoBar/Component.tsx`

#### Huidige staat
- Bron: collection (partners) of manual (logos array)
- Layout: grid of carousel
- Toont logo afbeeldingen, met text-fallback als er geen afbeelding is
- Text fallback: `text-gray-600 font-medium` (klein en licht)

#### Wat het concept nodig heeft
- **Tekst-only merknamen** als grote, bold tekst ("Hartmann", "BSN Medical", "3M", etc.)
- Gedempte stijl: `opacity: 0.4`, hover `opacity: 1`
- Witte achtergrond met top/bottom border
- Horizontaal verdeeld over de breedte (`justify-between`)

#### Benodigde wijzigingen

**Config (`LogoBar.ts`) — nieuw veld:**

```typescript
{
  name: 'displayMode',
  type: 'select',
  label: 'Weergave modus',
  defaultValue: 'image',
  options: [
    { label: 'Logo afbeeldingen', value: 'image' },
    { label: 'Merknamen als tekst', value: 'text' },
  ]
}
```

**Component (`LogoBar/Component.tsx`):**
- Bij `displayMode === 'text'`: render merknamen als grote bold tekst (font-size 22px, font-weight 800)
- Opacity 0.4 standaard, hover 1.0
- Layout: `flex justify-between items-center`
- Bij `displayMode === 'image'`: bestaand gedrag behouden

**Impact:** KLEIN — Simpele variant toevoegen
**Prioriteit:** LAAG

---

### 6. "Waarom wij" Sectie — `features` (dark variant)

**Config:** `src/blocks/Services.ts`
**Component:** `src/blocks/Features/Component.tsx`

#### Huidige staat
- 3 stijlen: `cards`, `clean`, `trust-bar`
- Altijd lichte achtergrond (wit of grijs)
- Geen optie voor donkere/gekleurde achtergrond
- Geen sectielabel

#### Wat het concept nodig heeft
- **Donkere navy achtergrond** (`#0A1628`) met decoratieve radial gradient
- **Sectielabel** ("Waarom Plastimed?")
- **Sectie header** in witte tekst (titel + subtekst)
- **3x2 grid** van kaarten met glasmorfisme effect (semi-transparante achtergrond, subtiele border)
- Kaarten: icon (emoji of custom) + titel (wit) + beschrijving (gedempte witte tekst)
- Hover: kaart licht op + teal border + omhoog bewegen

#### Benodigde wijzigingen

**Config (`Services.ts`) — nieuwe velden:**

```typescript
{
  name: 'sectionLabel',
  type: 'text',
  label: 'Sectie label',
  admin: { description: 'Kleine uppercase tekst boven de titel' }
},
{
  name: 'backgroundStyle',
  type: 'select',
  label: 'Achtergrond stijl',
  defaultValue: 'light',
  options: [
    { label: 'Licht (standaard)', value: 'light' },
    { label: 'Donker (navy)', value: 'dark' },
  ]
}
```

**Component (`Features/Component.tsx`) — dark variant:**

Bij `backgroundStyle === 'dark'`:
- Sectie: `bg-[#0A1628]` met decoratieve radial gradient pseudo-element
- Heading/intro: witte tekst
- Kaarten: `bg-white/[0.04] border border-white/[0.08] backdrop-blur` (glasmorfisme)
- Tekst: `text-white` voor titels, `text-white/50` voor beschrijvingen
- Icons: `bg-teal-500/15` achtergrond
- Hover: `bg-white/[0.07] border-teal-500/20 -translate-y-1`

Bij `backgroundStyle === 'light'` (default): bestaand gedrag behouden

**Impact:** GROOT — Significante component uitbreiding met volledig nieuwe visuele variant
**Prioriteit:** HOOG

---

### 7. Testimonials / Reviews — `testimonials`

**Config:** `src/blocks/TestimonialsBlock.ts`
**Component:** `src/blocks/TestimonialsBlock/Component.tsx`

#### Huidige staat
- Bron: collection of manual
- Layout: carousel, grid-2, grid-3
- Manual: name, role, company, quote, rating (1-5), photo
- Rendert sterren, citaat, auteur naam, rol, bedrijf

#### Wat het concept nodig heeft
- **Sectielabel** ("Klantervaringen")
- **Subtekst** ("Beoordeeld met gemiddeld 4.8 uit 5 sterren op Google Reviews")
- Kaarten: sterren + citaat + auteur naam + **bron** ("Via Google Reviews", "Via Kiyoh")
- Hover: teal border
- Getoond op lichte achtergrond (niet grijs)

#### Benodigde wijzigingen

**Config (`TestimonialsBlock.ts`) — nieuwe velden:**

```typescript
{
  name: 'sectionLabel',
  type: 'text',
  label: 'Sectie label',
  admin: { description: 'Kleine uppercase tekst boven de titel' }
},
// In manualTestimonials array:
{
  name: 'source',            // "Via Google Reviews"
  type: 'text',
  label: 'Bron / Platform',
  admin: { description: 'Bijv. "Via Google Reviews" of "Via Kiyoh"' }
}
```

**Component (`TestimonialsBlock/Component.tsx`):**
- Sectielabel renderen boven heading
- `source` veld tonen onder auteur naam
- Hover border aanpassen: `hover:border-teal-500` i.p.v. huidige `borderTop` stijl
- Achtergrond: `bg-white` i.p.v. `bg-gray-50`
- De inline `style={{ borderTop: '4px solid ...' }}` vervangen door Tailwind classes

**Impact:** KLEIN — Eenvoudige veldtoevoegingen en styling
**Prioriteit:** LAAG

---

### 8. CTA Block — `cta`

**Config:** `src/blocks/CTA.ts`
**Component:** `src/blocks/CTA/Component.tsx`

#### Huidige staat
- Velden: `title`, `text`, `buttonText`, `buttonLink`, `style` (primary/secondary/outline), `backgroundImage`
- Rendert full-bleed gekleurde sectie met 1 knop
- Gebruikt CSS variabelen voor kleur

#### Wat het concept nodig heeft
- **Gradient kaart** met afgeronde hoeken (niet full-bleed)
- **Teal gradient** achtergrond (`linear-gradient(135deg, #00897B, #00695C)`)
- **Decoratief element**: radial gradient cirkel rechtsboven
- **2 knoppen**: wit (primary) + ghost (transparant met border)
- Padding binnenin de kaart

#### Benodigde wijzigingen

**Config (`CTA.ts`) — velden uitbreiden:**

```typescript
// Bestaande velden behouden, toevoegen:
{
  name: 'secondaryButtonText',
  type: 'text',
  label: 'Tweede knop tekst',
  admin: { description: 'Optionele tweede knop (ghost stijl)' }
},
{
  name: 'secondaryButtonLink',
  type: 'text',
  label: 'Tweede knop link',
  admin: { condition: (_, siblingData) => !!siblingData?.secondaryButtonText }
},
{
  name: 'variant',
  type: 'select',
  label: 'Variant',
  defaultValue: 'full-width',
  options: [
    { label: 'Volledige breedte (standaard)', value: 'full-width' },
    { label: 'Kaart met afgeronde hoeken', value: 'card' },
  ]
}
```

**Component (`CTA/Component.tsx`):**
- Bij `variant === 'card'`: render als afgeronde kaart binnen container
- Gradient achtergrond met decoratieve cirkel
- 2 knoppen naast elkaar (wit + ghost)
- Bij `variant === 'full-width'`: bestaand gedrag behouden
- Inline styles vervangen door Tailwind classes

**Impact:** MIDDEL — Nieuwe variant + tweede knop
**Prioriteit:** MIDDEL

---

## Gedeeld Patroon: Sectie Label

**5 van de 8 blokken** hebben een `sectionLabel` nodig — een kleine, uppercase, teal-gekleurde tekst boven de sectietitel.

Voorstel: maak een herbruikbare helper:

```typescript
// src/fields/sectionLabel.ts
import type { Field } from 'payload'

export const sectionLabelField: Field = {
  name: 'sectionLabel',
  type: 'text',
  label: 'Sectie label',
  admin: {
    description: 'Kleine uppercase tekst boven de titel (bijv. "Assortiment", "Populair")',
  },
}
```

```tsx
// src/components/SectionLabel.tsx
export const SectionLabel = ({ label }: { label?: string }) => {
  if (!label) return null
  return (
    <span className="text-xs font-bold uppercase tracking-[0.1em] text-teal-600 mb-3 block">
      {label}
    </span>
  )
}
```

Gebruik in: Hero, CategoryGrid, ProductGrid, Features, Testimonials

---

## Prioriteiten Samenvatting

| Prioriteit | Blok | Type wijziging | Impact |
|-----------|------|---------------|--------|
| **HOOG** | Hero | Config + Component uitbreiden | 2-kolom layout, badge, stats panel, accent tekst |
| **HOOG** | Features (dark variant) | Config + Component uitbreiden | Dark achtergrond, glasmorfisme kaarten, sectielabel |
| **MIDDEL** | CTA | Config + Component uitbreiden | Tweede knop, kaart variant |
| **MIDDEL** | CategoryGrid | Config + Component uitbreiden | Sectielabel, Quick Order kaart |
| **LAAG** | ProductGrid | Config + Component fix | Sectielabel, badge positioning fix |
| **LAAG** | Testimonials | Config + Component tweaks | Sectielabel, bron veld, styling |
| **LAAG** | LogoBar | Config + Component variant | Tekst-only display mode |
| **LAAG** | Features (trust-bar) | Component fix | Beschrijving niet afkappen |

---

## Nieuwe Blokken Nodig?

**Nee.** Alle 8 secties kunnen worden gerealiseerd door **bestaande blokken uit te breiden**. Er hoeven geen nieuwe blokken gemaakt te worden.

---

## Implementatievolgorde (aanbevolen)

### Fase 1 — Fundament (sectielabel + gedeelde componenten)
1. Maak `src/fields/sectionLabel.ts` en `src/components/SectionLabel.tsx`
2. Voeg `sectionLabel` veld toe aan: Hero, CategoryGrid, ProductGrid, Features, Testimonials

### Fase 2 — Hoge prioriteit blokken
3. **Hero block** — 2-kolom layout, badge, accent tekst, stats panel
4. **Features block** — Dark background variant met glasmorfisme kaarten

### Fase 3 — Middel prioriteit blokken
5. **CTA block** — Tweede knop, kaart variant
6. **CategoryGrid** — Quick Order kaart optie

### Fase 4 — Lage prioriteit / polish
7. **ProductGrid** — Badge positioning fix
8. **Testimonials** — Bron veld, styling update
9. **LogoBar** — Tekst-only display mode
10. **Features trust-bar** — Beschrijving niet afkappen

### Fase 5 — Database migratie
11. Na alle code wijzigingen: `npm run generate:types` voor bijgewerkte TypeScript types
12. Payload CMS handelt schema-updates automatisch af bij herstart (geen handmatige ALTER TABLE nodig voor nieuwe velden in blocks — blocks worden als JSON opgeslagen in de `pages` tabel)

---

## Bestanden die aangepast moeten worden

| Bestand | Wijziging |
|---------|-----------|
| `src/fields/sectionLabel.ts` | **NIEUW** — Herbruikbaar veld |
| `src/components/SectionLabel.tsx` | **NIEUW** — Herbruikbaar component |
| `src/blocks/Hero.ts` | 4 velden toevoegen (badge, titleAccent, layout, stats) |
| `src/blocks/Hero/Component.tsx` | 2-kolom variant + alle visuele wijzigingen |
| `src/blocks/Services.ts` | 2 velden toevoegen (sectionLabel, backgroundStyle) |
| `src/blocks/Features/Component.tsx` | Dark variant + trust-bar description fix |
| `src/blocks/CTA.ts` | 3 velden toevoegen (secondaryButton, variant) |
| `src/blocks/CTA/Component.tsx` | Kaart variant + 2 knoppen |
| `src/blocks/CategoryGrid.ts` | 3 velden toevoegen (sectionLabel, quickOrder) |
| `src/blocks/CategoryGrid/Component.tsx` | Sectielabel + Quick Order kaart |
| `src/blocks/ProductGrid.ts` | 1 veld toevoegen (sectionLabel) |
| `src/blocks/ProductGrid/Component.tsx` | Sectielabel + badge fix (`relative` class) |
| `src/blocks/TestimonialsBlock.ts` | 2 velden toevoegen (sectionLabel, source) |
| `src/blocks/TestimonialsBlock/Component.tsx` | Sectielabel + bron + styling |
| `src/blocks/LogoBar.ts` | 1 veld toevoegen (displayMode) |
| `src/blocks/LogoBar/Component.tsx` | Tekst-only variant |

**Totaal: 2 nieuwe bestanden + 14 bestaande bestanden aanpassen**

---

## Database Impact

Blocks worden in Payload CMS opgeslagen als **JSON in de `_blocks` kolom** van pages/posts. Nieuwe velden in block configs vereisen **geen database migratie** — ze worden automatisch beschikbaar bij de volgende build. Alleen `npm run generate:types` is nodig om TypeScript types bij te werken.
