'use client'

import { useState, useCallback } from 'react'

export type Category = {
  id: string
  name: string
  slug: string
  productCount?: number
  icon?: string
}

type UseCategoryNavigationReturn = {
  rootCategories: Category[]
  l2Categories: Category[]
  l3Categories: Category[]
  activeL1: string | null
  activeL2: string | null
  loading: boolean
  error: string | null
  fetchRootCategories: () => Promise<void>
  fetchL2Categories: (parentId: string) => Promise<void>
  fetchL3Categories: (parentId: string) => Promise<void>
  setActiveL1: (id: string | null) => void
  setActiveL2: (id: string | null) => void
  handleL1Select: (categoryId: string) => void
  handleL2Select: (categoryId: string) => void
}

export function useCategoryNavigation(): UseCategoryNavigationReturn {
  const [rootCategories, setRootCategories] = useState<Category[]>([])
  const [l2Categories, setL2Categories] = useState<Category[]>([])
  const [l3Categories, setL3Categories] = useState<Category[]>([])
  const [activeL1, setActiveL1] = useState<string | null>(null)
  const [activeL2, setActiveL2] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRootCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        '/api/product-categories?where[parent][exists]=false&where[showInNavigation][equals]=true&where[visible][equals]=true&sort=navigationOrder&limit=10&depth=0',
      )
      if (!res.ok) {
        setError(`API Error: ${res.status} ${res.statusText}`)
        return
      }
      const data = await res.json()
      if (data.docs && data.docs.length > 0) {
        setRootCategories(data.docs)
        setActiveL1(data.docs[0].id)
        // Auto-fetch L2 for first category
        await fetchL2ForParent(data.docs[0].id)
      } else {
        setError('No categories configured')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchL2ForParent = async (parentId: string) => {
    try {
      const res = await fetch(
        `/api/product-categories?where[parent][equals]=${parentId}&where[visible][equals]=true&sort=order&limit=20&depth=0`,
      )
      const data = await res.json()
      setL2Categories(data.docs || [])
      if (data.docs && data.docs.length > 0) {
        setActiveL2(data.docs[0].id)
        await fetchL3ForParent(data.docs[0].id)
      } else {
        setL3Categories([])
        setActiveL2(null)
      }
    } catch {
      // Silently fail for subcategories
    }
  }

  const fetchL3ForParent = async (parentId: string) => {
    try {
      const res = await fetch(
        `/api/product-categories?where[parent][equals]=${parentId}&where[visible][equals]=true&sort=order&limit=20&depth=0`,
      )
      const data = await res.json()
      setL3Categories(data.docs || [])
    } catch {
      // Silently fail
    }
  }

  const fetchL2Categories = useCallback(async (parentId: string) => {
    await fetchL2ForParent(parentId)
  }, [])

  const fetchL3Categories = useCallback(async (parentId: string) => {
    await fetchL3ForParent(parentId)
  }, [])

  const handleL1Select = useCallback((categoryId: string) => {
    setActiveL1(categoryId)
    fetchL2ForParent(categoryId)
  }, [])

  const handleL2Select = useCallback((categoryId: string) => {
    setActiveL2(categoryId)
    fetchL3ForParent(categoryId)
  }, [])

  return {
    rootCategories,
    l2Categories,
    l3Categories,
    activeL1,
    activeL2,
    loading,
    error,
    fetchRootCategories,
    fetchL2Categories,
    fetchL3Categories,
    setActiveL1,
    setActiveL2,
    handleL1Select,
    handleL2Select,
  }
}
