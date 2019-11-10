import { Ajv } from 'ajv';
import express from 'express';
import { fromEntries } from '@mtti/funcs';
import { InvalidRequest } from '../errors/InvalidRequest';
import { JsonRpcError } from '../errors/JsonRpcError';
import { MethodNotFound } from '../errors/MethodNotFound';
import { RpcHandlerCtor } from './method';
import { RpcError } from './RpcError';
import { RpcRequest } from './RpcRequest';
import requestSchema from './request.schema.json';

export type RpcMethods<Sess> = {
  [key: string]: RpcHandlerCtor<Sess, unknown>;
}

export type GetSessionFunc<Sess> = (req: express.Request) => Promise<Sess>;

export const service = <Sess>(
  ajv: Ajv,
  getSession: GetSessionFunc<Sess>,
  methods: RpcMethods<Sess>,
): express.RequestHandler => {
  const handlers = fromEntries(Object
    .entries(methods)
    .map(([key, ctor]) => [key, ctor(ajv)]));

  return async (
    req: express.Request,
    res: express.Response,
  ): Promise<void> => {
    let id: number|null = null;

    try {
      if (!ajv.validate(requestSchema, req.body)) {
        throw new InvalidRequest(ajv.errors);
      }
      const request = req.body as RpcRequest;
      id = request.id || null;

      const handler = handlers[request.method];
      if (!handler) {
        throw new MethodNotFound();
      }

      const session = await getSession(req);

      if (request.id) {
        const result = await handler(session, request.params);
        res.json({
          jsonrpc: '2.0',
          result,
          id: request.id,
        });
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setImmediate(() => handler(session, request.params));
      res.status(204).send();
    } catch (err) {
      let error: RpcError;
      if (err instanceof JsonRpcError) {
        error = err.toJsonRpc();
      } else {
        error = {
          code: -32000,
          message: err.message,
        };
      }

      res.json({
        jsonrpc: '2.0',
        error,
        id,
      });
    }
  };
};
