'use client'

import { useState, useRef } from 'react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/components/ui/AddToCartToast'
import type { Product } from '@/payload-types'

import {
  ProductGallery,
  ProductMeta,
  ProductTabs,
  ProductSpecsTable,
  StockIndicator,
  StickyAddToCartBar,
  BackInStockNotifier,
  StaffelHintBanner,
  ReviewWidget,
} from '@/branches/ecommerce/components/products'

import { VariantSelector } from '@/branches/ecommerce/components/VariantSelector'
import { SubscriptionPricingTable } from '@/branches/ecommerce/components/SubscriptionPricingTable'
import { RelatedProductsSection } from '@/branches/ecommerce/components/RelatedProductsSection'
import { GroupedProductTable } from '@/branches/ecommerce/templates/products/ProductTemplate1/GroupedProductTable'

import { RichText } from '@/branches/shared/components/common/RichText'
import { Button } from '@/branches/shared/components/ui/button'
import { ShoppingCart, Minus, Plus, Heart, Share2 } from 'lucide-react'
import { features } from '@/lib/features'
import { getGroupedMinPrice } from '@/branches/ecommerce/lib/shop/utils'

export interface ProductTemplate4Props {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductTemplate4({ product }: ProductTemplate4Props) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const mainATCRef = useRef<HTMLDivElement>(null)

  // --- Product type detection ---
  const isGrouped = product.productType === 'grouped'
  const isVariable = product.productType === 'variable'
  const isSubscription = product.isSubscription === true && isVariable
  const isMixMatch = product.productType === 'mixAndMatch'

  // --- Quantity controls ---
  const minQty = product.minOrderQuantity || 1
  const maxQty = product.maxOrderQuantity || (product.stock ?? 999)
  const multiple = product.orderMultiple || 1

  const [quantity, setQuantity] = useState(minQty)
  const [variantSelections, setVariantSelections] = useState<Record<string, any>>({})
  const [wishlistActive, setWishlistActive] = useState(false)

  // --- Price calculation ---
  const groupedMinPrice = isGrouped ? getGroupedMinPrice(product) : null
  const basePrice = product.salePrice || product.price || 0
  const variantModifier = Object.values(variantSelections).reduce(
    (sum: number, v: any) => sum + (v?.priceModifier || 0),
    0,
  )
  const currentPrice = basePrice + variantModifier
  const oldPrice = product.compareAtPrice || (product.salePrice ? product.price : null)
  const hasPrice = product.price != null || product.salePrice != null || groupedMinPrice != null

  // --- Stock status ---
  const isBackorder = product.backordersAllowed === true || product.stockStatus === 'on-backorder'
  const isOutOfStock =
    !isGrouped && !isBackorder && product.trackStock && (product.stock ?? 0) <= 0

  // --- Image handling (multi-tenant safe: gallery + img: tag fallback) ---
  let firstImageUrl: string | null =
    typeof product.images?.[0] === 'object' && product.images[0] !== null
      ? ((product.images[0] as any)?.url as string) || null
      : null

  if (!firstImageUrl && Array.isArray(product.tags)) {
    for (const tagEntry of product.tags as any[]) {
      const tag = typeof tagEntry === 'object' && tagEntry !== null ? tagEntry.tag : tagEntry
      if (typeof tag === 'string' && tag.startsWith('img:')) {
        firstImageUrl = tag.slice(4)
        break
      }
    }
  }

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

  if (galleryImages.length === 0 && firstImageUrl) {
    galleryImages = [{ id: '0', url: firstImageUrl, alt: product.title, thumbnail: firstImageUrl }]
  }

