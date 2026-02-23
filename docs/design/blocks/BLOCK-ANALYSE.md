# Blokken-Analyse: Shared vs Branch-Specific

**Datum:** 2026-02-23
**Commit:** dd4bdff

---

## Overzicht

| Locatie | Aantal | Altijd beschikbaar |
|---------|--------|--------------------|
| `src/branches/shared/blocks/` | **25 blokken** | Ja |
| `src/branches/ecommerce/blocks/` | **5 blokken** | Alleen als shop enabled |
| `src/branches/construction/blocks/` | **6 blokken** | Alleen als construction enabled |
| Overige branches (beauty, content, horeca, hospitality, marketplace) | **0 blokken** | n.v.t. |

**Totaal: 36 blokken**

---

## Architectuur: Hoe blokken worden geladen

### Registratie in Pages collection
`src/branches/shared/collections/Pages/index.ts`

```typescript
blocks: [
  // Altijd beschikbaar (shared)
  Spacer, Hero, Content, TwoColumn, ...

  // E-commerce blokken (altijd in Pages)
  ProductGrid, CategoryGrid, QuickOrder,

  // Conditioneel: alleen als collection enabled
  ...(disabledCollections.has('services') ? [] : [Services]),
  ...(disabledCollections.has('construction-services') ? [] : constructionBlocks),
]
```

### Feature flag systeem
- **Environment variable:** `DISABLED_COLLECTIONS` (komma-gescheiden slugs)
- **Feature flags:** `ENABLE_CONSTRUCTION`, `ENABLE_HOSPITALITY`, etc.
- **Per client:** Features configureerbaar via Clients collectie op platform
- **Detectie:** `src/lib/features.ts` → `isFeatureEnabled()`

---

## Shared Blokken (25 stuks)

### Layout & Structuur

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **Hero** | `centered`, `two-column`, `image` | Titel, subtitle, CTAs, stats panel, titleAccent gradient, badge |
| **Content** | `full`, `half`, `oneThird`, `twoThirds` | Multi-kolom rich text met CMSLink |
| **TwoColumn** | ratio prop | Twee-kolom layout container |
| **Spacer** | `small` (h-10), `default` (h-20), `large` (h-30), `xlarge` (h-40) | Verticale ruimte |

### Call-to-Action

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **CTA** | `card` (gradient kaart), `full-width` | Groot promotieblok met primaire + secundaire button |
| **CallToAction** | - | Compact CTA met rich text + meerdere CMSLink buttons (shadcn UI) |

### Content & Media

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **BlogPreview** | `grid-2`, `grid-3` | Blog post kaarten met featured image, auteur, datum, excerpt |
| **MediaBlock** | breakout, gutter opties | Afbeelding met RichText caption |
| **ImageGallery** | 2, 3, 4 kolommen | Afbeeldingen grid met captions |
| **Video** | aspect ratio | Video embed container |
| **Code** | taal selectie | Syntax highlighted code blok |

### Data & Features

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **Features** | `grid-2`-`grid-6`, `horizontal`, `trust-bar`, `cards`, `clean`, `light`/`dark` | Feature kaarten met Lucide iconen of uploads |
| **Services** | `grid-2`-`grid-6`, `horizontal`, `collection`/`manual` | Diensten grid met icoon, beschrijving, link |
| **FAQ** | `collection`/`manual` | Accordion Q&A met `<details>` elementen, RichText antwoorden |
| **TestimonialsBlock** | `grid-2`, `grid-3`, `carousel`, `collection`/`manual` | Reviews met sterren, auteur info |
| **Stats** | `grid-2`, `grid-3`, `grid-4` | Statistieken tellers op primary achtergrond |
| **Team** | `grid-2`, `grid-3`, `grid-4` | Team leden met avatar/initialen, rol, bio, contact links |
| **Pricing** | featured/highlighted plan | Prijstabel met features lijst en CTA per plan |
| **LogoBar** | `carousel` (animatie), `grid`, `image`/`text`, `collection`/`manual` | Partner/klant logos |

