import express from 'express';

/**
 * A promisified express middlware.
 */
export type PromisifiedMiddleware = (
  req: express.Request,
  res: express.Response,
) => Promise<void>;

export function promisifyMiddleware(
  cb: PromisifiedMiddleware,
): express.RequestHandler {
  return async (req, res, next): Promise<void> => {
    try {
      await cb(req, res);
      next();
    } catch (err) {
      next(err);
    }
  };
}
