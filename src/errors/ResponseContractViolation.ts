import Ajv from 'ajv';
import { ErrorObject } from '../json-api/ErrorObject';
import { APIError } from './APIError';

export class ResponseContractViolation extends APIError {
  private _errors: Ajv.ErrorObject[];

  constructor(
    errors?: Ajv.ErrorObject[]|null,
  ) {
    super(500, 'Response Contract Violation');
    this._errors = errors ? [...errors] : [];
  }

  toJsonApi(): ErrorObject {
    const result: ErrorObject = {
      status: this.status.toString(),
      title: this.message,
    };

    if (process.env.NODE_ENV !== 'production') {
      result.meta = {
        errors: this._errors,
      };
    }

    return result;
  }
}
