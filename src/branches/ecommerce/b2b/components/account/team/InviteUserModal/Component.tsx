'use client'

import React, { useState } from 'react'
import { X, UserPlus, Send } from 'lucide-react'
import type { CompanyRole } from '../types'
import { ROLE_LABELS } from '../types'
import type { InviteUserModalProps } from './types'

const INVITABLE_ROLES: CompanyRole[] = ['manager', 'buyer', 'finance', 'viewer']

export function InviteUserModal({ open, onClose, onInvite, isSubmitting }: InviteUserModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<CompanyRole>('buyer')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !email.includes('@')) {
      setError('Voer een geldig e-mailadres in')
      return
    }

    try {
      await onInvite(email, role, message || undefined)
      setEmail('')
      setRole('buyer')
      setMessage('')
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Er ging iets mis bij het versturen van de uitnodiging')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary-glow)' }}
            >
              <UserPlus className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Teamlid uitnodigen</h2>
              <p className="text-xs text-gray-500">Verstuur een uitnodiging per e-mail</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">E-mailadres</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collega@bedrijf.nl"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as CompanyRole)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
            >
              {INVITABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">
              Persoonlijk bericht <span className="font-normal text-gray-400">(optioneel)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hoi, ik nodig je uit om mee te bestellen..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300 resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Versturen...' : 'Uitnodiging versturen'}
          </button>
        </form>
      </div>
    </div>
  )
}
