import Ajv from 'ajv';
import { ParseError } from '../errors/ParseError';
import { InvalidRequest } from '../errors/InvalidRequest';
import { RpcMethodDictionary } from './RpcMethodDictionary';
import { RpcSingleResponse, RpcBatchResponse } from './responses';
import { createExpectRequest } from './expectRequest';
import { createErrorResponse } from './createErrorResponse';
import { Service } from './Service';
import { createHandleRequest } from './handleRequest';
import { WrappedRpcMethodDictionary } from './WrappedRpcMethodDictionary';
import { wrapRpcMethod } from './wrapRpcMethod';

export const createService = <Sess>(
  methods: RpcMethodDictionary<Sess>,
): Service<Sess> => {
  const wrappedMethods: WrappedRpcMethodDictionary<Sess> = Object.fromEntries(
    Object
      .entries(methods)
      .map(([name, method]) => [name, wrapRpcMethod(method)]),
  );

  const expectRequest = createExpectRequest(new Ajv());
  const handleRequest = createHandleRequest(expectRequest, wrappedMethods);

  return async (
    session: Sess,
    rawRequest: unknown,
  ): Promise<null|RpcSingleResponse|RpcBatchResponse> => {
    try {
      let parsedRequest: unknown;
      if (typeof rawRequest === 'string') {
        try {
          parsedRequest = JSON.parse(rawRequest);
        } catch (err) {
          throw new ParseError();
        }
      }

      // Handle batch request
      if (Array.isArray(parsedRequest)) {
        // Batches must contain at least one actual request
        if (parsedRequest.length === 0) {
          throw new InvalidRequest();
        }

        const promises = parsedRequest
          .map((request) => handleRequest(session, request));
        const results = (await Promise.all(promises))
          .filter((response) => response !== null);
        if (results.length === 0) {
          return null;
        }

        return results as RpcBatchResponse;
      }

      // Handle single request
      return handleRequest(session, parsedRequest);
    } catch (err) {
      return createErrorResponse(err);
    }
  };
};
