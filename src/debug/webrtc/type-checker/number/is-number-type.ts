import { IType } from '../shared/type.type';
import { INumberType } from './number-type.type';

export function isNumberType(
  value: IType,
): value is INumberType {
  return (value.name === 'number');
}
