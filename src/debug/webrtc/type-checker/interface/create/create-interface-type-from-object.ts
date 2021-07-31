import { IAnyTypeUnion } from '../../any/any-type-union.type';
import { IInterfaceType } from '../interface-type.type';
import { interfaceType } from './create-interface-type';

export function interfaceTypeObject(
  properties: Record<PropertyKey, IAnyTypeUnion>,
): IInterfaceType {
  return interfaceType(
    Object.entries(properties),
  );
}
