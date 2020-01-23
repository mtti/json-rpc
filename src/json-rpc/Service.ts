import { RpcSingleResponse, RpcBatchResponse } from './responses';

/**
 * A transport-agnostic JSON-RPC 2.0 service.
 */
export type Service<Sess> = (
  session: Sess,
  request: unknown,
) => Promise<null|RpcSingleResponse|RpcBatchResponse>;
