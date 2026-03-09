import type { CompanyRole } from '../types'

export interface InviteUserModalProps {
  open: boolean
  onClose: () => void
  onInvite: (email: string, role: CompanyRole, message?: string) => Promise<void>
  isSubmitting: boolean
}
