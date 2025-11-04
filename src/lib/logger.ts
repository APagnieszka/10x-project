/**
 * Structured Logging Utility
 *
 * Provides consistent logging across the application with structured data.
 * In production, consider integrating with services like Datadog, Sentry, or CloudWatch.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  /** User ID if authenticated */
  userId?: string;
  /** Household ID if available */
  householdId?: number;
  /** Request ID for tracing */
  requestId?: string;
  /** HTTP method */
  method?: string;
  /** Endpoint path */
  path?: string;
  /** Additional context data */
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Logger class for structured logging
 */
export class Logger {
  private context: LogContext;

  constructor(initialContext: LogContext = {}) {
    this.context = initialContext;
  }

  /**
   * Add or update context for this logger instance
   */
  addContext(context: LogContext): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }

  /**
   * Log a debug message
   */
  debug(message: string, additionalContext?: LogContext): void {
    this.log("debug", message, additionalContext);
  }

  /**
   * Log an info message
   */
  info(message: string, additionalContext?: LogContext): void {
    this.log("info", message, additionalContext);
  }

  /**
   * Log a warning message
   */
  warn(message: string, additionalContext?: LogContext): void {
    this.log("warn", message, additionalContext);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, additionalContext?: LogContext): void {
    const entry: LogEntry = {
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...additionalContext },
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    this.write(entry);
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, additionalContext?: LogContext): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.context, ...additionalContext },
    };

    this.write(entry);
  }

  /**
   * Write log entry to output
   * In production, this could write to a logging service
   */
  private write(entry: LogEntry): void {
    // For development, use console with appropriate method
    // In production, send to logging service (Datadog, Sentry, etc.)
    const output = JSON.stringify(entry);

    /* eslint-disable */
    switch (entry.level) {
      case "debug":
        console.debug(output);
        break;
      case "info":
        console.info(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "error":
        console.error(output);
        break;
    }
    /* eslint-enable */
  }
}

/**
 * Create a logger instance with initial context
 */
export function createLogger(context: LogContext = {}): Logger {
  return new Logger(context);
}

/**
 * Global logger instance for convenience
 * Use createLogger() for request-specific loggers
 */
export const logger = new Logger();
