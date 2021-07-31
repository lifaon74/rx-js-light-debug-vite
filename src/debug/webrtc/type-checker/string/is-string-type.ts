import { IType } from '../shared/type.type';
import { IStringType } from './string-type.type';

export function isStringType(
  value: IType,
): value is IStringType {
  return (value.name === 'string');
}
