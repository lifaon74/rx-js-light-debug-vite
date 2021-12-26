import { function$$, IObservable, IObserver, map$$, shareRL$$ } from '@lifaon/rx-js-light';
import { defineSimpleObservableProperty, IHavingObservableProperty } from '@lifaon/rx-dom';
import { isSet } from '../../../../misc/is/is-set';
import { isOptionSelected } from './is-option-selected';
import { IReadonlyOptionsSet } from './types/readonly-options-set.type';
import { IOptionsList } from './types/options-list.type';
import { toggleOptionSelectWithResolvers } from './toggle-option-select-with-resolvers';


/*--------------------------------*/

/**
 * The raw list of options (contains potentially some dupes)
 */
export type IOptionsManagerRawOptionsProperty<GOption> = IHavingObservableProperty<'rawOptions', IOptionsList<GOption>>;

export function addOptionsManagerRawOptionsProperty<GOption>(
  target: any,
): IObservable<IOptionsList<GOption>> {
  return defineSimpleObservableProperty<IOptionsList<GOption>>(target, 'rawOptions', []);
}

export function addOptionsManagerRawOptionsFunctionality<GOption>(
  target: any,
): IObservable<IOptionsList<GOption>> {
  return addOptionsManagerRawOptionsProperty<GOption>(target);
}


/*---*/

/**
 * The raw list of selected options
 */
export type IOptionsManagerRawSelectedOptionsProperty<GOption> = IHavingObservableProperty<'rawSelectedOptions', IOptionsList<GOption>>;

export function addOptionsManagerRawSelectedOptionsProperty<GOption>(
  target: any,
): IObservable<IOptionsList<GOption>> {
  return defineSimpleObservableProperty<IOptionsList<GOption>>(target, 'rawSelectedOptions', []);
}

export function addOptionsManagerRawSelectedOptionsFunctionality<GOption>(
  target: any,
): IObservable<IOptionsList<GOption>> {
  return addOptionsManagerRawSelectedOptionsProperty<GOption>(target);
}

/*---*/

/**
 * If we allow or not many options to be selected
 */

export type IOptionsManagerMultipleProperty = IHavingObservableProperty<'multiple', boolean>;

export function addOptionsManagerMultipleProperty(
  target: any,
): IObservable<boolean> {
  return defineSimpleObservableProperty<boolean>(target, 'multiple', false);
}

export function addOptionsManagerMultipleFunctionality(
  target: any,
): IObservable<boolean> {
  return addOptionsManagerMultipleProperty(target);
}

/*---*/

/**
 * The list of options represented as a Set (useful to remove dupes)
 */
export interface IOptionsManagerOptionsProperty<GOption> {
  readonly options$: IObservable<IReadonlyOptionsSet<GOption>>;
}

export interface IAddOptionsManagerOptionsPropertyOptions<GOption> {
  rawOptions$: IObservable<IOptionsList<GOption>>;
}


export function addOptionsManagerOptionsProperty<GOption>(
  target: any,
  {
    rawOptions$,
  }:  IAddOptionsManagerOptionsPropertyOptions<GOption>,
): IObservable<IReadonlyOptionsSet<GOption>> {
  const options$ = shareRL$$(map$$(rawOptions$, (options: IOptionsList<GOption>): IReadonlyOptionsSet<GOption> => {
    return isSet<GOption>(options)
      ? options
      : new Set<GOption>(options);
  }));
  target.options$ = options$;
  return options$;
}


export function addOptionsManagerOptionsFunctionality<GOption>(
  target: any,
  options: IAddOptionsManagerOptionsPropertyOptions<GOption>,
): IObservable<IReadonlyOptionsSet<GOption>> {
  return addOptionsManagerOptionsProperty<GOption>(target, options);
}


/*---*/

/**
 * The real list of selected options
 */
export interface IOptionsManagerSelectedOptionsProperty<GOption> {
  readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
}

export interface IAddOptionsManagerSelectedOptionsFunctionalityOptions<GOption> {
  rawSelectedOptions$: IObservable<IOptionsList<GOption>>;
  options$: IObservable<IReadonlyOptionsSet<GOption>>;
  multiple$: IObservable<boolean>;
}

export function addOptionsManagerSelectedOptionsFunctionality<GOption>(
  target: any,
  {
    rawSelectedOptions$,
    options$,
    multiple$,
  }: IAddOptionsManagerSelectedOptionsFunctionalityOptions<GOption>,
): IObservable<IReadonlyOptionsSet<GOption>> {
  const selectedOptions$ = shareRL$$(function$$(
    [rawSelectedOptions$, options$, multiple$],
    (
      rawSelectedOptions: IOptionsList<GOption>,
      options: IReadonlyOptionsSet<GOption>,
      multiple: boolean,
    ): IReadonlyOptionsSet<GOption> => {
      const selectedOptions = new Set<GOption>();
      const iterator: Iterator<GOption> = rawSelectedOptions[Symbol.iterator]();
      let result: IteratorResult<GOption>;
      while (!(result = iterator.next()).done) {
        const option: GOption = result.value;
        if (options.has(option)) {
          selectedOptions.add(option);
          if (!multiple) {
            break;
          }
        }
      }
      return selectedOptions;
    },
  ));

  target.selectedOptions$ = selectedOptions$;

  return selectedOptions$;
}


