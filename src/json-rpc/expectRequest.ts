import { Ajv } from 'ajv';
import { InvalidRequest } from '../errors/InvalidRequest';
import requestSchema from './request.schema.json';
import { RpcRequest } from './RpcRequest';

export type ExpectRequestFunc = (
  data: unknown,
) => RpcRequest;

export const createExpectRequest = (
  ajv: Ajv,
): ExpectRequestFunc => {
  const validate = ajv.compile(requestSchema);
  return (data: unknown): RpcRequest => {
    if (!validate(data)) {
      throw new InvalidRequest(ajv.errors);
    }

    return data as RpcRequest;
  };
};
