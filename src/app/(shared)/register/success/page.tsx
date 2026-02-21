import Link from 'next/link'
import { CheckCircle, Mail, ArrowRight, Home } from 'lucide-react'

export const metadata = {
  title: 'Registratie geslaagd | Welkom',
  description: 'Je account is succesvol aangemaakt',
}

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-5">
          <Link href="/" className="text-2xl font-extrabold text-gray-900">
            Logo
          </Link>
        </div>
      </div>

      {/* Success Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Account aangemaakt!</h1>
            <p className="text-xl text-gray-600">
              Welkom bij ons platform. Je account is succesvol geregistreerd.
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
            {/* Email Verification Notice */}
            <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-xl border border-blue-100 mb-6">
              <div className="flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  Bevestigingsmail verzonden
                </h3>
                <p className="text-sm text-blue-700">
                  We hebben een bevestigingsmail gestuurd naar je e-mailadres. Klik op de link
                  in de mail om je account te activeren.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Volgende stappen:</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-700">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      <strong>Controleer je inbox</strong> voor de bevestigingsmail
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-700">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      <strong>Activeer je account</strong> via de link in de mail
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center text-xs font-bold text-teal-700">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">
                      <strong>Log in</strong> en ontdek ons volledige assortiment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Notice */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Geen mail ontvangen?</strong> Controleer je spam/ongewenste mail folder
                of{' '}
                <Link href="/contact/" className="text-teal-600 hover:text-teal-700 underline">
                  neem contact met ons op
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <span>Ga naar inlogpagina</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
            >
              <Home className="w-5 h-5" />
              <span>Terug naar home</span>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">Heb je vragen over je account?</p>
            <Link
              href="/contact/"
              className="text-teal-600 hover:text-teal-700 font-medium underline"
            >
              Neem contact met ons op
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
