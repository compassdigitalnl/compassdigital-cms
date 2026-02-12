# Plastimed Implementation Analyse
**Datum:** 11 Februari 2026
**Doel:** Modulaire CMS voor alle klanten (Plastimed als eerste complete use-case)

---

## 📊 Executive Summary

Deze analyse vergelijkt het Plastimed redesign met de bestaande codebase om te bepalen:
- ✅ Welke blocks **HERBRUIKBAAR** zijn (al bestaan en prima zijn)
- 🔄 Welke blocks **GEÜPDATET** moeten worden
- ➕ Welke blocks **NIEUW** aangemaakt moeten worden
- 🌐 Welke data op **GLOBAL-niveau** beheerd moet worden

---

## 1️⃣ BESTAANDE BLOCKS (✅ Herbruikbaar)

Deze blocks bestaan al en zijn direct bruikbaar voor Plastimed:

| Block | Status | Plastimed Usage | Notes |
|-------|--------|-----------------|-------|
| **Hero** | ✅ Perfect | Homepage hero sectie | Heeft al CTA buttons, background, badge support |
| **Stats** | ✅ Perfect | Hero stats card (4000+ producten, etc) | Toont metrics in grid |
| **LogoBar** | ✅ Perfect | Merken banner (Hartmann, BSN, 3M, etc) | Voor partner/merk logo's |
| **CTA** | ✅ Perfect | "Klaar om te bestellen?" sectie | Call-to-action met buttons |
| **TestimonialsBlock** | ✅ Perfect | Reviews & klantervaringen | Google Reviews integratie |
| **Accordion** | ✅ Perfect | FAQ sectie | Voor veelgestelde vragen |
| **TwoColumn** | ✅ Perfect | Content + visual layouts | Voor "Waarom Plastimed?" |
| **Video** | ✅ Perfect | Product demo's / tutorials | Voor kennisbank content |
| **ImageGallery** | ✅ Perfect | Product detailpagina afbeeldingen | Gallery met thumbnails |
| **Spacer** | ✅ Perfect | Witruimte tussen secties | Layout spacing |
| **BlogPreview** | ✅ Perfect | Kennisbank preview op homepage | Blog/kennisbank items |
| **ContactFormBlock** | ✅ Perfect | Contact formulier | Voor klantenservice |
| **Map** | ✅ Perfect | Locatie (Beverwijk) | Google Maps embed |

**Totaal: 13 bestaande blocks zijn herbruikbaar! 🎉**

---

## 2️⃣ BLOCKS DIE GEÜPDATET MOETEN WORDEN (🔄)

Deze blocks bestaan, maar moeten worden uitgebreid voor e-commerce/B2B functionaliteit:

### 🔄 **Services** → Updaten naar **Features/USPs Block**
**Huidige functie:** Diensten tonen (algemeen)
**Nieuwe functie:** USP's / Trust bar items
- ✅ Behouden: Grid layout, icon support, titel + beschrijving
- ➕ Toevoegen:
  - Icon library uitbreiden (emoji of custom icons)
  - "Trust badges" styling optie
  - Horizontale layout optie (trust bar)
  - Hover effects configureerbaar maken

