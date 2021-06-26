import { ImmutableArray } from './immutable-array.type';

export function immutableArraySplice<GValue>(
  source: ImmutableArray<GValue>,
  start: number,
  deleteCount: number,
  items: ImmutableArray<GValue>,
): GValue[] {
  return [
    ...source.slice(0, start),
    ...items,
    ...source.slice(start + deleteCount),
  ];
}
