import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { FormRenderer } from '../_shared/FormRenderer'
import type { ContactBlockProps, ContactVariant } from './types'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

/**
 * Contact Block Component (Server)
 *
 * Combined contact information + optional form block.
 *
 * Variants:
 * - info-only: Single column contact info
 * - info-form: Contact info left, form right (default)
 * - info-form-reversed: Form left, contact info right
 * - stacked: Contact info above, form below
 */

/* ─── Inline SVG Icons (server-component safe) ──────────────────────── */

const MapPinIcon = () => (
  <svg className="w-5 h-5 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
)

const MailIcon = () => (
  <svg className="w-5 h-5 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5 text-teal shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

/* ─── Contact Info Section ──────────────────────────────────────────── */

const ContactInfo: React.FC<Pick<ContactBlockProps, 'address' | 'phone' | 'email' | 'openingHours' | 'showMap' | 'mapUrl'>> = ({
  address,
  phone,
  email,
  openingHours,
  showMap,
  mapUrl,
}) => {
  const hasAddress = address && (address.street || address.city)
  const hasOpeningHours = openingHours && openingHours.length > 0

  return (
    <div className="space-y-6">
      {/* Address */}
      {hasAddress && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center shrink-0">
            <MapPinIcon />
          </div>
          <div>
            <h3 className="font-bold text-sm text-navy mb-1">Adres</h3>
            <p className="text-sm text-grey-dark leading-relaxed">
              {address?.street && (
                <>
                  {address.street}
                  <br />
                </>
              )}
              {(address?.postalCode || address?.city) && (
                <>
                  {address.postalCode} {address.city}
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Phone */}
      {phone && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center shrink-0">
            <PhoneIcon />
          </div>
          <div>
            <h3 className="font-bold text-sm text-navy mb-1">Telefoon</h3>
            <p className="text-sm text-grey-dark">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="text-teal hover:text-teal-dark transition-colors hover:underline"
              >
                {phone}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Email */}
      {email && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center shrink-0">
            <MailIcon />
          </div>
          <div>
            <h3 className="font-bold text-sm text-navy mb-1">Email</h3>
            <p className="text-sm text-grey-dark">
              <a
                href={`mailto:${email}`}
                className="text-teal hover:text-teal-dark transition-colors hover:underline"
              >
                {email}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Opening Hours */}
      {hasOpeningHours && (
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center shrink-0">
            <ClockIcon />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm text-navy mb-2">Openingstijden</h3>
            <dl className="space-y-1.5">
              {openingHours!.map((item, index) => (
                <div key={item.id || index} className="flex justify-between text-sm">
                  <dt className="font-medium text-navy">{item.day}</dt>
                  <dd className="text-grey-dark">{item.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {/* Google Maps embed */}
      {showMap && mapUrl && (
        <div className="mt-6 rounded-xl overflow-hidden h-[280px]">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps locatie"
          />
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ────────────────────────────────────────────────── */

export const ContactBlockComponent: React.FC<ContactBlockProps> = ({
  title,
  subtitle,
  address,
  phone,
  email,
  openingHours,
  showMap,
  mapUrl,
  showForm = true,
  form,
  variant = 'info-form',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentVariant = (variant || 'info-form') as ContactVariant

  // The form field comes as either an ID (number) or a resolved object.
  // Only render if it's a resolved object with fields.
  const resolvedForm =
    showForm && form && typeof form === 'object' && 'fields' in form
      ? (form as unknown as FormType)
      : null

  const contactInfoProps = { address, phone, email, openingHours, showMap, mapUrl }

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-grey-dark">{subtitle}</p>
          )}
        </div>

        {/* ─── Variant: info-only ─────────────────────────────────── */}
        {currentVariant === 'info-only' && (
          <div className="max-w-2xl mx-auto">
            <ContactInfo {...contactInfoProps} />
          </div>
        )}

        {/* ─── Variant: info-form ─────────────────────────────────── */}
        {currentVariant === 'info-form' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <ContactInfo {...contactInfoProps} />
            {resolvedForm && (
              <div>
                <FormRenderer form={resolvedForm} className="p-4 md:p-6 border border-border rounded-xl" />
              </div>
            )}
          </div>
        )}

        {/* ─── Variant: info-form-reversed ────────────────────────── */}
        {currentVariant === 'info-form-reversed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {resolvedForm && (
              <div>
                <FormRenderer form={resolvedForm} className="p-4 md:p-6 border border-border rounded-xl" />
              </div>
            )}
            <ContactInfo {...contactInfoProps} />
          </div>
        )}

        {/* ─── Variant: stacked ───────────────────────────────────── */}
        {currentVariant === 'stacked' && (
          <div className="space-y-10 md:space-y-12">
            <div className="max-w-2xl mx-auto">
              <ContactInfo {...contactInfoProps} />
            </div>
            {resolvedForm && (
              <div className="max-w-xl mx-auto">
                <FormRenderer form={resolvedForm} className="p-4 md:p-6 border border-border rounded-xl" />
              </div>
            )}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default ContactBlockComponent
