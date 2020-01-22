/* eslint-disable @typescript-eslint/camelcase */

import { method } from './method';
import { Service, service } from './Service';

type ServiceTest = {
  name: string;
  input: string;
  output: unknown;
};

// Test cases from https://www.jsonrpc.org/specification#examples
const cases: ServiceTest[] = [
  {
    name: 'rpc call with positional parameters 1',
    input: '{"jsonrpc": "2.0", "method": "subtract", "params": [42, 23], "id": 1}',
    output: JSON.parse('{"jsonrpc": "2.0", "result": 19, "id": 1}'),
  },
  {
    name: 'rpc call with positional parameters 2',
    input: '{"jsonrpc": "2.0", "method": "subtract", "params": [23, 42], "id": 2}',
    output: JSON.parse('{"jsonrpc": "2.0", "result": -19, "id": 2}'),
  },

  {
    name: 'rpc call with named parameters 1',
    input: '{"jsonrpc": "2.0", "method": "subtractNamed", "params": {"subtrahend": 23, "minuend": 42}, "id": 3}',
    output: JSON.parse('{"jsonrpc": "2.0", "result": 19, "id": 3}'),
  },
  {
    name: 'rpc call with named parameters 2',
    input: '{"jsonrpc": "2.0", "method": "subtractNamed", "params": {"minuend": 42, "subtrahend": 23}, "id": 4}',
    output: JSON.parse('{"jsonrpc": "2.0", "result": 19, "id": 4}'),
  },
  {
    name: 'notification 1',
    input: '{"jsonrpc": "2.0", "method": "update", "params": [1,2,3,4,5]}',
    output: null,
  },
  {
    name: 'notification 2',
    input: '{"jsonrpc": "2.0", "method": "foobar"}',
    output: null,
  },
  {
    name: 'rpc call of non-existent method',
    input: '{"jsonrpc": "2.0", "method": "foobar", "id": "1"}',
    output: JSON.parse('{"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": "1"}'),
  },
  {
    name: 'rpc call with invalid JSON',
    input: '{"jsonrpc": "2.0", "method": "foobar, "params": "bar", "baz]',
    output: JSON.parse('{"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": null}'),
  },
  {
    name: 'rpc call with invalid Request object',
    input: '{"jsonrpc": "2.0", "method": 1, "params": "bar"}',
    output: JSON.parse('{"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}'),
  },
  {
    name: 'rpc call Batch, invalid JSON',
    input: `[
      {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},
      {"jsonrpc": "2.0", "method"
    ]`,
    output: JSON.parse('{"jsonrpc": "2.0", "error": {"code": -32700, "message": "Parse error"}, "id": null}'),
  },
  {
    name: 'rpc call with an empty Array',
    input: '[]',
    output: JSON.parse('{"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}'),
  },
  {
    name: 'rpc call with an invalid Batch (but not empty)',
    input: '[1]',
    output: JSON.parse(`[
      {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
    ]`),
  },
  {
    name: 'rpc call with invalid Batch',
    input: '[1,2,3]',
    output: JSON.parse(`[
      {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
      {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
      {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null}
    ]`),
  },
  {
    name: 'rpc call Batch',
    input: `[
      {"jsonrpc": "2.0", "method": "sum", "params": [1,2,4], "id": "1"},
      {"jsonrpc": "2.0", "method": "notify_hello", "params": [7]},
      {"jsonrpc": "2.0", "method": "subtract", "params": [42,23], "id": "2"},
      {"foo": "boo"},
      {"jsonrpc": "2.0", "method": "foo.get", "params": {"name": "myself"}, "id": "5"},
      {"jsonrpc": "2.0", "method": "get_data", "id": "9"}
    ]`,
    output: JSON.parse(`[
      {"jsonrpc": "2.0", "result": 7, "id": "1"},
      {"jsonrpc": "2.0", "result": 19, "id": "2"},
      {"jsonrpc": "2.0", "error": {"code": -32600, "message": "Invalid Request"}, "id": null},
      {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": "5"},
      {"jsonrpc": "2.0", "result": ["hello", 5], "id": "9"}
  ]`),
  },
  {
    name: 'rpc call Batch (all notifications)',
    input: `[
      {"jsonrpc": "2.0", "method": "notify_sum", "params": [1,2,4]},
      {"jsonrpc": "2.0", "method": "notify_hello", "params": [7]}
    ]`,
    output: null,
  },
];

type NamedParams = {
  minuend: number;
  subtrahend: number;
};

describe(service.name, () => {
  let svc: Service<null>;

  beforeEach(() => {
    svc = service<null>(
      {
        subtract: method<null, [number, number], number>(
          null,
          null,
          async (session, [a, b]) => {
            return a - b;
          },
        ),
        subtractNamed: method<null, NamedParams, number>(
          null,
          null,
          async (_session, { minuend, subtrahend }) => {
            return minuend - subtrahend;
          },
        ),
        update: method<null, number[], void>(
          null,
          null,
          async () => {},
        ),
        sum: method<null, number[], number>(
          null,
          null,
          async (_session, numbers) => numbers.reduce((a, b) => a + b, 0),
        ),
        get_data: method<null, unknown, [string, number]>(
          null,
          null,
          async (_session, params) => ['hello', 5],
        ),
      },
    );
  });

  cases.forEach((c, i) => {
    it(c.name, async () => {
      const result = await svc(null, c.input) as any;

      // Disregard implementation-specific error details
      if (result && result.error && result.error.data) {
        delete result.error.data;
      }

      expect(result).toEqual(c.output);
    });
  });
});
