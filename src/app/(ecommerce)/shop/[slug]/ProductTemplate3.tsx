'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { Product } from '@/payload-types'
import {
  ShoppingCart,
  Star,
  Check,
  Truck,
  Shield,
  Award,
  Clock,
  Sparkles,
  ChevronDown,
  Minus,
  Plus,
} from 'lucide-react'

interface ProductTemplate3Props {
  product: Product
}

export default function ProductTemplate3({ product }: ProductTemplate3Props) {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState<'story' | 'details' | 'specs'>('story')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)
  const [showStickyATC, setShowStickyATC] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState<string | null>('story')
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Sticky ATC logic
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 600
      setShowStickyATC(shouldShow)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isGrouped = product.productType === 'grouped'
  const childProducts =
    isGrouped && product.childProducts
      ? product.childProducts
          .map((child) => (typeof child.product === 'object' ? child.product : null))
          .filter((p) => p !== null)
      : []

  // Set default variant
  useEffect(() => {
    if (isGrouped && !selectedVariant && childProducts.length > 0) {
      setSelectedVariant(childProducts[0].id)
    }
  }, [isGrouped, selectedVariant, childProducts])

  const selectedProduct = isGrouped
    ? childProducts.find((p) => p.id === selectedVariant) || childProducts[0]
    : product

  const currentPrice = selectedProduct.salePrice || selectedProduct.price
  const oldPrice = selectedProduct.compareAtPrice || (selectedProduct.salePrice ? selectedProduct.price : null)
  const savings = oldPrice ? oldPrice - currentPrice : 0
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0

  const allImages = selectedProduct.images || []
  const imageUrl =
    typeof allImages[activeImageIndex] === 'object' && allImages[activeImageIndex] !== null
      ? allImages[activeImageIndex].url
      : null

  const handleAddToCart = () => {
    const unitPrice = currentPrice
    const firstImageUrl =
      typeof selectedProduct.images?.[0] === 'object' && selectedProduct.images[0] !== null
        ? selectedProduct.images[0].url
        : null

    addItem({
      id: selectedProduct.id,
      title: selectedProduct.title,
      slug: selectedProduct.slug || '',
      price: selectedProduct.price,
      quantity: quantity,
      unitPrice: unitPrice,
      image: firstImageUrl || undefined,
      sku: selectedProduct.sku || undefined,
      ean: selectedProduct.ean || undefined,
      stock: selectedProduct.stock || 0,
      parentProductId: isGrouped ? product.id : undefined,
      parentProductTitle: isGrouped ? product.title : undefined,
    })
  }

  const minQty = selectedProduct.minOrderQuantity || 1
  const multiple = selectedProduct.orderMultiple || 1
  const maxQty = selectedProduct.maxOrderQuantity || selectedProduct.stock || 999

  const toggleAccordion = (section: string) => {
    setAccordionOpen(accordionOpen === section ? null : section)
  }

  return (
    <div className="product-template-3 overflow-x-hidden" style={{ fontFamily: 'var(--font-body)', maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}>
      {/* ========================================
          MOBILE LAYOUT (default)
          ======================================== */}
      <div className="lg:hidden">
        {/* Mobile Premium Hero Image */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <div
            style={{
              width: '100%',
              aspectRatio: '4/5',
              background: 'linear-gradient(135deg, var(--color-surface) 0%, #F3F4F6 100%)',
              borderRadius: '16px',
              border: '1px solid color-mix(in srgb, var(--color-primary) 10%, white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
            }}
          >
            {/* Premium Badge */}
            {savingsPercent > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'linear-gradient(135deg, var(--color-warning) 0%, #D97706 100%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.3px',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles className="w-3 h-3" />
                {savingsPercent}% OFF
              </div>
            )}

            {/* Quality Badge */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'var(--color-text-primary)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                zIndex: 10,
                border: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Award className="w-3 h-3" style={{ color: 'var(--color-warning)' }} />
              Premium
            </div>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selectedProduct.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div style={{ fontSize: '80px', opacity: 0.1 }}>📦</div>
            )}
          </div>

          {/* Image Dots */}
          {allImages.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '6px',
                justifyContent: 'center',
                marginTop: '12px',
              }}
            >
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    width: activeImageIndex === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background:
                      activeImageIndex === idx
                        ? 'var(--color-primary)'
                        : 'var(--color-border, #E5E7EB)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    padding: 0,
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Product Info */}
        <div style={{ padding: '0 16px' }}>
          {/* Brand */}
          {product.brand && typeof product.brand === 'object' && (
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                marginBottom: '12px',
              }}
            >
              {product.brand.name}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: '12px',
            }}
          >
            {selectedProduct.title}
          </h1>

          {/* Short Description */}
          {product.shortDescription && (
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4" fill="var(--color-warning)" style={{ color: 'var(--color-warning)' }} />
              ))}
            </div>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              (4.9) · 127 reviews
            </span>
          </div>

          {/* Premium Price Display */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb, 59, 130, 246), 0.03) 0%, rgba(var(--color-primary-rgb, 59, 130, 246), 0.08) 100%)',
              border: '2px solid color-mix(in srgb, var(--color-primary) 15%, white)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                €{currentPrice.toFixed(2)}
              </span>
              {oldPrice && (
                <span
                  style={{
                    fontSize: '20px',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'line-through',
                  }}
                >
                  €{oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <div
                style={{
                  fontSize: '13px',
                  color: '#059669',
                  fontWeight: 600,
                  marginBottom: '6px',
                }}
              >
                You save €{savings.toFixed(2)} ({savingsPercent}%)
              </div>
            )}
            <div
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}
            >
              Excl. BTW · Gratis verzending boven €50
            </div>
          </div>

          {/* Variant Selector - Premium Radio Buttons */}
          {isGrouped && childProducts.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px',
                  letterSpacing: '0.3px',
                }}
              >
                Select Size
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {childProducts.map((child) => {
                  const isSelected = selectedVariant === child.id
                  return (
                    <div
                      key={child.id}
                      onClick={() => setSelectedVariant(child.id)}
                      style={{
                        padding: '14px',
                        border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: '12px',
                        background: isSelected
                          ? 'color-mix(in srgb, var(--color-primary) 5%, white)'
                          : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                      }}
                    >
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check className="w-3 h-3" style={{ color: 'white' }} />
                        </div>
                      )}
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '3px' }}>
                        {child.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        €{child.price.toFixed(2)}
                        {child.stock !== undefined && ` · ${child.stock} in stock`}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
                letterSpacing: '0.3px',
              }}
            >
              Quantity
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '2px solid var(--color-border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(minQty, quantity - multiple))}
                  disabled={quantity <= minQty}
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-primary)',
                    fontSize: '18px',
                    fontWeight: 600,
                    opacity: quantity <= minQty ? 0.4 : 1,
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || minQty
                    setQuantity(Math.max(minQty, Math.min(maxQty, val)))
                  }}
                  style={{
                    width: '50px',
                    height: '44px',
                    border: 'none',
                    borderLeft: '2px solid var(--color-border)',
                    borderRight: '2px solid var(--color-border)',
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    background: 'transparent',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(maxQty, quantity + multiple))}
                  disabled={quantity >= maxQty}
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-primary)',
                    fontSize: '18px',
                    fontWeight: 600,
                    opacity: quantity >= maxQty ? 0.4 : 1,
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {selectedProduct.stock !== undefined && selectedProduct.stock > 0
                  ? `${selectedProduct.stock} available`
                  : 'In stock'}
              </div>
            </div>
          </div>

          {/* Premium Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct.stock || selectedProduct.stock === 0}
            style={{
              width: '100%',
              minHeight: '52px',
              padding: '16px 32px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 85%, black) 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '0.3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '20px',
              boxShadow: '0 8px 20px rgba(var(--color-primary-rgb, 59, 130, 246), 0.3)',
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart · €{(currentPrice * quantity).toFixed(2)}
          </button>

          {/* Premium Features */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '12px',
              padding: '16px',
              background: 'var(--color-surface, white)',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Truck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                  Free Shipping
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  On orders over €50
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Shield className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                  Secure Payment
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  SSL encrypted checkout
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Clock className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                  Fast Delivery
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  2-3 business days
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Accordions */}
          <div style={{ marginBottom: '32px' }}>
            {/* Story Accordion */}
            <div style={{ borderBottom: '1px solid var(--color-border)' }}>
              <button
                onClick={() => toggleAccordion('story')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  letterSpacing: '0.2px',
                }}
              >
                Product Story
                <ChevronDown
                  className="w-5 h-5"
                  style={{
                    transition: 'transform 0.2s',
                    transform: accordionOpen === 'story' ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>
              {accordionOpen === 'story' && (
                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: 1.7,
                    color: 'var(--color-text-secondary)',
                    paddingBottom: '16px',
                  }}
                  dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
                />
              )}
            </div>

            {/* Details Accordion */}
            <div style={{ borderBottom: '1px solid var(--color-border)' }}>
              <button
                onClick={() => toggleAccordion('details')}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  letterSpacing: '0.2px',
                }}
              >
                Details
                <ChevronDown
                  className="w-5 h-5"
                  style={{
                    transition: 'transform 0.2s',
                    transform: accordionOpen === 'details' ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>
              {accordionOpen === 'details' && (
                <div style={{ paddingBottom: '16px' }}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedProduct.sku && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>SKU</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{selectedProduct.sku}</span>
                      </div>
                    )}
                    {selectedProduct.ean && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>EAN</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{selectedProduct.ean}</span>
                      </div>
                    )}
                    {product.brand && typeof product.brand === 'object' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Brand</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{product.brand.name}</span>
                      </div>
                    )}
                    {selectedProduct.condition && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Condition</span>
                        <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>
                          {selectedProduct.condition}
                        </span>
                      </div>
                    )}
                    {selectedProduct.warranty && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>Warranty</span>
                        <span style={{ fontWeight: 600, fontSize: '13px' }}>{selectedProduct.warranty}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Accordion */}
            {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
              <div style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => toggleAccordion('specs')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    background: 'none',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    letterSpacing: '0.2px',
                  }}
                >
                  Specifications
                  <ChevronDown
                    className="w-5 h-5"
                    style={{
                      transition: 'transform 0.2s',
                      transform: accordionOpen === 'specs' ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  />
                </button>
                {accordionOpen === 'specs' && (
                  <div style={{ paddingBottom: '16px' }}>
                    {product.specifications.map((specGroup: any, idx: number) => (
                      <div key={idx} style={{ marginBottom: idx < product.specifications!.length - 1 ? '20px' : 0 }}>
                        {specGroup.group && (
                          <div style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            marginBottom: '12px',
                          }}>
                            {specGroup.group}
                          </div>
                        )}
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                            <div
                              key={attrIdx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingBottom: '12px',
                                borderBottom: attrIdx < (specGroup.attributes?.length || 0) - 1 ? '1px solid var(--color-border)' : 'none',
                              }}
                            >
                              <span style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
                                {attr.name}
                              </span>
                              <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                {attr.value} {attr.unit || ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Products - Mobile Horizontal Scroll */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '16px',
                }}
              >
                You May Also Like
              </h2>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                  paddingBottom: '8px',
                }}
              >
                {product.relatedProducts.slice(0, 6).map((relProd) => {
                  const rp = typeof relProd === 'object' ? relProd : null
                  if (!rp) return null
                  const rpImage =
                    typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null
                  return (
                    <Link
                      key={rp.id}
                      href={`/shop/${rp.slug}`}
                      style={{
                        minWidth: '170px',
                        padding: '12px',
                        background: 'var(--color-surface, white)',
                        borderRadius: '14px',
                        border: '1px solid var(--color-border)',
                        textDecoration: 'none',
                        scrollSnapAlign: 'start',
                        display: 'block',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          background: 'var(--color-surface)',
                          borderRadius: '12px',
                          marginBottom: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        {rpImage && (
                          <img
                            src={rpImage}
                            alt={rp.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          marginBottom: '6px',
                          color: 'var(--color-text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {rp.title}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        €{rp.price.toFixed(2)}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          DESKTOP LAYOUT (lg and up)
          ======================================== */}
      <div className="hidden lg:block">
        {/* Luxury Asymmetric Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            gap: '80px',
            marginBottom: '80px',
            minHeight: '600px',
          }}
        >
          {/* LEFT: Large Image Gallery */}
          <div>
            {/* Main Hero Image - Extra Large */}
            <div
              style={{
                width: '100%',
                aspectRatio: '4/5',
                background: 'linear-gradient(135deg, var(--color-surface) 0%, #F3F4F6 100%)',
                borderRadius: '24px',
                border: '1px solid color-mix(in srgb, var(--color-primary) 10%, white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              }}
            >
              {/* Premium Badge */}
              {savingsPercent > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '32px',
                    left: '32px',
                    background: 'linear-gradient(135deg, var(--color-warning) 0%, #D97706 100%)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    zIndex: 10,
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  {savingsPercent}% OFF
                </div>
              )}

              {/* Quality Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '32px',
                  right: '32px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--color-text-primary)',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  zIndex: 10,
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <Award className="w-4 h-4 inline mr-2" style={{ color: 'var(--color-warning)' }} />
                Premium Quality
              </div>

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={selectedProduct.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ fontSize: '120px', opacity: 0.1 }}>📦</div>
              )}
            </div>

            {/* Image Gallery - Elegant Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '24px' }}>
                {allImages.slice(0, 4).map((img, idx) => {
                  const imgUrl = typeof img === 'object' && img !== null ? img.url : null
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        aspectRatio: '1',
                        background: 'var(--color-surface, white)',
                        borderRadius: '16px',
                        border: `2px solid ${activeImageIndex === idx ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        padding: 0,
                      }}
                    >
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`${selectedProduct.title} ${idx + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Product Info */}
          <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            {/* Brand */}
            {product.brand && typeof product.brand === 'object' && (
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  marginBottom: '16px',
                }}
              >
                {product.brand.name}
              </div>
            )}

            {/* Product Title - Large & Elegant */}
            <h1
              style={{
                fontSize: '42px',
                fontWeight: 700,
                lineHeight: 1.2,
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {selectedProduct.title}
            </h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p
                style={{
                  fontSize: '17px',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '32px',
                }}
              >
                {product.shortDescription}
              </p>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5"
                    style={{ fill: 'var(--color-warning)', color: 'var(--color-warning)' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '15px', color: 'var(--color-text-muted)' }}>
                (4.9) · 127 reviews
              </span>
            </div>

            {/* Premium Price Display */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(var(--color-primary-rgb, 59, 130, 246), 0.03) 0%, rgba(var(--color-primary-rgb, 59, 130, 246), 0.08) 100%)',
                border: '2px solid color-mix(in srgb, var(--color-primary) 15%, white)',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '40px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
                <span
                  style={{
                    fontSize: '48px',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  €{currentPrice.toFixed(2)}
                </span>
                {oldPrice && (
                  <span
                    style={{
                      fontSize: '24px',
                      color: 'var(--color-text-muted)',
                      textDecoration: 'line-through',
                    }}
                  >
                    €{oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div
                  style={{
                    fontSize: '15px',
                    color: '#059669',
                    fontWeight: 600,
                  }}
                >
                  You save €{savings.toFixed(2)} ({savingsPercent}%)
                </div>
              )}
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginTop: '8px',
                }}
              >
                Excl. BTW · Gratis verzending boven €50
              </div>
            </div>

            {/* Variant Selector - Premium Radio Buttons */}
            {isGrouped && childProducts.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    marginBottom: '16px',
                    letterSpacing: '0.3px',
                  }}
                >
                  Select Size
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {childProducts.map((child) => {
                    const isSelected = selectedVariant === child.id
                    return (
                      <div
                        key={child.id}
                        onClick={() => setSelectedVariant(child.id)}
                        style={{
                          padding: '20px',
                          border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          borderRadius: '16px',
                          background: isSelected
                            ? 'color-mix(in srgb, var(--color-primary) 5%, white)'
                            : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                        }}
                      >
                        {isSelected && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'var(--color-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check className="w-4 h-4" style={{ color: 'white' }} />
                          </div>
                        )}
                        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                          {child.title}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                          €{child.price.toFixed(2)}
                          {child.stock !== undefined && ` · ${child.stock} in stock`}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity - Elegant Stepper */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px',
                  letterSpacing: '0.3px',
                }}
              >
                Quantity
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '2px solid var(--color-border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'white',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(minQty, quantity - multiple))}
                    disabled={quantity <= minQty}
                    style={{
                      width: '56px',
                      height: '56px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-primary)',
                      fontSize: '20px',
                      fontWeight: 600,
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(minQty, parseInt(e.target.value) || minQty))}
                    style={{
                      width: '80px',
                      height: '56px',
                      border: 'none',
                      borderLeft: '2px solid var(--color-border)',
                      borderRight: '2px solid var(--color-border)',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      background: 'transparent',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(maxQty, quantity + multiple))}
                    disabled={quantity >= maxQty}
                    style={{
                      width: '56px',
                      height: '56px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-primary)',
                      fontSize: '20px',
                      fontWeight: 600,
                    }}
                  >
                    +
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  {selectedProduct.stock !== undefined && selectedProduct.stock > 0
                    ? `${selectedProduct.stock} available`
                    : 'In stock'}
                </div>
              </div>
            </div>

            {/* Premium Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedProduct.stock || selectedProduct.stock === 0}
              style={{
                width: '100%',
                padding: '20px 40px',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 85%, black) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '24px',
                boxShadow: '0 12px 32px rgba(var(--color-primary-rgb, 59, 130, 246), 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart · €{(currentPrice * quantity).toFixed(2)}
            </button>

            {/* Premium Features */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '16px',
                padding: '24px',
                background: 'var(--color-surface, white)',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Truck className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>
                    Free Shipping
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    On orders over €50
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>
                    Secure Payment
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    SSL encrypted checkout
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'color-mix(in srgb, var(--color-primary) 8%, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '2px' }}>
                    Fast Delivery
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    2-3 business days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Tabs Section */}
        <div style={{ marginBottom: '80px' }}>
          {/* Tab Navigation - Elegant */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              borderBottom: '2px solid var(--color-border)',
              marginBottom: '48px',
            }}
          >
            {(['story', 'details', 'specs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 32px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `3px solid ${activeTab === tab ? 'var(--color-primary)' : 'transparent'}`,
                  color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontSize: '16px',
                  fontWeight: activeTab === tab ? 700 : 500,
                  cursor: 'pointer',
                  marginBottom: '-2px',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px',
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'story' ? 'Product Story' : tab === 'details' ? 'Details' : 'Specifications'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ maxWidth: '900px' }}>
            {activeTab === 'story' && (
              <div
                style={{
                  fontSize: '17px',
                  lineHeight: 1.9,
                  color: 'var(--color-text-secondary)',
                }}
                dangerouslySetInnerHTML={{ __html: product.description || '<p>No description available.</p>' }}
              />
            )}

            {activeTab === 'details' && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div
                  style={{
                    padding: '32px',
                    background: 'var(--color-surface, white)',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      marginBottom: '20px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Product Details
                  </h3>
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {selectedProduct.sku && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>SKU</span>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{selectedProduct.sku}</span>
                      </div>
                    )}
                    {selectedProduct.ean && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>EAN</span>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{selectedProduct.ean}</span>
                      </div>
                    )}
                    {product.brand && typeof product.brand === 'object' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Brand</span>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{product.brand.name}</span>
                      </div>
                    )}
                    {selectedProduct.condition && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Condition</span>
                        <span style={{ fontWeight: 600, fontSize: '15px', textTransform: 'capitalize' }}>
                          {selectedProduct.condition}
                        </span>
                      </div>
                    )}
                    {selectedProduct.warranty && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Warranty</span>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>{selectedProduct.warranty}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ display: 'grid', gap: '32px' }}>
                {Array.isArray(product.specifications) && product.specifications.length > 0 ? (
                  product.specifications.map((specGroup, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '32px',
                        background: 'var(--color-surface, white)',
                        borderRadius: '20px',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          marginBottom: '24px',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {specGroup.group}
                      </h3>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {specGroup.attributes?.map((attr, attrIdx) => (
                          <div
                            key={attrIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              paddingBottom: '16px',
                              borderBottom: attrIdx < (specGroup.attributes?.length || 0) - 1 ? '1px solid var(--color-border)' : 'none',
                            }}
                          >
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>
                              {attr.name}
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '15px' }}>
                              {attr.value} {attr.unit || ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--color-text-muted)' }}>No specifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div style={{ marginBottom: '80px' }}>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 700,
                marginBottom: '32px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              You May Also Like
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {product.relatedProducts.slice(0, 4).map((relProd) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null
                const rpImage =
                  typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null
                return (
                  <Link
                    key={rp.id}
                    href={`/shop/${rp.slug}`}
                    style={{
                      display: 'block',
                      padding: '20px',
                      background: 'var(--color-surface, white)',
                      borderRadius: '20px',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: 'var(--color-surface)',
                        borderRadius: '16px',
                        marginBottom: '16px',
                        overflow: 'hidden',
                      }}
                    >
                      {rpImage && (
                        <img
                          src={rpImage}
                          alt={rp.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                      {rp.title}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      €{rp.price.toFixed(2)}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================
          STICKY ATC BAR (Mobile/Tablet only)
          ======================================== */}
      {showStickyATC && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid var(--color-border)',
            padding: '12px 16px',
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
          }}
          className="lg:hidden"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Product Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {selectedProduct.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                }}
              >
                €{currentPrice.toFixed(2)}
              </div>
            </div>

            {/* Quantity */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(minQty, quantity - multiple))}
                disabled={quantity <= minQty}
                style={{
                  minWidth: '36px',
                  minHeight: '36px',
                  border: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: quantity <= minQty ? 0.4 : 1,
                }}
              >
                <Minus className="w-4 h-4" />
              </button>
              <div
                style={{
                  minWidth: '36px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderLeft: '1px solid var(--color-border)',
                  borderRight: '1px solid var(--color-border)',
                  padding: '0 8px',
                }}
              >
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(Math.min(maxQty, quantity + multiple))}
                disabled={quantity >= maxQty}
                style={{
                  minWidth: '36px',
                  minHeight: '36px',
                  border: 'none',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: quantity >= maxQty ? 0.4 : 1,
                }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedProduct.stock || selectedProduct.stock === 0}
              style={{
                minWidth: '120px',
                minHeight: '44px',
                padding: '0 20px',
                background: !selectedProduct.stock || selectedProduct.stock === 0 ? '#D1D5DB' : 'linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-primary) 85%, black) 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: !selectedProduct.stock || selectedProduct.stock === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(var(--color-primary-rgb, 59, 130, 246), 0.25)',
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
