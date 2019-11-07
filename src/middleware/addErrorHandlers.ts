import { Application, Router } from 'express';
import { jsonErrorHandler } from './jsonErrorHandler';
import { notFoundHandler } from './notFoundHandler';

/**
 * Add default error handlers to an Express application or router, resulting in
 * errors being output to the user in JSON:API format.
 *
 * @param target An Express application or router.
 */
export function addErrorHandlers(target: Application|Router): void {
  target.use(notFoundHandler);
  target.use(jsonErrorHandler);
}
