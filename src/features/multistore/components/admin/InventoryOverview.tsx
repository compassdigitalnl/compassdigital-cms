'use client'

import React, { useEffect, useState, useCallback } from 'react'
import './multistore.scss'

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

const STOCK_STATUS: Record<string, { label: string; color: string }> = {
  'in-stock':     { label: 'Op voorraad', color: '#10b981' },
  'out-of-stock': { label: 'Uitverkocht', color: '#ef4444' },
  'on-backorder': { label: 'Backorder', color: '#f59e0b' },
  'discontinued': { label: 'Uitgefaseerd', color: '#64748b' },
}

export function InventoryOverview() {
  const [sites, setSites] = useState<SiteInfo[]>([])
  const [products, setProducts] = useState<ProductStock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reconciling, setReconciling] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sitesRes, productsRes] = await Promise.all([
        fetch('/api/multistore-sites?limit=100&depth=0&where[status][equals]=active'),
        fetch('/api/products?limit=500&depth=0&where[multistoreSyncEnabled][equals]=true&where[trackStock][equals]=true&sort=title'),
      ])

      if (!sitesRes.ok) throw new Error('Kan webshops niet ophalen')
      if (!productsRes.ok) throw new Error('Kan producten niet ophalen')

      const sitesData = await sitesRes.json()
      const productsData = await productsRes.json()

      const siteList: SiteInfo[] = sitesData.docs.map((s: any) => ({ id: s.id, name: s.name }))
      setSites(siteList)

      setProducts(
        productsData.docs.map((p: any) => {
          const distributedTo = p.distributedTo || []
          return {
            productId: p.id,
            title: p.title || 'Onbekend',
            sku: p.sku || '',
            hubStock: p.stock ?? 0,
            hubStockStatus: p.stockStatus || 'in-stock',
            sites: siteList.map((site) => {
              const entry = distributedTo.find((e: any) => {
                const sid = typeof e.site === 'object' ? e.site?.id : e.site
                return sid === site.id
              })
              return {
                siteId: site.id,
                stock: entry?.remoteProductId ? (p.stock ?? 0) : -1,
                stockStatus: p.stockStatus || 'in-stock',
                inSync: entry?.syncStatus === 'synced',
              }
            }),
          }
        }),
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

  async function handleReconcile() {
    setReconciling(true)
    try {
      for (const site of sites) {
        await fetch('/api/multistore-sites/' + site.id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lastHealthCheck: new Date().toISOString() }),
        })
      }
      setTimeout(() => fetchData(), 2000)
    } catch {
      // silently fail
    } finally {
      setReconciling(false)
    }
  }

  function stockValueClass(stock: number): string {
    if (stock === 0) return 'ms-stock-cell__value--zero'
    if (stock <= 5) return 'ms-stock-cell__value--low'
    return 'ms-stock-cell__value--ok'
  }

  if (error) return <div className="ms-error">{error}</div>

  return (
    <div className="ms-page">
      {/* Toolbar */}
      <div className="ms-toolbar">
        <button className="ms-btn ms-btn--sm" onClick={() => fetchData()}>
          Vernieuwen
        </button>
        <button
          className="ms-btn ms-btn--sm ms-btn--primary"
          onClick={handleReconcile}
          disabled={reconciling}
        >
          {reconciling ? 'Reconciliatie...' : 'Voorraad Reconciliatie'}
        </button>
        <span className="ms-toolbar__count">
          {products.length} producten &middot; {sites.length} webshops
        </span>
      </div>

      {/* Legend */}
      <div className="ms-legend">
        {Object.entries(STOCK_STATUS).map(([key, { label, color }]) => (
          <div key={key} className="ms-legend__item">
            <span className="ms-legend__dot" style={{ background: color }} />
            {label}
          </div>
        ))}
        <div className="ms-legend__item">
          <span className="ms-legend__box" style={{ background: '#e2e8f0' }} />
          Niet gedistribueerd
        </div>
      </div>

      {/* Matrix */}
      <div className="ms-table-wrap">
        <table className="ms-table">
          <thead>
            <tr>
              <th className="ms-table__sticky">Product</th>
              <th>SKU</th>
              <th className="ms-table__center">Hub</th>
              {sites.map((site) => (
                <th key={site.id} className="ms-table__center" style={{ minWidth: '80px' }}>
                  {site.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3 + sites.length}>
                  <div className="ms-loading"><div className="ms-spinner" />Laden...</div>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={3 + sites.length}>
                  <div className="ms-empty">Geen producten met voorraadtracking gevonden</div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.productId}>
                  <td className="ms-table__sticky" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={`/admin/collections/products/${product.productId}`} className="ms-table__link">
                      {product.title}
                    </a>
                  </td>
                  <td className="ms-table__mono">{product.sku}</td>
                  <td className="ms-table__center">
                    <StockCell
                      stock={product.hubStock}
                      stockStatus={product.hubStockStatus}
                      isHub
                      stockValueClass={stockValueClass}
                    />
                  </td>
                  {product.sites.map((siteStock) => (
                    <td key={siteStock.siteId} className="ms-table__center">
                      {siteStock.stock === -1 ? (
                        <span className="ms-stock-cell--not-distributed">—</span>
                      ) : (
                        <StockCell
                          stock={siteStock.stock}
                          stockStatus={siteStock.stockStatus}
                          inSync={siteStock.inSync}
                          stockValueClass={stockValueClass}
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
  stockValueClass,
}: {
  stock: number
  stockStatus: string
  isHub?: boolean
  inSync?: boolean
  stockValueClass: (n: number) => string
}) {
  const statusInfo = STOCK_STATUS[stockStatus]
  const dotColor = statusInfo?.color || '#64748b'

  let cellClass = 'ms-stock-cell'
  if (isHub) cellClass += ' ms-stock-cell--hub'
  else if (inSync === false) cellClass += ' ms-stock-cell--out-of-sync'

  return (
    <div className={cellClass}>
      <span className={`ms-stock-cell__value ${stockValueClass(stock)}`}>{stock}</span>
      <span className="ms-stock-cell__dot" style={{ background: dotColor }} />
    </div>
  )
}

const STOCK_STATUS_LOOKUP: Record<string, { label: string; color: string }> = STOCK_STATUS
