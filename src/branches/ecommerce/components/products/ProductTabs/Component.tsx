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
            {tab.badge != null && tab.badge !== 0 && <span className="tab-badge">{tab.badge}</span>}
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
                  {tab.badge != null && tab.badge !== 0 && <span className="tab-badge ml-2">{tab.badge}</span>}
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
      {/* ═══ STYLED-JSX — Design Spec pd03-product-tabs.html ═══ */}
      <style jsx>{`
        /* Tab Section Container */
        .tabs-section {
          margin-top: 32px;
          width: 100%;
        }

        /* Tab Navigation */
        .tabs-nav {
          display: flex;
          gap: 4px;
          border-bottom: 2px solid var(--color-border, #E8ECF1);
          padding-bottom: 0;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .tabs-nav::-webkit-scrollbar {
          display: none;
        }

        /* Tab Button */
        .tab-btn {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--font-heading, 'Plus Jakarta Sans', system-ui, sans-serif);
          color: var(--color-text-muted, #94A3B8);
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .tab-btn:hover {
          color: var(--color-text-primary, #0A1628);
        }
        .tab-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary, #00897B) 12%, transparent);
          border-radius: 8px 8px 0 0;
        }
        .tab-btn.active {
          color: var(--color-primary, #00897B);
          border-bottom-color: var(--color-primary, #00897B);
        }

        /* Tab Badge */
        .tab-badge {
          display: inline-block;
          background: var(--color-background, #F1F4F8);
          color: var(--color-text-muted, #94A3B8);
          font-size: 11px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 12px;
          margin-left: 4px;
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tab-btn.active .tab-badge {
          background: color-mix(in srgb, var(--color-primary, #00897B) 12%, transparent);
          color: var(--color-primary, #00897B);
        }

        /* Tab Content Panel */
        .tab-panel {
          padding: 20px 0;
          font-size: 14px;
          color: var(--color-text-primary, #0A1628);
          line-height: 1.7;
          display: none;
        }
        .tab-panel.active {
          display: block;
          animation: pdTabsFadeIn 0.3s ease-in-out;
        }

        @keyframes pdTabsFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Loading State */
        .tab-panel.loading {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tab-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-background, #F1F4F8);
          border-top-color: var(--color-primary, #00897B);
          border-radius: 50%;
          animation: pdTabsSpin 0.8s linear infinite;
        }
        @keyframes pdTabsSpin {
          to { transform: rotate(360deg); }
        }

        /* ── Accordion (Mobile) ── */
        .accordion-item {
          border: 1px solid var(--color-border, #E8ECF1);
          border-radius: 8px;
          margin-bottom: 8px;
          overflow: hidden;
        }
        .accordion-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: var(--color-surface, #FAFBFC);
          border: none;
          width: 100%;
          cursor: pointer;
          font-family: var(--font-heading, 'Plus Jakarta Sans', system-ui, sans-serif);
          font-size: 14px;
          font-weight: 700;
          color: var(--color-text-secondary, #64748B);
          transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .accordion-header:hover {
          background: var(--color-background, #F1F4F8);
        }
        .accordion-header.active {
          color: var(--color-primary, #00897B);
          background: color-mix(in srgb, var(--color-primary, #00897B) 12%, transparent);
        }

        /* Mobile accordion: hide tab nav, show accordions */
        @media (max-width: 767px) {
          .tabs-section.mobile-accordion .tabs-nav {
            display: none;
          }
          .tabs-section.mobile-accordion .tab-panel {
            padding: 0 16px 16px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
          }
          .tabs-section.mobile-accordion .tab-panel.active {
            max-height: 2000px;
          }
        }

        /* ── Variant: Pills ── */
        .tabs-section.pills .tabs-nav {
          border-bottom: none;
          gap: 8px;
        }
        .tabs-section.pills .tab-btn {
          padding: 8px 16px;
          background: var(--color-background, #F1F4F8);
          border: 1px solid var(--color-border, #E8ECF1);
          border-radius: 20px;
          margin-bottom: 0;
          font-size: 13px;
        }
        .tabs-section.pills .tab-btn:hover {
          background: var(--color-surface, #FAFBFC);
          border-color: var(--color-text-muted, #94A3B8);
        }
        .tabs-section.pills .tab-btn.active {
          background: var(--color-primary, #00897B);
          color: white;
          border-color: var(--color-primary, #00897B);
        }
        .tabs-section.pills .tab-badge {
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
        }

        /* ── Variant: Boxed ── */
        .tabs-section.boxed {
          background: var(--color-surface, #FAFBFC);
          border: 1px solid var(--color-border, #E8ECF1);
          border-radius: 12px;
          padding: 24px;
        }
        .tabs-section.boxed .tabs-nav {
          border-bottom: 1px solid var(--color-border, #E8ECF1);
          padding-bottom: 8px;
          margin-bottom: 0;
        }
        .tabs-section.boxed .tab-panel {
          padding: 20px;
          background: var(--color-background, #F1F4F8);
          border-radius: 8px;
          margin-top: 16px;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .tabs-section {
            margin-top: 24px;
          }
        }
        @media (max-width: 768px) {
          .tab-btn {
            padding: 8px 16px;
            font-size: 13px;
          }
          .tab-panel {
            padding: 16px 0;
            font-size: 13px;
          }
        }
        @media (max-width: 480px) {
          .tab-btn {
            padding: 8px 12px;
            font-size: 12px;
          }
          .tab-badge {
            font-size: 10px;
            padding: 1px 4px;
          }
        }
      `}</style>

      {/* Global styles for content inside tab panels (children from external components) */}
      <style jsx global>{`
        .tabs-section .tab-panel p {
          margin-bottom: 12px;
          color: var(--color-text-primary, #0A1628);
        }
        .tabs-section .tab-panel p:last-child {
          margin-bottom: 0;
        }
        .tabs-section .tab-panel .prose {
          --tw-prose-body: var(--color-text-primary, #0A1628);
        }
        .tabs-section .tab-panel h3 {
          font-family: var(--font-heading, 'Plus Jakarta Sans', system-ui, sans-serif);
          font-size: 18px;
          font-weight: 700;
          color: var(--color-text-primary, #0A1628);
          margin: 24px 0 12px 0;
        }
        .tabs-section .tab-panel h3:first-child {
          margin-top: 0;
        }
        .tabs-section .tab-panel ul {
          list-style: none;
          margin: 12px 0;
          padding-left: 0;
        }
        .tabs-section .tab-panel li {
          padding-left: 20px;
          margin-bottom: 8px;
          position: relative;
        }
        .tabs-section .tab-panel li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          background: var(--color-primary, #00897B);
          border-radius: 50%;
        }
        .tabs-section .accordion-icon {
          width: 20px;
          height: 20px;
          color: var(--color-text-muted, #94A3B8);
          transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tabs-section .accordion-header.active .accordion-icon {
          transform: rotate(180deg);
          color: var(--color-primary, #00897B);
        }
      `}</style>
    </div>
  )
}
