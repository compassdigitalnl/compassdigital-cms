'use client'

import React, { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { ApprovalActionBarProps } from './types'

export function ApprovalActionBar({ onApprove, onReject, isSubmitting }: ApprovalActionBarProps) {
  const [note, setNote] = useState('')
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)

  const handleSubmit = async (selectedAction: 'approve' | 'reject') => {
    setAction(selectedAction)
    if (selectedAction === 'approve') {
      await onApprove(note || undefined)
    } else {
      await onReject(note || undefined)
    }
  }

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm border-2" style={{ borderColor: 'var(--color-primary-glow)' }}>
      <h3 className="text-sm font-bold text-navy mb-3">Beoordeling</h3>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optionele opmerking bij je beoordeling..."
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-grey-light focus:border-grey-light resize-none mb-3"
      />

      <div className="flex gap-2">
        <button
          onClick={() => handleSubmit('approve')}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: 'var(--color-success)' }}
        >
          <Check className="w-4 h-4" />
          {isSubmitting && action === 'approve' ? 'Bezig...' : 'Goedkeuren'}
        </button>
        <button
          onClick={() => handleSubmit('reject')}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: 'var(--color-error)' }}
        >
          <X className="w-4 h-4" />
          {isSubmitting && action === 'reject' ? 'Bezig...' : 'Afwijzen'}
        </button>
      </div>
    </div>
  )
}
