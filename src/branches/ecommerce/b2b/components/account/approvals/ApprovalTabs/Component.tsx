'use client'

import React from 'react'
import type { ApprovalStatus } from '../types'
import type { ApprovalTabsProps } from './types'

const TABS: { key: ApprovalStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Alles' },
  { key: 'pending', label: 'In afwachting' },
  { key: 'approved', label: 'Goedgekeurd' },
  { key: 'rejected', label: 'Afgewezen' },
]

export function ApprovalTabs({ activeTab, counts, onTabChange }: ApprovalTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
            style={{
              background: isActive ? 'var(--color-primary-glow)' : '#F5F7FA',
              color: isActive ? 'var(--color-primary)' : 'var(--color-grey-mid)',
              border: isActive ? '1.5px solid var(--color-primary)' : '1.5px solid transparent',
            }}
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className="inline-flex items-center justify-center rounded-full text-[10px] font-bold min-w-[18px] h-[18px] px-1"
                style={{
                  background: isActive ? 'var(--color-primary)' : 'var(--color-grey-mid)',
                  color: 'white',
                }}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
