'use client'

import React, { useMemo } from 'react'
import { analyzeSEO, type SEOAnalysisResult } from '@/lib/seo/seo-analyzer'
import { useFormFields } from '@payloadcms/ui'

/**
 * SEO Score Panel - Real-time SEO feedback in admin
 *
 * Analyzes content and shows Yoast-like SEO score + recommendations
 */
export function SEOScorePanel() {
  // Get form field values from Payload's form context
  const title = useFormFields(([fields]) => fields?.title?.value as string)
  const slug = useFormFields(([fields]) => fields?.slug?.value as string)
  const metaDescription = useFormFields(([fields]) => fields?.meta?.description?.value as string)
  const focusKeyword = useFormFields(([fields]) => fields?.meta?.focusKeyword?.value as string)
  const layout = useFormFields(([fields]) => fields?.layout?.value as any[])

  // Find content block for text analysis
  const contentBlock = useMemo(() => {
    if (!layout || !Array.isArray(layout)) return null

    // Look for content-rich blocks (content, richText, hero with content)
    return layout.find(
      block =>
        block.blockType === 'content' ||
        block.blockType === 'richText' ||
        (block.blockType === 'hero' && block.content)
    )
  }, [layout])

  // Analyze SEO
  const analysis: SEOAnalysisResult = useMemo(() => {
    return analyzeSEO({
      title: title || '',
      metaDescription: metaDescription || '',
      slug: slug || '',
      content: contentBlock?.content || contentBlock?.richText || null,
      focusKeyword: focusKeyword || '',
      blocks: layout || []
    })
  }, [title, metaDescription, slug, focusKeyword, contentBlock, layout])

  // Score color
  const scoreColor =
    analysis.status === 'excellent'
      ? '#22c55e' // green-500
      : analysis.status === 'good'
        ? '#f59e0b' // amber-500
        : '#ef4444' // red-500

  const scoreLabel =
    analysis.status === 'excellent' ? 'Excellent' : analysis.status === 'good' ? 'Good' : 'Needs Work'

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px'
          }}
        >
          SEO Analysis
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
          Real-time SEO score and recommendations
        </p>
      </div>

      {/* Score Gauge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px'
        }}
      >
        {/* Circular Score */}
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={`${(analysis.score / 100) * 201} 201`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '24px',
              fontWeight: '700',
              color: scoreColor
            }}
          >
            {analysis.score}
          </div>
        </div>

        {/* Score Label */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: scoreColor,
              marginBottom: '4px'
            }}
          >
            {scoreLabel}
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            {analysis.score < 50 && 'Critical SEO issues found'}
            {analysis.score >= 50 && analysis.score < 80 && 'Some improvements recommended'}
            {analysis.score >= 80 && 'Well optimized for search engines'}
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}
        >
          SEO Checks ({analysis.checks.filter(c => c.status === 'pass').length}/
          {analysis.checks.length} passed)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {analysis.checks.map(check => {
            const statusIcon =
              check.status === 'pass' ? '✅' : check.status === 'warning' ? '⚠️' : '❌'
            const statusColor =
              check.status === 'pass'
                ? '#22c55e'
                : check.status === 'warning'
                  ? '#f59e0b'
                  : '#ef4444'

            return (
              <div
                key={check.id}
                style={{
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  border: `1px solid ${check.status === 'pass' ? '#d1fae5' : check.status === 'warning' ? '#fed7aa' : '#fee2e2'}`,
                  borderRadius: '6px',
                  fontSize: '13px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{statusIcon}</span>
                    <span style={{ fontWeight: '500', color: '#111827' }}>
                      {check.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {check.score}/{check.maxScore} pts
                  </span>
                </div>
                <div
                  style={{
                    color: '#6b7280',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {check.message}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px'
          }}
        >
          <div
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e40af',
              marginBottom: '8px'
            }}
          >
            💡 Top Recommendations
          </div>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#1e3a8a' }}>
            {analysis.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#9ca3af',
          display: 'flex',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ color: '#22c55e' }}>●</span> Excellent (80-100)
        </div>
        <div>
          <span style={{ color: '#f59e0b' }}>●</span> Good (50-79)
        </div>
        <div>
          <span style={{ color: '#ef4444' }}>●</span> Poor (0-49)
        </div>
      </div>
    </div>
  )
}
