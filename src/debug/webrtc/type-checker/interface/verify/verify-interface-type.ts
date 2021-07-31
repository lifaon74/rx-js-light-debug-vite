import { IInterfaceType } from '../interface-type.type';
import { throwExpectedTypeError } from '../../shared/errors/throw-expected-type-error';
import { verifyInterfaceTypeProperties } from './verify-interface-type-properties';
import { verifyInterfaceTypeExtraPropertiesType } from './verify-interface-type-extra-properties-type';
import { IMemory } from '../../shared/create-memory';

export function verifyInterfaceType(
  value: unknown,
  variableName: string,
  type: IInterfaceType,
  memory: IMemory,
): void {
  if ((typeof value !== 'object') || (value === null)) {
    throwExpectedTypeError(variableName, 'object');
  } else {
    const propertyKeys: Set<PropertyKey> = verifyInterfaceTypeProperties(value, variableName, type.properties, memory);
    verifyInterfaceTypeExtraPropertiesType(value, variableName, propertyKeys, type.extraPropertiesType, memory);
  }
}
