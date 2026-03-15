import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Globe,
  Handshake,
  ShieldCheck,
  Tag,
  Phone,
} from 'lucide-react'

interface VendorSidebarProps {
  vendor: {
    name: string
    contact?: {
      website?: string | null
      email?: string | null
      phone?: string | null
      address?: string | null
      country?: string | null
    } | null
    stats?: { establishedYear?: number | null } | null
    partnerSince?: number | null
    employeeCount?: string | null
    certifications?: Array<{ name: string; icon?: string | null }> | null
    specialisms?: Array<{ name: string }> | null
    delivery?: {
      deliveryTime?: string | null
      freeShippingFrom?: number | null
    } | null
  }
}

export function VendorSidebar({ vendor }: VendorSidebarProps) {
  const infoItems = [
    vendor.contact?.country && {
      icon: <MapPin className="w-4 h-4" />,
      label: 'Hoofdkantoor',
      value: vendor.contact.country,
    },
    vendor.stats?.establishedYear && {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Opgericht',
      value: String(vendor.stats.establishedYear),
    },
    vendor.employeeCount && {
      icon: <Users className="w-4 h-4" />,
      label: 'Medewerkers',
      value: vendor.employeeCount,
    },
    vendor.contact?.website && {
      icon: <Globe className="w-4 h-4" />,
      label: 'Website',
      value: vendor.contact.website.replace(/^https?:\/\//, ''),
      href: vendor.contact.website,
    },
    vendor.partnerSince && {
      icon: <Handshake className="w-4 h-4" />,
      label: 'Partner sinds',
      value: String(vendor.partnerSince),
    },
  ].filter(Boolean) as Array<{
    icon: React.ReactNode
    label: string
    value: string
    href?: string
  }>

  return (
    <div className="space-y-4">
      {/* Vendor Info Card */}
      {infoItems.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <h3
            className="text-sm font-extrabold mb-4 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Building2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            Leverancier info
          </h3>
          <div className="space-y-3 text-sm">
            {infoItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }}>
                  {item.icon}
                </span>
                <div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <div className="font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                      {item.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {vendor.certifications && vendor.certifications.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <h3
            className="text-sm font-extrabold mb-3 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            Certificeringen
          </h3>
          <div className="space-y-2">
            {vendor.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-success)' }} />
                <span style={{ color: 'var(--color-text-secondary)' }}>{cert.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialisms */}
      {vendor.specialisms && vendor.specialisms.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border" style={{ borderColor: 'var(--color-border)' }}>
          <h3
            className="text-sm font-extrabold mb-3 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Tag className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            Specialismen
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {vendor.specialisms.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {spec.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact CTA */}
      {vendor.contact?.phone && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-text-primary))',
          }}
        >
          <h3
            className="text-sm font-extrabold text-white mb-2 flex items-center gap-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Phone className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
            Contact
          </h3>
          <p className="text-sm text-white/60 mb-3">
            Neem direct contact op met {vendor.name}
          </p>
          <a
            href={`tel:${vendor.contact.phone}`}
            className="text-base font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            {vendor.contact.phone}
          </a>
        </div>
      )}
    </div>
  )
}
