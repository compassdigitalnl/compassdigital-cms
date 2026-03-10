export interface TickerItem {
  icon: string
  text: string
  highlight: string
}

export interface ActivityTickerProps {
  items: TickerItem[]
  className?: string
}
