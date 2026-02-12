# Platform Briefing - Analyse & Concrete Implementatie

**Datum:** 11 Februari 2026
**Status:** Beoordeling van modulair shop platform concept
**Doel:** Vertalen van generieke briefing naar concrete implementatie met bestaande code

---

## 📊 Beoordeling van Originele Briefing

### ✅ Wat goed is:
- **Modulaire aanpak** - Past perfect bij Payload's plugin systeem
- **Tenant manifest concept** - Sluit aan bij onze wizard WizardState
- **Fasering** - Logische volgorde van implementatie
- **Monorepo structuur** - Schaalbaar en herbruikbaar
- **Per-klant deploy strategie** - Eenvoudig en praktisch

### ⚠️ Wat concreter moet:
1. **Mist connectie met bestaande wizard** - We hebben al een volledige `WizardState` met 63+ product fields
2. **Geen gebruik van bestaande types** - `src/lib/siteGenerator/types.ts` is al compleet
3. **Geen verwijzing naar bestaande blocks** - Payload heeft al: Content, Banner, CallToAction, etc.
4. **Te generiek** - Spreekt niet over onze specifieke B2C/B2B/Hybrid shop types
5. **Geen concrete generator implementatie** - We hebben al `generate-site/route.ts` werkend
6. **Geen gebruik van 63+ product velden** - Die zijn al volledig gedefinieerd in `docs/WIZARD-ECOMMERCE-FEATURES.md`

---

## 🎯 Concrete Verbeteringen

### 1. Koppel aan Bestaande WizardState

**BESTAAND:** `src/lib/siteGenerator/types.ts`

```typescript
export interface WizardState {
  currentStep: number
  companyInfo: CompanyInfo          // ✅ Al compleet
  design: DesignPreferences         // ✅ Al compleet
  content: ContentOptions           // ✅ Al compleet
  features: Features                // ✅ Al compleet
  ecommerce?: EcommerceSettings     // ✅ Al compleet met shopType, pricing, roles
}

export interface EcommerceSettings {
  shopType: 'b2c' | 'b2b' | 'hybrid'
  pricingStrategy: 'simple' | 'role-based' | 'volume-based' | 'hybrid'
  customRoles: CustomPricingRole[]  // Max 20 roles met priority
  productTemplate: 'basic' | 'advanced' | 'enterprise'
  currency: string
  shippingZones: string[]
  paymentMethods: string[]
  taxRate: number
}

export interface CustomPricingRole {
  id: string
  name: string                      // Max 50 chars
  description: string               // Max 200 chars
  discount: number                  // 0-100%
  priority: number                  // 1-100 (higher = more important)
  isDefault: boolean                // Only one can be default
  minOrderAmount?: number
  validFrom?: string
  validUntil?: string
}
```

**VOORSTEL: Tenant Manifest = WizardState + Deploy Config**

```json
// tenants/acme.json
{
  "slug": "acme",
  "name": "ACME Medical",
  "domain": "acme.example.com",

  // ✅ HERGEBRUIK BESTAANDE WIZARD DATA
  "wizard": {
    "companyInfo": {
      "name": "ACME Medical",
      "businessType": "B2B",
      "industry": "Medical Devices",
      "targetAudience": "Hospitals and healthcare professionals",
      "coreValues": ["Quality", "Innovation", "Reliability"],
      "usps": [
        "24/7 support",
        "Medical certified",
        "Fast delivery"
      ],
      "services": [
        {
          "name": "Installation Service",
          "description": "Professional on-site installation",
          "price": 250
        }
      ],
      "testimonials": [
        {
          "author": "Dr. Smith",
          "role": "Hospital Director",
          "rating": 5,
          "text": "Excellent service and products"
        }
      ],
      "portfolioCases": [
        {
          "title": "Hospital ABC Complete Setup",
          "description": "Full medical equipment installation",
          "client": "Hospital ABC",
          "year": "2025",
          "results": "50+ devices installed successfully"
        }
      ],
      "pricingPackages": [
        {
          "name": "Basic Support",
          "price": 99,
          "interval": "month",
          "features": ["Email support", "Software updates"],
          "highlighted": false
        },
        {
          "name": "Premium Support",
          "price": 299,
          "interval": "month",
          "features": ["24/7 phone support", "Priority handling", "On-site visits"],
          "highlighted": true
        }
      ],
      "contactInfo": {
        "email": "info@acme-medical.com",
        "phone": "+31 20 123 4567",
        "address": {
          "street": "Medical Lane 123",
          "city": "Amsterdam",
          "postalCode": "1000 AB",
          "country": "Netherlands"
        }
      }
    },
    "design": {
      "colorScheme": {
        "primary": "#0A84FF",
        "secondary": "#111827",
        "accent": "#F59E0B"
      },
      "style": "modern",
      "fontPreference": "sans-serif"
    },
    "content": {
      "language": "nl",
      "tone": "professional",
      "pages": ["home", "about", "services", "portfolio", "testimonials", "pricing", "blog", "contact"]
    },
    "features": {
      "contactForm": true,
      "newsletter": true,
      "testimonials": true,
      "faq": true,
      "socialMedia": true,
      "maps": true,
      "cta": true,
      "ecommerce": true
    },
    "ecommerce": {
      "shopType": "b2b",
      "pricingStrategy": "role-based",
      "customRoles": [
        {
          "id": "hospital",
          "name": "Hospital",
          "description": "Large healthcare institutions",
          "discount": 15,
          "priority": 1,
          "isDefault": true,
          "minOrderAmount": 1000
        },
        {
          "id": "clinic",
          "name": "Clinic",
          "description": "Small to medium healthcare facilities",
          "discount": 10,
          "priority": 2,
          "isDefault": false,
          "minOrderAmount": 500
        }
      ],
      "productTemplate": "enterprise",
      "currency": "EUR",
      "shippingZones": ["NL", "BE", "DE", "EU"],
      "paymentMethods": ["ideal", "creditcard", "banktransfer"],
      "taxRate": 21,
      "enableStockManagement": true,
      "enableBackorders": true,
      "enableVariants": true
    }
  },

  // MODULE SELECTIE
  "modules": {
    "core": {
      "enabled": true
    },
    "catalog": {
      "enabled": true,
      "template": "enterprise"
    },
    "accounts": {
      "enabled": true,
      "customRoles": true,
      "requireApproval": true
    },
    "pricing": {
      "enabled": true,
      "strategy": "role-based",
      "showPricesPublic": false
    },
    "cart": {
      "enabled": true,
      "enableQuotes": true
    },
    "orders": {
      "enabled": true,
      "requirePO": true
    },
    "checkout-mollie": {
      "enabled": true
    }
  },

  // DATA IMPORT
  "data": {
    "productImport": {
      "type": "csv",
      "path": "./data/acme/products.csv",
      "mapping": "enterprise"
    }
  },

  // DEPLOY CONFIG
  "deploy": {
    "port": 3016,
    "database": "postgresql://...",
    "env": {
      "MOLLIE_API_KEY": "MOLLIE_API_KEY",
      "SMTP_HOST": "SMTP_HOST"
    }
  }
}
```

