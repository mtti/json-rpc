import express from 'express';
import { Service } from '../json-rpc/Service';
import { GetSessionFunc } from './GetSessionFunc';

export const httpTransport = <Sess>(
  service: Service<Sess>,
  getSession: GetSessionFunc<Sess>,
): express.RequestHandler => {
  return async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    const session = await getSession(req);
    const result = await service(session, req.body);

    if (!result) {
      res.status(204).send();
      return;
    }

    res.json(result);
  };
};
