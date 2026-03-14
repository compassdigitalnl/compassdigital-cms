'use client'

import React, { useEffect, useState } from 'react'

interface Site {
  id: number
  name: string
  status: string
}

interface Product {
  id: number
  title: string
  sku: string
  multistoreSyncEnabled: boolean
  distributedTo: Array<{
    site: number | { id: number }
    remoteProductId?: number
    syncStatus: string
  }>
}

export function ProductDistribution() {
  const [sites, setSites] = useState<Site[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [selectedSites, setSelectedSites] = useState<Set<number>>(new Set())
  const [distributing, setDistributing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch sites
      const sitesRes = await fetch('/api/multistore-sites?limit=100&depth=0')
      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
      const sitesData = await sitesRes.json()
      setSites(
        sitesData.docs.map((s: any) => ({
          id: s.id,
          name: s.name,
          status: s.status,
        })),
      )

      // Fetch products
      const productsRes = await fetch(
        '/api/products?limit=500&depth=0&where[multistoreSyncEnabled][equals]=true&sort=title',
      )
      if (!productsRes.ok) throw new Error('Kan producten niet ophalen')
      const productsData = await productsRes.json()
      setProducts(
        productsData.docs.map((p: any) => ({
          id: p.id,
          title: p.title || 'Onbekend',
          sku: p.sku || '',
          multistoreSyncEnabled: p.multistoreSyncEnabled || false,
          distributedTo: p.distributedTo || [],
        })),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  function toggleProduct(id: number) {
    const next = new Set(selectedProducts)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedProducts(next)
  }

  function toggleAllProducts() {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  function toggleSite(id: number) {
    const next = new Set(selectedSites)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedSites(next)
  }

  async function handleDistribute() {
    if (selectedProducts.size === 0 || selectedSites.size === 0) {
      alert('Selecteer minimaal 1 product en 1 webshop')
      return
    }

    setDistributing(true)
    let succeeded = 0
    let failed = 0

    try {
      for (const productId of selectedProducts) {
        const product = products.find((p) => p.id === productId)
        if (!product) continue

        // Build updated distributedTo array
        const existing = product.distributedTo || []
        const newEntries = [...existing]

        for (const siteId of selectedSites) {
          const alreadyDistributed = existing.some((e) => {
            const sid = typeof e.site === 'object' ? e.site.id : e.site
            return sid === siteId
          })

          if (!alreadyDistributed) {
            newEntries.push({
              site: siteId,
              syncStatus: 'pending',
            })
          }
        }

        try {
          const res = await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              distributedTo: newEntries,
              multistoreSyncEnabled: true,
            }),
          })

          if (res.ok) succeeded++
          else failed++
        } catch {
          failed++
        }
      }

      alert(
        `Distributie voltooid: ${succeeded} geslaagd${failed > 0 ? `, ${failed} mislukt` : ''}. Sync jobs worden automatisch aangemaakt.`,
      )

      // Refresh
      setSelectedProducts(new Set())
      setSelectedSites(new Set())
      await fetchData()
    } catch (err) {
      alert('Fout bij distributie: ' + (err instanceof Error ? err.message : 'onbekend'))
    } finally {
      setDistributing(false)
    }
  }

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products

  const activeSites = sites.filter((s) => s.status === 'active')

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* Site Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>
          1. Selecteer webshops
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {activeSites.map((site) => (
            <button
              key={site.id}
              onClick={() => toggleSite(site.id)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: selectedSites.has(site.id) ? '2px solid #2563eb' : '1px solid #d1d5db',
                background: selectedSites.has(site.id) ? '#eff6ff' : '#fff',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: selectedSites.has(site.id) ? 600 : 400,
                color: selectedSites.has(site.id) ? '#2563eb' : '#4b5563',
              }}
            >
              {site.name}
            </button>
          ))}
          {activeSites.length === 0 && (
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Geen actieve webshops</span>
          )}
        </div>
      </div>

      {/* Product Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151', margin: 0 }}>
            2. Selecteer producten ({selectedProducts.size} / {filteredProducts.length})
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Zoek op naam of SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '0.8rem',
                width: '200px',
              }}
            />
            <button onClick={toggleAllProducts} style={btnStyle}>
              {selectedProducts.size === filteredProducts.length ? 'Deselecteer alles' : 'Selecteer alles'}
            </button>
          </div>
        </div>

        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left', position: 'sticky', top: 0, background: '#fff' }}>
                <th style={{ ...thStyle, width: '30px' }} />
                <th style={thStyle}>Product</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Gedistribueerd naar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Laden...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Geen producten met sync gevonden
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      background: selectedProducts.has(product.id) ? '#eff6ff' : 'transparent',
                    }}
                  >
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td style={tdStyle}>{product.title}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {product.sku}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {product.distributedTo.map((entry, i) => {
                          const siteId = typeof entry.site === 'object' ? entry.site.id : entry.site
                          const site = sites.find((s) => s.id === siteId)
                          const statusColor =
                            entry.syncStatus === 'synced'
                              ? '#059669'
                              : entry.syncStatus === 'error'
                                ? '#ef4444'
                                : '#f59e0b'
                          return (
                            <span
                              key={i}
                              style={{
                                padding: '0.1rem 0.4rem',
                                borderRadius: '4px',
                                background: `${statusColor}15`,
                                border: `1px solid ${statusColor}40`,
                                fontSize: '0.65rem',
                                color: statusColor,
                              }}
                            >
                              {site?.name || `Site ${siteId}`}
                            </span>
                          )
                        })}
                        {product.distributedTo.length === 0 && (
                          <span style={{ color: '#d1d5db', fontSize: '0.7rem' }}>Geen</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          onClick={handleDistribute}
          disabled={distributing || selectedProducts.size === 0 || selectedSites.size === 0}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            border: 'none',
            background: selectedProducts.size > 0 && selectedSites.size > 0 ? '#2563eb' : '#d1d5db',
            color: '#fff',
            cursor: selectedProducts.size > 0 && selectedSites.size > 0 ? 'pointer' : 'not-allowed',
            fontSize: '0.85rem',
            fontWeight: 600,
            opacity: distributing ? 0.5 : 1,
          }}
        >
          {distributing
            ? 'Distribueren...'
            : `Distribueer ${selectedProducts.size} product(en) naar ${selectedSites.size} webshop(s)`}
        </button>
        <button onClick={() => fetchData()} style={btnStyle}>
          Vernieuwen
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════

const thStyle: React.CSSProperties = { padding: '0.5rem 0.75rem', fontWeight: 600, color: '#374151', fontSize: '0.75rem' }
const tdStyle: React.CSSProperties = { padding: '0.4rem 0.75rem', color: '#4b5563' }
const btnStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #d1d5db',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '0.8rem',
}