/*---*/

export interface IOptionsManagerProperties<GOption> extends //
  IOptionsManagerRawOptionsProperty<GOption>,
  IOptionsManagerRawSelectedOptionsProperty<GOption>,
  IOptionsManagerMultipleProperty,
  IOptionsManagerOptionsProperty<GOption>,
  IOptionsManagerSelectedOptionsProperty<GOption>
  //
{
}

/*--------------------------------*/

export class OptionsManager<GOption> implements IOptionsManagerProperties<GOption> {
  rawOptions$!: IObservable<IOptionsList<GOption>>;
  readonly $rawOptions!: IObserver<IOptionsList<GOption>>;
  rawOptions!: IOptionsList<GOption>;

  rawSelectedOptions$!: IObservable<IOptionsList<GOption>>;
  readonly $rawSelectedOptions!: IObserver<IOptionsList<GOption>>;
  rawSelectedOptions!: IOptionsList<GOption>;

  multiple$!: IObservable<boolean>;
  readonly $multiple!: IObserver<boolean>;
  multiple!: boolean;

  readonly options$!: IObservable<IReadonlyOptionsSet<GOption>>;
  readonly selectedOptions$!: IObservable<IReadonlyOptionsSet<GOption>>;

  constructor(
    rawOptions?: IOptionsList<GOption> | IObservable<IOptionsList<GOption>>,
  ) {
    const rawOptions$ = addOptionsManagerRawOptionsFunctionality<GOption>(this);
    const rawSelectedOptions$ = addOptionsManagerRawSelectedOptionsFunctionality<GOption>(this);
    const multiple$ = addOptionsManagerMultipleFunctionality(this);
    const options$ = addOptionsManagerOptionsFunctionality<GOption>(this, { rawOptions$ });
    const selectedOptions$ = addOptionsManagerSelectedOptionsFunctionality<GOption>(this, { rawSelectedOptions$, options$, multiple$ });

    if (typeof rawOptions === 'function') {
      this.rawOptions$ = rawOptions as IObservable<IOptionsList<GOption>>;
    } else {
      this.rawOptions = rawOptions as IOptionsList<GOption>;
    }
  }

  isOptionSelected(
    option: GOption,
  ): IObservable<boolean> {
    return isOptionSelected<GOption>({
      selectedOptions$: this.selectedOptions$,
      option,
    });
  }

  toggleOptionSelect(
    option: GOption,
    select?: boolean,
  ): void {
    toggleOptionSelectWithResolvers({
      selectedOptions$: this.selectedOptions$,
      $rawSelectedOptions: this.$rawSelectedOptions,
      multiple$: this.multiple$,
      option,
      select,
    });
  }
}


/*--------------------------------*/


