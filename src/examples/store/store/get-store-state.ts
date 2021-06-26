import { IStore } from './store.type';

export function getStoreState<GState>(
  store: IStore<GState>,
): GState {
  return store.getValue();
}
