import { IType } from '../shared/type.type';
import { IUnionType } from './union-type.type';

export function isUnionType(
  value: IType,
): value is IUnionType {
  return (value.name === 'union');
}
