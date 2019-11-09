import { Attributes } from '../document/Attributes';
import { Document } from '../document/Document';
import { MetaObject } from './MetaObject';

/**
 * Document response envelope
 */
export type DocumentEnvelope<T extends Attributes> = {
  data: Document<T>;
  meta?: MetaObject;
};

/**
 * Wrap a document in a response envelope.
 *
 * @param data
 */
export const documentEnvelope = <T extends Attributes>(
  data: Document<T>,
): DocumentEnvelope<T> => ({
    data,
  });
