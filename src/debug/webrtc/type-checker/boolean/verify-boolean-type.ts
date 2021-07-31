import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyBooleanType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'boolean') {
    throwExpectedTypeError(variableName, 'boolean');
  }
}
