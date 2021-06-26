import { IStore } from '../store/store.type';
import { ISelector } from './selector.type';
import { getStoreState } from '../store/get-store-state';
import { selectState } from './select-state';

export function getState<GState>(
  store: IStore<GState>,
): GState;
export function getState<GState, GValue>(
  store: IStore<GState>,
  selector: ISelector<GState, GValue>,
): GValue;
export function getState<GState, GValue>(
  store: IStore<GState>,
  selector?: ISelector<GState, GValue>,
): GState | GValue {
  return (selector === void 0)
    ? getStoreState(store)
    : selectState(store, selector);
}

