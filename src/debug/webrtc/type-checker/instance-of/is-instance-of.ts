import { IType } from '../shared/type.type';
import { IInstanceOfType } from './instance-of.type';

export function isInstanceOfType(
  value: IType,
): value is IInstanceOfType {
  return (value.name === 'instance-of');
}
