'use client'

import React from 'react'
import type { GuestInfoBoxProps, GuestBenefit } from './types'

const defaultBenefits: GuestBenefit[] = [
  { label: 'Persoonlijke staffelprijzen', icon: '✓' },
  { label: 'Bestelhistorie inzien', icon: '✓' },
  { label: 'Snelle nabestellingen', icon: '✓' },
  { label: 'Bestellijsten opslaan', icon: '✓' },
]

export const GuestInfoBox: React.FC<GuestInfoBoxProps> = ({
  title = 'Goed om te weten',
  description = 'Als gast kunt u eenmalig bestellen zonder account. Met een account profiteert u van:',
  benefits = defaultBenefits,
  className = '',
}) => {
  return (
    <div className={`guest-info-box ${className}`}>
      <h4>
        <span>ℹ️</span> {title}
      </h4>
      <p>{description}</p>
      <div className="guest-benefits">
        {benefits.map((benefit, index) => (
          <div key={index} className="guest-benefit">
            <span className="check">{benefit.icon || '✓'}</span>
            {benefit.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuestInfoBox
