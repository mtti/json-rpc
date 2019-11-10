import { RpcError } from './RpcError';

export type RpcErrorResponse = {
  jsonrpc: '2.0';

  error: RpcError;

  id?: number;
};
