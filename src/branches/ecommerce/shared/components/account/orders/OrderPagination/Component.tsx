import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { OrderPaginationProps } from './types'

export function OrderPagination({ page, totalPages, hasNextPage, hasPrevPage, onPageChange }: OrderPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="btn btn-secondary flex items-center gap-1.5 lg:gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden lg:inline">Vorige</span>
      </button>

      <div className="text-sm text-gray-500">
        Pagina {page} van {totalPages}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="btn btn-secondary flex items-center gap-1.5 lg:gap-2"
      >
        <span className="hidden lg:inline">Volgende</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
