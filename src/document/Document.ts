import { Attributes } from './Attributes';

export type Document<T extends Attributes> = {
  id: string;
  attributes: T;
};
