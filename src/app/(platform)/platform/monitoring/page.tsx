/**
 * Monitoring Dashboard
 * Real-time monitoring and health status of all clients
 */

import React from 'react'
import MonitoringDashboard from '@/platform/components/MonitoringDashboard'

export default function MonitoringPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Monitoring</h1>
        <p className="text-gray-600 mt-2">Real-time health and performance monitoring</p>
      </div>

      {/* Dashboard */}
      <MonitoringDashboard />
    </div>
  )
}
