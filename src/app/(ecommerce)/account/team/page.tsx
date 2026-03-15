'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/tenant/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/shared/components/account/ui'
import TeamTemplate from '@/branches/ecommerce/b2b/templates/account/AccountTemplate1/TeamTemplate'
import type { TeamMember, PendingInvite, CompanyInfo, CompanyRole } from '@/branches/ecommerce/b2b/components/account/team/types'
import { toast } from '@/lib/toast'

export default function TeamPage() {
  if (!isFeatureEnabled('company_accounts')) notFound()

  const { user, isLoading: authLoading } = useAccountAuth()
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invites, setInvites] = useState<PendingInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInviting, setIsInviting] = useState(false)

  const fetchTeamData = useCallback(async () => {
    try {
      const res = await fetch('/api/account/team', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch team data')
      const data = await res.json()
      setCompany(data.company)
      setMembers(data.members)
      setInvites(data.invites)
    } catch (err) {
      console.error('Error fetching team data:', err)
      toast.error('Kon teamgegevens niet laden')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) fetchTeamData()
  }, [user, fetchTeamData])

  const handleChangeRole = async (memberId: number, newRole: CompanyRole) => {
    try {
      const res = await fetch(`/api/account/team/${memberId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyRole: newRole }),
      })
      if (!res.ok) throw new Error('Failed to update role')
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, companyRole: newRole } : m)),
      )
      toast.success('Rol bijgewerkt')
    } catch (err) {
      console.error('Error changing role:', err)
      toast.error('Kon rol niet wijzigen')
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      const res = await fetch(`/api/account/team/${memberId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to remove member')
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
      toast.success('Teamlid verwijderd')
    } catch (err) {
      console.error('Error removing member:', err)
      toast.error('Kon teamlid niet verwijderen')
    }
  }

  const handleInvite = async (email: string, role: CompanyRole, message?: string) => {
    setIsInviting(true)
    try {
      const res = await fetch('/api/account/team/invite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send invite')
      }
      toast.success('Uitnodiging verstuurd')
      await fetchTeamData()
    } finally {
      setIsInviting(false)
    }
  }

  const handleRevokeInvite = async (inviteId: number) => {
    try {
      const res = await fetch(`/api/account/team/invite?id=${inviteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to revoke invite')
      setInvites((prev) =>
        prev.map((i) => (i.id === inviteId ? { ...i, status: 'revoked' as const } : i)),
      )
      toast.success('Uitnodiging ingetrokken')
    } catch (err) {
      console.error('Error revoking invite:', err)
      toast.error('Kon uitnodiging niet intrekken')
    }
  }

  if (authLoading || isLoading || !user) return <AccountLoadingSkeleton variant="page" />
  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-grey-mid">Je bent niet gekoppeld aan een bedrijfsaccount.</p>
      </div>
    )
  }

  const currentUserRole = ((user as any).companyRole || 'viewer') as CompanyRole

  return (
    <TeamTemplate
      company={company}
      members={members}
      invites={invites}
      currentUserRole={currentUserRole}
      currentUserId={user.id as number}
      onChangeRole={handleChangeRole}
      onRemoveMember={handleRemoveMember}
      onInvite={handleInvite}
      onRevokeInvite={handleRevokeInvite}
      isInviting={isInviting}
    />
  )
}
