import React from 'react'
import { Trash2 } from 'lucide-react'
import type { DangerZoneProps } from './types'

export function DangerZone({ onDeleteAccount }: DangerZoneProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-red-500">
      <div className="flex items-center gap-3 mb-4 lg:mb-5">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center bg-red-50">
          <Trash2 className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-red-600">Account verwijderen</h2>
          <p className="text-xs lg:text-sm text-gray-500">Deze actie kan niet ongedaan worden gemaakt</p>
        </div>
      </div>

      <div className="p-3 lg:p-4 rounded-lg lg:rounded-xl mb-3 lg:mb-4 bg-red-50 border border-red-200">
        <p className="text-xs lg:text-sm text-gray-900 leading-relaxed">
          Door je account te verwijderen worden al je gegevens permanent verwijderd.
        </p>
      </div>

      <button
        onClick={onDeleteAccount}
        className="btn btn-danger flex items-center justify-center gap-2 w-full lg:w-auto"
      >
        <Trash2 className="w-4 h-4" />
        Account permanent verwijderen
      </button>
    </div>
  )
}
