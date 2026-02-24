/**
 * TopbarRight Component
 *
 * Right side controls: Language switcher and Price toggle
 * Compact design for topbar (36px height)
 */

'use client'

import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import type { LanguageSwitcherConfig, PriceToggleConfig } from '@/globals/Header.types'

export interface TopbarRightProps {
  languageSwitcher?: LanguageSwitcherConfig
  priceToggle?: PriceToggleConfig
  textColor?: string
}

export function TopbarRight({
  languageSwitcher,
  priceToggle,
  textColor = 'var(--color-white)',
}: TopbarRightProps) {
  const [currentLang, setCurrentLang] = useState(
    languageSwitcher?.languages?.find((lang) => lang.isDefault)?.code || 'NL',
  )
  const [priceMode, setPriceMode] = useState<'b2c' | 'b2b'>(priceToggle?.defaultMode || 'b2c')

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode)
    // Dispatch event for global state management
    window.dispatchEvent(
      new CustomEvent('languageChange', { detail: { language: langCode } }),
    )
    // Store in localStorage
    localStorage.setItem('preferred-language', langCode)
  }

  // Handle price toggle
  const handlePriceToggle = () => {
    const newMode = priceMode === 'b2c' ? 'b2b' : 'b2c'
    setPriceMode(newMode)
    // Dispatch event for global state management
    window.dispatchEvent(new CustomEvent('priceToggle', { detail: { mode: newMode } }))
    // Store in localStorage
    localStorage.setItem('price-mode', newMode)
  }

  return (
    <div className="topbar-right" style={{ color: textColor }}>
      {/* Language Switcher */}
      {languageSwitcher?.enabled && languageSwitcher.languages && (
        <div className="language-switcher">
          <Globe size={14} aria-hidden="true" />

          {/* Button Group (2-3 languages) */}
          {languageSwitcher.languages.length <= 3 && (
            <div className="lang-buttons">
              {languageSwitcher.languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`lang-button ${currentLang === lang.code ? 'active' : ''}`}
                  aria-label={`Switch to ${lang.label}`}
                  aria-pressed={currentLang === lang.code}
                >
                  {lang.flag || lang.code}
                </button>
              ))}
            </div>
          )}

          {/* Dropdown (4+ languages) */}
          {languageSwitcher.languages.length > 3 && (
            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="lang-dropdown"
              aria-label="Select language"
            >
              {languageSwitcher.languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Price Toggle */}
      {priceToggle?.enabled && (
        <button
          onClick={handlePriceToggle}
          className="price-toggle"
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
      )}

      <style jsx>{`
        .topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-4, 16px);
          font-size: var(--font-size-sm, 12px);
        }

        /* Language Switcher */
        .language-switcher {
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
        }

        .lang-buttons {
          display: flex;
          gap: var(--space-1, 4px);
        }

        .lang-button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: inherit;
          padding: 2px var(--space-2, 8px);
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--font-size-xs, 11px);
          transition: all 0.2s ease;
        }

        .lang-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .lang-button.active {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .lang-dropdown {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: inherit;
          padding: 2px var(--space-2, 8px);
          border-radius: 4px;
          font-size: var(--font-size-xs, 11px);
          cursor: pointer;
        }

        /* Price Toggle */
        .price-toggle {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: inherit;
          padding: 2px var(--space-3, 12px);
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--font-size-xs, 11px);
          display: flex;
          gap: var(--space-2, 8px);
          transition: all 0.2s ease;
        }

        .price-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .price-toggle span {
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }

        .price-toggle span.active {
          opacity: 1;
          font-weight: 600;
        }

        .separator {
          opacity: 0.3;
        }

        /* Mobile: hide language switcher, keep price toggle */
        @media (max-width: 767px) {
          .language-switcher {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
