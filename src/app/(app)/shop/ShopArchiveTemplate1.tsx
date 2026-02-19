'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/payload-types'
import {
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Layers,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  XCircle,
  Award,
  Ruler,
  Euro,
  PackageCheck,
  Package,
} from 'lucide-react'

interface ShopArchiveTemplate1Props {
  products: Product[]
  category?: any
  totalProducts: number
}

export default function ShopArchiveTemplate1({
  products,
  category,
  totalProducts,
}: ShopArchiveTemplate1Props) {
  const { addItem } = useCart()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  // Filters state
  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceMin: 0,
    priceMax: 1000,
    materials: [] as string[],
    ratings: [] as number[],
    stock: [] as string[],
  })

  // Active filters
  const [activeFilters, setActiveFilters] = useState<Array<{ key: string; value: string }>>([])

  // Extract unique values for filters
  const brands = Array.from(
    new Set(products.map((p) => p.brand).filter((b): b is string => !!b))
  )
  const materials = Array.from(
    new Set(
      products.flatMap((p) =>
        Array.isArray(p.specifications)
          ? p.specifications
              .flatMap((group: any) => group.attributes || [])
              .filter((attr: any) => attr.name?.toLowerCase() === 'materiaal')
              .map((attr: any) => attr.value)
          : []
      )
    )
  )

  const stepQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1
      const newQty = Math.max(1, current + delta)
      return { ...prev, [productId]: newQty }
    })
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const qty = quantities[product.id] || 1
    addItem({
      product,
      quantity: qty,
    })
  }

  const handleRemoveFilter = (key: string, value: string) => {
    setActiveFilters((prev) => prev.filter((f) => !(f.key === key && f.value === value)))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setFilters({
      brands: [],
      priceMin: 0,
      priceMax: 1000,
      materials: [],
      ratings: [],
      stock: [],
    })
  }

  // Calculate stats
  const stats = {
    totalProducts,
    brands: brands.length,
    inStock: products.filter((p) => p.stock > 0).length,
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Category Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1A1F36 0%, #232942 50%, #0D2137 100%)',
          padding: '48px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '0 24px',
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '40px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(59,130,246,0.15)',
                border: '1px solid rgba(59,130,246,0.3)',
                padding: '6px 14px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#60A5FA',
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                marginBottom: '16px',
              }}
            >
              <Package className="w-4 h-4" /> Categorie
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '36px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
                marginBottom: '10px',
              }}
            >
              {category?.name || 'Alle Producten'}
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, maxWidth: '520px' }}>
              {category?.description || 'Professionele medische producten van topkwaliteit'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stats.totalProducts}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Producten
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {stats.brands}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Merken
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                {Math.round((stats.inStock / stats.totalProducts) * 100)}
                <span style={{ color: '#60A5FA' }}>%</span>
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                Op voorraad
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Layout */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>
          {/* Sidebar Filters */}
          <aside style={{ position: 'sticky', top: '90px' }}>
            {/* Filter: Merken */}
            {brands.length > 0 && (
              <div
                style={{
                  background: 'var(--color-surface, white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Award className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Merk
                  </h3>
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <div style={{ padding: '0 18px 16px' }}>
                  {brands.slice(0, 6).map((brand) => (
                    <div
                      key={brand}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 0',
                        fontSize: '14px',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid var(--color-border)',
                          borderRadius: '5px',
                          flexShrink: 0,
                        }}
                      />
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter: Materiaal */}
            {materials.length > 0 && (
              <div
                style={{
                  background: 'var(--color-surface, white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} /> Materiaal
                  </h3>
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <div style={{ padding: '0 18px 16px' }}>
                  {materials.slice(0, 4).map((material) => (
                    <div
                      key={material}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 0',
                        fontSize: '14px',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          border: '2px solid var(--color-border)',
                          borderRadius: '5px',
                          flexShrink: 0,
                        }}
                      />
                      {material}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter: Beschikbaarheid */}
            <div
              style={{
                background: 'var(--color-surface, white)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <PackageCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />{' '}
                  Beschikbaarheid
                </h3>
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <div style={{ padding: '0 18px 16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 0',
                    fontSize: '14px',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid var(--color-border)',
                      borderRadius: '5px',
                      flexShrink: 0,
                    }}
                  />
                  Op voorraad
                  <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {stats.inStock}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            {activeFilters.length > 0 && (
              <div
                onClick={clearAllFilters}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
              >
                <XCircle className="w-4 h-4" /> Alle filters wissen
              </div>
            )}
          </aside>

          {/* Main Product Content */}
          <main>
            {/* Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>
                    {products.length}
                  </strong>{' '}
                  van {totalProducts} producten
                </div>
                {activeFilters.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {activeFilters.map((filter, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleRemoveFilter(filter.key, filter.value)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {filter.value}
                        <X className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '10px 36px 10px 14px',
                    background: 'var(--color-surface, white)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="relevance">Relevantie</option>
                  <option value="price-asc">Prijs: laag → hoog</option>
                  <option value="price-desc">Prijs: hoog → laag</option>
                  <option value="newest">Nieuwste</option>
                  <option value="rating">Best beoordeeld</option>
                </select>
                <div
                  style={{
                    display: 'flex',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      width: '40px',
                      height: '38px',
                      border: 'none',
                      background: viewMode === 'grid' ? 'rgba(59,130,246,0.08)' : 'var(--color-surface, white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1px solid var(--color-border)',
                    }}
                  >
                    <Grid3X3
                      className="w-4 h-4"
                      style={{ color: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                    />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      width: '40px',
                      height: '38px',
                      border: 'none',
                      background: viewMode === 'list' ? 'rgba(59,130,246,0.08)' : 'var(--color-surface, white)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <List
                      className="w-4 h-4"
                      style={{ color: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(3, 1fr)' : '1fr',
                gap: viewMode === 'grid' ? '20px' : '12px',
              }}
            >
              {products.map((product) => {
                const imageUrl =
                  typeof product.images?.[0]?.image === 'object' && product.images[0].image !== null
                    ? product.images[0].image.url
                    : null
                const qty = quantities[product.id] || 1

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    style={{
                      background: 'var(--color-surface, white)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.35s',
                      position: 'relative',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: viewMode === 'grid' ? 'column' : 'row',
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        width: viewMode === 'grid' ? '100%' : '200px',
                        height: viewMode === 'grid' ? '200px' : 'auto',
                        minHeight: viewMode === 'list' ? '160px' : undefined,
                        background: 'var(--color-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Package className="w-16 h-16" style={{ color: 'var(--color-text-muted)' }} />
                      )}
                    </div>

                    {/* Product Info */}
                    <div
                      style={{
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      {product.brand && (
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'var(--color-primary)',
                            letterSpacing: '0.05em',
                            marginBottom: '6px',
                          }}
                        >
                          {product.brand}
                        </div>
                      )}
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '14px',
                          color: 'var(--color-text-primary)',
                          marginBottom: '4px',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.title}
                      </div>
                      {product.sku && (
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginBottom: '8px',
                          }}
                        >
                          Art. {product.sku}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          marginTop: 'auto',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '20px',
                              fontWeight: 800,
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            €{product.price.toFixed(2).replace('.', ',')}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '1px' }}>
                            excl. BTW
                          </div>
                          {product.volumePricing && product.volumePricing.length > 0 && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                color: 'var(--color-primary)',
                                fontWeight: 600,
                                marginTop: '3px',
                              }}
                            >
                              <Layers className="w-3 h-3" /> Staffelprijzen
                            </div>
                          )}
                        </div>

                        {/* Quick Add */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1.5px solid var(--color-border)',
                              borderRadius: '8px',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                stepQuantity(product.id, -1)
                              }}
                              style={{
                                width: '30px',
                                height: '36px',
                                border: 'none',
                                background: 'var(--color-background)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'var(--color-text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={qty}
                              readOnly
                              style={{
                                width: '32px',
                                height: '36px',
                                border: 'none',
                                textAlign: 'center',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '13px',
                                color: 'var(--color-text-primary)',
                                outline: 'none',
                              }}
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                stepQuantity(product.id, 1)
                              }}
                              style={{
                                width: '30px',
                                height: '36px',
                                border: 'none',
                                background: 'var(--color-background)',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: 'var(--color-text-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: 'var(--color-primary)',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.3s',
                              boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                            }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stock Status */}
                      {product.stock > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            color: product.stock > 20 ? '#10B981' : '#F59E0B',
                            fontWeight: 500,
                            marginTop: '12px',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--color-border)',
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              background: product.stock > 20 ? '#10B981' : '#F59E0B',
                              borderRadius: '50%',
                            }}
                          />
                          {product.stock > 20 ? 'Op voorraad — morgen geleverd' : `Nog ${product.stock} op voorraad`}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination Placeholder */}
            {products.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  paddingTop: '40px',
                }}
              >
                <button
                  disabled
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-surface, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                    opacity: 0.3,
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--color-primary)',
                    border: '1.5px solid var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  1
                </button>
                <button
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: '1.5px solid var(--color-border)',
                    background: 'var(--color-surface, white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
