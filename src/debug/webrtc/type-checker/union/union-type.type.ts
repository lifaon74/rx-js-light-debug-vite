import { IType } from '../shared/type.type';
import { IAnyTypeUnion } from '../any/any-type-union.type';

export interface IUnionType extends IType {
  name: 'union';
  types: Iterable<IAnyTypeUnion>;
}
