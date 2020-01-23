import { RpcMethodFunc } from './RpcMethodFunc';
import { WrappedRpcMethodFunc } from './WrappedRpcMethodFunc';
import { RpcRequest } from './RpcRequest';
import { RpcErrorResponse, RpcResponse } from './responses';

export const wrapRpcMethod = <Sess>(
  method: RpcMethodFunc<Sess, unknown, unknown>,
): WrappedRpcMethodFunc<Sess> => {
  return async (
    session: Sess,
    request: RpcRequest,
  ): Promise<RpcResponse|RpcErrorResponse|null> => {
    const result = await method(session, request.params);

    if (request.id) {
      return {
        jsonrpc: '2.0',
        result,
        id: request.id,
      };
    }

    return null;
  };
};
