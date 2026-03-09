export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type ApprovalReason = 'threshold' | 'budget' | 'manual'

export interface ApprovalItem {
  productId: number
  productName: string
  sku?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  image?: string
}

export interface ApprovalRequest {
  id: number
  orderReference: string
  requestedBy: {
    id: number
    name: string
    email: string
    companyRole?: string
  }
  approver?: {
    id: number
    name: string
  } | null
  status: ApprovalStatus
  totalAmount: number
  reason?: ApprovalReason
  items: ApprovalItem[]
  note?: string
  reviewNote?: string
  reviewedAt?: string
  expiresAt?: string
  createdAt: string
}

export interface ApprovalTimelineEvent {
  type: 'created' | 'approved' | 'rejected' | 'expired' | 'note'
  date: string
  user?: string
  message?: string
}

export const STATUS_CONFIG: Record<ApprovalStatus, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: 'In afwachting', bg: '#FFF3E0', text: '#E65100', icon: 'clock' },
  approved: { label: 'Goedgekeurd', bg: 'var(--color-success-light)', text: 'var(--color-success-dark)', icon: 'check' },
  rejected: { label: 'Afgewezen', bg: 'var(--color-error-light)', text: 'var(--color-error-dark)', icon: 'x' },
  expired: { label: 'Verlopen', bg: '#F5F5F5', text: '#616161', icon: 'clock' },
}

export const REASON_LABELS: Record<ApprovalReason, string> = {
  threshold: 'Boven goedkeuringsdrempel',
  budget: 'Boven budgetlimiet',
  manual: 'Handmatig aangevraagd',
}
