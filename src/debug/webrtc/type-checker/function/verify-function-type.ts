import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyFunctionType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'function') {
    throwExpectedTypeError(variableName, 'function');
  }
}
