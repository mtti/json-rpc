import { JsonRpcError } from '../errors/JsonRpcError';
import { RpcError } from './RpcError';
import { RpcErrorResponse } from './responses';

export const createErrorResponse = (
  err: unknown,
  id?: number|string|null,
): RpcErrorResponse => {
  let error: RpcError;

  if (err instanceof JsonRpcError) {
    error = err.toJsonRpc();
  } else if (err instanceof Error) {
    error = {
      code: -32000,
      message: err.message,
    };
  } else {
    error = {
      code: -32000,
      message: 'Unknown error',
    };
  }

  return {
    jsonrpc: '2.0',
    error,
    id: id !== undefined ? id : null,
  };
};
