import React from 'react'
import { MapPin, Phone, Mail, Clock, Map } from 'lucide-react'

/**
 * B16 - Contact Block Component
 *
 * Contact information display with address, phone, email, opening hours, and optional map.
 *
 * FEATURES:
 * - 2-column responsive layout (info left, map right)
 * - Lucide icons in teal-glow circles
 * - Clickable phone (tel:) and email (mailto:) links
 * - Opening hours with day/time rows
 * - Optional Google Maps iframe embed
 * - Responsive: stacks vertically on mobile
 *
 * @see src/branches/shared/blocks/Contact/config.ts
 * @see docs/refactoring/sprint-7/b16-contact.html
 */

interface ContactAddress {
  street?: string
  postalCode?: string
  city?: string
}

interface OpeningHour {
  day: string
  hours: string
  id?: string
}

interface ContactBlockProps {
  title: string
  subtitle?: string
  address?: ContactAddress
  phone?: string
  email?: string
  openingHours?: OpeningHour[]
  showMap?: boolean
  mapUrl?: string
}

export const ContactBlockComponent: React.FC<ContactBlockProps> = ({
  title,
  subtitle,
  address,
  phone,
  email,
  openingHours,
  showMap = true,
  mapUrl,
}) => {
  const hasAddress = address && (address.street || address.city)
  const hasOpeningHours = openingHours && openingHours.length > 0

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base text-grey-dark">{subtitle}</p>
          )}
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Address */}
            {hasAddress && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy mb-1.5">
                    Adres
                  </h3>
                  <p className="text-[13px] text-grey-dark leading-relaxed">
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
                <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy mb-1.5">
                    Telefoon
                  </h3>
                  <p className="text-[13px] text-grey-dark">
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
                <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-navy mb-1.5">Email</h3>
                  <p className="text-[13px] text-grey-dark">
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
                <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-teal" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-navy mb-2">
                    Openingstijden
                  </h3>
                  <div className="space-y-2">
                    {openingHours!.map((item, index) => (
                      <div
                        key={item.id || index}
                        className={`flex justify-between text-[13px] pb-2 ${
                          index < openingHours!.length - 1
                            ? 'border-b border-grey'
                            : ''
                        }`}
                      >
                        <span className="font-semibold text-navy">
                          {item.day}
                        </span>
                        <span className="text-grey-dark">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          {showMap && (
            <div className="bg-grey-light rounded-xl overflow-hidden h-[400px] relative">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Maps Location"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-grey-mid">
                  <Map className="w-12 h-12 mb-3" />
                  <p className="text-[13px] font-semibold">
                    Google Maps wordt hier getoond
                  </p>
                  <p className="text-[11px]">
                    Voeg een Google Maps embed URL toe
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
