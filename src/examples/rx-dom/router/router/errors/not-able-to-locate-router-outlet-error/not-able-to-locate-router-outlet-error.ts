import { createCustomError, ICustomError, ICustomErrorOptions, isCustomError } from '@lifaon/rx-js-light';

export const NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME = 'NotAbleToLocateRouterOutletError';


export interface INotAbleToLocateRouterOutletError extends ICustomError<'NotAbleToLocateRouterOutletError'> {
}


export interface INotAbleToLocateRouterOutletErrorOptions extends ICustomErrorOptions {
}

export function createNotAbleToLocateRouterOutletError(
  options: INotAbleToLocateRouterOutletErrorOptions,
): INotAbleToLocateRouterOutletError {
  return createCustomError(NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME, options);
}

export function isNotAbleToLocateRouterOutletError(
  value: unknown,
): value is INotAbleToLocateRouterOutletError {
  return isCustomError(value, NOT_ABLE_TO_LOCATE_ROUTER_OUTLET_ERROR_NAME);
}
