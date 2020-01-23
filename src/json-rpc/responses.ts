import { RpcError } from './RpcError';

export type RpcResponse = {
  jsonrpc: '2.0';

  id: number|string|null;

  result?: unknown;
};

export type RpcErrorResponse = {
  jsonrpc: '2.0';

  error: RpcError;

  id: number|string|null;
};

export type RpcSingleResponse = RpcResponse | RpcErrorResponse;

export type RpcBatchResponse = Array<RpcSingleResponse>;
