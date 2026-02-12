/**
 * Platform Dashboard
 * Overview of platform statistics and recent activity
 */

import React from 'react'
import PlatformStats from '@/platform/components/PlatformStats'
import RecentActivity from '@/platform/components/RecentActivity'

export default function PlatformDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor and manage your multi-tenant platform
        </p>
      </div>

      {/* Stats */}
      <PlatformStats />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
