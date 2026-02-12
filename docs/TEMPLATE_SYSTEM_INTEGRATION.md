# Template System Integration

## Overview

The template system allows provisioning of client sites with pre-configured features, collections, blocks, and plugins based on the selected template.

## Available Templates

### 1. E-commerce Store (`ecommerce`)
- **Collections:** Products, Product Categories, Product Brands, Orders, Customers, Blog Posts
- **Blocks:** Product Grid, Category Grid, Search Bar, Quick Order, Hero, CTA, Testimonials, FAQ
- **Features:** Full e-commerce, Blog, Forms, Authentication, AI
- **Best For:** Online stores, B2C e-commerce

### 2. Blog & Magazine (`blog`)
- **Collections:** Blog Posts, Blog Categories, Authors, Pages
- **Blocks:** Hero, Content, Grid, Testimonials, FAQ, CTA
- **Features:** Content-first publishing, Forms, Authentication, AI
- **Best For:** Content websites, magazines, news sites

### 3. B2B Platform (`b2b`)
- **Collections:** Products, Quotes, Customers, Orders
- **Blocks:** Product Grid, Quick Order, Search Bar, Top Bar
- **Features:** Quote system, Bulk ordering, Account management, AI
- **Best For:** B2B portals, wholesale platforms, quote-based sales

### 4. Portfolio & Agency (`portfolio`)
- **Collections:** Cases, Services, Team, Pages
- **Blocks:** Hero, Grid, Feature Grid, Testimonials, CTA
- **Features:** Project showcase, Blog, Forms, AI
- **Best For:** Creative agencies, freelance portfolios, service companies

### 5. Corporate Website (`corporate`)
- **Collections:** Services, Team, Cases, Pages
- **Blocks:** Hero, Content, Feature Grid, Testimonials, FAQ
- **Features:** Company information, Services, Blog, Forms, AI
- **Best For:** Corporate sites, professional services, company websites

## How It Works

### 1. Template Selection

When creating a new client via the Global Admin UI:

```typescript
// User selects template in AddClientModal
{
  template: 'ecommerce',
  clientName: 'ACME Corp',
  contactEmail: 'admin@acme.com',
  domain: 'acme'
}
```

### 2. Template Loading

During provisioning, the template configuration is loaded:

```typescript
// src/platform/services/provisioning.ts
import { getTemplate } from '@/templates'

const template = getTemplate(request.template)
// Returns TemplateConfig with collections, blocks, features, etc.
```

### 3. Environment Generation

Template settings are included in environment variables:

```typescript
// src/templates/config-generator.ts
export function generateClientEnvironment(data: {
  clientName: string
  domain: string
  databaseUrl: string
  template: TemplateConfig
  adminEmail: string
  customVars?: Record<string, string>
}): Record<string, string>
```

**Generated variables:**
- `TEMPLATE_ID` - Template identifier
- `ENABLED_COLLECTIONS` - Comma-separated list of collections
- `ENABLED_BLOCKS` - Comma-separated list of blocks
- `ENABLED_FEATURES` - JSON string of feature flags
- `DEFAULT_SETTINGS` - JSON string of template settings
- Plus all standard environment variables (DATABASE_URL, PAYLOAD_SECRET, etc.)

### 4. Client Customization

Clients can customize their template:

```typescript
// Disable specific collections from template
{
  template: 'ecommerce',
  disabledCollections: ['blog-posts', 'blog-categories']
}

// Enable additional features
{
  template: 'blog',
  enabledFeatures: ['ecommerce', 'multiLanguage']
}

// Custom settings
{
  template: 'ecommerce',
  customSettings: {
    showComparePrice: false,
    enableWishlist: true,
    currency: 'USD'
  }
}
```

## Template Configuration

### File: `src/templates/index.ts`

Defines all template configurations:

```typescript
export interface TemplateConfig {
  id: string                      // Template identifier
  name: string                    // Display name
  description: string             // Template description
  collections: string[]           // Enabled collections
  blocks: string[]               // Available blocks
  plugins: string[]              // Active plugins
  globals: string[]              // Global settings
  features: {                    // Feature flags
    ecommerce?: boolean
    blog?: boolean
    forms?: boolean
    authentication?: boolean
    multiLanguage?: boolean
    ai?: boolean
  }
  defaultSettings?: Record<string, any>  // Template-specific settings
}
```

### Example: E-commerce Template

