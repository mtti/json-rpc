import { Ajv } from 'ajv';
import express from 'express';
import { ResponseContractViolation } from '../errors/ResponseContractViolation';

/**
 * Validates JSON response with a JSON Schema.
 */
export type ValidateResponseFunc = (
  schema: string|object,
) => express.RequestHandler;

export function validateResponse(ajv: Ajv): ValidateResponseFunc {
  return (
    schema: string|object,
  ): express.RequestHandler => (req, res, next): void => {
    const oldJson = res.jsonp;

    res.json = (body?: any): express.Response => {
      if (!ajv.validate(schema, body)) {
        throw new ResponseContractViolation();
      }
      return oldJson(body);
    };

    next();
  };
}
