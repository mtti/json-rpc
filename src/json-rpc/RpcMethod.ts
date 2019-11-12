import { RpcHandlerCtor } from './RpcHandler';

/**
 * RPC method callback.
 */
export type RpcMethod<Sess, Params, Ret> = (
  session: Sess,
  params: Params,
) => Promise<Ret>;

export type RpcMethods<Sess> = {
  [key: string]: RpcHandlerCtor<Sess, unknown>;
}
