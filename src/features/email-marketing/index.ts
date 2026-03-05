/**
 * Email Marketing Feature
 *
 * Consolidated feature module for email marketing:
 * - Collections: Subscribers, Lists, Templates, Campaigns, Automation, Events, API Keys
 * - Components: GrapesJS visual email editor
 * - Lib: Listmonk client, automation engine, billing, deliverability, monitoring, webhooks
 */

// Collections
export {
  EmailSubscribers,
  EmailLists,
  EmailTemplates,
  EmailCampaigns,
  AutomationRules,
  AutomationFlows,
  FlowInstances,
  EmailEvents,
  EmailApiKeys,
} from './collections'

// Services
export { emailService } from './lib/EmailService'
