import { Request, Response, NextFunction } from 'express';
import { APIError } from '../errors/APIError';
import { createErrorResponse } from '../json-api/createErrorResponse';

/**
 * An Express error handler that outputs JSON and can handle thrown ApiError
 * instances.
 */
export function jsonErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.accepts('json')) {
    next();
    return;
  }

  const response = createErrorResponse(err);

  if (err instanceof APIError) {
    res
      .status(err.status)
      .set('Content-Type', 'application/json')
      .json(response);
    return;
  }

  res
    .status(500)
    .set('Content-Type', 'application/json')
    .json(response);
}
