'use client'

import React, { useState } from 'react'
import styles from './AuthTabSwitcher.module.css'
import type { AuthTabSwitcherProps, AuthTab, AuthTabConfig } from './types'

const defaultTabs: AuthTabConfig[] = [
  { id: 'login', label: 'Inloggen' },
  { id: 'register', label: 'Registreren' },
  { id: 'guest', label: 'Gast bestellen' },
]

export const AuthTabSwitcher: React.FC<AuthTabSwitcherProps> = ({
  activeTab: controlledActiveTab,
  onTabChange,
  loginContent,
  registerContent,
  guestContent,
  className = '',
  tabs = defaultTabs,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<AuthTab>('login')

  // Support both controlled and uncontrolled mode
  const activeTab = controlledActiveTab ?? internalActiveTab

  const handleTabClick = (tab: AuthTab) => {
    if (!controlledActiveTab) {
      setInternalActiveTab(tab)
    }
    onTabChange?.(tab)
  }

  const contentMap: Record<AuthTab, React.ReactNode> = {
    login: loginContent,
    register: registerContent,
    guest: guestContent,
  }

  return (
    <>
      <div className={`${styles.authTabs} ${className}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.authTab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`${styles.formPanel} ${activeTab === tab.id ? styles.active : ''}`}
        >
          {contentMap[tab.id]}
        </div>
      ))}
    </>
  )
}

export default AuthTabSwitcher
