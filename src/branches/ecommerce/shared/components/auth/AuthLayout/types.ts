export interface AuthLayoutProps {
  children: React.ReactNode // Form content (right panel)
  brandingContent?: React.ReactNode // Custom branding (optional, replaces default)
  hideBranding?: boolean // Force hide branding panel
  className?: string
}