---

### 2. Gebruik Bestaande Product Template (63+ velden)

**BESTAAND:** `docs/WIZARD-ECOMMERCE-FEATURES.md` (Enterprise Template)

```typescript
// 63+ VELDEN AL GEDEFINIEERD!
{
  // BASIS (20 velden) ✅
  sku: string
  ean: string
  name: string
  description: string
  shortDescription: string
  brand: string
  manufacturer: string
  category: string
  tags: string[]
  status: 'active' | 'draft' | 'archived'
  featured: boolean
  newArrival: boolean
  bestseller: boolean
  clearance: boolean
  condition: 'new' | 'refurbished' | 'used'
  warranty: string
  weight: number
  dimensions: { length, width, height }
  material: string
  color: string

  // PRICING (8-28 velden, dynamisch op basis van customRoles!) ✅
  basePrice: number
  salePrice: number
  costPrice: number
  msrp: number
  currency: string
  taxClass: string
  roleBasedPrices: [
    {
      role: 'Hospital',        // ✅ Van WizardState.ecommerce.customRoles!
      price: 850,
      minQty: 1
    },
    {
      role: 'Clinic',
      price: 900,
      minQty: 1
    }
  ]
  volumeDiscounts: [
    { minQty: 10, discount: 5 },
    { minQty: 50, discount: 10 }
  ]

  // INVENTORY (6 velden) ✅
  stockQuantity: number
  lowStockThreshold: number
  backorderAllowed: boolean
  backorderText: string
  availableFrom: string
  discontinuedDate: string

  // SHIPPING (5 velden) ✅
  freeShipping: boolean
  shippingCost: number
  shippingClass: string
  deliveryTime: string
  dropShipOnly: boolean

  // MEDIA (5 velden) ✅
  mainImage: string
  galleryImages: string[]
  videoUrl: string
  thumbnailUrl: string
  zoomImage: string

  // VARIANTS (8 velden) ✅
  hasVariants: boolean
  variantType: 'size' | 'color' | 'material' | 'custom'
  variantOptions: string[]
  variantSKUSuffix: string
  variantPriceDelta: number
  variantStockTracking: boolean
  parentProduct: string
  isVariant: boolean

  // SEO (4 velden) ✅
  metaTitle: string
  metaDescription: string
  keywords: string[]
  urlSlug: string

  // SPECIFICATIONS (4+ velden, dynamisch!) ✅
  specifications: [
    {
      key: 'Voltage',
      value: '230V',
      group: 'Technical',
      sortOrder: 1
    },
    {
      key: 'Certification',
      value: 'CE, FDA',
      group: 'Compliance',
      sortOrder: 2
    }
  ]
}
```

**VOORSTEL: Genereer Payload Collection Config**

