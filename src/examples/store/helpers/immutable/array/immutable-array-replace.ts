import { ImmutableArray } from './immutable-array.type';

export function immutableArrayReplace<GValue>(
  source: ImmutableArray<GValue>,
  index: number,
  item: GValue,
): ImmutableArray<GValue> {
  return [
    ...source.slice(0, index),
    item,
    ...source.slice(index + 1),
  ];
}
