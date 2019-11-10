import { JsonRpcError } from './JsonRpcError';

/**
 * Implemenration-specific JSON-RPC error.
 */
export class ServerError extends JsonRpcError {
  constructor(code = -32000, message = 'Server Error', data?: object) {
    if (code > -32000 || code < -32099) {
      throw new Error('Error code must be in range -32099 to -32000');
    }
    super(-32000, message, data);
  }
}
