export type RpcResponse = {
  jsonrpc: '2.0';

  id: number|string|null;

  result?: unknown;
};
