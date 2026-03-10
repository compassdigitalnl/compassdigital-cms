'use client'

import type { KPICardsProps } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

const formatPercentage = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100)

interface CardConfig {
  title: string
  value: string
  subtitle: string
  borderColor: string
  bgGradient: string
}

export function KPICards({ totalCustomers, activeCustomers, avgClv, churnRate }: KPICardsProps) {
  const cards: CardConfig[] = [
    {
      title: 'Totaal klanten',
      value: totalCustomers.toLocaleString('nl-NL'),
      subtitle: 'Met minimaal 1 bestelling',
      borderColor: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, #eff6ff, #fff)',
    },
    {
      title: 'Actieve klanten',
      value: activeCustomers.toLocaleString('nl-NL'),
      subtitle: `${totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}% van totaal (< 90 dagen)`,
      borderColor: '#10b981',
      bgGradient: 'linear-gradient(135deg, #ecfdf5, #fff)',
    },
    {
      title: 'Gem. CLV',
      value: formatCurrency(avgClv),
      subtitle: 'Voorspelde klantwaarde',
      borderColor: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, #f5f3ff, #fff)',
    },
    {
      title: 'Churn risico',
      value: formatPercentage(churnRate),
      subtitle: 'Klanten met hoog risico',
      borderColor: churnRate > 30 ? '#ef4444' : '#f59e0b',
      bgGradient: churnRate > 30 ? 'linear-gradient(135deg, #fef2f2, #fff)' : 'linear-gradient(135deg, #fffbeb, #fff)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: card.bgGradient,
            borderRadius: '0.75rem',
            padding: '1.25rem',
            borderLeft: `4px solid ${card.borderColor}`,
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280' }}>{card.title}</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a2e', marginTop: '0.125rem' }}>{card.value}</div>
          <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.25rem' }}>{card.subtitle}</div>
        </div>
      ))}
    </div>
  )
}
