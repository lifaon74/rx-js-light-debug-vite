import { ISelector } from './selector.type';

export function createSelector<GState, GValue>(
  selector: ISelector<GState, GValue>,
): ISelector<GState, GValue> {
  return selector;
}
