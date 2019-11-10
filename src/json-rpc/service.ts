import { Ajv } from 'ajv';
import { fromEntries } from '@mtti/funcs';
import { JsonRpcError } from '../errors/JsonRpcError';
import { MethodNotFound } from '../errors/MethodNotFound';
import { RpcHandlerCtor } from './method';
import { RpcError } from './RpcError';
import { RpcErrorResponse } from './RpcErrorResponse';
import { expectRequest as expectRequestCtor } from './RpcRequest';
import { RpcResponse } from './RpcResponse';

export type RpcMethods<Sess> = {
  [key: string]: RpcHandlerCtor<Sess, unknown>;
}

export type Service<Sess> = (
  session: Sess,
  request: object,
) => Promise<null|RpcResponse|RpcErrorResponse>;

export const service = <Sess>(
  ajv: Ajv,
  methods: RpcMethods<Sess>,
): Service<Sess> => {
  const handlers = fromEntries(Object
    .entries(methods)
    .map(([key, ctor]) => [key, ctor(ajv)]));
  const expectRequest = expectRequestCtor(ajv);

  return async (
    session: Sess,
    data: object,
  ): Promise<null|RpcResponse|RpcErrorResponse> => {
    let id: number|null = null;

    try {
      const request = expectRequest(data);
      id = request.id || null;

      const handler = handlers[request.method];
      if (!handler) {
        throw new MethodNotFound();
      }

      // Don't wait for the handler to process notifications
      if (!request.id) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setImmediate(() => handler(session, request.params));
        return null;
      }

      const result = await handler(session, request.params);
      return {
        jsonrpc: '2.0',
        result,
        id: request.id,
      };
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

      const response: RpcErrorResponse = {
        jsonrpc: '2.0',
        error,
      };
      if (id) {
        response.id = id;
      }

      return response;
    }
  };
};
