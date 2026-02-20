# Header — Master Implementatieplan

> Analyse van de header uit `docs/design/voorbeelden/plastimed-homepage-concept.html` vs. de bestaande header-implementatie.
> Doel: de header uit het concept 1:1 realiseren, volledig configureerbaar vanuit de admin.

---

## Concept Header Overzicht

Het concept heeft **3 lagen** boven de pagina-content:

```
┌─────────────────────────────────────────────────────────────────────┐
│ TOPBAR  — navy bg, USPs links, actie-links rechts                  │
├─────────────────────────────────────────────────────────────────────┤
│ HEADER  — wit, logo + zoekbalk + actie-buttons (tel/wishlist/cart)  │
├─────────────────────────────────────────────────────────────────────┤
│ NAV BAR — wit, categorie-items met icons, "Aanbiedingen" highlight │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Laag 1: TopBar — BESTAAND, WERKT

**Concept:** Navy achtergrond, links 3 USPs met icons, rechts 2 actie-links.
**Bestaand systeem:** `Header.ts` Tab 1 (TopBar USPs) + `PlastimedTopBar` component.

### Wat er is
- `topBar.enabled` (checkbox) ✅
- `topBar.backgroundColor` / `textColor` (hex) ✅
- `topBar.leftMessages` array (icon + text + link) ✅
- `topBar.rightLinks` array (label + link) ✅

### Concept vs. huidige staat

| Feature | Concept | Huidig | Status |
|---------|---------|--------|--------|
| Navy achtergrond | `#0A1628` | Configureerbaar via `backgroundColor` | ✅ Klaar |
| USP berichten links | 3 items met emoji + tekst | `leftMessages` array | ✅ Klaar |
| Actie-links rechts | "Klant worden", "Help & Contact" | `rightLinks` array | ✅ Klaar |
| Admin aan/uit | Ja | `topBar.enabled` checkbox | ✅ Klaar |
| Responsive | Verborgen op mobile / compact | Niet geïmplementeerd | ❌ Moet |

### Benodigde wijzigingen
**Component (`Plastimed/TopBar.tsx`):**
- Mobile responsive: verberg op `sm:` of toon als horizontale scroll
- Geen config wijzigingen nodig

**Impact:** KLEIN
**Prioriteit:** LAAG

---

## Laag 2: Header — BESTAAND, AANPASSINGEN NODIG

**Concept:** Wit, 3-kolom layout: logo links, zoekbalk midden, actie-buttons rechts.
**Bestaand systeem:** `Header.ts` Tabs 3-4 + `DynamicHeader` component.

### Wat er is
| Feature | Admin veld | Component | Status |
|---------|-----------|-----------|--------|
| Logo (afbeelding) | `logoOverride` (upload) | ✅ Toont afbeelding | ✅ Klaar |
| Logo (fallback letter) | — | ✅ Eerste letter in gekleurd vierkant | ✅ Klaar |
| Site naam naast logo | `siteNameOverride` | ✅ Toont als tekst | ⚠️ Deels |
| Zoekbalk | `enableSearch` + `searchPlaceholder` | ✅ Input veld | ⚠️ Deels |
| Telefoon button | `showPhone` | ✅ Toont telefoonnummer | ✅ Klaar |
| Wishlist button | `showWishlist` | ✅ Hartje icon | ✅ Klaar |
| Account button | `showAccount` | ✅ Persoon icon | ✅ Klaar |
| Cart button + badge | `showCart` | ✅ Winkelwagen + badge | ⚠️ Badge hardcoded 0 |
| Custom buttons | `customButtons` array | ✅ Tot 3 extra knoppen | ✅ Klaar |
| Sticky header | `stickyHeader` | ✅ `sticky top-0` | ✅ Klaar |
| Shadow | `showShadow` | ✅ `shadow-sm` | ✅ Klaar |

### Concept vs. huidige staat — Gaps

#### 2a. Site naam met accent kleur
**Concept:** `plasti<span style="color: teal">med</span>` — deel van de naam in accent kleur.
**Huidig:** Hele naam als plain tekst.

