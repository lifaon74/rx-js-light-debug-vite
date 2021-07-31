import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifySymbolType(
  value: unknown,
  variableName: string,
): void {
  if (typeof value !== 'symbol') {
    throwExpectedTypeError(variableName, 'symbol');
  }
}
