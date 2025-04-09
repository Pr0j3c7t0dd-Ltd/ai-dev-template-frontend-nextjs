# Logging in Next.js

This project uses a dual logging system that works in both client and server environments, including Edge Runtime.

## Architecture

The logging system is split into two parts:

1. **Client/Edge Compatible Logger** (`src/lib/logger.ts`) - Logs to console only, safe to use in any component.
2. **Server-side File Logger** (`scripts/server-logger.js`) - Used for writing logs to files in Node.js environment.

The implementation includes wrapper scripts that ensure the logging is set up properly:

- `scripts/dev-with-logs.js` - For development with logging
- `scripts/start-with-logs.js` - For production with logging

## Running with Logging Enabled

To run the application with file-based logging enabled:

```bash
# Development with logging (creates logs directory automatically)
npm run dev:logs

# Production with logging (creates logs directory automatically)
npm run start:logs
```

## Log Files

Logs are stored in the `logs` directory at the root of the project:

- `logs/all.log` - Contains all log messages at the configured level
- `logs/error.log` - Contains only error-level logs

## Log Management

```bash
# Clear all log files
npm run logs:clear

# Test the server-side logging
npm run logs:test
```

## How It Works

When you run `npm run dev:logs` or `npm run start:logs`, the following happens:

1. The wrapper script imports the server logger which creates the logs directory
2. The script sets necessary environment variables for logging
3. The script starts Next.js as a child process with logging enabled
4. All logs are written to both the console and log files

## Using the Logger in Your Code

For components that run in both client and server environments:

```typescript
import logger from '@/lib/logger';

// Example usage
logger.error('This is an error message');
logger.warn('This is a warning message');
logger.info('This is an info message');
logger.http('This is an HTTP message');
logger.debug('This is a debug message');
```

For server-only scripts or components that need file logging:

```javascript
const serverLogger = require('../../scripts/server-logger');

// Example usage
serverLogger.error('This is an error message', { context: 'my-component', code: 500 });
```

## Adding Logging to Server Actions

For server actions or API routes that need to log to files:

```typescript
// Import the server logger with dynamic import
import type { Logger } from '@/types/logger';

export async function myServerAction() {
  // Regular client-compatible logger
  import logger from '@/lib/logger';

  try {
    // Your server code here
    logger.info('Server action executed successfully');

    // For file logging, conditionally import the server logger
    if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_LOG_TO_FILE === 'true') {
      // Dynamic import to prevent Edge Runtime warnings
      const serverLogger = await import('../../scripts/server-logger');
      serverLogger.info('Server action executed successfully', { details: 'extra info' });
    }

    return { success: true };
  } catch (error) {
    logger.error(`Server action failed: ${error.message}`);

    // Log to file if in server environment
    if (typeof window === 'undefined' && process.env.NEXT_PUBLIC_LOG_TO_FILE === 'true') {
      const serverLogger = await import('../../scripts/server-logger');
      serverLogger.error('Server action failed', { error: error.message, stack: error.stack });
    }

    return { success: false, error: error.message };
  }
}
```

## Log Levels

The logger supports the following log levels (from highest to lowest priority):

1. `error` - For errors and exceptions
2. `warn` - For warnings and deprecated features
3. `info` - For general information
4. `http` - For HTTP request logging
5. `debug` - For detailed debugging information

The default log level is set to `info`, which means it will capture `error`, `warn`, and `info` logs. To change the log level, set the `NEXT_PUBLIC_LOG_LEVEL` environment variable.

## Configuration

Logging behavior is controlled by environment variables:

- `NEXT_PUBLIC_LOG_LEVEL` - Sets the minimum log level (default: 'info')
- `NEXT_PUBLIC_LOG_TO_FILE` - When set to 'true', enables file logging (default: false)

These can be set in `.env.local` or passed directly to the run command.

## Best Practices

1. **Use context in log messages** - Include descriptive context in your log messages:

   ```typescript
   logger.info('[HomePage] User visited home page');
   ```

2. **Include error details** - When logging errors, include the error message and additional context:

   ```typescript
   try {
     // Some code that might throw
   } catch (error) {
     logger.error(`[Component] Error occurred: ${error.message}`);
   }
   ```

3. **Use appropriate log levels** - Use the correct log level based on the message importance.

4. **Keep Edge Runtime compatibility in mind** - Avoid direct imports of Node.js modules in components
   that might run in Edge Runtime.
