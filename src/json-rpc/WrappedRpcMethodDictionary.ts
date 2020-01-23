import { WrappedRpcMethodFunc } from './WrappedRpcMethodFunc';

export type WrappedRpcMethodDictionary<Sess> = {
  [key: string]: WrappedRpcMethodFunc<Sess>;
};
