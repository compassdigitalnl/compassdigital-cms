# 🏥 Plastimed Homepage Setup Guide

**Datum:** 11 Februari 2026
**Status:** ✅ **COMPLETE**

---

## 🎯 Overview

De Plastimed homepage is nu **volledig dynamisch** en wordt gevoed vanuit de Payload CMS. Alle content, stijlen, en data komen uit:
- **TopBarSettings** global (TopBar met USP's)
- **ShopSettings** global (bedrijfsinfo, telefoon, etc.)
- **Pages** collection (de 'home' page met blocks)
- **Categories** collection (navigatie items)

---

## 🚀 Quick Start

### Step 1: Start de dev server
```bash
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app
npm run dev
```

Open: http://localhost:3020

### Step 2: Login in Payload Admin
URL: http://localhost:3020/admin

### Step 3: Configureer de Globals

#### TopBar Settings
Ga naar: **Globals > TopBar Settings**

Vul in:
- **Enabled:** ✅ Check
- **Background Color:** `#0A1628` (navy)
- **Text Color:** `#FFFFFF` (white)
- **Left Messages:**
  - Icon: `✓`, Text: "Voordelige B2B prijzen"
  - Icon: `🚚`, Text: "Gratis verzending vanaf €150"
  - Icon: `🔒`, Text: "Veilig & achteraf betalen"
- **Right Links:**
  - Label: "Klant worden", Link: "/klant-worden"
  - Label: "Help & Contact", Link: "/contact"

#### Shop Settings
Ga naar: **Globals > Shop Settings**

Vul in (tab: Bedrijfsinfo):
- **Company Name:** Plastimed B.V.
- **Phone:** 0251-247233
- **Email:** info@plastimed.nl

---

## 📄 Step 4: Create Homepage

Ga naar: **Collections > Pages** → **Create New**

### Page Settings:
- **Title:** Home
- **Slug:** `home` (BELANGRIJK!)
- **Published:** ✅ Check

### Layout (Blocks):

Voeg de volgende blocks toe in deze volgorde:

#### 1. Hero Block
- **Heading:** "Uw partner in medische supplies"
- **Description:** "Plastimed levert ruim 4.000 professionele medische producten..."
- **Badge:** "Sinds 1994 — 30+ jaar ervaring"
- **CTA 1:** "Bekijk assortiment" → `/shop`
- **CTA 2:** "Klant worden" → `/klant-worden`

#### 2. Stats Block (Hero Stats Card)
- **Layout:** Grid (2 columns)
- **Items:**
  - "4000+" - Producten
  - "30+" - Jaar ervaring
  - "24u" - Levertijd
  - "4.8★" - Klantwaardering

#### 3. Features Block (Trust Bar)
- **Layout:** Horizontal (5 columns)
- **Style:** Trust Bar
- **Items:**
  - 🏆 30+ jaar expertise | Sinds 1994 actief
  - 📦 Gratis verzending | Bij bestellingen vanaf €150
  - ⚡ Snelle levering | Vandaag besteld, morgen in huis
  - 🔒 Veilig betalen | iDEAL, op rekening & meer
  - ✅ A-merken | Hartmann, BSN, 3M, BD

#### 4. CategoryGrid Block
- **Source:** Auto (featured categories)
- **Layout:** 5 columns
- **Show Icon:** ✅ Yes
- **Show Product Count:** ✅ Yes
- **Heading:** "Onze productcategorieën"
- **Subheading:** "Alles wat uw praktijk, kliniek of ziekenhuis nodig heeft"

#### 5. ProductGrid Block
- **Source:** Featured Products
- **Layout:** 4 columns
- **Limit:** 4 products
- **Heading:** "Meest bestelde producten"
- **Show Add to Cart:** ✅ Yes
- **Show Stock Status:** ✅ Yes
- **Show Brand:** ✅ Yes

#### 6. LogoBar Block
- **Brands:** Hartmann, BSN Medical, 3M, BD, Medline, Clinhand, Parker, Blayco
- **Style:** Horizontal

#### 7. Features Block (Why Plastimed)
- **Layout:** Grid (3 columns)
- **Style:** Cards
- **Background:** Navy (#0A1628)
- **Heading:** "Waarom Plastimed?"
- **Items:**
  - 🎯 Persoonlijk advies
  - ⚡ Razendsnelle levering
  - 💎 Alleen A-merken
  - 📋 Slimme bestellijsten
  - 🏷️ Scherpe B2B prijzen
  - 🔐 Veilig & compliant

#### 8. Testimonials Block
- **Layout:** Grid (3 columns)
- **Heading:** "Wat onze klanten zeggen"
- **Source:** Featured testimonials
- **Limit:** 3

#### 9. CTA Block
- **Heading:** "Klaar om te bestellen?"
- **Description:** "Word vandaag nog klant bij Plastimed..."
- **Background:** Teal gradient
- **CTA 1:** "Klant worden" → `/klant-worden`
- **CTA 2:** "Neem contact op" → `/contact`

---

## 🎨 Categories Setup

Ga naar: **Collections > Categories** → **Create New**

Maak de volgende categorieën aan:

| Naam | Icon | Featured | Order |
|------|------|----------|-------|
| Diagnostiek | 🩺 | ✅ | 1 |
| EHBO | 🏥 | ✅ | 2 |
| Injectiemateriaal | 💉 | ✅ | 3 |
| Instrumentarium | ✂️ | ✅ | 4 |
| Laboratorium | 🔬 | ✅ | 5 |
| Praktijkinrichting | 🪑 | ✅ | 6 |
| Verbandmiddelen | 🩹 | ✅ | 7 |
| Verbruiksmateriaal | 📦 | ✅ | 8 |
| Verzorging | 🧴 | ✅ | 9 |

**Voor elke categorie:**
- **Title:** [naam]
- **Slug:** [auto-generated]
- **Icon:** [emoji]
- **Featured:** ✅ Check (voor navigatie)
- **Order:** [volgnummer]
- **Product Count:** (automatisch berekend)

---

## 🛍️ Products Setup

Ga naar: **Collections > Products** → **Create New**

### Voorbeeld Product:

**Basic Info:**
- **Title:** Littmann Classic III Stethoscoop — Marineblauw
- **SKU:** 5622
- **Price:** €139.95
- **Stock Status:** In Stock
- **Badge:** New

**Categorization:**
- **Category:** Diagnostiek
- **Brand:** Littmann

**Details:**
- **Description:** Professional stethoscope voor medisch gebruik...
- **Specifications:**
  - Materiaal: Hoogwaardig roestvrij staal
  - Kleur: Marineblauw
  - Gewicht: 250g

**Media:**
- **Images:** Upload product afbeeldingen
- **Downloads:** Datasheets, manuals (PDFs)

**Related:**
- **Related Products:** Selecteer 3-4 gerelateerde producten
- **Featured:** ✅ Check (voor homepage grid)

---

## 🎨 Tailwind Colors

De Plastimed kleuren zijn nu beschikbaar in alle componenten:

### Navy Palette:
- `bg-navy` → #0A1628
- `bg-navy-light` → #121F33
- `bg-navy-dark` → #0D2137

### Teal Palette:
- `bg-teal-50` → #E0F2F1 (lightest)
- `bg-teal-500` → #00897B (primary)
- `bg-teal-600` → #00796B (default)
- `bg-teal-700` → #00695C (dark)

### Gebruik in componenten:
```tsx
<div className="bg-navy text-white">
  <h1 className="text-teal-500">Hello Plastimed</h1>
</div>
```

---

## 🎬 Animations

De volgende animaties zijn beschikbaar:

- `animate-fadeUp` - Fade in from bottom
- `animate-pulse` - Pulsing effect (badges, dots)
- `animate-float` - Floating effect
- `animate-slideRight` - Slide in from left

### Gebruik:
```tsx
<div className="animate-fadeUp opacity-0">
  Content fades up on load
</div>
```

---

## 🧩 Components

### Plastimed-specifieke componenten:

#### 1. PlastimedTopBar
**Location:** `src/components/Plastimed/TopBar.tsx`
**Data Source:** TopBarSettings global
**Features:**
- Background & text color customization
- Left messages with icons & links
- Right links

#### 2. PlastimedHeader
**Location:** `src/components/Plastimed/Header.tsx`
**Data Source:** ShopSettings global
**Features:**
- Logo (P icon + "plastimed")
- Search bar
- Phone button (from ShopSettings)
- Wishlist, Account, Cart buttons
- Sticky positioning

#### 3. PlastimedNav
**Location:** `src/components/Plastimed/Nav.tsx`
**Data Source:** Categories collection (featured = true)
**Features:**
- Dynamic category links
- Icons from Categories
- Hover effects with underline animation
- Special "Aanbiedingen" link

---

## 🔧 Troubleshooting

### Homepage toont "Not Found"
**Probleem:** Geen page met slug 'home' gevonden
**Oplossing:** Maak een Page aan met exacte slug: `home`

### TopBar wordt niet getoond
**Probleem:** TopBar enabled = false
**Oplossing:** Ga naar TopBarSettings global, check "Enabled"

### Categorieën tonen niet in navigatie
**Probleem:** Geen featured categories
**Oplossing:** Zet "Featured" aan voor minimaal 3-5 categories

### Producten tonen niet in ProductGrid
**Probleem:** Geen featured products
**Oplossing:** Zet "Featured" aan voor minimaal 4 products

### TypeScript errors
**Oplossing:** Regenereer Payload types:
```bash
npm run payload generate:types
```

---

## 📱 Responsive Design

De homepage is volledig responsive:

**Desktop (1240px+):**
- 5-kolom category grid
- 4-kolom product grid
- Full topbar met alle links

**Tablet (768px - 1024px):**
- 3-kolom category grid
- 2-kolom product grid
- Compact topbar

**Mobile (<768px):**
- 2-kolom category grid
- 1-kolom product grid
- Hamburger menu voor navigatie
- Simplified topbar

---

## ✅ Checklist

Voordat je live gaat:

- [ ] Homepage (slug: 'home') aangemaakt met alle blocks
- [ ] TopBarSettings geconfigureerd en enabled
- [ ] ShopSettings ingevuld (telefoon, email, bedrijfsnaam)
- [ ] Minimaal 9 categories aangemaakt en featured
- [ ] Minimaal 4 products aangemaakt en featured
- [ ] Brands aangemaakt (Hartmann, BSN, 3M, BD, etc.)
- [ ] Testimonials aangemaakt (minimaal 3)
- [ ] Footer geconfigureerd
- [ ] Alle links getest
- [ ] Mobile responsive getest

---

## 🎉 Klaar!

De Plastimed homepage is nu volledig dynamisch en wordt gevoed vanuit de CMS!

**Next steps:**
1. Voeg meer producten toe
2. Maak categorie detail pages
3. Implementeer product detail pages
4. Configureer checkout flow

---

**Hulp nodig?**
Check de andere docs in `/docs/` voor meer info over blocks, collections, en globals!
