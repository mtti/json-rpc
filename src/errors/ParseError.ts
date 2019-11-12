import { JsonRpcError } from './JsonRpcError';

export class ParseError extends JsonRpcError {
  constructor(data?: object) {
    super(-32700, 'Parse error', data);
  }
}