```typescript
// packages/modules/catalog/collections/Products.ts
import { CollectionConfig } from 'payload'
import { enterpriseProductFields } from '../templates/enterprise'
import { EcommerceSettings } from '@/lib/siteGenerator/types'

export const createProductsCollection = (
  ecommerceConfig: EcommerceSettings
): CollectionConfig => {
  return {
    slug: 'products',
    admin: {
      useAsTitle: 'name',
      defaultColumns: ['name', 'sku', 'basePrice', 'stockQuantity', 'status'],
      group: 'Catalog'
    },
    fields: [
      // ✅ BASIS VELDEN (20)
      {
        name: 'sku',
        type: 'text',
        required: true,
        unique: true,
        admin: { description: 'Unique product identifier' }
      },
      {
        name: 'ean',
        type: 'text',
        admin: { description: 'European Article Number (barcode)' }
      },
      {
        name: 'name',
        type: 'text',
        required: true,
        localized: true
      },
      {
        name: 'description',
        type: 'richText',
        localized: true
      },
      // ... alle 20 basis velden

      // ✅ PRICING VELDEN (dynamisch op basis van customRoles!)
      {
        name: 'basePrice',
        type: 'number',
        required: true,
        admin: {
          description: 'Base price before role discounts',
          step: 0.01
        }
      },
      ...(ecommerceConfig.pricingStrategy === 'role-based' && ecommerceConfig.customRoles?.length > 0
        ? [
            {
              name: 'roleBasedPrices',
              type: 'array' as const,
              admin: {
                description: 'Price per customer role'
              },
              fields: ecommerceConfig.customRoles.map(role => ({
                name: role.id,
                type: 'group' as const,
                label: role.name,
                fields: [
                  {
                    name: 'price',
                    type: 'number' as const,
                    required: true,
                    admin: {
                      description: `Price for ${role.name} (${role.discount}% discount from base)`
                    }
                  },
                  {
                    name: 'minQty',
                    type: 'number' as const,
                    defaultValue: 1,
                    admin: {
                      description: 'Minimum order quantity'
                    }
                  }
                ]
              }))
            }
          ]
        : []
      ),

      // ✅ INVENTORY VELDEN (6)
      {
        name: 'stockQuantity',
        type: 'number',
        required: true,
        defaultValue: 0,
        admin: {
          description: 'Current stock level',
          condition: (data) => ecommerceConfig.enableStockManagement
        }
      },
      {
        name: 'lowStockThreshold',
        type: 'number',
        defaultValue: 10,
        admin: {
          description: 'Alert when stock falls below this level',
          condition: (data) => ecommerceConfig.enableStockManagement
        }
      },
      // ... alle 6 inventory velden

      // ✅ VARIANTS (8 velden, conditioneel)
      ...(ecommerceConfig.enableVariants
        ? [
            {
              name: 'hasVariants',
              type: 'checkbox' as const,
              defaultValue: false
            },
            {
              name: 'variantType',
              type: 'select' as const,
              options: [
                { label: 'Size', value: 'size' },
                { label: 'Color', value: 'color' },
                { label: 'Material', value: 'material' },
                { label: 'Custom', value: 'custom' }
              ],
              admin: {
                condition: (data) => data.hasVariants
              }
            }
            // ... alle 8 variant velden
          ]
        : []
      ),

      // ✅ SPECIFICATIONS (dynamisch!)
      {
        name: 'specifications',
        type: 'array',
        admin: {
          description: 'Technical specifications and attributes'
        },
        fields: [
          {
            name: 'key',
            type: 'text',
            required: true,
            admin: { description: 'Specification name (e.g., "Voltage")' }
          },
          {
            name: 'value',
            type: 'text',
            required: true,
            admin: { description: 'Specification value (e.g., "230V")' }
          },
          {
            name: 'group',
            type: 'select',
            options: [
              { label: 'Technical', value: 'technical' },
              { label: 'Compliance', value: 'compliance' },
              { label: 'Physical', value: 'physical' },
              { label: 'Other', value: 'other' }
            ]
          },
          {
            name: 'sortOrder',
            type: 'number',
            defaultValue: 0
          }
        ]
      }
    ],

    // ✅ ACCESS CONTROL (B2B: alleen ingelogde customers)
    access: {
      read: ({ req }) => {
        if (ecommerceConfig.shopType === 'b2c') return true

        // B2B: requires login
        if (req.user?.role === 'customer') {
          // Check if customer's role allows seeing prices
          const customerRole = ecommerceConfig.customRoles.find(
            r => r.id === req.user.customerRole
          )
          return !!customerRole
        }

        return req.user?.role === 'admin'
      },

      create: ({ req }) => req.user?.role === 'admin',
      update: ({ req }) => req.user?.role === 'admin',
      delete: ({ req }) => req.user?.role === 'admin'
    },

    // ✅ HOOKS voor price calculation
    hooks: {
      beforeChange: [
        async ({ data, req }) => {
          // Auto-calculate role prices if not set
          if (ecommerceConfig.pricingStrategy === 'role-based' && data.basePrice) {
            data.roleBasedPrices = ecommerceConfig.customRoles.map(role => ({
              role: role.id,
              price: data.basePrice * (1 - role.discount / 100),
              minQty: role.minOrderAmount || 1
            }))
          }
          return data
        }
      ]
    }
  }
}
```

---

### 3. Generator Moet Bestaande API Gebruiken

**BESTAAND:** `src/app/api/wizard/generate-site/route.ts`

```typescript
// ✅ DIT WERKT AL! 8 pages in 2.2 seconden
export async function POST(request: NextRequest) {
  const body: GenerateSiteRequest = await request.json()
  const { wizardData, sseConnectionId } = body

  // Generate pages based on wizardData
  await generateSite(wizardData, sseConnectionId)

  return NextResponse.json({
    success: true,
    jobId: `job-${Date.now()}`,
    message: 'Site generation started'
  })
}
```

**VOORSTEL: Generator CLI Hergebruikt Dit**

