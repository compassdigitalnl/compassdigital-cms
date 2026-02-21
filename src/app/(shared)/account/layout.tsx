import type { ReactNode } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { AccountNav } from '@/branches/shared/components/features/account/Account/AccountNav'

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login?redirect=/account')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-7 items-start">
          {/* Sidebar Navigation */}
          <AccountNav user={user} />

          {/* Main Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
