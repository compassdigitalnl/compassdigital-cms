# 📁 Folder Structuur Uitleg - E-commerce

**Datum:** 25 Februari 2026
**Doel:** Begrijpen hoe `/app` en `/branches/ecommerce` samenwerken

---

## 🤔 De Simpele Uitleg

Stel je voor dat je een website bouwt met LEGO:

- **`/app` folder** = De FUNDERING (waar bezoekers naartoe gaan, zoals `/winkelwagen` of `/afrekenen`)
- **`/branches` folder** = De LEGO BLOKKEN (herbruikbare onderdelen die je overal kunt gebruiken)

**Voorbeeld:**
- Je gaat naar `jouwsite.nl/cart` → Next.js kijkt in `/app/(ecommerce)/cart/page.tsx`
- Die pagina pakt een LEGO blok → `/branches/ecommerce/templates/cart/CartTemplate1.tsx`
- Dat LEGO blok bestaat uit kleinere blokjes → `/branches/ecommerce/components/ui/CartLineItem.tsx`

---

## 📂 Folder Structuur Overzicht

```
payload-app/src/
│
├── app/                              ← NEXT.JS ROUTES (waar bezoekers naartoe gaan)
│   ├── (ecommerce)/                  ← E-commerce routes groep
│   │   ├── cart/
│   │   │   ├── page.tsx              ← Route: /cart
│   │   │   └── CartPageClient.tsx    ← Client-side wrapper
│   │   ├── checkout/
│   │   │   └── page.tsx              ← Route: /checkout
│   │   ├── shop/
│   │   │   └── page.tsx              ← Route: /shop
│   │   └── account/
│   │       └── page.tsx              ← Route: /account
│   │
│   └── (shared)/                     ← Gedeelde routes (docs, search, etc.)
│
└── branches/                         ← HERBRUIKBARE COMPONENTEN (LEGO blokken)
    ├── ecommerce/                    ← E-commerce specifieke componenten
    │   ├── templates/                ← HELE PAGINA TEMPLATES
    │   │   ├── cart/
    │   │   │   ├── CartTemplate1.tsx      ← Volledige winkelwagen pagina (variant 1)
    │   │   │   └── CartTemplate2.tsx      ← Volledige winkelwagen pagina (variant 2)
    │   │   ├── checkout/
    │   │   │   ├── CheckoutTemplate1.tsx  ← Volledige checkout pagina (variant 1)
    │   │   │   └── CheckoutTemplate2.tsx  ← Volledige checkout pagina (variant 2)
    │   │   └── products/
    │   │       ├── ProductTemplate1/      ← SUBMAPPEN (complex!)
    │   │       │   ├── index.tsx          ← Product pagina (75 KB - heel groot!)
    │   │       │   └── GroupedProductTable.tsx
    │   │       ├── ProductTemplate2/
    │   │       └── ProductTemplate3/
    │   │
    │   └── components/               ← KLEINE COMPONENTEN (LEGO steentjes)
    │       ├── ui/                   ← Algemene UI componenten
    │       │   ├── CartLineItem/     ← 1 product regel in winkelwagen
    │       │   ├── OrderSummary/     ← Bestellings samenvatting
    │       │   ├── MiniCartFlyout/   ← Mini winkelwagen popup
    │       │   └── FreeShippingProgress/  ← "€10 tot gratis verzending"
    │       ├── products/             ← Product-specifieke componenten
    │       │   ├── ProductCard/      ← Product kaartje in lijst
    │       │   ├── ProductGallery/   ← Foto galerij (zoom, lightbox)
    │       │   ├── ProductMeta/      ← Prijs, rating, merk
    │       │   ├── ProductTabs/      ← Tabs (beschrijving, specs, reviews)
    │       │   └── ProductActions/   ← "In winkelwagen" knop
    │       ├── checkout/             ← Checkout componenten
    │       └── account/              ← Account componenten
    │
    └── shared/                       ← GEDEELD TUSSEN ALLE BRANCHES
        └── components/
            ├── ui/                   ← Universele UI (knoppen, modals, etc.)
            ├── layout/               ← Header, Footer, Breadcrumbs
            └── features/             ← A/B testing, Search, Newsletter
```

---

## 🔄 Hoe Werkt De Flow? (Voorbeeld: Winkelwagen)

