import { Ajv } from 'ajv';

/**
 * Wrapped RPC method callback.
 */
export type RpcHandler<Sess, Result> = (
  session: Sess,
  params: unknown,
) => Promise<Result>;

/**
 * Intermediate RPC method wrapper used to inject service-level dependencies.
 */
export type RpcHandlerCtor<Sess, Result> = (
  ajv: Ajv,
) => RpcHandler<Sess, Result>;

export type RpcHandlerMap<Sess> = {
  [key: string]: RpcHandler<Sess, unknown>;
};
