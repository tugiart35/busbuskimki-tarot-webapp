/**
 * Secure Logging Utility
 * Prevents sensitive data logging in production
 */

interface LogContext {
  userId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, unknown>;
}

class SecureLogger {
  /**
   * Development-only debug logging
   */
  debug(_message: string, _data?: unknown) {
    // Debug logging disabled for production
  }

  /**
   * Safe error logging (removes sensitive data)
   */
  error(message: string, error?: unknown, context?: LogContext) {
    const sanitizedError = this.sanitizeError(error);

    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [ERROR] ${message}`, {
        error: sanitizedError || 'No error details available',
        context: context || 'No context provided',
        timestamp: new Date().toISOString(),
      });
    } else {
      // Production: Log to external service (future)
      console.error(`ERROR: ${message}`, {
        message: sanitizedError?.message || 'Unknown error',
        code: sanitizedError?.code,
        timestamp: new Date().toISOString(),
        ...context,
      });
    }
  }

  /**
   * Warning logging
   */
  warn(message: string, data?: unknown, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ [WARN] ${message}`, data);
    } else {
      console.warn(`WARN: ${message}`, {
        timestamp: new Date().toISOString(),
        ...context,
      });
    }
  }

  /**
   * Info logging
   */
  info(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`ℹ️ [INFO] ${message}`, context || '');
    }
    // Production info logs are usually not needed
  }

  /**
   * Admin action logging (for audit trail)
   */
  adminAction(_action: string, _context: LogContext) {
    // Admin action logging disabled for production
  }

  /**
   * Supabase error logging with context
   */
  supabaseError(operation: string, error: unknown, context?: LogContext) {
    const sanitized = this.sanitizeSupabaseError(error);
    this.error(`Supabase ${operation} failed`, sanitized, {
      action: operation,
      ...context,
    });
  }

  /**
   * Remove sensitive data from errors
   */
  private sanitizeError(error: unknown) {
    if (!error) {
      return null;
    }

    const errorObj = error as {
      message?: string;
      code?: string;
      name?: string;
      details?: unknown;
    };
    const sanitized: {
      message?: string;
      code?: string;
      name?: string;
      details?: unknown;
    } = {};

    if (errorObj.message !== undefined) {
      sanitized.message = errorObj.message;
    }
    if (errorObj.code !== undefined) {
      sanitized.code = errorObj.code;
    }
    if (errorObj.name !== undefined) {
      sanitized.name = errorObj.name;
    }

    // Remove sensitive fields
    if (errorObj.details && !this.containsSensitiveData(errorObj.details)) {
      sanitized.details = errorObj.details;
    }

    return sanitized;
  }

  /**
   * Sanitize Supabase specific errors
   */
  private sanitizeSupabaseError(error: unknown) {
    if (!error) {
      return null;
    }

    const errorObj = error as {
      message?: string;
      code?: string;
      hint?: string;
      status?: number;
    };
    return {
      message: errorObj.message,
      code: errorObj.code,
      hint: errorObj.hint,
      status: errorObj.status,
    };
  }

  /**
   * Check if data contains sensitive information
   */
  private containsSensitiveData(data: unknown): boolean {
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      'credential',
      'session',
      'jwt',
      'private',
    ];

    const dataStr = JSON.stringify(data).toLowerCase();
    return sensitiveKeys.some(key => dataStr.includes(key));
  }
}

export const logger = new SecureLogger();

// Convenience functions
export const logError = (
  message: string,
  error?: unknown,
  context?: LogContext
) => logger.error(message, error, context);

export const logDebug = (message: string, data?: unknown) =>
  logger.debug(message, data);

export const logAdminAction = (action: string, context: LogContext) =>
  logger.adminAction(action, context);

export const logSupabaseError = (
  operation: string,
  error: unknown,
  context?: LogContext
) => logger.supabaseError(operation, error, context);

// Re-export for TypeScript module resolution
export type { LogContext };
