import { JsonRpcError } from './JsonRpcError';

export class MethodNotFound extends JsonRpcError {
  constructor(data?: object) {
    super(-32601, 'Method Not Found', data);
  }
}
