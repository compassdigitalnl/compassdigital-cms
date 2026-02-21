'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Globe, Activity, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface Stats {
  totalClients: number
  activeClients: number
  totalRevenue: number
  monthlyRevenue: number
  healthyClients: number
  criticalClients: number
}

export default function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      // Fetch clients from Payload API
      const response = await fetch('/api/clients?limit=1000')
      const data = await response.json()

      if (data.docs) {
        const clients = data.docs

        // Calculate stats
        const totalClients = clients.length
        const activeClients = clients.filter((c: any) => c.status === 'active').length
        const healthyClients = clients.filter((c: any) => c.healthStatus === 'healthy').length
        const criticalClients = clients.filter(
          (c: any) => c.healthStatus === 'critical' || c.healthStatus === 'warning',
        ).length

        // Calculate revenue
        const totalRevenue = clients.reduce((sum: number, c: any) => {
          return sum + (c.monthlyFee || 0)
        }, 0)

        const activeRevenue = clients
          .filter((c: any) => c.billingStatus === 'active')
          .reduce((sum: number, c: any) => {
            return sum + (c.monthlyFee || 0)
          }, 0)

        setStats({
          totalClients,
          activeClients,
          totalRevenue,
          monthlyRevenue: activeRevenue,
          healthyClients,
          criticalClients,
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Set default stats on error
      setStats({
        totalClients: 0,
        activeClients: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        healthyClients: 0,
        criticalClients: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-gray-500">
        <AlertCircle className="mx-auto h-12 w-12 mb-2" />
        <p>Failed to load platform statistics</p>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients,
      description: 'All registered clients',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Active Clients',
      value: stats.activeClients,
      description: `${Math.round((stats.activeClients / Math.max(stats.totalClients, 1)) * 100)}% of total`,
      icon: Globe,
      color: 'text-green-600',
    },
    {
      title: 'Monthly Revenue',
      value: `€${stats.monthlyRevenue.toLocaleString()}`,
      description: 'Active subscriptions',
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Total Revenue',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      description: 'All clients combined',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Healthy Clients',
      value: stats.healthyClients,
      description: `${Math.round((stats.healthyClients / Math.max(stats.totalClients, 1)) * 100)}% uptime`,
      icon: Activity,
      color: 'text-green-600',
    },
    {
      title: 'Needs Attention',
      value: stats.criticalClients,
      description: 'Critical or warning status',
      icon: AlertCircle,
      color: stats.criticalClients > 0 ? 'text-red-600' : 'text-gray-400',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
