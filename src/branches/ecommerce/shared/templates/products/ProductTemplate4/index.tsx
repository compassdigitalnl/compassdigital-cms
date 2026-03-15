'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import { useAddToCartToast } from '@/branches/ecommerce/shared/components/ui/AddToCartToast'
import { VariantSelector } from '@/branches/ecommerce/shared/components/VariantSelector'
import { SubscriptionPricingTable } from '@/branches/ecommerce/shared/components/SubscriptionPricingTable'
import { RelatedProductsSection } from '@/branches/ecommerce/shared/components/RelatedProductsSection'
import { RichText } from '@/branches/shared/components/common/RichText'

const StaffelCalculator = dynamic(
  () => import('@/branches/ecommerce/b2b/components/products/StaffelCalculator').then(m => ({ default: m.StaffelCalculator })),
  { ssr: false }
)
const ReviewWidget = dynamic(
  () => import('@/branches/ecommerce/b2c/components/products/ReviewWidget').then(m => ({ default: m.ReviewWidget })),
  { ssr: false }
)
import { BackInStockNotifier } from '@/branches/ecommerce/shared/components/products/BackInStockNotifier'
import { ConfiguratorContainer } from '@/branches/ecommerce/shared/components/product-types/configurator/ConfiguratorContainer'
import { BookableContainer } from '@/branches/ecommerce/shared/components/product-types/bookable/BookableContainer'
import { PersonalizedContainer } from '@/branches/ecommerce/shared/components/product-types/personalized/PersonalizedContainer'
import { ProductTabs } from '@/branches/ecommerce/shared/components/products/ProductTabs'
import { useEcommerceSettings } from '@/branches/ecommerce/shared/hooks/useEcommerceSettings'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import { features } from '@/lib/tenant/features'
import { getGroupedMinPrice } from '@/branches/ecommerce/shared/lib/shop/utils'
import type { Product, Brand, Media, ProductCategory } from '@/payload-types'
// Extended product type with fields that exist at runtime but may not be in generated types
type ExtendedProduct = Product & {
  packaging?: string
  features?: string[]
  isSubscription?: boolean
}

// Helper to extract image URL from a Payload media reference
type MediaRef = number | Media

function getMediaUrl(img: MediaRef | undefined | null): string | null {
  if (typeof img === 'object' && img !== null) return img.url || null
  return null
}

// Cart item shape for grouped products
interface GroupedCartItem {
  id: number | string
  title: string
  slug: string
  price: number
  quantity: number
  unitPrice: number
  image?: string
  sku?: string
  ean?: string
  stock: number
  minOrderQuantity?: number
  orderMultiple?: number
  maxOrderQuantity?: number
  parentProductId: number
  parentProductTitle: string
  backordersAllowed: boolean
}

// Variant selection shape
interface VariantSelection {
  label: string
  value?: string
  priceModifier?: number
}

// Subscription selection shape
interface SubscriptionSelection {
  label: string
  value?: string
  priceModifier?: number
  discountPercentage?: number
  stockLevel?: number
}

// Search hit from Meilisearch API
interface SearchHit {
  id: string | number
  title: string
  slug?: string
  image?: string
  effectivePrice?: number
  price?: number
}
import {
  Heart,
  Share2,
  ZoomIn,
  Award,
  Hash,
  Barcode,
  Package,
  Star,
  Truck,
  ShoppingCart,
  ClipboardList,
  Repeat,
  Undo2,
  CreditCard,
  ShieldCheck,
  Download,
  Ruler,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Info,
  Minus,
  Wrench,
} from 'lucide-react'

interface SidebarItem { id: string | number; title: string; slug?: string; image?: string; price?: number }

