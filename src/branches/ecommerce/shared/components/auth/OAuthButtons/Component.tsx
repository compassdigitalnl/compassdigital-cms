'use client'

/**
 * OAuthButtons - Social login buttons (Google, Facebook, Apple)
 *
 * Features:
 * - Multiple OAuth providers (Google, Facebook, Apple, etc.)
 * - White buttons with grey borders
 * - Hover effect: lift + border darken
 * - SVG provider icons
 * - Optional divider ("of met e-mail")
 * - Accessible (aria-label, keyboard navigation)
 *
 * @component
 * @example
 * <OAuthButtons
 *   providers={['google']}
 *   onProviderClick={(provider) => handleOAuth(provider)}
 * />
 *
 * @example
 * <OAuthButtons
 *   providers={['google', 'facebook', 'apple']}
 *   onProviderClick={handleOAuthLogin}
 *   showDivider
 *   dividerText="of met e-mail"
 * />
 */

export type OAuthProvider = 'google' | 'facebook' | 'apple'

export interface OAuthButtonsProps {
  providers?: OAuthProvider[]
  onProviderClick: (provider: OAuthProvider) => void
  showDivider?: boolean
  dividerText?: string
  className?: string
}

const providerConfig: Record<
  OAuthProvider,
  { label: string; icon: React.ReactNode; ariaLabel: string }
> = {
  google: {
    label: 'Inloggen met Google',
    ariaLabel: 'Log in met Google account',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  facebook: {
    label: 'Inloggen met Facebook',
    ariaLabel: 'Log in met Facebook account',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
        <path
          fill="#1877F2"
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
    ),
  },
  apple: {
    label: 'Inloggen met Apple',
    ariaLabel: 'Log in met Apple account',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
        <path
          fill="#000000"
          d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        />
      </svg>
    ),
  },
}

export function OAuthButtons({
  providers = ['google'],
  onProviderClick,
  showDivider = true,
  dividerText = 'of met e-mail',
  className = '',
}: OAuthButtonsProps) {
  return (
    <>
      <div className={`flex flex-col gap-2.5 mb-6 ${className}`}>
        {providers.map((provider) => {
          const config = providerConfig[provider]

          return (
            <button
              key={provider}
              type="button"
              onClick={() => onProviderClick(provider)}
              aria-label={config.ariaLabel}
              className="
                flex items-center justify-center gap-2.5 w-full
                px-4 py-3.5 rounded-lg
                text-sm font-semibold
                transition-all duration-200
                hover:-translate-y-0.5
                focus:outline-none focus:ring-2 focus:ring-offset-2
              "
              style={{
                background: 'var(--color-background)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-text-secondary)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(10,22,40,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {config.icon}
              <span>{config.label}</span>
            </button>
          )
        })}
      </div>

      {showDivider && dividerText && (
        <div
          className="flex items-center gap-4 mb-6 text-xs font-semibold uppercase tracking-wider"
          style={{
            color: 'var(--color-text-secondary)',
          }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: 'var(--color-border)' }}
          />
          <span>{dividerText}</span>
          <div
            className="flex-1 h-px"
            style={{ background: 'var(--color-border)' }}
          />
        </div>
      )}
    </>
  )
}
