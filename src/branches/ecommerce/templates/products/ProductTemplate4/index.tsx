'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/components/ui/AddToCartToast'
import type { Product } from '@/payload-types'

// Product components
import { ProductGallery } from '@/branches/ecommerce/components/products/ProductGallery'
import { ProductTabs } from '@/branches/ecommerce/components/products/ProductTabs'
import { ProductSpecsTable } from '@/branches/ecommerce/components/products/ProductSpecsTable'
import { BackInStockNotifier } from '@/branches/ecommerce/components/products/BackInStockNotifier'
import { StickyAddToCartBar } from '@/branches/ecommerce/components/products/StickyAddToCartBar'
import { ReviewWidget } from '@/branches/ecommerce/components/products/ReviewWidget'
import { StaffelCalculator } from '@/branches/ecommerce/components/products/StaffelCalculator'
import { StaffelHintBanner } from '@/branches/ecommerce/components/products/StaffelHintBanner'
import { ProductBadge } from '@/branches/ecommerce/components/products/ProductBadges'

// Product-type specific
import { VariantSelector } from '@/branches/ecommerce/components/VariantSelector'
import { SubscriptionPricingTable } from '@/branches/ecommerce/components/SubscriptionPricingTable'
import { RelatedProductsSection } from '@/branches/ecommerce/components/RelatedProductsSection'
import { GroupedProductTable } from '@/branches/ecommerce/templates/products/ProductTemplate1/GroupedProductTable'

// Shared
import { RichText } from '@/branches/shared/components/common/RichText'
import { features } from '@/lib/features'
import { getGroupedMinPrice } from '@/branches/ecommerce/lib/shop/utils'

import {
  Award, Hash, Barcode, Package, Star, Truck, ShoppingCart,
  Undo2, CreditCard, ShieldCheck, Heart, Share2, Minus, Plus,
  Download, Info,
} from 'lucide-react'

export interface ProductTemplate4Props {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductTemplate4({ product }: ProductTemplate4Props) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const mainATCRef = useRef<HTMLDivElement>(null)
  const tabsSectionRef = useRef<HTMLDivElement>(null)
  const [wishlistActive, setWishlistActive] = useState(false)

  // ── Product type detection ──
  const isGrouped = product.productType === 'grouped'
  const isVariable = product.productType === 'variable'
  const isSubscription = product.isSubscription === true && isVariable
  const isMixMatch = product.productType === 'mixAndMatch'

