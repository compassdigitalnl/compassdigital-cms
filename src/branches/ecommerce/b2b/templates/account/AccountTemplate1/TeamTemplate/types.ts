import type { TeamMember, PendingInvite, CompanyInfo, CompanyRole } from '@/branches/ecommerce/b2b/components/account/team/types'

export interface TeamTemplateProps {
  company: CompanyInfo
  members: TeamMember[]
  invites: PendingInvite[]
  currentUserRole: CompanyRole
  currentUserId: number
  onChangeRole: (memberId: number, newRole: CompanyRole) => void
  onRemoveMember: (memberId: number) => void
  onInvite: (email: string, role: CompanyRole, message?: string) => Promise<void>
  onRevokeInvite: (inviteId: number) => void
  isInviting: boolean
}