```typescript
// tools/generator/src/commands/create.ts
import { WizardState } from '@/lib/siteGenerator/types'
import fetch from 'node-fetch'
import { EventSource } from 'eventsource'

export async function createTenant(manifestPath: string) {
  console.log('🚀 Creating new tenant...\n')

  // 1. Load & validate manifest
  const manifest = await loadManifest(manifestPath)
  console.log(`✅ Loaded manifest for: ${manifest.name}`)

  // 2. Convert manifest → WizardState (hergebruik bestaande types!)
  const wizardData: WizardState = {
    currentStep: 1,
    companyInfo: manifest.wizard.companyInfo,
    design: manifest.wizard.design,
    content: manifest.wizard.content,
    features: manifest.wizard.features,
    ecommerce: manifest.wizard.ecommerce
  }

  // 3. Create app directory
  const appDir = `customers/${manifest.slug}`
  await copyTemplate('apps/template-shop', appDir)
  console.log(`✅ Created app directory: ${appDir}`)

  // 4. Generate .env file
  await generateEnvFile(appDir, manifest)
  console.log(`✅ Generated .env file`)

  // 5. Install dependencies
  console.log('📦 Installing dependencies...')
  await execAsync('pnpm install', { cwd: appDir })

  // 6. Generate Payload config per module
  console.log('⚙️  Generating Payload config...')
  const payloadConfig = await generatePayloadConfig(manifest.modules, wizardData)
  await writeFile(`${appDir}/payload.config.ts`, payloadConfig)
  console.log(`✅ Generated Payload config with ${Object.keys(manifest.modules).length} modules`)

  // 7. Start dev server temporarily for generation
  console.log('🔧 Starting dev server...')
  const serverProcess = spawn('pnpm', ['dev'], {
    cwd: appDir,
    env: { ...process.env, PORT: manifest.deploy.port.toString() }
  })

  // Wait for server to be ready
  await waitForServer(`http://localhost:${manifest.deploy.port}`)
  console.log(`✅ Server running on port ${manifest.deploy.port}`)

  // 8. Generate content via BESTAANDE API! ✅
  console.log('📝 Generating initial content...')
  const sseConnectionId = `gen-${Date.now()}`

  // Setup SSE listener
  const eventSource = new EventSource(
    `http://localhost:${manifest.deploy.port}/api/ai/stream/${sseConnectionId}`
  )

  let progressLog = []
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'progress') {
      console.log(`   Progress: ${data.progress}% - ${data.message}`)
      progressLog.push(data)
    } else if (data.type === 'complete') {
      console.log(`✅ Content generation complete!`)
      console.log(`   Pages created: ${data.data.pages.length}`)
      eventSource.close()
    }
  }

  // Trigger generation
  const response = await fetch(
    `http://localhost:${manifest.deploy.port}/api/wizard/generate-site`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wizardData, sseConnectionId })
    }
  )

  const result = await response.json()
  console.log(`✅ Generation job started: ${result.jobId}`)

  // Wait for completion
  await new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (eventSource.readyState === EventSource.CLOSED) {
        clearInterval(checkInterval)
        resolve()
      }
    }, 500)
  })

  // 9. Run migrations
  console.log('🔄 Running migrations...')
  await runMigrations(appDir, manifest.modules)
  console.log(`✅ Migrations complete`)

  // 10. Import products (CSV met 63+ kolommen!)
  if (manifest.data?.productImport) {
    console.log('📦 Importing products...')
    const imported = await importProducts(
      manifest.data.productImport.path,
      wizardData.ecommerce,
      `http://localhost:${manifest.deploy.port}`
    )
    console.log(`✅ Imported ${imported} products`)
  }

  // 11. Stop dev server
  serverProcess.kill()

  // 12. Setup PM2 for production
  console.log('🚀 Setting up PM2...')
  await setupPM2(appDir, manifest)
  console.log(`✅ PM2 configured`)

  // 13. Print summary
  console.log('\n🎉 Tenant created successfully!\n')
  console.log('📊 Summary:')
  console.log(`   Name: ${manifest.name}`)
  console.log(`   Slug: ${manifest.slug}`)
  console.log(`   Port: ${manifest.deploy.port}`)
  console.log(`   Modules: ${Object.keys(manifest.modules).filter(k => manifest.modules[k].enabled).join(', ')}`)
  console.log(`   Pages: ${progressLog.find(p => p.type === 'complete')?.data?.pages?.length || 0}`)
  console.log(`\n🌐 URLs:`)
  console.log(`   Frontend: http://localhost:${manifest.deploy.port}`)
  console.log(`   Admin: http://localhost:${manifest.deploy.port}/admin`)
  console.log(`\n🔧 Next steps:`)
  console.log(`   1. cd ${appDir}`)
  console.log(`   2. pnpm pm2:start`)
  console.log(`   3. Open http://localhost:${manifest.deploy.port}`)
  console.log(`   4. Import additional data if needed`)
}
```

---

### 4. CSV Import Met 63+ Kolommen

```typescript
// tools/generator/src/import/products.ts
import { EcommerceSettings } from '@/lib/siteGenerator/types'
import Papa from 'papaparse'

export async function importProducts(
  csvPath: string,
  ecommerceConfig: EcommerceSettings,
  serverUrl: string
): Promise<number> {

  // 1. Parse CSV
  const csv = await readFile(csvPath, 'utf-8')
  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true
  })

  console.log(`   Found ${parsed.data.length} products in CSV`)

  let imported = 0

  // 2. Process each row
  for (const row of parsed.data) {
    try {
      const product = mapCSVToProduct(row, ecommerceConfig)

      // 3. Create product via Payload API
      const response = await fetch(`${serverUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY}`
        },
        body: JSON.stringify(product)
      })

      if (response.ok) {
        imported++
        if (imported % 10 === 0) {
          console.log(`   Imported ${imported}/${parsed.data.length} products...`)
        }
      } else {
        const error = await response.json()
        console.error(`   Failed to import ${row.SKU}: ${error.message}`)
      }

    } catch (error) {
      console.error(`   Error processing ${row.SKU}:`, error.message)
    }
  }

  return imported
}

