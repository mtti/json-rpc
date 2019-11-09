import { Ajv } from 'ajv';
import { InvalidParams } from '../errors/InvalidParams';
import { ServerError } from '../errors/ServerError';

/**
 * RPC method callback.
 */
export type RpcMethod<Arg, Ret> = (args: Arg) => Promise<Ret>;

/**
 * Wrapped RPC method callback.
 */
export type RpcHandler<Result> = (params: unknown) => Promise<Result>;

/**
 * Intermediate RPC method wrapper used to inject service-level dependencies.
 */
export type RpcHandlerCtor<Result> = (
  ajv: Ajv,
) => RpcHandler<Result>;

/**
 * The outermost RPC method wrapper.
 */
export type MethodFunc = <Params, Result>(
  paramSchema: string|object|null,
  resultSchema: string|object|null,
  cb: RpcMethod<Params, Result>,
) => RpcHandlerCtor<Result>;

/**
 * Wrap an RPC method
 * @param cb
 */
export const method: MethodFunc = <Params, Result>(
  paramSchema: string|object|null,
  resultSchema: string|object|null,
  cb: RpcMethod<Params, Result>,
): RpcHandlerCtor<Result> => {
  return (
    ajv: Ajv,
  ): RpcHandler<Result> => {
    return async (params: unknown): Promise<Result> => {
      if (paramSchema && !ajv.validate(paramSchema, params)) {
        throw new InvalidParams();
      }

      const result = await cb(params as Params);

      if (resultSchema && !ajv.validate(resultSchema, result)) {
        throw new ServerError();
      }
      return result;
    };
  };
};
