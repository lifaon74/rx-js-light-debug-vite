import { IAnyTypeUnion } from '../any/any-type-union.type';
import { isUnionType } from './is-union-type';

export function reduceUnionTypes(
  types: Iterable<IAnyTypeUnion>,
  reducedTypes: IAnyTypeUnion[] = [],
): IAnyTypeUnion[] {
  const iterator: Iterator<IAnyTypeUnion> = types[Symbol.iterator]();
  let result: IteratorResult<IAnyTypeUnion>;
  while (!(result = iterator.next()).done) {
    if (isUnionType(result.value)) {
      reduceUnionTypes(types, reducedTypes);
    } else {
      reducedTypes.push(result.value);
    }
  }
  return reducedTypes;
}
