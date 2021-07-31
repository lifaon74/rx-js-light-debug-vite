import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyUndefinedType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'undefined') {
    throwExpectedTypeError(variableName, 'undefined');
  }
}
