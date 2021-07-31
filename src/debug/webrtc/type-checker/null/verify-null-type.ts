import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyNullType(
  value: unknown,
  variableName: string,
): void {
  if (value !== null) {
    throwExpectedTypeError(variableName, 'null');
  }
}