function mapCSVToProduct(row: any, config: EcommerceSettings) {
  const product: any = {
    // ✅ BASIS VELDEN (20)
    sku: row.SKU,
    ean: row.EAN,
    name: row.Name,
    description: row.Description,
    shortDescription: row.ShortDescription,
    brand: row.Brand,
    manufacturer: row.Manufacturer,
    category: row.Category,
    tags: row.Tags?.split(',').map(t => t.trim()) || [],
    status: row.Status || 'active',
    featured: row.Featured === 'true',
    newArrival: row.NewArrival === 'true',
    bestseller: row.Bestseller === 'true',
    clearance: row.Clearance === 'true',
    condition: row.Condition || 'new',
    warranty: row.Warranty,
    weight: parseFloat(row.Weight) || 0,
    dimensions: {
      length: parseFloat(row.Length) || 0,
      width: parseFloat(row.Width) || 0,
      height: parseFloat(row.Height) || 0
    },
    material: row.Material,
    color: row.Color,

    // ✅ PRICING VELDEN (8-28, dynamisch!)
    basePrice: parseFloat(row.BasePrice),
    salePrice: row.SalePrice ? parseFloat(row.SalePrice) : null,
    costPrice: row.CostPrice ? parseFloat(row.CostPrice) : null,
    msrp: row.MSRP ? parseFloat(row.MSRP) : null,
    currency: config.currency,
    taxClass: row.TaxClass || 'standard',
  }

  // ✅ Role-based pricing (dynamisch op basis van customRoles!)
  if (config.pricingStrategy === 'role-based' && config.customRoles?.length > 0) {
    product.roleBasedPrices = config.customRoles.map(role => {
      // Check if CSV has specific column for this role
      const rolePrice = row[`Price_${role.id}`]
      const calculatedPrice = rolePrice
        ? parseFloat(rolePrice)
        : product.basePrice * (1 - role.discount / 100)

      return {
        role: role.id,
        price: calculatedPrice,
        minQty: role.minOrderAmount || 1
      }
    })
  }

  // ✅ Volume discounts
  if (row.VolumeDiscounts) {
    product.volumeDiscounts = JSON.parse(row.VolumeDiscounts)
  }

  // ✅ INVENTORY VELDEN (6)
  if (config.enableStockManagement) {
    product.stockQuantity = parseInt(row.StockQuantity) || 0
    product.lowStockThreshold = parseInt(row.LowStockThreshold) || 10
    product.backorderAllowed = row.BackorderAllowed === 'true'
    product.backorderText = row.BackorderText
    product.availableFrom = row.AvailableFrom
    product.discontinuedDate = row.DiscontinuedDate
  }

  // ✅ SHIPPING VELDEN (5)
  product.freeShipping = row.FreeShipping === 'true'
  product.shippingCost = row.ShippingCost ? parseFloat(row.ShippingCost) : 0
  product.shippingClass = row.ShippingClass || 'standard'
  product.deliveryTime = row.DeliveryTime
  product.dropShipOnly = row.DropShipOnly === 'true'

  // ✅ MEDIA VELDEN (5)
  product.mainImage = row.MainImage
  product.galleryImages = row.GalleryImages?.split(',').map(img => img.trim()) || []
  product.videoUrl = row.VideoUrl
  product.thumbnailUrl = row.ThumbnailUrl
  product.zoomImage = row.ZoomImage

  // ✅ VARIANTS VELDEN (8)
  if (config.enableVariants && row.HasVariants === 'true') {
    product.hasVariants = true
    product.variantType = row.VariantType
    product.variantOptions = row.VariantOptions?.split(',').map(v => v.trim()) || []
    product.variantSKUSuffix = row.VariantSKUSuffix
    product.variantPriceDelta = row.VariantPriceDelta ? parseFloat(row.VariantPriceDelta) : 0
    product.variantStockTracking = row.VariantStockTracking === 'true'
    product.parentProduct = row.ParentProduct
    product.isVariant = row.IsVariant === 'true'
  }

  // ✅ SEO VELDEN (4)
  product.metaTitle = row.MetaTitle || row.Name
  product.metaDescription = row.MetaDescription || row.ShortDescription
  product.keywords = row.Keywords?.split(',').map(k => k.trim()) || []
  product.urlSlug = row.URLSlug || row.Name.toLowerCase().replace(/\s+/g, '-')

  // ✅ SPECIFICATIONS (dynamisch!)
  if (row.Specifications) {
    try {
      product.specifications = JSON.parse(row.Specifications)
    } catch {
      // Parse from CSV format: "key1:value1|key2:value2|..."
      product.specifications = row.Specifications.split('|').map((spec, index) => {
        const [key, value] = spec.split(':')
        return {
          key: key.trim(),
          value: value.trim(),
          group: 'general',
          sortOrder: index
        }
      })
    }
  }

  return product
}
```

**CSV Template (63+ kolommen):**

```csv
SKU,EAN,Name,Description,ShortDescription,Brand,Manufacturer,Category,Tags,Status,Featured,NewArrival,Bestseller,Clearance,Condition,Warranty,Weight,Length,Width,Height,Material,Color,BasePrice,SalePrice,CostPrice,MSRP,TaxClass,Price_hospital,Price_clinic,VolumeDiscounts,StockQuantity,LowStockThreshold,BackorderAllowed,BackorderText,AvailableFrom,DiscontinuedDate,FreeShipping,ShippingCost,ShippingClass,DeliveryTime,DropShipOnly,MainImage,GalleryImages,VideoUrl,ThumbnailUrl,ZoomImage,HasVariants,VariantType,VariantOptions,VariantSKUSuffix,VariantPriceDelta,VariantStockTracking,ParentProduct,IsVariant,MetaTitle,MetaDescription,Keywords,URLSlug,Specifications
MED-001,1234567890123,Medical Device XR-100,Complete description...,Short desc,ACME,ACME Medical,Medical Devices,"medical,device,xr",active,true,false,true,false,new,2 years,5.5,30,20,15,Plastic,White,1000,850,600,1200,standard,850,900,"[{""minQty"":10,""discount"":5}]",50,10,true,Available on backorder,2025-01-01,,true,0,standard,2-3 days,false,/media/med-001.jpg,"/media/med-001-1.jpg,/media/med-001-2.jpg",,,,,,,,,,,false,Medical Device XR-100 | ACME Medical,Professional medical device with 2 years warranty,"medical,device,healthcare",medical-device-xr-100,"Voltage:230V|Certification:CE FDA|Power:500W"
```

---

### 5. Module Interface (Payload 3.x Plugins)

```typescript
// packages/modules/types.ts
import { Config } from 'payload'
import { EcommerceSettings } from '@/lib/siteGenerator/types'

