import { Ajv } from 'ajv';
import express from 'express';
import { RequestSchemaViolation } from '../errors/RequestSchemaViolation';
import { promisifyMiddleware } from '../request-handler/promisifyMiddleware';

/**
 * Validates request body with JSON Schema.
 */
export type ValidateBodyFunc = (
  schema: string|object,
) => express.RequestHandler;

export function validateBody(ajv: Ajv): ValidateBodyFunc {
  return (schema: string|object): express.RequestHandler => promisifyMiddleware(
    async (req, _res) => {
      if (!ajv.validate(schema, req.body)) {
        throw new RequestSchemaViolation();
      }
    },
  );
}
