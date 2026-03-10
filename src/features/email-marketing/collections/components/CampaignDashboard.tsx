'use client'

/**
 * Campaign Dashboard Component
 *
 * Shows campaign statistics and control buttons in the admin panel
 */

import React, { useState } from 'react'
import type { Field } from 'payload'

interface CampaignStats {
  sent: number
  delivered: number
  bounced: number
  opened: number
  clicked: number
  openRate: number
  clickRate: number
  bounceRate: number
  unsubscribed: number
}

interface CampaignData {
  id: string
  status: string
  listmonkCampaignId?: number
  stats?: CampaignStats
}

export const CampaignDashboard: React.FC<{ field: Field; data: CampaignData }> = ({
  field,
  data,
}) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [stats, setStats] = useState<CampaignStats | null>(data?.stats || null)

  const campaignId = data?.id
  const status = data?.status || 'draft'
  const listmonkId = data?.listmonkCampaignId

  // API call helper
  const apiCall = async (endpoint: string, method: string = 'POST', body?: any) => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'API call failed')
      }

      setMessage(result.message || 'Success')

      // Reload page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 1500)

      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      setMessage(`Error: ${message}`)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Button handlers
  const handleStart = () => apiCall('start')
  const handlePause = () => apiCall('pause')
  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this campaign?')) {
      apiCall('cancel')
    }
  }

  const handleTest = () => {
    const emails = prompt('Enter test email addresses (comma-separated):')
    if (emails) {
      const emailList = emails.split(',').map(e => e.trim())
      apiCall('test', 'POST', { emails: emailList })
    }
  }

  const handleRefreshStats = async () => {
    const result = await apiCall('stats', 'GET')
    if (result.stats) {
      setStats(result.stats)
    }
  }

  // Status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500'
      case 'scheduled':
        return 'bg-blue-500'
      case 'running':
        return 'bg-green-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'finished':
        return 'bg-purple-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Format percentage
  const formatPercent = (value: number) => `${value.toFixed(2)}%`

  // Format number
  const formatNumber = (value: number) => value.toLocaleString()

  return (
    <div className="campaign-dashboard" style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Campaign Dashboard</h3>
        <span
          className={getStatusColor(status)}
          style={{
            padding: '4px 12px',
            borderRadius: '12px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          {status}
        </span>
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: message.startsWith('Error') ? '#fee' : '#efe',
            border: `1px solid ${message.startsWith('Error') ? '#fcc' : '#cfc'}`,
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {message}
        </div>
      )}

      {/* Statistics Grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <StatCard title="Sent" value={formatNumber(stats.sent)} />
          <StatCard title="Delivered" value={formatNumber(stats.delivered)} />
          <StatCard title="Bounced" value={formatNumber(stats.bounced)} />
          <StatCard title="Opened" value={formatNumber(stats.opened)} subtitle={formatPercent(stats.openRate)} />
          <StatCard title="Clicked" value={formatNumber(stats.clicked)} subtitle={formatPercent(stats.clickRate)} />
          <StatCard title="Bounce Rate" value={formatPercent(stats.bounceRate)} color="red" />
          <StatCard title="Unsubscribed" value={formatNumber(stats.unsubscribed)} />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {/* Start Button */}
        {(status === 'draft' || status === 'scheduled') && listmonkId && (
          <ActionButton onClick={handleStart} disabled={loading} color="green">
            {loading ? 'Starting...' : 'Start Campaign'}
          </ActionButton>
        )}

        {/* Pause Button */}
        {status === 'running' && (
          <ActionButton onClick={handlePause} disabled={loading} color="yellow">
            {loading ? 'Pausing...' : 'Pause Campaign'}
          </ActionButton>
        )}

        {/* Cancel Button */}
        {(status === 'scheduled' || status === 'running' || status === 'paused') && (
          <ActionButton onClick={handleCancel} disabled={loading} color="red">
            {loading ? 'Cancelling...' : 'Cancel Campaign'}
          </ActionButton>
        )}

        {/* Test Button */}
        {listmonkId && status !== 'finished' && status !== 'cancelled' && (
          <ActionButton onClick={handleTest} disabled={loading} color="blue">
            {loading ? 'Sending...' : 'Send Test Email'}
          </ActionButton>
        )}

        {/* Refresh Stats Button */}
        {listmonkId && (status === 'running' || status === 'finished') && (
          <ActionButton onClick={handleRefreshStats} disabled={loading} color="purple">
            {loading ? 'Refreshing...' : 'Refresh Statistics'}
          </ActionButton>
        )}
      </div>

      {/* Warning if not synced */}
      {!listmonkId && (
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          ⚠️ <strong>Not synced to Listmonk</strong> - Save the campaign to sync it first.
        </div>
      )}
    </div>
  )
}

// Stat Card Component
const StatCard: React.FC<{ title: string; value: string; subtitle?: string; color?: string }> = ({
  title,
  value,
  subtitle,
  color = 'black',
}) => (
  <div
    style={{
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}
  >
    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px', textTransform: 'uppercase' }}>{title}</div>
    <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
    {subtitle && <div style={{ fontSize: '14px', color: '#999', marginTop: '4px' }}>{subtitle}</div>}
  </div>
)

// Action Button Component
const ActionButton: React.FC<{
  onClick: () => void
  disabled: boolean
  color: string
  children: React.ReactNode
}> = ({ onClick, disabled, color, children }) => {
  const colors: Record<string, { bg: string; hover: string }> = {
    green: { bg: '#10b981', hover: '#059669' },
    blue: { bg: '#3b82f6', hover: '#2563eb' },
    yellow: { bg: '#f59e0b', hover: '#d97706' },
    red: { bg: '#ef4444', hover: '#dc2626' },
    purple: { bg: '#8b5cf6', hover: '#7c3aed' },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 20px',
        backgroundColor: colors[color]?.bg || '#666',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors[color]?.hover || '#555'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = colors[color]?.bg || '#666'
      }}
    >
      {children}
    </button>
  )
}
