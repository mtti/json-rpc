import express from 'express';

export type JsonRequestHandler = (
  req: express.Request,
  res: express.Response,
) => Promise<object>;

export function jsonRequestHandler(
  cb: JsonRequestHandler,
): express.RequestHandler {
  return async (req, res, next): Promise<void> => {
    try {
      const data = await cb(req, res);
      res.json({
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}
