import { IObservable } from '@lifaon/rx-js-light';

export interface IMatSelectInputOption<GValue> {
  readonly label$: IObservable<string>;
  readonly value: GValue;
  // readonly cssClasses: IObservable<Set<string>>;
}

// export type IMatSelectInputOptionsList<GValue> = readonly IMatSelectInputOption<GValue>[];
export type IMatSelectInputOptionsList<GValue> = Iterable<IMatSelectInputOption<GValue>>;
// export type IMatSelectInputSelectedOptions<GValue> = Set<IMatSelectInputOption<GValue>>;
export type IMatSelectInputReadonlySelectedOptions<GValue> = ReadonlySet<IMatSelectInputOption<GValue>>;


// export interface INormalizedMatSelectInputOption<GValue> {
//   label$: IObservable<string>;
//   value: GValue;
//   $selected$: IMulticastReplayLastSource<boolean>;
//   // selected: boolean;
//   // selected$: IObservable<boolean>;
//   // $selected: IObserver<boolean>;
//   disabled$: IObservable<boolean>;
// }
//
// // export type IReadonlyNormalizedMatSelectOption<GValue> = Readonly<INormalizedMatSelectOption<GValue>>;
//
// export interface IReadonlyNormalizedMatSelectInputOption<GValue> {
//   readonly label$: IObservable<string>;
//   readonly value: GValue;
//   readonly selected$: IObservable<boolean>;
//   readonly disabled$: IObservable<boolean>;
// }
// // export type IMatSelectOptions<GValue> = readonly IMatSelectOption<GValue>[];
// //
//
