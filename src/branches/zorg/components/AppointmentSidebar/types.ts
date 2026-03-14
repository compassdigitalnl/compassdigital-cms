export interface AppointmentSidebarProps {
  selectedTreatment?: string
  selectedPractitioner?: string
  selectedDate?: string
  selectedTime?: string
  insurance?: 'covered' | 'partial' | 'not-covered'
  trustSignals?: string[]
  className?: string
}
