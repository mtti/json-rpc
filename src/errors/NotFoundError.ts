import { APIError } from './APIError';

export class NotFoundError extends APIError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}
