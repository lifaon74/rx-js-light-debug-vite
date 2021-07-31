import { IUndefinedType } from './undefined-type.type';
import { IType } from '../shared/type.type';

export function isUndefinedType(
  value: IType,
): value is IUndefinedType {
  return (value.name === 'undefined');
}