### Formulieren

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **ContactForm** | reCAPTCHA optioneel | Volledig contactformulier met validatie |
| **Form** | redirect/message confirmation | Dynamische form builder (react-hook-form) |

### Status & Notificaties

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **Banner** | `info`, `error`, `success`, `warning` | Status notificatie balk |
| **InfoBox** | `info`, `warning`, `success`, `danger` | Alert box met icoon en titel |
| **Accordion** | - | Inklapbare items met heading |

### Overig

| Blok | Variants/Layouts | Beschrijving |
|------|-----------------|-------------|
| **Map** | `small` (300px), `default` (450px), `large` (600px) | Kaart placeholder met adres |

---

## Ecommerce Blokken (5 stuks)

**Locatie:** `src/branches/ecommerce/blocks/`

| Blok | Layouts | Beschrijving | Shared equivalent? |
|------|---------|-------------|-------------------|
| **ProductGrid** | `grid-2`-`grid-5` | Product kaarten met badges (new/sale/popular/sold-out), voorraad, prijzen, add-to-cart. Source: manual, featured, category, brand, latest, sale | Services (qua layout) |
| **CategoryGrid** | `grid-2`-`grid-6` | Productcategorie kaarten met icoon/afbeelding, product count, optionele Quick Order kaart | Services (qua layout) |
| **ProductEmbed** | - | Inline product kaart: afbeelding/emoji, merk, titel, prijs, bestel-button | Geen |
| **ComparisonTable** | - | Interactieve vergelijkingstabel met check/cross/tekst cellen, donkere header | Geen |
| **QuickOrder** | `single`, `textarea`, `both` | Bulk bestellen per SKU/EAN, CSV upload, product lookup | Geen |

### Ecommerce Sub-variant

| Blok | Layouts | Beschrijving |
|------|---------|-------------|
| **CaseGrid** (in CategoryGrid/) | `grid-2`, `masonry` | Case study kaarten met featured image, klant, diensten tags |

---

## Construction Blokken (6 stuks)

**Locatie:** `src/branches/construction/blocks/`
**Config:** `blocks/*.ts` | **Components:** `blocks/components/*.tsx`

| Blok | Layouts/Styles | Beschrijving | Shared equivalent? |
|------|---------------|-------------|-------------------|
| **ConstructionHero** | 2-kolom (vast) | Hero met `{highlight}` syntax, floating badges, avatar trust element, emoji/afbeelding | Hero (uitgebreider) |
| **CTABanner** | `gradient`, `solid`, `outlined`, `image` + size `small`/`medium`/`large` + alignment | CTA banner met trust elements (checkmark/star/trophy/lock/lightning), meerdere buttons, badge | CTA (veel meer opties) |
| **ProjectsGrid** | 2, 3, 4 kolommen | Server component: haalt construction-projects op. Source: auto, featured, category, manual. Filter buttons, CTA button | Geen |
| **ReviewsGrid** | 2, 3 kolommen + `cards`/`quotes`/`compact` | Server component: haalt construction-reviews op. Gemiddelde rating berekening + display. Source: featured, auto, manual | TestimonialsBlock (met rating) |
| **ServicesGrid** | 2, 3, 4 kolommen | Server component: haalt construction-services op. Sort by `sortOrder`. Source: auto, manual | Services (andere collectie) |
| **StatsBar** | `default`/`accent`/`dark`/`transparent` + `horizontal`/`grid` | 2-5 stats met iconen (construction/star/users/trophy/chart/check/target/briefcase), dividers | Stats (meer opties) |

---

## Vergelijking: Overlappende blokken

| Functie | Shared | Construction | Verschil |
|---------|--------|-------------|----------|
| **Hero** | Hero (3 layouts) | ConstructionHero | Construction: `{highlight}` syntax, floating badges, avatar stack, emoji fallback |
| **CTA** | CTA (2 variants) + CallToAction | CTABanner | Construction: 4 achtergrondstijlen, trust elements, badge, size opties |
| **Diensten** | Services (6 grids) | ServicesGrid | Construction: fetcht uit `construction-services`, sortOrder |
| **Reviews** | TestimonialsBlock (3 layouts) | ReviewsGrid | Construction: gemiddelde rating, `cards`/`quotes`/`compact`, fetcht uit `construction-reviews` |
| **Stats** | Stats (3 grids) | StatsBar | Construction: horizontal layout, 4 achtergrondstijlen, 9 icoon opties, dividers |

