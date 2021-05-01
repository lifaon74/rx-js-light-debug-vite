import { IErrorOptions } from '@lifaon/rx-js-light';

export interface IAPIError extends Error {
  code: string;
}

export interface IAPIErrorOptions extends IErrorOptions {
  code: string;
}
