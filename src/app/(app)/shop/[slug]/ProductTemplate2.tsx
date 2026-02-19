'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/payload-types'
import {
  ShoppingCart,
  Star,
  Check,
  Truck,
  Shield,
  ArrowRight,
  ChevronDown,
  Minus,
  Plus,
} from 'lucide-react'

interface ProductTemplate2Props {
  product: Product
}

export default function ProductTemplate2({ product }: ProductTemplate2Props) {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description')
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  const isGrouped = product.productType === 'grouped'
  const childProducts =
    isGrouped && product.childProducts
      ? product.childProducts
          .map((child) => (typeof child.product === 'object' ? child.product : null))
          .filter((p) => p !== null)
      : []

  // Set default variant
  if (isGrouped && !selectedVariant && childProducts.length > 0) {
    setSelectedVariant(childProducts[0].id)
  }

  const selectedProduct = isGrouped
    ? childProducts.find((p) => p.id === selectedVariant) || childProducts[0]
    : product

  const currentPrice = selectedProduct.salePrice || selectedProduct.price
  const oldPrice = selectedProduct.compareAtPrice || (selectedProduct.salePrice ? selectedProduct.price : null)
  const savings = oldPrice ? oldPrice - currentPrice : 0
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0

  const imageUrl =
    typeof selectedProduct.images?.[0] === 'object' && selectedProduct.images[0] !== null
      ? selectedProduct.images[0].url
      : null

  const handleAddToCart = () => {
    const unitPrice = currentPrice
    addItem({
      id: selectedProduct.id,
      title: selectedProduct.title,
      slug: selectedProduct.slug || '',
      price: selectedProduct.price,
      quantity: quantity,
      unitPrice: unitPrice,
      image: imageUrl || undefined,
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

  return (
    <div className="product-template-2" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Minimal 2-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '64px',
          marginBottom: '64px',
        }}
        className="product-layout-minimal"
      >
        {/* LEFT: Image */}
        <div>
          <div
            style={{
              width: '100%',
              aspectRatio: '1',
              background: 'var(--color-surface, white)',
              borderRadius: 'var(--border-radius, 16px)',
              border: '1px solid var(--color-border, #E5E7EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Sale Badge */}
            {savingsPercent > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: '#EF4444',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 700,
                  zIndex: 10,
                }}
              >
                -{savingsPercent}%
              </div>
            )}

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={selectedProduct.title}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div style={{ fontSize: '80px', opacity: 0.2 }}>📦</div>
            )}
          </div>

          {/* Thumbnails */}
          {selectedProduct.images && selectedProduct.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              {selectedProduct.images.slice(0, 4).map((img, idx) => {
                const imgUrl = typeof img === 'object' && img !== null ? img.url : null
                return (
                  <div
                    key={idx}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      background: 'var(--color-surface, white)',
                      border: idx === 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                    }}
                  >
                    {imgUrl && (
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Product Info */}
        <div>
          {/* Brand */}
          {product.brand && (
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                marginBottom: '12px',
              }}
            >
              {product.brand}
            </div>
          )}

          {/* Title */}
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: '16px',
            }}
          >
            {product.title}
          </h1>

          {/* Short Description */}
          {product.shortDescription && (
            <p
              style={{
                fontSize: '16px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-5 h-5" fill="#F59E0B" style={{ color: '#F59E0B' }} />
              ))}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
              4.8 · 47 reviews
            </span>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '40px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                €{currentPrice.toFixed(2)}
              </span>
              {oldPrice && (
                <>
                  <span
                    style={{
                      fontSize: '24px',
                      color: 'var(--color-text-muted)',
                      textDecoration: 'line-through',
                    }}
                  >
                    €{oldPrice.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#EF4444',
                      background: '#FEE2E2',
                      padding: '4px 12px',
                      borderRadius: '6px',
                    }}
                  >
                    Save €{savings.toFixed(2)}
                  </span>
                </>
              )}
            </div>
            {product.taxClass && (
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                {product.taxClass === 'high' && 'Incl. 21% BTW'}
                {product.taxClass === 'low' && 'Incl. 9% BTW'}
                {product.taxClass === 'zero' && 'Excl. BTW'}
              </p>
            )}
          </div>

          {/* Volume Pricing (Simple List) */}
          {product.volumePricing && product.volumePricing.length > 0 && (
            <div
              style={{
                background: 'color-mix(in srgb, var(--color-primary) 5%, white)',
                border: '1px solid color-mix(in srgb, var(--color-primary) 20%, white)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '12px',
                }}
              >
                Volume Pricing
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {product.volumePricing.map((tier, idx) => {
                  const tierPrice = tier.discountPrice || product.price * (1 - (tier.discountPercentage || 0) / 100)
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        {tier.minQuantity}+ units
                      </span>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          €{tierPrice.toFixed(2)}
                        </span>
                        {tier.discountPercentage && (
                          <span style={{ color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600 }}>
                            -{tier.discountPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Variant Selector (for Grouped Products) */}
          {isGrouped && childProducts.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                }}
              >
                Select Variant
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedVariant || ''}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 40px 14px 16px',
                    fontSize: '16px',
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-surface, white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {childProducts.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.title} - €{child.price.toFixed(2)}
                      {child.stock !== undefined && ` (${child.stock} in stock)`}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="w-5 h-5"
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              Quantity
            </label>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(minQty, quantity - multiple))}
                disabled={quantity <= minQty}
                style={{
                  width: '48px',
                  height: '48px',
                  border: 'none',
                  background: 'var(--color-surface, white)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || minQty
                  setQuantity(Math.max(minQty, Math.min(maxQty, val)))
                }}
                style={{
                  width: '80px',
                  height: '48px',
                  border: 'none',
                  borderLeft: '1px solid var(--color-border)',
                  borderRight: '1px solid var(--color-border)',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => setQuantity(Math.min(maxQty, quantity + multiple))}
                disabled={quantity >= maxQty}
                style={{
                  width: '48px',
                  height: '48px',
                  border: 'none',
                  background: 'var(--color-surface, white)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stock */}
          {selectedProduct.trackStock && selectedProduct.stock !== undefined && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                padding: '12px',
                background: selectedProduct.stock > 0 ? '#F0FDF4' : '#FEF2F2',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: selectedProduct.stock > 0 ? '#22C55E' : '#EF4444',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: selectedProduct.stock > 0 ? '#166534' : '#991B1B',
                }}
              >
                {selectedProduct.stock > 0
                  ? `${selectedProduct.stock} in stock`
                  : 'Out of stock'}
              </span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={selectedProduct.stock === 0}
            style={{
              width: '100%',
              padding: '18px',
              background: selectedProduct.stock === 0 ? '#D1D5DB' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              cursor: selectedProduct.stock === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s',
              marginBottom: '24px',
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          {/* Trust Badges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              paddingTop: '24px',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'color-mix(in srgb, var(--color-primary) 10%, white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Free Shipping
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  On orders over €150
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'color-mix(in srgb, var(--color-primary) 10%, white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Secure Payment
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  SSL encrypted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div style={{ marginBottom: '64px' }}>
        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '32px',
          }}
        >
          <button
            onClick={() => setActiveTab('description')}
            style={{
              padding: '16px 0',
              fontSize: '16px',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'description' ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-1px',
            }}
          >
            Description
          </button>
          {product.specifications && (
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '16px 0',
                fontSize: '16px',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'specs' ? '2px solid var(--color-primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-1px',
              }}
            >
              Specifications
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'description' && (
          <div>
            {product.description && (
              <div
                style={{
                  fontSize: '16px',
                  lineHeight: 1.8,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '32px',
                }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {product.features && product.features.length > 0 && (
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '16px',
                  }}
                >
                  Key Features
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        marginBottom: '12px',
                        fontSize: '16px',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      <div
                        style={{
                          marginTop: '4px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'color-mix(in srgb, var(--color-primary) 15%, white)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && product.specifications && (
          <div style={{ maxWidth: '600px' }}>
            {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
              <div key={groupIdx}>
                {specGroup.group && (
                  <div style={{
                    padding: '16px 0 8px',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                  }}>
                    {specGroup.group}
                  </div>
                )}
                {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                  <div
                    key={attrIdx}
                    style={{
                      display: 'flex',
                      padding: '16px 0',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        width: '200px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-text-muted)',
                        flexShrink: 0,
                      }}
                    >
                      {attr.name}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              You Might Also Like
            </h2>
            <Link
              href="/shop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
            }}
          >
            {product.relatedProducts.slice(0, 4).map((relProd, idx) => {
              const rp = typeof relProd === 'object' ? relProd : null
              if (!rp) return null

              const rpImg = typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null

              return (
                <Link
                  key={idx}
                  href={`/shop/${rp.slug}`}
                  style={{
                    background: 'var(--color-surface, white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s',
                    display: 'block',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: 'var(--color-background)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {rpImg ? (
                      <img src={rpImg} alt={rp.title} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ fontSize: '48px', opacity: 0.2 }}>📦</div>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: '8px',
                        lineHeight: 1.4,
                      }}
                    >
                      {rp.title}
                    </h3>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      €{rp.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .product-layout-minimal {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </div>
  )
}
