'use client'

import { useState } from 'react'
import { Store, Package, Star, GraduationCap, Info } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  count?: number
}

interface VendorTabsProps {
  productCount: number
  reviewCount: number
  workshopCount: number
  activeTab?: string
  onTabChange?: (tabId: string) => void
}

export function VendorTabs({
  productCount,
  reviewCount,
  workshopCount,
  activeTab: controlledTab,
  onTabChange,
}: VendorTabsProps) {
  const [internalTab, setInternalTab] = useState('overview')
  const activeTab = controlledTab ?? internalTab

  const tabs: Tab[] = [
    { id: 'overview', label: 'Overzicht', icon: <Store className="w-4 h-4" /> },
    { id: 'products', label: 'Producten', icon: <Package className="w-4 h-4" />, count: productCount },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" />, count: reviewCount },
    { id: 'workshops', label: 'Workshops', icon: <GraduationCap className="w-4 h-4" />, count: workshopCount },
    { id: 'info', label: 'Info & contact', icon: <Info className="w-4 h-4" /> },
  ]

  const handleTabClick = (tabId: string) => {
    setInternalTab(tabId)
    onTabChange?.(tabId)

    // Scroll to section
    const el = document.getElementById(`vendor-${tabId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div
      className="flex gap-1 mb-7 overflow-x-auto pb-1 border-b"
      style={{ borderColor: 'var(--color-border)' }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px"
            style={{
              borderColor: isActive ? 'var(--color-primary)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.count != null && tab.count > 0 && (
              <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: isActive ? 'var(--color-primary-glow, rgba(0,137,123,0.12))' : 'var(--color-surface)',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
