# Seed System Architecture

## Overview

Feature-aware, template-driven seeding system for multi-tenant Payload CMS.

## Features

- ✅ **Feature-Aware**: Only seeds content for enabled features
- ✅ **Template-Driven**: Different templates for different business types
- ✅ **Idempotent**: Checks for existing content before creating
- ✅ **Modular**: Easy to add new templates and features
- ✅ **Draft-First**: Creates draft content by default for safe production deployments

## Architecture

```
src/endpoints/seed/
├── seedOrchestrator.ts          # Main orchestrator
├── templates/
│   ├── base.ts                  # Base content (always)
│   ├── ecommerce.ts             # E-commerce features
│   ├── construction.ts          # Construction business
│   ├── beauty.ts                # Beauty salon
│   ├── horeca.ts                # Restaurant/bar
│   ├── hospitality.ts           # Medical/wellness
│   ├── content.ts               # Blog, FAQ, testimonials
│   └── marketplace.ts           # Vendors, workshops
└── data/                        # Demo data (optional)
```

## Usage

### 1. API Endpoint

```bash
curl -X POST http://localhost:3000/api/seed \
  -H "Content-Type: application/json" \
  -d '{
    "template": "construction",
    "features": {
      "construction": true,
      "blog": true,
      "faq": true
    },
    "companyName": "Bouwbedrijf XYZ",
    "domain": "bouwbedrijf-xyz.nl",
    "draftOnly": true
  }'
```

### 2. CLI Script

```bash
# Basic usage
npx tsx scripts/seed-tenant.ts \
  --template=construction \
  --company="Bouwbedrijf XYZ" \
  --domain=bouwbedrijf-xyz.nl

# With custom features
npx tsx scripts/seed-tenant.ts \
  --template=construction \
  --company="Bouwbedrijf XYZ" \
  --domain=bouwbedrijf-xyz.nl \
  --features='{"construction":true,"blog":true,"faq":true}'

# Publish immediately (not draft)
npx tsx scripts/seed-tenant.ts \
  --template=construction \
  --company="Bouwbedrijf XYZ" \
  --domain=bouwbedrijf-xyz.nl \
  --publish
```

### 3. Programmatic Usage

```typescript
import { getPayload } from 'payload'
import { seedTenant } from '@/endpoints/seed/seedOrchestrator'

const payload = await getPayload({ config })

const result = await seedTenant(payload, {
  template: 'construction',
  features: {
    construction: true,
    blog: true,
    faq: true,
  },
  companyName: 'Bouwbedrijf XYZ',
  domain: 'bouwbedrijf-xyz.nl',
  draftOnly: true,
})

console.log('Seeded:', result.seeded)
```

## Templates

### Base (Always)
- Homepage
- Contact page
- Header navigation
- Footer navigation

### E-commerce
- Products
- Product categories
- Brands
- Variants

### Construction
- Construction services
- Construction projects

### Beauty
- Beauty services
- Stylists

### Horeca
- Menu items
- Events

### Hospitality
- Treatments
- Practitioners

### Content
- Blog posts
- FAQs
- Testimonials
- Case studies

### Marketplace
- Vendors
- Workshops

## Adding New Templates

1. Create new template file in `templates/`:

```typescript
// templates/my-template.ts
import type { Payload } from 'payload'
import type { SeedOptions } from '../seedOrchestrator'
import type { SeedResultPartial } from './base'
import { checkExistingContent } from '../seedOrchestrator'

export async function seedMyTemplate(
  payload: Payload,
  options: SeedOptions,
  status: string,
): Promise<SeedResultPartial> {
  const result: SeedResultPartial = {
    collections: {},
    globals: [],
  }

  // Seed your content here
  if (!(await checkExistingContent(payload, 'my-collection', 'my-slug'))) {
    await payload.create({
      collection: 'my-collection',
      data: {
        title: 'Demo Item',
        slug: 'my-slug',
        _status: status,
      },
    })
    result.collections['my-collection'] = 1
  }

  return result
}
```

2. Add to orchestrator in `seedOrchestrator.ts`:

```typescript
if (features.myFeature) {
  const { seedMyTemplate } = await import('./templates/my-template')
  const result = await seedMyTemplate(payload, options, status)
  Object.assign(result.seeded.collections, result.collections)
}
```

3. Update API endpoint to include new template in GET response

## Best Practices

1. **Always check for existing content** before creating
2. **Use draft status by default** for production safety
3. **Keep demo data minimal** but representative
4. **Use feature flags** to control what gets seeded
5. **Log progress** for debugging and transparency

## Performance

- Base content: ~1-2 seconds
- Per feature: ~2-5 seconds
- Full template: ~5-15 seconds

Scales linearly with number of features enabled.

## Troubleshooting

### Content not appearing?
- Check `_status` field (might be draft, not published)
- Verify feature flags are enabled
- Check logs for errors

### Duplicate content?
- Seeding should be idempotent
- Check slug uniqueness
- Verify `checkExistingContent()` is used

### Missing collections?
- Ensure collection exists in schema
- Check feature flags
- Verify migrations have run
