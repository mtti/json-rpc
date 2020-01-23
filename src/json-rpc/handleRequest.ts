import { MethodNotFound } from '../errors/MethodNotFound';
import { createErrorResponse } from './createErrorResponse';
import { ExpectRequestFunc } from './expectRequest';
import { RpcErrorResponse, RpcResponse } from './responses';
import { WrappedRpcMethodDictionary } from './WrappedRpcMethodDictionary';

export type HandleRequestFunc<Sess> = (
  session: Sess,
  request: unknown
) => Promise<RpcResponse|RpcErrorResponse|null>;

export const createHandleRequest = <Sess>(
  expectRequest: ExpectRequestFunc,
  handlers: WrappedRpcMethodDictionary<Sess>,
): HandleRequestFunc<Sess> => {
  return async (
    session: Sess,
    data: unknown,
  ): Promise<RpcResponse|RpcErrorResponse|null> => {
    let id: number|string|null|undefined = null;

    try {
      const request = expectRequest(data);
      id = request.id;

      const handler = handlers[request.method];
      if (!handler) {
        throw new MethodNotFound();
      }

      // Don't wait for the handler to process notifications
      if (request.id === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setImmediate(async () => {
          try {
            await handler(session, request);
          } catch {
            // Do nothing
          }
        });
        return null;
      }

      return await handler(session, request);
    } catch (err) {
      if (id === undefined) {
        return null;
      }
      return createErrorResponse(err, id);
    }
  };
};
