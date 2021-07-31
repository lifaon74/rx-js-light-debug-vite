import { IUnionType } from './union-type.type';
import { unionType } from './create-union-type';
import { reduceUnionTypes } from './reduce-union-types';

export function reduceUnionType(
  type: IUnionType,
): IUnionType {
  return unionType(reduceUnionTypes(type.types));
}
