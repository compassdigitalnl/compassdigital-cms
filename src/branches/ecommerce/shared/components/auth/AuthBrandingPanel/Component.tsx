'use client'

/**
 * AuthBrandingPanel - Left-side branding panel for auth pages
 *
 * Features:
 * - Navy gradient background
 * - Decorative gradient orbs (teal + coral)
 * - Company badge with pulsing dot
 * - Large title with accent color (DM Serif Display)
 * - Description text
 * - 4 feature cards with icons
 * - Auto-hidden on mobile (<900px)
 *
 * @component
 * @example
 * <AuthBrandingPanel />
 *
 * @example
 * <AuthBrandingPanel
 *   badge="Since 1994"
 *   title={<>Access to <span>4,000+ products</span> for healthcare</>}
 *   description="Custom description..."
 *   features={[...]}
 * />
 */

export interface Feature {
  icon: string // Emoji or Lucide icon name
  title: string // Feature title (bold)
  description: string // Feature description
}

export interface AuthBrandingPanelProps {
  badge?: string
  title?: React.ReactNode // Can include <span> for accent color
  description?: string
  features?: Feature[]
  className?: string
}

const defaultFeatures: Feature[] = [
  {
    icon: '💰',
    title: 'Persoonlijke staffelprijzen',
    description: 'Afgestemd op uw bestelvolume',
  },
  {
    icon: '🔄',
    title: 'Quick-order & nabestellen',
    description: 'Herbestel in 2 klikken vanuit uw historie',
  },
  {
    icon: '📊',
    title: 'Besteloverzicht & facturen',
    description: 'Altijd inzicht in uw bestellingen',
  },
  {
    icon: '📋',
    title: 'Bestellijsten beheren',
    description: 'Stel vaste lijsten samen per afdeling',
  },
]

export function AuthBrandingPanel({
  badge = 'Uw partner sinds 1994',
  title,
  description = 'Log in op uw account voor persoonlijke prijzen, snelle nabestellingen en exclusieve B2B-voordelen. Nog geen account? Registreer en profiteer direct.',
  features = defaultFeatures,
  className = '',
}: AuthBrandingPanelProps) {
  const defaultTitle = (
    <>
      Toegang tot
      <br />
      <span className="accent">4.000+ producten</span>
      <br />
      voor de zorg
    </>
  )

  return (
    <div
      className={`relative flex flex-col justify-center p-16 overflow-hidden min-h-[600px] ${className}`}
      style={{
        background: 'linear-gradient(160deg, var(--color-secondary) 0%, #061A33 50%, #041526 100%)',
      }}
    >
      {/* Decorative Orbs */}
      <div
        className="absolute -top-[20%] -right-[20%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(233,69,96,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-7"
          style={{
            background: 'var(--color-primary-glow)',
            border: '1px solid var(--color-primary-glow)',
            color: 'var(--color-primary-light)',
          }}
        >
          {/* Pulsing Dot */}
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--color-primary-light)' }}
          />
          {badge}
        </div>

        {/* Title */}
        <h1
          className="text-[42px] leading-tight mb-5"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'white',
          }}
        >
          {title || defaultTitle}
        </h1>

        {/* Description */}
        {description && (
          <p
            className="text-base leading-relaxed mb-12 max-w-[420px]"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {description}
          </p>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3.5 text-sm"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {/* Icon Box */}
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    background: 'var(--color-primary-glow)',
                    border: '1px solid var(--color-primary-glow)',
                  }}
                >
                  {feature.icon}
                </div>

                {/* Text */}
                <div>
                  <strong style={{ color: 'rgba(255,255,255,0.95)' }}>{feature.title}</strong>
                  <br />
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS for accent color in title */}
      <style jsx>{`
        .accent {
          color: var(--color-primary-light);
        }
      `}</style>
    </div>
  )
}
