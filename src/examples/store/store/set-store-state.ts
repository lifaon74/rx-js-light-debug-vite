import { IStore } from './store.type';

export function setStoreState<GState>(
  store: IStore<GState>,
  state: GState,
): void {
  store.emit(state);
}
