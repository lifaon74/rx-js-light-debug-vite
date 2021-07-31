import { IAnyTypeUnion } from '../any/any-type-union.type';
import { IUnionType } from '../union/union-type.type';
import { unionType } from '../union/create-union-type';
import { isUnionType } from '../union/is-union-type';
import { undefinedType } from '../undefined/create-undefined-type';

export function optionalType(
  type: IAnyTypeUnion,
): IUnionType {
  return unionType(isUnionType(type)
    ? [
      ...type.types,
      undefinedType(),
    ]
    : [
      type,
      undefinedType(),
    ]
  );
}
