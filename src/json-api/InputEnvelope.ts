import { Attributes } from '../document/Attributes';
import { Document } from '../document/Document';

export type InputEnvelope<T extends Attributes> = {
  data: Document<T>;
};
