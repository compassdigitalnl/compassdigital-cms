import React from 'react'
import { Metadata } from 'next'
import { Check, Circle, ExternalLink, Clock, Database, Key, Github, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Setup Guide | SiteForge',
  description: 'Complete setup guide for deploying SiteForge to production',
}

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-grey-light to-white">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-4">
            <Check className="w-8 h-8 text-teal" />
          </div>
          <h1 className="text-4xl font-bold text-navy mb-4">
            Setup Guide
          </h1>
          <p className="text-xl text-grey-dark max-w-2xl mx-auto">
            Follow these steps to complete your SiteForge setup and go live! 
            <br />
            <span className="text-sm text-grey-mid">⏱️ Estimated time: 30-60 minutes</span>
          </p>
        </div>

        {/* Status Overview */}
        <div className="bg-white border-2 border-grey-light rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-navy mb-2">
                Code Development: 100% Complete! 🎉
              </h2>
              <p className="text-grey-dark">
                All features, tests, CI/CD workflows, and documentation are finished.
                Only external configuration remains!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-700 font-semibold mb-1">✅ Features</div>
              <div className="text-sm text-green">All implemented</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-700 font-semibold mb-1">✅ Testing</div>
              <div className="text-sm text-green">30+ tests ready</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-700 font-semibold mb-1">✅ CI/CD</div>
              <div className="text-sm text-green">Workflows created</div>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1: PostgreSQL */}
          <div className="bg-white border-2 border-grey-light rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-teal" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-navy">
                    Step 1: PostgreSQL Database
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Clock className="w-4 h-4" />
                    15 min
                  </span>
                  <span className="inline-flex items-center text-sm text-coral bg-coral-50 px-3 py-1 rounded-full border border-coral/20 font-semibold">
                    Required
                  </span>
                </div>

                <p className="text-grey-dark mb-6">
                  Replace SQLite with production-ready PostgreSQL database. Currently using SQLite for development.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-navy mb-3">Option A: Railway (Recommended)</h4>
                    <div className="bg-grey-light rounded-lg p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-navy">1. Create Railway account</div>
                          <a 
                            href="https://railway.app" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-teal hover:text-teal-700 text-sm inline-flex items-center gap-1"
                          >
                            railway.app
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                        <div className="font-medium text-navy">2. Provision PostgreSQL database</div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-navy mb-1">3. Copy DATABASE_URL</div>
                          <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark">
                            postgresql://user:pass@host:5432/db
                          </code>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-navy mb-1">4. Update .env file</div>
                          <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark block">
                            DATABASE_URL="postgresql://..."
                          </code>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-navy mb-1">5. Run migration</div>
                          <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark">
                            npm run dev
                          </code>
                          <div className="text-sm text-grey-mid mt-1">(Auto-migrates on start)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-navy mb-3">Option B: Supabase (For scale)</h4>
                    <div className="bg-grey-light rounded-lg p-4">
                      <a 
                        href="https://supabase.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-teal hover:text-teal-700 inline-flex items-center gap-1"
                      >
                        supabase.com - Free tier: 500MB
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: API Keys */}
          <div className="bg-white border-2 border-grey-light rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                  <Key className="w-6 h-6 text-teal" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-navy">
                    Step 2: Production API Keys
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Clock className="w-4 h-4" />
                    30 min
                  </span>
                  <span className="inline-flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Recommended
                  </span>
                </div>

                <p className="text-grey-dark mb-6">
                  Get production credentials for analytics, error tracking, and spam protection.
                </p>

                <div className="space-y-4">
                  <div className="bg-grey-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-navy">Google Analytics (GA4)</div>
                      <span className="text-xs text-grey-mid">5 min</span>
                    </div>
                    <a 
                      href="https://analytics.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal hover:text-teal-700 text-sm inline-flex items-center gap-1"
                    >
                      analytics.google.com → Get G-XXXXXXXXXX
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="mt-2">
                      <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark">
                        NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
                      </code>
                    </div>
                  </div>

                  <div className="bg-grey-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-navy">Sentry Error Tracking</div>
                      <span className="text-xs text-grey-mid">10 min</span>
                    </div>
                    <a 
                      href="https://sentry.io" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal hover:text-teal-700 text-sm inline-flex items-center gap-1"
                    >
                      sentry.io → Create Next.js project
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="mt-2 space-y-1">
                      <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark block">
                        NEXT_PUBLIC_SENTRY_DSN=https://...
                      </code>
                    </div>
                  </div>

                  <div className="bg-grey-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-navy">reCAPTCHA v3 (Real keys)</div>
                      <span className="text-xs text-grey-mid">10 min</span>
                    </div>
                    <a 
                      href="https://www.google.com/recaptcha/admin/create" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal hover:text-teal-700 text-sm inline-flex items-center gap-1"
                    >
                      google.com/recaptcha → Select v3
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="mt-2 space-y-1">
                      <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark block">
                        NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
                      </code>
                      <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark block">
                        RECAPTCHA_SECRET_KEY=6Lc...
                      </code>
                    </div>
                    <div className="text-xs text-grey-mid mt-2">
                      ⚠️ Currently using test keys - replace for production!
                    </div>
                  </div>

                  <div className="bg-grey-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-navy">Resend Email (Optional)</div>
                      <span className="text-xs text-grey-mid">5 min</span>
                    </div>
                    <a 
                      href="https://resend.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-teal hover:text-teal-700 text-sm inline-flex items-center gap-1"
                    >
                      resend.com → 100 emails/day free
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="mt-2">
                      <code className="text-xs bg-white px-2 py-1 rounded border border-grey-light text-grey-dark">
                        RESEND_API_KEY=re_...
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: GitHub Actions */}
          <div className="bg-white border-2 border-grey-light rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center">
                  <Github className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-navy">
                    Step 3: GitHub Actions Setup
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Clock className="w-4 h-4" />
                    15 min
                  </span>
                  <span className="inline-flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Recommended
                  </span>
                </div>

                <p className="text-grey-dark mb-6">
                  Configure GitHub secrets for automated CI/CD workflows.
                </p>

                <div className="space-y-4">
                  <div className="bg-grey-light rounded-lg p-4">
                    <div className="font-semibold text-navy mb-3">Required Secrets</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <code className="bg-white px-2 py-1 rounded border border-grey-light text-grey-dark text-xs">PAYLOAD_SECRET</code>
                        <span className="text-grey-mid">- Min 32 characters</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <code className="bg-white px-2 py-1 rounded border border-grey-light text-grey-dark text-xs">DATABASE_URL</code>
                        <span className="text-grey-mid">- PostgreSQL connection</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <code className="bg-white px-2 py-1 rounded border border-grey-light text-grey-dark text-xs">NEXT_PUBLIC_SERVER_URL</code>
                        <span className="text-grey-mid">- Production URL</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <code className="bg-white px-2 py-1 rounded border border-grey-light text-grey-dark text-xs">VERCEL_TOKEN</code>
                        <span className="text-grey-mid">- For automated deployment</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-teal-50 border border-blue-200 rounded-lg p-4">
                    <div className="font-semibold text-blue-900 mb-2">📖 Complete Guide</div>
                    <p className="text-sm text-teal-700">
                      See <code className="bg-white px-1.5 py-0.5 rounded text-xs">.github/workflows/README.md</code> for detailed setup instructions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: UptimeRobot */}
          <div className="bg-white border-2 border-grey-light rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-navy">
                    Step 4: UptimeRobot Monitoring
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Clock className="w-4 h-4" />
                    15 min
                  </span>
                  <span className="inline-flex items-center text-sm text-grey-dark bg-grey-light px-3 py-1 rounded-full border border-grey-light">
                    Optional
                  </span>
                </div>

                <p className="text-grey-dark mb-6">
                  24/7 monitoring to get alerts if your site goes down.
                </p>

                <div className="space-y-4">
                  <div className="bg-grey-light rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-navy">1. Create account (free)</div>
                        <a 
                          href="https://uptimerobot.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teal hover:text-teal-700 text-sm inline-flex items-center gap-1"
                        >
                          uptimerobot.com
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                      <div className="font-medium text-navy">2. Add monitor: https://yourdomain.com</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                      <div className="font-medium text-navy">3. Add health check: /api/health</div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Circle className="w-5 h-5 text-grey-mid mt-0.5 flex-shrink-0" />
                      <div className="font-medium text-navy">4. Configure email alerts</div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-700">
                      ✅ Free tier: 50 monitors, 5-minute check interval
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-gradient-to-r from-teal-50 to-teal-50 border-2 border-teal-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-navy mb-4">
            After Setup - Deploy! 🚀
          </h2>
          <p className="text-grey-dark mb-6">
            Once external setup is complete, you can deploy your application:
          </p>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-grey-light">
              <code className="text-sm text-navy font-mono">npm run deploy</code>
              <div className="text-sm text-grey-mid mt-1">Deploy to production</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-grey-light">
              <code className="text-sm text-navy font-mono">npm run deploy:staging</code>
              <div className="text-sm text-grey-mid mt-1">Deploy to staging for testing</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-grey-light">
              <code className="text-sm text-navy font-mono">git push</code>
              <div className="text-sm text-grey-mid mt-1">Automatic deployment via GitHub Actions</div>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 text-center text-sm text-grey-mid">
          <p>Need help? Check the complete documentation in the <code className="bg-grey-light px-2 py-0.5 rounded">/docs</code> folder</p>
        </div>
      </div>
    </div>
  )
}
