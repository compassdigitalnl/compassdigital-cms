import type { PendingInvite } from '../types'

export interface PendingInvitesListProps {
  invites: PendingInvite[]
  onRevoke: (inviteId: number) => void
  canManage: boolean
}
