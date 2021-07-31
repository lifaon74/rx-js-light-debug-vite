import { IInterfaceType, IInterfaceTypeProperty } from '../interface-type.type';
import { IAnyTypeUnion } from '../../any/any-type-union.type';

export function interfaceType(
  properties: Iterable<IInterfaceTypeProperty>,
  extraPropertiesType?: IAnyTypeUnion,
): IInterfaceType {
  return {
    name: 'interface',
    properties,
    extraPropertiesType,
  };
}
