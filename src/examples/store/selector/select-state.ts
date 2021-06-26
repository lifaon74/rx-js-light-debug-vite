import { IStore } from '../store/store.type';
import { ISelector } from './selector.type';
import { getStoreState } from '../store/get-store-state';

export function selectState<GState, GValue>(
  store: IStore<GState>,
  selector: ISelector<GState, GValue>,
): GValue {
  return selector(getStoreState<GState>(store));
}
