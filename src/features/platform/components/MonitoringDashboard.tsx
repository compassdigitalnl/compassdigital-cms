'use client'

/**
 * Monitoring Dashboard
 * Shows health metrics and incidents
 */

import React, { useEffect, useState } from 'react'

interface MonitoringData {
  totalClients: number
  healthyClients: number
  warningClients: number
  criticalClients: number
  averageUptime: number
  averageResponseTime: number
  recentIncidents: any[]
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    loadData()

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      loadData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const res = await fetch('/api/platform/stats')
      const result = await res.json()

      if (result.success) {
        setData(result.data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to load monitoring data:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-12 text-grey-dark">Loading monitoring data...</div>
  }

  const healthPercentage =
    data && data.totalClients > 0
      ? Math.round((data.healthyClients / data.totalClients) * 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Overall Health */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Overall Health</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(healthPercentage / 100) * 175.93} 175.93`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{healthPercentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">
                {data?.healthyClients || 0}/{data?.totalClients || 0}
              </p>
              <p className="text-xs text-grey-mid">Healthy clients</p>
            </div>
          </div>
        </div>

        {/* Average Uptime */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Average Uptime</h3>
          <p className="text-3xl font-bold text-navy">
            {data?.averageUptime ? `${data.averageUptime.toFixed(2)}%` : '-'}
          </p>
          <p className="text-xs text-grey-mid mt-1">Last 30 days</p>
        </div>

        {/* Average Response Time */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Avg Response Time</h3>
          <p className="text-3xl font-bold text-navy">
            {data?.averageResponseTime ? `${data.averageResponseTime}ms` : '-'}
          </p>
          <p className="text-xs text-grey-mid mt-1">All clients</p>
        </div>

        {/* Issues */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Issues</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-grey-dark">🟡 Warning</span>
              <span className="font-medium">{data?.warningClients || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-grey-dark">🔴 Critical</span>
              <span className="font-medium">{data?.criticalClients || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status by Client */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-grey-light">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-navy">Client Status</h2>
            <div className="text-sm text-grey-mid">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="p-6">
          {data?.totalClients === 0 ? (
            <p className="text-center text-grey-mid py-8">No clients to monitor</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🟢</span>
                  <div>
                    <p className="font-medium text-navy">Healthy</p>
                    <p className="text-sm text-grey-dark">
                      All systems operational
                    </p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-navy">
                  {data?.healthyClients || 0}
                </span>
              </div>

              {(data?.warningClients || 0) > 0 && data && (
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🟡</span>
                    <div>
                      <p className="font-medium text-navy">Warning</p>
                      <p className="text-sm text-grey-dark">Needs attention</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-navy">
                    {data.warningClients}
                  </span>
                </div>
              )}

              {(data?.criticalClients || 0) > 0 && data && (
                <div className="flex items-center justify-between p-4 bg-coral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔴</span>
                    <div>
                      <p className="font-medium text-navy">Critical</p>
                      <p className="text-sm text-grey-dark">Immediate action required</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-navy">
                    {data.criticalClients}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-grey-light">
          <h2 className="text-xl font-bold text-navy">Recent Incidents</h2>
        </div>
        <div className="p-6">
          {data?.recentIncidents && data.recentIncidents.length > 0 ? (
            <div className="space-y-4">
              {data.recentIncidents.map((incident: any, i: number) => (
                <div key={i} className="p-4 border border-grey-light rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-navy">{incident.client}</p>
                      <p className="text-sm text-grey-dark mt-1">{incident.message}</p>
                      <p className="text-xs text-grey-mid mt-1">{incident.time}</p>
                    </div>
                    <span className={`text-2xl`}>
                      {incident.severity === 'critical' ? '🔴' : '🟡'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-grey-mid py-8">No recent incidents 🎉</p>
          )}
        </div>
      </div>
    </div>
  )
}
