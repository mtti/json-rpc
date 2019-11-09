export type RpcRequest = {
  jsonrpc: string;

  method: string;

  params?: object;

  id?: number;
};
