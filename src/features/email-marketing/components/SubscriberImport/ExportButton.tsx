'use client'

import { useState } from 'react'

interface ExportButtonProps {
  status?: string
  list?: string
  className?: string
}

export function ExportButton({ status, list, className = '' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      if (list) params.set('list', list)

      const res = await fetch(`/api/email-marketing/subscribers/export?${params}`, {
        credentials: 'include',
      })

      if (!res.ok) throw new Error('Export mislukt')

      // Download the CSV
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
      alert('Export mislukt. Probeer opnieuw.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border border-grey-light text-grey-dark hover:bg-grey-light disabled:opacity-50 transition-all ${className}`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {isExporting ? 'Exporteren...' : 'Exporteer CSV'}
    </button>
  )
}
