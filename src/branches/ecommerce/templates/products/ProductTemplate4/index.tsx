'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/components/ui/AddToCartToast'
import type { Product } from '@/payload-types'

// Reusable components that ARE good
import { ProductGallery } from '@/branches/ecommerce/components/products/ProductGallery'
import { ProductTabs } from '@/branches/ecommerce/components/products/ProductTabs'
import { ProductSpecsTable } from '@/branches/ecommerce/components/products/ProductSpecsTable'
import { BackInStockNotifier } from '@/branches/ecommerce/components/products/BackInStockNotifier'
import { StickyAddToCartBar } from '@/branches/ecommerce/components/products/StickyAddToCartBar'
import { VariantSelector } from '@/branches/ecommerce/components/VariantSelector'
import { SubscriptionPricingTable } from '@/branches/ecommerce/components/SubscriptionPricingTable'
import { RelatedProductsSection } from '@/branches/ecommerce/components/RelatedProductsSection'
import { GroupedProductTable } from '@/branches/ecommerce/templates/products/ProductTemplate1/GroupedProductTable'
import { RichText } from '@/branches/shared/components/common/RichText'

import { features } from '@/lib/features'
import { getGroupedMinPrice } from '@/branches/ecommerce/lib/shop/utils'

import {
  Award,
  Hash,
  Barcode,
  Package,
  Star,
  Truck,
  ShoppingCart,
  ClipboardList,
  Undo2,
  CreditCard,
  ShieldCheck,
  Heart,
  Share2,
  Minus,
  Plus,
  CheckCircle,
  FileText,
  List,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
} from 'lucide-react'

export interface ProductTemplate4Props {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductTemplate4({ product }: ProductTemplate4Props) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const mainATCRef = useRef<HTMLDivElement>(null)
  const [showStickyATC, setShowStickyATC] = useState(false)
  const [wishlistActive, setWishlistActive] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState<string | null>('description')

  // --- Product type detection ---
  const isGrouped = product.productType === 'grouped'
  const isVariable = product.productType === 'variable'
  const isSubscription = product.isSubscription === true && isVariable
  const isMixMatch = product.productType === 'mixAndMatch'

