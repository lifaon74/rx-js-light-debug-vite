import { IArrayType } from './array-type.type';
import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';
import { verifyArrayTypeElements } from './verify-array-type-elements';
import { IMemory } from '../shared/create-memory';

export function verifyArrayType(
  value: unknown,
  variableName: string,
  type: IArrayType,
  memory: IMemory,
): void {
  if (!Array.isArray(value)) {
    throwExpectedTypeError(variableName, 'array');
  } else {
    verifyArrayTypeElements(value, variableName, type.type, memory);
  }
}
