'use client'

import React from 'react'
import { Truck, Check, Loader, Package, Home, Route } from 'lucide-react'
import { getIcon } from '@/utilities/getIcon'
import type { OrderTimelineProps, TimelineStep } from './types'

/**
 * OrderTimeline Component
 *
 * Vertical order-status tracker with delivery banner. Shows the progression
 * of an order from received → processing → shipped → delivered.
 *
 * @example
 * ```tsx
 * <OrderTimeline
 *   steps={[
 *     { id: '1', label: 'Bestelling ontvangen', status: 'done', timestamp: 'Vandaag, 14:23' },
 *     { id: '2', label: 'In behandeling', status: 'active', description: 'Wordt klaargezet' },
 *     { id: '3', label: 'Verzonden', status: 'upcoming' },
 *     { id: '4', label: 'Afgeleverd', status: 'upcoming' },
 *   ]}
 *   expectedDelivery="donderdag 20 februari"
 *   deliveryMethod="Standaard bezorging · Besteld voor 16:00, morgen geleverd"
 * />
 * ```
 */

// Default icon per step index
const defaultIcons: Record<number, React.ComponentType<{ size?: number }>> = {
  0: Check,
  1: Loader,
  2: Package,
  3: Home,
}

// Resolve Lucide icon from kebab-case name
function resolveIcon(name?: string): React.ComponentType<{ size?: number; className?: string }> | null {
  if (!name) return null
  const pascalCase = name
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  return getIcon(pascalCase)
}

export function OrderTimeline({
  steps,
  expectedDelivery,
  deliveryMethod,
  className = '',
}: OrderTimelineProps) {
  const getStepIcon = (step: TimelineStep, index: number) => {
    const CustomIcon = resolveIcon(step.icon)
    if (CustomIcon) return CustomIcon
    return defaultIcons[index] || Package
  }

  return (
    <div className={`order-timeline ${className}`}>
      {/* Card header */}
      <div className="timeline-header">
        <Route size={18} aria-hidden="true" />
        Status & verwachte levering
      </div>

      {/* Delivery banner */}
      {expectedDelivery && (
        <div className="delivery-banner" role="status" aria-live="polite">
          <div className="delivery-icon" aria-hidden="true">
            <Truck size={20} />
          </div>
          <div className="delivery-info">
            <div className="delivery-title">
              Verwachte levering: {expectedDelivery}
            </div>
            {deliveryMethod && (
              <div className="delivery-desc">{deliveryMethod}</div>
            )}
          </div>
        </div>
      )}

      {/* Timeline steps */}
      <div className="timeline" role="list" aria-label="Bestelstatus">
        {steps.map((step, index) => {
          const IconComponent = getStepIcon(step, index)
          return (
            <div
              key={step.id}
              className={`tl-step ${step.status}`}
              role="listitem"
              aria-current={step.status === 'active' ? 'step' : undefined}
            >
              <div className="tl-dot" aria-hidden="true">
                <IconComponent
                  size={10}
                  className={step.status === 'active' && !step.icon ? 'spin' : ''}
                />
              </div>
              <div className="tl-content">
                <div className="tl-title">{step.label}</div>
                {step.description && (
                  <div className="tl-desc">{step.description}</div>
                )}
                {step.timestamp && (
                  <div className="tl-time">{step.timestamp}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .order-timeline {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 16px;
          padding: 24px;
        }

        .timeline-header {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .timeline-header :global(svg) {
          color: var(--teal);
        }

        /* Delivery banner */
        .delivery-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--green-light);
          border-radius: var(--radius);
          padding: 16px;
          margin-bottom: 20px;
        }

        .delivery-icon {
          width: 44px;
          height: 44px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .delivery-icon :global(svg) {
          color: var(--green);
        }

        .delivery-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
        }

        .delivery-desc {
          font-size: 13px;
          color: var(--grey-dark);
          margin-top: 2px;
        }

        /* Timeline */
        .timeline {
          position: relative;
          padding-left: 28px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 9px;
          top: 4px;
          bottom: 4px;
          width: 2px;
          background: var(--grey);
        }

        .tl-step {
          position: relative;
          padding-bottom: 24px;
        }

        .tl-step:last-child {
          padding-bottom: 0;
        }

        /* Dot */
        .tl-dot {
          position: absolute;
          left: -28px;
          top: 2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--grey);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tl-dot :global(svg) {
          color: var(--grey-mid);
        }

        /* Done state */
        .tl-step.done .tl-dot {
          background: var(--green);
          border-color: var(--green);
        }

        .tl-step.done .tl-dot :global(svg) {
          color: white;
        }

        /* Active state */
        .tl-step.active .tl-dot {
          background: var(--teal);
          border-color: var(--teal);
          box-shadow: 0 0 0 4px var(--teal-glow);
        }

        .tl-step.active .tl-dot :global(svg) {
          color: white;
        }

        /* Upcoming state */
        .tl-step.upcoming .tl-dot {
          border-color: var(--grey);
        }

        /* Content */
        .tl-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--navy);
        }

        .tl-step.upcoming .tl-title {
          color: var(--grey-mid);
        }

        .tl-desc {
          font-size: 13px;
          color: var(--grey-mid);
          margin-top: 2px;
        }

        .tl-time {
          font-size: 12px;
          color: var(--teal);
          font-weight: 600;
          margin-top: 2px;
        }

        /* Spinning loader for active step */
        .tl-dot :global(.spin) {
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .order-timeline {
            padding: 20px;
          }

          .delivery-banner {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }

        /* Print */
        @media print {
          .delivery-banner {
            border: 1px solid #ddd;
            background: #f9f9f9;
          }

          .tl-step.active .tl-dot {
            box-shadow: none;
          }

          .tl-dot :global(.spin) {
            animation: none;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .tl-dot :global(.spin) {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
