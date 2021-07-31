import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyStringType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'string') {
    throwExpectedTypeError(variableName, 'string');
  }
}