  // ── Quantity controls ──
  const minQty = product.minOrderQuantity || 1
  const maxQty = product.maxOrderQuantity || (product.stock ?? 999)
  const [quantity, setQuantity] = useState(minQty)
  const [variantSelections, setVariantSelections] = useState<Record<string, any>>({})
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)

  // ── Price calculation ──
  const groupedMinPrice = isGrouped ? getGroupedMinPrice(product) : null
  const basePrice = product.salePrice || product.price || 0
  const variantModifier = Object.values(variantSelections).reduce(
    (sum: number, v: any) => sum + (v?.priceModifier || 0), 0,
  )
  const currentPrice = isVariable && !isSubscription ? (product.price || 0) + variantModifier : basePrice
  const oldPrice = product.compareAtPrice || (product.salePrice ? product.price : null)
  const savings = oldPrice && currentPrice ? oldPrice - currentPrice : 0
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0
  const hasPrice = product.price != null || product.salePrice != null || groupedMinPrice != null
  const showVanaf = isGrouped && product.price == null && groupedMinPrice != null
  const displayPrice = showVanaf ? groupedMinPrice! : currentPrice

  // ── Stock ──
  const isBackorder = product.backordersAllowed === true || product.stockStatus === 'on-backorder'
  const isOutOfStock = !isGrouped && !isBackorder && product.trackStock && (product.stock ?? 0) <= 0

  // ── Image handling (multi-tenant safe) ──
  let imageUrl: string | null =
    typeof product.images?.[0] === 'object' && product.images[0] !== null
      ? ((product.images[0] as any)?.url as string) || null
      : null

  if (!imageUrl && Array.isArray(product.tags)) {
    for (const tagEntry of product.tags as any[]) {
      const tag = typeof tagEntry === 'object' && tagEntry !== null ? tagEntry.tag : tagEntry
      if (typeof tag === 'string' && tag.startsWith('img:')) {
        imageUrl = tag.slice(4)
        break
      }
    }
  }

  // Gallery images
  let galleryImages =
    product.images
      ?.map((img, idx) => {
        if (typeof img === 'object' && img !== null) {
          const url = (img as any)?.url || ''
          return { id: String((img as any)?.id || idx), url, alt: (img as any)?.alt || product.title, thumbnail: url }
        }
        return null
      })
      .filter((img): img is NonNullable<typeof img> => img !== null && img.url !== '') || []

  if (galleryImages.length === 0 && imageUrl) {
    galleryImages = [{ id: '0', url: imageUrl, alt: product.title, thumbnail: imageUrl }]
  }

  // ── Gallery badges ──
  const galleryBadges: Array<{ type: 'sale' | 'new' | 'pro' | 'config'; label: string; position?: 'top-left' | 'top-right' }> = []
  if (savingsPercent > 0) galleryBadges.push({ type: 'sale', label: `-${savingsPercent}%`, position: 'top-left' })
  const createdDate = new Date(product.createdAt)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  if (createdDate > thirtyDaysAgo) galleryBadges.push({ type: 'new', label: 'Nieuw', position: 'top-right' })

  // ── Semantic badges (ProductBadge pills) ──
  const semanticBadges: Array<{ variant: 'bestseller' | 'nieuw' | 'uitverkocht' | 'staffel' | 'eco' | 'aanbieding' | 'exclusief' | 'b2b'; label?: string }> = []
  if (savingsPercent > 0) semanticBadges.push({ variant: 'aanbieding', label: `-${savingsPercent}% Korting` })
  if (createdDate > thirtyDaysAgo) semanticBadges.push({ variant: 'nieuw' })
  if ((product.volumePricing || []).length > 0) semanticBadges.push({ variant: 'staffel' })
  if (isOutOfStock) semanticBadges.push({ variant: 'uitverkocht' })
  if (Array.isArray(product.tags)) {
    for (const tagEntry of product.tags as any[]) {
      const tag = typeof tagEntry === 'object' && tagEntry !== null ? tagEntry.tag : tagEntry
      if (typeof tag === 'string') {
        if (tag.toLowerCase().includes('bestseller')) semanticBadges.push({ variant: 'bestseller' })
        if (tag.toLowerCase().includes('eco') || tag.toLowerCase().includes('duurzaam')) semanticBadges.push({ variant: 'eco' })
        if (tag.toLowerCase().includes('b2b')) semanticBadges.push({ variant: 'b2b' })
      }
    }
  }

  // ── Category ──
  const firstCategory = product.categories?.length ? product.categories[0] : null
  const categoryName = typeof firstCategory === 'object' && firstCategory ? firstCategory.name : null
  const categorySlug = typeof firstCategory === 'object' && firstCategory ? firstCategory.slug : null

  // ── Volume pricing → StaffelCalculator format ──
  const volumeTiers = product.volumePricing || []
  const staffelTiers = useMemo(() => {
    if (volumeTiers.length === 0) return []
    const sorted = [...volumeTiers].sort((a: any, b: any) => (a.minQuantity || 0) - (b.minQuantity || 0))
    return sorted.map((tier: any, idx: number) => {
      const minQ = tier.minQuantity || 1
      const nextMin = idx < sorted.length - 1 ? (sorted[idx + 1] as any).minQuantity - 1 : Infinity
      const tierPrice = tier.discountPrice || (product.price || 0) * (1 - (tier.discountPercentage || 0) / 100)
      return {
        min: minQ,
        max: nextMin,
        price: tierPrice,
        discount: tier.discountPercentage || (product.price ? Math.round((1 - tierPrice / product.price) * 100) : 0),
      }
    })
  }, [volumeTiers, product.price])

  // ── StaffelHintBanner: find next tier ──
  const nextStaffelTier = useMemo(() => {
    if (staffelTiers.length === 0) return null
    const next = staffelTiers.find(t => t.min > quantity)
    if (!next) return null
    return { quantity: next.min, discount: next.discount }
  }, [staffelTiers, quantity])

  const isInStaffelTier = staffelTiers.some(t => quantity >= t.min && quantity <= t.max && t.discount > 0)

  // ── Scroll to reviews handler ──
  const scrollToReviews = () => {
    tabsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      const reviewsTab = document.querySelector('[data-tab-id="reviews"]') as HTMLElement
      reviewsTab?.click()
    }, 500)
  }

  // ── Add to cart handler ──
  const handleAddToCart = () => {
    const firstImageUrl = imageUrl || undefined

    if (isSubscription && selectedSubscription) {
      const subscriptionPrice = (product.price || 0) + (selectedSubscription.priceModifier || 0)
      const discountedPrice = selectedSubscription.discountPercentage
        ? subscriptionPrice * (1 - selectedSubscription.discountPercentage / 100)
        : subscriptionPrice
      addItem({
        id: String(product.id), title: `${product.title} - ${selectedSubscription.label}`,
        slug: product.slug || '', price: product.price ?? 0, quantity: 1,
        unitPrice: discountedPrice, image: firstImageUrl,
        sku: product.sku || undefined, ean: product.ean || undefined,
        stock: selectedSubscription.stockLevel || 999,
      })
      showToast({ id: String(product.id), name: product.title, variant: selectedSubscription.label, image: firstImageUrl, quantity: 1, price: discountedPrice })
    } else if (isVariable && Object.keys(variantSelections).length > 0) {
      const variantLabels = Object.values(variantSelections).map((v: any) => v.label).join(', ')
      addItem({
        id: String(product.id), title: `${product.title} (${variantLabels})`,
        slug: product.slug || '', price: product.price ?? 0, quantity,
        unitPrice: currentPrice, image: firstImageUrl,
        sku: product.sku || undefined, ean: product.ean || undefined,
        stock: product.stock ?? 0,
      })
      showToast({ id: String(product.id), name: product.title, variant: variantLabels, image: firstImageUrl, quantity, price: currentPrice })
    } else {
      const unitPrice = product.salePrice || product.price || 0
      addItem({
        id: String(product.id), title: product.title,
        slug: product.slug || '', price: product.price ?? 0, quantity,
        unitPrice, image: firstImageUrl,
        sku: product.sku || undefined, ean: product.ean || undefined,
        stock: product.stock ?? 0,
      })
      showToast({ id: String(product.id), name: product.title, image: firstImageUrl, quantity, price: unitPrice })
    }
  }

  // ── Specs groups ──
  const specsGroups = [
    ...(Array.isArray(product.specifications)
      ? product.specifications.map((group: any) => ({
          title: group.groupName || group.group || 'Specificaties',
          specs: (group.items || group.attributes || []).map((item: any) => ({
            label: item.label || item.name || '',
            value: item.value ? `${item.value}${item.unit ? ` ${item.unit}` : ''}` : '',
          })),
        }))
      : []),
    {
      title: 'Productinformatie',
      specs: [
        ...(product.sku ? [{ label: 'Artikelnummer', value: product.sku, mono: true, copyable: true }] : []),
        ...(product.ean ? [{ label: 'EAN', value: product.ean, mono: true, copyable: true }] : []),
        { label: 'Voorraad', value: product.trackStock ? `${product.stock ?? 0} stuks` : 'Niet bijgehouden' },
      ],
    },
  ]

  // ── ReviewWidget data (empty — no mock data) ──
  const reviewSummary = {
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
  }

  // ── Tabs content ──
  const tabsContent = [
    {
      id: 'description',
      label: 'Beschrijving',
      content: (
        <div className="product-description-content">
          {product.shortDescription && (
            <div
              className="p-5 rounded-xl mb-6"
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 5%, white)',
                border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)',
              }}
            >
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-0.5 shrink-0" style={{ color: 'var(--color-primary)' }} />
                <p className="text-sm font-medium leading-relaxed m-0" style={{ color: 'var(--color-text-primary)' }}>
                  {product.shortDescription}
                </p>
              </div>
            </div>
          )}
          {product.description ? (
            <div className="prose-content" style={{ color: 'var(--color-text-secondary)' }}>
              <RichText data={product.description} enableProse />
            </div>
          ) : (
            <p className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
              Geen beschrijving beschikbaar.
            </p>
          )}
          <style jsx>{`
            .product-description-content :global(.prose-content) {
              font-size: 15px;
              line-height: 1.8;
            }
            .product-description-content :global(h2),
            .product-description-content :global(h3),
            .product-description-content :global(h4) {
              color: var(--color-text-primary);
              font-weight: 700;
              margin-top: 1.5em;
              margin-bottom: 0.75em;
            }
            .product-description-content :global(h2) { font-size: 1.35em; }
            .product-description-content :global(h3) { font-size: 1.15em; }
            .product-description-content :global(ul),
            .product-description-content :global(ol) {
              padding-left: 1.5em;
              margin: 1em 0;
            }
            .product-description-content :global(li) {
              margin-bottom: 0.5em;
              line-height: 1.7;
            }
            .product-description-content :global(ul li::marker) {
              color: var(--color-primary);
            }
            .product-description-content :global(table) {
              width: 100%;
              border-collapse: collapse;
              margin: 1.5em 0;
            }
            .product-description-content :global(th),
            .product-description-content :global(td) {
              padding: 10px 14px;
              border: 1px solid var(--color-border);
              text-align: left;
              font-size: 14px;
            }
            .product-description-content :global(th) {
              background: var(--color-background, #f9fafb);
              font-weight: 700;
              color: var(--color-text-primary);
            }
            .product-description-content :global(a) {
              color: var(--color-primary);
              text-decoration: underline;
            }
            .product-description-content :global(blockquote) {
              border-left: 3px solid var(--color-primary);
              padding: 12px 20px;
              margin: 1.5em 0;
              background: var(--color-background, #f9fafb);
              border-radius: 0 8px 8px 0;
              font-style: italic;
            }
            .product-description-content :global(img) {
              max-width: 100%;
              height: auto;
              border-radius: 12px;
              margin: 1.5em 0;
            }
          `}</style>
        </div>
      ),
    },
    ...(Array.isArray(product.specifications) && product.specifications.length > 0
      ? [
          {
            id: 'specs',
            label: 'Specificaties',
            content: <ProductSpecsTable groups={specsGroups} />,
          },
        ]
      : []),
    {
      id: 'reviews',
      label: 'Reviews',
      badge: '0',
      content: (
        <ReviewWidget
          productId={String(product.id)}
          productName={product.title}
          summary={reviewSummary}
          reviews={[]}
          showWriteButton
          onWriteReview={() => {}}
        />
      ),
    },
    ...(product.downloads && (product.downloads as any[]).length > 0
      ? [
          {
            id: 'downloads',
            label: 'Downloads',
            content: (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
                {(product.downloads as any[]).map((download: any, idx: number) => {
                  const file = typeof download === 'object' && download !== null ? download : null
                  if (!file || !file.url) return null
                  return (
                    <a
                      key={idx}
                      href={file.url}
                      download
                      className="flex items-center gap-3 p-4 rounded-xl no-underline transition-all hover:shadow-md"
                      style={{
                        background: 'var(--color-surface, white)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, white)' }}
                      >
                        <Download className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{file.filename || 'Download'}</div>
                        {file.filesize && (
                          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {(file.filesize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            ),
          },
        ]
      : []),
  ]

  // Show qty + ATC for simple and variable (not grouped, not mixmatch)
  const showAddToCart = !isOutOfStock && !isGrouped && !isMixMatch

  return (
    <div
      className="product-template-4 overflow-x-hidden pb-20"
      style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}
    >
      {/* ═══ MAIN LAYOUT: Gallery + Product Info ═══ */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start lg:px-6 lg:mb-4">
        {/* LEFT: Product Gallery */}
        <div>
          <ProductGallery images={galleryImages} badges={galleryBadges} enableSticky layout="horizontal" />
        </div>

        {/* RIGHT: Product Info */}
        <div className="px-4 pt-2 lg:px-0 lg:pt-0">
          {/* Semantic Badges */}
          {semanticBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {semanticBadges.map((badge, idx) => (
                <ProductBadge key={idx} variant={badge.variant} label={badge.label} size="sm" />
              ))}
            </div>
          )}

          {/* Brand */}
          {product.brand && (
            <div
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: 'var(--color-primary)' }}
            >
              <Award className="w-[14px] h-[14px]" />
              {typeof product.brand === 'object' ? (product.brand as any).name : product.brand}
            </div>
          )}

          {/* Title */}
          <h1
            className="font-heading text-xl lg:text-[28px] font-extrabold leading-tight tracking-tight mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {product.title}
          </h1>

          {/* SKU / EAN / Category */}
          <div
            className="font-mono text-[11px] lg:text-xs mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3 flex-wrap"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {product.sku && (
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 lg:w-[13px] lg:h-[13px]" /> Art. {product.sku}
              </span>
            )}
            {product.ean && (
              <span className="flex items-center gap-1">
                <Barcode className="w-3 h-3 lg:w-[13px] lg:h-[13px]" /> EAN {product.ean}
              </span>
            )}
            {categoryName && (
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3 lg:w-[13px] lg:h-[13px]" />
                {categorySlug ? (
                  <Link href={`/${categorySlug}`} className="hover:underline" style={{ color: 'var(--color-text-muted)' }}>
                    {categoryName}
                  </Link>
                ) : (
                  categoryName
                )}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {product.shortDescription}
            </p>
          )}

          {/* Rating summary → scroll to reviews */}
          <div
            className="flex items-center gap-2 mb-4 lg:mb-5 pb-4 lg:pb-5"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4" style={{ color: 'var(--color-border)' }} fill="none" />
              ))}
            </div>
            <button
              onClick={scrollToReviews}
              className="text-[13px] bg-transparent border-0 p-0 cursor-pointer underline"
              style={{ color: 'var(--color-primary)' }}
            >
              0 reviews — Schrijf als eerste een review
            </button>
          </div>

          {/* ═══ PRICE CARD ═══ */}
          <div
            className="rounded-[var(--border-radius,16px)] p-4 lg:p-6 mb-4 lg:mb-5"
            style={{ background: 'var(--color-surface, white)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-baseline gap-2 lg:gap-3 mb-1 flex-wrap">
              {hasPrice ? (
                <>
                  {showVanaf && (
                    <span className="text-xs lg:text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      Vanaf
                    </span>
                  )}
                  <span
                    className="font-heading text-[26px] lg:text-[32px] font-extrabold"
                    style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}
                  >
                    €{displayPrice.toFixed(2)}
                  </span>
                  {oldPrice && (
                    <>
                      <span
                        className="text-base lg:text-lg line-through font-normal"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        €{oldPrice.toFixed(2)}
                      </span>
                      <span
                        className="text-[11px] lg:text-[13px] font-bold px-2 lg:px-2.5 py-[3px] rounded-md"
                        style={{ color: '#FF6B6B', background: '#FFF0F0' }}
                      >
                        Bespaar {savingsPercent}%
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span
                  className="font-heading text-[20px] lg:text-[24px] font-bold"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Prijs op aanvraag
                </span>
              )}
            </div>

            {isBackorder && (
              <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-amber-600 mt-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                Op bestelling — levertijd op aanvraag
              </div>
            )}

            {(product as any).packaging && (
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                {(product as any).packaging} · {product.taxClass === 'standard' ? 'incl.' : 'excl.'} BTW
              </div>
            )}
          </div>

          {/* ═══ STAFFEL CALCULATOR (full interactive volume pricing) ═══ */}
          {staffelTiers.length > 0 && !isGrouped && hasPrice && (
            <div className="mb-4 lg:mb-5">
              <StaffelCalculator
                productName={product.title}
                basePrice={product.price || 0}
                tiers={staffelTiers}
                initialQty={quantity}
                onQtyChange={(qty) => setQuantity(qty)}
              />
            </div>
          )}

          {/* ═══ STOCK INDICATOR ═══ */}
          {!isGrouped && !isVariable && product.trackStock && (product.stock ?? 0) > 0 && (
            <div
              className="flex items-center gap-2 px-3 lg:px-4 py-2.5 lg:py-3 rounded-[10px] mb-4 lg:mb-5"
              style={{ background: 'var(--color-success-bg, #f0fdf4)' }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--color-success, #22c55e)' }} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#2E7D32]">
                  Op voorraad — {product.stock} stuks beschikbaar
                </div>
                {product.leadTime && (
                  <div className="text-xs text-[#558B2F] font-normal">Levertijd: {product.leadTime}</div>
                )}
              </div>
              <Truck className="w-4 h-4 text-[#2E7D32] ml-auto" />
            </div>
          )}

          {/* Out of stock */}
          {isOutOfStock && (
            <div className="mb-4 lg:mb-5">
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-sm mb-3">
                <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                Tijdelijk uitverkocht
              </div>
              <BackInStockNotifier
                product={{ id: String(product.id), name: product.title }}
                onSubmit={async (email) => {
                  console.log('Back in stock:', email)
                }}
              />
            </div>
          )}

          {/* ═══ PRODUCT TYPE SECTIONS ═══ */}

          {isSubscription && features.subscriptions && (
            <div className="mb-5 lg:mb-6">
              <SubscriptionPricingTable
                product={product}
                onSelectionChange={(selection) => setSelectedSubscription(selection)}
              />
            </div>
          )}

          {isVariable && !isSubscription && features.variableProducts && (
            <div className="mb-5 lg:mb-6">
              <VariantSelector product={product} onSelectionChange={(selections) => setVariantSelections(selections)} />
            </div>
          )}

          {isGrouped && product.childProducts && (
            <div className="mb-5 lg:mb-6">
              <GroupedProductTable
                parentProduct={{ id: product.id, title: product.title }}
                childProducts={
                  product.childProducts as Array<{
                    product: string | Product
                    sortOrder?: number | null
                    isDefault?: boolean | null
                  }>
                }
              />
            </div>
          )}

          {isMixMatch && (
            <div
              className="p-5 lg:p-6 rounded-xl mb-5 lg:mb-6"
              style={{ background: 'var(--color-surface, white)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Dit is een samengesteld product. Neem contact met ons op voor meer informatie.
              </p>
            </div>
          )}

          {/* ═══ QUANTITY + ADD TO CART ═══ */}
          {showAddToCart && (
            <div className="mb-4 lg:mb-5">
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                Aantal
              </div>
              <div
                className="inline-flex items-center rounded-[10px] overflow-hidden bg-white"
                style={{ border: '1.5px solid var(--color-border)' }}
              >
                <button
                  onClick={() => setQuantity(Math.max(minQty, quantity - (product.orderMultiple || 1)))}
                  className="w-11 h-11 border-0 cursor-pointer flex items-center justify-center"
                  style={{
                    background: 'var(--color-background, var(--color-surface))',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(minQty, Math.min(maxQty, parseInt(e.target.value) || minQty)))
                  }
                  className="w-[60px] h-11 border-0 text-center font-mono text-base font-bold outline-none"
                  style={{ color: 'var(--color-text-primary)' }}
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + (product.orderMultiple || 1)))}
                  className="w-11 h-11 border-0 cursor-pointer flex items-center justify-center"
                  style={{
                    background: 'var(--color-background, var(--color-surface))',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {quantity > 1 && hasPrice && (
                <div className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {quantity}× €{currentPrice.toFixed(2)} ={' '}
                  <strong style={{ color: 'var(--color-text-primary)' }}>
                    €{(currentPrice * quantity).toFixed(2)}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* ═══ STAFFEL HINT BANNER ═══ */}
          {nextStaffelTier && showAddToCart && (
            <div className="mb-4 lg:mb-5 rounded-lg overflow-hidden">
              <StaffelHintBanner
                currentQuantity={quantity}
                nextTier={nextStaffelTier}
                variant={isInStaffelTier ? 'success' : 'default'}
              />
            </div>
          )}
          {!nextStaffelTier && isInStaffelTier && showAddToCart && (
            <div className="mb-4 lg:mb-5 rounded-lg overflow-hidden">
              <StaffelHintBanner
                currentQuantity={quantity}
                nextTier={{ quantity: quantity, discount: staffelTiers[staffelTiers.length - 1]?.discount || 0 }}
                achieved
              />
            </div>
          )}

          {/* ATC Button */}
          <div ref={mainATCRef} className="flex flex-col gap-2.5 mb-4 lg:mb-5">
            {showAddToCart && (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2.5 w-full p-4 text-white border-0 rounded-xl font-body text-base font-bold cursor-pointer transition-transform active:scale-[0.98]"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
                  boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {isBackorder
                  ? 'Bestellen'
                  : hasPrice
                    ? `Toevoegen — €${(currentPrice * quantity).toFixed(2)}`
                    : 'Toevoegen aan winkelwagen'}
              </button>
            )}

            {/* Secondary buttons */}
            <div className="flex gap-2 lg:gap-2.5">
              <button
                onClick={() => setWishlistActive(!wishlistActive)}
                className="flex-1 flex items-center justify-center gap-1.5 lg:gap-2 p-3 lg:p-[13px] rounded-[10px] lg:rounded-xl font-body text-[13px] lg:text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  background: wishlistActive ? 'color-mix(in srgb, #FF6B6B 8%, white)' : 'var(--color-surface, white)',
                  color: wishlistActive ? '#FF6B6B' : 'var(--color-text-primary)',
                  border: `1.5px solid ${wishlistActive ? '#FF6B6B' : 'var(--color-border)'}`,
                }}
              >
                <Heart className="w-4 h-4 lg:w-[18px] lg:h-[18px]" fill={wishlistActive ? '#FF6B6B' : 'none'} />
                Verlanglijst
              </button>
              <button
                onClick={() => {
                  if (typeof navigator !== 'undefined' && navigator.share) {
                    navigator.share({ title: product.title, url: window.location.href })
                  } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href)
                  }
                }}
                className="flex-1 flex items-center justify-center gap-1.5 lg:gap-2 p-3 lg:p-[13px] rounded-[10px] lg:rounded-xl font-body text-[13px] lg:text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  background: 'var(--color-surface, white)',
                  color: 'var(--color-text-primary)',
                  border: '1.5px solid var(--color-border)',
                }}
              >
                <Share2 className="w-4 h-4 lg:w-[18px] lg:h-[18px]" />
                Delen
              </button>
            </div>
          </div>

          {/* ═══ TRUST SIGNALS ═══ */}
          <div
            className="grid grid-cols-2 gap-2 lg:gap-2.5 pt-4 lg:pt-5"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div
              className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-[13px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Truck className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              Gratis verzending vanaf €150
            </div>
            <div
              className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-[13px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <Undo2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              30 dagen retourrecht
            </div>
            <div
              className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-[13px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <CreditCard className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              Op rekening bestellen
            </div>
            <div
              className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-[13px]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ShieldCheck
                className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0"
                style={{ color: 'var(--color-primary)' }}
              />
              CE & ISO gecertificeerd
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TABS SECTION (Description, Specs, Reviews, Downloads) ═══ */}
      <div ref={tabsSectionRef} className="px-4 lg:px-6 pt-8 lg:pt-12">
        <ProductTabs tabs={tabsContent} enableMobileAccordion enableKeyboardNav />
      </div>

      {/* ═══ RELATED PRODUCTS ═══ */}
      {features.shop && (
        <div
          className="pt-12 lg:pt-16 mt-12 lg:mt-16 px-4 lg:px-6"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <RelatedProductsSection
            upSells={product.upSells as (string | Product)[] | undefined}
            crossSells={product.crossSells as (string | Product)[] | undefined}
            accessories={product.accessories as (string | Product)[] | undefined}
          />
        </div>
      )}

      {/* ═══ STICKY ADD TO CART BAR ═══ */}
      {showAddToCart && (
        <StickyAddToCartBar
          product={{
            id: String(product.id),
            name: product.title,
            price: currentPrice,
            image: imageUrl || undefined,
          }}
          onAddToCart={() => handleAddToCart()}
          triggerElementRef={mainATCRef as React.RefObject<HTMLElement>}
        />
      )}
    </div>
  )
}
