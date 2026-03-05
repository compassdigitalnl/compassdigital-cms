/**
 * Auth Components - Reusable authentication UI components
 *
 * This module exports all authentication-related components for building
 * login, registration, and guest checkout flows.
 *
 * @module auth
 */

// Foundation Components
export { FormInput } from './FormInput'
export type { FormInputProps } from './FormInput'

export { TrustBadges } from './TrustBadges'
export type { TrustBadgesProps, TrustBadge } from './TrustBadges'

export { B2BNotice } from './B2BNotice'
export type { B2BNoticeProps } from './B2BNotice'

export { GuestInfoBox } from './GuestInfoBox'
export type { GuestInfoBoxProps } from './GuestInfoBox'

export { PasswordStrengthMeter } from './PasswordStrengthMeter'
export type { PasswordStrengthMeterProps } from './PasswordStrengthMeter'

// Layout & Navigation Components
export { AuthLayout } from './AuthLayout'
export type { AuthLayoutProps } from './AuthLayout'

export { AuthBrandingPanel } from './AuthBrandingPanel'
export type { AuthBrandingPanelProps, Feature } from './AuthBrandingPanel'

export { AuthTabSwitcher } from './AuthTabSwitcher'
export type { AuthTabSwitcherProps, Tab, TabId } from './AuthTabSwitcher'

// Form Components
export { OAuthButtons } from './OAuthButtons'
export type { OAuthButtonsProps, OAuthProvider } from './OAuthButtons'

export { LoginForm } from './LoginForm'
export type { LoginFormProps, LoginFormData } from './LoginForm'

export { RegisterForm } from './RegisterForm'
export type { RegisterFormProps, RegisterFormData } from './RegisterForm'

export { GuestCheckoutForm } from './GuestCheckoutForm'
export type { GuestCheckoutFormProps, GuestCheckoutFormData } from './GuestCheckoutForm'

export { ForgotPasswordForm } from './ForgotPasswordForm'
export type { ForgotPasswordFormData } from './ForgotPasswordForm'

export { CreateAccountForm } from './CreateAccountForm'
