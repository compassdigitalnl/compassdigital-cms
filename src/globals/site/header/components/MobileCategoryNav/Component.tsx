'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Package, Loader2 } from 'lucide-react'
import { cn } from '@/utilities/cn'
import { useCategoryNavigation } from '@/globals/site/header/components/hooks/useCategoryNavigation'
import type { MobileCategoryNavProps } from './types'

export function MobileCategoryNav({ onClose }: MobileCategoryNavProps) {
  const {
    rootCategories,
    loading,
    error,
    fetchRootCategories,
  } = useCategoryNavigation()

  const [expandedL1, setExpandedL1] = useState<string | null>(null)
  const [expandedL2, setExpandedL2] = useState<string | null>(null)
  const [l2Map, setL2Map] = useState<Record<string, any[]>>({})
  const [l3Map, setL3Map] = useState<Record<string, any[]>>({})
  const [l2Loading, setL2Loading] = useState<string | null>(null)
  const [l3Loading, setL3Loading] = useState<string | null>(null)

  useEffect(() => {
    if (rootCategories.length === 0 && !loading && !error) {
      fetchRootCategories()
    }
  }, [])

  const handleL1Toggle = async (catId: string) => {
    if (expandedL1 === catId) {
      setExpandedL1(null)
      return
    }
    setExpandedL1(catId)
    setExpandedL2(null)

    if (!l2Map[catId]) {
      setL2Loading(catId)
      try {
        const res = await fetch(
          `/api/product-categories?where[parent][equals]=${catId}&where[visible][equals]=true&sort=order&limit=20&depth=0`,
        )
        const data = await res.json()
        setL2Map((prev) => ({ ...prev, [catId]: data.docs || [] }))
      } catch {
        setL2Map((prev) => ({ ...prev, [catId]: [] }))
      } finally {
        setL2Loading(null)
      }
    }
  }

  const handleL2Toggle = async (catId: string) => {
    if (expandedL2 === catId) {
      setExpandedL2(null)
      return
    }
    setExpandedL2(catId)

    if (!l3Map[catId]) {
      setL3Loading(catId)
      try {
        const res = await fetch(
          `/api/product-categories?where[parent][equals]=${catId}&where[visible][equals]=true&sort=order&limit=20&depth=0`,
        )
        const data = await res.json()
        setL3Map((prev) => ({ ...prev, [catId]: data.docs || [] }))
      } catch {
        setL3Map((prev) => ({ ...prev, [catId]: [] }))
      } finally {
        setL3Loading(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="px-5 py-4 flex items-center gap-2 text-sm text-grey-mid">
        <Loader2 className="w-4 h-4 animate-spin" />
        Categorieën laden...
      </div>
    )
  }

  if (error || rootCategories.length === 0) return null

  return (
    <div className="border-b border-grey-light">
      <div className="px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-grey-mid">
        Categorieën
      </div>

      {rootCategories.map((cat) => {
        const isExpanded = expandedL1 === cat.id
        const l2Items = l2Map[cat.id] || []
        const isLoadingL2 = l2Loading === cat.id

        return (
          <div key={cat.id}>
            {/* L1 */}
            <button
              onClick={() => handleL1Toggle(cat.id)}
              className={cn(
                'flex items-center gap-3 w-full px-5 py-3 text-base font-semibold transition-colors text-left',
                isExpanded ? 'bg-grey-light' : 'hover:bg-grey-light',
              )}
              style={{ color: isExpanded ? 'var(--color-primary)' : 'var(--color-text-primary)' }}
            >
              <Package className="w-4 h-4 flex-shrink-0 text-grey-mid" />
              {cat.name}
              {isLoadingL2 ? (
                <Loader2 className="w-4 h-4 ml-auto animate-spin text-grey-mid" />
              ) : (
                <ChevronDown
                  className={cn(
                    'w-4 h-4 ml-auto text-grey-mid transition-transform',
                    isExpanded && 'rotate-180',
                  )}
                />
              )}
            </button>

            {/* L2 items */}
            {isExpanded && l2Items.length > 0 && (
              <div className="bg-grey-light">
                {/* View all link for L1 */}
                <Link
                  href={`/shop/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 pl-12 pr-5 py-2.5 text-sm font-bold transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Alle {cat.name?.toLowerCase()}
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </Link>

                {l2Items.map((l2: any) => {
                  const isL2Expanded = expandedL2 === l2.id
                  const l3Items = l3Map[l2.id] || []
                  const isLoadingL3 = l3Loading === l2.id

                  return (
                    <div key={l2.id}>
                      <button
                        onClick={() => handleL2Toggle(l2.id)}
                        className={cn(
                          'flex items-center gap-2 w-full pl-12 pr-5 py-2.5 text-sm font-medium transition-colors text-left',
                          isL2Expanded ? 'text-navy' : 'text-grey-dark hover:text-navy',
                        )}
                      >
                        {l2.name}
                        {isLoadingL3 ? (
                          <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin text-grey-mid" />
                        ) : (
                          <ChevronDown
                            className={cn(
                              'w-3.5 h-3.5 ml-auto text-grey-mid transition-transform',
                              isL2Expanded && 'rotate-180',
                            )}
                          />
                        )}
                      </button>

                      {/* L3 items */}
                      {isL2Expanded && l3Items.length > 0 && (
                        <div className="bg-grey-light/50">
                          {l3Items.map((l3: any) => (
                            <Link
                              key={l3.id}
                              href={`/shop/${l3.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-2 pl-16 pr-5 py-2 text-sm text-grey-mid hover:text-navy transition-colors"
                            >
                              <ChevronRight className="w-3 h-3 flex-shrink-0" />
                              {l3.name}
                            </Link>
                          ))}
                          <Link
                            href={`/shop/${l2.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2 pl-16 pr-5 py-2 text-sm font-bold transition-colors"
                            style={{ color: 'var(--color-primary)' }}
                          >
                            Alle {l2.name?.toLowerCase()}
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}

                      {/* Navigate to L2 if no L3 children and expanded */}
                      {isL2Expanded && l3Items.length === 0 && !isLoadingL3 && l3Map[l2.id] && (
                        <Link
                          href={`/shop/${l2.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2 pl-16 pr-5 py-2 text-sm font-medium transition-colors"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          Bekijk {l2.name?.toLowerCase()}
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* No L2 subcategories: direct link */}
            {isExpanded && l2Items.length === 0 && !isLoadingL2 && l2Map[cat.id] && (
              <Link
                href={`/shop/${cat.slug}`}
                onClick={onClose}
                className="flex items-center gap-2 pl-12 pr-5 py-2.5 text-sm font-bold bg-grey-light transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Bekijk alle producten
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
