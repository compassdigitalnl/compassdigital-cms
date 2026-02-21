/**
 * Deployments Overview Page
 * Shows all deployments across all clients
 */

import React from 'react'
import DeploymentsTable from '@/branches/platform/components/DeploymentsTable'

export default function DeploymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deployments</h1>
        <p className="text-gray-600 mt-2">View deployment history across all clients</p>
      </div>

      {/* Deployments Table */}
      <DeploymentsTable />
    </div>
  )
}
