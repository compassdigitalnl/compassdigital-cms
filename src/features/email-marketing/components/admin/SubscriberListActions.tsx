'use client'

import { useState } from 'react'
import { ImportWizard } from '../SubscriberImport/ImportWizard'
import { ExportButton } from '../SubscriberImport/ExportButton'

export function SubscriberListActions() {
  const [showImport, setShowImport] = useState(false)

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          padding: '1rem 0',
        }}
      >
        <button
          type="button"
          onClick={() => setShowImport(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#fff',
            background: '#0a1628',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v13" />
          </svg>
          Importeer CSV
        </button>
        <ExportButton />
      </div>

      {/* Import modal overlay */}
      {showImport && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImport(false)
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '640px',
              width: '90vw',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Subscribers importeren</h2>
              <button
                type="button"
                onClick={() => setShowImport(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <ImportWizard
              onComplete={() => {
                setTimeout(() => {
                  setShowImport(false)
                  window.location.reload()
                }, 2000)
              }}
              onCancel={() => setShowImport(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
