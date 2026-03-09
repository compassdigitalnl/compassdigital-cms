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

interface FunnelStep {
  label: string
  count: number
}

interface CustomerDataPoint {
  period: string
  newCustomers: number
  returningCustomers: number
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
  const res = await fetch(url)
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
      const [revenue, products, funnels, customers] = await Promise.all([
        fetchJSON<RevenueData>(`/api/analytics/revenue?period=${selectedPeriod}`),
        fetchJSON<TopProduct[]>(`/api/analytics/top-products?period=${selectedPeriod}`),
        fetchJSON<FunnelStep[]>(`/api/analytics/funnels?period=${selectedPeriod}`),
        fetchJSON<CustomerDataPoint[]>(`/api/analytics/customers?period=${selectedPeriod}`),
      ])

      setRevenueData(revenue)
      setTopProducts(products)
      setFunnelData(funnels)
      setCustomerData(customers)
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
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <PeriodSelector value={period} onChange={handlePeriodChange} />
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
            <button
              onClick={() => loadData(period)}
              className="ml-2 underline hover:no-underline"
            >
              Opnieuw proberen
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsTable data={topProducts} loading={loading} />
        <CustomerMetrics data={customerData} loading={loading} />
      </div>

      {/* Conversion Funnel */}
      <ConversionFunnel data={funnelData} loading={loading} />
    </div>
  )
}
