// Canonical error codes — extend as needed
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
}

const STATUS_TO_CODE: Record<number, ErrorCode> = {
  422: ErrorCode.VALIDATION_ERROR,
  401: ErrorCode.UNAUTHORIZED,
  403: ErrorCode.FORBIDDEN,
  404: ErrorCode.NOT_FOUND,
  409: ErrorCode.CONFLICT,
  500: ErrorCode.INTERNAL_ERROR,
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, errorCode?: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode ?? STATUS_TO_CODE[statusCode] ?? ErrorCode.INTERNAL_ERROR;
    this.isOperational = true;

    // Maintains proper prototype chain in transpiled JS
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
