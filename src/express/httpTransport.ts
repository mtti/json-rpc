import { parse as parseContentType } from 'content-type';
import express from 'express';
import getRawBody from 'raw-body';
import { Service } from '../json-rpc/Service';
import { GetSessionFunc } from './GetSessionFunc';

/**
 * Create a HTTP transport for a JSON-RPC service.
 *
 * @param service The JSON-RPC service to wrap.
 * @param getSession A function which parses a user-defined session object from
 *  an Express request object.
 * @returns An Express request handler
 */
export const httpTransport = <Sess>(
  service: Service<Sess>,
  getSession: GetSessionFunc<Sess>,
): express.RequestHandler => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    try {
      // Content negotiation
      if (!req.is('application/json')) {
        res.status(415).send('Unsupported Media Type');
        return;
      }
      if (!req.accepts('application/json')) {
        res.status(406).send('Not Acceptable');
        return;
      }

      // Assume request body is UTF-8 if the caller doesn't know what
      // they're doing
      const charset = parseContentType(req).parameters.charset || 'utf-8';
      const body = await getRawBody(req, {
        length: req.headers['content-length'],
        limit: '1kb',
        encoding: charset,
      });

      const session = await getSession(req);
      const result = await service(session, body);

      if (!result) {
        res.status(204).send();
        return;
      }

      res.json(result);
    } catch (err) {
      if (err.status) {
        res.status(err.status).send();
        return;
      }
      next(err);
    }
  };
};
