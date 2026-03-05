'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import type { PasswordFormProps } from './types'

export function PasswordForm({ onChangePassword, isSaving }: PasswordFormProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleSubmit = () => {
    onChangePassword(passwordData)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const fields = [
    { key: 'currentPassword' as const, label: 'Huidig wachtwoord', showKey: 'current' as const },
    { key: 'newPassword' as const, label: 'Nieuw wachtwoord', showKey: 'new' as const },
    { key: 'confirmPassword' as const, label: 'Bevestig nieuw wachtwoord', showKey: 'confirm' as const },
  ]

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4 lg:mb-5">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
          <Lock className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Wachtwoord wijzigen</h2>
          <p className="text-xs lg:text-sm text-gray-500">Minimaal 8 tekens, mix van letters en cijfers aanbevolen</p>
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
        {fields.map(({ key, label, showKey }) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-2 text-gray-900">{label}</label>
            <div className="relative">
              <input
                type={showPassword[showKey] ? 'text' : 'password'}
                value={passwordData[key]}
                onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                className="w-full px-4 py-2.5 lg:py-3 pr-11 lg:pr-12 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, [showKey]: !showPassword[showKey] })}
                className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
        className="btn btn-primary flex items-center justify-center gap-2 w-full lg:w-auto"
      >
        <Lock className="w-4 h-4" />
        Wachtwoord wijzigen
      </button>
    </div>
  )
}