### **Stap 1: Bezoeker gaat naar `/cart`**
```
Bezoeker klikt op "Winkelwagen" knop
    ↓
Next.js opent: /app/(ecommerce)/cart/page.tsx
```

### **Stap 2: Server haalt data op**
```typescript
// /app/(ecommerce)/cart/page.tsx (Server Component)
export default async function CartPage() {
  // 1. Haal template instelling op uit CMS
  const settings = await payload.findGlobal({ slug: 'settings' })
  const defaultTemplate = settings.ecommerce.defaultCartTemplate // "template1"

  // 2. Geef door aan client component
  return <CartPageClient defaultTemplate={defaultTemplate} />
}
```

### **Stap 3: Client kiest juiste template (A/B testing)**
```typescript
// /app/(ecommerce)/cart/CartPageClient.tsx (Client Component)
export default function CartPageClient({ defaultTemplate }) {
  // A/B test: helft krijgt template1, helft template2
  const { variant } = useABTest('cart')

  // Render template1 OF template2
  if (variant === 'template2') {
    return <CartTemplate2 />  // ← Import uit /branches/
  }
  return <CartTemplate1 />    // ← Import uit /branches/
}
```

### **Stap 4: Template gebruikt kleine componenten**
```typescript
// /branches/ecommerce/templates/cart/CartTemplate1.tsx
export default function CartTemplate1() {
  const { items } = useCart()  // ← Context uit /branches/ecommerce/contexts/

  return (
    <div>
      <h1>Winkelwagen</h1>

      {/* Gebruik kleine componenten uit /branches/ecommerce/components/ */}
      {items.map(item => (
        <CartLineItem key={item.id} item={item} />  ← Component
      ))}

      <FreeShippingProgress total={total} />        ← Component
      <OrderSummary items={items} />                ← Component
    </div>
  )
}
```

---

## ❓ Waarom Product Templates In Submappen?

### **Product Templates = COMPLEX ⚠️**
```
templates/products/ProductTemplate1/
├── index.tsx                    ← 75 KB (!!) - heel groot bestand
└── GroupedProductTable.tsx      ← Extra component (alleen voor grouped products)
```

**Waarom subfolder?**
- Product pagina's zijn VEEL complexer (75-83 KB vs 6-24 KB)
- Hebben extra sub-componenten nodig (zoals `GroupedProductTable.tsx`)
- Beter te organiseren in eigen mapje

### **Cart/Checkout Templates = SIMPEL ✅**
```
templates/cart/
├── CartTemplate1.tsx            ← 8 KB - klein bestand
└── CartTemplate2.tsx            ← 6 KB - klein bestand
```

**Waarom geen subfolder?**
- Zijn veel simpeler (6-24 KB)
- Geen extra sub-componenten (nog niet)
- Flat structuur is overzichtelijker

**Conclusie:** Als cart/checkout templates later groeien en extra componenten krijgen, kun je ze altijd nog naar submappen verplaatsen.

---

## 🎯 Wat Doet Wat? (TL;DR)

| Folder | Wat Doet Het? | Voorbeeld |
|--------|---------------|-----------|
| **`/app/(ecommerce)/`** | Next.js routes - waar bezoekers naartoe gaan | `/cart`, `/checkout`, `/shop` |
| **`/branches/ecommerce/templates/`** | Volledige pagina layouts | `CartTemplate1.tsx` (hele winkelwagen pagina) |
| **`/branches/ecommerce/components/`** | Kleine herbruikbare onderdelen | `CartLineItem` (1 product in lijst) |
| **`/branches/ecommerce/contexts/`** | Gedeelde state (data) | `CartContext` (winkelwagen data) |
| **`/branches/shared/`** | Gedeeld tussen ALLE branches | `Header`, `Footer`, `Button` |

---

## 📊 Status: Wat Is Nieuw? (25 Feb 2026)

### ✅ **VANDAAG TOEGEVOEGD (17:45 - 20:07):**
- `ProductGallery` - Foto galerij met zoom/lightbox
- `ProductMeta` - Prijs, rating, voorraad
- `ProductTabs` - Tabs (beschrijving, specs, reviews)
- `ProductSpecsTable` - Technische specificaties tabel
- `ProductActions` - "In winkelwagen" knop
- `MyAccountTemplate1` - Account pagina
- `AuthTemplate` - Login/Register pagina
- `ShopArchiveTemplate1` - Shop overzicht

