'use client'

import { useState } from 'react'
import { Breadcrumb } from '@/globals/site/breadcrumbs/components/Breadcrumb/Component'
import { AvailabilityCalendar } from '@/branches/experiences/components/booking/AvailabilityCalendar'
import { ExtrasSelector } from '@/branches/experiences/components/booking/ExtrasSelector'
import { BookingSummary } from '@/branches/experiences/components/booking/BookingSummary'

interface ExperienceBookingTemplateProps {
  experience: any
}

const STEPS = [
  { label: 'Datum & Groep', icon: '1' },
  { label: "Extra's", icon: '2' },
  { label: 'Gegevens', icon: '3' },
  { label: 'Bevestiging', icon: '4' },
]

export function ExperienceBookingTemplate({ experience }: ExperienceBookingTemplateProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [groupSize, setGroupSize] = useState(experience.minPersons || 2)
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({})
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  })

  const category = typeof experience.category === 'object' ? experience.category : null

  const basePrice = (experience.pricePerPerson || 0) * groupSize
  const extrasTotal = (experience.extras || []).reduce((sum: number, extra: any) => {
    const qty = selectedExtras[extra.name] || 0
    if (qty === 0) return sum
    const extraPrice = extra.priceType === 'per-person' ? extra.price * groupSize * qty : extra.price * qty
    return sum + extraPrice
  }, 0)
  const totalPrice = basePrice + extrasTotal

  const canProceed = () => {
    if (currentStep === 0) return selectedDate !== null && groupSize >= (experience.minPersons || 1)
    if (currentStep === 1) return true
    if (currentStep === 2) return contactInfo.name && contactInfo.email && contactInfo.phone
    return true
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg, #f9fafb)' }}>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Ervaringen', href: '/ervaringen' },
            { label: experience.title, href: `/ervaringen/${experience.slug}` },
            { label: 'Reserveren' },
          ]}
        />
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-4 mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{
            color: 'var(--color-navy, #1a2b4a)',
            fontFamily: 'var(--font-serif, Georgia, serif)',
          }}
        >
          Reserveren: {experience.title}
        </h1>
      </div>

      {/* Step Navigation */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep
            const isComplete = i < currentStep

            return (
              <button
                key={i}
                onClick={() => i <= currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'text-white' : isComplete ? 'text-white' : 'text-grey-mid'
                }`}
                style={{
                  backgroundColor: isActive
                    ? 'var(--color-teal, #00a39b)'
                    : isComplete
                      ? 'var(--color-navy, #1a2b4a)'
                      : 'var(--color-grey-light, #e5e7eb)',
                }}
                disabled={i > currentStep}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/20">
                  {isComplete ? '✓' : step.icon}
                </span>
                {step.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Step 1: Date & Group */}
            {currentStep === 0 && (
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Kies een datum en groepsgrootte
                </h2>
                <AvailabilityCalendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                <div className="mt-6">
                  <label className="block text-sm font-medium text-grey-dark mb-2">
                    Aantal personen
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGroupSize(Math.max(experience.minPersons || 1, groupSize - 1))}
                      className="w-10 h-10 rounded-lg border flex items-center justify-center text-lg font-bold"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
                    >
                      -
                    </button>
                    <span className="text-xl font-bold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {groupSize}
                    </span>
                    <button
                      onClick={() => setGroupSize(Math.min(experience.maxPersons || 100, groupSize + 1))}
                      className="w-10 h-10 rounded-lg border flex items-center justify-center text-lg font-bold"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
                    >
                      +
                    </button>
                    <span className="text-sm text-grey-mid">
                      {experience.minPersons && experience.maxPersons
                        ? `(${experience.minPersons} - ${experience.maxPersons} personen)`
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Extras */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Kies extra opties
                </h2>
                <ExtrasSelector
                  extras={(experience.extras || []).map((extra: any) => ({
                    id: extra.name,
                    name: extra.name,
                    description: extra.description,
                    price: extra.price,
                    priceType: extra.priceType,
                    popular: extra.popular,
                  }))}
                  selectedExtras={selectedExtras}
                  onExtrasChange={setSelectedExtras}
                  groupSize={groupSize}
                />
              </div>
            )}

            {/* Step 3: Contact Info */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Jouw gegevens
                </h2>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-1">Naam *</label>
                    <input
                      type="text"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)', '--tw-ring-color': 'var(--color-teal, #00a39b)' } as any}
                      placeholder="Volledige naam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-1">E-mail *</label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)', '--tw-ring-color': 'var(--color-teal, #00a39b)' } as any}
                      placeholder="naam@bedrijf.nl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-1">Telefoon *</label>
                    <input
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)', '--tw-ring-color': 'var(--color-teal, #00a39b)' } as any}
                      placeholder="06-12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-1">Bedrijf</label>
                    <input
                      type="text"
                      value={contactInfo.company}
                      onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)', '--tw-ring-color': 'var(--color-teal, #00a39b)' } as any}
                      placeholder="Optioneel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-grey-dark mb-1">Opmerkingen</label>
                    <textarea
                      value={contactInfo.notes}
                      onChange={(e) => setContactInfo({ ...contactInfo, notes: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: 'var(--color-border, #e5e7eb)', '--tw-ring-color': 'var(--color-teal, #00a39b)' } as any}
                      rows={3}
                      placeholder="Speciale wensen of dieetvereisten..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl border p-6 shadow-sm" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Bijna klaar!
                  </h2>
                  <p className="text-grey-dark mb-6">
                    Controleer je gegevens en bevestig je reservering
                  </p>
                  <div className="text-left max-w-md mx-auto space-y-3">
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <span className="text-sm text-grey-mid">Datum</span>
                      <span className="text-sm font-medium">{selectedDate || '-'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <span className="text-sm text-grey-mid">Groepsgrootte</span>
                      <span className="text-sm font-medium">{groupSize} personen</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <span className="text-sm text-grey-mid">Naam</span>
                      <span className="text-sm font-medium">{contactInfo.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <span className="text-sm text-grey-mid">E-mail</span>
                      <span className="text-sm font-medium">{contactInfo.email}</span>
                    </div>
                    <div className="flex justify-between py-2" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
                      <span className="text-sm text-grey-mid">Totaal</span>
                      <span className="text-lg font-bold" style={{ color: 'var(--color-teal, #00a39b)' }}>
                        €{totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-8 px-8 py-3 rounded-lg text-white font-bold text-sm"
                    style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
                  >
                    Reservering bevestigen
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={handleBack}
                  className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    currentStep === 0 ? 'invisible' : ''
                  }`}
                  style={{
                    borderColor: 'var(--color-border, #e5e7eb)',
                    color: 'var(--color-navy, #1a2b4a)',
                  }}
                >
                  Vorige
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 rounded-lg text-white text-sm font-bold transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
                >
                  Volgende stap
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-[360px] flex-shrink-0">
            <div className="sticky top-20">
              <BookingSummary
                experienceTitle={experience.title}
                experienceThumbnail={
                  typeof experience.featuredImage === 'object'
                    ? experience.featuredImage?.url
                    : undefined
                }
                date={selectedDate || undefined}
                groupSize={groupSize}
                pricePerPerson={experience.pricePerPerson || 0}
                extras={Object.entries(selectedExtras)
                  .filter(([, qty]) => qty > 0)
                  .map(([name, qty]) => {
                    const extra = (experience.extras || []).find((e: any) => e.name === name)
                    return {
                      name,
                      quantity: qty,
                      price: extra?.price || 0,
                      priceType: extra?.priceType || 'fixed',
                    }
                  })}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExperienceBookingTemplate
