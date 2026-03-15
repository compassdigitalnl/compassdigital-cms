'use client'

import React, { useEffect, useState, useCallback } from 'react'
import './multistore.scss'

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

const SYNC_STATUS_MAP: Record<string, string> = {
  synced: 'synced',
  pending: 'pending',
  error: 'error',
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

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sitesRes, productsRes] = await Promise.all([
        fetch('/api/multistore-sites?limit=100&depth=0'),
        fetch('/api/products?limit=500&depth=0&where[multistoreSyncEnabled][equals]=true&sort=title'),
      ])

      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
      if (!productsRes.ok) throw new Error('Kan producten niet ophalen')

      const sitesData = await sitesRes.json()
      const productsData = await productsRes.json()

      setSites(sitesData.docs.map((s: any) => ({ id: s.id, name: s.name, status: s.status })))
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
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : products

  const activeSites = sites.filter((s) => s.status === 'active')

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

        const existing = product.distributedTo || []
        const newEntries = [...existing]

        for (const siteId of selectedSites) {
          const alreadyDistributed = existing.some((e) => {
            const sid = typeof e.site === 'object' ? e.site.id : e.site
            return sid === siteId
          })
          if (!alreadyDistributed) {
            newEntries.push({ site: siteId, syncStatus: 'pending' })
          }
        }

        try {
          const res = await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ distributedTo: newEntries, multistoreSyncEnabled: true }),
          })
          if (res.ok) succeeded++
          else failed++
        } catch {
          failed++
        }
      }

      alert(`Distributie voltooid: ${succeeded} geslaagd${failed > 0 ? `, ${failed} mislukt` : ''}. Sync jobs worden automatisch aangemaakt.`)
      setSelectedProducts(new Set())
      setSelectedSites(new Set())
      await fetchData()
    } catch (err) {
      alert('Fout bij distributie: ' + (err instanceof Error ? err.message : 'onbekend'))
    } finally {
      setDistributing(false)
    }
  }

  if (error) return <div className="ms-error">{error}</div>

  return (
    <div className="ms-page">
      {/* Step 1: Select shops */}
      <div className="ms-section">
        <div className="ms-section__header">
          <h2 className="ms-section__title">1. Selecteer webshops</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {activeSites.map((site) => (
            <button
              key={site.id}
              className={`ms-chip${selectedSites.has(site.id) ? ' ms-chip--active' : ''}`}
              onClick={() => toggleSite(site.id)}
            >
              {site.name}
            </button>
          ))}
          {activeSites.length === 0 && (
            <span className="ms-table__muted">Geen actieve webshops</span>
          )}
        </div>
      </div>

      {/* Step 2: Select products */}
      <div className="ms-section">
        <div className="ms-section__header">
          <h2 className="ms-section__title">
            2. Selecteer producten ({selectedProducts.size} / {filteredProducts.length})
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="ms-input"
              placeholder="Zoek op naam of SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '200px' }}
            />
            <button className="ms-btn ms-btn--sm" onClick={toggleAllProducts}>
              {selectedProducts.size === filteredProducts.length ? 'Deselecteer alles' : 'Selecteer alles'}
            </button>
          </div>
        </div>

        <div className="ms-table-wrap" style={{ maxHeight: '450px', overflowY: 'auto' }}>
          <table className="ms-table">
            <thead>
              <tr>
                <th style={{ width: '30px' }} />
                <th>Product</th>
                <th>SKU</th>
                <th>Gedistribueerd naar</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="ms-loading"><div className="ms-spinner" />Laden...</div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="ms-empty">Geen producten met sync gevonden</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    style={{
                      cursor: 'pointer',
                      background: selectedProducts.has(product.id) ? '#f0fdfa' : undefined,
                    }}
                  >
                    <td className="ms-table__center">
                      <input
                        type="checkbox"
                        className="ms-checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{product.title}</td>
                    <td className="ms-table__mono">{product.sku}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {product.distributedTo.map((entry, i) => {
                          const siteId = typeof entry.site === 'object' ? entry.site.id : entry.site
                          const site = sites.find((s) => s.id === siteId)
                          const statusClass = SYNC_STATUS_MAP[entry.syncStatus] || 'pending'
                          return (
                            <span key={i} className={`ms-dist-tag ms-dist-tag--${statusClass}`}>
                              {site?.name || `Site ${siteId}`}
                            </span>
                          )
                        })}
                        {product.distributedTo.length === 0 && (
                          <span className="ms-table__muted">Geen</span>
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
      <div className="ms-toolbar">
        <button
          className="ms-btn ms-btn--primary"
          onClick={handleDistribute}
          disabled={distributing || selectedProducts.size === 0 || selectedSites.size === 0}
        >
          {distributing
            ? 'Distribueren...'
            : `Distribueer ${selectedProducts.size} product(en) naar ${selectedSites.size} webshop(s)`}
        </button>
        <button className="ms-btn ms-btn--sm" onClick={() => fetchData()}>
          Vernieuwen
        </button>
      </div>
    </div>
  )
}
