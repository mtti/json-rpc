import { Ajv } from 'ajv';
import { InvalidParams } from '../errors/InvalidParams';
import { ServerError } from '../errors/ServerError';
import { RpcHandler, RpcHandlerCtor } from './RpcHandler';
import { RpcMethod } from './RpcMethod';

export type MethodFunc = <Sess, Params, Result>(
  paramSchema: string|object|null,
  resultSchema: string|object|null,
  cb: RpcMethod<Sess, Params, Result>,
) => RpcHandlerCtor<Sess, Result>;

/**
 * Wrap an RPC method handler so it can be passed to a `service()` call.
 *
 * @param paramSchema JSON Schema for validating request parameters.
 * @param resultSchema JSON Schema for validating the response before it's
 *  returned to the caller.
 * @param cb Function implementing the RPC method.
 * @returns A function used to construct the final callback.
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
