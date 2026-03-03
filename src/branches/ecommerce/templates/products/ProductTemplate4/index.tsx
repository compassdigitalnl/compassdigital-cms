'use client'

import { useState, useRef, useMemo } from 'react'
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
import { StaffelHintBanner } from '@/branches/ecommerce/components/products/StaffelHintBanner'

// Product-type specific
import { VariantSelector } from '@/branches/ecommerce/components/VariantSelector'
import { SubscriptionPricingTable } from '@/branches/ecommerce/components/SubscriptionPricingTable'
import { RelatedProductsSection } from '@/branches/ecommerce/components/RelatedProductsSection'
import { GroupedProductTable } from '@/branches/ecommerce/templates/products/ProductTemplate1/GroupedProductTable'

// Shared
import { RichText } from '@/branches/shared/components/common/RichText'
import { features } from '@/lib/features'
import { getBrandName, getGroupedMinPrice } from '@/branches/ecommerce/lib/shop/utils'

import {
  Award, Hash, Barcode, Package, Star, Truck, ShoppingCart,
  Undo2, CreditCard, ShieldCheck, Heart, Share2, Minus, Plus,
  ClipboardList, Repeat, Layers, Info, Download,
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
  const isSubscription = isVariable && product.isSubscription === true
  const isMixMatch = product.productType === 'mixAndMatch'
  const isSimple = !isGrouped && !isVariable && !isMixMatch

  // ── Quantity ──
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
      if (typeof tag === 'string' && tag.startsWith('img:')) { imageUrl = tag.slice(4); break }
    }
  }

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

  // ── Brand / Category ──
  const brandName = getBrandName(product.brand as any)
  const firstCategory = product.categories?.length ? product.categories[0] : null
  const categoryName = typeof firstCategory === 'object' && firstCategory ? firstCategory.name : null

  // ── Volume pricing tiers ──
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

  const activeTierIndex = staffelTiers.findIndex(t => quantity >= t.min && quantity <= t.max)
  const bestTierIndex = staffelTiers.length > 0 ? staffelTiers.length - 1 : -1

  const nextStaffelTier = useMemo(() => {
    if (staffelTiers.length === 0) return null
    const next = staffelTiers.find(t => t.min > quantity)
    if (!next) return null
    return { quantity: next.min, discount: next.discount }
  }, [staffelTiers, quantity])

  const isInStaffelTier = staffelTiers.some(t => quantity >= t.min && quantity <= t.max && t.discount > 0)

  // ── Handlers ──
  const scrollToReviews = () => {
    tabsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      const reviewsTab = document.querySelector('[data-tab-id="reviews"]') as HTMLElement
      reviewsTab?.click()
    }, 500)
  }

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

  // ── Format helpers ──
  const fmt = (price: number) => price.toFixed(2).replace('.', ',')
  const fmtSplit = (price: number) => {
    const [whole, cents] = price.toFixed(2).split('.')
    return <>{whole},<small>{cents}</small></>
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

  // ── Review summary (empty — no mock data) ──
  const reviewSummary = {
    average: 0, total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
  }

  const showAddToCart = !isOutOfStock && !isGrouped && !isMixMatch

  // ── Tabs ──
  const tabsContent = [
    {
      id: 'description',
      label: 'Beschrijving',
      content: (
        <div className="t4-desc-grid">
          <div className="t4-desc-text">
            {product.shortDescription && (
              <div className="t4-desc-highlight">
                <Info size={18} />
                <p>{product.shortDescription}</p>
              </div>
            )}
            {product.description ? (
              <RichText data={product.description} enableProse />
            ) : (
              <p className="t4-desc-empty">Geen beschrijving beschikbaar.</p>
            )}
          </div>
          {specsGroups.length > 0 && (
            <div className="t4-desc-sidebar">
              <ProductSpecsTable groups={specsGroups} variant="compact" />
            </div>
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
      ? [{
          id: 'downloads',
          label: 'Downloads',
          content: (
            <div className="t4-downloads-grid">
              {(product.downloads as any[]).map((dl: any, idx: number) => {
                const file = typeof dl === 'object' && dl !== null ? dl : null
                if (!file || !file.url) return null
                return (
                  <a key={idx} href={file.url} download className="t4-download-item">
                    <div className="t4-download-icon"><Download size={20} /></div>
                    <div>
                      <div className="t4-download-name">{file.filename || 'Download'}</div>
                      {file.filesize && (
                        <div className="t4-download-size">{(file.filesize / 1024 / 1024).toFixed(2)} MB</div>
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

  return (
    <div className="t4-root">
      {/* ═══ MAIN LAYOUT: Gallery + Info ═══ */}
      <div className="t4-layout">

        {/* LEFT: Gallery with heart/share overlay */}
        <div className="t4-gallery-wrapper">
          <div className="t4-gallery-actions">
            <button
              className={`t4-g-action ${wishlistActive ? 't4-g-action-active' : ''}`}
              onClick={() => setWishlistActive(!wishlistActive)}
            >
              <Heart size={18} fill={wishlistActive ? '#FF6B6B' : 'none'} stroke={wishlistActive ? '#FF6B6B' : 'currentColor'} />
            </button>
            <button
              className="t4-g-action"
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.share) {
                  navigator.share({ title: product.title, url: window.location.href })
                } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
          <ProductGallery
            images={galleryImages}
            badges={galleryBadges}
            enableZoom
            enableLightbox
            enableSticky
            stickyOffset={100}
            borderRadius={20}
            aspectRatio={1}
            layout="horizontal"
          />
        </div>

        {/* RIGHT: Product Info */}
        <div className="t4-info">

          {/* Brand */}
          {brandName && (
            <div className="t4-brand">
              <Award size={14} />
              {brandName}
            </div>
          )}

          {/* Title */}
          <h1 className="t4-title">{product.title}</h1>

          {/* SKU / EAN / Packaging */}
          <div className="t4-sku">
            {product.sku && <span><Hash size={13} /> Art. {product.sku}</span>}
            {product.ean && <span><Barcode size={13} /> EAN {product.ean}</span>}
            {(product as any).packagingUnit && <span><Package size={13} /> {(product as any).packagingUnit}</span>}
          </div>

          {/* Rating → scroll to reviews */}
          <div className="t4-rating" onClick={scrollToReviews} role="button" tabIndex={0}>
            <div className="t4-stars">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="none" stroke="#E8ECF1" />
              ))}
            </div>
            <span className="t4-rating-text">
              <strong>0</strong> / 5 — 0 beoordelingen
            </span>
          </div>

          {/* ═══ PRICE BLOCK (card) ═══ */}
          <div className="t4-price-block">
            <div className="t4-price-row">
              {hasPrice ? (
                <>
                  {showVanaf && <span className="t4-price-vanaf">Vanaf</span>}
                  <span className={`t4-price-current ${oldPrice ? 't4-price-sale' : ''}`}>
                    €{fmtSplit(displayPrice)}
                  </span>
                  {oldPrice && (
                    <>
                      <span className="t4-price-old">€{fmt(oldPrice)}</span>
                      <span className="t4-price-save">Bespaar {savingsPercent}%</span>
                    </>
                  )}
                </>
              ) : (
                <span className="t4-price-request">Prijs op aanvraag</span>
              )}
            </div>
            <div className="t4-price-meta">
              {(product as any).packagingUnit ? `${(product as any).packagingUnit} · ` : ''}excl. BTW
            </div>

            {/* Staffelprijzen — 4-column clickable grid */}
            {staffelTiers.length > 0 && !isGrouped && hasPrice && (
              <div className="t4-volume-pricing">
                <div className="t4-volume-label">
                  <Layers size={16} />
                  Staffelprijzen — meer bestellen = meer besparen
                </div>
                <div className="t4-volume-table">
                  {staffelTiers.map((tier, i) => (
                    <div
                      key={i}
                      className={`t4-volume-tier${activeTierIndex === i ? ' active' : ''}${bestTierIndex === i ? ' best' : ''}`}
                      onClick={() => setQuantity(tier.min)}
                    >
                      <div className="t4-volume-qty">
                        {tier.min}–{tier.max === Infinity ? '∞' : tier.max}
                      </div>
                      <div className="t4-volume-price">€{fmt(tier.price)}</div>
                      <div className="t4-volume-discount">
                        {tier.discount > 0 ? `-${tier.discount}%` : 'standaard'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* StaffelHintBanner */}
          {nextStaffelTier && showAddToCart && (
            <div className="t4-staffel-hint">
              <StaffelHintBanner
                currentQuantity={quantity}
                nextTier={nextStaffelTier}
                variant={isInStaffelTier ? 'success' : 'default'}
              />
            </div>
          )}
          {!nextStaffelTier && isInStaffelTier && showAddToCart && (
            <div className="t4-staffel-hint">
              <StaffelHintBanner
                currentQuantity={quantity}
                nextTier={{ quantity, discount: staffelTiers[staffelTiers.length - 1]?.discount || 0 }}
                achieved
              />
            </div>
          )}

          {/* ═══ STOCK ROW (pulsing dot + truck) ═══ */}
          {!isGrouped && !isOutOfStock && !isBackorder && product.trackStock && (product.stock ?? 0) > 0 && (
            <div className="t4-stock-row">
              <span className="t4-stock-dot" />
              <div>
                <div className="t4-stock-text">Op voorraad — morgen geleverd</div>
                <div className="t4-stock-sub">
                  {product.leadTime || 'Besteld voor 16:00 uur, morgen bij u afgeleverd'}
                </div>
              </div>
              <Truck size={16} style={{ marginLeft: 'auto', color: '#2E7D32' }} />
            </div>
          )}

          {isBackorder && !isOutOfStock && (
            <div className="t4-stock-row t4-stock-backorder">
              <span className="t4-stock-dot t4-stock-dot-amber" />
              <div>
                <div className="t4-stock-text" style={{ color: '#B45309' }}>
                  Op bestelling — levertijd op aanvraag
                </div>
              </div>
            </div>
          )}

          {isOutOfStock && (
            <div className="t4-oos-section">
              <div className="t4-stock-row t4-stock-oos">
                <span className="t4-stock-dot t4-stock-dot-red" />
                <div className="t4-stock-text" style={{ color: '#B91C1C' }}>Tijdelijk uitverkocht</div>
              </div>
              <BackInStockNotifier
                product={{ id: String(product.id), name: product.title }}
                onSubmit={async (email) => { console.log('Back in stock:', email) }}
              />
            </div>
          )}

          {/* ═══ PRODUCT TYPE SECTIONS ═══ */}
          {isSubscription && features.subscriptions && (
            <div className="t4-type-section">
              <SubscriptionPricingTable
                product={product}
                onSelectionChange={(selection) => setSelectedSubscription(selection)}
              />
            </div>
          )}

          {isVariable && !isSubscription && features.variableProducts && (
            <div className="t4-type-section">
              <VariantSelector
                product={product}
                onSelectionChange={(selections) => setVariantSelections(selections)}
              />
            </div>
          )}

          {isGrouped && product.childProducts && (
            <div className="t4-type-section">
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
            <div className="t4-mix-match">
              <Package size={20} />
              <p>Dit product is beschikbaar als samengesteld pakket.</p>
              <p>Neem contact op voor meer informatie.</p>
            </div>
          )}

          {/* ═══ QUANTITY STEPPER ═══ */}
          {showAddToCart && (isSimple || isVariable) && (
            <div className="t4-qty-section">
              <div className="t4-qty-label">Aantal</div>
              <div className="t4-qty-stepper">
                <button onClick={() => setQuantity(Math.max(minQty, quantity - (product.orderMultiple || 1)))}>
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(minQty, Math.min(maxQty, parseInt(e.target.value) || minQty)))}
                />
                <button onClick={() => setQuantity(Math.min(maxQty, quantity + (product.orderMultiple || 1)))}>
                  <Plus size={16} />
                </button>
              </div>
              {quantity > 1 && hasPrice && (
                <div className="t4-qty-total">
                  {quantity}× €{fmt(currentPrice)} ={' '}
                  <strong>€{fmt(currentPrice * quantity)}</strong>
                </div>
              )}
            </div>
          )}

          {/* ═══ ACTION BUTTONS ═══ */}
          <div ref={mainATCRef} className="t4-action-buttons">
            {showAddToCart && (
              <button className="t4-btn-atc" onClick={handleAddToCart}>
                <ShoppingCart size={20} />
                {isBackorder
                  ? 'Bestellen'
                  : hasPrice
                    ? `Toevoegen — €${fmt(currentPrice * quantity)}`
                    : 'Toevoegen aan winkelwagen'}
              </button>
            )}
            <div className="t4-btn-row">
              <button className="t4-btn-secondary">
                <ClipboardList size={18} /> Op bestellijst
              </button>
              <button className="t4-btn-secondary">
                <Repeat size={18} /> Herhaalbestelling
              </button>
            </div>
          </div>

          {/* ═══ TRUST SIGNALS (2×2 grid) ═══ */}
          <div className="t4-trust">
            <div className="t4-trust-item"><Truck size={16} /> Gratis verzending vanaf €150</div>
            <div className="t4-trust-item"><Undo2 size={16} /> 30 dagen retourrecht</div>
            <div className="t4-trust-item"><CreditCard size={16} /> Op rekening bestellen</div>
            <div className="t4-trust-item"><ShieldCheck size={16} /> CE & ISO gecertificeerd</div>
          </div>
        </div>
      </div>

      {/* ═══ TABS (Description, Specs, Reviews, Downloads) ═══ */}
      <div ref={tabsSectionRef} className="t4-tabs-section">
        <ProductTabs tabs={tabsContent} enableMobileAccordion enableKeyboardNav />
      </div>

      {/* ═══ RELATED PRODUCTS ═══ */}
      {(product.upSells?.length || product.crossSells?.length || product.accessories?.length) ? (
        <div className="t4-related-section">
          <RelatedProductsSection
            upSells={product.upSells as (string | Product)[] | undefined}
            crossSells={product.crossSells as (string | Product)[] | undefined}
            accessories={product.accessories as (string | Product)[] | undefined}
          />
        </div>
      ) : null}

      {/* ═══ STICKY ADD-TO-CART BAR ═══ */}
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

      {/* ═══ SCOPED STYLES — Design Spec ═══ */}
      <style jsx>{`
        .t4-root {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        .t4-layout {
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 48px;
          align-items: start;
        }

        /* ── Gallery ── */
        .t4-gallery-wrapper { position: relative; }
        .t4-gallery-actions {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          display: flex; gap: 8px;
        }
        .t4-g-action {
          width: 40px; height: 40px; background: white;
          border: 1px solid #E8ECF1; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: #0A1628;
        }
        .t4-g-action:hover {
          border-color: var(--color-primary, #00897B);
          background: rgba(0,137,123,0.15);
        }
        .t4-g-action-active {
          border-color: #FF6B6B; background: #FFF0F0;
        }

        /* ── Product Info ── */
        .t4-brand {
          font-size: 12px; font-weight: 700; text-transform: uppercase;
          color: var(--color-primary, #00897B); letter-spacing: 0.05em;
          margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }
        .t4-title {
          font-family: 'Plus Jakarta Sans', var(--font-heading), sans-serif;
          font-size: 28px; font-weight: 800; color: var(--color-text-primary, #0A1628);
          line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .t4-sku {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; color: #94A3B8; margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .t4-sku span { display: flex; align-items: center; gap: 4px; }
        .t4-rating {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px; padding-bottom: 20px;
          border-bottom: 1px solid #E8ECF1; cursor: pointer;
        }
        .t4-stars { display: flex; gap: 2px; }
        .t4-rating-text { font-size: 13px; color: #94A3B8; }
        .t4-rating-text :global(strong) { color: var(--color-text-primary, #0A1628); }

        /* ── Price Block ── */
        .t4-price-block {
          background: white; border: 1px solid #E8ECF1;
          border-radius: 16px; padding: 24px; margin-bottom: 20px;
        }
        .t4-price-row {
          display: flex; align-items: baseline; gap: 12px;
          margin-bottom: 4px; flex-wrap: wrap;
        }
        .t4-price-current {
          font-family: 'Plus Jakarta Sans', var(--font-heading), sans-serif;
          font-size: 32px; font-weight: 800;
          color: var(--color-text-primary, #0A1628);
        }
        .t4-price-current :global(small) { font-size: 20px; }
        .t4-price-sale { color: #FF6B6B; }
        .t4-price-vanaf { font-size: 14px; font-weight: 500; color: #94A3B8; }
        .t4-price-old {
          font-size: 18px; color: #94A3B8;
          text-decoration: line-through; font-weight: 400;
        }
        .t4-price-save {
          font-size: 13px; font-weight: 700; color: #FF6B6B;
          background: #FFF0F0; padding: 3px 10px; border-radius: 6px;
        }
        .t4-price-request {
          font-family: 'Plus Jakarta Sans', var(--font-heading), sans-serif;
          font-size: 24px; font-weight: 700; color: #94A3B8;
        }
        .t4-price-meta { font-size: 12px; color: #94A3B8; margin-bottom: 16px; }

        /* Volume pricing 4-column grid */
        .t4-volume-pricing { margin-top: 16px; }
        .t4-volume-label {
          font-size: 13px; font-weight: 700;
          color: var(--color-text-primary, #0A1628);
          margin-bottom: 8px; display: flex; align-items: center; gap: 6px;
        }
        .t4-volume-label :global(svg) { color: var(--color-primary, #00897B); }
        .t4-volume-table {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        }
        .t4-volume-tier {
          background: #F5F7FA; border: 1.5px solid #E8ECF1;
          border-radius: 10px; padding: 12px; text-align: center;
          cursor: pointer; transition: all 0.2s; position: relative;
        }
        .t4-volume-tier:hover,
        .t4-volume-tier.active {
          border-color: var(--color-primary, #00897B);
          background: rgba(0,137,123,0.15);
        }
        .t4-volume-tier.best::after {
          content: 'Beste prijs';
          position: absolute; top: -10px; left: 50%;
          transform: translateX(-50%);
          background: var(--color-primary, #00897B); color: white;
          font-size: 10px; font-weight: 700;
          padding: 2px 8px; border-radius: 4px; white-space: nowrap;
        }
        .t4-volume-qty { font-size: 12px; color: #94A3B8; font-weight: 500; margin-bottom: 4px; }
        .t4-volume-price {
          font-family: 'Plus Jakarta Sans', var(--font-heading), sans-serif;
          font-size: 16px; font-weight: 800;
          color: var(--color-text-primary, #0A1628);
        }
        .t4-volume-discount {
          font-size: 11px; color: var(--color-primary, #00897B);
          font-weight: 600; margin-top: 2px;
        }

        .t4-staffel-hint { margin-bottom: 20px; border-radius: 10px; overflow: hidden; }

        /* ── Stock ── */
        .t4-stock-row {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; background: #E8F5E9;
          border-radius: 10px; margin-bottom: 20px;
        }
        .t4-stock-backorder { background: #FFF8E1; }
        .t4-stock-oos { background: #FEF2F2; margin-bottom: 12px; }
        .t4-stock-dot {
          width: 8px; height: 8px; background: #00C853;
          border-radius: 50%; flex-shrink: 0;
          animation: t4pulse 2s infinite;
        }
        .t4-stock-dot-amber { background: #F59E0B; }
        .t4-stock-dot-red { background: #EF4444; animation: none; }
        @keyframes t4pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .t4-stock-text { font-size: 13px; font-weight: 600; color: #2E7D32; }
        .t4-stock-sub { font-size: 12px; color: #558B2F; }
        .t4-oos-section { margin-bottom: 20px; }

        /* ── Product Type Sections ── */
        .t4-type-section { margin-bottom: 24px; }
        .t4-mix-match {
          padding: 24px; border-radius: 12px;
          background: white; border: 1px solid #E8ECF1;
          margin-bottom: 24px; text-align: center; color: #64748B;
        }
        .t4-mix-match p { margin-top: 8px; font-size: 14px; }

        /* ── Qty Stepper ── */
        .t4-qty-section { margin-bottom: 16px; }
        .t4-qty-label {
          font-size: 14px; font-weight: 700;
          color: var(--color-text-primary, #0A1628); margin-bottom: 8px;
        }
        .t4-qty-stepper {
          display: inline-flex; align-items: center;
          border: 1.5px solid #E8ECF1; border-radius: 10px;
          overflow: hidden; background: white;
        }
        .t4-qty-stepper button {
          width: 44px; height: 44px; border: 0; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          background: #F5F7FA; color: var(--color-text-primary, #0A1628);
          transition: all 0.15s;
        }
        .t4-qty-stepper button:hover {
          background: rgba(0,137,123,0.15);
          color: var(--color-primary, #00897B);
        }
        .t4-qty-stepper input {
          width: 60px; height: 44px; border: 0; text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 16px; font-weight: 700;
          color: var(--color-text-primary, #0A1628); outline: none;
          -moz-appearance: textfield;
        }
        .t4-qty-stepper input::-webkit-inner-spin-button,
        .t4-qty-stepper input::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        .t4-qty-total { margin-top: 8px; font-size: 13px; color: #94A3B8; }
        .t4-qty-total :global(strong) { color: var(--color-text-primary, #0A1628); }

        /* ── Action Buttons ── */
        .t4-action-buttons {
          display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;
        }
        .t4-btn-atc {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, var(--color-primary, #00897B), var(--color-primary-light, #26A69A));
          color: white; border: none; border-radius: 12px;
          font-family: 'DM Sans', var(--font-body), sans-serif;
          font-size: 16px; font-weight: 700; cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,137,123,0.4);
        }
        .t4-btn-atc:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,137,123,0.5);
        }
        .t4-btn-atc:active { transform: scale(0.98); }
        .t4-btn-row { display: flex; gap: 10px; }
        .t4-btn-secondary {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px; background: white;
          color: var(--color-text-primary, #0A1628);
          border: 1.5px solid #E8ECF1; border-radius: 12px;
          font-family: 'DM Sans', var(--font-body), sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .t4-btn-secondary:hover {
          border-color: var(--color-primary, #00897B);
          color: var(--color-primary, #00897B);
          background: rgba(0,137,123,0.15);
        }

        /* ── Trust Signals ── */
        .t4-trust {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
          padding-top: 20px; border-top: 1px solid #E8ECF1;
        }
        .t4-trust-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #64748B;
        }
        .t4-trust-item :global(svg) {
          color: var(--color-primary, #00897B); flex-shrink: 0;
        }

        /* ── Tabs Section ── */
        .t4-tabs-section { padding-top: 48px; }

        /* Description 2-column grid */
        .t4-desc-grid {
          display: grid; grid-template-columns: 2fr 1fr; gap: 40px;
        }
        .t4-desc-text { font-size: 15px; color: #64748B; line-height: 1.7; }
        .t4-desc-highlight {
          display: flex; gap: 12px; padding: 16px 20px;
          background: rgba(0,137,123,0.05);
          border: 1px solid rgba(0,137,123,0.12);
          border-radius: 12px; margin-bottom: 20px;
          align-items: flex-start;
        }
        .t4-desc-highlight :global(svg) {
          color: var(--color-primary, #00897B); flex-shrink: 0; margin-top: 2px;
        }
        .t4-desc-highlight p {
          font-size: 14px; font-weight: 500;
          color: var(--color-text-primary, #0A1628);
          margin: 0; line-height: 1.6;
        }
        .t4-desc-empty { text-align: center; padding: 32px; color: #94A3B8; }
        .t4-desc-sidebar { position: sticky; top: 100px; }

        /* Downloads */
        .t4-downloads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;
        }
        .t4-download-item {
          display: flex; align-items: center; gap: 12px;
          padding: 16px; border-radius: 12px;
          background: white; border: 1px solid #E8ECF1;
          text-decoration: none; color: var(--color-text-primary, #0A1628);
          transition: all 0.2s;
        }
        .t4-download-item:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .t4-download-icon {
          width: 40px; height: 40px; border-radius: 8px;
          background: rgba(0,137,123,0.08);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .t4-download-icon :global(svg) { color: var(--color-primary, #00897B); }
        .t4-download-name { font-size: 14px; font-weight: 600; }
        .t4-download-size { font-size: 12px; color: #94A3B8; }

        /* ── Related Products ── */
        .t4-related-section {
          padding-top: 64px; margin-top: 48px;
          border-top: 1px solid #E8ECF1;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .t4-root { padding: 0 16px 60px; }
          .t4-layout { grid-template-columns: 1fr; gap: 24px; }
          .t4-title { font-size: 22px; }
          .t4-price-block { padding: 16px; }
          .t4-price-current { font-size: 26px; }
          .t4-price-current :global(small) { font-size: 16px; }
          .t4-volume-table { grid-template-columns: repeat(2, 1fr); }
          .t4-desc-grid { grid-template-columns: 1fr; }
          .t4-desc-sidebar { position: static; }
          .t4-btn-secondary { font-size: 13px; padding: 11px 8px; }
        }
      `}</style>
    </div>
  )
}
