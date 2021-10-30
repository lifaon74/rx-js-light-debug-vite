import { ISubscribeFunction } from '@lifaon/rx-js-light';

export interface IMatSelectInputOption<GValue> {
  readonly label$: ISubscribeFunction<string>;
  readonly value: GValue;
  // readonly cssClasses: ISubscribeFunction<Set<string>>;
}

// export type IMatSelectInputOptionsList<GValue> = readonly IMatSelectInputOption<GValue>[];
export type IMatSelectInputOptionsList<GValue> = Iterable<IMatSelectInputOption<GValue>>;
export type IMatSelectInputSelectedOptions<GValue> = Set<IMatSelectInputOption<GValue>>;
export type IMatSelectInputReadonlySelectedOptions<GValue> = ReadonlySet<IMatSelectInputOption<GValue>>;


// export interface INormalizedMatSelectInputOption<GValue> {
//   label$: ISubscribeFunction<string>;
//   value: GValue;
//   $selected$: IMulticastReplayLastSource<boolean>;
//   // selected: boolean;
//   // selected$: ISubscribeFunction<boolean>;
//   // $selected: IEmitFunction<boolean>;
//   disabled$: ISubscribeFunction<boolean>;
// }
//
// // export type IReadonlyNormalizedMatSelectOption<GValue> = Readonly<INormalizedMatSelectOption<GValue>>;
//
// export interface IReadonlyNormalizedMatSelectInputOption<GValue> {
//   readonly label$: ISubscribeFunction<string>;
//   readonly value: GValue;
//   readonly selected$: ISubscribeFunction<boolean>;
//   readonly disabled$: ISubscribeFunction<boolean>;
// }
// // export type IMatSelectOptions<GValue> = readonly IMatSelectOption<GValue>[];
// //
//
