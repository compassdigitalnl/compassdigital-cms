interface VendorStatsBarProps {
  productCount: number
  categoryCount: number
  rating: number | null
  reviewCount: number
  stockAvailability: number | null
  deliveryTime: string | null
}

export function VendorStatsBar({
  productCount,
  categoryCount,
  rating,
  reviewCount,
  stockAvailability,
  deliveryTime,
}: VendorStatsBarProps) {
  const stats = [
    { label: 'Producten', value: productCount || 0 },
    { label: 'Categorieën', value: categoryCount || 0 },
    {
      label: 'Beoordeling',
      value: rating ? `${rating.toFixed(1)} (${reviewCount})` : '—',
    },
    {
      label: 'Op voorraad',
      value: stockAvailability != null ? `${stockAvailability}%` : '—',
    },
    { label: 'Levertijd', value: deliveryTime || '—' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-7">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl p-4 text-center border"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div
            className="text-2xl font-extrabold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            {stat.value}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
