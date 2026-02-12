# @payload-shop/types

Shared TypeScript types voor het Payload shop platform.

## Installatie

```bash
pnpm add @payload-shop/types
```

## Usage

### Wizard Types

```typescript
import type { WizardState, EcommerceSettings, ProductTemplate } from '@payload-shop/types'

const wizardData: WizardState = {
  currentStep: 1,
  companyInfo: {
    name: 'My Store',
    businessType: 'E-commerce',
    // ...
  },
  // ...
}
```

### Module Types

```typescript
import type { ModuleDefinition, TenantConfig } from '@payload-shop/types'

const catalogModule: ModuleDefinition = {
  id: 'catalog',
  name: 'Product Catalog',
  version: '1.0.0',
  backend: {
    collections: [/* ... */],
  },
  frontend: {
    components: {
      ProductCard: {
        path: './components/ProductCard',
        description: 'Product card component',
      },
    },
  },
}
```

### Product Types (63+ velden)

```typescript
import type { Product, ProductCategory, ProductImportMapping } from '@payload-shop/types'

const product: Product = {
  id: '1',
  sku: 'PROD-001',
  name: 'Premium Product',
  pricing: {
    basePrice: 99.99,
    currency: 'EUR',
    rolePrices: [
      { roleId: 'wholesale', roleName: 'Wholesale', price: 79.99 },
    ],
  },
  inventory: {
    trackStock: true,
    stockQuantity: 100,
    stockStatus: 'in-stock',
  },
  // ... 50+ meer velden
}
```

## Exports

### `/wizard` - Wizard Types
- `WizardState` - Complete wizard state (5 stappen)
- `CompanyInfo` - Bedrijfsinformatie
- `EcommerceSettings` - E-commerce configuratie (B2C/B2B/Hybrid)
- `CustomPricingRole` - Custom pricing roles (max 20)
- `ProductTemplate` - Product template types
- `ProductTemplateColumn` - CSV import kolom definitie

### `/modules` - Module System
- `ModuleDefinition` - Module definitie (backend + frontend)
- `ModuleRegistry` - Module registry
- `TenantConfig` - Tenant configuratie

### `/product` - Product Types
- `Product` - Enterprise product (63+ velden)
- `ProductCategory` - Product categorie
- `ProductCollection` - Product collectie
- `ProductReview` - Product review
- `ProductImportMapping` - CSV import mapping

## Features

### ✅ Complete Type Safety
Alle types zijn 100% type-safe met TypeScript strict mode.

### ✅ Enterprise Product Support
Product type met 63+ velden:
- 20 Basis velden (SKU, EAN, Name, Brand, etc.)
- 8-28 Pricing velden (role-based, volume, currency)
- 6 Inventory velden
- 5 Shipping velden
- 5 Media velden
- 8 Variants velden
- 4 SEO velden
- 4+ Specifications velden (dynamic)

### ✅ B2B/B2C/Hybrid Support
- Custom pricing roles (max 20, priority-based)
- Volume pricing tiers
- Role-based pricing
- MOQ (Minimum Order Quantity)
- Quotation required
- Contract pricing

### ✅ Module System
- Backend: Payload collections + API endpoints
- Frontend: React components + Next.js pages
- Configuration schema per module
- Dependency management

### ✅ Multi-Tenant
- Per-tenant module configuration
- Per-tenant theming
- Geïsoleerde data

## Development

```bash
# Build types
cd packages/types
pnpm build

# Watch mode
pnpm dev
```

## License

MIT
