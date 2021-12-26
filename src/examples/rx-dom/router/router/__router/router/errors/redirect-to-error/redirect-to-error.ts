import { createCustomError, ICustomError, ICustomErrorOptions, isCustomError } from '@lifaon/rx-js-light';

export const REDIRECT_ERROR_NAME = 'RedirectToError';

export interface IRedirectToErrorProperties {
  readonly url: string;
}

export interface IRedirectToError extends ICustomError<'RedirectToError'>, IRedirectToErrorProperties {
}


export interface IRedirectToErrorOptions extends ICustomErrorOptions, IRedirectToErrorProperties {
}

export function createRedirectToError(
  options: IRedirectToErrorOptions,
): IRedirectToError {
  return Object.assign(createCustomError(REDIRECT_ERROR_NAME, { message: `Redirect to: ${ options.url.toString() }`, ...options }), options);
}

export function isRedirectToError(
  value: unknown,
): value is IRedirectToError {
  return isCustomError(value, REDIRECT_ERROR_NAME);
}
