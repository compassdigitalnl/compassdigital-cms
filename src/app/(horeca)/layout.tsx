import type { Metadata } from 'next'
import { ThemeProvider } from '@/branches/shared/components/utilities/ThemeProvider'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Bistro de Gracht — Restaurant Amsterdam',
  description:
    'Een culinaire beleving aan de Amsterdamse grachten. Seizoensgebonden menu, uitgebreide wijnkaart en een warm onthaal.',
}

export default function HorecaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,500;0,700;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
