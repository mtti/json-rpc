import { APIError } from './APIError';

export class BadRequestError extends APIError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}
