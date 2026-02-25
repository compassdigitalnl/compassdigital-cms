'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Shield, BarChart2, Megaphone } from 'lucide-react'
import { CookieBannerProps, CookiePreferences, CookieCategory } from './types'
import { CookiePreferencesModal } from './CookiePreferences'

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    name: 'Essentieel',
    description: 'Noodzakelijk voor de basisfunctionaliteit van de website. Deze cookies kunnen niet worden uitgeschakeld.',
    icon: 'shield',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analytisch',
    description: 'Helpen ons te begrijpen hoe bezoekers de website gebruiken, zodat we de ervaring kunnen verbeteren.',
    icon: 'bar-chart-2',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Gebruikt voor gerichte advertenties en het meten van de effectiviteit van marketingcampagnes.',
    icon: 'megaphone',
    required: false,
  },
]

export function CookieBanner({
  privacyPolicyUrl = '/privacy',
  onAcceptAll,
  onSavePreferences,
  onEssentialOnly,
  storageKey = 'cookie_consent',
  expiryDays = 365,
}: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  // Generate unique session ID
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem('session_id')
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('session_id', sessionId)
    }
    return sessionId
  }, [])

  // Save consent to database
  const saveConsentToDatabase = useCallback(async (preferences: CookiePreferences) => {
    try {
      await fetch('/api/cookie-consents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: getSessionId(),
          necessary: preferences.essential,
          analytics: preferences.analytics,
          marketing: preferences.marketing,
          consentedAt: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Failed to save cookie consent:', error)
      // Non-critical, continue anyway
    }
  }, [getSessionId])

  // Load saved preferences on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(storageKey)
    if (!savedConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    } else {
      try {
        const preferences = JSON.parse(savedConsent) as CookiePreferences

        // Check if consent has expired
        if (preferences.expiresAt && Date.now() > preferences.expiresAt) {
          localStorage.removeItem(storageKey)
          setIsVisible(true)
          return
        }

        // Apply saved preferences
        setAnalytics(preferences.analytics)
        setMarketing(preferences.marketing)
        applyPreferences(preferences)
      } catch (error) {
        console.error('Failed to parse cookie consent:', error)
        setIsVisible(true)
      }
    }
  }, [storageKey])

  // Focus trap for accessibility
  useEffect(() => {
    if (!isVisible) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showPreferences) {
        // ESC key saves current preferences
        handleSavePreferences()
      }

      if (e.key === 'Tab' && bannerRef.current) {
        const focusableElements = bannerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVisible, showPreferences])

  const applyPreferences = useCallback((preferences: CookiePreferences) => {
    // Trigger analytics scripts if enabled
    if (preferences.analytics && typeof window !== 'undefined') {
      // @ts-ignore - Google Analytics
      if (window.gtag) {
        // @ts-ignore
        window.gtag('consent', 'update', {
          analytics_storage: 'granted',
        })
      }
    }

    // Trigger marketing scripts if enabled
    if (preferences.marketing && typeof window !== 'undefined') {
      // @ts-ignore - Google Analytics
      if (window.gtag) {
        // @ts-ignore
        window.gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        })
      }
    }
  }, [])

  const saveConsent = useCallback((preferences: CookiePreferences) => {
    const consentData = {
      ...preferences,
      timestamp: Date.now(),
      expiresAt: Date.now() + (expiryDays * 24 * 60 * 60 * 1000),
    }

    localStorage.setItem(storageKey, JSON.stringify(consentData))
    saveConsentToDatabase(consentData)
    applyPreferences(preferences)
    setIsVisible(false)
    setShowPreferences(false)
  }, [storageKey, expiryDays, saveConsentToDatabase, applyPreferences])

  const handleAcceptAll = useCallback(() => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(preferences)
    onAcceptAll?.(preferences)
  }, [saveConsent, onAcceptAll])

  const handleSavePreferences = useCallback(() => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics,
      marketing,
    }
    saveConsent(preferences)
    onSavePreferences?.(preferences)
  }, [analytics, marketing, saveConsent, onSavePreferences])

  const handleEssentialOnly = useCallback(() => {
    const preferences: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    }
    setAnalytics(false)
    setMarketing(false)
    saveConsent(preferences)
    onEssentialOnly?.(preferences)
  }, [saveConsent, onEssentialOnly])

  const handleCustomize = useCallback(() => {
    setShowPreferences(true)
  }, [])

  const handleClosePreferences = useCallback(() => {
    setShowPreferences(false)
  }, [])

  if (!isVisible) return null

  return (
    <>
      <div
        ref={bannerRef}
        className="cookie-banner"
        role="dialog"
        aria-labelledby="cookie-banner-title"
        aria-modal="true"
        aria-describedby="cookie-banner-description"
      >
        <div className="cb-body">
          <h2 id="cookie-banner-title" className="cb-title">
            <span>🍪</span> Cookie voorkeuren
          </h2>
          <p id="cookie-banner-description" className="cb-text">
            Wij gebruiken cookies om uw ervaring te verbeteren. Kies hieronder uw voorkeuren of{' '}
            <button
              onClick={handleCustomize}
              className="cb-link"
              aria-label="Pas cookie voorkeuren aan"
            >
              pas uw instellingen aan
            </button>
            .{' '}
            <a href={privacyPolicyUrl} className="cb-link">
              Lees meer
            </a>
          </p>

          <div className="cb-actions">
            <button
              className="cb-btn essential"
              onClick={handleEssentialOnly}
              aria-label="Accepteer alleen noodzakelijke cookies"
            >
              Alleen noodzakelijk
            </button>
            <button
              className="cb-btn accept"
              onClick={handleAcceptAll}
              aria-label="Accepteer alle cookies"
            >
              Alles accepteren
            </button>
          </div>
        </div>
      </div>

      {showPreferences && (
        <CookiePreferencesModal
          analytics={analytics}
          marketing={marketing}
          onAnalyticsChange={setAnalytics}
          onMarketingChange={setMarketing}
          onSave={handleSavePreferences}
          onClose={handleClosePreferences}
          privacyPolicyUrl={privacyPolicyUrl}
          categories={COOKIE_CATEGORIES}
        />
      )}

      <style jsx>{`
        .cookie-banner {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(120%);
          z-index: var(--z-modal);
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 20px;
          box-shadow: var(--shadow-lg);
          width: 520px;
          max-width: calc(100vw - 40px);
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          overflow: hidden;
        }

        @keyframes slideUp {
          to {
            transform: translateX(-50%) translateY(0);
          }
        }

        .cb-body {
          padding: var(--sp-6);
        }

        .cb-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }

        .cb-title span {
          font-size: 22px;
        }

        .cb-text {
          font-size: 14px;
          color: var(--grey-dark);
          line-height: 1.5;
          margin-bottom: var(--sp-4);
        }

        .cb-link {
          color: var(--teal);
          text-decoration: underline;
          text-underline-offset: 2px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: inherit;
          font-family: inherit;
        }

        .cb-link:hover {
          color: var(--teal-dark);
        }

        .cb-actions {
          display: flex;
          gap: var(--sp-2);
        }

        .cb-btn {
          flex: 1;
          height: 44px;
          border-radius: 10px;
          font-family: var(--font);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .cb-btn.accept {
          background: var(--teal);
          color: var(--white);
        }

        .cb-btn.accept:hover {
          background: var(--navy);
        }

        .cb-btn.essential {
          background: var(--grey-light);
          color: var(--navy);
          border: 1.5px solid var(--grey);
        }

        .cb-btn.essential:hover {
          border-color: var(--teal);
          color: var(--teal);
        }

        @media (max-width: 640px) {
          .cookie-banner {
            width: calc(100vw - 32px);
            bottom: 16px;
          }

          .cb-actions {
            flex-direction: column;
          }

          .cb-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  )
}
