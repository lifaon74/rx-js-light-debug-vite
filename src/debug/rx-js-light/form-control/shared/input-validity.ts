import { IObservable } from '@lirx/core';

// interface ValidityState {
//   readonly badInput: boolean;
//   readonly customError: boolean;
//   readonly patternMismatch: boolean;
//   readonly rangeOverflow: boolean;
//   readonly rangeUnderflow: boolean;
//   readonly stepMismatch: boolean;
//   readonly tooLong: boolean;
//   readonly tooShort: boolean;
//   readonly typeMismatch: boolean;
//   readonly valid: boolean;
//   readonly valueMissing: boolean;
// }


export interface IInputValidityOptions {

}

export abstract class InputValidity {
  abstract readonly valid$: IObservable<boolean>;
}
