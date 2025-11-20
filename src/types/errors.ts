/**
 * Custom error types for DevFlow
 */

export class DevFlowError extends Error {
  constructor(
    message: string,
    public readonly hint?: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'DevFlowError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PermissionError extends DevFlowError {
  constructor(message: string, hint?: string) {
    super(message, hint, 'PERMISSION_ERROR');
    this.name = 'PermissionError';
  }
}

export class ValidationError extends DevFlowError {
  constructor(message: string, hint?: string) {
    super(message, hint, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class IntegrationError extends DevFlowError {
  constructor(message: string, hint?: string) {
    super(message, hint, 'INTEGRATION_ERROR');
    this.name = 'IntegrationError';
  }
}

export class DataError extends DevFlowError {
  constructor(message: string, hint?: string) {
    super(message, hint, 'DATA_ERROR');
    this.name = 'DataError';
  }
}
