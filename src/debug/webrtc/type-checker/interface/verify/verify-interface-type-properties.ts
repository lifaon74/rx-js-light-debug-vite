import { IInterfaceTypeProperty } from '../interface-type.type';
import { propertyKeyToPropertyName } from '../../shared/property-key-to-property-name';
import { verifyType } from '../../any/verify-any-type';
import { IMemory } from '../../shared/create-memory';

export function verifyInterfaceTypeProperties(
  value: object,
  variableName: string,
  properties: Iterable<IInterfaceTypeProperty>,
  memory: IMemory,
): Set<PropertyKey> {
  const propertyKeys: Set<PropertyKey> = new Set<PropertyKey>();
  const iterator: Iterator<IInterfaceTypeProperty> = properties[Symbol.iterator]();
  let result: IteratorResult<IInterfaceTypeProperty>;
  while (!(result = iterator.next()).done) {
    const [propertyKey, propertyType] = result.value;
    verifyType(value[propertyKey], `${ variableName }[${ propertyKeyToPropertyName(propertyKey) }]`, propertyType, memory);
    propertyKeys.add(propertyKey);
  }
  return propertyKeys;
}
