import { Response } from 'express';

interface SuccessResponse<T = unknown> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

interface ErrorBody {
  success: false;
  statusCode: number;
  message: string;
}

/** Consistent success response */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): void => {
  const body: SuccessResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
  };
  res.status(statusCode).json(body);
};

/** Kept for backwards compatibility — prefer sendSuccess */
export const sendResponse = sendSuccess;
