[![Written in TypeScript](https://flat.badgen.net/badge/icon/typescript?icon=typescript&label)](http://www.typescriptlang.org/) <!-- [![npm](https://flat.badgen.net/npm/v/@mtti/typescript-base?icon=npm)](https://www.npmjs.com/package/@mtti/typescript-base) --> [![Travis](https://flat.badgen.net/travis/mtti/json-rpc-ts?icon=travis)](https://travis-ci.org/mtti/json-rpc-ts) [![License](https://flat.badgen.net/github/license/mtti/json-rpc-ts)](https://github.com/mtti/json-rpc-ts/blob/master/LICENSE)

An opinionated JSON-RPC 2.0 server library in TypeScript.

* Implemements [JSON-RPC 2.0](https://www.jsonrpc.org/specification) with tests for all the examples in the specification.
* Separates transports from the RPC protocol.
* Includes a HTTP transport for Express.
* Allows validating method parameters and return values with JSON Schema to make sure you don't receive or send out garbage.