  // --- Quantity controls ---
  const minQty = product.minOrderQuantity || 1
  const maxQty = product.maxOrderQuantity || (product.stock ?? 999)
  const [quantity, setQuantity] = useState(minQty)
  const [variantSelections, setVariantSelections] = useState<Record<string, any>>({})
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)

  // --- Price calculation ---
  const groupedMinPrice = isGrouped ? getGroupedMinPrice(product) : null
  const basePrice = product.salePrice || product.price || 0
  const variantModifier = Object.values(variantSelections).reduce(
    (sum: number, v: any) => sum + (v?.priceModifier || 0),
    0,
  )
  const currentPrice = isVariable && !isSubscription ? (product.price || 0) + variantModifier : basePrice
  const oldPrice = product.compareAtPrice || (product.salePrice ? product.price : null)
  const savings = oldPrice && currentPrice ? oldPrice - currentPrice : 0
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0
  const hasPrice = product.price != null || product.salePrice != null || groupedMinPrice != null
  const showVanaf = isGrouped && product.price == null && groupedMinPrice != null
  const displayPrice = showVanaf ? groupedMinPrice! : currentPrice

  // --- Stock ---
  const isBackorder = product.backordersAllowed === true || product.stockStatus === 'on-backorder'
  const isOutOfStock = !isGrouped && !isBackorder && product.trackStock && (product.stock ?? 0) <= 0

  // --- Image handling (multi-tenant safe) ---
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

  // Gallery images for ProductGallery component
  let galleryImages =
    product.images
      ?.map((img, idx) => {
        if (typeof img === 'object' && img !== null) {
          const url = (img as any)?.url || ''
          return {
            id: String((img as any)?.id || idx),
            url,
            alt: (img as any)?.alt || product.title,
            thumbnail: url,
          }
        }
        return null
      })
      .filter((img): img is NonNullable<typeof img> => img !== null && img.url !== '') || []

  if (galleryImages.length === 0 && imageUrl) {
    galleryImages = [{ id: '0', url: imageUrl, alt: product.title, thumbnail: imageUrl }]
  }

  // --- Badges ---
  const badges: Array<{ type: 'sale' | 'new'; label: string; position: 'top-left' | 'top-right' }> = []
  if (savingsPercent > 0) {
    badges.push({ type: 'sale', label: `-${savingsPercent}%`, position: 'top-left' })
  }
  const createdDate = new Date(product.createdAt)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  if (createdDate > thirtyDaysAgo) {
    badges.push({ type: 'new', label: 'Nieuw', position: 'top-right' })
  }

  // --- Category ---
  const firstCategory = product.categories?.length ? product.categories[0] : null
  const categoryName = typeof firstCategory === 'object' && firstCategory ? firstCategory.name : null
  const categorySlug = typeof firstCategory === 'object' && firstCategory ? firstCategory.slug : null

  // --- Volume pricing ---
  const volumeTiers = product.volumePricing || []

  // --- Sticky ATC ---
  useEffect(() => {
    const handleScroll = () => setShowStickyATC(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- Add to cart handler ---
  const handleAddToCart = () => {
    const firstImageUrl = imageUrl || undefined

    if (isSubscription && selectedSubscription) {
      const subscriptionPrice = (product.price || 0) + (selectedSubscription.priceModifier || 0)
      const discountedPrice = selectedSubscription.discountPercentage
        ? subscriptionPrice * (1 - selectedSubscription.discountPercentage / 100)
        : subscriptionPrice
      addItem({
        id: String(product.id),
        title: `${product.title} - ${selectedSubscription.label}`,
        slug: product.slug || '',
        price: product.price ?? 0,
        quantity: 1,
        unitPrice: discountedPrice,
        image: firstImageUrl,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: selectedSubscription.stockLevel || 999,
      })
      showToast({ id: String(product.id), name: product.title, variant: selectedSubscription.label, image: firstImageUrl, quantity: 1, price: discountedPrice })
    } else if (isVariable && Object.keys(variantSelections).length > 0) {
      const variantLabels = Object.values(variantSelections).map((v: any) => v.label).join(', ')
      addItem({
        id: String(product.id),
        title: `${product.title} (${variantLabels})`,
        slug: product.slug || '',
        price: product.price ?? 0,
        quantity,
        unitPrice: currentPrice,
        image: firstImageUrl,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: product.stock ?? 0,
      })
      showToast({ id: String(product.id), name: product.title, variant: variantLabels, image: firstImageUrl, quantity, price: currentPrice })
    } else {
      const unitPrice = product.salePrice || product.price || 0
      addItem({
        id: String(product.id),
        title: product.title,
        slug: product.slug || '',
        price: product.price ?? 0,
        quantity,
        unitPrice,
        image: firstImageUrl,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: product.stock ?? 0,
      })
      showToast({ id: String(product.id), name: product.title, image: firstImageUrl, quantity, price: unitPrice })
    }
  }

  // --- Specs groups for ProductSpecsTable ---
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

  // --- Tabs content ---
  const tabsContent = [
    {
      id: 'description',
      label: 'Beschrijving',
      content: (
        <div>
          {product.description ? (
            <div className="text-[15px] text-[var(--color-text-secondary)] leading-[1.7]">
              <RichText data={product.description} enableProse />
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">Geen beschrijving beschikbaar.</p>
          )}
        </div>
      ),
    },
    ...(Array.isArray(product.specifications) && product.specifications.length > 0
      ? [{
          id: 'specs',
          label: 'Specificaties',
          content: <ProductSpecsTable groups={specsGroups} />,
        }]
      : []),
    ...(product.downloads && product.downloads.length > 0
      ? [{
          id: 'downloads',
          label: 'Downloads',
          content: (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
              {product.downloads.map((download: any, idx: number) => {
                const file = typeof download === 'object' && download !== null ? download : null
                if (!file || !file.url) return null
                return (
                  <a
                    key={idx}
                    href={file.url}
                    download
                    className="flex items-center gap-3 p-4 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,12px)] no-underline text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-colors"
                  >
                    <Download className="w-5 h-5 text-[var(--color-primary)]" />
                    <div>
                      <div className="font-semibold text-sm">{file.filename || 'Download'}</div>
                      {file.filesize && (
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {(file.filesize / 1024 / 1024).toFixed(2)} MB
                        </div>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          ),
        }]
      : []),
  ]

  // Show qty + ATC for simple and variable (not grouped, not mixmatch)
  const showAddToCart = !isOutOfStock && !isGrouped && !isMixMatch

  return (
    <div className="product-template-4 overflow-x-hidden pb-20" style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}>

      {/* ========== MOBILE: Gallery ========== */}
      <div className="lg:hidden">
        <ProductGallery images={galleryImages} badges={badges} layout="horizontal" />
      </div>

      {/* ========== DESKTOP: 2-Column Layout ========== */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start lg:mb-12 lg:px-6">
        {/* LEFT: Gallery (sticky on scroll) */}
        <div>
          <ProductGallery images={galleryImages} badges={badges} enableSticky layout="horizontal" />
        </div>

        {/* RIGHT: Product Info */}
        <div className="product-info">
          {/* Brand */}
          {product.brand && (
            <div className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
              <Award className="w-[14px] h-[14px]" />
              {typeof product.brand === 'object' ? (product.brand as any).name : product.brand}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-[28px] font-extrabold leading-tight tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>
            {product.title}
          </h1>

          {/* SKU / EAN / Category */}
          <div className="font-mono text-xs mb-4 flex items-center gap-3 flex-wrap" style={{ color: 'var(--color-text-muted)' }}>
            {product.sku && (
              <span className="flex items-center gap-1">
                <Hash className="w-[13px] h-[13px]" /> Art. {product.sku}
              </span>
            )}
            {product.ean && (
              <span className="flex items-center gap-1">
                <Barcode className="w-[13px] h-[13px]" /> EAN {product.ean}
              </span>
            )}
            {categoryName && (
              <span className="flex items-center gap-1">
                <Package className="w-[13px] h-[13px]" />
                {categorySlug ? (
                  <Link href={`/${categorySlug}`} className="hover:underline" style={{ color: 'var(--color-text-muted)' }}>
                    {categoryName}
                  </Link>
                ) : categoryName}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {product.shortDescription}
            </p>
          )}

          {/* Rating (placeholder - no mock data) */}
          <div className="flex items-center gap-2 mb-5 pb-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4" style={{ color: 'var(--color-border)' }} fill="none" />
              ))}
            </div>
            <span className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
              Nog geen reviews — <button className="underline cursor-pointer bg-transparent border-0 p-0" style={{ color: 'var(--color-primary)', fontSize: '13px' }}>Schrijf een review</button>
            </span>
          </div>

          {/* ===== PRICE CARD ===== */}
          <div className="rounded-[var(--border-radius,16px)] p-6 mb-5" style={{ background: 'var(--color-surface, white)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-baseline gap-3 mb-1 flex-wrap">
              {hasPrice ? (
                <>
                  {showVanaf && <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>Vanaf</span>}
                  <span className="font-heading text-[32px] font-extrabold" style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}>
                    €{displayPrice.toFixed(2)}
                  </span>
                  {oldPrice && (
                    <>
                      <span className="text-lg line-through font-normal" style={{ color: 'var(--color-text-muted)' }}>
                        €{oldPrice.toFixed(2)}
                      </span>
                      <span className="text-[13px] font-bold px-2.5 py-[3px] rounded-md" style={{ color: '#FF6B6B', background: '#FFF0F0' }}>
                        Bespaar {savingsPercent}%
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="font-heading text-[24px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
                  Prijs op aanvraag
                </span>
              )}
            </div>

            {/* Backorder notice */}
            {isBackorder && (
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600 mt-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                Op bestelling — levertijd op aanvraag
              </div>
            )}

            {/* Tax/packaging info */}
            {(product as any).packaging && (
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                {(product as any).packaging} · {product.taxClass === 'standard' ? 'incl.' : 'excl.'} BTW
              </div>
            )}

            {/* Volume Pricing tiers */}
            {volumeTiers.length > 0 && !isGrouped && hasPrice && (
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Staffelkorting
                </div>
                <div className="space-y-1.5">
                  {volumeTiers.map((tier: any, idx: number) => {
                    const tierPrice = tier.discountPrice || (product.price ?? 0) * (1 - (tier.discountPercentage || 0) / 100)
                    const isActive = quantity >= (tier.minQuantity || 0)
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 px-3 rounded-lg text-sm"
                        style={{
                          background: isActive ? 'color-mix(in srgb, var(--color-primary) 8%, transparent)' : 'transparent',
                          border: isActive ? '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)' : '1px solid transparent',
                        }}
                      >
                        <span style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                          {tier.minQuantity}+ stuks
                        </span>
                        <span className="font-bold" style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                          €{tierPrice.toFixed(2)} / stuk
                          {tier.discountPercentage && (
                            <span className="text-xs font-normal ml-1" style={{ color: '#FF6B6B' }}>
                              (-{tier.discountPercentage}%)
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ===== STOCK INDICATOR ===== */}
          {!isGrouped && !isVariable && product.trackStock && (product.stock ?? 0) > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] mb-5" style={{ background: 'var(--color-success-bg, #f0fdf4)' }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--color-success, #22c55e)' }} />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#2E7D32]">
                  Op voorraad — {product.stock} stuks beschikbaar
                </div>
                {product.leadTime && (
                  <div className="text-xs text-[#558B2F] font-normal">
                    Levertijd: {product.leadTime}
                  </div>
                )}
              </div>
              <Truck className="w-4 h-4 text-[#2E7D32] ml-auto" />
            </div>
          )}

          {/* Out of stock notice */}
          {isOutOfStock && (
            <div className="mb-5">
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-sm mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                Tijdelijk uitverkocht
              </div>
              <BackInStockNotifier
                product={{ id: String(product.id), name: product.title }}
                onSubmit={async (email) => { console.log('Back in stock:', email) }}
              />
            </div>
          )}

          {/* ===== PRODUCT TYPE SECTIONS ===== */}

          {/* Subscription → Pricing Table */}
          {isSubscription && features.subscriptions && (
            <div className="mb-6">
              <SubscriptionPricingTable
                product={product}
                onSelectionChange={(selection) => setSelectedSubscription(selection)}
              />
            </div>
          )}

          {/* Variable → Variant Selector */}
          {isVariable && !isSubscription && features.variableProducts && (
            <div className="mb-6">
              <VariantSelector
                product={product}
                onSelectionChange={(selections) => setVariantSelections(selections)}
              />
            </div>
          )}

          {/* Grouped → GroupedProductTable */}
          {isGrouped && product.childProducts && (
            <div className="mb-6">
              <GroupedProductTable
                parentProduct={{ id: product.id, title: product.title }}
                childProducts={product.childProducts as Array<{ product: string | Product; sortOrder?: number | null; isDefault?: boolean | null }>}
              />
            </div>
          )}

          {/* Mix & Match → Fallback */}
          {isMixMatch && (
            <div className="p-6 rounded-xl mb-6" style={{ background: 'var(--color-surface, white)', border: '1px solid var(--color-border)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Dit is een samengesteld product. Neem contact met ons op voor meer informatie.
              </p>
            </div>
          )}

          {/* ===== QUANTITY + ADD TO CART ===== */}
          {showAddToCart && (
            <div className="mb-5">
              {/* Quantity */}
              <div className="text-sm font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Aantal</div>
              <div className="inline-flex items-center rounded-[10px] overflow-hidden bg-white" style={{ border: '1.5px solid var(--color-border)' }}>
                <button
                  onClick={() => setQuantity(Math.max(minQty, quantity - (product.orderMultiple || 1)))}
                  className="w-11 h-11 border-0 cursor-pointer flex items-center justify-center" style={{ background: 'var(--color-background, var(--color-surface))', color: 'var(--color-text-primary)' }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(minQty, Math.min(maxQty, parseInt(e.target.value) || minQty)))}
                  className="w-[60px] h-11 border-0 text-center font-mono text-base font-bold outline-none" style={{ color: 'var(--color-text-primary)' }}
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + (product.orderMultiple || 1)))}
                  className="w-11 h-11 border-0 cursor-pointer flex items-center justify-center" style={{ background: 'var(--color-background, var(--color-surface))', color: 'var(--color-text-primary)' }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {quantity > 1 && hasPrice && (
                <div className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {quantity}× €{currentPrice.toFixed(2)} ={' '}
                  <strong style={{ color: 'var(--color-text-primary)' }}>€{(currentPrice * quantity).toFixed(2)}</strong>
                </div>
              )}
            </div>
          )}

          {/* ATC Button */}
          <div ref={mainATCRef} className="flex flex-col gap-2.5 mb-5">
            {showAddToCart && (
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2.5 w-full p-4 text-white border-0 rounded-xl font-body text-base font-bold cursor-pointer transition-transform active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
                  boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {isBackorder ? 'Bestellen' : hasPrice ? `Toevoegen — €${(currentPrice * quantity).toFixed(2)}` : 'Toevoegen aan winkelwagen'}
              </button>
            )}

            {/* Secondary buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => setWishlistActive(!wishlistActive)}
                className="flex-1 flex items-center justify-center gap-2 p-[13px] rounded-xl font-body text-sm font-semibold cursor-pointer"
                style={{
                  background: wishlistActive ? 'color-mix(in srgb, #FF6B6B 8%, white)' : 'var(--color-surface, white)',
                  color: wishlistActive ? '#FF6B6B' : 'var(--color-text-primary)',
                  border: `1.5px solid ${wishlistActive ? '#FF6B6B' : 'var(--color-border)'}`,
                }}
              >
                <Heart className="w-[18px] h-[18px]" fill={wishlistActive ? '#FF6B6B' : 'none'} />
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
                className="flex-1 flex items-center justify-center gap-2 p-[13px] rounded-xl font-body text-sm font-semibold cursor-pointer"
                style={{ background: 'var(--color-surface, white)', color: 'var(--color-text-primary)', border: '1.5px solid var(--color-border)' }}
              >
                <Share2 className="w-[18px] h-[18px]" />
                Delen
              </button>
            </div>
          </div>

          {/* ===== TRUST SIGNALS ===== */}
          <div className="grid grid-cols-2 gap-2.5 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <Truck className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              Gratis verzending vanaf €150
            </div>
            <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <Undo2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              30 dagen retourrecht
            </div>
            <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <CreditCard className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              Op rekening bestellen
            </div>
            <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: 'var(--color-primary)' }} />
              CE & ISO gecertificeerd
            </div>
          </div>
        </div>
      </div>

      {/* ========== MOBILE: Product Info ========== */}
      <div className="p-4 lg:hidden">
        {/* Brand */}
        {product.brand && (
          <div className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--color-primary)' }}>
            <Award className="w-[13px] h-[13px]" />
            {typeof product.brand === 'object' ? (product.brand as any).name : product.brand}
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading text-xl font-extrabold leading-tight tracking-tight mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {product.title}
        </h1>

        {/* SKU / EAN */}
        <div className="font-mono text-[11px] mb-3 flex items-center gap-2 flex-wrap" style={{ color: 'var(--color-text-muted)' }}>
          {product.sku && <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {product.sku}</span>}
          {product.ean && <span className="flex items-center gap-1"><Barcode className="w-3 h-3" /> {product.ean}</span>}
        </div>

        {/* Price Card - Mobile */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--color-surface, white)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            {hasPrice ? (
              <>
                {showVanaf && <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>Vanaf</span>}
                <span className="font-heading text-[26px] font-extrabold" style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}>
                  €{displayPrice.toFixed(2)}
                </span>
                {oldPrice && (
                  <>
                    <span className="text-base line-through font-normal" style={{ color: 'var(--color-text-muted)' }}>€{oldPrice.toFixed(2)}</span>
                    <span className="text-[11px] font-bold px-2 py-[3px] rounded" style={{ color: '#FF6B6B', background: '#FFF0F0' }}>-{savingsPercent}%</span>
                  </>
                )}
              </>
            ) : (
              <span className="font-heading text-[20px] font-bold" style={{ color: 'var(--color-text-muted)' }}>Prijs op aanvraag</span>
            )}
          </div>
          {isBackorder && (
            <div className="flex items-center gap-2 text-xs text-amber-600 font-medium mt-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
              Op bestelling — levertijd op aanvraag
            </div>
          )}
        </div>

        {/* Stock - Mobile */}
        {!isGrouped && !isVariable && product.trackStock && (product.stock ?? 0) > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-[10px] mb-4 text-[13px]" style={{ background: 'var(--color-success-bg, #f0fdf4)' }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-success, #22c55e)' }} />
            <div className="flex-1 font-semibold text-[#2E7D32]">Op voorraad — {product.stock} stuks</div>
            <Truck className="w-4 h-4 text-[#2E7D32]" />
          </div>
        )}

        {/* Out of stock - Mobile */}
        {isOutOfStock && (
          <div className="mb-4">
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-sm mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
              Tijdelijk uitverkocht
            </div>
            <BackInStockNotifier
              product={{ id: String(product.id), name: product.title }}
              onSubmit={async (email) => { console.log('Back in stock:', email) }}
            />
          </div>
        )}

        {/* Product type sections - Mobile */}
        {isSubscription && features.subscriptions && (
          <div className="mb-5"><SubscriptionPricingTable product={product} onSelectionChange={(s) => setSelectedSubscription(s)} /></div>
        )}
        {isVariable && !isSubscription && features.variableProducts && (
          <div className="mb-5"><VariantSelector product={product} onSelectionChange={(s) => setVariantSelections(s)} /></div>
        )}
        {isGrouped && product.childProducts && (
          <div className="mb-5">
            <GroupedProductTable
              parentProduct={{ id: product.id, title: product.title }}
              childProducts={product.childProducts as Array<{ product: string | Product; sortOrder?: number | null; isDefault?: boolean | null }>}
            />
          </div>
        )}

        {/* Quantity - Mobile */}
        {showAddToCart && (
          <div className="mb-4">
            <div className="text-[13px] font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Aantal</div>
            <div className="inline-flex items-center rounded-[10px] overflow-hidden bg-white" style={{ border: '1.5px solid var(--color-border)' }}>
              <button
                onClick={() => setQuantity(Math.max(minQty, quantity - (product.orderMultiple || 1)))}
                className="w-11 h-11 border-0 cursor-pointer flex items-center justify-center" style={{ background: 'var(--color-background, var(--color-surface))', color: 'var(--color-text-primary)' }}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(minQty, parseInt(e.target.value) || minQty))}
                className="w-[60px] h-11 border-0 text-center font-mono text-base font-bold outline-none" style={{ color: 'var(--color-text-primary)' }}
              />
              <button
                onClick={() => setQuantity(Math.min(maxQty, quantity + (product.orderMultiple || 1)))}
                className="w-11 h-11 border-0 cursor-pointer flex items-center justify-center" style={{ background: 'var(--color-background, var(--color-surface))', color: 'var(--color-text-primary)' }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {quantity > 1 && hasPrice && (
              <div className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {quantity}× €{currentPrice.toFixed(2)} = <strong style={{ color: 'var(--color-text-primary)' }}>€{(currentPrice * quantity).toFixed(2)}</strong>
              </div>
            )}
          </div>
        )}

        {/* ATC - Mobile */}
        {showAddToCart && (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2.5 w-full p-4 text-white border-0 rounded-xl font-body text-base font-bold mb-3 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            {isBackorder ? 'Bestellen' : hasPrice ? `Toevoegen — €${(currentPrice * quantity).toFixed(2)}` : 'Toevoegen'}
          </button>
        )}

        {/* Secondary - Mobile */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setWishlistActive(!wishlistActive)}
            className="flex-1 flex items-center justify-center gap-1.5 p-3 rounded-[10px] font-body text-[13px] font-semibold cursor-pointer"
            style={{
              background: wishlistActive ? 'color-mix(in srgb, #FF6B6B 8%, white)' : 'var(--color-surface, white)',
              color: wishlistActive ? '#FF6B6B' : 'var(--color-text-primary)',
              border: `1.5px solid ${wishlistActive ? '#FF6B6B' : 'var(--color-border)'}`,
            }}
          >
            <Heart className="w-4 h-4" fill={wishlistActive ? '#FF6B6B' : 'none'} />
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
            className="flex-1 flex items-center justify-center gap-1.5 p-3 rounded-[10px] font-body text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--color-surface, white)', color: 'var(--color-text-primary)', border: '1.5px solid var(--color-border)' }}
          >
            <Share2 className="w-4 h-4" />
            Delen
          </button>
        </div>

        {/* Trust Signals - Mobile */}
        <div className="grid grid-cols-2 gap-2 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <Truck className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} /> Gratis vanaf €150
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <Undo2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} /> 30 dagen retour
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <CreditCard className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} /> Op rekening
          </div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} /> CE & ISO
          </div>
        </div>
      </div>

      {/* ========== MOBILE: Accordion Tabs ========== */}
      <div className="px-4 pb-4 lg:hidden">
        {/* Description */}
        <div className="rounded-xl mb-3 overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface, white)' }}>
          <button
            onClick={() => setAccordionOpen(accordionOpen === 'description' ? null : 'description')}
            className="w-full p-4 flex items-center justify-between bg-transparent border-0 cursor-pointer text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}
          >
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Beschrijving</span>
            {accordionOpen === 'description' ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
          </button>
          {accordionOpen === 'description' && (
            <div className="px-4 pb-4 text-sm leading-[1.7]" style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
              {product.description ? <RichText data={product.description} enableProse /> : <p>Geen beschrijving beschikbaar.</p>}
            </div>
          )}
        </div>

        {/* Specifications */}
        {Array.isArray(product.specifications) && product.specifications.length > 0 && (
          <div className="rounded-xl mb-3 overflow-hidden" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface, white)' }}>
            <button
              onClick={() => setAccordionOpen(accordionOpen === 'specs' ? null : 'specs')}
              className="w-full p-4 flex items-center justify-between bg-transparent border-0 cursor-pointer text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}
            >
              <span className="flex items-center gap-2"><List className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Specificaties</span>
              {accordionOpen === 'specs' ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />}
            </button>
            {accordionOpen === 'specs' && (
              <div style={{ borderTop: '1px solid var(--color-border)' }}>
                {product.specifications.map((specGroup: any, groupIdx: number) => (
                  <div key={groupIdx}>
                    {(specGroup.group || specGroup.groupName) && (
                      <h4 className="py-3 px-4 font-bold text-[13px]" style={{ background: 'var(--color-background)', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                        {specGroup.group || specGroup.groupName}
                      </h4>
                    )}
                    {(specGroup.attributes || specGroup.items || []).map((attr: any, attrIdx: number) => (
                      <div key={attrIdx} className="flex py-2.5 px-4 text-[13px] gap-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <span className="flex-1 font-medium" style={{ color: 'var(--color-text-muted)' }}>{attr.name || attr.label}</span>
                        <span className="flex-1 font-semibold text-right" style={{ color: 'var(--color-text-primary)' }}>{attr.value}{attr.unit ? ` ${attr.unit}` : ''}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========== DESKTOP: Tabs Section ========== */}
      <div className="hidden pt-12 lg:block lg:px-6">
        <ProductTabs tabs={tabsContent} />
      </div>

      {/* ========== Related Products ========== */}
      {features.shop && (
        <div className="pt-16 mt-16 px-4 lg:px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
          <RelatedProductsSection
            upSells={product.upSells as (string | Product)[] | undefined}
            crossSells={product.crossSells as (string | Product)[] | undefined}
            accessories={product.accessories as (string | Product)[] | undefined}
          />
        </div>
      )}

      {/* ========== Sticky Add to Cart Bar ========== */}
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
