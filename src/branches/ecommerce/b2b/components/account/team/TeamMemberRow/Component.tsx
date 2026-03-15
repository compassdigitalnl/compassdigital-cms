'use client'

import React, { useState } from 'react'
import { MoreVertical, Pencil, Trash2, Shield } from 'lucide-react'
import type { CompanyRole } from '../types'
import { RoleBadge } from '../RoleBadge'
import { RoleSelector } from '../RoleSelector'
import type { TeamMemberRowProps } from './types'

export function TeamMemberRow({
  member,
  currentUserRole,
  currentUserId,
  onChangeRole,
  onRemoveMember,
}: TeamMemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editingRole, setEditingRole] = useState(false)

  const isCurrentUser = member.id === currentUserId
  const canManage = (currentUserRole === 'admin' || currentUserRole === 'manager') && !isCurrentUser

  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const lastLoginText = member.lastLogin
    ? new Date(member.lastLogin).toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Nog niet ingelogd'

  return (
    <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl bg-grey-light hover:bg-grey-light transition-colors">
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '13px',
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-navy truncate">{member.name}</span>
          {isCurrentUser && (
            <span className="text-[10px] font-medium text-grey-mid bg-grey-light px-1.5 py-0.5 rounded">Jij</span>
          )}
        </div>
        <div className="text-xs text-grey-mid truncate">{member.email}</div>
      </div>

      {/* Role */}
      <div className="hidden sm:flex items-center gap-2">
        {editingRole ? (
          <RoleSelector
            value={member.companyRole}
            onChange={(role) => {
              onChangeRole(member.id, role)
              setEditingRole(false)
            }}
            onCancel={() => setEditingRole(false)}
          />
        ) : (
          <RoleBadge role={member.companyRole} />
        )}
      </div>

      {/* Last login */}
      <div className="hidden lg:block text-xs text-grey-mid w-28 text-right">{lastLoginText}</div>

      {/* Actions */}
      {canManage && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-grey-light transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-grey-mid" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-grey-light py-1.5 z-20 min-w-[180px]">
                <button
                  onClick={() => {
                    setEditingRole(true)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-grey-dark hover:bg-grey-light"
                >
                  <Shield className="w-4 h-4" />
                  Rol wijzigen
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Weet je zeker dat je ${member.name} wilt verwijderen uit het team?`)) {
                      onRemoveMember(member.id)
                    }
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-coral hover:bg-coral-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Verwijderen
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
