import express from 'express';
import { Attributes } from '../document/Attributes';
import { Document } from '../document/Document';

export type CollectionEmitter<T extends Attributes> = (
  req: express.Request,
  res: express.Response,
) => Promise<Document<T>[]>;

export function emitCollection<T extends Attributes>(
  cb: CollectionEmitter<T>,
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
