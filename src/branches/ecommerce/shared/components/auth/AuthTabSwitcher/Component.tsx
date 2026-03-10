'use client'

/**
 * AuthTabSwitcher - Tab navigation for auth pages (Login/Register/Guest)
 *
 * Features:
 * - 3 tabs: Login, Register, Guest Checkout
 * - Active state: Navy bg (#0A1628) + white text
 * - Smooth transitions (0.25s ease)
 * - Keyboard navigation (arrow keys)
 * - Accessibility (ARIA roles, labels)
 * - Responsive (stacks on very small screens <400px)
 *
 * @component
 * @example
 * <AuthTabSwitcher
 *   activeTab="login"
 *   onChange={(tab) => setActiveTab(tab)}
 * />
 *
 * @example
 * <AuthTabSwitcher
 *   activeTab="register"
 *   onChange={handleTabChange}
 *   tabs={[
 *     { id: 'login', label: 'Sign In' },
 *     { id: 'register', label: 'Sign Up' }
 *   ]}
 * />
 */

import type { TabId, Tab, AuthTabSwitcherProps } from './types'
export type { TabId, Tab, AuthTabSwitcherProps } from './types'

const defaultTabs: Tab[] = [
  { id: 'login', label: 'Inloggen' },
  { id: 'register', label: 'Registreren' },
  { id: 'guest', label: 'Gast bestellen' },
]

export function AuthTabSwitcher({
  activeTab,
  onChange,
  tabs = defaultTabs,
  className = '',
}: AuthTabSwitcherProps) {
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let newIndex = currentIndex

    if (e.key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
      e.preventDefault()
    } else if (e.key === 'ArrowRight') {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
      e.preventDefault()
    } else if (e.key === 'Home') {
      newIndex = 0
      e.preventDefault()
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1
      e.preventDefault()
    }

    if (newIndex !== currentIndex) {
      onChange(tabs[newIndex].id)
      // Focus the new tab
      setTimeout(() => {
        const button = document.querySelector(
          `[data-tab-id="${tabs[newIndex].id}"]`,
        ) as HTMLButtonElement
        button?.focus()
      }, 0)
    }
  }

  return (
    <div
      className={`flex gap-1 p-1 rounded-xl mb-8 ${className}`}
      role="tablist"
      aria-label="Authentication options"
      style={{
        background: 'var(--color-background)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 1px 3px rgba(10,22,40,0.06)',
      }}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`
              flex-1 px-4 py-3 text-sm font-semibold rounded-lg
              transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isActive
                  ? 'text-white shadow-md'
                  : 'text-[var(--color-text-secondary,#94A3B8)] hover:bg-[var(--color-background-secondary,#F8FAFC)]'
              }
            `}
            style={{
              background: isActive ? 'var(--color-primary)' : 'transparent',
              boxShadow: isActive ? '0 2px 8px rgba(10,38,71,0.2)' : 'none',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
