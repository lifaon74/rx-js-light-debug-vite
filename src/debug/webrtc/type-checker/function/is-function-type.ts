import { IType } from '../shared/type.type';
import { IFunctionType } from './function-type.type';

export function isFunctionType(
  value: IType,
): value is IFunctionType {
  return (value.name === 'function');
}
