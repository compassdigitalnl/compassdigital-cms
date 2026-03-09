export interface ProfileFormProps {
  profileData: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  onUpdate: (data: Partial<ProfileFormProps['profileData']>) => void
  onSave: () => void
  isSaving: boolean
}
