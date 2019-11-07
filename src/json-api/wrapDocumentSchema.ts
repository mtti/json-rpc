/**
 * Wrap attribute schema in a JSON:API single-object envelope.
 */
export const wrapDocumentSchema = (
  attributeSchema: object,
): object => ({
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        attributes: attributeSchema,
      },
      required: ['id', 'attributes'],
      additionalProperties: false,
    },
  },
  required: ['data'],
  additionalProperties: false,
});
