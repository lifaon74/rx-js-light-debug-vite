import { IAnyTypeUnion } from '../../any/any-type-union.type';
import { propertyKeyToPropertyName } from '../../shared/property-key-to-property-name';
import { verifyType } from '../../any/verify-any-type';
import { IMemory } from '../../shared/create-memory';

export function verifyInterfaceTypeExtraPropertiesType(
  value: object,
  variableName: string,
  propertyKeys: Set<PropertyKey>,
  extraPropertiesType: IAnyTypeUnion | undefined,
  memory: IMemory,
): void {
  if (extraPropertiesType !== void 0) {
    for (const propertyKey in value) {
      if (!propertyKeys.has(propertyKey)) {
        verifyType(value[propertyKey], `${ variableName }[${ propertyKeyToPropertyName(propertyKey) }]`, extraPropertiesType, memory);
      }
    }
  }
}
