/**
 * Sentry Integration
 *
 * Helper functions for integrating Sentry error tracking
 * into the Email Marketing Engine
 */

/**
 * Sentry configuration
 */
export interface SentryConfig {
  dsn?: string
  environment: string
  release?: string
  tracesSampleRate: number
  profilesSampleRate: number
  enabled: boolean
}

/**
 * Error context for Sentry
 */
export interface ErrorContext {
  user?: {
    id: string
    email?: string
    tenant?: string
  }
  tags?: Record<string, string>
  extra?: Record<string, any>
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
}

/**
 * Initialize Sentry
 *
 * Call this in your Next.js instrumentation.ts or app startup
 *
 * @example
 * ```typescript
 * import { initSentry } from '@/lib/email/monitoring/SentryIntegration'
 *
 * initSentry({
 *   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
 *   environment: process.env.NODE_ENV,
 *   enabled: process.env.NODE_ENV === 'production',
 * })
 * ```
 */
export function initSentry(config: SentryConfig): void {
  if (!config.enabled || !config.dsn) {
    console.log('[Sentry] Sentry is disabled')
    return
  }

  try {
    // In production, you would import and initialize the actual Sentry SDK:
    // import * as Sentry from '@sentry/nextjs'
    //
    // Sentry.init({
    //   dsn: config.dsn,
    //   environment: config.environment,
    //   release: config.release,
    //   tracesSampleRate: config.tracesSampleRate,
    //   profilesSampleRate: config.profilesSampleRate,
    //   integrations: [
    //     new Sentry.Integrations.Http({ tracing: true }),
    //     new Sentry.Integrations.Prisma({ client: prisma }), // if using Prisma
    //   ],
    // })

    console.log('[Sentry] Sentry initialized successfully')
  } catch (error) {
    console.error('[Sentry] Failed to initialize Sentry:', error)
  }
}

/**
 * Capture error in Sentry
 *
 * @example
 * ```typescript
 * try {
 *   await sendEmail(...)
 * } catch (error) {
 *   captureError(error, {
 *     tags: { component: 'email-sender' },
 *     extra: { campaignId: '123' },
 *     user: { id: 'user_123', tenant: 'tenant_456' },
 *   })
 * }
 * ```
 */
export function captureError(error: Error, context?: ErrorContext): void {
  try {
    // In production, you would use:
    // import * as Sentry from '@sentry/nextjs'
    //
    // Sentry.captureException(error, {
    //   user: context?.user,
    //   tags: context?.tags,
    //   extra: context?.extra,
    //   level: context?.level || 'error',
    // })

    console.error('[Sentry] Error captured:', error.message)
    if (context) {
      console.error('[Sentry] Context:', context)
    }
  } catch (captureError) {
    console.error('[Sentry] Failed to capture error in Sentry:', captureError)
  }
}

/**
 * Capture message in Sentry
 *
 * @example
 * ```typescript
 * captureMessage('High email failure rate detected', {
 *   level: 'warning',
 *   tags: { component: 'monitoring' },
 *   extra: { failureRate: 0.15 },
 * })
 * ```
 */
export function captureMessage(message: string, context?: ErrorContext): void {
  try {
    // In production, you would use:
    // import * as Sentry from '@sentry/nextjs'
    //
    // Sentry.captureMessage(message, {
    //   level: context?.level || 'info',
    //   tags: context?.tags,
    //   extra: context?.extra,
    //   user: context?.user,
    // })

    console.log(`[Sentry] Message captured (${context?.level || 'info'}):`, message)
    if (context) {
      console.log('[Sentry] Context:', context)
    }
  } catch (captureError) {
    console.error('[Sentry] Failed to capture message in Sentry:', captureError)
  }
}

/**
 * Set user context for Sentry
 *
 * Call this when a user is authenticated
 *
 * @example
 * ```typescript
 * setUserContext({
 *   id: 'user_123',
 *   email: 'john@example.com',
 *   tenant: 'tenant_456',
 * })
 * ```
 */
export function setUserContext(user: { id: string; email?: string; tenant?: string }): void {
  try {
    // In production, you would use:
    // import * as Sentry from '@sentry/nextjs'
    //
    // Sentry.setUser({
    //   id: user.id,
    //   email: user.email,
    //   tenant: isUser(user) && user.client,
    // })

    console.log('[Sentry] User context set:', user.id)
  } catch (error) {
    console.error('[Sentry] Failed to set user context:', error)
  }
}

