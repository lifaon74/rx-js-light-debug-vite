import { ImmutableArray } from './immutable-array.type';

export function immutableArraySort<GValue>(
  source: ImmutableArray<GValue>,
  compareFn?: (a: GValue, b: GValue) => number
): ImmutableArray<GValue> {
  return source.slice().sort(compareFn);
}
