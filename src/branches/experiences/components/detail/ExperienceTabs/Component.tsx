'use client'

import type { ExperienceTabsProps } from './types'

export function ExperienceTabs({
  tabs,
  activeTab,
  onTabChange,
  children,
  className = '',
}: ExperienceTabsProps) {
  return (
    <div className={className}>
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'text-[var(--color-teal)]'
                  : 'text-gray-500 hover:text-[var(--color-navy)]'
              }`}
            >
              {/* Icon */}
              {tab.icon && <span className="text-base">{tab.icon}</span>}

              {/* Label */}
              <span>{tab.label}</span>

              {/* Count Badge */}
              {tab.count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-[var(--color-teal)] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-teal)]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="pt-4">{children}</div>
    </div>
  )
}
