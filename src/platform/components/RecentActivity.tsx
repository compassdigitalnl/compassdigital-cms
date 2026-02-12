'use client'

/**
 * Recent Activity Feed
 * Shows recent deployments and events
 */

import React from 'react'

export default function RecentActivity() {
  // TODO: Fetch actual recent activity from API
  const activities = [
    {
      id: 1,
      type: 'deployment',
      client: 'ACME Corp',
      message: 'Deployment completed successfully',
      time: '2 minutes ago',
      status: 'success',
    },
    {
      id: 2,
      type: 'client',
      client: 'Beta Medical',
      message: 'New client provisioned',
      time: '1 hour ago',
      status: 'success',
    },
    {
      id: 3,
      type: 'deployment',
      client: 'Test Site',
      message: 'Deployment failed',
      time: '3 hours ago',
      status: 'failed',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{activity.client}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
              >
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <a href="/platform/deployments" className="text-sm text-blue-600 hover:text-blue-700">
          View all activity →
        </a>
      </div>
    </div>
  )
}
