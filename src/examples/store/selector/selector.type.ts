import { IMapFunction } from '@lifaon/rx-js-light';

export type ISelector<GState, GValue> = IMapFunction<GState, GValue>;
