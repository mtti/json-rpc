import { RpcMethodFunc } from './RpcMethodFunc';

export type RpcMethodDictionary<Sess> = {
  [key: string]: RpcMethodFunc<Sess, any, any>;
};
