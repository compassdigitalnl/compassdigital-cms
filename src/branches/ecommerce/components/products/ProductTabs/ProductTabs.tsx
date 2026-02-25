'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import type { ProductTabsProps } from './types'

export const ProductTabs: React.FC<ProductTabsProps> = ({
  tabs,
  defaultActiveTab,
  variant = 'default',
  enableMobileAccordion = true,
  enableKeyboardNav = true,
  className = '',
  onTabChange,
}) => {
  // State
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].id : ''),
  )
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set([activeTab]))
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const tabsNavRef = useRef<HTMLDivElement>(null)

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string) => {
      if (activeTab === tabId) return

      const tab = tabs.find((t) => t.id === tabId)
      if (!tab) return

      // Check if we need to lazy load
      if (tab.lazyLoad && !loadedTabs.has(tabId)) {
        setIsLoading(true)

        // Simulate async content loading
        setTimeout(() => {
          setLoadedTabs((prev) => new Set([...prev, tabId]))
          setIsLoading(false)
          setActiveTab(tabId)
          onTabChange?.(tabId)
        }, 300)
      } else {
        setActiveTab(tabId)
        onTabChange?.(tabId)
      }

      // Update URL hash (optional)
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#tab-${tabId}`)
      }
    },
    [activeTab, tabs, loadedTabs, onTabChange],
  )

  // Keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNav) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (!target.classList.contains('tab-btn')) return

      const currentIndex = tabs.findIndex((t) => t.id === activeTab)
      let nextIndex: number

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          nextIndex = (currentIndex + 1) % tabs.length
          handleTabChange(tabs[nextIndex].id)
          // Focus the new tab button
          setTimeout(() => {
            const newButton = tabsNavRef.current?.querySelector(
              `[data-tab-id="${tabs[nextIndex].id}"]`,
            ) as HTMLElement
            newButton?.focus()
          }, 0)
          break

        case 'ArrowLeft':
          e.preventDefault()
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
          handleTabChange(tabs[nextIndex].id)
          setTimeout(() => {
            const newButton = tabsNavRef.current?.querySelector(
              `[data-tab-id="${tabs[nextIndex].id}"]`,
            ) as HTMLElement
            newButton?.focus()
          }, 0)
          break

        case 'Home':
          e.preventDefault()
          handleTabChange(tabs[0].id)
          setTimeout(() => {
            const firstButton = tabsNavRef.current?.querySelector(
              `[data-tab-id="${tabs[0].id}"]`,
            ) as HTMLElement
            firstButton?.focus()
          }, 0)
          break

        case 'End':
          e.preventDefault()
          handleTabChange(tabs[tabs.length - 1].id)
          setTimeout(() => {
            const lastButton = tabsNavRef.current?.querySelector(
              `[data-tab-id="${tabs[tabs.length - 1].id}"]`,
            ) as HTMLElement
            lastButton?.focus()
          }, 0)
          break

        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, tabs, enableKeyboardNav, handleTabChange])

  // Get variant classes
  const getVariantClass = (): string => {
    switch (variant) {
      case 'pills':
        return 'pills'
      case 'boxed':
        return 'boxed'
      default:
        return ''
    }
  }

  // Render loading state
  const renderLoadingState = () => (
    <div className="tab-spinner" aria-label="Laden...">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-theme-grey-light border-t-theme-teal"></div>
    </div>
  )

  return (
    <div
      className={`tabs-section ${getVariantClass()} ${enableMobileAccordion ? 'mobile-accordion' : ''} ${className}`}
    >
      {/* Tab Navigation (Desktop) */}
      <div ref={tabsNavRef} className="tabs-nav" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* Tab Panels (Desktop) or Accordion Items (Mobile) */}
      {enableMobileAccordion
        ? // Mobile Accordion Mode
          tabs.map((tab) => (
            <div key={tab.id} className="accordion-item md:hidden">
              <button
                className={`accordion-header ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span>
                  {tab.label}
                  {tab.badge && <span className="tab-badge ml-2">{tab.badge}</span>}
                </span>
                <ChevronDown className="accordion-icon h-5 w-5" />
              </button>
              <div
                className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
                role="tabpanel"
                id={`panel-${tab.id}`}
                aria-labelledby={`tab-${tab.id}`}
              >
                {isLoading && activeTab === tab.id ? (
                  <div className="flex min-h-[200px] items-center justify-center">
                    {renderLoadingState()}
                  </div>
                ) : (
                  activeTab === tab.id && (loadedTabs.has(tab.id) || !tab.lazyLoad) && tab.content
                )}
              </div>
            </div>
          ))
        : null}

      {/* Desktop Tab Panels (always rendered if mobile accordion disabled) */}
      <div className={enableMobileAccordion ? 'hidden md:block' : ''}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-panel ${activeTab === tab.id ? 'active' : ''}`}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
          >
            {isLoading && activeTab === tab.id ? (
              <div className="flex min-h-[200px] items-center justify-center">
                {renderLoadingState()}
              </div>
            ) : (
              activeTab === tab.id && (loadedTabs.has(tab.id) || !tab.lazyLoad) && tab.content
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
