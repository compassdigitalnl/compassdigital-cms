'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: number | string
  slug: string
  title: string
  price: number // Base price (backward compatible)
  unitPrice?: number // Calculated price after discounts (fallback to price if not set)
  quantity: number
  stock: number
  sku?: string
  ean?: string // NEW: EAN barcode
  image?: string // NEW: Product image URL
  parentProductId?: number | string // NEW: For grouped products
  parentProductTitle?: string // NEW: Parent product name
  minOrderQuantity?: number // NEW: B2B MOQ
  orderMultiple?: number // NEW: B2B order multiple
  maxOrderQuantity?: number // NEW: B2B max quantity
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  addGroupedItems: (
    items: Array<Omit<CartItem, 'quantity'> & { quantity?: number }>,
  ) => void
  removeItem: (id: number | string) => void
  updateQuantity: (id: number | string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  /**
   * Add single item to cart
   */
  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => String(i.id) === String(item.id))

      if (existing) {
        // Increase quantity if item exists
        const increment = item.quantity || 1
        let newQuantity = existing.quantity + increment

        // Respect MOQ and order multiples
        const minQty = item.minOrderQuantity || 1
        const multiple = item.orderMultiple || 1
        const maxQty = item.maxOrderQuantity || item.stock

        // Ensure minimum
        newQuantity = Math.max(newQuantity, minQty)

        // Ensure multiple
        if (multiple > 1) {
          newQuantity = Math.ceil(newQuantity / multiple) * multiple
        }

        // Ensure max and stock
        newQuantity = Math.min(newQuantity, maxQty, item.stock)

        return prev.map((i) => (String(i.id) === String(item.id) ? { ...i, quantity: newQuantity } : i))
      }

      // Add new item with initial quantity
      const initialQuantity = item.quantity || item.minOrderQuantity || 1
      return [...prev, { ...item, quantity: initialQuantity }]
    })
  }

  /**
   * Add multiple items at once (for grouped products)
   */
  const addGroupedItems = (
    newItems: Array<Omit<CartItem, 'quantity'> & { quantity?: number }>,
  ) => {
    if (newItems.length === 0) return

    setItems((prev) => {
      let updated = [...prev]

      for (const item of newItems) {
        const existing = updated.find((i) => String(i.id) === String(item.id))
        const quantity = item.quantity || item.minOrderQuantity || 1

        if (existing) {
          // Update existing item quantity
          let newQuantity = existing.quantity + quantity

          // Respect MOQ and order multiples
          const minQty = item.minOrderQuantity || 1
          const multiple = item.orderMultiple || 1
          const maxQty = item.maxOrderQuantity || item.stock

          newQuantity = Math.max(newQuantity, minQty)

          if (multiple > 1) {
            newQuantity = Math.ceil(newQuantity / multiple) * multiple
          }

          newQuantity = Math.min(newQuantity, maxQty, item.stock)

          updated = updated.map((i) => (String(i.id) === String(item.id) ? { ...i, quantity: newQuantity } : i))
        } else {
          // Add new item
          updated.push({ ...item, quantity })
        }
      }

      return updated
    })
  }

  const removeItem = (id: number | string) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(id)))
  }

  /**
   * Update quantity with MOQ and order multiple validation
   */
  const updateQuantity = (id: number | string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (String(item.id) !== String(id)) return item

          let newQty = quantity
          const minQty = item.minOrderQuantity || 1
          const multiple = item.orderMultiple || 1
          const maxQty = item.maxOrderQuantity || item.stock

          // Ensure minimum
          newQty = Math.max(newQty, minQty)

          // Ensure multiple
          if (multiple > 1) {
            newQty = Math.round(newQty / multiple) * multiple
            // If rounding down goes below MOQ, round up
            if (newQty < minQty) {
              newQty = multiple
            }
          }

          // Ensure max and stock
          newQty = Math.min(newQty, maxQty, item.stock)

          return { ...item, quantity: newQty }
        })
        .filter((item) => item.quantity > 0), // Remove items with 0 quantity
    )
  }

  const clearCart = () => {
    setItems([])
  }

  // Calculate total using unitPrice if available, fallback to price for backward compatibility
  const total = items.reduce((sum, item) => {
    const pricePerUnit = item.unitPrice ?? item.price
    return sum + pricePerUnit * item.quantity
  }, 0)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addGroupedItems,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
