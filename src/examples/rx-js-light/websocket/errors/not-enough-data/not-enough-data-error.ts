import { createCustomError, ICustomError, ICustomErrorOptions, isCustomError } from '@lirx/core';


// export function throwNotEnoughDataError(): never {
//   throw createNotEnoughDataError();
// }


export const NOT_ENOUGH_DATA_ERROR_NAME = 'not-enough-data';

export type INotEnoughDataError = ICustomError<'not-enough-data'>;

export function createNotEnoughDataError(
  options?: ICustomErrorOptions,
): INotEnoughDataError {
  return createCustomError<'not-enough-data'>(NOT_ENOUGH_DATA_ERROR_NAME, options);
}

export function isNotEnoughDataError(
  value: unknown,
): value is INotEnoughDataError {
  return isCustomError<'not-enough-data'>(value, NOT_ENOUGH_DATA_ERROR_NAME);
}

