export interface ApprovalActionBarProps {
  onApprove: (note?: string) => Promise<void>
  onReject: (note?: string) => Promise<void>
  isSubmitting: boolean
}
