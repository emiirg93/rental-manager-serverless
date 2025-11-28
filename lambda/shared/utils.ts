import { ApiResponse } from './types';

export const createResponse = <T>(
  statusCode: number,
  data: T,
  message?: string
): ApiResponse => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      ...(message && { message }),
      ...(typeof data === 'object' ? data : { data }),
    }),
  };
};

export const createErrorResponse = (
  statusCode: number,
  error: string,
  details?: string
): ApiResponse => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      error,
      ...(details && { details }),
    }),
  };
};