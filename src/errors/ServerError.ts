import { JsonRpcError } from './JsonRpcError';

export class ServerError extends JsonRpcError {
  constructor(message = 'Server Error', data?: object) {
    super(-32000, message, data);
  }
}
