export type RpcRequest = {
  jsonrpc: '2.0';

  method: string;

  params?: object|unknown[];

  id?: number|string|null;
};
