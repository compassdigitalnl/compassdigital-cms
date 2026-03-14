import React from 'react'
import Link from 'next/link'
import {
  Smartphone,
  BookOpen,
  Zap,
  BookmarkCheck,
  ArrowRight,
} from 'lucide-react'
import type { NoSubscriptionUpsellProps } from './types'

const benefits = [
  {
    icon: Smartphone,
    title: 'Overal lezen',
    description: 'Lees op je telefoon, tablet of computer',
  },
  {
    icon: BookOpen,
    title: 'Alle edities',
    description: 'Toegang tot het volledige digitale archief',
  },
  {
    icon: Zap,
    title: 'Direct beschikbaar',
    description: 'Nieuwe edities meteen online beschikbaar',
  },
  {
    icon: BookmarkCheck,
    title: 'Bladwijzers & voortgang',
    description: 'Ga verder waar je gebleven was',
  },
]

export const NoSubscriptionUpsell: React.FC<NoSubscriptionUpsellProps> = ({
  className = '',
}) => {
  return (
    <section
      className={`overflow-hidden rounded-2xl ${className}`}
      style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
    >
      <div className="relative px-6 py-10 md:px-12 md:py-14">
        {/* Decorative circles */}
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative z-10">
          <h2 className="mb-2 font-heading text-xl font-extrabold text-white md:text-2xl">
            Je hebt nog geen digitaal abonnement
          </h2>
          <p className="mb-8 max-w-lg text-sm text-white/70">
            Met een digitaal abonnement krijg je toegang tot alle edities van je favoriete
            tijdschriften. Lees wanneer en waar je wilt.
          </p>

          {/* Benefits grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
                  <benefit.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="mb-0.5 text-[13px] font-bold text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-[12px] text-white/60">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/abonnement"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold no-underline transition-transform hover:scale-[1.02]"
            style={{ color: '#7c3aed' }}
          >
            Bekijk abonnementen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
