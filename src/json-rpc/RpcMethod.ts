import { RpcHandlerCtor } from './RpcHandler';

/**
 * RPC method handler function.
 *
 * @param session Session object.
 * @param params Method parameters.
 * @returns A promise resolving to the method call's result.
 */
export type RpcMethod<Sess, Params, Ret> = (
  session: Sess,
  params: Params,
) => Promise<Ret>;

/**
 * Collection of RPC method handler functions keyed by string name.
 */
export type WrappedRpcMethods<Sess> = {
  [key: string]: RpcHandlerCtor<Sess, unknown>;
}
