'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Building2,
  Lock,
  Bell,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function SettingsPage() {
  // TODO: Replace with real user data from API
  const [profileData, setProfileData] = useState({
    firstName: 'Jan',
    lastName: 'de Vries',
    email: 'jan@plastimed.nl',
    phone: '+31 6 1234 5678',
    companyName: 'Plastimed B.V.',
    kvk: '12345678',
    vat: 'NL123456789B01',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    shippingUpdates: true,
    newsletter: false,
    productUpdates: true,
    priceAlerts: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // TODO: Implement API call to update profile
    console.log('Saving profile:', profileData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Profiel succesvol bijgewerkt!')
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Nieuwe wachtwoorden komen niet overeen!')
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert('Wachtwoord moet minimaal 8 tekens bevatten!')
      return
    }

    setIsSaving(true)
    // TODO: Implement API call to change password
    console.log('Changing password')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    alert('Wachtwoord succesvol gewijzigd!')
  }

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      'Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.',
    )
    if (confirmed) {
      const doubleConfirmed = confirm(
        'Dit zal al je gegevens, bestellingen en bestellijsten permanent verwijderen. Doorgaan?',
      )
      if (doubleConfirmed) {
        // TODO: Implement API call to delete account
        console.log('Deleting account')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="font-extrabold mb-2"
            style={{
              fontSize: '28px',
              color: '#0A1628',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            Instellingen
          </h1>
          <p style={{ fontSize: '14px', color: '#94A3B8' }}>Beheer je accountgegevens en voorkeuren</p>
        </div>

        <Link
          href="/my-account"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all hover:bg-gray-100"
          style={{ background: '#F5F7FA', color: '#0A1628', fontSize: '14px' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,137,123,0.1)' }}
          >
            <User className="w-6 h-6" style={{ color: '#00897B' }} />
          </div>
          <div>
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Persoonlijke gegevens
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Werk je profiel en contactgegevens bij</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                Voornaam
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                Achternaam
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                E-mailadres
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5"
                  style={{ color: '#94A3B8' }}
                />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
                  style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                Telefoonnummer
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5"
                  style={{ color: '#94A3B8' }}
                />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
                  style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </button>
      </div>

      {/* Company Settings (B2B) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,137,123,0.1)' }}
          >
            <Building2 className="w-6 h-6" style={{ color: '#00897B' }} />
          </div>
          <div>
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Bedrijfsgegevens
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Voor B2B-orders en facturatie</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={profileData.companyName}
              onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                KVK-nummer
              </label>
              <input
                type="text"
                value={profileData.kvk}
                onChange={(e) => setProfileData({ ...profileData, kvk: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                BTW-nummer
              </label>
              <input
                type="text"
                value={profileData.vat}
                onChange={(e) => setProfileData({ ...profileData, vat: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </button>
      </div>

      {/* Password Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,137,123,0.1)' }}
          >
            <Lock className="w-6 h-6" style={{ color: '#00897B' }} />
          </div>
          <div>
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Wachtwoord wijzigen
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>
              Minimaal 8 tekens, mix van letters en cijfers aanbevolen
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div>
            <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
              Huidig wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              >
                {showPassword.current ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
              Nieuw wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              >
                {showPassword.new ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
              Bevestig nieuw wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-3 pr-12 rounded-xl outline-none"
                style={{ border: '1.5px solid #E8ECF1', fontSize: '14px' }}
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              >
                {showPassword.confirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={
            isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword
          }
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
        >
          <Lock className="w-4 h-4" />
          Wachtwoord wijzigen
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,137,123,0.1)' }}
          >
            <Bell className="w-6 h-6" style={{ color: '#00897B' }} />
          </div>
          <div>
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#0A1628',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Notificaties
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>Beheer je e-mail voorkeuren</p>
          </div>
        </div>

        <div className="space-y-3 mb-5">
          {[
            { key: 'orderConfirmation', label: 'Orderbevestigingen', description: 'Ontvang een bevestiging bij elke bestelling' },
            { key: 'shippingUpdates', label: 'Verzend updates', description: 'Track & trace notificaties' },
            { key: 'newsletter', label: 'Nieuwsbrief', description: 'Maandelijkse updates en acties' },
            { key: 'productUpdates', label: 'Product updates', description: 'Nieuwe producten en categorieën' },
            { key: 'priceAlerts', label: 'Prijsmeldingen', description: 'Waarschuw me bij prijswijzigingen' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between p-4 rounded-xl"
              style={{ background: '#F5F7FA' }}
            >
              <div className="flex-1">
                <div className="font-semibold mb-1" style={{ fontSize: '14px', color: '#0A1628' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{item.description}</div>
              </div>
              <div
                className="w-12 h-6 rounded-full relative cursor-pointer transition-all flex-shrink-0 ml-4"
                style={{
                  background: notifications[item.key as keyof typeof notifications]
                    ? '#00897B'
                    : '#E8ECF1',
                }}
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [item.key]: !notifications[item.key as keyof typeof notifications],
                  })
                }
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                  style={{
                    left: notifications[item.key as keyof typeof notifications] ? '26px' : '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#00897B', color: 'white', fontSize: '14px' }}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Opslaan...' : 'Voorkeuren opslaan'}
        </button>
      </div>

      {/* Danger Zone */}
      <div
        className="bg-white rounded-2xl p-6 shadow-sm"
        style={{ border: '1.5px solid #FF6B6B' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,107,107,0.1)' }}
          >
            <Trash2 className="w-6 h-6" style={{ color: '#FF6B6B' }} />
          </div>
          <div>
            <h2
              className="font-extrabold"
              style={{
                fontSize: '18px',
                color: '#FF6B6B',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              Account verwijderen
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>
              Deze actie kan niet ongedaan worden gemaakt
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl mb-4"
          style={{ background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.2)' }}
        >
          <p style={{ fontSize: '14px', color: '#0A1628', lineHeight: '1.6' }}>
            Door je account te verwijderen worden al je gegevens, bestellingen, bestellijsten en
            adressen permanent verwijderd. Lopende bestellingen blijven bestaan maar je kunt ze
            niet meer inzien.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
          style={{ background: '#FF6B6B', color: 'white', fontSize: '14px' }}
        >
          <Trash2 className="w-4 h-4" />
          Account permanent verwijderen
        </button>
      </div>
    </div>
  )
}
