import { Ajv } from 'ajv';
import { fromEntries } from '@mtti/funcs';
import { InvalidRequest } from '../errors/InvalidRequest';
import { ParseError } from '../errors/ParseError';
import { handleRequest as handleRequestCtor } from './handleRequest';
import { RpcHandlerMap } from './RpcHandler';
import { RpcMethods } from './RpcMethod';
import { RpcErrorResponse, rpcErrorResponse } from './RpcErrorResponse';
import { expectRequest as expectRequestCtor } from './RpcRequest';
import { RpcResponse } from './RpcResponse';

export type Service<Sess> = (
  session: Sess,
  request: unknown,
) => Promise<
  null|RpcResponse|RpcErrorResponse|Array<RpcResponse|RpcErrorResponse>
>;

export const service = <Sess>(
  ajv: Ajv,
  methods: RpcMethods<Sess>,
): Service<Sess> => {
  const expectRequest = expectRequestCtor(ajv);
  const handlers: RpcHandlerMap<Sess> = fromEntries(Object
    .entries(methods)
    .map(([key, ctor]) => [key, ctor(ajv)]));
  const handleRequest = handleRequestCtor(
    expectRequest,
    handlers,
  );

  return async (
    session: Sess,
    data: unknown,
  ): Promise<
    null|RpcResponse|RpcErrorResponse|Array<RpcResponse|RpcErrorResponse>
  > => {
    try {
      let request: unknown;

      if (typeof data === 'string') {
        try {
          request = JSON.parse(data);
        } catch (err) {
          throw new ParseError();
        }
      } else {
        request = data;
      }

      if (Array.isArray(request)) {
        if (request.length === 0) {
          throw new InvalidRequest();
        }

        const result = (await Promise.all(
          request
            .map((req) => handleRequest(session, req)),
        )).filter((response) => response !== null);

        if (result.length === 0) {
          return null;
        }

        return result as Array<RpcResponse|RpcErrorResponse>;
      }

      return handleRequest(session, request);
    } catch (err) {
      return rpcErrorResponse(err);
    }
  };
};
