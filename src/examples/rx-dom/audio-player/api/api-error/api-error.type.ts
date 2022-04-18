import { ICustomErrorOptions } from '@lirx/core';

export interface IAPIError extends Error {
  code: string;
}

export interface IAPIErrorOptions extends ICustomErrorOptions {
  code: string;
}
