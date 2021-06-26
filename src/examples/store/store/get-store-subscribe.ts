import { IStore } from './store.type';
import { ISubscribeFunction } from '@lifaon/rx-js-light';

export function getStoreSubscribe<GState>(
  store: IStore<GState>,
): ISubscribeFunction<GState> {
  return store.subscribe;
}
