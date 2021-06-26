import { ImmutableArray } from './immutable-array.type';

export function immutableArrayRemove<GValue>(
  source: ImmutableArray<GValue>,
  index: number,
  itemsToRemove: number = 1,
): ImmutableArray<GValue> {
  return [
    ...source.slice(0, index),
    ...source.slice(index + itemsToRemove),
  ];
}
