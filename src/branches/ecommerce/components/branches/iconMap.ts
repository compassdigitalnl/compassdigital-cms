import {
  Stethoscope, Tag, Truck, ClipboardList, Headphones,
  Building2, Syringe, Thermometer, Pill, Heart,
  Scissors, Baby, Activity, Home, Hospital,
  ShieldCheck, Package, Star, LayoutGrid, Sparkles,
  CreditCard, Users, Gift,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  Tag,
  Truck,
  ClipboardList,
  Headphones,
  Building2,
  Syringe,
  Thermometer,
  Pill,
  Heart,
  Scissors,
  Baby,
  Activity,
  Home,
  Hospital,
  ShieldCheck,
  Package,
  Star,
  LayoutGrid,
  Sparkles,
  CreditCard,
  Users,
  Gift,
}

export function resolveIcon(name: string): LucideIcon | undefined {
  return iconMap[name]
}

export default iconMap
