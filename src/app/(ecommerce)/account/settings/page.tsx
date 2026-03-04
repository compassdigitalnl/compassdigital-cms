'use client'

import React, { useState, useEffect } from 'react'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/components/account/ui'
import SettingsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/SettingsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'

export default function SettingsPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const { user, isLoading: authLoading } = useAccountAuth()

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    kvk: '',
    vat: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    shippingUpdates: true,
    newsletter: false,
    productUpdates: true,
    priceAlerts: false,
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: (user as any).firstName || '',
        lastName: (user as any).lastName || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        companyName: (user as any).company || '',
        kvk: (user as any).kvk || '',
        vat: (user as any).vat || '',
      })
    }
  }, [user])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          company: profileData.companyName,
        }),
      })
      if (res.ok) {
        alert('Profiel succesvol bijgewerkt!')
      } else {
        alert('Er ging iets mis bij het opslaan.')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      alert('Er ging iets mis bij het opslaan.')
    } finally {
      setIsSaving(false)
    }
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
    try {
      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: passwordData.newPassword,
          passwordConfirm: passwordData.confirmPassword,
        }),
      })
      if (res.ok) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        alert('Wachtwoord succesvol gewijzigd!')
      } else {
        alert('Er ging iets mis bij het wijzigen van je wachtwoord.')
      }
    } catch (err) {
      console.error('Error changing password:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = () => {
    const confirmed = confirm('Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')
    if (confirmed) {
      const doubleConfirmed = confirm('Dit zal al je gegevens permanent verwijderen. Doorgaan?')
      if (doubleConfirmed) {
        // TODO: Implement account deletion API
        console.log('Deleting account')
      }
    }
  }

  if (authLoading || !user) return <AccountLoadingSkeleton variant="page" />

  return (
    <SettingsTemplate
      profileData={profileData}
      onUpdateProfile={(data) => setProfileData({ ...profileData, ...data })}
      onSaveProfile={handleSaveProfile}
      passwordData={passwordData}
      onUpdatePassword={(data) => setPasswordData({ ...passwordData, ...data })}
      onChangePassword={handleChangePassword}
      notifications={notifications}
      onToggleNotification={(key) => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
      onDeleteAccount={handleDeleteAccount}
      isSaving={isSaving}
    />
  )
}
