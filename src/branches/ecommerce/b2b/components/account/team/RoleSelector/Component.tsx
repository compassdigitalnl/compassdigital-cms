'use client'

import React from 'react'
import type { CompanyRole } from '../types'
import { ROLE_LABELS } from '../types'
import type { RoleSelectorProps } from './types'

const ALL_ROLES: CompanyRole[] = ['admin', 'manager', 'buyer', 'finance', 'viewer']

export function RoleSelector({ value, onChange, onCancel, excludeRoles = [] }: RoleSelectorProps) {
  const availableRoles = ALL_ROLES.filter((r) => !excludeRoles.includes(r))

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CompanyRole)}
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-gray-300"
      >
        {availableRoles.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      {onCancel && (
        <button onClick={onCancel} className="text-xs text-gray-400 hover:text-gray-600">
          Annuleren
        </button>
      )}
    </div>
  )
}
