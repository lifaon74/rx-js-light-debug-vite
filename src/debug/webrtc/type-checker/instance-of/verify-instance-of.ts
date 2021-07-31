import { IInstanceOfType } from './instance-of.type';
import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyInstanceOfType(
  value: unknown,
  variableName: string,
  type: IInstanceOfType,
): void {
  if (!(value instanceof type.constructor)) {
    throwExpectedTypeError(variableName, `instance of ${ type.constructor.name }`);
  }
}
