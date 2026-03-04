import type { LoyaltyReward } from '@/branches/ecommerce/templates/account/LoyaltyTemplate/types'

export interface RewardsCatalogProps {
  rewards: LoyaltyReward[]
  availablePoints: number
  onRedeemReward: (rewardId: number, pointsCost: number) => void
}
