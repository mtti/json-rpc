import { Ajv } from 'ajv';
import { Attributes } from '../document/Attributes';
import { InvalidRequestBodyError } from '../errors/InvalidRequestBodyError';
import { InputEnvelope } from '../json-api/InputEnvelope';
import { wrapInputSchema } from '../json-api/wrapInputSchema';

export type ExpectInputFunc = <T extends Attributes>(
  data: unknown,
) => T;

export const expectInput = (
  ajv: Ajv,
  attributeSchema: object,
): ExpectInputFunc => {
  const schema = wrapInputSchema(attributeSchema);
  return <T extends Attributes>(
    input: unknown,
  ): T => {
    if (!ajv.validate(schema, input)) {
      throw new InvalidRequestBodyError(ajv.errors);
    }

    const envelope = input as InputEnvelope<T>;

    return envelope.data.attributes;
  };
};
