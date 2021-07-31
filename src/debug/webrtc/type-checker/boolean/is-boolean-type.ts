import { IType } from '../shared/type.type';
import { IBooleanType } from './boolean-type.type';

export function isBooleanType(
  value: IType,
): value is IBooleanType {
  return (value.name === 'boolean');
}
