'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { MiniCart } from './MiniCart'

export interface CartItem {
  id: string
  emoji?: string
  image?: string
  brand: string
  name: string
  variant?: string
  price: number
  quantity: number
}

interface MiniCartContextValue {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  totalItems: number
  subtotal: number
  freeShippingProgress: number
}

const MiniCartContext = createContext<MiniCartContextValue | undefined>(undefined)

const FREE_SHIPPING_THRESHOLD = 50 // €50 for free shipping

export function MiniCartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }, [removeItem])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <MiniCartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        items,
        addItem,
        removeItem,
        updateQuantity,
        totalItems,
        subtotal,
        freeShippingProgress,
      }}
    >
      {children}
      <MiniCart />
    </MiniCartContext.Provider>
  )
}

export function useMiniCart() {
  const context = useContext(MiniCartContext)
  if (!context) {
    throw new Error('useMiniCart must be used within MiniCartProvider')
  }
  return context
}
