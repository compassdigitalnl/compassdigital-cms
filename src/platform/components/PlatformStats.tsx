'use client'

/**
 * Platform Statistics Cards
 * Shows key metrics for the platform
 */

import React, { useEffect, useState } from 'react'

interface Stats {
  totalClients: number
  activeClients: number
  suspendedClients: number
  failedDeployments: number
}

export default function PlatformStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/platform/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load stats:', err)
        setLoading(false)
      })
  }, [])

  const statCards = [
    {
      name: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: '👥',
      color: 'blue',
    },
    {
      name: 'Active Clients',
      value: stats?.activeClients || 0,
      icon: '✅',
      color: 'green',
    },
    {
      name: 'Suspended',
      value: stats?.suspendedClients || 0,
      icon: '⏸️',
      color: 'yellow',
    },
    {
      name: 'Failed Deployments',
      value: stats?.failedDeployments || 0,
      icon: '❌',
      color: 'red',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div
              className={`text-4xl bg-${stat.color}-100 w-16 h-16 rounded-full flex items-center justify-center`}
            >
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
