import React from 'react'
import { Search, Filter } from 'lucide-react'
import type { OrderSearchBarProps } from './types'

export function OrderSearchBar({ searchQuery, statusFilter, onSearch, onStatusFilter }: OrderSearchBarProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        <div className="relative">
          <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Zoek op bestelnummer..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-3.5 rounded-xl text-sm lg:text-base outline-none transition-all bg-gray-50 border border-gray-200 focus:border-gray-300"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="w-full pl-10 lg:pl-12 pr-10 py-3 lg:py-3.5 rounded-xl text-sm lg:text-base outline-none appearance-none cursor-pointer transition-all bg-gray-50 border border-gray-200"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
            }}
          >
            <option value="all">Alle statussen</option>
            <option value="pending">In afwachting</option>
            <option value="paid">Betaald</option>
            <option value="processing">In behandeling</option>
            <option value="shipped">Onderweg</option>
            <option value="delivered">Afgeleverd</option>
          </select>
        </div>
      </div>

      <div className="mt-3 lg:mt-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 lg:gap-0">
        <button
          onClick={() => {
            onSearch('')
            onStatusFilter('all')
          }}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--color-primary)' }}
        >
          Filters wissen
        </button>
      </div>
    </div>
  )
}
