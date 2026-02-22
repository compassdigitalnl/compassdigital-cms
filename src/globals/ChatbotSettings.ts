import type { GlobalConfig } from 'payload'
import { checkRole } from '@/access/utilities'

/**
 * Chatbot Settings Global
 *
 * Complete CMS-driven configuration for AI Chatbot.
 * Allows per-client customization of:
 * - Model selection (Groq, OpenAI, Ollama, Hybrid)
 * - UI appearance and behavior
 * - System prompts and context
 * - Rate limiting
 * - Knowledge base integration
 */
export const ChatbotSettings: GlobalConfig = {
  slug: 'chatbot-settings',
  label: 'Chatbot Settings',
  access: {
    read: () => true, // Public read (used by chatbot)
    update: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    description: 'Configure AI chatbot behavior, appearance, and model selection.',
    group: 'Configuration',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ═══════════════════════════════════════════════════════════
        // TAB 1: GENERAL SETTINGS
        // ═══════════════════════════════════════════════════════════
        {
          label: 'General Settings',
          description: 'Basic chatbot configuration and model selection',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Enable Chatbot',
              admin: {
                description:
                  'Turn chatbot on/off globally. Requires ENABLE_CHATBOT=true in .env',
              },
            },
            {
              name: 'model',
              type: 'select',
              required: true,
              defaultValue: 'groq',
              label: 'AI Model',
              options: [
                {
                  label: '⚡ Groq (Llama 3 70B) - Fast & Free',
                  value: 'groq',
                },
                {
                  label: '🤖 OpenAI GPT-4 - Highest Quality',
                  value: 'gpt-4',
                },
                {
                  label: '💡 OpenAI GPT-3.5 - Balanced',
                  value: 'gpt-3.5',
                },
                {
                  label: '🏠 Ollama (Self-hosted) - Privacy',
                  value: 'ollama',
                },
                {
                  label: '🔀 Hybrid (Auto-route) - Best of All',
                  value: 'hybrid',
                },
              ],
              admin: {
                description:
                  'Choose AI model. Hybrid automatically routes simple → Groq, complex → GPT-4.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'temperature',
                  type: 'number',
                  label: 'Temperature',
                  defaultValue: 0.7,
                  min: 0,
                  max: 2,
                  admin: {
                    width: '33%',
                    description: 'Creativity (0 = factual, 2 = creative)',
                    step: 0.1,
                  },
                },
                {
                  name: 'maxTokens',
                  type: 'number',
                  label: 'Max Tokens',
                  defaultValue: 500,
                  min: 50,
                  max: 4000,
                  admin: {
                    width: '33%',
                    description: 'Max response length (~750 words = 1000 tokens)',
                  },
                },
                {
                  name: 'contextWindow',
                  type: 'number',
                  label: 'Context Window',
                  defaultValue: 5,
                  min: 1,
                  max: 20,
                  admin: {
                    width: '34%',
                    description: 'Number of previous messages to remember',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 2: UI CUSTOMIZATION
        // ═══════════════════════════════════════════════════════════
        {
          label: 'UI Customization',
          description: 'Customize chatbot appearance and position',
          fields: [
            {
              name: 'position',
              type: 'select',
              required: true,
              defaultValue: 'bottom-right',
              label: 'Position',
              options: [
                { label: '↘️ Bottom Right', value: 'bottom-right' },
                { label: '↙️ Bottom Left', value: 'bottom-left' },
                { label: '🔼 Top Right', value: 'top-right' },
                { label: '🔽 Top Left', value: 'top-left' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'buttonColor',
                  type: 'text',
                  label: 'Button Color',
                  defaultValue: '#0ea5e9',
                  admin: {
                    width: '50%',
                    description: 'Hex color (e.g., #0ea5e9)',
                  },
                },
                {
                  name: 'buttonIcon',
                  type: 'select',
                  label: 'Button Icon',
                  defaultValue: 'chat',
                  options: [
                    { label: '💬 Chat Bubble', value: 'chat' },
                    { label: '🤖 Robot', value: 'robot' },
                    { label: '💡 Light Bulb', value: 'lightbulb' },
                    { label: '❓ Question Mark', value: 'question' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'welcomeMessage',
              type: 'textarea',
              label: 'Welcome Message',
              defaultValue: 'Hallo! Hoe kan ik je helpen?',
              admin: {
                description: 'First message shown when chatbot opens',
                rows: 2,
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Input Placeholder',
              defaultValue: 'Typ je vraag...',
              admin: {
                description: 'Placeholder text in input field',
              },
            },
            {
              name: 'suggestedQuestions',
              type: 'array',
              label: 'Suggested Questions',
              admin: {
                description: 'Quick-start questions shown to users',
              },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                  admin: {
                    placeholder: 'Wat zijn jullie openingstijden?',
                  },
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 3: CONTEXT & TRAINING
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Context & Training',
          description: 'Configure chatbot knowledge and behavior',
          fields: [
            {
              name: 'systemPrompt',
              type: 'textarea',
              label: 'System Prompt',
              admin: {
                description:
                  'Instructions for the AI. Defines personality and behavior. Leave empty for default.',
                rows: 6,
                placeholder: `Je bent een behulpzame AI assistent voor [BEDRIJFSNAAM].

Beantwoord vragen vriendelijk, professioneel en in het Nederlands.
Gebruik de kennisbank context om accurate informatie te geven.
Als je het antwoord niet weet, zeg het eerlijk.`,
              },
            },
            {
              name: 'knowledgeBaseIntegration',
              type: 'group',
              label: 'Knowledge Base Integration (RAG)',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable RAG (Retrieval Augmented Generation)',
                  admin: {
                    description:
                      'Use Meilisearch to find relevant blog posts/docs before answering',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'maxResults',
                      type: 'number',
                      label: 'Max Search Results',
                      defaultValue: 3,
                      min: 1,
                      max: 10,
                      admin: {
                        width: '50%',
                        description: 'How many docs to use as context',
                      },
                    },
                    {
                      name: 'includeSourceLinks',
                      type: 'checkbox',
                      label: 'Include Source Links',
                      defaultValue: true,
                      admin: {
                        width: '50%',
                        description: 'Show "Bronnen" links in response',
                      },
                    },
                  ],
                },
                {
                  name: 'searchCollections',
                  type: 'select',
                  label: 'Collections to Search',
                  hasMany: true,
                  defaultValue: ['blog-posts', 'pages'],
                  options: [
                    { label: 'Blog Posts', value: 'blog-posts' },
                    { label: 'Pages', value: 'pages' },
                    { label: 'FAQs', value: 'faqs' },
                    { label: 'Products', value: 'products' },
                    { label: 'Cases', value: 'cases' },
                  ],
                  admin: {
                    description: 'Which collections to search for context',
                  },
                },
              ],
            },
            {
              name: 'trainingContext',
              type: 'textarea',
              label: 'Additional Training Context',
              admin: {
                description:
                  'Extra company info, policies, or FAQs to include in every response (e.g., opening hours, return policy)',
                rows: 8,
                placeholder: `Bedrijfsinformatie:
- Openingstijden: Ma-Vr 9:00-17:00
- Verzending: Gratis vanaf €50
- Retourbeleid: 30 dagen niet goed, geld terug
- Contact: info@bedrijf.nl, 020-1234567`,
              },
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 4: RATE LIMITING & SECURITY
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Rate Limiting & Security',
          description: 'Prevent abuse and manage usage',
          fields: [
            {
              name: 'rateLimiting',
              type: 'group',
              label: 'Rate Limiting',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Rate Limiting',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'maxMessagesPerHour',
                      type: 'number',
                      label: 'Max Messages per Hour',
                      defaultValue: 20,
                      min: 1,
                      admin: {
                        width: '33%',
                        description: 'Per user (IP or session)',
                      },
                    },
                    {
                      name: 'maxMessagesPerDay',
                      type: 'number',
                      label: 'Max Messages per Day',
                      defaultValue: 50,
                      min: 1,
                      admin: {
                        width: '33%',
                      },
                    },
                    {
                      name: 'cooldownSeconds',
                      type: 'number',
                      label: 'Cooldown (seconds)',
                      defaultValue: 3,
                      min: 0,
                      admin: {
                        width: '34%',
                        description: 'Wait time between messages',
                      },
                    },
                  ],
                },
                {
                  name: 'blockedIPs',
                  type: 'array',
                  label: 'Blocked IP Addresses',
                  admin: {
                    description: 'IPs to block from using chatbot',
                  },
                  fields: [
                    {
                      name: 'ip',
                      type: 'text',
                      required: true,
                      label: 'IP Address',
                      admin: {
                        placeholder: '192.168.1.1',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'moderation',
              type: 'group',
              label: 'Content Moderation',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Content Moderation',
                  admin: {
                    description: 'Use OpenAI Moderation API to filter inappropriate content',
                  },
                },
                {
                  name: 'blockedKeywords',
                  type: 'array',
                  label: 'Blocked Keywords',
                  admin: {
                    description: 'Keywords to block in user messages',
                  },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TAB 5: ADVANCED
        // ═══════════════════════════════════════════════════════════
        {
          label: 'Advanced',
          description: 'Advanced settings and API configuration',
          fields: [
            {
              name: 'apiConfiguration',
              type: 'group',
              label: 'API Configuration',
              admin: {
                description: 'API keys are configured in .env file. This shows which are active.',
              },
              fields: [
                {
                  name: 'groqApiKey',
                  type: 'text',
                  label: 'Groq API Key Status',
                  admin: {
                    readOnly: true,
                    description:
                      'Configured via GROQ_API_KEY in .env. Get key at: https://console.groq.com/keys',
                    placeholder: 'Not configured',
                  },
                },
                {
                  name: 'openaiApiKey',
                  type: 'text',
                  label: 'OpenAI API Key Status',
                  admin: {
                    readOnly: true,
                    description:
                      'Configured via OPENAI_API_KEY in .env. Get key at: https://platform.openai.com/api-keys',
                    placeholder: 'Not configured',
                  },
                },
                {
                  name: 'ollamaUrl',
                  type: 'text',
                  label: 'Ollama Server URL',
                  admin: {
                    readOnly: true,
                    description:
                      'Configured via OLLAMA_URL in .env. Default: http://localhost:11434',
                    placeholder: 'Not configured',
                  },
                },
              ],
            },
            {
              name: 'analytics',
              type: 'group',
              label: 'Analytics & Logging',
              fields: [
                {
                  name: 'enableLogging',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Conversation Logging',
                  admin: {
                    description: 'Log all conversations for analytics and improvement',
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'enableAnalytics',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Enable Analytics',
                      admin: {
                        width: '50%',
                        description: 'Track usage metrics',
                      },
                    },
                    {
                      name: 'retentionDays',
                      type: 'number',
                      label: 'Log Retention (days)',
                      defaultValue: 30,
                      min: 1,
                      max: 365,
                      admin: {
                        width: '50%',
                        description: 'How long to keep conversation logs',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'fallback',
              type: 'group',
              label: 'Fallback Behavior',
              fields: [
                {
                  name: 'enableFallback',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Enable Fallback Message',
                  admin: {
                    description: 'Show fallback when AI fails to respond',
                  },
                },
                {
                  name: 'fallbackMessage',
                  type: 'textarea',
                  label: 'Fallback Message',
                  defaultValue:
                    'Sorry, ik kan momenteel geen antwoord geven. Neem contact op via info@bedrijf.nl of bel 020-1234567.',
                  admin: {
                    description: 'Message shown when chatbot fails',
                    rows: 3,
                  },
                },
                {
                  name: 'contactEmail',
                  type: 'text',
                  label: 'Contact Email',
                  admin: {
                    description: 'Email shown in fallback message',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
