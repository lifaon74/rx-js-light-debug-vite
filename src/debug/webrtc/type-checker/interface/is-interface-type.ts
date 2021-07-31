import { IType } from '../shared/type.type';
import { IInterfaceType } from './interface-type.type';

export function isInterfaceType(
  value: IType,
): value is IInterfaceType {
  return (value.name === 'interface');
}
