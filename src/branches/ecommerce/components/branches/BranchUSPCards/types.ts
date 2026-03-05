export interface USPCard {
  icon: string
  iconColor: string
  iconBg: string
  title: string
  description: string
}

export interface BranchUSPCardsProps {
  cards: USPCard[]
  className?: string
}