---

## Promotie-Analyse: Welke branch-blokken naar shared?

### Kandidaten voor shared (als extra variant)

| Branch blok | Wat het toevoegt aan shared | Aanbeveling |
|------------|---------------------------|-------------|
| **ComparisonTable** (ecommerce) | Generiek vergelijkingstabel - bruikbaar voor ALLE branches (features vergelijken, pakketten, etc.) | **Promoten naar shared** |
| **StatsBar horizontal** (construction) | Horizontal stats layout met dividers en 4 achtergrondstijlen | **Merge in bestaand Stats blok** als `layout: 'horizontal'` |
| **ReviewsGrid gemiddelde rating** (construction) | Gemiddelde rating berekening + display | **Merge in TestimonialsBlock** als optie `showAverageRating` |

### Houden in branch (te veel collection-afhankelijkheid)

| Blok | Reden |
|------|-------|
| ProductGrid, CategoryGrid, ProductEmbed, QuickOrder | Volledig e-commerce specifiek (prijzen, voorraad, winkelwagen, SKU lookup) |
| ProjectsGrid, ServicesGrid | Fetchen uit branch-specifieke collections (`construction-projects`, `construction-services`) |
| ConstructionHero | Veel construction-specifieke logica (floating badges met posities, `{highlight}` parsing) |
| CTABanner | Complexe variant matrix (4 stijlen x 3 sizes x 2 alignments), trust elements zijn niche |

### Inspiratie voor shared uitbreidingen

Features uit branch-blokken die waardevol zijn voor het shared Hero/CTA blok:

| Feature | Bron | Toepassing in shared |
|---------|------|---------------------|
| `{highlight}text{/highlight}` syntax | ConstructionHero | Hero: inline text highlighting naast titleAccent |
| Trust element (avatar stack) | ConstructionHero | Hero: social proof element |
| Achtergrondstijl selector | CTABanner | CTA: `gradient`/`solid`/`outlined`/`image` als extra variant |
| Gemiddelde rating display | ReviewsGrid | TestimonialsBlock: automatische rating berekening |
| Horizontal layout met dividers | StatsBar | Stats: `layout: 'horizontal'` variant |

---

## Branches zonder eigen blokken

| Branch | Blokken | Reden |
|--------|---------|-------|
| beauty | 0 | Gebruikt shared blocks + eigen collections (services, stylists, bookings) |
| content | 0 | Gebruikt shared blocks (BlogPreview, FAQ, Testimonials) |
| horeca | 0 | Gebruikt shared blocks + eigen collections (menu items, reserveringen) |
| hospitality | 0 | Gebruikt shared blocks + eigen collections (treatments, practitioners) |
| marketplace | 0 | Gebruikt shared blocks + eigen collections (vendors, workshops) |

Deze branches hebben wel **eigen collections** maar geen **eigen page blocks**. Ze gebruiken de 25 shared blocks voor hun pagina-opbouw.

---

## Aanbeveling: Hybride aanpak

1. **Promoot ComparisonTable** naar `shared/blocks/` — generiek bruikbaar voor alle branches
2. **Breid Stats uit** met horizontal layout en achtergrondstijlen (inspiratie van StatsBar)
3. **Breid TestimonialsBlock uit** met gemiddelde rating optie (inspiratie van ReviewsGrid)
4. **Houd branch-specifieke blokken** die afhangen van branch-collections waar ze zijn
5. **Gebruik shared block features** (zoals `titleAccent`) als inspiratie voor Hero uitbreiding

Dit geeft het beste van beide werelden: generieke functionaliteit in shared, specialistische functionaliteit in branches.