// export interface IOptionsManager<GOption> {
//   // the raw list of options
//   rawOptions$: IObservable<IOptionsList<GOption>>;
//   readonly $rawOptions: IObserver<IOptionsList<GOption>>;
//   rawOptions: IOptionsList<GOption>;
//
//   // the raw list of selected options
//   rawSelectedOptions$: IObservable<IOptionsList<GOption>>;
//   readonly $rawSelectedOptions: IObserver<IOptionsList<GOption>>;
//   rawSelectedOptions: IOptionsList<GOption>;
//
//   // if we allow or not many options to be selected
//   multiple$: IObservable<boolean>;
//   readonly $multiple: IObserver<boolean>;
//   multiple: boolean;
//
//   // the list of options represented as a Set (useful to remove dupes)
//   readonly options$: IObservable<IReadonlyOptionsSet<GOption>>;
//
//   // the real list of selected options
//   readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
//
//   isOptionSelected(
//     option: GOption,
//   ): IObservable<boolean>;
//
//   toggleOptionSelect(
//     option: GOption,
//     select?: boolean,
//   ): void;
// }
//
// export interface IIOptionsManagerConstructor {
//   new<GOption>(): IOptionsManager<GOption>;
// }
//
//
// // (new<GOption>(...args: ConstructorParameters<GBaseClass>) => IOptionsManager<GOption> & InstanceType<GBaseClass>)
// export function optionsManagerFactory<GBaseClass extends (abstract new(...args: any[]) => any)>(
//   baseClass: GBaseClass,
// ) {
//   type GOption = any;
//
//   abstract class Mixed extends baseClass {
//     rawOptions$!: IObservable<IOptionsList<GOption>>;
//     readonly $rawOptions!: IObserver<IOptionsList<GOption>>;
//     rawOptions!: IOptionsList<GOption>;
//
//     rawSelectedOptions$!: IObservable<IOptionsList<GOption>>;
//     readonly $rawSelectedOptions!: IObserver<IOptionsList<GOption>>;
//     rawSelectedOptions!: IOptionsList<GOption>;
//
//     multiple$!: IObservable<boolean>;
//     readonly $multiple!: IObserver<boolean>;
//     multiple!: boolean;
//
//     readonly options$: IObservable<IReadonlyOptionsSet<GOption>>;
//     readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
//
//     constructor(...args: any[]) {
//       super(...args);
//
//       const rawOptions$ = defineSimpleObservableProperty<IOptionsList<GOption>>(this, 'rawOptions', []);
//       const rawSelectedOptions$ = defineSimpleObservableProperty<IOptionsList<GOption>>(this, 'rawSelectedOptions', []);
//       const multiple$ = defineSimpleObservableProperty<boolean>(this, 'multiple', false);
//
//       const options$ = shareRL$$(map$$(rawOptions$, (options: IOptionsList<GOption>): IReadonlyOptionsSet<GOption> => {
//         return isSet<GOption>(options)
//           ? options
//           : new Set<GOption>(options);
//       }));
//       this.options$ = options$;
//
//       const selectedOptions$ = shareRL$$(function$$(
//         [rawSelectedOptions$, options$, multiple$],
//         (
//           rawSelectedOptions: IOptionsList<GOption>,
//           options: IReadonlyOptionsSet<GOption>,
//           multiple: boolean,
//         ): IReadonlyOptionsSet<GOption> => {
//           const selectedOptions = new Set<GOption>();
//           const iterator: Iterator<GOption> = rawSelectedOptions[Symbol.iterator]();
//           let result: IteratorResult<GOption>;
//           while (!(result = iterator.next()).done) {
//             const option: GOption = result.value;
//             if (options.has(option)) {
//               selectedOptions.add(option);
//               if (!multiple) {
//                 break;
//               }
//             }
//           }
//           return selectedOptions;
//         },
//       ));
//
//       this.selectedOptions$ = selectedOptions$;
//     }
//
//     isOptionSelected(
//       option: GOption,
//     ): IObservable<boolean> {
//       return isOptionSelected<GOption>({
//         selectedOptions$: this.selectedOptions$,
//         option,
//       });
//     }
//
//     toggleOptionSelect(
//       option: GOption,
//       select?: boolean,
//     ): void {
//       toggleOptionSelectWithResolvers({
//         selectedOptions$: this.selectedOptions$,
//         $rawSelectedOptions: this.$rawSelectedOptions,
//         multiple$: this.multiple$,
//         option,
//         select,
//       });
//     }
//   }
//
//   return Mixed;
// }
//
// export class OptionsManager<GOption> {
//   rawOptions$!: IObservable<IOptionsList<GOption>>;
//   readonly $rawOptions!: IObserver<IOptionsList<GOption>>;
//   rawOptions!: IOptionsList<GOption>;
//
//   rawSelectedOptions$!: IObservable<IOptionsList<GOption>>;
//   readonly $rawSelectedOptions!: IObserver<IOptionsList<GOption>>;
//   rawSelectedOptions!: IOptionsList<GOption>;
//
//   multiple$!: IObservable<boolean>;
//   readonly $multiple!: IObserver<boolean>;
//   multiple!: boolean;
//
//   readonly options$: IObservable<IReadonlyOptionsSet<GOption>>;
//   readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
//
//   constructor() {
//     const rawOptions$ = defineSimpleObservableProperty<IOptionsList<GOption>>(this, 'rawOptions', []);
//     const rawSelectedOptions$ = defineSimpleObservableProperty<IOptionsList<GOption>>(this, 'rawSelectedOptions', []);
//     const multiple$ = defineSimpleObservableProperty<boolean>(this, 'multiple', false);
//
//     const options$ = shareRL$$(map$$(rawOptions$, (options: IOptionsList<GOption>): IReadonlyOptionsSet<GOption> => {
//       return isSet<GOption>(options)
//         ? options
//         : new Set<GOption>(options);
//     }));
//     this.options$ = options$;
//
//     const selectedOptions$ = shareRL$$(function$$(
//       [rawSelectedOptions$, options$, multiple$],
//       (
//         rawSelectedOptions: IOptionsList<GOption>,
//         options: IReadonlyOptionsSet<GOption>,
//         multiple: boolean,
//       ): IReadonlyOptionsSet<GOption> => {
//         const selectedOptions = new Set<GOption>();
//         const iterator: Iterator<GOption> = rawSelectedOptions[Symbol.iterator]();
//         let result: IteratorResult<GOption>;
//         while (!(result = iterator.next()).done) {
//           const option: GOption = result.value;
//           if (options.has(option)) {
//             selectedOptions.add(option);
//             if (!multiple) {
//               break;
//             }
//           }
//         }
//         return selectedOptions;
//       },
//     ));
//
//     this.selectedOptions$ = selectedOptions$;
//   }
//
//   isOptionSelected(
//     option: GOption,
//   ): IObservable<boolean> {
//     return isOptionSelected<GOption>({
//       selectedOptions$: this.selectedOptions$,
//       option,
//     });
//   }
//
//   toggleOptionSelect(
//     option: GOption,
//     select?: boolean,
//   ): void {
//     toggleOptionSelectWithResolvers({
//       selectedOptions$: this.selectedOptions$,
//       $rawSelectedOptions: this.$rawSelectedOptions,
//       multiple$: this.multiple$,
//       option,
//       select,
//     });
//   }
// }
//
