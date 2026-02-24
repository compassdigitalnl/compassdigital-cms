/**
 * AccountButton Component
 *
 * User account/login button
 * Shows different state for logged-in vs logged-out users
 */

'use client'

import React, { useState, useEffect } from 'react'
import { User, LogIn } from 'lucide-react'

export interface AccountButtonProps {
  showOnMobile?: boolean
  className?: string
}

export function AccountButton({ showOnMobile = false, className = '' }: AccountButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  // Check if user is logged in
  useEffect(() => {
    // Check localStorage or session for user auth
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user')
        if (user) {
          const userData = JSON.parse(user)
          setIsLoggedIn(true)
          setUserName(userData.name || null)
        }
      } catch (error) {
        console.error('Failed to parse user data:', error)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const handleAuthChange = (event: CustomEvent) => {
      setIsLoggedIn(event.detail?.isLoggedIn || false)
      setUserName(event.detail?.userName || null)
    }

    window.addEventListener('authChange', handleAuthChange as EventListener)
    return () => window.removeEventListener('authChange', handleAuthChange as EventListener)
  }, [])

  return (
    <a
      href={isLoggedIn ? '/account' : '/login'}
      className={`account-button ${!showOnMobile ? 'hide-mobile' : ''} ${className}`}
      aria-label={isLoggedIn ? 'My account' : 'Log in'}
    >
      <div className="account-icon-wrapper">
        {isLoggedIn ? (
          <>
            <User size={20} aria-hidden="true" />
            {userName && <span className="account-name">{userName}</span>}
          </>
        ) : (
          <>
            <LogIn size={20} aria-hidden="true" />
            <span className="login-text">Inloggen</span>
          </>
        )}
      </div>

      <style jsx>{`
        .account-button {
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
          padding: var(--space-2, 8px) var(--space-3, 12px);
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s ease;
        }

        .account-button:hover {
          background: var(--color-surface, #f5f5f5);
        }

        .account-icon-wrapper {
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
        }

        .account-name,
        .login-text {
          font-size: var(--font-size-sm, 13px);
          font-weight: 500;
          color: var(--color-text-primary, #0a1628);
        }

        /* Mobile: hide name/text, show only icon */
        @media (max-width: 767px) {
          .account-button.hide-mobile {
            display: none;
          }

          .account-name,
          .login-text {
            display: none;
          }

          .account-button {
            padding: var(--space-2, 8px);
          }
        }
      `}</style>
    </a>
  )
}
