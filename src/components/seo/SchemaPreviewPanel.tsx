'use client'

import React, { useState, useMemo } from 'react'
import { useFormFields } from '@payloadcms/ui'
import {
  buildLocalBusinessSchema,
  buildWebSiteSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildArticleSchema,
} from '@/lib/seo/schema-builders'

/**
 * Schema Preview Panel - Live JSON-LD preview in admin
 *
 * Shows editors what structured data will be generated
 * Helps validate schemas before publishing
 */
export function SchemaPreviewPanel() {
  const [selectedSchema, setSelectedSchema] = useState<string>('all')
  const [isExpanded, setIsExpanded] = useState(false)

  // Get form values
  const title = useFormFields(([fields]) => fields?.title?.value as string)
  const slug = useFormFields(([fields]) => fields?.slug?.value as string)
  const layout = useFormFields(([fields]) => fields?.layout?.value as any[])

  // Mock settings for preview (in reality, fetch from API)
  const mockSettings = {
    companyName: process.env.NEXT_PUBLIC_SITE_NAME || 'Your Company',
    companyEmail: 'info@company.com',
    companyPhone: '+31 20 123 4567',
    logo: { url: '/logo.png' },
    address: {
      streetAddress: 'Example Street 123',
      city: 'Amsterdam',
      postalCode: '1234 AB',
      country: 'NL',
    },
    geo: {
      latitude: 52.3676,
      longitude: 4.9041,
    },
    enableJSONLD: true,
  }

  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://example.com'

  // Generate schemas
  const schemas = useMemo(() => {
    const result: any = {}

    // LocalBusiness (always)
    result.localBusiness = buildLocalBusinessSchema(mockSettings as any, siteUrl)

    // WebSite (if homepage)
    if (slug === 'home') {
      result.webSite = buildWebSiteSchema(mockSettings as any, siteUrl)
    }

    // Breadcrumb (if not homepage)
    if (slug && slug !== 'home' && title) {
      result.breadcrumb = buildBreadcrumbSchema(
        {
          title,
          slug,
          id: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any,
        siteUrl
      )
    }

    // FAQ (if FAQ blocks present)
    if (layout && Array.isArray(layout)) {
      const faqBlocks = layout.filter(block => block.blockType === 'faq')
      if (faqBlocks.length > 0) {
        faqBlocks.forEach((block, idx) => {
          const faqSchema = buildFAQSchema(block)
          if (faqSchema) {
            result[`faq_${idx}`] = faqSchema
          }
        })
      }
    }

    return result
  }, [title, slug, layout, siteUrl])

  const schemaKeys = Object.keys(schemas)
  const hasSchemas = schemaKeys.length > 0

  // Display selected schema(s)
  const displaySchemas = useMemo(() => {
    if (selectedSchema === 'all') {
      return schemas
    }
    return { [selectedSchema]: schemas[selectedSchema] }
  }, [selectedSchema, schemas])

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '4px',
          }}
        >
          📊 JSON-LD Schema Preview
        </h3>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
          Live preview of structured data that will be generated
        </p>
      </div>

      {!hasSchemas && (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: '#9ca3af',
            backgroundColor: '#f9fafb',
            borderRadius: '6px',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ width: '48px', height: '48px', margin: '0 auto 12px' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
            />
          </svg>
          <p style={{ fontSize: '14px', margin: 0 }}>
            Add content to see schema preview
          </p>
        </div>
      )}

      {hasSchemas && (
        <>
          {/* Schema Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px',
              }}
            >
              Select Schema:
            </label>
            <select
              value={selectedSchema}
              onChange={(e) => setSelectedSchema(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="all">All Schemas ({schemaKeys.length})</option>
              {schemaKeys.map((key) => (
                <option key={key} value={key}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Schema Count */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              flexWrap: 'wrap',
            }}
          >
            {schemaKeys.map((key) => {
              const schemaType = schemas[key]['@type']
              const colors: Record<string, string> = {
                LocalBusiness: '#3b82f6',
                WebSite: '#8b5cf6',
                BreadcrumbList: '#6366f1',
                FAQPage: '#14b8a6',
                Article: '#f59e0b',
              }
              const color = colors[schemaType] || '#6b7280'

              return (
                <div
                  key={key}
                  style={{
                    padding: '4px 12px',
                    backgroundColor: `${color}15`,
                    border: `1px solid ${color}40`,
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    color,
                  }}
                >
                  {schemaType}
                </div>
              )
            })}
          </div>

          {/* Schema JSON */}
          <div
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '6px',
              padding: '16px',
              maxHeight: isExpanded ? 'none' : '300px',
              overflow: isExpanded ? 'visible' : 'auto',
              position: 'relative',
            }}
          >
            <pre
              style={{
                margin: 0,
                fontSize: '12px',
                lineHeight: '1.6',
                color: '#e5e7eb',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(displaySchemas, null, 2)}
            </pre>
          </div>

          {/* Expand/Collapse Button */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
            >
              Show Full Schema ↓
            </button>
          )}

          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e5e7eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
            >
              Collapse ↑
            </button>
          )}

          {/* Validation Button */}
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>
              💡 <strong>Tip:</strong> Validate your schemas with Google
            </div>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '6px 12px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6'
              }}
            >
              Test in Google Rich Results →
            </a>
          </div>
        </>
      )}
    </div>
  )
}
