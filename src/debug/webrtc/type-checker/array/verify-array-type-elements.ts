import { IAnyTypeUnion } from '../any/any-type-union.type';
import { verifyType } from '../any/verify-any-type';
import { IMemory } from '../shared/create-memory';

export function verifyArrayTypeElements(
  value: unknown[],
  variableName: string,
  type: IAnyTypeUnion,
  memory: IMemory,
): void {
  for (let i = 0, l = value.length; i < l; i++) {
    verifyType(value[i], `${ variableName }[${ i }]`, type, memory);
  }
}