```typescript
export const ecommerceTemplate: TemplateConfig = {
  id: 'ecommerce',
  name: 'E-commerce Store',
  description: 'Complete online store with products, cart, checkout',
  collections: [
    'pages', 'media', 'users',
    'products', 'product-categories', 'product-brands',
    'orders', 'customers',
    'blog-posts', 'blog-categories'
  ],
  blocks: [
    'hero', 'content', 'grid', 'cta',
    'product-grid', 'category-grid', 'search-bar', 'quick-order',
    'testimonials', 'faq'
  ],
  plugins: ['seo', 'form-builder', 'redirects'],
  globals: ['header', 'footer', 'site-settings'],
  features: {
    ecommerce: true,
    blog: true,
    forms: true,
    authentication: true,
    ai: true
  },
  defaultSettings: {
    currency: 'EUR',
    locale: 'nl-NL',
    enableCart: true,
    enableCheckout: true
  }
}
```

## Dynamic Config Generation

### File: `src/templates/config-generator.ts`

Generates Payload configuration based on template:

```typescript
export async function generatePayloadConfig(
  template: TemplateConfig,
  options?: {
    enabledFeatures?: string[]
    disabledCollections?: string[]
    customSettings?: Record<string, any>
  }
): Promise<Partial<Config>>
```

**Features:**
- Lazy loading of collections, blocks, plugins
- Registry-based imports
- Conditional loading based on template
- Custom feature toggles
- Settings merging

## Integration with Provisioning

The template system is fully integrated with the provisioning flow:

### Step-by-Step Integration

1. **User selects template** in AddClientModal
2. **Template validated** in `provisionClient()`
3. **Template loaded** via `getTemplate()`
4. **Environment generated** with template settings
5. **Deployment** to Vercel with environment variables
6. **Client saved** with template ID in database
7. **Client site** uses environment variables to configure Payload CMS

### Example Flow

```typescript
// 1. User input
const request = {
  clientName: 'ACME Corp',
  template: 'ecommerce',
  domain: 'acme'
}

// 2. Load template
const template = getTemplate('ecommerce')

// 3. Generate environment
const environment = generateClientEnvironment({
  clientName: 'ACME Corp',
  domain: 'acme',
  databaseUrl: 'postgresql://...',
  template,
  adminEmail: 'admin@acme.com'
})

// 4. Deploy to Vercel
await deployToVercel({
  name: 'acme',
  environment,  // Contains TEMPLATE_ID, ENABLED_COLLECTIONS, etc.
  template
})

// 5. Client site reads environment variables
// and configures Payload CMS accordingly
```

## Client-Side Template Loading

On the client site, the template configuration is loaded from environment variables:

```typescript
// In client's payload.config.ts
const templateId = process.env.TEMPLATE_ID || 'ecommerce'
const enabledCollections = process.env.ENABLED_COLLECTIONS?.split(',') || []

// Dynamic collection loading
const collections = await Promise.all(
  enabledCollections.map(id => import(`@/collections/${id}`))
)
```

## Benefits

### For Platform Admin
- ✅ One-click client provisioning
- ✅ Consistent configurations
- ✅ Easy template management
- ✅ Customization per client

### For Clients
- ✅ Tailored feature set
- ✅ Only relevant collections
- ✅ Optimized bundle size
- ✅ Clear starting point

### For Developers
- ✅ Modular architecture
- ✅ Reusable components
- ✅ Easy to extend
- ✅ Type-safe configs

## Adding New Templates

To add a new template:

1. **Define template** in `src/templates/index.ts`:
   ```typescript
   export const myTemplate: TemplateConfig = {
     id: 'my-template',
     name: 'My Template',
     description: '...',
     collections: [...],
     blocks: [...],
     features: {...}
   }
   ```

2. **Add to registry** in `src/templates/index.ts`:
   ```typescript
   export const templates = {
     ...
     'my-template': myTemplate
   }
   ```

3. **Update AddClientModal** to include new option:
   ```typescript
   <option value="my-template">My Template</option>
   ```

4. **Test provisioning** with new template

## Future Enhancements

- [ ] Visual template preview in Global Admin
- [ ] Template marketplace (community templates)
- [ ] Template versioning
- [ ] Template import/export
- [ ] A/B testing different templates
- [ ] Template analytics (which templates perform best)
- [ ] User-created custom templates
- [ ] Template inheritance (base templates + addons)

## See Also

- `src/templates/index.ts` - Template definitions
- `src/templates/config-generator.ts` - Dynamic config generation
- `src/platform/services/provisioning.ts` - Provisioning logic
- `docs/MULTI_TENANT_GUIDE.md` - Platform architecture
