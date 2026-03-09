'use client'

import React from 'react'
import {
  Truck, Zap, Package, Clock, CreditCard, Building2, Landmark,
  Banknote, Wallet, Receipt, HandCoins, CircleDollarSign,
  ShieldCheck, Globe, Mail, Phone, MapPin, Star, Heart,
  ShoppingCart, Store, Box, Send, ArrowRightLeft, BadgeCheck,
  type LucideIcon as LucideIconType,
} from 'lucide-react'

/**
 * Map of supported Lucide icon names to their components.
 * Used in CMS admin to let editors pick icons by name.
 */
const ICON_MAP: Record<string, LucideIconType> = {
  truck: Truck,
  zap: Zap,
  package: Package,
  clock: Clock,
  'credit-card': CreditCard,
  building: Building2,
  landmark: Landmark,
  banknote: Banknote,
  wallet: Wallet,
  receipt: Receipt,
  'hand-coins': HandCoins,
  'circle-dollar-sign': CircleDollarSign,
  'shield-check': ShieldCheck,
  globe: Globe,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  star: Star,
  heart: Heart,
  'shopping-cart': ShoppingCart,
  store: Store,
  box: Box,
  send: Send,
  'arrow-right-left': ArrowRightLeft,
  'badge-check': BadgeCheck,
}

export const AVAILABLE_ICONS = Object.keys(ICON_MAP)

interface LucideIconProps {
  name: string
  size?: number
  className?: string
  color?: string
}

export function LucideIcon({ name, size = 20, className = '', color }: LucideIconProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon size={size} className={className} color={color} />
}

export function getLucideIconComponent(name: string): LucideIconType | null {
  return ICON_MAP[name] || null
}
