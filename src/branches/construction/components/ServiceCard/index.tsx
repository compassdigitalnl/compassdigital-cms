/**
 * ServiceCard Component
 *
 * Displays a construction service with icon, title, description, and features.
 * Used in ServicesGrid and service overview pages.
 */

import React from 'react'
import Link from 'next/link'
import type { ConstructionService } from '@/payload-types'
import './styles.scss'

export interface ServiceCardProps {
  service: ConstructionService
  variant?: 'default' | 'compact' | 'featured'
  showCTA?: boolean
  className?: string
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  variant = 'default',
  showCTA = true,
  className = '',
}) => {
  const {
    title,
    slug,
    shortDescription,
    icon,
    serviceType,
    features,
    status,
  } = service

  if (status !== 'active') return null

  const iconUrl = typeof icon === 'object' && icon !== null ? icon.url : null

  return (
    <article className={`service-card service-card--${variant} ${className}`}>
      {/* Icon */}
      {iconUrl && (
        <div className="service-card__icon">
          <img src={iconUrl} alt={title} width={64} height={64} />
        </div>
      )}

      {/* Service Type Badge */}
      {serviceType && (
        <span className="service-card__badge">
          {serviceType === 'residential' && 'Particulier'}
          {serviceType === 'commercial' && 'Zakelijk'}
          {serviceType === 'both' && 'Particulier & Zakelijk'}
        </span>
      )}

      {/* Content */}
      <div className="service-card__content">
        <h3 className="service-card__title">{title}</h3>

        {shortDescription && (
          <p className="service-card__description">{shortDescription}</p>
        )}

        {/* Features List */}
        {variant === 'featured' && features && features.length > 0 && (
          <ul className="service-card__features">
            {features.slice(0, 4).map((feature, index) => (
              <li key={index}>
                <svg className="service-card__check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3 4.7L6 12l-3.3-3.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {feature.feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA */}
      {showCTA && (
        <div className="service-card__footer">
          <Link href={`/diensten/${slug}`} className="service-card__cta">
            Meer informatie
            <svg className="service-card__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      )}
    </article>
  )
}

export default ServiceCard
