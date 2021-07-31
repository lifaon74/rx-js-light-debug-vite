import { IAnyTypeUnion } from '../any/any-type-union.type';
import { IArrayType } from './array-type.type';

export function arrayType(
  type: IAnyTypeUnion,
): IArrayType {
  return {
    name: 'array',
    type,
  };
}
