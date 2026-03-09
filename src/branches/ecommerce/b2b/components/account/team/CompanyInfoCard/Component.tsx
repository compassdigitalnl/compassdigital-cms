'use client'

import React from 'react'
import { Building2, Hash, FileText } from 'lucide-react'
import type { CompanyInfoCardProps } from './types'

export function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    active: { bg: 'var(--color-success-light)', text: 'var(--color-success-dark)', label: 'Actief' },
    inactive: { bg: '#F5F5F5', text: '#616161', label: 'Inactief' },
    suspended: { bg: 'var(--color-warning-light)', text: 'var(--color-warning-dark)', label: 'Opgeschort' },
  }

  const status = statusColors[company.status] || statusColors.active

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-primary-glow)' }}
          >
            <Building2 className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">{company.companyName}</h2>
            <span className="text-xs text-gray-500">{company.memberCount} teamleden</span>
          </div>
        </div>
        <span
          className="inline-flex items-center font-semibold rounded-full text-xs"
          style={{ background: status.bg, color: status.text, padding: '4px 12px' }}
        >
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {company.kvkNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Hash className="w-4 h-4 text-gray-400" />
            <span>KvK: {company.kvkNumber}</span>
          </div>
        )}
        {company.vatNumber && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>BTW: {company.vatNumber}</span>
          </div>
        )}
      </div>
    </div>
  )
}
