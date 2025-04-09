#!/usr/bin/env node

// Load environment variables from .env files
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Set default environment variables if not present
process.env.NEXT_PUBLIC_LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';
// Don't override LOG_TO_FILE if set in environment, only provide default
process.env.NEXT_PUBLIC_LOG_TO_FILE = process.env.NEXT_PUBLIC_LOG_TO_FILE || 'true';

// Debug logging for environment variables
console.log(`Log environment variables loaded:
- NEXT_PUBLIC_LOG_LEVEL: ${process.env.NEXT_PUBLIC_LOG_LEVEL}
- NEXT_PUBLIC_LOG_TO_FILE: ${process.env.NEXT_PUBLIC_LOG_TO_FILE}`);

// Import server logger to ensure logs directory is created
import serverLogger from './server-logger.js';

// Log startup with colors
const startupMessage = 'Starting Next.js development server with logging enabled';
serverLogger.info(startupMessage);

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

// Get log level and file logging status for display
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';
const isFileLoggingEnabled = process.env.NEXT_PUBLIC_LOG_TO_FILE === 'true';
const fileLoggingStatus = isFileLoggingEnabled ? 'enabled' : 'disabled';
const fileLoggingColor = isFileLoggingEnabled ? colors.green : colors.red;

// Display colorful startup banner
console.log(
  '\n' +
    `${colors.bold}${colors.green}╔════════════════════════════════════════════════════════╗${colors.reset}\n` +
    `${colors.bold}${colors.green}║${colors.reset} ${colors.cyan}Next.js Development Server${colors.reset}                          ${colors.bold}${colors.green}║${colors.reset}\n` +
    `${colors.bold}${colors.green}║${colors.reset}                                                    ${colors.bold}${colors.green}║${colors.reset}\n` +
    `${colors.bold}${colors.green}║${colors.reset} ${colors.bold}• Terminal logging:${colors.reset} ${colors.green}enabled${colors.reset} (level: ${logLevel})          ${colors.bold}${colors.green}║${colors.reset}\n` +
    `${colors.bold}${colors.green}║${colors.reset} ${colors.bold}• File logging:${colors.reset} ${fileLoggingColor}${fileLoggingStatus}${colors.reset}${isFileLoggingEnabled ? ` ${colors.blue}(./logs/all.log)${colors.reset}` : ''}            ${colors.bold}${colors.green}║${colors.reset}\n` +
    `${colors.bold}${colors.green}╚════════════════════════════════════════════════════════╝${colors.reset}\n`
);

// Spawn the Next.js dev process
import { spawn } from 'child_process';
const nextDev = spawn('npx', ['next', 'dev', '--turbopack'], {
  stdio: 'pipe',
  shell: true,
  env: process.env,
});

// Pipe stdout to process.stdout and log file
nextDev.stdout.on('data', data => {
  const output = data.toString();
  process.stdout.write(output); // Write to terminal
  if (isFileLoggingEnabled) {
    serverLogger.raw(output.trim(), 'info'); // Log to file without duplicate console output
  }
});

// Pipe stderr to process.stderr and log file
nextDev.stderr.on('data', data => {
  const output = data.toString();
  process.stderr.write(output); // Write to terminal
  if (isFileLoggingEnabled) {
    serverLogger.raw(output.trim(), 'error'); // Log to file as error without duplicate console output
  }
});

// Handle process events
nextDev.on('exit', code => {
  const exitMessage = `Next.js development server exited with code ${code}`;
  serverLogger.info(exitMessage);
  process.exit(code);
});

// Forward signals to child process
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    const shutdownMessage = `Received ${signal}, shutting down Next.js`;
    serverLogger.info(shutdownMessage);
    nextDev.kill(signal);
  });
});
