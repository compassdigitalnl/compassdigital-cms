'use client'

import React from 'react'
import { Users } from 'lucide-react'
import { TeamMemberRow } from '../TeamMemberRow'
import type { TeamMemberListProps } from './types'

export function TeamMemberList({
  members,
  currentUserRole,
  currentUserId,
  onChangeRole,
  onRemoveMember,
}: TeamMemberListProps) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-xl lg:rounded-2xl p-8 lg:p-12 shadow-sm text-center">
        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">Geen teamleden gevonden</p>
        <p className="text-xs text-gray-400 mt-1">Nodig collega&apos;s uit om samen te werken</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">
          Teamleden ({members.length})
        </h3>
        <div className="hidden lg:flex items-center gap-6 text-xs text-gray-400">
          <span className="w-28 text-right">Laatste login</span>
          <span className="w-8" />
        </div>
      </div>
      <div className="space-y-2">
        {members.map((member) => (
          <TeamMemberRow
            key={member.id}
            member={member}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
            onChangeRole={onChangeRole}
            onRemoveMember={onRemoveMember}
          />
        ))}
      </div>
    </div>
  )
}
