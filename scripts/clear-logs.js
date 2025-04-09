#!/usr/bin/env node
// Script to clear log files

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Import server logger
import serverLogger from './server-logger.js';

// Execute the clearLogs function
try {
  console.log('Clearing previous logs...');
  serverLogger.clearLogs();
} catch (error) {
  console.error('Failed to clear logs:', error);
  process.exit(1);
}