export interface ModuleDefinition {
  slug: string
  version: string
  dependencies: string[]

  // ✅ Payload 3.x plugin interface
  extend(config: Config, options: ModuleOptions): Config
}

export interface ModuleOptions {
  ecommerce?: EcommerceSettings
  manifest?: any
  [key: string]: any
}

// packages/modules/catalog/index.ts
import { ModuleDefinition } from '../types'
import { createProductsCollection } from './collections/Products'
import { createCategoriesCollection } from './collections/Categories'

export const catalogModule: ModuleDefinition = {
  slug: 'catalog',
  version: '1.0.0',
  dependencies: ['core'],

  extend(config, options) {
    const { ecommerce } = options

    if (!ecommerce) {
      throw new Error('Catalog module requires ecommerce configuration')
    }

    return {
      ...config,
      collections: [
        ...config.collections,
        createProductsCollection(ecommerce),  // ✅ 63+ velden!
        createCategoriesCollection()
      ],
      endpoints: [
        ...config.endpoints,
        {
          path: '/products/search',
          method: 'get',
          handler: async (req, res) => {
            // Product search endpoint
          }
        }
      ]
    }
  }
}

// packages/modules/pricing/index.ts
export const pricingModule: ModuleDefinition = {
  slug: 'pricing',
  version: '1.0.0',
  dependencies: ['catalog', 'accounts'],

  extend(config, options) {
    const { ecommerce } = options

    return {
      ...config,
      endpoints: [
        ...config.endpoints,
        {
          path: '/pricing/calculate',
          method: 'post',
          handler: async (req, res) => {
            const { productId, customerId, quantity } = req.body

            // Get customer role
            const customer = await req.payload.findByID({
              collection: 'customers',
              id: customerId
            })

            // Get product with role-based prices
            const product = await req.payload.findByID({
              collection: 'products',
              id: productId
            })

            // Calculate price based on role and quantity
            const role = ecommerce.customRoles.find(r => r.id === customer.role)
            const rolePrice = product.roleBasedPrices.find(p => p.role === role.id)

            let finalPrice = rolePrice?.price || product.basePrice

            // Apply volume discounts
            const volumeDiscount = product.volumeDiscounts
              .filter(vd => quantity >= vd.minQty)
              .sort((a, b) => b.minQty - a.minQty)[0]

            if (volumeDiscount) {
              finalPrice *= (1 - volumeDiscount.discount / 100)
            }

            res.json({
              basePrice: product.basePrice,
              rolePrice: rolePrice?.price,
              volumeDiscount: volumeDiscount?.discount,
              finalPrice,
              quantity,
              total: finalPrice * quantity,
              currency: ecommerce.currency,
              taxRate: ecommerce.taxRate,
              totalWithTax: (finalPrice * quantity) * (1 + ecommerce.taxRate / 100)
            })
          }
        }
      ],
      hooks: [
        ...config.hooks,
        {
          collection: 'products',
          beforeChange: [
            async ({ data, req }) => {
              // Auto-calculate role prices if not manually set
              if (ecommerce.pricingStrategy === 'role-based' && data.basePrice) {
                data.roleBasedPrices = ecommerce.customRoles.map(role => ({
                  role: role.id,
                  price: data.basePrice * (1 - role.discount / 100),
                  minQty: role.minOrderAmount || 1
                }))
              }
              return data
            }
          ]
        }
      ]
    }
  }
}
```

---

## 📝 CONCRETE Actiestappen

### ✅ Wat al klaar is:

1. **WizardState types** - Compleet met 63+ product velden
2. **Site generator API** - Werkend op `/api/wizard/generate-site`
3. **SSE streaming** - Real-time progress updates
4. **PM2 deployment** - Production-ready op poort 3016
5. **Documentation** - `WIZARD-ECOMMERCE-FEATURES.md` compleet
6. **Content blocks** - Content, Banner, CallToAction werkend
7. **Rich text fix** - `richText:` property correct

### 🔨 Fase 1: Module Foundation (Week 1)

```bash
# 1. Reorganiseer naar monorepo
mkdir -p packages/modules/{core,catalog,accounts,cart,orders,pricing}
mkdir -p tools/generator/src/{commands,import,config}
mkdir -p tenants

