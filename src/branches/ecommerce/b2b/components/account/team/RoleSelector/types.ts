import type { CompanyRole } from '../types'

export interface RoleSelectorProps {
  value: CompanyRole
  onChange: (role: CompanyRole) => void
  onCancel?: () => void
  excludeRoles?: CompanyRole[]
}
