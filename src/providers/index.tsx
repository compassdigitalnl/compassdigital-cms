import { AuthProvider } from '@/providers/Auth'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'
import { CartProvider } from '@/branches/ecommerce/contexts/CartContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <HeaderThemeProvider>
            <SonnerProvider />
            {children}
          </HeaderThemeProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
