import { APIError } from '../errors/APIError';
import { ErrorResponse } from './ErrorResponse';
import { ErrorObject } from './ErrorObject';

export function createErrorResponse(original: Error): ErrorResponse {
  let error: ErrorObject;

  if (original instanceof APIError) {
    error = original.toJsonApi();
  } else {
    error = {
      status: '500',
      title: 'Internal Server Error',
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    error.meta = error.meta || {};
    error.meta = {
      ...error.meta,
      stack: original.stack,
      originalMessage: original.message,
    };
  }

  return {
    errors: [error],
  };
}
