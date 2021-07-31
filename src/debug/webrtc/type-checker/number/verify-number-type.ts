import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyNumberType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'number') {
    throwExpectedTypeError(variableName, 'number');
  }
}
