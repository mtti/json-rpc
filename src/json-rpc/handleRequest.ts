import { MethodNotFound } from '../errors/MethodNotFound';
import { RpcErrorResponse, rpcErrorResponse } from './RpcErrorResponse';
import { RpcHandlerMap } from './RpcHandler';
import { ExpectRequestFunc, RpcRequest } from './RpcRequest';
import { RpcResponse } from './RpcResponse';

export type HandleRequestFunc<Sess> = (
  session: Sess,
  request: unknown
) => Promise<RpcResponse|RpcErrorResponse|null>;

const handle = async <Sess>(
  handlers: RpcHandlerMap<Sess>,
  session: Sess,
  request: RpcRequest,
): Promise<RpcResponse|RpcErrorResponse|null> => {
  const handler = handlers[request.method];
  if (!handler) {
    throw new MethodNotFound();
  }

  const result = await handler(session, request.params);

  if (request.id) {
    return {
      jsonrpc: '2.0',
      result,
      id: request.id,
    };
  }
  return null;
};


export const handleRequest = <Sess>(
  expectRequest: ExpectRequestFunc,
  handlers: RpcHandlerMap<Sess>,
): HandleRequestFunc<Sess> => {
  return async (
    session: Sess,
    data: unknown,
  ): Promise<RpcResponse|RpcErrorResponse|null> => {
    let id: number|string|null|undefined = null;

    try {
      const request = expectRequest(data);
      id = request.id;

      // Don't wait for the handler to process notifications
      if (request.id === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setImmediate(async () => {
          try {
            await handle(handlers, session, request);
          } catch {
            // Do nothing
          }
        });
        return null;
      }

      return await handle(handlers, session, request);
    } catch (err) {
      if (id === undefined) {
        return null;
      }
      return rpcErrorResponse(err, id);
    }
  };
};
