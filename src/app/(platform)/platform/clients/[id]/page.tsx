'use client'

/**
 * Client Detail Page - Professional Edition
 *
 * Shows complete client information:
 * - Overview (name, domain, template, status)
 * - Deployment info (URLs, dates, status)
 * - Billing (plan, revenue, next billing)
 * - Health monitoring (uptime, last check)
 * - Actions (edit, visit, deploy)
 */

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  RefreshCw,
  Settings,
  AlertCircle,
  CheckCircle2,
  Globe,
  Calendar,
  DollarSign,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'

interface Client {
  id: string
  name: string
  domain: string
  template: string
  status: string
  billingStatus: string
  monthlyFee: number
  plan: string
  healthStatus: string
  createdAt: string
  updatedAt: string
  deploymentUrl?: string
  adminUrl?: string
  contactEmail?: string
  contactName?: string
  nextBillingDate?: string
  lastHealthCheck?: string
  uptimePercentage?: number
  enabledFeatures?: Array<{ feature: string }>
}

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)

  useEffect(() => {
    fetchClient()
  }, [params.id])

  async function fetchClient() {
    try {
      setLoading(true)
      const response = await fetch(`/api/clients/${params.id}`)
      const data = await response.json()

      if (data) {
        setClient(data)
      }
    } catch (error) {
      console.error('Failed to fetch client:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRedeploy() {
    if (!confirm('Trigger a new deployment for this client?')) return

    setDeploying(true)
    try {
      const response = await fetch(`/api/platform/clients/${params.id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'redeploy' }),
      })

      const result = await response.json()

      if (result.success) {
        alert(
          result.message +
            (result.deploymentUrl
              ? `\n\nDeployment URL: ${result.deploymentUrl}\nState: ${result.state || 'pending'}`
              : ''),
        )
        // Refresh client data to show updated status
        fetchClient()
      } else {
        alert(`Deployment failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('Deployment failed:', error)
      alert(`Deployment failed: ${error.message || 'Unknown error'}`)
    } finally {
      setDeploying(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium">Client not found</p>
          <Button asChild className="mt-4">
            <Link href="/platform/clients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  function getStatusBadge(status: string) {
    const config: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      deploying: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Deploying' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' },
    }
    const style = config[status] || config.pending
    return (
      <Badge variant="outline" className={`${style.bg} ${style.text}`}>
        {style.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/platform/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-muted-foreground mt-1">
              {client.domain}.compassdigital.nl
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/collections/clients/${client.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit in CMS
            </Link>
          </Button>
          {client.deploymentUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(client.deploymentUrl, '_blank')}
            >
              <Globe className="mr-2 h-4 w-4" />
              Visit Site
            </Button>
          )}
          {client.adminUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(client.adminUrl, '_blank')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Admin Panel
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(client.status)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Template
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {client.template}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="capitalize">
              {client.plan || 'starter'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              €{client.monthlyFee || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deployment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Deployment
            </CardTitle>
            <CardDescription>Site deployment and access information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Deployment URL
              </label>
              <div className="mt-1">
                {client.deploymentUrl ? (
                  <a
                    href={client.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {client.deploymentUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not deployed yet</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Admin Panel URL
              </label>
              <div className="mt-1">
                {client.adminUrl ? (
                  <a
                    href={client.adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {client.adminUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not available</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={handleRedeploy}
                disabled={deploying}
                className="w-full"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${deploying ? 'animate-spin' : ''}`} />
                {deploying ? 'Deploying...' : 'Trigger Redeploy'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Billing
            </CardTitle>
            <CardDescription>Subscription and payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Plan
                </label>
                <p className="text-sm font-medium mt-1 capitalize">
                  {client.plan || 'Starter'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Billing Status
                </label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={
                      client.billingStatus === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {client.billingStatus || 'active'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Monthly Fee
              </label>
              <p className="text-2xl font-bold mt-1">
                €{client.monthlyFee || 0}/mo
              </p>
            </div>

            {client.nextBillingDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Next Billing Date
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(client.nextBillingDate), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Health & Monitoring
            </CardTitle>
            <CardDescription>Site health and uptime statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Health Status
              </label>
              <div className="mt-1 flex items-center gap-2">
                {client.healthStatus === 'healthy' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Healthy</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">
                      {client.healthStatus || 'Unknown'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {client.uptimePercentage !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Uptime (30 days)
                </label>
                <p className="text-2xl font-bold mt-1">
                  {client.uptimePercentage}%
                </p>
              </div>
            )}

            {client.lastHealthCheck && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Health Check
                </label>
                <p className="text-sm mt-1">
                  {format(new Date(client.lastHealthCheck), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact & Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Details</CardTitle>
            <CardDescription>Client contact information and metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {client.contactName && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Contact Name
                </label>
                <p className="text-sm mt-1">{client.contactName}</p>
              </div>
            )}

            {client.contactEmail && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Contact Email
                </label>
                <a
                  href={`mailto:${client.contactEmail}`}
                  className="text-sm text-blue-600 hover:underline block mt-1"
                >
                  {client.contactEmail}
                </a>
              </div>
            )}

            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm mt-1">
                {format(new Date(client.createdAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm mt-1">
                {format(new Date(client.updatedAt), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enabled Features */}
      {client.enabledFeatures && client.enabledFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enabled Features</CardTitle>
            <CardDescription>Active features for this client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {client.enabledFeatures.map((item, index) => (
                <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700">
                  {item.feature}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
