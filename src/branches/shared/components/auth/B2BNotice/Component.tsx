'use client'

import React from 'react'
import type { B2BNoticeProps, B2BNoticeVariant } from './types'

const variantConfig: Record<B2BNoticeVariant, { icon: string; title: string; message: string }> = {
  pending: {
    icon: '🏥',
    title: 'B2B registratie',
    message: 'Uw aanvraag wordt binnen 1 werkdag beoordeeld. Na goedkeuring ontvangt u uw persoonlijke prijsafspraken.',
  },
  approved: {
    icon: '✓',
    title: 'Zakelijk account goedgekeurd!',
    message: 'U heeft nu toegang tot persoonlijke staffelprijzen en B2B-voordelen.',
  },
  info: {
    icon: 'ℹ️',
    title: 'Zakelijk account',
    message: 'Registreer als zakelijke klant voor toegang tot staffelprijzen en factuurbetalingen.',
  },
}

export const B2BNotice: React.FC<B2BNoticeProps> = ({
  variant = 'pending',
  message,
  className = '',
}) => {
  const config = variantConfig[variant]
  const displayMessage = message || config.message

  return (
    <div className={`b2b-notice ${className}`}>
      <span className="b2b-icon">{config.icon}</span>
      <div>
        <strong>{config.title}</strong> — {displayMessage}
      </div>
    </div>
  )
}

export default B2BNotice
