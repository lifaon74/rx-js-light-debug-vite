import { IEmitFunction, IMulticastReplayLastSource, ISubscribeFunction } from '@lifaon/rx-js-light';

export interface IMatSelectOption<GValue> {
  readonly label$: ISubscribeFunction<string>;
  readonly value: GValue;
  readonly selected$?: ISubscribeFunction<boolean>;
  readonly disabled$?: ISubscribeFunction<boolean>;
}

export interface INormalizedMatSelectOption<GValue> {
  label$: ISubscribeFunction<string>;
  value: GValue;
  $selected$: IMulticastReplayLastSource<boolean>;
  // selected: boolean;
  // selected$: ISubscribeFunction<boolean>;
  // $selected: IEmitFunction<boolean>;
  disabled$: ISubscribeFunction<boolean>;
}

// export type IReadonlyNormalizedMatSelectOption<GValue> = Readonly<INormalizedMatSelectOption<GValue>>;

export interface IReadonlyNormalizedMatSelectOption<GValue> {
  readonly label$: ISubscribeFunction<string>;
  readonly value: GValue;
  readonly selected$: ISubscribeFunction<boolean>;
  readonly disabled$: ISubscribeFunction<boolean>;
}
// export type IMatSelectOptions<GValue> = readonly IMatSelectOption<GValue>[];
//

