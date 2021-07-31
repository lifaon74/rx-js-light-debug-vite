import { IType } from '../shared/type.type';
import { IArrayType } from './array-type.type';

export function isArrayType(
  value: IType,
): value is IArrayType {
  return (value.name === 'array');
}
