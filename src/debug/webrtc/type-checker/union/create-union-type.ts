import { IAnyTypeUnion } from '../any/any-type-union.type';
import { IUnionType } from './union-type.type';

export function unionType(
  types: Iterable<IAnyTypeUnion>,
): IUnionType {
  return {
    name: 'union',
    types,
  };
}
