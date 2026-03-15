// shadcn/ui primitives
export { Button, buttonVariants } from './primitives/button'
export type { ButtonProps } from './primitives/button'
export { Badge, badgeVariants } from './primitives/badge'
export { Card } from './primitives/card'
export { Checkbox } from './primitives/checkbox'
export { Input } from './primitives/input'
export { Label } from './primitives/label'
export { Progress } from './primitives/progress'
export { Select } from './primitives/select'
export { Table } from './primitives/table'
export { Tabs } from './primitives/tabs'
export { Textarea } from './primitives/textarea'
export { Accordion } from './primitives/accordion'
export { Dialog } from './primitives/dialog'
export { Sheet } from './primitives/sheet'
export { Carousel } from './primitives/carousel'
export { Toaster } from './primitives/sonner'

// Layout
export { Pagination, PaginationButton } from './layout/Pagination'
export type { PaginationProps, PaginationButtonProps, PaginationVariant } from './layout/Pagination'
export { ProgressSteps, generateSteps } from './layout/ProgressSteps'
export type { ProgressStepsProps, Step, StepStatus } from './layout/ProgressSteps'
export { SectionLabel } from './layout/SectionLabel'
export type { SectionLabelProps } from './layout/SectionLabel'

// Media
export { OptimizedImage, OptimizedBackgroundImage, ResponsiveImage } from './media/OptimizedImage'
export type { OptimizedImageProps, OptimizedBackgroundImageProps, ResponsiveImageProps } from './media/OptimizedImage'

// Feedback
export {
  ToastSystemProvider,
  useToast,
  useSuccessToast,
  useErrorToast,
  useWarningToast,
  useInfoToast,
} from './feedback/ToastSystem'
export type { ToastType, ToastConfig } from './feedback/ToastSystem'
export { CookieBanner, CookiePreferencesModal } from './feedback/CookieBanner'
export type { CookieBannerProps, CookiePreferences, CookieCategory } from './feedback/CookieBanner'

// Marketing
export { TrustSignals, TrustSignalItem } from './marketing/TrustSignals'
export type { TrustSignalsProps, TrustSignalItemProps, TrustSignal, TrustSignalVariant } from './marketing/TrustSignals'

// Ecommerce
export { QuantityStepper } from './ecommerce/QuantityStepper'
export type { QuantityStepperProps, QuantitySize } from './ecommerce/QuantityStepper'
