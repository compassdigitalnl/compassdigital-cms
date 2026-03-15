'use client'

/**
 * Clients Table
 * Displays all clients with filtering and actions
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Client {
  id: string
  name: string
  domain: string
  template: string
  status: string
  deploymentUrl: string
  adminUrl: string
  healthStatus: string
  uptimePercentage: number
  lastHealthCheck: string
  createdAt: string
}

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    loadClients()
  }, [statusFilter])

  const loadClients = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/platform/clients?${params}`)
      const data = await res.json()

      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-amber-50 text-amber-900',
      provisioning: 'bg-teal-100 text-blue-800',
      deploying: 'bg-teal-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      suspended: 'bg-grey-light text-navy',
      archived: 'bg-grey-light text-grey-dark',
    }
    return styles[status] || 'bg-grey-light text-navy'
  }

  const getHealthBadge = (health: string) => {
    const icons: Record<string, string> = {
      healthy: '🟢',
      warning: '🟡',
      critical: '🔴',
      unknown: '⚪',
    }
    return icons[health] || '⚪'
  }

  const filteredClients = clients.filter((client) =>
    filter
      ? client.name.toLowerCase().includes(filter.toLowerCase()) ||
        client.domain.toLowerCase().includes(filter.toLowerCase())
      : true,
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-grey-light rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="p-6 border-b border-grey-light">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search clients..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-grey-light rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-grey-light rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="provisioning">Provisioning</option>
            <option value="suspended">Suspended</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-grey-light border-b border-grey-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Template
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Health
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Uptime
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-grey-light">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-grey-mid">
                  {filter ? 'No clients match your search' : 'No clients yet. Add your first client!'}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-grey-light">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-navy">{client.name}</div>
                      <div className="text-sm text-grey-mid">{client.domain}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-navy capitalize">{client.template}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(client.status)}`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-2xl">{getHealthBadge(client.healthStatus)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-navy">
                      {client.uptimePercentage ? `${client.uptimePercentage.toFixed(1)}%` : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/platform/clients/${client.id}`}
                        className="text-teal hover:text-teal-700 font-medium"
                      >
                        View
                      </Link>
                      {client.deploymentUrl && (
                        <a
                          href={client.deploymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal hover:text-teal-700"
                        >
                          Visit
                        </a>
                      )}
                      {client.adminUrl && (
                        <a
                          href={client.adminUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal hover:text-teal-700"
                        >
                          Admin
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
