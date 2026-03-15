/**
 * Platform Dashboard
 * Overview of platform statistics and recent activity
 */

import React from 'react'
import PlatformStats from '@/features/platform/components/PlatformStats'
import RecentActivity from '@/features/platform/components/RecentActivity'

export default function PlatformDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-navy">Platform Dashboard</h1>
        <p className="text-grey-dark mt-2">
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