**Benodigde config:**
```typescript
// Header.ts — Tab 3: Branding & Logo, toevoegen:
{
  name: 'siteNameAccent',
  type: 'text',
  label: 'Accent deel van sitenaam',
  admin: {
    description: 'Dit deel wordt in de primaire kleur getoond (bijv. "med" in "plastimed")',
    condition: (data) => !!data.siteNameOverride,
  },
}
```

**Component wijziging:**
```tsx
// DynamicHeader.tsx — site naam renderen:
// Huidige code:
<div className="text-[22px] font-extrabold">{siteName}</div>

// Nieuwe code:
{siteNameAccent && siteName.includes(siteNameAccent) ? (
  <div className="text-[22px] font-extrabold text-gray-900 tracking-tight">
    {siteName.split(siteNameAccent)[0]}
    <span className="text-primary">{siteNameAccent}</span>
    {siteName.split(siteNameAccent).slice(1).join(siteNameAccent)}
  </div>
) : (
  <div className="text-[22px] font-extrabold text-gray-900">{siteName}</div>
)}
```

#### 2b. Zoekbalk functioneel maken
**Concept:** Zoekbalk met placeholder "Zoek op product, merk of artikelnummer...".
**Huidig:** Alleen een input veld zonder functionaliteit (geen submit, geen autocomplete, geen routing).

**Benodigde wijzigingen (Component `DynamicHeader.tsx`):**
- Bij submit: navigeren naar `/shop?q={zoekterm}`
- Optioneel: autocomplete dropdown (kan later, is een apart verhaal)
- Form tag toevoegen rond input voor keyboard submit

```tsx
<form action="/shop" method="GET" className="flex-1 max-w-[560px] mx-auto relative">
  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
  <input
    name="q"
    type="text"
    placeholder={searchPlaceholder}
    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl ..."
  />
</form>
```

#### 2c. Cart badge koppelen aan echte data
**Huidig:** `const [cartCount] = useState(0)` — hardcoded 0.
**Nodig:** Uitlezen uit cart context/cookie/localStorage.

Dit is afhankelijk van de cart-implementatie en valt buiten scope van de header zelf, maar het component moet voorbereid zijn:
```tsx
// TODO: Replace with real cart context
// const { cartCount } = useCart()
```

#### 2d. Mobile menu (hamburger)
**Concept HTML toont geen mobile variant**, maar de header MOET responsive zijn.
**Huidig:** Er bestaat een `MobileMenu` component (`src/components/Header/MobileMenu.tsx`) met Shadcn Sheet.
**Nodig:** `DynamicHeader` heeft GEEN mobile menu — alleen `MobileMenu` van het oude Header component.

**Benodigde wijziging:**
- Hamburger menu button toevoegen aan `DynamicHeader` (zichtbaar op `md:hidden`)
- Sheet/drawer met menu items, account links, zoekbalk
- Actie-buttons verbergen op mobile behalve cart

**Benodigde admin velden:** Geen — gebruikt bestaande navigatie-items uit Tab 5.

### Samenvatting Laag 2

| Wijziging | Type | Impact |
|-----------|------|--------|
| Site naam accent | Config + Component | KLEIN |
| Zoekbalk functioneel | Component | KLEIN |
| Cart badge koppelen | Component | KLEIN (afhankelijk van cart) |
| Mobile menu | Component | MIDDEL |

---

## Laag 3: Navigation Bar — GROOTSTE WIJZIGING

**Concept:** Horizontale balk met **product categorie-iconen** als navigatie-items.
**Bestaand systeem:** `Header.ts` Tab 5 + `DynamicNav` component.

### Het fundamentele probleem

De huidige navigatie is **statisch/handmatig**:
- Admin voegt menu-items 1 voor 1 toe in `Header > Navigatie Menu`
- Elk item linkt naar een `page` of `external URL`
- Submenu-items zijn ook handmatig (max 6 per item)
- **Geen relatie met product-categorieën**

