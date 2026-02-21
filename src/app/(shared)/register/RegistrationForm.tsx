'use client'
import { useState } from 'react'
import { Check, ArrowRight, ArrowLeft, Building, User, Search, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

type AccountType = 'b2b' | 'individual'

interface FormData {
  // Step 1: Account Type
  accountType: AccountType

  // Step 2: Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string

  // Step 3: Company Info (B2B only)
  kvkNumber: string
  companyName: string
  vatNumber: string
  branch: string
  website: string
  street: string
  houseNumber: string
  postalCode: string
  city: string

  // Step 4: Password
  password: string
  passwordConfirm: string
  acceptTerms: boolean
  acceptNewsletter: boolean
}

const INITIAL_FORM_DATA: FormData = {
  accountType: 'b2b',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  kvkNumber: '',
  companyName: '',
  vatNumber: '',
  branch: '',
  website: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: false,
  acceptNewsletter: false,
}

const BRANCHES = [
  { value: 'healthcare', label: '🏥 Zorg & Welzijn', emoji: '🏥' },
  { value: 'hospitality', label: '🍽️ Horeca & Catering', emoji: '🍽️' },
  { value: 'construction', label: '🏗️ Bouw & Techniek', emoji: '🏗️' },
  { value: 'industry', label: '🏭 Industrie & Productie', emoji: '🏭' },
  { value: 'education', label: '🏫 Onderwijs', emoji: '🏫' },
  { value: 'business_services', label: '🏢 Zakelijke Diensten', emoji: '🏢' },
  { value: 'retail', label: '🛒 Retail & Groothandel', emoji: '🛒' },
  { value: 'logistics', label: '🚚 Transport & Logistiek', emoji: '🚚' },
  { value: 'other', label: '💼 Overig', emoji: '💼' },
]

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [kvkLoading, setKvkLoading] = useState(false)
  const [kvkFound, setKvkFound] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const totalSteps = formData.accountType === 'b2b' ? 4 : 3

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const lookupKVK = async () => {
    if (!formData.kvkNumber || formData.kvkNumber.length !== 8) {
      setErrors((prev) => ({ ...prev, kvkNumber: 'KVK nummer moet 8 cijfers bevatten' }))
      return
    }

    setKvkLoading(true)
    setKvkFound(false)

    try {
      const response = await fetch(`/api/kvk/lookup?kvk=${formData.kvkNumber}`)
      const data = await response.json()

      if (response.ok && data.company) {
        // Auto-fill company data
        setFormData((prev) => ({
          ...prev,
          companyName: data.company.name,
          street: data.company.address.street,
          houseNumber: data.company.address.houseNumber,
          postalCode: data.company.address.postalCode,
          city: data.company.address.city,
          website: data.company.website || '',
        }))
        setKvkFound(true)
      } else {
        setErrors((prev) => ({ ...prev, kvkNumber: 'Bedrijf niet gevonden' }))
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, kvkNumber: 'Fout bij opzoeken KVK nummer' }))
    } finally {
      setKvkLoading(false)
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'Voornaam is verplicht'
      if (!formData.lastName) newErrors.lastName = 'Achternaam is verplicht'
      if (!formData.email) newErrors.email = 'Email is verplicht'
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Ongeldig email adres'
      }
      if (!formData.phone) newErrors.phone = 'Telefoonnummer is verplicht'
    }

    if (step === 3 && formData.accountType === 'b2b') {
      if (!formData.companyName) newErrors.companyName = 'Bedrijfsnaam is verplicht'
      if (!formData.street) newErrors.street = 'Straat is verplicht'
      if (!formData.houseNumber) newErrors.houseNumber = 'Huisnummer is verplicht'
      if (!formData.postalCode) newErrors.postalCode = 'Postcode is verplicht'
      if (!formData.city) newErrors.city = 'Plaats is verplicht'
    }

    if (step === totalSteps) {
      if (!formData.password) newErrors.password = 'Wachtwoord is verplicht'
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Wachtwoord moet minimaal 8 tekens zijn'
      }
      if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Wachtwoorden komen niet overeen'
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Je moet akkoord gaan met de voorwaarden' as any
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(totalSteps)) return

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Success! Redirect to success page
        router.push('/register/success')
      } else {
        setErrors((prev) => ({ ...prev, email: data.message || 'Registratie mislukt' }))
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, email: 'Er ging iets mis. Probeer het opnieuw.' }))
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (): number => {
    const pw = formData.password
    let strength = 0
    if (pw.length >= 8) strength++
    if (pw.length >= 12) strength++
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) strength++
    if (/\d/.test(pw)) strength++
    if (/[^a-zA-Z0-9]/.test(pw)) strength++
    return Math.min(strength, 3)
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const stepNum = idx + 1
              const isActive = stepNum === currentStep
              const isDone = stepNum < currentStep

              return (
                <div key={stepNum} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isDone
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isDone ? <Check className="w-5 h-5" /> : stepNum}
                    </div>
                    <div className="hidden sm:block">
                      <div
                        className={`text-sm font-bold ${
                          isActive ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {stepNum === 1 && 'Account Type'}
                        {stepNum === 2 && 'Persoonlijke Gegevens'}
                        {stepNum === 3 && formData.accountType === 'b2b' && 'Bedrijfsgegevens'}
                        {stepNum === 3 && formData.accountType === 'individual' && 'Wachtwoord'}
                        {stepNum === 4 && 'Wachtwoord'}
                      </div>
                    </div>
                  </div>
                  {stepNum < totalSteps && (
                    <div
                      className={`w-12 sm:w-16 h-0.5 mx-2 ${
                        isDone ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          {/* Step 1: Account Type */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                <User className="w-6 h-6 text-teal-600" />
                Kies uw account type
              </h2>
              <p className="text-gray-600 mb-8">
                Selecteer het type account dat bij u past
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => updateField('accountType', 'b2b')}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    formData.accountType === 'b2b'
                      ? 'border-teal-600 bg-teal-50 shadow-lg shadow-teal-600/20'
                      : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  <div className="text-5xl mb-3">🏢</div>
                  <div className="text-lg font-extrabold text-gray-900 mb-1">
                    B2B Zakelijk
                  </div>
                  <div className="text-sm text-gray-600">
                    Voor bedrijven en organisaties
                  </div>
                </button>

                <button
                  onClick={() => updateField('accountType', 'individual')}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    formData.accountType === 'individual'
                      ? 'border-teal-600 bg-teal-50 shadow-lg shadow-teal-600/20'
                      : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  <div className="text-5xl mb-3">👤</div>
                  <div className="text-lg font-extrabold text-gray-900 mb-1">
                    Particulier
                  </div>
                  <div className="text-sm text-gray-600">
                    Voor individuele klanten
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                Persoonlijke gegevens
              </h2>
              <p className="text-gray-600 mb-8">
                Vul uw naam en contactgegevens in
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Voornaam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="Jan"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Achternaam <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="Jansen"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                      errors.email ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                    }`}
                    placeholder="jan@bedrijf.nl"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Telefoonnummer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                      errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                    }`}
                    placeholder="+31 6 1234 5678"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Company Info (B2B only) */}
          {currentStep === 3 && formData.accountType === 'b2b' && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                <Building className="w-6 h-6 text-teal-600" />
                Bedrijfsgegevens
              </h2>
              <p className="text-gray-600 mb-8">
                Vul uw bedrijfsinformatie in
              </p>

              <div className="space-y-4">
                {/* KVK Lookup */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    KVK Nummer (optioneel)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.kvkNumber}
                      onChange={(e) => updateField('kvkNumber', e.target.value)}
                      maxLength={8}
                      className={`flex-1 h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.kvkNumber ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="12345678"
                    />
                    <button
                      onClick={lookupKVK}
                      disabled={kvkLoading}
                      className="px-5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      {kvkLoading ? 'Zoeken...' : 'Opzoeken'}
                    </button>
                  </div>
                  {errors.kvkNumber && (
                    <p className="text-sm text-red-500 mt-1">{errors.kvkNumber}</p>
                  )}
                  {kvkFound && (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Bedrijf gevonden en gegevens ingevuld!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Bedrijfsnaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                      errors.companyName ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                    }`}
                    placeholder="Bedrijf B.V."
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500 mt-1">{errors.companyName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Branche
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BRANCHES.map((branch) => (
                      <button
                        key={branch.value}
                        onClick={() => updateField('branch', branch.value)}
                        className={`p-3 border-2 rounded-xl text-center transition-all text-sm font-semibold ${
                          formData.branch === branch.value
                            ? 'border-teal-600 bg-teal-50'
                            : 'border-gray-200 hover:border-teal-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">{branch.emoji}</div>
                        <div className="text-xs">{branch.label.replace(/^.+\s/, '')}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Straat <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => updateField('street', e.target.value)}
                      className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.street ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="Hoofdstraat"
                    />
                    {errors.street && (
                      <p className="text-sm text-red-500 mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Nr. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.houseNumber}
                      onChange={(e) => updateField('houseNumber', e.target.value)}
                      className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.houseNumber ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="123"
                    />
                    {errors.houseNumber && (
                      <p className="text-sm text-red-500 mt-1">{errors.houseNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="1234 AB"
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500 mt-1">{errors.postalCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Plaats <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.city ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="Amsterdam"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Website (optioneel)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none border-gray-200 focus:border-teal-600 focus:bg-white"
                    placeholder="https://www.bedrijf.nl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3/4: Password (depending on account type) */}
          {((currentStep === 3 && formData.accountType === 'individual') ||
            (currentStep === 4 && formData.accountType === 'b2b')) && (
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                Maak een wachtwoord
              </h2>
              <p className="text-gray-600 mb-8">
                Kies een sterk wachtwoord voor uw account
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Wachtwoord <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={`w-full h-12 px-4 pr-12 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                        errors.password ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                      }`}
                      placeholder="Minimaal 8 tekens"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                  )}

                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 h-1 rounded-full transition-all ${
                              passwordStrength >= level
                                ? passwordStrength === 1
                                  ? 'bg-red-500'
                                  : passwordStrength === 2
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        {passwordStrength === 1 && 'Zwak wachtwoord'}
                        {passwordStrength === 2 && 'Redelijk wachtwoord'}
                        {passwordStrength === 3 && 'Sterk wachtwoord'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Bevestig wachtwoord <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.passwordConfirm}
                    onChange={(e) => updateField('passwordConfirm', e.target.value)}
                    className={`w-full h-12 px-4 border-2 rounded-xl bg-gray-50 transition-all outline-none ${
                      errors.passwordConfirm ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:bg-white'
                    }`}
                    placeholder="Herhaal wachtwoord"
                  />
                  {errors.passwordConfirm && (
                    <p className="text-sm text-red-500 mt-1">{errors.passwordConfirm}</p>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => updateField('acceptTerms', !formData.acceptTerms)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        formData.acceptTerms
                          ? 'bg-teal-600 border-teal-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.acceptTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900">
                      Ik ga akkoord met de{' '}
                      <a href="/terms/" className="text-teal-600 underline">
                        algemene voorwaarden
                      </a>{' '}
                      en{' '}
                      <a href="/privacy/" className="text-teal-600 underline">
                        privacyverklaring
                      </a>
                      . <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 ml-8">{errors.acceptTerms as any}</p>
                  )}

                  <label className="flex items-start gap-3 cursor-pointer">
                    <div
                      onClick={() => updateField('acceptNewsletter', !formData.acceptNewsletter)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                        formData.acceptNewsletter
                          ? 'bg-teal-600 border-teal-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.acceptNewsletter && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900">
                      Ik wil graag op de hoogte blijven van aanbiedingen en nieuws
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:border-teal-600 hover:text-teal-600 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Vorige
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30"
              >
                Volgende
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30 disabled:opacity-50"
              >
                {loading ? 'Registreren...' : 'Account aanmaken'}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
