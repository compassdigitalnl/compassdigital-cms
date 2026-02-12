'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/Icon'
import type { SearchBarBlock as SearchBarType } from '@/payload-types'

export const SearchBarComponent: React.FC<SearchBarType> = ({
  style = 'standard',
  placeholder = 'Zoek producten, merken of artikelnummers...',
  showCategoryFilter = true,
  showAutocomplete = true,
  autocompleteLimit = 5,
  showPopularSearches = false,
  popularSearches,
  searchIn,
  buttonText = 'Zoeken',
}) => {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'Alle categorieën' }])

  const styleClasses = {
    hero: 'py-16 bg-gradient-to-br from-teal-50 to-blue-50',
    standard: 'py-8 bg-white',
    compact: 'py-4 bg-gray-50',
  }

  const inputSizeClasses = {
    hero: 'px-6 py-4 text-lg',
    standard: 'px-4 py-3',
    compact: 'px-4 py-2 text-sm',
  }

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/product-categories?limit=100')
        const data = await response.json()
        if (data.docs && Array.isArray(data.docs)) {
          setCategories([
            { id: 'all', name: 'Alle categorieën' },
            ...data.docs.map((cat: any) => ({ id: cat.id, name: cat.name })),
          ])
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Keep default categories
      }
    }

    if (showCategoryFilter) {
      fetchCategories()
    }
  }, [showCategoryFilter])

  // Fetch suggestions on query change
  useEffect(() => {
    if (!showAutocomplete || query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const searchResults: any[] = []

        // Build search query based on searchIn settings
        const searchSources = searchIn || ['products', 'categories']

        // Search products
        if (searchSources.includes('products')) {
          const productsResponse = await fetch(
            `/api/products?where[title][contains]=${encodeURIComponent(query)}&limit=${autocompleteLimit}`
          )
          const productsData = await productsResponse.json()
          if (productsData.docs) {
            productsData.docs.forEach((product: any) => {
              searchResults.push({
                type: 'product',
                name: product.title,
                sku: product.sku,
                slug: product.slug,
              })
            })
          }
        }

        // Search categories
        if (searchSources.includes('categories') && searchResults.length < autocompleteLimit) {
          const categoriesResponse = await fetch(
            `/api/product-categories?where[name][contains]=${encodeURIComponent(query)}&limit=${autocompleteLimit - searchResults.length}`
          )
          const categoriesData = await categoriesResponse.json()
          if (categoriesData.docs) {
            categoriesData.docs.forEach((cat: any) => {
              searchResults.push({
                type: 'category',
                name: cat.name,
                slug: cat.slug,
              })
            })
          }
        }

        // Search blog posts (if enabled)
        if (searchSources.includes('blog') && searchResults.length < autocompleteLimit) {
          const blogResponse = await fetch(
            `/api/blog-posts?where[title][contains]=${encodeURIComponent(query)}&limit=${autocompleteLimit - searchResults.length}`
          )
          const blogData = await blogResponse.json()
          if (blogData.docs) {
            blogData.docs.forEach((post: any) => {
              searchResults.push({
                type: 'blog',
                name: post.title,
                slug: post.slug,
              })
            })
          }
        }

        setSuggestions(searchResults.slice(0, autocompleteLimit))
        setShowSuggestions(true)
      } catch (error) {
        console.error('Search failed:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, showAutocomplete, autocompleteLimit, searchIn])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setShowSuggestions(false)

    // Build search URL with query parameters
    const params = new URLSearchParams()
    params.set('q', query)
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory)
    }

    // Navigate to shop with search filters
    router.push(`/shop?${params.toString()}`)
  }

  const handleSuggestionClick = (suggestion: any) => {
    setShowSuggestions(false)

    // Navigate based on suggestion type
    switch (suggestion.type) {
      case 'product':
        router.push(`/${suggestion.slug}`)
        break
      case 'category':
        router.push(`/${suggestion.slug}`)
        break
      case 'blog':
        router.push(`/blog/${suggestion.slug}`)
        break
      default:
        setQuery(suggestion.name)
        handleSearch({ preventDefault: () => {} } as React.FormEvent)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return 'Package'
      case 'category':
        return 'Folder'
      case 'brand':
        return 'Award'
      case 'blog':
        return 'FileText'
      default:
        return 'Search'
    }
  }

  return (
    <section className={styleClasses[style]}>
      <div className="container mx-auto px-4">
        <div className={`max-w-${style === 'hero' ? '4xl' : '3xl'} mx-auto`}>
          {style === 'hero' && (
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Vind wat u zoekt</h2>
              <p className="text-lg text-gray-600">
                Zoek door ons assortiment van 3000+ medische producten
              </p>
            </div>
          )}

          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-2">
              {/* Category Dropdown */}
              {showCategoryFilter && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`${inputSizeClasses[style]} border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white min-w-[180px]`}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="relative">
                  <Icon
                    name="Search"
                    size={style === 'hero' ? 24 : 20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder={placeholder}
                    className={`w-full ${inputSizeClasses[style]} ${showCategoryFilter ? 'pl-12' : 'pl-12'} pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500`}
                  />
                  {isLoading && (
                    <Icon
                      name="Loader"
                      size={20}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
                    />
                  )}
                </div>

                {/* Autocomplete Suggestions */}
                {showAutocomplete && showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                      >
                        <Icon name={getTypeIcon(suggestion.type)} size={18} className="text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{suggestion.name}</div>
                          {suggestion.sku && (
                            <div className="text-xs text-gray-500">SKU: {suggestion.sku}</div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{suggestion.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className={`${inputSizeClasses[style]} px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap`}
              >
                <Icon name="Search" size={style === 'hero' ? 24 : 20} />
                {style !== 'compact' && buttonText}
              </button>
            </div>

            {/* Popular Searches */}
            {showPopularSearches && popularSearches && popularSearches.length > 0 && (
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-gray-600">Populair:</span>
                {popularSearches.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setQuery(item.term || '')}
                    className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
                  >
                    {item.term}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
