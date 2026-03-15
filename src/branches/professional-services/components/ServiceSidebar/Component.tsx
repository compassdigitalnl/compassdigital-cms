import React from 'react'
import Link from 'next/link'
import { ConsultationForm } from '@/branches/professional-services/components/ConsultationForm'
import { PhoneCard } from '@/branches/shared/components/ui/media/PhoneCard'
import type { ServiceSidebarProps } from './types'

/**
 * ServiceSidebar - Sidebar for professional service detail pages
 *
 * Contains: Quick consultation form, phone card, related services list.
 */
export const ServiceSidebar: React.FC<ServiceSidebarProps> = ({
  service,
  relatedServices = [],
  phone = '020 123 4567',
  className = '',
}) => {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Quick Consultation Form */}
      <div className="rounded-xl border border-grey bg-white p-5">
        <h3 className="mb-4 text-lg font-bold text-navy">Adviesgesprek aanvragen</h3>
        <ConsultationForm className="consultation-form--compact" />
      </div>

      {/* Phone Card */}
      <PhoneCard phone={phone} />

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="rounded-xl border border-grey bg-white p-5">
          <h3 className="mb-4 text-base font-bold text-navy">Overige diensten</h3>
          <ul className="space-y-3">
            {relatedServices.map((related) => (
              <li key={related.id}>
                <Link
                  href={`/dienstverlening/${related.slug}`}
                  className="group flex items-center gap-3 text-sm text-grey-dark transition-colors hover:text-primary"
                >
                  {related.icon && <span className="text-lg">{related.icon}</span>}
                  <span className="group-hover:underline">{related.title}</span>
                  <svg
                    className="ml-auto h-4 w-4 shrink-0 text-grey-mid transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    fill="none"
                    viewBox="0 0 16 16"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

export default ServiceSidebar
