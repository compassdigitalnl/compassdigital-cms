'use client'

import React, { useState } from 'react'
import { ChevronDown, Copy, Check } from 'lucide-react'
import type { ProductSpecsTableProps, SpecGroup } from './types'

export const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({
  groups,
  variant = 'default',
  enableCollapse = true,
  className = '',
  onCopy,
}) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(
    new Set(groups.map((g, i) => (g.defaultCollapsed ? i : -1)).filter((i) => i >= 0)),
  )
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  // Toggle group collapse
  const toggleGroup = (index: number) => {
    if (!enableCollapse) return

    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Copy value to clipboard
  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)
      onCopy?.(value)

      // Reset after 2 seconds
      setTimeout(() => setCopiedValue(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Get variant classes
  const getVariantClass = (): string => {
    switch (variant) {
      case 'compact':
        return 'compact'
      case 'simple':
        return 'simple'
      default:
        return ''
    }
  }

  return (
    <div className={`specs-table-wrapper ${getVariantClass()} ${className}`}>
      {groups.map((group, groupIndex) => {
        const isCollapsed = collapsedGroups.has(groupIndex)

        return (
          <div
            key={groupIndex}
            className={`specs-group ${isCollapsed ? 'collapsed' : ''}`}
          >
            {/* Group Header */}
            {variant !== 'simple' && (
              <div
                className={`specs-group-header ${isCollapsed ? 'collapsed' : ''}`}
                onClick={() => toggleGroup(groupIndex)}
                role={enableCollapse ? 'button' : undefined}
                aria-expanded={!isCollapsed}
              >
                <div className="specs-group-title">
                  {group.icon && <span className="specs-group-icon">{group.icon}</span>}
                  <span>{group.title}</span>
                </div>
                {enableCollapse && (
                  <ChevronDown className="specs-group-toggle h-5 w-5" />
                )}
              </div>
            )}

            {/* Specs Table */}
            {!isCollapsed && (
              <div className="specs-table">
                {group.specs.map((spec, specIndex) => (
                  <div
                    key={specIndex}
                    className={`specs-row ${spec.highlight ? 'highlight' : ''}`}
                  >
                    {/* Label */}
                    <div className="specs-label">
                      {spec.icon && <span className="specs-label-icon">{spec.icon}</span>}
                      <span>{spec.label}</span>
                    </div>

                    {/* Value */}
                    <div className={`specs-value ${spec.mono ? 'mono' : ''}`}>
                      <span>{spec.value}</span>

                      {/* Copy Button */}
                      {spec.copyable && typeof spec.value === 'string' && (
                        <button
                          className={`specs-copy-btn ${copiedValue === spec.value ? 'copied' : ''}`}
                          onClick={() => handleCopy(spec.value as string)}
                          aria-label="Kopiëren naar klembord"
                        >
                          {copiedValue === spec.value ? (
                            <>
                              <Check className="specs-copy-icon h-3 w-3" />
                              Gekopieerd
                            </>
                          ) : (
                            <>
                              <Copy className="specs-copy-icon h-3 w-3" />
                              Kopiëren
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
