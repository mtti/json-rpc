import { MetaObject } from './MetaObject';

export type ErrorObject = {
  id?: string;
  links?: any;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: any;
  meta?: MetaObject;
};
