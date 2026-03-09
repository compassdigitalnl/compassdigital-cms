'use client'

import type { KPICardsProps } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

const formatPercentage = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value / 100)

export function KPICards({ totalCustomers, activeCustomers, avgClv, churnRate }: KPICardsProps) {
  const cards = [
    {
      title: 'Totaal klanten',
      value: totalCustomers.toLocaleString('nl-NL'),
      subtitle: 'Met minimaal 1 bestelling',
      color: 'border-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Actieve klanten',
      value: activeCustomers.toLocaleString('nl-NL'),
      subtitle: `${totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}% van totaal (< 90 dagen)`,
      color: 'border-green-500',
      bg: 'bg-green-50',
    },
    {
      title: 'Gem. CLV',
      value: formatCurrency(avgClv),
      subtitle: 'Voorspelde klantwaarde',
      color: 'border-purple-500',
      bg: 'bg-purple-50',
    },
    {
      title: 'Churn risico',
      value: formatPercentage(churnRate),
      subtitle: 'Klanten met hoog risico',
      color: 'border-amber-500',
      bg: churnRate > 30 ? 'bg-red-50' : 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg border-l-4 ${card.color} ${card.bg} p-4 shadow-sm`}
        >
          <p className="text-sm font-medium text-gray-600">{card.title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="mt-1 text-xs text-gray-500">{card.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
