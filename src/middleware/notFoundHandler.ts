import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../errors/NotFoundError';

/** An Express middleware for producing JSON-formatted 404 errors. */
export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction,
): void {
  next(new NotFoundError());
}
