import React from 'react'
import { Star } from 'lucide-react'

export async function ExperienceSocialProofComponent(props: any) {
  const {
    heading,
    stats,
    testimonials,
    layout = 'cards',
  } = props

  const hasStats = stats && stats.length > 0
  const hasTestimonials = testimonials && testimonials.length > 0

  if (!hasStats && !hasTestimonials) return null

  return (
    <section className="py-12 md:py-16 px-4" style={{ backgroundColor: 'var(--color-grey-light, #f9fafb)' }}>
      <div className="container mx-auto">
        {/* Heading */}
        {heading && (heading.badge || heading.title) && (
          <div className="text-center mb-12">
            {heading.badge && (
              <span
                className="inline-flex px-4 py-2 rounded-full text-sm font-semibold mb-4"
                style={{
                  backgroundColor: 'var(--color-teal-glow, rgba(0,163,155,0.1))',
                  color: 'var(--color-teal, #00a39b)',
                }}
              >
                {heading.badge}
              </span>
            )}
            {heading.title && (
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-serif, Georgia, serif)',
                }}
              >
                {heading.title}
              </h2>
            )}
          </div>
        )}

        {/* Stats row */}
        {hasStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat: any, i: number) => (
              <div key={i} className="text-center">
                {stat.icon && <span className="text-3xl mb-2 block">{stat.icon}</span>}
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: 'var(--color-teal, #00a39b)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials */}
        {hasTestimonials && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t: any, i: number) => {
              const avatarUrl = typeof t.avatar === 'object' && t.avatar?.url ? t.avatar.url : null
              const initials = t.author
                ? t.author.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                : '?'

              return (
                <div
                  key={i}
                  className="bg-white rounded-xl border p-6 shadow-sm"
                  style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
                >
                  {/* Rating */}
                  {t.rating && (
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-4 w-4"
                          fill={s < t.rating ? '#f59e0b' : 'none'}
                          stroke={s < t.rating ? '#f59e0b' : '#d1d5db'}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  )}

                  {/* Quote */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">"{t.quote}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
                      >
                        {initials}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {t.author}
                      </div>
                      {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
