import { ErrorObject } from '../json-api/ErrorObject';

/**
 * Base class for RESTful errors
 */
export class APIError extends Error {
  private _status: number;

  private _detail?: string;

  public get status(): number {
    return this._status;
  }

  constructor(status: number, title: string, detail?: string) {
    super(title);
    this._status = status;
    this._detail = detail;
  }

  toJsonApi(): ErrorObject {
    return {
      status: this.status.toString(),
      title: this.message,
      detail: this._detail,
    };
  }
}
