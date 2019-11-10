import { Ajv } from 'ajv';
import { InvalidParams } from '../errors/InvalidParams';
import { ServerError } from '../errors/ServerError';

/**
 * RPC method callback.
 */
export type RpcMethod<Sess, Params, Ret> = (
  session: Sess,
  params: Params,
) => Promise<Ret>;

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

/**
 * The outermost RPC method wrapper.
 */
export type MethodFunc = <Sess, Params, Result>(
  paramSchema: string|object|null,
  resultSchema: string|object|null,
  cb: RpcMethod<Sess, Params, Result>,
) => RpcHandlerCtor<Sess, Result>;

/**
 * Wrap an RPC method
 * @param cb
 */
export const method: MethodFunc = <Sess, Params, Result>(
  paramSchema: string|object|null,
  resultSchema: string|object|null,
  cb: RpcMethod<Sess, Params, Result>,
): RpcHandlerCtor<Sess, Result> => {
  return (
    ajv: Ajv,
  ): RpcHandler<Sess, Result> => {
    return async (session: Sess, params: unknown): Promise<Result> => {
      if (paramSchema && !ajv.validate(paramSchema, params)) {
        throw new InvalidParams();
      }

      const result = await cb(session, params as Params);

      if (resultSchema && !ajv.validate(resultSchema, result)) {
        throw new ServerError();
      }
      return result;
    };
  };
};
