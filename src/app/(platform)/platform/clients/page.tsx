/**
 * Clients Overview Page
 * List and manage all platform clients
 */

import React from 'react'
import ClientsTable from '@/platform/components/ClientsTable'
import AddClientButton from '@/platform/components/AddClientButton'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">Manage all client sites and deployments</p>
        </div>
        <AddClientButton />
      </div>

      {/* Clients Table */}
      <ClientsTable />
    </div>
  )
}
