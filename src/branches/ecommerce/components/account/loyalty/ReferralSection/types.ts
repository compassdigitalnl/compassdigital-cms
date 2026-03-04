export interface ReferralSectionProps {
  referralCode: string
  referralUrl?: string
  referralCount?: number
  referralPointsEarned?: number
  referralActiveUsers?: number
  onCopyCode: () => void
  copied: boolean
}
