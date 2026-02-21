import { Flame, Sparkles, Clock, Layers, Leaf, Percent, Crown, Building2, LucideIcon } from 'lucide-react'

export type BadgeType = 'bestseller' | 'new' | 'out-of-stock' | 'bulk-discount' | 'eco' | 'sale' | 'exclusive' | 'b2b'

interface BadgeConfig {
  icon: LucideIcon
  label: string
  className: string
}

const badgeConfigs: Record<BadgeType, BadgeConfig> = {
  bestseller: {
    icon: Flame,
    label: 'Bestseller',
    className: 'bg-amber-100 text-amber-700',
  },
  new: {
    icon: Sparkles,
    label: 'Nieuw',
    className: 'bg-blue-100 text-blue-700',
  },
  'out-of-stock': {
    icon: Clock,
    label: 'Uitverkocht',
    className: 'bg-red-100 text-red-700',
  },
  'bulk-discount': {
    icon: Layers,
    label: 'Staffelkorting',
    className: 'bg-green-100 text-green-700',
  },
  eco: {
    icon: Leaf,
    label: 'Duurzaam',
    className: 'bg-emerald-100 text-emerald-800',
  },
  sale: {
    icon: Percent,
    label: '-15%',
    className: 'bg-red-100 text-red-700',
  },
  exclusive: {
    icon: Crown,
    label: 'Exclusief',
    className: 'bg-gradient-to-r from-navy-900 to-navy-800 text-white',
  },
  b2b: {
    icon: Building2,
    label: 'Alleen B2B',
    className: 'bg-teal-50 text-teal-700',
  },
}

export interface ProductBadgeProps {
  type: BadgeType
  customLabel?: string
}

export function ProductBadge({ type, customLabel }: ProductBadgeProps) {
  const config = badgeConfigs[type]
  const Icon = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {customLabel || config.label}
    </span>
  )
}

export function CornerBadge({ type, customLabel }: ProductBadgeProps) {
  const config = badgeConfigs[type]

  return (
    <div
      className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white ${config.className} z-10`}
    >
      {customLabel || config.label}
    </div>
  )
}

export function RibbonBadge({ type, customLabel }: ProductBadgeProps) {
  const config = badgeConfigs[type]

  return (
    <div
      className={`absolute top-3 left-0 px-2.5 py-1 rounded-r text-[10px] font-bold text-white ${config.className} shadow-md z-10`}
    >
      {customLabel || config.label}
    </div>
  )
}