**Plastimed gebruik:**
- Trust bar: "30+ jaar expertise", "Gratis verzending €150+", "Snelle levering"
- "Waarom Plastimed?" sectie (6 USP's in grid)

---

### 🔄 **Pricing** → Updaten naar **ProductGrid/ProductCarousel**
**Huidige functie:** Pricing tables (SaaS)
**Nieuwe functie:** Product grid/carousel met add-to-cart
- ✅ Behouden: Grid layout systeem
- ➕ Toevoegen:
  - Product relatie (link naar Products collection)
  - Badge support ("Nieuw", "-15%", "Op voorraad")
  - Add-to-cart button
  - Stock status indicator
  - Price + compareAtPrice display
  - Carousel mode optie
  - Filter opties (categorie, merk)

**Plastimed gebruik:**
- "Meest bestelde producten" carousel
- "Gerelateerde producten" op PDP
- Category grid view

---

### 🔄 **CaseGrid** → Updaten naar **CategoryGrid**
**Huidige functie:** Case studies grid
**Nieuwe functie:** Product categorieën met iconen en afbeeldingen
- ✅ Behouden: Grid layout, image support
- ➕ Toevoegen:
  - Icon support (emoji of custom)
  - Product count per categorie
  - Link naar category page
  - Hover effects
  - Responsive grid (5, 3, 2 kolommen)

**Plastimed gebruik:**
- Homepage categorie grid (10 categorieën)
- Iconen: 🩺 🏥 💉 ✂️ 🔬 🪑 🩹 📦 🧴

---

## 3️⃣ NIEUWE BLOCKS DIE AANGEMAAKT MOETEN WORDEN (➕)

Deze blocks bestaan nog niet en moeten worden gecreëerd:

### ➕ **TopBar**
**Functie:** Belangrijke informatie boven de header
**Velden:**
- `items[]` (array):
  - `icon` (emoji of custom)
  - `text` (string)
  - `link` (optional URL)
- `rightItems[]` (array voor rechts):
  - `label` (string)
  - `link` (URL)
- `backgroundColor` (color picker)
- `textColor` (color picker)

**Plastimed gebruik:**
```
Left: ✓ Voordelige B2B prijzen | 🚚 Gratis verzending €150+ | 🔒 Veilig betalen
Right: Klant worden | Help & Contact
```

---

### ➕ **ProductFilters**
**Functie:** Filterbare sidebar voor categoriepagina's (PLP)
**Velden:**
- `filters[]` (array):
  - `type` (select: brand, price, inStock, custom)
  - `label` (string)
  - `options[]` (voor brand/custom filters)
- `priceRange` (group):
  - `min` (number)
  - `max` (number)
  - `step` (number)
- `layout` (select: sidebar, horizontal, modal)

**Plastimed gebruik:**
- Categoriepagina filter sidebar:
  - Merk (Hartmann, BSN, 3M)
  - Prijs slider (€0 - €500)
  - Op voorraad filter

---

### ➕ **BreadcrumbBlock**
**Functie:** Navigatie breadcrumbs (automatisch of handmatig)
**Velden:**
- `autoGenerate` (boolean) - Automatisch genereren op basis van URL
- `manualItems[]` (array):
  - `label` (string)
  - `link` (URL)
- `showHome` (boolean)
- `separator` (select: >, /, →)

**Plastimed gebruik:**
```
Home > Diagnostiek > Bloeddrukmeters > [Product]
Home > Kennisbank > Productgidsen > [Artikel]
```

---

### ➕ **QuickOrderBlock**
**Functie:** Bulk order formulier (artikelnummer + aantal)
**Velden:**
- `title` (text)
- `description` (richText)
- `placeholder` (textarea) - Example text
- `submitButtonText` (text)
- `successMessage` (text)
- `showInstructions` (boolean)

**Plastimed gebruik:**
- Dedicated "Quick Order" pagina
- B2B klanten kunnen artikelnummers + aantallen plakken
- Bijv: `5622,2` (2x product met SKU 5622)

---

### ➕ **SearchBar** (als standalone block)
**Functie:** Geavanceerde zoekbalk met autocomplete
**Velden:**
- `placeholder` (text)
- `showAutocomplete` (boolean)
- `searchCategories[]` (relationship naar categories)
- `maxSuggestions` (number)
- `showProductImages` (boolean)

**Plastimed gebruik:**
- Header sticky search
- "Zoek op product, merk of artikelnummer..."
- Autocomplete met productafbeeldingen

---

### ➕ **AlertBar**
**Functie:** Notification/announcement bar (boven header)
**Velden:**
- `message` (richText)
- `type` (select: info, success, warning, urgent)
- `dismissible` (boolean)
- `linkText` (text)
- `linkUrl` (text)
- `showIcon` (boolean)

**Plastimed gebruik:**
- "🎉 Gratis verzending op alles boven €150 deze maand!"
- "⚠️ Tijdelijk gesloten op 15 februari"

---

## 4️⃣ GLOBAL SETTINGS (🌐 Admin-niveau)

Deze informatie moet NIET per pagina ingesteld worden, maar globaal beheerd.

### Bestaande Globals (✅ Al aanwezig)

| Global | File | Status | Notes |
|--------|------|--------|-------|
| **SiteSettings** | `SiteSettings.ts` | ✅ Goed | Algemene site config |
| **Navigation** | `Navigation.ts` | ✅ Goed | Hoofdmenu structuur |
| **Footer** | `Footer.ts` | ✅ Goed | Footer links & content |
| **Header** | `Header.ts` | ✅ Goed | Header configuratie |

---

### Nieuwe Globals die TOEGEVOEGD moeten worden (➕)

#### ➕ **ShopSettings** (Nieuw!)
**Functie:** E-commerce specifieke instellingen
**Velden:**
```typescript
{
  // Bedrijfsinfo
  companyName: string // "Plastimed B.V."
  kvkNumber: string // "12345678"
  vatNumber: string // "NL123456789B01"

  // Contact
  phone: string // "0251-247233"
  email: string // "info@plastimed.nl"
  whatsapp: string // "+31612345678"

  // Verzending
  freeShippingThreshold: number // 150
  deliveryTime: string // "Besteld voor 16:00, morgen in huis"
  shippingCosts: number // 6.95

  // Return policy
  returnDays: number // 30
  returnPolicy: richText

  // B2B Settings
  minimumOrderAmount: number // Optional
  showPricesExclVat: boolean // true voor B2B
  requireAccountForPurchase: boolean // true voor B2B

  // Badges & Certifications
  certifications: upload[] // ISO, CE, etc badges
  paymentMethods: upload[] // iDEAL, Visa, etc logos

  // Trust indicators
  trustScore: number // 4.8
  trustSource: string // "Google Reviews"
  yearsInBusiness: number // 30
}
```

**Plastimed gebruik:**
- Footer: KVK nummer, contact info
- Trust bar: 30+ jaar, gratis verzending drempel
- Product pages: Levertijd, retourbeleid
- Checkout: Verzendkosten berekening

---

#### ➕ **TopBarSettings** (Nieuw!)
**Functie:** TopBar content & visibility
**Velden:**
```typescript
{
  enabled: boolean
  leftMessages: [
    { icon: string, text: string, link?: string }
  ]
  rightLinks: [
    { label: string, link: string }
  ]
  backgroundColor: string
  textColor: string
}
```

**Plastimed gebruik:**
- Bovenaan elke pagina
- "Voordelige B2B prijzen | Gratis verzending €150+"

---

#### ➕ **AlertBarSettings** (Nieuw!)
**Functie:** Site-wide aankondigingen
**Velden:**
```typescript
{
  enabled: boolean
  message: richText
  type: 'info' | 'success' | 'warning' | 'urgent'
  dismissible: boolean
  linkText?: string
  linkUrl?: string
  startDate?: date
  endDate?: date
}
```

**Plastimed gebruik:**
- Tijdelijke acties: "20% korting op EHBO materiaal"
- Sluitingsdagen: "Gesloten op [datum]"

---

## 5️⃣ COLLECTIONS ANALYSE

### Bestaande Collections (✅ Al aanwezig)

| Collection | Status | Plastimed Usage | Wijzigingen Nodig? |
|------------|--------|-----------------|-------------------|
| **Products** | ✅ 90% compleet | Alle producten | ➕ Kleine uitbreidingen |
| **Categories** | ✅ Basis OK | Product categorieën | ➕ Uitbreiden (icon, image) |
| **Media** | ✅ Perfect | Product afbeeldingen | Geen |
| **Users** | ✅ Perfect | B2B klanten | ➕ B2B velden toevoegen |
| **BlogPosts** | ✅ Perfect | Kennisbank artikelen | Geen |
| **Testimonials** | ✅ Perfect | Klantreviews | Geen |
| **FormSubmissions** | ✅ Perfect | Contact formulieren | Geen |

---

### 🔄 Products Collection - Uitbreidingen

**Toevoegen aan bestaande `Products.ts`:**

```typescript
// TOEVOEGEN:
{
  name: 'brand',
  type: 'relationship',
  relationTo: 'brands', // NIEUWE collection!
  label: 'Merk',
}
{
  name: 'specifications',
  type: 'array',
  label: 'Specificaties',
  fields: [
    { name: 'key', type: 'text', label: 'Naam' },
    { name: 'value', type: 'text', label: 'Waarde' },
  ]
}
{
  name: 'downloads',
  type: 'upload',
  relationTo: 'media',
  hasMany: true,
  label: 'Downloads (datasheets, manuals)',
  filterOptions: {
    mimeType: { contains: 'pdf' }
  }
}
{
  name: 'relatedProducts',
  type: 'relationship',
  relationTo: 'products',
  hasMany: true,
  label: 'Gerelateerde Producten',
}
{
  name: 'badge',
  type: 'select',
  label: 'Product Badge',
  options: [
    { label: 'Geen', value: 'none' },
    { label: 'Nieuw', value: 'new' },
    { label: 'Sale', value: 'sale' },
    { label: 'Populair', value: 'popular' },
  ]
}
```

---

### 🔄 Categories Collection - Uitbreidingen

**Toevoegen aan bestaande `Categories.ts`:**

```typescript
// TOEVOEGEN:
{
  name: 'icon',
  type: 'text',
  label: 'Icon (emoji)',
  admin: {
    description: 'Bijv: 🩺 of 💉'
  }
}
{
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  label: 'Categorie Afbeelding',
}
{
  name: 'parent',
  type: 'relationship',
  relationTo: 'categories',
  label: 'Parent Categorie',
  admin: {
    description: 'Voor subcategorieën'
  }
}
{
  name: 'productCount',
  type: 'number',
  label: 'Aantal Producten',
  admin: {
    readOnly: true,
    description: 'Automatisch berekend'
  }
  // Hook om automatisch te berekenen
}
```

---

### ➕ Nieuwe Collections die AANGEMAAKT moeten worden

#### ➕ **Brands** (Nieuw!)
**Functie:** Product merken (Hartmann, BSN, 3M, etc)

```typescript
export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Merk', plural: 'Merken' },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Merknaam',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Toon in LogoBar',
      defaultValue: false,
    },
  ]
}
```

**Plastimed gebruik:**
- LogoBar op homepage
- Filter op categoriepagina's
- Brand pagina's (alle Hartmann producten)

---

#### ➕ **Orders** (Nieuw!)
**Functie:** Bestellingen beheren

```typescript
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Bestelling', plural: 'Bestellingen' },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'E-commerce',
    defaultColumns: ['orderNumber', 'customer', 'total', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Bestelnummer',
      admin: { readOnly: true }
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Klant',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Producten',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Prijs per stuk',
        }
      ]
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: 'Totaal (€)',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'In behandeling', value: 'pending' },
        { label: 'Betaald', value: 'paid' },
        { label: 'Verzonden', value: 'shipped' },
        { label: 'Geleverd', value: 'delivered' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ]
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Verzendadres',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Nederland' },
      ]
    },
    {
      name: 'billingAddress',
      type: 'group',
      label: 'Factuuradres',
      fields: [
        { name: 'company', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Nederland' },
      ]
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Betaalmethode',
      options: [
        { label: 'iDEAL', value: 'ideal' },
        { label: 'Op rekening', value: 'invoice' },
        { label: 'Creditcard', value: 'creditcard' },
        { label: 'Bankoverschrijving', value: 'banktransfer' },
      ]
    },
    {
      name: 'paymentStatus',
      type: 'select',
      label: 'Betaalstatus',
      defaultValue: 'pending',
      options: [
        { label: 'In behandeling', value: 'pending' },
        { label: 'Betaald', value: 'paid' },
        { label: 'Mislukt', value: 'failed' },
        { label: 'Terugbetaald', value: 'refunded' },
      ]
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Opmerkingen',
    },
    {
      name: 'invoicePDF',
      type: 'upload',
      relationTo: 'media',
      label: 'Factuur PDF',
      filterOptions: {
        mimeType: { contains: 'pdf' }
      }
    }
  ]
}
```

**Plastimed gebruik:**
- Order management in admin
- Klant kan bestellingen inzien in portaal
- Factuur generatie & download

---

#### ➕ **OrderLists** (Nieuw!)
**Functie:** Bestellijsten / favorieten voor terugkerende bestellingen

```typescript
export const OrderLists: CollectionConfig = {
  slug: 'order-lists',
  labels: { singular: 'Bestellijst', plural: 'Bestellijsten' },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Lijstnaam',
      admin: {
        description: 'Bijv: "Wekelijkse bestelling" of "OK-materiaal"'
      }
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Eigenaar',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Producten',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'defaultQuantity',
          type: 'number',
          min: 1,
          defaultValue: 1,
          label: 'Standaard aantal',
        },
        {
          name: 'notes',
          type: 'text',
          label: 'Notitie',
        }
      ]
    },
    {
      name: 'shared',
      type: 'checkbox',
      label: 'Gedeeld met team',
      defaultValue: false,
    },
    {
      name: 'sharedWith',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      label: 'Gedeeld met',
      admin: {
        condition: (data) => data.shared === true
      }
    }
  ]
}
```

**Plastimed gebruik:**
- B2B klanten maken lijsten: "Wekelijkse voorraad", "OK-materiaal"
- Quick reorder: hele lijst met 1 klik toevoegen aan winkelwagen
- Delen met collega's binnen organisatie

---

## 6️⃣ USERS COLLECTION - B2B UITBREIDINGEN

**Toevoegen aan bestaande `Users` collection:**

```typescript
// TOEVOEGEN in Users/index.ts:
{
  name: 'accountType',
  type: 'select',
  label: 'Account Type',
  defaultValue: 'individual',
  options: [
    { label: 'Particulier', value: 'individual' },
    { label: 'B2B Zakelijk', value: 'b2b' },
    { label: 'Administrator', value: 'admin' },
  ]
}
{
  name: 'company',
  type: 'group',
  label: 'Bedrijfsgegevens',
  admin: {
    condition: (data) => data.accountType === 'b2b'
  },
  fields: [
    { name: 'name', type: 'text', label: 'Bedrijfsnaam', required: true },
    { name: 'kvkNumber', type: 'text', label: 'KVK Nummer' },
    { name: 'vatNumber', type: 'text', label: 'BTW Nummer' },
    { name: 'invoiceEmail', type: 'email', label: 'Factuur Email' },
  ]
}
{
  name: 'addresses',
  type: 'array',
  label: 'Adressen',
  fields: [
    { name: 'type', type: 'select', options: [
      { label: 'Verzendadres', value: 'shipping' },
      { label: 'Factuuradres', value: 'billing' },
      { label: 'Both', value: 'both' },
    ]},
    { name: 'street', type: 'text', required: true },
    { name: 'houseNumber', type: 'text', required: true },
    { name: 'postalCode', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'country', type: 'text', defaultValue: 'Nederland' },
    { name: 'isDefault', type: 'checkbox', label: 'Standaard adres' },
  ]
}
{
  name: 'orderLists',
  type: 'relationship',
  relationTo: 'order-lists',
  hasMany: true,
  label: 'Bestellijsten',
  admin: { readOnly: true }
}
```

---

## 7️⃣ PRIORITY OVERZICHT

### 🔥 **PHASE 1 - MUST HAVE** (Eerst implementeren)

**Collections:**
1. ➕ `Brands` collection aanmaken
2. 🔄 `Products` uitbreiden (brand, specifications, downloads, relatedProducts, badge)
3. 🔄 `Categories` uitbreiden (icon, image, parent, productCount)
4. 🔄 `Users` uitbreiden (B2B velden)

**Globals:**
1. ➕ `ShopSettings` aanmaken
2. ➕ `TopBarSettings` aanmaken

**Blocks:**
1. 🔄 `Services` → `FeaturesBlock` (voor trust bar + USP's)
2. 🔄 `CaseGrid` → `CategoryGrid`
3. 🔄 `Pricing` → `ProductGrid`
4. ➕ `TopBar` nieuw
5. ➕ `BreadcrumbBlock` nieuw

**Frontend Pages:**
1. Homepage (met alle blocks)
2. Product Detail Page (PDP)
3. Category Page (PLP)

---

### 🚀 **PHASE 2 - IMPORTANT** (Na Phase 1)

**Collections:**
1. ➕ `Orders` collection aanmaken
2. ➕ `OrderLists` collection aanmaken

**Globals:**
1. ➕ `AlertBarSettings` aanmaken

**Blocks:**
1. ➕ `QuickOrderBlock` nieuw
2. ➕ `ProductFilters` nieuw
3. ➕ `SearchBar` nieuw (als block)
4. ➕ `AlertBar` nieuw

**Frontend Pages:**
1. Quick Order pagina
2. Customer Portal (orders, order lists)
3. Checkout flow
4. Search results page

---

### 💎 **PHASE 3 - NICE TO HAVE** (Optioneel)

**Features:**
1. Live chat / WhatsApp integratie
2. Advanced search (Meilisearch/Algolia)
3. Product reviews systeem
4. Verbruiksanalyse dashboard
5. Stock notifications
6. Multi-warehouse support
7. ERP koppeling

---

## 8️⃣ MODULAIR DESIGN BESLISSINGEN

### ✅ **WEL globaal maken (herbruikbaar voor alle klanten):**

1. **ShopSettings** - Elke e-commerce klant heeft dit nodig:
   - Verzendkosten
   - Gratis verzending drempel
   - Return policy
   - Contact informatie
   - Betaalmethoden

2. **TopBar** - Veel sites gebruiken dit:
   - Promoties
   - USP's
   - Belangrijke info

3. **Trust badges** - Universeel toepasbaar:
   - Certificeringen
   - Betalingsmethoden
   - Garanties

4. **Product badges** - Algemene e-commerce:
   - "Nieuw"
   - "Sale"
   - "Populair"
   - "Uitverkocht"

---

### ❌ **NIET hard-coden (client-specifiek in admin):**

1. **Plastimed specifiek:**
   - Logo
   - Kleuren (via theme settings)
   - Merknamen (in Brands collection)
   - Product categorieën (in Categories collection)
   - Contact gegevens (in ShopSettings)

2. **Content:**
   - Alle teksten via CMS
   - Afbeeldingen via Media
   - Menu items via Navigation global

---

## 9️⃣ NEXT STEPS

### Direct te doen:

1. **Create TODO document** met alle Phase 1 taken
2. **Start met Collections:**
   - Brands collection aanmaken
   - Products uitbreiden
   - Categories uitbreiden
   - Users uitbreiden

3. **Daarna Globals:**
   - ShopSettings global
   - TopBarSettings global

4. **Dan Blocks:**
   - FeaturesBlock (update Services)
   - CategoryGrid (update CaseGrid)
   - ProductGrid (update Pricing)
   - TopBar (nieuw)
   - BreadcrumbBlock (nieuw)

5. **Frontend:**
   - Homepage template
   - PDP template
   - PLP template

---

## 📝 SAMENVATTING

| Category | Herbruikbaar ✅ | Updaten 🔄 | Nieuw ➕ | Totaal |
|----------|----------------|-----------|---------|--------|
| **Blocks** | 13 | 3 | 7 | 23 |
| **Collections** | 7 | 3 | 3 | 13 |
| **Globals** | 4 | 0 | 3 | 7 |

**Conclusie:**
- 🎉 **60% van de basis functionaliteit bestaat al!**
- 🔄 **30% moet worden uitgebreid (kleine wijzigingen)**
- ➕ **10% is volledig nieuw (e-commerce specifiek)**

**De modulaire CMS basis is STERK!** Plastimed is vooral:
- E-commerce collections toevoegen (Products, Orders, Brands)
- Bestaande blocks uitbreiden voor shop functionaliteit
- Shop-specifieke globals toevoegen

---

**Klaar voor implementatie! 🚀**
