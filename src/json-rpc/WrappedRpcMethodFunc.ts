import { RpcErrorResponse, RpcResponse } from './responses';
import { RpcRequest } from './RpcRequest';

export type WrappedRpcMethodFunc<Sess> = (
  session: Sess,
  request: RpcRequest,
) => Promise<RpcResponse|RpcErrorResponse|null>;
