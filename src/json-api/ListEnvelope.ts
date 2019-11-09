import { Attributes } from '../document/Attributes';
import { Document } from '../document/Document';
import { MetaObject } from './MetaObject';

/**
 * Document list response envelope
 */
export type ListEnvelope<T extends Attributes> = {
  data: Document<T>[];
  meta?: MetaObject;
};

/**
 * Wrap an array of documents in a list response envelope
 *
 * @param data
 */
export const listEnvelope = <T extends Attributes>(
  data: Document<T>[],
): ListEnvelope<T> => ({
    data,
  });
