'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/branches/shared/components/ui/card'
import { Badge } from '@/branches/shared/components/ui/badge'
import {
  Activity,
  UserPlus,
  Globe,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
  id: string
  type: 'client_created' | 'client_activated' | 'client_suspended' | 'payment_received' | 'health_check'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'warning' | 'error' | 'info'
  clientName?: string
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  async function fetchRecentActivity() {
    try {
      // Fetch recent clients
      const response = await fetch('/api/clients?limit=10&sort=-createdAt')
      const data = await response.json()

      if (data.docs) {
        // Convert clients to activity items
        const clientActivities: ActivityItem[] = data.docs.map((client: any) => ({
          id: client.id,
          type: 'client_created',
          title: `New client: ${client.name}`,
          description: `${client.template} template · ${client.plan || 'free'} plan`,
          timestamp: client.createdAt,
          status: client.status === 'active' ? 'success' : 'info',
          clientName: client.name,
        }))

        // Sort by timestamp
        const sorted = clientActivities.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )

        setActivities(sorted.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to fetch activity:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case 'client_created':
        return <UserPlus className="h-4 w-4" />
      case 'client_activated':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'client_suspended':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'payment_received':
        return <DollarSign className="h-4 w-4 text-green-600" />
      case 'health_check':
        if (status === 'error') {
          return <AlertCircle className="h-4 w-4 text-red-600" />
        }
        return <Activity className="h-4 w-4 text-green-600" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>
      case 'warning':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'error':
        return <Badge variant="default" className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Info</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest platform events and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="mx-auto h-12 w-12 mb-2 text-gray-400" />
            <p>No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">
              Create your first client to see activity here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest platform events and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="rounded-full bg-gray-100 p-2">{getActivityIcon(activity.type, activity.status)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  {activity.status && getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
