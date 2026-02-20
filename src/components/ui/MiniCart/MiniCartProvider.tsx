'use client'
import { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react'
import { useCart } from '@/contexts/CartContext'
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

  // Use CartContext for actual cart data
  const cartContext = useCart()

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), [])

  // Map CartContext items to MiniCart format
  const items = useMemo(() => {
    return cartContext.items.map((item) => ({
      id: String(item.id),
      emoji: undefined, // Not available in CartContext
      image: item.image,
      brand: '', // Not available in CartContext, could extract from parentProductTitle
      name: item.title,
      variant: item.parentProductTitle, // Use parent product as variant
      price: item.price,
      quantity: item.quantity,
    }))
  }, [cartContext.items])

  // Wrap CartContext methods to match MiniCart interface
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    cartContext.addItem({
      id: item.id,
      slug: '', // Not available from MiniCart
      title: item.name,
      price: item.price,
      stock: 999, // Assume in stock
      image: item.image,
    }, quantity)
  }, [cartContext])

  const removeItem = useCallback((id: string) => {
    cartContext.removeItem(id)
  }, [cartContext])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      cartContext.removeItem(id)
      return
    }
    cartContext.updateQuantity(id, quantity)
  }, [cartContext])

  const totalItems = cartContext.itemCount
  const subtotal = cartContext.total
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
