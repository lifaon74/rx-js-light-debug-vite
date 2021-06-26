import { createMulticastReplayLastSource } from '@lifaon/rx-js-light';
import { IStore } from './store.type';

export function createStore<GState>(
  initialState: GState,
): IStore<GState> {
  return createMulticastReplayLastSource<GState>({ initialValue: initialState });
}

