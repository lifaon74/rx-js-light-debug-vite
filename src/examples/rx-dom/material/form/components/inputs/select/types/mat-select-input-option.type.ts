import { IObservable } from '@lifaon/rx-js-light';
import { IReadonlyOptionsSet } from '../../../../../helpers/options/types/readonly-options-set.type';

export interface IMatSelectInputOption<GValue> {
  readonly label$: IObservable<string>;
  readonly value: GValue;
  // readonly cssClasses: IObservable<Set<string>>;
}

// export type IMatSelectInputOptionsList<GValue> = readonly IMatSelectInputOption<GValue>[];
export type IMatSelectInputOptionsList<GValue> = Iterable<IMatSelectInputOption<GValue>>;
// export type IMatSelectInputSelectedOptions<GValue> = Set<IMatSelectInputOption<GValue>>;
export type IMatSelectInputReadonlyOptions<GValue> = IReadonlyOptionsSet<IMatSelectInputOption<GValue>>;
export type IMatSelectInputReadonlySelectedOptions<GValue> = IReadonlyOptionsSet<IMatSelectInputOption<GValue>>;


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
