export interface USPCard {
  icon: string
  iconColor: string
  iconBg: string
  title: string
  description: string
}

export interface USPCardsProps {
  cards: USPCard[]
  className?: string
}
