export interface ProofBadge {
  icon: string
  text: string
  highlight: string
}

export interface SocialProofBadgesProps {
  badges: ProofBadge[]
  className?: string
}
