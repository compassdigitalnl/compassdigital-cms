import type { LoyaltyReward } from '@/branches/ecommerce/templates/account/AccountTemplate1/LoyaltyTemplate/types'

export interface RewardsCatalogProps {
  rewards: LoyaltyReward[]
  availablePoints: number
  onRedeemReward: (rewardId: number, pointsCost: number) => void
}
