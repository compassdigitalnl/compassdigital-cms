'use client'

import { useState, useEffect, useCallback } from 'react'
import { StatCard } from './StatCard'
import { RevenueChart } from './RevenueChart'
import { TopProductsTable } from './TopProductsTable'
import { CustomerMetrics } from './CustomerMetrics'
import { ConversionFunnel } from './ConversionFunnel'
import { PeriodSelector } from './PeriodSelector'

interface RevenueData {
  daily: { date: string; revenue: number }[]
  totalRevenue: number
  revenueChange: number
  totalOrders: number
  ordersChange: number
  averageOrderValue: number
  aovChange: number
  totalCustomers: number
  customersChange: number
}

interface TopProduct {
  rank: number
  name: string
  sku: string
  quantity: number
  revenue: number
}

interface TopProductsResponse {
  products: { title: string; sku: string; totalQuantity: number; totalRevenue: number; orderCount: number }[]
}

interface FunnelStep {
  label: string
  count: number
}

interface FunnelResponse {
  funnel: {
    totalRegisteredUsers: number
    newUsersInPeriod: number
    totalOrders: number
    completedOrders: number
    cancelledOrders: number
    uniqueCustomers: number
    checkoutCompletionRate: number
    cancellationRate: number
  }
}

interface CustomerDataPoint {
  period: string
  newCustomers: number
  returningCustomers: number
}

interface CustomersResponse {
  summary: { newCustomers: number; returningCustomers: number }
  timeline: { date: string; newCustomers: number }[]
}

function formatEUR(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error(`Fout bij ophalen: ${res.statusText}`)
  return res.json() as Promise<T>
}

export function RevenueDashboard() {
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([])
  const [customerData, setCustomerData] = useState<CustomerDataPoint[]>([])

  const loadData = useCallback(async (selectedPeriod: string) => {
    setLoading(true)
    setError(null)

    try {
      const [revenue, productsRes, funnelsRes, customersRes] = await Promise.all([
        fetchJSON<RevenueData>(`/api/analytics/revenue?period=${selectedPeriod}`),
        fetchJSON<TopProductsResponse>(`/api/analytics/top-products?period=${selectedPeriod}`),
        fetchJSON<FunnelResponse>(`/api/analytics/funnels?period=${selectedPeriod}`),
        fetchJSON<CustomersResponse>(`/api/analytics/customers?period=${selectedPeriod}`),
      ])

      setRevenueData(revenue)

      const productsList = Array.isArray(productsRes) ? productsRes : (productsRes.products || [])
      setTopProducts(productsList.map((p: any, i: number) => ({
        rank: i + 1,
        name: p.title || p.name || '',
        sku: p.sku || '',
        quantity: p.totalQuantity || p.quantity || 0,
        revenue: p.totalRevenue || p.revenue || 0,
      })))

      const funnel = (funnelsRes as any).funnel || funnelsRes
      if (funnel && !Array.isArray(funnel)) {
        setFunnelData([
          { label: 'Geregistreerd', count: funnel.totalRegisteredUsers || 0 },
          { label: 'Nieuw (periode)', count: funnel.newUsersInPeriod || 0 },
          { label: 'Bestellingen', count: funnel.totalOrders || 0 },
          { label: 'Afgerond', count: funnel.completedOrders || 0 },
          { label: 'Unieke klanten', count: funnel.uniqueCustomers || 0 },
        ])
      } else {
        setFunnelData(Array.isArray(funnel) ? funnel : [])
      }

      const timeline = (customersRes as any).timeline
      if (Array.isArray(timeline)) {
        setCustomerData(timeline.map((t: any) => ({
          period: t.date || '',
          newCustomers: t.newCustomers || 0,
          returningCustomers: 0,
        })))
      } else if (Array.isArray(customersRes)) {
        setCustomerData(customersRes)
      } else {
        setCustomerData([])
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Er ging iets mis bij het laden van de data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(period)
  }, [period, loadData])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <PeriodSelector value={period} onChange={handlePeriodChange} />
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#dc2626', background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: '0.5rem' }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button
              onClick={() => loadData(period)}
              style={{ marginLeft: '0.5rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.8125rem' }}
            >
              Opnieuw proberen
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard
          title="Omzet"
          value={revenueData ? formatEUR(revenueData.totalRevenue) : '€ 0'}
          change={revenueData?.revenueChange}
          loading={loading}
        />
        <StatCard
          title="Bestellingen"
          value={revenueData ? formatCount(revenueData.totalOrders) : '0'}
          change={revenueData?.ordersChange}
          loading={loading}
        />
        <StatCard
          title="Gem. orderwaarde"
          value={revenueData ? formatEUR(revenueData.averageOrderValue) : '€ 0'}
          change={revenueData?.aovChange}
          loading={loading}
        />
        <StatCard
          title="Klanten"
          value={revenueData ? formatCount(revenueData.totalCustomers) : '0'}
          change={revenueData?.customersChange}
          loading={loading}
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart
        data={revenueData?.daily ?? []}
        loading={loading}
      />

      {/* Two Column: Products + Customer Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <TopProductsTable data={topProducts} loading={loading} />
        <CustomerMetrics data={customerData} loading={loading} />
      </div>

      {/* Conversion Funnel */}
      <ConversionFunnel data={funnelData} loading={loading} />
    </div>
  )
}
