import { IType } from '../shared/type.type';
import { ISymbolType } from './symbol-type.type';

export function isSymbolType(
  value: IType,
): value is ISymbolType {
  return (value.name === 'symbol');
}
