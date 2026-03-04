import React from 'react'
import { Building2, Save } from 'lucide-react'
import type { CompanyFormProps } from './types'

export function CompanyForm({ companyData, onUpdate, onSave, isSaving }: CompanyFormProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4 lg:mb-5">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
          <Building2 className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Bedrijfsgegevens</h2>
          <p className="text-xs lg:text-sm text-gray-500">Voor B2B-orders en facturatie</p>
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-900">Bedrijfsnaam</label>
          <input type="text" value={companyData.companyName} onChange={(e) => onUpdate({ companyName: e.target.value })} className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">KVK-nummer</label>
            <input type="text" value={companyData.kvk} onChange={(e) => onUpdate({ kvk: e.target.value })} className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">BTW-nummer</label>
            <input type="text" value={companyData.vat} onChange={(e) => onUpdate({ vat: e.target.value })} className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center justify-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 disabled:opacity-50 text-white w-full lg:w-auto"
        style={{ background: 'var(--color-primary)' }}
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
      </button>
    </div>
  )
}
