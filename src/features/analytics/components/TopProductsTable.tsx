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

export function TopProductsTable({ data, loading }: TopProductsTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded mb-2 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Top producten</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 pr-3 text-left font-medium text-gray-500 w-8">#</th>
              <th className="pb-3 pr-3 text-left font-medium text-gray-500">Product</th>
              <th className="pb-3 pr-3 text-left font-medium text-gray-500 hidden md:table-cell">SKU</th>
              <th className="pb-3 pr-3 text-right font-medium text-gray-500">Aantal</th>
              <th className="pb-3 text-right font-medium text-gray-500">Omzet</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr
                key={product.sku}
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="py-2.5 pr-3 text-gray-400 font-medium">{product.rank}</td>
                <td className="py-2.5 pr-3 text-gray-900 font-medium truncate max-w-[200px]">
                  {product.name}
                </td>
                <td className="py-2.5 pr-3 text-gray-500 hidden md:table-cell font-mono text-xs">
                  {product.sku}
                </td>
                <td className="py-2.5 pr-3 text-right text-gray-700 tabular-nums">
                  {formatCount(product.quantity)}
                </td>
                <td className="py-2.5 text-right text-gray-900 font-medium tabular-nums">
                  {formatEUR(product.revenue)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
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
