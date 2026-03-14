'use client'

import React, { useEffect, useState } from 'react'

interface SiteInfo {
  id: number
  name: string
}

interface ProductStock {
  productId: number
  title: string
  sku: string
  hubStock: number
  hubStockStatus: string
  sites: Array<{
    siteId: number
    stock: number
    stockStatus: string
    inSync: boolean
  }>
}

export function InventoryOverview() {
  const [sites, setSites] = useState<SiteInfo[]>([])
  const [products, setProducts] = useState<ProductStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reconciling, setReconciling] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch active sites
      const sitesRes = await fetch('/api/multistore-sites?limit=100&depth=0&where[status][equals]=active')
      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
      const sitesData = await sitesRes.json()
      const siteList: SiteInfo[] = sitesData.docs.map((s: any) => ({ id: s.id, name: s.name }))
      setSites(siteList)

      // Fetch sync-enabled products with stock tracking
      const productsRes = await fetch(
        '/api/products?limit=500&depth=0' +
        '&where[multistoreSyncEnabled][equals]=true' +
        '&where[trackStock][equals]=true' +
        '&sort=title',
      )
      if (!productsRes.ok) throw new Error('Kan producten niet ophalen')
      const productsData = await productsRes.json()

      const productList: ProductStock[] = productsData.docs.map((p: any) => {
        const distributedTo = p.distributedTo || []
        const siteStocks = siteList.map((site) => {
          const entry = distributedTo.find((e: any) => {
            const sid = typeof e.site === 'object' ? e.site?.id : e.site
            return sid === site.id
          })
          return {
            siteId: site.id,
            stock: entry?.remoteProductId ? (p.stock ?? 0) : -1, // -1 = not distributed
            stockStatus: p.stockStatus || 'in-stock',
            inSync: entry?.syncStatus === 'synced',
          }
        })

        return {
          productId: p.id,
          title: p.title || 'Onbekend',
          sku: p.sku || '',
          hubStock: p.stock ?? 0,
          hubStockStatus: p.stockStatus || 'in-stock',
          sites: siteStocks,
        }
      })

      setProducts(productList)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onbekende fout')
    } finally {
      setLoading(false)
    }
  }

  async function handleReconcile() {
    setReconciling(true)
    try {
      // Trigger reconciliation for all active sites
      for (const site of sites) {
        await fetch('/api/multistore-sites/' + site.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastHealthCheck: new Date().toISOString() }),
        })
      }
      // Refresh data after a short delay
      setTimeout(() => fetchData(), 2000)
    } catch {
      // Silently fail
    } finally {
      setReconciling(false)
    }
  }

  const stockStatusLabels: Record<string, string> = {
    'in-stock': 'Op voorraad',
    'out-of-stock': 'Uitverkocht',
    'on-backorder': 'Backorder',
    'discontinued': 'Uitgefaseerd',
  }

  const stockStatusColors: Record<string, string> = {
    'in-stock': '#10b981',
    'out-of-stock': '#ef4444',
    'on-backorder': '#f59e0b',
    'discontinued': '#6b7280',
  }

  if (error) {
    return (
      <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
        {error}
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => fetchData()}
          style={btnStyle}
        >
          Vernieuwen
        </button>
        <button
          onClick={handleReconcile}
          disabled={reconciling}
          style={{ ...btnStyle, opacity: reconciling ? 0.5 : 1 }}
        >
          {reconciling ? 'Reconciliatie...' : 'Voorraad Reconciliatie'}
        </button>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.5rem' }}>
          {products.length} producten &middot; {sites.length} webshops
        </span>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.75rem' }}>
        {Object.entries(stockStatusLabels).map(([key, label]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: stockStatusColors[key],
              display: 'inline-block',
            }} />
            {label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '2px',
            background: '#e5e7eb',
            display: 'inline-block',
          }} />
          Niet gedistribueerd
        </div>
      </div>

      {/* Inventory Matrix */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
              <th style={{ ...thStyle, position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>Product</th>
              <th style={thStyle}>SKU</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Hub</th>
              {sites.map((site) => (
                <th key={site.id} style={{ ...thStyle, textAlign: 'center', minWidth: '80px' }}>
                  {site.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3 + sites.length} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                  Laden...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={3 + sites.length} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                  Geen producten met voorraadtracking gevonden
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ ...tdStyle, position: 'sticky', left: 0, background: '#fff', zIndex: 1, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={`/admin/collections/products/${product.productId}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
                      {product.title}
                    </a>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.7rem' }}>
                    {product.sku}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <StockCell
                      stock={product.hubStock}
                      stockStatus={product.hubStockStatus}
                      isHub={true}
                      statusColors={stockStatusColors}
                    />
                  </td>
                  {product.sites.map((siteStock) => (
                    <td key={siteStock.siteId} style={{ ...tdStyle, textAlign: 'center' }}>
                      {siteStock.stock === -1 ? (
                        <span style={{ color: '#d1d5db' }}>—</span>
                      ) : (
                        <StockCell
                          stock={siteStock.stock}
                          stockStatus={siteStock.stockStatus}
                          isHub={false}
                          inSync={siteStock.inSync}
                          statusColors={stockStatusColors}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StockCell({
  stock,
  stockStatus,
  isHub,
  inSync,
  statusColors,
}: {
  stock: number
  stockStatus: string
  isHub: boolean
  inSync?: boolean
  statusColors: Record<string, string>
}) {
  const color = stockStatusColors[stockStatus] || '#6b7280'
  const bgColor = stockStatus === 'out-of-stock' ? '#fef2f2' : stockStatus === 'on-backorder' ? '#fffbeb' : 'transparent'

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0.2rem 0.4rem',
      borderRadius: '4px',
      background: bgColor,
      border: isHub ? '2px solid #2563eb' : inSync === false ? '1px solid #f59e0b' : '1px solid transparent',
      minWidth: '50px',
    }}>
      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: stock === 0 ? '#ef4444' : '#1a1a2e' }}>
        {stock}
      </span>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: color,
        marginTop: '2px',
      }} />
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
  fontSize: '0.85rem',
}
