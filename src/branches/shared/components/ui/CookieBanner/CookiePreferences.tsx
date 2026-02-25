'use client'

import React, { useEffect, useRef } from 'react'
import { X, Shield, BarChart2, Megaphone } from 'lucide-react'
import { CookieCategory } from './types'

interface CookiePreferencesModalProps {
  analytics: boolean
  marketing: boolean
  onAnalyticsChange: (value: boolean) => void
  onMarketingChange: (value: boolean) => void
  onSave: () => void
  onClose: () => void
  privacyPolicyUrl: string
  categories: CookieCategory[]
}

const ICON_MAP = {
  shield: Shield,
  'bar-chart-2': BarChart2,
  megaphone: Megaphone,
}

export function CookiePreferencesModal({
  analytics,
  marketing,
  onAnalyticsChange,
  onMarketingChange,
  onSave,
  onClose,
  privacyPolicyUrl,
  categories,
}: CookiePreferencesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
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

    // Focus first interactive element
    const firstButton = modalRef.current?.querySelector('button') as HTMLElement
    firstButton?.focus()

    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const getToggleState = (categoryId: string) => {
    if (categoryId === 'analytics') return analytics
    if (categoryId === 'marketing') return marketing
    return true // Essential is always true
  }

  const handleToggle = (categoryId: string) => {
    if (categoryId === 'analytics') onAnalyticsChange(!analytics)
    if (categoryId === 'marketing') onMarketingChange(!marketing)
  }

  const handleSaveAndClose = () => {
    onSave()
    onClose()
  }

  return (
    <>
      <div className="cb-overlay" onClick={onClose} aria-hidden="true" />
      <div
        ref={modalRef}
        className="cb-preferences"
        role="dialog"
        aria-labelledby="preferences-title"
        aria-modal="true"
      >
        <div className="cb-pref-header">
          <h2 id="preferences-title" className="cb-pref-title">
            Cookie voorkeuren
          </h2>
          <button
            className="cb-pref-close"
            onClick={onClose}
            aria-label="Sluit voorkeuren"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cb-pref-body">
          <p className="cb-pref-intro">
            Wij respecteren uw privacy. Hieronder kunt u per categorie instellen welke cookies u
            wilt accepteren. Essentiële cookies zijn altijd ingeschakeld en noodzakelijk voor de
            werking van de website.
          </p>

          <div className="cb-toggles" role="group" aria-label="Cookie categorieën">
            {categories.map((category) => {
              const Icon = ICON_MAP[category.icon as keyof typeof ICON_MAP]
              const isEnabled = getToggleState(category.id)

              return (
                <div key={category.id} className="cb-toggle-card">
                  <div className="cb-toggle-header">
                    <div className="cb-toggle-info">
                      {Icon && <Icon size={16} className="cb-toggle-icon" />}
                      <span className="cb-toggle-name">{category.name}</span>
                      {category.required && (
                        <span className="cb-toggle-req">(verplicht)</span>
                      )}
                    </div>
                    <button
                      className={`cb-switch ${isEnabled ? 'on' : ''} ${category.required ? 'locked' : ''}`}
                      onClick={() => !category.required && handleToggle(category.id)}
                      disabled={category.required}
                      role="switch"
                      aria-checked={isEnabled}
                      aria-label={`${category.name} cookies ${isEnabled ? 'uitschakelen' : 'inschakelen'}`}
                    >
                      <span className="cb-switch-knob" />
                    </button>
                  </div>
                  <p className="cb-toggle-desc">{category.description}</p>
                </div>
              )
            })}
          </div>

          <p className="cb-pref-footer">
            Voor meer informatie over hoe wij cookies gebruiken, zie ons{' '}
            <a href={privacyPolicyUrl} className="cb-link">
              privacybeleid
            </a>
            .
          </p>
        </div>

        <div className="cb-pref-actions">
          <button className="cb-btn save" onClick={handleSaveAndClose}>
            Voorkeuren opslaan
          </button>
        </div>
      </div>

      <style jsx>{`
        .cb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 22, 40, 0.6);
          z-index: var(--z-modal);
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .cb-preferences {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: calc(var(--z-modal) + 1);
          background: var(--white);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          width: 600px;
          max-width: calc(100vw - 32px);
          max-height: calc(100vh - 64px);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .cb-pref-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--sp-6);
          border-bottom: 1px solid var(--grey);
        }

        .cb-pref-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
        }

        .cb-pref-close {
          background: none;
          border: none;
          color: var(--grey-mid);
          cursor: pointer;
          padding: var(--sp-2);
          border-radius: var(--radius-sm);
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cb-pref-close:hover {
          background: var(--grey-light);
          color: var(--navy);
        }

        .cb-pref-body {
          flex: 1;
          overflow-y: auto;
          padding: var(--sp-6);
        }

        .cb-pref-intro {
          font-size: 14px;
          color: var(--grey-dark);
          line-height: 1.6;
          margin-bottom: var(--sp-5);
        }

        .cb-toggles {
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
          margin-bottom: var(--sp-5);
        }

        .cb-toggle-card {
          padding: var(--sp-4);
          background: var(--grey-light);
          border-radius: var(--radius-md);
          border: 1px solid var(--grey);
        }

        .cb-toggle-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--sp-2);
        }

        .cb-toggle-info {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
        }

        .cb-toggle-icon {
          color: var(--teal);
        }

        .cb-toggle-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
        }

        .cb-toggle-req {
          font-size: 11px;
          color: var(--grey-mid);
        }

        .cb-toggle-desc {
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.5;
          margin: 0;
        }

        .cb-switch {
          width: 44px;
          height: 24px;
          border-radius: 100px;
          background: var(--grey);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          border: none;
          padding: 0;
        }

        .cb-switch.on {
          background: var(--teal);
        }

        .cb-switch-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--white);
          transition: left 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          display: block;
        }

        .cb-switch.on .cb-switch-knob {
          left: 23px;
        }

        .cb-switch.locked {
          background: var(--teal);
          opacity: 0.6;
          cursor: default;
        }

        .cb-pref-footer {
          font-size: 13px;
          color: var(--grey-mid);
          line-height: 1.5;
          margin: 0;
        }

        .cb-link {
          color: var(--teal);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .cb-link:hover {
          color: var(--teal-dark);
        }

        .cb-pref-actions {
          padding: var(--sp-6);
          border-top: 1px solid var(--grey);
        }

        .cb-btn {
          width: 100%;
          height: 44px;
          border-radius: var(--radius-md);
          font-family: var(--font);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .cb-btn.save {
          background: var(--teal);
          color: var(--white);
        }

        .cb-btn.save:hover {
          background: var(--navy);
        }

        @media (max-width: 640px) {
          .cb-preferences {
            width: calc(100vw - 32px);
            max-height: calc(100vh - 32px);
          }

          .cb-pref-header,
          .cb-pref-body,
          .cb-pref-actions {
            padding: var(--sp-4);
          }
        }
      `}</style>
    </>
  )
}
