import React from 'react'
import Link from 'next/link'
import { ServiceCard } from '@/branches/professional-services/components/ServiceCard'
import type { ServicesArchiveProps } from './types'

export function ServicesArchiveTemplate({ services, totalPages, currentPage }: ServicesArchiveProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-navy">Dienstverlening</span>
        </nav>
      </div>

      <section className="bg-gradient-to-br from-secondary to-secondary/90 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-3xl text-white md:text-4xl lg:text-5xl">Onze diensten</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Van strategisch advies tot uitvoering — wij ondersteunen uw bedrijf bij elke zakelijke uitdaging.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{services.length}</div>
              <div className="text-sm text-white/60">Diensten</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} variant="default" showCTA />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-grey-mid">Geen diensten gevonden.</div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={'/dienstverlening' + (i > 0 ? '?page=' + (i + 1) : '')}
                className={
                  'flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ' +
                  (currentPage === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-grey-light text-grey-dark hover:bg-grey')
                }
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        <section className="mt-16 rounded-2xl bg-gradient-to-br from-navy to-navy-light p-8 text-center md:p-12">
          <h2 className="font-display text-2xl text-white md:text-3xl">Niet gevonden wat u zoekt?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Neem contact op voor een vrijblijvend adviesgesprek over uw situatie.
          </p>
          <Link
            href="/adviesgesprek-aanvragen"
            className="btn btn-primary mt-6 inline-flex items-center gap-2"
          >
            Plan een adviesgesprek
          </Link>
        </section>
      </div>
    </div>
  )
}

export default ServicesArchiveTemplate
