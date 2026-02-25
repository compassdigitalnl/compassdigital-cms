'use client'

import React from 'react'
import styles from './B2BNotice.module.css'

export interface B2BNoticeProps {
  variant?: 'pending' | 'approved' | 'info'
  message?: string // Custom message (overrides default)
  icon?: string // Custom icon (overrides default)
  className?: string
}

const DEFAULT_MESSAGES = {
  pending: 'B2B registratie — Uw aanvraag wordt binnen 1 werkdag beoordeeld. Na goedkeuring ontvangt u uw persoonlijke prijsafspraken.',
  approved: 'Zakelijk account goedgekeurd! — U heeft nu toegang tot persoonlijke staffelprijzen en B2B-voordelen.',
  info: 'Registreer een zakelijk account voor exclusieve voordelen.',
}

const DEFAULT_ICONS = {
  pending: '🏥',
  approved: '✓',
  info: 'ℹ️',
}

export const B2BNotice: React.FC<B2BNoticeProps> = ({
  variant = 'pending',
  message,
  icon,
  className = '',
}) => {
  const displayMessage = message || DEFAULT_MESSAGES[variant]
  const displayIcon = icon || DEFAULT_ICONS[variant]

  // Split message on em dash to get title and description
  const parts = displayMessage.split(' — ')
  const title = parts[0]
  const description = parts[1] || ''

  return (
    <div className={`${styles.b2bNotice} ${className}`} role="status" aria-live="polite">
      <span className={styles.b2bIcon}>{displayIcon}</span>
      <div>
        {title && description ? (
          <>
            <strong>{title}</strong> — {description}
          </>
        ) : (
          displayMessage
        )}
      </div>
    </div>
  )
}
