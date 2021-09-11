import { ICustomErrorOptions } from '@lifaon/rx-js-light';

export interface IAPIError extends Error {
  code: string;
}

export interface IAPIErrorOptions extends ICustomErrorOptions {
  code: string;
}
