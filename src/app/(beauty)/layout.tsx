import type { ReactNode } from 'react'
import { Footer } from '@/branches/shared/components/layout/footer/Footer'
import { ThemeProvider } from '@/branches/shared/components/utilities/ThemeProvider'
import { ToastProvider } from '@/branches/shared/components/ui/Toast'
import { HeaderClient } from '@/branches/shared/components/layout/header/Header/index.client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function BeautyLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload({ config: configPromise })

  const theme = await payload.findGlobal({
    slug: 'theme',
  })

  const settings = await payload.findGlobal({
    slug: 'settings',
  })

  const header = await payload.findGlobal({
    slug: 'header',
  })

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider position="bottom-right">
        <div className="flex min-h-screen flex-col">
          <HeaderClient header={header} />
          <main className="flex-1">{children}</main>
          <Footer footer={{}} />
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
