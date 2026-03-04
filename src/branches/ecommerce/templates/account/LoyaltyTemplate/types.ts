export interface LoyaltyTier {
  name: string
  icon: string
  color: string
  minPoints: number
  multiplier: number
  benefits: string[]
}

export interface LoyaltyNextTier {
  name: string
  icon: string
  requiredPoints: number
  pointsNeeded: number
}

export interface LoyaltyStats {
  totalOrders: number
  totalSpentMoney: number
  rewardsRedeemed: number
  referrals: number
}

export interface LoyaltyData {
  availablePoints: number
  totalEarned: number
  totalSpent: number
  tier: LoyaltyTier
  nextTier: LoyaltyNextTier
  referralCode: string
  referralUrl?: string
  referralPointsEarned?: number
  referralActiveUsers?: number
  stats: LoyaltyStats
}

export type TransactionType =
  | 'earned_purchase'
  | 'earned_review'
  | 'earned_referral'
  | 'earned_bonus'
  | 'spent_reward'

export interface LoyaltyTransaction {
  id: number
  type: TransactionType
  points: number
  description: string
  createdAt: string
}

export type RewardType = 'discount' | 'shipping' | 'event' | 'product' | 'upgrade'

export interface LoyaltyReward {
  id: number
  name: string
  icon: string
  description?: string
  type: RewardType
  pointsCost: number
  value?: number | null
  locked?: boolean
  lockReason?: string
}

export type EarnWayColor = 'teal' | 'purple' | 'blue' | 'green' | 'amber' | 'coral'

export interface EarnWay {
  id: string
  icon: string
  name: string
  description: string
  points: number | string
  bgColor: EarnWayColor
}

export interface LoyaltyTemplateProps {
  loyaltyData: LoyaltyData
  transactions: LoyaltyTransaction[]
  rewards: LoyaltyReward[]
  earnWays?: EarnWay[]
  onCopyReferralCode?: () => void
  onRedeemReward?: (rewardId: number, pointsCost: number) => void
}
