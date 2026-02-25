'use client'

import React from 'react'
import styles from './AuthBrandingPanel.module.css'
import type { AuthBrandingPanelProps } from './types'

export const AuthBrandingPanel: React.FC<AuthBrandingPanelProps> = ({
  logoUrl,
  logoAlt = 'Logo',
  siteName = 'Mijn Bedrijf',
  tagline = 'Professionele oplossingen voor zakelijke klanten',
  backgroundImage,
  backgroundColor,
  className = '',
}) => {
  const panelStyle: React.CSSProperties = {}

  if (backgroundImage) {
    panelStyle.backgroundImage = `linear-gradient(135deg, rgba(10, 38, 71, 0.85), rgba(0, 137, 123, 0.75)), url(${backgroundImage})`
  } else if (backgroundColor) {
    panelStyle.backgroundColor = backgroundColor
  }

  return (
    <div className={`${styles.brandingPanel} ${className}`} style={panelStyle}>
      <div className={styles.brandingContent}>
        {/* Logo or Site Name */}
        {logoUrl ? (
          <img src={logoUrl} alt={logoAlt} className={styles.logo} />
        ) : (
          <h1 className={styles.siteName}>{siteName}</h1>
        )}

        {/* Tagline */}
        {tagline && <p className={styles.tagline}>{tagline}</p>}

        {/* Trust Indicators */}
        <div className={styles.trustIndicators}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🔒</span>
            <span className={styles.trustText}>SSL Beveiligd</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>🛡️</span>
            <span className={styles.trustText}>AVG Compliant</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon}>✓</span>
            <span className={styles.trustText}>ISO Gecertificeerd</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthBrandingPanel
