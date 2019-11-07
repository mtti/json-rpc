import express from 'express';
import { Attributes } from '../document/Attributes';
import { Document } from '../document/Document';

export type EmitDocumentCb<T extends Attributes> = (
  req: express.Request,
  res: express.Response,
) => Promise<Document<T>>;

export type EmitDocumentFunc<T extends Attributes> = (
  cb: EmitDocumentCb<T>,
) => express.RequestHandler;

export const emitDocument = <T extends Attributes>(
  cb: EmitDocumentCb<T>,
): express.RequestHandler => async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    try {
      const output = {
        data: await cb(req, res),
      };

      res.json(output);
    } catch (err) {
      next(err);
    }
  };
