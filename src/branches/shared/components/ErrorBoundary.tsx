'use client'

import { Component, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
          <div className="mb-4 rounded-full bg-red-100 p-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Er is iets misgegaan</h2>
          <p className="mb-6 max-w-md text-center text-sm text-gray-600">
            {this.state.error?.message || 'Een onverwachte fout is opgetreden'}
          </p>
          <Button onClick={this.handleReset} icon={RefreshCw}>
            Probeer opnieuw
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
