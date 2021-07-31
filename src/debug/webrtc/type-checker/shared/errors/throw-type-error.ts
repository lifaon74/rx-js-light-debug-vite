import { createTypeError } from './create-type-error';

export function throwTypeError(
  variableName: string,
  message: string,
): never {
  throw createTypeError(variableName, message);
}
