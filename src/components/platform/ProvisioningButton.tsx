'use client'

/**
 * 1-Click Provisioning Button Component
 *
 * Handles the complete provisioning workflow:
 * 1. Trigger provisioning via API
 * 2. Connect to SSE for realtime progress
 * 3. Show progress UI with steps
 * 4. Handle completion/errors
 *
 * Can be used in:
 * - Client detail pages
 * - Wizard completion
 * - Clients list
 */

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Rocket, Check, X, Loader2, ExternalLink } from 'lucide-react'

interface ProvisioningButtonProps {
  clientId: string
  clientName: string
  clientStatus?: string
  onSuccess?: (result: any) => void
  onError?: (error: string) => void
}

interface ProvisioningState {
  status: 'idle' | 'connecting' | 'provisioning' | 'completed' | 'failed'
  progress: number
  message: string
  deploymentUrl?: string
  adminUrl?: string
  error?: string
  logs?: string[]
}

export function ProvisioningButton({
  clientId,
  clientName,
  clientStatus = 'pending',
  onSuccess,
  onError,
}: ProvisioningButtonProps) {
  const [state, setState] = useState<ProvisioningState>({
    status: 'idle',
    progress: 0,
    message: '',
  })

  /**
   * Start provisioning workflow
   */
  async function startProvisioning() {
    // Generate unique SSE connection ID
    const sseConnectionId = `provision-${clientId}-${Date.now()}`

    setState({
      status: 'connecting',
      progress: 0,
      message: 'Connecting to provisioning service...',
    })

    try {
      // Connect to SSE for realtime updates
      const eventSource = new EventSource(`/api/ai/stream/${sseConnectionId}`)

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          if (data.type === 'progress') {
            setState((prev) => ({
              ...prev,
              status: 'provisioning',
              progress: data.progress || 0,
              message: data.message || '',
            }))
          } else if (data.type === 'complete') {
            setState({
              status: 'completed',
              progress: 100,
              message: 'Provisioning completed successfully!',
              deploymentUrl: data.data?.deploymentUrl,
              adminUrl: data.data?.adminUrl,
            })

            if (onSuccess) {
              onSuccess(data.data)
            }

            eventSource.close()
          } else if (data.type === 'error') {
            setState({
              status: 'failed',
              progress: 0,
              message: data.error || 'Provisioning failed',
              error: data.error,
            })

            if (onError) {
              onError(data.error)
            }

            eventSource.close()
          }
        } catch (error) {
          console.error('Failed to parse SSE message:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error)
        setState((prev) => ({
          ...prev,
          status: 'failed',
          message: 'Connection to provisioning service lost',
          error: 'SSE connection error',
        }))
        eventSource.close()
      }

      // Trigger provisioning API
      // Note: We'll need to pass wizard data - for now using dummy data
      const response = await fetch('/api/wizard/provision-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          sseConnectionId,
          wizardData: {
            siteName: clientName,
            industry: 'general',
            styling: {
              primaryColor: '#3B82F6',
            },
          },
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to start provisioning')
      }

      setState((prev) => ({
        ...prev,
        status: 'provisioning',
        message: 'Provisioning started...',
      }))
    } catch (error: any) {
      console.error('Provisioning error:', error)
      setState({
        status: 'failed',
        progress: 0,
        message: error.message || 'Failed to start provisioning',
        error: error.message,
      })

      if (onError) {
        onError(error.message)
      }
    }
  }

  /**
   * Reset state
   */
  function reset() {
    setState({
      status: 'idle',
      progress: 0,
      message: '',
    })
  }

  // Show button only if not deployed
  if (clientStatus === 'active' && state.status === 'idle') {
    return (
      <Badge variant="outline" className="text-green-600">
        <Check className="w-3 h-3 mr-1" />
        Already Deployed
      </Badge>
    )
  }

  // Idle state - show launch button
  if (state.status === 'idle') {
    return (
      <Button onClick={startProvisioning} size="lg" className="gap-2">
        <Rocket className="w-4 h-4" />
        Launch Site Now
      </Button>
    )
  }

  // Provisioning in progress
  if (state.status === 'connecting' || state.status === 'provisioning') {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Provisioning {clientName}...
          </CardTitle>
          <CardDescription>
            Setting up deployment, this will take 2-5 minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{state.message}</span>
              <span className="text-muted-foreground">{Math.round(state.progress)}%</span>
            </div>
            <Progress value={state.progress} className="h-2" />
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Current step: {state.message}</p>
            <p>Please don't close this window...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Completed
  if (state.status === 'completed') {
    return (
      <Card className="w-full max-w-2xl border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Check className="w-5 h-5" />
            Site Deployed Successfully!
          </CardTitle>
          <CardDescription>
            {clientName} is now live and ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {state.deploymentUrl && (
              <a
                href={state.deploymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Globe className="w-4 h-4" />
                {state.deploymentUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {state.adminUrl && (
              <a
                href={state.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <Globe className="w-4 h-4" />
                Admin Panel: {state.adminUrl}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => window.open(state.deploymentUrl, '_blank')}
              disabled={!state.deploymentUrl}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Site
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Failed
  if (state.status === 'failed') {
    return (
      <Card className="w-full max-w-2xl border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <X className="w-5 h-5" />
            Provisioning Failed
          </CardTitle>
          <CardDescription>{state.message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && (
            <div className="text-sm text-red-600 bg-red-100 p-3 rounded">
              <p className="font-semibold">Error:</p>
              <p>{state.error}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              Close
            </Button>
            <Button size="sm" onClick={startProvisioning}>
              <Rocket className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
