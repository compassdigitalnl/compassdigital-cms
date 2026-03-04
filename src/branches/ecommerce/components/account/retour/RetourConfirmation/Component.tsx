import React from 'react'
import { AlertCircle } from 'lucide-react'
import { returnReasons } from '../types'
import type { RetourConfirmationProps } from './types'

export function RetourConfirmation({ items, onSubmit, onPrev, submitting }: RetourConfirmationProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <h2 className="text-base lg:text-lg font-extrabold mb-4 text-gray-900">Bevestig retour</h2>
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <div className="text-sm font-bold text-gray-900">{item.title}</div>
              <div className="text-xs text-gray-500">
                {item.quantity}x - {returnReasons.find((r) => r.value === item.reason)?.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">
            Na bevestiging ontvang je een e-mail met retourinstructies en een retourlabel.
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <button onClick={onPrev} className="px-6 py-3 rounded-xl text-sm font-semibold bg-gray-50 text-gray-900">
          Vorige
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 bg-teal-700 text-white"
        >
          {submitting ? 'Verzenden...' : 'Retour bevestigen'}
        </button>
      </div>
    </div>
  )
}
