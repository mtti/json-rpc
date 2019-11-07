import Ajv from 'ajv';
import { ErrorObject } from '../json-api/ErrorObject';
import { BadRequestError } from './BadRequestError';

export class InvalidRequestBodyError extends BadRequestError {
  private _errors: Ajv.ErrorObject[];

  constructor(
    errors?: Ajv.ErrorObject[]|null,
  ) {
    super();
    this._errors = errors ? [...errors] : [];
  }

  toJsonApi(): ErrorObject {
    const result: ErrorObject = {
      status: this.status.toString(),
      title: this.message,
      detail: 'Request body did not match schema',
      meta: {
        validationErrors: this._errors,
      },
    };

    return result;
  }
}