  // --- Handlers ---
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(minQty, Math.min(maxQty, prev + delta * multiple)))
  }

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      title: product.title,
      slug: product.slug || '',
      price: product.price ?? 0,
      quantity,
      unitPrice: currentPrice,
      image: firstImageUrl || undefined,
      sku: product.sku || undefined,
      ean: product.ean || undefined,
      stock: product.stock ?? 0,
    })
    showToast({
      id: String(product.id),
      name: product.title,
      image: firstImageUrl || undefined,
      quantity,
      price: currentPrice,
    })
  }

  // --- Badges ---
  const badges: Array<{
    type: 'sale' | 'new'
    label: string
    position: 'top-left' | 'top-right'
  }> = []
  if (product.salePrice && product.price) {
    const discount = Math.round(((product.price - product.salePrice) / product.price) * 100)
    badges.push({ type: 'sale', label: `-${discount}%`, position: 'top-left' })
  }
  const createdDate = new Date(product.createdAt)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  if (createdDate > thirtyDaysAgo) {
    badges.push({ type: 'new', label: 'Nieuw', position: 'top-right' })
  }

  // --- Category ---
  const firstCategory = product.categories?.length ? product.categories[0] : null
  const categoryName =
    typeof firstCategory === 'object' && firstCategory ? firstCategory.name : 'Products'

  // --- ProductMeta data (prices in cents for ProductMeta) ---
  const displayPrice = isGrouped && groupedMinPrice != null ? groupedMinPrice : currentPrice
  const productMetaData = {
    title: product.title,
    category: categoryName || 'Products',
    brand:
      typeof product.brand === 'object' && product.brand ? { name: product.brand.name } : undefined,
    price: Math.round(displayPrice * 100),
    priceOriginal: oldPrice ? Math.round(oldPrice * 100) : undefined,
  }

  // --- Stock indicator ---
  const stockStatus: 'in-stock' | 'low' | 'out' | 'on-backorder' = isBackorder
    ? 'on-backorder'
    : (product.stock ?? 0) > 10
      ? 'in-stock'
      : (product.stock ?? 0) > 0
        ? 'low'
        : 'out'

  // --- Specs groups ---
  const specsGroups = [
    ...(Array.isArray(product.specifications)
      ? product.specifications.map((group: any) => ({
          title: group.groupName || 'Specificaties',
          specs: (group.items || []).map((item: any) => ({
            label: item.label || '',
            value: item.value || '',
          })),
        }))
      : []),
    {
      title: 'Productinformatie',
      specs: [
        ...(product.sku ? [{ label: 'SKU', value: product.sku, mono: true, copyable: true }] : []),
        ...(product.ean ? [{ label: 'EAN', value: product.ean, mono: true, copyable: true }] : []),
        {
          label: 'Voorraad',
          value: product.trackStock ? String(product.stock ?? 0) : 'Niet bijgehouden',
        },
      ],
    },
  ]

  // --- Tabs ---
  const tabsContent = [
    {
      id: 'description',
      label: 'Beschrijving',
      content: product.description ? (
        <RichText data={product.description} enableProse />
      ) : (
        <p className="text-gray-500">Geen beschrijving beschikbaar.</p>
      ),
    },
    {
      id: 'specs',
      label: 'Specificaties',
      content: <ProductSpecsTable groups={specsGroups} />,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      content: (
        <ReviewWidget
          productId={String(product.id)}
          productName={product.title}
          reviews={[]}
          summary={{ average: 0, total: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } }}
        />
      ),
    },
  ]

  // --- Volume pricing ---
  const volumeTiers = product.volumePricing || []
  const nextTier = volumeTiers.find((tier: any) => (tier.minQuantity || 0) > quantity)

  // Show qty + ATC for simple and variable (not grouped, not mixmatch)
  const showAddToCart = !isOutOfStock && !isGrouped && !isMixMatch

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* === Product Grid: 2-col desktop, 1-col mobile === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* LEFT: Gallery (sticky on desktop) */}
        <div>
          <ProductGallery
            images={galleryImages}
            badges={badges}
            enableSticky
          />
        </div>

        {/* RIGHT: Product Info */}
        <div className="space-y-6">
          {/* Title, brand, price, rating */}
          <ProductMeta product={productMetaData} showTrustBadges />

          {/* Stock (not for grouped — children have their own) */}
          {!isGrouped && <StockIndicator status={stockStatus} quantity={product.stock ?? 0} />}

          {/* === PRODUCT TYPE SECTIONS === */}

          {/* Variable + Subscription → SubscriptionPricingTable cards */}
          {isSubscription && features.subscriptions && (
            <SubscriptionPricingTable
              product={product}
              onSelectionChange={(selection) => {
                if (selection) {
                  setVariantSelections({ subscription: selection })
                }
              }}
            />
          )}

          {/* Variable (not subscription) → VariantSelector */}
          {isVariable && !isSubscription && features.variableProducts && (
            <VariantSelector
              product={product}
              onSelectionChange={(selections) => setVariantSelections(selections)}
            />
          )}

          {/* Grouped → GroupedProductTable */}
          {isGrouped && product.childProducts && (
            <GroupedProductTable
              parentProduct={{ id: product.id, title: product.title }}
              childProducts={product.childProducts as Array<{ product: string | Product; sortOrder?: number | null; isDefault?: boolean | null }>}
            />
          )}

          {/* Mix & Match → Fallback (no products use this yet) */}
          {isMixMatch && (
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">
                Dit is een samengesteld product. Neem contact met ons op voor meer informatie.
              </p>
            </div>
          )}

          {/* Volume Pricing Banner */}
          {showAddToCart && nextTier && (
            <StaffelHintBanner
              currentQuantity={quantity}
              nextTier={{
                quantity: nextTier.minQuantity || 10,
                discount: nextTier.discountPercentage || 10,
              }}
            />
          )}

          {/* Out of Stock → BackInStockNotifier */}
          {isOutOfStock && (
            <BackInStockNotifier
              product={{ id: String(product.id), name: product.title }}
              onSubmit={async (email) => {
                console.log('Back in stock notification:', email)
              }}
            />
          )}

          {/* Quantity Stepper + Add to Cart (simple & variable only) */}
          {showAddToCart && (
            <>
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold">Aantal:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= minQty}
                    aria-label="Verminder aantal"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold tabular-nums">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxQty}
                    aria-label="Verhoog aantal"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div ref={mainATCRef} className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 h-14 text-base font-bold"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {`In winkelwagen${hasPrice ? ` — €${currentPrice.toFixed(2)}` : ''}`}
                </Button>
              </div>
            </>
          )}

          {/* Wishlist & Share */}
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <button
              onClick={() => setWishlistActive(!wishlistActive)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={
                wishlistActive ? 'Verwijder uit verlanglijst' : 'Toevoegen aan verlanglijst'
              }
            >
              <Heart
                className={`w-5 h-5 ${wishlistActive ? 'fill-red-500 text-red-500' : ''}`}
              />
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
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Deel dit product"
            >
              <Share2 className="w-5 h-5" />
              Delen
            </button>
          </div>
        </div>
      </div>

      {/* === Product Tabs (description, specs, reviews) === */}
      <div className="mb-16">
        <ProductTabs tabs={tabsContent} />
      </div>

      {/* === Related Products (up-sells, cross-sells, accessories) === */}
      {features.shop && (
        <RelatedProductsSection
          upSells={product.upSells as (string | Product)[] | undefined}
          crossSells={product.crossSells as (string | Product)[] | undefined}
          accessories={product.accessories as (string | Product)[] | undefined}
        />
      )}

      {/* === Sticky Add to Cart Bar (appears on scroll) === */}
      {showAddToCart && (
        <StickyAddToCartBar
          product={{
            id: String(product.id),
            name: product.title,
            price: currentPrice,
            image: firstImageUrl || undefined,
          }}
          onAddToCart={() => handleAddToCart()}
          triggerElementRef={mainATCRef as React.RefObject<HTMLElement>}
        />
      )}
    </div>
  )
}
