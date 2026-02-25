/**
 * Pagination Component - Usage Examples
 *
 * This file demonstrates how to use the Pagination component
 * in various scenarios.
 */

'use client'

import * as React from 'react'
import { Pagination } from './Component'

// Example 1: Basic Pagination
export function BasicPaginationExample() {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Basic Pagination</h2>
      <Pagination currentPage={currentPage} totalPages={8} onPageChange={setCurrentPage} />
    </div>
  )
}

// Example 2: With Result Count
export function WithCountExample() {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Pagination with Result Count</h2>
      <Pagination
        currentPage={currentPage}
        totalPages={8}
        totalItems={186}
        itemsPerPage={24}
        variant="with-count"
        showCount={true}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

// Example 3: Compact Variant (Mobile)
export function CompactExample() {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Compact Pagination (Mobile)</h2>
      <Pagination
        currentPage={currentPage}
        totalPages={8}
        variant="compact"
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

// Example 4: With URL Sync (Next.js App Router)
export function WithURLSyncExample() {
  // In a real app, use:
  // const router = useRouter()
  // const searchParams = useSearchParams()
  // const currentPage = parseInt(searchParams.get('page') || '1')

  const [currentPage, setCurrentPage] = React.useState(1)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // In real app:
    // const params = new URLSearchParams(searchParams)
    // params.set('page', page.toString())
    // router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Pagination with URL Sync</h2>
      <Pagination
        currentPage={currentPage}
        totalPages={8}
        totalItems={186}
        variant="with-count"
        onPageChange={handlePageChange}
      />
    </div>
  )
}

// Example 5: SEO-Friendly with Links
export function SEOFriendlyExample() {
  const [currentPage, setCurrentPage] = React.useState(1)

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">SEO-Friendly Pagination (with Links)</h2>
      <Pagination
        currentPage={currentPage}
        totalPages={8}
        onPageChange={setCurrentPage}
        getPageUrl={(page) => `/products?page=${page}`}
      />
    </div>
  )
}

// Example 6: Product Archive with Pagination
export function ProductArchiveExample() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 24

  // Mock data
  const products = Array.from({ length: 186 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
  }))

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Product Archive with Pagination</h2>

      {/* Product Grid */}
      <div className="grid grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            {product.name}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={products.length}
        itemsPerPage={itemsPerPage}
        variant="with-count"
        showCount={true}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

// Example 7: Responsive Pagination (switches variant based on screen size)
export function ResponsivePaginationExample() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Responsive Pagination</h2>
      <Pagination
        currentPage={currentPage}
        totalPages={8}
        totalItems={186}
        variant={isMobile ? 'compact' : 'with-count'}
        showCount={!isMobile}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

// Example 8: All Examples Combined
export function AllPaginationExamples() {
  return (
    <div className="space-y-16 p-8">
      <h1 className="text-3xl font-bold">Pagination Component Examples</h1>

      <BasicPaginationExample />
      <WithCountExample />
      <CompactExample />
      <WithURLSyncExample />
      <SEOFriendlyExample />
      <ProductArchiveExample />
      <ResponsivePaginationExample />
    </div>
  )
}
