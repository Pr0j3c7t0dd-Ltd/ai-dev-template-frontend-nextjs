/**
 * Standard logger interface for both client and server loggers
 */
export interface Logger {
  error: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  http: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
}

/**
 * Server-side logger interface with additional utilities
 */
export interface ServerLogger extends Logger {
  clearLogs: () => void;
}
