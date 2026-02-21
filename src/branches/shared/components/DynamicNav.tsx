import type { Navigation, ProductCategory } from '@/payload-types'
import { NavBar } from './NavBar'

type Props = {
  navigation?: Navigation | null
}

/**
 * DynamicNav Component (Server Component)
 *
 * Fetches product categories when mode = 'categories' or 'hybrid'
 * Passes data to NavBar client component for interactivity
 *
 * Framework principle: "Build reusable components" - payload-website-framework-b2b-b2c.md
 */
export async function DynamicNav({ navigation }: Props) {
  if (!navigation) {
    return null
  }

  const mode = navigation.mode || 'manual'
  let categories: ProductCategory[] = []

  // Fetch categories for category-driven navigation
  if (mode === 'categories' || mode === 'hybrid') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      const categorySettings = navigation.categorySettings || {}
      const maxItems = categorySettings.maxItems || 10

      // Build query parameters
      const params = new URLSearchParams({
        'where[parent][exists]': 'false', // Only root categories
        'where[showInNavigation][equals]': 'true', // Only categories visible in nav
        'where[visible][equals]': 'true', // Only visible categories
        sort: 'navigationOrder', // Sort by navigationOrder field
        limit: maxItems.toString(),
        depth: '0', // No need to populate relations for nav bar (subcategories fetched on hover)
      })

      const response = await fetch(`${baseUrl}/api/product-categories?${params.toString()}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        categories = data.docs || []
      } else {
        console.error('Failed to fetch product categories:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching product categories:', error)
    }
  }

  // If manual mode and no items, show nothing
  if (mode === 'manual' && (!navigation.items || navigation.items.length === 0)) {
    return null
  }

  // If categories mode and no categories, show nothing
  if (mode === 'categories' && categories.length === 0) {
    return null
  }

  // Prepare props for NavBar
  const categorySettings = navigation.categorySettings || {
    showIcons: true,
    megaMenuStyle: 'subcategories',
    showProductCount: true,
    maxProductsInMegaMenu: 3,
  }

  const specialItems = navigation.specialItems || []
  const manualItems = navigation.items || []
  const ctaButton = navigation.ctaButton || { show: false }

  return (
    <NavBar
      categories={categories}
      specialItems={specialItems}
      manualItems={manualItems}
      ctaButton={ctaButton}
      categorySettings={categorySettings}
      mode={mode}
    />
  )
}
