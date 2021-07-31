import { IStaticType } from './static-type.type';
import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';

export function verifyStaticType(
  value: unknown,
  variableName: string,
  type: IStaticType,
): void {
  if (value !== type.value) {
    throwExpectedTypeError(variableName, `${ type.value } (static)`);
  }
}
