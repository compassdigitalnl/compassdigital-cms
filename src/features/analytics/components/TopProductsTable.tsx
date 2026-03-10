'use client'

interface TopProduct {
  rank: number
  name: string
  sku: string
  quantity: number
  revenue: number
}

interface TopProductsTableProps {
  data: TopProduct[]
  loading?: boolean
}

function formatEUR(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
}

const rankColors: Record<number, React.CSSProperties> = {
  1: { background: '#fef3c7', color: '#92400e' },
  2: { background: '#f3f4f6', color: '#4b5563' },
  3: { background: '#fde8d8', color: '#9a3412' },
}

export function TopProductsTable({ data, loading }: TopProductsTableProps) {
  if (loading) {
    return (
      <div style={{ ...cardStyle, padding: '1.25rem' }}>
        <div style={{ height: '1.25rem', width: '10rem', background: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '1rem' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: '2.5rem', background: '#f3f4f6', borderRadius: '0.25rem', marginBottom: '0.5rem' }} />
        ))}
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', padding: '1.25rem 1.25rem 0' }}>Top producten</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr>
              <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>#</th>
              <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>Product</th>
              <th style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>Aantal</th>
              <th style={{ padding: '0.625rem 1rem', textAlign: 'right', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#9ca3af', fontWeight: 600, borderBottom: '1px solid #f3f4f6' }}>Omzet</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr key={product.sku || index} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '0.625rem 1rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    ...(rankColors[product.rank] || { background: '#f9fafb', color: '#6b7280' }),
                  }}>
                    {product.rank}
                  </span>
                </td>
                <td style={{ padding: '0.625rem 1rem' }}>
                  {product.name}
                  {product.sku && (
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.6875rem', color: '#9ca3af', fontFamily: 'monospace' }}>
                      {product.sku}
                    </span>
                  )}
                </td>
                <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatCount(product.quantity)}
                </td>
                <td style={{ padding: '0.625rem 1rem', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {formatEUR(product.revenue)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem 1rem', textAlign: 'center', color: '#9ca3af' }}>
                  Geen productdata beschikbaar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
