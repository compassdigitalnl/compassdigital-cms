'use client'

/**
 * Deliverability Dashboard Component
 *
 * Shows DNS validation, warmup status, and deliverability recommendations
 */

import React, { useState, useEffect } from 'react'

interface DNSStatus {
  score: number
  overallStatus: string
  spf: { exists: boolean; valid: boolean }
  dkim: Array<{ exists: boolean; valid: boolean }>
  dmarc: { exists: boolean; valid: boolean; policy?: string }
  mx: { exists: boolean; valid: boolean }
  recommendations: string[]
}

export const DeliverabilityDashboard: React.FC = () => {
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [dnsStatus, setDnsStatus] = useState<DNSStatus | null>(null)
  const [error, setError] = useState('')

  // Check DNS on mount with default domain
  useEffect(() => {
    const defaultDomain = typeof window !== 'undefined'
      ? window.location.hostname.replace('www.', '')
      : ''

    if (defaultDomain && defaultDomain !== 'localhost') {
      setDomain(defaultDomain)
      checkDNS(defaultDomain)
    }
  }, [])

  const checkDNS = async (domainToCheck?: string) => {
    const targetDomain = domainToCheck || domain
    if (!targetDomain) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/email-deliverability/dns-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: targetDomain }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'DNS check failed')
      }

      setDnsStatus(data.result)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green bg-green-50'
      case 'good': return 'text-teal bg-teal-50'
      case 'needs-improvement': return 'text-amber-600 bg-amber-50'
      case 'critical': return 'text-coral bg-coral-50'
      default: return 'text-grey-dark bg-grey-light'
    }
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
      {/* Header */}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        📧 Email Deliverability Dashboard
      </h2>

      {/* DNS Check Input */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
          Check DNS Records for Domain:
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <button
            onClick={() => checkDNS()}
            disabled={loading || !domain}
            style={{
              padding: '10px 24px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
            }}
          >
            {loading ? 'Checking...' : 'Check DNS'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px',
        }}>
          ❌ {error}
        </div>
      )}

      {/* DNS Status */}
      {dnsStatus && (
        <div>
          {/* Score Card */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                  Deliverability Score
                </div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#111827' }}>
                  {dnsStatus.score}/100
                </div>
              </div>
              <div className={getStatusColor(dnsStatus.overallStatus)} style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {dnsStatus.overallStatus.replace('-', ' ')}
              </div>
            </div>
          </div>

          {/* DNS Records Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {/* SPF */}
            <DNSRecordCard
              title="SPF"
              exists={dnsStatus.spf.exists}
              valid={dnsStatus.spf.valid}
              description="Sender Policy Framework"
            />

            {/* DKIM */}
            <DNSRecordCard
              title="DKIM"
              exists={dnsStatus.dkim.length > 0}
              valid={dnsStatus.dkim.some(d => d.valid)}
              description={`${dnsStatus.dkim.length} selector(s) found`}
            />

            {/* DMARC */}
            <DNSRecordCard
              title="DMARC"
              exists={dnsStatus.dmarc.exists}
              valid={dnsStatus.dmarc.valid}
              description={dnsStatus.dmarc.policy ? `Policy: ${dnsStatus.dmarc.policy}` : 'Email authentication'}
            />

            {/* MX */}
            <DNSRecordCard
              title="MX"
              exists={dnsStatus.mx.exists}
              valid={dnsStatus.mx.valid}
              description="Mail Exchange Records"
            />
          </div>

          {/* Recommendations */}
          {dnsStatus.recommendations.length > 0 && (
            <div style={{
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                📋 Recommendations
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {dnsStatus.recommendations.map((rec, i) => (
                  <li key={i} style={{
                    padding: '8px 0',
                    borderBottom: i < dnsStatus.recommendations.length - 1 ? '1px solid #e5e7eb' : 'none',
                    fontSize: '14px',
                  }}>
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Warmup Info */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          🔥 IP Warmup
        </h3>
        <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '8px' }}>
          New sending domain/IP detected. Follow the 14-day warmup schedule to build sender reputation.
        </p>
        <ul style={{ fontSize: '13px', color: '#1e3a8a', paddingLeft: '20px', margin: 0 }}>
          <li>Day 1-3: Send 50-200 emails/day</li>
          <li>Day 4-7: Gradually increase to 5,000/day</li>
          <li>Day 8-14: Scale up to 200,000/day</li>
        </ul>
      </div>
    </div>
  )
}

// DNS Record Card Component
const DNSRecordCard: React.FC<{
  title: string
  exists: boolean
  valid: boolean
  description: string
}> = ({ title, exists, valid, description }) => {
  const getIcon = () => {
    if (!exists) return '❌'
    if (valid) return '✅'
    return '⚠️'
  }

  const getColor = () => {
    if (!exists) return '#fee'
    if (valid) return '#efe'
    return '#fef3c7'
  }

  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: `2px solid ${getColor()}`,
    }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{getIcon()}</div>
      <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        {description}
      </div>
    </div>
  )
}
