'use client'

/**
 * Deployments Table
 * Shows all deployments with filtering
 */

import React from 'react'

export default function DeploymentsTable() {
  // TODO: Fetch actual deployments from API
  const deployments = [
    {
      id: 'dpl_1',
      client: 'ACME Corp',
      clientId: 'client_1',
      type: 'initial',
      status: 'success',
      environment: 'production',
      version: '1.0.0',
      startedAt: new Date(Date.now() - 120000).toISOString(),
      duration: 180,
    },
    {
      id: 'dpl_2',
      client: 'Beta Medical',
      clientId: 'client_2',
      type: 'update',
      status: 'success',
      environment: 'production',
      version: '1.1.0',
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      duration: 165,
    },
    {
      id: 'dpl_3',
      client: 'Test Site',
      clientId: 'client_3',
      type: 'hotfix',
      status: 'failed',
      environment: 'production',
      version: '1.0.1',
      startedAt: new Date(Date.now() - 10800000).toISOString(),
      duration: 45,
      errorMessage: 'Build failed: TypeScript compilation error',
    },
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      in_progress: 'bg-teal-100 text-blue-800',
      pending: 'bg-amber-50 text-amber-900',
      rolled_back: 'bg-amber-50 text-amber-900',
    }
    return styles[status] || 'bg-grey-light text-navy'
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="p-6 border-b border-grey-light">
        <div className="flex gap-4">
          <select className="px-4 py-2 border border-grey-light rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent">
            <option value="all">All Clients</option>
          </select>
          <select className="px-4 py-2 border border-grey-light rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent">
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="in_progress">In Progress</option>
          </select>
          <select className="px-4 py-2 border border-grey-light rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent">
            <option value="all">All Types</option>
            <option value="initial">Initial</option>
            <option value="update">Update</option>
            <option value="hotfix">Hotfix</option>
            <option value="rollback">Rollback</option>
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Environment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grey-mid uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-grey-light">
            {deployments.map((deployment) => (
              <tr key={deployment.id} className="hover:bg-grey-light">
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/platform/clients/${deployment.clientId}`}
                    className="font-medium text-teal hover:text-teal-700"
                  >
                    {deployment.client}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-navy capitalize">{deployment.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(deployment.status)}`}
                  >
                    {deployment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-navy">{deployment.version}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-navy capitalize">{deployment.environment}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-navy">
                    {formatDuration(deployment.duration)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-grey-mid">
                  {formatTime(deployment.startedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-grey-light flex items-center justify-between">
        <p className="text-sm text-grey-dark">Showing 1-{deployments.length} of {deployments.length} deployments</p>
        <div className="flex gap-2">
          <button
            disabled
            className="px-4 py-2 border border-grey-light rounded-lg hover:bg-grey-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled
            className="px-4 py-2 border border-grey-light rounded-lg hover:bg-grey-light disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
