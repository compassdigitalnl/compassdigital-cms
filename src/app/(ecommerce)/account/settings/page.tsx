'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccountAuth } from '@/hooks/useAccountAuth'
import { isFeatureEnabled } from '@/lib/features'
import { notFound } from 'next/navigation'
import { AccountLoadingSkeleton } from '@/branches/ecommerce/components/account/ui'
import SettingsTemplate from '@/branches/ecommerce/templates/account/AccountTemplate1/SettingsTemplate'
import { useAccountTemplate } from '@/branches/ecommerce/contexts/AccountTemplateContext'
import { toast } from '@/lib/toast'

export default function SettingsPage() {
  if (!isFeatureEnabled('shop')) notFound()

  const { config } = useAccountTemplate()
  const router = useRouter()
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
        toast.success('Profiel succesvol bijgewerkt')
      } else {
        toast.error('Er ging iets mis bij het opslaan')
      }
    } catch (err) {
      console.error('Error saving profile:', err)
      toast.error('Er ging iets mis bij het opslaan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Nieuwe wachtwoorden komen niet overeen')
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Wachtwoord moet minimaal 8 tekens bevatten')
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
        toast.success('Wachtwoord succesvol gewijzigd')
      } else {
        toast.error('Er ging iets mis bij het wijzigen van je wachtwoord')
      }
    } catch (err) {
      console.error('Error changing password:', err)
      toast.error('Er ging iets mis bij het wijzigen van je wachtwoord')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleNotification = async (key: string) => {
    const newNotifications = { ...notifications, [key]: !notifications[key as keyof typeof notifications] }
    setNotifications(newNotifications)
    try {
      const res = await fetch('/api/account/settings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications: newNotifications }),
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch (err) {
      console.error('Error saving notification preferences:', err)
      // Revert on failure
      setNotifications(notifications)
      toast.error('Fout bij opslaan notificatievoorkeuren')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = confirm('Weet je zeker dat je je account wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.')
    if (!confirmed) return
    const doubleConfirmed = confirm('Dit zal al je gegevens permanent verwijderen. Doorgaan?')
    if (!doubleConfirmed) return

    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Account verwijderd')
        router.push('/login')
      } else {
        toast.error('Er ging iets mis bij het verwijderen van je account')
      }
    } catch (err) {
      console.error('Error deleting account:', err)
      toast.error('Er ging iets mis bij het verwijderen van je account')
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
      onToggleNotification={handleToggleNotification}
      onDeleteAccount={handleDeleteAccount}
      isSaving={isSaving}
    />
  )
}
