import React from 'react'
import { returnReasons } from '../types'
import type { RetourReasonFormProps } from './types'

export function RetourReasonForm({ items, onSetReason, onNext, onPrev }: RetourReasonFormProps) {
  const allHaveReason = items.every((item) => item.reason)

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <h2 className="text-base lg:text-lg font-extrabold mb-4 text-navy">
        Reden van retour
      </h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-grey-light">
            <div className="text-sm font-bold text-navy mb-3">{item.title} ({item.quantity}x)</div>
            <select
              value={item.reason || ''}
              onChange={(e) => onSetReason(item.id, e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-grey-light bg-grey-light"
            >
              <option value="">Selecteer een reden...</option>
              {returnReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>{reason.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={onPrev} className="btn btn-outline-neutral">
          Vorige
        </button>
        <button
          onClick={onNext}
          disabled={!allHaveReason}
          className="btn btn-primary"
        >
          Volgende
        </button>
      </div>
    </div>
  )
}
