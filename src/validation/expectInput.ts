import { Ajv } from 'ajv';
import { Attributes } from '../document/Attributes';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError';
import { InputEnvelope } from '../json-api/InputEnvelope';
import { wrapInputSchema } from '../json-api/wrapInputSchema';

/**
 * Expect an input document wrapped in a JSON:API envelope.
 */
export type ExpectInputFunc<T extends Attributes> = (
  data: unknown,
) => T;

export const expectInput = <T extends Attributes>(
  ajv: Ajv,
  attributeSchema: object,
): ExpectInputFunc<T> => {
  const schema = wrapInputSchema(attributeSchema);
  return (
    input: unknown,
  ): T => {
    if (!ajv.validate(schema, input)) {
      throw new InvalidRequestBodyError(ajv.errors);
    }

    const envelope = input as InputEnvelope<T>;

    return envelope.data.attributes;
  };
};
