export type TrustSignalVariant = 'default' | 'compact' | 'horizontal' | 'card'

export interface TrustSignal {
  icon: string // Lucide icon name
  text: string
}

export interface TrustSignalsProps {
  // Signals
  signals?: TrustSignal[]

  // Display Options
  variant?: TrustSignalVariant // Default: 'default'

  // Styling
  className?: string
}

export interface TrustSignalItemProps {
  icon: string
  text: string
  variant: TrustSignalVariant
}