function ProductSidebar({ product }: { product: ExtendedProduct }) {
  const { addItem } = useCart()
  const { showToast } = useAddToCartToast()
  const [autoSuggestions, setAutoSuggestions] = useState<SidebarItem[]>([])

  // Curated items (priority order): accessories → crossSells → relatedProducts
  const curated: SidebarItem[] = (() => {
    const fieldArrays: ((number | Product)[] | null | undefined)[] = [product.accessories, product.crossSells, product.relatedProducts]
    for (const arr of fieldArrays) {
      const items = arr?.filter((p): p is Product => typeof p === 'object' && p !== null) || []
      if (items.length > 0) {
        return items.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          image: typeof p.images?.[0] === 'object' && p.images[0]?.url ? p.images[0].url : undefined,
          price: p.salePrice || p.price || 0,
        }))
      }
    }
    return []
  })()

  const curatedTitle = (() => {
    const acc = product.accessories?.filter((p): p is Product => typeof p === 'object') || []
    if (acc.length > 0) return 'Maak je bestelling compleet'
    const cs = product.crossSells?.filter((p): p is Product => typeof p === 'object') || []
    if (cs.length > 0) return 'Vaak samen gekocht'
    const rp = product.relatedProducts?.filter((p): p is Product => typeof p === 'object') || []
    if (rp.length > 0) return 'Misschien ook interessant'
    return ''
  })()

  // Auto-fetch from Meilisearch when no curated items
  useEffect(() => {
    if (curated.length > 0) return
    const categoryIds = product.categories?.map((c: number | ProductCategory) => typeof c === 'object' ? c.id : c).filter(Boolean) || []
    if (categoryIds.length === 0) return

    const params = new URLSearchParams()
    params.set('category', String(categoryIds[0]))
    params.set('limit', '6')

    fetch(`/api/shop/search?${params}`)
      .then(res => res.json())
      .then(data => {
        const hits = ((data.hits || []) as SearchHit[])
          .filter((h) => String(h.id) !== String(product.id))
          .slice(0, 6)
          .map((h) => ({
            id: h.id,
            title: h.title,
            slug: h.slug,
            image: h.image || undefined,
            price: h.effectivePrice ?? h.price ?? 0,
          }))
        setAutoSuggestions(hits)
      })
      .catch(() => {})
  }, [curated.length, product.id, product.categories])

  const items = curated.length > 0 ? curated : autoSuggestions
  const title = curated.length > 0 ? curatedTitle : 'Misschien ook interessant'
  const SidebarIcon = curated.length > 0 && curatedTitle === 'Maak je bestelling compleet' ? Wrench : Sparkles

  if (items.length === 0) return null

  return (
    <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,16px)] p-5 self-start hidden lg:block">
      <h3 className="font-heading text-base font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
        <SidebarIcon className="w-5 h-5 text-[var(--color-primary)]" />
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {items.slice(0, 6).map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-background)] transition-colors">
            <Link href={`/${item.slug}`} className="w-14 h-14 rounded-lg bg-[var(--color-background)] shrink-0 flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
              ) : (
                <Package className="w-6 h-6 text-[var(--color-text-muted)]" />
              )}
            </Link>
            <Link href={`/${item.slug}`} className="min-w-0 flex-1 no-underline">
              <div className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 leading-tight">{item.title}</div>
              {item.price != null && item.price > 0 && (
                <div className="text-sm font-bold text-[var(--color-primary)] mt-0.5">€{item.price.toFixed(2).replace('.', ',')}</div>
              )}
            </Link>
            {item.price != null && item.price > 0 && (
              <button
                onClick={() => {
                  addItem({ id: String(item.id), title: item.title, slug: item.slug || '', price: item.price!, unitPrice: item.price!, stock: 999, quantity: 1 })
                  showToast({ id: String(item.id), name: item.title, image: item.image, quantity: 1, price: item.price! })
                }}
                className="btn btn-primary w-9 h-9 !p-0 shrink-0"
                aria-label={`${item.title} toevoegen aan winkelwagen`}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface ProductTemplate4Props {
  product: ExtendedProduct
  parentGroupedProduct?: ExtendedProduct | null
  defaultSelectedChildId?: number | string
}

export default function ProductTemplate4({ product, parentGroupedProduct, defaultSelectedChildId }: ProductTemplate4Props) {
  const { addItem, addGroupedItems } = useCart()
  const { settings: ecomSettings } = useEcommerceSettings()
  const { showToast } = useAddToCartToast()
  const { formatPriceStr, formatPriceFull, vatLabel, displayPrice } = usePriceMode()
  const [showStickyATC, setShowStickyATC] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [shareMsg, setShareMsg] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  // For grouped products - size quantities (pre-select child if defaultSelectedChildId provided)
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(() => {
    if (defaultSelectedChildId) {
      return { [String(defaultSelectedChildId)]: 1 }
    }
    return {}
  })
  const [totalQty, setTotalQty] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [activeTier, setActiveTier] = useState(0)

  // Simple product quantity
  const [quantity, setQuantity] = useState(1)

  // Variable products - variant selections
  const [variantSelections, setVariantSelections] = useState<Record<string, VariantSelection>>({})
  const [variantPrice, setVariantPrice] = useState(0)

  // Subscription products - selected variant
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionSelection | null>(null)

  // Product type detection
  const isGrouped = product.productType === 'grouped'
  const isVariable = product.productType === 'variable'
  const isSubscription = product.isSubscription === true && isVariable
  const isMixMatch = (product.productType as string) === 'mixAndMatch'
  const isConfigurator = (product.productType as string) === 'configurator'
  const isBookable = (product.productType as string) === 'bookable'
  const isPersonalized = (product.productType as string) === 'personalized'

  const childProducts: Product[] =
    isGrouped && product.childProducts
      ? product.childProducts
          .map((child) => (typeof child.product === 'object' ? child.product : null))
          .filter((p): p is Product => p !== null)
      : []

  // For grouped products: check if ANY child has stock
  const groupedHasStock = isGrouped && childProducts.some((child) => child.stock && child.stock > 0)

  // Calculate variant price
  useEffect(() => {
    if (isVariable && !isSubscription) {
      let total = product.price || 0
      Object.values(variantSelections).forEach((selection) => {
        if (selection.priceModifier) {
          total += selection.priceModifier
        }
      })
      setVariantPrice(total)
    }
  }, [variantSelections, isVariable, isSubscription, product.price])

  // Calculate volume pricing tier
  const volumeTiers = product.volumePricing || []
  const getTierPrice = (qty: number): number => {
    const basePrice = product.price ?? 0
    if (volumeTiers.length === 0) return basePrice

    for (let i = volumeTiers.length - 1; i >= 0; i--) {
      if (qty >= volumeTiers[i].minQuantity) {
        if (volumeTiers[i].discountPercentage) {
          return basePrice * (1 - (volumeTiers[i].discountPercentage ?? 0) / 100)
        }
      }
    }
    return basePrice
  }

  // Update total when size quantities change — use each child's OWN price
  useEffect(() => {
    let totalItems = 0
    let totalCost = 0
    Object.entries(sizeQuantities).forEach(([productId, qty]) => {
      if (qty > 0) {
        const child = childProducts.find((p) => String(p.id) === String(productId))
        const childPrice = child?.salePrice || child?.price || 0
        totalItems += qty
        totalCost += qty * childPrice
      }
    })
    setTotalQty(totalItems)
    setTotalPrice(totalCost)

    // Find active tier
    if (volumeTiers.length > 0) {
      for (let i = volumeTiers.length - 1; i >= 0; i--) {
        if (totalItems >= volumeTiers[i].minQuantity) {
          setActiveTier(i)
          break
        }
      }
    }
  }, [sizeQuantities, volumeTiers, childProducts])

  // Show sticky ATC after scrolling past main ATC button
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 600
      setShowStickyATC(shouldShow)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Strip parent product name prefix from child title
  // "PCU probe covers - 15 x 244 mm" → "15 x 244 mm"
  const childDisplayName = (childTitle: string) => {
    const parentName = product.title
    if (childTitle.startsWith(parentName)) {
      const rest = childTitle.slice(parentName.length).replace(/^\s*[-–—:]\s*/, '')
      return rest || childTitle
    }
    return childTitle
  }

  const stepQty = (productId: string, delta: number) => {
    setSizeQuantities((prev) => {
      const current = prev[productId] || 0
      const newQty = Math.max(0, current + delta)
      return { ...prev, [productId]: newQty }
    })
  }

  // Wishlist toggle (API with localStorage fallback for guests)
  useEffect(() => {
    const pid = String(product.id)
    fetch('/api/account/favorites')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.docs) {
          const isFav = data.docs.some((d: any) => {
            const prodId = typeof d.product === 'object' ? d.product?.id : d.product
            return String(prodId) === pid
          })
          setIsWishlisted(isFav)
        } else {
          // Not logged in — check localStorage
          const wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
          setIsWishlisted(wishlist.includes(pid))
        }
      })
      .catch(() => {
        const wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
        setIsWishlisted(wishlist.includes(pid))
      })
  }, [product.id])

  const toggleWishlist = async () => {
    const pid = String(product.id)
    const newState = !isWishlisted
    setIsWishlisted(newState)

    try {
      if (newState) {
        const res = await fetch('/api/account/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        })
        if (!res.ok) throw new Error('Not logged in')
      } else {
        // Find the wishlist entry ID first
        const listRes = await fetch('/api/account/favorites')
        if (!listRes.ok) throw new Error('Not logged in')
        const listData = await listRes.json()
        const entry = listData.docs?.find((d: any) => {
          const prodId = typeof d.product === 'object' ? d.product?.id : d.product
          return String(prodId) === pid
        })
        if (entry) {
          await fetch(`/api/account/favorites?id=${entry.id}`, { method: 'DELETE' })
        }
      }
    } catch {
      // Fallback to localStorage for guests
      const wishlist: string[] = JSON.parse(localStorage.getItem('wishlist') || '[]')
      const updated = newState
        ? [...wishlist.filter(id => id !== pid), pid]
        : wishlist.filter(id => id !== pid)
      localStorage.setItem('wishlist', JSON.stringify(updated))
    }
  }

  // Share with feedback
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: product.title, url: window.location.href })
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
      setShareMsg('Link gekopieerd!')
      setTimeout(() => setShareMsg(null), 2000)
    }
  }

  // Mobile swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const diff = touchStart - e.changedTouches[0].clientX
    const imgCount = allImages.length || 1
    if (Math.abs(diff) > 50) {
      if (diff > 0) setImageIndex((prev) => Math.min(prev + 1, imgCount - 1))
      else setImageIndex((prev) => Math.max(prev - 1, 0))
    }
    setTouchStart(null)
  }

  const handleAddToCart = () => {
    const firstImageUrl = imageUrl || undefined

    if (isGrouped) {
      // Collect all selected items and add in one batch
      const groupedItems: GroupedCartItem[] = []
      let addedCount = 0
      Object.entries(sizeQuantities).forEach(([productId, qty]) => {
        if (qty > 0) {
          const childProd = childProducts.find((p) => String(p.id) === String(productId))
          if (childProd) {
            const childUnitPrice = childProd.salePrice || childProd.price || 0
            groupedItems.push({
              id: childProd.id,
              title: childProd.title,
              slug: childProd.slug || '',
              price: childProd.price ?? 0,
              quantity: qty,
              unitPrice: childUnitPrice,
              image: getMediaUrl(childProd.images?.[0]) || undefined,
              sku: childProd.sku || undefined,
              ean: childProd.ean || undefined,
              stock: childProd.stock || 0,
              minOrderQuantity: childProd.minOrderQuantity || undefined,
              orderMultiple: childProd.orderMultiple || undefined,
              maxOrderQuantity: childProd.maxOrderQuantity || undefined,
              parentProductId: product.id,
              parentProductTitle: product.title,
              backordersAllowed: childProd.backordersAllowed || false,
            })
            addedCount += qty
          }
        }
      })

      if (groupedItems.length > 0) {
        addGroupedItems(groupedItems)
      }

      // Show toast for grouped products
      if (addedCount > 0) {
        showToast({
          id: String(product.id),
          name: product.title,
          image: firstImageUrl || undefined,
          quantity: addedCount,
          price: totalQty > 0 ? totalPrice / totalQty : 0,
        })
      }
    } else if (isSubscription && selectedSubscription) {
      // Add subscription product
      const subscriptionPrice = (product.price || 0) + (selectedSubscription.priceModifier || 0)
      const discountedPrice = selectedSubscription.discountPercentage
        ? subscriptionPrice * (1 - selectedSubscription.discountPercentage / 100)
        : subscriptionPrice

      addItem({
        id: `${product.id}-sub-${selectedSubscription.value || selectedSubscription.label}`,
        title: `${product.title} - ${selectedSubscription.label}`,
        slug: product.slug || '',
        price: product.price ?? 0,
        quantity: 1,
        unitPrice: discountedPrice,
        image: firstImageUrl,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: selectedSubscription.stockLevel || 999,
        backordersAllowed: product.backordersAllowed || false,
      })

      showToast({
        id: String(product.id),
        name: product.title,
        variant: selectedSubscription.label,
        image: firstImageUrl || undefined,
        quantity: 1,
        price: discountedPrice,
      })
    } else if (isVariable && Object.keys(variantSelections).length > 0) {
      // Add variable product with selected variants — unique ID per combination
      const variantLabels = Object.values(variantSelections).map((v) => v.label).join(', ')
      const variantKey = Object.values(variantSelections).map((v) => v.value || v.label).sort().join('-')

      addItem({
        id: `${product.id}-${variantKey}`,
        title: `${product.title} (${variantLabels})`,
        slug: product.slug || '',
        price: product.price ?? 0,
        quantity: quantity,
        unitPrice: variantPrice,
        image: firstImageUrl,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: (product.stock ?? 0) || 0,
        backordersAllowed: product.backordersAllowed || false,
      })

      showToast({
        id: String(product.id),
        name: product.title,
        variant: variantLabels,
        image: firstImageUrl || undefined,
        quantity: quantity,
        price: variantPrice,
      })
    } else {
      // Add simple product
      const unitPrice = product.salePrice || product.price || 0
      addItem({
        id: String(product.id),
        title: product.title,
        slug: product.slug || '',
        price: product.price ?? 0,
        quantity: quantity,
        unitPrice: unitPrice,
        image: firstImageUrl,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: (product.stock ?? 0) || 0,
        backordersAllowed: product.backordersAllowed || false,
      })

      // Show toast for simple product
      showToast({
        id: String(product.id),
        name: product.title,
        image: firstImageUrl || undefined,
        quantity: quantity,
        price: unitPrice,
      })
    }
  }

  // Extract primary image URL from media upload
  let imageUrl: string | null = getMediaUrl(product.images?.[0])

  // Fallback: extract image URL from tags (WooCommerce import stores images as "img:URL" tags)
  if (!imageUrl && Array.isArray(product.tags)) {
    for (const tagEntry of product.tags) {
      const tag = typeof tagEntry === 'object' && tagEntry !== null ? tagEntry.tag : tagEntry
      if (typeof tag === 'string' && tag.startsWith('img:')) {
        imageUrl = tag.slice(4)
        break
      }
    }
  }

  // Review data — no mock data, empty state
  const avgRating = 0
  const reviewCount = 0
  const reviewSummary = {
    average: 0,
    total: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>,
  }

  // Calculate savings (null-safe)
  const groupedMinPrice = isGrouped ? getGroupedMinPrice(product) : null
  const currentPrice = product.salePrice || product.price || (isGrouped ? groupedMinPrice : null) || 0
  const oldPrice = product.compareAtPrice || (product.salePrice ? product.price : null)
  const savings = oldPrice && currentPrice ? oldPrice - currentPrice : 0
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0
  const hasPrice = product.price != null || product.salePrice != null || groupedMinPrice != null
  const showVanaf = isGrouped && product.price == null && groupedMinPrice != null

  // Backorder detection
  const isBackorder = product.backordersAllowed === true || product.stockStatus === 'on-backorder'
  const isOutOfStock = !isBackorder && !isGrouped && product.trackStock && (product.stock ?? 0) <= 0

  const allImages = product.images || []
  const currentImage = getMediaUrl(allImages[imageIndex]) || imageUrl

  return (
    <>
      <div className="product-template-4 overflow-x-hidden pb-20" style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}>
        {/* MOBILE: Image Gallery - Swipeable */}
        <div
          className="relative w-full h-[280px] md:h-96 lg:hidden bg-[var(--color-background,var(--color-surface))]"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Badges */}
          {(product.badge || product.salePrice) && (
            <div className="absolute top-3 left-3 flex gap-1.5 z-10">
              {savingsPercent > 0 && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-error)] text-white">
                  -{savingsPercent}%
                </span>
              )}
              {product.badge === 'popular' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-primary)] text-white">
                  Bestseller
                </span>
              )}
              {product.badge === 'new' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-primary)] text-white">
                  NIEUW
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            {ecomSettings.features.enableWishlist && (
              <button
                className="w-9 h-9 bg-white/95 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer"
                aria-label={isWishlisted ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}
                onClick={toggleWishlist}
              >
                <Heart className="w-4 h-4" style={{ color: isWishlisted ? '#FF6B6B' : 'var(--color-text-primary)', fill: isWishlisted ? '#FF6B6B' : 'none' }} />
              </button>
            )}
            <button
              className="w-9 h-9 bg-white/95 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer"
              aria-label="Deel product"
              onClick={handleShare}
            >
              {shareMsg ? (
                <Check className="w-4 h-4 text-[var(--color-success)]" />
              ) : (
                <Share2 className="w-4 h-4 text-[var(--color-text-primary)]" />
              )}
            </button>
          </div>

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-5">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title}
                className="max-w-full max-h-full object-contain drop-shadow-md"
              />
            ) : (
              <div className="text-[80px]">📦</div>
            )}
          </div>

          {/* Image Dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-black/50 rounded-full">
              {allImages.slice(0, 5).map((_: MediaRef, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className="h-2 rounded-full border-0 cursor-pointer transition-all duration-300"
                  style={{
                    width: imageIndex === idx ? '20px' : '8px',
                    background: imageIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP: 2-Column Layout (50/50) */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start lg:mb-12 px-4">
          {/* LEFT: Gallery */}
          <div className="gallery">
            {/* Main Image */}
            <div className="w-full h-[480px] bg-[var(--color-surface,white)] rounded-[var(--border-radius,20px)] border border-[var(--color-border,var(--color-border))] flex items-center justify-center relative overflow-hidden">
              {/* Badges */}
              {(product.badge || product.salePrice) && (
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {savingsPercent > 0 && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-error)] text-white">
                      -{savingsPercent}%
                    </span>
                  )}
                  {product.badge === 'popular' && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-primary)] text-white">
                      Bestseller
                    </span>
                  )}
                  {product.badge === 'new' && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-primary)] text-white">
                      NIEUW
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                {ecomSettings.features.enableWishlist && (
                  <button
                    className="w-10 h-10 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center cursor-pointer"
                    aria-label={isWishlisted ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}
                    onClick={toggleWishlist}
                  >
                    <Heart className="w-[18px] h-[18px]" style={{ color: isWishlisted ? '#FF6B6B' : 'var(--color-text-primary)', fill: isWishlisted ? '#FF6B6B' : 'none' }} />
                  </button>
                )}
                <button
                  className="w-10 h-10 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center cursor-pointer"
                  aria-label="Deel product"
                  onClick={handleShare}
                >
                  {shareMsg ? (
                    <Check className="w-[18px] h-[18px] text-[var(--color-success)]" />
                  ) : (
                    <Share2 className="w-[18px] h-[18px] text-[var(--color-text-primary)]" />
                  )}
                </button>
              </div>

              {/* Image */}
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                />
              ) : (
                <div className="text-[120px]">📦</div>
              )}

              {/* Zoom */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="w-10 h-10 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center cursor-pointer"
                  aria-label="Zoom image"
                  onClick={() => currentImage && window.open(currentImage, '_blank')}
                >
                  <ZoomIn className="w-[18px] h-[18px] text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-3">
                {product.images.slice(0, 5).map((img: MediaRef, idx: number) => {
                  const imgUrl = getMediaUrl(img)
                  const isSelected = idx === imageIndex
                  return (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      className="w-20 h-20 rounded-xl bg-[var(--color-surface,white)] cursor-pointer flex items-center justify-center p-0 transition-all"
                      style={{
                        border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        boxShadow: isSelected ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'none',
                      }}
                    >
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info - Desktop Only Content */}
          <div className="product-info">
            {/* Brand */}
            {product.brand && (
              <div className="text-xs font-bold uppercase text-[var(--color-primary)] tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-[14px] h-[14px]" />
                {typeof product.brand === 'object' && product.brand !== null ? (product.brand as Brand).name : product.brand}
              </div>
            )}

            {/* Title */}
            <h1 className="font-heading text-[28px] font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight mb-2">
              {product.title}
            </h1>

            {/* SKU / EAN / Packaging */}
            <div className="font-mono text-xs text-[var(--color-text-muted)] mb-4 flex items-center gap-3 flex-wrap">
              {product.sku && (
                <span className="flex items-center gap-1">
                  <Hash className="w-[13px] h-[13px]" />
                  Art. {product.sku}
                </span>
              )}
              {product.ean && (
                <span className="flex items-center gap-1">
                  <Barcode className="w-[13px] h-[13px]" />
                  EAN {product.ean}
                </span>
              )}
              {product.packaging && (
                <span className="flex items-center gap-1">
                  <Package className="w-[13px] h-[13px]" />
                  {product.packaging}
                </span>
              )}
            </div>

            {/* Rating — always visible, links to reviews tab */}
            <div className="flex items-center gap-2 mb-5 pb-5 border-b border-b-[var(--color-border)]">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i: number) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[var(--color-warning)]"
                    fill={i <= Math.floor(avgRating) ? 'var(--color-warning)' : 'none'}
                  />
                ))}
              </div>
              <span className="text-[13px] text-[var(--color-text-muted)]">
                <strong className="text-[var(--color-text-primary)]">{avgRating.toFixed(1)}</strong> / 5 —{' '}
                {reviewCount} beoordelingen
              </span>
            </div>

            {/* PRICE BLOCK - Will be duplicated for mobile */}
            <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,16px)] p-6 mb-5">
              {/* Current Price */}
              <div className="flex items-baseline gap-3 mb-1">
                {hasPrice ? (
                  <>
                    {showVanaf && (
                      <span className="text-sm font-medium text-[var(--color-text-muted)]">Vanaf</span>
                    )}
                    <span
                      className="font-heading text-[32px] font-extrabold"
                      style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}
                    >
                      €{formatPriceStr(currentPrice, product.taxClass ?? undefined)}
                    </span>
                    {oldPrice && (
                      <>
                        <span className="text-lg text-[var(--color-text-muted)] line-through font-normal">
                          €{formatPriceStr(oldPrice, product.taxClass ?? undefined)}
                        </span>
                        <span className="text-[13px] font-bold text-[var(--color-error)] bg-[var(--color-error-light)] px-2.5 py-[3px] rounded-md">
                          Bespaar {savingsPercent}%
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="font-heading text-[24px] font-bold text-[var(--color-text-muted)]">
                    Prijs op aanvraag
                  </span>
                )}
              </div>

              {/* Stock status - grouped products */}
              {isGrouped && groupedHasStock && (
                <div className="flex items-center gap-2 text-sm text-[var(--color-success-dark)] font-medium mb-2">
                  <span className="w-2 h-2 bg-[var(--color-success)] rounded-full shrink-0" />
                  Op voorraad
                </div>
              )}
              {isBackorder && (!isGrouped || !groupedHasStock) && (
                <div className="flex items-center gap-2 text-sm text-amber-600 font-medium mb-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                  Op bestelling — levertijd op aanvraag
                </div>
              )}

              {/* Price Meta */}
              {product.packaging && (
                <div className="text-xs text-[var(--color-text-muted)] mb-4">
                  {product.packaging} · {vatLabel}
                </div>
              )}

              {/* Volume Pricing - StaffelCalculator Component */}
              {volumeTiers.length > 0 && !isGrouped && hasPrice && (
                <div className="mt-4">
                  <StaffelCalculator
                    productName={product.title}
                    basePrice={product.price ?? 0}
                    tiers={volumeTiers.map((tier) => ({
                      min: tier.minQuantity,
                      max: tier.maxQuantity || Infinity,
                      price: tier.price || (product.price ?? 0) * (1 - (tier.discountPercentage || 0) / 100),
                      discount: tier.discountPercentage || 0,
                    }))}
                    initialQty={quantity}
                    unit="stuks"
                    onQtyChange={(newQty: number) => {
                      setQuantity(newQty)
                    }}
                  />
                </div>
              )}
            </div>

            {/* STOCK */}
            {product.trackStock && (product.stock ?? 0) !== undefined && (product.stock ?? 0) > 0 && !isVariable && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-success-bg)] rounded-[10px] mb-5">
                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full shrink-0" />
                <div>
                  <div className="text-[13px] font-semibold text-[var(--color-success-dark)]">
                    Op voorraad — {(product.stock ?? 0)} stuks beschikbaar
                  </div>
                  {product.leadTime && (
                    <div className="text-xs text-[var(--color-success-dark)] font-normal">
                      Levertijd: {product.leadTime}
                    </div>
                  )}
                </div>
                <Truck className="w-4 h-4 ml-auto text-[var(--color-success-dark)]" />
              </div>
            )}

            {/* OUT OF STOCK + BackInStockNotifier — Desktop */}
            {isOutOfStock && (
              <div className="mb-5">
                <div className="flex items-center gap-2 p-4 bg-coral-50 border border-coral/20 rounded-xl text-coral-700 font-semibold text-sm mb-3">
                  <span className="w-2 h-2 bg-coral rounded-full shrink-0" />
                  Tijdelijk uitverkocht
                </div>
                {ecomSettings.features.enableStockNotifications && (
                  <BackInStockNotifier
                    product={{ id: String(product.id), name: product.title }}
                    onSubmit={async (email) => { console.log('Back in stock notification requested:', { email, productId: product.id }) }}
                  />
                )}
              </div>
            )}

            {/* SUBSCRIPTION PRODUCTS - Pricing Table */}
            {isSubscription && features.subscriptions && (
              <div className="mb-6">
                <SubscriptionPricingTable
                  product={product}
                  onSelectionChange={(selection) => setSelectedSubscription(selection)}
                />
              </div>
            )}

            {/* VARIABLE PRODUCTS - Variant Selector (non-subscription) */}
            {isVariable && !isSubscription && features.variableProducts && (
              <div className="mb-6">
                <VariantSelector
                  product={product}
                  onSelectionChange={(selections) => setVariantSelections(selections)}
                />
              </div>
            )}

            {/* CONFIGURATOR PRODUCTS - Step-by-step configurator */}
            {isConfigurator && features.configuratorProducts && (
              <div className="mb-6">
                <ConfiguratorContainer product={product} />
              </div>
            )}

            {/* BOOKABLE PRODUCTS - Workshop/Experience booking */}
            {isBookable && features.bookableProducts && (
              <div className="mb-6">
                <BookableContainer product={product} />
              </div>
            )}

            {/* PERSONALIZED PRODUCTS - Custom text/images */}
            {isPersonalized && features.personalizedProducts && (
              <div className="mb-6">
                <PersonalizedContainer product={product} />
              </div>
            )}

            {/* SIZE SELECTOR (Grouped Products) */}
            {isGrouped && childProducts.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-bold text-[var(--color-text-primary)] mb-2.5 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
                  Selecteer maten en aantallen
                </div>

                {/* Size Grid */}
                <div className="overflow-x-auto">
                  <div
                    className="grid gap-0 border-[1.5px] border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface,white)] min-w-min"
                    style={{ gridTemplateColumns: `repeat(${childProducts.length}, 1fr)` }}
                  >
                  {childProducts.map((child: Product, idx: number) => {
                    const qty = sizeQuantities[child.id] || 0
                    return (
                      <div
                        key={child.id}
                        className="flex flex-col"
                        style={{ borderRight: idx < childProducts.length - 1 ? '1.5px solid var(--color-border)' : 'none' }}
                      >
                        {/* Header */}
                        <div className="p-2.5 text-center bg-[var(--color-background,var(--color-surface))] border-b-[1.5px] border-b-[var(--color-border)]">
                          <div className="text-[13px] font-bold text-[var(--color-text-primary)]">
                            {childDisplayName(child.title)}
                          </div>
                          {(child.salePrice || child.price) != null && (
                            <div className="mt-1 flex items-center justify-center gap-1.5">
                              <span className="text-[13px] font-extrabold text-[var(--color-primary)]">
                                €{formatPriceStr(child.salePrice || child.price, child.taxClass ?? undefined)}
                              </span>
                              {child.salePrice && child.price && child.salePrice < child.price && (
                                <span className="text-[11px] text-[var(--color-text-muted)] line-through">
                                  €{formatPriceStr(child.price, child.taxClass ?? undefined)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-3 flex flex-col gap-2 items-center">
                          {/* Quantity Input */}
                          <div
                            className="flex items-center rounded-lg overflow-hidden bg-white"
                            style={{ border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}` }}
                          >
                            <button
                              onClick={() => stepQty(child.id, -1)}
                              className="w-8 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={qty}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0)
                                setSizeQuantities((prev) => ({ ...prev, [child.id]: val }))
                              }}
                              className="w-10 h-9 border-0 text-center font-mono text-sm outline-none"
                              style={{
                                fontWeight: qty > 0 ? 700 : 500,
                                color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
                              }}
                            />
                            <button
                              onClick={() => stepQty(child.id, 1)}
                              className="w-8 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                            >
                              +
                            </button>
                          </div>

                          {/* Stock */}
                          {child.stock && child.stock > 0 ? (
                            <div className="text-[11px] text-[var(--color-success)] font-medium flex items-center gap-[3px]">
                              <CheckCircle className="w-[11px] h-[11px]" />
                              {child.stock} op voorraad
                            </div>
                          ) : child.backordersAllowed ? (
                            <div className="text-[11px] text-amber-600 font-medium flex items-center gap-[3px]">
                              <Info className="w-[11px] h-[11px]" />
                              Op bestelling
                            </div>
                          ) : (
                            <div className="text-[11px] text-coral font-medium flex items-center gap-[3px]">
                              <Info className="w-[11px] h-[11px]" />
                              Uitverkocht
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-background,var(--color-surface))] rounded-[10px] mt-3 border-[1.5px] border-[var(--color-border)]">
                  <div className="text-[13px] text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text-primary)]">{totalQty}</strong> artikelen totaal
                    {volumeTiers.length > 0 && totalQty > 0 && ' · staffelprijs van toepassing'}
                  </div>
                  <div className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                    €{formatPriceStr(totalPrice, product.taxClass ?? undefined)}
                  </div>
                </div>
              </div>
            )}

            {/* Simple Product Quantity + Add to Cart — horizontal row */}
            {!isGrouped && !isOutOfStock && (
              <div className="mb-5">
                <div className="flex items-center gap-2">
                  {/* Quantity selector */}
                  <div className="inline-flex items-center border-[1.5px] border-[var(--color-border)] rounded-[10px] overflow-hidden bg-white shrink-0">
                    <button
                      onClick={() => {
                        const minQty = product.minOrderQuantity || 1
                        const step = product.orderMultiple || 1
                        setQuantity(Math.max(minQty, quantity - step))
                      }}
                      className="w-[52px] h-[52px] border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-lg text-[var(--color-text-primary)]"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const minQty = product.minOrderQuantity || 1
                        const stockCap = product.trackStock && !product.backordersAllowed ? (product.stock || 999) : 999
                        const maxQty = product.maxOrderQuantity || stockCap
                        setQuantity(Math.min(maxQty, Math.max(minQty, parseInt(e.target.value) || minQty)))
                      }}
                      className="w-[60px] h-[52px] border-0 text-center font-mono text-base font-bold text-[var(--color-text-primary)] outline-none"
                    />
                    <button
                      onClick={() => {
                        const step = product.orderMultiple || 1
                        const stockCap = product.trackStock && !product.backordersAllowed ? (product.stock || 999) : 999
                        const maxQty = product.maxOrderQuantity || stockCap
                        setQuantity(Math.min(maxQty, quantity + step))
                      }}
                      className="w-[52px] h-[52px] border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-lg text-[var(--color-text-primary)]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    className="btn btn-primary btn-lg flex-1"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    In winkelwagen
                  </button>
                </div>
                {quantity > 1 && hasPrice && (
                  <div className="mt-2 text-sm text-[var(--color-text-muted)]">
                    {quantity}× €{formatPriceStr(currentPrice, product.taxClass ?? undefined)} = <strong className="text-[var(--color-text-primary)]">€{formatPriceStr(currentPrice * quantity, product.taxClass ?? undefined)}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Grouped product Add to Cart (full width) */}
            {isGrouped && !isOutOfStock && (
              <div className="mb-5">
                <button
                  onClick={handleAddToCart}
                  disabled={totalQty === 0}
                  className="btn btn-primary btn-lg w-full"
                >
                  <ShoppingCart className="w-5 h-5" />
                  In winkelwagen
                </button>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2.5 mb-5">

              {/* Secondary Buttons */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => alert('Bestellijst functie komt binnenkort beschikbaar.')}
                  className="btn btn-outline-neutral flex-1"
                >
                  <ClipboardList className="w-[18px] h-[18px]" />
                  Op bestellijst
                </button>
                <button
                  onClick={() => alert('Herhaalbestelling functie komt binnenkort beschikbaar.')}
                  className="btn btn-outline-neutral flex-1"
                >
                  <Repeat className="w-[18px] h-[18px]" />
                  Herhaalbestelling
                </button>
              </div>
            </div>

            {/* TRUST SIGNALS */}
            <div className="grid grid-cols-2 gap-2.5 pt-5 border-t border-t-[var(--color-border)]">
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Truck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                {`Gratis verzending vanaf €${formatPriceStr(ecomSettings.freeShippingThreshold)}`}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Undo2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                {`${ecomSettings.returnDays ?? 30} dagen retourrecht`}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <CreditCard className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                Op rekening bestellen
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                CE & ISO gecertificeerd
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Price + Stock + Actions */}
        <div className="p-4 lg:hidden">
          {/* PRICE BLOCK */}
          <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              {hasPrice ? (
                <>
                  {showVanaf && (
                    <span className="text-xs font-medium text-[var(--color-text-muted)]">Vanaf</span>
                  )}
                  <span
                    className="font-heading text-[26px] font-extrabold"
                    style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}
                  >
                    €{formatPriceStr(currentPrice, product.taxClass ?? undefined)}
                  </span>
                  {oldPrice && (
                    <>
                      <span className="text-base text-[var(--color-text-muted)] line-through font-normal">
                        €{formatPriceStr(oldPrice, product.taxClass ?? undefined)}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--color-error)] bg-[var(--color-error-light)] px-2 py-[3px] rounded">
                        -{savingsPercent}%
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="font-heading text-[20px] font-bold text-[var(--color-text-muted)]">
                  Prijs op aanvraag
                </span>
              )}
            </div>

            {/* Stock status - grouped products mobile */}
            {isGrouped && groupedHasStock && (
              <div className="flex items-center gap-2 text-xs text-[var(--color-success-dark)] font-medium mb-2">
                <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full shrink-0" />
                Op voorraad
              </div>
            )}
            {isBackorder && (!isGrouped || !groupedHasStock) && (
              <div className="flex items-center gap-2 text-xs text-amber-600 font-medium mb-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                Op bestelling — levertijd op aanvraag
              </div>
            )}

            {product.packaging && (
              <div className="text-[11px] text-[var(--color-text-muted)] mb-3">
                {product.packaging} · {vatLabel}
              </div>
            )}

            {/* Volume Pricing - Mobile - StaffelCalculator */}
            {volumeTiers.length > 0 && !isGrouped && hasPrice && (
              <div className="mt-3">
                <StaffelCalculator
                  productName={product.title}
                  basePrice={product.price ?? 0}
                  tiers={volumeTiers.map((tier) => ({
                    min: tier.minQuantity,
                    max: tier.maxQuantity || Infinity,
                    price: tier.price || (product.price ?? 0) * (1 - (tier.discountPercentage || 0) / 100),
                    discount: tier.discountPercentage || 0,
                  }))}
                  initialQty={quantity}
                  unit="stuks"
                  onQtyChange={(newQty: number) => {
                    setQuantity(newQty)
                  }}
                />
              </div>
            )}
          </div>

          {/* STOCK - Mobile */}
          {product.trackStock && (product.stock ?? 0) !== undefined && (product.stock ?? 0) > 0 && !isVariable && (
            <div className="flex items-center gap-2 p-3 bg-[var(--color-success-bg)] rounded-[10px] mb-4 text-[13px]">
              <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-[var(--color-success-dark)]">
                  Op voorraad — {(product.stock ?? 0)} stuks
                </div>
              </div>
              <Truck className="w-4 h-4 text-[var(--color-success-dark)]" />
            </div>
          )}

          {/* OUT OF STOCK + BackInStockNotifier — Mobile */}
          {isOutOfStock && (
            <div className="mb-4">
              <div className="flex items-center gap-2 p-4 bg-coral-50 border border-coral/20 rounded-xl text-coral-700 font-semibold text-sm mb-3">
                <span className="w-2 h-2 bg-coral rounded-full shrink-0" />
                Tijdelijk uitverkocht
              </div>
              {ecomSettings.features.enableStockNotifications && (
                <BackInStockNotifier
                  product={{ id: String(product.id), name: product.title }}
                  onSubmit={async (email) => { console.log('Back in stock notification requested:', { email, productId: product.id }) }}
                />
              )}
            </div>
          )}

          {/* SUBSCRIPTION PRODUCTS - Pricing Table (Mobile) */}
          {isSubscription && features.subscriptions && (
            <div className="mb-5">
              <SubscriptionPricingTable
                product={product}
                onSelectionChange={(selection) => setSelectedSubscription(selection)}
              />
            </div>
          )}

          {/* VARIABLE PRODUCTS - Variant Selector (Mobile, non-subscription) */}
          {isVariable && !isSubscription && features.variableProducts && (
            <div className="mb-5">
              <VariantSelector
                product={product}
                onSelectionChange={(selections) => setVariantSelections(selections)}
              />
            </div>
          )}

          {/* CONFIGURATOR PRODUCTS - Mobile */}
          {isConfigurator && features.configuratorProducts && (
            <div className="mb-5">
              <ConfiguratorContainer product={product} />
            </div>
          )}

          {/* BOOKABLE PRODUCTS - Mobile */}
          {isBookable && features.bookableProducts && (
            <div className="mb-5">
              <BookableContainer product={product} />
            </div>
          )}

          {/* PERSONALIZED PRODUCTS - Mobile */}
          {isPersonalized && features.personalizedProducts && (
            <div className="mb-5">
              <PersonalizedContainer product={product} />
            </div>
          )}

          {/* SIZE SELECTOR - Mobile (Grouped Products) */}
          {isGrouped && childProducts.length > 0 && (
            <div className="mb-5">
              <div className="text-[13px] font-bold text-[var(--color-text-primary)] mb-2.5 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
                Selecteer maten
              </div>

              <div className="space-y-2">
                {childProducts.map((child: Product) => {
                  const qty = sizeQuantities[child.id] || 0
                  return (
                    <div
                      key={child.id}
                      className="rounded-[10px] p-3"
                      style={{
                        border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: qty > 0 ? 'color-mix(in srgb, var(--color-primary) 5%, white)' : 'var(--color-surface, white)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-[13px] font-bold text-[var(--color-text-primary)]">
                            {childDisplayName(child.title)}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {(child.salePrice || child.price) != null && (
                              <span className="text-[13px] font-extrabold text-[var(--color-primary)]">
                                €{formatPriceStr(child.salePrice || child.price, child.taxClass ?? undefined)}
                              </span>
                            )}
                            {child.salePrice && child.price && child.salePrice < child.price && (
                              <span className="text-[11px] text-[var(--color-text-muted)] line-through">
                                €{formatPriceStr(child.price, child.taxClass ?? undefined)}
                              </span>
                            )}
                          </div>
                          {child.stock && child.stock > 0 ? (
                            <div className="text-[11px] text-[var(--color-success)] font-medium mt-0.5">
                              {child.stock} op voorraad
                            </div>
                          ) : child.backordersAllowed ? (
                            <div className="text-[11px] text-amber-600 font-medium mt-0.5">
                              Op bestelling
                            </div>
                          ) : (
                            <div className="text-[11px] text-coral font-medium mt-0.5">
                              Uitverkocht
                            </div>
                          )}
                        </div>
                        <div
                          className="flex items-center rounded-lg overflow-hidden bg-white"
                          style={{ border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}` }}
                        >
                          <button
                            onClick={() => stepQty(child.id, -1)}
                            className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                          >
                            −
                          </button>
                          <div
                            className="w-10 text-center font-mono text-sm"
                            style={{
                              fontWeight: qty > 0 ? 700 : 500,
                              color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
                            }}
                          >
                            {qty}
                          </div>
                          <button
                            onClick={() => stepQty(child.id, 1)}
                            className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Total - Mobile */}
              {totalQty > 0 && (
                <div className="flex items-center justify-between p-3 bg-[var(--color-background,var(--color-surface))] rounded-[10px] mt-3 border-[1.5px] border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text-primary)]">{totalQty}</strong> artikelen totaal
                  </div>
                  <div className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                    €{formatPriceStr(totalPrice, product.taxClass ?? undefined)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Simple Product Quantity - Mobile */}
          {!isGrouped && !isOutOfStock && (
            <div className="mb-4">
              <div className="text-[13px] font-bold text-[var(--color-text-primary)] mb-2">
                Aantal
              </div>
              <div className="inline-flex items-center border-[1.5px] border-[var(--color-border)] rounded-[10px] overflow-hidden bg-white">
                <button
                  onClick={() => {
                    const minQty = product.minOrderQuantity || 1
                    const step = product.orderMultiple || 1
                    setQuantity(Math.max(minQty, quantity - step))
                  }}
                  className="w-11 h-11 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-base text-[var(--color-text-primary)]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const minQty = product.minOrderQuantity || 1
                    const stockCap = product.trackStock && !product.backordersAllowed ? (product.stock || 999) : 999
                    const maxQty = product.maxOrderQuantity || stockCap
                    setQuantity(Math.min(maxQty, Math.max(minQty, parseInt(e.target.value) || minQty)))
                  }}
                  className="w-[60px] h-11 border-0 text-center font-mono text-base font-bold text-[var(--color-text-primary)] outline-none"
                />
                <button
                  onClick={() => {
                    const step = product.orderMultiple || 1
                    const stockCap = product.trackStock && !product.backordersAllowed ? (product.stock || 999) : 999
                    const maxQty = product.maxOrderQuantity || stockCap
                    setQuantity(Math.min(maxQty, quantity + step))
                  }}
                  className="w-11 h-11 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-base text-[var(--color-text-primary)]"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {quantity > 1 && (
                <div className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {quantity}× €{formatPriceStr(currentPrice, product.taxClass ?? undefined)} = <strong className="text-[var(--color-text-primary)]">€{formatPriceStr(currentPrice * quantity, product.taxClass ?? undefined)}</strong>
                </div>
              )}
            </div>
          )}

          {/* Main CTA - Mobile */}
          {!isOutOfStock && (
            <button
              onClick={handleAddToCart}
              disabled={isGrouped && totalQty === 0}
              className="btn btn-primary btn-lg w-full mb-3"
            >
              <ShoppingCart className="w-5 h-5" />
              In winkelwagen
            </button>
          )}

          {/* Secondary Buttons - Mobile */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => alert('Bestellijst functie komt binnenkort beschikbaar.')}
              className="btn btn-outline-neutral btn-sm flex-1"
            >
              <ClipboardList className="w-4 h-4" />
              Bestellijst
            </button>
            <button
              onClick={() => alert('Herhaalbestelling functie komt binnenkort beschikbaar.')}
              className="btn btn-outline-neutral btn-sm flex-1"
            >
              <Repeat className="w-4 h-4" />
              Herhalen
            </button>
          </div>

          {/* Trust Signals - Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-t-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <Truck className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>Gratis vanaf €150</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <Undo2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>30 dagen retour</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <CreditCard className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>Op rekening</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>CE & ISO</span>
            </div>
          </div>
        </div>

        {/* ═══ TABS (Description, Specs, Reviews, Downloads) + Accessories sidebar ═══ */}
        <div className="px-4 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
          <ProductTabs
            enableMobileAccordion
            enableKeyboardNav
            tabs={[
              {
                id: 'description',
                label: 'Beschrijving',
                content: (
                  <div>
                    <div>
                      {product.description && (
                        <>
                          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                            <Info className="w-5 h-5 text-[var(--color-primary)]" />
                            Over dit product
                          </h3>
                          <div className="text-[15px] text-[var(--color-text-primary)] leading-[1.7] mb-4">
                            <RichText data={product.description} enableProse={true} />
                          </div>
                        </>
                      )}
                      {product.features && product.features.length > 0 && (
                        <>
                          <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-3 mt-6 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                            Kenmerken
                          </h3>
                          <ul className="list-none mb-5">
                            {product.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2.5 py-2 text-sm text-[var(--color-text-primary)]">
                                <Check className="w-[18px] h-[18px] text-[var(--color-success)] shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {!product.description && !product.features?.length && (
                        <p className="text-[var(--color-text-muted)]">Geen beschrijving beschikbaar.</p>
                      )}
                    </div>
                  </div>
                ),
              },
              ...(Array.isArray(product.specifications) && product.specifications.length > 0
                ? [{
                    id: 'specs',
                    label: 'Specificaties',
                    content: (
                      <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,16px)] overflow-hidden max-w-[600px]">
                        <h3 className="py-4 px-5 font-heading text-base font-bold bg-[var(--color-background)] border-b border-b-[var(--color-border)]">
                          Technische specificaties
                        </h3>
                        {Array.isArray(product.specifications) && product.specifications.map((specGroup, groupIdx: number) => (
                          <div key={groupIdx}>
                            {specGroup.group && (
                              <h4 className="py-3 px-5 font-bold text-sm bg-[var(--color-background)] border-b border-b-[var(--color-border)]">
                                {specGroup.group}
                              </h4>
                            )}
                            {specGroup.attributes?.map((attr, attrIdx: number) => (
                              <div key={attrIdx} className="flex py-3 px-5 border-b border-b-[var(--color-border)] text-sm">
                                <span className="w-[200px] text-[var(--color-text-muted)] font-medium shrink-0">
                                  {attr.name}
                                </span>
                                <span className="text-[var(--color-text-primary)] font-semibold">
                                  {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ),
                  }]
                : []),
              ...(ecomSettings.features.enableReviews ? [{
                id: 'reviews',
                label: 'Reviews',
                badge: reviewCount > 0 ? reviewCount : undefined,
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
              }] : []),
              ...(product.downloads && product.downloads.length > 0
                ? [{
                    id: 'downloads',
                    label: 'Downloads',
                    content: (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                        {product.downloads.map((download: number | Media, idx: number) => {
                          const file = typeof download === 'object' && download !== null ? download : null
                          if (!file || !file.url) return null
                          return (
                            <a
                              key={idx}
                              href={file.url}
                              download
                              className="flex items-center gap-3 p-4 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,12px)] no-underline text-[var(--color-text-primary)]"
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
            ]}
          />

          {/* Sidebar — curated (accessories/crossSells/related) or auto-suggestions from same category */}
          <ProductSidebar product={product} />

          </div>{/* end grid */}
        </div>

        {/* UP-SELLS - Show above ATC in feature release, for now show after related */}

        {/* CROSS-SELLS, UP-SELLS, ACCESSORIES */}
        {features.shop && (
          <div className="pt-16 border-t border-t-[var(--color-border)] mt-16 px-4">
            <RelatedProductsSection
              upSells={(product.upSells ?? undefined) as (string | Product)[] | undefined}
              crossSells={(product.crossSells ?? undefined) as (string | Product)[] | undefined}
              accessories={(product.accessories ?? undefined) as (string | Product)[] | undefined}
            />
          </div>
        )}

        {/* RELATED PRODUCTS */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="pt-16 border-t border-t-[var(--color-border)] mt-16 px-4">
            <div className="flex justify-between items-center mb-7 flex-wrap gap-4">
              <h2 className="font-heading text-xl md:text-2xl font-extrabold text-[var(--color-text-primary)] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
                Klanten bekeken ook
              </h2>
              <Link
                href="/shop/"
                className="text-[var(--color-primary)] font-semibold text-[13px] md:text-sm no-underline flex items-center gap-1.5"
              >
                Bekijk alle producten
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:hidden -mx-4 px-4">
              {product.relatedProducts.slice(0, 4).map((relProd: number | Product, idx: number) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null

                const rpImg = getMediaUrl(rp.images?.[0])

                return (
                  <Link
                    key={idx}
                    href={`/shop/${rp.slug}`}
                    className="min-w-[200px] bg-[var(--color-surface,white)] rounded-2xl overflow-hidden border border-[var(--color-border)] no-underline text-inherit snap-start shrink-0"
                  >
                    <div className="w-full h-40 bg-[var(--color-background)] flex items-center justify-center">
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-5xl">📦</div>
                      )}
                    </div>

                    <div className="p-3.5">
                      {rp.brand && (
                        <div className="text-[10px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1">
                          {rp.brand}
                        </div>
                      )}
                      <div className="font-semibold text-[13px] text-[var(--color-text-primary)] mb-1 leading-[1.4] line-clamp-2">
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div className="font-mono text-[10px] text-[var(--color-text-muted)] mb-2.5">
                          Art. {rp.sku}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="font-heading text-base font-extrabold text-[var(--color-text-primary)]">
                          {rp.price != null ? `€${formatPriceStr(rp.price, rp.taxClass ?? undefined)}` : 'Prijs op aanvraag'}
                        </div>
                        <button
                          className="btn btn-primary w-9 h-9 !p-0"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (rp.price != null) {
                              addItem({ id: rp.id, title: rp.title, slug: rp.slug || '', price: rp.price, unitPrice: rp.salePrice || rp.price, stock: rp.stock || 0, quantity: 1 })
                              showToast({ id: String(rp.id), name: rp.title, quantity: 1, price: rp.salePrice || rp.price })
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--color-success)] font-medium mt-2.5 pt-2.5 border-t border-t-[var(--color-border)]">
                          <CheckCircle className="w-3 h-3" />
                          Op voorraad
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
              {product.relatedProducts.slice(0, 4).map((relProd: number | Product, idx: number) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null

                const rpImg = getMediaUrl(rp.images?.[0])

                return (
                  <Link
                    key={idx}
                    href={`/shop/${rp.slug}`}
                    className="bg-[var(--color-surface,white)] rounded-[var(--border-radius,16px)] overflow-hidden border border-[var(--color-border)] transition-all duration-[350ms] no-underline text-inherit block"
                  >
                    <div className="w-full h-40 bg-[var(--color-background)] flex items-center justify-center">
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-5xl">📦</div>
                      )}
                    </div>

                    <div className="p-4">
                      {rp.brand && (
                        <div className="text-[11px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1">
                          {rp.brand}
                        </div>
                      )}
                      <div className="font-semibold text-sm text-[var(--color-text-primary)] mb-1 leading-[1.4] line-clamp-2">
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div className="font-mono text-[11px] text-[var(--color-text-muted)] mb-2.5">
                          Art. {rp.sku}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                          {rp.price != null ? `€${formatPriceStr(rp.price, rp.taxClass ?? undefined)}` : 'Prijs op aanvraag'}
                        </div>
                        <button
                          className="btn btn-primary w-[38px] h-[38px] !p-0"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            if (rp.price != null) {
                              addItem({ id: rp.id, title: rp.title, slug: rp.slug || '', price: rp.price, unitPrice: rp.salePrice || rp.price, stock: rp.stock || 0, quantity: 1 })
                              showToast({ id: String(rp.id), name: rp.title, quantity: 1, price: rp.salePrice || rp.price })
                            }
                          }}
                        >
                          <Plus className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[var(--color-success)] font-medium mt-2.5 pt-2.5 border-t border-t-[var(--color-border)]">
                          <CheckCircle className="w-3 h-3" />
                          Op voorraad
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* STICKY ADD TO CART BAR - Mobile & Tablet */}
      {showStickyATC && !isOutOfStock && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-[var(--color-border)] p-3 px-4 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 lg:hidden">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-[var(--color-text-primary)] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {product.title}
            </div>
            <div className="text-base font-extrabold text-[var(--color-primary)] font-heading">
              {hasPrice ? `€${formatPriceStr(currentPrice, product.taxClass ?? undefined)}` : 'Prijs op aanvraag'}
            </div>
          </div>

          {/* Quantity - Simple Product */}
          {!isGrouped && (
            <div className="flex items-center border-[1.5px] border-[var(--color-border)] rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="w-8 text-center font-mono text-sm font-bold text-[var(--color-text-primary)]">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isGrouped && totalQty === 0}
            className="btn btn-primary btn-sm whitespace-nowrap"
          >
            <ShoppingCart className="w-4 h-4" />
            {isGrouped ? `${totalQty} toevoegen` : 'Toevoegen'}
          </button>
        </div>
      )}
    </>
  )
}
