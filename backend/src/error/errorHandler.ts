import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from './AppError';

const isDev = process.env.NODE_ENV === 'development';

interface ErrorResponse {
  success: false;
  statusCode: number;
  errorCode: ErrorCode;
  message: string;
  stack?: string;
}

// ─── Error normalisation helpers ──────────────────────────────
const handleJwtExpiredError = (): AppError =>
  new AppError('Your session has expired. Please log in again.', 401, ErrorCode.TOKEN_EXPIRED);

const handleJwtInvalidError = (): AppError =>
  new AppError('Invalid token. Please log in again.', 401, ErrorCode.TOKEN_INVALID);

// ─── Main error middleware ─────────────────────────────────────
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Always log the raw error in dev — helps diagnose 500s
  if (isDev) {
    console.error('❌ [ErrorHandler]', err);
  }

  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error && err.name === 'TokenExpiredError') {
    error = handleJwtExpiredError();
  } else if (
    err instanceof Error &&
    (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError')
  ) {
    error = handleJwtInvalidError();
  } else if (err instanceof Error) {
    error = new AppError(
      isDev ? err.message : 'Something went wrong. Please try again.',
      500
    );
  } else {
    error = new AppError('An unexpected error occurred.', 500);
  }

  const body: ErrorResponse = {
    success: false,
    statusCode: error.statusCode,
    errorCode: error.errorCode,
    message: error.message,
    ...(isDev && { stack: error.stack }),
  };

  res.status(error.statusCode).json(body);
};
