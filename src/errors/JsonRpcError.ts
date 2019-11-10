import { RpcError } from '../json-rpc/RpcError';

/**
 * Base class for JSON-RPC errors.
 */
export class JsonRpcError extends Error {
  private _code: number;

  private _data?: object;

  get code(): number {
    return this._code;
  }

  get data(): object|undefined {
    return this._data;
  }

  constructor(code: number, message: string, data?: object) {
    super(message);
    this._code = code;
    this._data = data;
  }

  toJsonRpc(): RpcError {
    const result: RpcError = {
      code: this._code,
      message: this.message,
    };

    if (this._data) {
      (result as any).data = this._data;
    }

    return result;
  }
}
