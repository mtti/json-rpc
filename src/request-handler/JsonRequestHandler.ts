import express from 'express';

export type JsonRequestHandler = (
  req: express.Request,
  res: express.Response,
) => Promise<object>;

export function jsonResponse(
  cb: JsonRequestHandler,
): express.RequestHandler {
  return async (req, res, next): Promise<void> => {
    try {
      res.json(await cb(req, res));
    } catch (err) {
      next(err);
    }
  };
}
