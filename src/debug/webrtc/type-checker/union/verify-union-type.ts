import { IUnionType } from './union-type.type';
import { IAnyTypeUnion } from '../any/any-type-union.type';
import { throwExpectedTypeError } from '../shared/errors/throw-expected-type-error';
import { verifyType } from '../any/verify-any-type';
import { IMemory } from '../shared/create-memory';

export function verifyUnionType(
  value: unknown,
  variableName: string,
  type: IUnionType,
  memory: IMemory,
): void {
  const iterator: Iterator<IAnyTypeUnion> = type.types[Symbol.iterator]();
  let result: IteratorResult<IAnyTypeUnion>;
  while (!(result = iterator.next()).done) {
    try {
      verifyType(value, variableName, result.value, memory);
      return;
    } catch {}
  }

  throwExpectedTypeError(
    variableName,
    Array.from(type.types, (type: IAnyTypeUnion) => type.name)
      .join(' | '),
  );
}
