import { IAPIError } from './api-error.type';

export function isAPIError(value: any): value is IAPIError {
  return value.name === 'APIError';
}
