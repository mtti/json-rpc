/**
 * Wrap attribute schema in a JSON:API multi-object envelope.
 */
export const wrapCollectionSchema = (
  attributeSchema: object,
): object => ({
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          attributes: attributeSchema,
        },
        required: ['id', 'attributes'],
      },
    },
    required: ['data'],
    additionalProperties: false,
  },
});
