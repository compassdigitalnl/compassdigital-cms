export interface AuthBrandingPanelProps {
  /** Logo URL (absolute or relative path) */
  logoUrl?: string
  /** Logo alt text for accessibility */
  logoAlt?: string
  /** Company/site name (shown if no logo) */
  siteName?: string
  /** Tagline or description */
  tagline?: string
  /** Background image URL */
  backgroundImage?: string
  /** Background color (CSS color value) */
  backgroundColor?: string
  /** Additional CSS classes */
  className?: string
}
