'use client'

import React from 'react'
import { Clock, XCircle, Mail } from 'lucide-react'
import type { CompanyRole } from '../types'
import { RoleBadge } from '../RoleBadge'
import type { PendingInvitesListProps } from './types'

export function PendingInvitesList({ invites, onRevoke, canManage }: PendingInvitesListProps) {
  const pendingInvites = invites.filter((i) => i.status === 'pending')

  if (pendingInvites.length === 0) return null

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-900">
          Openstaande uitnodigingen ({pendingInvites.length})
        </h3>
      </div>

      <div className="space-y-2">
        {pendingInvites.map((invite) => {
          const expiresDate = new Date(invite.expiresAt)
          const now = new Date()
          const daysLeft = Math.max(0, Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
          const isExpiringSoon = daysLeft <= 2

          return (
            <div
              key={invite.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100"
            >
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-amber-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{invite.email}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <RoleBadge role={invite.role as CompanyRole} size="sm" />
                  <span
                    className="text-xs"
                    style={{ color: isExpiringSoon ? 'var(--color-error)' : 'var(--color-grey-mid)' }}
                  >
                    {daysLeft === 0 ? 'Verloopt vandaag' : `Nog ${daysLeft} ${daysLeft === 1 ? 'dag' : 'dagen'}`}
                  </span>
                </div>
              </div>

              {canManage && (
                <button
                  onClick={() => onRevoke(invite.id)}
                  className="p-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  title="Uitnodiging intrekken"
                >
                  <XCircle className="w-4 h-4 text-amber-600" />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
