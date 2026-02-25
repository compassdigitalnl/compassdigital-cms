'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, Phone, User, Building, Hash, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

type TabType = 'login' | 'register' | 'guest'

interface AuthTemplateProps {
  defaultTab?: TabType
}

export default function AuthTemplate({ defaultTab = 'login' }: AuthTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log('Login submitted')
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement registration logic
    console.log('Registration submitted')
  }

  const handleGuestCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement guest checkout logic
    window.location.href = '/checkout?guest=true'
  }

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    console.log('Google OAuth initiated')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Branding Panel */}
      <BrandingPanel />

      {/* Right: Form Panel */}
      <div
        className="flex items-center justify-center p-6 lg:p-10"
        style={{ background: 'var(--color-surface, #f8f9fb)' }}
      >
        <div className="w-full max-w-md">
          {/* Tab Switcher */}
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Login Panel */}
          {activeTab === 'login' && (
            <LoginPanel
              onSubmit={handleLogin}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              onGoogleAuth={handleGoogleAuth}
              onGuestClick={() => setActiveTab('guest')}
              onRegisterClick={() => setActiveTab('register')}
            />
          )}

          {/* Register Panel */}
          {activeTab === 'register' && (
            <RegisterPanel
              onSubmit={handleRegister}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              onGoogleAuth={handleGoogleAuth}
              onLoginClick={() => setActiveTab('login')}
            />
          )}

          {/* Guest Panel */}
          {activeTab === 'guest' && (
            <GuestPanel
              onSubmit={handleGuestCheckout}
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              onRegisterClick={() => setActiveTab('register')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// BRANDING PANEL
// ═════════════════════════════════════════════════════════════════════════════

function BrandingPanel() {
  const features = [
    { icon: '💰', title: 'Persoonlijke staffelprijzen', desc: 'Afgestemd op uw bestelvolume' },
    { icon: '🔄', title: 'Quick-order & nabestellen', desc: 'Herbestel in 2 klikken vanuit uw historie' },
    { icon: '📊', title: 'Besteloverzicht & facturen', desc: 'Altijd inzicht in uw bestellingen' },
    { icon: '📋', title: 'Bestellijsten beheren', desc: 'Stel vaste lijsten samen per afdeling' },
  ]

  return (
    <div
      className="relative p-10 lg:p-16 flex flex-col justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, var(--color-secondary, #0a2647) 0%, var(--color-secondary-dark, #061a33) 50%, #041526 100%)',
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, var(--color-primary, #00897b) 0%, transparent 70%)',
          transform: 'translate(20%, -20%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, var(--color-accent, #e94560) 0%, transparent 70%)',
          transform: 'translate(-10%, 10%)',
        }}
      />

      <div className="relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-7"
          style={{
            background: 'rgba(0, 137, 123, 0.15)',
            border: '1px solid rgba(0, 137, 123, 0.25)',
            color: 'var(--color-primary-light, #26a69a)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--color-primary-light, #26a69a)' }}
          />
          Uw partner sinds 1994
        </div>

        {/* Title */}
        <h1
          className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Toegang tot <br />
          <span style={{ color: 'var(--color-primary-light, #26a69a)' }}>4.000+ producten</span>
          <br />
          voor de zorg
        </h1>

        {/* Description */}
        <p className="text-white/60 text-base leading-relaxed max-w-md mb-12">
          Log in op uw account voor persoonlijke prijzen, snelle nabestellingen en exclusieve
          B2B-voordelen. Nog geen account? Registreer en profiteer direct.
        </p>

        {/* Features */}
        <div className="flex flex-col gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-center gap-3.5 text-white/75 text-sm">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{
                  background: 'rgba(0, 137, 123, 0.12)',
                  border: '1px solid rgba(0, 137, 123, 0.2)',
                }}
              >
                {feature.icon}
              </div>
              <div>
                <strong className="text-white/95 block">{feature.title}</strong>
                <span className="text-xs">{feature.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// TAB SWITCHER
// ═════════════════════════════════════════════════════════════════════════════

function TabSwitcher({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'login', label: 'Inloggen' },
    { id: 'register', label: 'Registreren' },
    { id: 'guest', label: 'Gast bestellen' },
  ]

  return (
    <div
      className="flex p-1 rounded-xl mb-8"
      style={{
        background: 'white',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
        border: '1px solid var(--color-border, #e2e8f0)',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex-1 py-3 px-4 text-sm font-semibold rounded-lg transition-all"
          style={{
            background: activeTab === tab.id ? 'var(--color-secondary, #0a2647)' : 'transparent',
            color: activeTab === tab.id ? 'white' : 'var(--color-text-muted, #64748b)',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN PANEL
// ═════════════════════════════════════════════════════════════════════════════

function LoginPanel({
  onSubmit,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  onGoogleAuth,
  onGuestClick,
  onRegisterClick,
}: {
  onSubmit: (e: React.FormEvent) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  rememberMe: boolean
  setRememberMe: (checked: boolean) => void
  onGoogleAuth: () => void
  onGuestClick: () => void
  onRegisterClick: () => void
}) {
  return (
    <div className="animate-fadeIn">
      <h2
        className="text-3xl font-bold mb-1.5"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #1e293b)' }}
      >
        Welkom terug
      </h2>
      <p className="text-sm mb-7" style={{ color: 'var(--color-text-muted, #64748b)' }}>
        Log in met uw account om verder te gaan met uw bestelling.
      </p>

      {/* OAuth Button */}
      <button
        onClick={onGoogleAuth}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 font-semibold text-sm mb-6 transition-all hover:shadow-sm hover:-translate-y-0.5"
        style={{
          background: 'white',
          borderColor: 'var(--color-border, #e2e8f0)',
          color: 'var(--color-text-primary, #1e293b)',
        }}
      >
        <GoogleIcon />
        Inloggen met Google
      </button>

      <Divider text="of met e-mail" />

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="E-mailadres">
          <InputWithIcon
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="naam@organisatie.nl"
            required
          />
        </FormField>

        <FormField label="Wachtwoord">
          <InputWithIcon
            icon={<Lock className="w-4 h-4" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Uw wachtwoord"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
        </FormField>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--color-primary, #00897b)' }}
            />
            <span style={{ color: 'var(--color-text-muted, #64748b)' }}>Onthoud mij</span>
          </label>
          <Link
            href="/forgot-password"
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-primary, #00897b)' }}
          >
            Wachtwoord vergeten?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-4 text-white rounded-xl font-bold text-base transition-all hover:opacity-90 hover:-translate-y-0.5 relative overflow-hidden group"
          style={{ background: 'var(--color-primary, #00897b)' }}
        >
          Inloggen
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
        </button>
      </form>

      <button
        onClick={onGuestClick}
        className="w-full mt-3 py-3 rounded-xl border-2 border-dashed font-semibold text-sm transition-all hover:border-solid"
        style={{
          borderColor: 'var(--color-border, #cbd5e1)',
          color: 'var(--color-text-muted, #64748b)',
        }}
      >
        🛒 Liever bestellen als gast?
      </button>

      <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted, #64748b)' }}>
        Nog geen account?{' '}
        <button
          onClick={onRegisterClick}
          className="font-semibold hover:underline"
          style={{ color: 'var(--color-primary, #00897b)' }}
        >
          Registreer hier
        </button>
      </p>

      <TrustBar />
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// REGISTER PANEL
// ═════════════════════════════════════════════════════════════════════════════

function RegisterPanel({
  onSubmit,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  acceptTerms,
  setAcceptTerms,
  onGoogleAuth,
  onLoginClick,
}: {
  onSubmit: (e: React.FormEvent) => void
  password: string
  setPassword: (pw: string) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  acceptTerms: boolean
  setAcceptTerms: (checked: boolean) => void
  onGoogleAuth: () => void
  onLoginClick: () => void
}) {
  const passwordStrength = calculatePasswordStrength(password)

  return (
    <div className="animate-fadeIn">
      <h2
        className="text-3xl font-bold mb-1.5"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #1e293b)' }}
      >
        Account aanmaken
      </h2>
      <p className="text-sm mb-7" style={{ color: 'var(--color-text-muted, #64748b)' }}>
        Maak een zakelijk account aan voor persoonlijke prijzen en snelle nabestellingen.
      </p>

      {/* OAuth Button */}
      <button
        onClick={onGoogleAuth}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 font-semibold text-sm mb-6 transition-all hover:shadow-sm hover:-translate-y-0.5"
        style={{
          background: 'white',
          borderColor: 'var(--color-border, #e2e8f0)',
          color: 'var(--color-text-primary, #1e293b)',
        }}
      >
        <GoogleIcon />
        Registreren met Google
      </button>

      <Divider text="of met e-mail" />

      {/* B2B Notice */}
      <div
        className="flex gap-2.5 p-4 rounded-xl mb-5 text-sm"
        style={{
          background: 'rgba(10, 38, 71, 0.03)',
          border: '1px solid rgba(10, 38, 71, 0.08)',
          color: 'var(--color-text-muted, #64748b)',
        }}
      >
        <span className="text-lg flex-shrink-0">🏥</span>
        <div className="leading-relaxed">
          <strong style={{ color: 'var(--color-text-primary)' }}>B2B registratie</strong> — Uw
          aanvraag wordt binnen 1 werkdag beoordeeld. Na goedkeuring ontvangt u uw persoonlijke
          prijsafspraken.
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Voornaam">
            <input
              type="text"
              placeholder="Jan"
              required
              className="input-base"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm, 8px)',
                border: '1.5px solid var(--color-border, #e2e8f0)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </FormField>

          <FormField label="Achternaam">
            <input
              type="text"
              placeholder="de Vries"
              required
              className="input-base"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm, 8px)',
                border: '1.5px solid var(--color-border, #e2e8f0)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </FormField>
        </div>

        <FormField label="Organisatie / Praktijk">
          <InputWithIcon
            icon={<Building className="w-4 h-4" />}
            type="text"
            placeholder="Huisartsenpraktijk De Vries"
            required
          />
        </FormField>

        <FormField label="KvK-nummer (optioneel)">
          <InputWithIcon
            icon={<Hash className="w-4 h-4" />}
            type="text"
            placeholder="12345678"
            maxLength={8}
          />
        </FormField>

        <FormField label="Zakelijk e-mailadres">
          <InputWithIcon
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="info@uwpraktijk.nl"
            required
          />
        </FormField>

        <FormField label="Telefoonnummer">
          <InputWithIcon
            icon={<Phone className="w-4 h-4" />}
            type="tel"
            placeholder="06 12345678"
          />
        </FormField>

        <FormField label="Wachtwoord">
          <InputWithIcon
            icon={<Lock className="w-4 h-4" />}
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 tekens"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />
          {password && <PasswordStrengthIndicator strength={passwordStrength} />}
        </FormField>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className="w-4 h-4 mt-0.5 rounded"
            style={{ accentColor: 'var(--color-primary, #00897b)' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-muted, #64748b)' }}>
            Ik ga akkoord met de{' '}
            <Link
              href="/algemene-voorwaarden"
              className="font-semibold hover:underline"
              style={{ color: 'var(--color-primary, #00897b)' }}
            >
              algemene voorwaarden
            </Link>
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-4 text-white rounded-xl font-bold text-base transition-all hover:opacity-90"
          style={{ background: 'var(--color-secondary, #0a2647)' }}
        >
          Account aanvragen
        </button>
      </form>

      <p className="text-center text-sm mt-5" style={{ color: 'var(--color-text-muted, #64748b)' }}>
        Al een account?{' '}
        <button
          onClick={onLoginClick}
          className="font-semibold hover:underline"
          style={{ color: 'var(--color-primary, #00897b)' }}
        >
          Log hier in
        </button>
      </p>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// GUEST PANEL
// ═════════════════════════════════════════════════════════════════════════════

function GuestPanel({
  onSubmit,
  acceptTerms,
  setAcceptTerms,
  onRegisterClick,
}: {
  onSubmit: (e: React.FormEvent) => void
  acceptTerms: boolean
  setAcceptTerms: (checked: boolean) => void
  onRegisterClick: () => void
}) {
  const benefits = [
    'Persoonlijke staffelprijzen',
    'Bestelhistorie inzien',
    'Snelle nabestellingen',
    'Bestellijsten opslaan',
  ]

  return (
    <div className="animate-fadeIn">
      <h2
        className="text-3xl font-bold mb-1.5"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #1e293b)' }}
      >
        Bestellen als gast
      </h2>
      <p className="text-sm mb-7" style={{ color: 'var(--color-text-muted, #64748b)' }}>
        Geen account nodig — vul uw gegevens in en bestel direct. U kunt na uw bestelling alsnog
        een account aanmaken.
      </p>

      {/* Info Box */}
      <div
        className="p-5 rounded-xl mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.04), rgba(10, 38, 71, 0.02))',
          border: '1px solid rgba(0, 137, 123, 0.12)',
        }}
      >
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
          ℹ️ Goed om te weten
        </h4>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted, #64748b)' }}>
          Als gast kunt u eenmalig bestellen zonder account. Met een account profiteert u van:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-text-muted, #64748b)' }}>
              <span className="text-sm" style={{ color: 'var(--color-primary, #00897b)' }}>
                ✓
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Voornaam">
            <input
              type="text"
              placeholder="Jan"
              required
              className="input-base"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm, 8px)',
                border: '1.5px solid var(--color-border, #e2e8f0)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </FormField>

          <FormField label="Achternaam">
            <input
              type="text"
              placeholder="de Vries"
              required
              className="input-base"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm, 8px)',
                border: '1.5px solid var(--color-border, #e2e8f0)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </FormField>
        </div>

        <FormField label="E-mailadres">
          <InputWithIcon
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="naam@organisatie.nl"
            required
          />
        </FormField>

        <FormField label="Organisatie (optioneel)">
          <InputWithIcon
            icon={<Building className="w-4 h-4" />}
            type="text"
            placeholder="Naam organisatie of praktijk"
          />
        </FormField>

        <FormField label="Telefoonnummer">
          <InputWithIcon
            icon={<Phone className="w-4 h-4" />}
            type="tel"
            placeholder="06 12345678"
            required
          />
        </FormField>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            required
            className="w-4 h-4 mt-0.5 rounded"
            style={{ accentColor: 'var(--color-primary, #00897b)' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-muted, #64748b)' }}>
            Ik ga akkoord met de{' '}
            <Link href="/algemene-voorwaarden" className="font-semibold hover:underline" style={{ color: 'var(--color-primary, #00897b)' }}>
              algemene voorwaarden
            </Link>{' '}
            en het{' '}
            <Link href="/privacy" className="font-semibold hover:underline" style={{ color: 'var(--color-primary, #00897b)' }}>
              privacybeleid
            </Link>
          </span>
        </label>

        <button
          type="submit"
          className="w-full py-4 text-white rounded-xl font-bold text-base transition-all hover:opacity-90"
          style={{ background: 'var(--color-primary, #00897b)' }}
        >
          Doorgaan naar bezorging
        </button>

        <button
          type="button"
          onClick={onRegisterClick}
          className="w-full py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:bg-opacity-5"
          style={{
            borderColor: 'var(--color-primary, #00897b)',
            color: 'var(--color-primary, #00897b)',
          }}
        >
          🏥 Toch liever een zakelijk account?
        </button>
      </form>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-primary, #334155)' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function InputWithIcon({
  icon,
  rightIcon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode
  rightIcon?: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-11 py-3 rounded-xl border-2 outline-none transition-all focus:border-current"
        style={{
          borderColor: 'var(--color-border, #e2e8f0)',
          fontSize: '14px',
        }}
      />
      {rightIcon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightIcon}</div>
      )}
    </div>
  )
}

function Divider({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px" style={{ background: 'var(--color-border, #e2e8f0)' }} />
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--color-border, #e2e8f0)' }} />
    </div>
  )
}

function PasswordStrengthIndicator({ strength }: { strength: number }) {
  const getColor = () => {
    if (strength < 2) return 'var(--color-error, #dc2626)'
    if (strength < 3) return 'var(--color-warning, #f59e0b)'
    return 'var(--color-success, #16a34a)'
  }

  const getLabel = () => {
    if (strength < 2) return 'Zwak'
    if (strength < 3) return 'Redelijk'
    return 'Sterk'
  }

  return (
    <div className="mt-2">
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-border, #e2e8f0)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(strength / 3) * 100}%`, background: getColor() }}
        />
      </div>
      <div className="text-xs font-semibold mt-1" style={{ color: getColor() }}>
        {getLabel()}
      </div>
    </div>
  )
}

function TrustBar() {
  const items = [
    { icon: '🔒', label: 'SSL beveiligd' },
    { icon: '🛡️', label: 'AVG compliant' },
    { icon: '✓', label: 'ISO gecertificeerd' },
  ]

  return (
    <div className="flex justify-center gap-8 pt-6 mt-6 border-t" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
          <span className="text-base">{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═════════════════════════════════════════════════════════════════════════════

function calculatePasswordStrength(password: string): number {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength++
  return strength
}
