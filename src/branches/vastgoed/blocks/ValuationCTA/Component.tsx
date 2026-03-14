import React from 'react'
import type { ValuationCTAProps } from './types'

export function ValuationCTAComponent(props: ValuationCTAProps) {
  const {
    heading = 'Wat is uw woning waard?',
    description,
    buttonText = 'Gratis waardebepaling aanvragen',
    showTrustBadges = true,
  } = props

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="container mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-12 text-center md:px-12 md:py-16"
          style={{ background: 'linear-gradient(135deg, #1a1f3d, #2d3352)' }}
        >
          {/* Decorative glow */}
          <div
            className="pointer-events-none absolute -right-[10%] -top-[50%] h-[280px] w-[280px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(92,107,192,0.15), transparent 60%)',
            }}
          />

          <div className="relative z-10">
            <h2 className="mb-3 text-2xl font-extrabold text-white md:text-3xl lg:text-4xl">
              {heading}
            </h2>

            {description && (
              <p className="mx-auto mb-8 max-w-xl text-base text-white/70 md:text-lg">
                {description}
              </p>
            )}

            <a
              href="/waardebepaling"
              className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-[15px] font-bold text-white no-underline shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #3F51B5, #5C6BC0)',
                boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
              }}
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {buttonText}
            </a>

            {showTrustBadges && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  100% gratis
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Binnen 24 uur reactie
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Privacy gegarandeerd
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                  NVM gecertificeerd
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
