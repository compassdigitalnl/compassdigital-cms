'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

export interface FilterTab {
  id: string
  label: string
  icon?: keyof typeof LucideIcons
  count?: number
}

export interface SubscriptionFilterTabsProps {
  tabs: FilterTab[]
  activeId: string
  onChange: (tabId: string) => void
  showCounts?: boolean
  className?: string
}

export const SubscriptionFilterTabs: React.FC<SubscriptionFilterTabsProps> = ({
  tabs,
  activeId,
  onChange,
  showCounts = true,
  className = '',
}) => {
  return (
    <div className={`filter-tabs flex gap-2 flex-wrap ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        const Icon = tab.icon ? LucideIcons[tab.icon] as React.ComponentType<{ className?: string }> : null

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`filter-tab px-4 py-2.5 rounded-full border-[1.5px] text-[13px] font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white border-gray-200 text-gray-500 hover:border-teal-600 hover:text-teal-600'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {tab.label}
            {showCounts && tab.count !== undefined && (
              <span
                className={`filter-count text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/25' : 'bg-gray-100'
                }`}
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

export default SubscriptionFilterTabs
