/**
 * Wrap attribute schema in a JSON:API single-object envelope.
 */
export const wrapInputSchema = (
  attributeSchema: object,
): object => ({
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        attributes: attributeSchema,
      },
      required: ['attributes'],
      additionalProperties: false,
    },
  },
  required: ['data'],
  additionalProperties: false,
});
