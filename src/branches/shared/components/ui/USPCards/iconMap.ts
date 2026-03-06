import {
  Stethoscope, Tag, Truck, ClipboardList, Headphones,
  Building2, Syringe, Thermometer, Pill, Heart,
  Scissors, Baby, Activity, Home, Hospital,
  ShieldCheck, Package, Star, LayoutGrid, Sparkles,
  CreditCard, Users, Gift, BookOpen, Newspaper,
  Library, Bookmark, Rss, Calendar, Globe,
  Award, Eye, TrendingUp, Crown, Mail, Bell,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  // General
  Tag, Truck, ClipboardList, Headphones, Package, Star,
  LayoutGrid, Sparkles, CreditCard, Users, Gift,
  ShieldCheck, Eye, TrendingUp, Crown, Mail, Bell,
  Award, Calendar, Globe, Heart, Home, Activity,
  // Medical/Branch
  Stethoscope, Building2, Syringe, Thermometer, Pill,
  Scissors, Baby, Hospital,
  // Publishing/Magazine
  BookOpen, Newspaper, Library, Bookmark, Rss,
}

export function resolveIcon(name: string): LucideIcon | undefined {
  return iconMap[name]
}

export default iconMap
