import { ErrorObject } from './ErrorObject';
import { MetaObject } from './MetaObject';

export type ErrorResponse = {
  errors: ErrorObject[];
  meta?: MetaObject;
}
