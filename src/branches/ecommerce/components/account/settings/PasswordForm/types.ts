export interface PasswordFormProps {
  onChangePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void
  isSaving: boolean
}
