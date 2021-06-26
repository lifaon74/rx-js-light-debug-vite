import { IMulticastReplayLastSource } from '@lifaon/rx-js-light';

export type IStore<GState> = IMulticastReplayLastSource<GState>;

