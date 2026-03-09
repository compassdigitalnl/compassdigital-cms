'use client'

import React, { useState, useMemo } from 'react'
import {
  CompanyInfoCard,
  TeamMemberList,
  TeamSearchBar,
  InviteUserModal,
  PendingInvitesList,
} from '@/branches/ecommerce/b2b/components/account/team'
import type { TeamTemplateProps } from './types'

export default function TeamTemplate({
  company,
  members,
  invites,
  currentUserRole,
  currentUserId,
  onChangeRole,
  onRemoveMember,
  onInvite,
  onRevokeInvite,
  isInviting,
}: TeamTemplateProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const canInvite = currentUserRole === 'admin' || currentUserRole === 'manager'
  const canManage = canInvite

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return members
    const q = searchQuery.toLowerCase()
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    )
  }, [members, searchQuery])

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">Teambeheer</h1>
        <p className="text-sm lg:text-base text-gray-500">
          Beheer teamleden en uitnodigingen voor {company.companyName}
        </p>
      </div>

      {/* Company info */}
      <CompanyInfoCard company={company} />

      {/* Search + Invite button */}
      <TeamSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onInviteClick={() => setInviteModalOpen(true)}
        canInvite={canInvite}
      />

      {/* Pending invites */}
      <PendingInvitesList invites={invites} onRevoke={onRevokeInvite} canManage={canManage} />

      {/* Team members */}
      <TeamMemberList
        members={filteredMembers}
        currentUserRole={currentUserRole}
        currentUserId={currentUserId}
        onChangeRole={onChangeRole}
        onRemoveMember={onRemoveMember}
      />

      {/* Invite modal */}
      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={onInvite}
        isSubmitting={isInviting}
      />
    </div>
  )
}
