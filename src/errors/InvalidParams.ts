import { JsonRpcError } from './JsonRpcError';

export class InvalidParams extends JsonRpcError {
  constructor(data?: object) {
    super(-32602, 'Invalid Params', data);
  }
}
