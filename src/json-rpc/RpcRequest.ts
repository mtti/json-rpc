import { Ajv } from 'ajv';
import { InvalidRequest } from '../errors/InvalidRequest';
import requestSchema from './request.schema.json';

export type RpcRequest = {
  jsonrpc: '2.0';

  method: string;

  params?: object|unknown[];

  id?: number|string|null;
};

export type ExpectRequestFunc = (
  data: unknown,
) => RpcRequest;

export const expectRequest = (
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
