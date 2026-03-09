import type { TeamMember, CompanyRole } from '../types'

export interface TeamMemberListProps {
  members: TeamMember[]
  currentUserRole: CompanyRole
  currentUserId: number
  onChangeRole: (memberId: number, newRole: CompanyRole) => void
  onRemoveMember: (memberId: number) => void
}
