import { throwTypeError } from './throw-type-error';

export function throwExpectedTypeError(
  variableName: string,
  type: string,
): never {
  throwTypeError(variableName, `expected ${ type }`);
}
