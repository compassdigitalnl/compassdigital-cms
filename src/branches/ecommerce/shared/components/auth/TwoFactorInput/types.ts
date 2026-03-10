export interface TwoFactorInputProps {
  onSubmit: (code: string, isBackupCode: boolean) => Promise<void>
  onCancel?: () => void
  email: string
  className?: string
}
