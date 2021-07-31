import { IInterfaceType, IInterfaceTypeProperty } from '../interface-type.type';
import { IAnyTypeUnion } from '../../any/any-type-union.type';
import { interfaceType } from './create-interface-type';
import { propertyKeyToPropertyName } from '../../shared/property-key-to-property-name';

export function intersectInterfaces(
  interfaces: Iterable<IInterfaceType>,
): IInterfaceType {
  const map: Map<PropertyKey, IAnyTypeUnion> = new Map<PropertyKey, IAnyTypeUnion>();
  let extraPropertiesType: IAnyTypeUnion | undefined;

  const interfacesIterator: Iterator<IInterfaceType> = interfaces[Symbol.iterator]();
  let interfacesResult: IteratorResult<IInterfaceType>;
  while (!(interfacesResult = interfacesIterator.next()).done) {
    const parent: IInterfaceType = interfacesResult.value;

    const interfacesPropertiesIterator: Iterator<IInterfaceTypeProperty> = parent.properties[Symbol.iterator]();
    let interfacesPropertiesResult: IteratorResult<IInterfaceTypeProperty>;
    while (!(interfacesPropertiesResult = interfacesPropertiesIterator.next()).done) {
      const [propertyKey, propertyType] = interfacesPropertiesResult.value;

      if (map.has(propertyKey)) {
        throw new Error(`Property ${ propertyKeyToPropertyName(propertyKey) } already defined`);
      } else {
        map.set(propertyKey, propertyType);
      }
    }

    if (parent.extraPropertiesType !== void 0) {
      if (extraPropertiesType === void 0) {
        extraPropertiesType = parent.extraPropertiesType;
      } else {
        throw new Error(`[index]: ${ extraPropertiesType.name } already defined`);
      }
    }
  }

  return interfaceType(map.entries(), extraPropertiesType);
}