### ✅ **EERDER VANDAAG (11:50 - 14:51):**
- `ProductCard`, `ProductBadges`, `StockIndicator`
- `StaffelCalculator`, `ReviewWidget`, `QuickViewModal`

### ✅ **CART/CHECKOUT (13:22 - 13:45):**
- `CartTemplate1`, `CartTemplate2`
- `CheckoutTemplate1`, `CheckoutTemplate2`

### 📊 **TOTAAL STATUS:**
- ✅ **54/72 components klaar (75%!)**
- ⏳ **12 auth components planned** (LoginForm, RegisterForm, etc.)
- ⏳ **6 overige missing** (FilterSidebar, SortDropdown, etc.)

---

## 🔍 Hoe Vind Je Een Component?

### **Scenario 1: Je wilt de winkelwagen pagina aanpassen**
```
1. Start bij de route: /app/(ecommerce)/cart/page.tsx
2. Zie welke template het gebruikt: CartTemplate1.tsx
3. Open: /branches/ecommerce/templates/cart/CartTemplate1.tsx
4. Pas aan wat je wilt!
```

### **Scenario 2: Je wilt het "gratis verzending" balkje aanpassen**
```
1. Zoek component: FreeShippingProgress
2. Ga naar: /branches/ecommerce/components/ui/FreeShippingProgress/
3. Open: Component.tsx
4. Pas aan!
```

### **Scenario 3: Je wilt een product kaartje stylen**
```
1. Component: ProductCard
2. Ga naar: /branches/ecommerce/components/products/ProductCard/
3. Open: Component.tsx
4. Pas styling aan (gebruikt theme variables!)
```

---

## 💡 Pro Tips

### **1. Templates vs Components - Wat Is Het Verschil?**
```
TEMPLATE = Hele pagina
└── Gebruikt meerdere COMPONENTS

COMPONENT = Klein onderdeel
└── Kan in meerdere templates gebruikt worden
```

**Voorbeeld:**
- `CartTemplate1.tsx` = **Template** (hele winkelwagen pagina)
- `CartLineItem.tsx` = **Component** (1 regel in winkelwagen)

### **2. Server vs Client Components**
```
SERVER COMPONENT (in /app/):
- Draait op server
- Kan database queries doen
- Geen 'use client' bovenaan

CLIENT COMPONENT (in /branches/):
- Draait in browser
- Heeft interactiviteit (knoppen, forms, etc.)
- Heeft 'use client' bovenaan
```

### **3. Imports - Waar Import Je Van?**
```typescript
// In /app/ files - import templates
import CartTemplate1 from '@/branches/ecommerce/templates/cart/CartTemplate1'

// In templates - import components
import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem'

// In components - import andere components
import { Button } from '@/branches/shared/components/ui/Button'
```

---

## 🎨 Visuele Flow (Van Groot Naar Klein)

```
🌐 WEBSITE BEZOEKER
    ↓
📍 NEXT.JS ROUTE (/app/cart/)
    ↓
📄 PAGE TEMPLATE (CartTemplate1.tsx)
    ↓
🧩 UI COMPONENTS (CartLineItem, OrderSummary)
    ↓
🎨 PRIMITIEVE COMPONENTS (Button, Input van /shared/)
    ↓
💾 STATE/CONTEXT (CartContext)
```

---

## ✅ Checklist: Is Alles Consistent?

- ✅ **Cart:** `app/cart/` → `branches/templates/cart/` ✅
- ✅ **Checkout:** `app/checkout/` → `branches/templates/checkout/` ✅
- ✅ **Shop:** `app/shop/` → `branches/templates/shop/` ✅
- ✅ **Account:** `app/account/` → `branches/templates/account/` ✅
- ✅ **Products:** Gebruikt components uit `branches/components/products/` ✅

**Conclusie:** Alles is netjes georganiseerd! Geen inconsistenties gevonden.

---

## 🚀 Volgende Stappen (Optioneel)

1. **Auth components toevoegen** (12 stuks - LoginForm, RegisterForm, etc.)
2. **FilterSidebar + SortDropdown** toevoegen (kritiek voor shop)
3. **Blocks refactoring docs updaten** (zijn van gisteren)

---

**Laatste update:** 25 Februari 2026 - 20:30
**Auteur:** Claude
**Status:** ✅ Compleet overzicht