Het concept toont een **categorie-gedreven** navigatie:
- 9 product categorieën met emoji-icons
- 1 speciale "Aanbiedingen" link (rood/coral gestyled)
- Items zijn afgeleid van `product-categories` collection
- Subcategorieën moeten dynamisch laden vanuit de category tree

### Hoe Layered Navigation werkt

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 🩺 Diagnostiek │ 🏥 EHBO │ 💉 Injectie │ ✂️ Instrumenten │ ... │ 🔥 Deals │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌── Mega Menu (hover/click) ──────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  Subcategorieën          Populaire producten     Promo banner        │    │
│  │  ┌─────────────┐        ┌──────────────────┐    ┌──────────────┐    │    │
│  │  │ Stethoscopen│        │ [product card]   │    │ 20% korting  │    │    │
│  │  │ Bloeddruk   │        │ [product card]   │    │ op diagnostk │    │    │
│  │  │ Otoscopen   │        │ [product card]   │    │ [CTA button] │    │    │
│  │  │ Thermometers│        └──────────────────┘    └──────────────┘    │    │
│  │  │ Weegschalen │                                                     │    │
│  │  └─────────────┘                                                     │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Data flow:**
1. Categorieën met `parent: null` (level 0) verschijnen als **hoofditems** in de nav bar
2. Categorieën met `parent: <id>` verschijnen als **subcategorieën** in het mega menu
3. Het mega menu laadt:
   - **Subcategorieën** (level 1 children van de hover-categorie)
   - **Populaire producten** uit die categorie (optioneel)
   - **Promo banner** per categorie (optioneel, via admin)
4. Klik op hoofditem → gaat naar `/shop?categorie={slug}` (of `/categorie/{slug}`)
5. Klik op subcategorie → gaat naar `/shop?categorie={slug}`

### Benodigde wijzigingen

#### 3a. ProductCategories collection — icon veld toevoegen

**Bestand:** `src/collections/shop/ProductCategories.ts`

```typescript
// Toe te voegen velden:
{
  name: 'icon',
  type: 'text',
  label: 'Icon',
  admin: {
    description: 'Emoji of Lucide icon naam (bijv. 🩺 of "Stethoscope")',
    placeholder: '🩺',
  },
},
{
  name: 'showInNavigation',
  type: 'checkbox',
  label: 'Tonen in navigatie',
  defaultValue: true,
  admin: {
    description: 'Toon deze categorie in de hoofdnavigatie balk',
  },
},
{
  name: 'navigationOrder',
  type: 'number',
  label: 'Navigatie volgorde',
  defaultValue: 0,
  admin: {
    description: 'Volgorde in de navigatie balk (lager = eerder)',
  },
},
```

#### 3b. Header.ts — Navigatie tab uitbreiden

**Bestand:** `src/globals/Header.ts` — Tab 5 "Navigatie Menu"

De navigatie moet twee modi ondersteunen:
1. **Handmatig** (huidig) — admin kiest zelf welke links
2. **Categorie-gedreven** (nieuw) — automatisch op basis van product-categorieën

