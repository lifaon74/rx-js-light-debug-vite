import { ImmutableArray } from './immutable-array.type';

export function immutableArrayPush<GValue>(
  source: ImmutableArray<GValue>,
  item: GValue,
): ImmutableArray<GValue> {
  return [
    ...source,
    item,
  ];
}
