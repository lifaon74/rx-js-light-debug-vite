import { IType } from '../shared/type.type';
import { INullType } from './null-type.type';

export function isNullType(
  value: IType,
): value is INullType {
  return (value.name === 'null');
}
