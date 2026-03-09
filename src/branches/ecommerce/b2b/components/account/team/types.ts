export type CompanyRole = 'admin' | 'manager' | 'buyer' | 'finance' | 'viewer'

export interface TeamMember {
  id: number
  name: string
  email: string
  companyRole: CompanyRole
  lastLogin?: string
  status: 'active' | 'inactive' | 'blocked'
  monthlyBudgetLimit?: number
  avatar?: string
}

export interface PendingInvite {
  id: number
  email: string
  role: CompanyRole
  status: 'pending' | 'expired' | 'revoked'
  expiresAt: string
  invitedBy?: string
  createdAt: string
}

export interface CompanyInfo {
  id: number
  companyName: string
  kvkNumber?: string
  vatNumber?: string
  status: 'active' | 'inactive' | 'suspended'
  memberCount: number
}

export const ROLE_LABELS: Record<CompanyRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  buyer: 'Inkoper',
  finance: 'Financieel',
  viewer: 'Alleen-lezen',
}

export const ROLE_COLORS: Record<CompanyRole, { bg: string; text: string }> = {
  admin: { bg: 'var(--color-primary-glow)', text: 'var(--color-primary)' },
  manager: { bg: '#FFF3E0', text: '#E65100' },
  buyer: { bg: '#E8F5E9', text: '#2E7D32' },
  finance: { bg: '#E3F2FD', text: '#1565C0' },
  viewer: { bg: '#F5F5F5', text: '#616161' },
}
