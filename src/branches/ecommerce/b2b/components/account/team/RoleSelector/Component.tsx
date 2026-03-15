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
        className="text-sm border border-grey-light rounded-lg px-3 py-1.5 outline-none focus:border-grey-light"
      >
        {availableRoles.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
      {onCancel && (
        <button onClick={onCancel} className="text-xs text-grey-mid hover:text-grey-dark">
          Annuleren
        </button>
      )}
    </div>
  )
}