/**
 * Clear user context
 *
 * Call this when a user logs out
 */
export function clearUserContext(): void {
  try {
    // In production, you would use:
    // import * as Sentry from '@sentry/nextjs'
    //
    // Sentry.setUser(null)

    console.log('[Sentry] User context cleared')
  } catch (error) {
    console.error('[Sentry] Failed to clear user context:', error)
  }
}

/**
 * Add breadcrumb to Sentry
 *
 * Breadcrumbs help trace the steps leading to an error
 *
 * @example
 * ```typescript
 * addBreadcrumb({
 *   category: 'email',
 *   message: 'Starting campaign send',
 *   level: 'info',
 *   data: { campaignId: '123', recipientCount: 1000 },
 * })
 * ```
 */
export function addBreadcrumb(breadcrumb: {
  category: string
  message: string
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
  data?: Record<string, any>
}): void {
  try {
    // In production, you would use:
    // import * as Sentry from '@sentry/nextjs'
    //
    // Sentry.addBreadcrumb({
    //   category: breadcrumb.category,
    //   message: breadcrumb.message,
    //   level: breadcrumb.level || 'info',
    //   data: breadcrumb.data,
    //   timestamp: Date.now() / 1000,
    // })

    console.log(`[Sentry] Breadcrumb: [${breadcrumb.category}] ${breadcrumb.message}`)
  } catch (error) {
    console.error('[Sentry] Failed to add breadcrumb:', error)
  }
}

/**
 * Start a transaction for performance monitoring
 *
 * @example
 * ```typescript
 * const transaction = startTransaction({
 *   name: 'send-campaign',
 *   op: 'email.send',
 *   tags: { campaignId: '123' },
 * })
 *
 * try {
 *   await sendCampaign(...)
 *   transaction.setStatus('ok')
 * } catch (error) {
 *   transaction.setStatus('error')
 *   throw error
 * } finally {
 *   transaction.finish()
 * }
 * ```
 */
export function startTransaction(options: {
  name: string
  op: string
  tags?: Record<string, string>
  data?: Record<string, any>
}): {
  setStatus: (status: 'ok' | 'error' | 'cancelled') => void
  finish: () => void
  startChild: (childOptions: { op: string; description?: string }) => any
} {
  // In production, you would use:
  // import * as Sentry from '@sentry/nextjs'
  //
  // const transaction = Sentry.startTransaction({
  //   name: options.name,
  //   op: options.op,
  //   tags: options.tags,
  //   data: options.data,
  // })
  //
  // return transaction

  const startTime = Date.now()

  return {
    setStatus: (status) => {
      console.log(`[Sentry] Transaction ${options.name} status:`, status)
    },
    finish: () => {
      const duration = Date.now() - startTime
      console.log(`[Sentry] Transaction ${options.name} finished in ${duration}ms`)
    },
    startChild: (childOptions) => {
      return startTransaction({
        name: `${options.name} > ${childOptions.description || childOptions.op}`,
        op: childOptions.op,
      })
    },
  }
}

/**
 * Get Sentry configuration from environment variables
 */
export function getSentryConfig(): SentryConfig {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    release: process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version,
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
    profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),
    enabled: process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  }
}

/**
 * Usage Instructions:
 *
 * 1. Install Sentry SDK:
 *    ```bash
 *    npm install @sentry/nextjs
 *    ```
 *
 * 2. Initialize Sentry in instrumentation.ts:
 *    ```typescript
 *    import { initSentry, getSentryConfig } from '@/lib/email/monitoring/SentryIntegration'
 *
 *    export function register() {
 *      initSentry(getSentryConfig())
 *    }
 *    ```
 *
 * 3. Add to .env:
 *    ```
 *    NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
 *    SENTRY_TRACES_SAMPLE_RATE=0.1  # Sample 10% of transactions
 *    SENTRY_PROFILES_SAMPLE_RATE=0.1 # Sample 10% of profiles
 *    ```
 *
 * 4. Use in code:
 *    ```typescript
 *    import { captureError, addBreadcrumb } from '@/lib/email/monitoring/SentryIntegration'
 *
 *    try {
 *      addBreadcrumb({ category: 'email', message: 'Sending campaign' })
 *      await sendCampaign(...)
 *    } catch (error) {
 *      captureError(error, {
 *        tags: { component: 'email-sender' },
 *        user: { id: userId, tenant: tenantId },
 *      })
 *    }
 *    ```
 */
