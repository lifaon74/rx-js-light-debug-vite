import { IAnyTypeUnion } from '../any/any-type-union.type';
import { IUnionType } from './union-type.type';
import { unionType } from './create-union-type';
import { reduceUnionType } from './reduce-union-type';

export function unionTypeReduced(
  types: Iterable<IAnyTypeUnion>,
): IUnionType {
  return reduceUnionType(unionType(types));
}
