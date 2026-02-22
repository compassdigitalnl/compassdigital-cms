# Fix: Shop Category Route (`/shop/{categorySlug}` → 404)

**Probleem:** `/shop/voeding-gezondheid/` geeft 404 omdat `/shop/[slug]` alleen producten zoekt.
**Oplossing:** Wijzig `[slug]` naar `[...slug]` catch-all die eerst product checkt, dan categorie.

---

## Stap 1: Hernoem de directory

```bash
mv src/app/\(ecommerce\)/shop/\[slug\] src/app/\(ecommerce\)/shop/\[...slug\]
```

Dit hernoemt de hele map inclusief alle bestanden erin (ProductTemplate1.tsx, etc.).

---

## Stap 2: Vervang `src/app/(ecommerce)/shop/[...slug]/page.tsx`

Vervang de VOLLEDIGE inhoud van dit bestand door onderstaande code:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProductTemplate1 from './ProductTemplate1'
import ProductTemplate2 from './ProductTemplate2'
import ProductTemplate3 from './ProductTemplate3'
import ShopArchiveTemplate1 from '../ShopArchiveTemplate1'
import type { Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArray } = await params
  const slug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config })

  // 1. Probeer product
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
    select: { title: true, shortDescription: true, meta: true },
  })

  if (products[0]) {
    const product = products[0]
    return {
      title:
        (typeof product.meta === 'object' && product.meta?.title) ||
        `${product.title} | Shop`,
      description:
        (typeof product.meta === 'object' && product.meta?.description) ||
        product.shortDescription ||
        `${product.title}`,
    }
  }

  // 2. Probeer categorie
  const { docs: categories } = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: slug } },
    depth: 0,
    limit: 1,
  })

  if (categories[0]) {
    const category = categories[0]
    return {
      title: `${category.name} | Shop`,
      description: category.description || `Bekijk alle ${category.name} producten`,
    }
  }

  return { title: 'Niet gevonden' }
}

export default async function ShopDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: slugArray } = await params
  const slug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config })

  // ── 1. Probeer product te vinden ──────────────────────────────
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })

  const product = products[0] as Product | undefined

  if (product && product.status === 'published') {
    // Product gevonden → render product detail page
    let template = 'template1'
    try {
      const settings = await payload.findGlobal({ slug: 'settings', depth: 0 })
      template = (settings as any)?.defaultProductTemplate || 'template1'
    } catch (error) {
      console.error('Error fetching settings:', error)
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 transition-colors hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar Shop
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {template === 'template3' ? (
            <ProductTemplate3 product={product} />
          ) : template === 'template2' ? (
            <ProductTemplate2 product={product} />
          ) : (
            <ProductTemplate1 product={product} />
          )}
        </div>
      </div>
    )
  }

  // ── 2. Probeer categorie te vinden ────────────────────────────
  const { docs: categories } = await payload.find({
    collection: 'product-categories',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const category = categories[0]

  if (category) {
    // Categorie gevonden → render shop archive gefilterd op categorie
    const { docs: categoryProducts, totalDocs } = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'published' },
        categories: { contains: category.id },
      },
      depth: 2,
      limit: 24,
      sort: '-createdAt',
    })

    return (
      <div className="min-h-screen bg-gray-50">
        <ShopArchiveTemplate1
          products={categoryProducts as Product[]}
          category={category}
          totalProducts={totalDocs}
        />
      </div>
    )
  }

  // ── 3. Niets gevonden ─────────────────────────────────────────
  notFound()
}
```

---

## Stap 3: Verwijder debug badge uit shop archive

In `src/app/(ecommerce)/shop/page.tsx`, verwijder regels 92-109 (het debug blok):

```typescript
// VERWIJDER DIT HELE BLOK:
      {/* DEBUG: Template Indicator */}
      <div
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 9999,
          background: badgeStyle.background,
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {badgeStyle.label}
      </div>
```

En verwijder ook de bijbehorende `getBadgeStyle` functie (regels 83-88):

```typescript
// VERWIJDER OOK DIT:
  const getBadgeStyle = () => {
    return { background: '#3B82F6', label: '🏢 Shop Archive Template 1 - Enterprise' }
  }

  const badgeStyle = getBadgeStyle()
```

---

## Samenvatting

**Bestanden gewijzigd: 2**

1. `src/app/(ecommerce)/shop/[slug]/` → **hernoemd** naar `src/app/(ecommerce)/shop/[...slug]/`
2. `src/app/(ecommerce)/shop/[...slug]/page.tsx` → **volledig vervangen** (zie Stap 2)
3. `src/app/(ecommerce)/shop/page.tsx` → **debug badge verwijderd** (zie Stap 3)

**Alle andere bestanden in de map blijven ongewijzigd:**
- `ProductTemplate1.tsx` — blijft
- `ProductTemplate2.tsx` — blijft
- `ProductTemplate3.tsx` — blijft
- `AddToCartButton.tsx` — blijft
- `GroupedProductTable.tsx` — blijft

**Resultaat na implementatie:**
- `/shop/winelife-99-2026` → Product detail page (zoals voorheen)
- `/shop/voeding-gezondheid` → Shop archive gefilterd op die categorie
- `/shop/hobby-vrije-tijd` → Shop archive gefilterd op die categorie
- `/shop/niet-bestaand` → 404 pagina