# 2. Extract types naar shared package
mkdir -p packages/types/src
mv src/lib/siteGenerator/types.ts packages/types/src/wizard.ts

# 3. Create module interface
cat > packages/modules/types.ts << 'EOF'
import { Config } from 'payload'
import { EcommerceSettings } from '@payload-types/wizard'

export interface ModuleDefinition {
  slug: string
  version: string
  dependencies: string[]
  extend(config: Config, options: ModuleOptions): Config
}

export interface ModuleOptions {
  ecommerce?: EcommerceSettings
  manifest?: any
}
EOF

# 4. Extract enterprise template (63+ velden!)
mkdir -p packages/modules/catalog/templates
cat > packages/modules/catalog/templates/enterprise.ts << 'EOF'
// Bevat alle 63+ velden uit WIZARD-ECOMMERCE-FEATURES.md
export const enterpriseProductFields = [ /* ... */ ]
EOF
```

### 🔨 Fase 2: Catalog Module (Week 2)

```bash
# 1. Build Products collection met 63+ velden
cat > packages/modules/catalog/collections/Products.ts << 'EOF'
import { CollectionConfig } from 'payload'
import { enterpriseProductFields } from '../templates/enterprise'
import { EcommerceSettings } from '@payload-types/wizard'

export const createProductsCollection = (
  ecommerce: EcommerceSettings
): CollectionConfig => {
  // Implementatie zoals hierboven beschreven
}
EOF

# 2. Build Categories collection
cat > packages/modules/catalog/collections/Categories.ts << 'EOF'
export const createCategoriesCollection = (): CollectionConfig => { /* ... */ }
EOF

# 3. Module index
cat > packages/modules/catalog/index.ts << 'EOF'
export const catalogModule: ModuleDefinition = { /* ... */ }
EOF
```

### 🔨 Fase 3: Generator CLI (Week 3)

```bash
# 1. Setup generator project
cd tools/generator
pnpm init
pnpm add commander zod chalk ora

# 2. Create CLI
cat > src/cli.ts << 'EOF'
#!/usr/bin/env node
import { Command } from 'commander'
import { createTenant } from './commands/create'

const program = new Command()

program
  .name('gen')
  .description('Payload shop generator CLI')
  .version('1.0.0')

program
  .command('create <slug>')
  .description('Create new tenant from manifest')
  .option('-m, --manifest <path>', 'Path to tenant manifest', 'tenants/<slug>.json')
  .option('-p, --port <port>', 'Port number', '3016')
  .action(createTenant)

program.parse()
EOF

# 3. Build create command (gebruik bestaande API!)
cat > src/commands/create.ts << 'EOF'
export async function createTenant(slug: string, options: any) {
  // Implementatie zoals hierboven beschreven
}
EOF
```

### 🔨 Fase 4: CSV Import (Week 4)

```bash
# 1. Build product importer
cat > tools/generator/src/import/products.ts << 'EOF'
import Papa from 'papaparse'

export async function importProducts(
  csvPath: string,
  ecommerceConfig: EcommerceSettings,
  serverUrl: string
): Promise<number> {
  // Implementatie zoals hierboven beschreven
}

function mapCSVToProduct(row: any, config: EcommerceSettings) {
  // Map alle 63+ kolommen!
}
EOF

# 2. Create CSV template generator
cat > tools/generator/src/import/generate-template.ts << 'EOF'
export function generateCSVTemplate(config: EcommerceSettings): string {
  const headers = [
    // BASIS (20)
    'SKU', 'EAN', 'Name', /* ... */,

    // PRICING (dynamisch per role!)
    'BasePrice', 'SalePrice',
    ...config.customRoles.map(role => `Price_${role.id}`),

    // INVENTORY (6)
    'StockQuantity', /* ... */,

    // etc... alle 63+ kolommen
  ]

  return headers.join(',') + '\n'
}
EOF
```

---

## 🎯 Test Scenario

### Complete End-to-End Test:

```bash
# 1. Create ACME tenant
npx gen create acme \
  --manifest=tenants/acme.json \
  --port=3016

# Output:
# 🚀 Creating new tenant...
# ✅ Loaded manifest for: ACME Medical
# ✅ Created app directory: customers/acme
# ✅ Generated .env file
# 📦 Installing dependencies...
# ⚙️  Generating Payload config...
# ✅ Generated Payload config with 7 modules
# 🔧 Starting dev server...
# ✅ Server running on port 3016
# 📝 Generating initial content...
#    Progress: 10% - Bedrijfscontext analyseren...
#    Progress: 20% - Home pagina genereren...
#    Progress: 40% - Home pagina aangemaakt
#    Progress: 60% - services pagina genereren...
#    Progress: 100% - Website succesvol gegenereerd!
# ✅ Content generation complete!
#    Pages created: 8
# 🔄 Running migrations...
# ✅ Migrations complete
# 📦 Importing products...
#    Found 150 products in CSV
#    Imported 10/150 products...
#    Imported 20/150 products...
#    ...
#    Imported 150/150 products...
# ✅ Imported 150 products
# 🚀 Setting up PM2...
# ✅ PM2 configured
#
# 🎉 Tenant created successfully!
#
# 📊 Summary:
#    Name: ACME Medical
#    Slug: acme
#    Port: 3016
#    Modules: core, catalog, accounts, pricing, cart, orders, checkout-mollie
#    Pages: 8
#    Products: 150
#
# 🌐 URLs:
#    Frontend: http://localhost:3016
#    Admin: http://localhost:3016/admin
#
# 🔧 Next steps:
#    1. cd customers/acme
#    2. pnpm pm2:start
#    3. Open http://localhost:3016
#    4. Login: admin@acme.com / [generated password]

