import React from 'react'
import Link from 'next/link'
import type { TradeInCTAProps } from './types'
import { TradeInFormWrapper } from './TradeInFormWrapper'

export function TradeInCTAComponent(props: TradeInCTAProps) {
  const {
    heading = 'Auto inruilen?',
    description,
    showForm = false,
  } = props

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div
          className="overflow-hidden rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #FF5722, #E65100)' }}
        >
          <div className={`p-8 md:p-12 ${showForm ? 'lg:flex lg:gap-12 lg:items-start' : 'text-center'}`}>
            {/* Text content */}
            <div className={showForm ? 'lg:flex-1' : ''}>
              <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl">
                {heading}
              </h2>

              {description && (
                <p className="mb-6 max-w-2xl text-lg text-white/80 leading-relaxed">
                  {description}
                </p>
              )}

              {!showForm && (
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/inruilen"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3.5 text-sm font-bold text-[#E65100] no-underline transition-transform hover:scale-105"
                  >
                    Bereken uw inruilwaarde
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-white/10"
                  >
                    Neem contact op
                  </Link>
                </div>
              )}

              {showForm && (
                <div className="hidden lg:block">
                  <div className="flex items-center gap-4 text-white/70">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-sm">Gratis taxatie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-sm">Vrijblijvend</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      <span className="text-sm">Binnen 24 uur reactie</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inline form */}
            {showForm && (
              <div className="mt-8 lg:mt-0 lg:w-[440px] lg:shrink-0">
                <TradeInFormWrapper />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
