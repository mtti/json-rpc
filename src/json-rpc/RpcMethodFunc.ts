/**
 * RPC method handler function.
 *
 * @param session Session object.
 * @param params Method parameters.
 * @returns A promise resolving to the method call's result.
 */
export type RpcMethodFunc<Sess, Params, Ret> = (
  session: Sess,
  params: Params,
) => Promise<Ret>;
