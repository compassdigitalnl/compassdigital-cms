/**
 * DrawerFooter Component
 *
 * Mobile drawer footer with contact info and toggles
 * Language switcher and price toggle (optional)
 */

'use client'

import React, { useState } from 'react'
import { Phone, Mail, Globe } from 'lucide-react'
import type { MobileContactInfo, LanguageSwitcherConfig, PriceToggleConfig } from '@/globals/Header.types'

export interface DrawerFooterProps {
  contactInfo?: MobileContactInfo
  showToggles?: boolean
  languageSwitcher?: LanguageSwitcherConfig
  priceToggle?: PriceToggleConfig
}

export function DrawerFooter({
  contactInfo,
  showToggles = true,
  languageSwitcher,
  priceToggle,
}: DrawerFooterProps) {
  const [currentLang, setCurrentLang] = useState(
    languageSwitcher?.languages?.find((lang) => lang.isDefault)?.code || 'NL',
  )
  const [priceMode, setPriceMode] = useState<'b2c' | 'b2b'>(priceToggle?.defaultMode || 'b2c')

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode)
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: langCode } }))
    localStorage.setItem('preferred-language', langCode)
  }

  // Handle price toggle
  const handlePriceToggle = () => {
    const newMode = priceMode === 'b2c' ? 'b2b' : 'b2c'
    setPriceMode(newMode)
    window.dispatchEvent(new CustomEvent('priceToggle', { detail: { mode: newMode } }))
    localStorage.setItem('price-mode', newMode)
  }

  return (
    <div className="drawer-footer">
      {/* Contact Info */}
      {contactInfo && (contactInfo.phone || contactInfo.email) && (
        <div className="footer-contact">
          {contactInfo.phone && (
            <a href={`tel:${contactInfo.phone}`} className="contact-link">
              <Phone size={16} aria-hidden="true" />
              <span>{contactInfo.phone}</span>
            </a>
          )}
          {contactInfo.email && (
            <a href={`mailto:${contactInfo.email}`} className="contact-link">
              <Mail size={16} aria-hidden="true" />
              <span>{contactInfo.email}</span>
            </a>
          )}
        </div>
      )}

      {/* Toggles */}
      {showToggles && (languageSwitcher?.enabled || priceToggle?.enabled) && (
        <div className="footer-toggles">
          {/* Language Switcher */}
          {languageSwitcher?.enabled && languageSwitcher.languages && (
            <div className="toggle-group">
              <div className="toggle-label">
                <Globe size={14} aria-hidden="true" />
                <span>Taal</span>
              </div>
              <div className="toggle-buttons">
                {languageSwitcher.languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`toggle-button ${currentLang === lang.code ? 'active' : ''}`}
                    aria-label={`Switch to ${lang.label}`}
                    aria-pressed={currentLang === lang.code}
                  >
                    {lang.flag || lang.code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Toggle */}
          {priceToggle?.enabled && (
            <div className="toggle-group">
              <div className="toggle-label">
                <span>Prijzen</span>
              </div>
              <button
                onClick={handlePriceToggle}
                className="price-toggle-button"
                aria-label={`Switch to ${priceMode === 'b2c' ? 'business' : 'consumer'} prices`}
                aria-pressed={priceMode === 'b2b'}
              >
                <span className={priceMode === 'b2c' ? 'active' : ''}>
                  {priceToggle.b2cLabel || 'Particulier'}
                </span>
                <span className="separator">|</span>
                <span className={priceMode === 'b2b' ? 'active' : ''}>
                  {priceToggle.b2bLabel || 'Zakelijk'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .drawer-footer {
          border-top: 1px solid var(--color-border, #e0e0e0);
          padding: var(--space-4, 16px);
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-4, 16px);
        }

        /* Contact Info */
        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 8px);
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
          padding: var(--space-2, 8px);
          text-decoration: none;
          color: var(--color-text-primary, #0a1628);
          font-size: var(--font-size-sm, 13px);
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }

        .contact-link:hover,
        .contact-link:active {
          background: var(--color-surface, #f5f5f5);
        }

        /* Toggles */
        .footer-toggles {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 12px);
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 8px);
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: var(--space-1, 4px);
          font-size: var(--font-size-xs, 11px);
          font-weight: 600;
          color: var(--color-text-muted, #666);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .toggle-buttons {
          display: flex;
          gap: var(--space-1, 4px);
        }

        .toggle-button {
          flex: 1;
          background: var(--color-surface, #f5f5f5);
          border: 1px solid var(--color-border, #e0e0e0);
          color: var(--color-text-primary, #0a1628);
          padding: var(--space-2, 8px);
          border-radius: 6px;
          cursor: pointer;
          font-size: var(--font-size-sm, 13px);
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .toggle-button:active {
          transform: scale(0.98);
        }

        .toggle-button.active {
          background: var(--color-primary, #0a1628);
          color: var(--color-white, #fff);
          border-color: var(--color-primary, #0a1628);
        }

        .price-toggle-button {
          background: var(--color-surface, #f5f5f5);
          border: 1px solid var(--color-border, #e0e0e0);
          color: var(--color-text-primary, #0a1628);
          padding: var(--space-2, 8px) var(--space-3, 12px);
          border-radius: 6px;
          cursor: pointer;
          font-size: var(--font-size-sm, 13px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2, 8px);
          transition: all 0.2s ease;
        }

        .price-toggle-button:active {
          transform: scale(0.98);
        }

        .price-toggle-button span {
          opacity: 0.5;
          transition: opacity 0.2s ease;
        }

        .price-toggle-button span.active {
          opacity: 1;
          font-weight: 600;
        }

        .separator {
          opacity: 0.3;
        }
      `}</style>
    </div>
  )
}
