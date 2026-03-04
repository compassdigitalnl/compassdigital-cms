import React from 'react'
import { User, Mail, Phone, Save } from 'lucide-react'
import type { ProfileFormProps } from './types'

export function ProfileForm({ profileData, onUpdate, onSave, isSaving }: ProfileFormProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4 lg:mb-5">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center" style={{ background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
          <User className="w-5 h-5 lg:w-6 lg:h-6" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-gray-900">Persoonlijke gegevens</h2>
          <p className="text-xs lg:text-sm text-gray-500">Werk je profiel en contactgegevens bij</p>
        </div>
      </div>

      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Voornaam</label>
            <input type="text" value={profileData.firstName} onChange={(e) => onUpdate({ firstName: e.target.value })} className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Achternaam</label>
            <input type="text" value={profileData.lastName} onChange={(e) => onUpdate({ lastName: e.target.value })} className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">E-mailadres</label>
            <div className="relative">
              <Mail className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" value={profileData.email} readOnly className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 bg-gray-50 text-gray-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Telefoonnummer</label>
            <div className="relative">
              <Phone className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" value={profileData.phone} onChange={(e) => onUpdate({ phone: e.target.value })} className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300" />
            </div>
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
