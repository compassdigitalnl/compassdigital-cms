'use client'

import React from 'react'
import { Search, UserPlus } from 'lucide-react'
import type { TeamSearchBarProps } from './types'

export function TeamSearchBar({ searchQuery, onSearchChange, onInviteClick, canInvite }: TeamSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Zoek op naam of e-mail..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
        />
      </div>
      {canInvite && (
        <button
          onClick={onInviteClick}
          className="btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          Uitnodigen
        </button>
      )}
    </div>
  )
}
