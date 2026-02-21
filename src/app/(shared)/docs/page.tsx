import React from 'react'
import { Metadata } from 'next'
import { 
  Book, Rocket, Shield, Wrench, Database, Eye, 
  Code, TestTube2, Cog, Box, Sparkles, FileText,
  ExternalLink, ArrowRight, CheckCircle2
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Documentation | SiteForge',
  description: 'Complete documentation for SiteForge - guides, tutorials, and API reference',
}

const docCategories = [
  {
    title: '🚀 Getting Started',
    description: 'Quick setup and deployment guides',
    icon: Rocket,
    color: 'blue',
    docs: [
      { name: 'Setup Guide', href: '/setup', description: 'Complete setup in 30-60 minutes', badge: 'Start Here' },
      { name: 'Quick Start', href: '/docs/PHASE-1-QUICK-START.md', description: 'Get running in 5 minutes' },
      { name: 'Deployment Guide', href: '/docs/DEPLOYMENT_GUIDE.md', description: 'Deploy to production' },
      { name: 'Project Status', href: '/docs/PROJECT_STATUS.md', description: 'Current implementation status' },
    ],
  },
  {
    title: '🔐 Security & Setup',
    description: 'Security hardening and configuration',
    icon: Shield,
    color: 'red',
    docs: [
      { name: 'Security Hardening', href: '/docs/SECURITY_HARDENING_GUIDE.md', description: 'Production security checklist' },
      { name: 'reCAPTCHA Setup', href: '/docs/RECAPTCHA_SETUP_GUIDE.md', description: 'Spam protection configuration' },
      { name: 'Environment Variables', href: '/docs/environment-variables.md', description: 'All environment variables explained' },
      { name: 'Backup Strategy', href: '/docs/BACKUP_STRATEGY_GUIDE.md', description: 'Automated backup setup' },
    ],
  },
  {
    title: '💾 Database & Data',
    description: 'Database setup and migrations',
    icon: Database,
    color: 'green',
    docs: [
      { name: 'Database Migration', href: '/docs/DATABASE_MIGRATION_GUIDE.md', description: 'SQLite to PostgreSQL migration' },
      { name: 'Redis Setup', href: '/docs/redis-setup.md', description: 'Redis caching configuration' },
    ],
  },
  {
    title: '🧪 Testing & Quality',
    description: 'Testing frameworks and guides',
    icon: TestTube2,
    color: 'purple',
    docs: [
      { name: 'Playwright Testing', href: '/docs/PLAYWRIGHT_TESTING_GUIDE.md', description: 'E2E testing guide' },
      { name: 'Testing Guide', href: '/docs/TESTING.md', description: 'QA checklist' },
      { name: 'Pre-Build Hooks', href: '/docs/PRE_BUILD_HOOKS_GUIDE.md', description: 'Automated validation' },
    ],
  },
  {
    title: '📊 Monitoring & Analytics',
    description: 'Uptime monitoring and error tracking',
    icon: Eye,
    color: 'orange',
    docs: [
      { name: 'Uptime Monitoring', href: '/docs/UPTIME_MONITORING_GUIDE.md', description: '24/7 monitoring setup' },
    ],
  },
  {
    title: '🎨 SEO & Performance',
    description: 'SEO optimization and schema markup',
    icon: Sparkles,
    color: 'pink',
    docs: [
      { name: 'JSON-LD Schemas', href: '/docs/JSON-LD_SCHEMAS_GUIDE.md', description: 'Rich snippets & structured data' },
      { name: 'SEO Optimization', href: '/docs/phase-2-5-seo-optimization.md', description: 'Complete SEO guide' },
      { name: 'Performance Plan', href: '/docs/enterprise-performance-plan.md', description: 'Enterprise scaling' },
    ],
  },
  {
    title: '🤖 AI Features',
    description: 'AI content generation and site wizard',
    icon: Sparkles,
    color: 'indigo',
    docs: [
      { name: 'AI Setup Guide', href: '/docs/ai-setup-guide.md', description: 'Configure OpenAI integration' },
      { name: 'AI Integration Examples', href: '/docs/ai-integration-examples.md', description: 'Code examples' },
      { name: 'Site Generator Wizard', href: '/docs/site-generator-wizard.md', description: 'Automated site generation' },
      { name: 'Wizard Implementation', href: '/docs/WIZARD-IMPLEMENTATION-COMPLETE.md', description: 'Complete wizard docs' },
    ],
  },
  {
    title: '📚 API Reference',
    description: 'Complete API documentation',
    icon: Code,
    color: 'gray',
    docs: [
      { name: 'API Documentation', href: '/docs/API_DOCUMENTATION.md', description: '1000+ lines API reference', badge: 'Complete' },
      { name: 'AI Content Generator', href: '/docs/phase-2-ai-content-generator.md', description: 'AI API endpoints' },
      { name: 'Content Analysis', href: '/docs/phase-2-6-content-analysis.md', description: 'Analysis API' },
    ],
  },
  {
    title: '⚙️ Admin & CMS',
    description: 'Admin panel and client guides',
    icon: Cog,
    color: 'teal',
    docs: [
      { name: 'Admin Guide', href: '/docs/ADMIN_GUIDE.md', description: 'Client-friendly CMS manual' },
      { name: 'Block Intelligence', href: '/docs/phase-2-3-block-intelligence.md', description: 'Smart content blocks' },
    ],
  },
  {
    title: '🔧 Development',
    description: 'Build pipeline and development docs',
    icon: Wrench,
    color: 'yellow',
    docs: [
      { name: 'Build Pipeline', href: '/docs/phase-3-build-pipeline.md', description: 'CI/CD pipeline' },
      { name: 'Implementation Status', href: '/docs/IMPLEMENTATION-STATUS.md', description: 'What is implemented' },
      { name: 'GitHub Workflows', href: '/.github/workflows/README.md', description: 'CI/CD automation' },
    ],
  },
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-100 text-blue-600',
    hover: 'hover:border-blue-300',
    badge: 'bg-blue-100 text-blue-700',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'bg-red-100 text-red-600',
    hover: 'hover:border-red-300',
    badge: 'bg-red-100 text-red-700',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-100 text-green-600',
    hover: 'hover:border-green-300',
    badge: 'bg-green-100 text-green-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-100 text-purple-600',
    hover: 'hover:border-purple-300',
    badge: 'bg-purple-100 text-purple-700',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: 'bg-orange-100 text-orange-600',
    hover: 'hover:border-orange-300',
    badge: 'bg-orange-100 text-orange-700',
  },
  pink: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    icon: 'bg-pink-100 text-pink-600',
    hover: 'hover:border-pink-300',
    badge: 'bg-pink-100 text-pink-700',
  },
  indigo: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'bg-indigo-100 text-indigo-600',
    hover: 'hover:border-indigo-300',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'bg-gray-100 text-gray-600',
    hover: 'hover:border-gray-300',
    badge: 'bg-gray-100 text-gray-700',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    icon: 'bg-teal-100 text-teal-600',
    hover: 'hover:border-teal-300',
    badge: 'bg-teal-100 text-teal-700',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'bg-yellow-100 text-yellow-600',
    hover: 'hover:border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-700',
  },
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Book className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete guides, tutorials, and API reference for SiteForge.
            <br />
            Everything you need to build, deploy, and maintain your application.
          </p>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-12">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2">New to SiteForge?</h2>
              <p className="text-gray-700 mb-4">Start with the Setup Guide to get your production environment ready in 30-60 minutes!</p>
              <a 
                href="/setup/"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Setup Guide
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Documentation Categories */}
        <div className="space-y-8">
          {docCategories.map((category) => {
            const colors = colorClasses[category.color]
            const Icon = category.icon

            return (
              <div key={category.title} className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {category.title}
                    </h2>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.docs.map((doc) => (
                    <a
                      key={doc.name}
                      href={doc.href}
                      className={`${colors.bg} border-2 ${colors.border} ${colors.hover} rounded-xl p-4 transition-all hover:shadow-md group`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                              {doc.name}
                            </h3>
                            {doc.badge && (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                                {doc.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {doc.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <FileText className="w-8 h-8 text-gray-600" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Need more help?</div>
              <div className="text-sm text-gray-600">
                All documentation is also available in the <code className="bg-white px-2 py-0.5 rounded text-xs border border-gray-200">docs/</code> folder
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
