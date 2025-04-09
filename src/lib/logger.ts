// Simple isomorphic logger compatible with both client and Edge environments
// Server-side logging to files is handled separately to avoid Edge Runtime warnings

// Define minimum log level
const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';

// Log level hierarchy
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Format timestamp
const timestamp = () => {
  return new Date().toISOString();
};

// Check if message should be logged based on level
const shouldLog = (level: keyof typeof LOG_LEVELS): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[LOG_LEVEL as keyof typeof LOG_LEVELS];
};

// Color mapping for console logs
const COLORS = {
  error: '\x1b[31m', // red
  warn: '\x1b[33m', // yellow
  info: '\x1b[32m', // green
  http: '\x1b[35m', // magenta
  debug: '\x1b[34m', // blue
  reset: '\x1b[0m', // reset
};

/**
 * Universal logger that works in any JavaScript environment
 */
const logger = {
  /**
   * Log error message
   */
  error: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('error')) {
      console.error(
        `${COLORS.error}[ERROR]${COLORS.reset} ${timestamp()} - ${message}`,
        meta || ''
      );
    }
  },

  /**
   * Log warning message
   */
  warn: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('warn')) {
      console.warn(`${COLORS.warn}[WARN]${COLORS.reset} ${timestamp()} - ${message}`, meta || '');
    }
  },

  /**
   * Log info message
   */
  info: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('info')) {
      console.info(`${COLORS.info}[INFO]${COLORS.reset} ${timestamp()} - ${message}`, meta || '');
    }
  },

  /**
   * Log HTTP request/response
   */
  http: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('http')) {
      console.log(`${COLORS.http}[HTTP]${COLORS.reset} ${timestamp()} - ${message}`, meta || '');
    }
  },

  /**
   * Log debug information
   */
  debug: (message: string, meta?: Record<string, unknown>): void => {
    if (shouldLog('debug')) {
      console.debug(
        `${COLORS.debug}[DEBUG]${COLORS.reset} ${timestamp()} - ${message}`,
        meta || ''
      );
    }
  },
};

export default logger;
