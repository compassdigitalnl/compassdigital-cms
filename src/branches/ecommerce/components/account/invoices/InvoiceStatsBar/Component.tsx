import React from 'react'
import { FileText, Euro } from 'lucide-react'
import type { InvoiceStatsBarProps } from './types'

export function InvoiceStatsBar({ stats }: InvoiceStatsBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Totaal facturen</div>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Betaald</div>
            <div className="text-2xl font-bold text-green-600">{stats.paidInvoices}</div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <Euro className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 mb-1">Openstaand</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingInvoices}</div>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
            <Euro className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
