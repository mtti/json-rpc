import { APIError } from './APIError';

export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}
