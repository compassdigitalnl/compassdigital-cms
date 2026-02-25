export interface ProjectInfo {
  projectName: string
  deliveryDate: string // ISO date format (YYYY-MM-DD)
  notes?: string
}

export interface ValidationErrors {
  projectName?: string
  deliveryDate?: string
  notes?: string
}

export interface ProjectInfoFormProps {
  projectInfo?: Partial<ProjectInfo> // Pre-fill values
  onChange?: (field: keyof ProjectInfo, value: string) => void
  errors?: ValidationErrors
  minDeliveryDate?: string // ISO date (default: +3 business days)
  notesMaxLength?: number // Default: 500
  showNotesCounter?: boolean // Default: true
  projectNameHelperText?: string
  deliveryDateHelperText?: string
  className?: string
}
