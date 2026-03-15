'use client'

/**
 * Client Details View
 * Complete view of client information, health, and deployments
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  domain: string
  contactEmail: string
  contactName?: string
  template: string
  status: string
  deploymentUrl: string
  adminUrl: string
  healthStatus: string
  uptimePercentage: number
  lastHealthCheck: string
  plan: string
  billingStatus: string
  monthlyFee: number
  createdAt: string
}

interface Deployment {
  id: string
  status: string
  environment: string
  type: string
  version?: string
  startedAt: string
  completedAt?: string
  duration?: number
  errorMessage?: string
}

export default function ClientDetailsView({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [clientId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load client and deployments in parallel
      const [clientRes, deploymentsRes] = await Promise.all([
        fetch(`/api/platform/clients/${clientId}`),
        fetch(`/api/platform/clients/${clientId}/deployments`),
      ])

      const clientData = await clientRes.json()
      const deploymentsData = await deploymentsRes.json()

      if (clientData.success) setClient(clientData.data)
      if (deploymentsData.success) setDeployments(deploymentsData.data)
    } catch (error) {
      console.error('Failed to load client data:', error)
    }
    setLoading(false)
  }

  const handleAction = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action} this client?`)) return

    setActionLoading(action)
    try {
      const res = await fetch(`/api/platform/clients/${clientId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      const data = await res.json()

      if (data.success) {
        alert(`Successfully ${action}ed client`)
        if (action === 'delete') {
          router.push('/platform/clients')
        } else {
          loadData()
        }
      } else {
        alert(`Failed to ${action}: ${data.error}`)
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      alert(`Error: ${message}`)
    }
    setActionLoading(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-grey-light rounded-lg animate-pulse"></div>
        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-grey-light rounded-lg animate-pulse"></div>
          <div className="h-32 bg-grey-light rounded-lg animate-pulse"></div>
          <div className="h-32 bg-grey-light rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-grey-dark">Client not found</p>
        <Link href="/platform/clients/" className="text-teal hover:text-teal-700 mt-4">
          ← Back to Clients
        </Link>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-amber-50 text-amber-900',
      provisioning: 'bg-teal-100 text-blue-800',
      deploying: 'bg-teal-100 text-blue-800',
      failed: 'bg-red-100 text-red-800',
      suspended: 'bg-grey-light text-navy',
    }
    return styles[status] || 'bg-grey-light text-navy'
  }

  const getHealthBadge = (health: string) => {
    const badges: Record<string, { icon: string; color: string }> = {
      healthy: { icon: '🟢', color: 'text-green' },
      warning: { icon: '🟡', color: 'text-amber-600' },
      critical: { icon: '🔴', color: 'text-coral' },
      unknown: { icon: '⚪', color: 'text-grey-dark' },
    }
    return badges[health] || badges.unknown
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/platform/clients/"
        className="inline-flex items-center text-grey-dark hover:text-navy"
      >
        ← Back to Clients
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy">{client.name}</h1>
            <p className="text-grey-dark mt-1">{client.deploymentUrl}</p>
            <div className="flex items-center gap-4 mt-4">
              <span
                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(client.status)}`}
              >
                {client.status}
              </span>
              <span className="text-sm text-grey-dark capitalize">Template: {client.template}</span>
              <span className="text-sm text-grey-dark capitalize">Plan: {client.plan}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {client.deploymentUrl && (
              <a
                href={client.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-grey-light rounded-lg hover:bg-grey-light transition-colors"
              >
                Visit Site
              </a>
            )}
            {client.adminUrl && (
              <a
                href={client.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-grey-light rounded-lg hover:bg-grey-light transition-colors"
              >
                Open Admin
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Health Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Health Status</h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getHealthBadge(client.healthStatus).icon}</span>
            <div>
              <p className={`text-2xl font-bold ${getHealthBadge(client.healthStatus).color}`}>
                {client.healthStatus}
              </p>
              <p className="text-xs text-grey-mid">
                {client.lastHealthCheck
                  ? `Last check: ${new Date(client.lastHealthCheck).toLocaleString()}`
                  : 'No checks yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Uptime (30 days)</h3>
          <p className="text-3xl font-bold text-navy">
            {client.uptimePercentage ? `${client.uptimePercentage.toFixed(2)}%` : '-'}
          </p>
          <p className="text-xs text-grey-mid mt-1">
            {client.uptimePercentage >= 99.9 ? '🎉 Excellent!' : 'Needs attention'}
          </p>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-grey-dark mb-2">Billing</h3>
          <p className="text-3xl font-bold text-navy">
            €{client.monthlyFee || 0}/mo
          </p>
          <p className="text-xs text-grey-mid mt-1 capitalize">
            Status: {client.billingStatus || 'active'}
          </p>
        </div>
      </div>

      {/* Deployments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-grey-light flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy">Deployment History</h2>
          <button
            onClick={() => handleAction('redeploy')}
            disabled={!!actionLoading}
            className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {actionLoading === 'redeploy' ? 'Redeploying...' : 'Redeploy'}
          </button>
        </div>
        <div className="divide-y divide-grey-light">
          {deployments.length === 0 ? (
            <div className="p-12 text-center text-grey-mid">No deployments yet</div>
          ) : (
            deployments.map((deployment) => (
              <div key={deployment.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-navy capitalize">
                        {deployment.type}
                      </span>
                      {deployment.version && (
                        <span className="text-sm text-grey-dark">v{deployment.version}</span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(deployment.status)}`}
                      >
                        {deployment.status}
                      </span>
                    </div>
                    <p className="text-sm text-grey-dark mt-1">
                      {new Date(deployment.startedAt).toLocaleString()}
                      {deployment.duration && ` • ${deployment.duration}s`}
                    </p>
                    {deployment.errorMessage && (
                      <p className="text-sm text-coral mt-2">{deployment.errorMessage}</p>
                    )}
                  </div>
                  <span className="text-xs text-grey-mid capitalize">{deployment.environment}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-navy mb-4">Actions</h2>
        <div className="flex gap-3">
          {client.status === 'active' && (
            <button
              onClick={() => handleAction('suspend')}
              disabled={!!actionLoading}
              className="px-4 py-2 border border-grey-light rounded-lg hover:bg-grey-light transition-colors disabled:opacity-50"
            >
              {actionLoading === 'suspend' ? 'Suspending...' : 'Suspend Client'}
            </button>
          )}
          {client.status === 'suspended' && (
            <button
              onClick={() => handleAction('activate')}
              disabled={!!actionLoading}
              className="px-4 py-2 bg-green text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {actionLoading === 'activate' ? 'Activating...' : 'Activate Client'}
            </button>
          )}
          <button
            onClick={() => handleAction('delete')}
            disabled={!!actionLoading}
            className="px-4 py-2 bg-coral text-white rounded-lg hover:bg-coral-700 transition-colors disabled:opacity-50"
          >
            {actionLoading === 'delete' ? 'Deleting...' : 'Delete Client'}
          </button>
        </div>
      </div>
    </div>
  )
}
