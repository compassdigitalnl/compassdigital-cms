'use client'

import { useDocumentInfo } from '@payloadcms/ui'

export function FlowEditBanner() {
  const { id } = useDocumentInfo()

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #eff6ff, #f0fdf4)',
        border: '1px solid #bfdbfe',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <strong style={{ fontSize: '0.875rem', color: '#1e40af' }}>
          Visuele Flow Editor beschikbaar
        </strong>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
          Gebruik de drag-and-drop editor om stappen visueel te bouwen en te verbinden.
        </p>
      </div>
      {id && (
        <a
          href={`/flows/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#fff',
            background: '#1e40af',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Open Visuele Editor →
        </a>
      )}
    </div>
  )
}
