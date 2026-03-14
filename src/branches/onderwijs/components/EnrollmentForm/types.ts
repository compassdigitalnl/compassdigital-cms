export interface EnrollmentFormProps {
  course: {
    id: string | number
    title: string
    slug: string
    price: number
    originalPrice?: number | null
    discountPercentage?: number | null
    thumbnail?: {
      url?: string
      alt?: string
    } | string | null
    instructor?: {
      name?: string
    } | string | null
  }
  courseSlug: string
}

export type AccountType = 'new' | 'existing'
export type PaymentMethod = 'ideal' | 'creditcard' | 'paypal'
export type EnrollmentStep = 1 | 2 | 3

export interface AccountFormData {
  accountType: AccountType
  firstName: string
  lastName: string
  email: string
  password: string
  newsletter: boolean
  terms: boolean
}

export interface PaymentFormData {
  method: PaymentMethod
  idealBank: string
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  cardName: string
}
