import { Suspense } from 'react'
import { SearchResults } from './SearchResults'

export const metadata = {
  title: 'Zoekresultaten',
  description: 'Doorzoek ons assortiment',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
