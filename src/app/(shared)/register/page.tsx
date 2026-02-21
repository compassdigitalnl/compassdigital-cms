import { Suspense } from 'react'
import { RegistrationForm } from './RegistrationForm'
import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

export const metadata = {
  title: 'Klant worden | Registreren',
  description: 'Registreer voor een zakelijk account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-gray-900">
            Logo
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Hulp nodig?
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <Suspense fallback={<FormSkeleton />}>
        <RegistrationForm />
      </Suspense>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse mb-8" />
        <div className="bg-white rounded-2xl p-8">
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
