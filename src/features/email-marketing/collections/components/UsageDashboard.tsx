'use client'

/**
 * Usage Dashboard Component
 *
 * Displays email usage statistics, tier information, and recommendations
 * Used in EmailCampaigns collection dashboard
 */

import React, { useEffect, useState } from 'react'
import './UsageDashboard.css'

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface UsageData {
  tenantId: string
  period: string
  subscriberCount: number
  emailsSent: number
  currentTier: string
  includedEmails: number
  extraEmails: number
  extraCost: number
  baseCost: number
  totalCost: number
  usagePercentage: number
  hardLimitReached: boolean
}

interface TierConfig {
  name: string
  maxSubscribers: number
  includedEmails: number
  baseCost: number
  extraEmailRate: number
  features: {
    campaignsUnlimited: boolean
    automationRulesMax: number | null
    automationFlows: boolean
    advancedSegmentation: boolean
    abTesting: boolean
    apiAccess: boolean
    dedicatedIP: boolean
    prioritySupport: boolean
  }
}

interface Warnings {
  approachingLimit: boolean
  hardLimitReached: boolean
  overageCharges: boolean
}

interface UsageResponse {
  success: boolean
  usage: UsageData
  tierConfig: TierConfig
  warnings: Warnings
  recommendations: string[]
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════

export const UsageDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<UsageResponse | null>(null)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/email-marketing/usage')
      if (!response.ok) {
        throw new Error(`Failed to fetch usage data: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[UsageDashboard] Error fetching usage:', err)
      setError(message || 'Failed to load usage data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="usage-dashboard">
        <div className="usage-loading">Loading usage data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="usage-dashboard">
        <div className="usage-error">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  if (!data || !data.success) {
    return (
      <div className="usage-dashboard">
        <div className="usage-error">No usage data available</div>
      </div>
    )
  }

  const { usage, tierConfig, warnings, recommendations } = data

  return (
    <div className="usage-dashboard">
      {/* Header */}
      <div className="usage-header">
        <h2>Email Usage - {usage.period}</h2>
        <button onClick={fetchUsageData} className="refresh-button">
          Refresh
        </button>
      </div>

      {/* Warnings Banner */}
      {(warnings.hardLimitReached || warnings.approachingLimit || warnings.overageCharges) && (
        <div
          className={`usage-banner ${
            warnings.hardLimitReached
              ? 'banner-critical'
              : warnings.overageCharges
                ? 'banner-warning'
                : 'banner-info'
          }`}
        >
          {warnings.hardLimitReached && (
            <>
              <strong>🚨 Hard Limit Reached</strong>
              <p>
                Email sending has been suspended. You have sent {usage.emailsSent} emails (limit:{' '}
                {usage.includedEmails * 2}). Contact support to increase your limit.
              </p>
            </>
          )}
          {!warnings.hardLimitReached && warnings.overageCharges && (
            <>
              <strong>⚠️ Overage Charges Applying</strong>
              <p>
                You have exceeded your included {usage.includedEmails} emails. Current overage:{' '}
                {usage.extraEmails} emails = €{usage.extraCost.toFixed(2)}
              </p>
            </>
          )}
          {!warnings.hardLimitReached && !warnings.overageCharges && warnings.approachingLimit && (
            <>
              <strong>📊 Approaching Limit</strong>
              <p>
                You've used {usage.usagePercentage.toFixed(1)}% of your included emails. Consider
                upgrading to avoid overage charges.
              </p>
            </>
          )}
        </div>
      )}

      {/* Usage Stats Grid */}
      <div className="usage-stats-grid">
        {/* Emails Sent Card */}
        <div className="usage-card">
          <div className="card-label">Emails Sent</div>
          <div className="card-value">
            {usage.emailsSent.toLocaleString()} <span className="card-unit">/ {usage.includedEmails.toLocaleString()}</span>
          </div>
          <UsageProgressBar percentage={usage.usagePercentage} />
        </div>

        {/* Subscribers Card */}
        <div className="usage-card">
          <div className="card-label">Subscribers</div>
          <div className="card-value">
            {usage.subscriberCount.toLocaleString()}{' '}
            <span className="card-unit">/ {tierConfig.maxSubscribers.toLocaleString()}</span>
          </div>
          <div className="card-info">
            {Math.round((usage.subscriberCount / tierConfig.maxSubscribers) * 100)}% of tier limit
          </div>
        </div>

        {/* Current Tier Card */}
        <div className="usage-card">
          <div className="card-label">Current Tier</div>
          <div className="card-value tier-name">{tierConfig.name.toUpperCase()}</div>
          <div className="card-info">€{tierConfig.baseCost}/month</div>
        </div>

        {/* Total Cost Card */}
        <div className="usage-card">
          <div className="card-label">Total Cost</div>
          <div className="card-value">
            €{usage.totalCost.toFixed(2)}
            {usage.extraCost > 0 && <span className="card-extra"> (+€{usage.extraCost.toFixed(2)} overage)</span>}
          </div>
          <div className="card-info">
            Base: €{usage.baseCost} + Overage: €{usage.extraCost.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tier Features */}
      <div className="tier-features">
        <h3>Your Plan Features</h3>
        <div className="features-grid">
          <FeatureItem
            label="Email Campaigns"
            enabled={tierConfig.features.campaignsUnlimited}
            value="Unlimited"
          />
          <FeatureItem
            label="Automation Rules"
            enabled={true}
            value={
              tierConfig.features.automationRulesMax === null
                ? 'Unlimited'
                : `Max ${tierConfig.features.automationRulesMax}`
            }
          />
          <FeatureItem
            label="Automation Flows"
            enabled={tierConfig.features.automationFlows}
          />
          <FeatureItem
            label="Advanced Segmentation"
            enabled={tierConfig.features.advancedSegmentation}
          />
          <FeatureItem label="A/B Testing" enabled={tierConfig.features.abTesting} />
          <FeatureItem label="API Access" enabled={tierConfig.features.apiAccess} />
          <FeatureItem label="Dedicated IP" enabled={tierConfig.features.dedicatedIP} />
          <FeatureItem label="Priority Support" enabled={tierConfig.features.prioritySupport} />
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommendations</h3>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Overage Pricing Info */}
      <div className="pricing-info">
        <h3>Overage Pricing</h3>
        <p>
          Emails beyond your {usage.includedEmails.toLocaleString()} included emails cost{' '}
          <strong>€{tierConfig.extraEmailRate.toFixed(2)} per 1,000 emails</strong>.
        </p>
        <p>
          Hard limit: <strong>{(usage.includedEmails * 2).toLocaleString()} emails</strong> (2x
          included emails). Email sending is suspended when this limit is reached.
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════

/**
 * Progress bar with color coding based on usage percentage
 */
const UsageProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
  const getColor = (pct: number): string => {
    if (pct >= 100) return '#dc2626' // Red (over limit)
    if (pct >= 90) return '#f59e0b' // Orange (critical)
    if (pct >= 75) return '#fbbf24' // Yellow (warning)
    return '#10b981' // Green (good)
  }

  const displayPercentage = Math.min(percentage, 100) // Cap at 100% for visual

  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${displayPercentage}%`,
            backgroundColor: getColor(percentage),
          }}
        />
      </div>
      <div className="progress-label" style={{ color: getColor(percentage) }}>
        {percentage.toFixed(1)}%
      </div>
    </div>
  )
}

/**
 * Feature item with enabled/disabled state
 */
const FeatureItem: React.FC<{ label: string; enabled: boolean; value?: string }> = ({
  label,
  enabled,
  value,
}) => {
  return (
    <div className={`feature-item ${enabled ? 'feature-enabled' : 'feature-disabled'}`}>
      <span className="feature-icon">{enabled ? '✓' : '✗'}</span>
      <span className="feature-label">{label}</span>
      {value && <span className="feature-value">({value})</span>}
    </div>
  )
}
