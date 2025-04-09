// server-logger.js - Use this in scripts or server-only components
// This file won't be included in Edge runtime environments

// @ts-check
// Remove problematic type annotation
// Will rely on JSDoc comments for type checking instead

// Load environment variables if called directly
try {
  import('dotenv').then(dotenv => dotenv.config({ path: '.env.local' }));
} catch (error) {
  console.log('Note: dotenv not available, environment variables may need to be set manually');
}

import fs from 'fs';
import path from 'path';

// Get environment variables for logging
const LOG_TO_FILE = process.env.NEXT_PUBLIC_LOG_TO_FILE === 'true';
const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';

// Debug environment variables
console.log(`Server logger initialized with:
- NEXT_PUBLIC_LOG_TO_FILE: ${process.env.NEXT_PUBLIC_LOG_TO_FILE || 'not set'} (${LOG_TO_FILE ? 'enabled' : 'disabled'})
- NEXT_PUBLIC_LOG_LEVEL: ${LOG_LEVEL}`);

// Define logs directory path
const logsDir = path.join(process.cwd(), 'logs');

// Create logs directory if file logging is enabled and directory doesn't exist
if (LOG_TO_FILE && !fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('Created logs directory for file logging');
}

// Format timestamp
const timestamp = () => {
  return new Date().toISOString();
};

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// Level-specific colors
const levelColors = {
  error: colors.red,
  warn: colors.yellow,
  info: colors.green,
  http: colors.blue,
  debug: colors.magenta,
};

/**
 * Strip ANSI color codes from a string
 * @param {string} str - String with potential color codes
 * @returns {string} - Clean string without color codes
 */
function stripColors(str) {
  return str.replace(/\x1B\[\d+m/g, '');
}

/**
 * Write a log message to file
 * @param {string} level - Log level (error, warn, info, http, debug)
 * @param {string} message - Log message
 * @param {object} meta - Optional metadata
 */
function writeLog(level, message, meta) {
  // Skip file logging if disabled
  if (!LOG_TO_FILE) {
    return;
  }

  try {
    // Strip any ANSI color codes from the message before writing to file
    const cleanMessage = stripColors(message);

    // Format log entry as JSON
    const logEntry =
      JSON.stringify(
        {
          timestamp: timestamp(),
          level,
          message: cleanMessage,
          ...(meta ? { meta } : {}),
        },
        null,
        0
      ) + '\n'; // Use null, 0 for compact single-line JSON

    // Append to appropriate log file
    const logFile =
      level === 'error' ? path.join(logsDir, 'error.log') : path.join(logsDir, 'all.log');

    // Append to file
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

/**
 * Server-side logger that writes to files and console
 * @typedef {Object} ServerLogger
 * @property {Function} error - Log error message
 * @property {Function} warn - Log warning message
 * @property {Function} info - Log info message
 * @property {Function} http - Log HTTP message
 * @property {Function} debug - Log debug message
 * @property {Function} raw - Log raw message (file only)
 * @property {Function} clearLogs - Clear log files
 */

/**
 * Server-side logger that writes to files
 * @type {ServerLogger}
 */
const serverLogger = {
  error: (message, meta) => {
    const color = levelColors.error;
    console.error(`${color}[ERROR]${colors.reset} ${timestamp()} - ${message}`, meta || '');
    writeLog('error', message, meta);
  },

  warn: (message, meta) => {
    const color = levelColors.warn;
    console.warn(`${color}[WARN]${colors.reset} ${timestamp()} - ${message}`, meta || '');
    writeLog('warn', message, meta);
  },

  info: (message, meta) => {
    const color = levelColors.info;
    console.info(`${color}[INFO]${colors.reset} ${timestamp()} - ${message}`, meta || '');
    writeLog('info', message, meta);
  },

  http: (message, meta) => {
    const color = levelColors.http;
    console.log(`${color}[HTTP]${colors.reset} ${timestamp()} - ${message}`, meta || '');
    writeLog('http', message, meta);
  },

  debug: (message, meta) => {
    const color = levelColors.debug;
    console.debug(`${color}[DEBUG]${colors.reset} ${timestamp()} - ${message}`, meta || '');
    writeLog('debug', message, meta);
  },

  /**
   * Log raw output from stdout/stderr
   * @param {string} message - Log message
   * @param {string} level - Log level (default: 'info')
   */
  raw: (message, level = 'info') => {
    // Only write to file, as this is for terminal output that's already displayed
    writeLog(level, message, null);
  },

  /**
   * Utility to clear all log files
   */
  clearLogs: () => {
    try {
      // Skip if file logging is disabled
      if (!LOG_TO_FILE) {
        console.log(
          `${colors.yellow}File logging is disabled, skipping log cleanup${colors.reset}`
        );
        return;
      }

      // Create logs directory if it doesn't exist
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
        console.log(`${colors.green}Created logs directory${colors.reset}`);
      }

      // Clean up existing log files
      if (fs.existsSync(path.join(logsDir, 'all.log'))) {
        fs.unlinkSync(path.join(logsDir, 'all.log'));
      }
      if (fs.existsSync(path.join(logsDir, 'error.log'))) {
        fs.unlinkSync(path.join(logsDir, 'error.log'));
      }
      console.log(`${colors.green}Log files cleared${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}Failed to clear log files:${colors.reset}`, error);
    }
  },
};

export default serverLogger;
