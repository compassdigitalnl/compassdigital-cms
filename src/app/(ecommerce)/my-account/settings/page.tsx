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
    email: 'jan.jansen@example.com',
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Mobile First */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">
            Instellingen
          </h1>
          <p className="text-sm lg:text-base text-gray-500">Beheer je accountgegevens en voorkeuren</p>
        </div>

        <Link
          href="/my-account/"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:bg-gray-200 lg:hover:bg-gray-100 bg-gray-50 text-gray-900"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>
      </div>

      {/* Profile Settings - Mobile First */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 lg:mb-5">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center bg-teal-50">
            <User className="w-5 h-5 lg:w-6 lg:h-6 text-teal-700" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">
              Persoonlijke gegevens
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">Werk je profiel en contactgegevens bij</p>
          </div>
        </div>

        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Voornaam
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Achternaam
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                E-mailadres
              </label>
              <div className="relative">
                <Mail className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Telefoonnummer
              </label>
              <div className="relative">
                <Phone className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 disabled:opacity-50 bg-teal-700 text-white w-full lg:w-auto"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </button>
      </div>

      {/* Company Settings (B2B) - Mobile First */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 lg:mb-5">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center bg-teal-50">
            <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-teal-700" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">
              Bedrijfsgegevens
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">Voor B2B-orders en facturatie</p>
          </div>
        </div>

        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">
              Bedrijfsnaam
            </label>
            <input
              type="text"
              value={profileData.companyName}
              onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
              className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                KVK-nummer
              </label>
              <input
                type="text"
                value={profileData.kvk}
                onChange={(e) => setProfileData({ ...profileData, kvk: e.target.value })}
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                BTW-nummer
              </label>
              <input
                type="text"
                value={profileData.vat}
                onChange={(e) => setProfileData({ ...profileData, vat: e.target.value })}
                className="w-full px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 disabled:opacity-50 bg-teal-700 text-white w-full lg:w-auto"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Opslaan...' : 'Wijzigingen opslaan'}
        </button>
      </div>

      {/* Password Settings - Mobile First */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 lg:mb-5">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center bg-teal-50">
            <Lock className="w-5 h-5 lg:w-6 lg:h-6 text-teal-700" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">
              Wachtwoord wijzigen
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">
              Minimaal 8 tekens, mix van letters en cijfers aanbevolen
            </p>
          </div>
        </div>

        <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">
              Huidig wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 lg:py-3 pr-11 lg:pr-12 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">
              Nieuw wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 lg:py-3 pr-11 lg:pr-12 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">
              Bevestig nieuw wachtwoord
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 lg:py-3 pr-11 lg:pr-12 rounded-lg lg:rounded-xl text-sm outline-none border border-gray-200 focus:border-gray-300"
              />
              <button
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={
            isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword
          }
          className="flex items-center justify-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 disabled:opacity-50 bg-teal-700 text-white w-full lg:w-auto"
        >
          <Lock className="w-4 h-4" />
          Wachtwoord wijzigen
        </button>
      </div>

      {/* Notification Settings - Mobile First */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4 lg:mb-5">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center bg-teal-50">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-teal-700" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-extrabold text-gray-900">
              Notificaties
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">Beheer je e-mail voorkeuren</p>
          </div>
        </div>

        <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-5">
          {[
            { key: 'orderConfirmation', label: 'Orderbevestigingen', description: 'Ontvang een bevestiging bij elke bestelling' },
            { key: 'shippingUpdates', label: 'Verzend updates', description: 'Track & trace notificaties' },
            { key: 'newsletter', label: 'Nieuwsbrief', description: 'Maandelijkse updates en acties' },
            { key: 'productUpdates', label: 'Product updates', description: 'Nieuwe producten en categorieën' },
            { key: 'priceAlerts', label: 'Prijsmeldingen', description: 'Waarschuw me bij prijswijzigingen' },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between p-3 lg:p-4 rounded-lg lg:rounded-xl bg-gray-50"
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="text-xs lg:text-sm font-semibold mb-0.5 lg:mb-1 text-gray-900">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <div
                className="w-11 lg:w-12 h-6 rounded-full relative cursor-pointer transition-all flex-shrink-0"
                style={{
                  background: notifications[item.key as keyof typeof notifications]
                    ? '#00897B'
                    : '#E5E7EB',
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
                    left: notifications[item.key as keyof typeof notifications] ? '22px' : '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 disabled:opacity-50 bg-teal-700 text-white w-full lg:w-auto"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Opslaan...' : 'Voorkeuren opslaan'}
        </button>
      </div>

      {/* Danger Zone - Mobile First */}
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-red-500">
        <div className="flex items-center gap-3 mb-4 lg:mb-5">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center bg-red-50">
            <Trash2 className="w-5 h-5 lg:w-6 lg:h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-base lg:text-lg font-extrabold text-red-600">
              Account verwijderen
            </h2>
            <p className="text-xs lg:text-sm text-gray-500">
              Deze actie kan niet ongedaan worden gemaakt
            </p>
          </div>
        </div>

        <div className="p-3 lg:p-4 rounded-lg lg:rounded-xl mb-3 lg:mb-4 bg-red-50 border border-red-200">
          <p className="text-xs lg:text-sm text-gray-900 leading-relaxed">
            Door je account te verwijderen worden al je gegevens, bestellingen, bestellijsten en
            adressen permanent verwijderd. Lopende bestellingen blijven bestaan maar je kunt ze
            niet meer inzien.
          </p>
        </div>

        <button
          onClick={handleDeleteAccount}
          className="flex items-center justify-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl text-sm font-semibold transition-all active:opacity-80 lg:hover:opacity-90 bg-red-600 text-white w-full lg:w-auto"
        >
          <Trash2 className="w-4 h-4" />
          Account permanent verwijderen
        </button>
      </div>
    </div>
  )
}
