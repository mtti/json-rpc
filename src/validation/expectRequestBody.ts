import { Ajv } from 'ajv';
import { BadRequestError } from '../errors/BadRequestError';

/**
 * Casts input to the type `T` if it passes JSON schema validation.
 */
export type ExpectRequestBodyFunc = <T>(
  schema: string|object,
  input: unknown,
) => T;

export const expectRequestBody = <T>(
  ajv: Ajv,
): ExpectRequestBodyFunc => <T>(
    schema: string|object,
    input: unknown,
  ): T => {
  if (!ajv.validate(schema, input)) {
    throw new BadRequestError();
  }
  return input as T;
};
