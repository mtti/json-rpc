import { APIError } from './APIError';

export class RequestSchemaViolation extends APIError {
  constructor(message = 'Request Schema Violation') {
    super(400, message);
  }
}
