import { createCustomError, ICustomError, ICustomErrorOptions, isCustomError } from '@lifaon/rx-js-light';

export const NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME = 'NotAValidPathForThisRouteError';


export interface INotAValidPathForThisRouteError extends ICustomError<'NotAValidPathForThisRouteError'> {
}


export interface INotAValidPathForThisRouteErrorOptions extends ICustomErrorOptions {
}

export function createNotAValidPathForThisRouteError(
  options?: INotAValidPathForThisRouteErrorOptions,
): INotAValidPathForThisRouteError {
  return createCustomError(NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME, { message: 'Not a valid path for this route', ...options });
}

export function isNotAValidPathForThisRouteError(
  value: unknown,
): value is INotAValidPathForThisRouteError {
  return isCustomError(value, NOT_A_VALID_PATH_FOR_THIS_ROUTE_ERROR_NAME);
}