```typescript
// Tab 5 herschrijven:
{
  label: 'Navigatie Menu',
  description: 'Hoofdmenu configuratie',
  fields: [
    {
      name: 'navigation',
      type: 'group',
      fields: [
        // ── Navigatie modus ──
        {
          name: 'mode',
          type: 'select',
          label: 'Navigatie modus',
          defaultValue: 'manual',
          options: [
            { label: 'Handmatig (zelf menu items beheren)', value: 'manual' },
            { label: 'Categorie-gedreven (automatisch uit product categorieën)', value: 'categories' },
            { label: 'Hybride (categorieën + extra items)', value: 'hybrid' },
          ],
          admin: {
            description: 'Bepaalt hoe het navigatiemenu wordt opgebouwd',
          },
        },

        // ── Categorie-modus instellingen ──
        {
          name: 'categorySettings',
          type: 'group',
          label: 'Categorie navigatie instellingen',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mode === 'categories' || siblingData?.mode === 'hybrid',
          },
          fields: [
            {
              name: 'showIcons',
              type: 'checkbox',
              label: 'Toon categorie icons',
              defaultValue: true,
            },
            {
              name: 'showProductCount',
              type: 'checkbox',
              label: 'Toon product aantal in mega menu',
              defaultValue: true,
            },
            {
              name: 'megaMenuStyle',
              type: 'select',
              label: 'Mega menu stijl',
              defaultValue: 'subcategories',
              options: [
                { label: 'Alleen subcategorieën', value: 'subcategories' },
                { label: 'Subcategorieën + populaire producten', value: 'with-products' },
                { label: 'Volledig (subcategorieën + producten + promo)', value: 'full' },
              ],
            },
            {
              name: 'maxItems',
              type: 'number',
              label: 'Max aantal categorie items',
              defaultValue: 10,
              admin: {
                description: 'Maximaal aantal categorieën in de nav bar',
              },
            },
          ],
        },

        // ── Speciale items (altijd zichtbaar) ──
        {
          name: 'specialItems',
          type: 'array',
          label: 'Speciale navigatie items',
          maxRows: 3,
          admin: {
            description: 'Extra items zoals "Aanbiedingen", "Nieuw", etc.',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
              admin: { placeholder: 'Aanbiedingen' },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon',
              admin: { placeholder: '🔥' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              label: 'Link',
              admin: { placeholder: '/shop?badge=sale' },
            },
            {
              name: 'highlight',
              type: 'checkbox',
              label: 'Highlight (opvallende kleur)',
              defaultValue: false,
              admin: {
                description: 'Toont in coral/rood kleur',
              },
            },
          ],
        },

        // ── Handmatige items (bestaand, voor manual/hybrid modus) ──
        {
          name: 'items',
          type: 'array',
          label: 'Handmatige menu items',
          maxRows: 8,
          admin: {
            condition: (data, siblingData) =>
              siblingData?.mode === 'manual' || siblingData?.mode === 'hybrid',
          },
          fields: [
            // ... bestaande velden (label, type, page, url, children)
          ],
        },

        // ── CTA knop (bestaand) ──
        {
          name: 'ctaButton',
          type: 'group',
          // ... bestaande velden
        },
      ],
    },
  ],
},
```

#### 3c. DynamicNav component — volledig herschrijven

**Bestand:** `src/components/DynamicNav.tsx`

De huidige component (88 regels) moet worden uitgebreid tot een volwaardig navigatiesysteem:

**Nieuwe architectuur:**

```
DynamicNav (server component)
├── Fetch categorieën als mode=categories/hybrid
├── NavBar (client component)
│   ├── CategoryNavItem × N (met hover state)
│   │   └── MegaMenu (verschijnt bij hover)
│   │       ├── SubcategoryList
│   │       ├── PopularProducts (optioneel)
│   │       └── PromoBanner (optioneel)
│   ├── SpecialNavItem × N ("Aanbiedingen")
│   └── ManualNavItem × N (als hybrid/manual)
└── MobileNavDrawer (hamburger menu)
```

**Server-side data fetching:**
```typescript
// DynamicNav.tsx (server component)
export async function DynamicNav({ navigation }: Props) {
  let categories = []

  if (navigation?.mode === 'categories' || navigation?.mode === 'hybrid') {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
    const res = await fetch(`${baseUrl}/api/product-categories?where[parent][exists]=false&where[showInNavigation][equals]=true&sort=navigationOrder&limit=${navigation.categorySettings?.maxItems || 10}&depth=1`, {
      next: { revalidate: 300 }
    })
    if (res.ok) {
      const data = await res.json()
      categories = data.docs
    }
  }

  return <NavBar navigation={navigation} categories={categories} />
}
```

