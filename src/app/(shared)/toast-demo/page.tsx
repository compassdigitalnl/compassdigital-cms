'use client'

import { useToast } from '@/branches/shared/components/ui/Toast'
import { CheckCircle, AlertCircle, Info, ShoppingCart, Sparkles } from 'lucide-react'

export default function ToastDemoPage() {
  const { showToast, showSuccessToast, showErrorToast, showAddToCartToast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-navy-900 mb-2">
            Toast Notifications Demo
          </h1>
          <p className="text-gray-600">
            Sprint 4 - C17: Volledig geïmplementeerde toast notification component met
            auto-dismiss en progress bar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Success Toast */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-navy-900">Success Toast</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Groene indicator met checkmark icon. Perfect voor succesvolle acties.
            </p>
            <button
              onClick={() =>
                showSuccessToast(
                  'Bestelling geplaatst',
                  'Je ontvangt een bevestiging per e-mail.',
                )
              }
              className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all"
            >
              Toon Success
            </button>
          </div>

          {/* Error Toast */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-navy-900">Error Toast</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Rode indicator met alert icon. Voor foutmeldingen en waarschuwingen.
            </p>
            <button
              onClick={() =>
                showErrorToast(
                  'Betaling mislukt',
                  'Controleer je betaalgegevens en probeer opnieuw.',
                )
              }
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
            >
              Toon Error
            </button>
          </div>

          {/* Info Toast */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-navy-900">Info Toast</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Neutrale informatieve melding zonder specifieke status indicator.
            </p>
            <button
              onClick={() =>
                showToast({
                  type: 'info',
                  title: 'Nieuwe functies beschikbaar',
                  description: 'Bekijk de nieuwste updates in je account.',
                })
              }
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
            >
              Toon Info
            </button>
          </div>

          {/* Add to Cart Toast */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-bold text-navy-900">Add to Cart Toast</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Speciale variant voor winkelwagen met product info en action buttons.
            </p>
            <button
              onClick={() =>
                showAddToCartToast({
                  name: 'Peha-soft Nitrile Handschoenen',
                  emoji: '🧤',
                  meta: 'Maat L - Doos van 100 stuks',
                  quantity: 2,
                })
              }
              className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all"
            >
              Toon Add to Cart
            </button>
          </div>

          {/* Custom Duration */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-bold text-navy-900">Custom Duration</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Toast met custom display tijd (10 seconden). Progress bar past automatisch
              aan.
            </p>
            <button
              onClick={() =>
                showToast({
                  type: 'success',
                  title: 'Langere melding',
                  description: 'Deze toast blijft 10 seconden zichtbaar.',
                  duration: 10000,
                })
              }
              className="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
            >
              Toon 10s Toast
            </button>
          </div>

          {/* Multiple Toasts */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-navy-900">Multiple Toasts</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Toon meerdere toasts tegelijk. Ze stapelen netjes boven elkaar.
            </p>
            <button
              onClick={() => {
                showSuccessToast('Eerste melding', 'Dit is toast #1')
                setTimeout(() => showSuccessToast('Tweede melding', 'Dit is toast #2'), 500)
                setTimeout(
                  () => showSuccessToast('Derde melding', 'Dit is toast #3'),
                  1000,
                )
              }}
              className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all"
            >
              Toon 3 Toasts
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-navy-900 mb-4">
            ✨ Toast Features (Sprint 4 - C17)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Auto-dismiss</strong>
                <p className="text-gray-600">Verdwijnt automatisch na 5s (instelbaar)</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Progress bar</strong>
                <p className="text-gray-600">Visuele countdown indicator</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Slide-in animatie</strong>
                <p className="text-gray-600">Smooth cubic-bezier transition</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Variants</strong>
                <p className="text-gray-600">Success, error, info, add-to-cart</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Action buttons</strong>
                <p className="text-gray-600">Primair + outline button support</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Stack support</strong>
                <p className="text-gray-600">Meerdere toasts tegelijk tonen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-8 bg-navy-900 border border-gray-800 rounded-2xl p-6 overflow-x-auto">
          <h3 className="text-lg font-bold text-white mb-4">💻 Usage Example</h3>
          <pre className="text-sm text-green-400 font-mono">
            <code>{`import { useToast } from '@/branches/shared/components/ui/Toast'

function MyComponent() {
  const { showSuccessToast, showErrorToast } = useToast()

  return (
    <button onClick={() => showSuccessToast('Success!', 'Action completed')}>
      Show Toast
    </button>
  )
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
