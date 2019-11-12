import { Ajv } from 'ajv';
import { InvalidParams } from '../errors/InvalidParams';
import { ServerError } from '../errors/ServerError';
import { RpcHandler, RpcHandlerCtor } from './RpcHandler';
import { RpcMethod } from './RpcMethod';

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
