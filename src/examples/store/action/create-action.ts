import { IStore } from '../store/store.type';
import { IActionFunction } from './action.type';
import { IUpdateStateFunction } from './update-state-function.type';
import { getStoreState } from '../store/get-store-state';
import { setStoreState } from '../store/set-store-state';

export function createAction<GState, GArguments extends any[]>(
  store: IStore<GState>,
  updateState: IUpdateStateFunction<GState, GArguments>,
): IActionFunction<GArguments> {
  return (...args: GArguments): void => {
    setStoreState(store, updateState(getStoreState(store), ...args));
  };
}
