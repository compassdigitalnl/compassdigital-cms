import type { ApprovalStatus } from '../types'

export interface ApprovalTabsProps {
  activeTab: ApprovalStatus | 'all'
  counts: Record<ApprovalStatus | 'all', number>
  onTabChange: (tab: ApprovalStatus | 'all') => void
}
