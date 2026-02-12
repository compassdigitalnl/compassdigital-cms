/**
 * AI Service Logger
 * Centralized logging for AI operations
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  service: string
  message: string
  data?: unknown
  error?: Error
}

class AILogger {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  /**
   * Log an info message
   */
  info(service: string, message: string, data?: unknown) {
    this.log('info', service, message, data)
  }

  /**
   * Log a warning
   */
  warn(service: string, message: string, data?: unknown) {
    this.log('warn', service, message, data)
  }

  /**
   * Log an error
   */
  error(service: string, message: string, error?: Error, data?: unknown) {
    this.log('error', service, message, data, error)
  }

  /**
   * Log debug information
   */
  debug(service: string, message: string, data?: unknown) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', service, message, data)
    }
  }

  /**
   * Internal log method
   */
  private log(
    level: LogLevel,
    service: string,
    message: string,
    data?: unknown,
    error?: Error,
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      service,
      message,
      data,
      error,
    }

    // Add to in-memory logs
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output with colors
    const colors = {
      info: '\x1b[36m', // Cyan
      warn: '\x1b[33m', // Yellow
      error: '\x1b[31m', // Red
      debug: '\x1b[90m', // Gray
    }

    const reset = '\x1b[0m'
    const color = colors[level]

    console.log(
      `${color}[${level.toUpperCase()}]${reset} ${service}: ${message}`,
      data ? data : '',
      error ? error : '',
    )
  }

  /**
   * Get recent logs
   */
  getLogs(limit?: number): LogEntry[] {
    if (limit) {
      return this.logs.slice(-limit)
    }
    return this.logs
  }

  /**
   * Clear all logs
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level)
  }

  /**
   * Get logs by service
   */
  getLogsByService(service: string): LogEntry[] {
    return this.logs.filter((log) => log.service === service)
  }
}

// Export singleton
export const aiLogger = new AILogger()
