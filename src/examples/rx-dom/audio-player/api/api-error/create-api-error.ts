import { IAPIError, IAPIErrorOptions } from './api-error.type';

export function createAPIError(
  options: IAPIErrorOptions,
): IAPIError {
  const error: IAPIError = new Error(options.message ?? 'API Error') as IAPIError;
  error.name = 'APIError';
  error.code = options.code;
  return error;
}