# 2. Create second tenant (Beta Medical)
npx gen create beta-medical \
  --manifest=tenants/beta-medical.json \
  --port=3017

# 3. Verify isolation
curl http://localhost:3016/api/products  # ACME products
curl http://localhost:3017/api/products  # Beta products (different!)

# 4. Test role-based pricing
curl -X POST http://localhost:3016/api/pricing/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "...",
    "customerId": "...",
    "quantity": 10
  }'

# Response:
{
  "basePrice": 1000,
  "rolePrice": 850,        // Hospital role (15% discount)
  "volumeDiscount": 5,     // 10+ qty discount
  "finalPrice": 807.50,
  "quantity": 10,
  "total": 8075.00,
  "currency": "EUR",
  "taxRate": 21,
  "totalWithTax": 9770.75
}
```

---

## 📚 Deliverables

### 1. Working Generator CLI

```bash
npx gen --help

Commands:
  create <slug>       Create new tenant from manifest
  migrate <slug>      Run migrations for tenant
  import <slug>       Import data (products, categories)
  doctor <slug>       Check tenant health
  list                List all tenants
  delete <slug>       Delete tenant
```

### 2. Complete Module System

```
packages/modules/
├── core/              ✅ Users, Media, Pages, Navigation
├── catalog/           ✅ Products (63+ velden!), Categories
├── accounts/          ✅ Customers, CustomerGroups, Addresses
├── pricing/           ✅ Role-based, Volume discounts
├── cart/              ✅ Carts, CartItems
├── orders/            ✅ Orders, OrderItems, Status flow
└── checkout-mollie/   ✅ Payment integration
```

### 3. Example Tenants

```
tenants/
├── acme.json          ✅ B2B Medical (2 roles, enterprise template)
└── beta-medical.json  ✅ B2C Shop (simple pricing)
```

### 4. Documentation

```
docs/
├── PLATFORM-BRIEFING-ANALYSIS.md       ✅ Dit document
├── WIZARD-ECOMMERCE-FEATURES.md        ✅ Al compleet
├── MODULE-DEVELOPMENT-GUIDE.md         🔨 TODO
├── GENERATOR-CLI-GUIDE.md              🔨 TODO
├── CSV-IMPORT-GUIDE.md                 🔨 TODO
└── DEPLOYMENT-GUIDE.md                 🔨 TODO
```

---

## ✅ Acceptance Criteria

Een tenant is **"Production Ready"** als:

1. ✅ `npx gen create <slug>` werkt end-to-end zonder errors
2. ✅ Admin UI toont alleen relevante collections per module
3. ✅ Alle 63+ product velden zijn beschikbaar (enterprise template)
4. ✅ Role-based pricing werkt correct voor alle customRoles
5. ✅ CSV import werkt met alle 63+ kolommen
6. ✅ SSE streaming toont real-time progress tijdens generatie
7. ✅ PM2 deployment werkt met auto-restart
8. ✅ Content generation maakt 8+ pages in <5 seconden
9. ✅ Products zijn searchable/filterable
10. ✅ Customer login werkt met role-specific pricing
11. ✅ Cart → Order flow werkt
12. ✅ Payment webhook (Mollie) werkt
13. ✅ Multi-tenant isolation is gegarandeerd (separate DBs/schemas)

---

## 🚀 Volgende Stappen

### Kies één van deze paden:

**A) Module System First** ⭐ (Aanbevolen)
- Extract WizardState → `packages/types`
- Build `catalog` module met 63+ velden
- Test met bestaande generator
- **Tijdsinvestatie:** 3-5 dagen

**B) Generator CLI First**
- Build `create` command met manifest parsing
- Integreer met bestaande `/api/wizard/generate-site`
- Add CSV import
- **Tijdsinvestatie:** 2-3 dagen

**C) Complete MVP (A + B)**
- Both module system + generator
- End-to-end working voor 1 tenant
- **Tijdsinvestatie:** 1 week

**D) Documentation First**
- Write complete module development guide
- CSV import guide met all 63+ kolommen
- Deployment guide
- **Tijdsinvestatie:** 1-2 dagen

---

## 📞 Support & Resources

### Bestaande Files (Reference):
- `src/lib/siteGenerator/types.ts` - WizardState definitie
- `docs/WIZARD-ECOMMERCE-FEATURES.md` - 63+ product velden
- `src/app/api/wizard/generate-site/route.ts` - Generator API
- `src/app/api/ai/stream/[connectionId]/route.ts` - SSE streaming
- `src/middleware.ts` - Rate limiting (wizard exempt)
- `test-full-ecommerce.mjs` - Complete test scenario

### Next Session Focus:
1. Module interface finalization
2. Catalog module implementation (63+ velden)
3. Generator CLI `create` command
4. CSV import met field mapping

---

**Laatste update:** 11 Februari 2026
**Auteur:** Claude (with extensive codebase context)
**Status:** Ready for implementation 🚀
