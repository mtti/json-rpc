import Ajv from 'ajv';
import { RpcError } from '../json-rpc/RpcError';
import { JsonRpcError } from './JsonRpcError';

export class InvalidRequest extends JsonRpcError {
  private _errors: Ajv.ErrorObject[];

  constructor(errors?: Ajv.ErrorObject[]|null, data?: object) {
    super(-32600, 'Invalid Request', data);
    this._errors = errors ? [...errors] : [];
  }

  toJsonRpc(): RpcError {
    const result: RpcError = {
      code: this.code,
      message: this.message,
    };

    if (this._errors && this._errors.length > 0) {
      result.data = this.data || {};
      (result.data as any).validationErrors = this._errors;
    }

    return result;
  }
}
