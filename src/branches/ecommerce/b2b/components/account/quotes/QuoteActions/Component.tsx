'use client'

import React, { useState } from 'react'
import { XCircle, Loader2 } from 'lucide-react'
import type { QuoteActionsProps } from './types'

export default function QuoteActions({ onReject, onCancel, rejecting }: QuoteActionsProps) {
  const [rejectReason, setRejectReason] = useState('')

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: 'var(--white)', border: '1px solid #FCA5A5', boxShadow: 'var(--sh-sm)' }}
    >
      <h3 className="text-base font-bold mb-3" style={{ color: 'var(--navy)' }}>
        Offerte afwijzen
      </h3>
      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        placeholder="Reden van afwijzing (optioneel)"
        rows={3}
        className="w-full rounded-lg border p-3 text-sm mb-4"
        style={{ borderColor: 'var(--grey)' }}
      />
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="btn btn-ghost btn-sm">
          Annuleren
        </button>
        <button
          onClick={() => onReject(rejectReason)}
          disabled={rejecting}
          className="btn btn-sm"
          style={{ background: '#DC2626', color: 'white' }}
        >
          {rejecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Bevestig afwijzing
        </button>
      </div>
    </div>
  )
}
