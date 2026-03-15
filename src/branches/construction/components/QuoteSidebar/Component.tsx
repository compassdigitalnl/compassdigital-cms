import React from 'react'
import { PhoneCard } from '@/branches/shared/components/ui/media/PhoneCard'
import type { QuoteSidebarProps } from './types'

/**
 * QuoteSidebar - Sidebar for construction quote request page
 *
 * Contains: Trust card, testimonial, phone card.
 */
export const QuoteSidebar: React.FC<QuoteSidebarProps> = ({
  phone = '0251-247233',
  testimonial,
  className = '',
}) => {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Trust Card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <h3 className="mb-3 text-base font-bold text-navy">Waarom bij ons?</h3>
        <ul className="space-y-2.5">
          {[
            { icon: '✓', text: 'Gratis en vrijblijvend advies' },
            { icon: '✓', text: 'Binnen 24 uur reactie' },
            { icon: '✓', text: 'Transparante prijsopgave' },
            { icon: '✓', text: 'Gecertificeerde vakmensen' },
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-grey-dark">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-white">
                {item.icon}
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Testimonial */}
      {testimonial && (
        <div className="rounded-xl border border-grey bg-white p-5">
          <div className="mb-3 flex gap-0.5">
            {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
              <span key={i} className="text-amber-400">&#9733;</span>
            ))}
          </div>
          <blockquote className="text-sm italic leading-relaxed text-grey-dark">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <div className="mt-3 text-sm font-semibold text-navy">
            — {testimonial.clientName}
          </div>
        </div>
      )}

      {/* Phone Card */}
      <PhoneCard phone={phone} />
    </aside>
  )
}

export default QuoteSidebar