**Client-side interactie:**
```typescript
// NavBar.tsx (client component)
'use client'

function NavBar({ navigation, categories }) {
  const [activeCategory, setActiveCategory] = useState(null)
  const [megaMenuData, setMegaMenuData] = useState(null)

  // Bij hover: fetch subcategorieën + producten
  const handleCategoryHover = async (categoryId) => {
    setActiveCategory(categoryId)

    // Fetch children van deze categorie
    const res = await fetch(`/api/product-categories?where[parent][equals]=${categoryId}&sort=order`)
    const data = await res.json()
    setMegaMenuData({
      subcategories: data.docs,
      // Optioneel: fetch populaire producten
    })
  }

  return (
    <nav className="bg-white border-b relative">
      <div className="max-w-7xl mx-auto px-6 flex items-center">
        {/* Categorie items */}
        {categories.map(cat => (
          <CategoryNavItem
            key={cat.id}
            category={cat}
            isActive={activeCategory === cat.id}
            onHover={() => handleCategoryHover(cat.id)}
            onLeave={() => setActiveCategory(null)}
            showIcon={navigation.categorySettings?.showIcons}
          />
        ))}

        {/* Speciale items (Aanbiedingen, etc.) */}
        {navigation.specialItems?.map(item => (
          <SpecialNavItem key={item.label} item={item} />
        ))}
      </div>

      {/* Mega Menu overlay */}
      {activeCategory && megaMenuData && (
        <MegaMenu
          data={megaMenuData}
          style={navigation.categorySettings?.megaMenuStyle}
          onClose={() => setActiveCategory(null)}
        />
      )}
    </nav>
  )
}
```

#### 3d. Mega Menu component — NIEUW

**Nieuw bestand:** `src/components/MegaMenu.tsx`

