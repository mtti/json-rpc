[![Written in TypeScript](https://flat.badgen.net/badge/icon/TypeScript?icon=typescript&label)](http://www.typescriptlang.org/) <!-- [![npm](https://flat.badgen.net/npm/v/@mtti/json-rpc?icon=npm)](https://www.npmjs.com/package/@mtti/json-rpc) --> [![Travis](https://flat.badgen.net/travis/mtti/json-rpc?icon=travis)](https://travis-ci.org/mtti/json-rpc) [![License](https://flat.badgen.net/github/license/mtti/json-rpc)](https://github.com/mtti/json-rpc/blob/master/LICENSE)

A JSON-RPC 2.0 server library written in TypeScript.

* Implemements [JSON-RPC 2.0](https://www.jsonrpc.org/specification) with tests for all the examples in the specification.
* Separates transports from the RPC protocol.
* Includes a HTTP transport for Express.
* Allows validating method parameters and return values with JSON Schema to make sure you don't receive or send out garbage.

## Basic usage

The `service` function receives a dictionary of wrapped RPC method handlers and returns a top-level handler function of type `Session` which receives RPC requests.

```typescript
import { service, method } from '@mtti/json-rpc';

type MySession = {
    userId: number;
};

type MyParams = {
    a: number;
    b: number;
};

const myService = service<MySession>({
    sum: method(null, null, async (session, params: MyParams): Promise<number> => {
        // Check session to authorize this request, etc.

        const {a, b} = params;
        return a + b;
    });
});

const mySession: MySession = { userId: 1234 };

const myRequest = {
  jsonrpc: '2.0',
  method: 'sum',
  params: { a: 1, b: 2},
  id: 1,
};

const response = myService(mySession, myRequest);

// {"jsonrpc": "2.0", "result": 3, "id": 1}
console.log(JSON.stringify(response));
```

The generic type parameter on the `service` function is the type of the session object that is passed to the method handler function so that you can implement whatever kind of authorization you want.

## JSON Schema validation

The first two parameters of the `method` can receive a JSON Schema object or a JSON Schema ID for validation. The first parameter validates the method parameter before the handler function is called. The second parameter validates the response before it's returned to the caller.

Use of schema ID's requires that you must pass an Ajv instance as the second parameter to `service()`.

## HTTP transport

The `httpTransport` function construct an Express request handler from a `Service` and a session callback function which can parse a session object from an Express request object.

```typescript
import express from 'express';
import { httpTransport } from '@mtti/json-rpc';

// ...

const getSession = async (req: express.Request): Promise<MySession> => {
    // Read cookie, get session from database, etc.
    return { userId: 1234 };
};

const handler = httpTransport(myService, getSession);

const app = express();
app.use('/rpc', handler);
app.listen(8080);
```
