import type { TeamMember, CompanyRole } from '../types'

export interface TeamMemberRowProps {
  member: TeamMember
  currentUserRole: CompanyRole
  currentUserId: number
  onChangeRole: (memberId: number, newRole: CompanyRole) => void
  onRemoveMember: (memberId: number) => void
}
