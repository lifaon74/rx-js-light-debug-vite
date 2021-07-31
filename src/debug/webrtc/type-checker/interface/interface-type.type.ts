import { IAnyTypeUnion } from '../any/any-type-union.type';
import { IType } from '../shared/type.type';

export type IInterfaceTypeProperty = [PropertyKey, IAnyTypeUnion];

export interface IInterfaceType extends IType {
  name: 'interface';
  properties: Iterable<IInterfaceTypeProperty>;
  extraPropertiesType?: IAnyTypeUnion;
}
