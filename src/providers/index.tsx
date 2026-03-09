import { AuthProvider } from '@/providers/Auth'
import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'
import { CartProvider } from '@/branches/ecommerce/shared/contexts/CartContext'
import { isFeatureEnabled } from '@/lib/tenant/features'

// No-op CartProvider for sites without cart
function CartProviderWrapper({ children }: { children: React.ReactNode }) {
  if (isFeatureEnabled('cart') || isFeatureEnabled('checkout')) {
    return <CartProvider>{children}</CartProvider>
  }
  return <>{children}</>
}

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProviderWrapper>
          <HeaderThemeProvider>
            <SonnerProvider />
            {children}
          </HeaderThemeProvider>
        </CartProviderWrapper>
      </AuthProvider>
    </ThemeProvider>
  )
}
