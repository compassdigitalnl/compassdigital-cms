'use client'

/**
 * Platform Settings Page - Professional Edition
 *
 * Allows configuration of platform-wide settings:
 * - Base domain configuration
 * - Default billing settings
 * - Email configuration
 * - Vercel API integration
 * - Default templates
 * - Platform branding
 */

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { Button } from '@/branches/shared/components/ui/button'
import { Input } from '@/branches/shared/components/ui/input'
import { Label } from '@/branches/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/branches/shared/components/ui/select'
import { Badge } from '@/branches/shared/components/ui/badge'
import {
  Settings,
  Globe,
  DollarSign,
  Mail,
  Key,
  Palette,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

interface PlatformSettings {
  // Domain & Hosting
  baseUrl: string
  defaultSubdomain: string

  // Billing
  defaultPlan: string
  defaultMonthlyFee: number
  currency: string

  // Email
  emailProvider: string
  fromEmail: string
  fromName: string

  // Vercel Integration
  vercelApiToken: string
  vercelOrgId: string
  vercelDefaultRegion: string

  // Templates
  defaultTemplate: string

  // Branding
  platformName: string
  supportEmail: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>({
    baseUrl: process.env.PLATFORM_BASE_URL || 'compassdigital.nl',
    defaultSubdomain: '',
    defaultPlan: 'starter',
    defaultMonthlyFee: 99,
    currency: 'EUR',
    emailProvider: 'resend',
    fromEmail: 'noreply@compassdigital.nl',
    fromName: 'Compass Digital',
    vercelApiToken: '',
    vercelOrgId: '',
    vercelDefaultRegion: 'ams1',
    defaultTemplate: 'b2b',
    platformName: 'Compass Digital',
    supportEmail: 'support@compassdigital.nl',
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load settings from environment/API
  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      // In a real implementation, load from API or database
      // For now, use environment variables as defaults
      setSettings((prev) => ({
        ...prev,
        baseUrl: process.env.NEXT_PUBLIC_PLATFORM_BASE_URL || prev.baseUrl,
      }))
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      // TODO: Save to API/database
      // For now, just simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)

      console.log('Settings saved:', settings)
    } catch (error: any) {
      setError(error.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    if (confirm('Reset all settings to defaults?')) {
      loadSettings()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure platform-wide settings and integrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Domain & Hosting Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain & Hosting
          </CardTitle>
          <CardDescription>Configure base domain and subdomain settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base Domain</Label>
              <Input
                id="baseUrl"
                value={settings.baseUrl}
                onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                placeholder="compassdigital.nl"
              />
              <p className="text-xs text-muted-foreground">
                Client sites will be created as: client.{settings.baseUrl}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSubdomain">Default Subdomain Prefix</Label>
              <Input
                id="defaultSubdomain"
                value={settings.defaultSubdomain}
                onChange={(e) => setSettings({ ...settings, defaultSubdomain: e.target.value })}
                placeholder="app, site, demo"
              />
              <p className="text-xs text-muted-foreground">
                Optional prefix for generated subdomains
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Billing Defaults
          </CardTitle>
          <CardDescription>Default billing settings for new clients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultPlan">Default Plan</Label>
              <Select
                value={settings.defaultPlan}
                onValueChange={(value) => setSettings({ ...settings, defaultPlan: value })}
              >
                <SelectTrigger id="defaultPlan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultMonthlyFee">Default Monthly Fee</Label>
              <Input
                id="defaultMonthlyFee"
                type="number"
                value={settings.defaultMonthlyFee}
                onChange={(e) =>
                  setSettings({ ...settings, defaultMonthlyFee: Number(e.target.value) })
                }
                placeholder="99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
          <CardDescription>Email provider and sender settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailProvider">Email Provider</Label>
              <Select
                value={settings.emailProvider}
                onValueChange={(value) => setSettings({ ...settings, emailProvider: value })}
              >
                <SelectTrigger id="emailProvider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resend">Resend</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="smtp">SMTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input
                id="fromEmail"
                type="email"
                value={settings.fromEmail}
                onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                placeholder="noreply@compassdigital.nl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={settings.fromName}
                onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                placeholder="Compass Digital"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vercel Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Vercel Integration
          </CardTitle>
          <CardDescription>API credentials for automated deployments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vercelApiToken">Vercel API Token</Label>
              <Input
                id="vercelApiToken"
                type="password"
                value={settings.vercelApiToken}
                onChange={(e) => setSettings({ ...settings, vercelApiToken: e.target.value })}
                placeholder="vercel_••••••••"
              />
              <p className="text-xs text-muted-foreground">
                Get your token at{' '}
                <a
                  href="https://vercel.com/account/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  vercel.com/account/tokens
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vercelOrgId">Vercel Organization ID</Label>
              <Input
                id="vercelOrgId"
                value={settings.vercelOrgId}
                onChange={(e) => setSettings({ ...settings, vercelOrgId: e.target.value })}
                placeholder="team_••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vercelDefaultRegion">Default Deployment Region</Label>
            <Select
              value={settings.vercelDefaultRegion}
              onValueChange={(value) => setSettings({ ...settings, vercelDefaultRegion: value })}
            >
              <SelectTrigger id="vercelDefaultRegion" className="md:w-1/2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ams1">Amsterdam (ams1)</SelectItem>
                <SelectItem value="cdg1">Paris (cdg1)</SelectItem>
                <SelectItem value="lhr1">London (lhr1)</SelectItem>
                <SelectItem value="fra1">Frankfurt (fra1)</SelectItem>
                <SelectItem value="iad1">Washington DC (iad1)</SelectItem>
                <SelectItem value="sfo1">San Francisco (sfo1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {settings.vercelApiToken && settings.vercelOrgId && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <p className="font-medium">Vercel integration configured</p>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Automated deployments are enabled
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Templates & Branding
          </CardTitle>
          <CardDescription>Default templates and platform branding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultTemplate">Default Template</Label>
              <Select
                value={settings.defaultTemplate}
                onValueChange={(value) => setSettings({ ...settings, defaultTemplate: value })}
              >
                <SelectTrigger id="defaultTemplate">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                placeholder="Compass Digital"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              placeholder="support@compassdigital.nl"
              className="md:w-1/2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Summary
          </CardTitle>
          <CardDescription>Current platform configuration at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Base Domain</p>
              <p className="text-lg font-semibold">{settings.baseUrl}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Default Plan</p>
              <Badge variant="outline" className="mt-1 capitalize">
                {settings.defaultPlan}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Fee</p>
              <p className="text-lg font-semibold">
                {settings.currency === 'EUR' && '€'}
                {settings.currency === 'USD' && '$'}
                {settings.currency === 'GBP' && '£'}
                {settings.defaultMonthlyFee}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vercel Status</p>
              <Badge
                variant="outline"
                className={
                  settings.vercelApiToken && settings.vercelOrgId
                    ? 'bg-green-100 text-green-800 mt-1'
                    : 'bg-yellow-100 text-yellow-800 mt-1'
                }
              >
                {settings.vercelApiToken && settings.vercelOrgId ? 'Connected' : 'Not Configured'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
