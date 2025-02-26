/**
 * Logger utility for Shopcore
 * 
 * Provides logging functions that respect the debug configuration.
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /**
   * Whether debug mode is enabled
   */
  debug: boolean;
  
  /**
   * The current environment mode
   */
  mode: 'development' | 'production';
}

/**
 * Create a logger instance
 * 
 * @param config The logger configuration
 * @returns Logger functions
 */
export function createLogger(config: LoggerConfig) {
  const { debug, mode } = config;
  
  /**
   * Whether to show debug logs
   */
  const showDebugLogs = debug || mode === 'development';
  
  /**
   * Log a message with the specified level
   * 
   * @param level The log level
   * @param message The message to log
   * @param args Additional arguments to log
   */
  function log(level: LogLevel, message: string, ...args: any[]) {
    // Skip debug logs in production or when debug is disabled
    if (level === LogLevel.DEBUG && !showDebugLogs) {
      return;
    }
    
    // Skip info logs in production
    if (level === LogLevel.INFO && mode === 'production' && !debug) {
      return;
    }
    
    // Format the message with a prefix
    const formattedMessage = `[Shopcore] ${message}`;
    
    // Log with the appropriate console method
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, ...args);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, ...args);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, ...args);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, ...args);
        break;
    }
  }
  
  return {
    /**
     * Log a debug message
     * 
     * Only shown in development mode or when debug is enabled
     * 
     * @param message The message to log
     * @param args Additional arguments to log
     */
    debug: (message: string, ...args: any[]) => log(LogLevel.DEBUG, message, ...args),
    
    /**
     * Log an info message
     * 
     * @param message The message to log
     * @param args Additional arguments to log
     */
    info: (message: string, ...args: any[]) => log(LogLevel.INFO, message, ...args),
    
    /**
     * Log a warning message
     * 
     * @param message The message to log
     * @param args Additional arguments to log
     */
    warn: (message: string, ...args: any[]) => log(LogLevel.WARN, message, ...args),
    
    /**
     * Log an error message
     * 
     * @param message The message to log
     * @param args Additional arguments to log
     */
    error: (message: string, ...args: any[]) => log(LogLevel.ERROR, message, ...args),
  };
} 