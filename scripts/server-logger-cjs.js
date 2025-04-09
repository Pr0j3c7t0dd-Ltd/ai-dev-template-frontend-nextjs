// CommonJS wrapper for server-logger.js
// This file allows CommonJS require() to access the ES module functions

// Use dynamic import() to load the ES module
async function loadServerLogger() {
  try {
    const { default: serverLogger } = await import('./server-logger.js');
    return serverLogger;
  } catch (error) {
    console.error('Failed to load server-logger.js:', error);
    throw error;
  }
}

// Export clearLogs as a CommonJS function
exports.clearLogs = async function () {
  try {
    const serverLogger = await loadServerLogger();
    serverLogger.clearLogs();
  } catch (error) {
    console.error('Error while clearing logs:', error);
    process.exit(1);
  }
};
