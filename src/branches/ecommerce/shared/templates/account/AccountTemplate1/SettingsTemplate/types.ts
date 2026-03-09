export interface SettingsTemplateProps {
  profileData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    companyName: string
    kvk: string
    vat: string
  }
  onUpdateProfile: (data: Partial<SettingsTemplateProps['profileData']>) => void
  onSaveProfile: () => void
  passwordData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  onUpdatePassword: (data: Partial<SettingsTemplateProps['passwordData']>) => void
  onChangePassword: () => void
  notifications: {
    orderConfirmation: boolean
    shippingUpdates: boolean
    newsletter: boolean
    productUpdates: boolean
    priceAlerts: boolean
  }
  onToggleNotification: (key: string) => void
  onDeleteAccount: () => void
  isSaving: boolean
}
