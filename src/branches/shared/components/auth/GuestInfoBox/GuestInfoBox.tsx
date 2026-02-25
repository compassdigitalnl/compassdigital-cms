'use client'

import React from 'react'
import styles from './GuestInfoBox.module.css'

export interface GuestInfoBoxProps {
  title?: string
  description?: string
  benefits?: string[]
  showIcon?: boolean
  className?: string
}

const DEFAULT_BENEFITS = [
  'Persoonlijke staffelprijzen',
  'Bestelhistorie inzien',
  'Snelle nabestellingen',
  'Bestellijsten opslaan',
]

export const GuestInfoBox: React.FC<GuestInfoBoxProps> = ({
  title = 'Goed om te weten',
  description = 'Als gast kunt u eenmalig bestellen zonder account. Met een account profiteert u van:',
  benefits = DEFAULT_BENEFITS,
  showIcon = true,
  className = '',
}) => {
  return (
    <div className={`${styles.guestInfoBox} ${className}`}>
      <h4 className={styles.title}>
        {showIcon && <span className={styles.icon}>ℹ️</span>}
        {title}
      </h4>
      {description && <p className={styles.description}>{description}</p>}
      
      {benefits.length > 0 && (
        <div className={styles.guestBenefits}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.guestBenefit}>
              <span className={styles.check}>✓</span>
              {benefit}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