```
┌────────────────────────────────────────────────────────────────┐
│ Mega Menu                                                      │
│                                                                │
│ ┌──────────────┐  ┌──────────────────────┐  ┌──────────────┐  │
│ │ Subcategorieën│  │ Populaire producten  │  │ Promo        │  │
│ │              │  │                      │  │              │  │
│ │ • Stethoscopen│  │ [img] Product 1      │  │ Banner img   │  │
│ │ • Bloeddruk  │  │ [img] Product 2      │  │ "20% korting"│  │
│ │ • Otoscopen  │  │ [img] Product 3      │  │ [CTA knop]   │  │
│ │ • Thermometer│  │                      │  │              │  │
│ │ • Weegschalen│  │                      │  │              │  │
│ │              │  │                      │  │              │  │
│ │ Alles bekijken→ │                      │  │              │  │
│ └──────────────┘  └──────────────────────┘  └──────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**3 stijlen (instelbaar via admin):**

| Stijl | Kolommen | Inhoud |
|-------|----------|--------|
| `subcategories` | 1 kolom | Alleen subcategorieën als links |
| `with-products` | 2 kolommen | Subcategorieën + populaire producten |
| `full` | 3 kolommen | Subcategorieën + producten + promo banner |

**Promo banner per categorie (optioneel):**
Hiervoor een nieuw veld toevoegen aan ProductCategories:

```typescript
// ProductCategories.ts — optioneel, voor mega menu promo:
{
  name: 'promoBanner',
  type: 'group',
  label: 'Mega Menu Promo Banner',
  admin: { description: 'Optionele promo banner in het mega menu' },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'title', type: 'text' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'link', type: 'text' },
  ],
}
```

---

## Admin Feature Toggles — Overzicht

Alle header-functies die via de admin aan/uit gezet moeten kunnen worden:

### Bestaande toggles (werken al)

| Feature | Admin pad | Veldtype |
|---------|----------|----------|
| TopBar tonen | `Header > TopBar USPs > topBar.enabled` | checkbox |
| Alert Bar tonen | `Header > Alert Bar > alertBar.enabled` | checkbox |
| Alert Bar wegklikbaar | `Header > Alert Bar > alertBar.dismissible` | checkbox |
| Alert Bar planning | `Header > Alert Bar > alertBar.schedule.useSchedule` | checkbox |
| Zoekbalk tonen | `Header > Search & Buttons > enableSearch` | checkbox |
| Telefoon button | `Header > Search & Buttons > showPhone` | checkbox |
| Wishlist button | `Header > Search & Buttons > showWishlist` | checkbox |
| Account button | `Header > Search & Buttons > showAccount` | checkbox |
| Cart button | `Header > Search & Buttons > showCart` | checkbox |
| Sticky header | `Header > Behavior > stickyHeader` | checkbox |
| Shadow | `Header > Behavior > showShadow` | checkbox |
| CTA knop in nav | `Header > Navigatie > ctaButton.show` | checkbox |

### Nieuwe toggles (toe te voegen)

| Feature | Admin pad | Veldtype | Doel |
|---------|----------|----------|------|
| Navigatie modus | `Header > Navigatie > navigation.mode` | select | manual / categories / hybrid |
| Categorie icons in nav | `Header > Navigatie > categorySettings.showIcons` | checkbox | Icons bij nav items |
| Product count in mega menu | `Header > Navigatie > categorySettings.showProductCount` | checkbox | "320+ producten" |
| Mega menu stijl | `Header > Navigatie > categorySettings.megaMenuStyle` | select | Hoe uitgebreid het mega menu is |
| Max categorie items | `Header > Navigatie > categorySettings.maxItems` | number | Limiet nav items |
| Categorie in nav tonen | `Product Categorieën > showInNavigation` | checkbox | Per categorie aan/uit |

---

## Layered Navigation — Technisch Ontwerp

### Wat is layered navigation?

Layered navigation (ook wel "faceted navigation") betekent dat de navigatie meerdere lagen heeft:

1. **Laag 1 — Hoofdcategorieën** (nav bar): Diagnostiek, EHBO, Injectiemateriaal...
2. **Laag 2 — Subcategorieën** (mega menu): Stethoscopen, Bloeddrukmeters, Otoscopen...
3. **Laag 3 — Filters** (shop pagina): Merk, prijs, voorraad...

### Data model

```
product-categories tabel:
┌────┬────────────────────┬────────┬───────┬──────┬──────────────────┐
│ id │ name               │ parent │ level │ icon │ showInNavigation │
├────┼────────────────────┼────────┼───────┼──────┼──────────────────┤
│ 1  │ Diagnostiek        │ null   │ 0     │ 🩺   │ true             │
│ 2  │ EHBO               │ null   │ 0     │ 🏥   │ true             │
│ 3  │ Injectiemateriaal  │ null   │ 0     │ 💉   │ true             │
│ 4  │ Stethoscopen       │ 1      │ 1     │      │ false            │
│ 5  │ Bloeddrukmeters    │ 1      │ 1     │      │ false            │
│ 6  │ Otoscopen          │ 1      │ 1     │      │ false            │
│ 7  │ Naalden            │ 3      │ 1     │      │ false            │
│ 8  │ Spuiten            │ 3      │ 1     │      │ false            │
└────┴────────────────────┴────────┴───────┴──────┴──────────────────┘
```

### API calls

**Nav bar laden (server-side, gecached 5 min):**
```
GET /api/product-categories?where[parent][exists]=false&where[showInNavigation][equals]=true&sort=navigationOrder&limit=10
```

**Mega menu laden (client-side, on hover):**
```
GET /api/product-categories?where[parent][equals]={categoryId}&where[visible][equals]=true&sort=order
```

**Populaire producten laden (optioneel, client-side):**
```
GET /api/products?where[categories][in]={categoryId}&where[featured][equals]=true&limit=3&depth=1
```

### URL structuur

| Actie | URL |
|-------|-----|
| Klik op "Diagnostiek" in nav bar | `/shop?categorie=diagnostiek` of `/categorie/diagnostiek` |
| Klik op "Stethoscopen" in mega menu | `/shop?categorie=stethoscopen` |
| Klik op "Aanbiedingen" special item | `/shop?badge=sale` |

---

## Bestanden Overzicht

### Te wijzigen bestanden

| Bestand | Wijziging |
|---------|-----------|
| `src/globals/Header.ts` | Tab 5 uitbreiden met navigatie modi, categorySettings, specialItems |
| `src/collections/shop/ProductCategories.ts` | Velden toevoegen: `icon`, `showInNavigation`, `navigationOrder`, `promoBanner` |
| `src/components/DynamicNav.tsx` | Herschrijven: category-driven nav + mega menu support |
| `src/components/DynamicHeader.tsx` | Site naam accent, zoekbalk form, mobile menu button |
| `src/components/Plastimed/TopBar.tsx` | Mobile responsive |

### Nieuwe bestanden

| Bestand | Doel |
|---------|------|
| `src/components/NavBar.tsx` | Client component: nav items + hover state + mega menu trigger |
| `src/components/MegaMenu.tsx` | Mega menu overlay met subcategorieën, producten, promo |
| `src/components/MobileNavDrawer.tsx` | Hamburger menu voor mobile (vervangt/vult MobileMenu aan) |

---

## Implementatievolgorde

### Fase 1 — Fundament (config + data model)
1. `ProductCategories.ts` — velden toevoegen: `icon`, `showInNavigation`, `navigationOrder`
2. `Header.ts` — Tab 5 uitbreiden met `mode`, `categorySettings`, `specialItems`
3. `Header.ts` — Tab 3 uitbreiden met `siteNameAccent`
4. Types regenereren: `npm run generate:types`

### Fase 2 — Navigatie bar (categorie-gedreven)
5. `DynamicNav.tsx` — herschrijven als server component die categorieën fetcht
6. `NavBar.tsx` — nieuw client component met hover states
7. Speciale items renderen ("Aanbiedingen" met highlight styling)

### Fase 3 — Mega Menu
8. `MegaMenu.tsx` — nieuw component met 3 stijl-varianten
9. Subcategorieën laden bij hover (client-side fetch)
10. Populaire producten laden (optioneel, afhankelijk van `megaMenuStyle`)
11. Promo banner support (optioneel)

### Fase 4 — Header verbeteringen
12. `DynamicHeader.tsx` — site naam accent
13. `DynamicHeader.tsx` — zoekbalk functioneel (form + submit naar /shop)
14. `DynamicHeader.tsx` — mobile menu button + drawer

### Fase 5 — Polish
15. `TopBar.tsx` — mobile responsive
16. Keyboard navigatie voor mega menu (accessibility)
17. Animations (fade in/out mega menu)
18. Performance: prefetch subcategorieën bij hover intent

---

## Database Impact

| Tabel | Wijziging | Type |
|-------|-----------|------|
| `product_categories` | `icon` varchar kolom | `ALTER TABLE ADD COLUMN` |
| `product_categories` | `show_in_navigation` boolean kolom | `ALTER TABLE ADD COLUMN` |
| `product_categories` | `navigation_order` integer kolom | `ALTER TABLE ADD COLUMN` |
| `product_categories` | `promo_banner_*` kolommen (optioneel) | `ALTER TABLE ADD COLUMN` |
| `header` (global) | Nieuwe velden in JSON | Automatisch bij restart |

**Let op:** `product-categories` is een collection (eigen tabel), dus nieuwe velden vereisen **database migratie** (anders dan blocks die als JSON worden opgeslagen). Payload handelt dit af via `payload migrate:create` + `payload migrate`.

---

## Samenvatting

| Onderdeel | Status | Werk |
|-----------|--------|------|
| **TopBar** | 95% klaar | Alleen mobile responsive |
| **Alert Bar** | 100% klaar | Geen wijzigingen nodig |
| **Header (logo, search, buttons)** | 80% klaar | Accent naam, zoek-submit, mobile menu |
| **Nav Bar** | 30% klaar | Herschrijven voor categorie-modus |
| **Mega Menu** | 0% | Volledig nieuw bouwen |
| **Layered Navigation data** | 60% | Icon/nav velden toevoegen aan categorieën |

**Totaal: 5 bestaande bestanden wijzigen + 3 nieuwe bestanden**
