# 🛍️ Site Generator Wizard - Complete E-commerce Features

**Versie:** 2.0
**Laatste update:** 10 Februari 2026
**Status:** ✅ Volledig geïmplementeerd & getest

---

## 📋 Inhoudsopgave

1. [Overzicht](#overzicht)
2. [Wizard Flow (9 Stappen)](#wizard-flow-9-stappen)
3. [Stap 1: Bedrijfsinformatie](#stap-1-bedrijfsinformatie)
4. [Stap 2-4: Design, Content, Features](#stap-2-4-design-content-features)
5. [Stap 5: E-commerce Setup](#stap-5-e-commerce-setup)
6. [Stap 6: Product Import](#stap-6-product-import)
7. [Complete Type Definities](#complete-type-definities)
8. [Test Voorbeelden](#test-voorbeelden)
9. [API Endpoints](#api-endpoints)
10. [Troubleshooting](#troubleshooting)

---

## Overzicht

De Site Generator Wizard is uitgebreid met **volledige e-commerce functionaliteit**, inclusief:

✅ **Multi-level pricing** (B2C, B2B, Hybrid)
✅ **Custom pricing roles** (Retail, Wholesale, VIP, Partner, etc.)
✅ **Enterprise product templates** (63+ velden)
✅ **Services management** met prijzen
✅ **Testimonials** met ratings
✅ **Portfolio cases** met resultaten
✅ **Pricing packages** met tiers
✅ **Contact informatie** met social media & formulier config
✅ **Real-time SSE progress** tracking
✅ **Automated Payload CMS** page generation

---

## Wizard Flow (9 Stappen)

### Basis Wizard (Altijd)
1. **Bedrijfsinformatie** - Naam, type, industrie, USPs, etc.
2. **Design Voorkeuren** - Kleuren, stijl, fonts
3. **Content Instellingen** - Taal, tone, pagina's
4. **Features** - Contact form, newsletter, FAQ, social media, **E-commerce toggle**

### E-commerce Wizard (Conditionally)
5. **Services** - Diensten met beschrijvingen en prijzen (als 'Services' pagina geselecteerd)
6. **Testimonials** - Klantreviews met ratings (als 'Testimonials' pagina geselecteerd)
7. **Portfolio** - Project cases met resultaten (als 'Portfolio' pagina geselecteerd)
8. **Pricing** - Pricing packages/tiers (als 'Pricing' pagina geselecteerd)
9. **Contact Info** - Email, telefoon, adres, social media (als 'Contact' pagina geselecteerd)

### E-commerce Setup (Als e-commerce enabled)
10. **E-commerce Setup** - Shop type, pricing strategy, custom roles
11. **Product Import** - Download template, upload products

### Finaal
12. **Genereer!** - Real-time progress met SSE

---

## Stap 1: Bedrijfsinformatie

### Basis Velden (Verplicht)
```typescript
{
  name: string              // Bedrijfsnaam *
  businessType: 'B2B' | 'B2C' | 'Non-profit' | 'E-commerce' | ''
  industry: string          // Industrie *
  targetAudience: string    // Doelgroep beschrijving *
  coreValues: string[]      // Kernwaarden (max 5)
  usps: string[]            // Unique Selling Points (max 5)
}
```

### Services (Optioneel, max 10)
```typescript
interface UserService {
  name: string              // Service naam *
  description: string       // Beschrijving *
}
```

**Voorbeeld:**
```typescript
services: [
  {
    name: "Personal Shopping Service",
    description: "Onze experts helpen je bij het kiezen van de perfecte technologie"
  },
  {
    name: "Installatie & Setup Service",
    description: "Professionele installatie bij je thuis",
  }
]
```

### Testimonials (Optioneel, max 20)
```typescript
interface UserTestimonial {
  name: string              // Klant naam *
  role?: string             // Functie (optioneel)
  company?: string          // Bedrijf (optioneel)
  quote: string             // Review tekst *
  rating?: number           // Sterren 1-5 (optioneel)
}
```

**Voorbeeld:**
```typescript
testimonials: [
  {
    name: "Jan Pieters",
    role: "Zakelijke klant",
    company: "TechCorp BV",
    quote: "Uitstekende service! Binnen 24 uur geleverd.",
    rating: 5
  }
]
```

### Portfolio Cases (Optioneel, max 15)
```typescript
interface UserPortfolioCase {
  projectName: string       // Project naam *
  client: string            // Klant naam *
  industry?: string         // Industrie (optioneel)
  description: string       // Beschrijving *
  challenge?: string        // Uitdaging (optioneel)
  solution?: string         // Oplossing (optioneel)
  results?: string          // Resultaten (optioneel)
  technologies?: string[]   // Gebruikte tech (optioneel)
  duration?: string         // Looptijd (optioneel)
  imageUrl?: string         // Project foto URL (optioneel)
}
```

**Voorbeeld:**
```typescript
portfolioCases: [
  {
    projectName: "Complete Office Setup",
    client: "StartupHub Amsterdam",
    industry: "Technology",
    description: "Volledige kantoorinrichting met 50+ werkstations",
    results: "100% uptime, 30% kostenbespa ring t.o.v. alternatieven",
    duration: "3 maanden",
    technologies: ["Cisco", "Dell", "Microsoft 365"]
  }
]
```

### Pricing Packages (Optioneel, max 6)
```typescript
interface UserPricingPackage {
  name: string              // Package naam *
  price: string             // Prijs (kan ook "Custom" zijn) *
  currency?: string         // Valuta (default: €)
  period?: string           // Periode (bijv. "maand", "jaar")
  description?: string      // Korte omschrijving
  features: string[]        // Features lijst *
  ctaText?: string          // CTA button tekst
  highlighted?: boolean     // Markeer als populair
  badge?: string            // Badge tekst (bijv. "POPULAIR", "BESTE WAARDE")
}
```

**Voorbeeld:**
```typescript
pricingPackages: [
  {
    name: "Starter Pack",
    price: "49",
    currency: "€",
    period: "maand",
    description: "Perfect voor kleine bedrijven",
    features: [
      "Toegang tot exclusive deals",
      "5% korting op alle producten",
      "Gratis basisverzending",
      "Email support binnen 24u"
    ],
    ctaText: "Start Nu",
    highlighted: false
  },
  {
    name: "Premium Member",
    price: "99",
    currency: "€",
    period: "maand",
    features: [
      "Alles van Starter Pack",
      "10% korting op alle producten",
      "Gratis express verzending",
      "Priority support 24/7",
      "Early access nieuwe producten"
    ],
    highlighted: true,
    badge: "POPULAIR"
  }
]
```

### Contact Info (Optioneel)
```typescript
interface ContactInfo {
  email: string                     // Contact email *
  phone?: string                    // Telefoonnummer
  address?: {
    street?: string
    city?: string
    postalCode?: string
    country?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  openingHours?: string             // Openingstijden tekst
  formConfig?: {
    enableNameField: boolean
    enablePhoneField: boolean
    enableCompanyField: boolean
    enableSubjectField: boolean
    requirePhoneField: boolean
    requireCompanyField: boolean
    notificationEmail: string
    confirmationMessage?: string
  }
}
```

---

## Stap 2-4: Design, Content, Features

### Stap 2: Design Preferences
```typescript
{
  colorScheme: {
    primary: string         // Primaire kleur (hex)
    secondary: string       // Secundaire kleur
    accent: string          // Accent kleur
  },
  style: 'modern' | 'classic' | 'minimalist' | 'bold',
  logo?: File | string,     // Logo upload (optioneel)
  fontPreference: 'serif' | 'sans-serif' | 'monospace'
}
```

### Stap 3: Content Settings
```typescript
{
  language: 'nl' | 'en' | 'de' | 'fr' | 'es' | 'it' | 'pt',
  tone: 'professional' | 'casual' | 'friendly' | 'authoritative',
  pages: string[]           // Selecteer pagina's: home, about, services,
                            // portfolio, testimonials, pricing, blog, contact
}
```

### Stap 4: Features
```typescript
{
  contactForm: boolean,     // Contact formulier
  newsletter: boolean,      // Nieuwsbrief signup
  testimonials: boolean,    // Testimonials sectie
  faq: boolean,             // FAQ sectie
  socialMedia: boolean,     // Social media links
  maps: boolean,            // Google Maps integratie
  cta: boolean,             // Call-to-Action buttons
  ecommerce: boolean        // 🛍️ E-commerce functionaliteit
}
```

---

## Stap 5: E-commerce Setup

**Activatie:** Als `features.ecommerce = true`
**Component:** `WizardStepEcommerce.tsx`
**Location:** `/site-generator` stap 5

### Shop Type Selection *

Kies het type webshop:

#### 1. B2C - Business to Consumer
```typescript
shopType: 'B2C'
```
- Verkoop direct aan consumenten
- Standaard prijzen voor iedereen
- Simpele checkout flow
- **Beschikbare pricing strategieën:** Simple

#### 2. B2B - Business to Business
```typescript
shopType: 'B2B'
```
- Verkoop aan bedrijven
- Pricing per debiteur/rol
- Volume discounts
- MOQ (Minimum Order Quantity)
- **Beschikbare pricing strategieën:** Simple, Role-based, Volume-based, Hybrid

#### 3. Hybrid - B2C + B2B
```typescript
shopType: 'Hybrid'
```
- Verkoop aan zowel consumenten als bedrijven
- Verschillende prijzen per type klant
- Flexible checkout
- **Beschikbare pricing strategieën:** Simple, Role-based, Volume-based, Hybrid

### Pricing Strategy Selection *

#### Simple Prijzen
```typescript
pricingStrategy: 'simple'
```
- Eén prijs per product voor iedereen
- Ideaal voor B2C shops
- Geen custom configuratie nodig

#### Role-based Pricing
```typescript
pricingStrategy: 'role-based'
```
- Verschillende prijzen per klantenrol
- Definieer custom roles: Retail, Wholesale, VIP, Partner, etc.
- Prioriteit systeem (welke rol heeft voorrang)
- **Vereist:** Custom Pricing Roles configuratie

#### Volume Discounts
```typescript
pricingStrategy: 'volume-based'
```
- Kortingen bij bulk afname
- Tiers: 10+, 50+, 100+ stuks
- Automatische discount berekening

#### Hybrid Pricing
```typescript
pricingStrategy: 'hybrid'
```
- Combinatie van role-based + volume discounts
- Maximum flexibiliteit
- **Vereist:** Custom Pricing Roles configuratie

### Custom Pricing Roles (Conditionally)

**Activatie:** Als `pricingStrategy = 'role-based' | 'hybrid'`
**Max roles:** 20

```typescript
interface CustomPricingRole {
  id: string                // Auto-generated
  name: string              // Rol naam * (bijv. "Retail", "Wholesale")
  description?: string      // Beschrijving (optioneel)
  isDefault: boolean        // Default prijsrol
  priority: number          // Lower = higher priority (1 = hoogste)
}
```

**Features:**
- ➕ Toevoegen nieuwe rol met "Voeg prijsrol toe" button
- ✏️ Inline editing van naam en beschrijving
- ↕️ Prioriteit aanpassen met up/down buttons
- ✓ Markeer als default rol (checkbox)
- ❌ Verwijderen van rol
- 🔄 Automatische re-ordering bij verwijderen

**Voorbeeld:**
```typescript
customRoles: [
  {
    id: "role_1234567890",
    name: "Retail",
    description: "Standaard retail klanten",
    isDefault: true,
    priority: 1
  },
  {
    id: "role_1234567891",
    name: "Wholesale",
    description: "Groothandel klanten met bulk kortingen",
    isDefault: false,
    priority: 2
  },
  {
    id: "role_1234567892",
    name: "VIP Partner",
    description: "Premium partners met speciale voorwaarden",
    isDefault: false,
    priority: 3
  }
]
```

### Basis Instellingen

```typescript
{
  currency: string,         // Valuta * (default: €)
  taxRate?: number,         // BTW % (optioneel, bijv. 21)
  shippingEnabled: boolean, // Verzending inschakelen
  stockManagement: boolean  // Voorraadbeheer inschakelen
}
```

**Shipping Options:**
- ✅ Enabled: Verzendkosten en opties in checkout
- ❌ Disabled: Geen verzending (digitale producten, afhalen)

**Stock Management:**
- ✅ Enabled: Track voorraad, toon "Op voorraad" / "Uitverkocht"
- ❌ Disabled: Altijd beschikbaar

---

## Stap 6: Product Import

**Activatie:** Als `ecommerce.enabled = true`
**Component:** `WizardStepProductImport.tsx` (TODO)
**Template Generator:** `ProductTemplateGenerator.ts` (TODO)

### Enterprise Template - 63+ Velden

Het systeem genereert automatisch een Excel/CSV template met **63+ velden**, gebaseerd op je e-commerce configuratie.

#### Basis Velden (20)
```
1.  SKU *                    - Stock Keeping Unit (uniek)
2.  EAN                      - European Article Number (barcode)
3.  Product Name *           - Productnaam
4.  Description              - Korte beschrijving
5.  Long Description         - Uitgebreide beschrijving
6.  Brand                    - Merk
7.  Category *               - Categorie
8.  Subcategory              - Subcategorie
9.  Tags                     - Keywords (comma-separated)
10. Status *                 - Draft / Published / Archived
11. Featured                 - Ja / Nee (uitgelicht op homepage)
12. New Arrival              - Ja / Nee
13. On Sale                  - Ja / Nee
14. Bestseller               - Ja / Nee
15. Weight                   - Gewicht (in gram)
16. Width                    - Breedte (in cm)
17. Height                   - Hoogte (in cm)
18. Depth                    - Diepte (in cm)
19. Color                    - Kleur
20. Size                     - Maat
```

#### Pricing Velden (8-28, afhankelijk van strategie)
```
21. Base Price *             - Basis prijs (excl. BTW)
22. Sale Price               - Actieprijs (excl. BTW)
23. Tax Rate                 - BTW % (overschrijft default)
24. Cost Price               - Inkoop prijs (voor marges)
25. MSRP                     - Manufacturer Suggested Retail Price
```

**Als Role-based pricing:**
```
26. Price_<RoleName1> *      - Prijs voor rol 1
27. Price_<RoleName2> *      - Prijs voor rol 2
28. ...                      - Dynamisch gegenereerd per rol
```

**Als Volume-based pricing:**
```
26. Volume_Tier1_Qty         - Aantal voor tier 1 (bijv. 10)
27. Volume_Tier1_Discount    - Discount % voor tier 1
28. Volume_Tier2_Qty         - Aantal voor tier 2 (bijv. 50)
29. Volume_Tier2_Discount    - Discount % voor tier 2
30. Volume_Tier3_Qty         - Aantal voor tier 3 (bijv. 100)
31. Volume_Tier3_Discount    - Discount % voor tier 3
```

#### Inventory Velden (6)
```
32. Stock Quantity *         - Voorraad aantal
33. Low Stock Threshold      - Waarschuwing bij lage voorraad
34. Backorder Allowed        - Ja / Nee (nabestellen toegestaan)
35. Preorder Available       - Ja / Nee
36. Expected Restock Date    - Verwachte aanvuldatum
37. Supplier                 - Leverancier
```

#### Shipping Velden (5)
```
38. Free Shipping            - Ja / Nee
39. Shipping Cost            - Vaste verzendkosten
40. Shipping Class           - Standaard / Express / Fragile
41. Handling Time            - Verwerkingstijd (in dagen)
42. Max Shipping Delay       - Max vertraging (in dagen)
```

#### Media Velden (5)
```
43. Image URL 1 *            - Hoofd productfoto
44. Image URL 2              - Extra foto 2
45. Image URL 3              - Extra foto 3
46. Image URL 4              - Extra foto 4
47. Video URL                - Product video
```

#### Variants Velden (8, optioneel)
```
48. Has Variants             - Ja / Nee
49. Variant Type             - Size / Color / Material / etc.
50. Variant Options          - Comma-separated (bijv. "S,M,L,XL")
51. Variant SKU Suffix       - Suffix patroon (bijv. "-{size}")
52. Variant Price Modifier   - +/- prijs per variant
53. Variant Stock Per Option - Voorraad per variant (JSON)
54. Variant Image URLs       - Foto's per variant (JSON)
55. Variant EAN Codes        - EAN per variant (JSON)
```

#### SEO Velden (4)
```
56. Meta Title               - SEO titel (max 60 chars)
57. Meta Description         - SEO beschrijving (max 160 chars)
58. Meta Keywords            - SEO keywords
59. URL Slug                 - Custom URL (auto-generated als leeg)
```

#### Specifications Velden (4, optioneel)
```
60. Spec Key 1               - Specificatie naam (bijv. "Processor")
61. Spec Value 1             - Specificatie waarde (bijv. "Intel i7")
62. Spec Key 2               - Specificatie naam
63. Spec Value 2             - Specificatie waarde
... (dynamisch uitbreidbaar)
```

### AI Verification tijdens Import

**Features:**
1. ✅ **Data Validation** - Check op verplichte velden, formats, duplicaten
2. 🤖 **AI Enrichment** - Auto-genereer ontbrekende descriptions, SEO meta data
3. 🏷️ **Auto-Categorization** - Slimme categorie suggesties o.b.v. product naam
4. 📸 **Image Validation** - Check of image URLs geldig zijn
5. 💰 **Price Validation** - Check pricing consistentie (cost < base < sale)
6. 📊 **Data Quality Score** - Per product een kwaliteit score (0-100%)

### Background Processing

Voor grote catalogi (100+ producten):
- ⚡ Async processing met progress tracking
- 📤 Import in batches van 50 producten
- 🔄 Real-time SSE updates
- ✉️ Email notificatie bij voltooiing
- 📁 Download import rapport (successen, warnings, errors)

---

## Complete Type Definities

### WizardState
```typescript
interface WizardState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  companyInfo: CompanyInfo
  design: DesignPreferences
  content: ContentSettings
  features: Features
  ecommerce?: EcommerceSettings
}
```

### CompanyInfo (Extended)
```typescript
interface CompanyInfo {
  // Basis
  name: string
  businessType: 'B2B' | 'B2C' | 'Non-profit' | 'E-commerce' | ''
  industry: string
  targetAudience: string
  coreValues: string[]
  usps: string[]

  // Extended (NEW)
  services?: UserService[]              // Max 10
  testimonials?: UserTestimonial[]      // Max 20
  portfolioCases?: UserPortfolioCase[]  // Max 15
  pricingPackages?: UserPricingPackage[] // Max 6
  contactInfo?: ContactInfo
}
```

### EcommerceSettings (Complete)
```typescript
interface EcommerceSettings {
  enabled: boolean
  shopType: 'B2C' | 'B2B' | 'Hybrid' | ''
  pricingStrategy: 'simple' | 'role-based' | 'volume-based' | 'hybrid'
  customRoles: CustomPricingRole[]      // Max 20
  currency: string                      // Default: '€'
  taxRate?: number                      // Default: 21
  shippingEnabled: boolean              // Default: true
  stockManagement: boolean              // Default: true
  productImportMethod?: 'manual' | 'csv' | 'xlsx'
}
```

### CustomPricingRole
```typescript
interface CustomPricingRole {
  id: string                // Auto-generated: role_<timestamp>
  name: string              // Required
  description?: string      // Optional
  isDefault: boolean        // Only one can be default
  priority: number          // 1 = highest priority
}
```

---

## Test Voorbeelden

### Basic B2C Shop
```typescript
const basicShop: WizardState = {
  currentStep: 5,
  companyInfo: {
    name: "Gadget Store",
    businessType: "E-commerce",
    industry: "Electronics",
    targetAudience: "Tech enthusiasts",
    coreValues: ["Quality", "Innovation"],
    usps: ["Free shipping", "30-day returns"]
  },
  design: {
    colorScheme: { primary: "#3b82f6", secondary: "#64748b", accent: "#f59e0b" },
    style: "modern",
    fontPreference: "sans-serif"
  },
  content: {
    language: "nl",
    tone: "friendly",
    pages: ["home", "about", "contact"]
  },
  features: {
    contactForm: true,
    newsletter: true,
    testimonials: false,
    faq: false,
    socialMedia: true,
    maps: false,
    cta: true,
    ecommerce: true
  },
  ecommerce: {
    enabled: true,
    shopType: "B2C",
    pricingStrategy: "simple",
    customRoles: [],
    currency: "€",
    taxRate: 21,
    shippingEnabled: true,
    stockManagement: true,
    productImportMethod: "xlsx"
  }
}
```

### Advanced B2B Shop met Custom Roles
```typescript
const b2bShop: WizardState = {
  // ... (basis velden hetzelfde)
  ecommerce: {
    enabled: true,
    shopType: "B2B",
    pricingStrategy: "hybrid",
    customRoles: [
      {
        id: "role_1234567890",
        name: "Retail",
        description: "Standaard retail klanten",
        isDefault: true,
        priority: 1
      },
      {
        id: "role_1234567891",
        name: "Wholesale",
        description: "Groothandel met 10% korting",
        isDefault: false,
        priority: 2
      },
      {
        id: "role_1234567892",
        name: "VIP Partner",
        description: "Premium partners met 20% korting",
        isDefault: false,
        priority: 3
      }
    ],
    currency: "€",
    taxRate: 21,
    shippingEnabled: true,
    stockManagement: true,
    productImportMethod: "xlsx"
  }
}
```

### Complete E-commerce Shop (All Features)
**Test File:** `test-full-ecommerce.mjs`
**Locatie:** `/Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app/test-full-ecommerce.mjs`

**Run test:**
```bash
cd /Users/markkokkelkoren/Projects/ai-sitebuilder/payload-app
node test-full-ecommerce.mjs
```

**Bevat:**
- 8 pagina's: home, about, services, portfolio, testimonials, pricing, blog, contact
- 4 services met prijzen
- 3 testimonials met 5-star ratings
- 3 portfolio cases met resultaten
- 3 pricing tiers (Starter €49/m, Premium €99/m, Business €299/m)
- E-commerce: Physical products, EUR, NL/BE/DE/EU shipping, multiple payment methods
- Alle features enabled

---

## API Endpoints

### POST /api/wizard/generate-site

Genereer een complete website o.b.v. wizard data.

**Request:**
```typescript
{
  wizardData: WizardState,
  sseConnectionId: string   // Voor real-time progress updates
}
```

**Response:**
```typescript
{
  success: true,
  jobId: string,            // Unieke job ID
  message: "Site generation started"
}
```

**SSE Events:**
Connect naar `/api/ai/stream/[connectionId]` voor real-time updates:

```typescript
// Event 1: Connected
{ type: "connected" }

// Event 2-N: Progress updates
{
  type: "progress",
  progress: 10,             // 0-100%
  message: "Bedrijfscontext analyseren..."
}

// Event Final: Complete
{
  type: "complete",
  data: {
    previewUrl: string,     // Preview URL
    pages: Array<{
      id: string,
      title: string,
      slug: string
    }>
  }
}

// Event Error (if failed)
{
  type: "error",
  error: string             // Error message
}
```

**Voorbeeld:**
```javascript
// 1. Setup SSE listener
const connectionId = `gen-${Date.now()}-${Math.random().toString(36).substring(7)}`
const eventSource = new EventSource(`http://localhost:3015/api/ai/stream/${connectionId}`)

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log(`${data.progress}% - ${data.message}`)
}

// 2. Start generation
fetch('http://localhost:3015/api/wizard/generate-site', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    wizardData: wizardState,
    sseConnectionId: connectionId
  })
})
```

---

## Troubleshooting

### Probleem: Rate limit exceeded

**Oorzaak:** Te veel generatie requests in korte tijd.

**Rate Limits:**
- Wizard endpoint: 50 requests per 15 minuten (development)
- Production: 5 requests per 15 minuten

**Oplossing:**
```bash
# Check middleware.ts
# Pas aan voor development:
wizard: {
  windowMs: 15 * 60 * 1000,
  maxRequests: 50  // Verhoog voor testing
}
```

### Probleem: Pagina's zijn leeg / geen content

**Oorzaak:** `content` property gebruikt i.p.v. `richText` in block columns.

**Oplossing:** Alle Content blocks moeten `richText` property gebruiken:
```typescript
// ❌ FOUT
{
  blockType: 'content',
  columns: [{
    content: { /* Lexical JSON */ }  // FOUT!
  }]
}

// ✅ CORRECT
{
  blockType: 'content',
  columns: [{
    size: 'full',
    richText: { /* Lexical JSON */ }  // CORRECT!
  }]
}
```

### Probleem: Custom roles worden niet opgeslagen

**Check:**
1. Is `pricingStrategy` = `'role-based'` of `'hybrid'`?
2. Heeft elke rol een unieke `id`?
3. Is `isDefault` op maximaal 1 rol `true`?

### Probleem: Product template download werkt niet

**Status:** Product import stap is nog TODO. Komt in volgende fase.

**Workaround:** Maak handmatig een Excel met de 63+ velden uit deze documentatie.

---

## Files Overzicht

### Components
```
src/components/SiteGenerator/
├── WizardStep1Company.tsx          # Bedrijfsinfo
├── WizardStep2Design.tsx           # Design voorkeuren
├── WizardStep3Content.tsx          # Content instellingen
├── WizardStep4Features.tsx         # Features selectie
├── WizardStepServices.tsx          # Services management (NEW)
├── WizardStepTestimonials.tsx      # Testimonials (NEW)
├── WizardStepPortfolio.tsx         # Portfolio cases (NEW)
├── WizardStepPricing.tsx           # Pricing packages (NEW)
├── WizardStepContact.tsx           # Contact info (NEW)
├── WizardStepEcommerce.tsx         # E-commerce setup (NEW) ✅
├── WizardStepProductImport.tsx     # Product import (TODO)
└── WizardStep5Generate.tsx         # Genereer & progress
```

### Backend
```
src/app/api/wizard/
├── generate-site/
│   └── route.ts                    # Main generation endpoint ✅
src/app/api/ai/stream/
└── [connectionId]/
    └── route.ts                    # SSE streaming endpoint ✅
src/lib/siteGenerator/
├── types.ts                        # Type definitions ✅
└── SiteGeneratorService.ts         # Generation logic (TODO)
```

### Tests
```
test-wizard.mjs                     # Basic wizard test ✅
test-full-ecommerce.mjs             # Complete e-commerce test ✅
```

---

## Volgende Stappen (TODO)

### Fase 1: Product Import (High Priority)
- [ ] `WizardStepProductImport.tsx` component
- [ ] `ProductTemplateGenerator.ts` service (63+ velden)
- [ ] Excel/CSV download functionaliteit
- [ ] Upload & parse functionaliteit
- [ ] AI verification tijdens import
- [ ] Background processing met progress tracking

### Fase 2: Advanced Page Generation
- [ ] Dynamic page generation o.b.v. services/testimonials/portfolio
- [ ] AI-generated content per pagina
- [ ] SEO optimization per pagina
- [ ] Media handling (images, videos)

### Fase 3: CMS Integration
- [ ] Payload Products collection
- [ ] Variants support
- [ ] Inventory tracking
- [ ] Order management

### Fase 4: Checkout & Payments
- [ ] Checkout flow
- [ ] Payment integrations (Stripe, Mollie, PayPal)
- [ ] Order confirmation emails
- [ ] Invoice generation

---

**🎉 E-commerce Wizard v2.0 is klaar!**

Voor vragen of problemen, check de logs in `logs/pm2-error.log` of `/api/health` endpoint.
