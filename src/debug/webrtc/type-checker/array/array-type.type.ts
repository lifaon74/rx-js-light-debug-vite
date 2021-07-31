import { IType } from '../shared/type.type';
import { IAnyTypeUnion } from '../any/any-type-union.type';

export interface IArrayType extends IType {
  name: 'array';
  type: IAnyTypeUnion;
}
